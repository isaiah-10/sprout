// Sprout Service Worker — PWA Offline Support
const CACHE_NAME = 'sprout-v1'
const STATIC_ASSETS = ['/', '/login', '/signup', '/manifest.json']

// Install: cache static shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Don't cache API, auth, or Supabase calls
  if (url.pathname.startsWith('/api/') ||
      url.hostname.includes('supabase') ||
      url.hostname.includes('stripe') ||
      request.method !== 'GET') {
    return
  }

  // Cache-first for static assets (fonts, images, icons)
  if (url.pathname.match(/\.(png|jpg|svg|ico|woff2|css|js)$/)) {
    event.respondWith(
      caches.match(request).then(cached => cached ?? fetch(request))
    )
    return
  }

  // Network-first for pages
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Push notifications for parent trade approvals
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Sprout', {
      body:    data.body ?? 'You have a new trade approval request.',
      icon:    '/icons/icon-192.png',
      badge:   '/icons/icon-192.png',
      tag:     'sprout-approval',
      data:    { url: data.url ?? '/parent/approvals' },
      actions: [
        { action: 'view',    title: '👀 View Request' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  if (event.action !== 'dismiss') {
    const url = event.notification.data?.url ?? '/parent/approvals'
    event.waitUntil(clients.openWindow(url))
  }
})
