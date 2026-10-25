/* Philosophal V54.14 — corrections volontaires, contrôle de lisibilité et presets non destructifs. */
(()=>{'use strict';
const $=id=>document.getElementById(id),studio=$('transcribeView');if(!studio)return;
const examples='platon => Platon\naristophane => Aristophane\nsocrate => Socrate\néros => Éros\nempédocle => Empédocle';
const rules=$('v5414LexRules'),status=$('v5414LexStatus'),report=$('v5414Report');
try{const saved=localStorage.getItem('philosophal:lexique-v5414');if(saved!==null&&saved.length<16000)rules.value=saved;}catch{}
let saveTimer;rules.addEventListener('input',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem('philosophal:lexique-v5414',rules.value.slice(0,16000));}catch{}},400);});
$('v5414LexReset').addEventListener('click',()=>{if(!confirm('Réinitialiser le lexique avec les exemples proposés ?'))return;rules.value=examples;rules.dispatchEvent(new Event('input'));status.textContent='Lexique réinitialisé.';});
$('v5414LexApply').addEventListener('click',()=>{
 const entries=rules.value.split(/\r?\n/).map(line=>{const i=line.indexOf('=>');return i<0?null:{from:line.slice(0,i).trim(),to:line.slice(i+2).trim()};}).filter(Boolean).slice(0,80);
 if(!entries.length){status.textContent='Saisissez au moins une règle avec =>.';status.dataset.kind='error';return;}
 const result=window.PhilosophalV5414Transcribe?.applyLexicon(entries);
 status.textContent=result?.message||`${result?.changes||0} occurrence(s) corrigée(s). Vérifiez le texte avant export.`;status.dataset.kind=result?.ok?'success':'error';
});
const profiles={vertical:{aspect:'portrait',font:'28',chars:'30',seconds:'4'},wide:{aspect:'wide',font:'26',chars:'40',seconds:'6'},dialogue:{aspect:'portrait',font:'26',chars:'34',seconds:'3'}};
$('v5414ProfileApply').addEventListener('click',()=>{
 const p=profiles[$('v5414Profile').value];if(!p)return;
 for(const [id,value] of [['sbAspect',p.aspect],['sbFont',p.font],['sbMaxChars',p.chars],['sbMaxSec',p.seconds]]){const el=$(id);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));}
 audit();
});
function valid(c){return Number.isFinite(+c.start)&&Number.isFinite(+c.end)&&c.end>c.start&&String(c.text||'').trim();}
function countChars(c){return String(c.text||'').split('\n').map(line=>line.trim().length);}
function inspect(){return window.PhilosophalV5414Subtitles?.inspect?.()||{cues:[],duration:0};}
function audit(){
 const data=inspect(),cues=data.cues||[],maxChars=Number($('sbMaxChars').value)||32,maxSec=Number($('sbMaxSec').value)||5;
 report.replaceChildren();if(!cues.length){report.textContent='Aucun sous-titre à contrôler.';return;}
 const issues=[];let err=0,prev=null;
 cues.forEach((c,i)=>{
   if(!valid(c)){issues.push([i,'Horodatage invalide ou texte vide']);err++;return;}
   const d=c.end-c.start,chars=countChars(c),len=chars.reduce((a,b)=>a+b,0),cps=len/Math.max(.1,d);
   if(prev && c.start<prev.end-.025){issues.push([i,'Chevauchement avec le passage précédent']);err++;}
   if(d<.65)issues.push([i,'Durée courte : '+d.toFixed(2)+' s']);
   if(d>maxSec+.15)issues.push([i,'Durée supérieure à '+maxSec+' s']);
   if(chars.length>2||chars.some(l=>l>maxChars))issues.push([i,'Texte trop long ('+Math.max(...chars)+' caractères sur une ligne)']);
   if(cps>19)issues.push([i,'Lecture rapide : '+cps.toFixed(1)+' caractères/s']);
   prev=c;
 });
 const heading=document.createElement('div');const strong=document.createElement('strong');strong.textContent=`${cues.length} passage(s) · ${issues.length} alerte(s)`;heading.append(strong);report.append(heading);
 if(!issues.length){const ok=document.createElement('div');ok.textContent='Durées et lisibilité conformes au profil. Une relecture à l’écoute reste nécessaire.';report.append(ok);return;}
 for(const [i,msg] of issues.slice(0,30)){const row=document.createElement('div');row.className='v5414-issue';const btn=document.createElement('button');btn.type='button';btn.textContent='#'+(i+1);btn.addEventListener('click',()=>{window.PhilosophalV8Subtitles?.seek?.(cues[i]?.start||0);$('sbCues').querySelector(`.sb-cue[data-index="${i}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});});const em=document.createElement('em');em.textContent=msg;row.append(btn,em);report.append(row);}
 if(issues.length>30){const rest=document.createElement('p');rest.textContent=(issues.length-30)+' autres alertes : ajustez le profil et relancez.';report.append(rest);}
}
$('v5414Audit').addEventListener('click',audit);
function correct(mode){const current=inspect();if(!current.cues.length){audit();return;}
 if(mode==='lines'&&!confirm('Recomposer les retours à la ligne des sous-titres ? Les timings resteront inchangés ; modification annulable.'))return;
 const res=window.PhilosophalV5414Subtitles?.repair(mode,Number($('sbMaxChars').value));if(!res?.ok)report.textContent=res?.message||'Correction indisponible.';else audit();}
$('v5414FixOverlaps').addEventListener('click',()=>correct('overlaps'));
$('v5414Reflow').addEventListener('click',()=>correct('lines'));
// Timed entries and cues are stored by the existing project module, including manual corrections.
// Avoid polling during capture: audit only when explicitly requested.
})();
