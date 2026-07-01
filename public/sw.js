// public/sw.js
// PhysicsVerse Service Worker — Phase 15 Offline Support

const CACHE_VERSION = "physicsverse-v1";
const STATIC_CACHE   = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE   = `${CACHE_VERSION}-runtime`;

// Core routes to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/explore",
  "/learn",
  "/lab",
  "/practice",
  "/formulas",
  "/offline",
  "/manifest.json",
];

// ─── Install: pre-cache core routes ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: clean up old caches ───────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("physicsverse-") && !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: network-first for pages, cache-first for assets ─────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests (except same-origin assets)
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // API / Firebase requests: always go to network, never cache
  if (url.pathname.startsWith("/api/") || url.hostname.includes("firebaseio") || url.hostname.includes("googleapis")) {
    return;
  }

  // Static assets (JS, CSS, fonts, images): cache-first
  if (/\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // HTML pages: network-first, fallback to cache, fallback to offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/offline"))
      )
  );
});

// ─── Background sync (future: queue practice attempts when offline) ─────────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-practice-attempts") {
    // Placeholder for future implementation:
    // sync queued attempts from IndexedDB to Firestore when back online
  }
});
