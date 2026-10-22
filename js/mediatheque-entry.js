/* L'accueil n'est pas un document privé : seules ses données réservées le sont. */
(async () => {
  'use strict';
  const api=window.FV_PRIVATE_ACCESS, version='20261022-v39';
  const base=new URL('../',document.currentScript.src);
  const load=path=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(path+'?v='+version,base).href;script.onload=resolve;script.onerror=()=>reject(new Error('Chargement de la médiathèque impossible. Rechargez la page.'));document.body.append(script);});
  const notice=message=>{const target=document.querySelector('[data-media-boot-message]');if(target){target.textContent=message;target.hidden=false;}};
  try {
    await api?.ready;
    if(api?.role()) {
      try {
        const loaded=await api.execute('/mediatheque/data.js');
        if(!loaded)throw new Error('Données réservées absentes.');
        for(const path of ['/mediatheque/mindmaps-data.js','/mediatheque/s1-courses.js','/mediatheque/s2-courses.js','/mediatheque/s3-courses.js','/mediatheque/s4-courses.js','/mediatheque/research-courses.js'])await api.execute(path);
      } catch {notice('Les ressources réservées n’ont pas pu être ouvertes. Les ressources publiques restent disponibles.');}
    }
    if(!window.FV_MEDIATHEQUE_DATA)await load('mediatheque/data-public.js');
    await load('mediatheque/textes-sync.js');
    await load('mediatheque/mediatheque.js');
    await load('mediatheque/course-browser.js');
  } catch(error) {notice(error.message);}
})();
