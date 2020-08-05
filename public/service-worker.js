// files are from the front end within the public folder
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.webmanifest",
    "/css/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/js/db.js",
    "/js/index.js"
];

const CACHE_NAME = 'site-cache-v1'
const DATA_CACHE_NAME = 'data-cache-v1'

const openCache = async () => {
    try {
        const cache = await caches.open(CACHE_NAME)
        cache.addAll(FILES_TO_CACHE)
    } catch (error) {
        console.log(error)
    }
}
self.addEventListener('install', event => event.waitUntil(openCache()))


const testFetch = async (event) => {
    try {
        await fetch(event.request.url)
    } catch (error) {
        handleFetch(event)
    }
}

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        }).catch(err => console.log(err))
    );
    self.clients.claim();
});

const handleFetch = async (event) => {
    try {
        const response = await caches.match(event.request)
        if (response) { return response }

        else if (event.request.headers.get("accept").includes('text/html'))
            return caches.match('/')
    } catch (error) {
        console.log(error.message)
    }
}

self.addEventListener('fetch', event => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
