(function(){
'use strict';
function apply(){
  document.querySelectorAll('.tyreExactPage').forEach(function(page){
    var hero=page.querySelector('.tyreByCarHero');
    var inner=page.querySelector('.tyreByCarHeroInner');
    var source=page.querySelector('.tyreByCarHeroCopy');
    if(!hero||!inner||!source)return;

    var eyebrow=source.querySelector('.tyreByCarEyebrow');
    var heading=source.querySelector('h1');
    var sub=source.querySelector('.tyreByCarHeroSub');
    if(!eyebrow||!heading)return;

    var imageCopy=inner.querySelector('.tyreByCarImageCopy');
    if(!imageCopy){
      imageCopy=document.createElement('div');
      imageCopy.className='tyreByCarImageCopy';
      imageCopy.innerHTML=eyebrow.outerHTML+heading.outerHTML;
      inner.appendChild(imageCopy);
    }

    if(sub){
      var description=page.querySelector('.tyreByCarDescription');
      if(!description){
        description=document.createElement('div');
        description.className='tyreByCarDescription';
        description.textContent=sub.textContent.trim();
        var finder=page.querySelector('.tyreByCarFinderWrap');
        if(finder)finder.insertAdjacentElement('afterend',description);
      }
    }

    source.style.setProperty('display','none','important');
  });

  var css=''+
  '.tyreByCarImageCopy{position:absolute!important;z-index:3!important;top:34px!important;left:50%!important;transform:translateX(-50%)!important;width:min(760px,92%)!important;max-width:760px!important;padding:0 24px!important;box-sizing:border-box!important;text-align:center!important;background:transparent!important}'+
  '.tyreByCarImageCopy .tyreByCarEyebrow{margin:0 0 14px!important;color:#ff2b2f!important;font-size:20px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:.8px!important;text-transform:uppercase!important;text-shadow:0 2px 8px rgba(0,0,0,.35)!important}'+
  '.tyreByCarImageCopy h1{margin:0!important;color:#fff!important;font-size:52px!important;font-weight:800!important;line-height:1.08!important;letter-spacing:-2px!important;text-shadow:0 2px 8px rgba(0,0,0,.35)!important}'+
  '.tyreByCarDescription{max-width:760px!important;margin:0 auto!important;padding:42px 24px 34px!important;box-sizing:border-box!important;text-align:center!important;background:#fff!important;color:#33445d!important;font-size:20px!important;line-height:1.5!important}'+
  '@media(max-width:800px){.tyreByCarImageCopy{top:24px!important;width:92%!important;padding:0 12px!important}.tyreByCarImageCopy .tyreByCarEyebrow{font-size:17px!important}.tyreByCarImageCopy h1{font-size:40px!important;letter-spacing:-1.2px!important}.tyreByCarDescription{padding:32px 20px 24px!important;font-size:17px!important}}';

  var style=document.getElementById('tyre-hero-copy-override');
  if(!style){style=document.createElement('style');style.id='tyre-hero-copy-override';document.head.appendChild(style)}
  style.textContent=css;
}
function run(){requestAnimationFrame(function(){apply();setTimeout(apply,100);setTimeout(apply,400)})}
run();
window.addEventListener('load',run);
window.addEventListener('hashchange',function(){setTimeout(run,0)});
new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
})();