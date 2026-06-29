/* LWH Nissan Warehouse — Service Worker v1 */
var CACHE = 'nissan-wh-v1';
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['.','./index.html']).catch(function(){});
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('script.google.com') >= 0) return;
  if (e.request.url.indexOf('cdnjs.cloudflare.com') >= 0 ||
      e.request.url.indexOf('cdn.jsdelivr.net') >= 0 ||
      e.request.url.indexOf('unpkg.com') >= 0) {
    e.respondWith(caches.match(e.request).then(function(c) {
      return c || fetch(e.request).then(function(r) {
        var cl=r.clone(); caches.open(CACHE).then(function(cache){ cache.put(e.request,cl); }); return r;
      });
    }));
    return;
  }
  e.respondWith(fetch(e.request).then(function(r) {
    var cl=r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request,cl); }); return r;
  }).catch(function(){ return caches.match(e.request); }));
});
