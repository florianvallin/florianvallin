/* Philosophal V54.4 — écriture progressive locale des longues prises. */
(()=>{'use strict';
 const ok=()=>!!(window.isSecureContext&&typeof window.showSaveFilePicker==='function');
 const safe=s=>String(s||'Philosophal').replace(/[\\/:*?"<>|\x00-\x1f]/g,'-').replace(/[. ]+$/,'').slice(0,95)||'Philosophal';
 function header(rate,bytes){
  if(!Number.isInteger(rate)||rate<8000||rate>384000||bytes<0||bytes>0xffffffff-36)throw Error('La limite WAV de 4 Go est atteinte. Terminez la prise et commencez un nouveau fichier.');
  const arr=new Uint8Array(44),h=new DataView(arr.buffer);
  for(const [at,text] of [[0,'RIFF'],[8,'WAVE'],[12,'fmt '],[36,'data']])for(let i=0;i<text.length;i++)h.setUint8(at+i,text.charCodeAt(i));
  h.setUint32(4,36+bytes,true);h.setUint32(16,16,true);h.setUint16(20,1,true);h.setUint16(22,1,true);h.setUint32(24,rate,true);h.setUint32(28,rate*2,true);h.setUint16(32,2,true);h.setUint16(34,16,true);h.setUint32(40,bytes,true);return arr;
 }
 async function open(kind,name){
  if(!ok())throw Error('Écriture directe indisponible. Utilisez Brave ou Chrome récent sur une page HTTPS.');
  const audio=kind==='wav',ext=audio?'wav':kind==='mp4'?'mp4':'webm',mime=audio?'audio/wav':kind==='mp4'?'video/mp4':'video/webm';
  const handle=await showSaveFilePicker({suggestedName:safe(name)+'.'+ext,types:[{description:audio?'Audio WAV':'Vidéo '+ext.toUpperCase(),accept:{[mime]:['.'+ext]}}]});
  const writable=await handle.createWritable();let chain=Promise.resolve(),pending=0,bytes=0,error=null,closed=false;
  const queue=(data,size)=>{
   if(closed||error)return false;
   if(pending+size>32*1024*1024){error=Error('Le disque ne suit pas la capture : tampon d’écriture supérieur à 32 Mo.');return false;}
   pending+=size;
   chain=chain.then(async()=>{if(error)return;await writable.write(data);bytes+=size;}).catch(e=>{error=e;}).finally(()=>{pending-=size;});
   return true;
  };
  const api={kind,handle,get bytes(){return bytes},get pending(){return pending},get error(){return error},
   async initVoice(rate){if(!audio)throw Error('WAV attendu.');if(!queue(header(rate,0),44))throw error||Error('Écriture impossible.');await chain;if(error)throw error;},
   appendAudio(samples){if(!audio)return false;const pcm=new Int16Array(samples.length);for(let i=0;i<samples.length;i++){const a=Math.max(-1,Math.min(1,samples[i]));pcm[i]=a<0?Math.round(a*32768):Math.round(a*32767);}return queue(pcm.buffer,pcm.byteLength);},
   appendVideo(blob){return queue(blob,blob.size);},
   async finish(rate){if(closed)throw Error('Le fichier est déjà fermé.');closed=true;await chain;
    const saved=bytes;
    try{
     if(audio){if(saved<44)throw Error('En-tête WAV absent.');await writable.write({type:'write',position:0,data:header(rate,saved-44)});}
     await writable.close();
    }catch(e){try{await writable.abort();}catch{}throw e;}
    if(error)throw Error('Erreur d’écriture sur le disque : '+(error.message||error));
    return handle.getFile();
   },
   async abort(){closed=true;try{await writable.abort();}catch{}},
  };
  return api;
 }
 window.PhilosophalV544Streaming={supported:ok,open,header};
})();