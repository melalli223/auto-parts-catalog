(function(){'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function install(){
  if(typeof window.tyresBySize!=='function')return false;
  if(window.__sizeRouteInstalled)return true;
  const originalTyres=window.tyres;
  if(typeof originalTyres==='function'){
    window.tyres=function(){
      if(isSizeRoute()){window.tyresBySize();return true}
      return originalTyres.apply(this,arguments);
    };
  }
  window.__sizeRouteInstalled=true;
  return true;
}
function force(){if(!isSizeRoute())return;if(install())window.tyresBySize()}
window.addEventListener('hashchange',function(){setTimeout(force,0);setTimeout(force,50);setTimeout(force,250)});
window.addEventListener('popstate',function(){setTimeout(force,0);setTimeout(force,100)});
let n=0;const timer=setInterval(function(){if(isSizeRoute())force();if(++n>100)clearInterval(timer)},100);
[0,50,150,300,600,1000,1500,2500,4000,6000].forEach(function(ms){setTimeout(force,ms)});
})();