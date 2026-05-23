const CACHE_NAME = 'stablee-v2'

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(fetch(event.request).catch(() => caches.match('/')))
})