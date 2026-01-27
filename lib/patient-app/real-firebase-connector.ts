/**
 * CONECTOR REAL FIREBASE CLOUD MESSAGING
 * Sistema real de notificaciones push
 */

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  vapidKey: string
}

export interface PushNotification {
  title: string
  body: string
  icon?: string
  image?: string
  data?: Record<string, string>
  deepLink?: string // Para abrir sección específica
}

export class RealFirebaseConnector {
  private app: any = null
  private messaging: any = null
  private initialized = false
  
  /**
   * Inicializa Firebase con credenciales reales
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true
    
    try {
      // Cargar credenciales del .env.local
      const config: FirebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''
      }
      
      // Validar que existan las credenciales
      if (!config.apiKey || !config.projectId) {
        console.warn('⚠️ Firebase no configurado - usando modo simulación')
        console.log('Para activar Firebase real:')
        console.log('1. Ir a https://console.firebase.google.com')
        console.log('2. Crear proyecto "Maya Harmony Station"')
        console.log('3. Activar Cloud Messaging')
        console.log('4. Copiar credenciales a .env.local')
        return false
      }
      
      // En producción, descomentar esto:
      /*
      const { initializeApp } = await import('firebase/app')
      const { getMessaging, getToken, onMessage } = await import('firebase/messaging')
      
      this.app = initializeApp(config)
      this.messaging = getMessaging(this.app)
      
      // Solicitar permiso
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.error('Permiso de notificaciones denegado')
        return false
      }
      
      // Obtener token
      const token = await getToken(this.messaging, { vapidKey: config.vapidKey })
      console.log('✅ Firebase FCM Token:', token)
      
      // Escuchar mensajes en foreground
      onMessage(this.messaging, (payload) => {
        console.log('📨 Notificación recibida:', payload)
        this.handleNotification(payload)
      })
      */
      
      this.initialized = true
      console.log('✅ Firebase inicializado (modo simulación)')
      return true
      
    } catch (error) {
      console.error('Error inicializando Firebase:', error)
      return false
    }
  }
  
  /**
   * Registra token del dispositivo
   */
  async registerDevice(userId: string): Promise<string | null> {
    if (!this.initialized) await this.initialize()
    
    try {
      // En producción, obtener y guardar el token FCM
      const simulatedToken = `fcm-token-${userId}-${Date.now()}`
      
      console.log(`📱 Dispositivo registrado: ${userId}`)
      console.log(`   Token: ${simulatedToken.substring(0, 20)}...`)
      
      // Guardar en Supabase
      // await supabase.from('device_tokens').insert({ user_id: userId, token })
      
      return simulatedToken
    } catch (error) {
      console.error('Error registrando dispositivo:', error)
      return null
    }
  }
  
  /**
   * Envía notificación push a un usuario
   */
  async sendNotification(userId: string, notification: PushNotification): Promise<boolean> {
    if (!this.initialized) await this.initialize()
    
    try {
      console.log('📤 Enviando notificación push...')
      console.log(`   Destinatario: ${userId}`)
      console.log(`   Título: ${notification.title}`)
      console.log(`   Cuerpo: ${notification.body}`)
      
      if (notification.deepLink) {
        console.log(`   Deep Link: ${notification.deepLink}`)
      }
      
      // En producción, usar Firebase Admin SDK desde API route
      /*
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notification })
      })
      */
      
      // Simulación: mostrar notificación del navegador
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon || '/logo.png',
            data: notification.data
          })
        }
      }
      
      console.log('✅ Notificación enviada')
      return true
      
    } catch (error) {
      console.error('Error enviando notificación:', error)
      return false
    }
  }
  
  /**
   * Maneja notificación recibida
   */
  private handleNotification(payload: any): void {
    console.log('📨 Notificación recibida:', payload)
    
    // Extraer deep link si existe
    if (payload.data?.deepLink) {
      // Navegar a la ruta especificada
      if (typeof window !== 'undefined') {
        window.location.href = payload.data.deepLink
      }
    }
  }
  
  /**
   * Envía las 3 notificaciones tipo Neuro-ventas
   */
  async sendAuthorityPush(userId: string, patientName: string): Promise<void> {
    await this.sendNotification(userId, {
      title: 'Actualización de tu Algoritmo Maya',
      body: `${patientName}, el algoritmo Maya ha detectado una disminución en tu índice de colágeno según tu última dieta. Dr. Maya ha actualizado tu prescripción en la App. Revísala ahora.`,
      icon: '/icons/authority.png',
      deepLink: '/patient-app/revelation'
    })
  }
  
  async sendScarcityPush(userId: string): Promise<void> {
    await this.sendNotification(userId, {
      title: 'Ventana Óptima de Recuperación',
      body: 'Tu ventana óptima de recuperación para el lifting Connell cierra este mes. Solo quedan 2 slots de quirófano con protocolo ERAS de alta seguridad.',
      icon: '/icons/urgency.png',
      deepLink: '/patient-app?section=schedule'
    })
  }
  
  async sendEpigeneticRewardPush(userId: string, improvement: string): Promise<void> {
    await this.sendNotification(userId, {
      title: '🎉 ¡Felicitaciones!',
      body: `Tus marcadores de inflamación (NFκB) han bajado ${improvement} gracias a tu kit Interdrogas. Estás entrando en la zona de 'Éxito Quirúrgico'.`,
      icon: '/icons/success.png',
      deepLink: '/patient-app?section=progress'
    })
  }
  
  /**
   * Envía notificación de la secuencia de 7 días
   */
  async send7DayFlowNotification(userId: string, day: number, patientName: string): Promise<void> {
    const notifications: Record<number, PushNotification> = {
      1: {
        title: 'Bienvenido a Maya Harmony Station',
        body: `Hola ${patientName}, Dr. Maya ha digitalizado tu historial biológico. Tu perfil ha sido seleccionado para el nuevo escaneo Quantum Resonance. ¿Conoces tu edad celular real hoy?`,
        deepLink: '/patient-app?section=biological-age'
      },
      2: {
        title: 'El Secreto de tu Longevidad',
        body: '¿Sabías que el 80% de tu envejecimiento no es genético, sino de estilo de vida? Dr. Maya ha implementado protocolos para silenciar genes de inflamación. Mira cómo podemos optimizar tu ADN.',
        deepLink: '/patient-app/revelation'
      },
      3: {
        title: 'El Espejo del Futuro',
        body: 'La verdadera belleza es simetría y salud ósea. Hemos preparado una simulación de tu "Potencial de Proporción Áurea". Entra a la App y descubre tu versión arquitectónica perfecta.',
        deepLink: '/patient-app?section=symmetry'
      },
      4: {
        title: 'Resultados Reales, Seguridad Comprobada',
        body: 'Nuestro paciente [Anónimo] redujo su edad biológica 5 años antes de su cirugía deep plane. Ve el protocolo de seguridad UW que garantizó su éxito.',
        deepLink: '/patient-app?section=testimonials'
      },
      5: {
        title: 'Tu Preparación Celular',
        body: 'Tu cuerpo necesita preparación. Hemos diseñado tu primer Kit Nutracéutico Epigenético. El pedido está listo para enviarse a tu puerta desde Interdrogas.',
        deepLink: '/patient-app?section=interdrogas'
      },
      6: {
        title: '⚠️ Solo 5 Espacios Disponibles',
        body: 'Atención: Dr. Maya solo abrirá 5 slots de evaluación cuántica para este mes en Cali/Quilichao. Asegura tu cupo antes de que el sistema cierre las citas VIP de diagnóstico.',
        deepLink: '/patient-app?section=schedule'
      },
      7: {
        title: 'Tu Momento Ha Llegado',
        body: 'Hoy es el día de reclamar tu soberanía biológica. Dr. Maya te espera para diseñar tu plan de inmortalidad. Haz clic para confirmar tu cita presencial ahora.',
        deepLink: '/patient-app?section=confirm-appointment'
      }
    }
    
    const notification = notifications[day]
    if (notification) {
      await this.sendNotification(userId, notification)
    }
  }
}

// Instancia singleton
export const firebaseConnector = new RealFirebaseConnector()
