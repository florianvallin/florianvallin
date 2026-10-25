/* V54.5 — Envoi groupé, entrée facultative : aucun impact sur les transferts individuels. */
(()=>{'use strict';const B=window.PhilosophalAVCutBridge,dialog=document.getElementById('v543StudioDialog');if(!dialog||!B?.putBatch)return;
const host=dialog.querySelector('.v543-wrap'),anchor=host.querySelector('.v543-meta');if(!host||!anchor)return;
const panel=document.createElement('section');panel.className='v545-batch';panel.innerHTML=`<h3>Dossier de production · envoi groupé</h3><p>Regroupez jusqu’à 12 médias audio/vidéo et leurs éventuels fichiers de sous-titres (.srt, .vtt). Le montage actuel ne sera pas remplacé.</p><label>Nom du projet<input id="v545BatchTitle" type="text" maxlength="90" placeholder="Ex. Philosophie de l’amour — épisode 04"></label><label class="v545-session"><input type="checkbox" id="v5415IncludeSession"> Ajouter les médias ouverts dans la session Studio (si disponibles)</label><label>Fichiers audio, vidéo, sous-titres et fiches .markers.json<input id="v545BatchFiles" type="file" multiple accept="audio/*,video/*,.mp4,.mov,.webm,.mkv,.wav,.m4a,.mp3,.flac,.ogg,.srt,.vtt,.json"></label><small id="v545BatchSummary">Aucun fichier sélectionné</small><button type="button" class="v543-action primary" id="v545BatchSend">Envoyer le dossier vers Cut →</button><small id="v545BatchResult" role="status" aria-live="polite"></small>`;host.insertBefore(panel,anchor);
const incl=panel.querySelector('#v5415IncludeSession');
const currentStudioMedia=()=>window.PhilosophalV10Workflow?.snapshot?.()?.assets?.filter(a=>a.blob instanceof Blob&&B.kind(a.blob,a.name))||[];
incl.addEventListener('change',()=>{const count=currentStudioMedia().length;summary.textContent=incl.checked?`${count} média(s) de la session + fichiers sélectionnés`:'Sélectionnez des fichiers à envoyer.';});
const files=panel.querySelector('#v545BatchFiles'),summary=panel.querySelector('#v545BatchSummary'),send=panel.querySelector('#v545BatchSend'),result=panel.querySelector('#v545BatchResult');
files.addEventListener('change',()=>{const a=[...files.files];summary.textContent=a.length?`${a.length} fichier(s) · ${(a.reduce((x,f)=>x+f.size,0)/1024**2).toFixed(1)} Mo`:'Aucun fichier sélectionné';result.textContent='';});
const base=name=>name.replace(/\.[^.]+$/,'').toLowerCase().replace(/(?:[-_ ](?:sous-titres|subtitles|transcription|captions|fr|en))$/,'').trim();
send.onclick=async()=>{const input=[...files.files],media=input.filter(f=>B.kind(f,f.name)),subs=input.filter(f=>/\.(srt|vtt)$/i.test(f.name)),sidecars=input.filter(f=>/\.markers\.json$/i.test(f.name));
 const opened=incl.checked?currentStudioMedia():[];
 const allMedia=[...media.map(f=>({blob:f,name:f.name})),...opened.filter(a=>!media.some(f=>f.name===a.name&&f.size===a.blob.size))];
 if(!allMedia.length){result.textContent='Ajoutez au moins un fichier audio ou vidéo.';return;}
 if(allMedia.length>12){result.textContent='Limite de 12 médias par transfert.';return;}
 if(input.length!==media.length+subs.length+sidecars.length){result.textContent='Un fichier possède un format non reconnu.';return;}
 if(subs.some(f=>f.size>2*1024**2)||sidecars.some(f=>f.size>1*1024**2)){result.textContent='Sous-titres ou fiches trop volumineux (2 Mo pour SRT/VTT, 1 Mo pour JSON).';return;}
 if(!confirm(`Préparer ${allMedia.length} média(s) pour Cut ? Ils seront conservés temporairement dans ce navigateur.`))return;
 send.disabled=true;result.textContent='Préparation du dossier et association des sous-titres…';
 try{const parsed=await Promise.all(subs.map(async f=>({name:base(f.name),cues:B.timedText(await f.text())})));
  const markerFiles=await Promise.all(sidecars.map(async f=>{let data;try{data=JSON.parse(await f.text());}catch{throw Error('Fiche de marqueurs JSON invalide : '+f.name)}return{name:base(f.name.replace(/\.markers\.json$/i,'')),markers:B.cleanMarkers(Array.isArray(data)?data:(data&&data.markers)),fullText:B.cleanTranscript(data&&data.fullText)}}));
  const wf=window.PhilosophalV10Workflow?.snapshot?.(),tr=window.PhilosophalV10Transcribe?.snapshot?.(),sub=window.PhilosophalV10Subtitles?.snapshot?.();
  const items=allMedia.map(f=>{const related=(wf?.assets||[]).find(a=>a.blob===f.blob);
   const extras=markerFiles.find(m=>m.name===base(f.name));
   const inline=(sub?.blob===f.blob&&sub.cues?.length?sub.cues:tr?.blob===f.blob?tr.segments:[]);
   return {blob:f.blob,name:f.name,cues:parsed.find(x=>x.name===base(f.name))?.cues||B.cleanCues(inline),markers:extras?.markers||B.cleanMarkers(related?.markers),fullText:extras?.fullText||(tr?.blob===f.blob?B.cleanTranscript(tr.fullText):'')};
  });
  const response=await B.putBatch(items,{project:panel.querySelector('#v545BatchTitle').value||'Production audiovisuelle'});
  result.textContent='Dossier créé. Ouverture de Cut…';window.top.location.assign('/outils/philosophal-cut/?av-batch='+encodeURIComponent(response.batchId));
 }catch(e){result.textContent='Envoi impossible : '+(e?.message||e)}finally{send.disabled=false;}
};
})();
