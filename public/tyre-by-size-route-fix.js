(function(){'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function goSize(){if(!isSizeRoute()||typeof window.tyresBySize!=='function')return false;window.tyresBySize();return true}
function patchTyreHome(){
 const cards=[...document.querySelectorAll('.tyreFinderCard')];
 const card=cards.find(c=>/FIND TYRE BY NUMBER|FIND TYRE BY SIZE/i.test(c.textContent||''));
 if(!card)return false;
 card.onclick=function(e){if(e)e.preventDefault();location.hash='tyres/by-size';return false};
 const strong=card.querySelector('strong'),small=card.querySelector('small');
 if(strong)strong.textContent='FIND TYRE BY SIZE';
 if(small)small.textContent='Choose your tyre size.';
 return true;
}
function force(){patchTyreHome();if(isSizeRoute())goSize()}
window.addEventListener('hashchange',function(){setTimeout(force,0)});
window.addEventListener('load',function(){[0,100,300,700,1500,3000].forEach(ms=>setTimeout(force,ms))});
const observer=new MutationObserver(function(){patchTyreHome();if(isSizeRoute())setTimeout(force,0)});
observer.observe(document.documentElement,{childList:true,subtree:true});
[0,100,300,700,1500,3000,5000].forEach(ms=>setTimeout(force,ms));
})();