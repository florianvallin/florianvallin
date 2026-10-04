import vm from 'node:vm';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function assert(v,m){if(!v)throw Error(m);console.log('OK '+m)}
const fields=new Map();function field(){return {value:'',hidden:false,textContent:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn},focus(){},scrollIntoView(){}}}
for(const key of ['#prestation','#message','[data-contact-offer]','[data-offer-summary]','[name="offre"]'])fields.set(key,field());
const form={...field(),querySelector:key=>fields.get(key)};
const doc={readyState:'complete',handlers:{},getElementById:id=>id==='contact-form'?form:null,addEventListener(type,fn){this.handlers[type]=fn}};
const location={href:'https://philosophal.fr/?offre=express#contact',get search(){return new URL(this.href).search}},scope={document:doc,location,history:{replaceState(a,b,url){location.href=new URL(url,location.href).href}},URL,URLSearchParams,matchMedia:()=>({matches:false}),setTimeout:fn=>fn()};vm.createContext(scope);vm.runInContext(fs.readFileSync(path.join(root,'js/contact-offers.js'),'utf8'),scope);
assert(fields.get('[data-contact-offer]').value==='express','offre Express préremplie par son lien');
assert(fields.get('#prestation').value==='Philosophie','prestation associée à l’offre');
assert(fields.get('#message').value.includes('Pack Express'),'message initial associé au pack');
fields.get('#message').value='Message rédigé par le visiteur';fields.get('[data-contact-offer]').value='excellence';fields.get('[data-contact-offer]').listeners.change();
assert(fields.get('#message').value==='Message rédigé par le visiteur','message personnel conservé');
assert(fields.get('[name="offre"]').value.includes('320'),'offre transmise mise à jour');
fields.get('#prestation').value='Méthodologie';fields.get('#prestation').listeners.change();assert(fields.get('[data-contact-offer]').value==='','offre incompatible retirée');
assert(fields.get('#message').value==='Message rédigé par le visiteur','message conservé au changement de prestation');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8'),tools=fs.readFileSync(path.join(root,'outils/index.html'),'utf8');
assert(index.includes('nav-tools-link'),'entrée Outils dans la navigation publique');assert((tools.match(/class="hub-card"/g)||[]).length===5,'cinq outils présentés dans le menu public');
assert(!tools.includes('/atelier/')&&!tools.includes('/apprendre/'),'outils publics sans promotion des espaces personnels');
assert(!fs.existsSync(path.join(root,'textes/comparer')),'comparateur retiré du site');
assert(index.includes('nav-contact-link'),'couleur du contact indépendante de la position du lien');
const publicData={window:{}};vm.createContext(publicData);vm.runInContext(fs.readFileSync(path.join(root,'mediatheque/data.js'),'utf8'),publicData);assert(!publicData.window.FV_MEDIATHEQUE_DATA.resources.some(x=>['livre','manuel','cours','cours-video','mindmap'].includes(x.kind)||x.videoType==='cours-video'),'catalogue public sans ressources personnelles');
console.log('Tests publics validés.');
