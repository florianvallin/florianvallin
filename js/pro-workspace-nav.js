/* Philosophal V54.1 — une navigation pro commune, sans toucher aux moteurs des outils. */
(()=>{'use strict';
  const access=window.FV_PRIVATE_ACCESS;
  let childState='idle';
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==document.querySelector('.app-shell iframe')?.contentWindow)return;
    if(event.data?.type==='philosophal-studio-state'&&['idle','voice','video','saving'].includes(event.data.state))childState=event.data.state;
  });
  const apps=[
    {name:'Studio audiovisuel',desc:'Enregistrer, capturer et transcrire',url:'/outils/studio-audiovisuel/',symbol:'◉',id:'studio'},
    {name:'Philosophal Cut',desc:'Monter et exporter les vidéos',url:'/outils/philosophal-cut/',symbol:'▦',id:'cut'},
    {name:'Factures',desc:'Gérer les cours et documents',url:'/outils/factures/',symbol:'▤',id:'invoices'}
  ];
  const path=location.pathname.replace(/\/?(?:index\.html)?$/,'/');
  const inStudio=path.startsWith('/outils/studio-audiovisuel/');
  const inCut=path.startsWith('/outils/philosophal-cut/');
  const inInvoices=path.startsWith('/outils/factures/');
  if(!inStudio&&!inCut&&!inInvoices)return;
  const current=inStudio?'studio':inCut?'cut':'invoices';
  function owner(){try{return access?.role()==='private'||sessionStorage.getItem('philosophal-invoice-entry-v1')==='alo-2026';}catch{return false;}}
  const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function makeMenu(){
    const dropdown=document.createElement('details');
    dropdown.className='ph-pro-switcher'+(inInvoices?' ph-pro-switcher--invoices':'');
    dropdown.dataset.phProSwitcher='';dropdown.hidden=true;
    const items=apps.map(item=>{
      const active=item.id===current;
      return `<a href="${item.url}"${active?' aria-current="page"':''} data-ph-tool="${item.id}"><span class="ph-pro-symbol" aria-hidden="true">${item.symbol}</span><span><span class="ph-pro-name">${escapeHtml(item.name)}${active?' · Actuel':''}</span><span class="ph-pro-desc">${escapeHtml(item.desc)}</span></span></a>`;
    }).join('');
    dropdown.innerHTML=`<summary aria-label="Changer d’outil professionnel"><span class="ph-pro-dot" aria-hidden="true"></span>Outils professionnels <span class="ph-pro-chevron" aria-hidden="true">⌄</span></summary><nav class="ph-pro-menu" aria-label="Autres outils professionnels"><div class="ph-pro-menu-title">Espace professionnel · V54.6</div>${items}<div class="ph-pro-divider"></div><a href="/outils/"><span class="ph-pro-symbol" aria-hidden="true">⌂</span><span><span class="ph-pro-name">Tous les outils</span><span class="ph-pro-desc">Retour à l’espace Philosophal</span></span></a><div class="ph-pro-foot">Avant de changer d’outil, termine tes enregistrements et enregistre tes projets. Dans Studio audiovisuel, utilisez « Vers Cut » pour préparer un transfert local volontaire.</div></nav>`;
    dropdown.querySelector('a[aria-current="page"]').addEventListener('click',event=>{event.preventDefault();dropdown.open=false;});
    dropdown.querySelectorAll('a:not([aria-current])').forEach(link=>link.addEventListener('click',event=>{
      if(childState!=='idle'){
        const text=childState==='saving'?'Des modifications semblent encore en attente de sauvegarde.':'Un enregistrement est en cours. Terminez-le et téléchargez votre fichier avant de changer d’outil.';
        if(!confirm(text+'\n\nVoulez-vous vraiment quitter cette page ?')){event.preventDefault();return;}
      }
      dropdown.open=false;
    }));
    document.addEventListener('pointerdown',e=>{if(dropdown.open&&!dropdown.contains(e.target))dropdown.open=false;},{passive:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus();}});
    return dropdown;
  }
  let dropdown;
  function render(){
    if(!dropdown){
      const host=inInvoices?document.querySelector('#app .top-actions'):document.querySelector('.top nav.actions');
      if(!host)return;
      dropdown=makeMenu();host.prepend(dropdown);
    }
    dropdown.hidden=!owner();
    if(dropdown.hidden)dropdown.open=false;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
  Promise.resolve(access?.ready).then(render).catch(()=>{});
  window.addEventListener('philosophal:unlocked',render);
  window.addEventListener('pageshow',render);
  // Le contrôle d’accès principal est assuré par chaque page, pas par ce menu de navigation.
})();
