// Cache technique de fichiers publics ; aucun document importé ni compteur de visites.
const RELEASE='20261018-v9';
const CACHE='philosophal-public-v37-v9';
const CORE=['/outils/','/js/site-theme.js?v='+RELEASE,'/css/site-theme.css?v='+RELEASE,'/js/site-quality.js?v='+RELEASE,'/css/site-quality.css?v='+RELEASE];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name!==CACHE&&/^(philosophal-|fv-reader)/.test(name))await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 // Les paramètres de déchiffrement et les archives sont toujours relus sur le réseau.
 if(url.pathname.startsWith('/private/')){event.respondWith(fetch(request,{cache:'no-store'}));return;}
 const asset=/\.(?:js|css|woff2?|ttf|png|jpe?g|webp|svg|ico)$/.test(url.pathname);
 const freshAsset=asset&&(url.searchParams.get('v')===RELEASE||!url.search);
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(freshAsset){const stored=await cache.match(request);if(stored)return stored;}
  try{const response=await fetch(request,{cache:freshAsset?'default':'no-cache'});if(response.ok)await cache.put(request,response.clone());return response}
  catch{const stored=await cache.match(request);return stored||Response.error();}
 })());
});
