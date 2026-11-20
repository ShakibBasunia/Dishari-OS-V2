/* Dishari OS, offline-first service worker (stale-while-revalidate for the app shell). */
const CACHE = 'dishari-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'assets/favicon.svg', 'assets/css/dishari.css',
  'assets/js/core/core.js', 'assets/js/data/i18n.js', 'assets/js/components/icons.js', 'assets/js/core/ui.js', 'assets/js/data/kb.js', 'assets/js/engine/rag.js',
  'assets/js/data/curriculum.js', 'assets/js/data/demo.js', 'assets/js/engine/tutor.js',
  'assets/js/components/charts.js', 'assets/js/components/qr.js', 'assets/js/pages/landing.js',
  'assets/js/pages/app.js', 'assets/js/pages/labs.js', 'assets/js/pages/game.js', 'assets/js/pages/tools.js',
  'assets/js/pages/demo.js', 'assets/js/pages/admin.js', 'assets/js/pages/sdg4.js', 'assets/js/pages/data.js',
  'assets/js/pages/security.js', 'assets/js/pages/architecture.js', 'assets/js/pages/presentation.js',
  'assets/js/pages/pitchdeck.js', 'assets/js/pages/audit.js', 'assets/js/boot.js'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/api/')) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(e.request, { ignoreSearch: e.request.mode === 'navigate' });
    const net = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit || c.match('index.html'));
    return hit || net;
  }));
});
