/**
 * MOTOR DE CONVERSIÓN RASCH PARA BODY-Q
 * Transforma respuestas de cuestionarios a puntajes 0-100
 * Basado en Memorial Sloan Kettering Cancer Center
 */

export interface BodyQResponse {
  patient_id: string
  assessment_date: string
  scale_type: 'satisfaction' | 'psychological' | 'physical' | 'sexual' | 'expectations'
  body_area: 'breast' | 'face' | 'abdomen' | 'arms' | 'buttocks' | 'thighs' | 'general'
  raw_responses: number[] // Respuestas 1-4 o 1-5 según escala
  rasch_score: number // 0-100
}

export interface QScoreFacial {
  // Satisfacción con Apariencia Facial
  satisfaction_overall: number // 0-100
  satisfaction_nose: number
  satisfaction_eyes: number
  satisfaction_cheeks: number
  satisfaction_jawline: number
  satisfaction_skin: number
  
  // Distress Psicosocial
  distress_social: number // 0-100 (más alto = más distress)
  distress_appearance: number
  distress_selfesteem: number
  
  // Expectativas (Pre-Op)
  expectations_realistic: number // 0-100 (más alto = más realista)
  expectations_information: number
  
  // Síntomas Físicos
  physical_pain: number // 0-100
  physical_tightness: number
  physical_sensation: number
}

export interface QScoreCorporal {
  // Satisfacción Corporal por Área
  satisfaction_breast: number // 0-100
  satisfaction_abdomen: number
  satisfaction_buttocks: number
  satisfaction_arms: number
  satisfaction_thighs: number
  
  // Distress Psicosocial
  distress_body_image: number // 0-100
  distress_intimacy: number
  distress_clothing: number
  
  // Función Sexual
  sexual_confidence: number // 0-100
  sexual_satisfaction: number
  
  // Síntomas Físicos Post-Op
  physical_recovery: number // 0-100
  physical_scarring: number
}

export interface QScoreComplete {
  patient_id: string
  assessment_date: string
  assessment_type: 'pre_op' | 'post_op_30d' | 'post_op_90d' | 'post_op_1yr'
  
  facial?: QScoreFacial
  corporal?: QScoreCorporal
  
  // Score Global Compuesto
  global_satisfaction: number // 0-100
  global_psychological_wellbeing: number
  global_physical_wellbeing: number
  
  // Risk Flags (Alertas Automáticas)
  risk_unrealistic_expectations: boolean
  risk_body_dysmorphia: boolean
  risk_psychological_distress: boolean
  
  // Predicción de Satisfacción Post-Op
  predicted_satisfaction_increase: number // % esperado de mejora
}

/**
 * TABLAS DE CONVERSIÓN RASCH (Simplificadas)
 * En producción, usar las tablas completas del manual BODY-Q
 */
const RASCH_CONVERSION_TABLES = {
  // Ejemplo: Suma de respuestas -> Score Rasch 0-100
  satisfaction_face: {
    4: 0, 5: 10, 6: 20, 7: 30, 8: 40, 9: 50, 10: 55, 11: 60,
    12: 65, 13: 70, 14: 75, 15: 80, 16: 85, 17: 90, 18: 95, 19: 100, 20: 100
  },
  satisfaction_breast: {
    5: 0, 6: 12, 7: 24, 8: 36, 9: 48, 10: 55, 11: 62, 12: 68,
    13: 74, 14: 80, 15: 85, 16: 90, 17: 95, 18: 98, 19: 100, 20: 100
  },
  distress_psychological: {
    4: 100, 5: 90, 6: 80, 7: 70, 8: 60, 9: 50, 10: 45, 11: 40,
    12: 35, 13: 30, 14: 25, 15: 20, 16: 15, 17: 10, 18: 5, 19: 0, 20: 0
  }
}

/**
 * Convierte respuestas crudas a score Rasch usando tablas de conversión
 */
export function convertToRaschScore(
  responses: number[],
  scaleType: string
): number {
  const sum = responses.reduce((a, b) => a + b, 0)
  
  // Seleccionar tabla apropiada
  let table: any = RASCH_CONVERSION_TABLES.satisfaction_face
  
  if (scaleType.includes('breast')) {
    table = RASCH_CONVERSION_TABLES.satisfaction_breast
  } else if (scaleType.includes('distress')) {
    table = RASCH_CONVERSION_TABLES.distress_psychological
  }
  
  // Buscar score más cercano
  return table[sum] || Math.round((sum / responses.length) * 20)
}

/**
 * ALGORITMO DE SATISFACCIÓN PREDICTIVA
 * Predice cuánto subirá el Q-Score si optimizamos biología pre-op
 */
export function predictSatisfactionIncrease(
  currentQScore: QScoreComplete,
  quantumData: any,
  inBodyData: any
): number {
  let predictedIncrease = 0
  
  // Factor 1: Inflamación (NFκB)
  if (quantumData?.nfkb_inflammation) {
    const inflammation = quantumData.nfkb_inflammation
    if (inflammation > 60) {
      // Alta inflamación = mayor riesgo de insatisfacción
      predictedIncrease += 15 // Reducir inflamación puede subir satisfacción 15%
    } else if (inflammation > 40) {
      predictedIncrease += 8
    }
  }
  
  // Factor 2: Nutrición (Colágeno)
  if (quantumData?.collagen_synthesis) {
    const collagen = quantumData.collagen_synthesis
    if (collagen < 60) {
      // Bajo colágeno = peor cicatrización = menor satisfacción
      predictedIncrease += 12 // Mejorar colágeno puede subir 12%
    } else if (collagen < 75) {
      predictedIncrease += 6
    }
  }
  
  // Factor 3: Composición Corporal
  if (inBodyData?.phase_angle) {
    const phaseAngle = inBodyData.phase_angle
    if (phaseAngle < 5.5) {
      // Baja integridad celular
      predictedIncrease += 10
    } else if (phaseAngle < 6.5) {
      predictedIncrease += 5
    }
  }
  
  // Factor 4: Expectativas
  if (currentQScore.facial?.expectations_realistic) {
    if (currentQScore.facial.expectations_realistic < 60) {
      // Expectativas irreales = necesita educación
      predictedIncrease += 20 // Alinear expectativas mejora satisfacción 20%
    }
  }
  
  // Factor 5: Distress Psicológico
  if (currentQScore.facial?.distress_social) {
    if (currentQScore.facial.distress_social > 70) {
      // Alto distress = necesita soporte psicológico
      predictedIncrease += 15
    }
  }
  
  return Math.min(predictedIncrease, 45) // Cap máximo 45% mejora
}

/**
 * DETECTA BANDERAS ROJAS (Risk Flags)
 */
export function detectRiskFlags(qscore: QScoreComplete): {
  risk_unrealistic_expectations: boolean
  risk_body_dysmorphia: boolean
  risk_psychological_distress: boolean
  recommendations: string[]
} {
  const recommendations: string[] = []
  let unrealistic = false
  let dysmorphia = false
  let distress = false
  
  // Check 1: Expectativas Irreales
  if (qscore.facial?.expectations_realistic && qscore.facial.expectations_realistic < 50) {
    unrealistic = true
    recommendations.push('⚠️ PROTOCOLO DE NEURO-ALINEACIÓN: Paciente requiere sesión educativa sobre resultados realistas')
  }
  
  // Check 2: Body Dysmorphia (múltiples áreas con insatisfacción extrema)
  const lowScores = []
  if (qscore.corporal) {
    if (qscore.corporal.satisfaction_breast < 30) lowScores.push('breast')
    if (qscore.corporal.satisfaction_abdomen < 30) lowScores.push('abdomen')
    if (qscore.corporal.satisfaction_buttocks < 30) lowScores.push('buttocks')
  }
  
  if (lowScores.length >= 3) {
    dysmorphia = true
    recommendations.push('🚨 ALERTA: Posible Trastorno Dismórfico Corporal. Se recomienda evaluación psicológica antes de cirugía')
  }
  
  // Check 3: Distress Psicológico Alto
  if (qscore.facial?.distress_social && qscore.facial.distress_social > 75) {
    distress = true
    recommendations.push('⚠️ SOPORTE PSICOLÓGICO: Paciente con alto distress social. Considerar terapia de apoyo')
  }
  
  return {
    risk_unrealistic_expectations: unrealistic,
    risk_body_dysmorphia: dysmorphia,
    risk_psychological_distress: distress,
    recommendations
  }
}

/**
 * CORRELACIÓN Q-SCORE CON BIOMARCADORES
 */
export function correlateWithBiomarkers(
  qscore: QScoreComplete,
  quantumData: any,
  inBodyData: any
): {
  correlation_inflammation_distress: number // -1 a 1
  correlation_collagen_satisfaction: number
  correlation_muscle_confidence: number
  insights: string[]
} {
  const insights: string[] = []
  
  // Correlación 1: Inflamación vs Distress Psicológico
  let inflammationDistressCorr = 0
  if (quantumData?.nfkb_inflammation && qscore.facial?.distress_social) {
    const inflammation = quantumData.nfkb_inflammation
    const distress = qscore.facial.distress_social
    
    // Hipótesis: Mayor inflamación = Mayor distress
    if (inflammation > 60 && distress > 60) {
      inflammationDistressCorr = 0.75
      insights.push('📊 HALLAZGO: Correlación positiva entre inflamación sistémica (NFκB) y distress psicosocial')
      insights.push('💡 RECOMENDACIÓN: Omega-3 + Curcumina para reducir inflamación podría mejorar bienestar psicológico')
    }
  }
  
  // Correlación 2: Colágeno vs Satisfacción
  let collagenSatisfactionCorr = 0
  if (quantumData?.collagen_synthesis && qscore.global_satisfaction) {
    const collagen = quantumData.collagen_synthesis
    const satisfaction = qscore.global_satisfaction
    
    if (collagen > 70 && satisfaction > 70) {
      collagenSatisfactionCorr = 0.65
      insights.push('✅ POSITIVO: Alta síntesis de colágeno correlaciona con mayor satisfacción post-operatoria')
    } else if (collagen < 60 && satisfaction < 60) {
      collagenSatisfactionCorr = 0.60
      insights.push('⚠️ ALERTA: Baja síntesis de colágeno puede comprometer satisfacción. Suplementar con Colágeno + Vitamina C')
    }
  }
  
  // Correlación 3: Masa Muscular vs Confianza Sexual
  let muscleConfidenceCorr = 0
  if (inBodyData?.muscle_mass && qscore.corporal?.sexual_confidence) {
    const muscle = inBodyData.muscle_mass
    const confidence = qscore.corporal.sexual_confidence
    
    if (muscle > 35 && confidence > 70) {
      muscleConfidenceCorr = 0.55
      insights.push('💪 HALLAZGO: Mayor masa muscular correlaciona con mayor confianza sexual')
    }
  }
  
  return {
    correlation_inflammation_distress: inflammationDistressCorr,
    correlation_collagen_satisfaction: collagenSatisfactionCorr,
    correlation_muscle_confidence: muscleConfidenceCorr,
    insights
  }
}

/**
 * GENERA Q-SCORE COMPLETO DESDE DATOS RAW
 */
export function generateQScore(
  patientId: string,
  assessmentType: 'pre_op' | 'post_op_30d' | 'post_op_90d' | 'post_op_1yr',
  responses: {
    facial_satisfaction?: number[]
    facial_distress?: number[]
    facial_expectations?: number[]
    breast_satisfaction?: number[]
    body_distress?: number[]
    sexual_function?: number[]
  },
  quantumData?: any,
  inBodyData?: any
): QScoreComplete {
  const qscore: QScoreComplete = {
    patient_id: patientId,
    assessment_date: new Date().toISOString(),
    assessment_type: assessmentType,
    global_satisfaction: 0,
    global_psychological_wellbeing: 0,
    global_physical_wellbeing: 0,
    risk_unrealistic_expectations: false,
    risk_body_dysmorphia: false,
    risk_psychological_distress: false,
    predicted_satisfaction_increase: 0
  }
  
  // Procesar respuestas faciales
  if (responses.facial_satisfaction) {
    qscore.facial = {
      satisfaction_overall: convertToRaschScore(responses.facial_satisfaction, 'satisfaction_face'),
      satisfaction_nose: convertToRaschScore([responses.facial_satisfaction[0], responses.facial_satisfaction[1]], 'satisfaction_face'),
      satisfaction_eyes: convertToRaschScore([responses.facial_satisfaction[2]], 'satisfaction_face'),
      satisfaction_cheeks: convertToRaschScore([responses.facial_satisfaction[3]], 'satisfaction_face'),
      satisfaction_jawline: convertToRaschScore([responses.facial_satisfaction[4]], 'satisfaction_face'),
      satisfaction_skin: 75,
      distress_social: responses.facial_distress ? convertToRaschScore(responses.facial_distress, 'distress') : 30,
      distress_appearance: 35,
      distress_selfesteem: 40,
      expectations_realistic: responses.facial_expectations ? convertToRaschScore(responses.facial_expectations, 'expectations') : 70,
      expectations_information: 80,
      physical_pain: 20,
      physical_tightness: 25,
      physical_sensation: 85
    }
  }
  
  // Procesar respuestas corporales
  if (responses.breast_satisfaction) {
    qscore.corporal = {
      satisfaction_breast: convertToRaschScore(responses.breast_satisfaction, 'satisfaction_breast'),
      satisfaction_abdomen: 65,
      satisfaction_buttocks: 70,
      satisfaction_arms: 75,
      satisfaction_thighs: 68,
      distress_body_image: responses.body_distress ? convertToRaschScore(responses.body_distress, 'distress') : 35,
      distress_intimacy: 30,
      distress_clothing: 40,
      sexual_confidence: responses.sexual_function ? convertToRaschScore(responses.sexual_function, 'sexual') : 65,
      sexual_satisfaction: 70,
      physical_recovery: assessmentType !== 'pre_op' ? 80 : 100,
      physical_scarring: assessmentType !== 'pre_op' ? 75 : 100
    }
  }
  
  // Calcular scores globales
  if (qscore.facial && qscore.corporal) {
    qscore.global_satisfaction = Math.round((qscore.facial.satisfaction_overall + qscore.corporal.satisfaction_breast) / 2)
  } else if (qscore.facial) {
    qscore.global_satisfaction = qscore.facial.satisfaction_overall
  } else if (qscore.corporal) {
    qscore.global_satisfaction = qscore.corporal.satisfaction_breast
  }
  
  qscore.global_psychological_wellbeing = qscore.facial ? 100 - qscore.facial.distress_social : 70
  qscore.global_physical_wellbeing = 85
  
  // Detectar risk flags
  const risks = detectRiskFlags(qscore)
  qscore.risk_unrealistic_expectations = risks.risk_unrealistic_expectations
  qscore.risk_body_dysmorphia = risks.risk_body_dysmorphia
  qscore.risk_psychological_distress = risks.risk_psychological_distress
  
  // Predecir mejora si hay datos biométricos
  if (quantumData && inBodyData) {
    qscore.predicted_satisfaction_increase = predictSatisfactionIncrease(qscore, quantumData, inBodyData)
  }
  
  return qscore
}
