(function(){'use strict';
const styleId='tyre-by-car-exact-style';
function addStyle(){
 if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;
 s.textContent='.tyreExactPage{width:100%;min-height:100vh;margin:0;padding:0;background:#fff!important;overflow:hidden}.tyreByCarHero{width:100%;height:360px;position:relative;overflow:hidden;background:#14283f center/cover no-repeat}';
 document.head.appendChild(s);
}
function getHeroImage(){
 try{const d=window.__apCatalogDb||JSON.parse(localStorage.getItem('ap_catalog_v4')||'null')||{};return d?.tyres?.findByCar?.image||'/assets/tyre-ref/hero.png'}
 catch(e){return '/assets/tyre-ref/hero.png'}
}
window.tyresByCar=function(){
 addStyle();document.body.classList.add('tyre-by-car-page');
 const image=getHeroImage().replace(/"/g,'');
 render('<section class="tyreExactPage"><section class="tyreByCarHero" aria-label="Find Tyre by Car"></section></section>');
 const h=document.querySelector('.tyreByCarHero');if(h)h.style.backgroundImage='url("'+image+'")';
};
})();