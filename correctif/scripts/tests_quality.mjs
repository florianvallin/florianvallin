import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root,'js/site-quality.js'),'utf8');
let count = 0;
function check(actual, expected, message) {assert.deepEqual(actual, expected, message); count++;}
class Element {
  constructor(tag='div') {this.tag=tag;this.attrs={};this.dataset={};this.listeners={};this.children=[];this.nodeType=1;this.classList={add(){},remove(){}};}
  setAttribute(k,v) {this.attrs[k]=String(v);}
  getAttribute(k) {return this.attrs[k]??null;}
  hasAttribute(k) {return Object.hasOwn(this.attrs,k);}
  removeAttribute(k) {delete this.attrs[k];}
  closest() {return null;}
  matches(selector) {return this.tag==='iframe'&&selector==='iframe';}
  querySelectorAll() {return [];}
  append(...elements) {this.children.push(...elements);}
  before(element) {this.panel=element;}
  remove() {this.removed=true;}
  addEventListener(k,fn) {this.listeners[k]=fn;}
}
function environment(href='https://philosophal.fr/') {
  class Frame extends Element {constructor(){super('iframe');this.parentElement=new Element();}}
  Object.defineProperty(Frame.prototype,'src',{configurable:true,get(){return this.getAttribute('src')||'';},set(value){Element.prototype.setAttribute.call(this,'src',value);}});
  const location = new URL(href), redirects=[]; location.replace=url=>redirects.push(url);
  const doc={readyState:'loading',documentElement:new Element(),head:new Element(),querySelector:()=>null,
    createElement:tag=>new Element(tag),createTreeWalker:()=>({nextNode:()=>null}),addEventListener(){}};
  const window={HTMLIFrameElement:Frame};
  vm.runInContext(source,vm.createContext({window,location,document:doc,URL}));
  return {window,doc,Frame,redirects,quality:window.PHILOSOPHAL_QUALITY};
}
const env=environment(), q=env.quality;
check(q.cleanText('école\u200b :\u202f«\u00a0φύσις\u00a0»\ufeff'), 'école : « φύσις »', 'Accents, grec et signes visibles conservés');
check(q.cleanText('un\u2060 mot\u00ad\nligne'), 'un mot\nligne', 'Caractères parasites retirés, sauts de ligne conservés');
for(const host of ['philosophal.fr','www.philosophal.fr','florianvallin.github.io']) {
  check(q.upgradeDestination(`http://${host}/blog/?q=art#billets`),`https://${host}/blog/?q=art#billets`,'HTTPS conserve chemin, paramètres et ancre');
}
for(const url of ['http://localhost:5500/','http://127.0.0.1:5500/','http://philosophal.fr.example.net/','https://philosophal.fr/']) check(q.upgradeDestination(url),'','HTTPS limité aux domaines de production');
check(environment('http://philosophal.fr/pdf/?page=2#crop').redirects[0],'https://philosophal.fr/pdf/?page=2#crop','Redirection exécutée avant le montage');
check(environment('http://localhost:5500/').redirects.length,0,'Live Server ne passe pas en HTTPS');
check(q.mediaHost('https://www.youtube-nocookie.com/embed/abc'),'www.youtube-nocookie.com','Hôte vidéo reconnu');
check(q.mediaHost('https://philosophal.fr/pdf/'),'','Documents du site autorisés');
check(q.mediaHost('blob:https://philosophal.fr/abc'),'','Livres et documents locaux autorisés');
check(q.mediaHost('https://youtube.com.example.net/embed/a'),'youtube.com.example.net','Le nom complet du service tiers est conservé, sans confusion');
const frame=new env.Frame();frame.src='https://www.youtube-nocookie.com/embed/abc';
check(frame.getAttribute('src'),null,'Aucun chargement vidéo à la création du lecteur');
check(frame.getAttribute('data-external-src'),'https://www.youtube-nocookie.com/embed/abc','Source vidéo différée');
q.refresh(frame);check(frame.hidden,true,'Lecteur bloqué avant activation');
const button=frame.panel.children.find(e=>e.tag==='button');assert.ok(button);
button.listeners.click();check(frame.getAttribute('src'),'https://www.youtube-nocookie.com/embed/abc','Activation volontaire du bon lecteur');
check(frame.hidden,false,'Lecteur visible après activation');
const local=new env.Frame();local.src='blob:https://philosophal.fr/abc';
check(local.getAttribute('src'),'blob:https://philosophal.fr/abc','Les PDF locaux continuent de s’ouvrir');
const deferredLocal=new env.Frame();deferredLocal.setAttribute('data-external-src','blob:https://philosophal.fr/xyz');q.refresh(deferredLocal);
check(deferredLocal.getAttribute('src'),'blob:https://philosophal.fr/xyz','Un aperçu local différé est restauré sans demander de consentement');

// Une session Prof conservée ne charge pas les archives pendant la lecture publique.
async function restoreAt(route) {
  const credentials={role:'private',keys:{student:'fixture-student',owner:'fixture-owner'}};
  const values=new Map([['philosophal-vault-session-v31',JSON.stringify(credentials)]]);
  const storage={getItem:k=>values.get(k)||null,removeItem:k=>values.delete(k),setItem:(k,v)=>values.set(k,v)};
  const requests=[],location=new URL('https://philosophal.fr'+route);
  const window={navigator:{},fetch:async url=>{requests.push(String(url));throw Error('Archives indisponibles dans ce test');}};
  const document={currentScript:{src:'https://philosophal.fr/js/private-access.js'},querySelector:()=>null};
  vm.runInContext(fs.readFileSync(path.join(root,'js/private-access.js'),'utf8'),vm.createContext({window,document,location,URL,TextEncoder,TextDecoder,HTMLScriptElement:class{},localStorage:storage,sessionStorage:storage,Request,Response}));
  await window.FV_PRIVATE_ACCESS.ready;
  return {requests,api:window.FV_PRIVATE_ACCESS};
}
for(const route of ['/','/blog/','/textes/','/textes/hume-causalite-experience-induction/','/cgu/','/confidentialite/','/mediatheque/']) {
  const restored=await restoreAt(route);
  check(restored.requests.length,0,'Aucune archive demandée sur '+route);
  check(restored.api.role(),'private','Le rôle mémorisé est conservé sur '+route);
}
{
  const restored=await restoreAt('/mediatheque/');
  await assert.rejects(() => restored.api.execute('/mediatheque/data.js'));
  check(restored.requests.some(url=>url.includes('/private/manifest.json')),true,'La médiathèque vérifie les archives avant de restaurer un accès');
  check(restored.api.role(),'','Une session dont les archives ne sont pas vérifiées ne donne pas accès aux fichiers');
}

// Un fichier versionné est réutilisé ; une page reste contrôlée par son URL.
{
  const events={},stored=new Map(),requests=[];
  const cache={match:async req=>stored.get(req.url),put:async(req,response)=>stored.set(req.url,response)};
  const ctx={URL,Response,self:{location:{origin:'https://philosophal.fr'},addEventListener:(name,fn)=>{events[name]=fn;}},
    caches:{open:async()=>cache},fetch:async(req,opts)=>{requests.push([req.url,opts.cache]);return {ok:true,url:req.url,clone(){return this;}};}};
  vm.runInContext(fs.readFileSync(path.join(root,'sw-atelier.js'),'utf8'),vm.createContext(ctx));
  async function get(url){let response;events.fetch({request:{url:'https://philosophal.fr'+url,method:'GET'},respondWith:p=>{response=p;}});return response;}
  await get('/js/site-theme.js?v=20261021-routes5');await get('/js/site-theme.js?v=20261021-routes5');
  check(requests.length,1,'Un script versionné n’est téléchargé qu’une fois');
  await get('/blog/');await get('/blog/');
  check(requests.filter(([url])=>url.endsWith('/blog/')).length,2,'Une navigation vérifie la page demandée sur le réseau');
  await get('/private/manifest.json');check(requests.at(-1)[1],'no-store','Les accès privés ne passent pas par le cache public');
}
console.log(`${count} contrôles réussis : HTTPS, textes et médias externes.`);
