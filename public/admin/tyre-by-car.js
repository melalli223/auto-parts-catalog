(function(){
'use strict';
const KEY='ap_catalog_v4';
const DEFAULT_IMAGE='/assets/tyre-ref/hero.png';
let installed=false;

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dbLocal(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function currentTyres(){return (dbLocal()||{}).tyres||{}}
function addStyles(){
 if(document.getElementById('find-tyres-admin-style'))return;
 const s=document.createElement('style');s.id='find-tyres-admin-style';s.textContent=`
 .findTyresAdminCard{margin:22px 0;padding:0;border:1px solid #e4e8ef;border-radius:18px;background:#fff;box-shadow:0 8px 25px rgba(7,28,65,.06);overflow:hidden}
 .findTyresAdminCard .ftaTop{padding:24px 26px;border-bottom:1px solid #e8ebf0;display:flex;align-items:center;justify-content:space-between;gap:18px}
 .findTyresAdminCard .ftaTop h3{margin:0;color:#071c41;font-size:22px}.findTyresAdminCard .ftaTop p{margin:6px 0 0;color:#68758a;font-size:13px;line-height:1.5}
 .findTyresAdminCard .ftaEyebrow{display:block;margin-bottom:6px;color:#d71920;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
 .findTyresAdminCard .ftaBody{padding:26px}.findTyresAdminCard .ftaGrid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:26px;align-items:start}
 .findTyresAdminCard .ftaPreview{height:250px;border-radius:14px;overflow:hidden;background:#071c41}.findTyresAdminCard .ftaPreview img{width:100%;height:100%;display:block;object-fit:cover}
 .findTyresAdminCard .ftaFields{display:grid;gap:16px}.findTyresAdminCard .ftaLabel{display:block;margin-bottom:8px;color:#071c41;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
 .findTyresAdminCard .ftaInput{width:100%;box-sizing:border-box;border:1px solid #d9dee8;border-radius:10px;padding:12px 13px;font:600 14px/1.3 Inter,Arial,sans-serif;background:#fff;color:#071c41}
 .findTyresAdminCard .ftaActions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.findTyresAdminCard button,.findTyresAdminCard .ftaUpload{min-height:44px;padding:0 17px;border-radius:9px;font:800 12px/44px Inter,Arial,sans-serif;cursor:pointer}
 .findTyresAdminCard .ftaUpload{display:inline-flex;align-items:center;background:#071c41;color:#fff}.findTyresAdminCard .ftaUpload input{display:none}
 .findTyresAdminCard .ftaSave{border:0;background:#d71920;color:#fff}.findTyresAdminCard .ftaDefault{border:1px solid #d9dee8;background:#fff;color:#071c41}.findTyresAdminCard .ftaBack{border:1px solid #d9dee8;background:#fff;color:#071c41}
 .findTyresAdminCard .ftaStatus{margin-top:12px;min-height:18px;color:#16834b;font-size:12px;font-weight:700}.findTyresAdminCard .ftaStatus.error{color:#c5161d}
 .findTyresAdminCard .ftaHelp{margin:10px 0 0;color:#7b8798;font-size:12px;line-height:1.5}
 .tyreAdminHeroCard .tyreHeroGalleryWrap{display:none!important}
 @media(max-width:850px){.findTyresAdminCard .ftaTop{display:block}.findTyresAdminCard .ftaGrid{grid-template-columns:1fr}.findTyresAdminCard .ftaPreview{height:210px}.findTyresAdminCard .ftaBody{padding:20px}}
 `;document.head.appendChild(s)
}

function makePage(){
 addStyles();
 const t=currentTyres();
 const image=t.findByCar?.image||DEFAULT_IMAGE;
 const host=document.querySelector('.tyreAdminSections');
 if(!host)return;
 host.innerHTML=`<section class="findTyresAdminCard">
   <div class="ftaTop"><div><span class="ftaEyebrow">06 · FIND TYRES BY CAR</span><h3>Find Tyres By Car</h3><p>Manage the hero image used on the public Find Tyres By Car page.</p></div><button type="button" class="ftaBack" id="ftaBack">← BACK TO TYRE PAGE</button></div>
   <div class="ftaBody"><div class="ftaGrid">
     <div><div class="ftaPreview" id="ftaPreview"><img src="${esc(image)}" alt="Find Tyres By Car hero image"></div><div class="ftaActions"><label class="ftaUpload">CHANGE IMAGE<input id="ftaFile" type="file" accept="image/*"></label><button type="button" class="ftaDefault" id="ftaDefault">USE DEFAULT IMAGE</button></div><p class="ftaHelp">Choose a wide image. The image is uploaded and saved to the tyre page immediately.</p><div id="ftaStatus" class="ftaStatus"></div></div>
     <div class="ftaFields"><div><label class="ftaLabel">Current image URL</label><input id="ftaUrl" class="ftaInput" value="${esc(image)}" readonly></div><div><label class="ftaLabel">Page</label><input class="ftaInput" value="Find Tyres By Car" readonly></div></div>
   </div></div>
 </section>`;
 document.getElementById('ftaBack').onclick=()=>{if(typeof adminPanel==='function')adminPanel('tyres');else location.hash='#tyres'};
 document.getElementById('ftaFile').addEventListener('change',upload);
 document.getElementById('ftaDefault').addEventListener('click',()=>saveImage(DEFAULT_IMAGE,'Default image restored.'));
}

async function saveImage(url,message){
 const status=document.getElementById('ftaStatus');
 try{
   status.className='ftaStatus';status.textContent='Saving image…';
   const base=dbLocal()||{};const t=JSON.parse(JSON.stringify(base.tyres||{}));t.findByCar={...(t.findByCar||{}),image:url};
   if(typeof saveTyreData==='function')await saveTyreData(t);else{base.tyres=t;localStorage.setItem(KEY,JSON.stringify(base));}
   document.getElementById('ftaPreview').innerHTML=`<img src="${esc(url)}" alt="Find Tyres By Car hero image">`;
   document.getElementById('ftaUrl').value=url;
   status.textContent=message;
 }catch(e){console.error(e);status.className='ftaStatus error';status.textContent=e?.message||'Could not save image.'}
}

async function upload(e){
 const f=e.target.files?.[0];if(!f)return;
 const status=document.getElementById('ftaStatus');
 try{
   status.className='ftaStatus';status.textContent='Uploading image…';
   if(typeof uploadImage!=='function')throw new Error('Image upload service is not available.');
   const url=await uploadImage(f,'product-images','find-tyres-by-car');
   await saveImage(url,'Image saved successfully.');
   e.target.value='';
 }catch(err){console.error(err);status.className='ftaStatus error';status.textContent=err?.message||'Could not upload image.'}
}

function addDashboardCard(){
 const dash=document.querySelector('.tyreAdminDashGrid');
 if(!dash||dash.querySelector('.findTyresDashCard'))return false;
 const card=document.createElement('button');card.type='button';card.className='tyreDashCard findTyresDashCard';card.innerHTML='<span class="tyreDashIcon">▣</span><div><strong>Find Tyres By Car</strong><span>Change the hero image used on the Find Tyres By Car page</span></div><span class="tyreDashArrow">→</span>';
 card.onclick=()=>makePage();dash.appendChild(card);return true;
}

function hideOldHeroImageEditor(){const el=document.querySelector('.tyreAdminHeroCard .tyreHeroGalleryWrap');if(el)el.style.display='none'}
function observe(){addStyles();addDashboardCard();hideOldHeroImageEditor()}
const observer=new MutationObserver(observe);observer.observe(document.body,{childList:true,subtree:true});
setTimeout(observe,250);setTimeout(observe,900);setTimeout(observe,1800);
})();