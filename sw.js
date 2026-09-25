const RELEASE = "philosophal-20260925-publish1";
const READER_CACHE = "fv-reader-v18-20260925-publish1";
const CORE = [
  "/lecture/",
  "/lecture/index.html",
  "/lecture/reader.css?v=20260923-github-refresh1",
  "/lecture/reader.js?v=20260923-github-refresh1",
  "/lecture/library.js?v=20260923-github-refresh1",
  "/favicon.svg?v=20260925-publish1"
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
  if (url.origin !== self.location.origin) return;

  const isReader = url.pathname.startsWith("/lecture/");
  const isVersionSensitive =
    event.request.mode === "navigate" ||
    ["style", "script", "worker", "image", "font"].includes(event.request.destination) ||
    /\.(?:css|js|mjs|json|svg|png|jpe?g|webp|ico|woff2?)$/i.test(url.pathname);

  if (isReader) {
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
    return;
  }

  // After a deployment, always ask the network for pages and static assets.
  // This bypasses a visitor's stale HTTP cache while keeping normal browser
  // behavior for third-party requests and non-version-sensitive resources.
  if (isVersionSensitive) {
    event.respondWith(fetch(event.request, { cache: "reload" }));
  }
});
