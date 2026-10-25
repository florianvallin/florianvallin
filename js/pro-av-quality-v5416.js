/* Philosophal V54.16 — contrôles de fichiers, durées et repères temporels.
   Toutes les inspections sont locales. Aucun média n'est envoyé à un serveur. */
(()=>{'use strict';
if(window.PhilosophalAVQuality)return;
const MAX_PROBE_MS=6500,stamp=()=>new Date().toISOString();
const extOf=name=>(String(name||'').match(/\.([^.]+)$/)?.[1]||'').toLowerCase();
const text=(buf,a,b)=>String.fromCharCode(...buf.subarray(a,b));
const sec=n=>Number.isFinite(n)?n.toFixed(3)+' s':'indéterminée';
const samples=async(blob)=>new Uint8Array(await blob.slice(0,Math.min(blob.size,4096)).arrayBuffer());
function inspectHeader(bytes,filename){
 const e=extOf(filename),signature=text(bytes,0,4);
 let detected='inconnu';
 if(signature==='RIFF'&&text(bytes,8,12)==='WAVE')detected='wav';
 else if(signature==='OggS')detected='ogg';
 else if(bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3)detected='webm';
 else if(text(bytes,4,8)==='ftyp')detected='mp4';
 else if(signature==='fLaC')detected='flac';
 else if(signature==='ID3'||(bytes[0]===255&&(bytes[1]&0xe0)===0xe0))detected='mp3';
 else if(signature==='FORM'&&text(bytes,8,12)==='AIFF')detected='aiff';
 else if(signature==='\x1aE\xdf\xa3')detected='webm';
 const matching={wav:['wav'],wave:['wav'],webm:['webm'],ogg:['ogg'],oga:['ogg'],ogv:['ogg'],mp4:['mp4'],m4a:['mp4'],m4v:['mp4'],mov:['mp4'],flac:['flac'],mp3:['mp3'],aif:['aiff'],aiff:['aiff']};
 const known=Object.hasOwn(matching,e),strict=known&&detected!=='inconnu';
 // WebM/Matroska shares EBML, MP4/QuickTime may contain a different compatible brand.
 const compatible=!strict||matching[e].includes(detected)||e==='mov'&&detected==='mp4';
 return {extension:e,container:detected,recognized:detected!=='inconnu',compatible,strict};
}
function wavInfo(bytes,size){
 if(bytes.length<12||text(bytes,0,4)!=='RIFF'||text(bytes,8,12)!=='WAVE')return null;
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 let channels=0,rate=0,align=0,bits=0,dataSize=null,foundFmt=false;
 // WAV peut inclure LIST, JUNK, extensible fmt ou des marqueurs avant data.
 for(let at=12;at+8<=bytes.length;){
  const kind=text(bytes,at,at+4),len=v.getUint32(at+4,true),start=at+8;
  if(kind==='fmt '&&start+16<=bytes.length){channels=v.getUint16(start+2,true);rate=v.getUint32(start+4,true);align=v.getUint16(start+12,true);bits=v.getUint16(start+14,true);foundFmt=true;}
  if(kind==='data'){dataSize=Math.min(len,Math.max(0,size-start));break;}
  if(!Number.isFinite(len)||len>size||at+8+len<=at)break;
  at+=8+len+(len%2);
 }
 if(!foundFmt)return null;
 const plausible=channels>0&&channels<=32&&rate>=4000&&rate<=384000&&align>0&&bits>=8&&bits<=64;
 return {channels,rate,bits,valid:plausible,duration:plausible&&dataSize!==null?dataSize/(rate*align):null};
}
async function durationProbe(blob,type,timeoutMs=MAX_PROBE_MS){
 if(typeof document==='undefined'||!URL?.createObjectURL)return {duration:null,reason:'Aperçu multimédia non disponible'};
 const tag=document.createElement(type==='video'?'video':'audio'),url=URL.createObjectURL(blob);let timer=null;
 return new Promise(resolve=>{
  let settled=false;
  const done=(duration,reason='',width=0,height=0)=>{if(settled)return;settled=true;clearTimeout(timer);tag.pause();tag.removeAttribute('src');try{tag.load();}catch{}tag.remove();URL.revokeObjectURL(url);resolve({duration:Number.isFinite(duration)&&duration>0?duration:null,reason,width,height});};
  tag.preload='metadata';tag.muted=true;tag.playsInline=true;
  tag.onloadedmetadata=()=>done(tag.duration,'',tag.videoWidth||0,tag.videoHeight||0);
  tag.onerror=()=>done(null,'Décodage des métadonnées non pris en charge');
  timer=setTimeout(()=>done(null,'Délai de lecture des métadonnées dépassé'),timeoutMs);
  tag.src=url;try{tag.load()}catch(e){done(null,e.message)}
 });
}
function timing(cues,markers,duration){
 const rows=Array.isArray(cues)?cues:[],marks=Array.isArray(markers)?markers:[];
 let invalid=0,overlap=0,outside=0,lateMarkers=0,maxEnd=0,prior=0;
 for(const c of rows){const a=Number(c.start),b=Number(c.end);if(!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<=a){invalid++;continue;}
  if(a<prior-0.005)overlap++;prior=Math.max(prior,b);maxEnd=Math.max(maxEnd,b);
  if(Number.isFinite(duration)&&duration>0&&b>duration+0.20)outside++;
 }
 for(const m of marks){const t=Number(m.time);if(!Number.isFinite(t)||t<0||(Number.isFinite(duration)&&duration>0&&t>duration+0.20))lateMarkers++}
 return {cues:rows.length,markers:marks.length,invalid,overlap,outside,lateMarkers,maxEnd};
}
async function fingerprint(blob){
 if(!(blob instanceof Blob)||!blob.size)return '';
 if(!crypto?.subtle?.digest)return '';
 // Contrôle échantillonné, peu gourmand même pour un rush de plusieurs Go.
 const span=65536;const [head,tail]=await Promise.all([blob.slice(0,Math.min(blob.size,span)).arrayBuffer(),blob.slice(Math.max(0,blob.size-span)).arrayBuffer()]);
 const h=new Uint8Array(head),t=new Uint8Array(tail),raw=new Uint8Array(8+h.length+t.length);new DataView(raw.buffer).setBigUint64(0,BigInt(blob.size),false);raw.set(h,8);raw.set(t,8+h.length);
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',raw));return 'sample-sha256:'+Array.from(digest,b=>b.toString(16).padStart(2,'0')).join('');
}
async function inspect(blob,name,options={}){
 if(!(blob instanceof Blob))throw Error('Sélectionnez un fichier valide.');
 const result={version:'54.16',checkedAt:stamp(),name:String(name||blob.name||'fichier'),bytes:blob.size,status:'ok',warnings:[],errors:[],sourceDuration:Number(options.expectedDuration)||null,container:'inconnu',extension:extOf(name||blob.name),duration:null,type:blob.type||'',width:0,height:0,signature:'',timing:null};
 if(blob.size===0){result.errors.push('Fichier vide.');result.status='error';return result;}
 const bytes=await samples(blob),header=inspectHeader(bytes,result.name);result.container=header.container;
 if(header.strict&&!header.compatible)result.errors.push('Conteneur '+header.container.toUpperCase()+' incompatible avec l’extension .'+header.extension+'.');
 if(!header.recognized)result.warnings.push('En-tête non reconnu : vérifiez le fichier dans un lecteur externe.');
 if(header.container==='wav'){
  const wi=wavInfo(bytes,blob.size);if(wi&&!wi.valid)result.errors.push('En-tête WAV PCM incohérent.');
  if(wi){result.channels=wi.channels;result.sampleRate=wi.rate;result.bitDepth=wi.bits;if(wi.duration!==null)result.duration=wi.duration;}
 }
 const shouldProbe=options.probe!==false&&(/^(audio|video)\//.test(blob.type)||/^(mp4|m4v|webm|mov|ogg|oga|mp3|wav|m4a|flac)$/.test(result.extension));
 if(shouldProbe&&(result.duration===null||options.probeVideo===true)){
  const type=blob.type.startsWith('video/')||/^(mp4|m4v|mov)$/.test(result.extension)?'video':'audio';
  const probe=await durationProbe(blob,type,options.timeoutMs||MAX_PROBE_MS);
  if(probe.duration!==null)result.duration=probe.duration;
  if(probe.width){result.width=probe.width;result.height=probe.height;}
  if(probe.reason)result.warnings.push(probe.reason+'.');
 }
 if(result.sourceDuration&&result.duration){result.delta=Math.abs(result.sourceDuration-result.duration);
  const tolerance=Math.max(0.65,result.sourceDuration*0.025);
  if(result.delta>tolerance)result.warnings.push('Écart de durée '+sec(result.delta)+' entre la source et le fichier exporté (tolérance '+sec(tolerance)+').');
 }
 if(!result.duration)result.warnings.push('Durée non vérifiable automatiquement.');
 result.timing=timing(options.cues,options.markers,result.duration||result.sourceDuration);
 if(result.timing.invalid)result.errors.push(result.timing.invalid+' sous-titre(s) avec des horaires invalides.');
 if(result.timing.outside)result.warnings.push(result.timing.outside+' sous-titre(s) au-delà de la durée du média.');
 if(result.timing.overlap)result.warnings.push(result.timing.overlap+' chevauchement(s) de sous-titres.');
 if(result.timing.lateMarkers)result.warnings.push(result.timing.lateMarkers+' marqueur(s) hors durée.');
 result.status=result.errors.length?'error':result.warnings.length?'warning':'ok';return result;
}
function label(r){if(!r)return 'Aucun diagnostic disponible';const s=r.status==='error'?'ERREUR':r.status==='warning'?'À VÉRIFIER':'CONFORME';return s+' · '+r.name+' · '+(r.bytes/1024**2).toFixed(1)+' Mo · durée '+sec(r.duration)+' · '+r.errors.length+' erreur(s), '+r.warnings.length+' réserve(s)';}
function downloadReport(report){const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(report.name||'media').replace(/\.[^.]+$/,'').replace(/[^a-z\d_. -]/gi,'_').slice(0,90)+'-controle-qualite.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
let lastExport=null;const broadcast=(result)=>{lastExport=result;window.dispatchEvent(new CustomEvent('philosophal-av-qa',{detail:result}));};
window.PhilosophalAVQuality={inspect,fingerprint,timing,label,downloadReport,recordExport:broadcast,getLastExport:()=>lastExport};
})();
