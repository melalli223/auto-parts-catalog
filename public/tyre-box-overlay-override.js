(function(){
'use strict';
function apply(){
  document.querySelectorAll('.tyreByCarExactPanel').forEach(function(panel){
    var hero=panel.closest('.tyreExactPage')&&panel.closest('.tyreExactPage').querySelector('.tyreByCarHero');
    if(!hero)return;
    var h=panel.getBoundingClientRect().height;
    panel.style.setProperty('margin-top',(-h/2)+'px','important');
    panel.style.setProperty('transform','none','important');
  });
}
function run(){
  requestAnimationFrame(function(){apply();setTimeout(apply,100);setTimeout(apply,400);});
}
window.addEventListener('load',run);
window.addEventListener('hashchange',function(){setTimeout(run,0);});
new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
setTimeout(run,300);
})();