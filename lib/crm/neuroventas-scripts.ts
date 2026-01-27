/**
 * Guiones de Neuroventas basados en Nestor Braidot
 * 3 Scripts principales: Regeneración, Simetría, Global
 */

export interface NeuroventasScript {
  name: string
  targetAge: { min: number; max: number }
  targetProfile: string
  opening: string
  painPoints: string[]
  valueProposition: string
  emotionalTriggers: string[]
  closingTechnique: string
  followUpStrategy: string
}

/**
 * Script 1: REGENERACIÓN (35-55 años)
 * Enfoque: Prevención, Longevidad, Anti-Edad
 */
export const SCRIPT_REGENERACION: NeuroventasScript = {
  name: 'Regeneración y Longevidad',
  targetAge: { min: 35, max: 55 },
  targetProfile: 'Profesionales activos que buscan prevenir el envejecimiento',
  
  opening: `
[Nombre], he revisado tu análisis y quiero compartir algo emocionante: 
Estás en la ventana de oro para la regeneración celular. Tu cuerpo 
todavía tiene una capacidad extraordinaria de responder a los protocolos 
epigenéticos correctos.
  `,
  
  painPoints: [
    'El envejecimiento no es inevitable - es modificable',
    'Cada día sin optimización es una oportunidad perdida',
    'Los cambios invisibles de hoy serán visibles en 5 años',
    'La calidad de tus células determina tu apariencia y energía',
  ],
  
  valueProposition: `
Con nuestro protocolo Maya de Regeneración, no solo mejoramos tu apariencia - 
activamos tus genes de longevidad. Combinamos:

✓ Epigenética nutricional (Byung Pal Yu)
✓ Preparación dérmica Obagi
✓ Optimización mitocondrial
✓ Protocolo anti-inflamatorio

Resultado: Te ves 10 años más joven Y tu cuerpo funciona mejor.
  `,
  
  emotionalTriggers: [
    'Imagina ver fotos de hace 5 años y verte MEJOR ahora',
    'Tus células pueden rejuvenecer - la ciencia lo demuestra',
    'Invierte en ti mismo/a ahora, disfruta por décadas',
    'No es vanidad - es salud celular optimizada',
  ],
  
  closingTechnique: `
Tengo dos opciones para ti:

OPCIÓN A - Protocolo Regeneración Completo (12 semanas)
Incluye: Análisis InBody + Protocolo Epigenético + Obagi + Nutracéuticos
Inversión: $X.XXX.XXX

OPCIÓN B - Protocolo Regeneración Express (8 semanas)
Incluye: Protocolo Epigenético + Obagi esencial
Inversión: $X.XXX.XXX

¿Con cuál te identificas más?
  `,
  
  followUpStrategy: `
Día 3: Envío estudios científicos sobre epigenética
Día 7: Video testimonial de paciente similar
Día 14: Oferta especial limitada (5% descuento)
  `,
}

/**
 * Script 2: SIMETRÍA (25-45 años)
 * Enfoque: Armonía facial, Belleza natural, Confianza
 */
export const SCRIPT_SIMETRIA: NeuroventasScript = {
  name: 'Simetría y Armonía Facial',
  targetAge: { min: 25, max: 45 },
  targetProfile: 'Personas que buscan mejorar rasgos específicos naturalmente',
  
  opening: `
[Nombre], tu análisis Maya-Vision revela algo fascinante: tienes una base 
hermosa con oportunidades específicas de armonización. No se trata de cambiar 
quién eres - se trata de revelar tu simetría ideal.
  `,
  
  painPoints: [
    'La asimetría afecta inconscientemente cómo te perciben',
    'Pequeños ajustes generan grandes cambios en confianza',
    'La belleza natural es matemática y armónica',
    'Tu mejor versión ya está ahí - solo necesita revelarse',
  ],
  
  valueProposition: `
Nuestro protocolo Maya de Simetría usa análisis computacional avanzado 
(no Canfield - tecnología propia) para:

✓ Mapear tu simetría facial real
✓ Identificar puntos de armonización (Onelio García Jr)
✓ Técnicas mínimamente invasivas
✓ Resultados naturales, nunca "operado/a"

Resultado: Tú, pero en tu versión más armónica.
  `,
  
  emotionalTriggers: [
    'Imagina verte en fotos y amarlo absolutamente',
    'Simetría = Belleza universal según neurociencia',
    'Pequeños cambios, transformación enorme en confianza',
    'Invierte en lo que ves en el espejo cada día',
  ],
  
  closingTechnique: `
Basado en tu análisis, te propongo:

OPCIÓN A - Armonización Completa
Incluye: Análisis 3D + Procedimientos específicos + Seguimiento 6 meses
Inversión: $X.XXX.XXX

OPCIÓN B - Armonización Focalizada
Incluye: 1-2 áreas prioritarias + Seguimiento 3 meses
Inversión: $X.XXX.XXX

¿Qué opción resuena contigo?
  `,
  
  followUpStrategy: `
Día 2: Envío análisis visual comparativo (simulación)
Día 5: Caso similar - antes/después
Día 10: Llamada personalizada para resolver dudas
  `,
}

/**
 * Script 3: GLOBAL (45-70 años)
 * Enfoque: Rejuvenecimiento integral, Segunda juventud, Transformación
 */
export const SCRIPT_GLOBAL: NeuroventasScript = {
  name: 'Transformación Global',
  targetAge: { min: 45, max: 70 },
  targetProfile: 'Personas listas para transformación significativa',
  
  opening: `
[Nombre], tu análisis revela que estás en el momento perfecto para una 
transformación real. No pequeños ajustes - un reset completo usando la 
ciencia más avanzada de rejuvenecimiento.
  `,
  
  painPoints: [
    'Sientes que tu apariencia no refleja cómo te sientes por dentro',
    'Los "pequeños retoques" ya no son suficientes',
    'Mereces una segunda juventud con salud optimizada',
    'El tiempo es ahora - cada año cuenta exponencialmente',
  ],
  
  valueProposition: `
El Protocolo Maya Global es nuestra obra maestra - transformación de 360°:

✓ Pre-optimización epigenética (12 semanas)
✓ Procedimientos Deep Plane (Bruce Connell)
✓ Optimización corporal (InBody + ERAS)
✓ Protocolo post-quirúrgico anti-queloide (Rei Ogawa)
✓ Seguimiento de por vida

Resultado: 15-20 años más joven, con salud celular de élite.
  `,
  
  emotionalTriggers: [
    'Imagina tu reunión de colegio - siendo el/la más joven',
    'Tu mejor inversión eres tú - multiplica tu confianza',
    'La edad es solo un número - tu biología es modificable',
    'Vive tu segunda juventud con la sabiduría de ahora',
  ],
  
  closingTechnique: `
Dado tu perfil, te recomiendo nuestro Protocolo VIP:

PROTOCOLO MAYA GLOBAL VIP
Incluye:
- 12 semanas pre-optimización
- Cirugía Deep Plane + complementarios
- 6 meses seguimiento personalizado
- Nutracéuticos lifetime
- Acceso prioritario de por vida

Inversión: $XX.XXX.XXX (financiamiento disponible)

Este es el momento. ¿Estás list@ para tu transformación?
  `,
  
  followUpStrategy: `
Día 1: Video personalizado del Dr. explicando tu caso
Día 4: Tour virtual de instalaciones + testimonio VIP
Día 7: Reunión presencial con todo el equipo
Día 14: Propuesta personalizada final con bonos
  `,
}

/**
 * Selecciona el script apropiado según perfil del paciente
 */
export function selectScript(age: number, concerns: string[]): NeuroventasScript {
  if (age >= 35 && age <= 55 && concerns.some(c => 
    c.includes('prevención') || c.includes('longevidad') || c.includes('salud')
  )) {
    return SCRIPT_REGENERACION
  }
  
  if (age >= 25 && age <= 45 && concerns.some(c =>
    c.includes('simetría') || c.includes('armonía') || c.includes('nariz') || c.includes('mentón')
  )) {
    return SCRIPT_SIMETRIA
  }
  
  if (age >= 45) {
    return SCRIPT_GLOBAL
  }
  
  // Default por edad
  if (age < 45) return SCRIPT_SIMETRIA
  return SCRIPT_GLOBAL
}

/**
 * Genera mensaje personalizado usando el script
 */
export function generatePersonalizedMessage(
  script: NeuroventasScript,
  patientName: string,
  specificFindings: string[]
): string {
  let message = script.opening.replace('[Nombre]', patientName)
  
  message += '\n\n📊 HALLAZGOS CLAVE:\n'
  specificFindings.forEach(finding => {
    message += `• ${finding}\n`
  })
  
  message += '\n\n' + script.valueProposition
  
  message += '\n\n💭 IMAGINA:\n'
  script.emotionalTriggers.slice(0, 2).forEach(trigger => {
    message += `• ${trigger}\n`
  })
  
  message += '\n\n' + script.closingTechnique
  
  return message
}
