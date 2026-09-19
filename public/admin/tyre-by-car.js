(function(){
'use strict';
const KEY='ap_catalog_v4';
const DEFAULT_IMAGE='/assets/tyre-ref/hero.png';
let pendingImage='';let pendingBottomImage='';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dbLocal(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function currentTyres(){return (dbLocal()||{}).tyres||{}}
function addStyles(){
 if(document.getElementById('find-tyres-admin-style'))return;
 const s=document.createElement('style');s.id='find-tyres-admin-style';s.textContent=`
 .findTyresAdminCard{margin:28px 0 0;padding:0;border:1px solid #e4e8ef;border-radius:16px;background:#fff;box-shadow:0 8px 25px rgba(7,28,65,.06);overflow:hidden}
 .findTyresAdminCard .ftaTop{padding:22px 24px;border-bottom:1px solid #e8ebf0;display:flex;align-items:center;justify-content:space-between;gap:18px}
 .findTyresAdminCard .ftaTop h3{margin:0;color:#b5121b;font-size:21px}.findTyresAdminCard .ftaTop p{margin:5px 0 0;color:#68758a;font-size:13px;line-height:1.5}
 .findTyresAdminCard .ftaEyebrow{display:block;margin-bottom:5px;color:#d71920;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
 .findTyresAdminCard .ftaBody{padding:24px}.findTyresAdminCard .ftaGrid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
 .findTyresAdminCard .ftaPreview{height:230px;border-radius:12px;overflow:hidden;background:#071c41}.findTyresAdminCard .ftaPreview img{width:100%;height:100%;display:block;object-fit:cover}
 .findTyresAdminCard .ftaFields{display:grid;gap:15px}.findTyresAdminCard .ftaLabel{display:block;margin-bottom:7px;color:#b5121b;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
 .findTyresAdminCard .ftaInput{width:100%;box-sizing:border-box;border:1px solid #d99aa0;border-radius:9px;padding:11px 12px;font:600 13px/1.3 Inter,Arial,sans-serif;background:#fff;color:#071c41}
 .findTyresAdminCard .ftaActions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px}.findTyresAdminCard button,.findTyresAdminCard .ftaUpload{min-height:42px;padding:0 16px;border-radius:8px;font:800 11px/42px Inter,Arial,sans-serif;cursor:pointer}
 .findTyresAdminCard .ftaUpload{display:inline-flex;align-items:center;background:#071c41;color:#fff}.findTyresAdminCard .ftaUpload input{display:none}
 .findTyresAdminCard .ftaSave{border:0;background:#d71920;color:#fff}.findTyresAdminCard .ftaDefault,.findTyresAdminCard .ftaBack{border:1px solid #c94b53;background:#fff;color:#b5121b}
 .findTyresAdminCard .ftaGlobalSave{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:26px;padding-top:22px;border-top:1px solid #e8ebf0}.findTyresAdminCard .ftaGlobalSaveBtn{border:0;background:#d71920;color:#fff;min-height:46px;padding:0 26px;border-radius:8px;font:800 12px/46px Inter,Arial,sans-serif;cursor:pointer}.findTyresAdminCard .ftaStatus{margin-top:11px;min-height:18px;color:#16834b;font-size:12px;font-weight:700}.findTyresAdminCard .ftaStatus.error{color:#c5161d}
 .findTyresAdminCard .ftaPending{display:none;margin-top:7px;color:#d71920;font-size:12px;font-weight:800}.findTyresAdminCard .ftaPending.show{display:block}
 .findTyresAdminDashCard{position:relative;display:flex;align-items:center;gap:14px;width:100%;box-sizing:border-box;text-align:left;cursor:pointer}
 .findTyresAdminDashCard .tyreDashArrow{margin-left:auto}
 .tyreAdminHeroCard .tyreHeroGalleryWrap{display:none!important}
 @media(max-width:850px){.findTyresAdminCard .ftaTop{display:block}.findTyresAdminCard .ftaGrid{grid-template-columns:1fr}.findTyresAdminCard .ftaPreview{height:210px}.findTyresAdminCard .ftaBody{padding:20px}}
 `;document.head.appendChild(s)
}
function makePage(){
 if(location.hash!=='#tyres/find-by-car')history.replaceState({adminTab:'tyres',tyreSubTab:'findByCar'},'', '#tyres/find-by-car');
 addStyles();
 const t=currentTyres();
 pendingImage=t.findByCar?.image||DEFAULT_IMAGE;pendingBottomImage=t.findByCar?.bottomImage||'';
 const host=document.querySelector('.tyreAdminSections');
 if(!host)return;
 host.innerHTML=`<section class="findTyresAdminCard">
   <div class="ftaTop"><div><span class="ftaEyebrow">FIND TYRES BY CAR</span><h3>Find Tyres By Car</h3><p>Manage the hero image for the public Find Tyres By Car page.</p></div><button type="button" class="ftaBack" id="ftaBack">← BACK TO HOME</button></div>
   <div class="ftaBody"><div class="ftaGrid">
     <div><div class="ftaPreview" id="ftaPreview"><img src="${esc(pendingImage)}" alt="Find Tyres By Car hero image"></div><div class="ftaActions"><label class="ftaUpload">CHANGE IMAGE<input id="ftaFile" type="file" accept="image/*"></label><button type="button" class="ftaDefault" id="ftaDefault">USE DEFAULT IMAGE</button></div><div id="ftaPending" class="ftaPending">Unsaved image change</div></div>
     <div class="ftaFields"><div><label class="ftaLabel">Current image URL</label><input id="ftaUrl" class="ftaInput" value="${esc(pendingImage)}" readonly></div><div><label class="ftaLabel">Page</label><input class="ftaInput" value="Find Tyres By Car" readonly></div></div><div class="ftaBottomImage"><div class="ftaTop" style="padding:22px 0 12px;border-bottom:0"><div><span class="ftaEyebrow">BOTTOM IMAGE</span><h3 style="font-size:18px">Bottom image</h3><p>Upload the image displayed at the bottom of this page.</p></div></div><div class="ftaGrid"><div><div class="ftaPreview" id="ftaBottomPreview">${pendingBottomImage?'<img src="${esc(pendingBottomImage)}" alt="Find Tyres By Car bottom image">':'<div style="height:100%;display:grid;place-items:center;color:#fff;font-weight:700">No bottom image selected</div>'}</div><div class="ftaActions"><label class="ftaUpload">CHANGE IMAGE<input id="ftaBottomFile" type="file" accept="image/*"></label><button type="button" class="ftaDefault" id="ftaBottomDefault">USE NO IMAGE</button></div><div id="ftaBottomPending" class="ftaPending">Unsaved bottom image change</div></div><div class="ftaFields"><div><label class="ftaLabel">Current bottom image URL</label><input id="ftaBottomUrl" class="ftaInput" value="${esc(pendingBottomImage)}" readonly></div></div></div></div>
     <div class="ftaGlobalSave"><button type="button" class="ftaGlobalSaveBtn" id="ftaGlobalSave">SAVE ALL CHANGES</button><div id="ftaGlobalStatus" class="ftaStatus"></div></div>
   </div></div>
 </section>`;
 document.getElementById('ftaBack').onclick=()=>{window.tyreAdminSubTab='dashboard';history.replaceState({adminTab:'tyres',tyreSubTab:'dashboard'},'','#tyres');if(typeof adminPanel==='function')adminPanel('tyres',true);else location.hash='#tyres'};
 document.getElementById('ftaFile').addEventListener('change',upload);
 document.getElementById('ftaDefault').addEventListener('click',()=>setPending(DEFAULT_IMAGE));
 document.getElementById('ftaBottomFile').addEventListener('change',uploadBottom);document.getElementById('ftaGlobalSave').addEventListener('click',saveAll);document.getElementById('ftaBottomDefault').addEventListener('click',()=>setPendingBottom(''));
}
function setPendingBottom(url){pendingBottomImage=url||'';const p=document.getElementById('ftaBottomPreview'),i=document.getElementById('ftaBottomUrl'),m=document.getElementById('ftaBottomPending');if(p)p.innerHTML=pendingBottomImage?'<img src="'+esc(pendingBottomImage)+'?v='+Date.now()+'" alt="Find Tyres By Car bottom image">':'<div style="height:100%;display:grid;place-items:center;color:#fff;font-weight:700">No bottom image selected</div>';if(i)i.value=pendingBottomImage;if(m)m.classList.add('show')}
async function saveBottomImage(url){pendingBottomImage=url||''}
async function saveAll(){const status=document.getElementById('ftaGlobalStatus');try{status.textContent='Saving all changes…';const base=dbLocal()||{};const t=JSON.parse(JSON.stringify(base.tyres||{}));t.findByCar={...(t.findByCar||{}),image:pendingImage||DEFAULT_IMAGE,bottomImage:pendingBottomImage||''};if(typeof saveTyreData==='function')await saveTyreData(t);else if(window.supabaseClient&&typeof window.supabaseClient.from==='function'){const {error}=await window.supabaseClient.from('tyre_page').upsert({id:true,data:t});if(error)throw error}base.tyres=t;localStorage.setItem(KEY,JSON.stringify(base));document.getElementById('ftaPending')?.classList.remove('show');document.getElementById('ftaBottomPending')?.classList.remove('show');status.textContent='All changes saved successfully.'}catch(e){console.error(e);status.textContent=e?.message||'Could not save changes.'}}
async function uploadBottom(e){const f=e.target.files?.[0];if(!f)return;const status=document.getElementById('ftaGlobalStatus');try{status.className='ftaStatus';status.textContent='Uploading image…';if(typeof uploadImage!=='function')throw new Error('Image upload service is not available.');const url=await uploadImage(f,'product-images','findByCar-bottom');setPendingBottom(url);if(status)status.textContent='Image uploaded. Press SAVE ALL CHANGES.';e.target.value=''}catch(err){console.error(err);if(status){status.className='ftaStatus error';status.textContent=err?.message||'Could not upload image.'}}}
function setPending(url){
 pendingImage=url||DEFAULT_IMAGE;
 const preview=document.getElementById('ftaPreview');const input=document.getElementById('ftaUrl');const mark=document.getElementById('ftaPending');
 if(preview)preview.innerHTML=`<img src="${esc(pendingImage)}?v=${Date.now()}" alt="Find Tyres By Car hero image">`;
 if(input)input.value=pendingImage;
 if(mark)mark.classList.add('show');
 const status=document.getElementById('ftaStatus');if(status){status.className='ftaStatus';status.textContent='';}
}
async function saveImage(url){
 const status=document.getElementById('ftaGlobalStatus');
 try{
   if(status){status.className='ftaStatus';status.textContent='Saving image…';}
   const base=dbLocal()||{};const t=JSON.parse(JSON.stringify(base.tyres||{}));t.findByCar={...(t.findByCar||{}),image:url||DEFAULT_IMAGE};
   if(typeof saveTyreData==='function')await saveTyreData(t);
   else if(window.supabaseClient&&typeof window.supabaseClient.from==='function'){
     const {error}=await window.supabaseClient.from('tyre_page').upsert({id:true,data:t});if(error)throw error;
   }
   base.tyres=t;localStorage.setItem(KEY,JSON.stringify(base));
   pendingImage=t.findByCar.image;
   document.getElementById('ftaPreview').innerHTML=`<img src="${esc(pendingImage)}?v=${Date.now()}" alt="Find Tyres By Car hero image">`;
   document.getElementById('ftaUrl').value=pendingImage;
   document.getElementById('ftaPending').classList.remove('show');
   status.textContent='Saved successfully.';
 }catch(e){console.error(e);if(status){status.className='ftaStatus error';status.textContent=e?.message||'Could not save image.'}}
}
async function upload(e){
 const f=e.target.files?.[0];if(!f)return;
 const status=document.getElementById('ftaStatus');
 try{
   status.className='ftaStatus';status.textContent='Uploading image…';
   if(typeof uploadImage!=='function')throw new Error('Image upload service is not available.');
   const url=await uploadImage(f,'product-images','find-tyres-by-car');
   setPending(url);
   status.textContent='Image uploaded. Press SAVE ALL CHANGES.';
   e.target.value='';
 }catch(err){console.error(err);status.className='ftaStatus error';status.textContent=err?.message||'Could not upload image.'}
}
function addSidebarLink(){
 const side=document.querySelector('.tyreAdminSide');
 if(!side||side.querySelector('.findTyresSideBtn'))return false;
 const buttons=[...side.querySelectorAll('.tyreSideBtn')];
 const featured=buttons.find(b=>/Featured Types/i.test(b.textContent||''));
 const btn=document.createElement('button');
 btn.type='button';
 btn.className='tyreSideBtn findTyresSideBtn'+(window.tyreAdminSubTab==='findByCar'?' active':'');
 btn.innerHTML='<span>🚗</span> Find Tyres By Car';
 btn.onclick=()=>{window.tyreAdminSubTab='findByCar';makePage();addSidebarLink();};
 if(featured)featured.insertAdjacentElement('afterend',btn);else{
   const view=buttons.find(b=>/View Tyre Website/i.test(b.textContent||''));
   if(view)view.insertAdjacentElement('beforebegin',btn);else side.appendChild(btn);
 }
 return true;
}
function findPanelGrid(){return document.querySelector('.tyreAdminDashGrid')}
function addDashboardCard(){
 const dash=findPanelGrid();
 if(!dash||dash.querySelector('.findTyresDashCard'))return false;
 const card=document.createElement('button');card.type='button';card.className='tyreDashCard findTyresDashCard findTyresAdminDashCard';
 card.innerHTML='<span class="tyreDashIcon">▣</span><div><strong>Find Tyres By Car</strong><span>Manage the Find Tyres By Car page</span></div><span class="tyreDashArrow">→</span>';
 card.onclick=()=>{window.tyreAdminSubTab='findByCar';makePage();addSidebarLink()};
 const reference=[...dash.querySelectorAll('.tyreDashCard')].find(el=>/featured|brand/i.test(el.textContent||''));
 if(reference)dash.insertBefore(card,reference.nextSibling);else dash.appendChild(card);
 return true;
}
function addPanelLink(){
 const dash=findPanelGrid();if(!dash)return;
 const existing=dash.querySelector('.findTyresDashCard');if(existing)return;
 addDashboardCard();
}
function hideOldHeroImageEditor(){const el=document.querySelector('.tyreAdminHeroCard .tyreHeroGalleryWrap');if(el)el.style.display='none'}
function observe(){addStyles();if(location.hash==='#tyres/find-by-car'){window.tyreAdminSubTab='findByCar';if(!document.querySelector('.findTyresAdminCard'))makePage()}addSidebarLink();addPanelLink();hideOldHeroImageEditor()}
const observer=new MutationObserver(observe);observer.observe(document.body,{childList:true,subtree:true});
setTimeout(observe,250);setTimeout(observe,900);setTimeout(observe,1800);setTimeout(observe,3000);
})();