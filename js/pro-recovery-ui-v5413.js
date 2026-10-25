/* Interface de récupération V54.13 — page Sauvegardes pro seulement. */
(()=>{'use strict';
const $=id=>document.getElementById(id),api=window.PhilosophalProRecovery;
if(!api||!$('v5413Points'))return;
const list=$('v5413Points'),note=$('v5413Note'),summary=$('v5413Summary');
const formatDate=t=>new Date(t).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'});
const setNote=(message,bad=false)=>{note.textContent=message;note.className='recovery-note'+(bad?' error':'');};
const allowed=()=>{try{return window.FV_PRIVATE_ACCESS?.role()==='private'||sessionStorage.getItem('philosophal-invoice-entry-v1')==='alo-2026';}catch{return false;}};
let pending=false;
async function refresh(){if(!allowed())return;const points=await api.list();const size=points.reduce((n,p)=>n+p.size,0);summary.textContent=points.length+' point(s) · '+api.fmt(size)+' de stockage local';list.replaceChildren();
 if(!points.length){const empty=document.createElement('p');empty.className='recovery-empty';empty.textContent='Aucun point pour le moment. Les points se créeront lors des sauvegardes Studio/Cut ou avant suppression de certains médias. Tu peux aussi en créer un manuellement.';list.append(empty);return;}
 for(const item of points){const row=document.createElement('div');row.className='recovery-row';const text=document.createElement('div');text.className='recovery-row-content';const title=document.createElement('strong');title.textContent=item.name;const sub=document.createElement('small');sub.textContent=({studio:'Projet Studio',cut:'Brouillons Cut',media:'Média partagé'})[item.kind]+' · '+item.reason+' · '+formatDate(item.createdAt)+' · '+api.fmt(item.size);text.append(title,sub);
 const actions=document.createElement('div');actions.className='recovery-row-actions';const restore=document.createElement('button');restore.type='button';restore.textContent='Restaurer';restore.title=item.kind==='cut'?'Les réglages Cut actuels seront sauvegardés avant toute modification':'Restaurer en conservant les éléments actuels';const remove=document.createElement('button');remove.type='button';remove.textContent='Supprimer';remove.className='recovery-remove';
 restore.onclick=async()=>{if(pending)return;const message=item.kind==='cut'?'Restaurer les réglages/brouillons Cut sélectionnés ? Ceux portant les mêmes clés seront remplacés. Une copie des réglages actuels sera créée auparavant. Les rushs externes ne seront pas restaurés.':'Restaurer « '+item.name+' » ? Les éléments existants seront conservés.';if(!confirm(message))return;
 pending=true;restore.disabled=true;remove.disabled=true;setNote('Restauration en cours…');try{const result=await api.restore(item.id);setNote(result);await refresh();}catch(e){setNote('Restauration impossible : '+e.message,true);}finally{pending=false;restore.disabled=false;remove.disabled=false;}};
 remove.onclick=async()=>{if(pending||!confirm('Supprimer définitivement ce point de restauration local ? Cela n’efface pas le projet ou média original.'))return;pending=true;try{await api.remove(item.id);setNote('Point supprimé.');await refresh();}catch(e){setNote('Suppression impossible : '+e.message,true);}finally{pending=false;}};
 actions.append(restore,remove);row.append(text,actions);list.append(row);}
}
$('v5413Create').addEventListener('click',async()=>{if(pending||!allowed())return;pending=true;$('v5413Create').disabled=true;setNote('Création des points locaux en cours…');try{const {saved,failed}=await api.checkpointAll();setNote(saved.length+' point(s) créé(s).'+(failed.length?' Non protégés : '+failed.join(' ; '):'')+(saved.length?' Ils restent dans ce navigateur : exporte aussi le ZIP de sauvegarde.':''),!!failed.length);await refresh();}catch(e){setNote('Création impossible : '+e.message,true);}finally{pending=false;$('v5413Create').disabled=false;}});
$('v5413Refresh').addEventListener('click',()=>refresh().catch(e=>setNote(e.message,true)));
window.addEventListener('philosophal:recovery-updated',()=>{if(allowed())refresh().catch(()=>{});});
window.addEventListener('philosophal:unlocked',()=>refresh().catch(e=>setNote(e.message,true)));
window.addEventListener('pageshow',()=>Promise.resolve(window.FV_PRIVATE_ACCESS?.ready).then(()=>refresh()).catch(e=>setNote(e.message,true)));
Promise.resolve(window.FV_PRIVATE_ACCESS?.ready).then(()=>refresh()).catch(e=>setNote(e.message,true));
})();
