/**
 * Integración con Firebase Cloud Messaging (FCM)
 * Sistema de Push Notifications para Maya Harmony Station
 */

export interface FCMConfig {
  apiKey: string
  authDomain: string
  projectId: string
  messagingSenderId: string
  appId: string
  vapidKey: string
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: {
    deepLink: string
    pushType: string
    neuroPrinciple?: string
    [key: string]: any
  }
}

/**
 * Inicializa Firebase Cloud Messaging
 * En producción, usar credenciales reales de Firebase
 */
export async function initializeFCM(config: FCMConfig): Promise<boolean> {
  try {
    // En producción, aquí iría:
    // import { initializeApp } from 'firebase/app'
    // import { getMessaging, getToken } from 'firebase/messaging'
    
    console.log('🔥 Firebase FCM inicializado:', config.projectId)
    return true
  } catch (error) {
    console.error('Error inicializando FCM:', error)
    return false
  }
}

/**
 * Solicita permiso de notificaciones al usuario
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notificaciones no soportadas en este navegador')
    return false
  }
  
  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Error solicitando permisos:', error)
    return false
  }
}

/**
 * Obtiene token FCM del dispositivo
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    // En producción:
    // const messaging = getMessaging()
    // const token = await getToken(messaging, { vapidKey: config.vapidKey })
    
    // Simulación para desarrollo
    const mockToken = `fcm-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    console.log('📱 FCM Token obtenido:', mockToken)
    return mockToken
  } catch (error) {
    console.error('Error obteniendo FCM token:', error)
    return null
  }
}

/**
 * Envía notificación push usando FCM
 */
export async function sendFCMPush(
  tokens: string[],
  payload: PushPayload
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    // En producción, esto se haría desde el backend:
    // POST https://fcm.googleapis.com/fcm/send
    // Headers: { Authorization: 'key=SERVER_KEY' }
    
    console.log('📤 Enviando push a', tokens.length, 'dispositivos')
    console.log('📦 Payload:', payload)
    
    // Simular envío exitoso
    return {
      success: true,
      sent: tokens.length,
      failed: 0,
    }
  } catch (error) {
    console.error('Error enviando push:', error)
    return {
      success: false,
      sent: 0,
      failed: tokens.length,
    }
  }
}

/**
 * Registra token FCM en la base de datos
 */
export async function registerFCMToken(
  patientId: string,
  fcmToken: string,
  deviceInfo: {
    platform: 'ios' | 'android' | 'web'
    model?: string
    os?: string
  }
): Promise<boolean> {
  try {
    // En producción, guardar en Supabase:
    // INSERT INTO patient_devices (patient_id, fcm_token, platform, ...)
    
    console.log('💾 Registrando token FCM para paciente:', patientId)
    console.log('📱 Dispositivo:', deviceInfo)
    
    return true
  } catch (error) {
    console.error('Error registrando token:', error)
    return false
  }
}

/**
 * Maneja click en notificación (Deep Linking)
 */
export function handleNotificationClick(data: any) {
  if (typeof window === 'undefined') return
  
  const deepLink = data.deepLink || '/patient-app'
  
  console.log('👆 Click en notificación, navegando a:', deepLink)
  
  // Si es URL externa (WhatsApp)
  if (deepLink.startsWith('http')) {
    window.open(deepLink, '_blank')
  } else {
    // Navegación interna
    window.location.href = deepLink
  }
}

/**
 * Configura listener para notificaciones en foreground
 */
export function setupForegroundListener(
  onMessage: (payload: PushPayload) => void
) {
  // En producción:
  // const messaging = getMessaging()
  // onMessage(messaging, (payload) => { ... })
  
  console.log('👂 Listener de notificaciones en foreground configurado')
  
  // Simular recepción de notificación
  if (typeof window !== 'undefined') {
    (window as any).__mayaPushListener = onMessage
  }
}

/**
 * Scheduler de notificaciones programadas
 */
export async function schedulePushNotification(
  tokens: string[],
  payload: PushPayload,
  scheduledFor: Date
): Promise<string> {
  const now = Date.now()
  const scheduledTime = scheduledFor.getTime()
  const delayMs = scheduledTime - now
  
  if (delayMs <= 0) {
    // Enviar inmediatamente
    await sendFCMPush(tokens, payload)
    return 'sent-immediately'
  }
  
  // En producción, usar:
  // - Cloud Scheduler (GCP)
  // - AWS EventBridge
  // - Supabase Edge Functions con cron
  
  console.log(`⏰ Push programado para: ${scheduledFor.toLocaleString()}`)
  console.log(`⏳ Delay: ${Math.round(delayMs / 1000 / 60)} minutos`)
  
  // Simular scheduling
  const scheduleId = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // En desarrollo, usar setTimeout (solo para demo)
  if (delayMs < 1000 * 60 * 60) { // Menos de 1 hora
    setTimeout(() => {
      sendFCMPush(tokens, payload)
    }, delayMs)
  }
  
  return scheduleId
}

/**
 * Cancela notificación programada
 */
export async function cancelScheduledPush(scheduleId: string): Promise<boolean> {
  console.log('❌ Cancelando push programado:', scheduleId)
  // En producción, cancelar en Cloud Scheduler
  return true
}

/**
 * Obtiene estadísticas de notificaciones
 */
export async function getPushStats(patientId: string): Promise<{
  sent: number
  delivered: number
  clicked: number
  conversionRate: number
}> {
  // En producción, consultar desde analytics/database
  return {
    sent: 45,
    delivered: 42,
    clicked: 28,
    conversionRate: 66.7,
  }
}

/**
 * Envía notificación de prueba
 */
export async function sendTestPush(token: string): Promise<boolean> {
  const testPayload: PushPayload = {
    title: '🧪 Notificación de Prueba',
    body: 'Maya Harmony Station - Sistema de notificaciones funcionando correctamente',
    icon: '/icon-192x192.png',
    data: {
      deepLink: '/patient-app',
      pushType: 'test',
    },
  }
  
  const result = await sendFCMPush([token], testPayload)
  return result.success
}

/**
 * Configura service worker para notificaciones en background
 */
export async function setupServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Workers no soportados')
    return false
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('✅ Service Worker registrado:', registration.scope)
    return true
  } catch (error) {
    console.error('Error registrando Service Worker:', error)
    return false
  }
}
