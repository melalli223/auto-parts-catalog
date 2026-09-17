(function(){
'use strict';
function isNumberRoute(){const p=location.hash.replace(/^#/,'').split('/');return p[0]==='tyres'&&p[1]==='by-number'}
function renderNumber(){if(!isNumberRoute()||typeof window.tyresByNumber!=='function')return false;window.tyresByNumber();return true}
function waitForNumber(){if(!isNumberRoute())return;if(renderNumber())return;setTimeout(waitForNumber,100)}
window.addEventListener('hashchange',function(){if(isNumberRoute())setTimeout(waitForNumber,0)});
window.addEventListener('load',function(){setTimeout(waitForNumber,200)});
setTimeout(waitForNumber,200);
})();
