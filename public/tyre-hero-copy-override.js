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
      inner.appendChild(imageCopy);
    }

    /* Rebuild the hero copy on every pass so no stale/duplicate version can remain. */
    imageCopy.innerHTML='';
    imageCopy.appendChild(eyebrow.cloneNode(true));
    imageCopy.appendChild(heading.cloneNode(true));
    if(sub)imageCopy.appendChild(sub.cloneNode(true));

    var home=inner.querySelector('.tyreByCarBackHome');
    if(!home){
      home=document.createElement('button');
      home.type='button';
      home.className='tyreByCarBackHome';
      home.innerHTML='<span>←</span> Back to home';
      inner.insertBefore(home,inner.firstChild);
    }
    home.onclick=function(){
      location.hash='#tyres';
      if(typeof routeTyresHash==='function')routeTyresHash();
      window.scrollTo({top:0,behavior:'instant'});
    };

    source.style.setProperty('display','none','important');
  });

  var style=document.getElementById('tyre-hero-copy-override');
  if(!style){
    style=document.createElement('style');
    style.id='tyre-hero-copy-override';
    document.head.appendChild(style);
  }
  style.textContent=`
html,body{background:#fff!important}
.tyreExactPage{background:#fff!important;padding:0 0 120px!important;min-height:100vh!important;font-family:Inter,Arial,sans-serif!important}

.tyreByCarHero{
  height:543px!important;
  position:relative!important;
  overflow:hidden!important;
  background-position:center!important;
  background-size:cover!important;
}
.tyreByCarHero:after{
  background:linear-gradient(90deg,rgba(3,22,43,.58),rgba(3,22,43,.20) 55%,rgba(3,22,43,.08))!important;
}
.tyreByCarHeroInner{
  position:relative!important;
  z-index:1!important;
  height:100%!important;
  max-width:1460px!important;
  margin:auto!important;
  padding:0 40px!important;
  box-sizing:border-box!important;
}

.tyreByCarImageCopy{
  position:absolute!important;
  z-index:3!important;
  top:34%!important;
  left:5.9%!important;
  right:auto!important;
  transform:translateY(-50%)!important;
  width:min(820px,82%)!important;
  padding:0!important;
  margin:0!important;
  text-align:left!important;
  background:transparent!important;
  background-color:transparent!important;
  box-shadow:none!important;
  border:0!important;
  display:block!important;
}
.tyreByCarImageCopy *{
  background:transparent!important;
  background-color:transparent!important;
  box-shadow:none!important;
  border:0!important;
}
.tyreByCarImageCopy .tyreByCarEyebrow{
  margin:0 0 13px!important;
  color:#ff2b2f!important;
  font-size:20px!important;
  font-weight:800!important;
  line-height:1.15!important;
  letter-spacing:.8px!important;
  text-transform:uppercase!important;
  text-shadow:0 2px 8px rgba(0,0,0,.35)!important;
}
.tyreByCarImageCopy h1{
  margin:0!important;
  color:#fff!important;
  font-size:64px!important;
  font-weight:800!important;
  line-height:1.08!important;
  letter-spacing:-2px!important;
  text-shadow:0 2px 8px rgba(0,0,0,.35)!important;
}
.tyreByCarImageCopy .tyreByCarHeroSub{
  display:block!important;
  margin:20px 0 0!important;
  max-width:720px!important;
  color:rgba(255,255,255,.94)!important;
  font-size:21px!important;
  font-weight:500!important;
  line-height:1.55!important;
  text-align:left!important;
  text-shadow:0 2px 7px rgba(0,0,0,.35)!important;
}

.tyreByCarFinderWrap{
  width:100%!important;
  padding:0 30px!important;
  box-sizing:border-box!important;
  background:#fff!important;
}
.tyreByCarExactPanel{position:relative!important;z-index:5!important}
.tyreByCarDescription{display:none!important}

.tyreByCarBackHome{
  position:absolute!important;
  z-index:6!important;
  top:22px!important;
  left:50%!important;
  transform:translateX(-50%)!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  width:max-content!important;
  margin:0!important;
  padding:0 18px!important;
  height:40px!important;
  border:0!important;
  background:transparent!important;
  color:#fff!important;
  font:800 14px/40px Inter,Arial,sans-serif!important;
  cursor:pointer!important;
  box-shadow:none!important;
  text-shadow:0 1px 5px rgba(0,0,0,.45)!important;
}
.tyreByCarBackHome span{
  font-size:20px!important;
  line-height:1!important;
  margin-right:7px!important;
}
.tyreByCarBackHome:hover{background:transparent!important;color:#fff!important}
.tyreByCarBottomSpace{height:20px!important}

@media(max-width:800px){
  .tyreByCarHero{height:430px!important}
  .tyreByCarHeroInner{padding:0 18px!important}
  .tyreByCarImageCopy{
    top:36%!important;
    left:6%!important;
    right:6%!important;
    transform:translateY(-50%)!important;
    width:auto!important;
    text-align:left!important;
  }
  .tyreByCarImageCopy .tyreByCarEyebrow{
    font-size:15px!important;
    margin-bottom:10px!important;
  }
  .tyreByCarImageCopy h1{
    font-size:39px!important;
    letter-spacing:-1px!important;
  }
  .tyreByCarImageCopy .tyreByCarHeroSub{
    margin-top:15px!important;
    max-width:100%!important;
    font-size:16px!important;
    line-height:1.5!important;
  }
  .tyreByCarFinderWrap{padding:0 16px!important}
  .tyreByCarBackHome{top:18px!important;font-size:13px!important}
  .tyreByCarBackHome span{font-size:18px!important}
}
`;
}

function run(){
  requestAnimationFrame(function(){
    apply();
    setTimeout(apply,50);
    setTimeout(apply,150);
    setTimeout(apply,400);
    setTimeout(apply,900);
  });
}
run();
window.addEventListener('load',run);
window.addEventListener('hashchange',function(){setTimeout(run,0)});
})();