/**
 * Sistema de Validaciones para Maya Harmony Station
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Valida datos de InBody
 */
export function validateInBodyData(data: {
  muscleMass?: number
  bodyFat?: number
  phaseAngle?: number
  extracellularWater?: number
}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (data.muscleMass !== undefined) {
    if (data.muscleMass < 10 || data.muscleMass > 100) {
      errors.push('Masa muscular fuera de rango válido (10-100 kg)')
    }
    if (data.muscleMass < 20) {
      warnings.push('Masa muscular muy baja - Requiere atención inmediata')
    }
  }

  if (data.bodyFat !== undefined) {
    if (data.bodyFat < 5 || data.bodyFat > 50) {
      errors.push('Grasa corporal fuera de rango válido (5-50%)')
    }
    if (data.bodyFat > 35) {
      warnings.push('Grasa corporal elevada - Considerar protocolo de optimización')
    }
  }

  if (data.phaseAngle !== undefined) {
    if (data.phaseAngle < 3 || data.phaseAngle > 10) {
      errors.push('Phase angle fuera de rango válido (3-10)')
    }
    if (data.phaseAngle < 5.5) {
      warnings.push('Phase angle bajo - Salud celular comprometida')
    }
  }

  if (data.extracellularWater !== undefined) {
    if (data.extracellularWater < 0.2 || data.extracellularWater > 0.6) {
      errors.push('Agua extracelular fuera de rango válido (0.2-0.6)')
    }
    if (data.extracellularWater > 0.4) {
      warnings.push('Agua extracelular elevada - Riesgo ERAS')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Valida datos de paciente
 */
export function validatePatientData(data: {
  name?: string
  age?: number
  email?: string
  phone?: string
}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (data.name && data.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (data.age !== undefined) {
    if (data.age < 18 || data.age > 120) {
      errors.push('Edad fuera de rango válido (18-120 años)')
    }
    if (data.age > 80) {
      warnings.push('Paciente de edad avanzada - Requiere evaluación adicional')
    }
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido')
  }

  if (data.phone && data.phone.trim().length < 7) {
    warnings.push('Número de teléfono muy corto')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Valida orden de Interdrogas
 */
export function validateInterdrogasOrder(items: Array<{
  name: string
  quantity: number
  unitPrice: number
}>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (items.length === 0) {
    errors.push('La orden debe tener al menos un item')
  }

  items.forEach((item, index) => {
    if (!item.name || item.name.trim().length === 0) {
      errors.push(`Item ${index + 1}: Nombre requerido`)
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Cantidad debe ser mayor a 0`)
    }
    if (item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Precio debe ser mayor a 0`)
    }
    if (item.unitPrice > 1000000) {
      warnings.push(`Item ${index + 1}: Precio muy alto - Verificar`)
    }
  })

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  if (total > 5000000) {
    warnings.push('Orden total muy alta - Verificar con paciente')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
