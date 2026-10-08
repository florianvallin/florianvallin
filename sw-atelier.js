// Seuls des fichiers publics, écrans verrouillés et archives chiffrées peuvent arriver dans ce cache.
const CACHE='philosophal-public-v32';
const CORE=['/outils/','/css/style.css?v=20261005-v32','/css/public-tools.css?v=20261005-v32','/js/private-access.js?v=20261005-v32','/js/private-page.js?v=20261005-v32','/js/owner-gate.js?v=20261005-v32','/css/private-page.css?v=20261005-v32','/favicon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name!==CACHE&&/^(philosophal-|fv-reader)/.test(name))await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(request,{cache:'no-store'});if(response.ok)await cache.put(request,response.clone());return response}catch{const stored=await cache.match(request);return stored||Response.error()}
 })());
});

