/* Connexion directe de la télécommande. Aucun serveur de signalisation ni de relais. */
((root,factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PhilosophalPromptRemote = api;
})(typeof globalThis === 'object' ? globalThis : this,() => {
  'use strict';
  const VERSION = 5, TTL = 10 * 60 * 1000, MAX_CODE = 50000, MAX_MESSAGE = 6000;
  const COMMANDS = new Set(['play','pause','retake','previous','new-take','keep','retry','slower','faster','begin','quiet']);
  const plain = value => value && typeof value === 'object' && !Array.isArray(value);
  const finite = (value,min,max) => Math.max(min,Math.min(max,Number.isFinite(Number(value)) ? Number(value) : min));
  function random() {
    const bytes = new Uint8Array(16); globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes,byte => byte.toString(16).padStart(2,'0')).join('');
  }
  function encode(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    return 'PH5.' + btoa(Array.from(bytes,byte => String.fromCharCode(byte)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode(value,type,now = Date.now()) {
    if (typeof value !== 'string' || value.length > MAX_CODE) throw new Error('Ce code de connexion est trop long ou invalide.');
    let raw = value.trim();
    if (/^https?:\/\//i.test(raw)) { try { raw = new URL(raw).hash.slice(1); } catch { throw new Error('Ce lien de connexion est invalide.'); } }
    raw = raw.replace(/\s+/g,'');
    if (!/^PH5\.[A-Za-z0-9_-]+$/.test(raw)) throw new Error('Collez le code complet du téléprompteur V5.');
    let data;
    try { data = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(raw.slice(4).replace(/-/g,'+').replace(/_/g,'/')),char => char.charCodeAt(0)))); }
    catch { throw new Error('Ce code de connexion est incomplet ou illisible.'); }
    if (!plain(data) || data.v !== VERSION || data.type !== type || !/^[a-f0-9]{32}$/.test(data.session) || !/^[a-f0-9]{32}$/.test(data.secret)) throw new Error(type === 'answer' ? 'Utilisez le code de réponse fourni par le téléphone.' : 'Utilisez le lien ou le code fourni par l’ordinateur.');
    if (!Number.isFinite(data.createdAt) || data.createdAt > now + 120000 || now - data.createdAt > TTL) throw new Error('Ce code a expiré. Créez une nouvelle connexion sur l’ordinateur.');
    if (typeof data.sdp !== 'string' || data.sdp.length > 30000 || !/^v=0\r?\n/.test(data.sdp) || !/\r?\nm=application /.test(data.sdp) || /\r?\nm=(?:audio|video) /.test(data.sdp)) throw new Error('Ce code ne décrit pas une télécommande compatible.');
    return {v:VERSION,type,session:data.session,secret:data.secret,createdAt:data.createdAt,sdp:localAddress(data.sdp)};
  }
  function localAddress(sdp) {
    if (typeof sdp !== 'string' || !/\r?\na=candidate:/.test(sdp)) throw new Error('Ce navigateur ne fournit aucune adresse de connexion locale. Vérifiez que WebRTC et le réseau local sont autorisés, puis créez un nouveau lien.');
    return sdp;
  }
  function state(value = {}) {
    return {title:typeof value.title === 'string' ? value.title.slice(0,120) : 'Téléprompteur',scope:typeof value.scope === 'string' ? value.scope.slice(0,100) : '',
      status:typeof value.status === 'string' ? value.status.slice(0,160) : '',playing:value.playing === true,counting:value.counting === true,busy:value.busy === true,empty:value.empty === true,
      speed:finite(value.speed,5,180),progress:finite(value.progress,0,100),elapsed:finite(value.elapsed,0,86400),remaining:finite(value.remaining,0,86400),take:Math.floor(finite(value.take,0,Number.MAX_SAFE_INTEGER))};
  }
  function packet(value,identity,last = 0) {
    if (typeof value !== 'string' || value.length > MAX_MESSAGE) return null;
    let data; try { data = JSON.parse(value); } catch { return null; }
    if (!plain(data) || data.v !== VERSION || data.session !== identity.session || data.secret !== identity.secret || !Number.isSafeInteger(data.seq) || data.seq <= last) return null;
    if (data.kind === 'hello' && ['host','remote'].includes(data.role)) return {kind:'hello',role:data.role,seq:data.seq};
    if (data.kind === 'command' && COMMANDS.has(data.command)) return {kind:'command',command:data.command,seq:data.seq};
    if (data.kind === 'state' && plain(data.state)) return {kind:'state',state:state(data.state),seq:data.seq};
    if (['ping','pong'].includes(data.kind)) return {kind:data.kind,seq:data.seq};
    return null;
  }
  function connect({role,onStatus = () => {},onCommand = () => {},onState = () => {},onLoss = () => {},getState = () => ({}),peerFactory = config => new RTCPeerConnection(config),now = () => Date.now(),interval = globalThis.setInterval,clear = globalThis.clearInterval} = {}) {
    if (!['host','remote'].includes(role)) throw new Error('Rôle de télécommande invalide.');
    let peer = null, channel = null, identity = null, authenticated = false, closed = false, expired = false;
    let sent = 0, received = 0, lastSeen = now(), phase = 'idle', accepted = false, rateAt = now(), rateCount = 0, ticker = null, gatheringCancel = null, connectingSince = 0;
    function status(value,message) { if (phase !== value) { phase = value; onStatus(value,message); } }
    function lost(message) {
      const was = authenticated; authenticated = false; status('disconnected',message || 'Connexion interrompue.'); if (was) onLoss();
    }
    function send(data) {
      if (!identity || channel?.readyState !== 'open' || channel.bufferedAmount > 65536) return false;
      try { channel.send(JSON.stringify({v:VERSION,session:identity.session,secret:identity.secret,seq:++sent,...data})); return true; } catch { return false; }
    }
    function publish() { return authenticated && role === 'host' && send({kind:'state',state:state(getState())}); }
    function attach(value) {
      if (closed || channel && channel !== value || value.label !== 'philosophal-remote-v5') { value.close(); return; }
      channel = value;
      const hello = () => { if (!closed) send({kind:'hello',role}); };
      channel.addEventListener('open',hello); if (channel.readyState === 'open') hello();
      channel.addEventListener('message',event => {
        const data = packet(event.data,identity,received); if (!data || closed) return;
        received = data.seq; lastSeen = now();
        if (data.kind === 'hello' && data.role === role) return;
        if (!authenticated) {
          if (data.kind !== 'hello' && !accepted) return;
          authenticated = true; accepted = true; status('connected','Télécommande connectée.'); send({kind:'hello',role});
        }
        if (data.kind === 'hello') { publish(); return; }
        if (data.kind === 'ping') { send({kind:'pong'}); publish(); return; }
        if (data.kind === 'state' && role === 'remote') { onState(data.state); return; }
        if (data.kind === 'command' && role === 'host') {
          if (now() - rateAt > 1000) { rateAt = now(); rateCount = 0; }
          if (++rateCount <= 20 || data.command === 'pause') { onCommand(data.command); publish(); }
        }
      });
      channel.addEventListener('close',() => { if (!closed) lost('La télécommande a été déconnectée.'); });
      channel.addEventListener('error',() => { if (!closed) lost('La connexion a rencontré une erreur.'); });
    }
    function setup() {
      if (closed) throw new Error('Cette connexion est fermée. Créez-en une nouvelle.');
      peer = peerFactory({iceServers:[],bundlePolicy:'max-bundle'});
      peer.addEventListener('datachannel',event => attach(event.channel));
      peer.addEventListener('connectionstatechange',() => {
        if (closed) return;
        if (['failed','disconnected','closed'].includes(peer.connectionState)) lost('Connexion perdue. Vérifiez que les deux appareils sont sur le même Wi-Fi.');
      });
      ticker = interval(() => {
        if (closed || !identity) return;
        if (role === 'host' && phase === 'connecting' && now() - connectingSince > 25000) { close(); status('failed','Connexion impossible. Vérifiez le Wi-Fi ; les réseaux d’invités peuvent isoler les appareils. Créez ensuite un nouveau lien.'); return; }
        if (!accepted && now() - identity.createdAt > TTL) { expired = true; close(); status('expired','Le code a expiré. Créez une nouvelle connexion.'); return; }
        if (authenticated && now() - lastSeen > 8000) lost('Le téléphone ne répond plus. La lecture est en pause.');
        if (channel?.readyState === 'open') { send({kind:accepted ? 'ping' : 'hello',role}); publish(); }
      },1500);
    }
    function gather() {
      if (peer.iceGatheringState === 'complete') return Promise.resolve();
      return new Promise((resolve,reject) => {
        const timeout = setTimeout(() => finish(new Error('La préparation de la connexion a pris trop de temps. Réessayez sur le même Wi-Fi.')),12000);
        const change = () => { if (peer.iceGatheringState === 'complete') finish(); };
        const finish = error => { clearTimeout(timeout); peer.removeEventListener('icegatheringstatechange',change); gatheringCancel = null; error ? reject(error) : resolve(); };
        gatheringCancel = () => finish(new Error('Connexion annulée.')); peer.addEventListener('icegatheringstatechange',change); change();
      });
    }
    async function offer() {
      if (role !== 'host' || peer) throw new Error('Créez une nouvelle connexion pour obtenir un autre code.');
      identity = {v:VERSION,session:random(),secret:random(),createdAt:now()}; status('preparing','Préparation du lien…'); setup();
      attach(peer.createDataChannel('philosophal-remote-v5',{ordered:true}));
      await peer.setLocalDescription(await peer.createOffer()); await gather();
      if (closed) throw new Error('Connexion annulée.');
      const sdp = localAddress(peer.localDescription.sdp); status('waiting','Lien prêt. Ouvrez-le sur le téléphone.'); return encode({...identity,type:'offer',sdp});
    }
    async function answer(value) {
      if (role !== 'remote' || peer) throw new Error('Créez une nouvelle connexion avant de réessayer.');
      const invitation = decode(value,'offer',now()); identity = invitation; status('preparing','Préparation de la réponse…'); setup();
      await peer.setRemoteDescription({type:'offer',sdp:invitation.sdp}); await peer.setLocalDescription(await peer.createAnswer()); await gather();
      if (closed) throw new Error('Connexion annulée.');
      const sdp = localAddress(peer.localDescription.sdp); status('waiting','Collez la réponse sur l’ordinateur.'); return encode({...identity,type:'answer',sdp});
    }
    async function accept(value) {
      if (role !== 'host' || !peer || !identity || closed || accepted || peer.remoteDescription) throw new Error('Créez une connexion avant de coller la réponse du téléphone.');
      const response = decode(value,'answer',now());
      if (response.session !== identity.session || response.secret !== identity.secret || response.createdAt !== identity.createdAt) throw new Error('Cette réponse correspond à une autre connexion. Utilisez le dernier lien créé.');
      connectingSince = now(); status('connecting','Connexion au téléphone…'); await peer.setRemoteDescription({type:'answer',sdp:response.sdp});
    }
    function close() {
      if (closed) return; closed = true; gatheringCancel?.(); clear(ticker); const was = authenticated; authenticated = false;
      try { channel?.close(); peer?.close(); } catch {}
      if (was) onLoss(); if (!expired) status('closed','Télécommande déconnectée.');
    }
    return {offer,answer,accept,close,publish,command:name => role === 'remote' && authenticated && COMMANDS.has(name) && send({kind:'command',command:name}),get connected(){return authenticated;},get phase(){return phase;}};
  }
  return {VERSION,TTL,MAX_CODE,MAX_MESSAGE,COMMANDS,encode,decode,state,packet,connect};
});
