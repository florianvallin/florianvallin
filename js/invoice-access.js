/* Philosophal V54.18 — espace professionnel accessible et compact */
(()=>{'use strict';
 const api=window.FV_PRIVATE_ACCESS;
 const owner=()=>{try{return api?.role()==='private'||sessionStorage.getItem('philosophal-invoice-entry-v1')==='alo-2026';}catch{return false;}};
 const tools=[
  {id:'factures',url:'/outils/factures/',category:'ADMINISTRATION',name:'Factures',desc:'Devis, factures et exports PDF.',art:'<rect x="22" y="9" width="47" height="62" rx="7" fill="#fff" stroke="#9b80bd" stroke-width="2"/><path d="M33 28h25M33 38h25M33 48h16M33 61h25" stroke="#a78ec4" stroke-width="3" stroke-linecap="round"/><circle cx="61" cy="60" r="12" fill="#d8c9ef" stroke="#8065ad" stroke-width="1.5"/><path d="M55 60h12M61 54v12" stroke="#6c559c" stroke-width="2"/>'},
  {id:'cut',url:'/outils/philosophal-cut/',category:'MONTAGE VIDÉO',name:'Philosophal Cut',desc:'Timeline, dérushage, montage.',art:'<rect x="6" y="20" width="77" height="46" rx="8" fill="#e0e9fb" stroke="#708ac0" stroke-width="2"/><rect x="13" y="27" width="63" height="30" rx="3" fill="#14273d"/><path d="m40 32 0 20 18-10Z" fill="#a9c7ee"/><path d="M23 15v9M39 15v9M56 15v9M70 15v9" stroke="#6285b7" stroke-width="4" stroke-linecap="round"/>'},
  {id:'pilotage',url:'/outils/pilotage/',category:'PILOTAGE',name:'Philosophal Pilotage',desc:'Objectifs, activité, réseaux et organisation.',art:'<rect x="13" y="14" width="64" height="56" rx="10" fill="#e5f1e9" stroke="#8fac99" stroke-width="2"/><path d="M26 54V42m14 12V31m14 23V37m14 17V24" stroke="#46765a" stroke-width="5" stroke-linecap="round"/><path d="M24 57h47" stroke="#7b9c87" stroke-width="2"/> '},
  {id:'studio',url:'/outils/studio-audiovisuel/',category:'PRODUCTION',name:'Studio audiovisuel',desc:'Prises, captures, transcription.',art:'<circle cx="45" cy="43" r="33" fill="#e1f3ec" stroke="#82baa6" stroke-width="2"/><rect x="38" y="23" width="14" height="32" rx="7" fill="#5d9e89"/><path d="M31 43a14 14 0 0 0 28 0M45 57v11M32 69h26" stroke="#3c7f6d" stroke-width="3" stroke-linecap="round"/><path d="M7 33v20M13 28v28M77 31v23M83 37v14" stroke="#93c6b6" stroke-width="2"/>'},
  {id:'backup',url:'/outils/sauvegarde-pro/',category:'SÉCURITÉ',name:'Sauvegardes pro',desc:'Projets et médias : sauvegarder, restaurer.',art:'<rect x="13" y="23" width="64" height="48" rx="9" fill="#e5eee9" stroke="#7fac9e" stroke-width="2"/><path d="M23 37h44M29 50h33" stroke="#7fac9e" stroke-width="3" stroke-linecap="round"/><path d="M45 43v20m-8-7 8 7 8-7" stroke="#397e72" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'}
 ];
 function card(t){return `<a class="pro-tool-card pro-tool-card--${t.id}" href="${t.url}" aria-label="Ouvrir ${t.name}"><span class="pro-card-icon" aria-hidden="true"><svg viewBox="0 0 90 83" fill="none" focusable="false">${t.art}</svg></span><span class="pro-card-text"><span class="pro-tool-label">${t.category}</span><strong>${t.name}</strong><small>${t.desc}</small></span><span class="pro-tool-arrow" aria-hidden="true">↗</span></a>`;}
 let storageCheckedAt=0;
 async function checkStorage(section){
   const el=section.querySelector('[data-pro-storage]');if(!el||Date.now()-storageCheckedAt<20000)return;storageCheckedAt=Date.now();
   if(!navigator.storage?.estimate){el.textContent='Sauvegardes locales · Capacité indisponible dans ce navigateur · ';
      const link=document.createElement('a');link.href='/outils/sauvegarde-pro/';link.textContent='Exporter les projets professionnels';el.append(link);return;}
   try{const report=await navigator.storage.estimate();if(!el.isConnected)return;
     const usage=Number(report.usage||0),quota=Number(report.quota||0);
     const mb=x=>x>=1e9?(x/1e9).toFixed(1)+' Go':(x/1e6).toFixed(0)+' Mo';
     const ratio=quota?usage/quota:0;
     el.replaceChildren(document.createTextNode('Stockage de ce navigateur · '+mb(usage)+(quota?' sur '+mb(quota):'')+(ratio>.8?' · Espace presque plein':'')+' · '));
     const link=document.createElement('a');link.href='/outils/sauvegarde-pro/';link.textContent='Sauvegarder mes projets pro';el.append(link);
     el.dataset.capacity=ratio>.8?'warning':'normal';
   }catch{el.textContent='Sauvegardes locales · Vérifiez que le stockage du navigateur est autorisé.';}
 }
 function render(){const shell=document.querySelector('.tools-shell'),grid=shell?.querySelector('.tools-grid'),hero=shell?.querySelector('.tools-hero');if(!shell||!grid||!hero)return;
   let section=shell.querySelector('[data-pro-workspace]');let banner=shell.querySelector('.pro-status-banner');let publicHead=shell.querySelector('.pro-public-head');
   if(!section){section=document.createElement('section');section.className='pro-workspace';section.dataset.proWorkspace='';section.setAttribute('aria-labelledby','pro-workspace-title');section.innerHTML=`<div class="pro-workspace-head"><div><span class="pro-workspace-kicker">ESPACE PROFESSIONNEL</span><h2 id="pro-workspace-title">Mes outils professionnels</h2></div><span class="pro-workspace-indicator">● Accès actif</span></div><div class="pro-tools-list">${tools.map(card).join('')}<div class="pro-tool-card pro-tool-reserved" aria-label="Emplacement réservé pour un futur outil professionnel"><span class="pro-card-icon" aria-hidden="true">＋</span><span class="pro-card-text"><span class="pro-tool-label">À VENIR</span><strong>Nouvel outil pro</strong><small>Emplacement prêt à compléter</small></span></div></div><div class="pro-storage" data-pro-storage role="status" aria-live="polite">Sauvegardes locales · Vérification du stockage…</div><p class="pro-workflow" aria-label="Flux de production">Enregistrer et transcrire dans <a href="/outils/studio-audiovisuel/">Studio audiovisuel</a> · Monter dans <a href="/outils/philosophal-cut/">Philosophal Cut</a></p>`;
     banner=document.createElement('section');banner.className='pro-status-banner';banner.innerHTML='<div class="pro-status-copy"><span class="pro-status-dot" aria-hidden="true"></span><strong>Espace professionnel activé</strong></div><button type="button" class="pro-logout" data-pro-exit>Quitter le mode pro</button>';
     publicHead=document.createElement('div');publicHead.className='pro-public-head';publicHead.innerHTML='<span>OUTILS DU SITE</span>';
     hero.before(banner);hero.after(section);grid.before(publicHead);
     banner.querySelector('[data-pro-exit]').addEventListener('click',()=>{try{sessionStorage.removeItem('philosophal-invoice-entry-v1');}catch{}if(api?.role())api.lock();else location.reload()});
   }
   const enabled=owner();document.body.classList.toggle('has-professional-workspace',enabled);section.hidden=banner.hidden=publicHead.hidden=!enabled;
   if(enabled)checkStorage(section);

 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
 Promise.resolve(api?.ready).then(render).catch(render);
 window.addEventListener('philosophal:unlocked',render);
 window.addEventListener('pageshow',render);
 window.addEventListener('focus',render);
})();
