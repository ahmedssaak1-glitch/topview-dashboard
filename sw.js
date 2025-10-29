// Simple service worker: offline cache core shell (index.html + assets).
const CACHE_NAME = 'topview-shell-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
  // Note: CDN module imports (firebase) will still be fetched from network.
];

self.addEventListener('install', evt=>{
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt=>{
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', evt=>{
  // network-first for dynamic content, fallback to cache
  if(evt.request.method !== 'GET') return;
  evt.respondWith(
    fetch(evt.request).catch(()=> caches.match(evt.request))
  );
});
