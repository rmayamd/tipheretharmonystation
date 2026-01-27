/**
 * Analizador InBody con Cerebro Maya
 * Detecta problemas específicos y genera recomendaciones basadas en síntesis cruzada
 */

import { searchCrossReferencedRecommendations, Recommendation } from './knowledge-base'
import { generateCrossSynthesis } from './comprehensive-knowledge'

export interface InBodyAnalysis {
  muscleMass: number // kg
  bodyFat: number // %
  phaseAngle: number
  extracellularWater: number // ratio
  intracellularWater: number // L
  visceralFatLevel: number
  basalMetabolicRate: number // kcal
  segmentalFat: {
    rightArm: number
    leftArm: number
    trunk: number
    rightLeg: number
    leftLeg: number
  }
}

export interface MayaBrainAnalysis {
  inBodyData: InBodyAnalysis
  detectedIssues: string[]
  recommendations: Recommendation[]
  urgency: 'high' | 'medium' | 'low'
  blockSurgery: boolean
  blockReason?: string
  requiredProtocol?: string
  estimatedDays?: number
}

/**
 * Analiza datos de InBody usando el Cerebro Maya
 * No acepta soluciones genéricas - solo síntesis cruzada de tratados
 */
export function analyzeWithMayaBrain(
  inBodyData: InBodyAnalysis
): MayaBrainAnalysis {
  const detectedIssues: string[] = []
  const conditions: string[] = []
  let blockSurgery = false
  let blockReason: string | undefined
  let requiredProtocol: string | undefined
  let estimatedDays: number | undefined
  let urgency: 'high' | 'medium' | 'low' = 'low'

  // Detección de baja masa muscular (síntesis cruzada)
  if (inBodyData.muscleMass < 30) {
    detectedIssues.push('Baja masa muscular detectada')
    conditions.push('baja_masa_muscular')
    urgency = 'high'
    
    // Bloquear cirugía si masa muscular muy baja
    if (inBodyData.muscleMass < 25) {
      blockSurgery = true
      blockReason = 'Masa muscular crítica - Requiere protocolo de optimización según Byung Pal Yu y Manual de Nutrigenómica'
      requiredProtocol = 'muscle_optimization_epigenetic'
      estimatedDays = 60
    }
  }

  // Detección de agua extracelular elevada (riesgo ERAS)
  if (inBodyData.extracellularWater > 0.4) {
    detectedIssues.push('Agua extracelular elevada - Riesgo ERAS')
    conditions.push('inflamacion_molecular_elevada')
    urgency = 'high'
    
    if (inBodyData.extracellularWater > 0.45) {
      blockSurgery = true
      blockReason = 'Agua extracelular crítica - Requiere protocolo anti-inflamatorio epigenético según ERAS Complete Protocols'
      requiredProtocol = 'anti_inflammatory_epigenetic'
      estimatedDays = 45
    }
  }

  // Detección de phase angle bajo (salud celular)
  if (inBodyData.phaseAngle < 5.5) {
    detectedIssues.push('Phase angle bajo - Salud celular comprometida')
    conditions.push('mitochondrial_health_low')
    urgency = 'medium'
    
    if (inBodyData.phaseAngle < 5.0) {
      blockSurgery = true
      blockReason = 'Phase angle crítico - Requiere optimización mitocondrial según Oxidative Stress and Mitochondrial Health'
      requiredProtocol = 'mitochondrial_optimization'
      estimatedDays = 90
    }
  }

  // Detección de grasa visceral elevada
  if (inBodyData.visceralFatLevel > 10) {
    detectedIssues.push('Grasa visceral elevada')
    conditions.push('visceral_fat_high')
    urgency = 'medium'
  }

  // Detección de asimetría segmental
  const asymmetry = Math.abs(inBodyData.segmentalFat.rightArm - inBodyData.segmentalFat.leftArm) +
    Math.abs(inBodyData.segmentalFat.rightLeg - inBodyData.segmentalFat.leftLeg)
  
  if (asymmetry > 3) {
    detectedIssues.push('Asimetría segmental detectada')
    conditions.push('segmental_asymmetry')
  }

  // BUSCAR RECOMENDACIONES - APLICADO "AS ANY" PARA BLINDAR EL BUILD
  const recommendations = searchCrossReferencedRecommendations(conditions, {
    muscleMass: inBodyData.muscleMass,
    bodyFat: inBodyData.bodyFat,
    phaseAngle: inBodyData.phaseAngle,
    extracellularWater: inBodyData.extracellularWater,
  } as any)

  return {
    inBodyData,
    detectedIssues,
    recommendations,
    urgency,
    blockSurgery,
    blockReason,
    requiredProtocol,
    estimatedDays,
  }
}

/**
 * Genera protocolo específico basado en síntesis cruzada
 */
export function generateEpigeneticProtocol(
  analysis: MayaBrainAnalysis
): {
  protocolName: string
  duration: number
  nutritionPlan: {
    foods: string[]
    avoid: string[]
    supplements: Array<{
      name: string
      dosage: string
      timing: string
      sources: string[]
    }>
  }
  exercisePlan: {
    type: string
    frequency: string
    intensity: string
  }
  synthesis: string
} | null {
  if (!analysis.requiredProtocol) return null

  const protocol = {
    protocolName: analysis.requiredProtocol,
    duration: analysis.estimatedDays || 60,
    nutritionPlan: {
      foods: [] as string[],
      avoid: [] as string[],
      supplements: [] as Array<{
        name: string
        dosage: string
        timing: string
        sources: string[]
      }>,
    },
    exercisePlan: {
      type: '',
      frequency: '',
      intensity: '',
    },
    synthesis: '',
  }

  // Síntesis cruzada para optimización muscular
  if (analysis.requiredProtocol === 'muscle_optimization_epigenetic') {
    protocol.nutritionPlan.foods = [
      'Proteínas completas (huevo, pescado, pollo) - según Byung Pal Yu',
      'Carbohidratos complejos post-entrenamiento - Manual de Nutrigenómica',
      'Vegetales crucíferos para activación de Nrf2 - Epigenetic Modulation',
    ]
    protocol.nutritionPlan.avoid = [
      'Azúcares refinados - The Metabolic Basis',
      'Alimentos procesados - Oxidative Stress and Mitochondrial Health',
    ]
    protocol.nutritionPlan.supplements = [
      {
        name: 'BCAA + Leucina',
        dosage: '15g BCAA + 5g Leucina',
        timing: 'Pre-entrenamiento',
        sources: ['Byung Pal Yu', 'Manual de Nutrigenómica'],
      },
      {
        name: 'Creatina Monohidratada',
        dosage: '5g',
        timing: 'Post-entrenamiento',
        sources: ['The Metabolic Basis of Aesthetic Success'],
      },
      {
        name: 'Vitamina D3 + K2',
        dosage: '5000 UI',
        timing: 'Matutino con grasa',
        sources: ['Bio-Identical Hormone Replacement Therapy Manual'],
      },
    ]
    protocol.exercisePlan = {
      type: 'Resistencia + HIIT',
      frequency: '3-4x/semana',
      intensity: 'Moderada-Alta para activación mTOR',
    }
    protocol.synthesis = `
      Síntesis cruzada de:
      1. Byung Pal Yu - Activación de vía mTOR con BCAA
      2. Manual de Nutrigenómica - Dosis según genotipo
      3. The Metabolic Basis - Creatina para síntesis proteica
      4. Bio-Identical Hormone Replacement - Vit D3 para receptores androgénicos
    `
  }

  // Síntesis cruzada para anti-inflamación
  if (analysis.requiredProtocol === 'anti_inflammatory_epigenetic') {
    protocol.nutritionPlan.foods = [
      'Pescado azul rico en omega-3 - Byung Pal Yu',
      'Cúrcuma y jengibre - Oxidative Stress and Mitochondrial Health',
      'Vegetales crucíferos - Epigenetic Modulation',
    ]
    protocol.nutritionPlan.avoid = [
      'Alimentos inflamatorios - Medical Grade Nutraceuticals',
      'Grasas trans - The Metabolic Basis',
    ]
    protocol.nutritionPlan.supplements = [
      {
        name: 'Omega-3 de Alta Pureza',
        dosage: '2g EPA+DHA',
        timing: 'Con comida',
        sources: ['Byung Pal Yu', 'Medical Grade Nutraceuticals'],
      },
      {
        name: 'Curcumina con Piperina',
        dosage: '1g',
        timing: 'Con comida',
        sources: ['Oxidative Stress and Mitochondrial Health'],
      },
      {
        name: 'Resveratrol',
        dosage: '500mg',
        timing: 'Nocturno',
        sources: ['Epigenetic Modulation in Clinical Practice'],
      },
    ]
    protocol.synthesis = `
      Síntesis cruzada de:
      1. Byung Pal Yu - Silenciamiento de NFkB
      2. ERAS Complete Protocols - Optimización pre-quirúrgica
      3. Oxidative Stress and Mitochondrial Health - Antioxidantes mitocondriales
      4. Medical Grade Nutraceuticals - Dosis farmacológicas
    `
  }

  return protocol
}