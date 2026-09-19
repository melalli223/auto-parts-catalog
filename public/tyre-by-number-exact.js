(function(){'use strict';
const styleId='tyre-by-number-exact-style';
function addStyle(){if(document.getElementById(styleId))return;const s=document.createElement('style');s.id=styleId;s.textContent='.tyreNumberExactPage{min-height:100vh!important;margin:0!important;padding:0!important;background:#fff!important}.tyreByNumberHero{width:100%;height:430px;position:relative;overflow:hidden;background:#14283f url("/assets/tyre-ref/hero.png") center/cover no-repeat}';document.head.appendChild(s)}
window.tyresByNumber=function(){if(typeof setNav==='function')setNav('');addStyle();document.body.classList.add('tyre-by-number-page');render('<section class="tyreNumberExactPage tyreNumberPage"><section class="tyreByNumberHero" aria-label="Find Tyre by Number"></section></section>')};})();
