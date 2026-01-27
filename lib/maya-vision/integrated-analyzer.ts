/**
 * Analizador Integrado Maya-Vision
 * Combina Connell (laxitud) + Obagi (piel) sin usar Canfield
 */

import { analyzeConnellLaxity, generateConnellRecommendations, ConnellAnalysis } from './connell-analyzer'
import { analyzeObagiSkin, generateObagiOrder, ObagiSkinAnalysis } from './obagi-skin-analyzer'

export interface IntegratedAnalysis {
  connellAnalysis: ConnellAnalysis
  obagiAnalysis: ObagiSkinAnalysis
  combinedScore: number
  surgeryRecommendation: {
    recommended: boolean
    technique?: string
    complexity?: string
    blockReasons: string[]
  }
  preparationRequired: {
    required: boolean
    protocol?: string
    timeline: number // semanas
  }
  obagiProducts: Array<{
    product: string
    quantity: number
    price: number
  }>
  totalRecommendations: string[]
}

/**
 * Análisis integrado completo sin usar Canfield
 * Sistema propietario Maya-Vision
 */
export function performIntegratedAnalysis(
  imageData: any,
  patientAge: number
): IntegratedAnalysis {
  // Análisis Connell - Laxitud Facial
  const connellAnalysis = analyzeConnellLaxity(imageData)
  
  // Análisis Obagi - Salud Dérmica
  const obagiAnalysis = analyzeObagiSkin(imageData, patientAge)
  
  // Score combinado (promedio ponderado)
  const connellWeight = 0.6 // Laxitud es más importante para cirugía
  const obagiWeight = 0.4   // Piel es crucial para preparación
  const combinedScore = 
    (connellAnalysis.laxityScore * connellWeight) +
    (obagiAnalysis.skinHealthScore * obagiWeight)
  
  // Determinar si se recomienda cirugía
  const surgeryRecommendation = evaluateSurgeryRecommendation(
    connellAnalysis,
    obagiAnalysis
  )
  
  // Determinar preparación requerida
  const preparationRequired = evaluatePreparation(
    obagiAnalysis,
    surgeryRecommendation.recommended
  )
  
  // Generar orden de productos Obagi
  const obagiProducts = generateObagiOrder(obagiAnalysis)
  
  // Combinar recomendaciones
  const totalRecommendations = combineRecommendations(
    connellAnalysis,
    obagiAnalysis,
    surgeryRecommendation,
    preparationRequired
  )
  
  return {
    connellAnalysis,
    obagiAnalysis,
    combinedScore,
    surgeryRecommendation,
    preparationRequired,
    obagiProducts,
    totalRecommendations,
  }
}

function evaluateSurgeryRecommendation(
  connell: ConnellAnalysis,
  obagi: ObagiSkinAnalysis
): {
  recommended: boolean
  technique?: string
  complexity?: string
  blockReasons: string[]
} {
  const blockReasons: string[] = []
  
  // Evaluar bloqueos basados en Obagi
  if (obagi.skinHealthScore < 40) {
    blockReasons.push(
      `Salud dérmica muy comprometida (${obagi.skinHealthScore.toFixed(1)}/100) - Requiere protocolo Obagi intensivo`
    )
  }
  
  if (obagi.parameters.barrier.status === 'poor') {
    blockReasons.push(
      'Barrera cutánea severamente comprometida - Alto riesgo de complicaciones'
    )
  }
  
  if (obagi.parameters.collagen.status === 'poor') {
    blockReasons.push(
      'Síntesis de colágeno muy baja - Requiere pre-optimización epigenética'
    )
  }
  
  // Si hay bloqueos y la cirugía es compleja, no recomendar aún
  if (blockReasons.length > 0 && connell.surgeryComplexity === 'complex') {
    return {
      recommended: false,
      blockReasons,
    }
  }
  
  // Si laxitud es mínima, no se requiere cirugía
  if (connell.laxityLevel === 'minimal') {
    return {
      recommended: false,
      blockReasons: ['Laxitud mínima - Procedimientos no quirúrgicos son suficientes'],
    }
  }
  
  // Recomendar cirugía con preparación
  return {
    recommended: true,
    technique: connell.recommendedTechnique,
    complexity: connell.surgeryComplexity,
    blockReasons: blockReasons.length > 0 
      ? [`ATENCIÓN: ${blockReasons.join('; ')} - Iniciar preparación inmediatamente`]
      : [],
  }
}

function evaluatePreparation(
  obagi: ObagiSkinAnalysis,
  surgeryRecommended: boolean
): {
  required: boolean
  protocol?: string
  timeline: number
} {
  if (!surgeryRecommended) {
    // Protocolo de mantenimiento
    return {
      required: true,
      protocol: obagi.preparationProtocol,
      timeline: obagi.timelineWeeks,
    }
  }
  
  // Para cirugía, siempre requiere preparación
  return {
    required: true,
    protocol: obagi.preparationProtocol,
    timeline: obagi.timelineWeeks,
  }
}

function combineRecommendations(
  connell: ConnellAnalysis,
  obagi: ObagiSkinAnalysis,
  surgery: any,
  prep: any
): string[] {
  const recommendations: string[] = []
  
  // Recomendaciones de Connell
  const connellRecs = generateConnellRecommendations(connell)
  recommendations.push(...connellRecs)
  
  // Recomendaciones de Obagi
  recommendations.push(
    `Protocolo de preparación dérmica: ${obagi.preparationProtocol} (${obagi.timelineWeeks} semanas)`
  )
  
  obagi.requiredProducts.forEach(product => {
    recommendations.push(`Producto Obagi requerido: ${product}`)
  })
  
  // Recomendaciones de cirugía
  if (surgery.recommended) {
    recommendations.push(
      `✓ CIRUGÍA RECOMENDADA: ${surgery.technique} (Complejidad: ${surgery.complexity})`
    )
  } else {
    recommendations.push(
      `✗ CIRUGÍA NO RECOMENDADA EN ESTE MOMENTO`
    )
    surgery.blockReasons.forEach((reason: string) => {
      recommendations.push(`   Motivo: ${reason}`)
    })
  }
  
  // Recomendación de timeline
  recommendations.push(
    `⏱️ Timeline total de preparación: ${prep.timeline} semanas antes de cualquier procedimiento`
  )
  
  return recommendations
}

/**
 * Análisis comparativo (para seguimiento)
 */
export function compareAnalyses(
  previous: IntegratedAnalysis,
  current: IntegratedAnalysis
): {
  improvement: number
  connellChange: number
  obagiChange: number
  readyForSurgery: boolean
  message: string
} {
  const improvement = current.combinedScore - previous.combinedScore
  const connellChange = current.connellAnalysis.laxityScore - previous.connellAnalysis.laxityScore
  const obagiChange = current.obagiAnalysis.skinHealthScore - previous.obagiAnalysis.skinHealthScore
  
  const readyForSurgery = 
    current.surgeryRecommendation.recommended &&
    current.surgeryRecommendation.blockReasons.length === 0
  
  let message = ''
  if (improvement > 10) {
    message = `¡Excelente progreso! Mejora de ${improvement.toFixed(1)} puntos. `
  } else if (improvement > 0) {
    message = `Progreso moderado: ${improvement.toFixed(1)} puntos. `
  } else {
    message = `Sin mejora significativa. Revisar adherencia al protocolo. `
  }
  
  if (readyForSurgery) {
    message += 'Paciente listo para procedimiento quirúrgico.'
  } else {
    message += 'Continuar con protocolo de preparación.'
  }
  
  return {
    improvement,
    connellChange,
    obagiChange,
    readyForSurgery,
    message,
  }
}
