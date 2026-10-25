const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');const r=p=>fs.readFileSync(path.join(root,p),'utf8');
const storage={};class Store{constructor(rows){this.rows=rows}put(v){this.rows.set(v.id,v);return {result:v.id}}get(id){return {result:this.rows.get(id)}}getAll(){return {result:Array.from(this.rows.values())}}delete(id){this.rows.delete(id);return {result:undefined}}}
const dbs=new Map();function opener(name,version){const req={};queueMicrotask(()=>{let db=dbs.get(name);const fresh=!db;if(fresh){const tables=new Map();db={tables,objectStoreNames:{contains:id=>tables.has(id)},createObjectStore:(id)=>{const data=new Map();tables.set(id,data);return new Store(data)},transaction:(id,mode)=>{const t={objectStore:()=>new Store(tables.get(id))};queueMicrotask(()=>queueMicrotask(()=>t.oncomplete?.()));return t},close(){}};dbs.set(name,db)}req.result=db;if(fresh)req.onupgradeneeded?.();req.onsuccess?.()});return req}
const context={window:{},indexedDB:{open:opener},Blob,File,crypto:require('node:crypto').webcrypto,Uint8Array,Date,setTimeout,clearTimeout,console};context.window.indexedDB=context.indexedDB;
vm.runInNewContext(r('js/pro-av-cut-bridge.js'),context);const b=context.window.PhilosophalAVCutBridge;
assert(b,'Passerelle absente');const markers=b.cleanMarkers([{time:5,note:'A couper',status:'cut'},{time:NaN},{time:1.25,note:'À écouter',status:'review'},{time:-3}]);assert.equal(markers.length,2);assert.equal(markers[0].time,1.25);
assert.equal(b.cleanTranscript('a\x00b\nb'),'ab\nb');assert.match(b.makeSrt([{start:1.2,end:2,text:'Bonjour'}]),/00:00:01,200 --> 00:00:02,000/);
(async()=>{
const media=new Blob(['audio'],{type:'audio/wav'});const id=await b.put({blob:media,name:'voix.wav',project:'Test Épisode',cues:[{start:0,end:1,text:'Socrate'}],markers,fullText:'Socrate en discours'});
const found=await b.read(id);assert.equal(found.project,'Test Épisode');assert.equal(found.markers.length,2);assert.equal(found.cues[0].text,'Socrate');
const saved=await b.saveDossier(found);assert.equal(saved.name,'voix.wav');assert.equal('blob' in saved,false,'Fiche ne doit pas copier les octets du média');
const dossiers=await b.listDossiers();assert.equal(dossiers.length,1);assert.equal(dossiers[0].fullText,'Socrate en discours');
await b.remove(id);assert.equal(await b.read(id),null);assert.equal((await b.listDossiers()).length,1,'Fiche survivant au nettoyage du transfert');
await b.deleteDossier(id);assert.equal((await b.listDossiers()).length,0);
const lot=await b.putBatch([{blob:media,name:'voix.wav',cues:[],markers,fullText:'texte'}],{project:'Lot Test'});const l=await b.listBatch(lot.batchId);assert.equal(l.length,1);assert.equal(l[0].markers.length,2);assert.equal(l[0].project,'Lot Test');
for(const file of ['js/pro-av-cut-studio.js','js/pro-av-cut-batch-studio.js','js/pro-av-cut-receiver.js','js/pro-av-cut-batch-receiver.js','js/pro-av-cut-dossiers-v5415.js'])new vm.Script(r(file),{filename:file});
const studio=r('outils/studio-audiovisuel/editeur.html'),cut=r('outils/philosophal-cut/editeur.html');
assert(studio.includes('pro-av-cut-studio.js?v=20261025-v54.16'));
assert(cut.includes('pro-av-cut-dossiers-v5415.js?v=20261025-v54.16'));
assert(cut.includes('pro-av-cut-receiver.js?v=20261025-v54.16'));
console.log('V54.15 : transferts simples/lots, fiches persistantes sans média dupliqué et scripts OK');
})().catch(e=>{console.error(e);process.exitCode=1});
