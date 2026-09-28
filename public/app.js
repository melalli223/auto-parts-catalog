// V93 footer height fix + V92 editor/brand ordering + V87 admin navigation history + V86 production hardening + backup/restore; V85 backup & restore improvements; V84 dashboard analytics; V73 stronger page transitions + reliable active header navigation; V71 social/media logos retained
const KEY='ap_catalog_v4', ADMIN='ap_admin_v4';
const SUPABASE_URL='https://kmlucqpxfsjmgsmepxqc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_G30Ylk-rtjq4BmkDtH_d_A__Xgrghj_';
let supabaseClient=null;
function initSupabase(){
  try{
    if(window.supabase && typeof window.supabase.createClient==='function'){
      supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      return true;
    }
  }catch(e){console.error('Supabase initialization failed',e)}
  return false;
}
const clone=o=>structuredClone(o);
function ensureTyreBrandIds(tyres){
 const list=Array.isArray(tyres?.brands)?tyres.brands:[];
 const used=new Set();let changed=false;
 list.forEach((x,i)=>{
  if(!x)return;
  if(x.id){used.add(String(x.id));return}
  const base='tb-'+(slug(x.name||('brand-'+(i+1)))||('brand-'+(i+1)));
  let id=base,n=2;while(used.has(id))id=base+'-'+n++;
  x.id=id;used.add(id);changed=true;
 });
 if(changed&&Array.isArray(tyres?.tyreProducts)){
  tyres.tyreProducts.forEach(p=>{
   if(!p)return;
   const raw=String(p.brandId??'').trim();
   const idx=Number(raw);
   if(Number.isInteger(idx)&&idx>=0&&idx<list.length){
    p.brandId=String(list[idx].id||'').trim();
   }
  });
 }
 return changed;
}
function ensureTyreTypeIds(tyres){
 const list=Array.isArray(tyres?.featured)?tyres.featured:[];
 const used=new Set();let changed=false;
 list.forEach((x,i)=>{
  if(!x)return;
  if(x.id){used.add(String(x.id));return}
  const base='tt-'+(slug(x.title||('type-'+(i+1)))||('type-'+(i+1)));
  let id=base,n=2;while(used.has(id))id=base+'-'+n++;
  x.id=id;used.add(id);changed=true;
 });
 return changed;
}
function ensureTyreSizeIds(tyres){
 const list=Array.isArray(tyres?.sizes)?tyres.sizes:[];
 const used=new Set();let changed=false;
 list.forEach((x,i)=>{
  if(!x)return;
  if(x.id){used.add(String(x.id));return}
  const label=String(x.label||x.name||[x.width,x.aspect,x.rim].filter(Boolean).join('/')).trim();
  const base='ts-'+(slug(label)||('size-'+(i+1)));
  let id=base,n=2;while(used.has(id))id=''+base+'-'+n++;
  x.id=id;used.add(id);changed=true;
 });
 if(changed&&Array.isArray(tyres?.tyreProducts)){
  tyres.tyreProducts.forEach(p=>{
   if(!p)return;
   const raw=String(p.sizeId??'').trim();
   const idx=Number(raw);
   if(Number.isInteger(idx)&&idx>=0&&idx<list.length){
    p.sizeId=String(list[idx].id||'').trim();
   }
  });
 }
 return changed;
}
function ensureTyreCatalogueOrder(tyres){
 const groups=[['brands','position'],['featured','position'],['sizes','position'],['tyreProducts','position']];
 let changed=false;
 for(const [key,field] of groups){
  const list=Array.isArray(tyres?.[key])?tyres[key]:[];
  const seen=new Set();
  list.forEach((x,i)=>{if(!x)return;const n=Number(x[field]);if(!Number.isInteger(n)||n<0||seen.has(n)){x[field]=i;changed=true}seen.add(Number(x[field]))});
  const sorted=list.slice().sort((x,y)=>Number(x?.[field])-Number(y?.[field]));
  sorted.forEach((x,i)=>{if(list[i]!==x||Number(x?.[field])!==i)changed=true;if(x)x[field]=i});
  tyres[key]=sorted;
 }
 return changed;
}
function moveTyreCatalogueItem(group,index,direction){
 const t=clone(db.tyres||defaultTyres),list=Array.isArray(t[group])?t[group]:[];
 const from=Number(index),to=from+Number(direction);
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=list.length||to>=list.length)return;
 ensureTyreCatalogueOrder(t);
 const ordered=t[group];[ordered[from],ordered[to]]=[ordered[to],ordered[from]];
 ordered.forEach((x,i)=>{if(x)x.position=i});
 db.tyres=t;
 adminPanel('tyres');
 toast('Order changed — click Save to apply');
}
let tyreDragState=null;
function initTyreCatalogueDrag(){
 if(window.__tyreCatalogueDragBound)return;
 window.__tyreCatalogueDragBound=true;
 document.addEventListener('pointerdown',e=>{
  const handle=e.target.closest?.('[data-tyre-drag-handle]');
  if(!handle)return;
  const row=handle.closest('[data-tyre-drag-group]');
  if(!row)return;
  const group=row.dataset.tyreDragGroup,index=Number(row.dataset.tyreDragIndex);
  if(!group||!Number.isInteger(index))return;
  const rect=row.getBoundingClientRect();
  tyreDragState={
   row,group,index,startY:e.clientY,moved:false,
   pointerOffsetY:e.clientY-rect.top,
   placeholder:null
  };
  row.classList.add('tyreDragPressed');
  document.documentElement.classList.add('tyreCatalogueDragging');
  try{handle.setPointerCapture?.(e.pointerId)}catch(_){}
 },true);

 document.addEventListener('pointermove',e=>{
  const state=tyreDragState;
  if(!state)return;

  if(!state.moved && Math.abs(e.clientY-state.startY)>6){
   state.moved=true;
   const row=state.row,rect=row.getBoundingClientRect();
   const placeholder=document.createElement('div');
   placeholder.className='tyreDragPlaceholder';
   placeholder.style.height=rect.height+'px';
   placeholder.style.width=rect.width+'px';
   placeholder.style.boxSizing='border-box';
   placeholder.style.visibility='hidden';
   row.parentNode.insertBefore(placeholder,row);
   state.placeholder=placeholder;

   row.style.position='fixed';
   row.style.left=rect.left+'px';
   row.style.top=rect.top+'px';
   row.style.width=rect.width+'px';
   row.style.zIndex='9999';
   row.style.margin='0';
   row.classList.add('tyreDragging');
  }

  if(!state.moved)return;

  const row=state.row;
  row.style.top=(e.clientY-state.pointerOffsetY)+'px';

  const candidates=[...document.querySelectorAll(
   '[data-tyre-drag-group="'+CSS.escape(state.group)+'"]'
  )].filter(r=>r!==row);

  let target=null;
  for(const candidate of candidates){
   const box=candidate.getBoundingClientRect();
   if(e.clientY < box.top+box.height/2){target=candidate;break}
  }

  if(target)target.parentNode.insertBefore(state.placeholder,target);
  else if(candidates.length)candidates[candidates.length-1].parentNode.appendChild(state.placeholder);

  document.querySelectorAll('.tyreDragTarget').forEach(x=>x.classList.remove('tyreDragTarget'));
  state.placeholder.classList.add('tyreDragTarget');
 },true);

 const finishDrag=()=>{
  const state=tyreDragState;
  if(!state)return;
  tyreDragState=null;
  const row=state.row;

  if(state.moved&&state.placeholder){
   state.placeholder.parentNode?.insertBefore(row,state.placeholder);
   state.placeholder.remove();
  }

  row.style.position='';
  row.style.left='';
  row.style.top='';
  row.style.width='';
  row.style.zIndex='';
  row.style.margin='';
  row.classList.remove('tyreDragPressed','tyreDragging');
  document.documentElement.classList.remove('tyreCatalogueDragging');
  document.querySelectorAll('.tyreDragTarget').forEach(x=>x.classList.remove('tyreDragTarget'));

  if(!state.moved)return;

  // The DOM order is the order the user just created. Convert that
  // visual order into the pending catalogue order without saving yet.
  const rows=[...document.querySelectorAll(
   '[data-tyre-drag-group="'+CSS.escape(state.group)+'"]'
  )];
  const t=clone(db.tyres||defaultTyres);
  const original=Array.isArray(t[state.group])?t[state.group]:[];
  ensureTyreCatalogueOrder(t);
  const reordered=rows.map(r=>original[Number(r.dataset.tyreDragIndex)]).filter(Boolean);
  if(reordered.length!==original.length)return;

  t[state.group]=reordered;
  t[state.group].forEach((x,i)=>{if(x)x.position=i});
  db.tyres=t;
  adminPanel('tyres');
  toast('Order changed — click Save to apply');
 };

 document.addEventListener('pointerup',finishDrag,true);
 document.addEventListener('pointercancel',finishDrag,true);
}
function initTyreSettingsSubCards(){
 const settings=document.querySelector('.tyreAdminFullPage');
 if(!settings||!settings.querySelector('#tyreHeroSection'))return;
 settings.classList.add('tyreSettingsCompact');

 const bindCard=(card,head)=>{
  if(!card||!head||card.dataset.tyreSettingsBound)return;
  card.dataset.tyreSettingsBound='1';
  card.classList.remove('tyreSubOpen');
  head.setAttribute('role','button');
  head.setAttribute('tabindex','0');
  head.setAttribute('aria-expanded','false');
  const toggle=()=>{
   const open=!card.classList.contains('tyreSubOpen');
   card.classList.toggle('tyreSubOpen',open);
   head.setAttribute('aria-expanded',String(open));
  };
  head.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle()});
  head.addEventListener('keydown',e=>{
   if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}
  });
 };

 // Main settings sections are also compact cards, matching the
 // Brands / Types / Sizes / Products admin layout. Open a section
 // first, then use its smaller subsections.
 settings.querySelectorAll('.tyreAdminCard').forEach(section=>{
  const head=section.querySelector(':scope > .tyreCardHead');
  if(head)bindCard(section,head);
 });

 // Inner settings subsections: Hero content, Find by Car, Find by Size,
 // About Us, Contact Information, etc. remain independent compact cards.
 settings.querySelectorAll('.tyreAdminSubSection').forEach(section=>{
  bindCard(section,section.querySelector('.tyreAdminSubHead'));
 });

 // Promotional panels: each individual panel is its own minimized card.
 settings.querySelectorAll('#tyrePromoSection .tyreAdminEditorItem').forEach(card=>{
  const top=card.querySelector('.tyreAdminItemTop');
  if(!top)return;
  // Use the existing top row itself as the compact header. This avoids
  // nested click targets and keeps the toggle reliable after re-renders.
  top.classList.add('tyrePromoCompactHead');
  bindCard(card,top);
 });

 // Find Tyre image uploaders: keep Car and Size as separate minimized cards.
 settings.querySelectorAll('#tyreFindImagesSection .tyreAdminSubSection').forEach(section=>{
  bindCard(section,section.querySelector('.tyreAdminSubHead'));
 });
}
function initTyreCatalogueCompactCards(){
 const mq=window.matchMedia('(max-width:650px)');
 const rows=[...document.querySelectorAll('[data-tyre-drag-group]')];
 // Reset both class and explicit state so a re-render/browser-restored DOM
 // can never leave selected cards expanded by accident.
 rows.forEach(row=>{
  row.classList.remove('tyreCompactOpen');
  row.dataset.mobileCollapsed='true';
 });
 rows.forEach(row=>{
  if(!row.dataset.tyreCompactBound){
   row.dataset.tyreCompactBound='1';
   // Mark controls so the card toggle can ignore their click without
   // blocking the control's own action or the drag handle's pointer events.
   row.querySelectorAll('.tyreOrderControls,.tyreRemoveItemBtn,[data-tyre-drag-handle]').forEach(control=>{
    control.addEventListener('pointerdown',()=>{row.dataset.skipTyreCardToggle='1';},true);
    control.addEventListener('click',()=>{row.dataset.skipTyreCardToggle='1';},true);
   });
   row.addEventListener('click',e=>{
    if(!mq.matches)return;
    if(row.dataset.skipTyreCardToggle==='1'){
     row.dataset.skipTyreCardToggle='0';
     return;
    }
    if(e.target.closest('button,input,select,textarea,a,label,[data-tyre-drag-handle],.tyreOrderControls,.tyreRemoveItemBtn'))return;
    const opening=row.dataset.mobileCollapsed!=='false';
    if(opening)collapseOtherTyreCards(row);
    row.classList.toggle('tyreCompactOpen',opening);
    row.dataset.mobileCollapsed=opening?'false':'true';
   });
  }
 });
}
function collapseOtherTyreCards(active){
 if(!window.matchMedia('(max-width:650px)').matches)return;
 document.querySelectorAll('[data-tyre-drag-group].tyreCompactOpen').forEach(row=>{
  if(row!==active)row.classList.remove('tyreCompactOpen');
 });
}
const slug=x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
function validTyreTypeId(id){const v=String(id||'').trim();return !!v&&(db.tyres?.featured||[]).some(x=>x&&String(x.id||'').trim()===v);}
const defaultCategoryNames=['Headlights','Bumpers','Mirrors','Grilles','Body Parts','Tail Lights','Hoods','Radiators & Cooling','Fenders','Doors','Fog Lights','Interior Parts','Suspension Parts','Engine Parts','Electrical Parts','Other'];
const defaults={settings:{businessName:'AUTO PARTS',tagline:'QUALITY YOU CAN TRUST',logo:'',phone:'+251 900 123 456',phone2:'',phone3:'',instagram:'',telegram:'',facebook:'',tiktok:'',youtube:'',x:'',aboutTitle:'About Our Business',aboutText:'We provide quality auto parts for a wide range of vehicles. Browse our catalog by vehicle, year and category, then contact us directly for availability and fitment.',aboutImage:'',whatsapp:'+251900123456',email:'autoparts@example.com',address:'LIDETA MENAFESHA',heroBlack:'FIND THE RIGHT',heroRed:'PARTS FOR YOUR CAR',heroDescription:'High quality parts for all makes and models.',heroImage:'',
    promoEyebrow:'AUTO PARTS',
    promoTitle:'LOOKING FOR MORE THAN TYRES?',
    promoDescription:'Explore our full range of quality auto parts for your vehicle.',
    promoButton:'EXPLORE AUTO PARTS',
    promoBackground:''},brands:[{id:'toyota',name:'Toyota',image:''},{id:'honda',name:'Honda',image:''},{id:'hyundai',name:'Hyundai',image:''},{id:'nissan',name:'Nissan',image:''},{id:'kia',name:'Kia',image:''},{id:'mercedes',name:'Mercedes-Benz',image:''},{id:'bmw',name:'BMW',image:''},{id:'ford',name:'Ford',image:''}],models:[],years:[],categories:defaultCategoryNames.map((name,i)=>({id:'cat-'+i,name,image:''})),parts:[]};
const defaultTyres={
contact:{
  aboutTitle:'About Our Business',
  aboutText:'',
  phone:'',
  phone2:'',
  phone3:'',
  whatsapp:'',
  instagram:'',
  facebook:'',
  telegram:'',
  x:'',
  contactImage:''
},
hero:{title:'FIND WHEELS & TYRES',red:'FOR ALL VEHICLE TYPES',description:'High quality tyres for better performance,\nsafety and a smoother ride.',image:'/assets/tyre-ref/hero.png',images:['/assets/tyre-ref/hero.png']},features:[{key:'winter',title:'WINTER',subtitle:'TYRES',image:'/assets/tyre-ref/feature-winter.jpg',message:'Hello, I would like to enquire about winter tyres.'},{key:'summer',title:'SUMMER',subtitle:'TYRES',image:'/assets/tyre-ref/feature-summer.jpg',message:'Hello, I would like to enquire about summer tyres.'},{key:'custom',title:'CUSTOM',subtitle:'WHEELS',image:'/assets/tyre-ref/feature-custom.jpg',message:'Hello, I would like to enquire about custom wheels.'}],brands:[{name:'Bridgestone',image:'/assets/tyre-ref/mobile-brand-1.jpg',headerImage:''},{name:'Triangle',image:'/assets/tyre-ref/mobile-brand-2.jpg',headerImage:''},{name:'Apollo',image:'/assets/tyre-ref/mobile-brand-3.jpg',headerImage:''},{name:'Michelin',image:'/assets/tyre-ref/mobile-brand-4.jpg',headerImage:''},{name:'Aeolus',image:'/assets/tyre-ref/mobile-brand-5.jpg',headerImage:''}],featured:[{id:'tt-passenger',title:'Passenger',description:'Comfort · Performance · Everyday Use',image:'/assets/featured-tyre-1.png'},{id:'tt-suv-4x4',title:'SUV / 4x4',description:'Durability · All Terrain · Adventure',image:'/assets/featured-tyre-2.png'},{id:'tt-pickup',title:'Pickup',description:'Strength · Load Capacity · Tough Roads',image:'/assets/featured-tyre-3.png'},{id:'tt-truck-commercial',title:'Truck & Commercial',description:'Heavy Duty · Long Haul · Reliability',image:'/assets/featured-tyre-4.png'}],bottomImage:'/assets/tyre-ref/mobile-bottom.jpg',promoImages:[],promoTexts:[{title:'FIND YOUR',highlight:'PERFECT TYRES',desc:'Drive with confidence.\nFind tyres made for your journey.',button:'EXPLORE TYRES',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff',align:'left'},{title:'READY FOR',highlight:'THE ROAD?',desc:'Better grip. Better comfort.\nChoose tyres built for every journey.',button:'FIND YOUR TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'},{title:'UPGRADE YOUR',highlight:'DRIVE',desc:'Discover the right fit for your vehicle.\nQuality tyres for every road.',button:'SHOP TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'},{title:'GO FURTHER WITH',highlight:'THE RIGHT TYRES',desc:'Performance and confidence start here.\nFind your ideal tyres today.',button:'BROWSE TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'}],findByCar:{image:'',homeImage:'',bottomImage:''},findByNumber:{image:'',homeImage:'',bottomImage:''},sizes:[],tyreProducts:[]};
let db=JSON.parse(localStorage.getItem(KEY)||'null')||clone(defaults);
function normalizeDb(){
 db.settings={...clone(defaults.settings),...(db.settings||{})};
 const legacyHeroImages=Array.isArray(db.settings.heroImages)?db.settings.heroImages.filter(Boolean):(db.settings.heroImage?[db.settings.heroImage]:[]);
 db.settings.heroSlides=Array.isArray(db.settings.heroSlides)&&db.settings.heroSlides.length?db.settings.heroSlides.map((x,i)=>typeof x==='string'?{image:x,black:db.settings.heroBlack||defaults.settings.heroBlack,red:db.settings.heroRed||defaults.settings.heroRed,description:db.settings.heroDescription||defaults.settings.heroDescription,align:'left'}:{...x,image:x.image||legacyHeroImages[i]||'',black:x.black??db.settings.heroBlack??defaults.settings.heroBlack,red:x.red??db.settings.heroRed??defaults.settings.heroRed,description:x.description??db.settings.heroDescription??defaults.settings.heroDescription,align:x.align||'left',titleColor:x.titleColor||'#ffffff',highlightColor:x.highlightColor||'#d71920',descColor:x.descColor||'#ffffff',button:x.button||'',buttonColor:x.buttonColor||'#ffffff'}).filter(x=>x.image):legacyHeroImages.map(x=>({image:x,black:db.settings.heroBlack||defaults.settings.heroBlack,red:db.settings.heroRed||defaults.settings.heroRed,description:db.settings.heroDescription||defaults.settings.heroDescription,align:'left',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',button:'',buttonColor:'#ffffff'}));
 db.settings.heroImages=db.settings.heroSlides.map(x=>x.image);
 db.tyres={
  ...clone(defaultTyres),
  ...(db.tyres||{}),
  contact:{
    ...clone(defaultTyres.contact),
    ...((db.tyres||{}).contact||{})
  },
  hero:{...clone(defaultTyres.hero),...((db.tyres||{}).hero||{})},findByCar:{...clone(defaultTyres.findByCar),...((db.tyres||{}).findByCar||{})},findByNumber:{...clone(defaultTyres.findByNumber),...((db.tyres||{}).findByNumber||{})},promoImages:Array.isArray(db.tyres?.promoImages)?db.tyres.promoImages.filter(Boolean):[],promoTexts:Array.isArray(db.tyres?.promoTexts)?db.tyres.promoTexts:clone(defaultTyres.promoTexts),features:Array.isArray(db.tyres?.features)&&db.tyres.features.length===3?db.tyres.features:clone(defaultTyres.features),brands:Array.isArray(db.tyres?.brands)&&db.tyres.brands.length>0?db.tyres.brands:clone(defaultTyres.brands),featured:Array.isArray(db.tyres?.featured)&&db.tyres.featured.length>0?db.tyres.featured:clone(defaultTyres.featured),featuredHeaderBackground:db.tyres?.featuredHeaderBackground||'',sizes:Array.isArray(db.tyres?.sizes)?db.tyres.sizes:[],tyreProducts:Array.isArray(db.tyres?.tyreProducts)?db.tyres.tyreProducts:[]};
 ensureTyreTypeIds(db.tyres);
 if(!db.settings.heroImage)db.settings.heroImage='';
 db.brands=Array.isArray(db.brands)?db.brands.map((b,i)=>({...b,isEv:b?.isEv===true,isRegular:b?.isRegular!==false,sortOrder:Number.isFinite(Number(b?.sortOrder))?Number(b.sortOrder):0,createdAt:b?.createdAt||''})):[];db.models=Array.isArray(db.models)?db.models:[];db.years=Array.isArray(db.years)?db.years:[];db.parts=Array.isArray(db.parts)?db.parts:[];db.branches=Array.isArray(db.branches)?db.branches:[];
 for(const p of db.parts){const ys=Array.isArray(p.years)?p.years.map(String).filter(Boolean):(p.year?[String(p.year)]:[]);p.years=[...new Set(ys)];if(!p.year&&p.years[0])p.year=p.years[0];if(p.price!==null&&p.price!==undefined&&p.price!==''){const n=Number(p.price);p.price=Number.isFinite(n)&&n>0?n:null}else p.price=null;}
 const raw=Array.isArray(db.categories)?db.categories:[];const names=[];const cats=[];
 for(const item of raw){const name=typeof item==='string'?item:String(item?.name||'').trim();if(!name||names.some(x=>x.toLowerCase()===name.toLowerCase()))continue;names.push(name);cats.push({id:item?.id||'cat-'+slug(name)+'-'+Math.random().toString(36).slice(2,6),name,image:item?.image||''})}
 for(const name of defaultCategoryNames){if(!names.some(x=>x.toLowerCase()===name.toLowerCase()))cats.push({id:'cat-'+slug(name),name,image:''})}
 for(const p of db.parts){const name=String(p.category||'').trim();if(name&&!names.some(x=>x.toLowerCase()===name.toLowerCase())){names.push(name);cats.push({id:'cat-'+slug(name)+'-'+Math.random().toString(36).slice(2,6),name,image:''})}}
 db.categories=cats;
 db.branches=db.branches.filter(br=>br&&br.categoryId&&db.categories.some(c=>c.id===br.categoryId)).map(br=>({id:br.id||'br-'+slug(br.name),categoryId:br.categoryId,name:String(br.name||'').trim(),image:br.image||''})).filter(br=>br.name);
 for(const p of db.parts){const y=String(p.year||'').trim();if(p.modelId&&y&&!db.years.some(x=>x.modelId===p.modelId&&String(x.year)===y))db.years.push({id:'y-'+Date.now()+Math.random().toString(36).slice(2,6),modelId:p.modelId,year:y})}
}
normalizeDb();
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));
save();
let admin=false;
let currentSession=null;
let onlineLoaded=false;
function isLocalCatalogPresent(){try{return !!localStorage.getItem(KEY)}catch{return false}}
function cacheDb(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){console.warn('Local cache unavailable',e)}}
async function loadRemoteDb(){
 const localTyres=clone(db.tyres||defaultTyres);
 const [settingsR,brandsR,modelsR,yearsR,catsR,branchesR,productsR,pyR,pbrR,tyreR]=await Promise.all([
  supabaseClient.from('site_settings').select('*').eq('id',true).maybeSingle(),
  supabaseClient.from('brands').select('*').or('active.eq.true,active.is.null').order('sort_order').order('name'),
  supabaseClient.from('models').select('*').or('active.eq.true,active.is.null').order('sort_order').order('name'),
  supabaseClient.from('model_years').select('*').order('year',{ascending:false}),
  supabaseClient.from('categories').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('category_branches').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('products').select('*').eq('active',true).order('sort_order').order('created_at',{ascending:false}),
  supabaseClient.from('product_years').select('*'),
  supabaseClient.from('product_branches').select('*'),
  supabaseClient.from('tyre_page').select('*').eq('id',true).maybeSingle()
 ]);
 for(const r of [settingsR,brandsR,modelsR,yearsR,catsR,branchesR,productsR,pyR,pbrR])if(r.error)throw r.error;
 const remoteTyres=(tyreR&&!tyreR.error&&tyreR.data&&tyreR.data.data)?tyreR.data.data:null;
 let tyreTypesChanged=false;let tyreSizesChanged=false;if(remoteTyres){tyreTypesChanged=ensureTyreTypeIds(remoteTyres);tyreSizesChanged=ensureTyreSizeIds(remoteTyres);}
 const settings=settingsR.data||clone(defaults.settings);
 const years=(yearsR.data||[]).map(y=>({id:y.id,modelId:y.model_id,year:String(y.year),sortOrder:Number(y.sort_order??0),createdAt:y.created_at||''}));
 const catMap=new Map((catsR.data||[]).map(c=>[c.id,c.name]));
 const yearById=new Map(years.map(y=>[y.id,String(y.year)]));const pyMap=new Map();for(const row of (pyR.data||[])){const yr=yearById.get(row.model_year_id);if(!yr)continue;if(!pyMap.has(row.product_id))pyMap.set(row.product_id,[]);pyMap.get(row.product_id).push(yr)}
 const pbMap=new Map();for(const row of (pbrR.data||[])){if(!pbMap.has(row.product_id))pbMap.set(row.product_id,[]);pbMap.get(row.product_id).push({branchId:row.branch_id,image:row.image_url||''})}
 const parts=(productsR.data||[]).map(p=>{const ys=pyMap.get(p.id)||[];const pbRows=pbMap.get(p.id)||[];const bids=[...pbRows.map(x=>x.branchId),...(p.branch_id?[p.branch_id]:[])];const branchImages=Object.fromEntries(pbRows.filter(x=>x.image).map(x=>[x.branchId,x.image]));return {id:p.id,modelId:p.model_id,years:[...new Set(ys)],year:ys[0]||'',category:catMap.get(p.category_id)||'',categoryId:p.category_id,branchId:p.branch_id||'',branchIds:[...new Set(bids.filter(Boolean))],branchImages,name:p.name,partNo:p.part_no||'',availability:p.availability||'Available on enquiry',description:p.description||'',image:p.image_url||'',price:p.price??null,active:p.active!==false,sortOrder:Number(p.sort_order??0),createdAt:p.created_at||''}});
 db={tyres:remoteTyres||localTyres,settings:{...clone(defaults.settings),businessName:settings.business_name||defaults.settings.businessName,tagline:settings.tagline||defaults.settings.tagline,logo:settings.logo_url||'',phone:settings.phone||'',phone2:settings.phone2||'',phone3:settings.phone3||'',instagram:settings.instagram_url||'',telegram:settings.telegram_url||'',facebook:settings.facebook_url||'',tiktok:settings.tiktok_url||'',youtube:settings.youtube_url||'',x:settings.x_url||'',aboutTitle:settings.about_title||defaults.settings.aboutTitle,aboutText:settings.about_content||defaults.settings.aboutText,whatsapp:settings.whatsapp||'',email:settings.email||'',address:settings.address||'',heroBlack:settings.hero_black||defaults.settings.heroBlack,heroRed:settings.hero_red||defaults.settings.heroRed,heroDescription:settings.hero_description||defaults.settings.heroDescription,heroImage:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);if(Array.isArray(a)&&a.length)return typeof a[0]==='string'?a[0]:(a[0]?.image||'');return v}catch{return v}})(),heroImages:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);return Array.isArray(a)?a.map(x=>typeof x==='string'?x:x?.image).filter(Boolean):(v?[v]:[])}catch{return v?[v]:[]}})(),heroSlides:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);if(Array.isArray(a)&&a.length)return a.map((x,i)=>typeof x==='string'?{image:x,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',button:'',buttonColor:'#ffffff'}:{...x,image:x.image||'',black:x.black??settings.hero_black??defaults.settings.heroBlack,red:x.red??settings.hero_red??defaults.settings.heroRed,description:x.description??settings.hero_description??defaults.settings.heroDescription,align:x.align||'left',titleColor:x.titleColor||'#ffffff',highlightColor:x.highlightColor||'#d71920',descColor:x.descColor||'#ffffff',button:x.button||'',buttonColor:x.buttonColor||'#ffffff'}).filter(x=>x.image);return v?[{image:v,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left'}]:[]}catch{return v?[{image:v,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left'}]:[]}})(),
    promoEyebrow:settings.promo_eyebrow||defaults.settings.promoEyebrow,
    promoTitle:settings.promo_title||defaults.settings.promoTitle,
    promoDescription:settings.promo_description||defaults.settings.promoDescription,
    promoButton:settings.promo_button||defaults.settings.promoButton,
    promoBackground:settings.promo_background_url||''},brands:(brandsR.data||[]).map(b=>({id:b.id,name:b.name,image:b.image_url||'',isEv:b.is_ev===true,isRegular:b.is_regular!==false,sortOrder:Number(b.sort_order??0),createdAt:b.created_at||''})).sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.createdAt||'').localeCompare(String(b.createdAt||''))),models:(modelsR.data||[]).map(m=>({id:m.id,brandId:m.brand_id,name:m.name,image:m.image_url||'',isEv:m.is_ev===true,tyreTypeId:m.tyre_type_id||'',sortOrder:Number(m.sort_order??0)})).sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder)||String(a.name||'').localeCompare(String(b.name||''))),years,categories:(catsR.data||[]).map(c=>({id:c.id,name:c.name,image:c.image_url||'',sortOrder:Number(c.sort_order??0)})).sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder)||String(a.name||'').localeCompare(String(b.name||''))),branches:(branchesR.data||[]).map(br=>({id:br.id,categoryId:br.category_id,name:br.name,image:br.image_url||'',sortOrder:Number(br.sort_order??0)})),parts};
 normalizeDb();
 if(remoteTyres&&(tyreTypesChanged||tyreSizesChanged||ensureTyreCatalogueOrder(db.tyres))){try{const {error}=await supabaseClient.from('tyre_page').upsert({id:true,data:db.tyres},{onConflict:'id'});if(error)console.warn('Could not persist tyre reference IDs:',error.message||error)}catch(e){console.warn('Could not persist tyre reference IDs:',e)}}
 cacheDb();window.__apCatalogDb=db;onlineLoaded=true;return db;
}
function showBoot(message='Loading catalog…'){document.querySelector('#app').innerHTML=`<div class="login"><div class="loginBox"><h2>${esc(message)}</h2><p class="muted">Connecting to the online catalog.</p></div></div>`}
function routeTyresHash(){const parts=location.hash.replace('#','').split('/');if(parts[0]!=='tyres')return false;if(parts[1]==='brand'&&parts[2]!==undefined){tyreBrandPage(+parts[2]);return true}if(parts[1]==='type'&&parts[2]!==undefined){tyreTypePage(parts[2]);return true}if(parts[1]==='contact'){tyreContactPage();return true}
if(parts[1]==='by-car'){if(typeof window.tyresByCar==='function'){window.tyresByCar()}else{setTimeout(routeTyresHash,50)}return true}
if(parts[1]==='by-size'){if(typeof window.tyresByNumber==='function'){window.tyresByNumber()}else{setTimeout(routeTyresHash,50)}return true}tyres();return true}
window.addEventListener('hashchange',()=>{const h=location.hash||'';if(/^#?tyres(?:\/|$)/.test(h))routeTyresHash()});
function routeCustomerHash(){
 const h=(location.hash||'').replace(/^#/,'').split('/');
 if(!h[0]){home();return true}
 if(h[0]==='brands'){brands(false);return true}
 if(h[0]==='ev'){brands(true);return true}
 if(h[0]==='categories'){parts(false);return true}
 if(h[0]==='about'){about();return true}
 if(h[0]==='contact'){contact();return true}
 return false;
}
window.addEventListener('hashchange',()=>{
 const h=location.hash||'';
 if(/^#?tyres(?:\/|$)/.test(h))routeTyresHash();
 else if(/^(#?(?:brands|ev|categories|about|contact))(?:\/|$)/.test(h))routeCustomerHash();
});

async function bootCustomer(){
  showBoot();
  const initialHash=location.hash||'';
  const isTyreFindRoute=/^#tyres\/by-(?:car|size)(?:\/|$)/.test(initialHash);
  const initialCustomerRoute=/^#(?:brands|ev|categories|about|contact)(?:\/|$)/.test(initialHash);
  const landOnTyres=initialHash.replace('#','').split('/')[0]==='tyres';
  const restoreInitialTyreFindRoute=()=>{
    if(!isTyreFindRoute)return false;
    if(location.hash!==initialHash)location.hash=initialHash;
    const p=initialHash.replace(/^#/,'').split('/');
    if(p[1]==='by-car'&&typeof window.tyresByCar==='function'){window.tyresByCar();return true}
    if(p[1]==='by-size'&&typeof window.tyresByNumber==='function'){window.tyresByNumber();return true}
    setTimeout(restoreInitialTyreFindRoute,50);
    return true;
  };
  if(!initSupabase()){
    if(isTyreFindRoute)restoreInitialTyreFindRoute();else if(landOnTyres)routeTyresHash();else if(initialCustomerRoute)routeCustomerHash();else home();
    toast('Online connection library could not load. Showing local catalog.');
    return;
  }
  try{await loadRemoteDb();if(isTyreFindRoute)restoreInitialTyreFindRoute();else if(landOnTyres)routeTyresHash();else if(initialCustomerRoute)routeCustomerHash();else home()}
  catch(e){
    console.error(e);onlineLoaded=false;
    try{const cached=localStorage.getItem(KEY);if(cached){db=JSON.parse(cached);normalizeDb();if(isTyreFindRoute)restoreInitialTyreFindRoute();else if(landOnTyres)routeTyresHash();else if(initialCustomerRoute)routeCustomerHash();else home();toast('Online catalog unavailable — showing cached data')}else{if(isTyreFindRoute)restoreInitialTyreFindRoute();else if(landOnTyres)routeTyresHash();else if(initialCustomerRoute)routeCustomerHash();else home();toast('Online catalog is empty or unavailable')}}
    catch{if(isTyreFindRoute)restoreInitialTyreFindRoute();else if(landOnTyres)routeTyresHash();else if(initialCustomerRoute)routeCustomerHash();else home();toast('Could not load catalog')}
  }
}
async function bootAdmin(){
  showBoot('Checking admin access…');
  if(!initSupabase()){login('The online connection library could not load. Please refresh the page.');return;}
  const {data:{session},error}=await supabaseClient.auth.getSession();
  if(error){console.error(error);return login(error.message||'Could not check your session')}
  currentSession=session;if(!session)return login();
  const {data:row,error:adminErr}=await supabaseClient.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();
  if(adminErr||!row){await supabaseClient.auth.signOut();currentSession=null;return login('Your account is not authorized as an admin.')}
  admin=true;
  const tyreAdminRoute=isTyreAdminRoute();
  const requested=(location.hash||'#dashboard').slice(1)||'dashboard';
  if(tyreAdminRoute){
    const allowed=['dashboard','settings','brands','featured','sizes','products','by-car','by-number'];
    tyreAdminSubTab=allowed.includes(requested)?requested:'dashboard';
  }
  const autoPartTabs=['dashboard','enquiries','brands','models','years','categories','products','settings','backup'];
  const initialAdminTab=tyreAdminRoute?'tyres':(autoPartTabs.includes(requested)?requested:'dashboard');
  try{
    await loadRemoteDb();
    adminPanel(initialAdminTab);
  }catch(e){
    console.error(e);
    toast('Connected to login, but catalog data could not be loaded');
    adminPanel(initialAdminTab);
  }
}
function fileData(f){return f?new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)}):Promise.resolve('')}
function dataUrlToBlob(dataUrl){const m=String(dataUrl||'').match(/^data:([^;,]+)?(?:;base64)?,(.*)$/);if(!m)return null;const mime=m[1]||'application/octet-stream';const bin=atob(m[2]);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type:mime})}
let __editedImages={};
let __imageEditorState=null;
function openImageEditor(event,inputId){
 const file=event.target.files?.[0]; if(!file)return;
 if(!file.type.startsWith('image/'))return toast('Please select an image');
 const reader=new FileReader();
 reader.onload=()=>{const img=new Image();img.onload=()=>showImageEditor(img,inputId,file.name,file.type);img.src=reader.result};
 reader.readAsDataURL(file);
}
function showImageEditor(img,inputId,fileName,mime='image/jpeg'){
 __imageEditorState={img,inputId,fileName,mime,flipX:false,flipY:false,crop:null,drag:null,handle:null,startCrop:null,startPoint:null};
 document.querySelector('#imageEditorModal')?.remove();
 const d=document.createElement('div');d.className='modal imageEditorModal';d.id='imageEditorModal';
 d.innerHTML=`<div class="imageEditorShell"><header class="imageEditorHeader"><button type="button" class="imageEditorAction imageEditorCancel" onclick="closeImageEditor()">Cancel</button><strong>Crop</strong><button type="button" class="imageEditorAction imageEditorSave" onclick="applyImageEdit()">Save</button></header><main class="imageEditorStage"><div class="imageEditorCanvasWrap"><canvas id="imageEditorCanvas" class="imageEditorCanvas"></canvas></div></main><nav class="imageEditorToolbar"><button type="button" onclick="imageEditFlip('x')"><span>↔</span><small>Flip</small></button><button type="button" onclick="imageEditFlip('y')"><span>↕</span><small>Flip</small></button><button type="button" onclick="imageEditReset()"><span>⌗</span><small>Reset Crop</small></button><button type="button" onclick="imageEditResetAll()"><span>↶</span><small>Reset All</small></button></nav></div>`;
 document.body.appendChild(d);
 setTimeout(initImageEditorCanvas,0);
}
function closeImageEditor(){window.removeEventListener('resize',resizeImageEditorCanvas);document.querySelector('#imageEditorModal')?.remove();__imageEditorState=null;}
function imageEditResetAll(){const s=__imageEditorState;if(!s)return;s.flipX=false;s.flipY=false;imageEditReset()}
function imageEditFlip(axis){if(!__imageEditorState)return;__imageEditorState[axis==='x'?'flipX':'flipY']=!__imageEditorState[axis==='x'?'flipX':'flipY'];drawImageEditor()}
function imageEditReset(){const s=__imageEditorState;if(!s)return;Object.assign(s,{drag:null,handle:null});const c=document.querySelector('#imageEditorCanvas');s.crop=c?{x:0,y:0,w:c.width,h:c.height}:null;drawImageEditor()}
function initImageEditorCanvas(){
 const c=document.querySelector('#imageEditorCanvas');if(!c||!__imageEditorState)return;
 const wrap=c.parentElement,stage=wrap?.parentElement;
 const img=__imageEditorState.img,ratio=(img.naturalWidth||img.width)/(img.naturalHeight||img.height);
 const availW=Math.max(240,(stage?.clientWidth||window.innerWidth)-20);
 const availH=Math.max(220,(stage?.clientHeight||window.innerHeight)-10);
 let w=availW,h=w/ratio;if(h>availH){h=availH;w=h*ratio}
 c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));c.style.width=w+'px';c.style.height=h+'px';
 __imageEditorState.crop={x:0,y:0,w:c.width,h:c.height};
 c.onpointerdown=imageEditorPointerDown;c.onpointermove=imageEditorPointerMove;c.onpointerup=imageEditorPointerUp;c.onpointercancel=imageEditorPointerUp;c.onpointerleave=()=>{if(!__imageEditorState?.drag&&!__imageEditorState?.handle)c.style.cursor='default'};
 drawImageEditor();
 window.addEventListener('resize',resizeImageEditorCanvas,{passive:true});
}
function resizeImageEditorCanvas(){
 const s=__imageEditorState,c=document.querySelector('#imageEditorCanvas'),stage=c?.parentElement?.parentElement;if(!s||!c||!stage)return;
 const oldW=c.width||1,oldH=c.height||1,ratio=(s.img.naturalWidth||s.img.width)/(s.img.naturalHeight||s.img.height);
 const availW=Math.max(240,stage.clientWidth-20),availH=Math.max(220,stage.clientHeight-10);let w=availW,h=w/ratio;if(h>availH){h=availH;w=h*ratio}
 const sx=w/oldW,sy=h/oldH;c.width=Math.round(w);c.height=Math.round(h);c.style.width=w+'px';c.style.height=h+'px';
 if(s.crop)s.crop={x:s.crop.x*sx,y:s.crop.y*sy,w:s.crop.w*sx,h:s.crop.h*sy};drawImageEditor();
}
function editorCanvasPoint(e){const c=document.querySelector('#imageEditorCanvas'),r=c.getBoundingClientRect();return{x:Math.max(0,Math.min(c.width,(e.clientX-r.left)*(c.width/r.width))),y:Math.max(0,Math.min(c.height,(e.clientY-r.top)*(c.height/r.height)))}}
function cropHandleAt(p,crop){
 const z=Math.max(18,Math.min(30,Math.min(crop.w,crop.h)*.06)), edge=Math.max(12,z*.72);
 const near=(a,b)=>Math.abs(a-b)<=z;
 if(near(p.x,crop.x)&&near(p.y,crop.y))return'nw';if(near(p.x,crop.x+crop.w)&&near(p.y,crop.y))return'ne';if(near(p.x,crop.x)&&near(p.y,crop.y+crop.h))return'sw';if(near(p.x,crop.x+crop.w)&&near(p.y,crop.y+crop.h))return'se';
 if(Math.abs(p.y-crop.y)<=edge&&p.x>crop.x+edge&&p.x<crop.x+crop.w-edge)return'n';
 if(Math.abs(p.y-(crop.y+crop.h))<=edge&&p.x>crop.x+edge&&p.x<crop.x+crop.w-edge)return's';
 if(Math.abs(p.x-crop.x)<=edge&&p.y>crop.y+edge&&p.y<crop.y+crop.h-edge)return'w';
 if(Math.abs(p.x-(crop.x+crop.w))<=edge&&p.y>crop.y+edge&&p.y<crop.y+crop.h-edge)return'e';
 return null;
}
function editorCursorFor(h){return h==='nw'||h==='se'?'nwse-resize':h==='ne'||h==='sw'?'nesw-resize':h==='n'||h==='s'?'ns-resize':h==='e'||h==='w'?'ew-resize':'move'}
function imageEditorPointerDown(e){
 const s=__imageEditorState;if(!s)return;const p=editorCanvasPoint(e),c=s.crop;const h=cropHandleAt(p,c);
 if(h){s.handle=h;s.startCrop={...c};s.startPoint=p}else if(p.x>=c.x&&p.x<=c.x+c.w&&p.y>=c.y&&p.y<=c.y+c.h){s.drag='move';s.startCrop={...c};s.startPoint=p}else{return}
 e.currentTarget.setPointerCapture?.(e.pointerId);e.currentTarget.style.cursor=editorCursorFor(h||'move');drawImageEditor()
}
function imageEditorPointerMove(e){
 const s=__imageEditorState,c=document.querySelector('#imageEditorCanvas');if(!s||!c)return;const p=editorCanvasPoint(e),cur=cropHandleAt(p,s.crop);
 if(!s.drag&&!s.handle){c.style.cursor=editorCursorFor(cur||'');return}
 const base=s.startCrop,sp=s.startPoint,W=c.width,H=c.height,min=24;let x=base.x,y=base.y,w=base.w,h=base.h,dx=p.x-sp.x,dy=p.y-sp.y;
 if(s.drag==='move'){x=Math.max(0,Math.min(W-w,base.x+dx));y=Math.max(0,Math.min(H-h,base.y+dy))}
 else if(s.handle){
  if(s.handle.includes('w')){x=Math.max(0,Math.min(base.x+base.w-min,base.x+dx));w=base.x+base.w-x}
  if(s.handle.includes('e')){w=Math.max(min,Math.min(W-base.x,base.w+dx))}
  if(s.handle.includes('n')){y=Math.max(0,Math.min(base.y+base.h-min,base.y+dy));h=base.y+base.h-y}
  if(s.handle.includes('s')){h=Math.max(min,Math.min(H-base.y,base.h+dy))}
 }
 s.crop={x,y,w,h};drawImageEditor()
}
function imageEditorPointerUp(){const s=__imageEditorState;if(!s)return;s.drag=null;s.handle=null;s.startCrop=null;s.startPoint=null;const c=document.querySelector('#imageEditorCanvas');if(c)c.style.cursor='default';drawImageEditor()}
function drawImageEditor(){
 const s=__imageEditorState,c=document.querySelector('#imageEditorCanvas');if(!s||!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
 ctx.fillStyle='#202020';ctx.fillRect(0,0,c.width,c.height);
 ctx.save();ctx.translate(c.width/2,c.height/2);ctx.scale(s.flipX?-1:1,s.flipY?-1:1);ctx.drawImage(s.img,-c.width/2,-c.height/2,c.width,c.height);ctx.restore();
 const d=s.crop;if(!d)return;
 // Dim only the area outside the crop. The image inside the crop remains fully visible.
 ctx.save();ctx.fillStyle='rgba(0,0,0,.42)';
 ctx.fillRect(0,0,c.width,d.y);ctx.fillRect(0,d.y+d.h,c.width,c.height-(d.y+d.h));
 ctx.fillRect(0,d.y,d.x,d.h);ctx.fillRect(d.x+d.w,d.y,c.width-(d.x+d.w),d.h);
 ctx.strokeStyle='rgba(255,255,255,.98)';ctx.lineWidth=2;ctx.strokeRect(d.x+1,d.y+1,d.w-2,d.h-2);
 ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1;
 [1,2].forEach(i=>{const xx=d.x+d.w*i/3,yy=d.y+d.h*i/3;ctx.beginPath();ctx.moveTo(xx,d.y);ctx.lineTo(xx,d.y+d.h);ctx.stroke();ctx.beginPath();ctx.moveTo(d.x,yy);ctx.lineTo(d.x+d.w,yy);ctx.stroke()});
 const len=Math.min(34,Math.max(22,Math.min(d.w,d.h)*.09));ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.lineCap='square';
 const corners=[[d.x,d.y,1,1],[d.x+d.w,d.y,-1,1],[d.x,d.y+d.h,1,-1],[d.x+d.w,d.y+d.h,-1,-1]];
 corners.forEach(([x,y,dx,dy])=>{ctx.beginPath();ctx.moveTo(x+dx*len,y);ctx.lineTo(x,y);ctx.lineTo(x,y+dy*len);ctx.stroke()});
 ctx.restore();
}
async function applyImageEdit(){
 const s=__imageEditorState;if(!s)return;
 try{
  const c=document.querySelector('#imageEditorCanvas');if(!c)throw new Error('Editor is not ready');
  const base=document.createElement('canvas'),out=document.createElement('canvas');
  const iw=s.img.naturalWidth,ih=s.img.naturalHeight,max=1800;let bw=iw,bh=ih;
  if(Math.max(bw,bh)>max){const k=max/Math.max(bw,bh);bw=Math.round(bw*k);bh=Math.round(bh*k)}
  base.width=bw;base.height=bh;const b=base.getContext('2d');b.save();b.translate(bw/2,bh/2);b.scale(s.flipX?-1:1,s.flipY?-1:1);b.drawImage(s.img,-bw/2,-bh/2,bw,bh);b.restore();
  let sx=0,sy=0,sw=bw,sh=bh;
  if(s.crop){sx=Math.round(s.crop.x/c.width*bw);sy=Math.round(s.crop.y/c.height*bh);sw=Math.round(s.crop.w/c.width*bw);sh=Math.round(s.crop.h/c.height*bh);sx=Math.max(0,Math.min(bw-1,sx));sy=Math.max(0,Math.min(bh-1,sy));sw=Math.max(1,Math.min(bw-sx,sw));sh=Math.max(1,Math.min(bh-sy,sh))}
  out.width=sw;out.height=sh;out.getContext('2d').drawImage(base,sx,sy,sw,sh,0,0,sw,sh);
  const outMime=String(s.mime||'').toLowerCase().includes('png')?'image/png':'image/jpeg';
  const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error('Could not create edited image')),outMime,outMime==='image/png'?undefined:.92));
  __editedImages[s.inputId]=blob;const input=document.querySelector('#'+s.inputId);
  if(input){let box=input.parentElement.querySelector('.editedImagePreview');if(!box){box=document.createElement('div');box.className='editedImagePreview';input.parentElement.appendChild(box)}const url=URL.createObjectURL(blob);box.innerHTML=`<img src="${url}" alt="Edited preview"><span>Edited image ready • will upload when you save</span><button type="button" class="ghost" onclick="openImageEditorForExisting('${s.inputId}')">EDIT AGAIN</button>`}
  closeImageEditor();toast('Image edited and ready to upload');
 }catch(e){console.error(e);toast(e.message||'Could not edit image')}
}
function openImageEditorForExisting(inputId){const blob=__editedImages[inputId],input=document.querySelector('#'+inputId);if(!blob||!input)return;const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>showImageEditor(img,inputId,'Edited image',blob.type||'image/png');img.src=reader.result};reader.readAsDataURL(blob)}
function editedImage(inputId){return __editedImages[inputId]||document.querySelector('#'+inputId)?.files?.[0]||null}

async function uploadImage(input,bucket,folder='catalog'){
 if(!input)return '';
 let blob=input instanceof Blob?input:dataUrlToBlob(input);if(!blob)throw new Error('Invalid image data');
 const ext=(blob.type||'image/jpeg').split('/')[1]?.replace('jpeg','jpg')||'jpg';
 const path=`${folder}/${crypto.randomUUID()}.${ext}`;
 const {error}=await supabaseClient.storage.from(bucket).upload(path,blob,{contentType:blob.type||'image/jpeg',upsert:false});if(error)throw error;
 return supabaseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
async function removeImageUrl(url,bucket){try{const marker=`/${bucket}/`;const i=String(url||'').indexOf(marker);if(i<0)return;const path=String(url).slice(i+marker.length).split('?')[0];if(path)await supabaseClient.storage.from(bucket).remove([path])}catch(e){console.warn('Image cleanup failed',e)}}
function bucketFor(kind){return ({logo:'logos',hero:'hero',brand:'brand-images',model:'model-images',category:'category-images',product:'product-images'})[kind]}
async function requireAdmin(){const {data:{session}}=await supabaseClient.auth.getSession();if(!session){admin=false;login();return null}const {data:row}=await supabaseClient.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();if(!row){admin=false;await supabaseClient.auth.signOut();login('Your account is not authorized as an admin.');return null}return session}
async function migrateLocalCatalog(){
 const raw=localStorage.getItem(KEY);if(!raw)return toast('No local catalog found to migrate');let local;try{local=JSON.parse(raw)}catch{return toast('Local catalog backup is invalid')};normalizeDb();
 const oldBrands=Array.isArray(local.brands)?local.brands:[],oldModels=Array.isArray(local.models)?local.models:[],oldYears=Array.isArray(local.years)?local.years:[],oldCats=Array.isArray(local.categories)?local.categories:[],oldParts=Array.isArray(local.parts)?local.parts:[];
 const brandMap=new Map(),modelMap=new Map(),yearMap=new Map(),catMap=new Map(),productMap=new Map();
 try{
  toast('Migration started…');
  for(const b of oldBrands){let existing=await supabaseClient.from('brands').select('id').eq('name',b.name).maybeSingle();if(existing.error)throw existing.error;if(existing.data){brandMap.set(b.id,existing.data.id);continue}const id=crypto.randomUUID();let image='';if(b.image&&!String(b.image).startsWith('http'))image=await uploadImage(b.image,'brand-images','migrated');else image=b.image||'';const {error}=await supabaseClient.from('brands').insert({id,name:b.name,image_url:image,sort_order:0,active:true});if(error)throw error;brandMap.set(b.id,id)}
  for(const m of oldModels){const bid=brandMap.get(m.brandId);if(!bid)continue;let existing=await supabaseClient.from('models').select('id').eq('brand_id',bid).eq('name',m.name).maybeSingle();if(existing.error)throw existing.error;if(existing.data){modelMap.set(m.id,existing.data.id);continue}const id=crypto.randomUUID();let image='';if(m.image&&!String(m.image).startsWith('http'))image=await uploadImage(m.image,'model-images','migrated');else image=m.image||'';const {error}=await supabaseClient.from('models').insert({id,brand_id:bid,name:m.name,image_url:image,sort_order:0,active:true});if(error)throw error;modelMap.set(m.id,id)}
  for(const c of oldCats){const id=crypto.randomUUID();let image='';if(c.image&&!String(c.image).startsWith('http'))image=await uploadImage(c.image,'category-images','migrated');else image=c.image||'';const {error}=await supabaseClient.from('categories').insert({id,name:c.name,image_url:image,sort_order:0,active:true});if(error){if(error.code==='23505'){const {data}=await supabaseClient.from('categories').select('id').ilike('name',c.name).maybeSingle();if(data)catMap.set(c.id,data.id);continue}throw error}catMap.set(c.id,id)}
  for(const y of oldYears){const mid=modelMap.get(y.modelId);if(!mid)continue;const yr=Number(y.year);if(!Number.isInteger(yr))continue;const id=crypto.randomUUID();const {error}=await supabaseClient.from('model_years').insert({id,model_id:mid,year:yr,sort_order:db.years.filter(x=>x.modelId===mid).length});if(error&&error.code!=='23505')throw error;const {data}=await supabaseClient.from('model_years').select('id').eq('model_id',mid).eq('year',yr).maybeSingle();if(data)yearMap.set(y.id,data.id)}
  for(const p of oldParts){const mid=modelMap.get(p.modelId);if(!mid)continue;let cid=catMap.get(p.categoryId);if(!cid){const cat=oldCats.find(c=>c.name===p.category);if(cat)cid=catMap.get(cat.id)}if(!cid){const {data}=await supabaseClient.from('categories').select('id').ilike('name',p.category||'Other').maybeSingle();cid=data?.id}if(!cid)continue;let existing=await supabaseClient.from('products').select('id').eq('model_id',mid).eq('category_id',cid).eq('name',p.name).maybeSingle();if(existing.error)throw existing.error;let id=existing.data?.id;if(!id){id=crypto.randomUUID();let image='';if(p.image&&!String(p.image).startsWith('http'))image=await uploadImage(p.image,'product-images','migrated');else image=p.image||'';const {error}=await supabaseClient.from('products').insert({id,model_id:mid,category_id:cid,name:p.name,part_no:p.partNo||null,availability:p.availability||'Available on enquiry',description:p.description||null,image_url:image,active:true});if(error)throw error;}productMap.set(p.id,id);for(const y of (Array.isArray(p.years)?p.years:(p.year?[p.year]:[]))){const yr=Number(y);if(!Number.isInteger(yr))continue;let yid;const oldY=oldYears.find(x=>x.modelId===p.modelId&&String(x.year)===String(y));if(oldY)yid=yearMap.get(oldY.id);if(!yid){const {data}=await supabaseClient.from('model_years').select('id').eq('model_id',mid).eq('year',yr).maybeSingle();yid=data?.id}if(yid){const {error:pyErr}=await supabaseClient.from('product_years').insert({product_id:id,model_year_id:yid});if(pyErr&&pyErr.code!=='23505')throw pyErr}}
  }
  const st=local.settings||{};let logo=st.logo||'',hero=st.heroImage||'';if(logo&&!String(logo).startsWith('http'))logo=await uploadImage(logo,'logos','migrated');if(hero&&!String(hero).startsWith('http')&&!String(hero).startsWith('assets/'))hero=await uploadImage(hero,'hero','migrated');const settings={id:true,business_name:st.businessName||defaults.settings.businessName,tagline:st.tagline||defaults.settings.tagline,logo_url:logo||null,phone:st.phone||null,phone2:st.phone2||null,phone3:st.phone3||null,instagram_url:st.instagram||null,telegram_url:st.telegram||null,facebook_url:st.facebook||null,tiktok_url:st.tiktok||null,youtube_url:st.youtube||null,x_url:st.x||null,whatsapp:st.whatsapp||null,email:st.email||null,address:st.address||null,hero_black:st.heroBlack||defaults.settings.heroBlack,hero_red:st.heroRed||defaults.settings.heroRed,hero_description:st.heroDescription||defaults.settings.heroDescription,hero_image_url:hero||null};const {error:se}=await supabaseClient.from('site_settings').upsert(settings,{onConflict:'id'});if(se)throw se;
  await loadRemoteDb();toast('Local catalog migrated to the online database');adminPanel('dashboard');
 }catch(e){console.error(e);toast('Migration stopped: '+(e.message||'unknown error'))}
}
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const catByName=n=>db.categories.find(c=>c.name===n);
const branchesForCategory=cid=>db.branches.filter(br=>br.categoryId===cid);
const branchById=id=>db.branches.find(br=>br.id===id);
const productBranchIds=p=>[...(Array.isArray(p.branchIds)?p.branchIds:[]),...(p.branchId?[p.branchId]:[])].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);
const productHasBranch=(p,bid)=>productBranchIds(p).includes(bid);
const productBranchImage=(p,bid)=>p?.branchImages?.[bid]||p?.image||'';
async function mirrorImage(blob){return await new Promise((resolve,reject)=>{const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{try{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.translate(c.width,0);ctx.scale(-1,1);ctx.drawImage(img,0,0);c.toBlob(b=>{URL.revokeObjectURL(url);b?resolve(b):reject(new Error('Could not create mirrored image'))},blob.type||'image/jpeg',0.92)}catch(e){URL.revokeObjectURL(url);reject(e)}};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not read image'))};img.src=url})}
const uniqueProducts=list=>{const seen=new Set();return list.filter(p=>{const key=[p.modelId,p.categoryId||p.category,(p.name||'').trim().toLowerCase(),(p.partNo||'').trim().toLowerCase(),p.image||''].join('|');if(seen.has(key))return false;seen.add(key);return true})};
const parseMoney=v=>{const n=Number(String(v??'').replace(/,/g,'').trim());return Number.isFinite(n)&&n>=0?n:null};
function formatMoneyInput(el){const raw=String(el.value||'').replace(/,/g,'').replace(/[^0-9.]/g,'');const parts=raw.split('.');const whole=parts[0]||'';const dec=parts.length>1?'.'+parts.slice(1).join('').slice(0,2):'';el.value=whole?Number(whole).toLocaleString()+dec:'';}
const hasPrice=p=>p?.price!=null&&p?.price!==''&&Number.isFinite(Number(p.price))&&Number(p.price)>0;
const priceDisplay=p=>hasPrice(p)?Number(p.price).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}):'';
const modelYears=mid=>[...new Set(db.years.filter(y=>y.modelId===mid).map(y=>String(y.year).trim()).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
const productYears=p=>Array.isArray(p.years)?p.years.map(String):(p.year?[String(p.year)]:[]);
const productMatchesYear=(p,y)=>productYears(p).includes(String(y));
const isCustomerVisibleProduct=p=>{if(p?.active===false)return false;const a=String(p?.availability||'Available on enquiry').trim().toLowerCase();return a==='in stock'||a==='available on enquiry';};
function toast(msg){const t=document.querySelector('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
function fileData(f){return f?new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)}):Promise.resolve('')}
function placeholder(text='IMAGE'){return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="480"><rect width="100%" height="100%" fill="#fff"/><rect x="16" y="16" width="668" height="448" rx="10" fill="none" stroke="#e8eaec"/><circle cx=350 cy=205 r=72 fill="#f8f9fa" stroke="#dfe3e6" stroke-width=3/><text x="350" y="220" text-anchor="middle" fill="#7d858b" font-family="Arial" font-size="38" font-weight="700">${esc(String(text).slice(0,1).toUpperCase())}</text><text x="350" y="315" text-anchor="middle" fill="#8b9298" font-family="Arial" font-size="24" font-weight="700">${esc(text)}</text></svg>`)}
function logo(){return db.settings.logo?`<img src="${db.settings.logo}" alt="${esc(db.settings.businessName)} logo">`:`<div class="logoFallback"><b>${esc(db.settings.businessName)}</b><small>${esc(db.settings.tagline)}</small></div>`}
function isAdminRoute(){const p=location.pathname.replace(/\/+$/,'');return p==='/admin'||p.endsWith('/admin.html')||p.endsWith('/admin')||p.endsWith('/admin/tyres.html')||p.endsWith('/admin/tyres')}
function isTyreAdminRoute(){const p=location.pathname.replace(/\/+$/,'');return p.endsWith('/admin/tyres.html')||p.endsWith('/admin/tyres')}
let currentNav='home';
function navSection(){return currentNav;}
function setNav(name){currentNav=name;}

function header(overHero=false){
 if(isAdminRoute())return '';
 const active=navSection();
 const on=(name)=>active===name?' active':'';
 const heroBg=db.settings.heroImage||""; return `<header class="siteHeader ${overHero?"heroHeaderOverlay ":"innerPageHeader "}${heroBg&&overHero?"hasHeaderImage":""}" ${heroBg?`style="background-image:url('${esc(heroBg)}')"`:""}><div class="nav"><a class="logo" href="./" aria-label="Home" onclick="navigateFromHeader('home',this,event)">${logo()}</a><nav aria-label="Main navigation"><button class="${on('home')}" data-nav="home" onclick="navigateFromHeader('home',this,event)">HOME</button><button class="${on('brands')}" data-nav="brands" onclick="navigateFromHeader('brands',this,event)">BRANDS</button><button class="${on('ev')}" data-nav="ev" onclick="navigateFromHeader('ev',this,event)">EV</button><button class="${on('categories')}" data-nav="categories" onclick="navigateFromHeader('categories',this,event)">CATEGORIES</button><button class="${on('contact')}" data-nav="contact" onclick="navigateFromHeader('contact',this,event)">CONTACT</button><button class="searchBtn" data-nav="categories" onclick="navigateFromHeader('search',this,event)" aria-label="Search">⌕</button></nav></div></header>`
}
function navigateFromHeader(target,button,event){
 if(event){event.preventDefault();event.stopPropagation();}
 if(button){
   button.classList.remove('navPress');
   void button.offsetWidth;
   button.classList.add('navPress');
 }
 clearTimeout(window.__navTimer);
 window.__navTimer=setTimeout(()=>{
   if(target==='home')home();
   else if(target==='brands')brands();
   else if(target==='ev'){
     brands(true);
   }
   else if(target==='categories')parts();
   else if(target==='search')parts(true);
   else if(target==='about')about();
   else if(target==='contact')contact();
 },40);
}
function render(content){
 const app=document.querySelector('#app');
 if(!app)return;
 const draw=()=>{
   app.classList.remove('page-enter','page-leave');
   void app.offsetWidth;
   app.innerHTML=`${content.includes('autoPartsHero')?'':header(false)}<main class="container site-main ${isTyrePage?'tyrePageNoHeader':''}">${content}</main><footer class="footer"><div class="featureStrip"><div><span class="featureIcon">✓</span><strong>100% Genuine Parts</strong><small>High quality parts</small></div><div><span class="featureIcon">▣</span><strong>Fast Delivery</strong><small>Across the city</small></div><div><span class="featureIcon">✓</span><strong>Secure Payment</strong><small>100% secure</small></div><div><span class="featureIcon">◯</span><strong>Support 24/7</strong><small>We are here to help</small></div></div><div class="footerMain"><div><h3>CONTACT & SUPPORT</h3><p>${esc(db.settings.address)}</p><p>${esc(db.settings.phone)}</p>${String(db.settings.phone2||'').trim()?`<p>${esc(String(db.settings.phone2).trim())}</p>`:''}${String(db.settings.phone3||'').trim()?`<p>${esc(String(db.settings.phone3).trim())}</p>`:''}${mediaLinksHtml()?`<div class="footerContactSocials" aria-label="Social media links">${mediaLinksHtml()}</div>`:''}<p>${esc(db.settings.email)}</p></div><div><h3>QUICK LINKS</h3><button onclick="home()">Home</button><button onclick="brands()">Brands</button><button onclick="parts()">Categories</button><button onclick="about()">About Us</button></div><div><h3>NEED A PART?</h3><p>Send us your vehicle and part details and we will help you find the right part.</p><button class="footerWa" onclick="smartEnquiry('Hello, I would like to enquire about your auto parts catalog.')">ENQUIRE ABOUT A PART</button></div></div><div class="footerBottom">© ${new Date().getFullYear()} ${esc(db.settings.businessName)}. All rights reserved.</div></footer>`;
   window.scrollTo({top:0,left:0,behavior:'instant'});
   requestAnimationFrame(()=>app.classList.add('page-enter'));
   setTimeout(()=>app.classList.remove('page-enter'),620);
 };
 const isTyrePage=content.includes('tyreReferenceV3')||content.includes('tyreExactPage')||content.includes('tyreNumberExactPage');
 if(isTyrePage){draw();return;}
 if(app.querySelector('.siteHeader,.site-main,.footer') && app.innerHTML.trim()){
   clearTimeout(window.__renderTimer);
   app.classList.remove('page-enter');
   void app.offsetWidth;
   app.classList.add('page-leave');
   window.__renderTimer=setTimeout(draw,260);
 }else draw();
}
function contextBanner(label,image,title,subtitle){return `<div class="contextBanner"><div><span class="eyebrow">${esc(label)}</span><h1>${esc(title)}</h1>${subtitle?`<div class="contextSub">${esc(subtitle)}</div>`:''}</div><div class="contextImage">${image?`<img src="${image}" alt="${esc(title)}">`:''}</div></div>`}
function hero(){
 const slides=Array.isArray(db.settings.heroSlides)&&db.settings.heroSlides.length?db.settings.heroSlides:(Array.isArray(db.settings.heroImages)&&db.settings.heroImages.length?db.settings.heroImages.map(image=>({image,black:db.settings.heroBlack,red:db.settings.heroRed,description:db.settings.heroDescription,align:'left'})):(db.settings.heroImage?[{image:db.settings.heroImage,black:db.settings.heroBlack,red:db.settings.heroRed,description:db.settings.heroDescription,align:'left'}]:[]));
 const first=slides[0]||{};
 const text=(s)=>'<div class="heroCopy" data-hero-align="'+esc(s.align||'left')+'"><span class="eyebrow">'+esc(db.settings.tagline||'QUALITY YOU CAN TRUST')+'</span><h1>'+esc(s.black||'FIND THE RIGHT')+'<br><span class="accent">'+esc(s.red||'PARTS FOR YOUR CAR')+'</span></h1><p class="sub">'+esc(s.description||'High quality parts for all makes and models.')+'</p></div>';
 return '<section class="hero autoPartsHero '+(first.image?'hasHeroBackground':'')+'">'+header(true)+(slides.length?'<div class="homeHeroSlider" id="homeHeroSlider">'+slides.map((s,i)=>'<div class="homeHeroSlide '+(i===0?'active':'')+'" data-hero-black="'+esc(s.black||'')+'" data-hero-red="'+esc(s.red||'')+'" data-hero-description="'+esc(s.description||'')+'" data-hero-align="'+esc(s.align||'left')+'" style="background-image:url(\''+esc(s.image)+'\')"></div>').join('')+'<div class="homeHeroDots" id="homeHeroDots" aria-label="Hero slides">'+slides.map((s,i)=>'<button type="button" class="homeHeroDot '+(i===0?'active':'')+'" aria-label="Show hero image '+(i+1)+'" aria-current="'+(i===0?'true':'false')+'" onclick="goToHomeHeroSlide('+i+');event.stopPropagation()"></button>').join('')+'</div></div>':'')+text(first)+'</section>';
}
function applyHomeHeroText(slide){
 const copy=document.querySelector('.autoPartsHero .heroCopy');if(!copy||!slide)return;
 const align=slide.dataset.heroAlign||'left';const title=copy.querySelector('h1'),desc=copy.querySelector('.sub');
 if(title)title.innerHTML=esc(slide.dataset.heroBlack||'')+'<br><span class="accent">'+esc(slide.dataset.heroRed||'')+'</span>';
 if(desc)desc.textContent=slide.dataset.heroDescription||'';
 copy.dataset.heroAlign=align;copy.style.setProperty('text-align',align,'important');copy.style.setProperty('align-items',align==='center'?'center':align==='right'?'flex-end':'flex-start','important');
}
function updateHomeHeroDots(index){
 const dots=[...document.querySelectorAll('#homeHeroDots .homeHeroDot')];
 dots.forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-current',i===index?'true':'false')});
}
function goToHomeHeroSlide(index){
 const el=document.getElementById('homeHeroSlider');if(!el)return;
 const slides=[...el.querySelectorAll('.homeHeroSlide')];if(!slides.length)return;
 const next=Math.max(0,Math.min(index,slides.length-1));
 const current=slides.findIndex(x=>x.classList.contains('active'));
 if(current>=0)slides[current].classList.remove('active');
 slides[next].classList.add('active');
 applyHomeHeroText(slides[next]);
 updateHomeHeroDots(next);
 window.__homeHeroHeroIndex=next;
}
function initHomeHeroSwipe(){
 const el=document.querySelector('.site-main > .autoPartsHero');if(!el||el.dataset.swipeReady==='true')return;
 el.dataset.swipeReady='true';
 let startX=0,startY=0,dragging=false,moved=false;
 const finish=(endX,endY)=>{
   if(!dragging)return;
   dragging=false;
   const dx=endX-startX,dy=endY-startY;
   if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy))return;
   const slides=[...el.querySelectorAll('.homeHeroSlide')];if(slides.length<2)return;
   const current=slides.findIndex(x=>x.classList.contains('active'));if(current<0)return;
   goToHomeHeroSlide(dx<0?current+1:current-1);
 };
 el.addEventListener('pointerdown',e=>{
   if(e.pointerType==='mouse'&&e.button!==0)return;
   startX=e.clientX;startY=e.clientY;dragging=true;moved=false;
   try{e.target.setPointerCapture?.(e.pointerId)}catch{}
 });
 el.addEventListener('pointermove',e=>{
   if(!dragging)return;
   if(Math.abs(e.clientX-startX)>10||Math.abs(e.clientY-startY)>10)moved=true;
 });
 el.addEventListener('pointerup',e=>finish(e.clientX,e.clientY));
 el.addEventListener('pointercancel',()=>{dragging=false});
 el.addEventListener('touchstart',e=>{
   const t=e.touches[0];if(!t)return;
   startX=t.clientX;startY=t.clientY;dragging=true;moved=false;
 },{passive:true});
 el.addEventListener('touchend',e=>{
   const t=e.changedTouches[0];if(t)finish(t.clientX,t.clientY);
 },{passive:true});
 el.addEventListener('touchcancel',()=>{dragging=false},{passive:true});
 el.addEventListener('click',e=>{
   if(moved){e.preventDefault();e.stopPropagation();moved=false}
 });
}
function initHomeHeroSlider(images){
 if(window.__homeHeroSliderTimer)clearInterval(window.__homeHeroSliderTimer);
 const list0=[...(document.querySelectorAll('#homeHeroSlider .homeHeroSlide')||[])];
 if(list0.length){applyHomeHeroText(list0[0]);updateHomeHeroDots(0);window.__homeHeroHeroIndex=0;initHomeHeroSwipe();}
 if(!images||images.length<2)return;
 window.__homeHeroSliderTimer=setInterval(()=>{
   const el=document.getElementById('homeHeroSlider');if(!el){clearInterval(window.__homeHeroSliderTimer);return}
   const slides=[...el.querySelectorAll('.homeHeroSlide')];if(!slides.length)return;
   const idx=((window.__homeHeroHeroIndex||0)+1)%slides.length;
   goToHomeHeroSlide(idx);
 },4000);
}

function home(){
 const h=location.hash||'';
 if(/^#?tyres\/by-car(?:\/|$)/.test(h)&&typeof window.tyresByCar==='function'){window.tyresByCar();return}
 if(/^#?tyres\/by-number(?:\/|$)/.test(h)&&typeof window.tyresByNumber==='function'){window.tyresByNumber();return}
 setNav('home');
 location.hash='';
 window.__homeHeroHeader=true;

 const regularBrands=db.brands.filter(b=>b.isRegular!==false);
 const evBrands=db.brands.filter(b=>b.isEv===true);

 render(`
 ${hero()}

 <div class="sectionHead">
  <div>
   <span class="eyebrow">OUR CATALOG</span>
   <h2 class="homeBrandHeading" onclick="brands()">SHOP BY <span class="accent">CAR BRAND</span><span class="headingArrow">→</span></h2>
  </div>
 </div>

 <div class="brandScroller">
  <button class="scrollArrow" onclick="scrollBrandsById('brandRail',-1)">‹</button>
  <div id="brandRail" class="brandRail">
   ${regularBrands.map(brandCard).join('')||'<div class="empty">No car brands added yet.</div>'}
  </div>
  <button class="scrollArrow" onclick="scrollBrandsById('brandRail',1)">›</button>
 </div>

 ${evBrands.length ? `
 <section class="evBrandSection">

  <div class="evBrandHeading">
   <span class="evEyebrow">
    <span class="evBolt">⚡</span> EV BRANDS
   </span>

   <h2 class="homeBrandHeading evHomeBrandHeading" onclick="brands(true)">SHOP BY <span>EV BRAND</span><span class="headingArrow">→</span></h2>
   <p>Electric today. A cleaner tomorrow.</p>
  </div>

  <div class="brandScroller evBrandScroller">
   <button class="scrollArrow" onclick="scrollBrandsById('evBrandRail',-1)">‹</button>

   <div id="evBrandRail" class="brandRail">
    ${evBrands.map(b=>brandCard(b,true)).join('')}
   </div>

   <button class="scrollArrow" onclick="scrollBrandsById('evBrandRail',1)">›</button>
  </div>

 </section>
 ` : ''}

 <section class="tyresPromo" onclick="tyres()" role="link" tabindex="0"
  onkeydown="if(event.key==='Enter'||event.key===' ')tyres()">

  <div class="tyresArt">
   <div class="tyresPromoSlides" aria-hidden="true"></div>
  </div>

  <div class="tyresCopy">
   <div class="tyresTitle">
    <h3>FIND YOUR <span>PERFECT TYRES</span></h3>
   </div>

   <p>
    Drive with confidence.<br>
    Find tyres made for your journey.
   </p>
  </div>

  <div class="tyresCtaRow">
   <span class="tyresBtn">EXPLORE TYRES <span class="tyresInlineArrow" aria-hidden="true">›</span></span>
  </div>
 </section>
 `)
 const homeHeroImages=Array.isArray(db.settings.heroImages)&&db.settings.heroImages.length
  ? db.settings.heroImages
  : (db.settings.heroImage?[db.settings.heroImage]:[]);
 initHomeHeroSlider(homeHeroImages);
 initTyresPromoSlideshow();
}

let tyresPromoSlideTimer=null;
function initTyresPromoSlideshow(){
 clearInterval(tyresPromoSlideTimer);
 const box=document.querySelector('.tyresPromoSlides');
 const copy=document.querySelector('.tyresPromo .tyresCopy');
 if(!box)return;
 const images=(db.tyres?.promoImages||[]).filter(Boolean);
 if(!images.length){box.innerHTML='';if(copy)copy.style.display='none';return;}
 const promoDefaults=defaultTyres.promoTexts||[];
 const promoTexts=images.map((_,i)=>({...((promoDefaults[i%Math.max(1,promoDefaults.length)]||{})),...((db.tyres?.promoTexts||[])[i]||{})}));
 box.innerHTML=images.map((src,i)=>'<img class="tyresPromoSlide '+(i===0?'active':'')+'" src="'+esc(src)+'" alt="Tyre promotion image '+(i+1)+'">').join('');
 const applyPromoText=(i)=>{
   if(!copy)return;
   const t=promoTexts[i%promoTexts.length];
   const align=t.align||'left';
   const alignMap={left:'flex-start',center:'center',right:'flex-end'};
   /* The Admin editor has a separate left/center/right alignment for every promo slide.
      Use important inline styles so older CSS overrides cannot force every slide to the left. */
   copy.style.setProperty('text-align',align,'important');
   copy.style.setProperty('align-items',alignMap[align]||'flex-start','important');
   const title=copy.querySelector('.tyresTitle h3');
   const titleWrap=copy.querySelector('.tyresTitle');
   if(titleWrap)titleWrap.style.setProperty('justify-content',alignMap[align]||'flex-start','important');
   const desc=copy.querySelector('p');
   const button=copy.querySelector('.tyresBtn');
   if(title){
     title.innerHTML=esc(t.title||'')+' <span>'+esc(t.highlight||'')+'</span>';
     title.style.color=t.titleColor||'#ffffff';
     const hs=title.querySelector('span');
     if(hs)hs.style.color=t.highlightColor||'#d71920';
   }
   if(desc){
     desc.innerHTML=esc(t.desc||'').replace(/\n/g,'<br>');
     desc.style.color=t.descColor||'#ffffff';
   }
   if(button){
     button.innerHTML=esc(String(t.button||'').replace(/\s*→\s*$/,''))+' <span class="tyresInlineArrow" aria-hidden="true">›</span>';
     button.style.color=t.buttonColor||'#ffffff';
     button.style.textAlign=align;
     button.style.marginLeft=align==='center'?'auto':align==='right'?'auto':'0';
     button.style.marginRight=align==='left'?'auto':align==='center'?'auto':'0';
   }
 };
 applyPromoText(0);
 if(images.length<2)return;
 let idx=0;
 tyresPromoSlideTimer=setInterval(()=>{
   const slides=[...box.querySelectorAll('.tyresPromoSlide')];
   if(!slides.length)return;
   slides[idx]?.classList.remove('active');
   idx=(idx+1)%slides.length;
   slides[idx]?.classList.add('active');
   applyPromoText(idx);
 },4000);
}

function tyres(){
 const h=location.hash||'';
 if(/^#?tyres\/by-car(?:\/|$)/.test(h)&&typeof window.tyresByCar==='function'){window.tyresByCar();return}
 if(/^#?tyres\/by-number(?:\/|$)/.test(h)&&typeof window.tyresByNumber==='function'){window.tyresByNumber();return}
 setNav('');location.hash='tyres';const t=db.tyres||defaultTyres;const hero=t.hero||defaultTyres.hero;const heroImages=(hero.images&&hero.images.length?hero.images:[hero.image||defaultTyres.hero.image]);const features=(t.features||defaultTyres.features).slice(0,3);const brands=(t.brands||defaultTyres.brands);const featured=(t.featured||defaultTyres.featured);const findByCar=t.findByCar||defaultTyres.findByCar;const findByNumber=t.findByNumber||defaultTyres.findByNumber;render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreDesktopHero"><div class="tyreHeroSlider" id="tyreHeroSlider">${heroImages.map((src,i)=>`<div class="tyreHeroSlide ${i===0?'active':''}" style="background-image:linear-gradient(180deg,rgba(0,0,0,.40),rgba(0,0,0,.68)),url('${esc(src)}')"></div>`).join('')}</div><div class="tyreDesktopHeroText"><h1>${esc(hero.title)}</h1><h2>${esc(hero.red)}</h2><i></i><p>${esc(hero.description||'').replace(/\n/g,'<br>')}</p></div><div class="tyreFeatureCardsHtml">${features.map(x=>`<button class="tyreFeatureCardHtml ${esc(x.key)}" onclick="smartEnquiry('${esc(x.message||'Hello, I would like to enquire about tyres.').replace(/'/g,"\\'")}')"><span class="featureTextHtml"><b>${esc(x.title)}</b><em>${esc(x.subtitle)}</em><i></i></span><img src="${esc(x.image)}" alt="${esc(x.title+' '+x.subtitle)}"></button>`).join('')}</div></div><div class="tyreHtmlBrands"><h2>Tyre Brands</h2><div class="tyreHtmlBrandGrid">${brands.map((x,i)=>`<button onclick="tyreBrandPage(${i})"><img src="${esc(x.image)}" alt="${esc(x.name)}"></button>`).join('')}</div></div><div class="tyreHtmlFeatured"><div class="tyreHtmlFeaturedHead"><h2>Featured Tyre Types</h2><button onclick="smartEnquiry('Hello, I would like to enquire about your available tyres.')">View All Tyres →</button></div><div class="tyreHtmlFeaturedGrid">${featured.map((x,i)=>`<button onclick="tyreTypePage(${i})"><img src="${esc(x.image)}" alt="${esc(x.title)}"><b>${esc(x.title)}</b><small>${esc(x.description)}</small><span>→</span></button>`).join('')}</div></div><section class="tyreFinderSection">
<div class="tyreFinderHead">
<span>TYRE FINDER</span>
<h2>FIND THE RIGHT <b>TYRES</b></h2>
<p>Choose how you want to find your tyres.</p>
</div>
<div class="tyreFinderGrid">
<button class="tyreFinderCard" onclick="location.hash='tyres/by-car'">
<span class="tyreFinderCardImage"><img src="${esc(findByCar.homeImage||findByCar.image||placeholder('Find Tyre by Car'))}" alt=""></span>
<div><strong>FIND TYRE BY CAR</strong><small>Choose your car brand, model and year.</small></div>
<span class="tyreFinderArrow">→</span>
</button>
<button class="tyreFinderCard" onclick="location.hash='tyres/by-size'">
<span class="tyreFinderCardImage"><img src="${esc(findByNumber.homeImage||findByNumber.image||placeholder('Find Tyre by Size'))}" alt=""></span>
<div><strong>FIND TYRE BY SIZE</strong><small>Search using your tyre size.</small></div>
<span class="tyreFinderArrow">→</span>
</button>
</div>
</section><div class="tyreAboutContactSection">
<section class="tyreAboutSection">
<div class="tyreAboutContent">
<span class="tyreAboutEyebrow">ABOUT US</span>
<h2>${esc((db.tyres?.contact?.aboutTitle)||'About Our Business')}</h2>
<p>${esc((db.tyres?.contact?.aboutText)||'').replace(/\n/g,'<br>')}</p>
${tyreMediaLinksHtml()?`<div class="tyreAboutSocials" aria-label="Social media links">${tyreMediaLinksHtml()}</div>`:''}
</div>
</section>
<a class="tyreContactSupport" href="#tyres/contact" onclick="tyreContactPage();return false;">
<div class="tyreContactText">
<span>CONTACT &amp; SUPPORT</span>
<small>We are here to help you find the right tyres.</small>
<div class="tyreContactPhones">
${[db.tyres?.contact?.phone,db.tyres?.contact?.phone2,db.tyres?.contact?.phone3].filter(Boolean).map(p=>'<b>'+esc(p)+'</b>').join('')}
</div>
</div>
<div class="tyreContactImageFrame" aria-hidden="true">
${db.tyres?.contact?.contactImage?`<img src="${esc(db.tyres.contact.contactImage)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;">`:''}
</div>
</a>
<a class="tyreAutoPartsPromo" href="/" aria-label="${esc(db.settings.promoButton||'Explore Auto Parts')}" ${db.settings.promoBackground?`style="background-image:url('${db.settings.promoBackground}')"`:''}>
  <div class="tyreAutoPartsPromoText">
    <span class="tyreAutoPartsPromoEyebrow">${esc(db.settings.promoEyebrow||'AUTO PARTS')}</span>
    <h3>${esc(db.settings.promoTitle||'LOOKING FOR MORE THAN TYRES?')}</h3>
    <p>${esc(db.settings.promoDescription||'Explore our full range of quality auto parts for your vehicle.')}</p>
    <span class="tyreAutoPartsPromoButton">${esc(db.settings.promoButton||'EXPLORE AUTO PARTS')} <b>→</b></span>
  </div>
  <div class="tyreAutoPartsPromoVisual" aria-hidden="true">
    <span>PARTS</span>
  </div>
</a>
</div>
<div class="tyreBottomGap"></div><img class="tyreBottomArt" src="${esc(t.bottomImage||defaultTyres.bottomImage)}" alt=""></div></section>`);initHeroSlider(heroImages) }

function initHeroSlider(images){if(window.__heroSliderTimer)clearInterval(window.__heroSliderTimer);if(!images||images.length<2)return;let idx=0;window.__heroSliderTimer=setInterval(()=>{const el=document.getElementById('tyreHeroSlider');if(!el){clearInterval(window.__heroSliderTimer);return}const slides=el.querySelectorAll('.tyreHeroSlide');idx=(idx+1)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===idx))},4000)}

async function tyresByCar(){
 setNav('');
 location.hash='tyres/by-car';
 let brands=[...db.brands].filter(b=>b&&b.id&&b.name);
 try{
  if(supabaseClient){
   const {data,error}=await supabaseClient.from('brands').select('*').order('sort_order').order('name');
   if(!error&&Array.isArray(data)){
    brands=data.map(b=>({id:b.id,name:b.name,image:b.image_url||'',isEv:b.is_ev===true,isRegular:b.is_regular!==false,sortOrder:Number(b.sort_order??0)})).filter(b=>b.id&&b.name);
   }
  }
 }catch(e){console.warn('Tyre finder brand refresh failed:',e)}
 const finder=db.tyres?.findByCar||defaultTyres.findByCar||{};
 const heroImage=finder.image||db.tyres?.hero?.image||defaultTyres.hero.image;
 const bottomImage=finder.bottomImage||'';
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage">
 <div class="tyreByCarHero" style="background-image:url('${esc(heroImage)}')"><div class="tyreByCarHeroOverlay"></div><div class="tyreByCarHeroCopy"><span>TYRE FINDER</span><h1>FIND TYRE <b>BY CAR</b></h1><p>Select your vehicle to find the right tyre.</p></div><button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button></div>
 <div class="tyreFinderCarGrid">${brands.map(b=>`<button onclick="tyreFinderBrand('${b.id}')"><div><img src="${esc(b.image||placeholder(b.name))}" alt="${esc(b.name)}"></div><strong>${esc(b.name)}</strong></button>`).join('')||'<div class="empty">No car brands available.</div>'}</div>
 ${bottomImage?`<div class="tyreFinderBottomImage"><img src="${esc(bottomImage)}" alt="Find Tyre By Car bottom image"></div>`:''}
 </div></div></section>`)
}

async function tyreFinderBrand(brandId){
 let b=db.brands.find(x=>x.id===brandId);
 let models=db.models.filter(m=>m&&m.brandId===brandId&&m.name);
 try{
  if(supabaseClient){
   const [brR,moR]=await Promise.all([
    supabaseClient.from('brands').select('*').eq('id',brandId).maybeSingle(),
    supabaseClient.from('models').select('*').eq('brand_id',brandId).order('sort_order').order('name')
   ]);
   if(!brR.error&&brR.data)b={id:brR.data.id,name:brR.data.name,image:brR.data.image_url||'',isEv:brR.data.is_ev===true,isRegular:brR.data.is_regular!==false};
   if(!moR.error&&Array.isArray(moR.data))models=moR.data.map(m=>({id:m.id,brandId:m.brand_id,name:m.name,image:m.image_url||'',isEv:m.is_ev===true,tyreTypeId:m.tyre_type_id||''})).filter(m=>m.id&&m.name);
   // Keep the directly refreshed EV/regular model list in the shared catalogue so the
   // next model-selection step can resolve the selected model and its tyre type.
   if(Array.isArray(models)&&models.length){
    const keep=db.models.filter(x=>x&&x.brandId!==brandId);
    db.models=[...keep,...models];
   }
  }
 }catch(e){console.warn('Tyre finder model refresh failed:',e)}
 if(!b)return tyresByCar();
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage">
 <button class="tyrePlaceholderBack" onclick="tyresByCar()">← Back to Car Brands</button>
 <div class="tyreFinderPageHead"><span>${esc(b.name)}</span><h1>SELECT YOUR <b>MODEL</b></h1><p>Choose your vehicle model.</p></div>
 <div class="tyreFinderModelGrid">${models.map(m=>`<button onclick="tyreFinderModel('${m.id}')"><div><img src="${esc(m.image||placeholder(m.name))}" alt="${esc(m.name)}"></div><strong>${esc(m.name)}</strong></button>`).join('')||'<div class="empty">No models available for this brand.</div>'}</div>
 </div></div></section>`)
}

function tyreFinderModel(modelId){
 const m=db.models.find(x=>x.id===modelId);
 if(!m)return tyresByCar();
 tyreFinderResult(modelId);
}
function tyreFinderShowResults(modelId){
 const m=db.models.find(x=>x.id===modelId);
 const b=db.brands.find(x=>x.id===m?.brandId);
 if(!m||!b)return tyresByCar();
 const modelTypeId=String(m.tyreTypeId||'');
 const type=(db.tyres?.featured||[]).find(x=>String(x.id)===modelTypeId);
 const ps=(db.tyres?.tyreProducts||[]).filter(p=>{
  const productModelId=String(p.modelId||p.vehicleModelId||p.vehicle_model_id||'');
  const productTypeId=String(p.typeId||p.tyreTypeId||p.tyre_type_id||'');
  const productTypeTitle=String(p.type||'').trim().toLowerCase();
  const typeMatches=!modelTypeId||productTypeId===modelTypeId||(!productTypeId&&!!type&&productTypeTitle===String(type.title||'').trim().toLowerCase());
  if(!typeMatches)return false;
  return !productModelId||productModelId===String(m.id);
 });
 const brandImage=b.image||placeholder(b.name);
 const modelImage=m.image||placeholder(m.name);
 setNav('');
 location.hash='tyres/by-car';
 render('<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreProductResultsPage tyreFinderActionResultsPage">'+
  '<button class="tyrePlaceholderBack" onclick="tyreFinderBrand(\''+b.id+'\')">← Back to Models</button>'+
  '<div class="tyreFinderActionHeader">'+
    '<div class="tyreFinderActionImageFrame">'+
      '<div class="tyreFinderActionBrandImage"><img src="'+esc(brandImage)+'" alt="'+esc(b.name)+'"></div>'+
      '<div class="tyreFinderActionModelImage"><img src="'+esc(modelImage)+'" alt="'+esc(m.name)+'"></div>'+
    '</div>'+
    '<div class="tyreFinderActionCopy">'+
      '<span class="eyebrow">TYRE FINDER</span>'+
      '<h1>'+esc(b.name.toUpperCase())+' <b>'+esc(m.name.toUpperCase())+'</b></h1>'+
      '<p>Tyres available for your selected vehicle.</p>'+
    '</div>'+
  '</div>'+
  '<div class="tyreProductSlider">'+
    '<button class="tyreProductSliderArrow tyreProductSliderPrev" type="button" aria-label="Previous products" onclick="tyreProductSliderScroll(-1)">‹</button>'+
    '<div class="tyrePublicProductGrid">'+
      (ps.map(tyreProductCard).join('')||'<div class="empty">No tyre products found for this vehicle.</div>')+
    '</div>'+
    '<button class="tyreProductSliderArrow tyreProductSliderNext" type="button" aria-label="Next products" onclick="tyreProductSliderScroll(1)">›</button>'+
  '</div>'+
  '<button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button>'+
 '</div></div></section>');
 ensureTyreCompareUI();
}
function tyreFinderResult(modelId){
 const m=db.models.find(x=>x.id===modelId);
 const b=db.brands.find(x=>x.id===m?.brandId);
 if(!m||!b)return tyresByCar();
 const brandImage=b.image||placeholder(b.name);
 const modelImage=m.image||placeholder(m.name);
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage tyreFinderResultPage">
 <button class="tyrePlaceholderBack" onclick="tyreFinderBrand('${b.id}')">← Back to Models</button>
 <div class="tyreFinderResultHeader">
   <div class="tyreFinderResultImageFrame">
     <div class="tyreFinderResultBrandImage"><img src="${esc(brandImage)}" alt="${esc(b.name)}"></div>
     <div class="tyreFinderResultModelImage"><img src="${esc(modelImage)}" alt="${esc(m.name)}"></div>
   </div>
   <div class="tyreFinderResultCopy">
     <span class="eyebrow">TYRE FINDER</span>
     <h1>${esc(b.name.toUpperCase())} <b>${esc(m.name.toUpperCase())}</b></h1>
     <p>Find tyres for your selected vehicle.</p>
   </div>
 </div>
 <div class="tyreFinderResultAction">
   <h2>TYRES FOR <span>${esc(m.name.toUpperCase())}</span></h2>
   <p>We have your vehicle details. Continue to enquire about suitable tyres.</p>
   <button class="primary" onclick="tyreFinderShowResults('${m.id}')">FIND TYRES →</button>
 </div>
 </div></div></section>`);
}
function tyresByNumber(){
 setNav('');
 location.hash='tyres/by-size';
 if(typeof window.tyresByNumber==='function'&&window.tyresByNumber!==tyresByNumber)return window.tyresByNumber();
 render('<section class="tyreNumberExactPage tyreNumberPage tyreRebuildCleanPage" aria-label="Find Tyre by Size"></section>');
}
function searchTyreNumber(){
 const input=document.querySelector('#tyreNumberInput');
 const value=String(input?.value||'').trim();
 if(!value)return toast('Please enter a tyre number or size');
 document.querySelector('#tyreNumberResults').innerHTML=`<div class="tyreNumberResult"><strong>${esc(value)}</strong><p>We will check availability for this tyre size.</p><button class="tyreShowcaseDetail" onclick='smartEnquiry(${JSON.stringify('Hello, I would like to enquire about tyres with size/number: '+value+'.')})'>ENQUIRE →</button></div>`;
}
function tyreBrandPage(idx){const t=db.tyres||defaultTyres,b=(t.brands||[])[idx];if(!b)return tyres();location.hash=`tyres/brand/${idx}`;showTyreProductResults(`${b.name} Tyres`,p=>String(p.brandId)===String(b.id)||String(p.brandId)===String(idx)||String(p.brand||'').toLowerCase()===String(b.name).toLowerCase(),{...b,kind:'brand'})}

function tyreContactPage(){
  setNav('');
  location.hash='tyres/contact';
  const c=(db.tyres||defaultTyres).contact||defaultTyres.contact;
  const phones=[c.phone,c.phone2,c.phone3].filter(Boolean).map(p=>`<div class="tyreOwnContactPhone">${esc(p)}</div>`).join('');
  const socials=tyreMediaLinksHtml();
  render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreOwnContactPage"><button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button><div class="tyreOwnContactCard"><span class="tyreAboutEyebrow">CONTACT US &amp; SUPPORT</span><h1>GET IN <span>TOUCH</span></h1><p>We are here to help you find the right tyres.</p>${phones?`<div class="tyreOwnContactPhones">${phones}</div>`:''}${socials?`<div class="tyreAboutSocials">${socials}</div>`:''}<button class="primary" onclick="smartEnquiry('Hello, I would like to enquire about your tyres.')">SEND ENQUIRY</button></div></div></div></section>`);
}

function tyreTypePage(ref){const t=db.tyres||defaultTyres,list=t.featured||defaultTyres.featured,x=list.find(v=>String(v.id)===String(ref))||list[Number(ref)];if(!x)return tyres();location.hash=`tyres/type/${encodeURIComponent(x.id||ref)}`;showTyreProductResults(`${x.title} Tyres`,p=>String(p.typeId)===String(x.id)||String(p.typeId)===String(ref)||String(p.typeId)===String(list.indexOf(x))||String(p.type||'').toLowerCase()===String(x.title).toLowerCase(),{...x,kind:"type"})}

function scrollBrands(dir){scrollBrandsById('brandRail',dir)}
function scrollBrandsById(id,dir){document.querySelector('#'+id)?.scrollBy({left:dir*300,behavior:'smooth'})}
function brandCard(b,ev=false){return `<article class="card catalog-card brand" onclick="brand('${b.id}',${ev})"><div class="media-frame brandFrame"><img src="${b.image||placeholder(b.name)}" alt="${esc(b.name)}"></div><h3>${esc(b.name)}</h3></article>`}
function brands(ev=false){setNav('brands');location.hash='brands';const list=ev?db.brands.filter(b=>b.isEv===true):db.brands.filter(b=>b.isRegular!==false);render(`<div class="breadcrumb">Home <span>›</span> ${ev?'EV Brands':'Brands'}</div><div class="sectionHead ${ev?'evPageHeading':''}"><div>${ev?'<span class="evEyebrow"><span class="evBolt">⚡</span> EV BRANDS</span>':'<span class="eyebrow">STEP 1</span>'}<h2>SHOP BY <span class="${ev?'evPageAccent':'accent'}">${ev?'EV BRAND':'CAR BRAND'}</span></h2>${ev?'<p>Electric today. A cleaner tomorrow.</p>':''}</div></div><div class="grid brandGrid">${list.map(b=>brandCard(b,ev)).join('')||'<div class="empty">No brands added yet.</div>'}</div><button class="backBtn" onclick="home()">← BACK TO HOME</button>`)}
function brand(id,ev=false){setNav('brands');location.hash='brands';const b=db.brands.find(x=>x.id===id);if(!b)return brands(ev);const ms=db.models.filter(x=>x.brandId===id&&(!ev||x.isEv===true));render(`<div class="breadcrumb">Home <span>›</span> ${esc(b.name)} <span>›</span> Select Model</div>${contextBanner('SELECTED BRAND',b.image||placeholder(b.name),b.name,'Choose a model for this brand')}<div class="sectionHead"><div><span class="eyebrow">STEP 2</span><h2>SELECT <span class="accent">MODEL</span></h2></div></div><div class="grid modelGrid">${ms.map(m=>`<article class="card catalog-card" onclick="model('${m.id}',${ev===true})"><div class="media-frame modelFrame"><img src="${m.image||placeholder(m.name)}" alt="${esc(m.name)}"></div><h3>${esc(m.name)}</h3></article>`).join('')||'<div class="empty">No models added yet.</div>'}</div><button class="backBtn" onclick="brands(${ev===true})">← BACK TO BRANDS</button>`)}
function model(id,evContext=null){setNav('brands');location.hash='brands';const m=db.models.find(x=>x.id===id);if(!m)return brands();const b=db.brands.find(x=>x.id===m.brandId);const ys=modelYears(id);render(`<div class="breadcrumb">Home <span>›</span> ${esc(b?.name)} <span>›</span> ${esc(m.name)} <span>›</span> Select Year</div>${contextBanner('SELECTED MODEL',m.image||placeholder(m.name),m.name,`${b?.name||''} · Choose a year`)}<div class="sectionHead"><div><span class="eyebrow">STEP 3</span><h2>SELECT <span class="accent">YEAR</span></h2></div></div><div class="yearGrid">${ys.map(y=>`<button class="yearCard" onclick="year('${id}','${encodeURIComponent(y)}')"><strong>${esc(y)}</strong><span>→</span></button>`).join('')||'<div class="empty">No years added for this model yet.</div>'}</div><button class="backBtn" onclick="brands(${evContext===true||b?.isEv===true})">← BACK TO BRANDS</button>`)}
function fallbackProducts(modelId,yearValue,categoryId=''){const m=db.models.find(x=>x.id===modelId);if(!m)return [];const actual=uniqueProducts(db.parts.filter(p=>p.modelId===modelId&&productMatchesYear(p,yearValue)&&isCustomerVisibleProduct(p)&&(!categoryId||p.categoryId===categoryId)));if(actual.length)return [];const cats=categoryId?db.categories.filter(c=>c.id===categoryId):db.categories;return cats.flatMap(c=>branchesForCategory(c.id).map(br=>({id:'virtual-'+modelId+'-'+br.id,modelId,years:[String(yearValue)],year:String(yearValue),category:c.name,categoryId:c.id,branchId:br.id,name:c.name,partNo:'',availability:'Available on enquiry',description:'Enquire for details',image:br.image||c.image||'',virtual:true})));}
function year(modelId,yearValue){setNav('brands');location.hash='brands';yearValue=decodeURIComponent(yearValue);const m=db.models.find(x=>x.id===modelId),b=db.brands.find(x=>x.id===m?.brandId);if(!m||!b)return brands();const available=uniqueProducts(db.parts.filter(p=>isCustomerVisibleProduct(p)&&p.modelId===modelId&&productMatchesYear(p,yearValue)));render(`<div class="breadcrumb">Home <span>›</span> ${esc(b.name)} <span>›</span> ${esc(m.name)} <span>›</span> ${esc(yearValue)} <span>›</span> Select Category</div>${contextBanner('SELECTED VEHICLE',m.image||placeholder(m.name),`${m.name} ${yearValue}`,`${b.name} · Choose a part category`)}<div class="sectionHead"><div><span class="eyebrow">STEP 4</span><h2>CHOOSE PART <span class="accent">CATEGORY</span></h2></div></div><div class="grid categoryGrid">${db.categories.map(c=>{const count=available.filter(p=>p.categoryId===c.id||p.category===c.name).reduce((n,p)=>n+Math.max(1,productBranchIds(p).length),0);const fallback=branchesForCategory(c.id).length>0&&!count;if(!count&&!fallback)return '';return `<article class="card catalog-card categoryCard" onclick="category('${modelId}','${encodeURIComponent(yearValue)}','${encodeURIComponent(c.name)}')"><div class="media-frame categoryFrame"><img src="${c.image||placeholder(c.name)}" alt="${esc(c.name)}"></div><h3>${esc(c.name)}</h3><span class="cardLink">${count||branchesForCategory(c.id).length} ${count===1?'PRODUCT':(fallback&&branchesForCategory(c.id).length===1?'PRODUCT':'PRODUCTS')} →</span></article>`}).join('')||'<div class="empty">No parts available for this model and year yet.</div>'}</div><button class="backBtn" onclick="model('${modelId}')">← BACK TO YEARS</button>`)}
function category(modelId,yearValue,cat){
 location.hash='brands';
 yearValue=decodeURIComponent(yearValue);cat=decodeURIComponent(cat);
 const m=db.models.find(x=>x.id===modelId),b=db.brands.find(x=>x.id===m?.brandId),c=catByName(cat);
 if(!m||!b)return brands();
 const baseProducts=uniqueProducts(db.parts.filter(p=>isCustomerVisibleProduct(p)&&p.modelId===modelId&&productMatchesYear(p,yearValue)&&p.category===cat));
 let ps=[];
 // A real product assigned to multiple branch parts is displayed as multiple
 // product cards. The branches are product variants, not a separate category UI.
 if(baseProducts.length){
   ps=baseProducts.flatMap(p=>{
     const bids=productBranchIds(p);
     if(bids.length<=1)return [p];
     return bids.map(branchId=>{
       const br=branchById(branchId);
       return {...p,id:`display-${p.id}-${branchId}`,sourceProductId:p.id,branchId,branchIds:[branchId],image:productBranchImage(p,branchId)||p.image||'',name:br?.name?`${p.name} — ${br.name}`:p.name};
     });
   });
 }else{
   // No real products: create normal enquiry-only product cards from branch images.
   ps=branchesForCategory(c?.id).map(br=>({
     id:'virtual-'+modelId+'-'+br.id,
     modelId,
     years:[String(yearValue)],
     year:String(yearValue),
     category:cat,
     categoryId:c?.id||'',
     branchId:br.id,
     name:`${m.name} ${cat} — ${br.name.replace(new RegExp('^'+cat+'\\s*','i'),'')}`.replace(/\s+/g,' ').trim(),
     partNo:'',
     availability:'Available on enquiry',
     description:'Enquire for details',
     image:br.image||c?.image||'',
     virtual:true
   }));
 }
 window.__virtualProducts=ps.filter(p=>p.virtual);
 window.__displayProducts=ps.filter(p=>p.sourceProductId);
 render(`<div class="breadcrumb">Home <span>›</span> ${esc(b.name)} <span>›</span> ${esc(m.name)} <span>›</span> ${esc(yearValue)} <span>›</span> ${esc(cat)}</div>${contextBanner('SELECTED VEHICLE',m.image||c?.image||placeholder(m.name),`${m.name} ${yearValue}`,`${b.name} · ${cat}`)}<div class="sectionHead"><div><span class="eyebrow">STEP 5</span><h2>${esc(cat).toUpperCase()} <span class="accent">— ${esc(m.name)} ${esc(yearValue)}</span></h2></div><span class="resultCount">${ps.length} items</span></div><div class="grid productGrid">${ps.map(p=>productCard(p,yearValue)).join('')||'<div class="empty">No products found in this category yet.</div>'}</div><button class="backBtn" onclick="year('${modelId}','${encodeURIComponent(yearValue)}')">← BACK TO CATEGORIES</button>`)}
function categoryBranch(modelId,yearValue,cat,branchId){
 // Legacy links are redirected to the category product list; customers no longer choose branches.
 return category(modelId,yearValue,cat);
}
function productCard(p,currentYear='',branchId=''){
 const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId);
 const selectedYear=String(currentYear||p.year||productYears(p)[0]||'');
 const msg='Hello, I would like to enquire about '+p.name+' for '+(b?.name||'')+' '+(m?.name||'')+' — year: '+selectedYear+(p.partNo?' (Part No. '+p.partNo+')':'')+'.';
 return `<article class="card product-card" onclick="productDetails('${p.id}','${encodeURIComponent(selectedYear)}')"><div class="media-frame productFrame"><img src="${productBranchImage(p,branchId)||placeholder('PART')}" alt="${esc(p.name)}"></div><div class="productBody"><div class="productTopLine"><span class="miniLabel">${esc(b?.name||'')}</span><span class="stock">● ${esc(p.availability||'Available on enquiry')}</span></div><h3>${esc(p.name)}</h3>${p.partNo?`<div class="partNo">Part No: ${esc(p.partNo)}</div>`:''}${hasPrice(p)?`<div class="productPrice">${esc(priceDisplay(p))}</div>`:''}<p class="muted">${esc(p.description||'Enquire for details')}</p><div class="productCardActions"><button class="enquire" onclick='event.stopPropagation();recordProductEnquiry(${JSON.stringify(p.id)},${JSON.stringify(selectedYear)},${JSON.stringify(branchId||p.branchId||'')});smartEnquiry(${JSON.stringify(msg).replace(/'/g,'&#39;')},${JSON.stringify(p.image||'').replace(/'/g,'&#39;')},${JSON.stringify(p.name||'').replace(/'/g,'&#39;')})'>ENQUIRE</button></div></div></article>`
}
function copyPartNumber(value){
 const text=String(value||'').trim();
 if(!text)return;
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast('Part number copied')).catch(()=>toast('Could not copy part number'));}
 else toast('Part number: '+text);
}
function productDetails(id,encodedYear=''){
 const p=db.parts.find(x=>x.id===id)||window.__displayProducts?.find(x=>x.id===id)||window.__virtualProducts?.find(x=>x.id===id);if(!p)return;
 const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId);
 const selectedYear=decodeURIComponent(encodedYear||'')||String(p.year||productYears(p)[0]||'');
 const branchIds=productBranchIds(p);
 const branches=branchIds.map(x=>branchById(x)).filter(Boolean);
 const mainImage=p.image||productBranchImage(p,branchIds[0])||placeholder('PART');
 const msg='Hello, I would like to enquire about '+p.name+' for '+(b?.name||'')+' '+(m?.name||'')+' — year: '+selectedYear+(p.partNo?' (Part No. '+p.partNo+')':'')+'.';
 const availability=String(p.availability||'Available on enquiry');
 const availabilityClass=availability.toLowerCase().includes('out of stock')?'out':availability.toLowerCase().includes('in stock')?'in':'enq';
 const years=productYears(p);
 modal(`<div class="productDetail productDetailPro">
   <div class="detailVisual">
     <div class="detailImage media-frame productFrame"><img src="${mainImage}" alt="${esc(p.name)}"></div>
     ${branches.length>1?`<div class="detailBranchImages">${branches.map(br=>`<span class="detailBranchChip">${esc(br.name)}</span>`).join('')}</div>`:''}
   </div>
   <div class="detailInfo">
     <div class="detailBadgeRow"><span class="eyebrow">PRODUCT DETAILS</span><span class="detailAvailability ${availabilityClass}">${esc(availability)}</span></div>
     <h2>${esc(p.name)}</h2>
     <p class="detailVehicle"><span>${esc(b?.name||'')}</span><span>•</span><span>${esc(m?.name||'')}</span><span>•</span><span>${esc(selectedYear)}</span></p>
     ${p.partNo?`<div class="detailPart"><div><small>PART / OEM NUMBER</small><strong>${esc(p.partNo)}</strong></div><button class="copyPart" type="button" onclick='copyPartNumber(${JSON.stringify(p.partNo)})'>COPY</button></div>`:''}
     <div class="detailFacts">
       ${hasPrice(p)?`<div><small>PRICE</small><strong>${esc(priceDisplay(p))}</strong></div>`:''}
       <div><small>SELECTED YEAR</small><strong>${esc(selectedYear)}</strong></div>
       <div><small>COMPATIBLE YEARS</small><strong>${esc(years.length?years.join(', '):selectedYear)}</strong></div>
     </div>
     ${branches.length?`<div class="detailBranches"><small>AVAILABLE VARIANTS</small><div>${branches.map(br=>`<span>${esc(br.name)}</span>`).join('')}</div></div>`:''}
     <p class="detailDescription">${esc(p.description||'Contact us for fitment and availability details.')}</p>
     <div class="detailEnquiryBox"><strong>Need to confirm fitment?</strong><span>Send this exact part and vehicle information to us on WhatsApp.</span></div>
     <div class="detailActions"><button class="primary detailEnquire" onclick='recordProductEnquiry(${JSON.stringify(p.sourceProductId||p.id)},${JSON.stringify(selectedYear)},${JSON.stringify(p.branchId||'')});smartEnquiry(${JSON.stringify(msg).replace(/'/g,'&#39;')},${JSON.stringify(mainImage).replace(/'/g,'&#39;')},${JSON.stringify(p.name||'').replace(/'/g,'&#39;')})'>ENQUIRE ON WHATSAPP</button>${p.virtual?'':`<button class="ghost" onclick='shareProduct(${JSON.stringify(p.sourceProductId||p.id)},${JSON.stringify(selectedYear).replace(/'/g,'&#39;')})'>SHARE PRODUCT</button>`}</div>
   </div>
 </div>`)
}

function parts(focusSearch=false){
 setNav('categories');location.hash='categories';
 const brands=[...db.brands].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.name).localeCompare(String(b.name)));
 const cats=[...db.categories].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.name).localeCompare(String(b.name)));
 const years=[...new Set(db.years.map(y=>String(y.year)).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
 render(`<div class="breadcrumb">Home <span>›</span> Catalog Search</div>
 <div class="catalogSearchHead advancedSearchHead">
   <div><span class="eyebrow">CATALOG SEARCH</span><h2>FIND YOUR <span class="accent">PART</span></h2><p class="muted">Search by product, brand, model, category, year or part number.</p></div>
   <div class="searchWrap"><span class="searchIcon">⌕</span><input id="search" class="input" placeholder="Search part, vehicle, OEM number..." autocomplete="off" oninput="filterProducts()"></div>
 </div>
 <div class="catalogFilters">
   <select id="filterBrand" class="select" onchange="filterProducts();refreshFilterModels()"><option value="">All brands</option>${brands.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join('')}</select>
   <select id="filterModel" class="select" onchange="filterProducts()"><option value="">All models</option></select>
   <select id="filterCategory" class="select" onchange="filterProducts()"><option value="">All categories</option>${cats.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select>
   <select id="filterYear" class="select" onchange="filterProducts()"><option value="">All years</option>${years.map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('')}</select>
   <select id="filterAvailability" class="select" onchange="filterProducts()"><option value="">All availability</option><option value="In Stock">In Stock</option><option value="Available on enquiry">Available on enquiry</option></select>
   <button class="ghost filterReset" type="button" onclick="resetProductFilters()">RESET</button>
 </div>
 <div class="searchSummary" id="searchSummary"></div>
 <div id="products" class="grid productGrid"></div><button class="backBtn" onclick="home()">← BACK TO HOME</button>`);
 refreshFilterModels();filterProducts();if(focusSearch)setTimeout(()=>document.querySelector('#search')?.focus(),50)
}
function refreshFilterModels(){
 const brandId=document.querySelector('#filterBrand')?.value||'';const select=document.querySelector('#filterModel');if(!select)return;
 const current=select.value;const models=db.models.filter(m=>!brandId||m.brandId===brandId).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
 select.innerHTML='<option value="">All models</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
 if(models.some(m=>m.id===current))select.value=current;
}
function resetProductFilters(){
 const search=document.querySelector('#search');if(search)search.value='';
 ['#filterBrand','#filterModel','#filterCategory','#filterYear','#filterAvailability'].forEach(sel=>{const el=document.querySelector(sel);if(el)el.value=''});
 refreshFilterModels();filterProducts();
}
function filterProducts(){
 const input=document.querySelector('#search');if(!input)return;
 const q=(input.value||'').toLowerCase().trim();
 const brandId=document.querySelector('#filterBrand')?.value||'';
 const modelId=document.querySelector('#filterModel')?.value||'';
 const categoryId=document.querySelector('#filterCategory')?.value||'';
 const yearValue=document.querySelector('#filterYear')?.value||'';
 const availability=document.querySelector('#filterAvailability')?.value||'';
 const source=uniqueProducts(db.parts.filter(p=>isCustomerVisibleProduct(p)));
 const list=source.filter(p=>{
   const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId),c=db.categories.find(x=>x.id===p.categoryId||x.name===p.category);
   const years=productYears(p).map(String);
   const hay=[p.name,p.category,p.partNo,p.description,m?.name,b?.name,c?.name,...years].filter(Boolean).join(' ').toLowerCase();
   return (!q||hay.includes(q))&&(!brandId||b?.id===brandId)&&(!modelId||m?.id===modelId)&&(!categoryId||c?.id===categoryId)&&(!yearValue||years.includes(String(yearValue)))&&(!availability||String(p.availability||'Available on enquiry')===availability);
 });
 const box=document.querySelector('#products');if(box)box.innerHTML=list.map(p=>productCard(p)).join('')||'<div class="empty">No matching products. Try another search or filter.</div>';
 const sum=document.querySelector('#searchSummary');if(sum){const active=[q,brandId,modelId,categoryId,yearValue,availability].filter(Boolean).length;sum.textContent=`${list.length} product${list.length===1?'':'s'} found${active?' · filters active':''}`}
}
function about(){setNav('about');location.hash='about';const title=String(db.settings.aboutTitle||'About Our Business').trim();const text=String(db.settings.aboutText||'').trim();const image=String(db.settings.aboutImage||'').trim();render(`<section class="infoPage aboutPage"><span class="eyebrow">ABOUT US</span><div class="aboutLayout">${image?`<div class="aboutImage"><img src="${esc(image)}" alt="About us"></div>`:''}<div class="aboutCopy"><h1>${esc(title)}</h1><p>${esc(text).replace(/\n/g,'<br>')}</p></div></div><button class="backBtn" onclick="home()">← BACK TO HOME</button></section>`)}
function mediaUrl(v){const raw=String(v||'').trim();if(!raw)return '';if(/^https?:\/\//i.test(raw))return raw;return 'https://'+raw.replace(/^\/\//,'')}
function mediaIcon(type){const icons={
 instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
 telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 3.4 2.9 10.5c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.1.8.8.8.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.3 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.5-1.3Z" fill="currentColor"/><path d="m8.1 13.2 9.9-6.3-7.7 7.4-.3 2.6-1.9-5.7Z" fill="#15191c"/></svg>',
 facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" fill="currentColor"/></svg>',
 tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3h3.1c.2 1.5 1.1 2.7 2.7 3.2v3.1a8.2 8.2 0 0 1-2.7-.8v6.1a6.1 6.1 0 1 1-5.3-6.1v3.2a2.9 2.9 0 1 0 2.2 2.8V3Z" fill="currentColor"/></svg>',
 youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.2a2.9 2.9 0 0 0-2-2C17.2 4.7 12 4.7 12 4.7s-5.2 0-7 .5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2.5 12 30 30 0 0 0 3 16.8a2.9 2.9 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.9 2.9 0 0 0 2-2 30 30 0 0 0 .5-4.8 30 30 0 0 0-.5-4.8Z" fill="currentColor"/><path d="m10 15.5 5-3.5-5-3.5v7Z" fill="#15191c"/></svg>',
 x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 4h3.8l3.1 4.2L15.8 4h3.1l-5.4 6.3L20 20h-3.8l-3.7-5-4.3 5H5.1l5.8-6.8L5.1 4Zm3.2 2 7 12h1.5L9.8 6H8.3Z" fill="currentColor"/></svg>'
};return icons[type]||'↗'}
function mediaLinksHtml(){const items=[['instagram','Instagram'],['telegram','Telegram'],['facebook','Facebook'],['tiktok','TikTok'],['youtube','YouTube'],['x','X']];return items.map(([key,label])=>{const href=mediaUrl(db.settings[key]);return href?`<a class="mediaLink media-${key}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}"><span class="mediaLogo">${mediaIcon(key)}</span></a>`:''}).join('')}
function contact(){setNav('contact');location.hash='contact';const phones=`Phone: ${esc(db.settings.phone)}${String(db.settings.phone2||'').trim()?`<br>Phone: ${esc(String(db.settings.phone2).trim())}`:''}${String(db.settings.phone3||'').trim()?`<br>Phone: ${esc(String(db.settings.phone3).trim())}`:''}`;render(`<section class="infoPage"><span class="eyebrow">CONTACT</span><h1>GET IN <span class="accent">TOUCH</span></h1><p>Address: ${esc(db.settings.address)}<br>${phones}</p><div class="contactMedia">${mediaLinksHtml()}</div><p>Email: ${esc(db.settings.email)}</p><div class="contactActions"><button class="primary" onclick="smartEnquiry('Hello, I would like to enquire about your auto parts.')">SEND ENQUIRY</button><button class="backBtn" onclick="home()">← BACK TO HOME</button></div></section>`)}
function login(message=''){
 document.querySelector('#app').innerHTML=`<div class="login"><div class="loginBox"><a class="logo adminLogo" href="./">${logo()}</a><h2>Admin Sign in</h2><p class="muted">Sign in with the email and password created in Supabase Authentication.</p>${message?`<div class="adminTip"><strong>${esc(message)}</strong></div>`:''}<input id="adminEmail" type="email" class="input" placeholder="Email address" autocomplete="username"><br><input id="adminPassword" type="password" class="input" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"><br><br><button class="primary" onclick="doLogin()">SIGN IN</button><button class="ghost" onclick="location.href='./'">CANCEL</button></div></div>`
}
async function doLogin(){const email=document.querySelector('#adminEmail')?.value.trim(),password=document.querySelector('#adminPassword')?.value;if(!email||!password)return toast('Enter your email and password');const btn=document.querySelector('.loginBox .primary');if(btn)btn.disabled=true;const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error){if(btn)btn.disabled=false;return toast(error.message||'Sign in failed')}currentSession=data.session;const {data:row,error:ae}=await supabaseClient.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle();if(ae||!row){await supabaseClient.auth.signOut();if(btn)btn.disabled=false;return toast('This account is not authorized as an admin')}admin=true;try{await loadRemoteDb();adminPanel(isTyreAdminRoute()?'tyres':'dashboard')}catch(e){console.error(e);toast('Signed in, but online catalog could not be loaded')}}
let adminCatalogOpen=true;
function toggleAdminCatalog(){adminCatalogOpen=!adminCatalogOpen;adminPanel(location.hash.replace('#','')||'dashboard')}
let adminSidebarOpen=false;
let tyreAdminSubTab='dashboard';
function tyreAdminGo(sub){tyreAdminSubTab=sub;history.pushState({adminTyreTab:sub},'',`#${sub}`);adminPanel('tyres',true)}
function toggleAdminSidebar(){adminSidebarOpen=!adminSidebarOpen;const shell=document.querySelector('.adminShell')||document.querySelector('.tyreAdminShell');if(!shell)return;shell.classList.toggle('sidebarHidden',!adminSidebarOpen);const btn=document.querySelector('#adminHeaderToggle');if(btn){btn.setAttribute('aria-expanded',String(adminSidebarOpen));btn.setAttribute('title',adminSidebarOpen?'Hide admin control panel':'Show admin control panel');btn.setAttribute('aria-label',adminSidebarOpen?'Hide admin control panel':'Show admin control panel');btn.classList.toggle('isClosed',!adminSidebarOpen);}}
function adminPanel(tab='dashboard',fromHistory=false){
 if(!admin)return login();
 if(!fromHistory){const target=tab==='tyres'?`#${tyreAdminSubTab}`:(tab==='dashboard'?'#dashboard':`#${tab}`);if(location.hash!==target){history.pushState({adminTab:tab,adminTyreTab:tyreAdminSubTab},'',target)}}else if(!location.hash){history.replaceState({adminTab:tab,adminTyreTab:tyreAdminSubTab},'',tab==='tyres'?`#${tyreAdminSubTab}`:`#${tab}`)}
 if(tab==='tyres'){
  document.querySelector('#app').innerHTML=`
   <header class="adminGlobalHeader tyreAdminGlobalHeader">
    <a class="adminGlobalLogo" href="/admin">${logo()}</a>
    <a class="adminHeaderSwitch" href="/admin">AUTO PARTS</a>
    <button id="adminHeaderToggle" class="adminHeaderToggle" type="button" onclick="toggleAdminSidebar()" aria-label="Toggle tyre admin control panel" aria-expanded="${adminSidebarOpen}" title="${adminSidebarOpen?'Hide tyre admin control panel':'Show tyre admin control panel'}"><span></span><span></span><span></span></button>
   </header>
   <div class="tyreAdminShell ${adminSidebarOpen?'':'sidebarHidden'}">
    <aside class="tyreAdminSide">
     <div class="tyreAdminBrandBlock"><div class="tyreAdminWheel">◉</div><div><strong>TYRES</strong><span>ADMIN</span></div></div>
     <div class="tyreAdminNavTitle">TYRE MANAGEMENT</div>
     <button class="tyreSideBtn ${tyreAdminSubTab==='dashboard'?'active':''}" onclick="tyreAdminGo('dashboard')"><span>▣</span> Dashboard</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='settings'?'active':''}" onclick="tyreAdminGo('settings')"><span>◆</span> Settings</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='brands'?'active':''}" onclick="tyreAdminGo('brands')"><span>◉</span> Tyre Brands</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='featured'?'active':''}" onclick="tyreAdminGo('featured')"><span>◇</span> Tyre Types</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='sizes'?'active':''}" onclick="tyreAdminGo('sizes')"><span>▣</span> Tyre Sizes</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='products'?'active':''}" onclick="tyreAdminGo('products')"><span>◈</span> Tyre Products</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='by-car'?'active':''}" onclick="tyreAdminGo('by-car')"><span>🚘</span> Find Tyre By Car</button>
     <button class="tyreSideBtn ${tyreAdminSubTab==='by-number'?'active':''}" onclick="tyreAdminGo('by-number')"><span>◉</span> Find Tyre By Size</button>
     <button class="tyreSideBtn" onclick="location.href='/#tyres'"><span>↗</span> View Tyre Website</button>
     <div class="tyreSideSpacer"></div>
     <button class="tyreSideBtn tyreDashboardOnly" onclick="location.href='/admin'"><span>←</span> Auto Parts Admin</button>
     <button class="tyreSideBtn" onclick="logout()"><span>⇥</span> Sign out</button>
     <div class="tyreSideNote"><strong>TYRE SECTION</strong><span>Manage the dedicated tyre page separately from the auto-parts catalog.</span></div>
    </aside>
    <main class="tyreAdminMain"><div id="adminContent"></div></main>
   </div>`;
  adminContent('tyres');
  return;
 }
 const catalogTabs=['brands','models','years','categories','products'];
 if(catalogTabs.includes(tab))adminCatalogOpen=true;
 const label=tab==='dashboard'?'Dashboard':tab==='settings'?'Settings':tab==='backup'?'Backup':tab[0].toUpperCase()+tab.slice(1);
 const adminHeader=`<header class="adminGlobalHeader"><a class="adminGlobalLogo" href="/admin">${logo()}</a>${tab==='dashboard'?'<a class="adminHeaderSwitch" href="/admin/tyres.html" data-admin-tyres-link="true">TYRES</a>':''}<button id="adminHeaderToggle" class="adminHeaderToggle" type="button" onclick="toggleAdminSidebar()" aria-label="Toggle admin control panel" aria-expanded="${adminSidebarOpen}" title="${adminSidebarOpen?'Hide admin control panel':'Show admin control panel'}"><span></span><span></span><span></span></button></header>`;
 document.querySelector('#app').innerHTML=`${adminHeader}<div class="adminShell ${adminSidebarOpen?'':'sidebarHidden'}"><aside class="adminSide"><div class="adminTitle">ADMIN CONTROL PANEL</div><button class="sideBtn ${tab==='dashboard'?'active':''}" onclick="adminPanel('dashboard')">⌂ &nbsp; Dashboard</button><button class="sideBtn ${tab==='enquiries'?'active':''}" onclick="adminPanel('enquiries')">▤ &nbsp; Enquiries</button><button class="sideBtn catalogToggle ${catalogTabs.includes(tab)?'activeGroup':''}" onclick="toggleAdminCatalog()">▣ &nbsp; Catalog <span class="sideChevron">${adminCatalogOpen?'▾':'▸'}</span></button>${adminCatalogOpen?`<div class="catalogSubmenu">${catalogTabs.map(t=>`<button class="sideBtn subSideBtn ${tab===t?'active':''}" onclick="adminPanel('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div>`:''}<button class="sideBtn ${tab==='settings'?'active':''}" onclick="adminPanel('settings')">⚙ &nbsp; Settings</button><button class="sideBtn ${tab==='backup'?'active':''}" onclick="adminPanel('backup')">↕ &nbsp; Backup</button><div class="sideSpacer"></div><button class="sideBtn" onclick="logout()">⇥ &nbsp; Sign out</button></aside><section class="adminMain"><div class="adminTop"><div class="adminHeading"><div><div class="adminEyebrow">ADMIN</div><h1>${label}</h1></div></div><a class="viewSite" href="/">VIEW WEBSITE</a></div><section class="adminPanel" id="adminContent"></section></section></div>`;
 adminContent(tab);
 if(catalogTabs.includes(tab)){apBeginOrderSession(tab);initApCatalogCompactCards();initApCatalogPointerDrag()}
}

function enquiriesAdmin(c){
 c.innerHTML=`<div class="adminHead"><div><h2>Enquiry CRM</h2><p class="muted">Track customer part enquiries from new request through follow-up and closure.</p></div><button class="ghost" onclick="enquiriesAdmin(document.querySelector('#adminContent'))">REFRESH</button></div><div class="enquiryToolbar"><input id="enquirySearch" class="input" placeholder="Search product, brand, model, category or part..." oninput="renderEnquiryTable()"><select id="enquiryStatusFilter" class="select" onchange="renderEnquiryTable()"><option value="">All statuses</option><option>New</option><option>Contacted</option><option>Quoted</option><option>Sold</option><option>Closed</option></select></div><div id="enquiryTableWrap"><div class="adminTip"><strong>Loading enquiries…</strong><span>Reading customer requests from Supabase.</span></div></div>`;
 const result=await loadEnquiries();window.__adminEnquiries=result.rows;window.__adminEnquiryError=result.error;renderEnquiryTable();
}
function renderEnquiryTable(){
 const wrap=document.querySelector('#enquiryTableWrap');if(!wrap)return;const rows=window.__adminEnquiries||[];const q=String(document.querySelector('#enquirySearch')?.value||'').trim().toLowerCase();const status=String(document.querySelector('#enquiryStatusFilter')?.value||'');
 const filtered=rows.filter(e=>{const hay=[e.product_name,e.brand_name,e.model_name,e.category_name,e.part_no,e.year,e.admin_note].filter(Boolean).join(' ').toLowerCase();return (!q||hay.includes(q))&&(!status||(e.status||'New')===status)});
 const stats={New:0,Contacted:0,Quoted:0,Sold:0,Closed:0};rows.forEach(e=>stats[e.status||'New']=(stats[e.status||'New']||0)+1);
 wrap.innerHTML=`<div class="enquiryKpis"><div><b>${rows.length}</b><span>Total</span></div><div><b>${stats.New}</b><span>New</span></div><div><b>${stats.Contacted}</b><span>Contacted</span></div><div><b>${stats.Quoted}</b><span>Quoted</span></div><div><b>${stats.Sold}</b><span>Sold</span></div></div>${window.__adminEnquiryError?`<div class="adminTip"><strong>Enquiry CRM needs the V81 database migration.</strong><span>Run the included V81 SQL once, then refresh this page.</span></div>`:''}${filtered.length?`<div class="table enquiryTable"><div class="enquiryTableHead"><span>ENQUIRY</span><span>VEHICLE</span><span>STATUS</span><span>RECEIVED</span><span>ACTIONS</span></div>${filtered.map(e=>`<div class="enquiryRow"><div><strong>${esc(e.product_name||'Product')}</strong><small>${esc([e.category_name,e.part_no].filter(Boolean).join(' · ')||'Part details not provided')}</small></div><div><strong>${esc([e.brand_name,e.model_name].filter(Boolean).join(' · ')||'—')}</strong><small>${e.year?`Year ${esc(e.year)}`:'Year —'}</small></div><div><span class="enquiryStatus ${enquiryStatusClass(e.status)}">${esc(e.status||'New')}</span></div><div><small>${enquiryTime(e.created_at)}</small></div><div class="enquiryActions"><button class="ghost" onclick="enquiryDetails('${e.id}')">VIEW</button><button class="danger" onclick="deleteEnquiry('${e.id}')">DELETE</button></div></div>`).join('')}</div>`:'<div class="empty"><strong>No enquiries found</strong><span>Try another search or status filter.</span></div>'}`;
}

async function dashboardAdmin(c){
 const total=db.parts.length,withImages=db.parts.filter(p=>p.image).length,missingImages=total-withImages;
 const stock=db.parts.filter(p=>String(p.availability||'').toLowerCase()==='in stock').length;
 const enquiry=db.parts.filter(p=>String(p.availability||'').toLowerCase()==='available on enquiry').length;
 const out=db.parts.filter(p=>String(p.availability||'').toLowerCase()==='out of stock').length;
 const coverage=total?Math.round(withImages/total*100):0;
 const recent=[...db.parts].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,6);
 c.innerHTML=`<div class="adminWelcome"><div><span class="eyebrow">COMMAND CENTER</span><h2>Catalog overview</h2><p class="muted">Manage inventory, spot missing content, and monitor what customers are asking for.</p></div><div class="adminDashboardActions"><button class="ghost" onclick="adminPanel('products')">MANAGE PRODUCTS</button><button class="ghost" onclick="location.href='/admin/tyres.html'">MANAGE TYRES</button><button class="primary" onclick="productForm()">+ ADD PRODUCT</button></div></div>
 <div class="dashboardKpis"><div class="card dashKpi"><span>CATALOG ITEMS</span><b>${total}</b><small>${db.models.length} models · ${db.categories.length} categories</small></div><div class="card dashKpi"><span>IN STOCK</span><b>${stock}</b><small>${total?Math.round(stock/Math.max(1,total)*100):0}% of products</small></div><div class="card dashKpi"><span>ON ENQUIRY</span><b>${enquiry}</b><small>Customers contact you for these</small></div><div class="card dashKpi"><span>IMAGE COVERAGE</span><b>${coverage}%</b><small>${missingImages?missingImages+' missing':'All products have images'}</small></div></div>
 <div class="dashboardGrid"><section class="card dashboardPanel"><div class="dashboardPanelHead"><div><span class="eyebrow">CATALOG HEALTH</span><h3>Content readiness</h3></div><button class="ghost" onclick="adminPanel('products')">VIEW PRODUCTS</button></div><div class="healthRows"><div><span>Brands</span><b>${db.brands.length}</b><i style="width:${db.brands.length?100:0}%"></i></div><div><span>Models</span><b>${db.models.length}</b><i style="width:${db.brands.length?Math.min(100,db.models.length/Math.max(1,db.brands.length)*18):0}%"></i></div><div><span>Years</span><b>${db.years.length}</b><i style="width:${db.models.length?Math.min(100,db.years.length/Math.max(1,db.models.length)*12):0}%"></i></div><div><span>Products with images</span><b>${withImages}/${total}</b><i style="width:${coverage}%"></i></div></div><div class="healthAlerts">${missingImages?`<div class="healthAlert warn"><strong>${missingImages} product${missingImages===1?'':'s'} missing images</strong><button class="ghost" onclick="adminPanel('products')">REVIEW</button></div>`:''}${out?`<div class="healthAlert"><strong>${out} product${out===1?'':'s'} marked out of stock</strong><span>Hidden from customers.</span></div>`:''}${!missingImages&&!out?'<div class="healthAlert good"><strong>Catalog looks healthy</strong><span>No obvious content warnings.</span></div>':''}</div></section>
 <section class="card dashboardPanel"><div class="dashboardPanelHead"><div><span class="eyebrow">RECENT PRODUCTS</span><h3>Latest catalog additions</h3></div><button class="ghost" onclick="productForm()">+ PRODUCT</button></div>${recent.length?`<div class="recentProducts">${recent.map(p=>{const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId);return `<div class="recentProduct"><img src="${p.image||placeholder(p.name)}"><div><strong>${esc(p.name||'Product')}</strong><small>${esc([b?.name,m?.name,p.category].filter(Boolean).join(' · '))}</small></div><span class="availability ${String(p.availability||'').toLowerCase().replace(/\s+/g,'-')}">${esc(p.availability||'Available on enquiry')}</span></div>`}).join('')}</div>`:'<p class="muted">No products yet. Add your first product to start the catalog.</p>'}</section></div>
 <div id="enquiryStats"><div class="adminTip"><strong>Loading enquiry analytics…</strong><span>Reading real customer enquiries from Supabase.</span></div></div>
 <div class="quickActions"><button onclick="brandForm()"><strong>+ Brand</strong><span>Add a car brand</span></button><button onclick="modelForm()"><strong>+ Model</strong><span>Add a model and image</span></button><button onclick="yearForm()"><strong>+ Years</strong><span>Select many years</span></button><button onclick="categoryForm()"><strong>+ Category</strong><span>Create a global category</span></button></div>`;
 const e=await loadEnquiryStats(),max=Math.max(1,...e.products.map(x=>Number(x.enquiry_count)||0)),catMax=Math.max(1,...e.categories.map(x=>Number(x.enquiry_count)||0)),brandMax=Math.max(1,...e.brands.map(x=>Number(x.enquiry_count)||0));
 const box=document.querySelector('#enquiryStats');if(!box)return;
 const statusNames=['New','Contacted','Quoted','Sold','Closed'];const statusCounts=Object.fromEntries(statusNames.map(x=>[x,0]));(e.statuses||[]).forEach(x=>{const k=statusNames.includes(x.status)?x.status:'New';statusCounts[k]++});
 const maxDaily=Math.max(1,...e.daily.map(x=>Number(x.enquiry_count)||0));
 const dayLabels=e.daily.map(x=>{const d=new Date(String(x.enquiry_date||'')+'T00:00:00');return Number.isNaN(d.getTime())?String(x.enquiry_date||''):d.toLocaleDateString([], {month:'short',day:'numeric'})});
 const totalStatus=Math.max(1,Object.values(statusCounts).reduce((a,b)=>a+b,0));
 box.innerHTML=`<div class="dashboardSectionTitle"><span class="eyebrow">CUSTOMER DEMAND</span><h3>Enquiry intelligence</h3></div><div class="grid stats"><div class="card stat"><b>${e.summary.total_enquiries}</b><span>Total Enquiries</span></div><div class="card stat"><b>${e.summary.enquiries_today}</b><span>Today</span></div><div class="card stat"><b>${e.summary.enquiries_this_week}</b><span>This Week</span></div><div class="card stat"><b>${e.summary.enquiries_this_month}</b><span>This Month</span></div></div>
 <div class="analyticsOverview"><div class="card analyticsCard analyticsChartCard"><div class="analyticsCardHead"><div><span class="eyebrow">LAST 14 DAYS</span><h3>Enquiry activity</h3></div><span class="analyticsHint">Requests per day</span></div>${e.daily.length?`<div class="dailyChart" role="img" aria-label="Daily enquiries for the last 14 days">${e.daily.map((x,i)=>`<div class="dailyBarCol"><span class="dailyValue">${Number(x.enquiry_count)||0}</span><div class="dailyBarTrack"><i style="height:${Math.max(5,Math.round(((Number(x.enquiry_count)||0)/maxDaily)*100))}%"></i></div><small>${esc(dayLabels[i]||'')}</small></div>`).join('')}</div>`:'<p class="muted">No daily enquiry data yet.</p>'}</div><div class="card analyticsCard statusCard"><div class="analyticsCardHead"><div><span class="eyebrow">PIPELINE</span><h3>Enquiry status</h3></div><button class="ghost" onclick="adminPanel('enquiries')">OPEN CRM</button></div>${statusNames.map(name=>`<div class="statusMetric"><div><span>${name}</span><b>${statusCounts[name]}</b></div><div class="statusBar"><i style="width:${Math.round(statusCounts[name]/totalStatus*100)}%"></i></div></div>`).join('')}</div></div>
 <div class="analyticsGrid"><div class="card analyticsCard"><span class="eyebrow">TOP PRODUCTS</span><h3>Most Enquired Products</h3>${e.products.length?e.products.map((x,i)=>`<div class="rankRow"><span class="rank">${i+1}</span><div class="rankInfo"><strong>${esc(x.product_name||'Product')}</strong><small>${esc([x.brand_name,x.model_name,x.category_name].filter(Boolean).join(' · '))}</small><div class="bar"><i style="width:${Math.round((Number(x.enquiry_count||0)/max)*100)}%"></i></div></div><b>${Number(x.enquiry_count)||0}</b></div>`).join(''):'<p class="muted">No enquiries recorded yet.</p>'}</div><div class="card analyticsCard"><span class="eyebrow">CATEGORIES</span><h3>Most Enquired Categories</h3>${e.categories.length?e.categories.slice(0,6).map(x=>`<div class="simpleRank"><span>${esc(x.category_name||'Unknown')}</span><b>${Number(x.enquiry_count)||0}</b><div class="bar"><i style="width:${Math.round((Number(x.enquiry_count||0)/catMax)*100)}%"></i></div></div>`).join(''):'<p class="muted">No category data yet.</p>'}</div><div class="card analyticsCard"><span class="eyebrow">BRANDS</span><h3>Most Enquired Brands</h3>${e.brands.length?e.brands.slice(0,6).map(x=>`<div class="simpleRank"><span>${esc(x.brand_name||'Unknown')}</span><b>${Number(x.enquiry_count)||0}</b><div class="bar"><i style="width:${Math.round((Number(x.enquiry_count||0)/brandMax)*100)}%"></i></div></div>`).join(''):'<p class="muted">No brand data yet.</p>'}</div></div>${e.error?'<div class="adminTip"><strong>Customer enquiry data could not be loaded.</strong><span>Check the product_enquiries table and admin read policy.</span></div>':`<div class="recentEnquiryPanel card"><div class="dashboardPanelHead"><div><span class="eyebrow">RECENT CUSTOMER ACTIVITY</span><h3>Latest Enquiries</h3></div><button class="ghost" onclick="adminPanel('enquiries')">OPEN CRM</button></div>${e.recent.length?`<div class="recentEnquiryList">${e.recent.map(x=>`<div class="recentEnquiry"><div><strong>${esc(x.product_name||'Product enquiry')}</strong><small>${esc([x.brand_name,x.model_name,x.category_name,x.year].filter(Boolean).join(' · ')||'Part details not provided')}</small></div><span class="enquiryStatus ${enquiryStatusClass(x.status)}">${esc(x.status||'New')}</span><time>${enquiryTime(x.created_at)}</time></div>`).join('')}</div>`:'<p class="muted">No customer enquiries recorded yet.</p>'}</div>`}`;
}


function settingsAdmin(c){c.innerHTML=`<h2>Business & homepage settings</h2><p class="muted">Control the logo, contact details and homepage hero text/image.</p><div class="formGroup"><label>Logo</label><input id="logoFile" type="file" accept="image/png,image/jpeg,image/webp" class="input" onchange="prepareImageSelection(event,'logoFile')"><small class="helpText">Recommended: transparent PNG.</small></div><div class="row"><div class="formGroup"><label>Business name</label><input id="sname" class="input" value="${esc(db.settings.businessName)}"></div><div class="formGroup"><label>Tagline</label><input id="stag" class="input" value="${esc(db.settings.tagline)}"></div></div><div class="row"><div class="formGroup"><label>Phone</label><input id="sphone" class="input" value="${esc(db.settings.phone)}"></div><div class="formGroup"><label>WhatsApp number</label><input id="swa" class="input" value="${esc(db.settings.whatsapp)}"><small class="helpText">Used for product enquiries. Keep this separate from the additional contact numbers.</small></div></div><div class="adminContactBox"><h3>Additional Contact Numbers</h3><p class="muted">Optional display-only numbers. Leave either field empty and it will not appear on the website. These numbers are never used for WhatsApp enquiries.</p><div class="row"><div class="formGroup"><label>Additional contact phone 1 <span class="optional">(optional)</span></label><input id="sphone2" class="input" value="${esc(db.settings.phone2||'')}" placeholder="Leave blank if not needed"></div><div class="formGroup"><label>Additional contact phone 2 <span class="optional">(optional)</span></label><input id="sphone3" class="input" value="${esc(db.settings.phone3||'')}" placeholder="Leave blank if not needed"></div></div></div><div class="adminContactBox adminMediaBox"><h3>Other Media & Social Links</h3><p class="muted">All fields are optional. Leave any field empty and its circular logo will not appear. When saved, the logo appears in the footer Contact & Support section below the phone numbers. Clicking a logo opens the saved page in a new tab.</p><div class="row"><div class="formGroup"><label>Instagram <span class="optional">(optional)</span></label><input id="sinstagram" class="input" value="${esc(db.settings.instagram||'')}" placeholder="https://instagram.com/yourpage"></div><div class="formGroup"><label>Telegram <span class="optional">(optional)</span></label><input id="stelegram" class="input" value="${esc(db.settings.telegram||'')}" placeholder="https://t.me/yourpage"></div></div><div class="row"><div class="formGroup"><label>Facebook <span class="optional">(optional)</span></label><input id="sfacebook" class="input" value="${esc(db.settings.facebook||'')}" placeholder="https://facebook.com/yourpage"></div><div class="formGroup"><label>TikTok <span class="optional">(optional)</span></label><input id="stiktok" class="input" value="${esc(db.settings.tiktok||'')}" placeholder="https://tiktok.com/@yourpage"></div></div><div class="row"><div class="formGroup"><label>YouTube <span class="optional">(optional)</span></label><input id="syoutube" class="input" value="${esc(db.settings.youtube||'')}" placeholder="https://youtube.com/@yourpage"></div><div class="formGroup"><label>X <span class="optional">(optional)</span></label><input id="sx" class="input" value="${esc(db.settings.x||'')}" placeholder="https://x.com/yourpage"></div></div></div><div class="row"><div class="formGroup"><label>Email</label><input id="semail" class="input" value="${esc(db.settings.email)}"></div><div class="formGroup"><label>Address</label><input id="saddr" class="input" value="${esc(db.settings.address)}"></div></div><hr class="adminDivider"><h3>About Us page</h3><p class="muted">Edit the public About Us page. All text is optional.</p><div class="formGroup"><label>About Us title</label><input id="aboutTitle" class="input" value="${esc(db.settings.aboutTitle||'')}" placeholder="About Our Business"></div><div class="formGroup"><label>About Us content</label><textarea id="aboutText" class="textarea" rows="7" placeholder="Write your business story, services, mission, etc.">${esc(db.settings.aboutText||'')}</textarea></div>${autoHeroSettingsMarkup()}<hr class="adminDivider"><h3>Auto Parts Promo Box</h3><p class="muted">Control the promo box shown on the tyre homepage.</p><div class="row"><div class="formGroup"><label>Promo eyebrow</label><input id="promoEyebrow" class="input" value="${esc(db.settings.promoEyebrow)}"></div><div class="formGroup"><label>Promo button text</label><input id="promoButton" class="input" value="${esc(db.settings.promoButton)}"></div></div><div class="formGroup"><label>Promo headline</label><input id="promoTitle" class="input" value="${esc(db.settings.promoTitle)}"></div><div class="formGroup"><label>Promo description</label><textarea id="promoDescription" class="textarea" rows="3">${esc(db.settings.promoDescription)}</textarea></div><div class="formGroup"><label>Promo background image</label><input id="promoBackgroundFile" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'promoBackgroundFile')"><small class="helpText">Upload an image to use as the background of the Auto Parts promo box.</small></div><button class="primary" onclick="saveSettings()">SAVE SETTINGS</button>`}

function backupAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Backup & Restore</h2><p class="muted">Create a complete online snapshot before making major catalog changes. Restoring uses a safe merge/upsert and does not delete existing records.</p></div><button class="ghost" onclick="backupAdmin(document.querySelector('#adminContent'))">REFRESH</button></div><div class="backupCards"><div class="backupCard"><span class="eyebrow">ONLINE BACKUP</span><h3>Full database snapshot</h3><p>Includes brands, models, years, categories, branches, products, relationships, settings and enquiry records when available.</p><button class="primary" onclick="downloadFullBackup()">DOWNLOAD FULL BACKUP</button></div><div class="backupCard"><span class="eyebrow">RESTORE</span><h3>Restore a backup</h3><p>Upload a JSON backup to merge its catalog data into the current online database. Existing records with the same IDs are updated.</p><label class="primary fileBtn">SELECT BACKUP<input id="restoreBackupFile" type="file" accept="application/json" hidden onchange="restoreFullBackup(event)"></label></div></div><hr class="adminDivider"><div class="adminHead"><div><h3 style="margin:0;font-family:'Montserrat',sans-serif;font-size:16px">Legacy migration</h3><p class="muted">Use these only for older local catalog JSON files from before the online database.</p></div></div><button class="ghost" onclick="downloadBackup()">EXPORT CURRENT LOCAL CACHE</button> <label class="ghost fileBtn">IMPORT LEGACY JSON<input type="file" accept="application/json" hidden onchange="importBackup(event)"></label> <button class="ghost" onclick="migrateLocalCatalog()">MIGRATE CURRENT LOCAL CATALOG</button><div class="adminTip"><strong>Safe restore</strong><span>Images remain stored in Supabase Storage. The backup preserves their public URLs; it does not duplicate image files.</span></div><div id="backupStatus" class="backupStatus"></div>`}

function adminContent(t){const c=document.querySelector('#adminContent');if(!c)return;if(t==='dashboard')dashboardAdmin(c);else if(t==='enquiries')enquiriesAdmin(c);else if(t==='brands')brandAdmin(c);else if(t==='models')modelAdmin(c);else if(t==='years')yearAdmin(c);else if(t==='categories')categoryAdmin(c);else if(t==='products')productAdmin(c);else if(t==='settings')settingsAdmin(c);else if(t==='tyres')tyresAdmin(c);else if(t==='backup')backupAdmin(c);}

/* AUTO PARTS ADMIN — Tyre Admin-style movable expandable catalog cards */
function apAdminOrderCard(title,subtitle,body,open=false){
 return '<section class="apAdminExpandCard '+(open?'isOpen':'')+'"><button type="button" class="apAdminExpandHead" aria-expanded="'+open+'" onclick="this.parentElement.classList.toggle(\'isOpen\');this.setAttribute(\'aria-expanded\',this.parentElement.classList.contains(\'isOpen\'))"><span><b>'+esc(title)+'</b><small>'+esc(subtitle||'')+'</small></span><span class="apAdminChevron">▾</span></button><div class="apAdminExpandBody">'+body+'</div></section>';
}
async function apSaveOrder(table,items,silent=false){
 const ordered=items.map((x,i)=>({id:x.id,sortOrder:i}));
 try{
  for(const x of ordered){const {error}=await supabaseClient.from(table).update({sort_order:x.sortOrder}).eq('id',x.id);if(error)throw error}
  items.forEach((x,i)=>x.sortOrder=i);cacheDb();if(!silent)toast('Order saved');return true;
 }catch(e){console.error(e);toast(e.message||'Could not save order');return false}
}
function apMoveItems(items,index,direction,rerender){
 const to=index+direction;if(index<0||to<0||index>=items.length||to>=items.length)return;
 [items[index],items[to]]=[items[to],items[index]];items.forEach((x,i)=>x.sortOrder=i);rerender();
}
function apOrderButtons(){return '';}
const __apOrderSnapshots={};
function apOrderSource(tab){
 if(tab==='brands')return db.brands;
 if(tab==='models')return db.models;
 if(tab==='years')return db.years;
 if(tab==='categories')return db.categories;
 if(tab==='products')return db.parts;
 return null;
}
function apBeginOrderSession(tab){
 const source=apOrderSource(tab);
 if(!source)return;
 if(!__apOrderSnapshots[tab])__apOrderSnapshots[tab]=clone(source);
}
function apClearOrderSession(tab){delete __apOrderSnapshots[tab];}
function apCancelOrder(tab){
 const snapshot=__apOrderSnapshots[tab];
 if(!snapshot)return adminPanel(tab);
 const restored=clone(snapshot);
 if(tab==='brands')db.brands=restored;
 else if(tab==='models')db.models=restored;
 else if(tab==='years')db.years=restored;
 else if(tab==='categories')db.categories=restored;
 else if(tab==='products')db.parts=restored;
 cacheDb();
 apClearOrderSession(tab);
 adminPanel(tab);
 toast('Changes cancelled');
}
function apCatalogBottomActions(tab){
 return '<div class="apAdminBottomActions"><div class="apAdminBottomNote"><strong>Catalog order</strong><span>Drag cards using the ⋮⋮ handle, then save when you are finished.</span></div><div class="apAdminBottomButtons"><button type="button" class="ghost" onclick="apCancelOrder(\''+tab+'\')">CANCEL</button><button type="button" class="primary" onclick="apSaveOrderForPage(\''+tab+'\')">SAVE</button></div></div>';
}
async function apSaveOrderForPage(tab){
 const source=apOrderSource(tab);
 if(!source)return;
 const table=tab==='years'?'model_years':tab==='products'?'products':tab;
 const ok=await apSaveOrder(table,source,true);
 if(ok)apClearOrderSession(tab);
}
function apCatalogCard(title,meta,body,index,count,moveFn,itemId){
 const group=moveFn==='apMoveBrand'?'brands':moveFn==='apMoveModel'?'models':moveFn==='apMoveYear'?'years':'categories';
 return '<article class="apCatalogItemCard" draggable="true" data-ap-drag-group="'+group+'" data-ap-drag-id="'+esc(String(itemId??''))+'" data-ap-drag-index="'+index+'"><div class="apCatalogItemHead" role="button" tabindex="0" aria-expanded="false" onclick="apToggleCatalogCard(this)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();apToggleCatalogCard(this)}"><span class="apCatalogItemTitle"><span class="apDragHandle" data-ap-drag-handle title="Hold and drag to reorder">⋮⋮</span><b>'+esc(title)+'</b><small>'+esc(meta||'')+'</small></span><span class="apCatalogItemActions">'+apOrderButtons('',index,count,moveFn)+'<span class="apCatalogChevron">⌄</span></span></div><div class="apCatalogItemBody">'+body+'</div></article>';
}
function initApCatalogCompactCards(){
 document.querySelectorAll('.apCatalogItemCard').forEach(card=>{
  if(card.dataset.apCompactBound)return;
  card.dataset.apCompactBound='1';
  card.querySelector('.apDragHandle')?.addEventListener('click',e=>e.stopPropagation());
 });
}
function initApCatalogDrag(){
 if(window.__apCatalogDragBound)return;
 window.__apCatalogDragBound=true;
 let dragged=null;
 document.addEventListener('dragstart',e=>{
  const card=e.target.closest?.('[data-ap-drag-group]');if(!card)return;
  if(!e.target.closest('.apDragHandle')){e.preventDefault();return}
  dragged=card;card.classList.add('apDragging');
  try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','ap')}catch(_){}
 },true);
 document.addEventListener('dragover',e=>{
  if(!dragged)return;
  const target=e.target.closest?.('[data-ap-drag-group="'+dragged.dataset.apDragGroup+'"]');
  if(!target||target===dragged)return;
  e.preventDefault();
  const box=target.getBoundingClientRect();
  target.parentNode.insertBefore(dragged,e.clientY<box.top+box.height/2?target:target.nextSibling);
 },true);
 document.addEventListener('dragend',async()=>{
  if(!dragged)return;
  const group=dragged.dataset.apDragGroup;dragged.classList.remove('apDragging');
  const rows=[...document.querySelectorAll('[data-ap-drag-group="'+group+'"]')];
  const source=group==='brands'?db.brands:group==='models'?db.models:group==='years'?db.years:group==='products'?db.parts:db.categories;
  const ordered=rows.map(r=>source.find(x=>String(x.id)===String(r.dataset.apDragId))).filter(Boolean);
  if(ordered.length!==source.length){dragged=null;return}
  ordered.forEach((x,i)=>x.sortOrder=i);
  if(group==='brands')db.brands=ordered;
  else if(group==='models')db.models=ordered;
  else if(group==='years')db.years=ordered;
  else if(group==='products')db.parts=ordered;
  else db.categories=ordered;
  dragged=null;
  toast('Order changed — click SAVE to apply');
  document.querySelectorAll('[data-ap-drag-group]').forEach((row,i)=>row.dataset.apDragIndex=i);
 },true);
}
function apToggleCatalogCard(head){
 const card=head?.closest('.apCatalogItemCard');if(!card)return;
 const open=!card.classList.contains('isOpen');card.classList.toggle('isOpen',open);head.setAttribute('aria-expanded',String(open));
}
function brandAdmin(c){
 const items=[...db.brands].sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder)||String(a.createdAt||'').localeCompare(String(b.createdAt||'')));
 const cards=items.map((b,i)=>apCatalogCard(b.name,(b.isEv&&b.isRegular?'CAR + EV':b.isEv?'EV':'CAR')+' · '+db.models.filter(m=>m.brandId===b.id).length+' models',
  '<div class="apCatalogDetailGrid"><div class="tableBrand"><img class="thumb" src="'+(b.image||placeholder(b.name))+'" onerror="this.onerror=null;this.src=placeholder(\''+esc(b.name)+'\')">'+esc(b.name)+'</div><span class="brandTypeBadge '+(b.isEv&&b.isRegular?'both':b.isEv?'ev':'regular')+'">'+(b.isEv&&b.isRegular?'CAR + EV':b.isEv?'EV':'CAR')+'</span><div class="apCatalogActions"><button class="ghost" onclick="brandEditForm(\''+b.id+'\')">EDIT</button> <button class="danger" onclick="delBrand(\''+b.id+'\')">Delete</button></div></div>',i,items.length,'apMoveBrand',b.id)).join('');
 c.innerHTML=apAdminOrderCard('Vehicle Brands','Arrange the brand order shown on the Auto Parts website.','<div class="adminHead"><div><h2>Vehicle brands</h2><p class="muted">Create a brand once, then add its vehicle models.</p></div><button class="primary" onclick="brandForm()">+ ADD BRAND</button></div><div class="apOrderBar"><span>Drag the ⋮⋮ handle to arrange the order.</span></div><div class="apCatalogCardList">'+cards+'</div>',true)+apCatalogBottomActions('brands');
}
function apMoveBrand(i,d){apMoveItems(db.brands.sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder)),i,d,()=>brandAdmin(document.querySelector('#adminContent')))}
function modelAdmin(c){
 const items=[...db.models].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.name||'').localeCompare(String(b.name||'')));
 const brandItems=[...db.brands].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.name||'').localeCompare(String(b.name||'')));
 const groups=brandItems.map(b=>({brand:b,models:items.filter(m=>String(m.brandId)===String(b.id))}));
 const unassigned=items.filter(m=>!brandItems.some(b=>String(b.id)===String(m.brandId)));
 if(unassigned.length)groups.push({brand:null,models:unassigned});
 const sections=groups.map(group=>{
  const label=group.brand?.name||'Unassigned Brand';
  const type=group.brand?(group.brand.isEv&&group.brand.isRegular?'CAR + EV':group.brand.isEv?'EV':'CAR'):'';
  const cards=group.models.map(m=>{
   const globalIndex=items.findIndex(x=>String(x.id)===String(m.id));
   const tt=(db.tyres?.featured||[]).find(x=>String(x.id)===String(m.tyreTypeId));
   return apCatalogCard(
    m.name,
    label+(type?' · '+type:'')+' · '+modelYears(m.id).length+' years'+(tt?' · '+tt.title:''),
    `<div class="apCatalogDetailGrid"><div class="tableBrand"><img class="thumb" src="${m.image||placeholder(m.name)}" onerror="this.onerror=null;this.src=placeholder('${esc(m.name)}')">${esc(m.name)}</div><span>${esc(label)}</span><span>${esc(tt?.title||'Not assigned')}</span><span>${esc(modelYears(m.id).join(', ')||'No years')}</span><div class="apCatalogActions"><button class="ghost" onclick="modelEditForm('${m.id}')">EDIT</button><button class="danger" onclick="delModel('${m.id}')">Delete</button></div></div>`,
    globalIndex,items.length,'apMoveModel',m.id
   );
  }).join('');
  return `<section class="modelBrandSection"><div class="modelBrandSectionHead" role="button" tabindex="0" aria-expanded="false" onclick="this.parentElement.classList.toggle('isOpen');this.setAttribute('aria-expanded',this.parentElement.classList.contains('isOpen'))" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><div><span class="modelBrandEyebrow">BRAND</span><h3>${esc(label)}</h3></div><strong>${group.models.length} model${group.models.length===1?'':'s'}</strong></div><div class="modelBrandSectionBody"><div class="apCatalogCardList">${cards}</div></div></section>`;
 }).join('');
 c.innerHTML=apAdminOrderCard('Vehicle Models','Arrange the model order shown on the Auto Parts website.',`<div class="adminHead"><div><h2>Vehicle models</h2><p class="muted">Models are grouped into separate subsections by vehicle brand.</p></div><button class="primary" onclick="modelForm()">+ ADD MODEL</button></div><div class="apOrderBar"><span>Drag the ⋮⋮ handle to arrange the order.</span></div><div class="modelBrandSections">${sections}</div>`,true)+apCatalogBottomActions('models');
}
function yearAdmin(c){
 const items=[...db.years].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||Number(b.year)-Number(a.year)||String(a.id||'').localeCompare(String(b.id||'')));
 const cards=items.map((y,i)=>{const m=db.models.find(x=>x.id===y.modelId),b=db.brands.find(x=>x.id===m?.brandId);return apCatalogCard(
  String(y.year),
  (b?.name||'Unknown brand')+' · '+(m?.name||'Unknown model'),
  '<div class="apCatalogDetailGrid"><strong>'+esc(y.year)+'</strong><span>'+esc(m?.name||'Unknown model')+'</span><span>'+esc(b?.name||'Unknown brand')+'</span><div class="apCatalogActions"><button class="danger" onclick="delYear(\''+y.id+'\')">Delete</button></div></div>',
  i,items.length,'apMoveYear',y.id
 )}).join('');
 c.innerHTML=apAdminOrderCard('Model Years','Arrange the model-year order shown in the Auto Parts Admin.','<div class="adminHead"><div><h2>Manage model years</h2><p class="muted">Select many years at once. Customers will see Year immediately after Model.</p></div><button class="primary" onclick="yearForm()">+ SELECT YEARS</button></div><div class="apOrderBar"><span>Drag the ⋮⋮ handle to arrange the order.</span></div><div class="apCatalogCardList">'+cards+'</div>',true)+apCatalogBottomActions('years');
}
function categoryAdmin(c){
 const items=[...db.categories].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.name||'').localeCompare(String(b.name||'')));
 const cards=items.map((x,i)=>apCatalogCard(
  x.name,
  branchesForCategory(x.id).length+' branch parts',
  '<div class="apCatalogCategoryBody"><div class="catAdminInfo"><img class="thumb" src="'+(x.image||placeholder(x.name))+'" onerror="this.onerror=null;this.src=placeholder(\''+esc(x.name)+'\')"><div><strong>'+esc(x.name)+'</strong><small>'+branchesForCategory(x.id).length+' branch parts</small></div></div><div class="categoryAdminActions"><button class="ghost" onclick="categoryEditForm(\''+x.id+'\')">EDIT</button><button class="ghost" onclick="branchForm(\''+x.id+'\')">+ BRANCH</button><button class="danger" onclick="delCategory(\''+x.id+'\')">Delete</button></div><div class="branchAdminList">'+branchesForCategory(x.id).map(br=>'<div class="branchAdminItem"><div><img class="thumb smallThumb" src="'+(br.image||x.image||placeholder(br.name))+'"><span>'+esc(br.name)+'</span></div><span><button class="ghost" onclick="branchEditForm(\''+br.id+'\')">EDIT</button> <button class="danger" onclick="delBranch(\''+br.id+'\')">DELETE</button></span></div>').join('')+'</div>',
  i,items.length,'apMoveCategory',x.id
 )).join('');
 c.innerHTML=apAdminOrderCard('Part Categories','Arrange the category order shown on the Auto Parts website.','<div class="adminHead"><div><h2>Part categories</h2><p class="muted">Edit category names/images and manage branch parts.</p></div><button class="primary" onclick="categoryForm()">+ ADD CATEGORY</button></div><div class="apOrderBar"><span>Drag the ⋮⋮ handle to arrange the order.</span></div><div class="apCatalogCardList">'+cards+'</div>',true)+apCatalogBottomActions('categories');
}
function apBaseProductAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Manage products</h2><p class="muted">Search, filter, edit and manage your catalog from one place.</p></div><button class="primary" onclick="productForm()">+ ADD PRODUCT</button></div><div class="productTools productToolsAdvanced"><input id="productAdminSearch" class="input" placeholder="Search product, model, category, branch or part number..." oninput="renderProductTable()"><select id="productAdminBrand" class="select" onchange="refreshProductAdminModels()"><option value="">All brands</option>${db.brands.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')}</select><select id="productAdminModel" class="select" onchange="renderProductTable()"><option value="">All models</option></select><select id="productAdminCategory" class="select" onchange="renderProductTable()"><option value="">All categories</option>${db.categories.map(x=>`<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('')}</select><select id="productAdminYear" class="select" onchange="renderProductTable()"><option value="">All years</option>${[...new Set(db.years.map(x=>String(x.year)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b)).map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('')}</select><select id="productAdminAvailability" class="select" onchange="renderProductTable()"><option value="">All availability</option><option>In Stock</option><option>Available on enquiry</option><option>Out of Stock</option></select><button class="ghost" onclick="clearProductFilters()">RESET</button></div><div class="bulkBar bulkBarAdvanced"><label><input id="selectAllProducts" type="checkbox" onchange="toggleAllProducts(this.checked)"> Select all</label><span id="selectedProductCount">0 selected</span><button class="ghost" onclick="setSelectedProductsActive(true)">ACTIVATE</button><button class="ghost" onclick="setSelectedProductsActive(false)">DEACTIVATE</button><button class="danger" onclick="deleteSelectedProducts()">DELETE SELECTED</button></div><div id="productTableWrap"></div>`;refreshProductAdminModels();renderProductTable()}

function productAdmin(c){apBaseProductAdmin(c);setTimeout(()=>apDecorateProducts(c),0)}
function apDecorateProducts(c){
 const existing=c.querySelector('.apAdminExpandCard');
 if(!existing){const html=c.innerHTML;c.innerHTML=apAdminOrderCard('Auto Parts Products','Arrange products with the same move controls used in Tyre Admin.',html,true)}
 const list=c.querySelector('.adminProductList');if(!list)return;
 const cards=[...list.querySelectorAll('.adminProductCard')];
 const items=cards.map(card=>db.parts.find(p=>p.id===card.querySelector('.productSelect')?.value)).filter(Boolean).sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder));
 cards.forEach(card=>{
  const p=db.parts.find(x=>x.id===card.querySelector('.productSelect')?.value);if(!p)return;
  card.querySelector('.apOrderControls')?.remove();
  const i=items.indexOf(p);
  card.classList.add('apProductOrderCard','apCatalogItemCard');card.setAttribute('draggable','true');card.dataset.apDragGroup='products';card.dataset.apDragId=String(p.id);card.dataset.apDragIndex=String(i);
  if(!card.dataset.apCatalogBound){
   card.dataset.apCatalogBound='1';
   const nodes=[...card.childNodes];
   const head=document.createElement('div');head.className='apCatalogItemHead';head.setAttribute('role','button');head.tabIndex=0;head.setAttribute('aria-expanded','false');
   head.innerHTML='<span class="apCatalogItemTitle"><span class="apDragHandle" title="Hold and drag to reorder">⋮⋮</span><b>'+esc(p.name||'Unnamed product')+'</b><small>'+(esc(p.category||'Auto part'))+'</small></span><span class="apCatalogItemActions">'+apOrderButtons('products',i,items.length,'apMoveProduct')+'<span class="apCatalogChevron">⌄</span></span>';
   const body=document.createElement('div');body.className='apCatalogItemBody';
   nodes.forEach(n=>body.appendChild(n));card.append(head,body);
   head.addEventListener('click',e=>{if(e.target.closest('button,.apDragHandle'))return;apToggleCatalogCard(head)});
   head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();apToggleCatalogCard(head)}});
  }
 });
 let bar=c.querySelector('.apProductOrderBar');
 if(!bar){bar=document.createElement('div');bar.className='apOrderBar apProductOrderBar';bar.innerHTML='<span>Drag the ⋮⋮ handle to arrange the order.</span>';c.querySelector('.apAdminExpandBody')?.appendChild(bar)}
 if(!c.querySelector('.apAdminBottomActions'))c.insertAdjacentHTML('beforeend',apCatalogBottomActions('products'))
}
function apBaseRenderProductTable(){const wrap=document.querySelector('#productTableWrap');if(!wrap)return;const q=(document.querySelector('#productAdminSearch')?.value||'').toLowerCase().trim(),brand=document.querySelector('#productAdminBrand')?.value||'',model=document.querySelector('#productAdminModel')?.value||'',cat=document.querySelector('#productAdminCategory')?.value||'',year=document.querySelector('#productAdminYear')?.value||'',availability=document.querySelector('#productAdminAvailability')?.value||'';const list=uniqueProducts(db.parts.filter(p=>{const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId),hay=[p.name,p.category,p.partNo,p.description,m?.name,b?.name,productBranchIds(p).map(id=>branchById(id)?.name||'').filter(Boolean).join(' ')].join(' ').toLowerCase();const active= p.active!==false;const years=productYears(p).map(String);return (!q||hay.includes(q))&&(!brand||m?.brandId===brand)&&(!model||p.modelId===model)&&(!cat||p.category===cat)&&(!year||years.includes(year))&&(!availability||String(p.availability||'Available on enquiry')===availability)}));const status=p=>p.active===false?'Disabled':String(p.availability||'Available on enquiry');wrap.innerHTML=`<div class="adminProductList">${list.map(p=>{const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId),brs=productBranchIds(p).map(id=>branchById(id)?.name).filter(Boolean),st=status(p);return `<article class="adminProductCard ${p.active===false?'isDisabled':''}"><input class="productSelect" type="checkbox" value="${esc(p.id)}" onchange="updateSelectedProductCount()"><img class="adminProductImage" src="${p.image||placeholder('PART')}" alt="${esc(p.name||'Product')}"><div class="adminProductInfo"><div class="adminProductName">${esc(p.name)} <span class="adminProductStatus ${p.active===false?'statusDisabled':''}">${esc(st)}</span></div><div class="adminProductMeta">${esc(b?.name||'')} · ${esc(m?.name||'')} · ${esc(p.category||'')}${brs.length?' · '+esc(brs.join(', ')):''}</div><div class="adminProductMeta">Years: ${esc(productYears(p).join(', ')||'—')}</div>${p.partNo?`<div class="partNo">Part No: ${esc(p.partNo)}</div>`:''}<div class="adminProductPrice">${p.price!=null&&p.price!==''?'Price: '+priceDisplay(p):'Price: —'}</div></div><div class="actionBtns adminProductActions"><button class="ghost" onclick="editProduct('${esc(p.id)}')">Edit</button><button class="ghost" onclick="duplicateProduct('${esc(p.id)}')">Duplicate</button><button class="ghost" onclick="setProductActive('${esc(p.id)}',${p.active===false})">${p.active===false?'Activate':'Deactivate'}</button><button class="danger" onclick="delProduct('${esc(p.id)}')">Delete</button></div></article>`}).join('')||'<div class="empty">No matching products.</div>'}</div>`;updateSelectedProductCount()}

function renderProductTable(){apBaseRenderProductTable();setTimeout(()=>apDecorateProducts(document.querySelector('#adminContent')),0)}
function apMoveProduct(i,d){const items=db.parts.sort((a,b)=>Number(a.sortOrder)-Number(b.sortOrder));apMoveItems(items,i,d,()=>{adminPanel('products')})}
window.addEventListener('popstate',()=>{if(!admin)return;if(isTyreAdminRoute()){tyreAdminSubTab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel('tyres',true);return}const tab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel(tab,true)});
window.addEventListener('hashchange',()=>{if(!admin)return;if(isTyreAdminRoute()){tyreAdminSubTab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel('tyres',true);return}const tab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel(tab,true)});
/* FINAL MOBILE-SAFE AUTO PARTS REORDER — pointer drag, matching Tyre Admin */
function initApCatalogPointerDrag(){
 if(window.__apCatalogPointerDragBound)return;
 window.__apCatalogPointerDragBound=true;
 let state=null;
 const finish=()=>{
  if(!state)return;
  const s=state;state=null;
  const row=s.row;
  if(s.placeholder){s.placeholder.parentNode?.insertBefore(row,s.placeholder);s.placeholder.remove()}
  row.style.position='';row.style.left='';row.style.top='';row.style.width='';row.style.zIndex='';row.style.margin='';
  row.classList.remove('apDragPressed','apDragging');
  document.documentElement.classList.remove('apCatalogDragging');
  document.querySelectorAll('.apDragTarget').forEach(x=>x.classList.remove('apDragTarget'));
  if(!s.moved)return;
  const rows=[...document.querySelectorAll('[data-ap-drag-group="'+CSS.escape(s.group)+'"]')];
  const source=s.group==='brands'?db.brands:s.group==='models'?db.models:s.group==='years'?db.years:s.group==='products'?db.parts:db.categories;
  const reordered=rows.map(x=>source.find(item=>String(item.id)===String(x.dataset.apDragId))).filter(Boolean);
  if(reordered.length!==source.length)return;
  reordered.forEach((item,i)=>item.sortOrder=i);
  if(s.group==='brands')db.brands=reordered;
  else if(s.group==='models')db.models=reordered;
  else if(s.group==='years')db.years=reordered;
  else if(s.group==='products')db.parts=reordered;
  else db.categories=reordered;
  cacheDb();
  if(s.group==='brands')brandAdmin(document.querySelector('#adminContent'));
  else if(s.group==='models')modelAdmin(document.querySelector('#adminContent'));
  else if(s.group==='years')yearAdmin(document.querySelector('#adminContent'));
  else if(s.group==='products')productAdmin(document.querySelector('#adminContent'));
  else categoryAdmin(document.querySelector('#adminContent'));
  toast('Order changed — click SAVE to apply');
 };
 document.addEventListener('pointerdown',e=>{
  const handle=e.target.closest?.('[data-ap-drag-handle]');
  if(!handle)return;
  const row=handle.closest?.('[data-ap-drag-group]');
  if(!row)return;
  const rect=row.getBoundingClientRect();
  state={row,group:row.dataset.apDragGroup,startY:e.clientY,moved:false,offset:e.clientY-rect.top,placeholder:null};
  row.classList.add('apDragPressed');
  document.documentElement.classList.add('apCatalogDragging');
  try{handle.setPointerCapture?.(e.pointerId)}catch(_){}
 },true);
 document.addEventListener('pointermove',e=>{
  const s=state;if(!s)return;
  if(!s.moved&&Math.abs(e.clientY-s.startY)>6){
   s.moved=true;
   const rect=s.row.getBoundingClientRect();
   const ph=document.createElement('div');ph.className='apDragPlaceholder';ph.style.height=rect.height+'px';ph.style.width=rect.width+'px';ph.style.boxSizing='border-box';
   s.placeholder=ph;s.row.parentNode.insertBefore(ph,s.row);
   s.row.style.position='fixed';s.row.style.left=rect.left+'px';s.row.style.top=rect.top+'px';s.row.style.width=rect.width+'px';s.row.style.zIndex='9999';s.row.style.margin='0';
   s.row.classList.add('apDragging');
  }
  if(!s.moved)return;
  s.row.style.top=(e.clientY-s.offset)+'px';
  const candidates=[...document.querySelectorAll('[data-ap-drag-group="'+CSS.escape(s.group)+'"]')].filter(x=>x!==s.row);
  let target=null;
  for(const x of candidates){const box=x.getBoundingClientRect();if(e.clientY<box.top+box.height/2){target=x;break}}
  if(target)target.parentNode.insertBefore(s.placeholder,target);
  else if(candidates.length)candidates[candidates.length-1].parentNode.appendChild(s.placeholder);
  s.placeholder.classList.add('apDragTarget');
 },true);
 document.addEventListener('pointerup',finish,true);
 document.addEventListener('pointercancel',finish,true);
}
function initApCatalogDrag(){initApCatalogPointerDrag();}
window.addEventListener('error',e=>{console.error(e.error||e.message);const app=document.querySelector('#app');if(app && !app.innerHTML.trim()){app.innerHTML='<div class=\"login\"><div class=\"loginBox\"><h2>Website could not start</h2><p class=\"muted\">Please refresh this page. If the problem continues, send a screenshot to the developer.</p></div></div>'}});
if(isAdminRoute())bootAdmin();else bootCustomer();