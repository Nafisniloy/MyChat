const cacheName = 'v1';
// const dynamicCache = 'v1';
const cacheFiles = [
    '/',
    '/index.html',
    '/chat',
    '/chats',
   
];

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
    caches.open(cacheName).then(function(cache) {
        return cache.addAll(cacheFiles);
    })
    );
});
console.log('hello')
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    return caches.delete(thisCacheName);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function(event) {

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || (fetch(event.request).then(function(response) {
                return caches.open(cacheName).then(function(cache) {
                    if (event.request.url.indexOf('google') === -1) {
                    cache.put(event.request, response.clone());
                    }
                    return response;
                });
            }));
        }).catch(function() {            
            return new Response.json({results: []});
        })
      
    );
});