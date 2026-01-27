/**
 * THE ICE PRINCIPLE FOR BREAST AUGMENTATION
 * Design for Natural Breast Augmentation
 * 
 * Referencia: Mallucci & Branford (2016)
 * "Design for Natural Breast Augmentation: The ICE Principle"
 * Plastic and Reconstructive Surgery
 * 
 * ICE = Implant dimensions (I) − breast Capacity (C) = Excess tissue required (E)
 * 
 * Archivo fuente: D:\00_VARIOS\The ICE principle in breast.pdf
 */

export interface ICEMeasurements {
  // MEDIDAS ANATÓMICAS PRE-OPERATORIAS
  breast_base_width: number // cm - ancho de base mamaria
  nipple_to_fold_stretched: number // cm - distancia pezón a pliegue inframamario (estirada)
  nipple_to_fold_relaxed: number // cm - distancia pezón a pliegue (relajada)
  sternal_notch_to_nipple: number // cm - distancia horquilla esternal a pezón
  
  // VOLUMEN MAMARIO ACTUAL
  current_breast_volume: number // cc - estimado por pinch test o medición directa
  
  // IMPLANTE SELECCIONADO
  implant_volume: number // cc
  implant_base_width: number // cm - ancho del implante
  implant_projection: number // cm - proyección del implante
}

export interface ICEResult {
  // CÁLCULO ICE
  I: number // Implant dimensions (volumen del implante)
  C: number // breast Capacity (capacidad actual)
  E: number // Excess tissue required (tejido en exceso necesario)
  
  // NUEVA POSICIÓN DEL PLIEGUE INFRAMAMARIO
  new_fold_position: number // cm desde el pezón
  fold_descent: number // cm que debe descender el pliegue
  
  // PROPORCIONES POST-CIRUGÍA
  upper_pole_percentage: number // % del polo superior (ideal: 45%)
  lower_pole_percentage: number // % del polo inferior (ideal: 55%)
  
  // ÁNGULO DE PROYECCIÓN DEL PEZÓN
  nipple_angle_pre: number // grados (típico pre-op: ~11°)
  nipple_angle_post: number // grados (ideal post-op: ~19°)
  
  // RECOMENDACIONES
  is_natural_result: boolean
  requires_mastopexy: boolean // si necesita lifting además de implante
  warnings: string[]
  compatibility_score: number // 0-100
}

/**
 * CONSTANTES DEL PRINCIPIO ICE
 */
const ICE_CONSTANTS = {
  // Proporción ideal polo superior:inferior
  IDEAL_UPPER_POLE: 0.45,
  IDEAL_LOWER_POLE: 0.55,
  
  // Proporción pre-operatoria promedio
  PRE_OP_UPPER_POLE: 0.52,
  PRE_OP_LOWER_POLE: 0.48,
  
  // Ángulos de proyección del pezón
  PRE_OP_NIPPLE_ANGLE: 11, // grados
  POST_OP_NIPPLE_ANGLE: 19, // grados
  
  // Límites para mastopexy
  MAX_STERNAL_TO_NIPPLE: 22, // cm - si excede, considerar mastopexy
  
  // Factor de estiramiento tisular
  TISSUE_STRETCH_FACTOR: 1.2 // cuánto puede estirarse el tejido
}

/**
 * Calcular capacidad mamaria actual (C)
 * Basado en mediciones de pinch test y volumen estimado
 */
function calculateBreastCapacity(measurements: ICEMeasurements): number {
  // Método 1: Volumen actual medido directamente
  if (measurements.current_breast_volume > 0) {
    return measurements.current_breast_volume
  }
  
  // Método 2: Estimación por dimensiones
  // Fórmula aproximada: π/6 × ancho² × (distancia pezón-pliegue)
  const width = measurements.breast_base_width
  const height = measurements.nipple_to_fold_relaxed
  const estimated_volume = (Math.PI / 6) * Math.pow(width, 2) * height * 10 // factor de conversión
  
  return Math.round(estimated_volume)
}

/**
 * Calcular nuevo posicionamiento del pliegue inframamario
 * usando la fórmula ICE
 */
function calculateNewFoldPosition(
  I: number, // volumen implante
  C: number, // capacidad mama
  measurements: ICEMeasurements
): { new_position: number; descent: number } {
  // E = I - C (tejido en exceso necesario)
  const E = I - C
  
  // Si E > 0: necesitamos descender el pliegue
  // Si E < 0: tenemos exceso de tejido (raro)
  // Si E ≈ 0: no cambiar pliegue
  
  if (E <= 0) {
    return {
      new_position: measurements.nipple_to_fold_relaxed,
      descent: 0
    }
  }
  
  // Cálculo de descenso necesario del pliegue
  // Basado en la relación entre volumen excedente y ancho de base
  const base_width = measurements.breast_base_width
  const implant_projection = measurements.implant_projection
  
  // Fórmula simplificada: descent ≈ (E / base_width²) × factor_corrección
  const descent_cm = Math.sqrt(E / (base_width * 10)) * 0.8
  
  const new_position = measurements.nipple_to_fold_stretched + descent_cm
  
  return {
    new_position: Number(new_position.toFixed(1)),
    descent: Number(descent_cm.toFixed(1))
  }
}

/**
 * Calcular proporciones polo superior:inferior post-cirugía
 */
function calculatePoleRatios(
  measurements: ICEMeasurements,
  new_fold_position: number
): { upper: number; lower: number } {
  // Distancia total del tórax (estimada desde horquilla esternal hasta pliegue)
  const total_breast_height = measurements.sternal_notch_to_nipple + new_fold_position
  
  // Polo superior: desde horquilla hasta pezón
  const upper_pole = measurements.sternal_notch_to_nipple
  
  // Polo inferior: desde pezón hasta pliegue
  const lower_pole = new_fold_position
  
  const total = upper_pole + lower_pole
  
  return {
    upper: (upper_pole / total) * 100,
    lower: (lower_pole / total) * 100
  }
}

/**
 * Calcular ángulo de proyección del pezón
 */
function calculateNippleAngle(
  pre_op: boolean,
  implant_projection: number
): number {
  if (pre_op) {
    return ICE_CONSTANTS.PRE_OP_NIPPLE_ANGLE
  }
  
  // Post-op: el implante aumenta la proyección
  // Fórmula: ángulo ≈ arctan(proyección / base) × factor
  const angle = ICE_CONSTANTS.POST_OP_NIPPLE_ANGLE + (implant_projection * 1.5)
  
  return Math.min(angle, 25) // máximo 25° para evitar aspecto artificial
}

/**
 * FUNCIÓN PRINCIPAL: Aplicar el Principio ICE
 */
export function applyICEPrinciple(measurements: ICEMeasurements): ICEResult {
  // 1. Calcular capacidad mamaria (C)
  const C = calculateBreastCapacity(measurements)
  
  // 2. Volumen del implante (I)
  const I = measurements.implant_volume
  
  // 3. Tejido en exceso necesario (E)
  const E = I - C
  
  // 4. Nueva posición del pliegue inframamario
  const { new_position, descent } = calculateNewFoldPosition(I, C, measurements)
  
  // 5. Proporciones polo superior:inferior
  const pole_ratios = calculatePoleRatios(measurements, new_position)
  
  // 6. Ángulos de proyección del pezón
  const nipple_angle_pre = calculateNippleAngle(true, 0)
  const nipple_angle_post = calculateNippleAngle(false, measurements.implant_projection)
  
  // 7. Evaluación de resultado natural
  const is_natural = 
    pole_ratios.upper >= 43 && pole_ratios.upper <= 47 && // 45% ± 2%
    pole_ratios.lower >= 53 && pole_ratios.lower <= 57 && // 55% ± 2%
    nipple_angle_post >= 17 && nipple_angle_post <= 21 // 19° ± 2°
  
  // 8. ¿Necesita mastopexy?
  const requires_mastopexy = measurements.sternal_notch_to_nipple > ICE_CONSTANTS.MAX_STERNAL_TO_NIPPLE
  
  // 9. Compatibilidad implante-tejido
  const tissue_capacity_ratio = C / I
  const compatibility_score = Math.min(100, Math.max(0, tissue_capacity_ratio * 80 + 20))
  
  // 10. Advertencias
  const warnings: string[] = []
  
  if (E > 150) {
    warnings.push('⚠️ Implante muy grande para la capacidad actual - alto riesgo de descenso del pliegue')
  }
  
  if (E < -50) {
    warnings.push('⚠️ Implante muy pequeño - considerar volumen mayor o mastopexy')
  }
  
  if (descent > 3) {
    warnings.push(`⚠️ Pliegue debe descender ${descent}cm - puede requerir técnica dual-plane`)
  }
  
  if (requires_mastopexy) {
    warnings.push('⚠️ Distancia esternal-pezón excesiva - mastopexy recomendada')
  }
  
  if (measurements.implant_base_width > measurements.breast_base_width + 1) {
    warnings.push('⚠️ Implante más ancho que base mamaria - riesgo de desplazamiento lateral')
  }
  
  if (compatibility_score < 60) {
    warnings.push('⚠️ Baja compatibilidad tejido-implante - revisar selección')
  }
  
  return {
    I,
    C,
    E,
    new_fold_position: new_position,
    fold_descent: descent,
    upper_pole_percentage: Number(pole_ratios.upper.toFixed(1)),
    lower_pole_percentage: Number(pole_ratios.lower.toFixed(1)),
    nipple_angle_pre,
    nipple_angle_post: Number(nipple_angle_post.toFixed(1)),
    is_natural_result: is_natural,
    requires_mastopexy,
    warnings,
    compatibility_score: Number(compatibility_score.toFixed(0))
  }
}

/**
 * Validar mediciones antes de aplicar ICE
 */
export function validateICEMeasurements(measurements: ICEMeasurements): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (measurements.breast_base_width < 8 || measurements.breast_base_width > 18) {
    errors.push('Ancho de base mamaria fuera de rango (8-18cm)')
  }
  
  if (measurements.nipple_to_fold_stretched < 4 || measurements.nipple_to_fold_stretched > 15) {
    errors.push('Distancia pezón-pliegue fuera de rango (4-15cm)')
  }
  
  if (measurements.implant_volume < 100 || measurements.implant_volume > 800) {
    errors.push('Volumen de implante fuera de rango (100-800cc)')
  }
  
  if (measurements.implant_base_width < 8 || measurements.implant_base_width > 16) {
    errors.push('Ancho de implante fuera de rango (8-16cm)')
  }
  
  if (measurements.sternal_notch_to_nipple < 15 || measurements.sternal_notch_to_nipple > 30) {
    errors.push('Distancia esternal-pezón fuera de rango (15-30cm)')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generar reporte visual del análisis ICE
 */
export function generateICEReport(result: ICEResult): string {
  const lines = [
    '═══════════════════════════════════════',
    '📐 ANÁLISIS ICE PRINCIPLE',
    '═══════════════════════════════════════',
    '',
    `🔢 CÁLCULO ICE:`,
    `   I (Implante): ${result.I}cc`,
    `   C (Capacidad): ${result.C}cc`,
    `   E (Exceso): ${result.E > 0 ? '+' : ''}${result.E}cc`,
    '',
    `📍 PLIEGUE INFRAMAMARIO:`,
    `   Nueva posición: ${result.new_fold_position}cm desde pezón`,
    `   Descenso requerido: ${result.fold_descent}cm`,
    '',
    `📊 PROPORCIONES:`,
    `   Polo Superior: ${result.upper_pole_percentage}% (ideal: 45%)`,
    `   Polo Inferior: ${result.lower_pole_percentage}% (ideal: 55%)`,
    `   ${result.is_natural_result ? '✅ Proporción natural alcanzada' : '⚠️ Proporción fuera del rango ideal'}`,
    '',
    `📐 PROYECCIÓN DEL PEZÓN:`,
    `   Pre-op: ${result.nipple_angle_pre}°`,
    `   Post-op: ${result.nipple_angle_post}° (ideal: 19°)`,
    '',
    `🎯 COMPATIBILIDAD: ${result.compatibility_score}/100`,
    '',
    `${result.requires_mastopexy ? '⚠️ MASTOPEXY RECOMENDADA' : '✅ Solo implante suficiente'}`,
    ''
  ]
  
  if (result.warnings.length > 0) {
    lines.push('⚠️ ADVERTENCIAS:')
    result.warnings.forEach(w => lines.push(`   ${w}`))
    lines.push('')
  }
  
  lines.push('═══════════════════════════════════════')
  
  return lines.join('\n')
}

/**
 * Sugerir volumen óptimo de implante usando ICE
 * (dado un resultado deseado de proporciones)
 */
export function suggestOptimalImplantVolume(
  measurements: Omit<ICEMeasurements, 'implant_volume' | 'implant_projection'>,
  desired_cup_increase: 1 | 2 | 3 // copas a aumentar
): number {
  // Calcular capacidad actual
  const C = calculateBreastCapacity({
    ...measurements,
    implant_volume: 0,
    implant_projection: 0
  } as ICEMeasurements)
  
  // Aproximación: cada copa ≈ 150-200cc
  const cc_per_cup = 175
  const desired_volume_increase = desired_cup_increase * cc_per_cup
  
  // I = C + E, donde E es el volumen adicional deseado
  const optimal_I = C + desired_volume_increase
  
  // Redondear a múltiplo de 25cc
  return Math.round(optimal_I / 25) * 25
}
