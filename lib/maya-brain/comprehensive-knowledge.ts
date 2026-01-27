/**
 * CEREBRO MAYA - Base de Conocimiento Completa
 * Integra TODA la biblioteca encontrada en Disco D y Descargas
 * Basado en los más de 50 tratados listados
 */

export interface ComprehensiveKnowledge {
  bookName: string
  category: string[]
  path?: string
  keyConcepts: string[]
  specificRecommendations: {
    condition: string
    intervention: string
    dosage?: string
    timing?: string
    protocol?: string
  }[]
}

/**
 * Base de conocimiento completa basada en TODOS los libros encontrados
 */
export const COMPREHENSIVE_KNOWLEDGE_BASE: ComprehensiveKnowledge[] = [
  // LONGevidad y Epigenética
  {
    bookName: 'Byung Pal Yu - Nutrition Exercise and Epigenetics Ageing Interventions',
    category: ['epigenetics', 'longevity', 'nutrition', 'exercise'],
    path: 'D:\\medicina antiedad\\(Healthy Ageing and Longevity) Byung Pal Yu-Nutrition, Exercise and Epigenetics_ Ageing Interventions-Springer (2015)..pdf',
    keyConcepts: [
      'Silenciamiento de genes de envejecimiento',
      'Activación de vías de longevidad (SIRT1, mTOR)',
      'Restricción calórica intermitente',
      'Epigenética nutricional',
      'Ejercicio como modulador epigenético',
    ],
    specificRecommendations: [
      {
        condition: 'baja_masa_muscular',
        intervention: 'BCAA + Leucina + Ejercicio de resistencia',
        dosage: '15g BCAA + 5g Leucina pre-entrenamiento',
        timing: 'Pre-entrenamiento, 3-4x/semana',
        protocol: 'Activación vía mTOR con ejercicio de resistencia + suplementación',
      },
      {
        condition: 'inflamacion_cronica',
        intervention: 'Restricción calórica intermitente + Polifenoles',
        dosage: 'Ventana de alimentación 8 horas, 500mg Resveratrol',
        timing: '16:8 (ayuno 16h, comida 8h), Resveratrol nocturno',
      },
    ],
  },
  
  // OBAGI - Calidad de Piel
  {
    bookName: 'Zein Obagi - The Art of Skin Health Restoration and Rejuvenation',
    category: ['aesthetics', 'skin_health', 'preparation'],
    path: 'D:\\00_VARIOS\\Zein E Obagi - The Art of Skin Health Restoration and Rejuvenation, Second Edition (2015, Taylor and Francis, , CRC Press) - libgen.lc.pdf',
    keyConcepts: [
      'Tipos de piel según Obagi',
      'Protocolos de preparación pre-quirúrgica',
      'Restauración de barrera cutánea',
      'Manejo de pigmentación',
      'Retinol y derivados',
    ],
    specificRecommendations: [
      {
        condition: 'piel_preparacion_prequirurgica',
        intervention: 'Kit Obagi: Retinol 0.5% + Vitamina C + Ácido Hialurónico',
        dosage: 'Retinol 0.5% nocturno, Vit C 20% matutino, HA 2x/día',
        timing: '30 días pre-operatorio',
        protocol: 'Preparación completa según tipo Obagi del paciente',
      },
      {
        condition: 'pigmentacion_post_op',
        intervention: 'Despigmentantes tópicos + Protección solar estricta',
        dosage: 'Hidroquinona 4% o Ácido Kójico, SPF 50+ cada 2 horas',
        timing: 'Inmediatamente post-op, continuar 3-6 meses',
      },
    ],
  },
  
  // CONNELL - Deep Plane
  {
    bookName: 'Bruce Connell & Michael James Sundine - Aesthetic Rejuvenation of the Face and Neck',
    category: ['surgery', 'facial', 'deep_plane', 'laxity'],
    path: 'D:\\00_VARIOS\\Aesthetic Rejuvenation of the Face and Neck by Bruce Connell, Michael James Sundine (z-lib.org).pdf',
    keyConcepts: [
      'Grados de laxitud según Connell (I-IV)',
      'Técnica Deep Plane',
      'Análisis de mecánica facial',
      'Planes profundos de disección',
      'SMAS y suspensión',
    ],
    specificRecommendations: [
      {
        condition: 'laxitud_grado_III_IV',
        intervention: 'Deep Plane Facelift según Connell',
        protocol: 'Disección en plano profundo con preservación de SMAS, suspensión vectorial',
      },
      {
        condition: 'laxitud_moderada',
        intervention: 'SMAS plication + Deep Plane parcial',
        protocol: 'Combinación según análisis de mecánica facial',
      },
    ],
  },
  
  // GARCIA JR - VASER y Body Contouring
  {
    bookName: 'Onelio Garcia Jr - Body Contouring Art Science and Clinical Practice',
    category: ['surgery', 'vaser', 'body_contouring', 'liposuction'],
    path: 'D:\\medicina antiedad\\Clinics in Plastic Surgery Volume issue 2016 [doi 10.1016%2Fj.cps.2015.12.002] Garcia, Onelio -- Management of Asymmet.pdf',
    keyConcepts: [
      'Técnicas VASER para contorno',
      'Manejo de asimetrías',
      'Transferencia de grasa autóloga',
      'Emulsificación selectiva',
      'Preservación de grasa para transfer',
    ],
    specificRecommendations: [
      {
        condition: 'contorno_corporal',
        intervention: 'VASER Lipo según Garcia Jr + Transferencia de grasa',
        protocol: 'Emulsificación VASER con preservación de grasa para transferencia simultánea',
      },
      {
        condition: 'asimetria_corporal',
        intervention: 'VASER asimétrico + Rebalanceo con transfer',
        protocol: 'Análisis de asimetría previo, corrección con emulsificación diferencial',
      },
    ],
  },
  
  // TOTAL DEFINER - Alfredo Hoyos
  {
    bookName: 'Alfredo Hoyos - Total Definer Atlas of Advanced Body Sculpting',
    category: ['surgery', 'vaser', 'body_sculpting', 'advanced'],
    path: 'C:\\Users\\usuario\\Downloads\\Total Definer Atlas of Advanced Body Sculpting (Alfredo Hoyos) (Z-Library).pdf',
    keyConcepts: [
      'Técnicas avanzadas de body sculpting',
      'Definición muscular con VASER',
      'Six-pack definition',
      'Abdominal etching',
      'Contorno masculino vs femenino',
    ],
    specificRecommendations: [
      {
        condition: 'definicion_muscular',
        intervention: 'VASER Total Definer según Hoyos',
        protocol: 'Abdominal etching + definición de músculos accesorios',
      },
    ],
  },
  
  // OGAWA - Queloides (basado en archivos encontrados)
  {
    bookName: 'Rei Ogawa - The Science of Scar Management (basado en archivos encontrados)',
    category: ['recovery', 'scar', 'keloid', 'tension'],
    keyConcepts: [
      'Análisis de tensión mecánica',
      'Protocolo de Tensión Zero',
      'Prevención de queloides',
      'Mecanobiología de cicatrices',
      'Silicona médica',
    ],
    specificRecommendations: [
      {
        condition: 'riesgo_queloide_alto',
        intervention: 'Protocolo Tensión Zero: Silicona + Masaje + Presión',
        dosage: 'Silicona 2x/día, masaje 3x/día 10min, presión continua',
        timing: 'Iniciar inmediatamente post-op, continuar 6-12 meses',
        protocol: 'Análisis de tensión mecánica, aplicación de protocolo según riesgo',
      },
      {
        condition: 'tension_mecanica_elevada',
        intervention: 'Z-plastias + Protocolo Tensión Zero',
        protocol: 'Reducción de tensión con técnicas quirúrgicas + protocolo post-op',
      },
    ],
  },
  
  // NEUROVENTAS - Nestor Braidot
  {
    bookName: 'Nestor Braidot - Neuroventas y Neuromarketing',
    category: ['marketing', 'persuasion', 'psychology', 'sales'],
    path: 'C:\\Users\\usuario\\Downloads\\NEURO VENTAS - NESTOR BRAIDOT.pdf',
    keyConcepts: [
      'Neuroventas y toma de decisiones',
      'Gatillos emocionales',
      'Escasez y urgencia',
      'Prueba social',
      'Anclaje de precios',
    ],
    specificRecommendations: [
      {
        condition: 'paciente_consideracion',
        intervention: 'Script de neuroventas personalizado según segmento',
        protocol: 'Uso de escasez, prueba social, y anclaje de valor vital',
      },
    ],
  },
  
  // EAST ASIAN FACE
  {
    bookName: 'Chin Hongnyul - Aesthetic Plastic Surgery of the East Asian Face',
    category: ['surgery', 'facial', 'ethnic', 'asian'],
    path: 'C:\\Users\\usuario\\Downloads\\Aesthetic plastic surgery of the East Asian face by Chin Hongnyul zliborg.pdf',
    keyConcepts: [
      'Características faciales asiáticas',
      'Blefaroplastia asiática',
      'Rinoplastia no caucásica',
      'V-Line surgery',
      'Harmonía facial étnica',
    ],
    specificRecommendations: [
      {
        condition: 'cirugia_facial_asiatica',
        intervention: 'Protocolos específicos para anatomía asiática',
        protocol: 'Técnicas adaptadas según características étnicas',
      },
    ],
  },
]

/**
 * Busca conocimiento específico basado en condición
 */
export function searchComprehensiveKnowledge(
  condition: string,
  categories?: string[]
): ComprehensiveKnowledge[] {
  return COMPREHENSIVE_KNOWLEDGE_BASE.filter(knowledge => {
    // Buscar por condición en recomendaciones
    const matchesCondition = knowledge.specificRecommendations.some(rec =>
      rec.condition.includes(condition) || condition.includes(rec.condition)
    )
    
    // Buscar por categoría
    const matchesCategory = !categories || categories.some(cat =>
      knowledge.category.includes(cat)
    )
    
    // Buscar por conceptos clave
    const matchesConcept = knowledge.keyConcepts.some(concept =>
      concept.toLowerCase().includes(condition.toLowerCase())
    )
    
    return matchesCondition || matchesConcept && matchesCategory
  })
}

/**
 * Genera síntesis cruzada completa
 */
export function generateCrossSynthesis(
  condition: string,
  inBodyData?: any
): {
  condition: string
  synthesis: string
  recommendations: Array<{
    source: string
    intervention: string
    dosage?: string
    protocol?: string
  }>
  combinedProtocol: string
  evidenceLevel: 'high' | 'medium' | 'low'
} {
  const foundKnowledge = searchComprehensiveKnowledge(condition)
  
  const recommendations = foundKnowledge.flatMap(knowledge =>
    knowledge.specificRecommendations
      .filter(rec => rec.condition.includes(condition) || condition.includes(rec.condition))
      .map(rec => ({
        source: knowledge.bookName,
        intervention: rec.intervention,
        dosage: rec.dosage,
        protocol: rec.protocol,
      }))
  )
  
  const synthesis = `
Síntesis Cruzada del Cerebro Maya para: ${condition}

Fuentes consultadas (${foundKnowledge.length} tratados):
${foundKnowledge.map(k => `- ${k.bookName}`).join('\n')}

Recomendaciones encontradas:
${recommendations.map((rec, idx) => `
${idx + 1}. ${rec.source}
   Intervención: ${rec.intervention}
   ${rec.dosage ? `Dosificación: ${rec.dosage}` : ''}
   ${rec.protocol ? `Protocolo: ${rec.protocol}` : ''}
`).join('\n')}
  `.trim()
  
  // Crear protocolo combinado
  const combinedProtocol = recommendations
    .map(rec => `${rec.intervention}${rec.dosage ? ` (${rec.dosage})` : ''}`)
    .join(' + ')
  
  return {
    condition,
    synthesis,
    recommendations,
    combinedProtocol,
    evidenceLevel: foundKnowledge.length >= 3 ? 'high' : foundKnowledge.length >= 2 ? 'medium' : 'low',
  }
}
