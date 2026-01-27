/**
 * MOTOR DE PREDICCIÓN MECANOBIOLÓGICA
 * Basado en ratios científicos: Le Fort I, Sagital, Movimiento de Tejidos
 * Ajustado por colágeno (Quantum) y grasa (InBody)
 */

import { InBodyRealData } from '../hardware/real-inbody-connector'
import { QuantumRealData } from '../hardware/real-quantum-connector'
import { FacialAnalysisResult } from '../maya-vision/real-camera-analyzer'

export interface MechanobiologicalPrediction {
  // Ratios Científicos (Le Fort I / Sagital)
  bone_movement_ratios: {
    maxillary_advancement: number // mm
    mandibular_setback: number // mm
    chin_projection: number // mm
    expected_soft_tissue_ratio: number // Soft tissue / Hard tissue (típico: 0.7-0.9)
  }
  
  // Predicción de Movimiento de Tejidos
  soft_tissue_response: {
    upper_lip: number // mm de movimiento
    lower_lip: number // mm
    nasal_base: number // mm
    nasolabial_angle: number // grados cambio
    menton_projection: number // mm
  }
  
  // Ajustes por Biomarcadores
  collagen_factor: number // 0-1 (ajusta elasticidad)
  fat_distribution_factor: number // 0-1 (ajusta volumen)
  healing_quality_prediction: 'excellent' | 'good' | 'fair' | 'poor'
  
  // Recomendaciones Mecanobiológicas
  recommendations: {
    pre_surgical_protocol: string[]
    surgical_approach: string
    post_op_care: string[]
    expected_timeline: string
  }
  
  // Simulación Visual
  before_after_projection: {
    profile_change: string // Descripción del cambio
    frontal_change: string
    estimated_satisfaction: number // 0-100
  }
}

/**
 * Predice movimiento de tejidos según cirugía ósea planificada
 */
export function predictTissueMovement(
  plannedMovement: { maxilla: number, mandible: number, chin: number },
  mayaVision: FacialAnalysisResult,
  inBody: InBodyRealData,
  quantum: QuantumRealData
): MechanobiologicalPrediction {
  
  console.log('🔬 Motor de Predicción Mecanobiológica')
  console.log('   Ratios: Le Fort I + Sagital')
  console.log('   Ajustado por: Colágeno + Grasa')
  console.log('')
  
  // PASO 1: Calcular ratios de tejido blando/duro
  const collagenFactor = quantum.collagen_synthesis / 100
  const skinElasticityFactor = mayaVision.obagi_analysis.elasticity / 100
  
  // Factor combinado de calidad tisular
  const tissueQualityFactor = (collagenFactor * 0.6 + skinElasticityFactor * 0.4)
  
  // Ratio soft/hard tissue (literatura: 0.7-0.9)
  // Ajustado por calidad de colágeno
  const softHardRatio = 0.7 + (tissueQualityFactor * 0.2) // 0.7-0.9
  
  console.log(`   Ratio tejido blando/duro: ${softHardRatio.toFixed(2)}`)
  console.log(`   Calidad tisular: ${(tissueQualityFactor * 100).toFixed(0)}%`)
  
  // PASO 2: Predecir movimiento de tejidos blandos
  const softTissue = {
    upper_lip: plannedMovement.maxilla * softHardRatio,
    lower_lip: plannedMovement.mandible * softHardRatio * 0.8, // Factor labio inferior
    nasal_base: plannedMovement.maxilla * 0.5, // Nariz se mueve 50% del maxilar
    nasolabial_angle: plannedMovement.maxilla * 2, // Grados de cambio
    menton_projection: plannedMovement.chin * 0.9
  }
  
  // PASO 3: Ajuste por distribución de grasa
  const fatFactor = calculateFatDistributionFactor(inBody)
  
  // Si hay exceso de grasa facial, el movimiento aparente es menor
  softTissue.upper_lip *= (1 - fatFactor * 0.2)
  softTissue.lower_lip *= (1 - fatFactor * 0.2)
  
  // PASO 4: Predicción de calidad de cicatrización
  const healingQuality = predictHealingQuality(collagenFactor, quantum, inBody)
  
  // PASO 5: Generar recomendaciones
  const recommendations = generateMechanobiologicalRecommendations(
    tissueQualityFactor,
    healingQuality,
    plannedMovement,
    quantum
  )
  
  // PASO 6: Estimación de satisfacción
  const satisfactionScore = estimatePatientSatisfaction(
    plannedMovement,
    mayaVision,
    softTissue,
    healingQuality
  )
  
  return {
    bone_movement_ratios: {
      maxillary_advancement: plannedMovement.maxilla,
      mandibular_setback: plannedMovement.mandible,
      chin_projection: plannedMovement.chin,
      expected_soft_tissue_ratio: softHardRatio
    },
    soft_tissue_response: softTissue,
    collagen_factor: collagenFactor,
    fat_distribution_factor: fatFactor,
    healing_quality_prediction: healingQuality,
    recommendations: recommendations,
    before_after_projection: {
      profile_change: generateProfileDescription(plannedMovement, softTissue),
      frontal_change: generateFrontalDescription(plannedMovement, softTissue),
      estimated_satisfaction: satisfactionScore
    }
  }
}

/**
 * Calcula factor de distribución de grasa facial
 */
function calculateFatDistributionFactor(inBody: InBodyRealData): number {
  // Estimación de grasa facial basada en grasa total
  const bodyFatPercent = inBody.body_fat_percentage
  
  // Normalizar: 15% = 0, 35% = 1
  const fatFactor = Math.max(0, Math.min(1, (bodyFatPercent - 15) / 20))
  
  return fatFactor
}

/**
 * Predice calidad de cicatrización
 */
function predictHealingQuality(
  collagenFactor: number,
  quantum: QuantumRealData,
  inBody: InBodyRealData
): 'excellent' | 'good' | 'fair' | 'poor' {
  
  let score = 0
  
  // Factor 1: Síntesis de colágeno (40%)
  score += collagenFactor * 40
  
  // Factor 2: Inflamación sistémica (30%)
  const inflammationPenalty = (quantum.nfkb_inflammation / 100) * 30
  score += (30 - inflammationPenalty)
  
  // Factor 3: Phase angle (integridad celular) (30%)
  const phaseAngleScore = (inBody.phase_angle / 8) * 30 // 8 es excelente
  score += phaseAngleScore
  
  if (score >= 80) return 'excellent'
  if (score >= 65) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

/**
 * Genera recomendaciones mecanobiológicas
 */
function generateMechanobiologicalRecommendations(
  tissueQuality: number,
  healingQuality: string,
  movement: any,
  quantum: QuantumRealData
) {
  const preSurgical: string[] = []
  const postOp: string[] = []
  
  // Pre-quirúrgico según calidad tisular
  if (tissueQuality < 0.7) {
    preSurgical.push('🔹 Protocolo de síntesis de colágeno 12 semanas (Obagi + Yu)')
    preSurgical.push('🔹 Péptidos de colágeno 10g/día')
    preSurgical.push('🔹 Vitamina C 2000mg/día (cofactor colágeno)')
  }
  
  if (quantum.nfkb_inflammation > 60) {
    preSurgical.push('🔹 Protocolo anti-inflamatorio 8 semanas')
    preSurgical.push('🔹 Curcumina 1500mg/día')
    preSurgical.push('🔹 Omega-3 3g/día')
  }
  
  // Post-operatorio
  postOp.push('🔹 Protocolo ERAS (UW Enhanced Recovery)')
  postOp.push('🔹 Control de tensión mecánica (Ogawa)')
  postOp.push('🔹 Seguimiento fotográfico semanal (Maya-Vision)')
  
  if (healingQuality === 'poor' || healingQuality === 'fair') {
    postOp.push('⚠️ Alto riesgo cicatrización - Silicona médica desde día 7')
    postOp.push('⚠️ Seguimiento cada 3 días primera semana')
  }
  
  // Enfoque quirúrgico
  let approach = 'Estándar'
  if (movement.maxilla > 5) {
    approach = 'Le Fort I con distracción gradual (menor trauma)'
  }
  
  if (tissueQuality < 0.6) {
    approach += ' + Técnica atraumática estricta'
  }
  
  // Timeline
  const timeline = healingQuality === 'excellent' ? '6-8 semanas' :
                   healingQuality === 'good' ? '8-10 semanas' :
                   healingQuality === 'fair' ? '10-12 semanas' :
                   '12-16 semanas'
  
  return {
    pre_surgical_protocol: preSurgical,
    surgical_approach: approach,
    post_op_care: postOp,
    expected_timeline: timeline
  }
}

/**
 * Estima satisfacción del paciente
 */
function estimatePatientSatisfaction(
  movement: any,
  mayaVision: FacialAnalysisResult,
  softTissue: any,
  healing: string
): number {
  let score = 70 // Base
  
  // Bonus por mejoría en simetría
  if (mayaVision.symmetry_analysis.golden_ratio_score < 75) {
    score += 15 // Más margen de mejora = mayor satisfacción
  }
  
  // Bonus por movimiento significativo
  if (Math.abs(movement.maxilla) > 3 || Math.abs(movement.mandible) > 3) {
    score += 10 // Cambio visible
  }
  
  // Penalización por mala cicatrización
  if (healing === 'poor') score -= 20
  if (healing === 'fair') score -= 10
  
  return Math.max(0, Math.min(100, score))
}

/**
 * Genera descripción del cambio de perfil
 */
function generateProfileDescription(movement: any, softTissue: any): string {
  const changes: string[] = []
  
  if (movement.maxilla > 0) {
    changes.push(`Avance maxilar ${movement.maxilla}mm → Labio superior +${softTissue.upper_lip.toFixed(1)}mm`)
  }
  
  if (movement.mandible !== 0) {
    const direction = movement.mandible > 0 ? 'retroceso' : 'avance'
    changes.push(`${direction} mandibular ${Math.abs(movement.mandible)}mm → Labio inferior ${softTissue.lower_lip.toFixed(1)}mm`)
  }
  
  if (movement.chin !== 0) {
    changes.push(`Mentoplastia ${movement.chin}mm → Proyección +${softTissue.menton_projection.toFixed(1)}mm`)
  }
  
  return changes.join(' | ')
}

/**
 * Genera descripción del cambio frontal
 */
function generateFrontalDescription(movement: any, softTissue: any): string {
  return `Mejora en proyección zigomática, definición mandibular y simetría facial`
}

/**
 * Aplica predicción a foto del paciente (simulación)
 */
export function simulateSurgicalOutcome(
  patientImage: string,
  prediction: MechanobiologicalPrediction
): string {
  // En producción, aquí usarías procesamiento de imagen real
  // Por ahora, retornamos descripción textual
  
  console.log('📐 Simulación Quirúrgica:')
  console.log(`   Ratio tejido blando/duro: ${prediction.bone_movement_ratios.expected_soft_tissue_ratio}`)
  console.log(`   Labio superior: +${prediction.soft_tissue_response.upper_lip.toFixed(1)}mm`)
  console.log(`   Proyección mentón: +${prediction.soft_tissue_response.menton_projection.toFixed(1)}mm`)
  console.log(`   Calidad cicatrización: ${prediction.healing_quality_prediction}`)
  console.log(`   Satisfacción estimada: ${prediction.before_after_projection.estimated_satisfaction}%`)
  
  return 'Simulación generada - En producción usar morphing 3D real'
}
