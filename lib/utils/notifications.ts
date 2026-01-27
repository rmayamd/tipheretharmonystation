/**
 * Sistema de Notificaciones
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  timestamp: Date
}

class NotificationManager {
  private notifications: Notification[] = []
  private listeners: Array<(notifications: Notification[]) => void> = []

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  add(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }
    
    this.notifications.push(newNotification)
    this.notify()

    // Auto-remover después de duración
    if (newNotification.duration) {
      setTimeout(() => {
        this.remove(newNotification.id)
      }, newNotification.duration)
    }
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notify()
  }

  clear() {
    this.notifications = []
    this.notify()
  }

  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  // Helpers específicos
  success(title: string, message: string, duration = 3000) {
    this.add({ type: 'success', title, message, duration })
  }

  error(title: string, message: string, duration = 5000) {
    this.add({ type: 'error', title, message, duration })
  }

  warning(title: string, message: string, duration = 4000) {
    this.add({ type: 'warning', title, message, duration })
  }

  info(title: string, message: string, duration = 3000) {
    this.add({ type: 'info', title, message, duration })
  }
}

export const notificationManager = new NotificationManager()

// Notificaciones específicas del sistema
export const SystemNotifications = {
  surgeryBlocked: (reason: string) => {
    notificationManager.warning(
      'Cirugía Bloqueada',
      `La cirugía ha sido bloqueada: ${reason}. Se requiere protocolo de optimización.`
    )
  },

  orderGenerated: (total: number) => {
    notificationManager.success(
      'Orden Generada',
      `Orden de Interdrogas generada: $${total.toLocaleString()} COP`
    )
  },

  orderSent: () => {
    notificationManager.success(
      'Orden Enviada',
      'Orden enviada exitosamente a Interdrogas (6024873000)'
    )
  },

  protocolGenerated: (protocolName: string, duration: number) => {
    notificationManager.info(
      'Protocolo Generado',
      `Protocolo "${protocolName}" generado. Duración: ${duration} días.`
    )
  },

  analysisComplete: () => {
    notificationManager.success(
      'Análisis Completo',
      'Análisis con Cerebro Maya completado. Revisa las recomendaciones.'
    )
  },

  validationError: (errors: string[]) => {
    notificationManager.error(
      'Error de Validación',
      errors.join(', ')
    )
  },
}
