const CACHE_NAME = 'video-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',        
    '/gallery.html',      
    '/service-worker.js',
    '/cors.json',
];

const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];  // Add any other video formats you want to handle

// Install event to cache necessary resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(URLS_TO_CACHE); // Cache the listed URLs
        })
    );
});

// Fetch event with fallback logic
self.addEventListener('fetch', (event) => {
    // Handle video requests specifically
    if (videoExtensions.some(extension => event.request.url.includes(extension))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // If the video is already cached, return it
                    return cachedResponse;
                }
                
                // If not cached, attempt to fetch from network and cache it
                return fetch(event.request, { credentials: 'omit' }).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                        // If response is opaque or failed, just return the network response (opaque or otherwise)
                        return networkResponse;
                    }

                    // Cache the video and return it
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // Fallback: If both cache and network fail, return a custom response
                    return new Response('Video is unavailable offline.');
                });
            })
        );
    } else {
        // Handle non-video requests as usual
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});