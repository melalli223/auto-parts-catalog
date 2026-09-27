(function(){'use strict';

/*
 * Keep the established Find Tyre by Car landing page from app.js.
 * This file only owns the selected-vehicle route so tyre products are
 * matched through the vehicle model's assigned tyre type.
 */
const legacyTyresByCar=window.tyresByCar;

function getData(){
  try{return window.__apCatalogDb||JSON.parse(localStorage.getItem('ap_catalog_v4')||'null')||{}}
  catch(e){return{}}
}

window.tyresByCar=function(){
  const raw=(location.hash||'').replace(/^#tyres\/by-car\/?/,'');
  const parts=raw.split('/').filter(Boolean);

  // Preserve the original Find Tyre by Car landing page exactly.
  if(parts.length<2){
    if(typeof legacyTyresByCar==='function')return legacyTyresByCar();
    return;
  }

  const d=getData();
  const brandId=decodeURIComponent(parts[0]);
  const modelId=decodeURIComponent(parts[1]);
  const brand=(d.brands||[]).find(x=>String(x.id)===brandId);
  const model=(d.models||[]).find(x=>String(x.id)===modelId);

  if(!brand||!model){
    if(typeof legacyTyresByCar==='function')return legacyTyresByCar();
    return;
  }

  const modelTypeId=String(model.tyreTypeId||model.tyre_type_id||'').trim();
  const tyreTypes=Array.isArray(d.tyres?.featured)?d.tyres.featured:[];
  const matchedType=tyreTypes.find(t=>String(t.id||'')===modelTypeId);

  if(!modelTypeId||!matchedType){
    render('<section class="tyreExactPage"><div class="tyreDesktop"><div class="tyreProductResultsPage tyreFinderActionResultsPage"><button class="tyrePlaceholderBack" onclick="tyreFinderBrand(\''+esc(brand.id)+'\')">← Back to Models</button><div class="empty" style="max-width:720px;margin:80px auto;text-align:center"><h2 style="margin-bottom:10px">Tyre type not assigned</h2><p>This vehicle model has not been assigned a tyre type yet. Please assign one in the admin panel before searching for tyres.</p></div></div></div></section>');
    return;
  }

  const title=(String(brand.name||'')+' '+String(model.name||'')+' Tyres').trim();

  if(typeof window.showTyreProductResults==='function'){
    window.showTyreProductResults(
      title,
      p=>String(p.typeId||p.tyreTypeId||p.tyre_type_id||'').trim()===modelTypeId,
      {
        kind:'car',
        title,
        modelName:String(model.name||''),
        vehicleLabel:String(brand.name||'')+' '+String(model.name||''),
        image:String(model.image||''),
        tyreTypeId:modelTypeId,
        tyreTypeTitle:String(matchedType.title||'')
      }
    );
    return;
  }

  render('<section class="tyreExactPage tyreFindActionPage" aria-label="'+esc(title)+'"></section>');
};

// app.js boots before this exact-route override is loaded. Re-run the current
// Find Tyre by Car route so the override actually takes effect on first load.
if((location.hash||'').toLowerCase().startsWith('#tyres/by-car')){
  try{window.tyresByCar();}catch(e){console.error('Find Tyre by Car route failed',e);}
}
})();