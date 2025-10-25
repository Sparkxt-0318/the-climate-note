// Service Worker for The Climate Note
// Handles background notifications and caching

const CACHE_NAME = 'climate-note-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'climate-note-reminder') {
    event.waitUntil(sendReminderNotification());
  }
});

// Push notifications (for future email integration)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your climate note!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'climate-note-push',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Read Article',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Later',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('The Climate Note 🌱', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Send reminder notification
async function sendReminderNotification() {
  const options = {
    body: 'Read today\'s environmental story and write your action note to keep your streak going.',
    icon: '/favicon.ico',
    tag: 'climate-note-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Read Today\'s Article'
      }
    ]
  };

  return self.registration.showNotification('Time for your Climate Note! 🌱', options);
}