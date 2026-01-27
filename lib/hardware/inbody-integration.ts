/**
 * Integración con InBody Dial H30
 * Sistema de lectura y análisis de datos corporales
 */

export interface InBodyH30Reading {
  deviceId: string
  readingDate: Date
  patientId?: string
  
  // Composición Corporal
  bodyWeight: number // kg
  muscleMass: number // kg
  bodyFatMass: number // kg
  bodyFatPercentage: number // %
  
  // Agua Corporal
  totalBodyWater: number // L
  intracellularWater: number // L
  extracellularWater: number // L
  ecwRatio: number // Ratio agua extracelular
  
  // Segmental (Brazos, Piernas, Tronco)
  segmentalFat: {
    rightArm: number
    leftArm: number
    trunk: number
    rightLeg: number
    leftLeg: number
  }
  
  segmentalMuscleMass: {
    rightArm: number
    leftArm: number
    trunk: number
    rightLeg: number
    leftLeg: number
  }
  
  // Análisis Avanzado
  phaseAngle: number // Indicador de salud celular
  visceralFatLevel: number
  basalMetabolicRate: number // kcal
  
  // Scores
  proteinMass: number // kg
  mineralMass: number // kg
  boneMineralContent: number // kg
}

/**
 * Simula lectura del InBody H30 (en producción se conectaría al dispositivo real)
 */
export function readInBodyH30(): InBodyH30Reading {
  // Simulación de datos (en producción vendría del dispositivo)
  return {
    deviceId: 'INBODY-H30-001',
    readingDate: new Date(),
    
    bodyWeight: 70 + Math.random() * 30,
    muscleMass: 25 + Math.random() * 15,
    bodyFatMass: 15 + Math.random() * 20,
    bodyFatPercentage: 18 + Math.random() * 15,
    
    totalBodyWater: 35 + Math.random() * 15,
    intracellularWater: 22 + Math.random() * 8,
    extracellularWater: 13 + Math.random() * 5,
    ecwRatio: 0.36 + Math.random() * 0.08,
    
    segmentalFat: {
      rightArm: 3 + Math.random() * 2,
      leftArm: 3 + Math.random() * 2,
      trunk: 12 + Math.random() * 8,
      rightLeg: 5 + Math.random() * 3,
      leftLeg: 5 + Math.random() * 3,
    },
    
    segmentalMuscleMass: {
      rightArm: 3 + Math.random() * 1.5,
      leftArm: 3 + Math.random() * 1.5,
      trunk: 25 + Math.random() * 5,
      rightLeg: 8 + Math.random() * 3,
      leftLeg: 8 + Math.random() * 3,
    },
    
    phaseAngle: 5 + Math.random() * 2.5,
    visceralFatLevel: 5 + Math.random() * 10,
    basalMetabolicRate: 1200 + Math.random() * 600,
    
    proteinMass: 10 + Math.random() * 5,
    mineralMass: 3 + Math.random() * 1.5,
    boneMineralContent: 2.5 + Math.random() * 1,
  }
}

/**
 * Analiza datos del InBody H30 y genera alertas
 */
export function analyzeInBodyH30(reading: InBodyH30Reading): {
  alerts: string[]
  recommendations: string[]
  surgeryStatus: 'approved' | 'caution' | 'blocked'
  blockReasons: string[]
} {
  const alerts: string[] = []
  const recommendations: string[] = []
  const blockReasons: string[] = []
  
  // Análisis de masa muscular
  if (reading.muscleMass < 25) {
    alerts.push('⚠️ MASA MUSCULAR BAJA')
    recommendations.push(
      'Protocolo de aminoácidos inmediato: BCAA 15g + Leucina 5g (Byung Pal Yu + Manual de Nutrigenómica)'
    )
    blockReasons.push('Masa muscular insuficiente para cirugía segura')
  }
  
  // Análisis de agua extracelular (ERAS)
  if (reading.ecwRatio > 0.40) {
    alerts.push('🚨 AGUA EXTRACELULAR ELEVADA - RIESGO ERAS')
    recommendations.push(
      'Protocolo anti-inflamatorio urgente + Restricción de sodio (Handbook of Perioperative Care)'
    )
    blockReasons.push('Ratio ECW elevado - Alto riesgo de complicaciones ERAS')
  }
  
  // Análisis de phase angle (salud celular)
  if (reading.phaseAngle < 5.5) {
    alerts.push('⚠️ SALUD CELULAR COMPROMETIDA (Phase Angle bajo)')
    recommendations.push(
      'Optimización mitocondrial: CoQ10 200mg + PQQ 20mg + Ácido Alfa Lipoico 600mg (Oxidative Stress and Mitochondrial Health)'
    )
    blockReasons.push('Integridad celular baja - Requiere pre-optimización')
  }
  
  // Análisis de grasa visceral
  if (reading.visceralFatLevel > 10) {
    alerts.push('⚠️ GRASA VISCERAL ELEVADA')
    recommendations.push(
      'Protocolo metabólico: Ayuno intermitente 16:8 + Omega-3 2g/día (The Metabolic Basis of Aesthetic Success)'
    )
  }
  
  // Análisis segmental (asimetrías)
  const muscleAsymmetry = Math.abs(
    reading.segmentalMuscleMass.rightLeg - reading.segmentalMuscleMass.leftLeg
  )
  if (muscleAsymmetry > 1.5) {
    alerts.push('⚠️ ASIMETRÍA MUSCULAR SIGNIFICATIVA')
    recommendations.push(
      'Entrenamiento correctivo unilateral + Evaluación biomecánica'
    )
  }
  
  // Determinar estado quirúrgico
  let surgeryStatus: 'approved' | 'caution' | 'blocked'
  if (blockReasons.length > 0) {
    surgeryStatus = 'blocked'
  } else if (alerts.length > 0) {
    surgeryStatus = 'caution'
  } else {
    surgeryStatus = 'approved'
  }
  
  return {
    alerts,
    recommendations,
    surgeryStatus,
    blockReasons,
  }
}
