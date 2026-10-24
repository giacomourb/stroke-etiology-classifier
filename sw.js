/* Service worker cache-first per uso offline.
   INCREMENTARE la versione ad ogni aggiornamento dei file, altrimenti il
   telefono continua a servire la versione vecchia. */
var CACHE = "etio-v5";
var ASSETS = [
  ".",
  "index.html",
  "app.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "icon-512-maskable.png",
  "icon-180.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) { return res; })
        .catch(function () { return caches.match("index.html"); });
    })
  );
});
