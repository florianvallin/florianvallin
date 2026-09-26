const RELEASE = "philosophal-20260926-prod4";
const READER_CACHE = "fv-reader-v21-20260926-prod4";
const CORE = [
  "/lecture/",
  "/lecture/index.html",
  "/lecture/reader.css?v=20260926-prod4",
  "/lecture/reader.js?v=20260926-prod4",
  "/lecture/library.js?v=20260926-prod4",
  "/favicon.svg?v=20260926-prod4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(READER_CACHE)
      .then(async (cache) => {
        for (const path of CORE) {
          try {
            const response = await fetch(path, { cache: "reload" });
            if (response.ok) await cache.put(path, response);
          } catch (_) {}
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => {
        const isOldReader = key.startsWith("fv-reader-") && key !== READER_CACHE;
        const isOldRelease = key.startsWith("philosophal-") && key !== RELEASE;
        return (isOldReader || isOldRelease) ? caches.delete(key) : Promise.resolve(false);
      })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/lecture/")) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: "reload" });
      if (response && response.ok) {
        const cache = await caches.open(READER_CACHE);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (_) {
      const cached = await caches.match(event.request);
      return cached || caches.match("/lecture/index.html");
    }
  })());
});
