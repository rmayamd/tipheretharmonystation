/**
 * MAYA-VISION V3.1 - SISTEMA DE CAPTURA MULTI-ÁNGULO
 * Captura 4 ángulos automáticamente: Frontal, Lateral Derecho, Lateral Izquierdo, Cenital
 */

export type CaptureAngle = 'frontal' | 'lateral_right' | 'lateral_left' | 'cenital'

export interface MultiAngleCapture {
  frontal: string | null
  lateral_right: string | null
  lateral_left: string | null
  cenital: string | null
}

export interface CaptureProgress {
  current: CaptureAngle
  completed: CaptureAngle[]
  percentage: number
  nextAngle: CaptureAngle | null
}

export class MultiAngleCaptureManager {
  private captures: MultiAngleCapture = {
    frontal: null,
    lateral_right: null,
    lateral_left: null,
    cenital: null
  }
  
  private captureOrder: CaptureAngle[] = ['frontal', 'lateral_right', 'lateral_left', 'cenital']
  private currentIndex: number = 0
  
  /**
   * Obtiene el ángulo actual a capturar
   */
  getCurrentAngle(): CaptureAngle {
    return this.captureOrder[this.currentIndex]
  }
  
  /**
   * Obtiene el progreso actual
   */
  getProgress(): CaptureProgress {
    const completed = this.captureOrder.slice(0, this.currentIndex)
    const current = this.getCurrentAngle()
    const nextAngle = this.currentIndex < this.captureOrder.length - 1 
      ? this.captureOrder[this.currentIndex + 1] 
      : null
    
    return {
      current,
      completed,
      percentage: Math.round((this.currentIndex / this.captureOrder.length) * 100),
      nextAngle
    }
  }
  
  /**
   * Guarda una captura
   */
  saveCapture(angle: CaptureAngle, imageData: string): boolean {
    if (angle !== this.getCurrentAngle()) {
      console.error(`Intento de guardar ${angle} pero se esperaba ${this.getCurrentAngle()}`)
      return false
    }
    
    this.captures[angle] = imageData
    this.currentIndex++
    return true
  }
  
  /**
   * Verifica si todas las capturas están completas
   */
  isComplete(): boolean {
    return this.currentIndex >= this.captureOrder.length
  }
  
  /**
   * Obtiene todas las capturas
   */
  getAllCaptures(): MultiAngleCapture {
    return { ...this.captures }
  }
  
  /**
   * Reinicia el proceso
   */
  reset(): void {
    this.captures = {
      frontal: null,
      lateral_right: null,
      lateral_left: null,
      cenital: null
    }
    this.currentIndex = 0
  }
  
  /**
   * Retrocede al ángulo anterior (para retomar foto)
   */
  goBack(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--
      const angle = this.getCurrentAngle()
      this.captures[angle] = null
      return true
    }
    return false
  }
  
  /**
   * Obtiene las instrucciones para el ángulo actual
   */
  getCurrentInstructions(): {
    title: string
    instructions: string[]
    icon: string
  } {
    const angle = this.getCurrentAngle()
    
    const instructionsMap = {
      frontal: {
        title: '📸 Vista Frontal',
        instructions: [
          'Mira directamente a la cámara',
          'Rostro centrado en el óvalo',
          'Expresión neutra (sin sonreír)',
          'Iluminación frontal uniforme',
          'A 50-70 cm de distancia'
        ],
        icon: '👤'
      },
      lateral_right: {
        title: '👉 Perfil Derecho',
        instructions: [
          'Gira tu cabeza 90° a la DERECHA',
          'Perfil completo visible',
          'Mantén cabeza erguida',
          'Cierra la boca naturalmente',
          'Misma distancia (50-70 cm)'
        ],
        icon: '➡️'
      },
      lateral_left: {
        title: '👈 Perfil Izquierdo',
        instructions: [
          'Gira tu cabeza 90° a la IZQUIERDA',
          'Perfil completo visible',
          'Mantén cabeza erguida',
          'Cierra la boca naturalmente',
          'Misma distancia (50-70 cm)'
        ],
        icon: '⬅️'
      },
      cenital: {
        title: '🔝 Vista Cenital (desde arriba)',
        instructions: [
          'Inclina la cabeza hacia ATRÁS',
          'Mira hacia arriba (al techo)',
          'Cuello y mandíbula visibles',
          'Cámara por encima de tu cabeza',
          'Distancia 30-40 cm'
        ],
        icon: '⬆️'
      }
    }
    
    return instructionsMap[angle]
  }
  
  /**
   * Analiza la calidad de la captura (básico)
   */
  async validateCapture(imageData: string): Promise<{
    valid: boolean
    issues: string[]
    score: number
  }> {
    // Análisis básico de calidad
    const issues: string[] = []
    let score = 100
    
    // Verificar tamaño mínimo
    if (imageData.length < 10000) {
      issues.push('Imagen muy pequeña o de baja calidad')
      score -= 30
    }
    
    // En producción: usar TensorFlow.js para detectar rostro
    // Por ahora: validación básica
    
    return {
      valid: issues.length === 0,
      issues,
      score
    }
  }
}

/**
 * Análisis 3D desde múltiples ángulos
 */
export interface Analysis3D {
  frontal: {
    facial_width: number
    facial_height: number
    symmetry_lr: number
    vertical_thirds: { upper: number; middle: number; lower: number }
  }
  lateral: {
    nasolabial_angle: number
    nasofrontal_angle: number
    chin_projection: number
    cervicomental_angle: number
    facial_convexity: number
  }
  cenital: {
    cranial_width: number
    temporal_width: number
    mandibular_width: number
    facial_taper: number
  }
  measurements: {
    bigonial_width: number
    bizygomatic_width: number
    intercanthal_distance: number
    mouth_width: number
  }
}

/**
 * Analiza las 4 capturas y genera mediciones 3D
 */
export async function analyze3DFromCaptures(
  captures: MultiAngleCapture
): Promise<Analysis3D> {
  // NOTA: En producción usar TensorFlow.js / MediaPipe
  // Por ahora: análisis simulado con valores realistas
  
  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    frontal: {
      facial_width: 130 + Math.random() * 20,
      facial_height: 180 + Math.random() * 20,
      symmetry_lr: 85 + Math.random() * 10,
      vertical_thirds: {
        upper: 33 + Math.random() * 3,
        middle: 34 + Math.random() * 3,
        lower: 33 + Math.random() * 3
      }
    },
    lateral: {
      nasolabial_angle: 90 + Math.random() * 20,
      nasofrontal_angle: 115 + Math.random() * 20,
      chin_projection: -5 + Math.random() * 10,
      cervicomental_angle: 105 + Math.random() * 20,
      facial_convexity: 155 + Math.random() * 20
    },
    cenital: {
      cranial_width: 140 + Math.random() * 15,
      temporal_width: 130 + Math.random() * 15,
      mandibular_width: 100 + Math.random() * 20,
      facial_taper: 0.75 + Math.random() * 0.15
    },
    measurements: {
      bigonial_width: 95 + Math.random() * 20,
      bizygomatic_width: 125 + Math.random() * 20,
      intercanthal_distance: 32 + Math.random() * 5,
      mouth_width: 48 + Math.random() * 8
    }
  }
}

/**
 * Genera un resumen del análisis 3D
 */
export function generate3DSummary(analysis: Analysis3D, gender: 'M' | 'F'): string {
  const ratio = analysis.measurements.bigonial_width / analysis.measurements.bizygomatic_width
  
  let summary = `Análisis 3D Completo:\n\n`
  
  // Ratio facial
  if (gender === 'M') {
    if (ratio > 0.85) {
      summary += `✅ Ratio mandibular masculino adecuado (${ratio.toFixed(2)})\n`
    } else {
      summary += `⚠️ Mandíbula estrecha para perfil masculino (${ratio.toFixed(2)})\n`
    }
  } else {
    if (ratio < 0.80) {
      summary += `✅ Ratio mandibular femenino ideal (${ratio.toFixed(2)})\n`
    } else {
      summary += `⚠️ Mandíbula ancha - considerar reducción (${ratio.toFixed(2)})\n`
    }
  }
  
  // Ángulo cervicomental
  if (analysis.lateral.cervicomental_angle < 110) {
    summary += `⚠️ Ángulo cervicomental cerrado (${analysis.lateral.cervicomental_angle.toFixed(0)}°) - papada visible\n`
  } else if (analysis.lateral.cervicomental_angle > 120) {
    summary += `✅ Ángulo cervicomental óptimo (${analysis.lateral.cervicomental_angle.toFixed(0)}°)\n`
  } else {
    summary += `✓ Ángulo cervicomental normal (${analysis.lateral.cervicomental_angle.toFixed(0)}°)\n`
  }
  
  // Proyección chin
  if (analysis.lateral.chin_projection < -2) {
    summary += `⚠️ Retrognatia detectada (${analysis.lateral.chin_projection.toFixed(1)}mm) - considerar genioplastia\n`
  } else if (analysis.lateral.chin_projection > 3) {
    summary += `⚠️ Prognatia detectada (${analysis.lateral.chin_projection.toFixed(1)}mm)\n`
  } else {
    summary += `✅ Proyección mentoniana adecuada (${analysis.lateral.chin_projection.toFixed(1)}mm)\n`
  }
  
  return summary
}
