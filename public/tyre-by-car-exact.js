(function(){
  const styleId='tyre-by-car-exact-style';
  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');s.id=styleId;s.textContent=`
      html,body{background:#fff!important} body.tyre-by-car-page{background:#fff!important}
      .tyreExactPage{min-height:100vh!important;margin:0!important;padding:0 0 180px!important;background:#fff!important;display:block!important;box-sizing:border-box!important}
      .tyreByCarHero{width:100%;height:clamp(250px,34vw,510px);background:#111 url('/assets/tyre-ref/hero.png') center center/cover no-repeat;position:relative;overflow:hidden}
      .tyreByCarHero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.58),rgba(0,0,0,.08) 65%,rgba(0,0,0,.02))}
      .tyreByCarHeroInner{position:relative;z-index:1;height:100%;max-width:1320px;margin:0 auto;padding:0 48px;display:flex;align-items:center;box-sizing:border-box}
      .tyreByCarHero h1{margin:0;color:#fff;font-family:Arial,sans-serif;font-size:clamp(38px,5vw,78px);font-weight:800;line-height:1.02;letter-spacing:-2px;text-transform:uppercase;max-width:720px}
      .tyreByCarFinderWrap{width:100%;padding:0 24px;box-sizing:border-box;background:#fff}
      .tyreByCarExactPanel{width:min(1120px,100%);margin:-72px auto 0;position:relative;z-index:2;padding:58px 68px 68px;box-sizing:border-box;background:#0d214d;color:#fff;border-radius:34px;box-shadow:0 18px 45px rgba(13,33,77,.18)}
      .tyreByCarExactPanel h2{margin:0 0 12px;color:#fff;font-family:Arial,sans-serif;font-size:clamp(30px,3.2vw,48px);font-weight:800;line-height:1.1}
      .tyreByCarExactPanel .required{margin:0 0 44px;color:rgba(255,255,255,.9);font-family:Arial,sans-serif;font-size:18px;line-height:1.4}
      .tyreByCarExactFields{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
      .tyreByCarExactField label{display:block;margin:0 0 12px;color:#fff;font-family:Arial,sans-serif;font-size:15px;font-weight:800;line-height:1.2;text-transform:uppercase;letter-spacing:.3px}
      .tyreByCarExactField select{width:100%;height:58px;box-sizing:border-box;border:1px solid rgba(255,255,255,.55)!important;border-radius:7px!important;background:#fff!important;color:#222!important;padding:0 45px 0 16px!important;font-family:Arial,sans-serif!important;font-size:17px!important;font-weight:500!important;outline:none!important;box-shadow:none!important;appearance:none!important;-webkit-appearance:none!important;background-image:linear-gradient(45deg,transparent 50%,#0d214d 50%),linear-gradient(135deg,#0d214d 50%,transparent 50%)!important;background-position:calc(100% - 21px) 25px,calc(100% - 14px) 25px!important;background-size:8px 8px,8px 8px!important;background-repeat:no-repeat!important}
      .tyreByCarExactField select:disabled{opacity:.58;cursor:not-allowed}.tyreByCarExactField select option{color:#222;background:#fff}
      .tyreByCarExactActions{margin-top:38px;display:flex;justify-content:flex-end;gap:12px}.tyreByCarExactActions button{min-width:150px;min-height:50px;padding:12px 24px;border:0;border-radius:7px;background:#fff;color:#0d214d;font:800 14px Arial,sans-serif;cursor:pointer}.tyreByCarExactActions button:disabled{opacity:.45;cursor:not-allowed}.tyreByCarExactActions .secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.65)}
      .tyreByCarBottomSpace{height:180px;background:#fff}
      @media(max-width:800px){.tyreByCarHero{height:300px}.tyreByCarHeroInner{padding:0 24px;align-items:flex-end;padding-bottom:38px}.tyreByCarHero h1{font-size:40px;letter-spacing:-1px}.tyreByCarExactPanel{margin:-42px auto 0;padding:36px 24px 30px;border-radius:22px}.tyreByCarExactPanel h2{font-size:31px}.tyreByCarExactPanel .required{margin-bottom:30px}.tyreByCarExactFields{grid-template-columns:1fr;gap:22px}.tyreByCarExactActions{margin-top:30px;flex-direction:column-reverse}.tyreByCarExactActions button{width:100%}}
    `;document.head.appendChild(s);
  }
  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');location.hash='tyres/by-car';addStyle();document.body.classList.add('tyre-by-car-page');
    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
    const brandOptions=brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');
    render(`<section class="tyreExactPage"><section class="tyreByCarHero" aria-label="Find tyre by car hero"><div class="tyreByCarHeroInner"><h1>Find the right tyres for your car</h1></div></section><div class="tyreByCarFinderWrap"><section class="tyreByCarExactPanel" aria-label="Find tyre by car"><h2>Find Tyre By Car</h2><p class="required">Select your vehicle details to find the right tyres.</p><div class="tyreByCarExactFields"><div class="tyreByCarExactField"><label for="exactBrand">Vehicle brand</label><select id="exactBrand"><option value="">Select vehicle brand</option>${brandOptions}</select></div><div class="tyreByCarExactField"><label for="exactModel">Vehicle model</label><select id="exactModel" disabled><option value="">Select vehicle model</option></select></div><div class="tyreByCarExactField"><label for="exactYear">Vehicle year</label><select id="exactYear" disabled><option value="">Select vehicle year</option></select></div></div><div class="tyreByCarExactActions"><button class="secondary" id="exactBack" type="button">BACK</button><button id="exactContinue" type="button" disabled>FIND TYRES</button></div></section></div><div class="tyreByCarBottomSpace" aria-hidden="true"></div></section>`);
    const brand=document.getElementById('exactBrand'),model=document.getElementById('exactModel'),year=document.getElementById('exactYear'),continueBtn=document.getElementById('exactContinue'),backBtn=document.getElementById('exactBack');
    function reset(el,text){el.innerHTML=`<option value="">${text}</option>`;el.disabled=true}
    brand.addEventListener('change',()=>{reset(model,'Select vehicle model');reset(year,'Select vehicle year');continueBtn.disabled=true;const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.value));model.innerHTML='<option value="">Select vehicle model</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');model.disabled=!models.length});
    model.addEventListener('change',()=>{reset(year,'Select vehicle year');continueBtn.disabled=true;const years=(db.years||[]).filter(y=>String(y.modelId)===String(model.value)).sort((a,b)=>Number(b.year)-Number(a.year));year.innerHTML='<option value="">Select vehicle year</option>'+years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');year.disabled=!years.length});
    year.addEventListener('change',()=>{continueBtn.disabled=!year.value});
    continueBtn.addEventListener('click',()=>{if(brand.value&&model.value&&year.value)location.hash='tyres/by-car/'+encodeURIComponent(brand.value)+'/'+encodeURIComponent(model.value)+'/'+encodeURIComponent(year.value)});
    backBtn.addEventListener('click',()=>tyres());
  };
})();
