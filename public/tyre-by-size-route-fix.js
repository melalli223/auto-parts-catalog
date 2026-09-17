(function(){'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function patchTyreHome(){
  const cards=document.querySelectorAll('.tyreFinderCard');
  if(cards.length<2)return false;
  const card=cards[1];
  card.setAttribute('onclick','tyresBySize()');
  const strong=card.querySelector('strong');
  const small=card.querySelector('small');
  if(strong)strong.textContent='FIND TYRE BY SIZE';
  if(small)small.textContent='Choose your tyre width, profile and rim size.';
  return true;
}
function install(){
  if(typeof window.tyresBySize!=='function')return false;
  if(window.__sizeRouteInstalled)return true;
  const originalTyres=window.tyres;
  if(typeof originalTyres==='function'){
    window.tyres=function(){
      if(isSizeRoute()){window.tyresBySize();return true}
      const result=originalTyres.apply(this,arguments);
      [0,50,200,500,1000].forEach(ms=>setTimeout(patchTyreHome,ms));
      return result;
    };
  }
  window.__sizeRouteInstalled=true;
  return true;
}
function force(){
  patchTyreHome();
  if(isSizeRoute()&&install())window.tyresBySize();
}
window.addEventListener('hashchange',function(){setTimeout(force,0);setTimeout(force,50);setTimeout(force,250)});
window.addEventListener('popstate',function(){setTimeout(force,0);setTimeout(force,100)});
let n=0;const timer=setInterval(function(){force();if(++n>100)clearInterval(timer)},100);
[0,50,150,300,600,1000,1500,2500,4000,6000].forEach(ms=>setTimeout(force,ms));
})();