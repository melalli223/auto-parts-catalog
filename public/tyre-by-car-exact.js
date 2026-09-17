(function(){
  const styleId='tyre-by-car-exact-style';

  function addStyle(){
    if(document.getElementById(styleId))return;
    const s=document.createElement('style');
    s.id=styleId;
    s.textContent=`
      .tyreExactPage{
        min-height:100vh!important;
        background:#fff!important;
        padding:0 0 70px!important;
        margin:0!important;
        display:block!important;
      }

      .tyreByCarHero{
        position:relative;
        width:100%;
        min-height:555px;
        background:
          linear-gradient(90deg,rgba(4,28,62,.82) 0%,rgba(4,28,62,.52) 48%,rgba(4,28,62,.08) 100%),
          url('/assets/tyre-ref/hero.png') center center/cover no-repeat;
        display:flex;
        align-items:center;
        box-sizing:border-box;
        padding:70px 7%;
        color:#fff;
      }

      .tyreByCarHeroContent{
        max-width:760px;
        margin-top:-45px;
      }

      .tyreByCarHero .eyebrow{
        display:block;
        margin:0 0 18px;
        color:#ef2027;
        font:800 18px/1.2 Arial,sans-serif;
        letter-spacing:2px;
        text-transform:uppercase;
      }

      .tyreByCarHero h1{
        margin:0 0 24px;
        color:#fff;
        font:800 clamp(42px,5.3vw,78px)/1.02 Arial,sans-serif;
        letter-spacing:-2px;
      }

      .tyreByCarHero p{
        max-width:720px;
        margin:0;
        color:#fff;
        font:400 clamp(18px,1.8vw,27px)/1.45 Arial,sans-serif;
      }

      .tyreByCarFinder{
        position:relative;
        z-index:5;
        width:min(1260px,calc(100% - 80px));
        margin:-105px auto 0;
        padding:38px 58px 42px;
        box-sizing:border-box;
        background:#06245b;
        border-radius:34px;
        box-shadow:0 18px 45px rgba(0,0,0,.18);
        color:#fff;
      }

      .tyreByCarFinderHead{
        display:flex;
        align-items:center;
        gap:22px;
        margin-bottom:34px;
      }

      .tyreByCarFinderIcon{
        width:72px;
        height:72px;
        flex:0 0 72px;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid #fff;
        border-radius:18px;
        font-size:38px;
        line-height:1;
      }

      .tyreByCarFinderHead h2{
        margin:0 0 7px;
        color:#fff;
        font:800 clamp(27px,2.6vw,40px)/1.1 Arial,sans-serif;
      }

      .tyreByCarFinderHead p{
        margin:0;
        color:rgba(255,255,255,.86);
        font:400 clamp(16px,1.3vw,21px)/1.35 Arial,sans-serif;
      }

      .tyreByCarFields{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:22px;
        align-items:end;
      }

      .tyreByCarField label{
        display:block;
        margin:0 0 10px;
        color:#fff;
        font:800 15px/1.2 Arial,sans-serif;
        letter-spacing:1px;
        text-transform:uppercase;
      }

      .tyreByCarField select{
        width:100%;
        height:58px;
        box-sizing:border-box;
        border:1px solid rgba(255,255,255,.18)!important;
        border-radius:11px!important;
        background:#173c70!important;
        color:#fff!important;
        padding:0 42px 0 17px!important;
        font:400 17px Arial,sans-serif!important;
        outline:none!important;
        box-shadow:none!important;
      }

      .tyreByCarField select:disabled{
        opacity:.72;
      }

      .tyreByCarField select option{
        color:#111;
        background:#fff;
      }

      .tyreByCarActions{
        margin-top:25px;
        padding-top:25px;
        border-top:1px solid rgba(255,255,255,.28);
        display:flex;
        justify-content:flex-end;
        gap:14px;
      }

      .tyreByCarActions button{
        min-width:205px;
        min-height:58px;
        border:0;
        border-radius:10px;
        padding:15px 28px;
        background:#ef2027;
        color:#fff;
        font:800 16px Arial,sans-serif;
        letter-spacing:.3px;
        cursor:pointer;
      }

      .tyreByCarActions button:disabled{
        opacity:.5;
        cursor:not-allowed;
      }

      .tyreByCarActions .secondary{
        background:transparent;
        border:1px solid rgba(255,255,255,.55);
      }

      @media(max-width:850px){
        .tyreByCarHero{
          min-height:470px;
          padding:55px 25px 130px;
          background-position:center;
        }

        .tyreByCarHeroContent{
          margin-top:0;
        }

        .tyreByCarFinder{
          width:calc(100% - 28px);
          margin:-85px auto 0;
          padding:28px 22px 30px;
          border-radius:24px;
        }

        .tyreByCarFields{
          grid-template-columns:1fr;
          gap:18px;
        }

        .tyreByCarFinderHead{
          gap:15px;
          margin-bottom:27px;
        }

        .tyreByCarFinderIcon{
          width:58px;
          height:58px;
          flex-basis:58px;
          font-size:29px;
        }

        .tyreByCarActions{
          flex-direction:column;
        }

        .tyreByCarActions button{
          width:100%;
        }
      }

      @media(max-width:520px){
        .tyreByCarHero{
          min-height:430px;
          padding:45px 20px 115px;
        }

        .tyreByCarHero .eyebrow{
          font-size:14px;
          letter-spacing:1.5px;
        }

        .tyreByCarHero h1{
          font-size:42px;
          letter-spacing:-1px;
        }

        .tyreByCarHero p{
          font-size:17px;
        }

        .tyreByCarFinder{
          width:calc(100% - 20px);
          padding:24px 18px 25px;
        }
      }
    `;
    document.head.appendChild(s);
  }

  window.tyresByCar=function(){
    if(typeof setNav==='function')setNav('');
    location.hash='tyres/by-car';
    addStyle();

    const brands=[...(window.db&&Array.isArray(db.brands)?db.brands:[])]
      .filter(b=>b.isRegular!==false);

    const brandOptions=brands
      .map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`)
      .join('');

    render(`
      <section class="tyreExactPage">
        <div class="tyreByCarHero">
          <div class="tyreByCarHeroContent">
            <span class="eyebrow">THE RIGHT TYRE. EVERY JOURNEY.</span>
            <h1>Find the perfect tyres<br>for your vehicle</h1>
            <p>Choose your car brand, model and year to find the right tyres that match your vehicle and driving needs.</p>
          </div>
        </div>

        <section class="tyreByCarFinder">
          <div class="tyreByCarFinderHead">
            <div class="tyreByCarFinderIcon">🚗</div>
            <div>
              <h2>Find tyre by car</h2>
              <p>Select your vehicle details to see the right tyres for your car.</p>
            </div>
          </div>

          <div class="tyreByCarFields">
            <div class="tyreByCarField">
              <label for="exactBrand">Brand</label>
              <select id="exactBrand">
                <option value="">Select Brand</option>
                ${brandOptions}
              </select>
            </div>

            <div class="tyreByCarField">
              <label for="exactModel">Model</label>
              <select id="exactModel" disabled>
                <option value="">Select Model</option>
              </select>
            </div>

            <div class="tyreByCarField">
              <label for="exactYear">Year</label>
              <select id="exactYear" disabled>
                <option value="">Select Year</option>
              </select>
            </div>
          </div>

          <div class="tyreByCarActions">
            <button class="secondary" id="exactBack" type="button">BACK</button>
            <button id="exactContinue" disabled>FIND TYRES&nbsp; →</button>
          </div>
        </section>
      </section>
    `);

    const brand=document.getElementById('exactBrand');
    const model=document.getElementById('exactModel');
    const year=document.getElementById('exactYear');
    const continueBtn=document.getElementById('exactContinue');
    const backBtn=document.getElementById('exactBack');

    function reset(el,text){
      el.innerHTML=`<option value="">${text}</option>`;
      el.disabled=true;
    }

    brand.addEventListener('change',()=>{
      reset(model,'Select Model');
      reset(year,'Select Year');
      continueBtn.disabled=true;

      const models=(db.models||[])
        .filter(m=>String(m.brandId)===String(brand.value));

      model.innerHTML='<option value="">Select Model</option>'+
        models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');

      model.disabled=!models.length;
    });

    model.addEventListener('change',()=>{
      reset(year,'Select Year');
      continueBtn.disabled=true;

      const years=(db.years||[])
        .filter(y=>String(y.modelId)===String(model.value))
        .sort((a,b)=>Number(b.year)-Number(a.year));

      year.innerHTML='<option value="">Select Year</option>'+
        years.map(y=>`<option value="${esc(y.year)}">${esc(y.year)}</option>`).join('');

      year.disabled=!years.length;
    });

    year.addEventListener('change',()=>{
      continueBtn.disabled=!year.value;
    });

    continueBtn.addEventListener('click',()=>{
      if(brand.value&&model.value&&year.value){
        location.hash='tyres/by-car/'+
          encodeURIComponent(brand.value)+'/'+
          encodeURIComponent(model.value)+'/'+
          encodeURIComponent(year.value);
      }
    });

    backBtn.addEventListener('click',()=>tyres());
  };
})();
