(function(){
  const styleId='tyre-by-car-exact-style';
  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');s.id=styleId;
    s.textContent=`
      .tyreExactPage{min-height:100vh!important;background:#fff!important;padding:34px 18px 48px!important;display:flex!important;align-items:flex-start!important;justify-content:center!important}
      .tyreByCarExact{width:min(100%,1430px);background:#0d214d;border-radius:88px;padding:135px 135px 110px;color:#fff;box-sizing:border-box;min-height:820px}
      .tyreByCarExact h1{margin:0 0 18px;font:800 clamp(36px,4.5vw,76px)/1.1 Arial,sans-serif;letter-spacing:-2px;color:#fff}
      .tyreByCarExact .exactIntro{margin:0 0 76px;font:400 clamp(22px,2.3vw,48px)/1.2 Arial,sans-serif;color:#fff}
      .tyreByCarExact .exactField{margin:0 0 48px}
      .tyreByCarExact label{display:block;margin:0 0 42px;font:800 clamp(23px,2vw,44px)/1 Arial,sans-serif;color:#fff;text-transform:uppercase}
      .tyreByCarExact select{appearance:none;-webkit-appearance:none;width:100%;border:0;border-bottom:7px solid #fff;border-radius:0;background:transparent;color:#fff;padding:0 82px 26px 30px;font:400 clamp(24px,2.5vw,54px)/1.25 Arial,sans-serif;outline:none;background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%);background-position:calc(100% - 48px) 35%,calc(100% - 22px) 35%;background-size:32px 32px,32px 32px;background-repeat:no-repeat}
      .tyreByCarExact select option{color:#111;background:#fff}
      .tyreByCarExact .exactActions{display:flex;gap:18px;margin-top:30px;flex-wrap:wrap}
      .tyreByCarExact button{border:2px solid #fff;background:#fff;color:#0d214d;border-radius:8px;padding:18px 30px;font:800 20px Arial,sans-serif;cursor:pointer}
      .tyreByCarExact button.secondary{background:transparent;color:#fff}
      @media(max-width:700px){.tyreExactPage{padding:0!important}.tyreByCarExact{border-radius:0;min-height:100vh;padding:58px 28px 50px}.tyreByCarExact h1{letter-spacing:-1px}.tyreByCarExact .exactIntro{margin-bottom:58px}.tyreByCarExact label{margin-bottom:28px}.tyreByCarExact select{padding-left:0;padding-bottom:20px;border-bottom-width:4px;background-size:22px 22px;background-position:calc(100% - 30px) 30%,calc(100% - 15px) 30%}.tyreByCarExact .exactField{margin-bottom:40px}.tyreByCarExact button{width:100%}}
    `;
    document.head.appendChild(s);
  }
  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');
    location.hash='tyres/by-car';
    addStyle();
    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
    const brandOptions=brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');
    render(`<section class="tyreExactPage"><div class="tyreByCarExact">
      <h1>Tell us about your vehicle.</h1>
      <p class="exactIntro">All fields are required.</p>
      <div class="exactField"><label for="exactBrand">Vehicle brand</label><select id="exactBrand"><option value="">Enter Vehicle Brand</option>${brandOptions}</select></div>
      <div class="exactField"><label for="exactModel">Vehicle model</label><select id="exactModel" disabled><option value="">Enter Vehicle Model</option></select></div>
      <div class="exactField"><label for="exactYear">Vehicle year</label><select id="exactYear" disabled><option value="">Enter Vehicle Year</option></select></div>
      <div class="exactActions"><button id="exactContinue" disabled>CONTINUE</button><button class="secondary" type="button" onclick="tyres()">BACK</button></div>
    </div></section>`);
    const brand=document.getElementById('exactBrand'),model=document.getElementById('exactModel'),year=document.getElementById('exactYear'),continueBtn=document.getElementById('exactContinue');
    function reset(el,text){el.innerHTML=`<option value="">${text}</option>`;el.disabled=true}
    brand.addEventListener('change',()=>{
      reset(model,'Enter Vehicle Model');reset(year,'Enter Vehicle Year');continueBtn.disabled=true;
      const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.value));
      model.innerHTML='<option value="">Enter Vehicle Model</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');model.disabled=!models.length;
    });
    model.addEventListener('change',()=>{
      reset(year,'Enter Vehicle Year');continueBtn.disabled=true;
      const years=(db.years||[]).filter(y=>String(y.modelId)===String(model.value)).sort((a,b)=>Number(b.year)-Number(a.year));
      year.innerHTML='<option value="">Enter Vehicle Year</option>'+years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');year.disabled=!years.length;
    });
    year.addEventListener('change',()=>{continueBtn.disabled=!year.value});
    continueBtn.addEventListener('click',()=>{if(brand.value&&model.value&&year.value){location.hash='tyres/by-car/'+encodeURIComponent(brand.value)+'/'+encodeURIComponent(model.value)+'/'+encodeURIComponent(year.value)}});
  };
})();
