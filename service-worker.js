// service-worker.js
const CACHE_NAME = 'video-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',        
    '/gallery.html',      
    '/service-worker.js',
    '/cors.json',
];

// Install event to cache necessary resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(URLS_TO_CACHE); // Cache the listed URLs
        })
    );
});

// Fetch event to serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});