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

// try to keep versions the same (ie v1)
// instead of new cache name use different versions but keep both names the same version.
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

self.addEventListener('activate', function(e) {
    try {

    } catch 

// self.addEventListener('activate', function(e) {
//     e.waitUntil(
//         caches.keys().then(keyList => {
//             return Promise.all(
//                 keyList.map(key => {
//                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//                         console.log('Removing old cache data', key);
//                         return caches.delete(key);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });



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
    if (event.request.url.includes('/api')) {

        return;
    }

    event.respondWith(testFetch())
})



// ES5 example to compare with above code
// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(function (cache) {
//                 console.log("Opened cache")
//                 return cache.addAll(FILES_TO_CACHE)
//             })
//             .catch(function (err) {
//                 console.log(err)
//             })
//     )
// })

// self.addEventListener('activate', function(e) {
//     e.waitUntil(
//         caches.keys().then(keyList => {
//             return Promise.all(
//                 keyList.map(key => {
//                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//                         console.log('Removing old cache data', key);
//                         return caches.delete(key);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });

// ES5 to compare to above ES6 code
// self.addEventListener('fetch', function (event) {
//     if (event.request.url.includes('/api')) {

//         return;
//     }

//     event.respondWith(
//         fetch(event.request.url)
//             .catch(function () {
//                 return caches.match(event.request)
//                     .then(function (response) {
//                         if (response) {
//                             return response;
//                         } else if (event.request.headers.get("accept").includes('text/html')) {
//                             return caches.match('/')
//                         }
//                     })
//             })
//     )
// })