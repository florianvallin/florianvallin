const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function navigation(route,{valid=true,prefix=''}={}) {
 const location=new URL('https://example.test'+prefix+route),assigned=[],replaced=[],listeners={};
 location.assign=v=>assigned.push(v);location.replace=v=>replaced.push(v);
 class Element{matches(){return false}}
 const window={location,addEventListener:(k,f)=>listeners[k]=f,removeEventListener(){}};
 const history={replaceState:(_,__,v)=>replaced.push(v)};
 const document={currentScript:{src:'https://example.test'+prefix+'/js/navigation-shortcuts.js'},readyState:'complete',querySelector:()=>valid?{}:null};
 vm.runInNewContext(fs.readFileSync(path.join(root,'js/navigation-shortcuts.js'),'utf8'),{window,document,location,history,URL,HTMLElement:Element});
 function key(k,opts={}){let prevented=false;listeners.keydown({key:k,altKey:true,target:new Element(),preventDefault(){prevented=true},stopPropagation(){},stopImmediatePropagation(){},...opts});return prevented}
 return{assigned,replaced,key,Element,window,listeners};
}
let n=navigation('/blog/');assert(n.key('c'));assert.deepEqual(n.assigned,['/mediatheque/']);
n=navigation('/mediatheque/index.html');n.key('C');assert.equal(n.assigned.length,0);
n=navigation('/blog/',{prefix:'/site'});n.key('c');assert.deepEqual(n.assigned,['/site/mediatheque/']);
n=navigation('/');assert.equal(n.key('c',{ctrlKey:true}),false);assert.equal(n.key('c',{repeat:true}),false);assert.equal(n.key('c',{target:{}}),true);
n=navigation('/');const input=new n.Element();input.matches=()=>true;assert.equal(n.key('c',{target:input}),false);
for(const [hub,fallback] of [['textes','catalogue'],['blog','tous-les-billets'],['outils','tous-les-outils'],['mediatheque','accueil']]){
 n=navigation('/'+hub+'/?q=amour#repere',{valid:false});assert.deepEqual(n.replaced,['/'+hub+'/'+fallback+'.html?q=amour#repere']);
 n=navigation('/'+hub+'/'+fallback+'.html?q=amour#repere');assert.deepEqual(n.replaced,['/'+hub+'/?q=amour#repere']);
 n=navigation('/'+hub+'/'+fallback+'.html',{valid:false});assert.equal(n.replaced.length,0,'Pas de boucle sur un secours manquant');
}
function alias(from,to){const location=new URL('https://example.test'+from),calls=[];location.replace=v=>calls.push(v);vm.runInNewContext(fs.readFileSync(path.join(root,'js/navigation-redirect.js'),'utf8'),{document:{body:{dataset:{navigationDestination:to}}},location,URL});return calls}
assert.deepEqual(alias('/outil/?x=1#y','/outils/'),['/outils/?x=1#y']);assert.deepEqual(alias('/blog/utiliser-cinema-philosophie/?x=1#y','/blog/cinema/'),['/blog/cinema/?x=1#y']);assert.deepEqual(alias('/blog/index.html','/blog/'),[]);assert.deepEqual(alias('/','//example.org/'),[]);
// Un header déjà construit avec une mauvaise URL doit ouvrir la rubrique.
for (const [className, expected] of [['nav-blog-link','/blog/'],['nav-texts-link','/textes/'],['nav-tools-link','/outils/']]) {
 const env=navigation('/blog/cinema/'),attrs={href:'/blog/cinema/'};
 const link={closest:()=>({}),classList:{contains:name=>name===className},hasAttribute:()=>false,setAttribute:(k,v)=>attrs[k]=v};
 let prevented=false;
 env.listeners.click({target:{closest:()=>link},button:0,preventDefault(){prevented=true},stopImmediatePropagation(){}});
 assert(prevented);assert.equal(attrs.href,expected);assert.deepEqual(env.assigned,expected==='/blog/'?['/blog/']:[expected]);
 const modified=navigation('/');modified.listeners.click({button:0,ctrlKey:true,target:{closest:()=>link}});assert.equal(modified.assigned.length,0);
}
// Le lien de l'article, à l'intérieur de la liste, reste un lien vers l'article.
{
 const env=navigation('/blog/');env.listeners.click({target:{closest:()=>({closest:()=>null})},button:0});assert.equal(env.assigned.length,0);
}
for (const entry of ['mediatheque/index.html','mediatheque/accueil.html']) {
 const html=fs.readFileSync(path.join(root,entry),'utf8');assert(html.includes('library-sidebar'));assert(html.includes('bibliotheque-ui.js'));assert(html.includes('bibliotheque.css'));assert(html.includes('/apprendre/creation/teleprompteur/'));
}
async function media(role,fail=false){const scripts=[],executed=[],window={};const api={ready:Promise.resolve(),role:()=>role,execute:async p=>{executed.push(p);if(fail)throw Error('Fixture');window.FV_MEDIATHEQUE_DATA={};return true}};window.FV_PRIVATE_ACCESS=api;const document={currentScript:{src:'https://example.test/js/mediatheque-entry.js'},querySelector:()=>({}),createElement:()=>({}),body:{append(s){scripts.push(s.src);if(s.src.includes('data-public'))window.FV_MEDIATHEQUE_DATA={};s.onload();}}};await vm.runInNewContext(fs.readFileSync(path.join(root,'js/mediatheque-entry.js'),'utf8'),{window,document,URL});return{scripts,executed}}
(async()=>{let m=await media('');assert.equal(m.executed.length,0);assert(m.scripts[0].includes('data-public'));assert(m.scripts.at(-1).includes('course-browser'));m=await media('private');assert.equal(m.executed.length,7);assert(!m.scripts.some(x=>x.includes('data-public')));m=await media('private',true);assert(m.scripts[0].includes('data-public'));console.log('Navigation, alias, absence de boucles et chargement public/privé : OK');})();
