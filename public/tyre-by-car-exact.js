(function(){
  const styleId='tyre-by-car-exact-style';
  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');s.id=styleId;s.textContent=`
      html,body{margin:0!important;padding:0!important;background:#fff!important}
      body.tyre-by-car-page{background:#fff!important}

      .tyreExactPage{
        min-height:100vh!important;
        margin:0!important;
        padding:0 0 170px!important;
        background:#fff!important;
        display:block!important;
        box-sizing:border-box!important;
        font-family:Inter,Arial,sans-serif;
        color:#fff;
      }

      /* HERO — matched to the supplied reference */
      .tyreByCarHero{
        width:100%;
        height:571px;
        position:relative;
        overflow:hidden;
        background:#14283f url('/assets/tyre-ref/hero.png') center center/cover no-repeat;
      }
      .tyreByCarHero:after{
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(90deg,rgba(3,22,43,.67) 0%,rgba(3,22,43,.45) 43%,rgba(3,22,43,.08) 75%,rgba(3,22,43,.12) 100%);
        pointer-events:none;
      }
      .tyreByCarHeroInner{
        position:relative;
        z-index:1;
        width:100%;
        height:100%;
        max-width:1460px;
        margin:0 auto;
        padding:0 50px;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        justify-content:flex-start;
      }
      .tyreByCarHome{
        position:absolute;
        top:28px;
        left:50%;
        transform:translateX(-50%);
        display:inline-flex;
        align-items:center;
        gap:9px;
        color:#fff;
        text-decoration:none;
        font:600 15px/1 Inter,Arial,sans-serif;
        white-space:nowrap;
        cursor:pointer;
        opacity:.98;
      }
      .tyreByCarHome .arrow{
        font-size:25px;
        font-weight:400;
        line-height:12px;
        margin-top:-2px;
      }
      .tyreByCarHeroCopy{
        margin-top:142px;
        max-width:760px;
      }
      .tyreByCarEyebrow{
        margin:0 0 14px;
        color:#ff2b2f;
        font-family:Inter,Arial,sans-serif;
        font-size:20px;
        font-weight:800;
        line-height:1.15;
        letter-spacing:.8px;
        text-transform:uppercase;
      }
      .tyreByCarHero h1{
        margin:0;
        color:#fff;
        font-family:Inter,Arial,sans-serif;
        font-size:64px;
        font-weight:800;
        line-height:1.08;
        letter-spacing:-2.4px;
        text-transform:none;
        max-width:740px;
        text-shadow:0 2px 16px rgba(0,0,0,.22);
      }
      .tyreByCarHeroSub{
        margin:27px 0 0;
        max-width:720px;
        color:rgba(255,255,255,.94);
        font-family:Inter,Arial,sans-serif;
        font-size:23px;
        font-weight:400;
        line-height:1.5;
        letter-spacing:-.25px;
      }

      /* FINDER CARD */
      .tyreByCarFinderWrap{
        width:100%;
        padding:0 40px;
        box-sizing:border-box;
        background:#fff;
      }
      .tyreByCarExactPanel{
        width:min(1300px,100%);
        min-height:353px;
        margin:-102px auto 0;
        position:relative;
        z-index:2;
        padding:36px 60px 35px;
        box-sizing:border-box;
        background:#061e4e;
        color:#fff;
        border-radius:34px;
        box-shadow:0 15px 35px rgba(3,25,65,.12);
      }
      .tyreByCarPanelHeader{
        display:flex;
        align-items:center;
        gap:28px;
      }
      .tyreByCarCarIcon{
        flex:0 0 98px;
        width:98px;
        height:72px;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .tyreByCarCarIcon svg{
        width:88px;
        height:68px;
        display:block;
      }
      .tyreByCarPanelHeadText{min-width:0}
      .tyreByCarExactPanel h2{
        margin:0 0 7px;
        color:#fff;
        font-family:Inter,Arial,sans-serif;
        font-size:36px;
        font-weight:800;
        line-height:1.08;
        letter-spacing:-1.1px;
        text-align:left;
      }
      .tyreByCarExactPanel .required{
        margin:0;
        color:rgba(255,255,255,.9);
        font-family:Inter,Arial,sans-serif;
        font-size:19px;
        font-weight:400;
        line-height:1.4;
        text-align:left;
      }
      .tyreByCarExactFields{
        display:grid;
        grid-template-columns:1fr 1fr 1fr;
        gap:24px;
        margin-top:28px;
      }
      .tyreByCarExactField label{
        display:block;
        margin:0 0 8px;
        color:#fff;
        font-family:Inter,Arial,sans-serif;
        font-size:14px;
        font-weight:800;
        line-height:1.2;
        text-transform:uppercase;
        letter-spacing:.25px;
      }
      .tyreByCarExactField select{
        width:100%;
        height:59px;
        box-sizing:border-box;
        border:1px solid rgba(255,255,255,.07)!important;
        border-radius:14px!important;
        background:#173765!important;
        color:#f2f5fa!important;
        padding:0 45px 0 18px!important;
        font-family:Inter,Arial,sans-serif!important;
        font-size:17px!important;
        font-weight:400!important;
        outline:none!important;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.02)!important;
        appearance:none!important;
        -webkit-appearance:none!important;
        background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%)!important;
        background-position:calc(100% - 22px) 25px,calc(100% - 16px) 25px!important;
        background-size:6px 6px,6px 6px!important;
        background-repeat:no-repeat!important;
      }
      .tyreByCarExactField select:focus{border-color:rgba(255,255,255,.35)!important}
      .tyreByCarExactField select:disabled{opacity:.62;cursor:not-allowed}
      .tyreByCarExactField select option{color:#222;background:#fff}

      .tyreByCarExactActions{
        margin-top:26px;
        padding-top:0;
        border-top:2px solid rgba(255,255,255,.33);
        display:flex;
        justify-content:flex-end;
        align-items:center;
        gap:14px;
      }
      .tyreByCarExactActions button{
        min-width:214px;
        height:61px;
        margin-top:-2px;
        padding:0 27px;
        border:0;
        border-radius:15px;
        background:#f51f2a;
        color:#fff;
        font:800 16px Inter,Arial,sans-serif;
        letter-spacing:.25px;
        cursor:pointer;
        transition:filter .15s ease,transform .15s ease;
      }
      .tyreByCarExactActions button:hover:not(:disabled){filter:brightness(1.06);transform:translateY(-1px)}
      .tyreByCarExactActions button:disabled{opacity:.45;cursor:not-allowed}
      .tyreByCarExactActions .secondary{display:none}
      #exactContinue:after{content:"  →";font-size:24px;font-weight:400;vertical-align:-1px}
      .tyreByCarBottomSpace{height:170px;background:#fff}

      @media(max-width:1100px){
        .tyreByCarHero{height:540px}
        .tyreByCarHeroInner{padding:0 36px}
        .tyreByCarHeroCopy{margin-top:135px}
        .tyreByCarHero h1{font-size:55px}
        .tyreByCarHeroSub{font-size:20px}
        .tyreByCarExactPanel{padding-left:42px;padding-right:42px}
      }
      @media(max-width:800px){
        .tyreExactPage{padding-bottom:90px!important}
        .tyreByCarHero{height:500px;background-position:58% center}
        .tyreByCarHero:after{background:linear-gradient(90deg,rgba(3,22,43,.72),rgba(3,22,43,.34))}
        .tyreByCarHeroInner{padding:0 24px}
        .tyreByCarHome{top:20px;font-size:13px}
        .tyreByCarHeroCopy{margin-top:120px;max-width:100%}
        .tyreByCarEyebrow{font-size:14px;letter-spacing:.55px;margin-bottom:11px}
        .tyreByCarHero h1{font-size:40px;line-height:1.08;letter-spacing:-1.2px;max-width:500px}
        .tyreByCarHeroSub{font-size:17px;line-height:1.45;margin-top:20px;max-width:500px}
        .tyreByCarFinderWrap{padding:0 16px}
        .tyreByCarExactPanel{width:100%;min-height:0;margin:-55px auto 0;padding:26px 22px 25px;border-radius:24px}
        .tyreByCarPanelHeader{gap:14px}
        .tyreByCarCarIcon{flex-basis:62px;width:62px;height:58px}
        .tyreByCarCarIcon svg{width:59px;height:52px}
        .tyreByCarExactPanel h2{font-size:27px;letter-spacing:-.6px}
        .tyreByCarExactPanel .required{font-size:15px}
        .tyreByCarExactFields{grid-template-columns:1fr;gap:15px;margin-top:24px}
        .tyreByCarExactField select{height:54px;font-size:15px!important}
        .tyreByCarExactActions{margin-top:21px}
        .tyreByCarExactActions button{width:100%;height:54px;min-width:0;border-radius:13px}
        .tyreByCarBottomSpace{height:90px}
      }
      @media(max-width:420px){
        .tyreByCarHero{height:470px}
        .tyreByCarHero h1{font-size:35px}
        .tyreByCarHeroSub{font-size:16px}
        .tyreByCarExactPanel h2{font-size:24px}
      }
    `;document.head.appendChild(s);
  }

  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');
    location.hash='tyres/by-car';
    addStyle();
    document.body.classList.add('tyre-by-car-page');

    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
    const brandOptions=brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('');

    const carIcon=`<svg viewBox="0 0 96 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 35l7-17c1.5-4 4.5-6 9-6h34c4.5 0 7.5 2 9 6l7 17"/>
        <path d="M11 35h74c3.3 0 6 2.7 6 6v14c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4V41c0-3.3 2.7-6 6-6Z"/>
        <path d="M24 26h48"/>
        <path d="M17 47h13M66 47h13"/>
        <circle cx="22" cy="58" r="5" fill="#061e4e"/>
        <circle cx="74" cy="58" r="5" fill="#061e4e"/>
      </g>
    </svg>`;

    render(`<section class="tyreExactPage">
      <section class="tyreByCarHero" aria-label="Find tyre by car hero">
        <div class="tyreByCarHeroInner">
          <a class="tyreByCarHome" href="#tyres" aria-label="Return to tyre home"><span class="arrow">←</span><span>Return to Tyre Home</span></a>
          <div class="tyreByCarHeroCopy">
            <p class="tyreByCarEyebrow">The right tyre. Every journey.</p>
            <h1>Find the perfect tyres<br>for your vehicle</h1>
            <p class="tyreByCarHeroSub">Choose your car brand, model and year to find the right tyres<br class="desktopBreak"> that match your vehicle and driving needs.</p>
          </div>
        </div>
      </section>

      <div class="tyreByCarFinderWrap">
        <section class="tyreByCarExactPanel" aria-label="Find tyre by car">
          <div class="tyreByCarPanelHeader">
            <div class="tyreByCarCarIcon">${carIcon}</div>
            <div class="tyreByCarPanelHeadText">
              <h2>Find tyre by car</h2>
              <p class="required">Select your vehicle details to see the right tyres for your car.</p>
            </div>
          </div>

          <div class="tyreByCarExactFields">
            <div class="tyreByCarExactField"><label for="exactBrand">Brand</label><select id="exactBrand"><option value="">Select Brand</option>${brandOptions}</select></div>
            <div class="tyreByCarExactField"><label for="exactModel">Model</label><select id="exactModel" disabled><option value="">Select Model</option></select></div>
            <div class="tyreByCarExactField"><label for="exactYear">Year</label><select id="exactYear" disabled><option value="">Select Year</option></select></div>
          </div>

          <div class="tyreByCarExactActions">
            <button class="secondary" id="exactBack" type="button">BACK</button>
            <button id="exactContinue" type="button" disabled>FIND TYRES</button>
          </div>
        </section>
      </div>
      <div class="tyreByCarBottomSpace" aria-hidden="true"></div>
    </section>`);

    const brand=document.getElementById('exactBrand');
    const model=document.getElementById('exactModel');
    const year=document.getElementById('exactYear');
    const continueBtn=document.getElementById('exactContinue');
    const backBtn=document.getElementById('exactBack');

    function reset(el,text){el.innerHTML=`<option value="">${text}</option>`;el.disabled=true}

    brand.addEventListener('change',()=>{
      reset(model,'Select Model');
      reset(year,'Select Year');
      continueBtn.disabled=true;
      const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.value));
      model.innerHTML='<option value="">Select Model</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
      model.disabled=!models.length;
    });

    model.addEventListener('change',()=>{
      reset(year,'Select Year');
      continueBtn.disabled=true;
      const years=(db.years||[]).filter(y=>String(y.modelId)===String(model.value)).sort((a,b)=>Number(b.year)-Number(a.year));
      year.innerHTML='<option value="">Select Year</option>'+years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');
      year.disabled=!years.length;
    });

    year.addEventListener('change',()=>{continueBtn.disabled=!year.value});
    continueBtn.addEventListener('click',()=>{if(brand.value&&model.value&&year.value)location.hash='tyres/by-car/'+encodeURIComponent(brand.value)+'/'+encodeURIComponent(model.value)+'/'+encodeURIComponent(year.value)});
    backBtn.addEventListener('click',()=>tyres());
  };
})();
