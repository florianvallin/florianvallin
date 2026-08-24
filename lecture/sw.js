const CACHE = "fv-reader-v9";
const CORE = [
  "/lecture/",
  "/lecture/index.html",
  "/lecture/reader.css?v=20260825-9",
  "/lecture/reader.js?v=20260825-9",
  "/lecture/library.js?v=20260825-9",
  "/favicon.svg"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (!url.pathname.startsWith("/lecture/") && url.pathname !== "/favicon.svg") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("/lecture/index.html")))
  );
});
