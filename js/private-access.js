(() => {
  'use strict';
  if (window.FV_PRIVATE_ACCESS?.version === 31) return;
  const scriptPath = new URL(document.currentScript?.src || '/js/private-access.js', location.href).pathname;
  const prefix = scriptPath.slice(0, scriptPath.lastIndexOf('/js/'));
  const SESSION = 'philosophal-vault-session-v31', REMEMBER = 'philosophal-vault-remember-v31';
  const originalFetch = window.fetch.bind(window), files = new Map(), objectURLs = new Map();
  const encoder = new TextEncoder(), decoder = new TextDecoder();
  let currentRole = '', manifestPromise, failedAttempts = 0;
  const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  const pathOf = url => { const u = new URL(url, location.href); if(u.origin !== location.origin)return ''; return prefix && u.pathname.startsWith(prefix+'/') ? u.pathname.slice(prefix.length) : u.pathname; };
  const manifest = () => manifestPromise ||= originalFetch(`${prefix}/private/manifest.json?v=31`, {cache:'no-store'}).then(r => { if(!r.ok)throw new Error('Fichiers privés indisponibles.'); return r.json(); });
  async function openPack(path, key64) {
    const response = await originalFetch(prefix + path, {cache:'no-store'});
    if(!response.ok)throw new Error('Une archive privée est manquante.');
    const bytes = new Uint8Array(await response.arrayBuffer()), iv=bytes.slice(0,12);
    const key=await crypto.subtle.importKey('raw',decode(key64),'AES-GCM',false,['decrypt']);
    const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(path)},key,bytes.slice(12));
    if(typeof DecompressionStream === 'undefined')throw new Error('Mettez votre navigateur à jour pour ouvrir cet espace.');
    const json=await new Response(new Blob([plaintext]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    const content=JSON.parse(json);
    if(content.format!=='philosophal-private-pack-v31'||!content.files)throw new Error('Archive privée invalide.');
    return Object.entries(content.files);
  }
  async function activate(credentials, remember = false) {
    if(!['private','student'].includes(credentials?.role)||!credentials.keys)throw new Error('Accès invalide.');
    const info=await manifest(), next=new Map();
    for(const id of credentials.role==='private'?['student','owner']:['student']){
      const pack=info.packs[id]; if(!pack||!credentials.keys[id])throw new Error('Clé absente.');
      for(const [path,entry] of await openPack(pack.path,credentials.keys[id]))next.set(path,entry);
    }
    files.clear();for(const [path,entry] of next)files.set(path,entry);
    currentRole=credentials.role;
    sessionStorage.setItem(SESSION,JSON.stringify(credentials));
    if(remember&&currentRole==='private')localStorage.setItem(REMEMBER,JSON.stringify(credentials));
    else localStorage.removeItem(REMEMBER);
    window.dispatchEvent(new CustomEvent('philosophal:unlocked',{detail:{role:currentRole}}));
    return currentRole;
  }
  async function unlockRole(password, remember = false) {
    await ready;
    if(!window.crypto?.subtle)throw new Error('Ouvrez le site en HTTPS, ou sur localhost pour un test local.');
    if(failedAttempts>2)await new Promise(resolve=>setTimeout(resolve,Math.min(failedAttempts*500,4000)));
    const info=await manifest(), material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
    for(const profile of info.profiles){
      try{
        const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(profile.salt),iterations:info.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
        const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(profile.iv),additionalData:encoder.encode('philosophal-v31:'+profile.role)},key,decode(profile.wrapped));
        const credentials=JSON.parse(decoder.decode(clear));
        const role=await activate(credentials,remember);failedAttempts=0;return role;
      }catch(error){if(error.name!=='OperationError')throw error;}
    }
    failedAttempts++;return '';
  }
  function cssSource(entry,path){
    return decoder.decode(decode(entry.data)).replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(all,q,url)=>{
      if(/^(data:|https?:|#|blob:)/i.test(url))return all;
      const absolute=new URL(url,location.origin+prefix+path).href;
      return `url("${assetURL(absolute)}")`;
    });
  }
  function assetURL(url){
    const path=pathOf(url),entry=files.get(path);if(!entry)return url;
    if(!objectURLs.has(path)){
      const data=entry.mime.startsWith('text/css')?cssSource(entry,path):decode(entry.data);
      objectURLs.set(path,URL.createObjectURL(new Blob([data],{type:entry.mime})));
    }
    return objectURLs.get(path);
  }
  async function execute(path){
    await ready;if(!files.has(path))return false;
    await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=assetURL(location.origin+prefix+path);script.onload=resolve;script.onerror=()=>reject(new Error('Chargement privé impossible.'));document.head.append(script);});return true;
  }
  window.fetch=async(input,init)=>{
    const url=typeof input==='string'||input instanceof URL?String(input):input.url;
    const method=init?.method||(input instanceof Request?input.method:'GET');
    if(method.toUpperCase()==='GET'){
      await ready;const entry=files.get(pathOf(url));
      if(entry)return new Response(decode(entry.data),{status:200,headers:{'Content-Type':entry.mime,'Cache-Control':'no-store'}});
    }
    return originalFetch(input,init);
  };
  const srcDescriptor=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,'src');
  if(srcDescriptor?.set)Object.defineProperty(HTMLScriptElement.prototype,'src',{...srcDescriptor,set(value){srcDescriptor.set.call(this,assetURL(value));}});
  // Les images de chapitres insérées après chargement doivent aussi utiliser leurs octets déchiffrés.
  for(const [Type,property] of [[window.HTMLImageElement,"src"],[window.HTMLSourceElement,"src"],[window.HTMLLinkElement,"href"]]){
    if(!Type)continue;const d=Object.getOwnPropertyDescriptor(Type.prototype,property);
    if(d?.set)Object.defineProperty(Type.prototype,property,{...d,set(value){d.set.call(this,assetURL(value));}});
  }
  if(typeof MutationObserver!=="undefined"){
    const rewrite=node=>{
      if(node.nodeType!==1)return;
      const elements=[...(node.matches?.("img[src],source[src]")?[node]:[]),...node.querySelectorAll("img[src],source[src]")];
      for(const element of elements){const current=element.getAttribute("src"),url=assetURL(current);if(url!==current)element.setAttribute("src",url);}
    };
    new MutationObserver(records=>{for(const record of records){if(record.type==="attributes")rewrite(record.target);else for(const node of record.addedNodes)rewrite(node);}}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:["src"]});
  }
  function lock(){
    sessionStorage.removeItem(SESSION);localStorage.removeItem(REMEMBER);
    currentRole='';files.clear();for(const url of objectURLs.values())URL.revokeObjectURL(url);objectURLs.clear();
    location.reload();
  }
  async function renderPrivate(path){
    await ready;const entry=files.get(path);if(!entry||!entry.mime.startsWith('text/html'))throw new Error('Cet accès ne permet pas d’ouvrir cette page.');
    const html=decoder.decode(decode(entry.data));const doc=new DOMParser().parseFromString(html,'text/html');
    if(path==="/apprendre/creation/index.html"){
      const style=doc.createElement("link");style.rel="stylesheet";style.href=prefix+"/css/creator-tools.css?v=20261006";doc.head.append(style);
      const entry=doc.createElement("div");entry.innerHTML='<nav class="creator-tools-entry" aria-label="Outils de création"><div><strong>Préparer et lire un script</strong><small>Téléprompteur, vitesse réglable, mode miroir et estimation de durée.</small></div><a href="/apprendre/creation/teleprompteur/">Ouvrir le téléprompteur →</a></nav>';doc.body.prepend(entry.firstElementChild);
    }
    for(const n of doc.querySelectorAll('script[src],link[rel="stylesheet"][href],img[src],source[src]')){
      const attr=n.hasAttribute('src')?'src':'href';const url=new URL(n.getAttribute(attr),location.href).href;n.setAttribute(attr,assetURL(url));
    }
    delete window.PHILOSOPHAL_BACKUP;
    document.open();document.write('<!doctype html>'+doc.documentElement.outerHTML);document.close();
  }
  const ready=(async()=>{
    // Purger les caches historiques de contenus privés, sans toucher aux livres ni aux documents IndexedDB.
    try {
      if(window.navigator?.serviceWorker){
        const registrations=await navigator.serviceWorker.getRegistrations();
        for(const registration of registrations){
          const worker=registration.active||registration.waiting||registration.installing;
          const path=worker?new URL(worker.scriptURL).pathname:"";
          if(path.endsWith("/sw.js")||path.endsWith("/english-offline.js"))await registration.unregister();
        }
        if(window.caches)for(const name of await caches.keys())if(/^(fv-reader|philosophal-reader|philosophal-english|philosophal-atelier)/.test(name))await caches.delete(name);
        navigator.serviceWorker.register(prefix+"/sw-atelier.js?v=20261004-v31",{scope:prefix+"/",updateViaCache:"none"}).catch(()=>{});
      }
    }catch{}

    for(const store of [localStorage,sessionStorage])for(const key of ['philosophal-owner-access-v1','philosophal-access-state-v2','fv-private-library'])store.removeItem(key);
    let saved;try{saved=JSON.parse(sessionStorage.getItem(SESSION)||localStorage.getItem(REMEMBER)||'null');}catch{}
    if(saved){try{await activate(saved,localStorage.getItem(REMEMBER)!==null);}catch{sessionStorage.removeItem(SESSION);localStorage.removeItem(REMEMBER);}}
    return currentRole;
  })();
  window.FV_PRIVATE_ACCESS=Object.freeze({version:31,ready,unlockRole,unlock:async p=>(await unlockRole(p))==='private',role:()=>currentRole,isUnlocked:()=>currentRole==='private',isStudentUnlocked:()=>currentRole==='student',isRemembered:()=>localStorage.getItem(REMEMBER)!==null,lock,assetURL,execute,renderPrivate,getText:path=>files.has(path)?decoder.decode(decode(files.get(path).data)):null});
})();
