(function(){
  const styleId='tyre-by-car-exact-style';
  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');s.id=styleId;s.textContent=`
      html,body{background:#fff!important} body.tyre-by-car-page{background:#fff!important}
      .tyreExactPage{min-height:100vh!important;margin:0!important;padding:0 0 180px!important;background:#fff!important;display:block!important;box-sizing:border-box!important;font-family:Inter,Arial,sans-serif}
      .tyreByCarHero{width:100%;height:clamp(300px,34vw,500px);background:#111 url('/assets/tyre-ref/hero.png') center center/cover no-repeat;position:relative;overflow:hidden}
      .tyreByCarHero:after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.38)}
      .tyreByCarHeroInner{position:relative;z-index:1;height:100%;max-width:1200px;margin:0 auto;padding:0 28px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;text-align:center}
      .tyreByCarHome{position:absolute;top:24px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:9px;color:#fff;text-decoration:none;font:600 15px/1 Inter,Arial,sans-serif;white-space:nowrap;cursor:pointer;opacity:.98}
      .tyreByCarHome .arrow{font-size:25px;font-weight:400;line-height:12px;margin-top:-2px}
      .tyreByCarHero h1{margin:18px 0 0;color:#fff;font-family:Montserrat,Inter,Arial,sans-serif;font-size:clamp(34px,4.4vw,62px);font-weight:800;line-height:1.08;letter-spacing:-1.5px;text-transform:none;max-width:760px;text-shadow:0 2px 18px rgba(0,0,0,.25)}
      .tyreByCarFinderWrap{width:100%;padding:0 20px;box-sizing:border-box;background:#fff}
      .tyreByCarExactPanel{width:min(920px,100%);margin:-48px auto 0;position:relative;z-index:2;padding:36px 42px 38px;box-sizing:border-box;background:#0d214d;color:#fff;border-radius:18px;box-shadow:0 12px 32px rgba(13,33,77,.16)}
      .tyreByCarExactPanel h2{margin:0 0 7px;color:#fff;font-family:Montserrat,Inter,Arial,sans-serif;font-size:clamp(25px,2.6vw,36px);font-weight:800;line-height:1.12;letter-spacing:-.5px;text-align:center}
      .tyreByCarExactPanel .required{margin:0 0 28px;color:rgba(255,255,255,.86);font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.45;text-align:center}
      .tyreByCarExactFields{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      .tyreByCarExactField label{display:block;margin:0 0 8px;color:#fff;font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:700;line-height:1.2;text-transform:uppercase;letter-spacing:.35px}
      .tyreByCarExactField select{width:100%;height:48px;box-sizing:border-box;border:1px solid #d8dce3!important;border-radius:5px!important;background:#fff!important;color:#20242b!important;padding:0 38px 0 13px!important;font-family:Inter,Arial,sans-serif!important;font-size:14px!important;font-weight:500!important;outline:none!important;box-shadow:none!important;appearance:none!important;-webkit-appearance:none!important;background-image:linear-gradient(45deg,transparent 50%,#0d214d 50%),linear-gradient(135deg,#0d214d 50%,transparent 50%)!important;background-position:calc(100% - 17px) 20px,calc(100% - 12px) 20px!important;background-size:6px 6px,6px 6px!important;background-repeat:no-repeat!important}
      .tyreByCarExactField select:disabled{opacity:.58;cursor:not-allowed}.tyreByCarExactField select option{color:#222;background:#fff}
      .tyreByCarExactActions{margin-top:24px;display:flex;justify-content:center;gap:10px}.tyreByCarExactActions button{min-width:125px;min-height:42px;padding:10px 20px;border:0;border-radius:5px;background:#fff;color:#0d214d;font:700 12px Inter,Arial,sans-serif;letter-spacing:.2px;cursor:pointer}.tyreByCarExactActions button:disabled{opacity:.45;cursor:not-allowed}.tyreByCarExactActions .secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.6)}
      .tyreByCarBottomSpace{height:180px;background:#fff}
      @media(max-width:800px){.tyreByCarHero{height:310px}.tyreByCarHeroInner{padding:0 20px}.tyreByCarHome{top:20px;font-size:14px}.tyreByCarHero h1{font-size:38px;letter-spacing:-.8px}.tyreByCarExactPanel{margin:-34px auto 0;padding:30px 22px 28px;border-radius:14px}.tyreByCarExactPanel h2{font-size:28px}.tyreByCarExactPanel .required{margin-bottom:24px}.tyreByCarExactFields{grid-template-columns:1fr;gap:17px}.tyreByCarExactActions{margin-top:24px;flex-direction:column-reverse}.tyreByCarExactActions button{width:100%}}
    `;document.head.appendChild(s);
  }
  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');location.hash='tyres/by-car';addStyle();document.body.classList.add('tyre-by-car-page');
    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
    const brandOptions=brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');
    render(`<section class="tyreExactPage"><section class="tyreByCarHero" aria-label="Find tyre by car hero"><div class="tyreByCarHeroInner"><a class="tyreByCarHome" href="#tyres" aria-label="Return to tyre home"><span class="arrow">←</span><span>Return to Tyre Home</span></a><h1>Find the right tyres for your car</h1></div></section><div class="tyreByCarFinderWrap"><section class="tyreByCarExactPanel" aria-label="Find tyre by car"><h2>Find Tyre By Car</h2><p class="required">Select your vehicle details to find the right tyres.</p><div class="tyreByCarExactFields"><div class="tyreByCarExactField"><label for="exactBrand">Vehicle brand</label><select id="exactBrand"><option value="">Select vehicle brand</option>${brandOptions}</select></div><div class="tyreByCarExactField"><label for="exactModel">Vehicle model</label><select id="exactModel" disabled><option value="">Select vehicle model</option></select></div><div class="tyreByCarExactField"><label for="exactYear">Vehicle year</label><select id="exactYear" disabled><option value="">Select vehicle year</option></select></div></div><div class="tyreByCarExactActions"><button class="secondary" id="exactBack" type="button">BACK</button><button id="exactContinue" type="button" disabled>FIND TYRES</button></div></section></div><div class="tyreByCarBottomSpace" aria-hidden="true"></div></section>`);
    const brand=document.getElementById('exactBrand'),model=document.getElementById('exactModel'),year=document.getElementById('exactYear'),continueBtn=document.getElementById('exactContinue'),backBtn=document.getElementById('exactBack');
    function reset(el,text){el.innerHTML=`<option value="">${text}</option>`;el.disabled=true}
    brand.addEventListener('change',()=>{reset(model,'Select vehicle model');reset(year,'Select vehicle year');continueBtn.disabled=true;const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.value));model.innerHTML='<option value="">Select vehicle model</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');model.disabled=!models.length});
    model.addEventListener('change',()=>{reset(year,'Select vehicle year');continueBtn.disabled=true;const years=(db.years||[]).filter(y=>String(y.modelId)===String(model.value)).sort((a,b)=>Number(b.year)-Number(a.year));year.innerHTML='<option value="">Select vehicle year</option>'+years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');year.disabled=!years.length});
    year.addEventListener('change',()=>{continueBtn.disabled=!year.value});
    continueBtn.addEventListener('click',()=>{if(brand.value&&model.value&&year.value)location.hash='tyres/by-car/'+encodeURIComponent(brand.value)+'/'+encodeURIComponent(model.value)+'/'+encodeURIComponent(year.value)});
    backBtn.addEventListener('click',()=>tyres());
  };
})();
