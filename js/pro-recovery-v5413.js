/* Philosophal V54.13 : points locaux de restauration (IndexedDB, sans réseau).
   Les copies automatiques ne remplacent JAMAIS les exports de sauvegarde sur disque.
   Une restauration Studio est additive ; une restauration Cut nécessite une confirmation explicite. */
(()=>{'use strict';
const DB='philosophal-pro-recovery-v5413', META='points', PAY='donnees', VERSION=1;
const STUDIO_DB='philosophal-studio-projects-v10', STUDIO_STORE='projects';
const MAX_STUDIO=30*1048576, MAX_MEDIA=25*1048576, MAX_TOTAL=220*1048576;
const MIN_AUTO=15*60*1000;
const busy=new Set();
const uid=()=>crypto.randomUUID?.()||('r-'+Date.now()+'-'+Math.random().toString(36).slice(2));
const fmt=n=>n>=1048576?(n/1048576).toFixed(1)+' Mo':Math.max(1,Math.round(n/1024))+' Ko';
const req=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Stockage inaccessible'));});
const safe=s=>String(s||'Sans titre').replace(/[\u0000-\u001f<>:"/\\|?*]/g,' ').trim().slice(0,110)||'Sans titre';
const cutAllowed=k=>/^(?:philosophal-cut-|pcut-|philosophal\.cut\.)/i.test(k)&&!/password|token|secret|auth|private|access|vault|handoff|session|credential/i.test(k);
function open(name,ver,upgrade){return new Promise((resolve,reject)=>{const r=ver?indexedDB.open(name,ver):indexedDB.open(name);r.onupgradeneeded=()=>upgrade?.(r.result,r.transaction);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('IndexedDB inaccessible'));r.onblocked=()=>reject(Error('Ferme les autres onglets Philosophal, puis réessaie.'));});}
const db=()=>open(DB,VERSION,base=>{if(!base.objectStoreNames.contains(META)){const st=base.createObjectStore(META,{keyPath:'id'});st.createIndex('createdAt','createdAt');st.createIndex('sourceKey','sourceKey');}if(!base.objectStoreNames.contains(PAY))base.createObjectStore(PAY);});
function tx(base,stores,mode,action){return new Promise((resolve,reject)=>{let tr,result;try{tr=base.transaction(stores,mode);result=action(tr);}catch(e){reject(e);return;}tr.oncomplete=()=>resolve(result);tr.onerror=()=>reject(tr.error||Error('Écriture IndexedDB impossible'));tr.onabort=()=>reject(tr.error||Error('Transaction annulée'));});}
async function list(){const base=await db();try{return await req(base.transaction(META).objectStore(META).getAll()).then(a=>a.sort((a,b)=>b.createdAt-a.createdAt));}finally{base.close();}}
async function get(pointId){const base=await db();try{const tr=base.transaction([META,PAY]);const [meta,payload]=await Promise.all([req(tr.objectStore(META).get(pointId)),req(tr.objectStore(PAY).get(pointId))]);return meta&&payload?{meta,payload}:null;}finally{base.close();}}
async function remove(pointId){const base=await db();try{await tx(base,[META,PAY],'readwrite',tr=>{tr.objectStore(META).delete(pointId);tr.objectStore(PAY).delete(pointId);});}finally{base.close();}}
async function studioOpen(create=false){return open(STUDIO_DB,1,(base,tran)=>{if(!base.objectStoreNames.contains(STUDIO_STORE)){let st=base.createObjectStore(STUDIO_STORE,{keyPath:'id'});st.createIndex('updatedAt','updatedAt');}});}
async function studioRead(id){const base=await studioOpen();try{if(!base.objectStoreNames.contains(STUDIO_STORE))return null;return await req(base.transaction(STUDIO_STORE).objectStore(STUDIO_STORE).get(id));}finally{base.close();}}
async function studioList(){const base=await studioOpen();try{if(!base.objectStoreNames.contains(STUDIO_STORE))return [];return await req(base.transaction(STUDIO_STORE).objectStore(STUDIO_STORE).getAll());}finally{base.close();}}
async function studioPut(record){const base=await studioOpen(true);try{await tx(base,STUDIO_STORE,'readwrite',tr=>tr.objectStore(STUDIO_STORE).put(record));}finally{base.close();}}
const sizeOf=(value)=>{const visited=new WeakSet(),blobSeen=new WeakSet();let size=0;function walk(v,depth){if(depth>50||v==null)return;if(v instanceof Blob){if(!blobSeen.has(v)){blobSeen.add(v);size+=v.size;}return;}if(typeof v==='string'){size+=v.length*2;return;}if(typeof v!=='object'||visited.has(v))return;visited.add(v);if(ArrayBuffer.isView(v)){size+=v.byteLength;return;}if(v instanceof ArrayBuffer){size+=v.byteLength;return;}for(const p of Object.values(v))walk(p,depth+1);}walk(value,0);return size;};
function cutData(){const out={};let size=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!cutAllowed(k))continue;const v=localStorage.getItem(k);if(v!==null&&v.length<3*1048576){size+=v.length*2;if(size>12*1048576)throw Error('Données Cut trop volumineuses pour un point local ; exporte un projet JSON.');out[k]=v;}}return out;}
async function add(kind,sourceKey,name,reason,payload,size,forced){const key=kind+':'+sourceKey;if(busy.has(key))return {skipped:true,reason:'Création déjà en cours'};
 busy.add(key);try{const now=Date.now(),history=await list(),previous=history.find(x=>x.sourceKey===key);
 if(!forced&&previous&&now-previous.createdAt<MIN_AUTO)return {skipped:true,reason:'Point récent déjà disponible'};
 if(size<=0)return {skipped:true,reason:'Aucune donnée à sauvegarder'};
 if(size>(kind==='media'?MAX_MEDIA:kind==='studio'?MAX_STUDIO:12*1048576))throw Error('Données trop volumineuses ('+fmt(size)+'). Exporte ce fichier/projet sur disque avant de le modifier ou supprimer.');
 const candidates=history.filter(x=>x.reason==='Automatique'&&x.sourceKey===key).sort((a,b)=>b.createdAt-a.createdAt).slice(3);
 const reclaim=candidates.reduce((sum,x)=>sum+x.size,0),total=history.reduce((sum,x)=>sum+x.size,0);
 if(total-reclaim+size>MAX_TOTAL)throw Error('Espace des points de restauration atteint (220 Mo). Télécharge une sauvegarde ZIP et supprime d’anciens points depuis cette page.');
 const meta={id:uid(),kind,sourceKey:key,name:safe(name),reason,createdAt:now,size};
 const base=await db();try{await tx(base,[META,PAY],'readwrite',tr=>{tr.objectStore(META).put(meta);tr.objectStore(PAY).put(payload,meta.id);for(const old of candidates){tr.objectStore(META).delete(old.id);tr.objectStore(PAY).delete(old.id);}});}finally{base.close();}
 window.dispatchEvent(new CustomEvent('philosophal:recovery-updated',{detail:{kind,reason}}));return {point:meta};
 }finally{busy.delete(key);}}
async function checkpointStudio(recordOrId,{reason='Automatique',forced=false}={}){const record=typeof recordOrId==='string'?await studioRead(recordOrId):recordOrId;
 if(!record||!record.id||!record.data)throw Error('Projet Studio non encore sauvegardé. Enregistre-le avant de créer un point de restauration.');
 return add('studio',record.id,record.name,reason,record,sizeOf(record.data)+1000,forced);
}
async function checkpointMedia(ids,{reason='Avant suppression'}={}){const api=window.PhilosophalMediaLibrary549;if(!api)throw Error('Bibliothèque des médias indisponible.');
 const unique=[...new Set(ids)].filter(Boolean),created=[];if(unique.length>25)throw Error('Plus de 25 médias sélectionnés. Effectue une sauvegarde ZIP avant suppression.');
 for(const id of unique){const data=await api.get(id);if(!data)throw Error('Média introuvable : '+id);try{const res=await add('media',id,data.meta.name,reason,{meta:data.meta,blob:data.blob},data.blob.size+6000,true);if(res.point)created.push(res.point.id);}catch(err){for(const point of created){try{await remove(point);}catch{}}throw err;}}
 return created.length;
}
async function checkpointCut({reason='Automatique',forced=false}={}){const entries=cutData();if(!Object.keys(entries).length)return {skipped:true,reason:'Aucun brouillon Cut local disponible'};return add('cut','local', 'Préférences et brouillons Cut',reason,entries,sizeOf(entries)+1000,forced);}
async function checkpointAll(){const saved=[],failed=[];for(const p of await studioList()){try{const r=await checkpointStudio(p,{reason:'Manuel',forced:true});if(r.point)saved.push(r.point);}catch(e){failed.push(safe(p.name)+': '+e.message);}}
 try{const r=await checkpointCut({reason:'Manuel',forced:true});if(r.point)saved.push(r.point);}catch(e){failed.push('Cut : '+e.message);}return {saved,failed};}
async function restore(pointId){const point=await get(pointId);if(!point)throw Error('Point de restauration introuvable.');const {meta,payload}=point,now=Date.now();
 if(meta.kind==='studio'){
  if(!payload?.data)throw Error('Le point ne contient pas de projet Studio valide.');
  const record={...payload,id:uid(),name:safe(payload.name)+' — récupéré',createdAt:now,updatedAt:now};
  await studioPut(record);return 'Projet « '+record.name+' » ajouté sans écraser l’original. Rouvre Studio pour le retrouver.';
 }
 if(meta.kind==='media'){
  const api=window.PhilosophalMediaLibrary549;if(!api)throw Error('Bibliothèque des médias indisponible.');
  if(!(payload.blob instanceof Blob)||!payload.meta)throw Error('Média de récupération incomplet.');
  const original=payload.meta.original||'media.wav';const file=new File([payload.blob],original,{type:payload.meta.mime||payload.blob.type,lastModified:now});
  const result=await api.add(file,{name:original,collection:payload.meta.collection,notes:payload.meta.notes,source:'Point de restauration',cues:payload.meta.cues});
  if(!result.duplicate)await api.change(result.meta.id,{name:payload.meta.name,collection:payload.meta.collection,notes:payload.meta.notes,favorite:payload.meta.favorite});
  return result.duplicate?'Média identique déjà présent ; aucune copie inutile créée.':'Média restauré dans la bibliothèque professionnelle.';
 }
 if(meta.kind==='cut'){
  const keys=Object.keys(payload).filter(cutAllowed);if(!keys.length)throw Error('Aucun réglage Cut à restaurer.');
  // Effectue une copie préventive de l'état actuel avant toute écriture destructive.
  const safePoint=await checkpointCut({reason:'Avant restauration',forced:true});
  if(!safePoint.point&&Object.keys(cutData()).length)throw Error('Impossible de sauvegarder les réglages actuels. Restauration annulée.');
  let count=0;for(const k of keys){if(typeof payload[k]!=='string'||payload[k].length>=3*1048576)continue;localStorage.setItem(k,payload[k]);count++;}
  return count+' réglage(s)/brouillon(s) Cut restauré(s). Les précédents ont été conservés dans un nouveau point. Recharge Cut.';
 }
 throw Error('Type de point inconnu.');
}
function installCutAutosave(){window.addEventListener('philosophal:cut-saved',()=>{checkpointCut().catch(err=>{console.warn('Point Cut non créé :',err.message);window.dispatchEvent(new CustomEvent('philosophal:recovery-warning',{detail:err.message}));});});}
window.PhilosophalProRecovery={list,get,remove,checkpointStudio,checkpointMedia,checkpointCut,checkpointAll,restore,studioList,installCutAutosave,fmt};
})();
