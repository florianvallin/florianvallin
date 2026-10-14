/* Migration des anciens workers : chaque URL conserve sa propre page.
   Le worker actuel, sw-atelier.js, gère le cache public du site. */
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('fv-reader-') ||
      (name.startsWith('philosophal-') && !name.startsWith('philosophal-public-'))
    ).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  // Aucun remplacement par index.html d’une autre rubrique, même hors ligne.
  event.respondWith(fetch(event.request, {cache:'no-cache'}));
});
