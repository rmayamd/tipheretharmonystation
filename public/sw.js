// Service Worker para Maya Harmony Station
// Maneja notificaciones push en background

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado')
  event.waitUntil(self.clients.claim())
})

// Maneja notificaciones push
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body || 'Nueva actualización de Maya Harmony Station',
    icon: data.icon || '/maya-icon.png',
    badge: data.badge || '/maya-badge.png',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ],
    vibrate: [200, 100, 200],
    tag: 'maya-notification',
    renotify: true,
  }
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Maya Harmony Station',
      options
    )
  )
})

// Maneja clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const deepLink = event.notification.data?.deepLink || '/patient-app'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.focus()
            client.navigate(deepLink)
            return
          }
        }
        
        // Si no, abrir nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(deepLink)
        }
      })
  )
})

// Maneja mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
