(function(){
  const styleId='tyre-by-car-exact-style';

  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');
    s.id=styleId;
    s.textContent=`
      .tyreExactPage{min-height:100vh!important;margin:0!important;padding:0!important;background:#fff!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;box-sizing:border-box!important}
      .tyreByCarExactPanel{width:calc(100% - 80px);max-width:1320px;margin:55px auto 70px;padding:82px 90px 90px;box-sizing:border-box;background:#0d214d;color:#fff;border-radius:72px}
      .tyreByCarExactPanel h1{margin:0 0 18px;color:#fff;font-family:Arial,sans-serif;font-size:clamp(38px,5vw,72px);font-weight:800;line-height:1.08;letter-spacing:-2px}
      .tyreByCarExactPanel .required{margin:0 0 70px;color:#fff;font-family:Arial,sans-serif;font-size:clamp(21px,2.2vw,34px);font-weight:400;line-height:1.25}
      .tyreByCarExactFields{display:grid;grid-template-columns:1fr;gap:48px}
      .tyreByCarExactField label{display:block;margin:0 0 18px;color:#fff;font-family:Arial,sans-serif;font-size:clamp(20px,2vw,32px);font-weight:800;line-height:1.15;text-transform:uppercase}
      .tyreByCarExactField select{width:100%;min-height:70px;box-sizing:border-box;border:0!important;border-bottom:6px solid #fff!important;border-radius:0!important;background-color:transparent!important;color:#fff!important;padding:0 65px 20px 0!important;font-family:Arial,sans-serif!important;font-size:clamp(22px,2.4vw,38px)!important;font-weight:400!important;line-height:1.2!important;outline:none!important;box-shadow:none!important;appearance:none!important;-webkit-appearance:none!important;background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%)!important;background-position:calc(100% - 34px) 35%,calc(100% - 12px) 35%!important;background-size:24px 24px,24px 24px!important;background-repeat:no-repeat!important}
      .tyreByCarExactField select:disabled{opacity:.65}
      .tyreByCarExactField select option{color:#111;background:#fff}
      .tyreByCarExactActions{margin-top:62px;display:flex;justify-content:flex-end;gap:16px}
      .tyreByCarExactActions button{min-width:190px;min-height:58px;padding:14px 26px;border:0;border-radius:8px;background:#fff;color:#0d214d;font:800 16px Arial,sans-serif;cursor:pointer}
      .tyreByCarExactActions button:disabled{opacity:.45;cursor:not-allowed}
      .tyreByCarExactActions .secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.65)}
      @media(max-width:700px){
        .tyreExactPage{min-height:100vh!important}
        .tyreByCarExactPanel{width:100%;margin:0;min-height:100vh;border-radius:0;padding:58px 28px 55px}
        .tyreByCarExactPanel h1{font-size:42px;letter-spacing:-1px}
        .tyreByCarExactPanel .required{margin-bottom:55px;font-size:22px}
        .tyreByCarExactFields{gap:38px}
        .tyreByCarExactField label{font-size:22px;margin-bottom:14px}
        .tyreByCarExactField select{min-height:58px;padding-right:45px!important;padding-bottom:16px!important;border-bottom-width:4px!important;font-size:24px!important;background-position:calc(100% - 24px) 35%,calc(100% - 8px) 35%!important;background-size:18px 18px!important}
        .tyreByCarExactActions{margin-top:48px;flex-direction:column}
        .tyreByCarExactActions button{width:100%}
      }
    `;
    document.head.appendChild(s);
  }

  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');
    location.hash='tyres/by-car';
    addStyle();

    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
    const brandOptions=brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');

    render(`
      <section class="tyreExactPage">
        <section class="tyreByCarExactPanel">
          <h1>Tell us about your vehicle.</h1>
          <p class="required">All fields are required.</p>
          <div class="tyreByCarExactFields">
            <div class="tyreByCarExactField">
              <label for="exactBrand">Vehicle brand</label>
              <select id="exactBrand"><option value="">Select vehicle brand</option>${brandOptions}</select>
            </div>
            <div class="tyreByCarExactField">
              <label for="exactModel">Vehicle model</label>
              <select id="exactModel" disabled><option value="">Select vehicle model</option></select>
            </div>
            <div class="tyreByCarExactField">
              <label for="exactYear">Vehicle year</label>
              <select id="exactYear" disabled><option value="">Select vehicle year</option></select>
            </div>
          </div>
          <div class="tyreByCarExactActions">
            <button class="secondary" id="exactBack" type="button">BACK</button>
            <button id="exactContinue" type="button" disabled>CONTINUE</button>
          </div>
        </section>
      </section>
    `);

    const brand=document.getElementById('exactBrand');
    const model=document.getElementById('exactModel');
    const year=document.getElementById('exactYear');
    const continueBtn=document.getElementById('exactContinue');
    const backBtn=document.getElementById('exactBack');

    function reset(el,text){el.innerHTML=`<option value="">${text}</option>`;el.disabled=true}

    brand.addEventListener('change',()=>{
      reset(model,'Select vehicle model');
      reset(year,'Select vehicle year');
      continueBtn.disabled=true;
      const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.value));
      model.innerHTML='<option value="">Select vehicle model</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
      model.disabled=!models.length;
    });

    model.addEventListener('change',()=>{
      reset(year,'Select vehicle year');
      continueBtn.disabled=true;
      const years=(db.years||[]).filter(y=>String(y.modelId)===String(model.value)).sort((a,b)=>Number(b.year)-Number(a.year));
      year.innerHTML='<option value="">Select vehicle year</option>'+years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');
      year.disabled=!years.length;
    });

    year.addEventListener('change',()=>{continueBtn.disabled=!year.value});

    continueBtn.addEventListener('click',()=>{
      if(brand.value&&model.value&&year.value){
        location.hash='tyres/by-car/'+encodeURIComponent(brand.value)+'/'+encodeURIComponent(model.value)+'/'+encodeURIComponent(year.value);
      }
    });

    backBtn.addEventListener('click',()=>tyres());
  };
})();
