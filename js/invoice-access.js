(() => {
  'use strict';
  const api = window.FV_PRIVATE_ACCESS;
  const active = () => sessionStorage.getItem('philosophal-invoice-entry-v1') === 'alo-2026' || api?.role() === 'private';
  const resolve = path => window.PHILOSOPHAL_NAVIGATION?.resolve(path) || path;
  function quit(){
    sessionStorage.removeItem('philosophal-invoice-entry-v1');
    if(api?.role())api.lock();else location.reload();
  }
  function show(){
    if(!active())return;
    const grid=document.querySelector('.tools-grid');
    const shell=document.querySelector('.tools-shell');
    const hero=document.querySelector('.tools-hero');
    if(!grid||!shell||!hero||document.querySelector('[data-pro-workspace]'))return;
    document.body.classList.add('has-professional-workspace');
    const summary=document.createElement('section');
    summary.className='pro-status-banner';
    summary.setAttribute('aria-label','Statut de votre espace professionnel');
    summary.innerHTML='<div class="pro-status-copy"><span class="pro-status-dot" aria-hidden="true"></span><div><strong>Espace professionnel activé</strong><span>Vous avez accès à vos outils de création et de gestion.</span></div></div><button type="button" class="pro-logout" data-pro-exit>Quitter le mode pro</button>';
    const section=document.createElement('section');
    section.className='pro-workspace';
    section.dataset.proWorkspace='';
    section.setAttribute('aria-labelledby','pro-workspace-title');
    section.innerHTML=`<div class="pro-workspace-head"><div><span class="pro-workspace-kicker"><span aria-hidden="true">✦</span> ESPACE PROFESSIONNEL</span><h2 id="pro-workspace-title">Mes outils professionnels</h2><p>Création audiovisuelle et gestion de mon activité.</p></div><span class="pro-workspace-indicator" aria-label="Accès actif"><span aria-hidden="true">●</span> Accès actif</span></div><div class="pro-tools-list"><a class="pro-tool-card" href="${resolve('/outils/factures/')}"><div class="pro-card-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="9" y="5" width="30" height="38" rx="4" stroke="currentColor" stroke-width="2"/><path d="M15 16h18M15 22h18M15 28h8M25 34h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 34h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div><div><span class="pro-tool-label">ADMINISTRATION</span><h3>Factures</h3><p>Modèles réutilisables, calcul des heures, mise en forme et export PDF ou Word.</p></div><span class="pro-tool-arrow" aria-hidden="true">↗</span></a><a class="pro-tool-card pro-tool-card--cut" href="${resolve('/outils/philosophal-cut/')}"><div class="pro-card-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="5" y="11" width="38" height="27" rx="5" stroke="currentColor" stroke-width="2"/><path d="M14 20h20M14 27h20" stroke="currentColor" stroke-width="2"/><path d="M19 11v27M29 11v27" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M5 33h38" stroke="currentColor" stroke-width="1.2"/></svg></div><div><span class="pro-tool-label">CRÉATION AUDIOVISUELLE</span><h3>Philosophal Cut</h3><p>Dérushage automatique, timeline multipiste, scripts, sous-titres, miniatures et exports vidéo/audio.</p></div><span class="pro-tool-arrow" aria-hidden="true">↗</span></a><a class="pro-tool-card pro-tool-card--audiovisuel" href="${resolve('/outils/studio-audiovisuel/')}"><div class="pro-card-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M5 24h5l4-11 6 22 6-22 6 22 5-11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24" r="21" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/></svg></div><div><span class="pro-tool-label">PRODUCTION AUDIOVISUELLE</span><h3>Studio audiovisuel</h3><p>Enregistrement vocal, capture écran/webcam, analyse sonore, transcription, sous-titres et exports.</p></div><span class="pro-tool-arrow" aria-hidden="true">↗</span></a></div>`;
    // Public tools do not move or change. Authenticated-only content is visibly separate.
    hero.before(summary);
    const publicTitle=document.createElement('div');publicTitle.className='pro-public-head';publicTitle.innerHTML='<span>OUTILS DU SITE</span><p>Lecture, édition et création de documents</p>';
    grid.before(publicTitle);
    grid.after(section);
    summary.querySelector('[data-pro-exit]').addEventListener('click',quit);
  }
  function ready(){show();api?.ready?.then(show).catch(()=>{});window.addEventListener('philosophal:unlocked',show)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
