/* ShiftFile Tools © 2026 — https://shiftfile.tools — All rights reserved. */

var CACHE_NAME = 'shiftfile-tools-v1';

function getBasePath() {
  var path = self.location.pathname;
  var segments = path.split('/').filter(Boolean);
  var firstLevel = ['tools', 'guides', 'about', 'contact', 'developers', 'privacy-policy', 'terms', 'donate'];
  var baseSegments = 0;
  if (segments.length >= 2 && firstLevel.indexOf(segments[1]) !== -1) {
    baseSegments = 1;
  }
  var depth = segments.length - baseSegments;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

function getCacheUrls() {
  var base = getBasePath();
  return [
    base,
    base + 'index.html',
    base + 'assets/css/style.css',
    base + 'assets/js/components.js',
    base + 'assets/img/logo.svg'
  ];
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(getCacheUrls()); })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).catch(function () {
        if (event.request.mode === 'navigate') {
          var base = getBasePath();
          return caches.match(base + 'index.html');
        }
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

/* Deployed: 2026-08-11 02:44:35 */
