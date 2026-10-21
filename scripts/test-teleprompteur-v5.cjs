'use strict';
const assert = require('node:assert/strict');
const R = require('../apprendre/creation/teleprompteur/teleprompteur-remote.js');
let count = 0;
async function test(name,fn) { await fn(); console.log('PASS ' + name); count++; }
const sdp = key => `v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\na=mock-peer:${key}\r\na=candidate:1 1 udp 2122260223 127.0.0.1 9999 typ host\r\n`;
const identity = {v:5,type:'offer',session:'a'.repeat(32),secret:'b'.repeat(32),createdAt:Date.now(),sdp:sdp('sample')};
class Events {
  constructor() { this.events = new Map(); }
  addEventListener(type,fn) { if (!this.events.has(type)) this.events.set(type,new Set()); this.events.get(type).add(fn); }
  removeEventListener(type,fn) { this.events.get(type)?.delete(fn); }
  emit(type,value = {}) { for (const fn of this.events.get(type) || []) fn(value); }
}
class Channel extends Events {
  constructor() { super(); this.label = 'philosophal-remote-v5'; this.readyState = 'connecting'; this.bufferedAmount = 0; this.sent = []; this.blocked = false; }
  send(value) { if (this.readyState !== 'open') throw new Error('closed'); this.sent.push(value); if (!this.blocked) queueMicrotask(() => this.other?.emit('message',{data:value})); }
  close() { this.readyState = 'closed'; this.emit('close'); }
}
function environment() {
  let time = Date.now(), next = 0;
  const peers = new Map(), tasks = new Set();
  class Peer extends Events {
    constructor(config) { super(); this.id = String(++next); this.config = config; this.iceGatheringState = 'complete'; this.connectionState = 'new'; this.remoteDescription = null; peers.set(this.id,this); }
    createDataChannel() { return this.channel = new Channel(); }
    async createOffer() { return {type:'offer',sdp:sdp(this.id)}; }
    async createAnswer() { return {type:'answer',sdp:sdp(this.id)}; }
    async setLocalDescription(value) { this.localDescription = value; }
    async setRemoteDescription(value) {
      this.remoteDescription = value;
      if (value.type !== 'answer') return;
      const other = peers.get(/a=mock-peer:(\w+)/.exec(value.sdp)[1]);
      const remote = new Channel(); this.channel.other = remote; remote.other = this.channel; other.channel = remote;
      other.emit('datachannel',{channel:remote}); this.channel.readyState = remote.readyState = 'open';
      this.connectionState = other.connectionState = 'connected'; this.channel.emit('open'); remote.emit('open');
    }
    close() { this.connectionState = 'closed'; this.emit('connectionstatechange'); }
  }
  return {peers,tasks,now:() => time,advance:ms => { time += ms; for (const task of [...tasks]) task(); },
    options:{peerFactory:config => new Peer(config),now:() => time,interval:fn => { tasks.add(fn); return fn; },clear:fn => tasks.delete(fn)}};
}
const drain = () => new Promise(resolve => setImmediate(resolve));
async function pair(options = {}) {
  const env = environment(), commands = [], states = [], phases = [], losses = [];
  let playing = true;
  const host = R.connect({...env.options,role:'host',getState:() => ({title:'L’amour',playing,speed:40,progress:12,elapsed:9,remaining:60,take:3}),onCommand:value => commands.push(value),onLoss:() => { playing = false; losses.push('host'); },onStatus:phase => phases.push(phase),...options});
  const phone = R.connect({...env.options,role:'remote',onState:value => states.push(value),onLoss:() => losses.push('phone')});
  const offer = await host.offer(), answer = await phone.answer(offer); await host.accept(answer); await drain();
  return {env,host,phone,offer,answer,commands,states,phases,losses,close:() => { host.close(); phone.close(); }};
}
(async () => {
  await test('Un code préserve exactement la session et la description de connexion',() => assert.deepEqual(R.decode(R.encode(identity),'offer'),identity));
  await test('Un lien complet et un code avec retours à la ligne sont acceptés',() => {
    assert.equal(R.decode('https://philosophal.fr/telecommande/#'+R.encode(identity),'offer').secret,identity.secret);
    assert.equal(R.decode(R.encode(identity).replace(/(.{60})/g,'$1\n'),'offer').session,identity.session);
  });
  await test('Les codes incomplets ou étrangers sont refusés',() => { for (const value of ['','PH4.test','PH5.a','bonjour']) assert.throws(() => R.decode(value,'offer')); });
  await test('Le code offre et le code réponse ne sont pas interchangeables',() => assert.throws(() => R.decode(R.encode(identity),'answer')));
  await test('Un code expiré et une date incohérente sont refusés',() => {
    assert.throws(() => R.decode(R.encode({...identity,createdAt:Date.now()-R.TTL-2000}),'offer'));
    assert.throws(() => R.decode(R.encode({...identity,createdAt:Date.now()+125000}),'offer'));
  });
  await test('Les codes sont bornés avant décodage',() => assert.throws(() => R.decode('x'.repeat(R.MAX_CODE+1),'offer')));
  await test('La connexion ne peut négocier que des données, sans audio ni vidéo',() => {
    for (const kind of ['audio','video']) assert.throws(() => R.decode(R.encode({...identity,sdp:identity.sdp+`m=${kind} 9 UDP/TLS/RTP/SAVPF 96\r\n` }),'offer'));
  });
  await test('Une absence d’adresse réseau est signalée au lieu de créer un lien inutilisable',() => {
    assert.throws(() => R.decode(R.encode({...identity,sdp:identity.sdp.replace(/a=candidate:[^\r]+\r\n/,'')}),'offer'),/aucune adresse/);
  });
  await test('Le tableau de bord ne contient ni script complet ni propriétés étrangères',() => {
    const value = R.state({title:'Amour',text:'Texte privé',unknown:true,speed:999,progress:-100,elapsed:Infinity});
    assert.equal(value.text,undefined); assert.equal(value.unknown,undefined); assert.equal(value.speed,180); assert.equal(value.progress,0); assert.equal(value.elapsed,0);
  });
  const msg = (patch = {}) => JSON.stringify({v:5,session:identity.session,secret:identity.secret,seq:1,kind:'command',command:'play',...patch});
  await test('Les commandes exigent l’identité de la connexion',() => { assert.equal(R.packet(msg({secret:'wrong'}),identity),null); assert.equal(R.packet(msg({session:'other'}),identity),null); });
  await test('Une commande dupliquée ou ancienne n’est pas exécutée deux fois',() => assert.equal(R.packet(msg(),identity,1),null));
  await test('La liste de commandes exclut toute exécution de code ou navigation',() => {
    for (const command of ['eval','navigate','delete','upload','play;alert(1)']) assert.equal(R.packet(msg({command}),identity),null);
    for (const command of R.COMMANDS) assert.equal(R.packet(msg({command}),identity).command,command);
  });
  await test('Les messages invalides, énormes ou à séquence non entière sont ignorés',() => {
    assert.equal(R.packet('no-json',identity),null); assert.equal(R.packet('x'.repeat(6001),identity),null); assert.equal(R.packet(msg({seq:1.2}),identity),null);
  });
  await test('Les deux appareils attendent l’authentification avant d’activer les commandes',async () => {
    const env = environment(), host = R.connect({...env.options,role:'host'}); await host.offer(); assert.equal(host.connected,false); assert.equal(host.phase,'waiting'); assert.equal(host.command('play'),false); host.close();
  });
  await test('Association complète, échange des états et commandes sur le canal',async () => {
    const p = await pair(); assert.equal(p.host.connected,true); assert.equal(p.phone.connected,true); assert.equal(p.states.at(-1).title,'L’amour');
    assert.equal(p.phone.command('pause'),true); await drain(); assert.deepEqual(p.commands,['pause']); p.close();
  });
  await test('La configuration ne contacte aucun serveur STUN, TURN ou de signalisation',async () => {
    const p = await pair(); for (const peer of p.env.peers.values()) assert.deepEqual(peer.config,{iceServers:[],bundlePolicy:'max-bundle'}); p.close();
  });
  await test('Les commandes play et pause restent explicites pour éviter une inversion au double appui',async () => {
    const p = await pair(); p.phone.command('play'); p.phone.command('play'); await drain(); assert.deepEqual(p.commands,['play','play']); p.close();
  });
  await test('La réception du même paquet deux fois conserve une seule action',async () => {
    const p = await pair(); p.phone.command('retake'); await drain(); const host = [...p.env.peers.values()][0], phone = [...p.env.peers.values()][1];
    host.channel.emit('message',{data:phone.channel.sent.at(-1)}); assert.deepEqual(p.commands,['retake']); p.close();
  });
  await test('Un canal saturé n’accumule pas des commandes à exécuter plus tard',async () => {
    const p = await pair(); [...p.env.peers.values()][1].channel.bufferedAmount = 70000; assert.equal(p.phone.command('new-take'),false); assert.deepEqual(p.commands,[]); p.close();
  });
  await test('Une rafale de commandes est limitée, avec pause prioritaire',async () => {
    const p = await pair(); for (let i=0;i<35;i++) p.phone.command('faster'); p.phone.command('pause'); await drain();
    assert.equal(p.commands.filter(x => x==='faster').length,20); assert.equal(p.commands.at(-1),'pause'); p.close();
  });
  await test('La perte des échanges déclenche une pause et désactive la télécommande',async () => {
    const p = await pair(); for (const peer of p.env.peers.values()) peer.channel.blocked = true; p.env.advance(9000); await drain();
    assert.equal(p.host.connected,false); assert.equal(p.phone.connected,false); assert.ok(p.losses.includes('host')); assert.equal(p.phone.command('play'),false); p.close();
  });
  await test('Le rétablissement de la liaison ne relance pas la lecture',async () => {
    const p = await pair(); for (const peer of p.env.peers.values()) peer.channel.blocked = true; p.env.advance(9000); await drain();
    for (const peer of p.env.peers.values()) peer.channel.blocked = false; p.env.advance(1500); await drain();
    assert.equal(p.host.connected,true); assert.equal(p.phone.connected,true); assert.equal(p.states.at(-1).playing,false); p.close();
  });
  await test('Une réponse d’une autre session n’est jamais appliquée au lecteur',async () => {
    const env = environment(), host = R.connect({...env.options,role:'host'}); const invitation = R.decode(await host.offer(),'offer');
    await assert.rejects(host.accept(R.encode({...invitation,type:'answer',secret:'c'.repeat(32)})),/autre connexion/); assert.equal([...env.peers.values()][0].remoteDescription,null); host.close();
  });
  await test('Un code inutilisé expire et libère la connexion',async () => {
    const env = environment(), host = R.connect({...env.options,role:'host'}); await host.offer(); env.advance(R.TTL+1);
    assert.equal(host.phase,'expired'); assert.equal(env.tasks.size,0); assert.equal([...env.peers.values()][0].connectionState,'closed');
  });
  await test('La déconnexion libère les deux connexions et leurs minuteries',async () => {
    const p = await pair(); p.close(); assert.equal(p.env.tasks.size,0); assert.equal(p.host.connected,false); assert.equal(p.phone.command('play'),false);
  });
  await test('Annuler pendant la collecte des adresses termine la promesse sans attente résiduelle',async () => {
    const env = environment(), original = env.options.peerFactory;
    const host = R.connect({...env.options,role:'host',peerFactory:config => { const peer = original(config); peer.iceGatheringState = 'gathering'; return peer; }});
    const pending = host.offer(); await drain(); host.close(); await assert.rejects(pending,/annulée/); assert.equal(env.tasks.size,0);
  });
  await test('Une collecte sans adresse locale ne signale jamais un lien prêt',async () => {
    const env = environment(), phases = [], original = env.options.peerFactory;
    const host = R.connect({...env.options,role:'host',onStatus:phase => phases.push(phase),peerFactory:config => {
      const peer = original(config); peer.setLocalDescription = async value => { peer.localDescription = {...value,sdp:value.sdp.replace(/a=candidate:[^\r]+\r\n/,'')}; }; return peer;
    }});
    await assert.rejects(host.offer(),/aucune adresse/); assert.ok(!phases.includes('waiting')); host.close();
  });
  await test('Une association qui ne répond pas expire avec un message de réseau',async () => {
    const env = environment(), original = env.options.peerFactory;
    const host = R.connect({...env.options,role:'host',peerFactory:config => { const peer = original(config); peer.setRemoteDescription = async value => { peer.remoteDescription = value; }; return peer; }});
    const invitation = R.decode(await host.offer(),'offer'); await host.accept(R.encode({...invitation,type:'answer'})); env.advance(26000);
    assert.equal(host.phase,'failed'); assert.equal(env.tasks.size,0); assert.equal(host.connected,false);
  });
  console.log(count + ' tests V5 réussis');
})().catch(error => { console.error(error); process.exitCode = 1; });
