/**
 * Maya Seduction Engine
 * Sistema de notificaciones push automatizadas con neuroventas
 * Basado en Catherine Maley + Nestor Braidot + 50 tratados
 */

export type PushType = 'authority' | 'scarcity' | 'epigenetic_reward'
export type SegmentType = 'post_op' | 'longevity' | 'retoma' | 'new_patient'

export interface SeductionPush {
  id: string
  type: PushType
  segment: SegmentType
  day: number // Día del flujo (1-7)
  title: string
  body: string
  deepLink: string
  neuroPrinciple: string
  scientificSource?: string
  triggerCondition?: string
}

/**
 * TIPO 1: PUSH DE AUTORIDAD (El Oráculo)
 * Establece que "vemos" lo que ellos no ven
 */
export function createAuthorityPush(
  patientName: string,
  biomarker: {
    name: string
    value: number
    trend: 'up' | 'down' | 'stable'
  }
): SeductionPush {
  let message = ''
  
  if (biomarker.trend === 'down' && biomarker.name.includes('colágeno')) {
    message = `${patientName}, el algoritmo Maya ha detectado un descenso en su índice de colágeno (${biomarker.value}%) según su última dieta. El Dr. Maya ha actualizado su prescripción en la App. Revísela ahora.`
  } else if (biomarker.trend === 'up' && biomarker.name.includes('inflamación')) {
    message = `${patientName}, sus marcadores de inflamación molecular (NFκB) han aumentado a ${biomarker.value}%. El Dr. Maya ha ajustado su protocolo anti-inflamatorio. Entre ahora para ver los cambios.`
  } else {
    message = `${patientName}, el Dr. Maya ha detectado cambios en su ${biomarker.name}. Su protocolo personalizado ha sido actualizado. Revise su nueva prescripción.`
  }
  
  return {
    id: `auth-${Date.now()}`,
    type: 'authority',
    segment: 'longevity',
    day: 0, // Push condicional, no del flujo
    title: '🔬 El Dr. Maya Detectó Algo',
    body: message,
    deepLink: '/patient-app',
    neuroPrinciple: 'Autoridad Científica + Ver lo invisible = Dependencia saludable',
    scientificSource: 'Byung Pal Yu - Epigenetic Modulation',
    triggerCondition: `${biomarker.name} cambió ${biomarker.trend === 'down' ? 'bajó' : 'subió'}`,
  }
}

/**
 * TIPO 2: PUSH DE ESCASEZ (El Gatillo de Dopamina)
 * Activa FOMO y urgencia
 */
export function createScarcityPush(
  patientName: string,
  opportunity: {
    procedure: string
    spotsLeft: number
    deadline: Date
  }
): SeductionPush {
  const daysLeft = Math.ceil((opportunity.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  return {
    id: `scar-${Date.now()}`,
    type: 'scarcity',
    segment: 'retoma',
    day: 0,
    title: '⏰ Ventana de Oportunidad Cerrando',
    body: `${patientName}, su ventana de recuperación óptima para el ${opportunity.procedure} de Connell se cierra ${daysLeft > 1 ? `en ${daysLeft} días` : 'HOY'}. Solo quedan ${opportunity.spotsLeft} espacios de quirófano con protocolo ERAS de alta seguridad.`,
    deepLink: '/patient-app',
    neuroPrinciple: 'FOMO + Escasez artificial = Decisión acelerada',
    scientificSource: 'ERAS Complete Protocols + Bruce Connell',
    triggerCondition: `Cupos limitados: ${opportunity.spotsLeft}`,
  }
}

/**
 * TIPO 3: PUSH DE RECOMPENSA EPIGENÉTICA
 * Refuerza comportamiento positivo
 */
export function createRewardPush(
  patientName: string,
  achievement: {
    biomarker: string
    improvement: number
    currentValue: number
  }
): SeductionPush {
  return {
    id: `reward-${Date.now()}`,
    type: 'epigenetic_reward',
    segment: 'longevity',
    day: 0,
    title: '🎉 ¡Transformación Epigenética Detectada!',
    body: `¡Felicidades ${patientName}! Sus marcadores de ${achievement.biomarker} han mejorado ${achievement.improvement}% gracias a su kit de Interdrogas. Actual: ${achievement.currentValue}%. Está entrando en la zona de 'Éxito Quirúrgico'.`,
    deepLink: '/patient-app',
    neuroPrinciple: 'Recompensa dopamínica + Gamificación = Compra recurrente',
    scientificSource: 'Oxidative Stress and Mitochondrial Health',
  }
}

/**
 * FLUJO DE 7 DÍAS - MAYA SEDUCTION ENGINE
 */
export const SEVEN_DAY_SEDUCTION_FLOW: SeductionPush[] = [
  // DÍA 1: EL DESPERTAR (Curiosidad + Autoridad)
  {
    id: 'day1',
    type: 'authority',
    segment: 'new_patient',
    day: 1,
    title: '🔮 Dr. Maya Ha Digitalizado Su Historial',
    body: 'Hola [NOMBRE], el Dr. Maya ha digitalizado su historial biológico. Su perfil ha sido seleccionado para el nuevo escaneo de Resonancia Cuántica. ¿Sabe cuál es su edad celular real hoy?',
    deepLink: '/patient-app',
    neuroPrinciple: 'Curiosidad + Selección exclusiva = Apertura mental',
    scientificSource: 'Quantum Analyzer Protocols',
  },
  
  // DÍA 2: LA REVELACIÓN (Ciencia Epigenética)
  {
    id: 'day2',
    type: 'authority',
    segment: 'new_patient',
    day: 2,
    title: '🧬 El 80% de Su Envejecimiento es Reversible',
    body: '¿Sabía que el 80% de su envejecimiento no es genética, sino estilo de vida? El Dr. Maya ha implementado protocolos para silenciar los genes de la inflamación. Vea cómo podemos optimizar su ADN.',
    deepLink: '/patient-app/education/epigenetics',
    neuroPrinciple: 'Estadística sorprendente + Solución tangible = Engagement',
    scientificSource: 'Byung Pal Yu - Nutrition Exercise and Epigenetics',
  },
  
  // DÍA 3: EL ESPEJO DEL FUTURO (Simetría)
  {
    id: 'day3',
    type: 'authority',
    segment: 'new_patient',
    day: 3,
    title: '💎 Su Proporción Áurea Personalizada',
    body: 'La verdadera belleza es simetría y salud ósea. Hemos preparado una simulación de su "Potencial de Proporción Áurea". Entre a la App y descubra su versión arquitectónica perfecta.',
    deepLink: '/patient-app/maya-vision/simulation',
    neuroPrinciple: 'Visualización del yo ideal + Arquitectura ósea = Deseo',
    scientificSource: 'Bruce Connell + Onelio Garcia Jr - Facial Harmony',
  },
  
  // DÍA 4: PRUEBA SOCIAL Y SEGURIDAD (ERAS)
  {
    id: 'day4',
    type: 'authority',
    segment: 'new_patient',
    day: 4,
    title: '✨ Caso de Éxito: -5 Años en Edad Biológica',
    body: 'Nuestra paciente María G. redujo su edad biológica en 5 años ANTES de su cirugía de plano profundo. Vea el protocolo de seguridad UW que garantizó su éxito.',
    deepLink: '/patient-app/testimonials',
    neuroPrinciple: 'Prueba social + Protocolo de seguridad = Confianza',
    scientificSource: 'ERAS Complete Protocols + Handbook of Perioperative Care',
  },
  
  // DÍA 5: CONEXIÓN LOGÍSTICA (Interdrogas)
  {
    id: 'day5',
    type: 'authority',
    segment: 'new_patient',
    day: 5,
    title: '📦 Su Kit de Preparación Celular Está Listo',
    body: 'Su cuerpo necesita preparación. Hemos diseñado su primer Kit de Nutracéuticos Epigenéticos. El pedido está listo para ser enviado a su puerta desde Interdrogas.',
    deepLink: '/patient-app/order',
    neuroPrinciple: 'Preparación ya hecha + Conveniencia = Conversión facilitada',
    scientificSource: 'Manual de Nutrigenómica + Suplementación Celular',
  },
  
  // DÍA 6: ESCASEZ Y URGENCIA (Catherine Maley)
  {
    id: 'day6',
    type: 'scarcity',
    segment: 'new_patient',
    day: 6,
    title: '🚨 Solo 5 Cupos VIP Este Mes',
    body: 'Atención: El Dr. Maya solo abrirá 5 cupos de valoración cuántica para este mes en Cali/Quilichao. Asegure su lugar antes de que el sistema cierre las citas de diagnóstico VIP.',
    deepLink: '/patient-app/booking',
    neuroPrinciple: 'Escasez real + Cuenta regresiva = Decisión inmediata',
    scientificSource: 'Neuroscience of Persuasion and Medical Marketing',
  },
  
  // DÍA 7: EL CIERRE (Llamado a la Acción Maestro)
  {
    id: 'day7',
    type: 'authority',
    segment: 'new_patient',
    day: 7,
    title: '👑 Reclame Su Soberanía Biológica',
    body: 'Hoy es el día para reclamar su soberanía biológica. El Dr. Maya le espera para diseñar su plan de inmortalidad. Haga clic para confirmar su cita presencial ahora.',
    deepLink: 'https://wa.me/576024873000?text=Hola%20Dr.%20Maya,%20quiero%20confirmar%20mi%20cita%20presencial%20para%20mi%20plan%20de%20inmortalidad',
    neuroPrinciple: 'Llamado heroico + Lenguaje aspiracional = Compromiso total',
    scientificSource: 'The Psychology of Aesthetic Patient Consultation',
  },
]

/**
 * MOTOR DE SEGMENTACIÓN AUTOMÁTICA
 */
export interface SegmentRule {
  segment: SegmentType
  triggerCondition: string
  checkInterval: 'hourly' | 'daily' | 'weekly'
  pushTemplate: (data: any) => SeductionPush
}

export const SEGMENTATION_RULES: SegmentRule[] = [
  // POST-OP RECUPERACIÓN (Ogawa)
  {
    segment: 'post_op',
    triggerCondition: 'Sensor de actividad o tiempo desde cirugía',
    checkInterval: 'daily',
    pushTemplate: (data: { patientName: string; daysSinceSurgery: number }) => ({
      id: `postop-${Date.now()}`,
      type: 'authority',
      segment: 'post_op',
      day: 0,
      title: '⚕️ Alerta de Protocolo Ogawa',
      body: `${data.patientName}, es momento de aplicar su lámina de silicona para asegurar simetría. Día ${data.daysSinceSurgery} post-op: fase crítica de cicatrización.`,
      deepLink: '/patient-app/recovery',
      neuroPrinciple: 'Timing preciso + Prevención = Adherencia',
      scientificSource: 'Rei Ogawa - The Science of Scar Management',
      triggerCondition: `Día ${data.daysSinceSurgery} post-op`,
    }),
  },
  
  // LONGEVIDAD (Yu)
  {
    segment: 'longevity',
    triggerCondition: '30 días después de última compra',
    checkInterval: 'daily',
    pushTemplate: (data: { patientName: string; lastPurchase: Date; productName: string }) => {
      const daysSince = Math.floor((Date.now() - data.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))
      return {
        id: `longevity-${Date.now()}`,
        type: 'authority',
        segment: 'longevity',
        day: 0,
        title: '🧪 Su Reserva Epigenética Está Baja',
        body: `${data.patientName}, su reserva de ${data.productName} está al 5% (${daysSince} días sin reabastecimiento). Su protocolo de longevidad requiere continuidad. Haga clic para reabastecer en Interdrogas.`,
        deepLink: '/patient-app/order',
        neuroPrinciple: 'Gamificación de reservas + Continuidad = Recurrencia',
        scientificSource: 'Byung Pal Yu - Longevity Interventions',
        triggerCondition: `${daysSince} días sin compra`,
      }
    },
  },
  
  // RETOMA (Luxury DB)
  {
    segment: 'retoma',
    triggerCondition: 'Inactividad mayor a 3 meses',
    checkInterval: 'weekly',
    pushTemplate: (data: { patientName: string; lastInteraction: Date; recommendedProcedure: string }) => {
      const monthsInactive = Math.floor((Date.now() - data.lastInteraction.getTime()) / (1000 * 60 * 60 * 24 * 30))
      return {
        id: `retoma-${Date.now()}`,
        type: 'scarcity',
        segment: 'retoma',
        day: 0,
        title: '🎯 Nueva Simulación Disponible',
        body: `${data.patientName}, el Dr. Maya tiene una nueva simulación de ${data.recommendedProcedure} para su perfil. Han pasado ${monthsInactive} meses. Entre y vea su potencial actualizado.`,
        deepLink: '/patient-app/maya-vision/simulation',
        neuroPrinciple: 'Novedad + Potencial actualizado = Reactivación',
        scientificSource: 'Your Aesthetic Practice - Catherine Maley',
        triggerCondition: `${monthsInactive} meses inactivo`,
      }
    },
  },
]

/**
 * Scheduler: Ejecuta flujo de 7 días
 */
export function scheduleSevenDayFlow(
  patientId: string,
  patientName: string,
  startDate: Date
): Array<{ push: SeductionPush; scheduledFor: Date }> {
  return SEVEN_DAY_SEDUCTION_FLOW.map(pushTemplate => {
    const scheduledDate = new Date(startDate)
    scheduledDate.setDate(scheduledDate.getDate() + (pushTemplate.day - 1))
    scheduledDate.setHours(10, 0, 0, 0) // 10 AM cada día
    
    const personalizedPush = {
      ...pushTemplate,
      body: pushTemplate.body.replace('[NOMBRE]', patientName),
      id: `${patientId}-${pushTemplate.id}`,
    }
    
    return {
      push: personalizedPush,
      scheduledFor: scheduledDate,
    }
  })
}

/**
 * Evalúa reglas de segmentación y genera push si aplica
 */
export function evaluateSegmentRules(
  patientData: {
    id: string
    name: string
    segment: SegmentType
    lastPurchase?: Date
    lastInteraction?: Date
    daysSinceSurgery?: number
    biomarkers?: any
  }
): SeductionPush | null {
  for (const rule of SEGMENTATION_RULES) {
    if (rule.segment !== patientData.segment) continue
    
    // Evaluar condiciones específicas
    if (rule.segment === 'post_op' && patientData.daysSinceSurgery) {
      // Días críticos para silicona: 3, 7, 14, 21, 30
      const criticalDays = [3, 7, 14, 21, 30]
      if (criticalDays.includes(patientData.daysSinceSurgery)) {
        return rule.pushTemplate({
          patientName: patientData.name,
          daysSinceSurgery: patientData.daysSinceSurgery,
        })
      }
    }
    
    if (rule.segment === 'longevity' && patientData.lastPurchase) {
      const daysSince = Math.floor((Date.now() - patientData.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince >= 30) {
        return rule.pushTemplate({
          patientName: patientData.name,
          lastPurchase: patientData.lastPurchase,
          productName: 'antioxidantes epigenéticos',
        })
      }
    }
    
    if (rule.segment === 'retoma' && patientData.lastInteraction) {
      const monthsInactive = Math.floor((Date.now() - patientData.lastInteraction.getTime()) / (1000 * 60 * 60 * 24 * 30))
      if (monthsInactive >= 3) {
        return rule.pushTemplate({
          patientName: patientData.name,
          lastInteraction: patientData.lastInteraction,
          recommendedProcedure: 'V-Line Facial',
        })
      }
    }
  }
  
  return null
}

/**
 * Genera mensaje personalizado con datos reales
 */
export function personalizeMessage(
  template: string,
  data: {
    name: string
    biomarker?: string
    value?: number
    improvement?: number
  }
): string {
  return template
    .replace('[NOMBRE]', data.name)
    .replace('[BIOMARKER]', data.biomarker || 'marcador')
    .replace('[VALUE]', data.value?.toString() || '0')
    .replace('[IMPROVEMENT]', data.improvement?.toString() || '0')
}
