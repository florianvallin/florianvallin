/* V6 : capture locale, journal vidéo et repères de lecture. Aucune requête réseau. */
(function(root,factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhilosophalPromptMedia = api;
})(typeof globalThis !== 'undefined' ? globalThis : this,() => {
  'use strict';
  const DB = 'philosophal-teleprompteur-media', MAX_BYTES = 256 * 1024 * 1024, MAX_SECONDS = 1200;
  const copy = value => JSON.parse(JSON.stringify(value));
  const safe = (value,max = 600) => String(value || '').slice(0,max);
  const id = () => globalThis.crypto?.randomUUID?.() || 'media-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const seconds = value => Math.max(0,Number.isFinite(Number(value)) ? Number(value) : 0);
  const labels = {keep:'À garder',retry:'À refaire',review:'À évaluer'};
  function supported(env = globalThis) { return env.isSecureContext === true && typeof env.navigator?.mediaDevices?.getUserMedia === 'function' && typeof env.MediaRecorder === 'function'; }
  function constraints(settings = {}) {
    const vertical = settings.orientation === 'vertical', large = settings.quality === '1080', w = large ? 1920 : 1280, h = large ? 1080 : 720;
    return {video:{...(settings.camera ? {deviceId:{exact:settings.camera}} : {facingMode:{ideal:'user'}}),width:{ideal:vertical ? h : w},height:{ideal:vertical ? w : h},frameRate:{ideal:30,max:30}},
      audio:settings.microphone === 'none' ? false : {...(settings.microphone ? {deviceId:{exact:settings.microphone}} : {}),echoCancellation:true,noiseSuppression:true}};
  }
  function mimeTypes(Recorder = globalThis.MediaRecorder) {
    const types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/webm'];
    return Recorder?.isTypeSupported ? types.filter(type => { try { return Recorder.isTypeSupported(type); } catch { return false; } }) : [];
  }
  function extension(mime) { return /^video\/mp4\b/i.test(mime) ? 'mp4' : /^video\/webm\b/i.test(mime) ? 'webm' : 'video'; }
  function filename(session) {
    const title = safe(session.script?.title,80).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'') || 'script';
    return `${title}-${new Date(session.createdAt).toISOString().replace(/[:.]/g,'-')}-${safe(session.id,8)}.${extension(session.mime)}`;
  }
  function timecode(value) {
    const ms = Math.round(seconds(value) * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms % 1000).padStart(3,'0')}`;
  }
  function takeSnapshot(value = {}) {
    return {id:safe(value.id,100),number:Math.max(0,Math.floor(seconds(value.number))),status:labels[value.status] ? value.status : 'review',excerpt:safe(value.excerpt,500),note:safe(value.note,600)};
  }
  function rows(session,keepOnly = false) {
    return (session.segments || []).filter(part => part.end !== null && part.end > part.start && (!keepOnly || part.status === 'keep')).map(part => ({...takeSnapshot(part),start:seconds(part.start),end:Math.min(seconds(part.end),seconds(session.duration))})).filter(part => part.end > part.start);
  }
  function csv(session,keepOnly = false) {
    // Neutralise aussi les formules lors d'une ouverture dans un tableur.
    const cell = value => '"' + String(value ?? '').replace(/^[\s\uFEFF]*([=+@-])/,"'$1").replace(/"/g,'""') + '"';
    const table = [['Fichier','Prise','État','Début (secondes)','Fin (secondes)','Durée (secondes)','Début','Fin','Extrait du script','Note']];
    for (const row of rows(session,keepOnly)) table.push([session.filename || filename(session),row.number || 'Lecture',labels[row.status],row.start.toFixed(3),row.end.toFixed(3),(row.end-row.start).toFixed(3),timecode(row.start),timecode(row.end),row.excerpt,row.note]);
    return '\uFEFF' + table.map(line => line.map(cell).join(';')).join('\r\n') + '\r\n';
  }
  function srt(session,keepOnly = false) {
    let previous = 0;
    const cues = [];
    for (const row of rows(session,keepOnly)) {
      const start = Math.max(previous,Math.round(row.start * 1000)), end = Math.round(row.end * 1000);
      if (end <= start) continue;
      const text = [row.number ? `Prise ${String(row.number).padStart(2,'0')} · ${labels[row.status]}` : 'Lecture · repère',row.excerpt.replace(/[<>\r\n]/g,' ').replace(/\s+/g,' ').slice(0,140)].filter(Boolean).join('\n');
      cues.push(`${cues.length+1}\n${timecode(start/1000)} --> ${timecode(end/1000)}\n${text}`); previous = end;
    }
    return cues.join('\n\n') + (cues.length ? '\n' : '');
  }
  function manifest(session) {
    const {blob,...metadata} = session;
    return {format:'philosophal-recording',version:6,...copy(metadata),timing:'Repères de lecture en secondes depuis le démarrage de la vidéo ; ce ne sont pas des sous-titres transcrits. À ajuster au montage si nécessaire.'};
  }
  function crc32(bytes) {
    let crc=0xffffffff;
    for(const byte of bytes){crc^=byte;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
    return (crc^0xffffffff)>>>0;
  }
  function zip(files) {
    // ZIP sans compression : quelques fichiers texte, sans dépendance ni conversion vidéo.
    const encoder=new TextEncoder(), local=[], central=[];let offset=0,total=0;
    for(const [name,content]of Object.entries(files)){
      const path=encoder.encode(name),data=encoder.encode(content),crc=crc32(data),header=new Uint8Array(30+path.length),h=new DataView(header.buffer);
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,33,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,path.length,true);header.set(path,30);
      const entry=new Uint8Array(46+path.length),c=new DataView(entry.buffer);
      c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,33,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,path.length,true);c.setUint32(42,offset,true);entry.set(path,46);
      local.push(header,data);central.push(entry);offset+=header.length+data.length;total+=entry.length;
    }
    const end=new Uint8Array(22),e=new DataView(end.buffer),count=central.length;e.setUint32(0,0x06054b50,true);e.setUint16(8,count,true);e.setUint16(10,count,true);e.setUint32(12,total,true);e.setUint32(16,offset,true);
    return new Blob([...local,...central,end],{type:'application/zip'});
  }
  function pack(session,keepOnly=false) {
    const name=session.filename || filename(session),base=name.replace(/\.[^.]+$/,'');
    return zip({[base+'-reperes.csv']:csv(session,keepOnly),[base+'-reperes.srt']:srt(session,keepOnly),[base+'-dossier.json']:JSON.stringify(manifest(session),null,2),
      'LIRE-MONTAGE.txt':`PHILOSOPHAL — PACK DE MONTAGE V6\n\nVidéo à télécharger séparément : ${name}\n\nLes fichiers de ce pack contiennent les repères de lecture, le script filmé et les notes de prises. La vidéo n’est pas incluse.\n${keepOnly?'Le CSV et le SRT contiennent uniquement les repères marqués « À garder ». Le dossier JSON garde toutes les prises.':'Le CSV et le SRT contiennent tous les repères de lecture de cette vidéo.'}\n\nDans Premiere : importez la vidéo et le fichier SRT, puis placez-les au même début dans la séquence. Le SRT crée une piste de repérage temporaire : ce ne sont pas des sous-titres transcrits. Retirez cette piste avant votre export final. Ajustez les coupes à l’image et à l’écoute.\n\nLe CSV permet de retrouver les débuts, fins, états et notes. Le dossier JSON contient la copie du script au moment du tournage et toutes les métadonnées.\n\nConteneur et codec de la vidéo : ${session.mime}. Une conversion peut être nécessaire selon votre logiciel de montage.\n`});
  }
  function errorMessage(error) {
    const messages = {NotAllowedError:'Accès refusé. Autorisez la caméra et le micro dans votre navigateur, puis réessayez.',NotFoundError:'Caméra ou micro introuvable. Vérifiez les appareils branchés, ou choisissez « Sans micro ».',NotReadableError:'Un appareil est déjà utilisé ou ne répond pas. Fermez les autres applications qui l’utilisent.',OverconstrainedError:'Ce réglage n’est pas disponible. Essayez un autre appareil ou le format 720p.',SecurityError:'La caméra demande une page HTTPS ou localhost.',QuotaExceededError:'L’espace de stockage est insuffisant. Téléchargez la vidéo avant de fermer la page.'};
    return messages[error?.name] || error?.message || 'La capture a échoué. Les données déjà reçues restent disponibles.';
  }
  function memoryStore() {
    const records = new Map(), chunks = new Map();
    return {persistent:false,begin:async value => {records.set(value.id,copy(value));chunks.set(value.id,[]);},
      append:async (value,index,blob) => {if (!records.has(value.id)) throw new Error('Session introuvable.');records.set(value.id,copy(value));chunks.get(value.id)[index]=blob;},
      update:async value => {if (records.has(value.id)) records.set(value.id,copy(value));},
      list:async () => [...records.values()].map(copy),
      read:async key => {const value=records.get(key);return value ? {...copy(value),blob:new Blob(chunks.get(key) || [],{type:value.mime})} : null;},
      remove:async key => {records.delete(key);chunks.delete(key);},close:() => {}};
  }
  function openStore(database = globalThis.indexedDB) {
    return new Promise((resolve,reject) => {
      if (!database) { reject(new Error('Stockage vidéo indisponible.')); return; }
      const request = database.open(DB,1);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('sessions',{keyPath:'id'});
        const parts = db.createObjectStore('chunks',{keyPath:['sessionId','index']});parts.createIndex('sessionId','sessionId');
      };
      request.onerror = () => reject(request.error);request.onblocked = () => reject(new Error('Fermez les autres onglets du téléprompteur pour ouvrir le stockage vidéo.'));
      request.onsuccess = () => {
        const db = request.result;db.onversionchange = () => db.close();
        function transaction(stores,mode,work) {
          return new Promise((done,fail) => {
            const tx=db.transaction(stores,mode);let result;
            tx.oncomplete=()=>done(result);tx.onerror=tx.onabort=()=>fail(tx.error || new Error('Écriture vidéo interrompue.'));
            try {work(tx,value=>{result=value;});} catch(error) {tx.abort();fail(error);}
          });
        }
        resolve({persistent:true,
          begin:value=>transaction(['sessions'],'readwrite',tx=>tx.objectStore('sessions').add(copy(value))),
          append:(value,index,blob)=>transaction(['sessions','chunks'],'readwrite',tx=>{
            const sessions=tx.objectStore('sessions'),exists=sessions.get(value.id);
            exists.onsuccess=()=>{if(!exists.result){tx.abort();return;}sessions.put(copy(value));tx.objectStore('chunks').put({sessionId:value.id,index,blob});};
          }),
          update:value=>transaction(['sessions'],'readwrite',tx=>{const store=tx.objectStore('sessions'),exists=store.get(value.id);exists.onsuccess=()=>{if(exists.result)store.put(copy(value));};}),
          list:()=>transaction(['sessions'],'readonly',(tx,set)=>{const req=tx.objectStore('sessions').getAll();req.onsuccess=()=>set(req.result);}),
          read:key=>transaction(['sessions','chunks'],'readonly',(tx,set)=>{
            let meta,parts;const finish=()=>{if(meta!==undefined&&parts!==undefined)set(meta ? {...meta,blob:new Blob(parts.sort((a,b)=>a.index-b.index).map(part=>part.blob),{type:meta.mime})}:null);};
            const a=tx.objectStore('sessions').get(key),b=tx.objectStore('chunks').index('sessionId').getAll(key);a.onsuccess=()=>{meta=a.result || null;finish();};b.onsuccess=()=>{parts=b.result;finish();};
          }),
          remove:key=>transaction(['sessions','chunks'],'readwrite',tx=>{
            const store=tx.objectStore('sessions'),req=store.get(key);
            req.onsuccess=()=>{if(req.result?.state==='recording'&&Date.now()-req.result.updatedAt<15000){tx.abort();return;}store.delete(key);const cursor=tx.objectStore('chunks').index('sessionId').openCursor(key);cursor.onsuccess=()=>{const part=cursor.result;if(part){part.delete();part.continue();}};};
          }),close:()=>db.close()});
      };
    });
  }
  function create(options = {}) {
    const now=options.now || (()=>performance.now()), wall=options.wall || Date.now;
    const requestMedia=options.getUserMedia || (value=>globalThis.navigator.mediaDevices.getUserMedia(value));
    const Recorder=options.Recorder || globalThis.MediaRecorder, store=options.store || memoryStore();
    const interval=options.interval || setInterval, clear=options.clear || clearInterval;
    let phase='idle',stream=null,recorder=null,session=null,origin=0,end=0,chunks=[],bytes=0,queue=Promise.resolve(),failed=false,epoch=0,timer=null,stopPromise=null,resolveStop=null,disposed=false;
    let startResolve=null,startReject=null,lastCheckpoint=0;
    const pending = new Map();
    const snapshot=()=>session ? copy(session) : null;
    const elapsed=()=>session ? (end || now())-origin : 0;
    const duration=()=>Math.max(0,elapsed()/1000);
    const busy=()=>['requesting','starting','recording','stopping'].includes(phase);
    const emit=()=>options.onChange?.({phase,stream,session:snapshot(),duration:duration(),bytes,persistent:store.persistent&&!failed});
    const metadata=()=>({...snapshot(),duration:duration(),bytes,updatedAt:wall()});
    function enqueue(operation) {
      queue=queue.then(operation).catch(error=>{
        if(failed)return;failed=true;options.onError?.(errorMessage(error));
        if(phase==='recording'||phase==='starting')stop('storage');
      });return queue;
    }
    function closeSegment() {const last=session?.segments.at(-1);if(last?.end===null)last.end=duration();}
    function reading(take) {
      if(phase!=='recording')return;
      const last=session.segments.at(-1);if(take&&last?.end===null&&last.id===take.id)return;
      closeSegment();if(take)session.segments.push({...takeSnapshot(take),start:duration(),end:null});
    }
    function updateTake(take) {
      if(!session)return;
      const patch=takeSnapshot(take);session.segments=session.segments.map(part=>part.id===patch.id?{...part,...patch}:part);
    }
    function releaseTracks() {if(stream)for(const track of stream.getTracks())track.stop();stream=null;}
    async function activate(settings) {
      if(disposed||busy()||phase==='ready')return false;
      const token=++epoch;phase='requesting';emit();
      try {
        const value=await requestMedia(constraints(settings));
        if(disposed||token!==epoch){for(const track of value.getTracks())track.stop();return false;}
        if(!value.getVideoTracks().some(track=>track.readyState==='live')){for(const track of value.getTracks())track.stop();throw new Error('Aucune piste vidéo disponible.');}
        stream=value;for(const track of stream.getVideoTracks())track.addEventListener('mute',()=>{if(phase==='recording'){options.onError?.('La caméra ne fournit plus d’image. La capture est arrêtée.');stop('device');}});
        for(const track of stream.getTracks())track.addEventListener('ended',()=>{
          if(busy())stop('device');else{releaseTracks();phase='idle';emit();}options.onError?.('Un appareil a été déconnecté. La capture est arrêtée.');
        });phase='ready';emit();return true;
      } catch(error) {if(token===epoch&&!disposed){phase='idle';emit();options.onError?.(errorMessage(error));}return false;}
    }
    function cancelActivation() {if(phase==='requesting'){++epoch;phase='idle';emit();}}
    function deactivate() {if(busy()){if(phase==='requesting')cancelActivation();return false;}releaseTracks();phase='idle';emit();return true;}
    async function start(script) {
      if(disposed||phase!=='ready'||!stream?.getVideoTracks().some(track=>track.readyState==='live'))throw new Error('Activez la caméra avant d’enregistrer.');
      if(!Recorder)throw new Error('Ce navigateur ne propose pas l’enregistrement vidéo.');
      if([...pending.values()].reduce((sum,value)=>sum+value.blob.size,0)>=MAX_BYTES)throw new Error('Téléchargez puis retirez les vidéos temporaires avant de continuer.');
      phase='starting';failed=false;chunks=[];bytes=0;end=0;origin=now();
      const types=mimeTypes(Recorder);let lastError;
      for(const type of [...types,'']){try{recorder=new Recorder(stream,{...(type?{mimeType:type}:{}),videoBitsPerSecond:5000000,audioBitsPerSecond:128000});break;}catch(error){lastError=error;recorder=null;}}
      if(!recorder){phase='ready';emit();throw lastError || new Error('Aucun format vidéo disponible.');}
      const video=stream.getVideoTracks()[0].getSettings?.() || {};
      session={id:id(),createdAt:wall(),updatedAt:wall(),state:'recording',reason:'',mime:recorder.mimeType || '',duration:0,bytes:0,script:{id:safe(script.id,100),title:safe(script.title,120),collection:safe(script.collection,90),text:safe(script.text,250000)},video:{width:video.width || 0,height:video.height || 0,frameRate:video.frameRate || 0},audio:stream.getAudioTracks().length>0,segments:[]};
      session.filename=filename(session);const initial=snapshot();enqueue(()=>store.begin(initial));
      stopPromise=new Promise(resolve=>{resolveStop=resolve;});
      const started=new Promise((resolve,reject)=>{startResolve=resolve;startReject=reject;});started.catch(()=>{});
      recorder.addEventListener('start',()=>{if(phase!=='starting')return;phase='recording';session.mime=recorder.mimeType || session.mime;session.filename=filename(session);emit();startResolve?.(snapshot());startResolve=null;startReject=null;});
      recorder.addEventListener('dataavailable',event=>{
        if(!event.data?.size)return;
        const index=chunks.length;chunks.push(event.data);bytes+=event.data.size;
        if(!session.mime&&event.data.type){session.mime=event.data.type;session.filename=filename(session);}
        const meta=metadata();if(!failed)enqueue(()=>store.append(meta,index,event.data));
        if(bytes>=MAX_BYTES&&phase==='recording')stop('limit');
      });
      recorder.addEventListener('error',event=>{options.onError?.(errorMessage(event.error));stop('error');});
      recorder.addEventListener('stop',()=>{finalize().catch(error=>{options.onError?.(errorMessage(error));});});
      origin=now();lastCheckpoint=origin;emit();
      try{recorder.start(1000);timer=interval(()=>{if(phase==='recording'&&duration()>=MAX_SECONDS)stop('limit');if(phase==='recording'&&!failed&&now()-lastCheckpoint>=2000){lastCheckpoint=now();const checkpoint=metadata();enqueue(()=>store.update(checkpoint));}emit();},250);}
      catch(error){session.reason='error';end=now();phase='stopping';startReject?.(error);startResolve=null;startReject=null;await finalize();}
      return started;
    }
    function stop(reason='user') {
      if(!['starting','recording','stopping'].includes(phase))return Promise.resolve(null);
      if(phase==='stopping')return stopPromise;
      closeSegment();end=now();session.reason=reason;phase='stopping';clear(timer);timer=null;
      startReject?.(new Error('Enregistrement annulé.'));startResolve=null;startReject=null;emit();
      try{if(recorder.state!=='inactive')recorder.stop();}catch(error){options.onError?.(errorMessage(error));}
      // Le navigateur émet aussi stop après une fin de piste ou une erreur.
      return stopPromise;
    }
    async function finalize() {
      if(!session||session.state!=='recording')return;
      if(!end){closeSegment();end=now();}clear(timer);timer=null;phase='stopping';
      session={...metadata(),state:session.reason&&session.reason!=='user'?'interrupted':'complete'};
      await queue;
      if(!failed)await enqueue(()=>store.update(snapshot()));
      const blob=new Blob(chunks,{type:session.mime});
      if(!store.persistent||failed){pending.set(session.id,{...snapshot(),blob,temporary:true});}
      const result={...snapshot(),temporary:!store.persistent||failed};
      if(failed)result.state='interrupted';
      chunks=[];recorder=null;if(['device','hidden','pagehide'].includes(session.reason))releaseTracks();phase=stream?.getVideoTracks().some(track=>track.readyState==='live')?'ready':'idle';
      if(phase==='idle')releaseTracks();
      emit();options.onComplete?.(result);resolveStop?.(result);resolveStop=null;
    }
    async function list() {await queue;let values=[];try{values=await store.list();}catch(error){options.onError?.(errorMessage(error));}const all=new Map(values.map(value=>[value.id,value]));for(const [key,value]of pending){const {blob,...meta}=value;all.set(key,meta);}return [...all.values()].sort((a,b)=>b.createdAt-a.createdAt);}
    async function read(key) {await queue;return pending.get(key) || store.read(key);}
    async function update(value) {if(busy()&&session?.id===value.id)return;await queue;if(pending.has(value.id)){const old=pending.get(value.id);pending.set(value.id,{...copy(value),blob:old.blob,temporary:true});}await store.update(value);}
    async function remove(key) {if(busy()&&session?.id===key)throw new Error('Arrêtez la capture avant de retirer cette vidéo.');await queue;await store.remove(key);pending.delete(key);}
    function dispose() {disposed=true;++epoch;if(phase==='requesting')phase='idle';else if(busy())stop('pagehide');releaseTracks();if(!busy())phase='idle';}
    function resume() {disposed=false;emit();}
    return {activate,cancelActivation,deactivate,start,stop,reading,updateTake,list,read,update,remove,dispose,resume,snapshot,
      get phase(){return phase;},get busy(){return busy();},get recording(){return phase==='recording';},get stream(){return stream;},get temporary(){return pending.size>0;},get persistent(){return store.persistent&&!failed;}};
  }
  return {DB,MAX_BYTES,MAX_SECONDS,supported,constraints,mimeTypes,extension,filename,timecode,takeSnapshot,rows,csv,srt,manifest,crc32,zip,pack,errorMessage,memoryStore,openStore,create};
});
