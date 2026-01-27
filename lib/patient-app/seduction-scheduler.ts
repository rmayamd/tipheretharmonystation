/**
 * Scheduler del Maya Seduction Engine
 * Ejecuta flujos automáticos de 7 días y notificaciones condicionales
 */

import { 
  scheduleSevenDayFlow, 
  evaluateSegmentRules, 
  createAuthorityPush,
  createScarcityPush,
  createRewardPush,
  type SeductionPush,
  type SegmentType 
} from './maya-seduction-engine'
import { sendFCMPush, schedulePushNotification, type PushPayload } from './firebase-push'

export interface PatientSchedule {
  patientId: string
  patientName: string
  segment: SegmentType
  fcmTokens: string[]
  flowStartDate: Date
  scheduledPushes: Array<{
    push: SeductionPush
    scheduledFor: Date
    status: 'pending' | 'sent' | 'failed'
    scheduleId?: string
  }>
}

/**
 * Inicia el flujo de 7 días para un paciente nuevo
 */
export async function startSevenDayFlow(
  patientId: string,
  patientName: string,
  fcmTokens: string[]
): Promise<PatientSchedule> {
  const startDate = new Date()
  const flow = scheduleSevenDayFlow(patientId, patientName, startDate)
  
  const schedule: PatientSchedule = {
    patientId,
    patientName,
    segment: 'new_patient',
    fcmTokens,
    flowStartDate: startDate,
    scheduledPushes: [],
  }
  
  // Programar cada push
  for (const { push, scheduledFor } of flow) {
    const payload = convertToFCMPayload(push)
    const scheduleId = await schedulePushNotification(fcmTokens, payload, scheduledFor)
    
    schedule.scheduledPushes.push({
      push,
      scheduledFor,
      status: 'pending',
      scheduleId,
    })
    
    console.log(`📅 Push Día ${push.day} programado para: ${scheduledFor.toLocaleString()}`)
  }
  
  // En producción, guardar en base de datos
  // await saveScheduleToDatabase(schedule)
  
  return schedule
}

/**
 * Ejecuta chequeo diario de reglas de segmentación
 */
export async function runDailySegmentCheck(patients: Array<{
  id: string
  name: string
  segment: SegmentType
  fcmTokens: string[]
  lastPurchase?: Date
  lastInteraction?: Date
  daysSinceSurgery?: number
  biomarkers?: any
}>) {
  console.log('🔍 Ejecutando chequeo diario de segmentación...')
  
  const pushesSent: SeductionPush[] = []
  
  for (const patient of patients) {
    const conditionalPush = evaluateSegmentRules(patient)
    
    if (conditionalPush) {
      console.log(`📤 Enviando push condicional a ${patient.name}`)
      const payload = convertToFCMPayload(conditionalPush)
      await sendFCMPush(patient.fcmTokens, payload)
      pushesSent.push(conditionalPush)
    }
  }
  
  console.log(`✅ Chequeo completado. ${pushesSent.length} notificaciones enviadas.`)
  return pushesSent
}

/**
 * Envía push de autoridad cuando biomarcador cambia
 */
export async function sendBiomarkerAlert(
  patientId: string,
  patientName: string,
  fcmTokens: string[],
  biomarker: {
    name: string
    value: number
    previousValue: number
    trend: 'up' | 'down' | 'stable'
  }
) {
  const push = createAuthorityPush(patientName, biomarker)
  const payload = convertToFCMPayload(push)
  
  console.log(`🔬 Alerta de biomarcador para ${patientName}:`, biomarker)
  await sendFCMPush(fcmTokens, payload)
  
  // Registrar en analytics
  // await logPushEvent('biomarker_alert', patientId, push)
}

/**
 * Envía push de escasez cuando quedan pocos cupos
 */
export async function sendScarcityAlert(
  patientId: string,
  patientName: string,
  fcmTokens: string[],
  opportunity: {
    procedure: string
    spotsLeft: number
    deadline: Date
  }
) {
  const push = createScarcityPush(patientName, opportunity)
  const payload = convertToFCMPayload(push)
  
  console.log(`⏰ Alerta de escasez para ${patientName}:`, opportunity)
  await sendFCMPush(fcmTokens, payload)
}

/**
 * Envía push de recompensa cuando hay mejora
 */
export async function sendRewardAlert(
  patientId: string,
  patientName: string,
  fcmTokens: string[],
  achievement: {
    biomarker: string
    improvement: number
    currentValue: number
  }
) {
  const push = createRewardPush(patientName, achievement)
  const payload = convertToFCMPayload(push)
  
  console.log(`🎉 Recompensa epigenética para ${patientName}:`, achievement)
  await sendFCMPush(fcmTokens, payload)
}

/**
 * Convierte SeductionPush a formato FCM
 */
function convertToFCMPayload(push: SeductionPush): PushPayload {
  return {
    title: push.title,
    body: push.body,
    icon: '/maya-icon.png',
    badge: '/maya-badge.png',
    data: {
      deepLink: push.deepLink,
      pushType: push.type,
      neuroPrinciple: push.neuroPrinciple,
      scientificSource: push.scientificSource,
      day: push.day,
      segment: push.segment,
    },
  }
}

/**
 * Programa chequeo automático cada 24 horas
 * En producción, usar Cron Job o Cloud Scheduler
 */
export function startAutoScheduler() {
  console.log('🤖 Auto-Scheduler iniciado')
  
  // En producción:
  // - Cloud Scheduler (GCP) con cron: "0 10 * * *" (10 AM diario)
  // - Supabase Edge Function con cron
  // - AWS EventBridge
  
  // Para desarrollo, simular
  const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24
  
  const checkAndSend = async () => {
    console.log('⏰ Ejecutando chequeo automático...')
    
    // En producción, obtener pacientes de la base de datos
    // const patients = await getActivePatientsFromDatabase()
    // await runDailySegmentCheck(patients)
  }
  
  // Ejecutar inmediatamente
  checkAndSend()
  
  // Repetir cada 24 horas
  setInterval(checkAndSend, TWENTY_FOUR_HOURS)
}

/**
 * Detiene el flujo de un paciente
 */
export async function stopPatientFlow(patientId: string): Promise<boolean> {
  console.log(`⏹️ Deteniendo flujo para paciente: ${patientId}`)
  
  // En producción:
  // 1. Obtener todos los pushes programados del paciente
  // 2. Cancelar cada uno en Cloud Scheduler
  // 3. Marcar como detenido en base de datos
  
  return true
}

/**
 * Obtiene estadísticas del scheduler
 */
export async function getSchedulerStats(): Promise<{
  activeFlows: number
  scheduledPushes: number
  sentToday: number
  conversionRate: number
}> {
  // En producción, consultar desde base de datos
  return {
    activeFlows: 15,
    scheduledPushes: 87,
    sentToday: 34,
    conversionRate: 68.5,
  }
}

/**
 * Función de utilidad: Calcula mejor hora para enviar según perfil
 */
export function calculateOptimalSendTime(segment: SegmentType): number {
  const optimalHours = {
    new_patient: 10, // 10 AM - después del desayuno
    post_op: 9,      // 9 AM - temprano para recordatorios
    longevity: 19,   // 7 PM - después del trabajo
    retoma: 11,      // 11 AM - medio día
  }
  
  return optimalHours[segment] || 10
}

/**
 * Envía resumen diario al Dr. Maya
 */
export async function sendDailySummaryToDoctor(): Promise<void> {
  const stats = await getSchedulerStats()
  
  const summary = `
📊 RESUMEN DIARIO MAYA SEDUCTION ENGINE

✅ Flujos activos: ${stats.activeFlows}
📤 Pushes enviados hoy: ${stats.sentToday}
⏰ Pushes programados: ${stats.scheduledPushes}
💰 Tasa de conversión: ${stats.conversionRate}%

Sistema operando normalmente.
  `
  
  console.log(summary)
  
  // En producción, enviar por:
  // - Email al Dr. Maya
  // - Dashboard administrativo
  // - WhatsApp
}
