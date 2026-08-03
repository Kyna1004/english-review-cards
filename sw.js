const CACHE_NAME = "english-cards-v6";
const ASSETS = [
  "./real_workflow_v5_review.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: cache core assets
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean ALL old caches immediately
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first strategy (always get latest, fallback to cache when offline)
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match("./real_workflow_v5_review.html")))
  );
});
