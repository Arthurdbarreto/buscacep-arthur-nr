const CACHE_NAME = "busca-cep-v1"

// Arquivos principais mantidos em cache para abrir o app offline.
const FILES_TO_CACHE = [
	"/",
	"index.html",
	"html/index.html",
	"style.css",
	"css/style.css",
	"script.js",
	"js/script.js",
	"css/materialize.css",
	"js/materialize.js",
	"js/init.js",
	"img/logo_cep.png",
	"manifest.json"
]

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(FILES_TO_CACHE))
	)
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((cachedResponse) => {
				if (cachedResponse) {
					return cachedResponse
				}

				return fetch(event.request)
			})
	)
})
