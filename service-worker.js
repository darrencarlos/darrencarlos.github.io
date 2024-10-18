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
    // Check if the request is for a video based on its extension
    if (videoExtensions.some(extension => event.request.url.includes(extension))) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        return response;  // Serve video from cache if available
                    }

                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());  // Cache the video
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // Handle other requests (HTML, CSS, JS, etc.)
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});