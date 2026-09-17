/* Find Tyre By Car: keep only the vehicle finder inside the reference-style panel. */
(function(){
  'use strict';
  const rootClass='tyre-by-car-enhanced';
  function active(){const p=(location.hash||'').replace(/^#/,'').replace(/^\//,'');return p==='tyres/by-car'||p.startsWith('tyres/by-car/')}
  function enhance(){
    const root=document.querySelector('#app');if(!root)return;
    const on=active();document.body.classList.toggle(rootClass,on);root.classList.toggle(rootClass,on);
    if(!on)return;
    if(root.dataset.exactCarReady==='1')return;
    const finder=root.querySelector('.tyreFinderPage');if(!finder)return;
    const panel=document.createElement('section');panel.className='tyreByCarPanel';
    const intro=document.createElement('div');intro.className='tyreByCarIntro';
    intro.innerHTML='<h1>Tell us about your vehicle.</h1><p>All fields are required.</p>';
    panel.append(intro,finder);
    root.replaceChildren(panel);root.dataset.exactCarReady='1';
  }
  function schedule(){window.setTimeout(()=>{if(!active()){const root=document.querySelector('#app');if(root)delete root.dataset.exactCarReady;}enhance()},100)}
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
