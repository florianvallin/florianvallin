import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const themeKey = 'philosophal-session-theme-v2';
const release = JSON.parse(read('version.json')).version;
let checks = 0;
function check(value, expected, message) {
  assert.deepEqual(value, expected, message);
  checks++;
}

class Element {
  constructor(typing = false) {
    this.typing = typing; this.dataset = {}; this.style = {}; this.attributes = {};
    this.listeners = {}; this.fields = new Map(); this.value = ''; this.hidden = false;
    this.classList = {toggle() {}, add() {}, remove() {}};
  }
  set src(value) { this._src = new URL(value, 'https://philosophal.fr/').href; }
  get src() { return this._src; }
  matches() { return this.typing; }
  setAttribute(key, value) { this.attributes[key] = value; }
  removeAttribute(key) { delete this.attributes[key]; }
  addEventListener(key, fn) { this.listeners[key] = fn; }
  querySelector(key) {
    if (!this.fields.has(key)) this.fields.set(key, new Element());
    return this.fields.get(key);
  }
  querySelectorAll() { return []; }
  append() {}
  focus() {}
}

function themeEnvironment(saved, systemDark = true, blocked = false) {
  const ready = {}, events = {}, writes = [], callbacks = [];
  const button = new Element(), meta = {content: ''}, html = new Element();
  const window = {
    matchMedia: () => ({matches: systemDark}),
    addEventListener: (name, fn) => {events[name] = fn;}, dispatchEvent() {},
  };
  const document = {
    documentElement: html, body: new Element(), head: new Element(), readyState: 'loading', currentScript: {src:'https://philosophal.fr/js/site-theme.js'}, createElement: () => new Element(),
    addEventListener: (name, fn) => { if(name==='DOMContentLoaded') callbacks.push(fn); else ready[name] = fn; },
    querySelector: selector => selector === '[data-site-theme-toggle]' ? button : null,
    querySelectorAll: selector => selector.startsWith('meta') ? [meta] : selector === '[data-site-theme-toggle]' ? [button] : [],
  };
  const localStorage = {
    getItem() { if (blocked) throw Error('Storage blocked'); return saved; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); saved = value; writes.push([key, value]); },
  };
  const context = vm.createContext({window, document, URL, localStorage, sessionStorage:localStorage,
    CustomEvent: class { constructor(type, opts) {this.type = type; this.detail = opts?.detail;} },
  });
  vm.runInContext(read('js/site-theme.js'), context);
  check(html.dataset.siteTheme, saved === 'dark' ? 'dark' : 'light', 'Thème appliqué dans le head');
  check(writes.length, 0, 'Aucun choix imposé dans le stockage à la première visite');
  callbacks.forEach(fn=>fn());
  return {window, html, button, meta, writes, events, ready};
}

for (const darkSystem of [false, true]) {
  for (const saved of [null, '', 'invalide', 'light', 'dark']) {
    const env = themeEnvironment(saved, darkSystem);
    check(env.window.PHILOSOPHAL_THEME.get(), saved === 'dark' ? 'dark' : 'light', 'Choix explicite prioritaire sur le système');
  }
}
{
  const env = themeEnvironment(null);
  check(env.button.attributes['aria-label'], 'Activer le mode sombre', 'Lune sur le site clair');
  env.ready.click({target: {closest: () => env.button}});
  check(env.html.dataset.siteTheme, 'dark', 'Clic sur la lune : mode sombre');
  check(env.writes.at(-1), [themeKey, 'dark'], 'Choix sombre mémorisé');
  check(env.button.attributes['aria-label'], 'Activer le mode clair', 'Soleil sur le site sombre');
  env.events.storage({key: themeKey, newValue: 'light'});
  check(env.window.PHILOSOPHAL_THEME.get(), 'light', 'Choix synchronisé entre les onglets');
  env.events.storage({key: themeKey, newValue: 'dark'});
  env.events.storage({key: null, newValue: null});
  check(env.window.PHILOSOPHAL_THEME.get(), 'light', 'Effacement des préférences : retour au clair');
}
{
  const env = themeEnvironment(null, true, true);
  env.window.PHILOSOPHAL_THEME.toggle();
  check(env.window.PHILOSOPHAL_THEME.get(), 'dark', 'Bouton utilisable même si le stockage est bloqué');
}

function navigationEnvironment(prefix = '') {
  const events = {}, calls = [], targets = [], listeners = {};
  const location = {
    href: `https://philosophal.fr${prefix}/page-de-test/`, hostname: 'philosophal.fr', pathname: `${prefix}/page-de-test/`,
    assign: target => targets.push(target),
  };
  const document = {
    currentScript: {src: `https://philosophal.fr${prefix}/js/site-tools.js?v=test`},
    readyState: 'loading', head: new Element(), body: new Element(),
    addEventListener() {}, querySelector() {return null;}, querySelectorAll() {return [];},
    createElement: () => new Element(),
  };
  const window = {location, __calls: calls,
    addEventListener(name, fn) { (listeners[name] ||= []).push(fn); events[name] = event => {for(const handler of listeners[name]) {handler(event); if(event.immediateStopped) break;}}; },
    removeEventListener(name,fn) {listeners[name] = (listeners[name]||[]).filter(x=>x!==fn);}
  };
  const source = read('js/site-tools.js');
  assert.match(source, /\}\)\(\);\s*$/);
  // Expose le gestionnaire réel ; les fenêtres sont remplacées par des espions.
  const exposed = source.replace(/\}\)\(\);\s*$/, `
    window.__test = {initShortcuts, resolveSitePath, createFallbackStudentAccess};
    openSiteSearch = () => window.__calls.push('search');
    openDictionary = () => window.__calls.push('dictionary');
    openStudentAccess = () => window.__calls.push('student');
    openShortcutHelp = mode => window.__calls.push('help:' + mode);
  })();`);
  const ctx=vm.createContext({window,document,location,history:{replaceState(){}},navigator:{platform:'Win32'},URL,HTMLElement:Element});
  vm.runInContext(read('js/navigation-shortcuts.js'),ctx);
  vm.runInContext(exposed,ctx);
  window.__test.initShortcuts();
  const key = (key, code, extra = {}) => {
    const event = {key, code, target: new Element(), repeat: false, isComposing: false,
      altKey: false, shiftKey: false, ctrlKey: false, metaKey: false,
      preventDefault() {this.prevented = true;this.defaultPrevented=true;}, stopPropagation() {}, stopImmediatePropagation() {this.immediateStopped=true;}, ...extra};
    events.keydown(event); return event;
  };
  return {window, document, calls, targets, key, location};
}

for (const prefix of ['', '/main', '/philosophal']) {
  const env = navigationEnvironment(prefix);
  const routes = [['h', 'KeyH', '/'], ['t', 'KeyT', '/textes/'],
    ['b', 'KeyB', '/blog/'], ['p', 'KeyP', '/pomodoro/'], ['c', 'KeyC', '/#contact']];
  for (const [key, code, expected] of routes) {
    check(env.key(key, code).prevented, true, `Raccourci ${key} consommé`);
    check(env.targets.at(-1), prefix + expected, `Destination ${key}`);
  }
  for (const [key, code, expected] of [['a', 'KeyA', '/art/'], ['l', 'KeyL', '/lecture/?view=library'],
    ['c', 'KeyC', '/mediatheque/'], ['h', 'KeyH', '/'], ['b', 'KeyB', '/textes/theologie/boussole/'],
    ['m', 'Semicolon', '/textes/mythologie/boussole/'], ['p', 'KeyP', '/textes/philosophie/boussole/']]) {
    env.key(key, code, {altKey: true});
    check(env.targets.at(-1), prefix + expected, `Destination Alt+${key}, AZERTY compris`);
  }
  for (const [key, code, action] of [['r', 'KeyR', 'search'], ['d', 'KeyD', 'dictionary'], ['s', 'KeyS', 'student']]) {
    env.key(key, code); check(env.calls.at(-1), action, `Action ${key}`);
  }
  env.key('?', 'Comma', {shiftKey: true}); check(env.calls.at(-1), 'help:standard', 'Aide clavier');
  env.key('?', 'Comma', {shiftKey: true, altKey: true}); check(env.calls.at(-1), 'help:complete', 'Aide clavier complète');
  const before = env.targets.length;
  for (const extra of [{ctrlKey: true}, {metaKey: true}, {altKey: true, ctrlKey: true},
    {shiftKey: true}, {isComposing: true}, {repeat: true}, {target: new Element(true)}]) env.key('b', 'KeyB', extra);
  check(env.targets.length, before, 'Saisie et raccourcis du navigateur préservés');
  const shell = env.window.__test.createFallbackStudentAccess();
  for (const value of ['didier', 'Didier', 'DIDIER', ' Didier ']) {
    shell.querySelector('[data-fv-student-password]').value = value;
    shell.querySelector('[data-fv-student-form]').listeners.submit({preventDefault() {}});
    check(env.location.href, 'https://bold-beanie-f93.notion.site/Cours-Philosophie-Didier-35781643740b80b28dc8cd07c1e59ea7?source=copy_link', 'Accès Didier conservé');
  }
  for (const value of ['media','medias','mediatheque','mediatheques','MÉDIATHÈQUE',' Médiathèques ']) {
    shell.querySelector('[data-fv-student-password]').value = value;
    shell.querySelector('[data-fv-student-form]').listeners.submit({preventDefault() {}});
    check(env.location.href, prefix+'/mediatheque/', 'Accès médiathèque singulier/pluriel et accents');
  }
}

// Exécute le vrai chargement de la recherche, avec les écritures d’URL du HTML.
for (const attr of ['js/script.js?v=test', '/js/script.js?v=test', '../js/script.js?v=test']) {
  const shell = new Element(); shell.hidden = true;
  const script = {src: 'https://philosophal.fr/js/script.js?v=test'};
  const loaded = [];
  const document = {
    readyState: 'loading', currentScript: script, activeElement: null,
    body: Object.assign(new Element(), {children: []}),
    getElementById() {return {};}, addEventListener() {}, dispatchEvent() {},
    querySelectorAll() {return [];}, createElement: () => new Element(),
    querySelector(selector) {
      if (selector === '[data-site-search-dialog]') return shell;
      const part = selector.match(/src\*="([^"]+)"/);
      return part && attr.includes(part[1]) ? script : null;
    },
  };
  const window = {location: {href: 'https://philosophal.fr/'}, addEventListener() {}, dispatchEvent() {}};
  let context;
  document.head = {append(element) {
    if (element.src?.includes('site-search-data.js')) {
      loaded.push(element.src);
      vm.runInContext(read('js/site-search-data.js'), context);
      element.onload();
    }
  }};
  const source = read('js/script.js').replace('  ready(() => {', '  window.__searchTest = initGlobalSearch;\n  ready(() => {');
  context = vm.createContext({window, document, URL, setTimeout, clearTimeout, performance, Event, requestAnimationFrame:fn=>fn()});
  vm.runInContext(source, context);
  window.__searchTest(); window.FVSiteSearch.open('outils');
  const results = shell.querySelector('[data-site-search-results]');
  for (let i = 0; i < 30 && !results.innerHTML; i++) await new Promise(resolve => setTimeout(resolve, 10));
  check(loaded[0]?.startsWith('https://philosophal.fr/js/site-search-data.js?v='), true, 'Index de recherche chargé et versionné');
  check(results.innerHTML?.includes('href="/outils/"'), true, 'Recherche « outils » : lien vers l’annuaire');
  for (const [query,destination] of [['pdf','/pdf/'],['téléprompteur','/apprendre/creation/teleprompteur/'],['media','/mediatheque/'],['médiathèques','/mediatheque/']]) {
    window.FVSiteSearch.open(query);
    await new Promise(resolve=>setImmediate(resolve));
    check(results.innerHTML?.includes('href="'+destination+'"'),true,'Recherche '+query);
  }
  window.FVSiteSearch.open('le désir nous rend-il heureux');
  await new Promise(resolve=>setImmediate(resolve));
  check(results.innerHTML.includes('/blog/desir-bonheur-quatre-textes/'),false,'Le billet supprimé ne revient pas dans la recherche');
  for (const [query, destination, label] of [
    ['pdf','/pdf/','Outil'],['media','/mediatheque/','Médiathèque'],
    ['boussole mythologique','/textes/mythologie/boussole/','Boussole'],
    ['liberté','/textes/philosophie/boussole/?parcours=liberte','Parcours'],
    ['sauvegarde','/outils/sauvegarde/','Outil']
  ]) {
    window.FVSiteSearch.open(query);
    await new Promise(resolve=>setImmediate(resolve));
    const link = results.innerHTML.match(new RegExp('<a class="site-search-result site-search-result--navigation" href="'+destination.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'">[\\s\\S]*?</a>'))?.[0] || '';
    check(link.includes('site-search-navigation-icon'),true,'Accès direct illustré : '+query);
    check(link.includes('>'+label+'</span>'),true,'Catégorie annoncée : '+query);
  }
  window.FVSiteSearch.open('pomodoro');
  await new Promise(resolve=>setImmediate(resolve));
  check(results.innerHTML.includes('Accès directs'),true,'Groupe des destinations interactives');
  check(results.innerHTML.includes('Textes et ressources'),true,'Groupe des contenus éditoriaux');
  check(results.innerHTML.includes('<a class="site-search-result" href="/blog/methode-pomodoro-etudiants/">'),true,'L’article Pomodoro garde le style de contenu');
  window.FVSiteSearch.open('Absolu');
  await new Promise(resolve=>setImmediate(resolve));
  check(results.innerHTML.includes('<a class="site-search-result" href="/textes/philosophie/boussole/?dict=Absolu">'),true,'Une définition reste une ressource, même dans une boussole');
  window.FVSiteSearch.open('boussole');
  await new Promise(resolve=>setImmediate(resolve));
  for (const subject of ['philosophie','theologie','mythologie']) check(results.innerHTML.includes('href="/textes/'+subject+'/boussole/"'),true,'Les trois boussoles sont proposées avant leurs parcours');
}

// Le choix de densité se restaure sans ouvrir les extraits ni toucher aux dates.
for (const saved of [null,'compact','invalide']) {
  const root = new Element(), controls = [new Element()];
  controls[0].hidden = true;
  const buttons = ['detailed','compact'].map(view => {const button = new Element();button.dataset.seriesViewChoice=view;return button;});
  const writes = [];
  const context = {document:{documentElement:root,readyState:'complete',querySelectorAll:selector=>selector==='[data-series-view-choice]'?buttons:controls},localStorage:{getItem:()=>saved,setItem:(key,value)=>writes.push([key,value])}};
  vm.runInNewContext(read('js/series-display.js'),context);
  check(root.dataset.seriesView,saved==='compact'?'compact':'detailed','Densité mémorisée ou détaillée par défaut');
  buttons[1].listeners.click();
  check(root.dataset.seriesView,'compact','Passage en mode compact');
  check(buttons[1].attributes['aria-pressed'],'true','Bouton actif annoncé');
  check(buttons[0].attributes['aria-pressed'],'false','Autre mode désactivé');
  check(writes.at(-1),['philosophal-series-view-v1','compact'],'Préférence enregistrée');
  buttons[0].listeners.click();
  check(root.dataset.seriesView,'detailed','Retour au mode détaillé');
}
{
  const root=new Element(),button=new Element();button.dataset.seriesViewChoice='compact';
  vm.runInNewContext(read('js/series-display.js'),{document:{documentElement:root,readyState:'complete',querySelectorAll:()=>[button]},localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}});
  button.listeners.click();check(root.dataset.seriesView,'compact','Mode utilisable quand le stockage est bloqué');
}

// Le cache doit répondre à l’URL demandée, sans remplacer un accueil de rubrique.
for (const worker of ['sw.js', 'sw-atelier.js']) {
  const events = {}, fetched = [], matched = [], stored = [];
  let online = true;
  const cache = {put: async (req, value) => stored.push(req.url), match: async req => {matched.push(req.url); return undefined;}};
  const context = {
    URL, Response, location: {origin: 'https://philosophal.fr'},
    self: {location: {origin: 'https://philosophal.fr'}, clients: {claim() {}},
      skipWaiting() {}, addEventListener(name, fn) {events[name] = fn;}},
    caches: {open: async () => cache, match: async () => undefined},
    fetch: async req => {fetched.push(req.url); if (!online) throw Error('Offline'); return {ok: true, url: req.url, clone() {return this;}};},
  };
  vm.runInContext(read(worker), vm.createContext(context));
  const routes = worker === 'sw.js' ? ['/lecture/','/lecture/index.html'] : ['/blog/','/outils/','/mediatheque/','/textes/'];
  for (const route of routes) {
    const request = {url: 'https://philosophal.fr' + route, method: 'GET'};
    let response;
    events.fetch({request, respondWith(promise) {response = promise;}});
    check((await response).url, request.url, `${worker} : destination exacte ${route}`);
  }
  online = false;
  let response;
  const request = {url: 'https://philosophal.fr'+(worker === 'sw.js' ? '/lecture/' : '/blog/'), method: 'GET'};
  events.fetch({request, respondWith(promise) {response = promise;}});
  if (worker === 'sw.js') check(await response, undefined, 'Le lecteur sans copie hors ligne ne retourne pas une autre rubrique');
  else await assert.rejects(response, /Offline/, 'Une navigation hors ligne ne retourne pas une autre rubrique');
}

console.log(`${checks} contrôles réussis : thème, navigation, raccourcis, Didier et cache.`);
