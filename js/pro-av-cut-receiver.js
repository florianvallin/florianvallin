/* Philosophal V54.3 — réception avec choix explicite avant toute modification du montage. */
(()=>{'use strict';
 const B=window.PhilosophalAVCutBridge,$=id=>document.getElementById(id);
 if(!B||!$('v543CutDialog'))return;
 const d=$('v543CutDialog'),select=$('v543CutSelect'),target=$('v543CutTarget'),cues=$('v543CutCues'),info=$('v543CutInfo'),hint=$('v543CutHint'),status=$('v543CutStatus'),importBtn=$('v543CutImport');
 const ready=()=>Boolean($('fileInput')&&$('v18ImportInput')&&$('v31File'));
 let entries=[],active=null,busy=false;
 const bytes=n=>n<1024**2?(n/1024).toFixed(0)+' Ko':(n/1024**2).toFixed(1)+' Mo';
 const hasRush=()=>Boolean($('videoWrap')?.classList.contains('loaded')&&$('mediaName')?.textContent?.trim());
 const oldQuery=new URLSearchParams(location.search).get('av-transfer');
 const noQuery=()=>{for(const w of [window,window.top]){try{const url=new URL(w.location.href);if(!url.searchParams.has('av-transfer'))continue;url.searchParams.delete('av-transfer');w.history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{ /* about:blank et iframes externes ne permettent pas replaceState */ }}};
 function refreshInfo(){active=entries.find(e=>e.id===select.value)||null;
  if(!active){info.textContent='Aucun transfert disponible dans ce navigateur pour ce site.';target.disabled=true;cues.disabled=true;importBtn.disabled=true;return;}
  info.textContent=`${active.name} · ${active.type==='video'?'Vidéo':'Audio'} · ${bytes(active.size)} · ${active.cues?.length||0} passage(s) synchronisé(s) · enregistré localement ${new Date(active.created).toLocaleString('fr-FR')}.`;
  const video=active.type==='video';const main=target.querySelector('[value="main"]');main.disabled=!video;
  if(!video&&target.value==='main')target.value='library';
  const n=active.cues?.length||0;cues.disabled=!n;cues.checked=!!n&&target.value!=='library';
  target.disabled=false;importBtn.disabled=false;showHint();
 }
 function showHint(){const withSubs=Boolean(active?.cues?.length),mode=target.value;
  if(mode==='main')hint.textContent='Le rush principal actuel sera remplacé après confirmation. Si cochés, les sous-titres seront importés sur les temps originaux de ce nouveau rush.';
  else if(mode==='library')hint.textContent='Le média sera ajouté sans placer de clip sur la timeline. Les sous-titres éventuels restent en attente : ouvrez-les ensuite sur un rush compatible.';
  else hint.textContent='Le rush actuel est conservé. Attention : les repères sont ceux du média source, pas nécessairement ceux du montage ouvert.';
  if(mode==='library'){cues.checked=false;cues.disabled=true;}else cues.disabled=!withSubs;
 }
 async function refresh(focus=null){try{entries=await B.list();select.replaceChildren();for(const e of entries)select.add(new Option(e.name+' · '+bytes(e.size)+' · '+new Date(e.created).toLocaleDateString('fr-FR'),e.id));
  if(!entries.length)select.add(new Option('Aucun transfert enregistré',''));
  select.value=entries.some(e=>e.id===focus)?focus:entries[0]?.id||'';refreshInfo();
 }catch(e){entries=[];active=null;info.textContent='Stockage local inaccessible : '+(e.message||e);importBtn.disabled=true;}}
 function fileFor(b,name){return B.asFile(b,name);}
 async function pushInput(el,f){if(!el)throw Error('L’importeur Cut n’est pas disponible.');const dt=new DataTransfer();dt.items.add(f);el.files=dt.files;el.dispatchEvent(new Event('change',{bubbles:true}));}
 async function readyMedia(){const video=$('video');const root=$('videoWrap');if(!video||!root)return;
  if(video.readyState>=1)return;
  await Promise.race([new Promise(resolve=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',resolve,{once:true});}),new Promise(resolve=>setTimeout(resolve,4000))]);
 }
 async function importCues(entry){const sub=B.cleanCues(entry?.cues);if(!sub.length)return 0;
  // Le moteur Cut sait importer directement les mêmes repères structurés. On évite
  // les courses entre File.text() (asynchrone) et la suppression du transfert.
  if(typeof applyCues==='function' && typeof S!=='undefined' && S.file){
    applyCues(sub);return Array.isArray(S.cues)?S.cues.length:sub.length;
  }
  const raw=B.makeSrt(sub);await pushInput($('v31File'),new File([raw],B.sane(entry.name.replace(/\.[^.]+$/,'')+'-sous-titres.srt'),{type:'application/x-subrip'}));
  return sub.length;
 }
 async function perform(){if(busy||!active)return;
  const entry=active,mode=target.value,withSubs=cues.checked&&entry.cues?.length;
  if(mode==='main'&&entry.type!=='video'){status.textContent='Un fichier audio ne peut pas être utilisé comme rush principal vidéo.';return;}
  if(mode==='only-cues'&&!withSubs){status.textContent='Ce transfert ne contient aucun sous-titre à importer.';return;}
  if(mode==='only-cues'&&!hasRush()){status.textContent='Ouvrez d’abord le rush vidéo correspondant dans Cut.';return;}
  if(mode==='main'&&hasRush()&&!confirm('Remplacer le rush principal actuel ? Ses coupes et transcriptions en cours seront réinitialisées. Sauvegardez le projet si nécessaire.'))return;
  if(mode==='only-cues'&&hasRush()&&!confirm('Importer les sous-titres du Studio sur le rush actuel ? Vérifiez qu’il s’agit du même média et que les repères temporels correspondent.'))return;
  busy=true;importBtn.disabled=true;status.textContent='Importation locale en cours…';
  try{
   if(mode==='main'){
     await pushInput($('fileInput'),fileFor(entry.blob,entry.name));
     await readyMedia();
     if(!$('videoWrap')?.classList.contains('loaded'))throw Error('Cut n’a pas pu charger le média. Le transfert reste disponible.');
   }else if(mode==='library'){
     await pushInput($('v18ImportInput'),fileFor(entry.blob,entry.name));
   }
   if(withSubs&&mode!=='library'){
     // Attendre la durée réelle : Cut limite les repères à celle du rush chargé.
     await readyMedia();
     await importCues(entry);
   }
   status.textContent=mode==='library'?'Média ajouté à la médiathèque. Placez-le ensuite sur une piste.':(withSubs?'Média et sous-titres importés. Vérifiez les horaires.':'Média importé.');
   await B.remove(entry.id);
   await refresh();noQuery();
  }catch(e){status.textContent='Importation interrompue : '+(e?.message||e)+'. Le transfert reste disponible pour recommencer.';}
  finally{busy=false;importBtn.disabled=!active;}
 }
 const btn=document.createElement('button');btn.id='v543CutOpen';btn.type='button';btn.className='v543-cut-open';btn.textContent='↙ Depuis Studio audiovisuel';btn.title='Récupérer les enregistrements, vidéos et SRT préparés dans Studio audiovisuel';
 (document.querySelector('header .toolbar')||document.querySelector('header')||document.body).append(btn);
 btn.onclick=async()=>{status.textContent='';await refresh();d.showModal();};
 $('v543CutClose').onclick=$('v543CutCancel').onclick=()=>{if(!busy)d.close();};
 select.onchange=refreshInfo;target.onchange=showHint;
 $('v543CutDelete').onclick=async()=>{if(!active||busy)return;if(!confirm('Supprimer définitivement ce transfert temporaire local ? Le média original enregistré dans Studio n’est pas supprimé.'))return;await B.remove(active.id);status.textContent='Transfert supprimé.';await refresh();noQuery();};
 importBtn.onclick=perform;
 if(oldQuery){
  const boot=async()=>{if(!ready())return;await refresh(oldQuery);if(active?.id===oldQuery){target.value=active.type==='video'?'main':'library';refreshInfo();d.showModal();}else{status.textContent='Ce transfert est introuvable ou a expiré. Vous pouvez en préparer un autre depuis le Studio.';d.showModal();}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 }
})();