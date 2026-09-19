/* Florian Vallin — freshness worker — 20260919-publish2
   Publication cache refresh: revalidates same-origin resources and clears obsolete site caches. */
const BUILD = "20260919-publish2";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => !key.startsWith("fv-reader-"))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/lecture/")) return;

  event.respondWith(fetch(request, { cache: "no-cache" }));
});
