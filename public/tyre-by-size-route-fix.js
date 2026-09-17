(function(){'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function onSizePage(){return !!document.querySelector('#app .tyreExactPage')}
function goSize(){if(!isSizeRoute()||onSizePage())return false;if(typeof window.tyresBySize==='function'){window.tyresBySize();return true}return false}
function patchTyreHome(){
  const cards=[...document.querySelectorAll('.tyreFinderCard')];
  const card=cards.find(c=>/FIND TYRE BY NUMBER|FIND TYRE BY SIZE/i.test(c.textContent||''))||cards[1];
  if(!card)return false;
  card.onclick=function(e){if(e)e.preventDefault();location.hash='tyres/by-size';return false};
  const strong=card.querySelector('strong');
  const small=card.querySelector('small');
  if(strong)strong.textContent='FIND TYRE BY SIZE';
  if(small)small.textContent='Choose your tyre size.';
  return true;
}
function install(){
  if(window.__sizeRouteInstalled)return true;
  if(typeof window.tyres!=='function')return false;
  const originalTyres=window.tyres;
  window.tyres=function(){
    if(isSizeRoute()){goSize();return true}
    return originalTyres.apply(this,arguments);
  };
  window.__sizeRouteInstalled=true;
  return true;
}
let timer=0;
function force(){
  patchTyreHome();
  install();
  if(isSizeRoute()&&!onSizePage())goSize();
}
function schedule(){clearTimeout(timer);timer=setTimeout(force,30)}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('load',function(){[0,50,150,300,600,1000].forEach(ms=>setTimeout(force,ms))});
const observer=new MutationObserver(function(){patchTyreHome();if(isSizeRoute()&&!onSizePage())schedule()});
observer.observe(document.documentElement,{childList:true,subtree:true});
[0,50,150,300,600,1000,1500,2500,4000,6000,9000,12000].forEach(ms=>setTimeout(force,ms));
})();