/**
 * Sistema de Segmentación de Pacientes por Edad y Perfil
 * Para CRM de Retoma con Base Datos Luxury
 */

import { selectScript, generatePersonalizedMessage } from './neuroventas-scripts'

export interface PatientSegment {
  id: string
  name: string
  ageRange: { min: number; max: number }
  characteristics: string[]
  recommendedScript: 'regeneracion' | 'simetria' | 'global'
  communicationFrequency: 'high' | 'medium' | 'low'
  preferredChannels: string[]
}

/**
 * Segmentos predefinidos
 */
export const PATIENT_SEGMENTS: PatientSegment[] = [
  {
    id: 'millennials-preventivos',
    name: 'Millennials Preventivos',
    ageRange: { min: 25, max: 35 },
    characteristics: [
      'Enfocados en prevención',
      'Tecnológicamente activos',
      'Buscan procedimientos mínimamente invasivos',
      'Valoran resultados naturales',
    ],
    recommendedScript: 'simetria',
    communicationFrequency: 'high',
    preferredChannels: ['WhatsApp', 'Instagram', 'Email'],
  },
  {
    id: 'profesionales-activos',
    name: 'Profesionales Activos',
    ageRange: { min: 35, max: 50 },
    characteristics: [
      'Buscan optimización de rendimiento',
      'Valoran ciencia y evidencia',
      'Tienen poder adquisitivo alto',
      'Quieren resultados sin tiempo de recuperación largo',
    ],
    recommendedScript: 'regeneracion',
    communicationFrequency: 'medium',
    preferredChannels: ['WhatsApp', 'Email', 'Llamada'],
  },
  {
    id: 'ejecutivos-premium',
    name: 'Ejecutivos Premium',
    ageRange: { min: 50, max: 65 },
    characteristics: [
      'Buscan transformación significativa',
      'Valoran servicio VIP',
      'Dispuestos a invertir significativamente',
      'Prefieren privacidad y discreción',
    ],
    recommendedScript: 'global',
    communicationFrequency: 'low',
    preferredChannels: ['Llamada', 'WhatsApp', 'Visita presencial'],
  },
  {
    id: 'transformacion-integral',
    name: 'Transformación Integral',
    ageRange: { min: 55, max: 75 },
    characteristics: [
      'Buscan rejuvenecimiento completo',
      'Abiertos a protocolos extensos',
      'Valoran atención personalizada',
      'Seguimiento a largo plazo',
    ],
    recommendedScript: 'global',
    communicationFrequency: 'medium',
    preferredChannels: ['Llamada', 'Visita presencial', 'WhatsApp'],
  },
]

/**
 * Clasifica paciente en segmento
 */
export function classifyPatient(age: number, concerns: string[], budget: 'low' | 'medium' | 'high'): PatientSegment {
  const matchingSegments = PATIENT_SEGMENTS.filter(
    segment => age >= segment.ageRange.min && age <= segment.ageRange.max
  )
  
  if (matchingSegments.length === 0) {
    // Default al segmento más cercano
    return PATIENT_SEGMENTS[PATIENT_SEGMENTS.length - 1]
  }
  
  // Si hay concerns específicos, refinar la selección
  if (concerns.some(c => c.includes('prevención') || c.includes('longevidad'))) {
    const preventivo = matchingSegments.find(s => s.id === 'profesionales-activos')
    if (preventivo) return preventivo
  }
  
  if (concerns.some(c => c.includes('simetría') || c.includes('armonía'))) {
    const simetria = matchingSegments.find(s => s.id === 'millennials-preventivos')
    if (simetria) return simetria
  }
  
  // Filtrar por presupuesto
  if (budget === 'high') {
    const premium = matchingSegments.find(s => s.id.includes('premium') || s.id.includes('ejecutivos'))
    if (premium) return premium
  }
  
  return matchingSegments[0]
}

/**
 * Genera campaña de retoma personalizada
 */
export function generateRetomaCampaign(
  patientName: string,
  age: number,
  lastVisit: Date,
  concerns: string[],
  budget: 'low' | 'medium' | 'high'
): {
  segment: PatientSegment
  script: any
  message: string
  followUpSchedule: Array<{ day: number; action: string }>
  priority: 'high' | 'medium' | 'low'
} {
  const segment = classifyPatient(age, concerns, budget)
  const script = selectScript(age, concerns)
  
  // Determinar prioridad basada en tiempo desde última visita
  const daysSinceLastVisit = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
  let priority: 'high' | 'medium' | 'low' = 'medium'
  
  if (daysSinceLastVisit > 180 && budget === 'high') priority = 'high'
  if (daysSinceLastVisit < 90) priority = 'low'
  
  // Generar hallazgos específicos simulados
  const specificFindings = [
    `Segmento: ${segment.name}`,
    `Última visita: Hace ${daysSinceLastVisit} días`,
    `Preocupaciones principales: ${concerns.slice(0, 2).join(', ')}`,
  ]
  
  const message = generatePersonalizedMessage(script, patientName, specificFindings)
  
  // Generar cronograma de seguimiento
  const followUpSchedule = generateFollowUpSchedule(segment.communicationFrequency)
  
  return {
    segment,
    script,
    message,
    followUpSchedule,
    priority,
  }
}

function generateFollowUpSchedule(frequency: 'high' | 'medium' | 'low'): Array<{ day: number; action: string }> {
  const baseSchedule = [
    { day: 1, action: 'Enviar mensaje inicial personalizado' },
    { day: 3, action: 'Compartir contenido educativo relevante' },
    { day: 7, action: 'Enviar testimonio de paciente similar' },
    { day: 14, action: 'Oferta especial limitada' },
  ]
  
  if (frequency === 'high') {
    return [
      ...baseSchedule,
      { day: 5, action: 'Check-in casual - Responder dudas' },
      { day: 10, action: 'Video personalizado del equipo' },
      { day: 21, action: 'Llamada de seguimiento' },
    ]
  }
  
  if (frequency === 'low') {
    return [
      baseSchedule[0],
      baseSchedule[2],
      { day: 21, action: 'Llamada ejecutiva personalizada' },
    ]
  }
  
  return baseSchedule
}

/**
 * Importa y procesa Base Datos Luxury
 */
export function processLuxuryDatabase(patients: any[]): Array<{
  patient: any
  campaign: any
}> {
  return patients.map(patient => {
    const campaign = generateRetomaCampaign(
      patient.name,
      patient.age,
      new Date(patient.lastVisit),
      patient.concerns || [],
      patient.budget || 'medium'
    )
    
    return { patient, campaign }
  })
}
