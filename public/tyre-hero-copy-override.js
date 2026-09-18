(function(){
'use strict';
function apply(){
 document.querySelectorAll('.tyreExactPage').forEach(function(page){
  var hero=page.querySelector('.tyreByCarHero'),inner=page.querySelector('.tyreByCarHeroInner'),source=page.querySelector('.tyreByCarHeroCopy');
  if(!hero||!inner||!source)return;
  var eyebrow=source.querySelector('.tyreByCarEyebrow'),heading=source.querySelector('h1'),sub=source.querySelector('.tyreByCarHeroSub');
  if(!eyebrow||!heading)return;
  var imageCopy=inner.querySelector('.tyreByCarImageCopy');
  if(!imageCopy){imageCopy=document.createElement('div');imageCopy.className='tyreByCarImageCopy';imageCopy.innerHTML=eyebrow.outerHTML+heading.outerHTML+(sub?sub.outerHTML:'');inner.appendChild(imageCopy)}if(page.classList.contains('tyreNumberPage')&&imageCopy){var numberSub=imageCopy.querySelector('.tyreByCarHeroSub');if(numberSub)numberSub.remove()}
  if(sub){var description=page.querySelector('.tyreByCarDescription');if(!description){description=document.createElement('div');description.className='tyreByCarDescription';description.textContent=sub.textContent.trim();var finder=page.querySelector('.tyreByCarFinderWrap');if(finder)finder.insertAdjacentElement('afterend',description)}}
  var home=page.querySelector('.tyreByCarBackHome');if(!home){home=document.createElement('button');home.type='button';home.className='tyreByCarBackHome';home.innerHTML='<span>←</span> Back to home';home.addEventListener('click',function(){location.hash='#tyres';if(typeof routeTyresHash==='function')routeTyresHash();window.scrollTo({top:0,behavior:'smooth'})});var bottom=page.querySelector('.tyreByCarBottomSpace');if(bottom)bottom.insertAdjacentElement('beforebegin',home);else page.appendChild(home)}else{home.onclick=function(){location.hash='#tyres';if(typeof routeTyresHash==='function')routeTyresHash();window.scrollTo({top:0,behavior:'smooth'})}}
  source.style.setProperty('display','none','important');
 });
 var css=`
html,body{background:#fff!important}
.tyreExactPage{background:#fff!important;padding:0 0 120px!important;min-height:100vh!important;font-family:Inter,Arial,sans-serif!important}
.tyreByCarHero{height:500px!important;position:relative!important;overflow:hidden!important;background-position:center!important;background-size:cover!important}
.tyreByCarHero:after{background:linear-gradient(90deg,rgba(3,22,43,.58),rgba(3,22,43,.20) 55%,rgba(3,22,43,.08))!important}
.tyreByCarHeroInner{max-width:1460px!important;margin:auto!important;padding:0 40px!important;box-sizing:border-box!important;height:100%!important}
.tyreByCarImageCopy{position:absolute!important;z-index:3!important;top:82px!important;left:50%!important;transform:translateX(-50%)!important;width:min(850px,92%)!important;padding:0!important;text-align:center!important;background:transparent!important}
.tyreByCarImageCopy .tyreByCarEyebrow{margin:0 0 12px!important;color:#ff2b2f!important;font-size:18px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:.8px!important;text-transform:uppercase!important;text-shadow:0 2px 8px rgba(0,0,0,.35)!important}
.tyreNumberPage .tyreByCarImageCopy .tyreByCarEyebrow{color:#e21b23!important}.tyreNumberPage .tyreByCarImageCopy h1{color:#fff!important;text-align:left!important}.tyreNumberPage .tyreByCarImageCopy h1{margin:0!important;color:#fff!important;font-size:32px!important;letter-spacing:-.8px!important;}font-size:52px!important;font-weight:800!important;line-height:1.08!important;letter-spacing:-1.8px!important;text-shadow:0 2px 8px rgba(0,0,0,.35)!important}
.tyreByCarImageCopy .tyreByCarHeroSub{display:none!important}
.tyreByCarFinderWrap{width:100%!important;padding:0 30px!important;box-sizing:border-box!important;background:#fff!important}
.tyreByCarExactPanel{width:min(760px,calc(100% - 20px))!important;margin:-260px auto 0!important;position:relative!important;z-index:5!important;padding:30px 38px 32px!important;box-sizing:border-box!important;background:#061e4e!important;color:#fff!important;border:0!important;border-radius:18px!important;box-shadow:0 16px 35px rgba(3,25,65,.20)!important;transform:none!important}
.tyreByCarExactPanel h2{margin:0 0 7px!important;color:#fff!important;font-size:28px!important;font-weight:800!important;line-height:1.2!important;text-align:left!important}
.tyreByCarExactPanel .required{margin:0!important;color:rgba(255,255,255,.82)!important;font-size:15px!important;text-align:left!important}
.tyreByCarExactFields{display:grid!important;grid-template-columns:1fr 1fr!important;gap:18px!important;margin-top:22px!important}
.tyreByCarExactField{margin:0!important}
.tyreByCarExactField+.tyreByCarExactField{margin-top:0!important}
.tyreByCarExactField label{display:block!important;margin:0 0 8px!important;color:#fff!important;font-size:13px!important;font-weight:700!important}
.tyreByCarExactField select{width:100%!important;height:50px!important;border:1px solid rgba(255,255,255,.28)!important;border-radius:8px!important;background:#fff!important;color:#13223a!important;padding:0 42px 0 14px!important;box-sizing:border-box!important;background-image:linear-gradient(45deg,transparent 50%,#061e4e 50%),linear-gradient(135deg,#061e4e 50%,transparent 50%)!important;background-position:calc(100% - 20px) 21px,calc(100% - 14px) 21px!important;background-size:6px 6px,6px 6px!important;background-repeat:no-repeat!important}
.tyreByCarExactActions{margin-top:22px!important;padding-top:20px!important;border-top:1px solid rgba(255,255,255,.16)!important;display:flex!important;justify-content:flex-end!important}
.tyreByCarExactActions button{min-width:180px!important;height:50px!important;padding:0 26px!important;border:0!important;border-radius:8px!important;background:#e21b23!important;color:#fff!important;font:800 14px/50px Inter,Arial,sans-serif!important;letter-spacing:.2px!important;text-transform:uppercase!important;cursor:pointer!important}
.tyreByCarExactActions button:after{content:'  →'!important;font-size:20px!important;font-weight:400!important;vertical-align:-1px!important}
.tyreByCarDescription{max-width:760px!important;margin:34px auto 0!important;padding:0 24px!important;color:#33445d!important;font-size:17px!important;line-height:1.65!important;text-align:center!important}
.tyreByCarBackHome{display:flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;margin:34px auto 0 30px!important;padding:0 22px!important;height:46px!important;border:2px solid #e21b23!important;border-radius:8px!important;background:#fff!important;color:#e21b23!important;font:800 14px/42px Inter,Arial,sans-serif!important;cursor:pointer!important;box-shadow:none!important}
.tyreByCarBackHome:hover{background:#fff!important;color:#e21b23!important;border-color:#e21b23!important}
.tyreByCarBottomSpace{height:20px!important}
@media(max-width:800px){
 .tyreByCarHero{height:430px!important}
 .tyreByCarHeroInner{padding:0 18px!important}
 .tyreByCarImageCopy{top:58px!important;width:94%!important}
 .tyreByCarImageCopy .tyreByCarEyebrow{font-size:15px!important}
 .tyreByCarImageCopy h1{font-size:38px!important;letter-spacing:-1px!important}
 .tyreByCarFinderWrap{padding:0 16px!important}
 .tyreByCarExactPanel{width:100%!important;margin:-190px auto 0!important;padding:24px 20px 25px!important;border-radius:15px!important}
 .tyreByCarExactPanel h2{font-size:24px!important}
 .tyreByCarExactFields{grid-template-columns:1fr!important;gap:14px!important;margin-top:18px!important}
 .tyreByCarExactField+.tyreByCarExactField{margin-top:0!important}
 .tyreByCarExactActions{margin-top:18px!important;padding-top:17px!important}
 .tyreByCarExactActions button{width:100%!important}
 .tyreByCarDescription{margin-top:27px!important;font-size:15px!important}
 .tyreByCarBackHome{margin:45px auto 0 16px!important}
}
`;
 var style=document.getElementById('tyre-hero-copy-override');if(!style){style=document.createElement('style');style.id='tyre-hero-copy-override';document.head.appendChild(style)}style.textContent=css;
}
function run(){requestAnimationFrame(function(){apply();setTimeout(apply,100);setTimeout(apply,400)})}
run();window.addEventListener('load',run);window.addEventListener('hashchange',function(){setTimeout(run,0)});new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
})();