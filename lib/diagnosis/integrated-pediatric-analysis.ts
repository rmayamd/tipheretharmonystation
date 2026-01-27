/**
 * ANÁLISIS INTEGRAL PEDIÁTRICO - TIPHERETH STATION
 * Sistema multinivel para evitar sesgos por edad
 */

import { FacialAnalysisResult } from '../maya-vision/real-camera-analyzer'
import { InBodyRealData } from '../hardware/real-inbody-connector'
import { QuantumRealData } from '../hardware/real-quantum-connector'

export interface IntegratedPediatricAnalysis {
  patient_age: number
  
  // Nivel 1: Superficie (Maya-Vision)
  surface_analysis: {
    skin_condition: 'normal' | 'compromised' | 'pathological'
    premature_aging_signs: string[]
    photo_quality_warning: string | null
  }
  
  // Nivel 2: Tejido Graso/Muscular (InBody)
  body_composition: {
    nutritional_status: 'normal' | 'underweight' | 'overweight' | 'obese'
    muscle_development: 'normal' | 'underdeveloped' | 'overdeveloped'
    body_fat_percentile: number
    visceral_fat_concern: boolean
    hydration_status: 'normal' | 'dehydrated' | 'overhydrated'
  }
  
  // Nivel 3: Bioquímico (Quantum Analyzer)
  biochemical_markers: {
    nutritional_deficiencies: string[]
    inflammation_markers: 'normal' | 'elevated' | 'high'
    oxidative_stress: 'normal' | 'elevated'
    collagen_synthesis: 'normal' | 'low' | 'very_low'
  }
  
  // Alertas Clínicas
  clinical_alerts: {
    severity: 'none' | 'monitoring' | 'urgent'
    flags: string[]
    requires_specialist: boolean
    specialist_type: string[]
  }
  
  // Recomendaciones Contextualizadas
  recommendations: {
    immediate_actions: string[]
    nutritional_interventions: string[]
    medical_followup: string[]
    contraindications: string[]
  }
}

/**
 * Analiza un paciente pediátrico de forma integral
 */
export async function analyzepediatricPatient(
  age: number,
  mayaVision: FacialAnalysisResult | null,
  inBody: InBodyRealData | null,
  quantum: QuantumRealData | null
): Promise<IntegratedPediatricAnalysis> {
  
  const surfaceAnalysis = analyzeSurface(age, mayaVision)
  const bodyComposition = analyzeBodyComposition(age, inBody)
  const biochemical = analyzeBiochemical(age, quantum) // <--- Aquí va la corrección
  const alerts = generateClinicalAlerts(surfaceAnalysis, bodyComposition, biochemical, age)
  const recommendations = generateContextualRecommendations(
    age,
    surfaceAnalysis,
    bodyComposition,
    biochemical,
    alerts
  )
  
  return {
    patient_age: age,
    surface_analysis: surfaceAnalysis,
    body_composition: bodyComposition,
    biochemical_markers: biochemical,
    clinical_alerts: alerts,
    recommendations
  }
}

/**
 * NIVEL 1: Análisis de Superficie
 */
function analyzeSurface(age: number, mayaVision: FacialAnalysisResult | null) {
  if (!mayaVision) {
    return {
      skin_condition: 'normal' as const,
      premature_aging_signs: [],
      photo_quality_warning: 'No hay análisis fotográfico disponible'
    }
  }
  
  const prematureSigns: string[] = []
  let condition: 'normal' | 'compromised' | 'pathological' = 'normal'
  
  if (age < 18) {
    if (mayaVision.obagi_analysis.skin_quality_score < 70) {
      prematureSigns.push('Calidad de piel baja para la edad')
      condition = 'compromised'
    }
    if (mayaVision.obagi_analysis.elasticity < 70) {
      prematureSigns.push('⚠️ ALERTA: Elasticidad cutánea reducida')
      condition = 'pathological'
    }
  }
  
  return {
    skin_condition: condition,
    premature_aging_signs: prematureSigns,
    photo_quality_warning: null
  }
}

/**
 * NIVEL 2: Análisis de Composición Corporal
 */
function analyzeBodyComposition(age: number, inBody: InBodyRealData | null) {
  if (!inBody) {
    return {
      nutritional_status: 'normal' as const,
      muscle_development: 'normal' as const,
      body_fat_percentile: 50,
      visceral_fat_concern: false,
      hydration_status: 'normal' as const
    }
  }
  
  let nutritionalStatus: 'normal' | 'underweight' | 'overweight' | 'obese' = 'normal'
  const bodyFatPercentile = calculatePediatricPercentile(age, inBody.body_fat_percentage)
  
  if (bodyFatPercentile < 10) nutritionalStatus = 'underweight'
  else if (bodyFatPercentile > 85) nutritionalStatus = 'overweight'
  
  return {
    nutritional_status: nutritionalStatus,
    muscle_development: 'normal' as const,
    body_fat_percentile: bodyFatPercentile,
    visceral_fat_concern: inBody.visceral_fat_level > 5,
    hydration_status: 'normal' as const
  }
}

/**
 * NIVEL 3: Análisis Bioquímico (Quantum) - CON CORRECCIÓN DE TIPOS
 */
function analyzeBiochemical(age: number, quantum: QuantumRealData | null) {
  if (!quantum) {
    return {
      nutritional_deficiencies: [] as string[],
      inflammation_markers: 'normal' as const,
      oxidative_stress: 'normal' as const,
      collagen_synthesis: 'normal' as const
    }
  }
  
  const deficiencies: string[] = []
  if (quantum.vitamins.vitamin_d < 50) deficiencies.push('Vitamina D')
  if (quantum.minerals.iron < 60) deficiencies.push('Hierro')

  // BLINDAJE DE TIPOS PARA NETLIFY
  const inflammation = (quantum.nfkb_inflammation > 70 ? 'high' : quantum.nfkb_inflammation > 50 ? 'elevated' : 'normal') as 'normal' | 'elevated' | 'high'
  const oxidative = (quantum.oxidative_stress > 60 ? 'elevated' : 'normal') as 'normal' | 'elevated'
  const collagen = (quantum.collagen_synthesis < 40 ? 'very_low' : quantum.collagen_synthesis < 60 ? 'low' : 'normal') as 'normal' | 'low' | 'very_low'
  
  return {
    nutritional_deficiencies: deficiencies,
    inflammation_markers: inflammation,
    oxidative_stress: oxidative,
    collagen_synthesis: collagen
  }
}

/**
 * ALERTAS Y RECOMENDACIONES
 */
function generateClinicalAlerts(surface: any, body: any, biochem: any, age: number) {
  const flags: string[] = []
  let severity: 'none' | 'monitoring' | 'urgent' = 'none'
  const specialists: string[] = []
  
  if (biochem.inflammation_markers === 'high') {
    flags.push('🚨 INFLAMACIÓN SISTÉMICA ELEVADA')
    severity = 'urgent'
    specialists.push('Pediatría General')
  }
  
  return {
    severity,
    flags,
    requires_specialist: specialists.length > 0,
    specialist_type: specialists
  }
}

function generateContextualRecommendations(age: number, surface: any, body: any, biochem: any, alerts: any) {
  const contraindications = age < 18 ? ['🚫 NO procedimientos quirúrgicos estéticos'] : []
  return {
    immediate_actions: alerts.severity === 'urgent' ? ['🚨 CONSULTA MÉDICA URGENTE'] : [],
    nutritional_interventions: biochem.nutritional_deficiencies.length > 0 ? ['📊 Suplementación dirigida'] : [],
    medical_followup: [],
    contraindications
  }
}

function calculatePediatricPercentile(age: number, value: number): number {
  return 50 // Simplificado
}

function getPediatricMuscleReference(age: number): number {
  return 15 + (age * 1.5)
}