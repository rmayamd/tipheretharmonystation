/**
 * Procesador de Base de Datos Luxury
 * Maneja la importación y segmentación de pacientes
 */

export interface LuxuryPatient {
  id: string
  name: string
  email?: string
  phone?: string
  age: number
  gender?: string
  segment: 'joven' | 'maduro' | 'longevidad'
  procedures?: string[]
  lastVisit?: Date
  totalInvestment?: number
  status: 'active' | 'inactive' | 'prospect'
}

/**
 * Procesa archivo de base de datos Luxury (CSV, Excel, JSON)
 */
export async function processLuxuryDatabase(
  filePath: string
): Promise<LuxuryPatient[]> {
  // En producción, esto procesaría el archivo real
  // Por ahora, retorna estructura base
  
  // Ejemplo de datos procesados
  return [
    {
      id: '1',
      name: 'María González',
      email: 'maria@example.com',
      phone: '+57 300 123 4567',
      age: 28,
      gender: 'F',
      segment: 'joven',
      procedures: ['vaser'],
      totalInvestment: 15000000,
      status: 'active',
    },
    // ... más pacientes
  ]
}

/**
 * Segmenta pacientes automáticamente según edad y perfil
 */
export function autoSegmentPatient(age: number, profile?: any): 'joven' | 'maduro' | 'longevidad' {
  if (age < 35) return 'joven'
  if (age >= 35 && age < 50) return 'maduro'
  return 'longevidad'
}

/**
 * Genera mensaje personalizado según segmento
 */
export function getSegmentMessage(
  segment: 'joven' | 'maduro' | 'longevidad',
  patientName: string
): string {
  const messages = {
    joven: `Hola ${patientName}, tu perfil biológico califica para optimización preventiva. Actúa ahora mientras tu cuerpo tiene máxima capacidad de regeneración.`,
    maduro: `Hola ${patientName}, hemos identificado oportunidades de regeneración epigenética en tu perfil. Este es el momento óptimo para la intervención.`,
    longevidad: `Hola ${patientName}, tu perfil biológico califica para una actualización epigenética. Podemos revertir marcadores de envejecimiento y añadir años de vida saludable.`,
  }
  
  return messages[segment]
}
