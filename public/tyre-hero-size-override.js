(function(){
  'use strict';
  function apply(){
    if(!document.getElementById('tyre-hero-size-override')){
      var s=document.createElement('style');s.id='tyre-hero-size-override';
      s.textContent='.tyreByCarHero{height:500px!important}.tyreByCarHome{top:50px!important}.tyreByCarHeroCopy{margin-top:0!important;position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:min(92%,760px)!important}.tyreByCarBox{transform:translateY(-80px)!important}@media(max-width:800px){.tyreByCarHero{height:430px!important}.tyreByCarHome{top:42px!important}.tyreByCarHeroCopy{top:50%!important;margin-top:0!important;width:92%!important}.tyreByCarBox{transform:translateY(-55px)!important}}';
      document.head.appendChild(s);
    }
  }
  apply();
  window.addEventListener('load',apply);
  window.addEventListener('hashchange',function(){setTimeout(apply,0)});
})();