(function(){
'use strict';
function apply(){
  var panel=document.querySelector('.tyreByCarExactPanel');
  if(!panel)return;
  panel.style.setProperty('margin-top',-(panel.offsetHeight/2)+'px','important');
}
function schedule(){
  requestAnimationFrame(function(){apply();setTimeout(apply,80);setTimeout(apply,300);});
}
function watch(){
  schedule();
  if(window.ResizeObserver){
    var ro=new ResizeObserver(schedule);
    document.querySelectorAll('.tyreByCarExactPanel').forEach(function(el){ro.observe(el);});
  }
}
watch();
window.addEventListener('load',schedule);
window.addEventListener('hashchange',function(){setTimeout(watch,0);});
setTimeout(watch,500);
setTimeout(watch,1200);
})();
