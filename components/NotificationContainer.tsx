'use client'

import { useEffect, useState } from 'react'
import { notificationManager, Notification } from '@/lib/utils/notifications'
import Alert from './Alert'

export default function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications)
    return unsubscribe
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <div key={notification.id} className="animate-slide-up">
          <Alert
            type={notification.type}
            title={notification.title}
            message={notification.message}
            dismissible
            onDismiss={() => notificationManager.remove(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}
