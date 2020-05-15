const cacheName = "bon-ui-site-cache-v1"
const urlsToCache = [
    "/",
    "/bundle.js"
]

self.addEventListener("install", event => {
    event.waitUntil(caches.open(cacheName).then(cache => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
    }))
})

self.addEventListener("fetch", event => {
    event.respondWith(caches.match(event.request).then(response => {
        if (response) {
            return response
        }

        return fetch(event.request).then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== "basic") {
                return response
            }

            // IMPORTANT: clone the response.
            // A response is a stream and because we want the browser to consume
            // the response as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone()

            caches.open(cacheName).then(cache => {
                cache.put(event.request, responseToCache)
            })

            return response
        })
    }))
})

// This event is fired when the new (updated) 
// service worker takes control.
self.addEventListener("activate", event => {
    var cacheWhitelist = [  ]

    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName)
            }
        }))
    }))
})

