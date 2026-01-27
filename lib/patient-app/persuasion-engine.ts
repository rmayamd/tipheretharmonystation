/**
 * Motor de Persuasión para App del Paciente
 * Basado en Neuroventas (Catherine Maley + Nestor Braidot)
 */

export interface PersuasionTrigger {
  type: 'revelation' | 'solution' | 'facilitation'
  title: string
  message: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  action: {
    label: string
    link: string
    whatsappMessage?: string
  }
  neurologicalPrinciple: string
}

/**
 * PASO 1: LA REVELACIÓN
 * Activa el dolor (problema identificado)
 */
export function generateRevelationTrigger(
  patientName: string,
  findings: {
    oxidativeStress?: number
    inflammation?: number
    collagen?: number
    muscularMass?: number
  }
): PersuasionTrigger {
  let message = `${patientName}, `
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  
  if (findings.inflammation && findings.inflammation > 70) {
    message += `hemos detectado un nivel de inflamación molecular (NFκB) de ${findings.inflammation.toFixed(1)}% en tu último escaneo cuántico. 

🚨 ESTO SIGNIFICA: Tu cuerpo está en un estado pro-inflamatorio que acelera el envejecimiento celular y aumenta el riesgo de complicaciones post-quirúrgicas.

📊 CONSECUENCIAS SI NO ACTÚAS:
• Envejecimiento acelerado (3-5 años por año)
• Cicatrización comprometida
• Mayor riesgo de queloides
• Recuperación prolongada`
    urgency = 'critical'
  } else if (findings.collagen && findings.collagen < 40) {
    message += `tu análisis cuántico revela síntesis de colágeno en ${findings.collagen.toFixed(1)}% - por debajo del umbral quirúrgico seguro.

⚠️ ESTO SIGNIFICA: Tu capacidad de cicatrización está comprometida. Cualquier procedimiento quirúrgico tendría alto riesgo de complicaciones.

📊 NECESITAS:
• Protocolo de optimización epigenética urgente
• Preparación de 12 semanas mínimo
• Suplementación médica específica`
    urgency = 'high'
  } else if (findings.muscularMass && findings.muscularMass < 25) {
    message += `tu masa muscular está en ${findings.muscularMass.toFixed(1)} kg - por debajo del rango óptimo para procedimientos mayores.

⚠️ ESTO SIGNIFICA: Tu reserva proteica es insuficiente para una recuperación segura. El riesgo ERAS (complicaciones) está elevado.

📊 PROTOCOLO INMEDIATO:
• Aminoácidos de cadena ramificada (BCAA)
• Leucina + Proteína optimizada
• 8-12 semanas de preparación`
    urgency = 'high'
  } else {
    message += `tu último escaneo muestra marcadores de estrés oxidativo elevados. Tu edad biológica está avanzando más rápido que tu edad cronológica.

📊 OPORTUNIDAD: Estás en la ventana perfecta para intervención preventiva. Cada mes que pasa sin optimización es una oportunidad perdida.`
    urgency = 'medium'
  }
  
  return {
    type: 'revelation',
    title: '🔍 Dr. Maya Detectó Algo Importante',
    message,
    urgency,
    action: {
      label: 'Ver Mi Plan de Rescate Nutricional',
      link: '/patient-app/rescue-plan',
      whatsappMessage: `Hola Dr. Maya, vi mi revelación sobre ${findings.inflammation ? 'inflamación' : 'mis marcadores'}. Necesito mi plan personalizado.`,
    },
    neurologicalPrinciple: 'Activación del miedo + Especificidad numérica = Acción inmediata',
  }
}

/**
 * PASO 2: LA SOLUCIÓN EXCLUSIVA
 * Presenta la solución como única y específica para el paciente
 */
export function generateSolutionTrigger(
  patientName: string,
  analysis: {
    laxityLevel?: string
    symmetryScore?: number
    recommendedTechnique?: string
  }
): PersuasionTrigger {
  let message = `${patientName}, después de analizar tu estructura ósea única, tu patrón de laxitud facial y tu perfil genético, hemos determinado que:`
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  
  if (analysis.laxityLevel === 'severe' || analysis.laxityLevel === 'profound') {
    message += `

🎯 TU TÉCNICA EXCLUSIVA: ${analysis.recommendedTechnique || 'Deep Plane Facelift según protocolo Connell'}

¿POR QUÉ SOLO ESTA TÉCNICA FUNCIONA PARA TI?

1️⃣ TU ARQUITECTURA ÓSEA: Tu estructura facial requiere reposicionamiento de planos profundos (SMAS). Técnicas superficiales NO darían resultados permanentes.

2️⃣ TU PATRÓN DE ENVEJECIMIENTO: Tu laxitud es profunda, no superficial. Connell demostró que en estos casos, solo el Deep Plane respeta la biología facial.

3️⃣ TU SIMETRÍA POTENCIAL: Nuestro análisis Maya-Vision proyecta que puedes alcanzar ${analysis.symmetryScore ? analysis.symmetryScore + 20 : 92}% de proporción áurea.

⚠️ TÉCNICAS QUE NO FUNCIONARÍAN EN TU CASO:
❌ Mini-lifting (resultados temporales 2-3 años)
❌ Hilos tensores (incompatibles con tu grado de laxitud)
❌ SMAS superficial (no alcanzaría tus planos profundos)

✅ SOLO DEEP PLANE CONNELL te dará 10-15 años de rejuvenecimiento real.`
    urgency = 'high'
  } else {
    message += `

🎯 TU PROTOCOLO PERSONALIZADO: Optimización No-Quirúrgica + Preparación Epigenética

Tu perfil indica que puedes lograr resultados extraordinarios sin cirugía mayor:

1️⃣ Protocolo Obagi Completo (12 semanas)
2️⃣ Nutracéuticos de longevidad (Byung Pal Yu)
3️⃣ Procedimientos mínimamente invasivos específicos

PROYECCIÓN: ${analysis.symmetryScore ? 100 - analysis.symmetryScore : 25}% de mejora en simetría facial con protocolo no-quirúrgico.`
    urgency = 'medium'
  }
  
  return {
    type: 'solution',
    title: '💎 Tu Solución Personalizada Está Lista',
    message,
    urgency,
    action: {
      label: 'Ver Video del Dr. Maya',
      link: '/patient-app/solution-video',
      whatsappMessage: 'Hola Dr. Maya, vi mi técnica personalizada. Quiero agendar consulta para discutir el protocolo completo.',
    },
    neurologicalPrinciple: 'Exclusividad + Especificidad anatómica = Autoridad percibida',
  }
}

/**
 * PASO 3: LA FACILITACIÓN
 * Elimina fricción y hace la acción inmediata
 */
export function generateFacilitationTrigger(
  patientName: string,
  order: {
    items: Array<{ name: string; price: number }>
    total: number
  }
): PersuasionTrigger {
  const message = `${patientName}, tu kit de preparación celular ya está empacado y listo en Interdrogas.

📦 TU KIT PERSONALIZADO INCLUYE:

${order.items.map(item => `✓ ${item.name} - $${item.price.toLocaleString()} COP`).join('\n')}

💰 TOTAL: $${order.total.toLocaleString()} COP

🚚 ENVÍO INMEDIATO:
• Haz clic y recíbelo mañana
• Pago contra-entrega disponible
• Incluye guía de uso personalizada del Dr. Maya

⏰ IMPORTANTE: Estos insumos están preparados específicamente para TU protocolo. Si no inicias en las próximas 48 horas, perderás la ventana óptima de preparación y tendremos que recalcular tu fecha quirúrgica.`
  
  return {
    type: 'facilitation',
    title: '📦 Tu Kit Ya Está Listo',
    message,
    urgency: 'high',
    action: {
      label: 'Recibir Mañana',
      link: `https://wa.me/576024873000?text=Hola,%20soy%20${encodeURIComponent(patientName)}.%20Quiero%20mi%20kit%20personalizado%20que%20est%C3%A1%20listo.`,
      whatsappMessage: `Hola, soy ${patientName}. Quiero recibir mi kit de preparación celular que está listo.`,
    },
    neurologicalPrinciple: 'Facilidad + Urgencia temporal + Pérdida potencial = Acción inmediata',
  }
}

/**
 * Selector automático de trigger según estado del paciente
 */
export function selectOptimalTrigger(
  patientData: {
    name: string
    stage: 'awareness' | 'consideration' | 'decision' | 'ready'
    lastInteraction: Date
    quantumData?: any
    mayaVisionData?: any
    hasOrder?: boolean
  }
): PersuasionTrigger {
  const daysSinceInteraction = Math.floor(
    (Date.now() - patientData.lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Si hace más de 7 días sin interacción → Revelación (reactivar dolor)
  if (daysSinceInteraction > 7) {
    return generateRevelationTrigger(patientData.name, {
      inflammation: patientData.quantumData?.nfkbInflammation || 75,
      collagen: patientData.quantumData?.collagenSynthesis || 35,
    })
  }
  
  // Si está en consideración → Solución
  if (patientData.stage === 'consideration') {
    return generateSolutionTrigger(patientData.name, {
      laxityLevel: patientData.mayaVisionData?.laxityLevel || 'moderate',
      symmetryScore: patientData.mayaVisionData?.symmetryScore || 72,
      recommendedTechnique: patientData.mayaVisionData?.recommendedTechnique,
    })
  }
  
  // Si está listo para decisión → Facilitación
  if (patientData.stage === 'decision' || patientData.stage === 'ready') {
    return generateFacilitationTrigger(patientData.name, {
      items: [
        { name: 'BCAA + Leucina', price: 200000 },
        { name: 'Protocolo Obagi Completo', price: 1500000 },
        { name: 'Omega-3 + Curcumina', price: 180000 },
      ],
      total: 1880000,
    })
  }
  
  // Default → Revelación
  return generateRevelationTrigger(patientData.name, {
    inflammation: 60,
  })
}

/**
 * Genera notificación push
 */
export function generatePushNotification(trigger: PersuasionTrigger): {
  title: string
  body: string
  icon: string
  urgencyColor: string
} {
  const urgencyColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626',
  }
  
  return {
    title: trigger.title,
    body: trigger.message.split('\n')[0].slice(0, 100) + '...',
    icon: trigger.type === 'revelation' ? '🔍' : trigger.type === 'solution' ? '💎' : '📦',
    urgencyColor: urgencyColors[trigger.urgency],
  }
}
