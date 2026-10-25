/* Philosophal V54.3 — panneau d’envoi vers Cut. */
(()=>{'use strict';
 const B=window.PhilosophalAVCutBridge,$=id=>document.getElementById(id);
 if(!B||!$('v543StudioDialog'))return;
 const d=$('v543StudioDialog'),sel=$('v543StudioSource'),file=$('v543StudioFile'),meta=$('v543StudioMeta'),status=$('v543StudioStatus'),checkbox=$('v543StudioCues'),help=$('v543StudioCuesHelp'),send=$('v543StudioSend');
 let sources=[],selectedFile=null,pending=false;
 const extras=document.createElement('div');extras.className='v543-prepare';extras.innerHTML=`<label class="v543-field">Projet ou épisode <input id="v5415Project" maxlength="100" placeholder="Ex. Philosophie de l'amour · Épisode 4"></label><label class="v543-line"><input id="v5415Markers" type="checkbox" checked> Joindre les marqueurs du média</label><label class="v543-line"><input id="v5415Text" type="checkbox" checked> Joindre le texte de transcription pour référence</label><div class="v543-help" id="v5415Details">Les fichiers sont associés uniquement si leur source est identique.</div>`;
 meta.before(extras);
 const optMarkers=$('v5415Markers'),optText=$('v5415Text'),details=$('v5415Details'),project=$('v5415Project');
 
 const prettyBytes=n=>n<1024**2?(n/1024).toFixed(0)+' Ko':(n/1024**2).toFixed(1)+' Mo';
 const same=(a,b,an,bn)=>a===b||a instanceof Blob&&b instanceof Blob&&a.size===b.size&&an&&bn&&String(an).toLowerCase()===String(bn).toLowerCase();
 function candidates(){const rows=[];const seen=new WeakSet();
  function add(blob,name,desc){if(!(blob instanceof Blob)||!blob.size||!B.kind(blob,name)||seen.has(blob))return;seen.add(blob);rows.push({blob,name:name||'Enregistrement',desc})}
  const active=window.PhilosophalV9FromWorkflow?.();if(active?.blob)add(active.blob,active.name,'Média actif du flux de travail');
  for(const t of window.PhilosophalV4Takes?.()||[])add(t.blob,t.name+'.wav','Prise vocale');
  for(const v of window.PhilosophalV6Videos?.()||[])add(v.blob,v.name+'.'+v.ext,'Capture vidéo');
  // Source importée dans la transcription, l’analyse ou l’espace sous-titres.
  for(const [snap,label] of [[window.PhilosophalV10Subtitles?.snapshot?.(),'Éditeur de sous-titres'],[window.PhilosophalV10Transcribe?.snapshot?.(),'Transcription']]){if(snap?.blob)add(snap.blob,snap.name,label)}
  return rows;
 }
 function matchingCues(item){if(!item)return[];const sub=window.PhilosophalV10Subtitles?.snapshot?.();const tr=window.PhilosophalV10Transcribe?.snapshot?.();
  if(sub?.cues?.length&&same(item.blob,sub.blob,item.name,sub.name))return B.cleanCues(sub.cues);
  if(tr?.segments?.length&&same(item.blob,tr.blob,item.name,tr.name))return B.cleanCues(tr.segments);
  return [];
 }
 function associated(item){if(!item)return {markers:[],fullText:''};
  const workflow=window.PhilosophalV10Workflow?.snapshot?.();const asset=(workflow?.assets||[]).find(a=>a.blob===item.blob);
  const tr=window.PhilosophalV10Transcribe?.snapshot?.();const sameTranscript=tr?.blob===item.blob;
  return {markers:B.cleanMarkers(asset?.markers),fullText:sameTranscript?B.cleanTranscript(tr.fullText||tr.segments?.map(s=>s.text).join(' ')||''):''};
 }
 function current(){if(selectedFile)return selectedFile;return sources[Number(sel.value)]||null;}
 function update(){const item=current();const cues=matchingCues(item);checkbox.disabled=!cues.length;checkbox.checked=!!cues.length;
  meta.textContent=item?`${item.name} · ${B.kind(item.blob,item.name)==='video'?'Vidéo':'Audio'} · ${prettyBytes(item.blob.size)} · ${item.desc||'Fichier choisi'}`:'Aucun média. Choisissez une source ou un fichier local.';
  const x=associated(item);optMarkers.disabled=!x.markers.length;optText.disabled=!x.fullText;
  details.textContent=`${x.markers.length} marqueur(s) · ${x.fullText.length?x.fullText.length+' caractères de transcription':'Aucun texte associé'} · conservation en fiche dans Cut.`;
  help.textContent=cues.length?`${cues.length} passage(s) associé(s) à cette source : temps du média original. Vérifiez la synchronisation dans Cut.`:'Aucune transcription synchronisée correspondant à ce média. Vous pourrez importer un SRT plus tard dans Cut.';
  send.disabled=!item||pending;
 }
 function refresh(){sources=candidates();sel.replaceChildren();for(let i=0;i<sources.length;i++)sel.add(new Option(sources[i].desc+' · '+sources[i].name,String(i)));
  if(!sources.length)sel.add(new Option('Aucune prise dans cette session',''));
  selectedFile=null;file.value='';sel.disabled=!sources.length;status.textContent='';update();
 }
 const trigger=document.createElement('button');trigger.type='button';trigger.className='v543-trigger';trigger.id='v543ToCut';trigger.textContent='↗ Vers Philosophal Cut';trigger.title='Envoyer le média courant et ses sous-titres vers Cut';
 const top=document.querySelector('header .top-actions,header .head-actions,.topbar .actions,.top-actions,.header-actions,.topbar')||document.querySelector('header');
 (top||document.body).append(trigger);
 trigger.addEventListener('click',()=>{refresh();d.showModal();});
 $('v543StudioClose').onclick=$('v543StudioCancel').onclick=()=>{if(!pending)d.close();};
 sel.addEventListener('change',()=>{selectedFile=null;file.value='';update()});
 file.addEventListener('change',()=>{const f=file.files?.[0];selectedFile=f?{blob:f,name:f.name,desc:'Fichier choisi manuellement'}:null;update();});
 checkbox.addEventListener('change',()=>{status.textContent='';});
 send.addEventListener('click',async()=>{
  if(pending)return;const item=current();if(!item)return;
  if(window.PhilosophalV10Voice?.busy?.()||window.PhilosophalV10Capture?.busy?.()||window.PhilosophalV10Transcribe?.busy?.()||window.PhilosophalV10Process?.busy?.()||window.PhilosophalV10Exports?.busy?.()){
    status.textContent='Terminez d’abord l’enregistrement ou le traitement en cours.';return;
  }
  pending=true;send.disabled=true;status.textContent='Préparation du transfert local…';
  try{const cues=checkbox.checked?matchingCues(item):[];const associatedData=associated(item);const id=await B.put({blob:item.blob,name:item.name,cues,
     markers:optMarkers.checked?associatedData.markers:[],fullText:optText.checked?associatedData.fullText:'',project:project.value});status.textContent='Média préparé. Ouverture de Philosophal Cut…';
   // Navigation au niveau supérieur : les éditeurs sont chacun dans une iframe de leur outil professionnel.
   window.top.location.assign('/outils/philosophal-cut/?av-transfer='+encodeURIComponent(id));
  }catch(err){status.textContent='Transfert impossible : '+(err?.message||err)+'. Vous pouvez exporter le média et son SRT manuellement.';pending=false;update();}
 });
})();