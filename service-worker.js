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
const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];  // Add any other formats you want to support

self.addEventListener('fetch', (event) => {
    if (videoExtensions.some(extension => event.request.url.includes(extension))) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse.type === 'opaque') {
                        // Cache the opaque response, but you can't inspect it
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Return from cache if available in case of failure
                    return caches.match(event.request);
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});