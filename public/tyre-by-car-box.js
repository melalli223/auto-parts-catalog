/* Adds the visual panel only on the Find Tyre By Car route. */
(function(){
  'use strict';
  const ROOT_CLASS='tyre-by-car-enhanced';
  const PANEL_CLASS='tyreByCarPanel';
  const INTRO_CLASS='tyreByCarIntro';

  function isTargetRoute(){
    const path=(location.hash||'').replace(/^#/,'').replace(/^\//,'');
    return path==='tyres/by-car' || path.startsWith('tyres/by-car/');
  }

  function unwrap(root){
    const panel=root.querySelector(':scope > .'+PANEL_CLASS);
    if(!panel)return;
    while(panel.firstChild)root.insertBefore(panel.firstChild,panel);
    panel.remove();
  }

  function enhance(){
    const root=document.querySelector('#app');
    if(!root)return;
    const active=isTargetRoute();
    document.body.classList.toggle(ROOT_CLASS,active);
    root.classList.toggle(ROOT_CLASS,active);
    if(!active){unwrap(root);return;}
    if(root.querySelector(':scope > .'+PANEL_CLASS))return;

    const panel=document.createElement('section');
    panel.className=PANEL_CLASS;
    const intro=document.createElement('div');
    intro.className=INTRO_CLASS;
    intro.innerHTML='<h1>Tell us about your vehicle.</h1><p>All fields are required.</p>';
    panel.appendChild(intro);
    while(root.firstChild)panel.appendChild(root.firstChild);
    root.appendChild(panel);
  }

  function schedule(){window.setTimeout(enhance,80)}
  window.addEventListener('hashchange',schedule);
  const observer=new MutationObserver(schedule);
  function start(){
    const root=document.querySelector('#app');
    if(root)observer.observe(root,{childList:true,subtree:true});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
