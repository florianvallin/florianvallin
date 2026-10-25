/* Philosophal V54.9 — panneau partagé, aucun changement du moteur de montage. */
(()=>{'use strict';
 const L=window.PhilosophalMediaLibrary549,B=window.PhilosophalAVCutBridge;
 if(!L||!B)return;
 const cut=Boolean(document.getElementById('v18ImportInput'));
 const $=id=>document.getElementById(id);
 const fmt=n=>n>=1073741824?(n/1073741824).toFixed(2)+' Go':n>=1048576?(n/1048576).toFixed(1)+' Mo':(n/1024).toFixed(0)+' Ko';
 const formatDate=n=>new Date(n).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'});
 const html=`<div class="v549-box"><header class="v549-head"><div><small>PHILOSOPHAL · MÉDIAS PROFESSIONNELS · V54.17</small><h2>Bibliothèque de production</h2><p>Audio, vidéo et images classés par projet. Médias enregistrés dans ce navigateur, partagés entre Cut et Studio.</p></div><button type="button" id="v549Close" class="v549-btn" aria-label="Fermer">✕</button></header>
 <div class="v549-actions"><label class="v549-btn v549-main">+ Importer des fichiers<input id="v549Files" type="file" accept="audio/*,video/*,image/*,.mov,.mkv,.flac,.avi" multiple hidden></label><select id="v549Session" aria-label="Source du studio"><option value="">Média de la session…</option></select><button type="button" id="v549SaveSession" class="v549-btn">Conserver la source</button><button type="button" id="v5412Audit" class="v549-btn" title="Comparer le contenu des médias sans rien supprimer">⌕ Vérifier les doublons</button><span class="v549-flex"></span><a class="v549-btn" href="/outils/sauvegarde-pro/" target="_top" title="Exporter une copie de secours des projets et médias">⇩ Sauvegarder</a><span id="v549Storage" class="v549-storage">Stockage local</span></div>
 <div class="v5417-control"><label class="v549-btn" title="Importer les médias d’un dossier sélectionné">▤ Dossier de rushs<input id="v5417Folder" type="file" webkitdirectory directory multiple hidden></label><button type="button" id="v5417Persist" class="v549-btn" title="Demander au navigateur de conserver le stockage local si possible">Préserver les données</button><span id="v5417Space" class="v5417-space">Estimation du stockage…</span><span class="v549-flex"></span><button type="button" id="v5417Cancel" class="v549-btn" disabled>Annuler l’import</button></div>
 <div id="v5417Progress" class="v5417-progress" hidden role="status" aria-live="polite"><div id="v5417ProgressText">Importation en cours…</div><progress id="v5417ProgressBar" max="100" value="0"></progress><small id="v5417ProgressExtra"></small></div>
 <div class="v549-filters"><input id="v549Search" type="search" placeholder="Rechercher un fichier, un projet, une note…" aria-label="Rechercher"><select id="v549Kind"><option value="all">Tous les formats</option><option value="video">Vidéo</option><option value="audio">Audio</option><option value="image">Image</option></select><select id="v549Collection"><option value="all">Tous les projets</option></select><label class="v549-check"><input type="checkbox" id="v549Favorites"> Favoris</label><select id="v549Sort"><option value="recent">Plus récents</option><option value="name">Nom A–Z</option><option value="size">Taille décroissante</option></select></div>
 <div class="v549-content"><section class="v549-list"><div class="v549-listhead"><label><input id="v549All" type="checkbox"> <span id="v549Count">0 média</span></label><span id="v549Chosen">0 sélectionné</span></div><div id="v5412AuditResult" class="v5412-audit" hidden></div><div id="v549Rows" class="v549-rows" role="list"></div><div class="v5412-page"><button type="button" class="v549-btn" id="v5412More" hidden>Afficher 75 médias supplémentaires</button><span id="v5412Showing"></span></div></section>
 <aside class="v549-inspector"><h3>Détails du média</h3><div id="v549Preview" class="v549-preview">Sélectionnez un média pour afficher ses informations.</div><p id="v549Detail" class="v549-detail"></p><label>Nom affiché<input id="v549Name" maxlength="150" disabled></label><label>Projet / collection<input id="v549Project" maxlength="60" list="v549ProjectSuggestions" disabled></label><datalist id="v549ProjectSuggestions"></datalist><label>Notes<textarea id="v549Notes" maxlength="250" rows="3" disabled></textarea></label><label class="v549-check"><input id="v549Star" type="checkbox" disabled> Ajouter aux favoris</label><button type="button" id="v549Update" class="v549-btn" disabled>Enregistrer les modifications</button><button type="button" id="v549Download" class="v549-btn" disabled>↓ Télécharger ce média</button></aside></div>
 <footer class="v549-foot"><div class="v549-bulk"><button type="button" class="v549-btn" id="v549Move">Classer la sélection</button><button type="button" class="v549-btn" id="v549Delete">Supprimer la sélection</button></div><div class="v549-bulk"><select id="v549Target" ${cut?'hidden':''}><option value="transcribe">Transcrire dans Studio</option><option value="analysis">Analyser un audio</option><option value="subtitles">Sous-titrer</option><option value="exports">Préparer un export</option></select><button type="button" id="v549Use" class="v549-btn v549-main">${cut?'Ajouter la sélection à Cut':'Ouvrir dans Studio'}</button><button type="button" id="v549Send" class="v549-btn">${cut?'Ouvrir Studio audiovisuel':'↗ Envoyer vers Cut'}</button></div></footer><p id="v549Status" class="v549-status" role="status" aria-live="polite">Les fichiers restent sur cet appareil. Une bibliothèque locale n’est pas une sauvegarde externe.</p></div>`;
 const dialog=document.createElement('dialog');dialog.id='v549Library';dialog.className='v549-library';dialog.setAttribute('aria-label','Bibliothèque de production');dialog.innerHTML=html;document.body.append(dialog);
 const style=document.createElement('style');style.textContent=`
 .v549-library{width:min(1040px,calc(100vw - 20px));max-width:none;max-height:calc(100dvh - 28px);padding:0;border:1px solid #495d76;border-radius:17px;background:#152232;color:#edf4ff;font:12px/1.45 Inter,Arial,sans-serif;box-shadow:0 28px 100px #000b;overflow:hidden}
 .v549-library::backdrop{background:#030a12bf;backdrop-filter:blur(5px)}.v549-library *{box-sizing:border-box}.v549-box{max-height:calc(100dvh - 30px);display:flex;flex-direction:column;min-height:0}.v549-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:20px 22px 13px;border-bottom:1px solid #30415a}.v549-head small{font-size:9px;letter-spacing:.12em;color:#9fbfe3}.v549-head h2{font-size:20px;line-height:1.2;margin:5px 0;color:#f4f8ff}.v549-head p{margin:0;color:#abbdd2;font-size:11px}.v549-actions,.v549-filters,.v549-foot,.v5417-control{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid #293a50}.v5417-control{padding:6px 18px;background:#1d3045;gap:8px;border-bottom:1px solid #293a50}.v5417-space{color:#bdcce0;font-size:10px;flex:1;min-width:160px}.v5417-progress{padding:8px 18px;border-bottom:1px solid #405474;background:#13283a;display:grid;grid-template-columns:minmax(0,1fr) minmax(90px,220px);align-items:center;gap:6px 12px;font-size:11px}.v5417-progress[hidden]{display:none}.v5417-progress progress{width:100%;height:10px;accent-color:#90c7ae}.v5417-progress small{grid-column:1/-1;color:#bcd0e6}.v549-filters{background:#19293c}.v549-actions>select{max-width:210px}.v549-flex{flex:1}.v549-storage{color:#a3bbd3;font-size:10px}.v549-library button,.v549-library select,.v549-library input,.v549-library textarea{font:inherit}.v549-library input:not([type=checkbox]),.v549-library select,.v549-library textarea{min-width:0;border:1px solid #405775;background:#0f1a28;color:#e9f3ff;padding:8px;border-radius:8px;outline-offset:2px}.v549-library input:focus,.v549-library select:focus,.v549-library textarea:focus{border-color:#a6caff}.v549-library .v549-filters input[type=search]{flex:2 1 200px}.v549-library select{max-width:200px}.v549-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:9px 11px;border-radius:8px;border:1px solid #536c8b;background:#253951;color:#e6effb;cursor:pointer;white-space:nowrap;font-weight:650}.v549-btn:hover{background:#36516c}.v549-btn:disabled{opacity:.4;cursor:not-allowed}.v549-main{background:#bdd5f6;border-color:#bdd5f6;color:#13263c}.v549-main:hover{background:#d5e4fa}.v549-check{display:flex!important;align-items:center;gap:6px;white-space:nowrap}.v549-check input{accent-color:#b8d0f0}.v549-content{display:grid;grid-template-columns:minmax(0,1fr) 275px;min-height:0;flex:1;overflow:hidden}.v549-list{display:flex;flex-direction:column;min-height:0;min-width:0}.v549-listhead{display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid #2e4058;color:#b9cbe0}.v549-listhead label{display:flex;gap:10px;align-items:center}.v549-rows{overflow:auto;min-height:120px;max-height:55vh;flex:1;padding:6px 9px}.v549-row{display:flex;gap:10px;align-items:center;padding:10px;border:1px solid transparent;border-radius:10px;cursor:pointer;min-width:0}.v549-row:hover,.v549-row.active{border-color:#597695;background:#223951}.v549-row>input{accent-color:#b8d0f0;flex:0 0 auto}.v549-row-icon{width:54px;height:42px;flex:0 0 auto;display:grid;place-items:center;background:#30465d;border-radius:9px;font-size:18px;overflow:hidden}.v549-row-icon img{width:100%;height:100%;object-fit:contain;display:block}.v5412-page{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 14px;border-top:1px solid #2e4058;color:#a9bed7;font-size:10px}.v5412-audit{padding:10px 13px;background:#203448;border-bottom:1px solid #54718c;color:#e7f1ff;font-size:11px;line-height:1.6}.v5412-audit button{margin:4px 5px 0 0}.v549-row-text{flex:1;min-width:0}.v549-row-text b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:#ecf3fc}.v549-row-text span{display:block;color:#9cb1ca;font-size:10px;margin-top:3px}.v549-fav{border:0;background:none;color:#d1b575;font-size:20px;cursor:pointer}.v549-inspector{padding:16px;border-left:1px solid #30415a;display:flex;flex-direction:column;gap:10px;overflow:auto;min-height:0}.v549-inspector h3{margin:0;font-size:13px}.v549-inspector label:not(.v549-check){display:flex;flex-direction:column;gap:5px;color:#bbcee3;font-size:10px}.v549-inspector textarea{resize:vertical}.v549-preview{height:125px;background:#080f19;border:1px solid #324359;display:grid;place-items:center;color:#a8bad1;border-radius:9px;overflow:hidden;text-align:center;padding:9px}.v549-preview audio,.v549-preview video,.v549-preview img{width:100%;max-height:100%;object-fit:contain}.v549-detail{margin:0;font-size:10px;line-height:1.5;color:#b9cbdc}.v549-foot{justify-content:space-between;border-top:1px solid #30415a;border-bottom:0}.v549-bulk{display:flex;gap:7px;flex-wrap:wrap}.v549-status{font-size:10px;color:#b6cde6;background:#112033;margin:0;padding:8px 22px;min-height:32px}.v549-trigger{border:1px solid #537897;background:#264057;border-radius:8px;padding:8px 11px;color:#e8f3ff;font-size:11px;font-weight:750;cursor:pointer}.v549-trigger:hover{background:#345b78}
 @media(max-width:700px){.v549-head{padding:13px}.v549-head h2{font-size:16px}.v549-actions,.v549-filters,.v549-foot{padding:8px}.v549-content{grid-template-columns:1fr;overflow:auto}.v549-rows{max-height:28vh}.v549-inspector{border-left:0;border-top:1px solid #344967}.v549-preview{height:95px}.v549-library .v549-btn{padding:7px}.v549-library{font-size:11px}}
 `;document.head.append(style);
 const trigger=document.createElement('button');trigger.type='button';trigger.id='v549LibraryButton';trigger.className='v549-trigger';trigger.textContent='▦ Médias partagés';trigger.title='Bibliothèque de production persistante (ce navigateur)';
 const host=(cut?(document.querySelector('#v18Bin .v18-bin-actions')||document.querySelector('header .toolbar')||document.querySelector('header')):(document.getElementById('v543ToCut')?.parentElement||document.querySelector('.top-actions')||document.querySelector('header')))||document.body;
 host.append(trigger);
 const filters={search:$('v549Search'),kind:$('v549Kind'),collection:$('v549Collection'),favorites:$('v549Favorites'),sort:$('v549Sort')};
 let rows=[],selected=new Set(),focused=null,previewUrl=null,session=[],loading=false;
 let pageSize=75,thumbObserver=null,thumbPending=0,thumbQueue=[],thumbURLs=new Map(),thumbRunning=new Set();
 let auditGroups=[];
 let importController=null;
 const yieldUI=()=>new Promise(resolve=>setTimeout(resolve,0));
 const progressUI=(value)=>{
  const box=$('v5417Progress'),bar=$('v5417ProgressBar'),text=$('v5417ProgressText'),extra=$('v5417ProgressExtra');
  box.hidden=false;
  bar.value=value.total?100*(value.completed||0)/value.total:100;
  text.textContent=value.phase==='preflight'?`Préparation de ${value.total} média(s)…`:value.phase==='done'?`Import terminé — ${value.completed}/${value.total} fichier(s) traité(s)`:`${value.index||1}/${value.total} · ${value.name||'Importation…'}`;
  extra.textContent=`${value.added||0} enregistré(s) · ${value.duplicates||0} doublon(s) · ${value.failed||0} erreur(s)${value.cancelled?' · Annulé':''}`;
 };
 async function storageUI(){
  const result=await L.storageSummary();
  const used=result.estimate?.usage,quota=result.estimate?.quota;
  $('v549Storage').textContent=quota?`Navigateur : ${fmt(used||0)} / ${fmt(quota)}`:`Bibliothèque : ${fmt(result.mediaBytes)}`;
  $('v5417Space').textContent=`Bibliothèque : ${fmt(result.mediaBytes)} · ${result.count} média(s)`+(result.available!==null?` · Reste estimé : ${fmt(result.available)}`:' · Quota non communiqué');
  return result;
 }

 function clearThumbs(){thumbObserver?.disconnect();thumbObserver=null;for(const url of thumbURLs.values())URL.revokeObjectURL(url);thumbURLs.clear();thumbQueue=[];thumbRunning.clear();}
 function bindThumbnails(){
  thumbObserver?.disconnect();
  thumbObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;thumbObserver.unobserve(entry.target);thumbQueue.push(entry.target);};pumpThumbs();},{root:$('v549Rows'),rootMargin:'85px'});
  document.querySelectorAll('#v549Rows [data-thumb]').forEach(el=>thumbObserver.observe(el));
 }
 function pumpThumbs(){while(thumbPending<2&&thumbQueue.length){const box=thumbQueue.shift(),id=box?.dataset.thumb;
   if(!box?.isConnected||!id)continue;
   if(thumbURLs.has(id)){putThumb(box,thumbURLs.get(id));continue;}
   if(thumbRunning.has(id))continue;
   const meta=rows.find(e=>e.id===id);if(!meta)continue;
   thumbPending++;thumbRunning.add(id);
   Promise.resolve().then(()=>L.createThumb(meta)).then(blob=>{if(!blob||!dialog.open)return;
    const url=URL.createObjectURL(blob);thumbURLs.set(id,url);
    document.querySelectorAll('#v549Rows [data-thumb]').forEach(el=>{if(el.dataset.thumb===id)putThumb(el,url)});
    if(thumbURLs.size>130){const old=thumbURLs.keys().next().value;URL.revokeObjectURL(thumbURLs.get(old));thumbURLs.delete(old);}
   }).catch(()=>{}).finally(()=>{thumbPending--;thumbRunning.delete(id);pumpThumbs()});
  }}
 function putThumb(box,url){if(!box?.isConnected)return;const img=document.createElement('img');img.src=url;img.alt='';img.loading='lazy';box.replaceChildren(img);}

 const message=(t,bad=false)=>{const el=$('v549Status');el.textContent=t;el.style.color=bad?'#ffaaa9':'#b6cde6'};
 function selectedRows(){return rows.filter(x=>selected.has(x.id))}
 function getSessions(){const sources=[];
  if(cut){try{for(const item of V18.assets){if(item.file instanceof Blob&&item.file.size)sources.push({blob:item.file,name:item.name,source:'Cut · médiathèque'})}}catch{}}
  else{
   for(const t of window.PhilosophalV4Takes?.()||[])sources.push({blob:t.blob,name:t.name+'.wav',source:'Studio · prise vocale'});
   for(const v of window.PhilosophalV6Videos?.()||[])sources.push({blob:v.blob,name:v.name+'.'+v.ext,source:'Studio · capture'});
   const flow=window.PhilosophalV9FromWorkflow?.();if(flow?.blob)sources.push({blob:flow.blob,name:flow.name,source:'Studio · flux de travail'});
   const subtitles=window.PhilosophalV10Subtitles?.snapshot?.(),transcription=window.PhilosophalV10Transcribe?.snapshot?.();
   const identical=(item,snapshot)=>snapshot?.blob instanceof Blob&&(item.blob===snapshot.blob||item.blob.size===snapshot.blob.size&&item.name.toLowerCase()===String(snapshot.name||'').toLowerCase());
   for(const item of sources){const candidate=identical(item,subtitles)?subtitles?.cues:identical(item,transcription)?transcription?.segments:null;if(candidate?.length)item.cues=B.cleanCues(candidate);}
  }
  return sources.filter(x=>x.blob instanceof Blob&&x.blob.size);
 }
 function sessionOptions(){session=getSessions();const sel=$('v549Session');sel.replaceChildren(new Option(session.length?'Média de la session…':'Aucune source dans la session',''));for(let i=0;i<session.length;i++)sel.add(new Option(session[i].source+' · '+session[i].name,String(i)));$('v549SaveSession').disabled=!session.length;}
 function collections(){const names=[...new Set(rows.map(x=>x.collection||'Sans classement'))].sort((a,b)=>a.localeCompare(b,'fr'));const last=filters.collection.value;filters.collection.replaceChildren(new Option('Tous les projets','all'));const list=$('v549ProjectSuggestions');list.replaceChildren();for(const n of names){filters.collection.add(new Option(n,n));list.append(new Option(n,n));}if(names.includes(last))filters.collection.value=last;}
 function visible(){const q=filters.search.value.toLocaleLowerCase('fr'),type=filters.kind.value,group=filters.collection.value,star=filters.favorites.checked;
  return rows.filter(x=>(type==='all'||x.type===type)&&(group==='all'||x.collection===group)&&(!star||x.favorite)&&(!q||[x.name,x.original,x.collection,x.notes].some(a=>String(a||'').toLocaleLowerCase('fr').includes(q)))).sort((a,b)=>filters.sort.value==='name'?a.name.localeCompare(b.name,'fr'):filters.sort.value==='size'?b.size-a.size:b.created-a.created);
 }
 function revoke(){if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}}
 async function focus(id){focused=id;const entry=rows.find(x=>x.id===id);revoke();$('v549Preview').replaceChildren();const ids=['v549Name','v549Project','v549Notes','v549Star','v549Update','v549Download'];for(const k of ids)$(k).disabled=!entry;
  if(!entry){$('v549Preview').textContent='Sélectionnez un média pour afficher ses informations.';$('v549Detail').textContent='';return;}
  $('v549Name').value=entry.name;$('v549Project').value=entry.collection;$('v549Notes').value=entry.notes||'';$('v549Star').checked=entry.favorite;
  $('v549Detail').textContent=`${entry.type==='video'?'Vidéo':entry.type==='audio'?'Audio':'Image'} · ${fmt(entry.size)} · ${formatDate(entry.created)} · ${entry.source}`;
  try{const data=await L.get(id);if(focused!==id||!dialog.open)return;if(!data)throw Error('Fichier absent.');const objectUrl=URL.createObjectURL(data.blob);previewUrl=objectUrl;let node;
   if(entry.type==='image'){node=document.createElement('img');node.alt=entry.name;}else{node=document.createElement(entry.type==='audio'?'audio':'video');node.controls=true;node.preload='none';}node.src=objectUrl;$('v549Preview').replaceChildren(node);
  }catch(e){$('v549Preview').textContent='Aperçu indisponible : '+e.message;}}
 function render(){const list=visible(),area=$('v549Rows'),top=area.scrollTop;area.replaceChildren();const shown=list.slice(0,pageSize);$('v5412More').hidden=shown.length>=list.length;$('v5412Showing').textContent=shown.length+' affiché(s)';$('v549Count').textContent=list.length+' / '+rows.length+' média(s)';$('v549Chosen').textContent=selected.size+' sélectionné(s)';$('v549All').checked=!!list.length&&list.every(x=>selected.has(x.id));
  for(const x of shown){const item=document.createElement('div');item.className='v549-row'+(focused===x.id?' active':'');item.setAttribute('role','listitem');const chk=document.createElement('input');chk.type='checkbox';chk.checked=selected.has(x.id);chk.setAttribute('aria-label','Sélectionner '+x.name);chk.onclick=e=>e.stopPropagation();chk.onchange=()=>{if(chk.checked)selected.add(x.id);else selected.delete(x.id);render()};const icon=document.createElement('span');icon.className='v549-row-icon';icon.textContent=x.type==='audio'?'♫':x.type==='video'?'▣':'▧';if(x.type!=='audio'){icon.dataset.thumb=x.id;if(thumbURLs.has(x.id))putThumb(icon,thumbURLs.get(x.id))}const text=document.createElement('div');text.className='v549-row-text';const title=document.createElement('b');title.textContent=x.name;const desc=document.createElement('span');desc.textContent=x.collection+' · '+fmt(x.size)+' · '+formatDate(x.created);text.append(title,desc);const fav=document.createElement('button');fav.type='button';fav.className='v549-fav';fav.textContent=x.favorite?'★':'☆';fav.title='Ajouter ou retirer des favoris';fav.onclick=async e=>{e.stopPropagation();try{await L.change(x.id,{favorite:!x.favorite});await refresh(false)}catch(err){message(err.message,true)}};item.onclick=()=>{focus(x.id);render()};item.append(chk,icon,text,fav);area.append(item)}
  area.scrollTop=Math.min(top,area.scrollHeight);bindThumbnails();if(!list.length){const p=document.createElement('p');p.style.cssText='padding:23px;color:#9eb7d0;text-align:center';p.textContent=rows.length?'Aucun média pour ces filtres.':'Aucun média enregistré. Importez un fichier ou une prise du Studio.';area.append(p)}
 }
 async function refresh(focusCurrent=true){rows=await L.list();selected=new Set([...selected].filter(id=>rows.some(x=>x.id===id)));collections();render();if(focusCurrent&&focused&&rows.some(x=>x.id===focused))await focus(focused);else if(!rows.some(x=>x.id===focused))await focus(null);await storageUI()}
 async function addOne(blob,opts){if(blob.size>160*1024**2&&!confirm(`Ce média pèse ${fmt(blob.size)}. Voulez-vous vraiment l'enregistrer dans le navigateur ? Privilégiez une sauvegarde sur disque.`))return null;return L.add(blob,opts)}
 async function importFiles(files,{folder=false}={}){
  if(!files.length)return;
  const total=files.reduce((n,x)=>n+(x?.size||0),0),quota=await L.preflight(total,{strict:false});
  if(total>1024**3||!quota.ok){
   const warning=`Lot de ${fmt(total)}${quota.remain!==null?` ; espace estimé ${fmt(quota.remain)}`:''}. Importer en plusieurs lots est conseillé. Continuer avec contrôle avant chaque fichier ?`;
   if(!confirm(warning))return;
  }
  importController=new AbortController();
  $('v5417Cancel').disabled=false;
  const folderName=folder?(files[0]?.webkitRelativePath||'').split('/')[0]:'';
  const chosen=filters.collection.value==='all'?'Sans classement':filters.collection.value;
  try{
   const stats=await L.addBatch(files,{signal:importController.signal,source:cut?'Cut · import progressif':'Studio · import progressif',
    collectionForFile:file=>folder&&chosen==='Sans classement'?(file.webkitRelativePath||'').split('/')[0]?.slice(0,60)||folderName||'Rushs importés':chosen,
    onProgress:progressUI});
   await refresh(false);
   message(`${stats.added} ajouté(s), ${stats.duplicates} doublon(s), ${stats.failed} erreur(s)${stats.cancelled?', lot interrompu':''}. ${stats.errors.length?stats.errors.slice(0,2).map(e=>e.name+' : '+e.error).join(' / '):''}`,stats.failed>0);
  }finally{importController=null;$('v5417Cancel').disabled=true;await storageUI().catch(()=>{});}
 }
 const busy=async fn=>{if(loading)return;loading=true;try{await fn()}catch(e){console.warn('V54.9',e);message(e.message||String(e),true)}finally{loading=false}};
 async function useSelected(){const a=selectedRows();if(!a.length)throw Error('Sélectionnez un ou plusieurs médias.');
  if(cut){if(a.length>12||a.reduce((n,x)=>n+x.size,0)>850*1024**2)throw Error('Pour préserver la mémoire de Cut, importez au maximum 12 médias ou 850 Mo à la fois.');const input=$('v18ImportInput');if(!input||typeof input.onchange!=='function')throw Error('La médiathèque Cut n’est pas prête.');const dt=new DataTransfer();let missing=0;for(const x of a){const data=await L.get(x.id);if(!data){missing++;continue}dt.items.add(new File([data.blob],x.original,{type:x.mime||data.blob.type||'application/octet-stream'}))}if(!dt.files.length)throw Error('Aucun fichier disponible.');input.files=dt.files;await input.onchange({target:input});const count=[...dt.files].filter(f=>V18.assets.some(y=>y.name===f.name&&y.size===f.size)).length;if(count!==dt.files.length)throw Error('Certains fichiers ne sont pas reconnus dans Cut. Rien n’a été effacé de la bibliothèque.');message(`${count} média(s) importé(s) dans Cut. Vous pouvez les placer depuis sa médiathèque.`);if(!missing)dialog.close();}
  else{if(a.length!==1)throw Error('Sélectionnez un seul média pour travailler dans Studio.');const x=a[0],target=$('v549Target').value;if(target==='analysis'&&x.type!=='audio')throw Error('L’analyse accepte uniquement les fichiers audio.');if(x.type==='image')throw Error('Le Studio traite les sources audio et vidéo, pas les images.');const inputId={analysis:'anFileInput',transcribe:'trFile',subtitles:'sbMediaInput',exports:'v9File'}[target];const input=$(inputId);if(!input)throw Error('Le module demandé est indisponible.');const data=await L.get(x.id);if(!data)throw Error('Fichier supprimé ou inaccessible.');const dt=new DataTransfer();dt.items.add(new File([data.blob],x.original,{type:x.mime||data.blob.type}));input.files=dt.files;dialog.close();window.PhilosophalStudioRoute?.(target);input.dispatchEvent(new Event('change',{bubbles:true}));message('Média ouvert dans le module sélectionné.');}
 }
 async function sendToCut(){const a=selectedRows();if(!a.length){if(cut){window.top.location.assign('/outils/studio-audiovisuel/');return}throw Error('Sélectionnez des médias à envoyer dans Cut.')}if(cut){window.top.location.assign('/outils/studio-audiovisuel/');return}if(a.length>12)throw Error('Sélectionnez au maximum 12 médias.');if(a.some(x=>x.type==='image'))throw Error('Le transfert vers Cut accepte les médias audio/vidéo. Pour les images, importez directement depuis Cut.');const items=[];for(const x of a){const data=await L.get(x.id);if(!data)throw Error(x.name+' indisponible.');items.push({blob:data.blob,name:x.original,cues:x.cues||[]});}
  if(items.length===1){const id=await B.put(items[0]);window.top.location.assign('/outils/philosophal-cut/?av-transfer='+encodeURIComponent(id));}
  else{const projects=[...new Set(a.map(x=>x.collection))];const result=await B.putBatch(items,{project:projects.length===1?projects[0]:'Bibliothèque de production'});window.top.location.assign('/outils/philosophal-cut/?av-batch='+encodeURIComponent(result.batchId));}
 }
 function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=L.filename(name);document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
 trigger.onclick=()=>busy(async()=>{if(!dialog.open)dialog.showModal();pageSize=75;sessionOptions();await refresh()});
 $('v549Close').onclick=()=>{if(importController){message('Annulez le lot avant de fermer la bibliothèque.');return}dialog.close()};dialog.addEventListener('close',revoke);
 $('v549Files').onchange=e=>busy(async()=>{try{await importFiles([...e.target.files])}finally{e.target.value=''}});
 $('v5417Folder').onchange=e=>busy(async()=>{try{await importFiles([...e.target.files],{folder:true})}finally{e.target.value=''}});
 $('v5417Cancel').onclick=()=>{importController?.abort();message('Annulation demandée : le fichier en cours est terminé avant arrêt du lot.');};
 $('v5417Persist').onclick=()=>busy(async()=>{const button=$('v5417Persist');
  const result=await L.requestPersistence();
  message(!result.supported?'Ce navigateur ne propose pas cette option. Sauvegardez vos médias sur disque.':result.granted?'Conservation renforcée acceptée par le navigateur (sans garantie absolue).':'Conservation renforcée non accordée. Utilisez les sauvegardes ZIP.');
  button.title='Cette autorisation ne remplace pas une copie externe.';
 });
 dialog.addEventListener('cancel',e=>{if(importController){e.preventDefault();message('Une importation est en cours. Utilisez « Annuler l’import » avant de fermer.')}});
  $('v549SaveSession').onclick=()=>busy(async()=>{const value=$('v549Session').value,entry=session[Number(value)];if(!value||!entry)throw Error('Choisissez une source de la session.');const result=await addOne(entry.blob,{name:entry.name,source:entry.source,collection:filters.collection.value==='all'?'Sans classement':filters.collection.value,cues:entry.cues||[]});if(!result)return;await refresh(false);message(result.duplicate?'Ce fichier figure déjà dans la bibliothèque.':'Source de la session enregistrée durablement dans ce navigateur.');});
 let searchDelay;for(const item of Object.values(filters))item.addEventListener(item.type==='search'?'input':'change',()=>{if(item.type==='search'){clearTimeout(searchDelay);searchDelay=setTimeout(()=>{pageSize=75;render()},120)}else{pageSize=75;render()}});
 $('v5412More').onclick=()=>{pageSize+=75;render()};
 $('v5412Audit').onclick=()=>busy(async()=>{
  const button=$('v5412Audit'),result=$('v5412AuditResult');button.disabled=true;
  auditGroups=[];result.hidden=false;result.textContent='Comparaison des médias en cours… aucune suppression automatique.';
  try{auditGroups=await L.duplicateGroups((done,total)=>{result.textContent=`Analyse des groupes de tailles identiques : ${done}/${total}…`});
   const extras=auditGroups.flatMap(g=>g.slice(1));
   if(!extras.length){result.textContent='Aucun fichier strictement identique trouvé. Les fichiers ne sont jamais supprimés automatiquement.';return;}
   result.replaceChildren();const strong=document.createElement('strong');strong.textContent=`${extras.length} copie(s) identique(s) répartie(s) dans ${auditGroups.length} groupe(s) · ${fmt(extras.reduce((n,x)=>n+x.size,0))} potentiellement récupérables.`;
   const details=document.createElement('div');details.textContent=auditGroups.slice(0,6).map(g=>g.map(e=>e.name).join(' = ')).join(' · ');if(auditGroups.length>6)details.textContent+='…';
   const choose=document.createElement('button');choose.type='button';choose.className='v549-btn';choose.textContent='Sélectionner uniquement les copies';
   choose.onclick=()=>{for(const x of extras)selected.add(x.id);filters.search.value='';filters.kind.value='all';filters.collection.value='all';filters.favorites.checked=false;pageSize=Math.max(75,rows.length);render();message(extras.length+' copie(s) sélectionnée(s). Examinez la sélection avant toute suppression.');};
   const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='v549-btn';dismiss.textContent='Fermer le rapport';dismiss.onclick=()=>{result.hidden=true;};
   result.append(strong,details,choose,dismiss);
  }finally{button.disabled=false}
 });
 $('v549All').onchange=e=>{for(const x of visible()){if(e.target.checked)selected.add(x.id);else selected.delete(x.id)}render()};
 $('v549Update').onclick=()=>busy(async()=>{if(!focused)return;await L.change(focused,{name:$('v549Name').value,collection:$('v549Project').value,notes:$('v549Notes').value,favorite:$('v549Star').checked});await refresh(true);message('Informations du média enregistrées.');});
 $('v549Download').onclick=()=>busy(async()=>{if(!focused)return;const data=await L.get(focused);if(!data)throw Error('Média indisponible.');download(data.blob,data.meta.original);});
 $('v549Move').onclick=()=>busy(async()=>{const a=selectedRows();if(!a.length)throw Error('Sélectionnez des médias à classer.');const name=prompt('Nom du projet ou de la collection :',a[0].collection||'Sans classement');if(name===null)return;const n=name.trim().slice(0,60)||'Sans classement';for(const e of a)await L.change(e.id,{collection:n});await refresh(false);message(a.length+' média(s) classé(s) dans « '+n+' ».');});
 $('v549Delete').onclick=()=>busy(async()=>{const a=selectedRows();if(!a.length)throw Error('Aucun média sélectionné.');if(!confirm('Supprimer définitivement '+a.length+' média(s) de la bibliothèque locale ? Cette action ne supprime pas les exports sur ton disque.'))return;if(!window.PhilosophalProRecovery)throw Error('Module de récupération indisponible.');await window.PhilosophalProRecovery.checkpointMedia(a.map(x=>x.id),{reason:'Avant suppression'});await L.deleteMany(a.map(x=>x.id));selected.clear();focused=null;await refresh();message(a.length+' média(s) supprimé(s) du stockage local.');});
 $('v549Use').onclick=()=>busy(useSelected);$('v549Send').onclick=()=>busy(sendToCut);
 window.PhilosophalMediaLibraryUI549={open:()=>trigger.click()};
})();
