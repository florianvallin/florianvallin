/* Philosophal V54.9 — bibliothèque professionnelle locale partagée.
   Les métadonnées sont distinctes des Blob pour garder les recherches rapides. */
(()=>{'use strict';
 const DB='philosophal-mediatheque-production-v549', VERSION=2, META='medias', DATA='fichiers', THUMBS='vignettes';
 const LIMIT=1024**3; // chaque média : 1 Gio maximum (quotas navigateur indépendants)
 const VALID=/\.(wav|mp3|m4a|aac|ogg|opus|flac|mp4|m4v|mov|mkv|webm|avi|png|jpe?g|webp|gif|bmp|avif)$/i;
 const cleanup=(value,max=120)=>String(value??'').replace(/[\x00-\x1f\x7f]/g,' ').trim().slice(0,max);
 const filename=(name)=>cleanup(name,200).replace(/[\\/:*?"<>|]/g,'-')||'media-philosophal';
 const kind=(file)=>{
  const n=file?.name||'',t=file?.type||'';
  if(/^video\//.test(t)||/\.(mp4|m4v|mov|mkv|webm|avi)$/i.test(n))return 'video';
  if(/^audio\//.test(t)||/\.(wav|mp3|m4a|aac|ogg|opus|flac)$/i.test(n))return 'audio';
  if(/^image\//.test(t)||/\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(n))return 'image';
  return null;
 };
 const id=()=> 'lib-'+Date.now().toString(36)+'-'+Array.from(crypto.getRandomValues(new Uint8Array(9))).map(n=>n.toString(16).padStart(2,'0')).join('');
 function open(){return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(Error('IndexedDB non disponible.'));
  const r=indexedDB.open(DB,VERSION);
  r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(META)){const s=db.createObjectStore(META,{keyPath:'id'});s.createIndex('fingerprint','fingerprint',{unique:false});s.createIndex('collection','collection',{unique:false});}if(!db.objectStoreNames.contains(DATA))db.createObjectStore(DATA);if(!db.objectStoreNames.contains(THUMBS))db.createObjectStore(THUMBS);const meta=r.transaction.objectStore(META);if(!meta.indexNames.contains('size'))meta.createIndex('size','size',{unique:false});};
  r.onerror=()=>reject(r.error||Error('Impossible d’ouvrir la bibliothèque.'));
  r.onblocked=()=>reject(Error('Fermez les autres onglets qui bloquent cette bibliothèque.'));
  r.onsuccess=()=>resolve(r.result);
 });}
 async function operation(stores,mode,run){const db=await open();return new Promise((resolve,reject)=>{let output;let tx;
  try{tx=db.transaction(stores,mode);output=run(tx);}catch(e){db.close();reject(e);return;}
  tx.oncomplete=()=>{db.close();resolve(output)};
  tx.onerror=()=>{const e=tx.error;db.close();reject(e||Error('Accès au stockage impossible.'))};
  tx.onabort=()=>{const e=tx.error;db.close();reject(e||Error('Écriture interrompue, peut-être faute d’espace.'))};
 });}
 function request(st,method,arg){return new Promise((resolve,reject)=>{let req;try{req=st[method](arg)}catch(e){reject(e);return}req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});}
 async function list(){const db=await open();try{return await request(db.transaction(META).objectStore(META),'getAll')}finally{db.close()}}
 async function get(id){const db=await open();try{const tr=db.transaction([META,DATA]);const [meta,blob]=await Promise.all([request(tr.objectStore(META),'get',id),request(tr.objectStore(DATA),'get',id)]);return meta&&blob instanceof Blob?{meta,blob}:null;}finally{db.close()}}
 // Vérification exacte par tranches : pas de hash partiel confondu avec une preuve.
 // Les fichiers anciens (V54.9–V54.11) sont directement compatibles.
 const CHUNK=256*1024;
 async function sameRange(a,b,from,to){
  const [xa,xb]=await Promise.all([a.slice(from,to).arrayBuffer(),b.slice(from,to).arrayBuffer()]);
  const aa=new Uint8Array(xa),bb=new Uint8Array(xb);
  if(aa.length!==bb.length)return false;
  for(let i=0;i<aa.length;i++)if(aa[i]!==bb[i])return false;
  return true;
 }
 async function sameBytes(a,b){
  if(a.size!==b.size)return false;
  if(a===b)return true;
  const sz=a.size,sample=Math.min(16384,sz);
  if(!(await sameRange(a,b,0,sample)))return false;
  if(sz>sample*2&&!(await sameRange(a,b,Math.floor((sz-sample)/2),Math.floor((sz-sample)/2)+sample)))return false;
  if(sz>sample&&!(await sameRange(a,b,sz-sample,sz)))return false;
  for(let p=0,n=0;p<sz;p+=CHUNK,n++){
   if(!(await sameRange(a,b,p,Math.min(p+CHUNK,sz))))return false;
   if(n%12===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  return true;
 }
 async function sameSized(size){const db=await open();try{return await request(db.transaction(META).objectStore(META).index('size'),'getAll',size)}finally{db.close()}}
 async function findExactDuplicate(blob){
  const candidates=await sameSized(blob.size);
  for(const candidate of candidates){const data=await get(candidate.id);if(data&&await sameBytes(blob,data.blob))return candidate;}
  return null;
 }
 async function duplicateGroups(progress=()=>{},isCancelled=()=>false){
  const all=await list(),sizeGroups=new Map(),matches=[];
  for(const meta of all){if(!sizeGroups.has(meta.size))sizeGroups.set(meta.size,[]);sizeGroups.get(meta.size).push(meta);}
  const candidates=[...sizeGroups.values()].filter(g=>g.length>1);
  let i=0;
  for(const batch of candidates){
   if(isCancelled())throw Error('Recherche des doublons interrompue.');
   const groups=[];
   for(const m of batch){
    if(isCancelled())throw Error('Recherche des doublons interrompue.');
    const data=await get(m.id);if(!data)continue;
    let found=false;
    for(const group of groups){const original=await get(group[0].id);if(original&&await sameBytes(data.blob,original.blob)){group.push(m);found=true;break;}}
    if(!found)groups.push([m]);
   }
   matches.push(...groups.filter(g=>g.length>1));
   progress(++i,candidates.length,matches);
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  return matches;
 }
 async function thumbGet(key){const db=await open();try{return await request(db.transaction(THUMBS).objectStore(THUMBS),'get',key)}finally{db.close()}}
 async function thumbPut(key,blob){if(!(blob instanceof Blob)||blob.size>200*1024)return;
  await operation([THUMBS],'readwrite',tx=>tx.objectStore(THUMBS).put(blob,key));
 }
 function canvasBlob(canvas){return new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.71));}
 async function createThumb(meta){
  if(!meta||meta.type==='audio'||(meta.type==='video'&&meta.size>300*1024*1024))return null;
  const existing=await thumbGet(meta.id);if(existing instanceof Blob)return existing;
  const data=await get(meta.id);if(!data)return null;
  const canvas=document.createElement('canvas');canvas.width=120;canvas.height=80;
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return null;
  let source=null,url=null,bitmap=null;
  try{
   if(meta.type==='image'){
    if('createImageBitmap'in window){bitmap=await createImageBitmap(data.blob);source=bitmap;}
    else{url=URL.createObjectURL(data.blob);source=new Image();source.src=url;await source.decode();}
   }else if(meta.type==='video'){
    url=URL.createObjectURL(data.blob);
    source=document.createElement('video');source.preload='metadata';source.muted=true;source.playsInline=true;
    const loaded=new Promise((resolve,reject)=>{
     let timer=setTimeout(()=>reject(Error('Prévisualisation vidéo indisponible.')),6000);
     const finish=(error)=>{clearTimeout(timer);error?reject(error):resolve()};
     source.addEventListener('error',()=>finish(Error('Codec non pris en charge.')),{once:true});
     source.addEventListener('loadeddata',()=>{
      if(!Number.isFinite(source.duration)||source.duration<.4){finish();return;}
      const seek=Math.min(.5,source.duration/3);
      source.addEventListener('seeked',()=>finish(),{once:true});
      try{source.currentTime=seek}catch{finish()}
     },{once:true});
    });
    source.src=url;await loaded;
   }else return null;
   const w=source.videoWidth||source.naturalWidth||source.width,h=source.videoHeight||source.naturalHeight||source.height;
   if(!w||!h)return null;
   ctx.fillStyle='#182538';ctx.fillRect(0,0,120,80);
   const ratio=Math.min(120/w,80/h),nw=w*ratio,nh=h*ratio;
   ctx.drawImage(source,(120-nw)/2,(80-nh)/2,nw,nh);
   const blob=await canvasBlob(canvas);if(blob)await thumbPut(meta.id,blob);
   return blob;
  }finally{try{bitmap?.close()}catch{}try{source?.pause?.();source?.removeAttribute?.('src');source?.load?.()}catch{}if(url)URL.revokeObjectURL(url)}
 }
 async function add(file,options={}){
  if(!(file instanceof Blob)||!file.size)throw Error('Le média est vide ou inaccessible.');
  if(file.size>LIMIT)throw Error('Fichier supérieur à 1 Go : importez-le directement dans Cut plutôt que dans le stockage navigateur.');
  const original=filename(options.name||file.name||'Enregistrement.wav'),type=kind({type:file.type,name:original});
  if(!type||!VALID.test(original))throw Error('Format non pris en charge : '+original);
  const fingerprint=original.toLowerCase()+'|'+file.size+'|'+(file.lastModified||0);
  const existing=await findExactDuplicate(file);
  if(existing)return {meta:existing,duplicate:true};
  await preflight(file.size);
  const cues=(type==='audio'||type==='video')&&Array.isArray(options.cues)?options.cues.slice(0,15000).map(c=>({start:Number(c.start),end:Number(c.end),text:cleanup(c.text,700)})).filter(c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&c.text):[];
  const meta={id:id(),original,name:original,size:file.size,mime:file.type||'',type,collection:cleanup(options.collection||'Sans classement',60)||'Sans classement',notes:cleanup(options.notes,250),favorite:false,created:Date.now(),updated:Date.now(),source:cleanup(options.source||'Import manuel',60),fingerprint,cues};
  await operation([META,DATA],'readwrite',tx=>{tx.objectStore(META).put(meta);tx.objectStore(DATA).put(file,meta.id)});
  return {meta,duplicate:false};
 }
 async function change(mediaId,patch){const db=await open();let current;
  try{current=await request(db.transaction(META).objectStore(META),'get',mediaId)}finally{db.close()}
  if(!current)throw Error('Média introuvable.');
  if('collection'in patch)current.collection=cleanup(patch.collection,60)||'Sans classement';
  if('name'in patch)current.name=cleanup(patch.name,150)||current.original;
  if('notes'in patch)current.notes=cleanup(patch.notes,250);
  if('favorite'in patch)current.favorite=Boolean(patch.favorite);
  current.updated=Date.now();
  await operation([META],'readwrite',tx=>tx.objectStore(META).put(current));return current;
 }
 async function deleteMany(ids){const a=[...new Set(ids)].filter(x=>/^lib-[a-z0-9]+-[a-f0-9]{18}$/i.test(x));
  if(!a.length)return;await operation([META,DATA,THUMBS],'readwrite',tx=>{for(const key of a){tx.objectStore(META).delete(key);tx.objectStore(DATA).delete(key);tx.objectStore(THUMBS).delete(key)}});
 }
 // V54.17 — aucune lecture intégrale des gros médias en RAM ;
 // les fichiers sont conservés comme Blob dans IndexedDB.
 const storage=async()=>{try{return await navigator.storage?.estimate?.()||null}catch{return null}};
 async function preflight(bytes,{strict=true}={}){
  const requested=Math.max(0,Number(bytes)||0),estimate=await storage();
  const remain=estimate?.quota!=null&&estimate?.usage!=null?Math.max(0,estimate.quota-estimate.usage):null;
  const margin=Math.max(32*1024**2,Math.min(192*1024**2,requested*.12));
  const ok=remain===null||remain>=requested+margin;
  const verdict={ok,requested,remain,margin,estimate,approximate:true};
  if(!ok&&strict)throw Error('Espace local probablement insuffisant : '+Math.round(requested/1048576)+' Mo à ajouter. Sauvegardez sur disque, libérez du stockage ou importez directement dans Cut.');
  return verdict;
 }
 async function storageSummary(){
  const records=await list(),estimate=await storage();
  let bytes=0;for(const x of records)bytes+=Math.max(0,Number(x.size)||0);
  return {count:records.length,mediaBytes:bytes,estimate,
   available:estimate?.quota!=null&&estimate?.usage!=null?Math.max(0,estimate.quota-estimate.usage):null};
 }
 async function requestPersistence(){
  if(!navigator.storage?.persist) return {supported:false,granted:false};
  const granted=await navigator.storage.persist();
  return {supported:true,granted};
 }
 async function addBatch(files,options={}){
  const items=Array.from(files||[]);
  const stats={total:items.length,completed:0,added:0,duplicates:0,skipped:0,failed:0,cancelled:false,bytesAdded:0,errors:[]};
  const progress=typeof options.onProgress==='function'?options.onProgress:()=>{};
  const signal=options.signal;
  // Avant de traiter les fichiers : estimation sans charger les Blobs en mémoire.
  const totalBytes=items.reduce((n,x)=>n+(x instanceof Blob?x.size:0),0);
  const upfront=await preflight(totalBytes,{strict:false});
  progress({...stats,phase:'preflight',totalBytes,storage:upfront});
  for(let i=0;i<items.length;i++){
   if(signal?.aborted){stats.cancelled=true;break;}
   const file=items[i];
   progress({...stats,phase:'processing',index:i+1,name:file?.name||'',bytes:file?.size||0});
   try{
    if(!(file instanceof Blob)||!file.size){stats.skipped++;continue;}
    const perFile=await preflight(file.size,{strict:false});
    if(!perFile.ok){stats.failed++;stats.errors.push({name:file.name||'Média',error:'Espace insuffisant selon le navigateur.'});continue;}
    const collection=typeof options.collectionForFile==='function'?options.collectionForFile(file):options.collection;
    const result=await add(file,{name:file.name,source:options.source,collection});
    if(result.duplicate)stats.duplicates++;
    else{stats.added++;stats.bytesAdded+=file.size;}
   }catch(error){stats.failed++;stats.errors.push({name:file?.name||'Média',error:error?.message||String(error)});}
   finally{
    stats.completed++;
    progress({...stats,phase:'progress',index:i+1,name:file?.name||'',bytes:file?.size||0});
    // Préserve la réactivité des boutons (annulation entre deux fichiers).
    await new Promise(resolve=>setTimeout(resolve,0));
   }
  }
  stats.cancelled=stats.cancelled||!!signal?.aborted;
  progress({...stats,phase:'done'});
  return stats;
 }

 window.PhilosophalMediaLibrary549={list,get,add,change,deleteMany,storage,kind,filename,findExactDuplicate,duplicateGroups,createThumb,preflight,storageSummary,requestPersistence,addBatch};
})();
