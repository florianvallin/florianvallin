/* Florian Vallin — freshness worker — 20260919-catalogue-hlp-fusion2
   Revalidates same-origin resources. Catalogue restored; HLP reading paths merged by programme object and clarified for desktop/mobile. */
const BUILD = "20260919-catalogue-hlp-fusion2";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => !key.startsWith("fv-reader-")).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/lecture/")) return;
  event.respondWith(fetch(request, { cache:"no-cache" }));
});
