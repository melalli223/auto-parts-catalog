(function(){
'use strict';
function isSizeRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-size'}
function renderSize(){if(!isSizeRoute()||typeof window.tyresBySize!=='function')return false;window.tyresBySize();return true}
function waitForSize(){if(!isSizeRoute())return;if(renderSize())return;setTimeout(waitForSize,100)}
window.addEventListener('hashchange',function(){if(isSizeRoute())waitForSize()});
window.addEventListener('load',function(){setTimeout(waitForSize,100)});
setTimeout(waitForSize,0);
})();
