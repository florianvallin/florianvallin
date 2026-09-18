/* Florian Vallin — freshness worker — 20260917-publish1
   Revalidates same-origin resources so returning visitors do not mix deployments. */
const BUILD = "20260917-publish1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => !key.startsWith("fv-reader-"))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // /lecture/ has its own more specific worker.
  if (url.pathname.startsWith("/lecture/")) return;
  event.respondWith(fetch(request, { cache: "no-cache" }));
});
