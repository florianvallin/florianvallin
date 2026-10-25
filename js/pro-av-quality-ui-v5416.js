/* V54.16 — interface commune de vérification locale des exports et transferts. */
(()=>{'use strict';const Q=window.PhilosophalAVQuality;if(!Q)return;
const studio=!!document.getElementById('v9Start'),cut=!!document.getElementById('v18ImportInput');if(!studio&&!cut)return;
const css=document.createElement('style');css.textContent=`
.v5416-open{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:7px 11px;background:#253b51;color:#ebf2fa;border:1px solid #7591af;border-radius:8px;font:600 12px system-ui,sans-serif;cursor:pointer}
.v5416-open:hover{background:#36516b}
#v5416Dialog{border:1px solid #58728b;color:#ecf4fd;background:#162438;border-radius:14px;width:min(710px,calc(100vw - 24px));max-height:90dvh;padding:0;box-shadow:0 20px 75px #0009;font:13px/1.5 system-ui,sans-serif}
#v5416Dialog::backdrop{background:#07111ecc;backdrop-filter:blur(3px)}
#v5416Dialog *{box-sizing:border-box}#v5416Dialog .v5416-inner{padding:19px;display:grid;gap:13px}#v5416Dialog header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
#v5416Dialog h2{font-size:19px;color:inherit;margin:3px 0}#v5416Dialog p{margin:0;color:#bcd0e3;font-size:12px}
#v5416Dialog button{background:#28415d;color:#f1f6ff;border:1px solid #6683a2;padding:9px 12px;border-radius:7px;cursor:pointer;font:600 12px system-ui,sans-serif}
#v5416Dialog button:disabled{opacity:.42;cursor:not-allowed}#v5416Dialog .v5416-primary{background:#bdd6f3;color:#122439;font-weight:750}
#v5416Dialog input[type=file]{border:1px solid #405971;background:#1c2d44;color:#edf5ff;padding:10px;width:100%;border-radius:8px}
#v5416Dialog label{display:grid;gap:4px;font-size:12px;color:#ccd9ea}#v5416Dialog .v5416-check{display:flex;align-items:center;gap:8px}
#v5416Dialog .v5416-buttons{display:flex;flex-wrap:wrap;gap:8px}#v5416Dialog .v5416-card{border:1px solid #49637d;background:#1e3046;padding:12px;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;max-height:260px;overflow:auto}
#v5416Dialog .v5416-ok{border-color:#6baf8d}#v5416Dialog .v5416-warning{border-color:#b8a46d}#v5416Dialog .v5416-error{border-color:#d78185}
`;document.head.append(css);
const modal=document.createElement('dialog');modal.id='v5416Dialog';modal.innerHTML=`<div class="v5416-inner"><header><div><small>PHILOSOPHAL · V54.16</small><h2>Contrôle qualité des médias</h2><p>Vérification locale du conteneur, de la durée et des sous-titres. Aucune donnée envoyée en ligne.</p></div><button type="button" id="v5416Close" aria-label="Fermer">✕</button></header><label>Vidéo ou audio à contrôler<input type="file" id="v5416File" accept="audio/*,video/*,.mp4,.webm,.wav,.m4a,.ogg,.mp3,.mov,.flac"></label><label>Fichier de sous-titres associé (facultatif)<input type="file" id="v5416Srt" accept=".srt,.vtt"></label><label class="v5416-check"><input type="checkbox" id="v5416Compare"> Comparer la durée au média actuellement ouvert</label><div class="v5416-buttons"><button type="button" class="v5416-primary" id="v5416Check">Vérifier le fichier</button><button type="button" id="v5416Last">Dernier export Studio</button><button type="button" id="v5416Download" disabled>Exporter le rapport JSON</button></div><div class="v5416-card" id="v5416Results" role="status" aria-live="polite">Sélectionnez un fichier audio ou vidéo à examiner.</div><p>Les contrôles ne remplacent pas l'écoute intégrale. La synchronisation fine de la parole et de l'image nécessite une vérification dans le lecteur ou la timeline.</p></div>`;document.body.append(modal);
const $=id=>document.getElementById(id),file=$('v5416File'),sub=$('v5416Srt'),btn=$('v5416Check'),result=$('v5416Results');let active=null,running=false;
function sourceDuration(){try{if(studio){const v=window.PhilosophalV10Exports?.snapshot?.();if(v?.blob){const el=document.querySelector('#v9Video:not([hidden]),#v9Audio:not([hidden])');return Number(el?.duration)||0;}}if(cut&&typeof S!=='undefined')return Number(S.duration)||0;}catch{}return 0}
function show(r){active=r;result.className='v5416-card v5416-'+r.status;const lines=[Q.label(r),'Conteneur détecté : '+(r.container||'inconnu'),r.sourceDuration?'Durée de référence : '+r.sourceDuration.toFixed(3)+' s':null,r.width?'Dimensions : '+r.width+' × '+r.height:null,r.timing?.cues?'Sous-titres : '+r.timing.cues+' (hors durée : '+r.timing.outside+', chevauchements : '+r.timing.overlap+')':null,...r.errors.map(x=>'ERREUR · '+x),...r.warnings.map(x=>'À VÉRIFIER · '+x)];result.textContent=lines.filter(Boolean).join('\n');$('v5416Download').disabled=false;}
async function inspectFile(){if(running)return;const f=file.files?.[0];if(!f){result.textContent='Choisissez un fichier audio ou vidéo.';return;}
 running=true;btn.disabled=true;result.textContent='Inspection des métadonnées…';
 try{let cues=[];if(sub.files?.[0]){if(sub.files[0].size>5*1024*1024)throw Error('Sous-titres trop volumineux (maximum 5 Mo).');const raw=await sub.files[0].text();cues=window.PhilosophalAVCutBridge?.timedText?.(raw)||[];if(!cues.length)throw Error('Aucun sous-titre horodaté lisible dans le fichier.');}
 const expected=$('v5416Compare').checked?sourceDuration():null;show(await Q.inspect(f,f.name,{cues,expectedDuration:expected,timeoutMs:6500}));
 }catch(err){result.textContent='Inspection impossible : '+(err.message||err)}finally{running=false;btn.disabled=false;}}
btn.onclick=inspectFile;
$('v5416Last').onclick=()=>{const last=Q.getLastExport();if(last)show(last);else result.textContent='Aucun export contrôlé durant cette session. Les anciens exports peuvent être vérifiés en sélectionnant leur fichier.';};
$('v5416Download').onclick=()=>active&&Q.downloadReport(active);
$('v5416Close').onclick=()=>{if(!running)modal.close()};
const open=document.createElement('button');open.type='button';open.className='v5416-open';open.textContent='✓ Contrôle qualité';open.title='Contrôler les exports audio/vidéo, la durée et les sous-titres';
const toolbar=studio?document.getElementById('v9Start')?.parentElement:(document.querySelector('header .toolbar')||document.querySelector('header'));
(toolbar||document.body).append(open);open.onclick=()=>{if(studio){const last=Q.getLastExport();$('v5416Last').hidden=false;if(last)show(last);}else $('v5416Last').hidden=true;modal.showModal()};
window.addEventListener('philosophal-av-qa',e=>{if(modal.open&&!file.files?.length)show(e.detail)});
})();
