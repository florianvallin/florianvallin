/* V54.5 — Envoi groupé, entrée facultative : aucun impact sur les transferts individuels. */
(()=>{'use strict';const B=window.PhilosophalAVCutBridge,dialog=document.getElementById('v543StudioDialog');if(!dialog||!B?.putBatch)return;
const host=dialog.querySelector('.v543-wrap'),anchor=host.querySelector('.v543-meta');if(!host||!anchor)return;
const panel=document.createElement('section');panel.className='v545-batch';panel.innerHTML=`<h3>Dossier de production · envoi groupé</h3><p>Regroupez jusqu’à 12 médias audio/vidéo et leurs éventuels fichiers de sous-titres (.srt, .vtt). Le montage actuel ne sera pas remplacé.</p><label>Nom du projet<input id="v545BatchTitle" type="text" maxlength="90" placeholder="Ex. Philosophie de l’amour — épisode 04"></label><label>Fichiers audio, vidéo et sous-titres<input id="v545BatchFiles" type="file" multiple accept="audio/*,video/*,.mp4,.mov,.webm,.mkv,.wav,.m4a,.mp3,.flac,.ogg,.srt,.vtt"></label><small id="v545BatchSummary">Aucun fichier sélectionné</small><button type="button" class="v543-action primary" id="v545BatchSend">Envoyer le dossier vers Cut →</button><small id="v545BatchResult" role="status" aria-live="polite"></small>`;host.insertBefore(panel,anchor);
const files=panel.querySelector('#v545BatchFiles'),summary=panel.querySelector('#v545BatchSummary'),send=panel.querySelector('#v545BatchSend'),result=panel.querySelector('#v545BatchResult');
files.addEventListener('change',()=>{const a=[...files.files];summary.textContent=a.length?`${a.length} fichier(s) · ${(a.reduce((x,f)=>x+f.size,0)/1024**2).toFixed(1)} Mo`:'Aucun fichier sélectionné';result.textContent='';});
const base=name=>name.replace(/\.[^.]+$/,'').toLowerCase().replace(/(?:[-_ ](?:sous-titres|subtitles|transcription|captions|fr|en))$/,'').trim();
send.onclick=async()=>{const input=[...files.files],media=input.filter(f=>B.kind(f,f.name)),subs=input.filter(f=>/\.(srt|vtt)$/i.test(f.name));
 if(!media.length){result.textContent='Ajoutez au moins un fichier audio ou vidéo.';return;}
 if(media.length>12){result.textContent='Limite de 12 médias par transfert.';return;}
 if(input.length!==media.length+subs.length){result.textContent='Un fichier possède un format non reconnu.';return;}
 if(subs.some(f=>f.size>2*1024**2)){result.textContent='Sous-titres trop volumineux (2 Mo maximum).';return;}
 if(!confirm(`Préparer ${media.length} média(s) pour Cut ? Ils seront conservés temporairement dans ce navigateur.`))return;
 send.disabled=true;result.textContent='Préparation du dossier et association des sous-titres…';
 try{const parsed=await Promise.all(subs.map(async f=>({name:base(f.name),cues:B.timedText(await f.text())})));
  const items=media.map(f=>({blob:f,name:f.name,cues:parsed.find(x=>x.name===base(f.name))?.cues||[]}));
  const response=await B.putBatch(items,{project:panel.querySelector('#v545BatchTitle').value||'Production audiovisuelle'});
  result.textContent='Dossier créé. Ouverture de Cut…';window.top.location.assign('/outils/philosophal-cut/?av-batch='+encodeURIComponent(response.batchId));
 }catch(e){result.textContent='Envoi impossible : '+(e?.message||e)}finally{send.disabled=false;}
};
})();
