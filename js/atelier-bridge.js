(()=>{
"use strict";
const STATE_KEY="philosophal-atelier-v2",HANDOFF_KEY="philosophal-atelier-handoff-v1",POMO_HANDOFF="philosophal-pomodoro-handoff-v1";
let installPrompt=null;
function parse(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch(_){return null}}
function state(){const d={favorites:[],goals:[],recent:[],kindFilter:"all",createdAt:Date.now()},r=parse(STATE_KEY)||{};return{...d,...r,favorites:Array.isArray(r.favorites)?r.favorites:[],goals:Array.isArray(r.goals)?r.goals:[],recent:Array.isArray(r.recent)?r.recent:[]}}
function save(s){localStorage.setItem(STATE_KEY,JSON.stringify(s))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function section(){
 const p=location.pathname;
 if(p.includes("/creation/"))return{key:"creation",title:"Création",area:"Créer",kind:"project"};
 if(p.includes("/francais/"))return{key:"francais",title:"Français",area:"Apprendre",kind:"tool"};
 if(p.includes("/anglais/"))return{key:"anglais",title:"Anglais",area:"Apprendre",kind:"content"};
 if(p.includes("/arts-musique/"))return{key:"musique",title:"Musique",area:"Apprendre",kind:"tool"};
 if(p.includes("/sport/"))return{key:"sport",title:"Sport",area:"Corps & pratique",kind:"tool"};
 if(p.includes("/dietetique/"))return{key:"dietetique",title:"Diététique",area:"Corps & pratique",kind:"tool"};
 if(p.includes("/hypnose/"))return{key:"hypnose",title:"Hypnose",area:"Corps & pratique",kind:"content"};
 if(p.includes("/methodes/"))return{key:"methodes",title:"Méthodes",area:"S’organiser",kind:"tool"};
 if(p.includes("/pomodoro/"))return{key:"pomodoro",title:"Pomodoro",area:"S’organiser",kind:"tool"};
 return{key:"atelier",title:"Atelier",area:"Atelier",kind:"tool"}
}
function activeView(){
 const el=document.querySelector("[data-view].is-active,[data-view][aria-current='page']");
 if(el?.dataset.view)return{view:el.dataset.view,label:el.textContent.trim()};
 const q=new URLSearchParams(location.search).get("view");return q?{view:q,label:q}:null
}
function currentItem(){
 const sec=section(),v=activeView(),url=new URL(location.href);url.hash="";
 if(v?.view)url.searchParams.set("view",v.view);else url.searchParams.delete("view");
 return{id:`context:${sec.key}:${v?.view||"home"}`,title:v?.label?`${sec.title} — ${v.label}`:sec.title,href:url.pathname+(url.search||""),area:sec.area,kind:sec.kind}
}
function isFav(id){return state().favorites.some(x=>(x.id||x.href)===id)}
function toggleCurrentFavorite(){
 const s=state(),item=currentItem(),id=item.id,idx=s.favorites.findIndex(x=>(x.id||x.href)===id);
 if(idx>=0)s.favorites.splice(idx,1);else s.favorites.unshift(item);
 s.favorites=s.favorites.slice(0,24);save(s);window.dispatchEvent(new CustomEvent("atelier:favorite-changed"));return idx<0
}
function selectedText(){return String(window.getSelection?.()?.toString()||"").trim().slice(0,12000)}
function creationText(){
 const c=parse("philosophal-creation-v1"),p=(c?.projects||[]).find(x=>x.id===c.activeProjectId)||(c?.projects||[])[0];
 if(!p)return"";
 const blocks=p.blocks||{};return ["hook","scene","idea","explain","return","close"].map(k=>blocks[k]).filter(Boolean).join("\n\n").slice(0,12000)
}
function frenchText(){return document.querySelector("[data-rewrite-input]")?.value?.trim()||selectedText()}
function putHandoff(target,text,title,extra={}){
 if(!text?.trim()&&!title?.trim())return false;
 localStorage.setItem(HANDOFF_KEY,JSON.stringify({target,text:String(text||"").slice(0,12000),title:String(title||"").slice(0,180),source:section().key,href:location.href,createdAt:Date.now(),...extra}));return true
}
function gotoWithHandoff(target){
 const sec=section(),sel=selectedText();
 if(target==="francais"){
   const text=sel|| (sec.key==="creation"?creationText():"");if(text)putHandoff("francais",text,document.title);
   location.href="/apprendre/francais/?view=write&handoff=1";return
 }
 if(target==="creation"){
   const text=sel||(sec.key==="francais"?frenchText():"");putHandoff("creation",text,`Idée depuis ${sec.title}`);
   location.href="/apprendre/creation/?view=ideas&handoff=1";return
 }
}
function startPomodoro(opts={}){
 const item=currentItem(),sel=selectedText();
 const title=opts.title|| (sel?sel.replace(/\s+/g," ").slice(0,120):item.title);
 localStorage.setItem(POMO_HANDOFF,JSON.stringify({title,estimate:Number(opts.estimate)||1,source:section().key,href:item.href,createdAt:Date.now()}));
 location.href="/pomodoro/?atelierTask=1"
}
window.PHILOSOPHAL_ATELIER={
 async install(){if(installPrompt){installPrompt.prompt();const choice=await installPrompt.userChoice;installPrompt=null;return choice?.outcome==="accepted"?"shown":"dismissed"}return"unavailable"},
 startPomodoro,
 favoriteCurrent:toggleCurrentFavorite,
 toggleFavorite(item){
   if(!item?.id)return false;
   const s=state(),idx=s.favorites.findIndex(x=>(x.id||x.href)===item.id);
   if(idx>=0)s.favorites.splice(idx,1);else s.favorites.unshift({id:item.id,title:item.title||"Favori",href:item.href||location.pathname,area:item.area||section().area,kind:item.kind||"tool"});
   s.favorites=s.favorites.slice(0,24);save(s);window.dispatchEvent(new CustomEvent("atelier:favorite-changed"));return idx<0
 },
 handoff:gotoWithHandoff
};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;window.dispatchEvent(new CustomEvent("atelier:install-ready"))});
window.addEventListener("appinstalled",()=>{installPrompt=null;window.dispatchEvent(new CustomEvent("atelier:installed"))});
if("serviceWorker" in navigator&&(location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1")){
  navigator.serviceWorker.register("/sw-atelier.js").catch(()=>{});
}
function applyRequestedView(){
 const params=new URLSearchParams(location.search),v=params.get("view");if(!v)return;
 const deep=()=>{const recipe=params.get("recipe");if(recipe){let n=0;const timer=setInterval(()=>{n++;const el=document.querySelector(`[data-recipe-card="${CSS.escape(recipe)}"]`);if(el){el.scrollIntoView({behavior:"smooth",block:"center"});el.classList.add("is-highlight");clearInterval(timer)}else if(n>18)clearInterval(timer)},90)}};
 const clickView=()=>{const b=document.querySelector(`[data-view="${CSS.escape(v)}"],[data-mobile="${CSS.escape(v)}"],[data-sheet-view="${CSS.escape(v)}"]`);if(b){b.click();setTimeout(deep,50);return true}return false};
 const app=document.querySelector("[data-app]");
 if(app?.hidden){
   const obs=new MutationObserver(()=>{if(!app.hidden){setTimeout(clickView,30);obs.disconnect()}});
   obs.observe(app,{attributes:true,attributeFilter:["hidden"]});
   setTimeout(()=>{if(!app.hidden)clickView();obs.disconnect()},8000);
 }else{
   let n=0;const timer=setInterval(()=>{n++;if(clickView()||n>25)clearInterval(timer)},80)
 }
}
function contextualActions(){
 const sec=section(),sel=selectedText(),actions=[];
 if(sec.key==="creation")actions.push({id:"to-fr",label:"Relire le script en Français",sub:"Envoie le script actif vers la reformulation."});
 if(sec.key==="francais")actions.push({id:"to-create",label:"Transformer ce texte en contenu",sub:sel?"Utilise la sélection actuelle.":"Utilise la phrase de reformulation si elle existe."});
 if(sec.key==="sport")actions.push({id:"sport-diet",label:"Composer un repas après la séance",sub:"Ouvre directement l’assistant Diététique."});
 if(sec.key==="dietetique")actions.push({id:"diet-sport",label:"Voir mon entraînement",sub:"Retourne à Aujourd’hui dans Sport."});
 if(sec.key==="musique")actions.push({id:"to-create",label:"Transformer une idée musicale en contenu",sub:sel?"La sélection sera transmise au Studio.":"Ouvre la boîte à idées Création."});
 if(sec.key==="anglais")actions.push({id:"to-create",label:"Créer à partir de l’anglais",sub:sel?"La sélection sera transmise au Studio.":"Ouvre le Studio de création."});
 if(sel&&sec.key!=="creation")actions.unshift({id:"to-create",label:"Sélection → Création",sub:`${sel.length} caractères sélectionnés`});
 if(sel&&sec.key!=="francais")actions.unshift({id:"to-fr",label:"Sélection → Français",sub:"Relire / reformuler ce passage"});
 return actions.slice(0,4)
}
function createBridge(){
 if(location.pathname==="/atelier/"||location.pathname==="/apprendre/"||location.pathname.startsWith("/atelier/index"))return;
 const host=document.createElement("div");host.id="philosophal-atelier-bridge";document.body.appendChild(host);const root=host.attachShadow({mode:"open"});
 root.innerHTML=`<style>
 :host{all:initial}*{box-sizing:border-box;font-family:Inter,system-ui,sans-serif}.fab{position:fixed;right:16px;bottom:18px;z-index:2147482000;width:42px;height:42px;border:1px solid rgba(105,82,119,.25);border-radius:14px;background:rgba(250,248,251,.94);backdrop-filter:blur(12px);box-shadow:0 9px 28px rgba(38,29,43,.13);color:#674f76;font-size:18px;cursor:pointer}.sheet{position:fixed;right:16px;bottom:68px;z-index:2147482001;width:min(330px,calc(100vw - 24px));max-height:min(70vh,560px);overflow:auto;padding:10px;border:1px solid #ded7e2;border-radius:16px;background:rgba(253,252,253,.98);box-shadow:0 20px 55px rgba(35,28,39,.2);color:#302a33}.sheet[hidden]{display:none}.head{display:flex;justify-content:space-between;gap:8px;padding:5px 5px 9px}.head strong{font-size:13px}.head small{display:block;color:#857a89;font-size:9px;margin-top:2px}.head button{border:0;background:#f1edf3;border-radius:8px;width:27px;height:27px;color:#756878;cursor:pointer}.actions{display:grid;gap:5px}.action{display:block;width:100%;text-align:left;border:1px solid #e2dce5;border-radius:10px;background:#fff;padding:9px;color:#423a46;cursor:pointer;text-decoration:none}.action strong{display:block;font-size:11px}.action small{display:block;font-size:9px;color:#807682;margin-top:2px;line-height:1.35}.main{background:#6a5279;color:white;border-color:#6a5279}.main small{color:rgba(255,255,255,.73)}.row{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:5px}.row .action{text-align:center}.fav.is-fav{background:#f0e8f4;color:#624b70}@media(max-width:720px){.fab{right:10px;bottom:72px}.sheet{right:10px;bottom:120px;width:calc(100vw - 20px)}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}</style><button class="fab" aria-label="Outils Atelier" title="Atelier">◇</button><section class="sheet" hidden><div class="head"><div><strong></strong><small></small></div><button class="close">×</button></div><div class="actions"></div><div class="row"><a class="action atelier" href="/atelier/">Atelier</a><button class="action fav"></button></div></section>`;
 const fab=root.querySelector(".fab"),sheet=root.querySelector(".sheet"),actions=root.querySelector(".actions"),title=root.querySelector(".head strong"),sub=root.querySelector(".head small"),fav=root.querySelector(".fav");
 function refresh(){
  const item=currentItem();title.textContent=item.title;sub.textContent=`${item.area} · ${item.kind==="project"?"projet":item.kind==="content"?"contenu":"outil"}`;
  fav.textContent=isFav(item.id)?"★ Favori":"☆ Favori";fav.classList.toggle("is-fav",isFav(item.id));
  const rows=[{id:"pomo",label:"25 min sur cette activité",sub:"Crée une tâche Pomodoro avec ce contexte.",main:true},...contextualActions()];
  actions.innerHTML=rows.map(a=>`<button class="action ${a.main?"main":""}" data-act="${a.id}"><strong>${esc(a.label)}</strong><small>${esc(a.sub)}</small></button>`).join("")
 }
 fab.addEventListener("click",()=>{sheet.hidden=!sheet.hidden;if(!sheet.hidden)refresh()});root.querySelector(".close").addEventListener("click",()=>sheet.hidden=true);
 fav.addEventListener("click",()=>{toggleCurrentFavorite();refresh()});
 actions.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act;if(a==="pomo")startPomodoro();else if(a==="to-fr")gotoWithHandoff("francais");else if(a==="to-create")gotoWithHandoff("creation");else if(a==="sport-diet")location.href="/apprendre/dietetique/?view=assistant&from=sport";else if(a==="diet-sport")location.href="/apprendre/sport/?view=today&from=diet"});
 document.addEventListener("click",e=>{if(!host.contains(e.target)&&!sheet.hidden)sheet.hidden=true},{capture:true})
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{applyRequestedView();createBridge()});else{applyRequestedView();createBridge()}
})();