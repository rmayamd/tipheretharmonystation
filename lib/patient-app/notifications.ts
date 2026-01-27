/**
 * Sistema de Notificaciones Push para App del Paciente
 */

import { generatePushNotification, selectOptimalTrigger } from './persuasion-engine'

export interface PushNotification {
  id: string
  patientId: string
  title: string
  body: string
  icon: string
  timestamp: Date
  read: boolean
  urgency: 'low' | 'medium' | 'high' | 'critical'
  actionLink: string
  triggerType: 'revelation' | 'solution' | 'facilitation' | 'reminder' | 'achievement'
}

/**
 * Cola de notificaciones programadas
 */
class NotificationQueue {
  private queue: PushNotification[] = []
  
  add(notification: PushNotification) {
    this.queue.push(notification)
    this.sort()
  }
  
  private sort() {
    const urgencyPriority = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    }
    
    this.queue.sort((a, b) => 
      urgencyPriority[b.urgency] - urgencyPriority[a.urgency]
    )
  }
  
  getNext(): PushNotification | undefined {
    return this.queue.shift()
  }
  
  getAll(): PushNotification[] {
    return [...this.queue]
  }
  
  clear() {
    this.queue = []
  }
}

export const notificationQueue = new NotificationQueue()

/**
 * Genera notificación basada en trigger de persuasión
 */
export function createPersuasionNotification(
  patientId: string,
  patientData: any
): PushNotification {
  const trigger = selectOptimalTrigger(patientData)
  const pushData = generatePushNotification(trigger)
  
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    patientId,
    title: pushData.title,
    body: pushData.body,
    icon: pushData.icon,
    timestamp: new Date(),
    read: false,
    urgency: trigger.urgency,
    actionLink: trigger.action.link,
    triggerType: trigger.type,
  }
}

/**
 * Notificación de recordatorio de protocolo
 */
export function createProtocolReminder(
  patientId: string,
  protocolName: string,
  missedDays: number
): PushNotification {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    patientId,
    title: '⏰ Recordatorio de Protocolo',
    body: `Han pasado ${missedDays} días desde tu último registro de ${protocolName}. Tu consistencia es clave para resultados óptimos.`,
    icon: '⏰',
    timestamp: new Date(),
    read: false,
    urgency: missedDays > 3 ? 'high' : 'medium',
    actionLink: '/patient-app',
    triggerType: 'reminder',
  }
}

/**
 * Notificación de logro
 */
export function createAchievementNotification(
  patientId: string,
  achievement: {
    title: string
    description: string
    improvement: number
  }
): PushNotification {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    patientId,
    title: `🎉 ${achievement.title}`,
    body: `${achievement.description} Mejora: +${achievement.improvement}%`,
    icon: '🎉',
    timestamp: new Date(),
    read: false,
    urgency: 'low',
    actionLink: '/patient-app',
    triggerType: 'achievement',
  }
}

/**
 * Notificación de resultado disponible
 */
export function createResultsNotification(
  patientId: string,
  analysisType: 'quantum' | 'inbody' | 'maya-vision'
): PushNotification {
  const titles = {
    quantum: '🔬 Análisis Cuántico Completo',
    inbody: '📊 Análisis InBody Disponible',
    'maya-vision': '📸 Análisis Maya-Vision Listo',
  }
  
  const bodies = {
    quantum: 'Dr. Maya ha detectado cambios importantes en tus marcadores moleculares.',
    inbody: 'Tu composición corporal actualizada está lista. Ver cambios.',
    'maya-vision': 'Tu análisis fotográfico revela tu progreso de simetría.',
  }
  
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    patientId,
    title: titles[analysisType],
    body: bodies[analysisType],
    icon: '📋',
    timestamp: new Date(),
    read: false,
    urgency: 'high',
    actionLink: '/patient-app',
    triggerType: 'revelation',
  }
}

/**
 * Programa notificaciones automáticas según estado del paciente
 */
export function scheduleAutomaticNotifications(
  patientId: string,
  patientData: {
    lastAnalysis: Date
    adherence: number
    stage: 'awareness' | 'consideration' | 'decision' | 'ready'
  }
): PushNotification[] {
  const notifications: PushNotification[] = []
  const daysSinceAnalysis = Math.floor(
    (Date.now() - patientData.lastAnalysis.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Si hace más de 30 días sin análisis
  if (daysSinceAnalysis > 30) {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random()}`,
      patientId,
      title: '🔔 Actualización Recomendada',
      body: `Han pasado ${daysSinceAnalysis} días desde tu último análisis. Es momento de ver tu progreso actualizado.`,
      icon: '🔔',
      timestamp: new Date(),
      read: false,
      urgency: 'medium',
      actionLink: '/patient-app',
      triggerType: 'reminder',
    })
  }
  
  // Si adherencia baja
  if (patientData.adherence < 60) {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random()}`,
      patientId,
      title: '💪 Tu Protocolo Te Espera',
      body: `Tu adherencia está en ${patientData.adherence}%. Dr. Maya tiene tips personalizados para ayudarte.`,
      icon: '💪',
      timestamp: new Date(),
      read: false,
      urgency: 'high',
      actionLink: '/patient-app/chat',
      triggerType: 'reminder',
    })
  }
  
  // Si está en decision stage y no ha actuado
  if (patientData.stage === 'decision') {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random()}`,
      patientId,
      title: '⏰ Ventana de Oportunidad',
      body: 'Solo quedan 2 cupos disponibles para el protocolo personalizado de este mes.',
      icon: '⏰',
      timestamp: new Date(),
      read: false,
      urgency: 'critical',
      actionLink: '/patient-app',
      triggerType: 'facilitation',
    })
  }
  
  return notifications
}

/**
 * Simula envío de notificación push (en producción usaría Firebase/OneSignal)
 */
export async function sendPushNotification(notification: PushNotification): Promise<boolean> {
  console.log('📲 Enviando notificación push:', notification)
  
  // En producción, aquí iría la integración con:
  // - Firebase Cloud Messaging (FCM)
  // - OneSignal
  // - Apple Push Notification Service (APNS)
  
  // Simular envío exitoso
  return new Promise(resolve => {
    setTimeout(() => {
      notificationQueue.add(notification)
      resolve(true)
    }, 100)
  })
}

/**
 * Marca notificación como leída
 */
export function markAsRead(notificationId: string): boolean {
  const queue = notificationQueue.getAll()
  const notification = queue.find(n => n.id === notificationId)
  
  if (notification) {
    notification.read = true
    return true
  }
  
  return false
}
