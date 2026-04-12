const CACHE_NAME = 'rhine-solution-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
];

const CACHE_STRATEGIES = {
  cacheFirst: [
    /\.(?:js|css)$/,
    /icon\.svg$/,
  ],
  networkFirst: [
    /\.(?:png|jpg|jpeg|svg|webp)$/,
    /sitemap\.xml$/,
    /robots\.txt$/,
  ],
  staleWhileRevalidate: [
    /api/,
  ],
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    return;
  }

  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some((pattern) => pattern.test(url.pathname))) {
      event.respondWith(handleStrategy(strategy, request));
      return;
    }
  }
});

async function handleStrategy(strategy, request) {
  const cache = await caches.open(CACHE_NAME);

  switch (strategy) {
    case 'cacheFirst':
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;

    case 'networkFirst':
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await cache.match(request)) || new Response('Offline', { status: 503 });
      }

    case 'staleWhileRevalidate':
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      });
      return cached || fetchPromise;

    default:
      return fetch(request);
  }
}

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});