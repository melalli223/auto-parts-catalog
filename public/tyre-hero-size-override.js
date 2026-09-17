(function(){
  'use strict';
  function apply(){
    if(!document.getElementById('tyre-hero-size-override')){
      var s=document.createElement('style');s.id='tyre-hero-size-override';
      s.textContent='.tyreByCarHero{height:500px!important}.tyreByCarHome{top:50px!important}.tyreByCarHeroCopy{margin-top:125px!important}@media(max-width:800px){.tyreByCarHero{height:430px!important}.tyreByCarHome{top:42px!important}.tyreByCarHeroCopy{margin-top:105px!important}}';
      document.head.appendChild(s);
    }
  }
  apply();
  window.addEventListener('load',apply);
  window.addEventListener('hashchange',function(){setTimeout(apply,0)});
})();