/* Interface caméra V6. Les permissions ne sont demandées qu'au clic sur Activer. */
(() => {
  'use strict';
  const M = window.PhilosophalPromptMedia;
  async function create(hooks) {
    const $ = hooks.find || (selector => document.querySelector(selector));
    const preview=$('[data-camera-preview]'), playback=$('[data-media-playback]'), select=$('[data-media-sessions]'), chip=$('[data-record-stop]');
    let store, engine, records=[], selected=null, previewStream=null, playbackURL=null, epoch=0, working=false, metadataQueue=Promise.resolve();
    let audioContext=null, meterTimer=null, warning='', state={phase:'idle',persistent:true};
    const supported=M.supported();
    const clock=value=>M.timecode(value).slice(0,-4);
    const size=value=>(value/1048576).toLocaleString('fr-FR',{maximumFractionDigits:1})+' Mo';
    const message=value=>{$('[data-camera-message]').textContent=value;$('[data-camera-message]').hidden=!value;};
    const settings=()=>({camera:$('[data-camera-source]').value,microphone:$('[data-mic-source]').value,quality:$('[data-camera-quality]').value,orientation:$('[data-camera-orientation]').value});
    function stopMeter() {
      clearInterval(meterTimer);meterTimer=null;if(audioContext)audioContext.close().catch(()=>{});audioContext=null;
      $('[data-mic-meter]').value=0;$('[data-mic-level]').textContent='Micro inactif';
    }
    function startMeter(stream) {
      stopMeter();if(!stream.getAudioTracks().length){$('[data-mic-level]').textContent='Sans micro · vidéo muette';return;}
      try {
        const Audio=window.AudioContext || window.webkitAudioContext;if(!Audio){$('[data-mic-level]').textContent='Micro actif · mesure indisponible';return;}
        audioContext=new Audio();audioContext.resume().catch(()=>{});
        const source=audioContext.createMediaStreamSource(stream), analyser=audioContext.createAnalyser();analyser.fftSize=512;source.connect(analyser);
        const values=new Uint8Array(analyser.fftSize);
        meterTimer=setInterval(()=>{analyser.getByteTimeDomainData(values);let energy=0;for(const value of values)energy+=((value-128)/128)**2;const level=Math.sqrt(energy/values.length);$('[data-mic-meter]').value=Math.min(1,level*4);$('[data-mic-level]').textContent=level>.24?'Niveau fort':level>.01?'Le micro reçoit du son':'Micro actif · parlez pour vérifier';},150);
      } catch {$('[data-mic-level]').textContent='Micro actif · mesure indisponible';}
    }
    async function devices() {
      try {
        const all=await navigator.mediaDevices.enumerateDevices();
        for(const [selector,kind,label]of [['[data-camera-source]','videoinput','Caméra'],['[data-mic-source]','audioinput','Micro']]){
          const control=$(selector),before=control.value;control.replaceChildren(new Option(kind==='videoinput'?'Caméra par défaut':'Micro par défaut',''));
          if(kind==='audioinput')control.append(new Option('Sans micro · vidéo muette','none'));
          let n=0;for(const device of all.filter(value=>value.kind===kind)){if(device.deviceId)control.append(new Option(device.label || `${label} ${++n}`,device.deviceId));}
          if([...control.options].some(option=>option.value===before))control.value=before;
        }
      } catch { /* Les sélecteurs par défaut restent utilisables. */ }
    }
    function paint(next=state) {
      state=next;const busy=engine?.busy || working, ready=next.phase==='ready', recording=next.phase==='recording', stopping=next.phase==='stopping';
      for(const el of document.querySelectorAll('[data-camera-setting]'))el.disabled=!supported || next.phase!=='idle' || working;
      $('[data-camera-activate]').disabled=!supported || next.phase!=='idle' || working;
      $('[data-camera-activate]').hidden=next.phase!=='idle';
      $('[data-camera-close]').hidden=!ready;$('[data-camera-close]').disabled=working;
      $('[data-camera-cancel]').hidden=next.phase!=='requesting';
      $('[data-camera-record]').disabled=!ready || working || !hooks.ready();
      $('[data-camera-stop]').disabled=!recording && !stopping;$('[data-camera-stop]').hidden=!recording&&!stopping;
      $('[data-camera-record]').hidden=recording||stopping;
      chip.hidden=!recording&&!stopping;chip.disabled=stopping;chip.textContent=stopping?'Finalisation…':`● REC ${clock(next.duration)} · Arrêter`;
      chip.setAttribute('aria-label',stopping?'Finalisation de la vidéo':`Arrêter l’enregistrement vidéo, ${clock(next.duration)}`);
      $('[data-camera-status]').textContent={idle:supported?'Caméra éteinte':'Caméra indisponible ici',requesting:'Autorisation en attente…',ready:'Caméra active · rien n’est enregistré',starting:'Préparation de l’enregistrement…',recording:`● Enregistrement · ${clock(next.duration)} · ${size(next.bytes)}`,stopping:'Finalisation de la vidéo…'}[next.phase] || '';
      $('[data-camera-status]').dataset.recording=String(recording);
      $('[data-camera-placeholder]').hidden=!!next.stream;preview.hidden=!next.stream;
      if(previewStream!==next.stream){previewStream=next.stream;preview.srcObject=next.stream || null;if(next.stream){preview.play().catch(()=>{});startMeter(next.stream);devices();}else stopMeter();}
      const video=next.stream?.getVideoTracks()[0]?.getSettings?.();
      $('[data-camera-format]').textContent=video?`${video.width || '?'} × ${video.height || '?'} · ${video.frameRate?Math.round(video.frameRate)+' i/s · ':''}${next.stream.getAudioTracks().length?'avec micro':'sans micro'}`:'720p ou 1080p · format selon la caméra';
      if(video){const requested=$('[data-camera-orientation]').value==='vertical';$('[data-camera-format-note]').textContent=requested&&video.width>video.height?'La caméra fournit un cadre horizontal. Le fichier gardera ce cadre ; recadrez en 9:16 au montage.':'Le fichier conserve le cadre réel de la caméra. Le texte et le miroir du prompteur ne sont pas enregistrés.';}
      $('[data-camera-live]').classList.toggle('has-stream',!!next.stream);
      if (busy) playback.pause(); playback.controls=!busy;
      hooks.changed?.(busy);paintSelection();
    }
    function paintSelection() {
      const active=engine?.busy || working, own=selected?.id===engine?.snapshot()?.id && engine?.busy;
      select.disabled=active||!records.length;
      for(const button of document.querySelectorAll('[data-media-export]'))button.disabled=active||!selected?.bytes;
      $('[data-media-delete]').disabled=active||!selected||own;
      $('[data-media-summary]').textContent=selected?`${clock(selected.duration)} · ${size(selected.bytes)} · ${M.rows(selected).length} repère${M.rows(selected).length>1?'s':''}${selected.temporary?' · temporaire':selected.state==='recording'?' · incomplète / autre onglet':selected.state==='interrupted'?' · arrêt anticipé':''}`:'Vos vidéos et leurs repères apparaîtront ici.';
      $('[data-media-recovery]').hidden=!selected || selected.state==='complete';
      $('[data-media-empty]').hidden=records.length>0;
    }
    async function choose(key) {
      const token=++epoch;selected=records.find(value=>value.id===key)||null;paintSelection();
      playback.pause();playback.removeAttribute('src');playback.load();playback.hidden=true;
      if(playbackURL){URL.revokeObjectURL(playbackURL);playbackURL=null;}
      if(!selected||engine.busy)return;
      try{
        const value=await engine.read(key);if(token!==epoch||!value?.blob?.size)return;
        playbackURL=URL.createObjectURL(value.blob);playback.src=playbackURL;playback.hidden=false;
      }catch(error){message(M.errorMessage(error));}
    }
    async function refresh(key=selected?.id) {
      records=await engine.list();select.replaceChildren();
      for(const value of records){const text=`${value.script?.title || 'Script'} · ${new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(value.createdAt)}`;select.append(new Option(text,value.id));}
      const next=records.find(value=>value.id===key)||records[0];select.value=next?.id || '';await choose(next?.id);
    }
    async function run(action) {
      if(working)return;working=true;paint();
      try{await action();}catch(error){message(M.errorMessage(error));}finally{working=false;paint();}
    }
    try{store=await M.openStore();}
    catch{store=M.memoryStore();warning='Stockage vidéo indisponible : téléchargez chaque vidéo avant de fermer la page.';}
    engine=M.create({store,onChange:paint,onError:value=>{message(value);hooks.toast(value);},onComplete:value=>{
      hooks.pause();refresh(value.id).catch(error=>message(M.errorMessage(error)));
      if(value.reason==='limit')message('La capture s’est arrêtée à la limite de 20 minutes ou 256 Mo. Téléchargez cette session, puis continuez dans une nouvelle vidéo.');
      else if(value.temporary)message('Vidéo temporaire : téléchargez-la avant de quitter cette page.');
      else if(value.state==='interrupted')message('Capture arrêtée avant la fin. Les données reçues sont conservées ; vérifiez la vidéo avant de reprendre.');
      else message('Vidéo conservée dans ce navigateur. Téléchargez-la pour le montage.');
      hooks.toast('Enregistrement terminé.');
    }});
    if(!supported)message('Ouvrez cette page en HTTPS ou sur localhost dans un navigateur proposant la caméra et MediaRecorder. Vos scripts et le lecteur restent disponibles.');
    $('[data-media-storage]').textContent=warning || 'Vidéos conservées ici · téléchargez une copie pour le montage.';
    $('[data-camera-activate]').addEventListener('click',()=>{message('');engine.activate(settings());});
    $('[data-camera-cancel]').addEventListener('click',()=>{engine.cancelActivation();message('Demande annulée ici. Si le navigateur affiche encore une autorisation, vous pouvez la fermer.');});
    $('[data-camera-close]').addEventListener('click',()=>{engine.deactivate();message('');});
    $('[data-camera-mirror]').addEventListener('change',event=>preview.classList.toggle('is-preview-mirrored',event.target.checked));
    $('[data-camera-record]').addEventListener('click',()=>run(async()=>{
      if(!hooks.ready())return;message('');playback.pause();hooks.pause();await hooks.flush();
      await engine.start(hooks.script());if(engine.recording&&!hooks.startTake())await engine.stop('cancelled');
    }));
    const stop=()=>run(async()=>{hooks.pause();await engine.stop();});
    $('[data-camera-stop]').addEventListener('click',stop);chip.addEventListener('click',stop);
    select.addEventListener('change',()=>choose(select.value).catch(error=>message(M.errorMessage(error))));
    function download(blob,name) {const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
    for(const button of document.querySelectorAll('[data-media-export]'))button.addEventListener('click',()=>run(async()=>{
      if(!selected)return;await metadataQueue;const mode=button.dataset.mediaExport;
      const value=mode==='video'?await engine.read(selected.id):(await engine.list()).find(value=>value.id===selected.id);
      if(!value?.bytes)throw new Error('Cette session ne contient pas encore de vidéo récupérable.');
      if(value.state==='recording'&&Date.now()-value.updatedAt<15000)throw new Error('Cette vidéo est peut-être encore enregistrée dans un autre onglet. Arrêtez-y la capture avant de la télécharger.');
      const only=$('[data-media-kept]').checked,name=value.filename || M.filename(value),base=name.replace(/\.[^.]+$/,'');
      if(mode==='video'){download(value.blob,name);hooks.toast('Téléchargement de la vidéo lancé. Vérifiez le fichier téléchargé.');return;}
      const all=M.rows(value,only);if(mode!=='json'&&(mode!=='zip'||only)&&!all.length)throw new Error(only?'Aucune prise marquée « À garder » dans cette vidéo.':'Aucun passage de lecture horodaté dans cette vidéo.');
      if(mode==='zip'){download(M.pack(value,only),base+'-montage'+(only?'-a-garder':'')+'.zip');hooks.toast('Téléchargement du pack lancé. La vidéo est à télécharger séparément.');return;}
      const content=mode==='csv'?M.csv(value,only):mode==='srt'?M.srt(value,only):JSON.stringify(M.manifest(value),null,2);
      const type=mode==='csv'?'text/csv;charset=utf-8':mode==='srt'?'text/plain;charset=utf-8':'application/json;charset=utf-8';
      download(new Blob([content],{type}),`${base}${mode==='json'?'-dossier':'-reperes'+(only?'-a-garder':'')}.${mode}`);hooks.toast('Téléchargement des repères lancé.');
    }));
    const dialog=$('[data-media-delete-dialog]');
    $('[data-media-delete]').addEventListener('click',()=>{if(!selected)return;$('[data-media-delete-name]').textContent=selected.filename || M.filename(selected);dialog.showModal();});
    $('[data-media-delete-cancel]').addEventListener('click',()=>dialog.close());
    $('[data-media-delete-confirm]').addEventListener('click',()=>run(async()=>{const key=selected?.id;dialog.close();if(key){await engine.remove(key);await refresh();hooks.toast('Vidéo retirée de cet appareil.');}}));
    function updateTake(take) {
      if (!take) return; const current=hooks.script(), sameScript=value=>value?.id===current.id || value?.text===current.text && value?.collection===current.collection;
      if (sameScript(engine.snapshot()?.script)) engine.updateTake(take);
      metadataQueue=metadataQueue.then(async()=>{
        for(const value of records){if(!sameScript(value.script) || !value.segments.some(part=>part.id===take.id))continue;
          value.segments=value.segments.map(part=>part.id===take.id?{...part,...M.takeSnapshot(take)}:part);await engine.update(value);
        }paintSelection();
      }).catch(error=>message(M.errorMessage(error)));
    }
    window.addEventListener('beforeunload',event=>{if(engine.busy||engine.temporary){event.preventDefault();event.returnValue='';}});
    window.addEventListener('pagehide',()=>{engine.dispose();stopMeter();playback.pause();});
    window.addEventListener('pageshow',event=>{if(event.persisted){engine.resume();refresh().catch(error=>message(M.errorMessage(error)));}});
    navigator.mediaDevices?.addEventListener?.('devicechange',()=>{if(!engine.busy)devices();});
    await refresh();paint();
    return {reading:take=>engine.reading(take),updateTake,suspend:()=>{if(engine.recording){hooks.pause();engine.stop('hidden');}},paint:()=>paint(),get busy(){return engine.busy;},get recording(){return engine.recording;}};
  }
  window.PhilosophalPromptCamera={create};
})();
