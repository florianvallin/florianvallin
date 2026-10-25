/* Philosophal V54.10 : coffre de sauvegarde professionnel portable.
 * Sans serveur, sans suppression silencieuse des travaux existants. */
(()=>{'use strict';
 const $=id=>document.getElementById(id), L=window.PhilosophalMediaLibrary549;
 const MAX_OUT=300*1024*1024, MAX_IN=350*1024*1024, MAX_ENTRY=250*1024*1024;
 const DB_NAME='philosophal-studio-projects-v10', STORE='projects';
 const FORMAT='philosophal-pro-backup', VERSION=1, REF='__phbackup_v5410__';
 const allowCut=k=>/^(?:philosophal-cut-|pcut-|philosophal\.cut\.)/i.test(k)&&!/password|token|secret|auth|private|access|vault|handoff|session|credential/i.test(k);
 const pretty=n=>n>=1073741824?(n/1073741824).toFixed(2)+' Go':n>=1048576?(n/1048576).toFixed(1)+' Mo':(n/1024).toFixed(0)+' Ko';
 const status=(id,t,error=false)=>{const e=$(id);e.textContent=t;e.className='status'+(error?' error':' ok');};
 const id=()=>crypto?.randomUUID?.()||'ph-'+Date.now()+'-'+Math.random().toString(36).slice(2);
 const date=()=>new Date().toISOString().slice(0,19).replace('T','_').replace(/:/g,'-');
 const safeName=v=>String(v||'Projet').replace(/[\u0000-\u001f<>:"/\\|?*]/g,' ').trim().slice(0,100)||'Projet';
 const req=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||new Error('Accès au stockage impossible.'));});
 const readCut=()=>{const r={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(allowCut(k)){const v=localStorage.getItem(k);if(v!==null&&v.length<3*1024*1024)r[k]=v;}}return r;};
 let projects=[],media=[],cutEntries={},loadedArchive=null,working=false,unlocked=false;
 async function openStudio(create=false){return new Promise((resolve,reject)=>{
   const r=indexedDB.open(DB_NAME);let missing=false;
   r.onupgradeneeded=()=>{if(!create){missing=true;r.transaction.abort();return;}const db=r.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('updatedAt','updatedAt');}};
   r.onsuccess=()=>{let db=r.result;if(!db.objectStoreNames.contains(STORE)){db.close();resolve(null);}else resolve(db);};
   r.onerror=()=>missing?resolve(null):reject(r.error||Error('Lecture Studio impossible.'));
   r.onblocked=()=>reject(Error('Ferme les autres onglets Studio, puis réessaie.'));
 });}
 async function studioList(){const db=await openStudio(false);if(!db)return [];try{return await req(db.transaction(STORE,'readonly').objectStore(STORE).getAll());}finally{db.close();}}
 async function studioPut(record){let db=await openStudio(true);if(!db)throw Error('Bibliothèque Studio inaccessible.');try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');const st=tx.objectStore(STORE),r=st.put(record);r.onerror=()=>reject(r.error);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Import Studio interrompu.'));});}finally{db.close()}}
 function cutCount(){return Object.keys(cutEntries).length;}
 function drawItems(items,place,prefix,type){const area=$(place);area.replaceChildren();for(const x of items){const div=document.createElement('div');div.className='item';const lab=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.className='entry-select';check.checked=true;check.dataset.kind=type;check.dataset.id=x.id;lab.append(check,document.createTextNode(x.name||x.original||'Sans titre'));const bytes=document.createElement('span');bytes.textContent=pretty(Number(x.size)||0);div.append(lab,bytes);area.append(div);}if(!items.length){const p=document.createElement('p');p.className='item';p.textContent='Aucun '+prefix+' enregistré.';area.append(p)}}
 const selected=(type)=>[...document.querySelectorAll('.entry-select:checked')].filter(x=>x.dataset.kind===type).map(x=>x.dataset.id);
 function calcSelection(){const sp=$('includeStudio').checked?new Set(selected('studio')):new Set(),md=$('includeMedia').checked?new Set(selected('media')):new Set();let total=0;for(const p of projects)if(sp.has(p.id))total+=Number(p.size)||0;for(const m of media)if(md.has(m.id))total+=Number(m.size)||0;const cut=$('includeCut').checked?Object.values(cutEntries).reduce((sum,s)=>sum+s.length*2,0):0;total+=cut;const n=$('selectedSize');n.textContent=pretty(total);n.style.color=total>MAX_OUT?'#ffb5ad':'';return total;}
 async function refresh(){if(!unlocked)return;projects=await studioList();media=await L.list();cutEntries=readCut();$('projectCount').textContent=projects.length;$('mediaCount').textContent=media.length;
   $('studioSize').textContent=pretty(projects.reduce((s,x)=>s+(x.size||0),0));$('mediaSize').textContent=pretty(media.reduce((s,x)=>s+(x.size||0),0));$('cutCount').textContent=cutCount()+' clé(s)';
   drawItems(projects,'studioItems','projet','studio');drawItems(media,'mediaItems','média','media');
   try{const q=await navigator.storage.estimate();$('quotaUsage').textContent=pretty(q.usage||0)+' / '+pretty(q.quota||0);}catch{$('quotaUsage').textContent='Indisponible'}calcSelection();}
 function makeEncoder(zip,info){const files=info.files,known=new WeakMap();let bytes=0,seq=0;
 async function saveBlob(blob,mime,filename){if(known.has(blob))return known.get(blob);if(blob.size>MAX_ENTRY)throw Error('Un fichier dépasse 250 Mo. Exporte-le séparément : '+(filename||'média'));
   if(bytes+blob.size>MAX_OUT)throw Error('Sélection supérieure à 300 Mo. Désélectionne certains médias ou projets pour faire plusieurs archives.');
   const path='donnees/media-'+String(++seq).padStart(5,'0')+'.bin';const ref={path,size:blob.size,mime:mime||blob.type||'',filename:filename||''};
   files.push(ref);bytes+=blob.size;zip.file(path,blob,{binary:true,compression:'STORE',createFolders:false});known.set(blob,path);return path;
 }
 let depth=0;
 async function encode(value){if(depth++>40)throw Error('Projet trop complexe.');try{
   if(value===undefined)return {[REF]:'undefined'};
   if(typeof value==='bigint')return {[REF]:'bigint',value:String(value)};
   if(value instanceof Blob){const path=await saveBlob(value,value.type,value instanceof File?value.name:'');return {[REF]:'blob',path,mime:value.type||'',filename:value instanceof File?value.name:null,modified:value instanceof File?value.lastModified:null};}
   if(value instanceof Date)return {[REF]:'date',value:value.toISOString()};
   if(value instanceof ArrayBuffer){const path=await saveBlob(new Blob([value]),'application/octet-stream');return {[REF]:'buffer',path};}
   if(ArrayBuffer.isView(value)){const path=await saveBlob(new Blob([value]),'application/octet-stream');return {[REF]:'view',path,constructor:value.constructor.name};}
   if(Array.isArray(value)){const out=[];for(const x of value)out.push(await encode(x));return out;}
   if(value&&typeof value==='object'){const out=Object.create(null);for(const [k,v]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(k))continue;out[k]=await encode(v);}return out;}
   if(typeof value==='number'&&!Number.isFinite(value))return {[REF]:'number',value:String(value)};
   return value;
 }finally{depth--;}}
 return {saveBlob,encode,bytes:()=>bytes};}
 async function exportAll(){if(working)return;working=true;$('makeBackup').disabled=true;$('exportProgress').hidden=false;
 try{const total=calcSelection();if(!total)throw Error('Aucune donnée sélectionnée.');if(total>MAX_OUT)throw Error('Trop de données pour une seule archive (limite 300 Mo). Sélectionne moins de fichiers.');
   if(!window.JSZip)throw Error('Bibliothèque ZIP locale indisponible.');const zip=new JSZip();
   const manifest={format:FORMAT,version:VERSION,exportedAt:new Date().toISOString(),studio:[],media:[],cut:{},files:[]};const encoder=makeEncoder(zip,manifest);
   const ps=new Set($('includeStudio').checked?selected('studio'):[]);const ms=new Set($('includeMedia').checked?selected('media'):[]);
   let count=0;for(const p of projects.filter(p=>ps.has(p.id))){status('exportStatus','Préparation du projet : '+p.name);const safe={name:safeName(p.name),createdAt:p.createdAt,updatedAt:p.updatedAt,size:p.size,data:await encoder.encode(p.data)};const path='projets/studio-'+(++count)+'.json';zip.file(path,JSON.stringify(safe),{compression:'DEFLATE'});manifest.studio.push({name:safe.name,path});}
   count=0;for(const m of media.filter(m=>ms.has(m.id))){status('exportStatus','Préparation du média : '+m.name);const d=await L.get(m.id);if(!d)throw Error('Fichier manquant : '+m.name);const path=await encoder.saveBlob(d.blob,d.blob.type,m.original);manifest.media.push({path,original:m.original,name:m.name,notes:m.notes,collection:m.collection,favorite:!!m.favorite,size:m.size,mime:m.mime,created:m.created,source:m.source,cues:m.cues||[],modified:0});count++;}
   if($('includeCut').checked){manifest.cut=cutEntries;}
   zip.file('manifest.json',JSON.stringify(manifest),{compression:'DEFLATE'});
   const output=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:2},streamFiles:true},m=>{$('progressBar').style.width=Math.round(m.percent)+'%';});
   if(output.size>MAX_IN)throw Error('Archive trop volumineuse pour une restauration sûre. Exporte séparément certains fichiers.');
   const url=URL.createObjectURL(output),a=document.createElement('a');a.href=url;a.download='Philosophal_Sauvegarde_Pro_V54.10_'+date()+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
   status('exportStatus','Sauvegarde créée : '+pretty(output.size)+' · '+manifest.studio.length+' projet(s) · '+manifest.media.length+' média(s). Conserve ce ZIP ailleurs que dans ton navigateur.');
 }catch(e){status('exportStatus','Export impossible : '+e.message,true);}finally{working=false;$('makeBackup').disabled=false;$('exportProgress').hidden=true;$('progressBar').style.width='0';}}
 function validateManifest(m,zip){if(!m||m.format!==FORMAT||m.version!==VERSION||!Array.isArray(m.studio)||!Array.isArray(m.media)||!Array.isArray(m.files)||!m.cut||typeof m.cut!=='object')throw Error('Cette archive n’est pas une sauvegarde professionnelle compatible V54.10.');
  if(m.studio.length>500||m.media.length>4000||m.files.length>6000||Object.keys(m.cut).length>250)throw Error('Archive contenant trop de fichiers.');
  const filePaths=new Set();for(const f of m.files){if(typeof f.path!=='string'||!/^donnees\/media-[0-9]{5}\.bin$/.test(f.path)||!Number.isFinite(f.size)||f.size<0||f.size>MAX_ENTRY||!zip.file(f.path))throw Error('Fichier média manquant ou invalide.');filePaths.add(f.path);}
  for(const s of m.studio){if(!/^projets\/studio-[0-9]+\.json$/.test(s.path)||!zip.file(s.path)||typeof s.name!=='string')throw Error('Projet Studio endommagé.');}
  for(const a of m.media){if(!filePaths.has(a.path)||typeof a.original!=='string'||a.original.length>255||!a.size||a.size>MAX_ENTRY)throw Error('Média sauvegardé invalide.');}
  for(const k of Object.keys(m.cut)){if(!allowCut(k)||typeof m.cut[k]!=='string'||m.cut[k].length>3*1024*1024)throw Error('Données Cut non autorisées dans cette archive.');}
  return m;
 }
 async function preview(file){loadedArchive=null;$('restorePreview').hidden=true;if(!file)return;if(file.size>MAX_IN)throw Error('Fichier supérieur à 350 Mo : restaure plusieurs archives plus petites.');if(!window.JSZip)throw Error('Module ZIP indisponible.');
   const zip=await JSZip.loadAsync(file,{checkCRC32:file.size<=60*1024*1024});const entries=Object.keys(zip.files);if(entries.length>7000||!zip.file('manifest.json'))throw Error('Archive non reconnue ou trop complexe.');
   const mf=zip.file('manifest.json');if(mf._data?.uncompressedSize>12*1024*1024)throw Error('Manifeste ZIP trop volumineux.');
   const manifest=validateManifest(JSON.parse(await mf.async('string')),zip);
   for(const entry of manifest.studio){const item=zip.file(entry.path);if(item._data?.uncompressedSize>35*1024*1024)throw Error('Projet ZIP trop volumineux.');}
   const originals=manifest.files.reduce((n,x)=>n+x.size,0);if(originals>MAX_OUT)throw Error('L’archive contient plus de 300 Mo de médias.');
   loadedArchive={zip,manifest};$('restorePreview').hidden=false;
   const when=new Date(manifest.exportedAt);$('archiveDetails').textContent=`${Number.isFinite(when.getTime())?when.toLocaleString('fr-FR'):'Date inconnue'} · ${manifest.studio.length} projet(s) Studio · ${manifest.media.length} média(s) · ${Object.keys(manifest.cut).length} réglage(s) Cut · ${pretty(originals)} de médias.`;
   $('restoreStudio').checked=manifest.studio.length>0;$('restoreStudio').disabled=!manifest.studio.length;
   $('restoreMedia').checked=manifest.media.length>0;$('restoreMedia').disabled=!manifest.media.length;
   $('restoreCut').checked=false;$('restoreCut').disabled=!Object.keys(manifest.cut).length;
   status('restoreStatus','Archive reconnue. Choisis les éléments et lance la restauration. Rien n’est effacé automatiquement.');
 }
 async function restore(){if(working||!loadedArchive)return;working=true;$('restoreBackup').disabled=true;
 const {zip,manifest}=loadedArchive;let addedStudio=0,addedMedia=0,duplicates=0,keys=0;
 try{if(!($('restoreStudio').checked||$('restoreMedia').checked||$('restoreCut').checked))throw Error('Sélectionne une catégorie à restaurer.');
   const blobs=new Map();async function file(path){if(blobs.has(path))return blobs.get(path);const spec=manifest.files.find(x=>x.path===path);if(!spec)throw Error('Référence binaire absente : '+path);const entry=zip.file(path);if(!entry)throw Error('Fichier binaire manquant : '+path);const data=await entry.async('blob');if(data.size!==spec.size)throw Error('Fichier corrompu : '+path);const result=new Blob([data],{type:spec.mime||''});blobs.set(path,result);return result;}
   async function decode(v,depth=0){if(depth>40)throw Error('Projet trop complexe.');if(v===null||typeof v!=='object')return v;
    if(Object.prototype.hasOwnProperty.call(v,REF)){const t=v[REF];if(t==='undefined')return undefined;if(t==='bigint')return BigInt(v.value);if(t==='date')return new Date(v.value);if(t==='number')return Number(v.value);
       if(t==='blob'){const b=await file(v.path);return v.filename!==null&&typeof v.filename==='string'?new File([b],safeName(v.filename),{type:v.mime||'',lastModified:v.modified||Date.now()}):b;}
       if(t==='buffer')return (await file(v.path)).arrayBuffer();
       if(t==='view'){const b=await file(v.path);const arr=await b.arrayBuffer();const types={Uint8Array,Int8Array,Uint16Array,Int16Array,Uint32Array,Int32Array,Float32Array,Float64Array,Uint8ClampedArray,DataView};const T=types[v.constructor];if(!T)throw Error('Type binaire non pris en charge.');return new T(arr);}
       throw Error('Type de données incompatible.');}
    if(Array.isArray(v)){const a=[];for(const x of v)a.push(await decode(x,depth+1));return a;}
    const o=Object.create(null);for(const [k,x] of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Clé réservée dans un projet.');o[k]=await decode(x,depth+1);}return o;}
   if($('restoreStudio').checked)for(const meta of manifest.studio){status('restoreStatus','Restauration du projet : '+meta.name);const text=await zip.file(meta.path).async('string');if(text.length>35*1024*1024)throw Error('Projet anormalement volumineux.');const data=JSON.parse(text);if(!data||!data.data)throw Error('Projet incomplet.');const now=Date.now();const restored={id:id(),name:safeName(data.name)+' — restauré',createdAt:now,updatedAt:now,data:await decode(data.data),size:Number(data.size)||0};await studioPut(restored);addedStudio++;}
   if($('restoreMedia').checked)for(const meta of manifest.media){status('restoreStatus','Restauration du média : '+meta.name);const blob=await file(meta.path);if(blob.size!==meta.size)throw Error('Taille du média incohérente.');const original=safeName(meta.original);const name=original.match(/\.(wav|mp3|m4a|aac|ogg|opus|flac|mp4|m4v|mov|mkv|webm|avi|png|jpe?g|webp|gif|bmp|avif)$/i)?original:'media.wav';const f=new File([blob],name,{type:meta.mime||blob.type,lastModified:meta.modified||0});const result=await L.add(f,{name,collection:meta.collection||'Sans classement',notes:meta.notes||'',source:meta.source||'Restauration',cues:meta.cues||[]});if(result.duplicate){duplicates++;continue;}addedMedia++;await L.change(result.meta.id,{name:meta.name||meta.original,collection:meta.collection||'Sans classement',notes:meta.notes||'',favorite:!!meta.favorite});}
   if($('restoreCut').checked)for(const [k,v] of Object.entries(manifest.cut)){if(!allowCut(k)||localStorage.getItem(k)!==null)continue;localStorage.setItem(k,v);keys++;}
   status('restoreStatus',`Restauration terminée : ${addedStudio} projet(s), ${addedMedia} média(s), ${duplicates} doublon(s) ignoré(s), ${keys} réglage(s) Cut récupéré(s). Rouvre les logiciels pour voir les données.`);await refresh();
 }catch(e){status('restoreStatus',`Restauration interrompue : ${e.message}. Déjà importés : ${addedStudio} projet(s), ${addedMedia} média(s). Les éléments existants n’ont pas été supprimés.`,true);}finally{working=false;$('restoreBackup').disabled=false;}}
 function updateGate(){const api=window.FV_PRIVATE_ACCESS;let ok=false;try{ok=api?.role()==='private'||sessionStorage.getItem('philosophal-invoice-entry-v1')==='alo-2026';}catch{}
   unlocked=ok;$('gate').hidden=ok;$('workspace').hidden=!ok;
   if(ok)refresh().catch(e=>status('exportStatus','Impossible de lire le stockage : '+e.message,true));}
 $('proLogin').addEventListener('submit',async e=>{e.preventDefault();const api=window.FV_PRIVATE_ACCESS;try{const role=await api.unlockRole($('proPassword').value,true);if(role==='private')updateGate();else $('gateError').textContent='Accès professionnel nécessaire.';}catch(e){$('gateError').textContent=e.message||'Identification impossible.';}finally{$('proPassword').value='';}});
 ['includeStudio','includeMedia','includeCut','studioItems','mediaItems'].forEach(k=>$(k).addEventListener('change',calcSelection));
 $('refresh').addEventListener('click',()=>refresh().catch(e=>status('exportStatus',e.message,true)));
 $('makeBackup').addEventListener('click',exportAll);$('restoreBackup').addEventListener('click',restore);
 $('backupFile').addEventListener('change',e=>{const file=e.target.files?.[0];status('restoreStatus','Ouverture de la sauvegarde…');preview(file).catch(err=>{loadedArchive=null;$('restorePreview').hidden=true;status('restoreStatus',err.message,true)});});
 window.addEventListener('philosophal:unlocked',updateGate);window.addEventListener('pageshow',()=>Promise.resolve(window.FV_PRIVATE_ACCESS?.ready).then(updateGate));
 Promise.resolve(window.FV_PRIVATE_ACCESS?.ready).then(updateGate).catch(()=>{$('gate').hidden=false;$('gateError').textContent='Service d’accès privé indisponible.';});
})();