(function(){
const styleId='tyre-by-car-exact-style';
function enhanceDropdown(sel){if(!sel||sel.dataset.customized==='1')return;sel.dataset.customized='1';const wrap=document.createElement('div');wrap.className='tyreCustomSelect';const display=document.createElement('button');display.type='button';display.className='tyreCustomSelectDisplay';display.setAttribute('aria-haspopup','listbox');display.setAttribute('aria-expanded','false');const list=document.createElement('div');list.className='tyreCustomSelectList';list.style.setProperty('background',document.body.classList.contains('tyre-by-car-page')?'#173765':'#fff','important');list.setAttribute('role','listbox');function sync(){const o=sel.options[sel.selectedIndex];display.textContent=o?o.textContent:'';display.disabled=sel.disabled;list.innerHTML='';[...sel.options].forEach((opt,i)=>{const item=document.createElement('button');item.type='button';item.className='tyreCustomSelectOption'+(opt.selected?' selected':'');item.style.setProperty('background',document.body.classList.contains('tyre-by-car-page')?'#173765':'#fff','important');item.style.setProperty('color',document.body.classList.contains('tyre-by-car-page')?'#fff':'#061e4e','important');item.textContent=opt.textContent;item.disabled=opt.disabled;item.setAttribute('role','option');item.addEventListener('click',e=>{e.stopPropagation();sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));close()});list.appendChild(item)})}function open(){if(sel.disabled)return;document.querySelectorAll('.tyreCustomSelect.open').forEach(x=>x!==wrap&&x.classList.remove('open'));wrap.classList.add('open');display.setAttribute('aria-expanded','true')}function close(){wrap.classList.remove('open');display.setAttribute('aria-expanded','false')}display.addEventListener('click',e=>{e.stopPropagation();wrap.classList.contains('open')?close():open()});document.addEventListener('click',close);sel.style.display='none';sel.insertAdjacentElement('afterend',wrap);wrap.appendChild(display);wrap.appendChild(list);sync();new MutationObserver(sync).observe(sel,{childList:true,subtree:true});sel.addEventListener('change',sync);return wrap}
function addStyle(){if(document.getElementById(styleId))return;const s=document.createElement('style');s.id=styleId;s.textContent=`
html,body{margin:0!important;padding:0!important;background:#fff!important}.tyreExactPage{min-height:100vh!important;padding:0 0 170px!important;background:#fff!important;font-family:Inter,Arial,sans-serif}
.tyreByCarHero{height:571px;position:relative;overflow:hidden;background:#14283f url('/assets/tyre-ref/hero.png') center/cover no-repeat}.tyreByCarHero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,22,43,.67),rgba(3,22,43,.25) 55%,rgba(3,22,43,.08));pointer-events:none}.tyreByCarHeroInner{position:relative;z-index:1;height:100%;max-width:1460px;margin:auto;padding:0 50px;box-sizing:border-box}
.tyreByCarBackHome{position:absolute;z-index:6;top:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;width:max-content;height:40px;margin:0;padding:0 18px;border:0;background:transparent;color:#fff;font:800 14px/40px Inter,Arial,sans-serif;cursor:pointer;box-shadow:none;text-shadow:0 1px 5px rgba(0,0,0,.45)}
.tyreByCarBackHome span{font-size:20px;line-height:1;margin-right:7px}
.tyreByCarBackHome:hover{background:transparent;color:#fff}
.tyreByCarImageCopy{position:absolute;z-index:3;top:34%;left:5.9%;right:auto;transform:translateY(-50%);width:min(820px,82%);padding:0;margin:0;text-align:left;background:transparent;box-shadow:none;border:0;display:block}
.tyreByCarImageCopy *{background:transparent!important;background-color:transparent!important;box-shadow:none!important;border:0!important}
.tyreByCarImageCopy .tyreByCarEyebrow{margin:0 0 13px;color:#ff2b2f;font-size:20px;font-weight:800;line-height:1.15;letter-spacing:.8px;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,.35)}
.tyreByCarImageCopy h1{margin:0;color:#fff;font-size:64px;font-weight:800;line-height:1.08;letter-spacing:-2px;text-shadow:0 2px 8px rgba(0,0,0,.35)}
.tyreByCarImageCopy .tyreByCarHeroSub{display:block;margin:20px 0 0;max-width:720px;color:rgba(255,255,255,.94);font-size:21px;font-weight:500;line-height:1.55;text-align:left;text-shadow:0 2px 7px rgba(0,0,0,.35)}

.tyreByCarHeroCopy{max-width:760px;margin:0 auto;padding:68px 24px 48px;text-align:center;background:#fff;box-sizing:border-box}.tyreByCarEyebrow{margin:0 0 14px;color:#ff2b2f;font-size:20px;font-weight:800;line-height:1.15;letter-spacing:.8px;text-transform:uppercase}.tyreByCarHero h1{margin:0;color:#061e4e;font-size:52px;font-weight:800;line-height:1.08;letter-spacing:-2px}.tyreByCarHeroSub{margin:20px auto 0;color:#33445d;font-size:20px;line-height:1.5;max-width:720px}
.tyreByCarFinderWrap{width:100%;padding:0 40px;box-sizing:border-box;background:#fff}.tyreByCarExactPanel{width:min(850px,100%);margin:-70px auto 0;position:relative;z-index:2;padding:32px 42px 34px;box-sizing:border-box;background:#061e4e;color:#fff;border-radius:24px;box-shadow:0 15px 35px rgba(3,25,65,.14);transition:padding .2s ease}.tyreByCarPanelHeader{display:block;text-align:center}.tyreByCarExactPanel h2{margin:0 0 9px;color:#fff;font-size:30px;font-weight:800;line-height:1.15;text-align:center}.tyreByCarExactPanel .required{margin:0;color:rgba(255,255,255,.88);font-size:14px;line-height:1.45;text-align:center}.tyreByCarExactFields{display:block;margin-top:25px}.tyreByCarExactField{width:100%;position:relative}.tyreByCarExactField+.tyreByCarExactField{margin-top:18px}.tyreByCarExactField label{display:block;margin:0 0 9px 8px;color:#fff;font-size:12px;font-weight:800;line-height:1.2;text-transform:uppercase;letter-spacing:.4px}.tyreByCarExactField select{color-scheme:dark;width:100%;height:56px;box-sizing:border-box;border:1px solid rgba(255,255,255,.2)!important;border-radius:12px!important;background:#173765!important;color:#fff!important;padding:0 48px 0 18px!important;font-family:Inter,Arial,sans-serif!important;font-size:16px!important;font-weight:600!important;line-height:56px!important;outline:none!important;appearance:none!important;-webkit-appearance:none!important;background-image:linear-gradient(45deg,transparent 50%,#fff 50%),linear-gradient(135deg,#fff 50%,transparent 50%)!important;background-position:calc(100% - 22px) 24px,calc(100% - 16px) 24px!important;background-size:6px 6px,6px 6px!important;background-repeat:no-repeat!important;cursor:pointer}.tyreCustomSelect{position:relative;width:100%}.tyreCustomSelectDisplay{width:100%;height:56px;box-sizing:border-box;border:1px solid #dfe5ec;border-radius:12px;background:#fff;color:#061e4e;padding:0 48px 0 18px;font:600 16px/56px Inter,Arial,sans-serif;text-align:left;position:relative;cursor:pointer}.tyreCustomSelectDisplay:after{content:'';position:absolute;right:18px;top:22px;width:8px;height:8px;border-right:2px solid #e21b23;border-bottom:2px solid #e21b23;transform:rotate(45deg)}.tyreCustomSelect.open .tyreCustomSelectDisplay{border-color:#e21b23;box-shadow:0 0 0 2px rgba(226,27,35,.10)}.tyreCustomSelectDisplay:disabled{opacity:.55;cursor:not-allowed}.tyreCustomSelectList{display:none;position:absolute;z-index:99999;left:0;right:0;top:calc(100% + 7px);max-height:260px;overflow:auto;padding:6px;background:#fff;border:1px solid #dfe5ec;border-radius:12px;box-shadow:0 12px 28px rgba(3,25,65,.16)}.tyreCustomSelect.open .tyreCustomSelectList{display:block!important}.tyreCustomSelectOption{display:block;width:100%;min-height:44px;padding:10px 14px;border:0;border-radius:8px;background:#fff;color:#061e4e;font:600 15px/24px Inter,Arial,sans-serif;text-align:left;cursor:pointer}.tyreCustomSelectOption:hover,.tyreCustomSelectOption.selected{background:#f4f6f9;color:#061e4e}.tyreCustomSelectOption:disabled{opacity:.5;cursor:not-allowed}.tyreByCarExactField .tyreCustomSelectDisplay{background:#173765;color:#fff;border-color:rgba(255,255,255,.2)}.tyreByCarExactField .tyreCustomSelectDisplay:after{border-color:#fff}.tyreByCarExactField .tyreCustomSelectList{background:#173765!important;border-color:rgba(255,255,255,.2)!important}.tyreByCarExactField .tyreCustomSelectOption{background:#173765!important;color:#fff!important}.tyreByCarExactField .tyreCustomSelectOption:hover,.tyreByCarExactField .tyreCustomSelectOption.selected{background:#214776!important;color:#fff!important}.tyreByCarExactField select:focus{border-color:rgba(255,255,255,.65)!important;box-shadow:0 0 0 2px rgba(255,255,255,.1)!important}.tyreByCarExactField select option{background:#173765!important;color:#fff!important;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;padding:12px 14px;border:0}.tyreByCarExactField select option:checked{background:#214776!important;color:#fff!important}.tyreByCarExactField select option:hover{background:#214776!important;color:#fff!important}.tyreByCarExactActions{margin-top:25px;padding-top:23px;border-top:1px solid rgba(255,255,255,.22);display:flex;justify-content:center}.tyreByCarExactActions button{min-width:190px;height:52px;padding:0 28px;border:0;border-radius:9px;background:#e21b23;color:#fff;font:800 14px/52px Inter,Arial,sans-serif;letter-spacing:.2px;text-transform:uppercase;cursor:pointer}.tyreByCarExactActions button:hover:not(:disabled){background:#c9141b}.tyreByCarExactActions button:disabled{opacity:.45;cursor:not-allowed}.tyreByCarExactActions .secondary{display:none}#exactContinue:after{content:"  →";font-size:20px;font-weight:400;vertical-align:-1px}.tyreByCarBottomSpace{height:40px;background:#fff}.tyreFinderBottomImage{width:100%;margin:0 auto;display:block;background:#fff;line-height:0}.tyreFinderBottomImage img{display:block;width:100%;height:auto;max-width:100%;margin:0 auto;object-fit:contain}
@media(max-width:800px){.tyreByCarHero{height:430px}.tyreByCarHeroInner{padding:0 18px}.tyreByCarImageCopy{top:36%;left:6%;right:6%;width:auto}.tyreByCarImageCopy .tyreByCarEyebrow{font-size:15px;margin-bottom:10px}.tyreByCarImageCopy h1{font-size:39px;letter-spacing:-1px}.tyreByCarImageCopy .tyreByCarHeroSub{margin-top:15px;max-width:100%;font-size:16px;line-height:1.5}.tyreByCarBackHome{top:18px;font-size:13px}.tyreByCarBackHome span{font-size:18px}
.tyreExactPage{padding-bottom:90px!important}.tyreByCarHero{height:430px}.tyreByCarHeroInner{padding:0 24px}.tyreByCarHeroCopy{max-width:100%;padding:52px 20px 38px}.tyreByCarHero h1{font-size:40px;letter-spacing:-1.2px}.tyreByCarHeroSub{font-size:17px}.tyreByCarFinderWrap{padding:0 16px}.tyreByCarExactPanel{width:100%;margin:-50px auto 0;padding:27px 22px 26px;border-radius:20px}.tyreByCarExactPanel h2{font-size:26px}.tyreByCarExactFields{margin-top:21px}.tyreByCarExactActions button{width:100%;height:52px}.tyreByCarBottomSpace{height:20px}}
`+`\n\n.tyreCustomSelectList,.tyreCustomSelectList *{box-sizing:border-box!important}.tyreByCarExactField .tyreCustomSelectList{background-color:#173765!important;background-image:none!important;color:#fff!important}.tyreByCarExactField .tyreCustomSelectOption{background-color:#173765!important;background-image:none!important;color:#fff!important}.tyreByCarExactField .tyreCustomSelectOption:hover,.tyreByCarExactField .tyreCustomSelectOption.selected{background-color:#214776!important;color:#fff!important}`;document.head.appendChild(s)}

window.tyresByCar=function(){
  if(typeof setNav==='function')setNav();
  addStyle();
  document.body.classList.add('tyre-by-car-page');
  const tyres=typeof db!=='undefined'&&db.tyres?db.tyres:{};
  const managedImage=tyres.findByCar&&tyres.findByCar.image?tyres.findByCar.image:'';
  const heroImage=managedImage||'/assets/tyre-ref/hero.png';
  const brands=[...(typeof db!=='undefined'&&Array.isArray(db.brands)?db.brands:[])].filter(b=>b.isRegular!==false);
  const brandList=brands.map(b=>({id:String(b.id),name:String(b.name)}));
  render(`<section class="tyreExactPage"><section class="tyreByCarHero" style="background-image:url('${esc(heroImage)}')"><div class="tyreByCarHeroInner"><button class="tyreByCarBackHome" type="button"><span>←</span> Back to home</button><div class="tyreByCarImageCopy"><p class="tyreByCarEyebrow">The right tyre. Every journey.</p><h1>Find the perfect tyres<br>for your vehicle</h1><p class="tyreByCarHeroSub">Choose your car brand and model to find the right tyres that match your vehicle and driving needs.</p></div></div></section><div class="tyreByCarFinderWrap"><section class="tyreByCarExactPanel"><div class="tyreByCarPanelHeader"><h2>Find tyre by car</h2><p class="required">Select your vehicle details to see the right tyres for your car.</p></div><div class="tyreByCarExactFields"><div class="tyreByCarExactField"><label>Brand</label><div id="brandDropdown"></div></div><div class="tyreByCarExactField" id="modelField" style="display:none"><label>Model</label><div id="modelDropdown"></div></div></div><div class="tyreByCarExactActions"><button id="exactContinue" type="button" disabled>Find Tyres</button></div></section></div><div class="tyreByCarHeroCopy" aria-hidden="true" style="display:none!important"></div><div class="tyreByCarBottomSpace" aria-hidden="true"></div><div class="tyreFinderBottomImage">${(tyres.findByCar&&tyres.findByCar.bottomImage)?`<img src="${esc(tyres.findByCar.bottomImage)}" alt="Car brands" loading="lazy">`:''}</div></section>`);
  const panel=document.querySelector('.tyreByCarExactPanel');
  const brandHost=document.getElementById('brandDropdown');
  const modelHost=document.getElementById('modelDropdown');
  const modelField=document.getElementById('modelField');
  const btn=document.getElementById('exactContinue');
  let brandValue='',modelValue='';

  function buildDropdown(host,items,placeholder,onSelect,disabled){
    host.innerHTML='';
    const wrap=document.createElement('div');
    wrap.className='tyreCustomSelect';
    const display=document.createElement('button');
    display.type='button';
    display.className='tyreCustomSelectDisplay';
    display.textContent=placeholder;
    display.disabled=!!disabled;
    display.setAttribute('aria-haspopup','listbox');
    display.setAttribute('aria-expanded','false');
    const list=document.createElement('div');
    list.className='tyreCustomSelectList';
    list.setAttribute('role','listbox');
    items.forEach(item=>{
      const option=document.createElement('button');
      option.type='button';
      option.className='tyreCustomSelectOption';
      option.textContent=item.name;
      option.setAttribute('role','option');
      option.addEventListener('click',e=>{
        e.stopPropagation();
        display.textContent=item.name;
        display.dataset.value=item.id;
        list.querySelectorAll('.tyreCustomSelectOption').forEach(x=>x.classList.remove('selected'));
        option.classList.add('selected');
        list.classList.remove('show');
        list.style.setProperty('display','none','important');
        wrap.classList.remove('open');
        display.setAttribute('aria-expanded','false');
        onSelect(item);
      });
      list.appendChild(option);
    });
    display.addEventListener('click',e=>{
      e.stopPropagation();
      if(display.disabled)return;
      document.querySelectorAll('.tyreCustomSelect.open').forEach(x=>x.classList.remove('open'));
      document.querySelectorAll('.tyreCustomSelectList.show').forEach(x=>x.classList.remove('show'));
      const opening=!wrap.classList.contains('open');
      wrap.classList.toggle('open',opening);
      list.classList.toggle('show',opening); list.style.setProperty('display',opening?'block':'none','important');
      display.setAttribute('aria-expanded',String(opening));
    });
    wrap.append(display,list);
    host.appendChild(wrap);
    return {wrap,display,list};
  }

  buildDropdown(brandHost,brandList,'Select Brand',brand=>{
    brandValue=brand.id; modelValue=''; btn.disabled=true;
    const models=(db.models||[]).filter(m=>String(m.brandId)===String(brand.id)).map(m=>({id:String(m.id),name:String(m.name)}));
    modelField.style.display=models.length?'block':'none';
    panel.classList.toggle('is-expanded',models.length>0);
    buildDropdown(modelHost,models,'Select Model',model=>{modelValue=model.id;btn.disabled=!modelValue},!models.length);
  },!brandList.length);

  document.addEventListener('click',()=>{
    document.querySelectorAll('.tyreCustomSelect.open').forEach(x=>x.classList.remove('open'));
    document.querySelectorAll('.tyreCustomSelectList.show').forEach(x=>x.classList.remove('show'));
  },{once:false});

  const backHome=document.querySelector('.tyreByCarBackHome');
  if(backHome)backHome.addEventListener('click',()=>{location.hash='#tyres';if(typeof routeTyresHash==='function')routeTyresHash();window.scrollTo({top:0,behavior:'instant'})});
  btn.addEventListener('click',()=>{
    if(brandValue&&modelValue)location.hash='tyres/by-car/'+encodeURIComponent(brandValue)+'/'+encodeURIComponent(modelValue);
  });
};

})();