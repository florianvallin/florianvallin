/* Philosophal V54.3 — remise volontaire de médias entre studios du même site.
   Les Blob sont stockés localement dans IndexedDB, sans requête réseau. */
(()=>{'use strict';
 const DB='philosophal-studio-vers-cut-v1',STORE='transferts',VERSION=1;
 const ageLimit=7*24*3600*1000;
 const open=()=>new Promise((resolve,reject)=>{
   if(!('indexedDB'in window))return reject(new Error('Le stockage local est indisponible dans ce navigateur.'));
   let req;try{req=indexedDB.open(DB,VERSION);}catch(e){return reject(e)}
   req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:'id'});};
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Impossible d’ouvrir le stockage local.'));
   req.onblocked=()=>reject(new Error('Un autre onglet bloque la mise à jour du stockage.'));
 });
 async function tx(mode,action){const db=await open();return new Promise((resolve,reject)=>{
  let out;let transaction;try{transaction=db.transaction(STORE,mode);out=action(transaction.objectStore(STORE));}catch(e){db.close();reject(e);return;}
  transaction.oncomplete=()=>{db.close();resolve(out?.result)};
  transaction.onerror=()=>{const err=transaction.error||new Error('Écriture du transfert impossible : manque d’espace disponible ?');db.close();reject(err)};
  transaction.onabort=()=>{const err=transaction.error||new Error('Transfert annulé : le stockage local est peut-être saturé.');db.close();reject(err)};
 });}
 const sane=v=>String(v||'').normalize('NFKC').replace(/[\\/:*?"<>|\x00-\x1f]/g,'-').replace(/[. ]+$/,'').slice(0,150)||'Media-Philosophal';
 const asFile=(blob,name)=>new File([blob],sane(name),{type:blob.type||(/\.wav$/i.test(name)?'audio/wav':/\.webm$/i.test(name)?'video/webm':'application/octet-stream'),lastModified:Date.now()});
 const ext=name=>/\.(mp4|m4v|webm|mov|avi|mkv|wav|mp3|m4a|flac|ogg|aac)$/i.test(String(name||''));
 const kind=(blob,name)=>/^(video)\//.test(blob?.type)||/\.(mp4|m4v|webm|mov|avi|mkv)$/i.test(name)?'video':/^(audio)\//.test(blob?.type)||/\.(wav|mp3|m4a|flac|ogg|aac)$/i.test(name)?'audio':null;
 function cleanCues(cues){return (Array.isArray(cues)?cues:[]).slice(0,15000).map(c=>({start:Number(c.start),end:Number(c.end),text:String(c.text||'').trim()})).filter(c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&c.text).sort((a,b)=>a.start-b.start);}
 function cleanMarkers(items){return (Array.isArray(items)?items:[]).slice(0,4000).map(m=>({time:Number(m.time),note:String(m.note||'').replace(/[\x00-\x1f]/g,' ').slice(0,240),status:['review','done','cut'].includes(m.status)?m.status:'review'})).filter(m=>Number.isFinite(m.time)&&m.time>=0&&m.time<=86400).sort((a,b)=>a.time-b.time);}
 function cleanTranscript(value){return String(value||'').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').slice(0,100000);}
 function label(value){return String(value||'').replace(/[\x00-\x1f]/g,' ').trim().slice(0,100);}
 function time(seconds){const ms=Math.max(0,Math.round(seconds*1000));return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(v=>String(v).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');}
 function makeSrt(cues){return '\ufeff'+cleanCues(cues).map((c,i)=>`${i+1}\r\n${time(c.start)} --> ${time(c.end)}\r\n${c.text}`).join('\r\n\r\n')+'\r\n';}
 const getQuality=()=>window.PhilosophalAVQuality;
 async function examine(item,probe=false){
  const Q=getQuality();if(!Q)return {checkedAt:Date.now(),status:'unknown',warnings:['Contrôle qualité indisponible'],fingerprint:''};
  const report=await Q.inspect(item.blob,item.name,{cues:item.cues,markers:item.markers,probe,timeoutMs:4500});
  if(report.errors.length)throw Error('Contrôle qualité : '+report.errors.join(' '));
  report.fingerprint=await Q.fingerprint(item.blob);
  return report;
 }
 async function verify(entry){
  if(!entry?.blob||!(entry.blob instanceof Blob)||entry.blob.size!==entry.size)throw Error('La taille du média transféré ne correspond pas à la fiche.');
  const report=await examine(entry,entry.blob.size<200*1024*1024);
  if(entry.qa?.fingerprint&&report.fingerprint&&entry.qa.fingerprint!==report.fingerprint)throw Error('Intégrité du transfert non conforme : l’empreinte échantillonnée a changé. Aucun import réalisé.');
  if(entry.qa?.duration&&report.duration){const delta=Math.abs(entry.qa.duration-report.duration);if(delta>Math.max(.75,entry.qa.duration*.03))report.warnings.push('Durée différente entre la préparation et la réception : '+delta.toFixed(2)+' s.');}
  report.status=report.errors.length?'error':report.warnings.length?'warning':'ok';return report;
 }
 async function put(item){if(!(item.blob instanceof Blob)||!item.blob.size)throw Error('Choisissez un média non vide.');const type=kind(item.blob,item.name);if(!type)throw Error('Cut accepte ici les fichiers audio ou vidéo.');
  const bytes=item.blob.size;if(bytes>1.5*1024*1024*1024)throw Error('Ce média dépasse 1,5 Go : exportez-le normalement pour éviter la saturation du navigateur.');
  const id='av-'+Date.now().toString(36)+'-'+Array.from(crypto.getRandomValues(new Uint8Array(8))).map(n=>n.toString(16).padStart(2,'0')).join('');
  const qa=await examine(item,bytes<200*1024*1024);
  const entry={id,created:Date.now(),name:sane(item.name),type,blob:item.blob,size:bytes,cues:cleanCues(item.cues),markers:cleanMarkers(item.markers),fullText:cleanTranscript(item.fullText),project:label(item.project),origin:'Philosophal Studio audiovisuel V54.16',version:4,qa};await tx('readwrite',st=>st.put(entry));return id;
 }
 async function read(id){if(!/^av-[\da-z]+-[\da-f]{16}$/i.test(id))return null;const value=await tx('readonly',st=>st.get(id));return value&&value.blob instanceof Blob?value:null;}
 async function list(){const rows=await tx('readonly',st=>st.getAll())||[];return rows.filter(x=>x?.blob instanceof Blob && Date.now()-(x.created||0)<ageLimit).sort((a,b)=>b.created-a.created).slice(0,30);}
 async function remove(id){if(!/^av-[\da-z]+-[\da-f]{16}$/i.test(id))return;await tx('readwrite',st=>st.delete(id));}
 // V54.5 : transferts de dossiers de production. Écriture atomique : un lot ne
 // doit jamais laisser la moitié des médias après une erreur de quota.
 const batchLabel=v=>String(v||'').trim().replace(/[\x00-\x1f\x7f]/g,' ').slice(0,90);
 const makeId=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Array.from(crypto.getRandomValues(new Uint8Array(8))).map(n=>n.toString(16).padStart(2,'0')).join('');
 async function putBatch(items,meta={}){
  if(!Array.isArray(items)||!items.length||items.length>12)throw Error('Choisissez entre 1 et 12 médias par dossier.');
  const project=batchLabel(meta.project)||'Production sans titre',notes=batchLabel(meta.notes),batchId=makeId('lot');
  let total=0;const created=Date.now();
  const entries=items.map((item,index)=>{
   if(!(item.blob instanceof Blob)||!item.blob.size)throw Error('Un fichier est vide ou inaccessible.');
   const type=kind(item.blob,item.name);
   if(!type)throw Error('Format audio/vidéo non reconnu : '+item.name);
   if(item.blob.size>1.5*1024**3)throw Error('Fichier supérieur à 1,5 Go : '+item.name);
   total+=item.blob.size;
   return {id:makeId('av'),created:created+index,name:sane(item.name),type,blob:item.blob,size:item.blob.size,
     cues:cleanCues(item.cues),markers:cleanMarkers(item.markers),fullText:cleanTranscript(item.fullText),origin:'Philosophal Studio audiovisuel V54.16',version:4,
     batchId,batchIndex:index,batchCount:items.length,project,notes};
  });
  if(total>2*1024**3)throw Error('Ce lot dépasse 2 Go. Transférez en plusieurs groupes ou utilisez des fichiers sur disque.');
  // Vérification préalable à la transaction : le lot n'est écrit que si tous les médias passent.
  for(let i=0;i<entries.length;i++)entries[i].qa=await examine(entries[i],false);
  await tx('readwrite',st=>{let last;for(const entry of entries)last=st.put(entry);return last});
  return {batchId,ids:entries.map(e=>e.id),count:entries.length,bytes:total};
 }
 async function listAll(){const rows=await tx('readonly',st=>st.getAll())||[];
  return rows.filter(x=>x?.blob instanceof Blob&&Date.now()-(x.created||0)<ageLimit)
   .sort((a,b)=>b.created-a.created).slice(0,150);
 }
 async function listBatch(batchId){if(!/^lot-[\da-z]+-[\da-f]{16}$/i.test(batchId))return[];
  return (await listAll()).filter(e=>e.batchId===batchId).sort((a,b)=>a.batchIndex-b.batchIndex);
 }
 async function removeMany(ids){const safe=[...new Set(ids)].filter(id=>/^av-[\da-z]+-[\da-f]{16}$/i.test(id));
  if(!safe.length)return;await tx('readwrite',st=>{let last;for(const id of safe)last=st.delete(id);return last;});
 }
 function timedText(raw){
  const lines=String(raw||'').replace(/^\uFEFF/,'').replace(/\r/g,'').split(/\n\s*\n/);
  const seconds=x=>{const p=x.replace(',','.').trim().split(':').map(Number);return p.length===3&&p.every(Number.isFinite)?p[0]*3600+p[1]*60+p[2]:p.length===2&&p.every(Number.isFinite)?p[0]*60+p[1]:NaN};
  const out=[];for(const b of lines){const a=b.split('\n'),i=a.findIndex(x=>x.includes('-->'));if(i<0)continue;
   const match=a[i].match(/(\d{1,2}:\d{2}:\d{2}[.,]\d{1,3}|\d{2}:\d{2}[.,]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[.,]\d{1,3}|\d{2}:\d{2}[.,]\d{1,3})/);
   if(!match)continue;const text=a.slice(i+1).join(' ').replace(/<[^>]*>/g,'').trim();out.push({start:seconds(match[1]),end:seconds(match[2]),text});
  }return cleanCues(out);
 }
 const META_DB='philosophal-av-cut-fiches-v5415',META_STORE='fiches';
 async function metadataTx(mode,fn){const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(META_DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(META_STORE))r.result.createObjectStore(META_STORE,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Bibliothèque des fiches inaccessible'));r.onblocked=()=>reject(Error('Un onglet bloque la bibliothèque de fiches'));});
  return new Promise((resolve,reject)=>{let req;try{const t=db.transaction(META_STORE,mode);req=fn(t.objectStore(META_STORE));t.oncomplete=()=>{db.close();resolve(req?.result)};t.onabort=t.onerror=()=>{const err=t.error||Error('Enregistrement de la fiche impossible');db.close();reject(err)};}catch(e){db.close();reject(e)}});
 }
 async function saveDossier(entry){if(!entry||!(entry.blob instanceof Blob)||!/^av-[\da-z]+-[\da-f]{16}$/i.test(entry.id))throw Error('Transfert invalide');
  const record={id:entry.id,created:Date.now(),sourceCreated:entry.created||Date.now(),name:sane(entry.name),size:entry.blob.size,type:kind(entry.blob,entry.name),project:label(entry.project),batchId:entry.batchId||null,cues:cleanCues(entry.cues),markers:cleanMarkers(entry.markers),fullText:cleanTranscript(entry.fullText),source:'Studio audiovisuel',schema:2,qa:entry.qa||null};
  // Retain the index and metadata only. Never duplicate the video/audio Blob in the library.
  await metadataTx('readwrite',st=>st.put(record));return record;
 }
 async function listDossiers(){const all=await metadataTx('readonly',st=>st.getAll())||[];return all.sort((a,b)=>(b.created||0)-(a.created||0)).slice(0,300)}
 async function deleteDossier(id){if(!/^av-[\da-z]+-[\da-f]{16}$/i.test(id))throw Error('Fiche invalide');await metadataTx('readwrite',st=>st.delete(id));}
 window.PhilosophalAVCutBridge={put,read,list,remove,makeSrt,cleanCues,cleanMarkers,cleanTranscript,asFile,kind,sane,putBatch,listAll,listBatch,removeMany,timedText,saveDossier,listDossiers,deleteDossier,examine,verify};
})();