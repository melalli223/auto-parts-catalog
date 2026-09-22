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
const slug=x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
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
hero:{title:'FIND WHEELS & TYRES',red:'FOR ALL VEHICLE TYPES',description:'High quality tyres for better performance,\nsafety and a smoother ride.',image:'/assets/tyre-ref/hero.png',images:['/assets/tyre-ref/hero.png']},features:[{key:'winter',title:'WINTER',subtitle:'TYRES',image:'/assets/tyre-ref/feature-winter.jpg',message:'Hello, I would like to enquire about winter tyres.'},{key:'summer',title:'SUMMER',subtitle:'TYRES',image:'/assets/tyre-ref/feature-summer.jpg',message:'Hello, I would like to enquire about summer tyres.'},{key:'custom',title:'CUSTOM',subtitle:'WHEELS',image:'/assets/tyre-ref/feature-custom.jpg',message:'Hello, I would like to enquire about custom wheels.'}],brands:[{name:'Bridgestone',image:'/assets/tyre-ref/mobile-brand-1.jpg'},{name:'Triangle',image:'/assets/tyre-ref/mobile-brand-2.jpg'},{name:'Apollo',image:'/assets/tyre-ref/mobile-brand-3.jpg'},{name:'Michelin',image:'/assets/tyre-ref/mobile-brand-4.jpg'},{name:'Aeolus',image:'/assets/tyre-ref/mobile-brand-5.jpg'}],featured:[{title:'Passenger',description:'Comfort · Performance · Everyday Use',image:'/assets/featured-tyre-1.png'},{title:'SUV / 4x4',description:'Durability · All Terrain · Adventure',image:'/assets/featured-tyre-2.png'},{title:'Pickup',description:'Strength · Load Capacity · Tough Roads',image:'/assets/featured-tyre-3.png'},{title:'Truck & Commercial',description:'Heavy Duty · Long Haul · Reliability',image:'/assets/featured-tyre-4.png'}],bottomImage:'/assets/tyre-ref/mobile-bottom.jpg',promoImages:[],promoTexts:[{title:'FIND YOUR',highlight:'PERFECT TYRES',desc:'Drive with confidence.\nFind tyres made for your journey.',button:'EXPLORE TYRES',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff',align:'left'},{title:'READY FOR',highlight:'THE ROAD?',desc:'Better grip. Better comfort.\nChoose tyres built for every journey.',button:'FIND YOUR TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'},{title:'UPGRADE YOUR',highlight:'DRIVE',desc:'Discover the right fit for your vehicle.\nQuality tyres for every road.',button:'SHOP TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'},{title:'GO FURTHER WITH',highlight:'THE RIGHT TYRES',desc:'Performance and confidence start here.\nFind your ideal tyres today.',button:'BROWSE TYRES →',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',buttonColor:'#ffffff'}],findByCar:{image:'',homeImage:'',bottomImage:''},findByNumber:{image:'',homeImage:'',bottomImage:''},sizes:[],tyreProducts:[]};
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
  hero:{...clone(defaultTyres.hero),...((db.tyres||{}).hero||{})},findByCar:{...clone(defaultTyres.findByCar),...((db.tyres||{}).findByCar||{})},findByNumber:{...clone(defaultTyres.findByNumber),...((db.tyres||{}).findByNumber||{})},promoImages:Array.isArray(db.tyres?.promoImages)?db.tyres.promoImages.filter(Boolean):[],promoTexts:Array.isArray(db.tyres?.promoTexts)?db.tyres.promoTexts:clone(defaultTyres.promoTexts),features:Array.isArray(db.tyres?.features)&&db.tyres.features.length===3?db.tyres.features:clone(defaultTyres.features),brands:Array.isArray(db.tyres?.brands)&&db.tyres.brands.length>0?db.tyres.brands:clone(defaultTyres.brands),featured:Array.isArray(db.tyres?.featured)&&db.tyres.featured.length>0?db.tyres.featured:clone(defaultTyres.featured),sizes:Array.isArray(db.tyres?.sizes)?db.tyres.sizes:[],tyreProducts:Array.isArray(db.tyres?.tyreProducts)?db.tyres.tyreProducts:[]};
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
  supabaseClient.from('brands').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('models').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('model_years').select('*').order('year',{ascending:false}),
  supabaseClient.from('categories').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('category_branches').select('*').eq('active',true).order('sort_order').order('name'),
  supabaseClient.from('products').select('*').eq('active',true).order('created_at',{ascending:false}),
  supabaseClient.from('product_years').select('*'),
  supabaseClient.from('product_branches').select('*'),
  supabaseClient.from('tyre_page').select('*').eq('id',true).maybeSingle()
 ]);
 for(const r of [settingsR,brandsR,modelsR,yearsR,catsR,branchesR,productsR,pyR,pbrR])if(r.error)throw r.error;
 const remoteTyres=(tyreR&&!tyreR.error&&tyreR.data&&tyreR.data.data)?tyreR.data.data:null;
 const settings=settingsR.data||clone(defaults.settings);
 const years=(yearsR.data||[]).map(y=>({id:y.id,modelId:y.model_id,year:String(y.year)}));
 const catMap=new Map((catsR.data||[]).map(c=>[c.id,c.name]));
 const yearById=new Map(years.map(y=>[y.id,String(y.year)]));const pyMap=new Map();for(const row of (pyR.data||[])){const yr=yearById.get(row.model_year_id);if(!yr)continue;if(!pyMap.has(row.product_id))pyMap.set(row.product_id,[]);pyMap.get(row.product_id).push(yr)}
 const pbMap=new Map();for(const row of (pbrR.data||[])){if(!pbMap.has(row.product_id))pbMap.set(row.product_id,[]);pbMap.get(row.product_id).push({branchId:row.branch_id,image:row.image_url||''})}
 const parts=(productsR.data||[]).map(p=>{const ys=pyMap.get(p.id)||[];const pbRows=pbMap.get(p.id)||[];const bids=[...pbRows.map(x=>x.branchId),...(p.branch_id?[p.branch_id]:[])];const branchImages=Object.fromEntries(pbRows.filter(x=>x.image).map(x=>[x.branchId,x.image]));return {id:p.id,modelId:p.model_id,years:[...new Set(ys)],year:ys[0]||'',category:catMap.get(p.category_id)||'',categoryId:p.category_id,branchId:p.branch_id||'',branchIds:[...new Set(bids.filter(Boolean))],branchImages,name:p.name,partNo:p.part_no||'',availability:p.availability||'Available on enquiry',description:p.description||'',image:p.image_url||'',price:p.price??null,active:p.active!==false,createdAt:p.created_at||''}});
 db={tyres:remoteTyres||localTyres,settings:{...clone(defaults.settings),businessName:settings.business_name||defaults.settings.businessName,tagline:settings.tagline||defaults.settings.tagline,logo:settings.logo_url||'',phone:settings.phone||'',phone2:settings.phone2||'',phone3:settings.phone3||'',instagram:settings.instagram_url||'',telegram:settings.telegram_url||'',facebook:settings.facebook_url||'',tiktok:settings.tiktok_url||'',youtube:settings.youtube_url||'',x:settings.x_url||'',aboutTitle:settings.about_title||defaults.settings.aboutTitle,aboutText:settings.about_content||defaults.settings.aboutText,whatsapp:settings.whatsapp||'',email:settings.email||'',address:settings.address||'',heroBlack:settings.hero_black||defaults.settings.heroBlack,heroRed:settings.hero_red||defaults.settings.heroRed,heroDescription:settings.hero_description||defaults.settings.heroDescription,heroImage:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);if(Array.isArray(a)&&a.length)return typeof a[0]==='string'?a[0]:(a[0]?.image||'');return v}catch{return v}})(),heroImages:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);return Array.isArray(a)?a.map(x=>typeof x==='string'?x:x?.image).filter(Boolean):(v?[v]:[])}catch{return v?[v]:[]}})(),heroSlides:(()=>{const v=settings.hero_image_url||'';try{const a=JSON.parse(v);if(Array.isArray(a)&&a.length)return a.map((x,i)=>typeof x==='string'?{image:x,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',button:'',buttonColor:'#ffffff'}:{...x,image:x.image||'',black:x.black??settings.hero_black??defaults.settings.heroBlack,red:x.red??settings.hero_red??defaults.settings.heroRed,description:x.description??settings.hero_description??defaults.settings.heroDescription,align:x.align||'left',titleColor:x.titleColor||'#ffffff',highlightColor:x.highlightColor||'#d71920',descColor:x.descColor||'#ffffff',button:x.button||'',buttonColor:x.buttonColor||'#ffffff'}).filter(x=>x.image);return v?[{image:v,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left'}]:[]}catch{return v?[{image:v,black:settings.hero_black||defaults.settings.heroBlack,red:settings.hero_red||defaults.settings.heroRed,description:settings.hero_description||defaults.settings.heroDescription,align:'left'}]:[]}})(),
    promoEyebrow:settings.promo_eyebrow||defaults.settings.promoEyebrow,
    promoTitle:settings.promo_title||defaults.settings.promoTitle,
    promoDescription:settings.promo_description||defaults.settings.promoDescription,
    promoButton:settings.promo_button||defaults.settings.promoButton,
    promoBackground:settings.promo_background_url||''},brands:(brandsR.data||[]).map(b=>({id:b.id,name:b.name,image:b.image_url||'',isEv:b.is_ev===true,isRegular:b.is_regular!==false,sortOrder:Number(b.sort_order??0),createdAt:b.created_at||''})).sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.createdAt||'').localeCompare(String(b.createdAt||''))),models:(modelsR.data||[]).map(m=>({id:m.id,brandId:m.brand_id,name:m.name,image:m.image_url||'',isEv:m.is_ev===true})),years,categories:(catsR.data||[]).map(c=>({id:c.id,name:c.name,image:c.image_url||''})),branches:(branchesR.data||[]).map(br=>({id:br.id,categoryId:br.category_id,name:br.name,image:br.image_url||''})),parts};
 normalizeDb();cacheDb();window.__apCatalogDb=db;onlineLoaded=true;return db;
}
function showBoot(message='Loading catalog…'){document.querySelector('#app').innerHTML=`<div class="login"><div class="loginBox"><h2>${esc(message)}</h2><p class="muted">Connecting to the online catalog.</p></div></div>`}
function routeTyresHash(){const parts=location.hash.replace('#','').split('/');if(parts[0]!=='tyres')return false;if(parts[1]==='brand'&&parts[2]!==undefined){tyreBrandPage(+parts[2]);return true}if(parts[1]==='type'&&parts[2]!==undefined){tyreTypePage(+parts[2]);return true}if(parts[1]==='contact'){tyreContactPage();return true}
if(parts[1]==='by-car'){if(typeof window.tyresByCar==='function'){window.tyresByCar()}else{setTimeout(routeTyresHash,50)}return true}
if(parts[1]==='by-size'){if(typeof window.tyresByNumber==='function'){window.tyresByNumber()}else{setTimeout(routeTyresHash,50)}return true}tyres();return true}
window.addEventListener('hashchange',()=>{const h=location.hash||'';if(/^#?tyres(?:\/|$)/.test(h))routeTyresHash()});
async function bootCustomer(){
  showBoot();
  const initialHash=location.hash||'';
  const isTyreFindRoute=/^#tyres\/by-(?:car|size)(?:\/|$)/.test(initialHash);
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
    if(isTyreFindRoute)restoreInitialTyreFindRoute();else landOnTyres?routeTyresHash():home();
    toast('Online connection library could not load. Showing local catalog.');
    return;
  }
  try{await loadRemoteDb();if(isTyreFindRoute)restoreInitialTyreFindRoute();else landOnTyres?routeTyresHash():home()}
  catch(e){
    console.error(e);onlineLoaded=false;
    try{const cached=localStorage.getItem(KEY);if(cached){db=JSON.parse(cached);normalizeDb();if(isTyreFindRoute)restoreInitialTyreFindRoute();else landOnTyres?routeTyresHash():home();toast('Online catalog unavailable — showing cached data')}else{if(isTyreFindRoute)restoreInitialTyreFindRoute();else landOnTyres?routeTyresHash():home();toast('Online catalog is empty or unavailable')}}
    catch{if(isTyreFindRoute)restoreInitialTyreFindRoute();else landOnTyres?routeTyresHash():home();toast('Could not load catalog')}
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
  admin=true;const tyreAdminRoute=isTyreAdminRoute();try{await loadRemoteDb();adminPanel(tyreAdminRoute?'tyres':'dashboard')}catch(e){console.error(e);toast('Connected to login, but catalog data could not be loaded');adminPanel(tyreAdminRoute?'tyres':'dashboard')}
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
  for(const y of oldYears){const mid=modelMap.get(y.modelId);if(!mid)continue;const yr=Number(y.year);if(!Number.isInteger(yr))continue;const id=crypto.randomUUID();const {error}=await supabaseClient.from('model_years').insert({id,model_id:mid,year:yr});if(error&&error.code!=='23505')throw error;const {data}=await supabaseClient.from('model_years').select('id').eq('model_id',mid).eq('year',yr).maybeSingle();if(data)yearMap.set(y.id,data.id)}
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
 const heroBg=db.settings.heroImage||""; return `<header class="siteHeader ${overHero?"heroHeaderOverlay ":""}${heroBg?"hasHeaderImage":""}" ${heroBg?`style="background-image:url('${esc(heroBg)}')"`:""}><div class="nav"><a class="logo" href="./" aria-label="Home" onclick="navigateFromHeader('home',this,event)">${logo()}</a><nav aria-label="Main navigation"><button class="${on('home')}" data-nav="home" onclick="navigateFromHeader('home',this,event)">HOME</button><button class="${on('brands')}" data-nav="brands" onclick="navigateFromHeader('brands',this,event)">BRANDS</button><button class="${on('ev')}" data-nav="ev" onclick="navigateFromHeader('ev',this,event)">EV</button><button class="${on('categories')}" data-nav="categories" onclick="navigateFromHeader('categories',this,event)">CATEGORIES</button><button class="${on('contact')}" data-nav="contact" onclick="navigateFromHeader('contact',this,event)">CONTACT</button><button class="searchBtn" data-nav="categories" onclick="navigateFromHeader('search',this,event)" aria-label="Search">⌕</button></nav></div></header>`
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
   app.innerHTML=`<main class="container site-main ${isTyrePage?'tyrePageNoHeader':''}">${content}</main><footer class="footer"><div class="featureStrip"><div><span class="featureIcon">✓</span><strong>100% Genuine Parts</strong><small>High quality parts</small></div><div><span class="featureIcon">▣</span><strong>Fast Delivery</strong><small>Across the city</small></div><div><span class="featureIcon">✓</span><strong>Secure Payment</strong><small>100% secure</small></div><div><span class="featureIcon">◯</span><strong>Support 24/7</strong><small>We are here to help</small></div></div><div class="footerMain"><div><h3>CONTACT & SUPPORT</h3><p>${esc(db.settings.address)}</p><p>${esc(db.settings.phone)}</p>${String(db.settings.phone2||'').trim()?`<p>${esc(String(db.settings.phone2).trim())}</p>`:''}${String(db.settings.phone3||'').trim()?`<p>${esc(String(db.settings.phone3).trim())}</p>`:''}${mediaLinksHtml()?`<div class="footerContactSocials" aria-label="Social media links">${mediaLinksHtml()}</div>`:''}<p>${esc(db.settings.email)}</p></div><div><h3>QUICK LINKS</h3><button onclick="home()">Home</button><button onclick="brands()">Brands</button><button onclick="parts()">Categories</button><button onclick="about()">About Us</button></div><div><h3>NEED A PART?</h3><p>Send us your vehicle and part details and we will help you find the right part.</p><button class="footerWa" onclick="smartEnquiry('Hello, I would like to enquire about your auto parts catalog.')">ENQUIRE ABOUT A PART</button></div></div><div class="footerBottom">© ${new Date().getFullYear()} ${esc(db.settings.businessName)}. All rights reserved.</div></footer>`;
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
 setNav('');location.hash='tyres';const t=db.tyres||defaultTyres;const hero=t.hero||defaultTyres.hero;const heroImages=(hero.images&&hero.images.length?hero.images:[hero.image||defaultTyres.hero.image]);const features=(t.features||defaultTyres.features).slice(0,3);const brands=(t.brands||defaultTyres.brands);const featured=(t.featured||defaultTyres.featured);const findByCar=t.findByCar||defaultTyres.findByCar;const findByNumber=t.findByNumber||defaultTyres.findByNumber;render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreDesktopHero"><div class="tyreHeroSlider" id="tyreHeroSlider">${heroImages.map((src,i)=>`<div class="tyreHeroSlide ${i===0?'active':''}" style="background-image:linear-gradient(180deg,rgba(0,0,0,.40),rgba(0,0,0,.68)),url('${esc(src)}')"></div>`).join('')}</div><div class="tyreDesktopHeroText"><h1>${esc(hero.title)}</h1><h2>${esc(hero.red)}</h2><p>${esc(hero.description||'').replace(/\n/g,'<br>')}</p><i></i></div><div class="tyreFeatureCardsHtml">${features.map(x=>`<button class="tyreFeatureCardHtml ${esc(x.key)}" onclick="smartEnquiry('${esc(x.message||'Hello, I would like to enquire about tyres.').replace(/'/g,"\\'")}')"><span class="featureTextHtml"><b>${esc(x.title)}</b><em>${esc(x.subtitle)}</em><i></i></span><img src="${esc(x.image)}" alt="${esc(x.title+' '+x.subtitle)}"></button>`).join('')}</div></div><div class="tyreHtmlBrands"><h2>Tyre Brands</h2><div class="tyreHtmlBrandGrid">${brands.map((x,i)=>`<button onclick="tyreBrandPage(${i})"><img src="${esc(x.image)}" alt="${esc(x.name)}"></button>`).join('')}</div></div><div class="tyreHtmlFeatured"><div class="tyreHtmlFeaturedHead"><h2>Featured Tyre Types</h2><button onclick="smartEnquiry('Hello, I would like to enquire about your available tyres.')">View All Tyres →</button></div><div class="tyreHtmlFeaturedGrid">${featured.map((x,i)=>`<button onclick="tyreTypePage(${i})"><img src="${esc(x.image)}" alt="${esc(x.title)}"><b>${esc(x.title)}</b><small>${esc(x.description)}</small><span>→</span></button>`).join('')}</div></div><section class="tyreFinderSection">
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

function tyresByCar(){
 setNav('');
 location.hash='tyres/by-car';
 const brands=[...db.brands].filter(b=>b.isRegular!==false);
 const finder=db.tyres?.findByCar||defaultTyres.findByCar||{};
 const heroImage=finder.image||db.tyres?.hero?.image||defaultTyres.hero.image;
 const bottomImage=finder.bottomImage||'';
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage">
 <div class="tyreByCarHero" style="background-image:url('${esc(heroImage)}')"><div class="tyreByCarHeroOverlay"></div><div class="tyreByCarHeroCopy"><span>TYRE FINDER</span><h1>FIND TYRE <b>BY CAR</b></h1><p>Select your vehicle to find the right tyre.</p></div><button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button></div>
 <div class="tyreFinderCarGrid">${brands.map(b=>`<button onclick="tyreFinderBrand('${b.id}')"><div><img src="${esc(b.image||placeholder(b.name))}" alt="${esc(b.name)}"></div><strong>${esc(b.name)}</strong></button>`).join('')||'<div class="empty">No car brands available.</div>'}</div>
 ${bottomImage?`<div class="tyreFinderBottomImage"><img src="${esc(bottomImage)}" alt="Find Tyre By Car bottom image"></div>`:''}
 </div></div></section>`)
}
function tyreFinderBrand(brandId){
 const b=db.brands.find(x=>x.id===brandId);
 if(!b)return tyresByCar();
 const models=db.models.filter(m=>m.brandId===brandId&&m.isEv!==true);
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage">
 <button class="tyrePlaceholderBack" onclick="tyresByCar()">← Back to Car Brands</button>
 <div class="tyreFinderPageHead"><span>${esc(b.name)}</span><h1>SELECT YOUR <b>MODEL</b></h1><p>Choose your vehicle model.</p></div>
 <div class="tyreFinderModelGrid">${models.map(m=>`<button onclick="tyreFinderModel('${m.id}')"><div><img src="${esc(m.image||placeholder(m.name))}" alt="${esc(m.name)}"></div><strong>${esc(m.name)}</strong></button>`).join('')||'<div class="empty">No models available for this brand.</div>'}</div>
 </div></div></section>`)
}
function tyreFinderModel(modelId){
 const m=db.models.find(x=>x.id===modelId);
 const b=db.brands.find(x=>x.id===m?.brandId);
 if(!m||!b)return tyresByCar();
 const ys=modelYears(modelId);
 render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreFinderPage">
 <button class="tyrePlaceholderBack" onclick="tyreFinderBrand('${b.id}')">← Back to Models</button>
 <div class="tyreFinderPageHead"><span>${esc(b.name)} · ${esc(m.name)}</span><h1>SELECT VEHICLE <b>YEAR</b></h1><p>Choose the year to continue.</p></div>
 <div class="tyreFinderYearGrid">${ys.map(y=>`<button onclick="tyreFinderResult('${m.id}','${encodeURIComponent(y)}')"><strong>${esc(y)}</strong><span>→</span></button>`).join('')||'<div class="empty">No years available for this model.</div>'}</div>
 </div></div></section>`)
}
function tyreFinderResult(modelId,yearValue){
 const m=db.models.find(x=>x.id===modelId);
 const b=db.brands.find(x=>x.id===m?.brandId);
 if(!m||!b)return tyresByCar();
 const y=decodeURIComponent(yearValue);
 smartEnquiry(`Hello, I would like to find tyres for my ${b.name} ${m.name}, year ${y}.`);
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
 document.querySelector('#tyreNumberResults').innerHTML=`<div class="tyreNumberResult"><strong>${esc(value)}</strong><p>We will check availability for this tyre size.</p><button class="primary" onclick='smartEnquiry(${JSON.stringify('Hello, I would like to enquire about tyres with size/number: '+value+'.')})'>ENQUIRE ABOUT THIS TYRE →</button></div>`;
}
function tyreBrandPage(idx){const t=db.tyres||defaultTyres,b=(t.brands||[])[idx];if(!b)return tyres();location.hash=`tyres/brand/${idx}`;showTyreProductResults(`${b.name} Tyres`,p=>String(p.brandId)===String(b.id)||String(p.brand||'').toLowerCase()===String(b.name).toLowerCase())}

function tyreContactPage(){
  setNav('');
  location.hash='tyres/contact';
  const c=(db.tyres||defaultTyres).contact||defaultTyres.contact;
  const phones=[c.phone,c.phone2,c.phone3].filter(Boolean).map(p=>`<div class="tyreOwnContactPhone">${esc(p)}</div>`).join('');
  const socials=tyreMediaLinksHtml();
  render(`<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreOwnContactPage"><button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button><div class="tyreOwnContactCard"><span class="tyreAboutEyebrow">CONTACT US &amp; SUPPORT</span><h1>GET IN <span>TOUCH</span></h1><p>We are here to help you find the right tyres.</p>${phones?`<div class="tyreOwnContactPhones">${phones}</div>`:''}${socials?`<div class="tyreAboutSocials">${socials}</div>`:''}<button class="primary" onclick="smartEnquiry('Hello, I would like to enquire about your tyres.')">SEND ENQUIRY</button></div></div></div></section>`);
}

function tyreTypePage(idx){const t=db.tyres||defaultTyres,x=(t.featured||defaultTyres.featured)[idx];if(!x)return tyres();location.hash=`tyres/type/${idx}`;showTyreProductResults(`${x.title} Tyres`,p=>String(p.typeId)===String(x.id)||String(p.type||'').toLowerCase()===String(x.title).toLowerCase())}

function scrollBrands(dir){scrollBrandsById('brandRail',dir)}
function scrollBrandsById(id,dir){document.querySelector('#'+id)?.scrollBy({left:dir*300,behavior:'smooth'})}
function brandCard(b,ev=false){return `<article class="card catalog-card brand" onclick="brand('${b.id}',${ev})"><div class="media-frame brandFrame"><img src="${b.image||placeholder(b.name)}" alt="${esc(b.name)}"></div><h3>${esc(b.name)}</h3></article>`}
function brands(ev=false){setNav('brands');location.hash='brands';const list=ev?db.brands.filter(b=>b.isEv===true):db.brands.filter(b=>b.isRegular!==false);render(`<div class="breadcrumb">Home <span>›</span> ${ev?'EV Brands':'Brands'}</div><div class="sectionHead ${ev?'evPageHeading':''}"><div>${ev?'<span class="evEyebrow"><span class="evBolt">⚡</span> EV BRANDS</span>':'<span class="eyebrow">STEP 1</span>'}<h2>SHOP BY <span class="${ev?'evPageAccent':'accent'}">${ev?'EV BRAND':'CAR BRAND'}</span></h2>${ev?'<p>Electric today. A cleaner tomorrow.</p>':''}</div></div><div class="grid brandGrid">${list.map(b=>brandCard(b,ev)).join('')||'<div class="empty">No brands added yet.</div>'}</div>`)}
function brand(id,ev=false){setNav('brands');location.hash='brands';const b=db.brands.find(x=>x.id===id);if(!b)return brands(ev);const ms=db.models.filter(x=>x.brandId===id&&(!ev||x.isEv===true));render(`<div class="breadcrumb">Home <span>›</span> ${esc(b.name)} <span>›</span> Select Model</div>${contextBanner('SELECTED BRAND',b.image||placeholder(b.name),b.name,'Choose a model for this brand')}<div class="sectionHead"><div><span class="eyebrow">STEP 2</span><h2>SELECT <span class="accent">MODEL</span></h2></div></div><div class="grid modelGrid">${ms.map(m=>`<article class="card catalog-card" onclick="model('${m.id}')"><div class="media-frame modelFrame"><img src="${m.image||placeholder(m.name)}" alt="${esc(m.name)}"></div><h3>${esc(m.name)}</h3></article>`).join('')||'<div class="empty">No models added yet.</div>'}</div><button class="backBtn" onclick="brands(ev)">← BACK TO BRANDS</button>`)}
function model(id){setNav('brands');location.hash='brands';const m=db.models.find(x=>x.id===id);if(!m)return brands();const b=db.brands.find(x=>x.id===m.brandId);const ys=modelYears(id);render(`<div class="breadcrumb">Home <span>›</span> ${esc(b?.name)} <span>›</span> ${esc(m.name)} <span>›</span> Select Year</div>${contextBanner('SELECTED MODEL',m.image||placeholder(m.name),m.name,`${b?.name||''} · Choose a year`)}<div class="sectionHead"><div><span class="eyebrow">STEP 3</span><h2>SELECT <span class="accent">YEAR</span></h2></div></div><div class="yearGrid">${ys.map(y=>`<button class="yearCard" onclick="year('${id}','${encodeURIComponent(y)}')"><strong>${esc(y)}</strong><span>→</span></button>`).join('')||'<div class="empty">No years added for this model yet.</div>'}</div><button class="backBtn" onclick="brand('${b.id}',${m.isEv===true})">← BACK TO MODELS</button>`)}
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
 const brands=[...db.brands].sort((a,b)=>String(a.name).localeCompare(String(b.name)));
 const cats=[...db.categories].sort((a,b)=>String(a.name).localeCompare(String(b.name)));
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
 <div id="products" class="grid productGrid"></div>`);
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
function about(){setNav('about');location.hash='about';const title=String(db.settings.aboutTitle||'About Our Business').trim();const text=String(db.settings.aboutText||'').trim();const image=String(db.settings.aboutImage||'').trim();render(`<section class="infoPage aboutPage"><span class="eyebrow">ABOUT US</span><div class="aboutLayout">${image?`<div class="aboutImage"><img src="${esc(image)}" alt="About us"></div>`:''}<div class="aboutCopy"><h1>${esc(title)}</h1><p>${esc(text).replace(/\n/g,'<br>')}</p></div></div></section>`)}
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
function contact(){setNav('contact');location.hash='contact';const phones=`Phone: ${esc(db.settings.phone)}${String(db.settings.phone2||'').trim()?`<br>Phone: ${esc(String(db.settings.phone2).trim())}`:''}${String(db.settings.phone3||'').trim()?`<br>Phone: ${esc(String(db.settings.phone3).trim())}`:''}`;render(`<section class="infoPage"><span class="eyebrow">CONTACT</span><h1>GET IN <span class="accent">TOUCH</span></h1><p>Address: ${esc(db.settings.address)}<br>${phones}</p><div class="contactMedia">${mediaLinksHtml()}</div><p>Email: ${esc(db.settings.email)}</p><button class="primary" onclick="smartEnquiry('Hello, I would like to enquire about your auto parts.')">SEND ENQUIRY</button></section>`)}
function login(message=''){
 document.querySelector('#app').innerHTML=`<div class="login"><div class="loginBox"><a class="logo adminLogo" href="./">${logo()}</a><h2>Admin Sign in</h2><p class="muted">Sign in with the email and password created in Supabase Authentication.</p>${message?`<div class="adminTip"><strong>${esc(message)}</strong></div>`:''}<input id="adminEmail" type="email" class="input" placeholder="Email address" autocomplete="username"><br><input id="adminPassword" type="password" class="input" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"><br><br><button class="primary" onclick="doLogin()">SIGN IN</button><button class="ghost" onclick="location.href='./'">CANCEL</button></div></div>`
}
async function doLogin(){const email=document.querySelector('#adminEmail')?.value.trim(),password=document.querySelector('#adminPassword')?.value;if(!email||!password)return toast('Enter your email and password');const btn=document.querySelector('.loginBox .primary');if(btn)btn.disabled=true;const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});if(error){if(btn)btn.disabled=false;return toast(error.message||'Sign in failed')}currentSession=data.session;const {data:row,error:ae}=await supabaseClient.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle();if(ae||!row){await supabaseClient.auth.signOut();if(btn)btn.disabled=false;return toast('This account is not authorized as an admin')}admin=true;try{await loadRemoteDb();adminPanel(isTyreAdminRoute()?'tyres':'dashboard')}catch(e){console.error(e);toast('Signed in, but online catalog could not be loaded')}}
let adminCatalogOpen=true;
function toggleAdminCatalog(){adminCatalogOpen=!adminCatalogOpen;adminPanel(location.hash.replace('#','')||'dashboard')}
let adminSidebarOpen=false;
let tyreAdminSubTab='settings';
function tyreAdminGo(sub){tyreAdminSubTab=sub;adminPanel('tyres')}
function toggleAdminSidebar(){adminSidebarOpen=!adminSidebarOpen;const shell=document.querySelector('.adminShell')||document.querySelector('.tyreAdminShell');if(!shell)return;shell.classList.toggle('sidebarHidden',!adminSidebarOpen);const btn=document.querySelector('#adminHeaderToggle');if(btn){btn.setAttribute('aria-expanded',String(adminSidebarOpen));btn.setAttribute('title',adminSidebarOpen?'Hide admin control panel':'Show admin control panel');btn.setAttribute('aria-label',adminSidebarOpen?'Hide admin control panel':'Show admin control panel');btn.classList.toggle('isClosed',!adminSidebarOpen);}}
function adminPanel(tab='dashboard',fromHistory=false){
 if(!admin)return login();
 if(!fromHistory){const target=tab==='dashboard'?'#dashboard':`#${tab}`;if(location.hash!==target){history.pushState({adminTab:tab},'',target)}}else if(!location.hash){history.replaceState({adminTab:tab},'',`#${tab}`)}
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
     <button class="tyreSideBtn" onclick="location.href='/admin'"><span>←</span> Auto Parts Admin</button>
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
 const adminHeader=`<header class="adminGlobalHeader"><a class="adminGlobalLogo" href="/admin">${logo()}</a><a class="adminHeaderSwitch" href="/admin/tyres.html" data-admin-tyres-link="true">TYRES</a><button id="adminHeaderToggle" class="adminHeaderToggle" type="button" onclick="toggleAdminSidebar()" aria-label="Toggle admin control panel" aria-expanded="${adminSidebarOpen}" title="${adminSidebarOpen?'Hide admin control panel':'Show admin control panel'}"><span></span><span></span><span></span></button></header>`;
 document.querySelector('#app').innerHTML=`${adminHeader}<div class="adminShell ${adminSidebarOpen?'':'sidebarHidden'}"><aside class="adminSide"><div class="adminTitle">ADMIN CONTROL PANEL</div><button class="sideBtn ${tab==='dashboard'?'active':''}" onclick="adminPanel('dashboard')">⌂ &nbsp; Dashboard</button><button class="sideBtn ${tab==='enquiries'?'active':''}" onclick="adminPanel('enquiries')">▤ &nbsp; Enquiries</button><button class="sideBtn catalogToggle ${catalogTabs.includes(tab)?'activeGroup':''}" onclick="toggleAdminCatalog()">▣ &nbsp; Catalog <span class="sideChevron">${adminCatalogOpen?'▾':'▸'}</span></button>${adminCatalogOpen?`<div class="catalogSubmenu">${catalogTabs.map(t=>`<button class="sideBtn subSideBtn ${tab===t?'active':''}" onclick="adminPanel('${t}')">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div>`:''}<button class="sideBtn ${tab==='settings'?'active':''}" onclick="adminPanel('settings')">⚙ &nbsp; Settings</button><button class="sideBtn ${tab==='backup'?'active':''}" onclick="adminPanel('backup')">↕ &nbsp; Backup</button><div class="sideSpacer"></div><button class="sideBtn" onclick="logout()">⇥ &nbsp; Sign out</button></aside><section class="adminMain"><div class="adminTop"><div class="adminHeading"><div><div class="adminEyebrow">ADMIN</div><h1>${label}</h1></div></div><a class="viewSite" href="/">VIEW WEBSITE</a></div><section class="adminPanel" id="adminContent"></section></section></div>`;
 adminContent(tab);
}
window.addEventListener('popstate',()=>{if(!admin)return;const tab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel(tab,true)});
window.addEventListener('hashchange',()=>{if(!admin)return;const tab=(location.hash||'#dashboard').slice(1)||'dashboard';adminPanel(tab,true)});
function adminContent(t){const c=document.querySelector('#adminContent');if(t==='dashboard')dashboardAdmin(c);else if(t==='enquiries')enquiriesAdmin(c);else if(t==='brands')brandAdmin(c);else if(t==='models')modelAdmin(c);else if(t==='years')yearAdmin(c);else if(t==='categories')categoryAdmin(c);else if(t==='products')productAdmin(c);else if(t==='settings')settingsAdmin(c);else if(t==='tyres')tyresAdmin(c);else backupAdmin(c)}
function tyreInputRow(label,id,value,placeholder=''){return `<div class="formGroup"><label>${label}</label><input id="${id}" class="input" value="${esc(value||'')}" placeholder="${esc(placeholder)}"></div>`}
function tyreMediaIcon(type){
  if(type==='whatsapp')return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.66 15l-1.1 4.02 4.12-1.08A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.45.64.65-2.37-.19-.3A8 8 0 1 1 12 20Zm4.38-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>`;
  return mediaIcon(type);
}

function tyreMediaLinksHtml(){
  const t=db.tyres||defaultTyres;
  const c=t.contact||defaultTyres.contact;
  const items=[
    ['instagram','Instagram',c.instagram],
    ['facebook','Facebook',c.facebook],
    ['telegram','Telegram',c.telegram],
    ['x','X',c.x],
    ['whatsapp','WhatsApp',c.whatsapp]
  ];
  return items.map(([key,label,value])=>{
    const href=key==='whatsapp'
      ? (String(value||'').trim()?`https://wa.me/${String(value).replace(/[^\d]/g,'')}`:'')
      : mediaUrl(value);
    return href?`<a class="mediaLink media-${key}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}"><span class="mediaLogo">${tyreMediaIcon(key)}</span></a>`:'';
  }).join('');
}

function tyresAdmin(c){
 const t=db.tyres||clone(defaultTyres),contact=t.contact||defaultTyres.contact,hero=t.hero||defaultTyres.hero,features=t.features||defaultTyres.features,brands=t.brands||defaultTyres.brands,featured=t.featured||defaultTyres.featured,sizes=Array.isArray(t.sizes)?t.sizes:[],findByCar=t.findByCar||defaultTyres.findByCar,findByNumber=t.findByNumber||defaultTyres.findByNumber,heroImages=(hero.images&&hero.images.length?hero.images:[hero.image||defaultTyres.hero.image]);
 const preview=(src,alt)=>src?`<div class="tyreAdminPreview"><img src="${esc(src)}" alt="${esc(alt)}"></div>`:`<div class="tyreAdminPreview emptyPreview">No image selected</div>`;
 const imageGallery=(images,altPrefix)=>{const list=(Array.isArray(images)?images:[]).filter(Boolean);return list.length?'<div class="tyreAdminImageGallery">'+list.map((src,i)=>'<div class="tyreAdminGalleryItem"><img src="'+esc(src)+'" alt="'+esc(altPrefix)+' '+(i+1)+'"><span>IMAGE '+(i+1)+'</span></div>').join('')+'</div>':'<div class="tyreAdminPreview emptyPreview">No images uploaded</div>';};
 const promoGallery=(images)=>{const list=(Array.isArray(images)?images:[]).filter(Boolean);return list.length?'<div class="tyreAdminImageGallery">'+list.map((src,i)=>'<button type="button" class="tyrePromoImageButton" onclick="toggleTyrePromoText('+i+')"><img src="'+esc(src)+'" alt="Shop Tyres promo image '+(i+1)+'"><span>IMAGE '+(i+1)+'</span><b>EDIT TEXT</b></button>').join('')+'</div>':'<div class="tyreAdminPreview emptyPreview">No images uploaded</div>';};
 const heroSection=`
<section class="tyreAdminCard tyreAdminHeroCard" id="tyreHeroSection">
 <div class="tyreCardHead"><div><span class="eyebrow">01 · HERO SECTION</span><h3>Hero section</h3><p>Control the main heading, description and sliding background images.</p></div></div>
 <div class="tyreAdminSubSection">
  <div class="tyreAdminSubHead"><span>Hero content & images</span><small>Main hero heading, description and rotating images.</small></div>
  <div class="tyreAdminHeroLayout"><div>${tyreInputRow('White heading','thTitle',hero.title)}${tyreInputRow('Red heading','thRed',hero.red)}<div class="formGroup"><label>Description</label><textarea id="thDesc" class="textarea" rows="4">${esc(hero.description||'')}</textarea></div></div><div class="formGroup"><label>Hero images</label><input id="thAddImage" type="file" accept="image/*" multiple class="input" onchange="addTyreHeroImage(this)"><small class="helpText">Select one or multiple images. They rotate automatically on the Tyre homepage.</small>${imageGallery(heroImages,'Tyre hero image')}</div></div>
 </div>
 <div class="tyreAdminSubSection">
  <div class="tyreAdminSubHead"><span>Bottom image</span><small>Image displayed at the bottom of the Tyre homepage.</small></div>
  <div class="tyreAdminHeroLayout"><div class="formGroup"><label>Bottom image</label><input id="thBottomImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'thBottomImg')"><small class="helpText">This image appears at the bottom of the Tyre homepage.</small></div><div>${preview(t.bottomImage,'Tyre homepage bottom image')}</div></div>
 </div></section>
<section class="tyreAdminCard tyreAdminHeroCard" id="tyreFindSection">
 <div class="tyreCardHead"><div><span class="eyebrow">03 · FIND TYRE SECTION</span><h3>Find Tyre section images</h3><p>Manage the two images shown beside the tyre-finder options on the Tyre homepage.</p></div></div>
 <div class="tyreAdminHeroLayout"><div class="formGroup"><label>Find Tyre by Car image</label><input id="tbHomeCarImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbHomeCarImg')"><small class="helpText">Image shown beside “Find Tyre by Car”.</small></div><div>${preview(findByCar.homeImage||findByCar.image,'Find Tyre by Car image')}</div></div>
 <div class="tyreAdminHeroLayout"><div class="formGroup"><label>Find Tyre by Size image</label><input id="tbHomeNumberImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbHomeNumberImg')"><small class="helpText">Image shown beside “Find Tyre by Size”.</small></div><div>${preview(findByNumber.homeImage||findByNumber.image,'Find Tyre by Size image')}</div></div>
</section>`;
 const contactSettingsSection=`<section class="tyreAdminCard">
<div class="tyreCardHead"><div>
<span class="eyebrow">02 · ABOUT & CONTACT</span>
<h3>About Us & Contact</h3>
<p>These contact details are independent from the main Auto Parts settings.</p>
</div></div>
<div class="tyreAdminSubSection"><div class="tyreAdminSubHead"><span>About Us & Contact details</span><small>Text, phone numbers and social contact information.</small></div><div class="tyreAdminFeatureGrid">
<article class="tyreAdminEditorItem">
${tyreInputRow('About Us title','tcAboutTitle',contact.aboutTitle)}
<div class="formGroup"><label>About Us content</label><textarea id="tcAboutText" class="textarea" rows="5">${esc(contact.aboutText||'')}</textarea></div>
${tyreInputRow('Phone 1','tcPhone',contact.phone)}
${tyreInputRow('Phone 2 (optional)','tcPhone2',contact.phone2)}
${tyreInputRow('Phone 3 (optional)','tcPhone3',contact.phone3)}
${tyreInputRow('WhatsApp number (optional)','tcWhatsapp',contact.whatsapp,'Example: +251 9XX XXX XXX')}
${tyreInputRow('Instagram','tcInstagram',contact.instagram)}
${tyreInputRow('Facebook','tcFacebook',contact.facebook)}
${tyreInputRow('Telegram','tcTelegram',contact.telegram)}
${tyreInputRow('X','tcX',contact.x)}
<div class="formGroup">
<label>Contact box PNG image</label>
<input id="tcContactImage" type="file" accept="image/png,image/*" class="input" onchange="prepareImageSelection(event,'tcContactImage')">
<small class="helpText">This image fills the right-side frame of the red contact box.</small>
</div>
${contact.contactImage?`<div class="tyreAdminPreview"><img src="${esc(contact.contactImage)}" alt="Contact box image"></div>`:`<div class="tyreAdminPreview emptyPreview">No contact image selected</div>`}
</article>
</div></div>
</section>`;

const promoSection=`<section class="tyreAdminCard tyreAdminPromoSection" id="tyrePromoSection"><div class="tyreCardHead"><div><span class="eyebrow">03 · PROMOTIONAL PANELS</span><h3>Winter, Summer & Custom Wheels</h3><p>Each panel has its own text, image and enquiry message.</p></div></div>
    <div class="tyreAdminFeatureGrid">${features.map((x,i)=>`<article class="tyreAdminEditorItem"><div class="tyreAdminItemTop"><strong>${i+1}. ${esc(x.title)} ${esc(x.subtitle)}</strong>${preview(x.image,x.title+' '+x.subtitle)}</div>${tyreInputRow('Title',`tf${i}t`,x.title)}${tyreInputRow('Subtitle',`tf${i}s`,x.subtitle)}${tyreInputRow('Enquiry message',`tf${i}m`,x.message)}<div class="formGroup"><label>Panel image</label><input id="tf${i}i" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tf${i}i')"></div></article>`).join('')}</div></div>
   </section>`;
 const finderCarSection=`<section class="tyreAdminCard tyreAdminHeroCard"><div class="tyreCardHead"><div><span class="eyebrow">FIND TYRE BY CAR</span><h3>Find Tyre By Car</h3><p>Manage the hero image and the image displayed at the bottom of this finder page.</p></div></div><div class="tyreAdminSubSection"><div class="tyreAdminSubHead"><span>Find Tyre by Car</span><small>Hero image and bottom image for this finder page.</small></div><div class="tyreAdminHeroLayout"><div class="formGroup"><label>Hero image</label><input id="tbCarHeroImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbCarHeroImg')"><small class="helpText">This is the large hero image at the top of Find Tyre By Car.</small></div><div>${preview(findByCar.image||'/assets/tyre-ref/hero.png','Find Tyre By Car hero image')}</div></div><div class="tyreAdminHeroLayout"><div class="formGroup"><label>Bottom image</label><input id="tbCarImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbCarImg')"><small class="helpText">This image appears at the bottom of Find Tyre By Car.</small></div><div>${preview(findByCar.bottomImage,'Find Tyre By Car bottom image')}</div></div></div></section>`;
 const finderNumberSection=`<section class="tyreAdminCard tyreAdminHeroCard"><div class="tyreCardHead"><div><span class="eyebrow">FIND TYRE BY SIZE</span><h3>Find Tyre By Size</h3><p>Manage the hero image and the image displayed at the bottom of this finder page.</p></div></div><div class="tyreAdminSubSection"><div class="tyreAdminSubHead"><span>Find Tyre by Size</span><small>Hero image and bottom image for this finder page.</small></div><div class="tyreAdminHeroLayout"><div class="formGroup"><label>Hero image</label><input id="tbNumberHeroImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbNumberHeroImg')"><small class="helpText">This is the large hero image at the top of Find Tyre By Size.</small></div><div>${preview(findByNumber.image||'/assets/tyre-ref/hero.png','Find Tyre By Size hero image')}</div></div><div class="tyreAdminHeroLayout"><div class="formGroup"><label>Bottom image</label><input id="tbNumberImg" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tbNumberImg')"><small class="helpText">This image appears at the bottom of Find Tyre By Size.</small></div><div>${preview(findByNumber.bottomImage,'Find Tyre By Size bottom image')}</div></div></div></section>`;
 const brandsSection=`<section class="tyreAdminCard" id="tyreBrandsSection"><div class="tyreCardHead"><div><span class="eyebrow">04 · BRANDS</span><h3>Tyre Brands</h3><p>Add, edit or remove the brand logos shown on the public tyre page.</p></div><button type="button" class="ghost" onclick="addTyreBrand()">+ ADD BRAND</button></div>
    <div class="tyreAdminBrandGrid">${brands.map((x,i)=>`<article class="tyreAdminBrandItem"><div class="tyreBrandNumber">BRAND ${i+1}<button type="button" class="tyreRemoveItemBtn" onclick="removeTyreBrand(${i})">Remove</button></div>${preview(x.image,(x.name||'Brand')+' logo')}${tyreInputRow('Brand name',`tb${i}n`,x.name)}<div class="formGroup"><label>Logo</label><input id="tb${i}i" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tb${i}i')"></div></article>`).join('')}</div>
   </section>`;
 const sizesSection=`<section class="tyreAdminCard tyreAdminSizesSection" id="tyreSizesSection"><div class="tyreCardHead"><div><span class="eyebrow">06 · TYRE SIZES</span><h3>Tyre Sizes</h3><p>Create a reusable size list using width, aspect ratio and rim diameter.</p></div><button type="button" class="primary" onclick="openTyreSizeModal()">+ ADD TYRE SIZE</button></div><div class="tyreSizeAddHint"><span class="tyreSizeAddIcon">＋</span><div><strong>Build a standard tyre size</strong><small>Enter the three measurements and the system will create the standard format automatically, for example <b>205/55 R16</b>.</small></div></div><div class="tyreSizeGrid">${sizes.length?sizes.map((x,i)=>`<article class="tyreSizeCard"><div class="tyreSizeCardTop"><span>SIZE ${i+1}</span><button type="button" class="tyreRemoveItemBtn" onclick="removeTyreSize(${i})">Remove</button></div><strong class="tyreSizeValue">${esc(x.label||'')}</strong><div class="tyreSizeMeta"><span>Width <b>${esc(String(x.width||''))} mm</b></span><span>Aspect <b>${esc(String(x.aspect||''))}%</b></span><span>Rim <b>${esc(String(x.rim||''))}"</b></span></div></article>`).join(''):`<div class="empty tyreSizesEmpty"><strong>No tyre sizes yet</strong><span>Add your first size using the professional size form above.</span></div>`}</div></section>`;
 const featuredSection=`<section class="tyreAdminCard" id="tyreFeaturedSection"><div class="tyreCardHead"><div><span class="eyebrow">05 · TYRE TYPES</span><h3>Featured Tyre Types</h3><p>Add, edit or remove the tyre-type cards displayed below the brands.</p></div><button type="button" class="ghost" onclick="addTyreFeaturedType()">+ ADD TYPE</button></div>
    <div class="tyreAdminFeatureGrid">${featured.map((x,i)=>`<article class="tyreAdminEditorItem"><div class="tyreAdminItemTop"><strong>${i+1}. ${esc(x.title)}</strong>${preview(x.image,x.title)}</div>${tyreInputRow('Title',`tt${i}t`,x.title)}<div class="formGroup"><label>Description</label><input id="tt${i}d" class="input" value="${esc(x.description||'')}"></div><div class="formGroup"><label>Image</label><input id="tt${i}i" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'tt${i}i')"></div><button type="button" class="tyreRemoveItemBtn tyreRemoveTypeBtn" onclick="removeTyreFeaturedType(${i})">Remove</button></article>`).join('')}</div>
   </section>`;

 const promoDefaults=clone(defaultTyres.promoTexts||[]);
 const promoTextItems=(t.promoImages||[]).map((src,i)=>({...promoDefaults[i%promoDefaults.length],...((t.promoTexts||[])[i]||{})}));
 const promoTextEditor='<div id="tyrePromoTextEditors" class="tyrePromoTextEditors">'+promoTextItems.map((x,i)=>'<div class="tyrePromoTextCard" data-promo-index="'+i+'"><div id="tyrePromoTextForm'+i+'" class="tyrePromoTextForm" hidden><div class="tyreAdminSubHead"><span>Image '+(i+1)+' text</span><small>Edit the text shown while this image is displayed.</small></div><div class="tyrePromoTextFields"><div class="formGroup"><label>Heading</label><div class="tyrePromoTextControl"><input id="tPromoTitle'+i+'" class="input" value="'+esc(x.title||'')+'"><input id="tPromoTitleColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.titleColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Highlight</label><div class="tyrePromoTextControl"><input id="tPromoHighlight'+i+'" class="input" value="'+esc(x.highlight||'')+'"><input id="tPromoHighlightColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.highlightColor||'#d71920')+'"></div></div><div class="formGroup"><label>Description</label><div class="tyrePromoTextControl"><textarea id="tPromoDesc'+i+'" class="input" rows="2">'+esc(x.desc||'')+'</textarea><input id="tPromoDescColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.descColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Button text</label><div class="tyrePromoTextControl"><input id="tPromoButton'+i+'" class="input" value="'+esc(x.button||'')+'"><input id="tPromoButtonColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.buttonColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Text alignment</label><select id="tPromoAlign'+i+'" class="select"><option value="left" '+(x.align==='left'?'selected':'')+'>Left</option><option value="center" '+(x.align==='center'?'selected':'')+'>Center</option><option value="right" '+(x.align==='right'?'selected':'')+'>Right</option></select><small class="helpText">Aligns all text in this section together.</small></div></div></div></div></div>').join('')+'</div>';
 const shopTyresPromoSection='<section class="tyreAdminCard tyreAdminPromoSection" id="tyreShopTyresPromoSection"><div class="tyreCardHead"><div><span class="eyebrow">SHOP TYRES PROMO</span><h3>Shop Tyres Promo Box</h3><p>Upload multiple background images for the Shop Tyres box on the Auto Parts homepage.</p></div></div><div class="tyreAdminSubSection"><div class="tyreAdminSubHead"><span>Promo slideshow images</span><small>Multiple images rotate automatically inside the full promo box.</small></div><div class="tyreAdminHeroLayout"><div class="formGroup"><label>Promo images</label><input id="tPromoImages" type="file" accept="image/*" multiple class="input" onchange="previewTyrePromoUploads(this)"><small class="helpText">Select multiple images at once. New uploads stay listed with the existing images until you save.</small><div id="tyrePromoImageGallery">'+promoGallery(t.promoImages)+'</div></div><div></div></div></div>'+promoTextEditor+'</section>';
 const dashboardBody=`<div class="tyreAdminDashGrid">
   <button class="tyreDashCard" onclick="tyreAdminGo('settings')"><span class="tyreDashIcon">◆</span><div><strong>Settings</strong><span>Hero, promotional panels &amp; bottom banner image</span></div><span class="tyreDashArrow">→</span></button>
   <button class="tyreDashCard" onclick="tyreAdminGo('brands')"><span class="tyreDashIcon">◉</span><div><strong>Tyre Brands</strong><span>${brands.length} brand logos shown on the public page</span></div><span class="tyreDashArrow">→</span></button>
   <button class="tyreDashCard" onclick="tyreAdminGo('featured')"><span class="tyreDashIcon">◇</span><div><strong>Tyre Types</strong><span>${featured.length} tyre-type cards shown on the public page</span></div><span class="tyreDashArrow">→</span></button>\n   <button class="tyreDashCard" onclick="tyreAdminGo('sizes')"><span class="tyreDashIcon">▣</span><div><strong>Tyre Sizes</strong><span>${sizes.length} reusable tyre sizes available</span></div><span class="tyreDashArrow">→</span></button>
   <button class="tyreDashCard" onclick="tyreAdminGo('products')"><span class="tyreDashIcon">◈</span><div><strong>Tyre Products</strong><span>${(t.tyreProducts||[]).length} tyre products in the catalogue</span></div><span class="tyreDashArrow">→</span></button>
  </div>`;
 let sectionsHtml,showSaveBar;
 if(tyreAdminSubTab==='settings'){sectionsHtml=heroSection+contactSettingsSection+promoSection+shopTyresPromoSection;showSaveBar=true}
 else if(tyreAdminSubTab==='by-car'){sectionsHtml=finderCarSection;showSaveBar=true}
 else if(tyreAdminSubTab==='by-number'){sectionsHtml=finderNumberSection;showSaveBar=true}
 else if(tyreAdminSubTab==='brands'){sectionsHtml=brandsSection;showSaveBar=true}
 else if(tyreAdminSubTab==='featured'){sectionsHtml=featuredSection;showSaveBar=true}
 else if(tyreAdminSubTab==='sizes'){sectionsHtml=sizesSection;showSaveBar=false}
 else if(tyreAdminSubTab==='products'){sectionsHtml=tyreProductsSection();showSaveBar=false}
 else {sectionsHtml=dashboardBody;showSaveBar=false}
 const saveBar=`<div class="tyreAdminSaveBar"><div><strong>Ready to publish?</strong><span>Save your tyre-page changes when finished.</span></div><div><button class="ghost" onclick="location.href='/#tyres'">PREVIEW</button><button class="primary" onclick="saveTyrePage()">SAVE TYRE PAGE</button></div></div>`;
 c.innerHTML=`
 <div class="tyreAdminPage">
  <div class="tyreAdminWelcome">
   <div><span class="eyebrow">TYRE MANAGEMENT</span><h2>Tyre Page Administration</h2><p class="muted">Manage the dedicated wheels & tyres page separately from your main auto-parts catalog.</p></div>
   <div class="tyreAdminTopActions"><a class="ghost" href="/admin">← MAIN ADMIN</a><button class="viewSite" onclick="location.href='/#tyres'">VIEW TYRE PAGE</button></div>
  </div>
  <div class="tyreAdminStats"><div><b>1</b><span>Tyre page</span></div><div><b>${features.length}</b><span>Promo panels</span></div><div><b>${brands.length}</b><span>Brands</span></div><div><b>${featured.length}</b><span>Tyre types</span></div></div>
  <div class="tyreAdminSections">${sectionsHtml}</div>
  ${showSaveBar?saveBar:''}
 </div>`;
}
function tyreProductName(p){const brand=db.tyres?.brands?.find(x=>String(x.id)===String(p.brandId))?.name||p.brand||'';const type=db.tyres?.featured?.find(x=>String(x.id)===String(p.typeId))?.title||p.type||'';const size=db.tyres?.sizes?.find(x=>String(x.id)===String(p.sizeId))?.label||p.size||'';return [brand,type,size,p.tubeType,p.season].map(x=>String(x||'').trim()).filter(Boolean).join(' ')}
function tyreProductsSection(){const t=db.tyres||defaultTyres,ps=Array.isArray(t.tyreProducts)?t.tyreProducts:[],brands=t.brands||[],types=t.featured||[],sizes=t.sizes||[];return '<section class="tyreAdminCard tyreProductsAdminSection"><div class="tyreCardHead"><div><span class="eyebrow">06 · TYRE PRODUCTS</span><h3>Tyre Products</h3><p>Manage the separate tyre catalogue using your existing brands, tyre types and tyre sizes.</p></div><button class="primary" type="button" onclick="openTyreProductModal()">+ ADD TYRE PRODUCT</button></div><div class="tyreProductAdminList">'+(ps.map((p,i)=>{const name=tyreProductName(p)||'Unnamed tyre';return '<div class="tyreProductAdminRow"><div class="tyreProductAdminImage">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'<span>TYRE</span>')+'</div><div class="tyreProductAdminInfo"><strong>'+esc(name)+'</strong><span>'+esc(p.size||'')+(p.availability?' · '+esc(p.availability):'')+'</span></div><div class="tyreProductAdminActions"><button class="ghost" type="button" onclick="openTyreProductModal('+i+')">EDIT</button><button class="ghost danger" type="button" onclick="removeTyreProduct('+i+')">DELETE</button></div></div>'}).join('')||'<div class="tyreSizesEmpty"><strong>No tyre products yet.</strong><span>Add the first tyre product using the existing Tyre Brands, Tyre Types and Tyre Sizes.</span></div>')+'</div></section>'}
function openTyreProductModal(index=-1){const t=db.tyres||defaultTyres,p= index>=0?clone((t.tyreProducts||[])[index]):{brandId:'',typeId:'',sizeId:'',tubeType:'Tubeless',season:'All Season',construction:'Radial',loadIndex:'',speedRating:'',availability:'Available',image:'',description:''},brands=t.brands||[],types=t.featured||[],sizes=t.sizes||[];modal('<div class="tyreSizeModalHead"><span class="eyebrow">TYRE PRODUCT</span><h2>'+(index>=0?'Edit tyre product':'Add tyre product')+'</h2><p class="muted">Product name is generated automatically.</p></div><div class="tyreProductFormGrid"><div class="formGroup"><label>Tyre Brand</label><select id="tpBrand" class="select" onchange="previewTyreProductName()"><option value="">Select brand</option>'+brands.map((x,i)=>'<option value="'+esc(x.id||String(i))+'" '+((p.brandId===x.id||p.brand===x.name)?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></div><div class="formGroup"><label>Tyre Type</label><select id="tpType" class="select" onchange="previewTyreProductName()"><option value="">Select type</option>'+types.map((x,i)=>'<option value="'+esc(x.id||String(i))+'" '+((p.typeId===x.id||p.type===x.title)?'selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select></div><div class="formGroup"><label>Tyre Size</label><select id="tpSize" class="select" onchange="previewTyreProductName()"><option value="">Select size</option>'+sizes.map((x,i)=>'<option value="'+esc(x.id||String(i))+'" '+((p.sizeId===x.id||p.size===x.label)?'selected':'')+'>'+esc(x.label)+'</option>').join('')+'</select></div><div class="formGroup"><label>Tube / Tubeless</label><select id="tpTube" class="select" onchange="previewTyreProductName()"><option>Tubeless</option><option>Tube Type</option><option>Not Specified</option></select></div><div class="formGroup"><label>Season</label><select id="tpSeason" class="select" onchange="previewTyreProductName()"><option>Summer</option><option>Winter</option><option>All Season</option><option>Not Specified</option></select></div><div class="formGroup"><label>Construction</label><select id="tpConstruction" class="select"><option>Radial</option><option>Bias</option><option>Not Specified</option></select></div><div class="formGroup"><label>Load Index <span class="optional">optional</span></label><input id="tpLoad" class="input" value="'+esc(p.loadIndex||'')+'" placeholder="91"></div><div class="formGroup"><label>Speed Rating <span class="optional">optional</span></label><input id="tpSpeed" class="input" value="'+esc(p.speedRating||'')+'" placeholder="V"></div><div class="formGroup"><label>Availability</label><select id="tpAvailability" class="select"><option>Available</option><option>Out of Stock</option></select></div><div class="formGroup"><label>Main Image</label><input id="tpImage" type="file" accept="image/*" class="input"><small class="helpText">Leave empty when editing to keep the current image.</small></div><div class="formGroup" style="grid-column:1/-1"><label>Short Description <span class="optional">optional</span></label><textarea id="tpDescription" class="textarea" rows="3">'+esc(p.description||'')+'</textarea></div></div><div class="tyreSizeLivePreview"><span>PRODUCT NAME</span><strong id="tpNamePreview">'+esc(tyreProductName(p)||'Select brand, type and size')+'</strong></div><button type="button" class="primary tyreSizeSaveButton" onclick="saveTyreProduct('+(index)+')">SAVE TYRE PRODUCT</button>');document.querySelector('#tpTube').value=p.tubeType||'Tubeless';document.querySelector('#tpSeason').value=p.season||'All Season';document.querySelector('#tpConstruction').value=p.construction||'Radial';document.querySelector('#tpAvailability').value=p.availability||'Available';previewTyreProductName()}
function previewTyreProductName(){const t=db.tyres||defaultTyres,get=(id)=>document.querySelector(id)?.value||'',p={brandId:get('#tpBrand'),typeId:get('#tpType'),sizeId:get('#tpSize'),tubeType:get('#tpTube'),season:get('#tpSeason')};const el=document.querySelector('#tpNamePreview');if(el)el.textContent=tyreProductName(p)||'Select brand, type and size'}
async function saveTyreProduct(index=-1){try{const t=clone(db.tyres||defaultTyres);t.tyreProducts=Array.isArray(t.tyreProducts)?t.tyreProducts:[];const p={id:index>=0?t.tyreProducts[index]?.id:'tp-'+Date.now().toString(36),brandId:document.querySelector('#tpBrand')?.value||'',typeId:document.querySelector('#tpType')?.value||'',sizeId:document.querySelector('#tpSize')?.value||'',tubeType:document.querySelector('#tpTube')?.value||'Not Specified',season:document.querySelector('#tpSeason')?.value||'Not Specified',construction:document.querySelector('#tpConstruction')?.value||'Not Specified',loadIndex:document.querySelector('#tpLoad')?.value.trim()||'',speedRating:document.querySelector('#tpSpeed')?.value.trim()||'',availability:document.querySelector('#tpAvailability')?.value||'Available',description:document.querySelector('#tpDescription')?.value.trim()||'',image:t.tyreProducts[index]?.image||''};if(!p.brandId||!p.typeId||!p.sizeId)return toast('Select brand, tyre type and tyre size');const f=document.querySelector('#tpImage')?.files?.[0];if(f)p.image=await uploadImage(f,'product-images','tyre-products');if(index>=0)t.tyreProducts[index]=p;else t.tyreProducts.push(p);await saveTyreData(t);closeModal();toast(index>=0?'Tyre product updated':'Tyre product added');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not save tyre product')}}
async function removeTyreProduct(index){if(!confirm('Delete this tyre product?'))return;try{const t=clone(db.tyres||defaultTyres);t.tyreProducts.splice(index,1);await saveTyreData(t);toast('Tyre product deleted');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not delete tyre product')}}
function tyreProductCard(p){const name=tyreProductName(p),availability=p.availability||'Available',cls=String(availability).toLowerCase().includes('out')?'out':'';return '<article class="tyrePublicProductCard" onclick="tyreProductDetails(\\''+esc(p.id)+'\\')"><div class="tyrePublicProductImage">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(name)+'">':'<span>TYRE</span>')+'</div><div class="tyrePublicProductBody"><h3>'+esc(name)+'</h3><div class="tyrePublicProductSpecs"><span>Size <b>'+esc(p.size||'')+'</b></span><span>Type <b>'+esc(p.type||'')+'</b></span><span>Season <b>'+esc(p.season||'')+'</b></span><span>Tube <b>'+esc(p.tubeType||'')+'</b></span><span>Load/Speed <b>'+esc([p.loadIndex,p.speedRating].filter(Boolean).join('')||'—')+'</b></span></div><div class="tyrePublicProductBottom"><span class="tyreProductAvailability '+cls+'">'+esc(availability)+'</span><b>View Details →</b></div></div></article>'}
function tyreProductDetails(id){const p=(db.tyres?.tyreProducts||[]).find(x=>String(x.id)===String(id));if(!p)return;const name=tyreProductName(p);modal('<div class="tyreProductDetail"><div class="tyreProductDetailImage">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(name)+'">':'<span>TYRE</span>')+'</div><div><span class="eyebrow">TYRE PRODUCT</span><h2>'+esc(name)+'</h2><div class="tyreDetailFacts">'+[['Brand',p.brand],['Tyre Type',p.type],['Tyre Size',p.size],['Tube/Tubeless',p.tubeType],['Season',p.season],['Construction',p.construction],['Load Index',p.loadIndex],['Speed Rating',p.speedRating],['Availability',p.availability]].filter(x=>x[1]).map(x=>'<div><small>'+esc(x[0])+'</small><strong>'+esc(x[1])+'</strong></div>').join('')+'</div>'+(p.description?'<p class="tyreProductDescription">'+esc(p.description)+'</p>':'')+'<button class="primary" onclick=\'smartEnquiry('+JSON.stringify('Hello, I would like to enquire about '+name+'.').replace(/'/g,'&#39;')+', '+JSON.stringify(p.image||'').replace(/'/g,'&#39;')+', '+JSON.stringify(name).replace(/'/g,'&#39;')+')\'>ENQUIRE ABOUT THIS TYRE</button></div></div>')}
function showTyreProductResults(title,filter){const ps=(db.tyres?.tyreProducts||[]).filter(p=>filter(p));setNav('');render('<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreProductResultsPage"><button class="tyrePlaceholderBack" onclick="tyres()">← Back to Tyres</button><div class="tyreProductResultsHead"><span>TYRE CATALOGUE</span><h1>'+esc(title)+'</h1><p>'+ps.length+' tyre product'+(ps.length===1?'':'s')+' found.</p></div><div class="tyrePublicProductGrid">'+(ps.map(tyreProductCard).join('')||'<div class="empty">No tyre products found for this selection.</div>')+'</div></div></div></section>')}

async function addTyreHeroImage(inputEl){const files=[...(inputEl.files||[])];if(!files.length)return;try{const t=clone(db.tyres||defaultTyres);if(!Array.isArray(t.hero.images))t.hero.images=t.hero.image?[t.hero.image]:[];for(const f of files){const url=await uploadImage(f,'product-images','hero');if(url)t.hero.images.push(url)}t.hero.image=t.hero.images[0]||'';await saveTyreData(t);toast(files.length>1?files.length+' hero images added':'Hero image added');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not upload image')}}
async function removeTyreHeroImage(idx){try{const t=clone(db.tyres||defaultTyres);if(!Array.isArray(t.hero.images))t.hero.images=t.hero.image?[t.hero.image]:[];if(t.hero.images.length<=1){toast('Keep at least one hero image');return}t.hero.images.splice(idx,1);t.hero.image=t.hero.images[0]||'';await saveTyreData(t);toast('Image removed');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not remove image')}}
function openTyreSizeModal(){
 modal(`<div class="tyreSizeModalHead"><span class="eyebrow">TYRE SIZE</span><h2>Add tyre size</h2><p class="muted">Enter the standard measurements. The size label is generated automatically.</p></div>
 <div class="tyreSizeFormGrid">
  <div class="formGroup"><label>Width <span class="optional">mm</span></label><input id="tsWidth" class="input" type="number" inputmode="numeric" min="100" max="500" step="1" placeholder="205" oninput="previewTyreSize()"><small class="helpText">Section width in millimetres.</small></div>
  <div class="formGroup"><label>Aspect ratio <span class="optional">%</span></label><input id="tsAspect" class="input" type="number" inputmode="numeric" min="20" max="95" step="1" placeholder="55" oninput="previewTyreSize()"><small class="helpText">Sidewall height as a percentage of width.</small></div>
  <div class="formGroup"><label>Rim diameter <span class="optional">inches</span></label><input id="tsRim" class="input" type="number" inputmode="numeric" min="10" max="30" step="0.5" placeholder="16" oninput="previewTyreSize()"><small class="helpText">Wheel/rim diameter.</small></div>
 </div>
 <div class="tyreSizeLivePreview"><span>SIZE PREVIEW</span><strong id="tsPreview">205/55 R16</strong></div>
 <button type="button" class="primary tyreSizeSaveButton" onclick="addTyreSize()">SAVE TYRE SIZE</button>`);
}
function previewTyreSize(){
 const w=document.querySelector('#tsWidth')?.value.trim(),a=document.querySelector('#tsAspect')?.value.trim(),r=document.querySelector('#tsRim')?.value.trim();
 const label=w&&a&&r?`${w}/${a} R${r}`:'—';
 const el=document.querySelector('#tsPreview');if(el)el.textContent=label;
}
async function addTyreSize(){
 const w=Number(document.querySelector('#tsWidth')?.value),a=Number(document.querySelector('#tsAspect')?.value),r=Number(document.querySelector('#tsRim')?.value);
 if(!Number.isFinite(w)||w<100||w>500||!Number.isInteger(w))return toast('Enter a valid width between 100 and 500 mm');
 if(!Number.isFinite(a)||a<20||a>95||!Number.isInteger(a))return toast('Enter a valid aspect ratio between 20% and 95%');
 if(!Number.isFinite(r)||r<10||r>30)return toast('Enter a valid rim diameter between 10 and 30 inches');
 const label=`${w}/${a} R${Number.isInteger(r)?r:r.toFixed(1)}`;
 try{
  const t=clone(db.tyres||defaultTyres);t.sizes=Array.isArray(t.sizes)?t.sizes:[];
  if(t.sizes.some(x=>String(x.label||'').toLowerCase()===label.toLowerCase()))return toast('This tyre size already exists');
  t.sizes.push({id:'ts-'+Date.now().toString(36),width:w,aspect:a,rim:r,label});
  t.sizes.sort((x,y)=>Number(x.width)-Number(y.width)||Number(x.aspect)-Number(y.aspect)||Number(x.rim)-Number(y.rim));
  await saveTyreData(t);closeModal();toast('Tyre size added');adminPanel('tyres');
 }catch(e){console.error(e);toast(e.message||'Could not add tyre size')}
}
async function removeTyreSize(idx){
 try{const t=clone(db.tyres||defaultTyres);t.sizes=Array.isArray(t.sizes)?t.sizes:[];if(idx<0||idx>=t.sizes.length)return;t.sizes.splice(idx,1);await saveTyreData(t);toast('Tyre size removed');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not remove tyre size')}
}
async function addTyreBrand(){try{const t=clone(db.tyres||defaultTyres);t.brands.push({name:'New Brand',image:''});await saveTyreData(t);toast('Brand added — fill in the details and Save');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not add brand')}}
async function removeTyreBrand(idx){try{const t=clone(db.tyres||defaultTyres);if(t.brands.length<=1){toast('Keep at least one brand');return}t.brands.splice(idx,1);await saveTyreData(t);toast('Brand removed');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not remove brand')}}
async function addTyreFeaturedType(){try{const t=clone(db.tyres||defaultTyres);t.featured.push({title:'New Type',description:'',image:''});await saveTyreData(t);toast('Type added — fill in the details and Save');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not add type')}}
async function removeTyreFeaturedType(idx){try{const t=clone(db.tyres||defaultTyres);if(t.featured.length<=1){toast('Keep at least one type');return}t.featured.splice(idx,1);await saveTyreData(t);toast('Type removed');adminPanel('tyres')}catch(e){console.error(e);toast(e.message||'Could not remove type')}}
async function saveTyreData(t){const {error}=await supabaseClient.from('tyre_page').upsert({id:true,data:t},{onConflict:'id'});if(error)throw error;db.tyres=t;normalizeDb();cacheDb();window.__apCatalogDb=db}
function toggleTyrePromoText(index){
 const form=document.querySelector('#tyrePromoTextForm'+index);
 if(form)form.hidden=!form.hidden;
}
function previewTyrePromoUploads(input){
 const gallery=document.querySelector('#tyrePromoImageGallery'),editor=document.querySelector('#tyrePromoTextEditors');
 if(!gallery||!editor)return;
 const files=[...(input?.files||[])].filter(f=>f.type.startsWith('image/'));
 const urls=files.map(f=>URL.createObjectURL(f));
 const savedImages=Array.isArray(db.tyres?.promoImages)?db.tyres.promoImages.filter(Boolean):[];
 const allImages=[...savedImages,...urls];
 const defaults=defaultTyres.promoTexts||[];
 const savedTexts=Array.isArray(db.tyres?.promoTexts)?db.tyres.promoTexts:[];
 gallery.innerHTML=allImages.length?'<div class="tyreAdminImageGallery">'+allImages.map((src,i)=>'<button type="button" class="tyrePromoImageButton" onclick="toggleTyrePromoText('+i+')"><img src="'+esc(src)+'" alt="Shop Tyres promo image '+(i+1)+'"><span>'+(i<savedImages.length?'IMAGE ':'NEW IMAGE ')+(i+1)+'</span><b>EDIT TEXT</b></button>').join('')+'</div>':'<div class="tyreAdminPreview emptyPreview">No images uploaded</div>';
 editor.innerHTML=allImages.map((src,i)=>{
   const d={...(defaults[i%Math.max(1,defaults.length)]||{}),...(savedTexts[i]||{})};
   return '<div class="tyrePromoTextCard" data-promo-index="'+i+'"><div id="tyrePromoTextForm'+i+'" class="tyrePromoTextForm" hidden><div class="tyreAdminSubHead"><span>'+(i<savedImages.length?'Image ':'New image ')+(i+1)+' text</span><small>Edit the text shown while this image is displayed.</small></div><div class="tyrePromoTextFields"><div class="formGroup"><label>Heading</label><input id="tPromoTitle'+i+'" class="input" value="'+esc(d.title||'')+'"></div><div class="formGroup"><label>Highlight</label><input id="tPromoHighlight'+i+'" class="input" value="'+esc(d.highlight||'')+'"></div><div class="formGroup"><label>Description</label><textarea id="tPromoDesc'+i+'" class="input" rows="2">'+esc(d.desc||'')+'</textarea></div><div class="formGroup"><label>Button text</label><input id="tPromoButton'+i+'" class="input" value="'+esc(d.button||'')+'"></div><div class="formGroup"><label>Text alignment</label><select id="tPromoAlign'+i+'" class="select"><option value="left" '+(d.align==='left'?'selected':'')+'>Left</option><option value="center" '+(d.align==='center'?'selected':'')+'>Center</option><option value="right" '+(d.align==='right'?'selected':'')+'>Right</option></select><small class="helpText">Aligns all text in this section together.</small></div></div></div></div>';
 }).join('');
}

async function saveTyrePage(){try{const t=clone(db.tyres||defaultTyres);const q=id=>document.querySelector('#'+id);if(q('tbCarHeroImg')||q('tbCarImg')||q('tbHomeCarImg')){t.findByCar=t.findByCar||{};const f=editedImage('tbCarHeroImg');if(f)t.findByCar.image=await uploadImage(f,'product-images','find-by-car-hero');const hf=editedImage('tbHomeCarImg');if(hf)t.findByCar.homeImage=await uploadImage(hf,'product-images','find-by-car-home');const b=editedImage('tbCarImg');if(b)t.findByCar.bottomImage=await uploadImage(b,'product-images','find-by-car-bottom');}if(q('tbNumberHeroImg')||q('tbNumberImg')||q('tbHomeNumberImg')){t.findByNumber=t.findByNumber||{};const f=editedImage('tbNumberHeroImg');if(f)t.findByNumber.image=await uploadImage(f,'product-images','find-by-number-hero');const hf=editedImage('tbHomeNumberImg');if(hf)t.findByNumber.homeImage=await uploadImage(hf,'product-images','find-by-number-home');const b=editedImage('tbNumberImg');if(b)t.findByNumber.bottomImage=await uploadImage(b,'product-images','find-by-number-bottom');}if(q('thTitle')){t.hero.title=q('thTitle').value.trim();t.hero.red=q('thRed').value.trim();t.hero.description=q('thDesc').value.trim();const promoFiles=[...(q('tPromoImages')?.files||[])];if(promoFiles.length){t.promoImages=Array.isArray(t.promoImages)?t.promoImages:[];for(const f of promoFiles){if(!f.type.startsWith('image/'))throw new Error('Please select image files only');const url=await uploadImage(f,'product-images','auto-parts-tyres-promo');if(url){t.promoImages.push(url);t.promoTexts=Array.isArray(t.promoTexts)?t.promoTexts:[];t.promoTexts.push(clone((defaultTyres.promoTexts||[])[(t.promoImages.length-1)%(defaultTyres.promoTexts||[]).length]||{}))}}}const promoCount=t.promoImages.length;
 t.promoTexts=Array.from({length:promoCount},(_,i)=>{
  const d=(defaultTyres.promoTexts||[])[i%(defaultTyres.promoTexts||[]).length]||{};
  const old=(t.promoTexts||[])[i]||{};
  return {...d,...old,
   title:q('tPromoTitle'+i)?.value.trim()||old.title||d.title||'',
   highlight:q('tPromoHighlight'+i)?.value.trim()||old.highlight||d.highlight||'',
   desc:q('tPromoDesc'+i)?.value.trim()||old.desc||d.desc||'',
   button:q('tPromoButton'+i)?.value.trim()||old.button||d.button||'',
   align:q('tPromoAlign'+i)?.value||old.align||d.align||'left',
   titleColor:q('tPromoTitleColor'+i)?.value||old.titleColor||d.titleColor||'#ffffff',
   highlightColor:q('tPromoHighlightColor'+i)?.value||old.highlightColor||d.highlightColor||'#d71920',
   descColor:q('tPromoDescColor'+i)?.value||old.descColor||d.descColor||'#ffffff',
   buttonColor:q('tPromoButtonColor'+i)?.value||old.buttonColor||d.buttonColor||'#ffffff'
  };
 });
 const hf=editedImage('thBottomImg');if(hf)t.bottomImage=await uploadImage(hf,'product-images','tyre-home-bottom');

    t.contact=t.contact||clone(defaultTyres.contact);
    t.contact.aboutTitle=q('tcAboutTitle')?.value.trim()||'';
    t.contact.aboutText=q('tcAboutText')?.value.trim()||'';
    t.contact.phone=q('tcPhone')?.value.trim()||'';
    t.contact.phone2=q('tcPhone2')?.value.trim()||'';
    t.contact.phone3=q('tcPhone3')?.value.trim()||'';
    t.contact.whatsapp=q('tcWhatsapp')?.value.trim()||'';
    t.contact.instagram=q('tcInstagram')?.value.trim()||'';
    t.contact.facebook=q('tcFacebook')?.value.trim()||'';
    t.contact.telegram=q('tcTelegram')?.value.trim()||'';
    t.contact.x=q('tcX')?.value.trim()||'';

    const cf=editedImage('tcContactImage');
    if(cf)t.contact.contactImage=await uploadImage(cf,'product-images','tyre-contact');for(let i=0;i<3;i++){t.features[i].title=document.querySelector(`#tf${i}t`).value.trim();t.features[i].subtitle=document.querySelector(`#tf${i}s`).value.trim();t.features[i].message=document.querySelector(`#tf${i}m`).value.trim();const f=editedImage(`tf${i}i`);if(f)t.features[i].image=await uploadImage(f,'product-images','features')}t.findByCar=t.findByCar||{};t.findByNumber=t.findByNumber||{};const bfCar=editedImage('tbCarImg');if(bfCar)t.findByCar.bottomImage=await uploadImage(bfCar,'product-images','find-by-car-bottom');const bfNumber=editedImage('tbNumberImg');if(bfNumber)t.findByNumber.bottomImage=await uploadImage(bfNumber,'product-images','find-by-number-bottom')}if(q('tb0n')){for(let i=0;i<t.brands.length;i++){const nameEl=document.querySelector(`#tb${i}n`);if(!nameEl)continue;t.brands[i].name=nameEl.value.trim();const f=editedImage(`tb${i}i`);if(f)t.brands[i].image=await uploadImage(f,'product-images','brands')}}if(q('tt0t')){for(let i=0;i<t.featured.length;i++){const titleEl=document.querySelector(`#tt${i}t`);if(!titleEl)continue;t.featured[i].title=titleEl.value.trim();t.featured[i].description=document.querySelector(`#tt${i}d`).value.trim();const f=editedImage(`tt${i}i`);if(f)t.featured[i].image=await uploadImage(f,'product-images','featured')}}await saveTyreData(t);toast('Tyre page saved');setTimeout(()=>adminPanel('tyres'),300)}catch(e){console.error(e);toast(e.message||'Could not save tyre page')}}
async function recordProductEnquiry(id, selectedYear='', branchId=''){
 try{
  if(!supabaseClient)return;
  const p=db.parts.find(x=>x.id===id)||window.__displayProducts?.find(x=>x.id===id)||window.__virtualProducts?.find(x=>x.id===id); if(!p)return;
  const m=db.models.find(x=>x.id===p.modelId), b=db.brands.find(x=>x.id===m?.brandId), c=db.categories.find(x=>x.id===p.categoryId||x.name===p.category);
  const payload={product_id:p.virtual?null:(p.sourceProductId||p.id),branch_id:branchId||p.branchId||null,brand_id:b?.id||null,model_id:m?.id||null,category_id:c?.id||p.categoryId||null,year:Number(selectedYear)||null,product_name:p.name||'Product',brand_name:b?.name||'',model_name:m?.name||'',category_name:c?.name||p.category||''};
  const {error}=await supabaseClient.from('product_enquiries').insert(payload); if(error)console.warn('Enquiry tracking failed:',error.message||error);
 }catch(e){console.warn('Enquiry tracking failed:',e)}
}
async function loadEnquiries(){
 try{
  const {data,error}=await supabaseClient.from('product_enquiries').select('*').order('created_at',{ascending:false}).limit(200);
  if(error)throw error;
  return {rows:data||[],error:null};
 }catch(e){console.warn('Could not load enquiries:',e);return {rows:[],error:e}}
}
function enquiryStatusClass(status){return String(status||'New').toLowerCase().replace(/[^a-z]+/g,'-')}
function enquiryTime(value){if(!value)return '—';const d=new Date(value);if(Number.isNaN(d.getTime()))return esc(value);return d.toLocaleString([], {year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
async function updateEnquiry(id,patch){
 try{
  const {data,error}=await supabaseClient.from('product_enquiries').update(patch).eq('id',id).select().single();
  if(error)throw error;
  toast('Enquiry updated');
  return data;
 }catch(e){console.error(e);toast(e.message||'Could not update enquiry');return null}
}
async function deleteEnquiry(id){
 if(!confirm('Delete this enquiry?'))return;
 try{const {error}=await supabaseClient.from('product_enquiries').delete().eq('id',id);if(error)throw error;toast('Enquiry deleted');enquiriesAdmin(document.querySelector('#adminContent'));}
 catch(e){console.error(e);toast(e.message||'Could not delete enquiry')}
}
async function enquiryDetails(id){
 const {rows}=await loadEnquiries();const e=rows.find(x=>x.id===id);if(!e)return;
 modal(`<div class="enquiryDetail"><span class="eyebrow">ENQUIRY</span><h2>${esc(e.product_name||'Product enquiry')}</h2><p class="muted">${esc([e.brand_name,e.model_name,e.year,e.category_name].filter(Boolean).join(' · '))}</p><div class="enquiryMeta"><div><small>Received</small><strong>${enquiryTime(e.created_at)}</strong></div><div><small>Status</small><strong>${esc(e.status||'New')}</strong></div>${e.branch_id?`<div><small>Branch ID</small><strong>${esc(e.branch_id)}</strong></div>`:''}</div><div class="formGroup"><label>Admin note</label><textarea id="enquiryNote" class="input" rows="5" placeholder="Add a follow-up note...">${esc(e.admin_note||'')}</textarea></div><div class="formGroup"><label>Status</label><select id="enquiryStatus" class="select"><option ${e.status==='New'||!e.status?'selected':''}>New</option><option ${e.status==='Contacted'?'selected':''}>Contacted</option><option ${e.status==='Quoted'?'selected':''}>Quoted</option><option ${e.status==='Sold'?'selected':''}>Sold</option><option ${e.status==='Closed'?'selected':''}>Closed</option></select></div><div class="modalActions"><button class="primary" onclick="saveEnquiryDetails('${e.id}')">SAVE CHANGES</button></div></div>`)
}
async function saveEnquiryDetails(id){const note=document.querySelector('#enquiryNote')?.value||'';const status=document.querySelector('#enquiryStatus')?.value||'New';const data=await updateEnquiry(id,{status,admin_note:note});if(data){closeModal();enquiriesAdmin(document.querySelector('#adminContent'))}}
async function enquiriesAdmin(c){
 c.innerHTML=`<div class="adminHead"><div><h2>Enquiry CRM</h2><p class="muted">Track customer part enquiries from new request through follow-up and closure.</p></div><button class="ghost" onclick="enquiriesAdmin(document.querySelector('#adminContent'))">REFRESH</button></div><div class="enquiryToolbar"><input id="enquirySearch" class="input" placeholder="Search product, brand, model, category or part..." oninput="renderEnquiryTable()"><select id="enquiryStatusFilter" class="select" onchange="renderEnquiryTable()"><option value="">All statuses</option><option>New</option><option>Contacted</option><option>Quoted</option><option>Sold</option><option>Closed</option></select></div><div id="enquiryTableWrap"><div class="adminTip"><strong>Loading enquiries…</strong><span>Reading customer requests from Supabase.</span></div></div>`;
 const result=await loadEnquiries();window.__adminEnquiries=result.rows;window.__adminEnquiryError=result.error;renderEnquiryTable();
}
function renderEnquiryTable(){
 const wrap=document.querySelector('#enquiryTableWrap');if(!wrap)return;const rows=window.__adminEnquiries||[];const q=String(document.querySelector('#enquirySearch')?.value||'').trim().toLowerCase();const status=String(document.querySelector('#enquiryStatusFilter')?.value||'');
 const filtered=rows.filter(e=>{const hay=[e.product_name,e.brand_name,e.model_name,e.category_name,e.part_no,e.year,e.admin_note].filter(Boolean).join(' ').toLowerCase();return (!q||hay.includes(q))&&(!status||(e.status||'New')===status)});
 const stats={New:0,Contacted:0,Quoted:0,Sold:0,Closed:0};rows.forEach(e=>stats[e.status||'New']=(stats[e.status||'New']||0)+1);
 wrap.innerHTML=`<div class="enquiryKpis"><div><b>${rows.length}</b><span>Total</span></div><div><b>${stats.New}</b><span>New</span></div><div><b>${stats.Contacted}</b><span>Contacted</span></div><div><b>${stats.Quoted}</b><span>Quoted</span></div><div><b>${stats.Sold}</b><span>Sold</span></div></div>${window.__adminEnquiryError?`<div class="adminTip"><strong>Enquiry CRM needs the V81 database migration.</strong><span>Run the included V81 SQL once, then refresh this page.</span></div>`:''}${filtered.length?`<div class="table enquiryTable"><div class="enquiryTableHead"><span>ENQUIRY</span><span>VEHICLE</span><span>STATUS</span><span>RECEIVED</span><span>ACTIONS</span></div>${filtered.map(e=>`<div class="enquiryRow"><div><strong>${esc(e.product_name||'Product')}</strong><small>${esc([e.category_name,e.part_no].filter(Boolean).join(' · ')||'Part details not provided')}</small></div><div><strong>${esc([e.brand_name,e.model_name].filter(Boolean).join(' · ')||'—')}</strong><small>${e.year?`Year ${esc(e.year)}`:'Year —'}</small></div><div><span class="enquiryStatus ${enquiryStatusClass(e.status)}">${esc(e.status||'New')}</span></div><div><small>${enquiryTime(e.created_at)}</small></div><div class="enquiryActions"><button class="ghost" onclick="enquiryDetails('${e.id}')">VIEW</button><button class="danger" onclick="deleteEnquiry('${e.id}')">DELETE</button></div></div>`).join('')}</div>`:'<div class="empty"><strong>No enquiries found</strong><span>Try another search or status filter.</span></div>'}`;
}
async function loadEnquiryStats(){
 const empty={total_enquiries:0,enquiries_today:0,enquiries_this_week:0,enquiries_this_month:0};
 try{
  const direct=await supabaseClient.from('product_enquiries').select('*').order('created_at',{ascending:false}).limit(500);
  if(direct.error)throw direct.error;
  const rows=direct.data||[];
  const now=new Date(),startDay=new Date(now.getFullYear(),now.getMonth(),now.getDate()),startWeek=new Date(startDay);startWeek.setDate(startWeek.getDate()-startWeek.getDay());
  const startMonth=new Date(now.getFullYear(),now.getMonth(),1);
  const inRange=(v,d)=>{const t=new Date(v);return !Number.isNaN(t.getTime())&&t>=d};
  const summary={total_enquiries:rows.length,enquiries_today:rows.filter(x=>inRange(x.created_at,startDay)).length,enquiries_this_week:rows.filter(x=>inRange(x.created_at,startWeek)).length,enquiries_this_month:rows.filter(x=>inRange(x.created_at,startMonth)).length};
  const counts=(key)=>{const m=new Map();rows.forEach(x=>{const k=x[key]||'Unknown';m.set(k,(m.get(k)||0)+1)});return [...m.entries()].map(([k,n])=>({[key]:k,enquiry_count:n})).sort((a,b)=>b.enquiry_count-a.enquiry_count).slice(0,10)};
  const products=counts('product_name').map(x=>({...x,product_name:x.product_name}));
  const categories=counts('category_name').map(x=>({...x,category_name:x.category_name}));
  const brands=counts('brand_name').map(x=>({...x,brand_name:x.brand_name}));
  const days=[];for(let i=13;i>=0;i--){const d=new Date(startDay);d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);days.push({enquiry_date:key,enquiry_count:rows.filter(x=>String(x.created_at||'').slice(0,10)===key).length})}
  const statuses=rows.map(x=>({status:x.status||'New'}));
  return {summary,products,categories,brands,daily:days,statuses,recent:rows.slice(0,6),error:null};
 }catch(e){console.warn('Could not load enquiry analytics:',e);return {summary:empty,products:[],categories:[],brands:[],daily:[],statuses:[],recent:[],error:e}}
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

function brandAdmin(c){const ordered=[...db.brands].sort((a,b)=>Number(a.sortOrder??0)-Number(b.sortOrder??0)||String(a.createdAt||'').localeCompare(String(b.createdAt||'')));c.innerHTML=`<div class="adminHead"><div><h2>Manage brands</h2><p class="muted">Brands are listed in the order they were added — oldest first.</p></div><button class="primary" onclick="brandForm()">+ ADD BRAND</button></div><table class="table"><tr><th>#</th><th>Brand</th><th>Type</th><th>Models</th><th>Actions</th></tr>${ordered.map((b,i)=>`<tr><td>${i+1}</td><td><div class="tableBrand"><img class="thumb" src="${b.image||placeholder(b.name)}">${esc(b.name)}</div></td><td><span class="brandTypeBadge ${b.isEv&&b.isRegular?'both':b.isEv?'ev':'regular'}">${b.isEv&&b.isRegular?'CAR + EV':b.isEv?'EV':'CAR'}</span></td><td>${db.models.filter(m=>m.brandId===b.id).length}</td><td><button class="ghost" onclick="brandEditForm('${b.id}')">EDIT</button> <button class="danger" onclick="delBrand('${b.id}')">Delete</button></td></tr>`).join('')}</table>`}
function modelAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Manage models</h2><p class="muted">Add models and their images under each brand.</p></div><button class="primary" onclick="modelForm()">+ ADD MODEL</button></div><table class="table"><tr><th>Model</th><th>Brand</th><th>Years</th><th>Actions</th></tr>${db.models.map(m=>{const b=db.brands.find(x=>x.id===m.brandId);return `<tr><td><div class="tableBrand"><img class="thumb" src="${m.image||placeholder(m.name)}">${esc(m.name)}</div></td><td>${esc(b?.name)}</td><td>${modelYears(m.id).join(', ')||'—'}</td><td><button class="danger" onclick="delModel('${m.id}')">Delete</button></td></tr>`}).join('')}</table>`}
function yearAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Manage model years</h2><p class="muted">Select many years at once. Customers will see Year immediately after Model.</p></div><button class="primary" onclick="yearForm()">+ SELECT YEARS</button></div><table class="table"><tr><th>Year</th><th>Model</th><th>Brand</th><th>Actions</th></tr>${[...db.years].sort((a,b)=>Number(b.year)-Number(a.year)).map(y=>{const m=db.models.find(x=>x.id===y.modelId),b=db.brands.find(x=>x.id===m?.brandId);return `<tr><td>${esc(y.year)}</td><td>${esc(m?.name)}</td><td>${esc(b?.name)}</td><td><button class="danger" onclick="delYear('${y.id}')">Delete</button></td></tr>`}).join('')}</table>`}
function yearForm(){const years=Array.from({length:57},(_,i)=>2026-i);modal(`<h2>Select model years</h2><p class="muted">Choose multiple years for one model. Existing years for that model are pre-selected.</p><div class="row"><div class="formGroup"><label>Brand</label><select id="y1" class="select" onchange="refreshYearModelOptions()">${db.brands.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></div><div class="formGroup"><label>Model</label><select id="y2" class="select" onchange="syncYearChecks()">${modelOptions(db.brands[0]?.id)}</select></div></div><div class="yearPicker">${years.map(y=>`<label class="yearCheck"><input type="checkbox" name="yearPick" value="${y}"><span>${y}</span></label>`).join('')}</div><div class="customYear"><input id="customYear" class="input" inputmode="numeric" placeholder="Optional custom year, e.g. 1988"><button class="ghost" onclick="addCustomYear()">Add to selection</button></div><button class="primary" onclick="addSelectedYears()">SAVE SELECTED YEARS</button>`);setTimeout(syncYearChecks,0)}
function syncYearChecks(){const mid=document.querySelector('#y2')?.value;if(!mid)return;const set=new Set(modelYears(mid));document.querySelectorAll('input[name="yearPick"]').forEach(x=>x.checked=set.has(x.value))}
function addCustomYear(){const el=document.querySelector('#customYear'),v=el.value.trim();if(!/^\d{4}$/.test(v))return toast('Enter a 4-digit year');let box=[...document.querySelectorAll('input[name="yearPick"]')].find(x=>x.value===v);if(box)box.checked=true;else{const wrap=document.querySelector('.yearPicker');const lab=document.createElement('label');lab.className='yearCheck';lab.innerHTML=`<input type="checkbox" name="yearPick" value="${esc(v)}" checked><span>${esc(v)}</span>`;wrap.appendChild(lab)}el.value=''}
async function addSelectedYears(){const mid=document.querySelector('#y2').value;const selected=[...document.querySelectorAll('input[name="yearPick"]:checked')].map(x=>Number(x.value));if(!mid||!selected.length)return toast('Select a model and at least one year');try{let added=0;for(const y of selected){if(!db.years.some(x=>x.modelId===mid&&Number(x.year)===y)){const {data,error}=await supabaseClient.from('model_years').insert({model_id:mid,year:y}).select().single();if(error&&error.code!=='23505')throw error;if(data){db.years.push({id:data.id,modelId:mid,year:String(y)});added++}}}cacheDb();closeModal();adminPanel('years');toast(`${added} year${added===1?'':'s'} saved`)}catch(e){console.error(e);toast(e.message||'Could not save years')}}
function refreshYearModelOptions(){const el=document.querySelector('#y2');if(el){el.innerHTML=modelOptions(document.querySelector('#y1').value);syncYearChecks()}}
function categoryAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Manage part categories</h2><p class="muted">Edit category names/images and manage branch parts such as Left Headlight and Right Headlight.</p></div><button class="primary" onclick="categoryForm()">+ ADD CATEGORY</button></div><div class="categoryAdminGrid">${db.categories.map(x=>`<div class="categoryAdminItem categoryAdminRich"><div class="catAdminInfo"><img class="thumb" src="${x.image||placeholder(x.name)}" onerror="this.onerror=null;this.src=placeholder('${x.name}')"><div><strong>${esc(x.name)}</strong><small>${branchesForCategory(x.id).length} branch part${branchesForCategory(x.id).length===1?'':'s'}</small></div></div><div class="categoryAdminActions"><button class="ghost" onclick="categoryEditForm('${x.id}')">EDIT</button><button class="ghost" onclick="branchForm('${x.id}')">+ BRANCH</button><button class="danger" onclick="delCategory('${x.id}')">Delete</button></div><div class="branchAdminList">${branchesForCategory(x.id).map(br=>`<div class="branchAdminItem"><div><img class="thumb smallThumb" src="${br.image||x.image||placeholder(br.name)}" onerror="this.onerror=null;this.src=placeholder('${br.name}')"><span>${esc(br.name)}</span></div><span><button class="ghost" onclick="branchEditForm('${br.id}')">EDIT</button> <button class="danger" onclick="delBranch('${br.id}')">DELETE</button></span></div>`).join('')||'<small class="helpText">No branches yet.</small>'}</div></div>`).join('')}</div>`}
function categoryForm(){modal(`<h2>Add part category</h2><p class="muted">Create a main category, then add branch parts under it.</p><div class="formGroup"><label>Category name</label><input id="catName" class="input" placeholder="e.g. Fog Lights"></div><div class="formGroup"><label>Category image (optional)</label><input id="catImage" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\'catImage\')"></div><button class="primary" onclick="addCategory()">SAVE CATEGORY</button>`)}
function categoryEditForm(id){const c=db.categories.find(x=>x.id===id);if(!c)return;modal(`<h2>Edit category</h2><div class="formGroup"><label>Category name</label><input id="ecatName" class="input" value="${esc(c.name)}"></div><div class="formGroup"><label>Replace category image <span class="optional">(optional)</span></label><input id="ecatImage" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\'ecatImage\')"></div><button class="primary" onclick="saveCategoryEdit('${id}')">SAVE CATEGORY</button>`)}
async function saveCategoryEdit(id){const c=db.categories.find(x=>x.id===id);if(!c)return;const n=document.querySelector('#ecatName').value.trim();if(!n)return toast('Enter a category name');if(db.categories.some(x=>x.id!==id&&x.name.toLowerCase()===n.toLowerCase()))return toast('Category already exists');try{const f=editedImage('ecatImage');let image=c.image||'';if(f)image=await uploadImage(f,'category-images','categories');const {error}=await supabaseClient.from('categories').update({name:n,image_url:image||null}).eq('id',id);if(error)throw error;c.name=n;c.image=image;cacheDb();closeModal();adminPanel('categories');toast('Category updated')}catch(e){console.error(e);toast(e.message||'Could not update category')}}
function branchForm(categoryId){const c=db.categories.find(x=>x.id===categoryId);if(!c)return;modal(`<h2>Add branch part</h2><p class="muted">Example: Left Headlight, Right Headlight, Front Bumper.</p><div class="formGroup"><label>Branch name</label><input id="brName" class="input" placeholder="e.g. Left Headlight"></div><div class="formGroup"><label>Branch image (optional)</label><input id="brImage" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\'brImage\')"></div><button class="primary" onclick="addBranch('${categoryId}')">SAVE BRANCH</button>`)}
async function addBranch(categoryId){const n=document.querySelector('#brName').value.trim();if(!n)return toast('Enter a branch name');if(db.branches.some(x=>x.categoryId===categoryId&&x.name.toLowerCase()===n.toLowerCase()))return toast('Branch already exists');try{const f=editedImage('brImage');const image=f?await uploadImage(f,'category-images','branches'):'';const {data,error}=await supabaseClient.from('category_branches').insert({category_id:categoryId,name:n,image_url:image||null,sort_order:0,active:true}).select().single();if(error)throw error;db.branches.push({id:data.id,categoryId,name:n,image:data.image_url||''});cacheDb();closeModal();adminPanel('categories');toast('Branch saved')}catch(e){console.error(e);toast(e.message||'Could not save branch')}}
function branchEditForm(id){const br=branchById(id);if(!br)return;modal(`<h2>Edit branch part</h2><div class="formGroup"><label>Branch name</label><input id="ebrName" class="input" value="${esc(br.name)}"></div><div class="formGroup"><label>Replace branch image <span class="optional">(optional)</span></label><input id="ebrImage" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\'ebrImage\')"></div><button class="primary" onclick="saveBranchEdit('${id}')">SAVE CHANGES</button>`)}
async function saveBranchEdit(id){const br=branchById(id);if(!br)return;const n=document.querySelector('#ebrName').value.trim();if(!n)return toast('Enter a branch name');if(db.branches.some(x=>x.id!==id&&x.categoryId===br.categoryId&&x.name.toLowerCase()===n.toLowerCase()))return toast('Branch already exists');try{const f=editedImage('ebrImage');let image=br.image||'';if(f)image=await uploadImage(f,'category-images','branches');const {error}=await supabaseClient.from('category_branches').update({name:n,image_url:image||null}).eq('id',id);if(error)throw error;br.name=n;br.image=image;cacheDb();closeModal();adminPanel('categories');toast('Branch updated')}catch(e){console.error(e);toast(e.message||'Could not update branch')}}
async function delBranch(id){const br=branchById(id);if(!br)return;if(!confirm('Delete this branch part?'))return;try{const {error}=await supabaseClient.from('category_branches').delete().eq('id',id);if(error)throw error;db.branches=db.branches.filter(x=>x.id!==id);db.parts.forEach(p=>{if(p.branchId===id)p.branchId=''});cacheDb();adminPanel('categories');toast('Branch deleted')}catch(e){console.error(e);toast(e.message||'Could not delete branch')}}
async function addCategory(){const n=document.querySelector('#catName').value.trim();if(!n)return toast('Enter a category name');if(db.categories.some(x=>x.name.toLowerCase()===n.toLowerCase()))return toast('Category already exists');try{const f=editedImage('catImage');const image=f?await uploadImage(f,'category-images','categories'):'';const {data,error}=await supabaseClient.from('categories').insert({name:n,image_url:image||null,sort_order:0,active:true}).select().single();if(error)throw error;db.categories.push({id:data.id,name:data.name,image:data.image_url||''});cacheDb();closeModal();adminPanel('categories');toast('Category saved')}catch(e){console.error(e);toast(e.message||'Could not save category')}}
async function delCategory(id){if(db.categories.length<=1)return toast('Keep at least one category');if(!confirm('Delete this category? It cannot be deleted while products still use it.'))return;try{const {error}=await supabaseClient.from('categories').delete().eq('id',id);if(error)throw error;db.categories=db.categories.filter(x=>x.id!==id);cacheDb();adminPanel('categories');toast('Category deleted')}catch(e){console.error(e);toast('Cannot delete this category while products use it.')}}
function productAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Manage products</h2><p class="muted">Search, filter, edit and manage your catalog from one place.</p></div><button class="primary" onclick="productForm()">+ ADD PRODUCT</button></div><div class="productTools productToolsAdvanced"><input id="productAdminSearch" class="input" placeholder="Search product, model, category, branch or part number..." oninput="renderProductTable()"><select id="productAdminBrand" class="select" onchange="refreshProductAdminModels()"><option value="">All brands</option>${db.brands.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')}</select><select id="productAdminModel" class="select" onchange="renderProductTable()"><option value="">All models</option></select><select id="productAdminCategory" class="select" onchange="renderProductTable()"><option value="">All categories</option>${db.categories.map(x=>`<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('')}</select><select id="productAdminYear" class="select" onchange="renderProductTable()"><option value="">All years</option>${[...new Set(db.years.map(x=>String(x.year)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b)).map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('')}</select><select id="productAdminAvailability" class="select" onchange="renderProductTable()"><option value="">All availability</option><option>In Stock</option><option>Available on enquiry</option><option>Out of Stock</option></select><button class="ghost" onclick="clearProductFilters()">RESET</button></div><div class="bulkBar bulkBarAdvanced"><label><input id="selectAllProducts" type="checkbox" onchange="toggleAllProducts(this.checked)"> Select all</label><span id="selectedProductCount">0 selected</span><button class="ghost" onclick="setSelectedProductsActive(true)">ACTIVATE</button><button class="ghost" onclick="setSelectedProductsActive(false)">DEACTIVATE</button><button class="danger" onclick="deleteSelectedProducts()">DELETE SELECTED</button></div><div id="productTableWrap"></div>`;refreshProductAdminModels();renderProductTable()}
function refreshProductAdminModels(){const brand=document.querySelector('#productAdminBrand')?.value||'',sel=document.querySelector('#productAdminModel');if(!sel)return;const current=sel.value;const models=db.models.filter(m=>!brand||m.brandId===brand);sel.innerHTML='<option value="">All models</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');if(models.some(m=>m.id===current))sel.value=current;renderProductTable()}
function renderProductTable(){const wrap=document.querySelector('#productTableWrap');if(!wrap)return;const q=(document.querySelector('#productAdminSearch')?.value||'').toLowerCase().trim(),brand=document.querySelector('#productAdminBrand')?.value||'',model=document.querySelector('#productAdminModel')?.value||'',cat=document.querySelector('#productAdminCategory')?.value||'',year=document.querySelector('#productAdminYear')?.value||'',availability=document.querySelector('#productAdminAvailability')?.value||'';const list=uniqueProducts(db.parts.filter(p=>{const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId),hay=[p.name,p.category,p.partNo,p.description,m?.name,b?.name,productBranchIds(p).map(id=>branchById(id)?.name||'').filter(Boolean).join(' ')].join(' ').toLowerCase();const active= p.active!==false;const years=productYears(p).map(String);return (!q||hay.includes(q))&&(!brand||m?.brandId===brand)&&(!model||p.modelId===model)&&(!cat||p.category===cat)&&(!year||years.includes(year))&&(!availability||String(p.availability||'Available on enquiry')===availability)}));const status=p=>p.active===false?'Disabled':String(p.availability||'Available on enquiry');wrap.innerHTML=`<div class="adminProductList">${list.map(p=>{const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId),brs=productBranchIds(p).map(id=>branchById(id)?.name).filter(Boolean),st=status(p);return `<article class="adminProductCard ${p.active===false?'isDisabled':''}"><input class="productSelect" type="checkbox" value="${esc(p.id)}" onchange="updateSelectedProductCount()"><img class="adminProductImage" src="${p.image||placeholder('PART')}" alt="${esc(p.name||'Product')}"><div class="adminProductInfo"><div class="adminProductName">${esc(p.name)} <span class="adminProductStatus ${p.active===false?'statusDisabled':''}">${esc(st)}</span></div><div class="adminProductMeta">${esc(b?.name||'')} · ${esc(m?.name||'')} · ${esc(p.category||'')}${brs.length?' · '+esc(brs.join(', ')):''}</div><div class="adminProductMeta">Years: ${esc(productYears(p).join(', ')||'—')}</div>${p.partNo?`<div class="partNo">Part No: ${esc(p.partNo)}</div>`:''}<div class="adminProductPrice">${p.price!=null&&p.price!==''?'Price: '+priceDisplay(p):'Price: —'}</div></div><div class="actionBtns adminProductActions"><button class="ghost" onclick="editProduct('${esc(p.id)}')">Edit</button><button class="ghost" onclick="duplicateProduct('${esc(p.id)}')">Duplicate</button><button class="ghost" onclick="setProductActive('${esc(p.id)}',${p.active===false})">${p.active===false?'Activate':'Deactivate'}</button><button class="danger" onclick="delProduct('${esc(p.id)}')">Delete</button></div></article>`}).join('')||'<div class="empty">No matching products.</div>'}</div>`;updateSelectedProductCount()}
function clearProductFilters(){['productAdminSearch','productAdminBrand','productAdminModel','productAdminCategory','productAdminYear','productAdminAvailability'].forEach(id=>{const el=document.querySelector('#'+id);if(el)el.value=''});refreshProductAdminModels();renderProductTable()}
function updateSelectedProductCount(){const n=document.querySelectorAll('.productSelect:checked').length;const el=document.querySelector('#selectedProductCount');if(el)el.textContent=`${n} selected`;const all=document.querySelector('#selectAllProducts');const total=document.querySelectorAll('.productSelect').length;if(all){all.checked=total>0&&n===total;all.indeterminate=n>0&&n<total}}
function toggleAllProducts(on){document.querySelectorAll('.productSelect').forEach(x=>x.checked=on);updateSelectedProductCount()}
async function setProductActive(id,active){const p=db.parts.find(x=>x.id===id);if(!p)return;try{const {error}=await supabaseClient.from('products').update({active}).eq('id',id);if(error)throw error;p.active=active;cacheDb();renderProductTable();toast(active?'Product activated':'Product deactivated')}catch(e){console.error(e);toast(e.message||'Could not update product')}}
async function setSelectedProductsActive(active){const ids=[...document.querySelectorAll('.productSelect:checked')].map(x=>x.value);if(!ids.length)return toast('Select at least one product');if(!confirm(`${active?'Activate':'Deactivate'} ${ids.length} selected product${ids.length===1?'':'s'}?`))return;try{const {error}=await supabaseClient.from('products').update({active}).in('id',ids);if(error)throw error;db.parts.forEach(p=>{if(ids.includes(p.id))p.active=active});cacheDb();adminPanel('products');toast(`${ids.length} product${ids.length===1?'':'s'} ${active?'activated':'deactivated'}`)}catch(e){console.error(e);toast(e.message||'Could not update products')}}
async function deleteSelectedProducts(){const ids=[...document.querySelectorAll('.productSelect:checked')].map(x=>x.value);if(!ids.length)return toast('Select at least one product');if(!confirm(`Delete ${ids.length} selected product${ids.length===1?'':'s'}? This cannot be undone.`))return;try{const {error}=await supabaseClient.from('products').delete().in('id',ids);if(error)throw error;db.parts=db.parts.filter(p=>!ids.includes(p.id));cacheDb();adminPanel('products');toast(`${ids.length} product${ids.length===1?'':'s'} deleted`)}catch(e){console.error(e);toast(e.message||'Could not delete products')}}
async function duplicateProduct(id){const p=db.parts.find(x=>x.id===id);if(!p)return;try{const cat=db.categories.find(c=>c.name===p.category);const {data,error}=await supabaseClient.from('products').insert({model_id:p.modelId,category_id:cat?.id,name:p.name+' (Copy)',part_no:p.partNo||null,availability:p.availability||'Available on enquiry',description:p.description||null,image_url:p.image||null,branch_id:p.branchId||null,price:hasPrice(p)?Number(p.price):null,active:true}).select().single();if(error)throw error;const yrows=db.years.filter(y=>y.modelId===p.modelId&&productYears(p).includes(String(y.year))).map(y=>({product_id:data.id,model_year_id:y.id}));if(yrows.length){const {error:pyErr}=await supabaseClient.from('product_years').insert(yrows);if(pyErr)throw pyErr}const dupBranches=productBranchIds(p);if(dupBranches.length){const {error:pbErr}=await supabaseClient.from('product_branches').insert(dupBranches.map(branch_id=>({product_id:data.id,branch_id,image_url:p.branchImages?.[branch_id]||p.image||null})));if(pbErr)throw pbErr}db.parts.push({...clone(p),id:data.id,name:data.name,branchId:data.branch_id||p.branchId||'',branchIds:dupBranches,price:hasPrice(data)?Number(data.price):null,createdAt:data.created_at||''});cacheDb();adminPanel('products');toast('Product duplicated — edit the copy if needed')}catch(e){console.error(e);toast(e.message||'Could not duplicate product')}}
function editProduct(id){const p=db.parts.find(x=>x.id===id);if(!p)return;productEditForm(p)}
function productEditForm(p){const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId);modal(`<h2>Edit product</h2><p class="muted">Update the product once and keep its image shared across all compatible years.</p><div class="row"><div class="formGroup"><label>Brand</label><select id="ep1" class="select" disabled><option>${esc(b?.name||'')}</option></select></div><div class="formGroup"><label>Model</label><select id="ep2" class="select" disabled><option>${esc(m?.name||'')}</option></select></div></div><div class="formGroup"><label>Compatible years</label><div id="editYearPicker" class="yearPicker compactYearPicker">${yearChecksForEdit(p)}</div><div class="pickerActions"><button type="button" class="ghost" onclick="toggleEditYears(true)">SELECT ALL</button><button type="button" class="ghost" onclick="toggleEditYears(false)">CLEAR</button></div></div><div class="formGroup"><label>Part category</label><select id="ep4" class="select" onchange="refreshEditBranchOptions()">${db.categories.map(x=>`<option value="${esc(x.name)}" ${x.name===p.category?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div class="formGroup"><label>Branch parts <span class="optional">(select one or more)</span></label><div id="ep11" class="branchPicker"></div><small class="helpText">The same product image is shared across selected branches.</small></div><div class="row"><div class="formGroup"><label>Availability</label><select id="ep7" class="select"><option ${p.availability==='In Stock'?'selected':''}>In Stock</option><option ${p.availability==='Available on enquiry'?'selected':''}>Available on enquiry</option><option ${p.availability==='Out of Stock'?'selected':''}>Out of Stock</option></select></div></div><div class="formGroup"><label>Product name</label><input id="ep5" class="input" value="${esc(p.name)}"></div><div class="row"><div class="formGroup"><label>Part/OEM number <span class="optional">(optional)</span></label><input id="ep6" class="input" value="${esc(p.partNo||'')}"></div><div class="formGroup"><label>Price <span class="optional">(optional)</span></label><input id="ep10" type="text" inputmode="decimal" class="input moneyInput" value="${p.price!=null&&p.price!==''?esc(Number(p.price).toLocaleString()):''}" oninput="formatMoneyInput(this)"></div></div><div class="formGroup"><label>Replace image <span class="optional">(optional)</span></label><input id="ep9" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\'ep9\')"></div><div class="formGroup"><label>Description <span class="optional">(optional)</span></label><textarea id="ep8" class="textarea" rows="3">${esc(p.description||'')}</textarea></div><button class="primary" onclick="saveProductEdit('${p.id}')">SAVE CHANGES</button>`);setTimeout(()=>refreshEditBranchOptions(productBranchIds(p)),0)}
function yearChecksForEdit(p){const ys=modelYears(p.modelId);const selected=new Set(productYears(p));return ys.map(y=>`<label class="yearCheck"><input type="checkbox" name="editProductYearPick" value="${esc(y)}" ${selected.has(String(y))?'checked':''}><span>${esc(y)}</span></label>`).join('')||'<div class="empty pickerEmpty">Add years to this model first.</div>'}
function toggleEditYears(on){document.querySelectorAll('input[name="editProductYearPick"]').forEach(x=>x.checked=on)}
async function saveProductEdit(id){const p=db.parts.find(x=>x.id===id);if(!p)return;const selected=[...document.querySelectorAll('input[name="editProductYearPick"]:checked')].map(x=>Number(x.value));if(!selected.length)return toast('Select at least one compatible year');const name=document.querySelector('#ep5').value.trim();if(!name)return toast('Enter a product name');try{const cat=db.categories.find(c=>c.name===document.querySelector('#ep4').value);if(!cat)return toast('Select a valid category');const f=editedImage('ep9');let image=p.image||'';if(f)image=await uploadImage(f,'product-images','products');for(const y of selected){if(!db.years.some(x=>x.modelId===p.modelId&&Number(x.year)===y)){const {data,error}=await supabaseClient.from('model_years').insert({model_id:p.modelId,year:y}).select().single();if(error&&error.code!=='23505')throw error;if(data)db.years.push({id:data.id,modelId:p.modelId,year:String(y)})}}const {error}=await supabaseClient.from('products').update({category_id:cat.id,name,part_no:document.querySelector('#ep6').value.trim()||null,availability:document.querySelector('#ep7').value,description:document.querySelector('#ep8').value.trim()||null,image_url:image||null,branch_id:[...document.querySelectorAll('input[name="ep11Pick"]:checked')].map(x=>x.value)[0]||null,price:parseMoney(document.querySelector('#ep10').value)}).eq('id',id);if(error)throw error;const {error:delErr}=await supabaseClient.from('product_years').delete().eq('product_id',id);if(delErr)throw delErr;const yrows=db.years.filter(y=>y.modelId===p.modelId&&selected.includes(Number(y.year))).map(y=>({product_id:id,model_year_id:y.id}));const {error:insErr}=await supabaseClient.from('product_years').insert(yrows);if(insErr)throw insErr;p.years=selected.map(String);p.year=String(selected[0]);p.category=cat.name;p.categoryId=cat.id;const editBranchIds=[...document.querySelectorAll('input[name="ep11Pick"]:checked')].map(x=>x.value);await supabaseClient.from('product_branches').delete().eq('product_id',id);const editBranchImages={};if(editBranchIds.length){const mirror=document.querySelector('#ep12')?.checked;const pbRows=[];for(const branch_id of editBranchIds){let variant=image||null;const br=branchById(branch_id);if(mirror&&br?.name?.toLowerCase().includes('right')&&f){variant=await uploadImage(await mirrorImage(f),'product-images','branch-variants')}editBranchImages[branch_id]=variant||'';pbRows.push({product_id:id,branch_id,image_url:variant})}const {error:pbErr}=await supabaseClient.from('product_branches').insert(pbRows);if(pbErr)throw pbErr}p.branchId=editBranchIds[0]||'';p.branchIds=editBranchIds;p.branchImages=editBranchImages;p.availability=document.querySelector('#ep7').value;p.name=name;p.partNo=document.querySelector('#ep6').value.trim();p.description=document.querySelector('#ep8').value.trim();p.image=image;p.price=parseMoney(document.querySelector('#ep10').value);cacheDb();closeModal();adminPanel('products');toast('Product updated')}catch(e){console.error(e);toast(e.message||'Could not update product')}}
function autoHeroSettingsMarkup(){
 const slides=Array.isArray(db.settings?.heroSlides)?db.settings.heroSlides:[];
 const gallery=slides.length?'<div class="tyreAdminImageGallery">'+slides.map((x,i)=>'<button type="button" class="tyrePromoImageButton" onclick="toggleAutoHeroText('+i+')"><img src="'+esc(x.image||'')+'" alt="Hero image '+(i+1)+'"><span>IMAGE '+(i+1)+'</span><b>EDIT TEXT</b></button>').join('')+'</div>':'<div class="tyreAdminPreview emptyPreview">No images uploaded</div>';
 const editors=slides.map((x,i)=>'<div class="tyrePromoTextCard" data-promo-index="'+i+'"><div id="autoHeroTextForm'+i+'" class="tyrePromoTextForm" hidden><div class="tyreAdminSubHead"><span>Image '+(i+1)+' text</span><small>Edit the text shown while this image is displayed.</small></div><div class="tyrePromoTextFields"><div class="formGroup"><label>Heading</label><div class="tyrePromoTextControl"><input id="autoHeroBlack'+i+'" class="input" value="'+esc(x.black||'')+'"><input id="autoHeroTitleColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.titleColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Highlight</label><div class="tyrePromoTextControl"><input id="autoHeroRed'+i+'" class="input" value="'+esc(x.red||'')+'"><input id="autoHeroHighlightColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.highlightColor||'#d71920')+'"></div></div><div class="formGroup"><label>Description</label><div class="tyrePromoTextControl"><textarea id="autoHeroDesc'+i+'" class="input" rows="2">'+esc(x.description||'')+'</textarea><input id="autoHeroDescColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.descColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Button text</label><div class="tyrePromoTextControl"><input id="autoHeroButton'+i+'" class="input" value="'+esc(x.button||'')+'"><input id="autoHeroButtonColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.buttonColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Text alignment</label><select id="autoHeroAlign'+i+'" class="select"><option value="left" '+(x.align==='left'?'selected':'')+'>Left</option><option value="center" '+(x.align==='center'?'selected':'')+'>Center</option><option value="right" '+(x.align==='right'?'selected':'')+'>Right</option></select><small class="helpText">Aligns all text in this section together.</small></div></div></div></div>').join('');
 return '<hr class="adminDivider"><h3>Homepage hero</h3><p class="muted">Each hero image has its own text, colors and alignment. Text changes automatically with the image.</p><div class="formGroup"><label>Hero slideshow images</label><input id="heroFiles" type="file" accept="image/*" class="input" multiple onchange="previewAutoHeroUploads(this)"><small class="helpText">Select multiple images. Click an image to edit its text, colors and alignment exactly like the Tyre Promo editor.</small><div id="autoHeroImageGallery">'+gallery+'</div></div><div id="autoHeroTextEditors" class="tyrePromoTextEditors">'+editors+'</div>';
}
function renderAutoHeroEditors(slides){
 const gallery=document.querySelector('#autoHeroImageGallery'),editor=document.querySelector('#autoHeroTextEditors');if(!gallery||!editor)return;
 const list=Array.isArray(slides)?slides:[];
 gallery.innerHTML=list.length?'<div class="tyreAdminImageGallery">'+list.map((x,i)=>'<button type="button" class="tyrePromoImageButton" onclick="toggleAutoHeroText('+i+')"><img src="'+esc(x.image||'')+'" alt="Hero image '+(i+1)+'"><span>'+(i<((db.settings?.heroSlides||[]).length)?'IMAGE ':'NEW IMAGE ')+(i+1)+'</span><b>EDIT TEXT</b></button>').join('')+'</div>':'<div class="tyreAdminPreview emptyPreview">No images uploaded</div>';
 editor.innerHTML=list.map((x,i)=>'<div class="tyrePromoTextCard" data-promo-index="'+i+'"><div id="autoHeroTextForm'+i+'" class="tyrePromoTextForm" hidden><div class="tyreAdminSubHead"><span>'+(i<((db.settings?.heroSlides||[]).length)?'Image ':'New image ')+(i+1)+' text</span><small>Edit the text shown while this image is displayed.</small></div><div class="tyrePromoTextFields"><div class="formGroup"><label>Heading</label><div class="tyrePromoTextControl"><input id="autoHeroBlack'+i+'" class="input" value="'+esc(x.black||'')+'"><input id="autoHeroTitleColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.titleColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Highlight</label><div class="tyrePromoTextControl"><input id="autoHeroRed'+i+'" class="input" value="'+esc(x.red||'')+'"><input id="autoHeroHighlightColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.highlightColor||'#d71920')+'"></div></div><div class="formGroup"><label>Description</label><div class="tyrePromoTextControl"><textarea id="autoHeroDesc'+i+'" class="input" rows="2">'+esc(x.description||'')+'</textarea><input id="autoHeroDescColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.descColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Button text</label><div class="tyrePromoTextControl"><input id="autoHeroButton'+i+'" class="input" value="'+esc(x.button||'')+'"><input id="autoHeroButtonColor'+i+'" type="color" class="tyrePromoColor" value="'+esc(x.buttonColor||'#ffffff')+'"></div></div><div class="formGroup"><label>Text alignment</label><select id="autoHeroAlign'+i+'" class="select"><option value="left" '+(x.align==='left'?'selected':'')+'>Left</option><option value="center" '+(x.align==='center'?'selected':'')+'>Center</option><option value="right" '+(x.align==='right'?'selected':'')+'>Right</option></select><small class="helpText">Aligns all text in this section together.</small></div></div></div></div>').join('');
}
function toggleAutoHeroText(index){const form=document.querySelector('#autoHeroTextForm'+index);if(form)form.hidden=!form.hidden;}
function previewAutoHeroUploads(input){
 const files=[...(input?.files||[])].filter(f=>f.type.startsWith('image/'));
 if(files.length!==((input?.files||[]).length))toast('Please select image files only');
 const saved=Array.isArray(db.settings?.heroSlides)?db.settings.heroSlides:[];
 const urls=files.map(f=>URL.createObjectURL(f));
 const all=[...saved,...urls.map(image=>({image,black:db.settings.heroBlack||'FIND THE RIGHT',red:db.settings.heroRed||'PARTS FOR YOUR CAR',description:db.settings.heroDescription||'High quality parts for all makes and models.',align:'left',titleColor:'#ffffff',highlightColor:'#d71920',descColor:'#ffffff',button:'',buttonColor:'#ffffff'}))];
 renderAutoHeroEditors(all);
}
function settingsAdmin(c){c.innerHTML=`<h2>Business & homepage settings</h2><p class="muted">Control the logo, contact details and homepage hero text/image.</p><div class="formGroup"><label>Logo</label><input id="logoFile" type="file" accept="image/png,image/jpeg,image/webp" class="input" onchange="prepareImageSelection(event,'logoFile')"><small class="helpText">Recommended: transparent PNG.</small></div><div class="row"><div class="formGroup"><label>Business name</label><input id="sname" class="input" value="${esc(db.settings.businessName)}"></div><div class="formGroup"><label>Tagline</label><input id="stag" class="input" value="${esc(db.settings.tagline)}"></div></div><div class="row"><div class="formGroup"><label>Phone</label><input id="sphone" class="input" value="${esc(db.settings.phone)}"></div><div class="formGroup"><label>WhatsApp number</label><input id="swa" class="input" value="${esc(db.settings.whatsapp)}"><small class="helpText">Used for product enquiries. Keep this separate from the additional contact numbers.</small></div></div><div class="adminContactBox"><h3>Additional Contact Numbers</h3><p class="muted">Optional display-only numbers. Leave either field empty and it will not appear on the website. These numbers are never used for WhatsApp enquiries.</p><div class="row"><div class="formGroup"><label>Additional contact phone 1 <span class="optional">(optional)</span></label><input id="sphone2" class="input" value="${esc(db.settings.phone2||'')}" placeholder="Leave blank if not needed"></div><div class="formGroup"><label>Additional contact phone 2 <span class="optional">(optional)</span></label><input id="sphone3" class="input" value="${esc(db.settings.phone3||'')}" placeholder="Leave blank if not needed"></div></div></div><div class="adminContactBox adminMediaBox"><h3>Other Media & Social Links</h3><p class="muted">All fields are optional. Leave any field empty and its circular logo will not appear. When saved, the logo appears in the footer Contact & Support section below the phone numbers. Clicking a logo opens the saved page in a new tab.</p><div class="row"><div class="formGroup"><label>Instagram <span class="optional">(optional)</span></label><input id="sinstagram" class="input" value="${esc(db.settings.instagram||'')}" placeholder="https://instagram.com/yourpage"></div><div class="formGroup"><label>Telegram <span class="optional">(optional)</span></label><input id="stelegram" class="input" value="${esc(db.settings.telegram||'')}" placeholder="https://t.me/yourpage"></div></div><div class="row"><div class="formGroup"><label>Facebook <span class="optional">(optional)</span></label><input id="sfacebook" class="input" value="${esc(db.settings.facebook||'')}" placeholder="https://facebook.com/yourpage"></div><div class="formGroup"><label>TikTok <span class="optional">(optional)</span></label><input id="stiktok" class="input" value="${esc(db.settings.tiktok||'')}" placeholder="https://tiktok.com/@yourpage"></div></div><div class="row"><div class="formGroup"><label>YouTube <span class="optional">(optional)</span></label><input id="syoutube" class="input" value="${esc(db.settings.youtube||'')}" placeholder="https://youtube.com/@yourpage"></div><div class="formGroup"><label>X <span class="optional">(optional)</span></label><input id="sx" class="input" value="${esc(db.settings.x||'')}" placeholder="https://x.com/yourpage"></div></div></div><div class="row"><div class="formGroup"><label>Email</label><input id="semail" class="input" value="${esc(db.settings.email)}"></div><div class="formGroup"><label>Address</label><input id="saddr" class="input" value="${esc(db.settings.address)}"></div></div><hr class="adminDivider"><h3>About Us page</h3><p class="muted">Edit the public About Us page. All text is optional.</p><div class="formGroup"><label>About Us title</label><input id="aboutTitle" class="input" value="${esc(db.settings.aboutTitle||'')}" placeholder="About Our Business"></div><div class="formGroup"><label>About Us content</label><textarea id="aboutText" class="textarea" rows="7" placeholder="Write your business story, services, mission, etc.">${esc(db.settings.aboutText||'')}</textarea></div>${autoHeroSettingsMarkup()}<hr class="adminDivider"><h3>Auto Parts Promo Box</h3><p class="muted">Control the promo box shown on the tyre homepage.</p><div class="row"><div class="formGroup"><label>Promo eyebrow</label><input id="promoEyebrow" class="input" value="${esc(db.settings.promoEyebrow)}"></div><div class="formGroup"><label>Promo button text</label><input id="promoButton" class="input" value="${esc(db.settings.promoButton)}"></div></div><div class="formGroup"><label>Promo headline</label><input id="promoTitle" class="input" value="${esc(db.settings.promoTitle)}"></div><div class="formGroup"><label>Promo description</label><textarea id="promoDescription" class="textarea" rows="3">${esc(db.settings.promoDescription)}</textarea></div><div class="formGroup"><label>Promo background image</label><input id="promoBackgroundFile" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'promoBackgroundFile')"><small class="helpText">Upload an image to use as the background of the Auto Parts promo box.</small></div><button class="primary" onclick="saveSettings()">SAVE SETTINGS</button>`}
async function saveSettings(){try{
 const lf=editedImage('logoFile'),pf=editedImage('promoBackgroundFile');
 const heroFiles=[...(document.querySelector('#heroFiles')?.files||[])];
 const existingHeroSlides=Array.isArray(db.settings?.heroSlides)?db.settings.heroSlides:[];

 let logoUrl=db.settings.logo||null,promoBackgroundUrl=db.settings.promoBackground||null;

 if(lf)logoUrl=await uploadImage(lf,'logos','settings');
 if(pf)promoBackgroundUrl=await uploadImage(pf,'promo-background','settings');

 const newHeroUrls=[];
 for(const file of heroFiles){
   if(!file.type.startsWith('image/'))throw new Error('Please select image files only');
   newHeroUrls.push(await uploadImage(file,'hero','settings'));
 }
 const heroSlides=[];
 const totalHeroSlides=existingHeroSlides.length+newHeroUrls.length;
 for(let i=0;i<totalHeroSlides;i++){
   const old=existingHeroSlides[i]||{};const image=i<existingHeroSlides.length?old.image:newHeroUrls[i-existingHeroSlides.length];
   heroSlides.push({image,black:document.querySelector('#autoHeroBlack'+i)?.value.trim()||old.black||db.settings.heroBlack||defaults.settings.heroBlack,red:document.querySelector('#autoHeroRed'+i)?.value.trim()||old.red||db.settings.heroRed||defaults.settings.heroRed,description:document.querySelector('#autoHeroDesc'+i)?.value.trim()||old.description||db.settings.heroDescription||defaults.settings.heroDescription,button:document.querySelector('#autoHeroButton'+i)?.value.trim()||old.button||'',align:document.querySelector('#autoHeroAlign'+i)?.value||old.align||'left',titleColor:document.querySelector('#autoHeroTitleColor'+i)?.value||old.titleColor||'#ffffff',highlightColor:document.querySelector('#autoHeroHighlightColor'+i)?.value||old.highlightColor||'#d71920',descColor:document.querySelector('#autoHeroDescColor'+i)?.value||old.descColor||'#ffffff',buttonColor:document.querySelector('#autoHeroButtonColor'+i)?.value||old.buttonColor||'#ffffff'});
 }
 const heroImages=heroSlides.map(x=>x.image).filter(Boolean);const heroUrl=heroImages[0]||null;

 const payload={
  id:true,
  business_name:document.querySelector('#sname').value.trim(),
  tagline:document.querySelector('#stag').value.trim(),
  logo_url:logoUrl,
  phone:document.querySelector('#sphone').value.trim(),
  phone2:document.querySelector('#sphone2').value.trim(),
  phone3:document.querySelector('#sphone3').value.trim(),
  instagram_url:document.querySelector('#sinstagram').value.trim(),
  telegram_url:document.querySelector('#stelegram').value.trim(),
  facebook_url:document.querySelector('#sfacebook').value.trim(),
  tiktok_url:document.querySelector('#stiktok').value.trim(),
  youtube_url:document.querySelector('#syoutube').value.trim(),
  x_url:document.querySelector('#sx').value.trim(),
  about_title:document.querySelector('#aboutTitle').value.trim(),
  about_content:document.querySelector('#aboutText').value.trim(),
  whatsapp:document.querySelector('#swa').value.replace(/\D/g,''),
  email:document.querySelector('#semail').value.trim(),
  address:document.querySelector('#saddr').value.trim(),
  hero_black:heroSlides[0]?.black||'',
  hero_red:heroSlides[0]?.red||'',
  hero_description:heroSlides[0]?.description||'',
  hero_image_url:heroSlides.length?JSON.stringify(heroSlides):null,
  promo_eyebrow:document.querySelector('#promoEyebrow').value.trim(),
  promo_title:document.querySelector('#promoTitle').value.trim(),
  promo_description:document.querySelector('#promoDescription').value.trim(),
  promo_button:document.querySelector('#promoButton').value.trim(),
  promo_background_url:promoBackgroundUrl
 };

 const {data,error}=await supabaseClient.from('site_settings').upsert(payload,{onConflict:'id'}).select().single();
 if(error)throw error;

 const hv=data.hero_image_url||'';
 let parsedHeroSlides=[];
 try{
   const a=JSON.parse(hv);
   parsedHeroSlides=Array.isArray(a)?a.map((x,i)=>typeof x==='string'?{image:x,black:data.hero_black||defaults.settings.heroBlack,red:data.hero_red||defaults.settings.heroRed,description:data.hero_description||defaults.settings.heroDescription,align:'left'}:{...x,image:x.image||'',black:x.black??data.hero_black??defaults.settings.heroBlack,red:x.red??data.hero_red??defaults.settings.heroRed,description:x.description??data.hero_description??defaults.settings.heroDescription,align:x.align||'left'}).filter(x=>x.image):(hv?[{image:hv,black:data.hero_black||defaults.settings.heroBlack,red:data.hero_red||defaults.settings.heroRed,description:data.hero_description||defaults.settings.heroDescription,align:'left'}]:[]);
 }catch{
   parsedHeroSlides=hv?[{image:hv,black:data.hero_black||defaults.settings.heroBlack,red:data.hero_red||defaults.settings.heroRed,description:data.hero_description||defaults.settings.heroDescription,align:'left'}]:[];
 }
 const parsedHeroImages=parsedHeroSlides.map(x=>x.image);
 db.settings={
  ...db.settings,
  businessName:data.business_name||'',
  tagline:data.tagline||'',
  logo:data.logo_url||'',
  phone:data.phone||'',
  phone2:data.phone2||'',
  phone3:data.phone3||'',
  instagram:data.instagram_url||'',
  telegram:data.telegram_url||'',
  facebook:data.facebook_url||'',
  tiktok:data.tiktok_url||'',
  youtube:data.youtube_url||'',
  x:data.x_url||'',
  aboutTitle:data.about_title||'',
  aboutContent:data.about_content||'',
  whatsapp:data.whatsapp||'',
  email:data.email||'',
  address:data.address||'',
  heroBlack:data.hero_black||'',
  heroRed:data.hero_red||'',
  heroDescription:data.hero_description||'',
  heroImage:parsedHeroImages[0]||'',
  heroImages:parsedHeroImages,
  heroSlides:parsedHeroSlides,
  promoEyebrow:data.promo_eyebrow||'',
  promoTitle:data.promo_title||'',
  promoDescription:data.promo_description||'',
  promoButton:data.promo_button||'',
  promoBackground:data.promo_background_url||''
 };

 cacheDb();
 toast('Settings saved');
 setTimeout(()=>adminPanel('settings'),400);
}catch(e){console.error(e);toast(e.message||'Failed to save settings','error')}
}
function backupAdmin(c){c.innerHTML=`<div class="adminHead"><div><h2>Backup & Restore</h2><p class="muted">Create a complete online snapshot before making major catalog changes. Restoring uses a safe merge/upsert and does not delete existing records.</p></div><button class="ghost" onclick="backupAdmin(document.querySelector('#adminContent'))">REFRESH</button></div><div class="backupCards"><div class="backupCard"><span class="eyebrow">ONLINE BACKUP</span><h3>Full database snapshot</h3><p>Includes brands, models, years, categories, branches, products, relationships, settings and enquiry records when available.</p><button class="primary" onclick="downloadFullBackup()">DOWNLOAD FULL BACKUP</button></div><div class="backupCard"><span class="eyebrow">RESTORE</span><h3>Restore a backup</h3><p>Upload a JSON backup to merge its catalog data into the current online database. Existing records with the same IDs are updated.</p><label class="primary fileBtn">SELECT BACKUP<input id="restoreBackupFile" type="file" accept="application/json" hidden onchange="restoreFullBackup(event)"></label></div></div><hr class="adminDivider"><div class="adminHead"><div><h3 style="margin:0;font-family:'Montserrat',sans-serif;font-size:16px">Legacy migration</h3><p class="muted">Use these only for older local catalog JSON files from before the online database.</p></div></div><button class="ghost" onclick="downloadBackup()">EXPORT CURRENT LOCAL CACHE</button> <label class="ghost fileBtn">IMPORT LEGACY JSON<input type="file" accept="application/json" hidden onchange="importBackup(event)"></label> <button class="ghost" onclick="migrateLocalCatalog()">MIGRATE CURRENT LOCAL CATALOG</button><div class="adminTip"><strong>Safe restore</strong><span>Images remain stored in Supabase Storage. The backup preserves their public URLs; it does not duplicate image files.</span></div><div id="backupStatus" class="backupStatus"></div>`}
function prepareImageSelection(event,inputId){
 const input=event.target, file=input.files?.[0]; if(!file)return;
 if(!file.type.startsWith('image/'))return toast('Please select an image');
 delete __editedImages[inputId];
 const parent=input.parentElement;
 let box=parent.querySelector('.imageChoice');
 if(!box){box=document.createElement('div');box.className='imageChoice';parent.appendChild(box)}
 const url=URL.createObjectURL(file);
 box.innerHTML=`<div class="imageChoicePreview"><img src="${url}" alt="Selected image"></div><div class="imageChoiceActions"><button type="button" class="primary" onclick="useOriginalImage('${inputId}')">CONTINUE</button><button type="button" class="ghost" onclick="openImageEditorByInput('${inputId}')">EDIT</button></div>`;
}
function openImageEditorByInput(inputId){const input=document.querySelector('#'+inputId),file=input?.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>showImageEditor(img,inputId,file.name,file.type);img.src=reader.result};reader.readAsDataURL(file)}
function useOriginalImage(inputId){delete __editedImages[inputId];toast('Original image will be uploaded when you save');}

function brandEditForm(id){
  const b=db.brands.find(x=>x.id===id);
  if(!b)return;

  const type=b.isEv&&b.isRegular?"both":b.isEv?"ev":"regular";

  modal(`
    <h2>Edit brand</h2>
    <div class="formGroup">
      <label>Brand name</label>
      <input id="eb1" class="input" value="${esc(b.name)}">
    </div>
    <div class="formGroup">
      <label>Brand type</label>
      <select id="eb3" class="select">
        <option value="regular" ${type==="regular"?"selected":""}>Car Brand</option>
        <option value="ev" ${type==="ev"?"selected":""}>EV Brand</option>
        <option value="both" ${type==="both"?"selected":""}>Both Car & EV</option>
      </select>
    </div>
    <div class="formGroup">
      <label>Replace brand logo/photo <span class="optional">(optional)</span></label>
      <input id="eb2" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,\"eb2\")">
    </div>
    <button class="primary" onclick="saveBrandEdit('${id}')">SAVE CHANGES</button>
  `);
}

async function saveBrandEdit(id){
  const b=db.brands.find(x=>x.id===id);
  if(!b)return;

  const name=document.querySelector("#eb1")?.value.trim();
  const type=document.querySelector("#eb3")?.value;

  if(!name)return toast("Enter a brand name");

  const duplicate=db.brands.some(x=>x.id!==id&&String(x.name||"").trim().toLowerCase()===name.toLowerCase());
  if(duplicate)return toast("A brand with this name already exists");

  const isEv=type==="ev"||type==="both";
  const isRegular=type==="regular"||type==="both";

  try{
    const f=editedImage("eb2");
    let image=b.image||"";

    if(f)image=await uploadImage(f,"brand-images","brands");

    const {data,error}=await supabaseClient.from("brands").update({
      name,
      image_url:image||null,
      is_ev:isEv,
      is_regular:isRegular
    }).eq("id",id).select().single();

    if(error)throw error;

    b.name=data.name;
    b.image=data.image_url||"";
    b.isEv=data.is_ev===true;
    b.isRegular=data.is_regular!==false;

    cacheDb();
    closeModal();
    adminPanel("brands");
    toast("Brand updated");
  }catch(e){
    console.error(e);
    toast("ERROR: "+(e.message||"Could not update brand"));
  }
}

function brandForm(){
 modal(`
  <h2>Add brand</h2>

  <div class="formGroup">
   <label>Brand name</label>
   <input id="f1" class="input" placeholder="e.g. Toyota">
  </div>

  <div class="formGroup">
   <label>Brand type</label>

   <select id="f3" class="select">
    <option value="regular">Car Brand</option>
    <option value="ev">EV Brand</option>
    <option value="both">Both Car & EV</option>
   </select>

   <small class="helpText">
    Choose "Both Car & EV" when this brand should appear in both sections.
   </small>
  </div>

  <div class="formGroup">
   <label>Brand logo/photo</label>
   <input id="f2" type="file" accept="image/*" class="input"
    onchange="prepareImageSelection(event,'f2')">
  </div>

  <button class="primary" onclick="addBrand()">SAVE BRAND</button>
 `)
}
async function addBrand(){
 const name=document.querySelector('#f1').value.trim();
 const type=document.querySelector('#f3').value;

 if(!name)return toast('Enter a brand name');

 const isEv=type==='ev'||type==='both';
 const isRegular=type==='regular'||type==='both';

 try{
  const f=editedImage('f2');
  const image=f?await uploadImage(f,'brand-images','brands'):'';

  const nextOrder=db.brands.reduce(
   (m,b)=>Math.max(m,Number(b.sortOrder??0)),
   -1
  )+1;

  const {data,error}=await supabaseClient.from('brands').insert({
   name,
   image_url:image||null,
   is_ev:isEv,
   is_regular:isRegular,
   sort_order:nextOrder,
   active:true
  }).select().single();

  if(error)throw error;

  db.brands.push({
   id:data.id,
   name:data.name,
   image:data.image_url||'',
   isEv:data.is_ev===true,
   isRegular:data.is_regular!==false,
   sortOrder:data.sort_order??nextOrder,
   createdAt:data.created_at||new Date().toISOString()
  });

  db.brands.sort((a,b)=>
   Number(a.sortOrder??0)-Number(b.sortOrder??0)||
   String(a.createdAt||'').localeCompare(String(b.createdAt||''))
  );

  cacheDb();
  closeModal();
  adminPanel('brands');
  toast('Brand saved');
 }catch(e){
  console.error(e);
  toast(e.message||'Could not save brand');
 }
}
function modelForm(){modal(`<h2>Add model</h2><div class="formGroup"><label>Brand</label><select id="m1" class="select" onchange="updateModelTypeField()">${db.brands.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></div><div id="modelTypeWrap" class="formGroup" style="display:none"><label>Model type</label><select id="mType" class="select"><option value="regular">Car</option><option value="ev">EV</option></select></div><div class="formGroup"><label>Model</label><input id="m2" class="input" placeholder="e.g. Corolla"></div><div class="formGroup"><label>Model image</label><input id="m3" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'m3')"><small class="helpText">This image is shown at the top after the customer chooses the model.</small></div><button class="primary" onclick="addModel()">SAVE</button>`);updateModelTypeField()}

function updateModelTypeField(){const brand=db.brands.find(b=>b.id===document.querySelector('#m1')?.value);const wrap=document.querySelector('#modelTypeWrap');const type=document.querySelector('#mType');if(!brand||!wrap)return;const both=brand.isEv===true&&brand.isRegular!==false;wrap.style.display=both?'':'none';if(!both&&type)type.value=brand.isEv===true?'ev':'regular'}

async function addModel(){const name=document.querySelector('#m2').value.trim(),brandId=document.querySelector('#m1').value,brand=db.brands.find(b=>b.id===brandId),type=document.querySelector('#mType')?.value;const isEv=brand?.isEv===true&&brand?.isRegular===false?true:brand?.isEv===true&&brand?.isRegular!==false?(type==='ev'):false;if(!name||!brandId)return toast('Enter a model and select a brand');try{const f=editedImage('m3');const image=f?await uploadImage(f,'model-images','models'):'';const {data,error}=await supabaseClient.from('models').insert({brand_id:brandId,name,image_url:image||null,is_ev:isEv,sort_order:0,active:true}).select().single();if(error)throw error;db.models.push({id:data.id,brandId,name,image:data.image_url||'',isEv});cacheDb();closeModal();adminPanel('models');toast('Model saved')}catch(e){console.error(e);toast(e.message||'Could not save model')}}
function productForm(){
 const firstBrand=db.brands[0]?.id||'',firstModel=db.models.find(m=>m.brandId===firstBrand)?.id||'';
 modal(`<h2>Add product</h2><p class="muted">Upload one product image and select every year this same product fits. The image is stored once and reused across all selected years.</p><div class="row"><div class="formGroup"><label>Brand</label><select id="p1" class="select" onchange="refreshModelOptions()">${db.brands.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></div><div class="formGroup"><label>Model</label><select id="p2" class="select" onchange="refreshProductYearOptions()">${modelOptions(firstBrand)}</select></div></div><div class="formGroup"><label>Compatible years <span class="optional">(select all that apply)</span></label><div id="productYearPicker" class="yearPicker compactYearPicker">${yearChecks(firstModel)}</div><div class="pickerActions"><button type="button" class="ghost" onclick="toggleProductYears(true)">SELECT ALL</button><button type="button" class="ghost" onclick="toggleProductYears(false)">CLEAR</button></div></div><div class="formGroup"><label>Part category</label><select id="p4" class="select" onchange="refreshProductBranchOptions()">${db.categories.map(x=>`<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('')}</select></div><div class="formGroup"><label>Branch parts <span class="optional">(select one or more)</span></label><div id="p11" class="branchPicker"></div><small class="helpText">The same uploaded product image will be used for every selected branch.</small></div><div class="row"><div class="formGroup"><label>Availability</label><select id="p7" class="select"><option>In Stock</option><option>Available on enquiry</option><option>Out of Stock</option></select></div></div><div class="formGroup"><label>Product name</label><input id="p5" class="input" placeholder="Corolla Headlight Left"></div><div class="row"><div class="formGroup"><label>Part/OEM number <span class="optional">(optional)</span></label><input id="p6" class="input" placeholder="Leave blank if unknown"></div><div class="formGroup"><label>Price <span class="optional">(optional)</span></label><input id="p10" type="text" inputmode="decimal" class="input moneyInput" placeholder="e.g. 30,000" oninput="formatMoneyInput(this)"></div></div><div class="formGroup"><label>Product photo <span class="optional">(upload once)</span></label><input id="p9" type="file" accept="image/*" class="input" onchange="prepareImageSelection(event,'p9')"></div><div class="formGroup"><label>Description <span class="optional">(optional)</span></label><textarea id="p8" class="textarea" rows="3" placeholder="Short fitment or product details"></textarea></div><button class="primary" onclick="addProduct()">SAVE PRODUCT</button>`);setTimeout(refreshProductBranchOptions,0);
}
function modelOptions(bid){return db.models.filter(m=>m.brandId===bid).map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('')||'<option value="">Add a model first</option>'}
function yearOptions(mid){return modelYears(mid).map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('')||'<option value="">Add a year first</option>'}
function yearChecks(mid){const ys=modelYears(mid);return ys.map(y=>`<label class="yearCheck"><input type="checkbox" name="productYearPick" value="${esc(y)}"><span>${esc(y)}</span></label>`).join('')||'<div class="empty pickerEmpty">Add years to this model first.</div>'}
function refreshModelOptions(){const p=document.querySelector('#p2');if(p){p.innerHTML=modelOptions(document.querySelector('#p1').value);refreshProductYearOptions()}}
function refreshProductYearOptions(){const p=document.querySelector('#productYearPicker');if(p)p.innerHTML=yearChecks(document.querySelector('#p2').value)}
function renderBranchChecks(containerId,catName,selected=[]){const cat=db.categories.find(c=>c.name===catName);const el=document.querySelector('#'+containerId);if(!el)return;const set=new Set(Array.isArray(selected)?selected:[selected].filter(Boolean));const bs=cat?branchesForCategory(cat.id):[];el.innerHTML=bs.map(br=>`<label class=\"branchCheck\"><input type=\"checkbox\" name=\"${containerId}Pick\" value=\"${br.id}\" ${set.has(br.id)?'checked':''}><span>${esc(br.name)}</span></label>`).join('')||'<div class=\"empty pickerEmpty\">Add branches to this category first.</div>'}
function refreshProductBranchOptions(){renderBranchChecks('p11',document.querySelector('#p4')?.value,[])}
function refreshEditBranchOptions(selected=[]){renderBranchChecks('ep11',document.querySelector('#ep4')?.value,selected)}
function toggleProductYears(on){document.querySelectorAll('input[name="productYearPick"]').forEach(x=>x.checked=on)}
function selectedProductYears(){return [...document.querySelectorAll('#productYearPicker input[name="productYearPick"]')].filter(x=>x.checked).map(x=>Number(x.value)).filter(Number.isFinite)}
function addProductValidation(){const model=document.querySelector('#p2'),category=document.querySelector('#p4'),name=document.querySelector('#p5'),years=selectedProductYears();if(!model?.value)return'Please select a model';if(!years.length)return'Please select at least one compatible year';if(!category?.value)return'Please select a part category';if(!name?.value.trim())return'Please enter a product name';return''}
async function addProduct(){const name=document.querySelector('#p5').value.trim(),mid=document.querySelector('#p2').value,selected=selectedProductYears(),category=document.querySelector('#p4').value,branchIds=[...document.querySelectorAll('input[name="p11Pick"]:checked')].map(x=>x.value);const validationError=addProductValidation();if(validationError)return toast(validationError);try{const cat=db.categories.find(c=>c.name===category);if(!cat)return toast('Select a valid category');const f=editedImage('p9');const image=f?await uploadImage(f,'product-images','products'):'';for(const y of selected){if(!db.years.some(x=>x.modelId===mid&&Number(x.year)===y)){const {data,error}=await supabaseClient.from('model_years').insert({model_id:mid,year:y}).select().single();if(error&&error.code!=='23505')throw error;if(data)db.years.push({id:data.id,modelId:mid,year:String(y)})}}const yearRows=db.years.filter(y=>y.modelId===mid&&selected.includes(Number(y.year)));const {data,error}=await supabaseClient.from('products').insert({model_id:mid,category_id:cat.id,name,part_no:document.querySelector('#p6').value.trim()||null,availability:document.querySelector('#p7').value,description:document.querySelector('#p8').value.trim()||null,image_url:image||null,branch_id:branchIds[0]||null,price:parseMoney(document.querySelector('#p10').value),active:true}).select().single();if(error)throw error;const rows=[...new Map(yearRows.map(y=>[y.year,{product_id:data.id,model_year_id:y.id}])).values()];if(rows.length){const {error:pyErr}=await supabaseClient.from('product_years').insert(rows);if(pyErr)throw pyErr}if(branchIds.length){const mirror=document.querySelector('#p12')?.checked;const pbRows=[];for(const branch_id of branchIds){let variant=image||null;const br=branchById(branch_id);if(mirror&&br?.name?.toLowerCase().includes('right')&&f){variant=await uploadImage(await mirrorImage(f),'product-images','branch-variants')}pbRows.push({product_id:data.id,branch_id,image_url:variant})}const {error:pbErr}=await supabaseClient.from('product_branches').insert(pbRows);if(pbErr)throw pbErr}db.parts.push({id:data.id,modelId:mid,years:selected.map(String),year:String(selected[0]),category,name,categoryId:cat.id,branchId:branchIds[0]||'',branchIds,branchImages:Object.fromEntries(branchIds.map(id=>[id,image||''])),partNo:document.querySelector('#p6').value.trim(),availability:document.querySelector('#p7').value,description:document.querySelector('#p8').value.trim(),image:data.image_url||'',price:data.price??null,createdAt:data.created_at||''});cacheDb();closeModal();adminPanel('products');toast(`Product saved for ${selected.length} year${selected.length===1?'':'s'}`)}catch(e){console.error(e);toast(e.message||'Could not save product')}}
function modal(html){const d=document.createElement('div');d.className='modal';d.id='modal';d.innerHTML=`<div class="modalBox">${html}<button class="ghost" onclick="closeModal()">CANCEL</button></div>`;document.body.appendChild(d)}
function closeModal(){document.querySelector('#modal')?.remove()}
async function delBrand(id){if(!confirm('Delete brand and its models/products?'))return;try{const {error}=await supabaseClient.from('brands').delete().eq('id',id);if(error)throw error;db.brands=db.brands.filter(b=>b.id!==id);const mids=db.models.filter(m=>m.brandId===id).map(m=>m.id);db.models=db.models.filter(m=>m.brandId!==id);db.years=db.years.filter(y=>!mids.includes(y.modelId));db.parts=db.parts.filter(p=>!mids.includes(p.modelId));cacheDb();adminPanel('brands');toast('Brand deleted')}catch(e){console.error(e);toast(e.message||'Could not delete brand')}}
async function delModel(id){if(!confirm('Delete model and its years/products?'))return;try{const {error}=await supabaseClient.from('models').delete().eq('id',id);if(error)throw error;db.models=db.models.filter(m=>m.id!==id);db.years=db.years.filter(y=>y.modelId!==id);db.parts=db.parts.filter(p=>p.modelId!==id);cacheDb();adminPanel('models');toast('Model deleted')}catch(e){console.error(e);toast(e.message||'Could not delete model')}}
async function delYear(id){try{const {error}=await supabaseClient.from('model_years').delete().eq('id',id);if(error)throw error;db.years=db.years.filter(y=>y.id!==id);db.parts.forEach(p=>{p.years=productYears(p).filter(y=>db.years.some(x=>x.modelId===p.modelId&&String(x.year)===String(y)));p.year=p.years[0]||''});cacheDb();adminPanel('years');toast('Year deleted')}catch(e){console.error(e);toast(e.message||'Could not delete year')}}
async function delProduct(id){if(!confirm('Delete this product?'))return;try{const {error}=await supabaseClient.from('products').delete().eq('id',id);if(error)throw error;db.parts=db.parts.filter(p=>p.id!==id);cacheDb();adminPanel('products');toast('Product deleted')}catch(e){console.error(e);toast(e.message||'Could not delete product')}}
function downloadBackup(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'}));a.download='auto-parts-catalog-local-cache.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function fetchBackupTable(name,query){const r=await query;if(r.error)throw r.error;return r.data||[]}
async function downloadFullBackup(){
 try{
  if(!supabaseClient)throw new Error('Supabase is not connected');
  const status=document.querySelector('#backupStatus');if(status)status.innerHTML='<span>Preparing full online backup…</span>';
  const tables={site_settings:await fetchBackupTable('site_settings',supabaseClient.from('site_settings').select('*').eq('id',true)),brands:await fetchBackupTable('brands',supabaseClient.from('brands').select('*')),models:await fetchBackupTable('models',supabaseClient.from('models').select('*')),model_years:await fetchBackupTable('model_years',supabaseClient.from('model_years').select('*')),categories:await fetchBackupTable('categories',supabaseClient.from('categories').select('*')),category_branches:await fetchBackupTable('category_branches',supabaseClient.from('category_branches').select('*')),products:await fetchBackupTable('products',supabaseClient.from('products').select('*')),product_years:await fetchBackupTable('product_years',supabaseClient.from('product_years').select('*')),product_branches:await fetchBackupTable('product_branches',supabaseClient.from('product_branches').select('*'))};
  try{tables.product_enquiries=await fetchBackupTable('product_enquiries',supabaseClient.from('product_enquiries').select('*'))}catch(e){tables.product_enquiries=[];console.warn('Enquiries skipped from backup:',e)}
  const snapshot={format:'auto-parts-catalog-full-backup',version:85,created_at:new Date().toISOString(),tables};
  const blob=new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`auto-parts-catalog-full-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);if(status)status.innerHTML='<strong>Backup created successfully.</strong><span>Keep this JSON file somewhere safe.</span>';toast('Full online backup downloaded');
 }catch(e){console.error(e);const status=document.querySelector('#backupStatus');if(status)status.innerHTML=`<strong>Backup failed.</strong><span>${esc(e.message||'Could not create backup')}</span>`;toast('Could not create full backup')}
}
async function restoreFullBackup(e){
 const f=e.target.files?.[0];if(!f)return;
 try{
  const text=await f.text(),snapshot=JSON.parse(text);if(snapshot?.format!=='auto-parts-catalog-full-backup')throw new Error('This is not a V85 full backup. Use IMPORT LEGACY JSON for older files.');
  const t=snapshot.tables||{};const counts=Object.entries(t).map(([k,v])=>`${k}: ${Array.isArray(v)?v.length:0}`).join(' • ');
  if(!confirm(`Restore this backup into the current online database?\n\n${counts}\n\nThis is a merge/upsert. Existing records with matching IDs will be updated; records not in the backup will not be deleted.`))return;
  const status=document.querySelector('#backupStatus');if(status)status.innerHTML='<span>Restoring backup… Please keep this page open.</span>';
  const order=['site_settings','brands','models','model_years','categories','category_branches','products','product_years','product_branches','product_enquiries'];
  for(const name of order){const rows=Array.isArray(t[name])?t[name]:[];if(!rows.length)continue;let q=supabaseClient.from(name).upsert(rows);const r=await q;if(r.error)throw new Error(`${name}: ${r.error.message}`)}
  await loadRemoteDb();adminPanel('backup');toast('Backup restored successfully');
 }catch(err){console.error(err);const status=document.querySelector('#backupStatus');if(status)status.innerHTML=`<strong>Restore failed.</strong><span>${esc(err.message||'Could not restore backup')}</span>`;toast(err.message||'Could not restore backup')}
 finally{if(e.target)e.target.value=''}
}
async function importBackup(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=async()=>{try{const local=JSON.parse(r.result);localStorage.setItem(KEY,JSON.stringify(local));await migrateLocalCatalog()}catch{toast('Invalid backup')}};r.readAsText(f)}
function resetDemo(){toast('Demo reset is disabled in the online production version. Use the admin delete tools instead.')}
async function logout(){await supabaseClient.auth.signOut();admin=false;currentSession=null;location.href='/admin'}
async function shareProduct(id,selectedYear=''){
 const p=db.parts.find(x=>x.id===id)||window.__displayProducts?.find(x=>x.id===id)||window.__virtualProducts?.find(x=>x.id===id);if(!p)return;
 const m=db.models.find(x=>x.id===p.modelId),b=db.brands.find(x=>x.id===m?.brandId);
 const msg='Hello, I would like to enquire about '+p.name+' for '+(b?.name||'')+' '+(m?.name||'')+' — year: '+selectedYear+(p.partNo?' (Part No. '+p.partNo+')':'')+'.';
 if(!navigator.share)return toast('Your browser does not support image sharing. Use the Enquire button instead.');
 try{
  if(!p.image)return await navigator.share({title:p.name,text:msg});
  const res=await fetch(p.image); const blob=await res.blob();
  const ext=(blob.type||'image/jpeg').split('/')[1]||'jpg';
  const file=new File([blob],(p.name||'product').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.'+ext,{type:blob.type||'image/jpeg'});
  if(navigator.canShare && navigator.canShare({files:[file]})){await navigator.share({title:p.name,text:msg,files:[file]});}
  else {await navigator.share({title:p.name,text:msg});toast('This device cannot attach the image automatically.');}
 }catch(e){if(e?.name!=='AbortError')toast('Could not share the product image.');}
}
async function smartEnquiry(msg,image='',title='Auto Parts enquiry'){
 const n=String(db.settings.whatsapp||'').replace(/\D/g,'');
 const phone=String(db.settings.phone||'').replace(/[^0-9+]/g,'');
 if(!n){ if(phone) return sms(msg); return toast('Configure a phone or WhatsApp number in admin settings'); }
 // ENQUIRE goes directly to WhatsApp. Include the product image URL
 // in the message so the customer can open the exact product image.
 const enquiryText = msg;
 const ua=navigator.userAgent||'';
 const mobile=/Android|iPhone|iPad|iPod/i.test(ua);
 if(!mobile){ location.href='https://wa.me/'+n+'?text='+encodeURIComponent(enquiryText); return; }
 let opened=false;
 const onBlur=()=>{opened=true;};
 window.addEventListener('blur',onBlur,{once:true});
 location.href='whatsapp://send?phone='+n+'&text='+encodeURIComponent(enquiryText);
 setTimeout(()=>{
   window.removeEventListener('blur',onBlur);
   if(!opened){
     location.href='https://wa.me/'+n+'?text='+encodeURIComponent(enquiryText);
     if(phone) setTimeout(()=>{ if(document.visibilityState==='visible') location.href='sms:'+phone+'?body='+encodeURIComponent(enquiryText); },1800);
   }
 },900);
}
function wa(msg){const n=String(db.settings.whatsapp||'').replace(/\D/g,'');if(!n)return toast('Configure WhatsApp in admin settings');location.href='https://wa.me/'+n+'?text='+encodeURIComponent(msg)}
function sms(msg){const n=String(db.settings.phone||'').replace(/[^0-9+]/g,'');if(!n)return toast('Configure the phone number in admin settings');location.href='sms:'+n+'?body='+encodeURIComponent(msg)}
window.addEventListener('error',e=>{console.error(e.error||e.message);const app=document.querySelector('#app');if(app && !app.innerHTML.trim()){app.innerHTML='<div class=\"login\"><div class=\"loginBox\"><h2>Website could not start</h2><p class=\"muted\">Please refresh this page. If the problem continues, send a screenshot to the developer.</p></div></div>'}});
if(isAdminRoute())bootAdmin();else bootCustomer();
