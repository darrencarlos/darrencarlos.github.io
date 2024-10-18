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

// Fetch event with enhanced error handling for caching videos
self.addEventListener('fetch', (event) => {
    // Handle video requests specifically
    if (videoExtensions.some(extension => event.request.url.includes(extension))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // If the video is already cached, return it
                    return cachedResponse;
                }
                
                // If not cached, attempt to fetch from network
                return fetch(event.request, { credentials: 'omit' }).then((networkResponse) => {
                    // Check if the response is valid before caching
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        // If response is invalid (e.g., opaque response), just return the response
                        console.log('Non-cacheable response (probably opaque):', networkResponse.type);
                        return networkResponse;
                    }

                    // Cache the valid video response and return it
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch((error) => {
                    // Fallback: If both cache and network fail, return a custom response
                    console.error('Failed to fetch video or cache it:', error);
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