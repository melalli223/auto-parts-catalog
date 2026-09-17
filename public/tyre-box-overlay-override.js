(function(){
'use strict';
function apply(){
 if(document.getElementById('tyre-box-overlay-override'))return;
 var s=document.createElement('style');s.id='tyre-box-overlay-override';
 s.textContent='.tyreByCarFinderWrap{position:relative;z-index:3}.tyreByCarExactPanel{margin-top:-150px!important}.tyreByCarExactPanel.is-expanded{margin-top:-150px!important}@media(max-width:800px){.tyreByCarExactPanel{margin-top:-125px!important}.tyreByCarExactPanel.is-expanded{margin-top:-125px!important}}';
 document.head.appendChild(s);
}
apply();window.addEventListener('load',apply);window.addEventListener('hashchange',function(){setTimeout(apply,0)});
})();
