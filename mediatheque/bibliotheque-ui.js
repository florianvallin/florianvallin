/* Navigation et pictogrammes de la bibliothèque : aucun catalogue ni accès modifié. */
(() => {
  'use strict';
  const paths = {
    library: '<path d="M3 5c3-2 6-2 9 0 3-2 6-2 9 0v15c-3-2-6-2-9 0-3-2-6-2-9 0zM12 5v15"/>',
    texte: '<path d="M3 5c3-2 6-2 9 0 3-2 6-2 9 0v15c-3-2-6-2-9 0-3-2-6-2-9 0zM12 5v15M6 9h3M15 9h3"/>',
    livre: '<rect x="3" y="5" width="4" height="15" rx="1"/><rect x="9" y="3" width="4" height="17" rx="1"/><path d="m15 5 4-1 3 15-4 1zM3 9h4M9 7h4"/>',
    manuel: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
    audio: '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',
    video: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    cours: '<path d="M5 3h11l3 3v15H5zM16 3v4h3M8 11h8M8 15h8M8 18h5"/>',
    'cours-video': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10 8 5 3-5 3zM8 21h8M12 17v4"/>',
    mindmap: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="m10.5 8-4 8m7-8 4 8"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    explorer: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4m-6 6 6 4"/>',
    atelier: '<path d="M8 15a6 6 0 1 1 8 0l-1 3H9zM9 21h6M12 1v-1M3 5 1 3M21 5l2-2M2 12H0M24 12h-2"/>',
    editor: '<path d="m16 3 5 5-12 12-6 1 1-6zM13 6l5 5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    pdf: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 8v5l-3 2M9 2h6M12 2v3m7 1 2 2"/>',
    epub: '<path d="M3 5c3-2 6-2 9 0 3-2 6-2 9 0v15c-3-2-6-2-9 0-3-2-6-2-9 0zM12 5v15"/>',
    prompter: '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M7 8h10M7 11h10M7 14h6M9 22h6M12 19v3"/>',
    tools: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    filters: '<path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2" fill="var(--panel,#fff)"/><circle cx="16" cy="12" r="2" fill="var(--panel,#fff)"/><circle cx="10" cy="18" r="2" fill="var(--panel,#fff)"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    external: '<path d="M13 3h8v8M21 3 10 14M10 3H3v18h18v-7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>'
  };
  const svg = name => `<svg class="library-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.texte}</svg>`;
  const paint=()=>document.querySelectorAll('[data-library-icon]:empty').forEach(el => {el.innerHTML=svg(el.dataset.libraryIcon);el.setAttribute('aria-hidden','true');});
  window.PhilosophalLibraryIcons = {svg,paint};
  paint();
  const dialogs = [...document.querySelectorAll('dialog[data-library-dialog]')];
  let returnFocus = null;
  function closeDialogs(){dialogs.forEach(d=>{if(d.open)d.close();});}
  function openDialog(name){
    const dialog=dialogs.find(d=>d.dataset.libraryDialog===name);
    if(!dialog)return;
    const active=document.activeElement;
    const origin=active?.closest('dialog[open]') ? returnFocus : active;
    closeDialogs(); returnFocus=origin; dialog.showModal();
    if(name==='tools')document.querySelector('[data-library-mobile="tools"]')?.setAttribute('aria-current','page');
    if(name==='atelier')document.querySelector('[data-library-mobile="atelier"]')?.setAttribute('aria-current','page');
  }
  window.PhilosophalLibraryUI={openDialog,closeDialogs};
  for(const dialog of dialogs){
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{
      document.querySelectorAll('[data-library-mobile="tools"],[data-library-mobile="atelier"]').forEach(b=>b.removeAttribute('aria-current'));
      if(returnFocus?.isConnected&&!dialogs.some(d=>d.open))returnFocus.focus({preventScroll:true});
    });
  }
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-library-open]');
    if(trigger){event.preventDefault();openDialog(trigger.dataset.libraryOpen);}
    const close=event.target.closest('[data-library-close]');
    if(close)close.closest('dialog')?.close();
    if(event.target.closest('[data-library-nav],[data-open-explorer]'))closeDialogs();
  });
  // Les fenêtres historiques (lecteur, exploration, connexions, accès privé)
  // bénéficient aussi du retour au déclencheur et d'une navigation au clavier contenue.
  const overlays=[...document.querySelectorAll('[data-media-explorer],[data-media-player],[data-resource-detail],[data-private-gate]')];
  const originFor=new WeakMap();
  for(const overlay of overlays){
    new MutationObserver(()=>{
      if(!overlay.hidden){originFor.set(overlay,document.activeElement);}
      else{const origin=originFor.get(overlay);if(origin?.isConnected&&!overlays.some(el=>!el.hidden)&&!dialogs.some(d=>d.open))origin.focus({preventScroll:true});}
    }).observe(overlay,{attributes:true,attributeFilter:['hidden']});
  }
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const overlay=overlays.find(el=>!el.hidden);
    if(!overlay)return;
    const panel=overlay.querySelector('[role="dialog"]')||overlay;
    const controls=[...panel.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&!el.hidden&&el.getClientRects().length);
    if(!controls.length)return;
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){event.preventDefault();first.focus();}
  },true);
})();
