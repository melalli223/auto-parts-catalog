(function(){'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function goSize(){if(typeof window.tyresBySize==='function'){window.tyresBySize();return true}return false}
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
  const originalTyres=window.tyres;
  if(typeof originalTyres==='function'){
    window.tyres=function(){
      if(isSizeRoute()){goSize();return true}
      return originalTyres.apply(this,arguments);
    };
  }
  window.__sizeRouteInstalled=true;return true;
}
function force(){
  patchTyreHome();install();
  if(isSizeRoute())goSize();
}
window.addEventListener('hashchange',function(){setTimeout(force,0);setTimeout(force,100);setTimeout(force,350)});
window.addEventListener('popstate',function(){setTimeout(force,0);setTimeout(force,100)});
const observer=new MutationObserver(function(){patchTyreHome()});
observer.observe(document.documentElement,{childList:true,subtree:true});
[0,50,150,300,600,1000,1500,2500,4000,6000].forEach(ms=>setTimeout(force,ms));
})();