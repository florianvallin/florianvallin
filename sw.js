/* Florian Vallin — freshness worker
   Revalidates every same-origin request so returning visitors never stay on an old deployment. */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/lecture/")) return;

  event.respondWith(fetch(request, { cache: "no-cache" }));
});
