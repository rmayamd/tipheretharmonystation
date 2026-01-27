/**
 * CATÁLOGO REAL DE IMPLANTES
 * Datos reales de fabricantes líderes mundiales
 * 
 * Fuentes:
 * - Silimed (Brasil): https://silimed.com/es
 * - Motiva (Establishment Labs, Costa Rica): https://motiva.health/es
 * - Mentor (Johnson & Johnson, USA): https://breastimplantsbymentor.net/es-419
 */

// ====================
// IMPLANTES MAMARIOS
// ====================

export interface BreastImplantProduct {
  manufacturer: 'silimed' | 'motiva' | 'mentor'
  brand: string
  model: string
  type: 'round' | 'anatomical' | 'ergonomic'
  surface: 'smooth' | 'textured' | 'micro_textured' | 'nano_textured'
  gel_type: string
  profile: 'low' | 'moderate' | 'moderate_plus' | 'high' | 'extra_high' | 'super_high'
  volume_range_cc: { min: number; max: number }
  base_width_range_mm?: { min: number; max: number }
  projection_mm?: number
  warranty_years?: number
  features: string[]
  technology: string[]
  ideal_for: string[]
  price_range_usd?: { min: number; max: number }
  product_url?: string
}

/**
 * SILIMED - Brasil
 * Líder en América Latina
 * https://silimed.com/es
 */
export const SILIMED_IMPLANTS: BreastImplantProduct[] = [
  {
    manufacturer: 'silimed',
    brand: 'Silimed',
    model: 'Polyurethane Round',
    type: 'round',
    surface: 'textured',
    gel_type: 'Silicone Gel Cohesive',
    profile: 'moderate',
    volume_range_cc: { min: 100, max: 800 },
    base_width_range_mm: { min: 95, max: 165 },
    warranty_years: 10,
    features: [
      'Cobertura de poliuretano',
      'Menor índice de contractura capsular',
      'Integración biológica con tejido',
      'No rotación (para anatómicos)'
    ],
    technology: [
      'Poliuretano biocompatible',
      'Superficie altamente texturizada',
      'Gel cohesivo de alta densidad'
    ],
    ideal_for: [
      'Pacientes con riesgo de contractura capsular',
      'Reconstrucción post-mastectomía',
      'Pacientes con piel fina'
    ],
    price_range_usd: { min: 1200, max: 2500 },
    product_url: 'https://silimed.com/es/productos/implantes-mamarios/'
  },
  {
    manufacturer: 'silimed',
    brand: 'Silimed',
    model: 'Polyurethane Anatomical',
    type: 'anatomical',
    surface: 'textured',
    gel_type: 'Silicone Gel Cohesive',
    profile: 'high',
    volume_range_cc: { min: 150, max: 600 },
    warranty_years: 10,
    features: [
      'Forma de gota natural',
      'Cobertura de poliuretano',
      'Proyección variable',
      'No rotación'
    ],
    technology: [
      'Gel cohesivo de memoria de forma',
      'Poliuretano de célula abierta',
      'Diseño anatómico'
    ],
    ideal_for: [
      'Reconstrucción mamaria',
      'Pacientes con poco tejido mamario',
      'Resultado natural'
    ],
    price_range_usd: { min: 1500, max: 3000 }
  },
  {
    manufacturer: 'silimed',
    brand: 'Silimed',
    model: 'Silk Surface Round',
    type: 'round',
    surface: 'smooth',
    gel_type: 'Silicone Gel Soft Touch',
    profile: 'moderate_plus',
    volume_range_cc: { min: 120, max: 700 },
    warranty_years: 10,
    features: [
      'Superficie lisa suave',
      'Tacto natural',
      'Menor fricción',
      'Movilidad natural'
    ],
    technology: [
      'Silk Surface Technology',
      'Gel Soft Touch',
      'Cubierta de silicona premium'
    ],
    ideal_for: [
      'Aumento estético primario',
      'Pacientes jóvenes',
      'Resultado con movimiento natural'
    ],
    price_range_usd: { min: 1000, max: 2200 }
  }
]

/**
 * MOTIVA - Establishment Labs (Costa Rica)
 * Tecnología de vanguardia, RFID integrado
 * https://motiva.health/es
 */
export const MOTIVA_IMPLANTS: BreastImplantProduct[] = [
  {
    manufacturer: 'motiva',
    brand: 'Motiva',
    model: 'Ergonomix®',
    type: 'ergonomic',
    surface: 'smooth',
    gel_type: 'ProgressiveGel® ULTIMA',
    profile: 'moderate',
    volume_range_cc: { min: 125, max: 800 },
    warranty_years: 10,
    features: [
      '🔥 ERGONÓMICO: Redondo acostada, gota de pie',
      'Movimiento natural como tejido mamario',
      'RFID Qid® integrado (identificación electrónica)',
      'TrueMonobloc® (gel + cubierta unidos)',
      'BluSeal® (barrera de seguridad azul)',
      'SmoothSilk®/SilkSurface® (biocompatibilidad)',
      'Warranty: Always Confident®'
    ],
    technology: [
      'ProgressiveGel ULTIMA (viscoelástico único)',
      'RFID Qid® (identificación sin cirugía)',
      'TrueMonobloc (estructura cohesiva)',
      'BluSeal (prevención difusión)',
      'SmoothSilk Surface (respuesta inflamatoria mínima)'
    ],
    ideal_for: [
      'Resultado natural y dinámico',
      'Pacientes que buscan lo más avanzado',
      'Seguimiento con tecnología RFID',
      'Biocompatibilidad máxima'
    ],
    price_range_usd: { min: 3500, max: 6000 },
    product_url: 'https://motiva.health/es/patients-implant-overview/'
  },
  {
    manufacturer: 'motiva',
    brand: 'Motiva',
    model: 'Ergonomix2®',
    type: 'ergonomic',
    surface: 'smooth',
    gel_type: 'ProgressiveGel® ULTIMA (mejorado)',
    profile: 'moderate_plus',
    volume_range_cc: { min: 125, max: 800 },
    warranty_years: 10,
    features: [
      '🚀 ÚLTIMA GENERACIÓN (2023+)',
      'Motiva SuperSilicones® (mejor flexibilidad)',
      'TrueMonobloc+® (versión superior)',
      'BluSeal+® (barrera mejorada)',
      'Compresión mayor para incisiones MÁS PEQUEÑAS',
      'Ergonomía mejorada vs Ergonomix',
      'RFID Qid® integrado'
    ],
    technology: [
      'SuperSilicones (nueva fórmula de silicona)',
      'TrueMonobloc+ (cohesión superior)',
      'BluSeal+ (mejor barrera difusión)',
      'Compresión hasta 40% más que Ergonomix',
      'Motiva MinimalScar® compatible'
    ],
    ideal_for: [
      'Incisiones mínimas (MinimalScar)',
      'Máxima tecnología disponible',
      'Pacientes exigentes',
      'Cirugía de mínimo acceso'
    ],
    price_range_usd: { min: 4000, max: 7000 },
    product_url: 'https://motiva.health/es/patients-implant-overview/'
  },
  {
    manufacturer: 'motiva',
    brand: 'Motiva',
    model: 'Round Plus',
    type: 'round',
    surface: 'smooth',
    gel_type: 'ProgressiveGel® PLUS',
    profile: 'high',
    volume_range_cc: { min: 125, max: 800 },
    warranty_years: 10,
    features: [
      'Polo superior más pleno y redondo',
      'Gel PLUS (equilibrio suavidad/firmeza)',
      'RFID Qid® integrado',
      'TrueMonobloc®',
      'BluSeal®',
      'SmoothSilk®'
    ],
    technology: [
      'ProgressiveGel PLUS',
      'TrueMonobloc',
      'BluSeal',
      'RFID Qid®'
    ],
    ideal_for: [
      'Pacientes que prefieren forma redonda clásica',
      'Polo superior más lleno',
      'Escote pronunciado'
    ],
    price_range_usd: { min: 3200, max: 5500 }
  }
]

/**
 * MENTOR - Johnson & Johnson (USA)
 * Aprobado FDA, líder mundial
 * https://breastimplantsbymentor.net/es-419
 */
export const MENTOR_IMPLANTS: BreastImplantProduct[] = [
  {
    manufacturer: 'mentor',
    brand: 'Mentor',
    model: 'MemoryGel®',
    type: 'round',
    surface: 'smooth',
    gel_type: 'MemoryGel® Cohesive',
    profile: 'moderate',
    volume_range_cc: { min: 125, max: 800 },
    base_width_range_mm: { min: 95, max: 165 },
    warranty_years: 10,
    features: [
      'Gel cohesivo de "memoria"',
      'Aprobado FDA',
      'Tacto natural',
      'Amplia gama de tamaños',
      'Garantía de por vida'
    ],
    technology: [
      'MemoryGel Technology',
      'Cohesive Gel',
      'Smooth Surface'
    ],
    ideal_for: [
      'Aumento primario',
      'Pacientes USA (FDA)',
      'Preferencia por marca reconocida',
      'Tacto suave'
    ],
    price_range_usd: { min: 1800, max: 3500 },
    product_url: 'https://breastimplantsbymentor.net/es-419/products'
  },
  {
    manufacturer: 'mentor',
    brand: 'Mentor',
    model: 'MemoryShape®',
    type: 'anatomical',
    surface: 'textured',
    gel_type: 'MemoryGel® Form-Stable',
    profile: 'high',
    volume_range_cc: { min: 145, max: 670 },
    warranty_years: 10,
    features: [
      'Gel altamente cohesivo (forma estable)',
      'Forma anatómica (gota)',
      'Textura Siltex® (previene rotación)',
      'Aprobado FDA',
      'Proyección personalizable'
    ],
    technology: [
      'Form-Stable Gel (mantiene forma)',
      'Siltex Texturing',
      'Diseño anatómico avanzado'
    ],
    ideal_for: [
      'Reconstrucción post-mastectomía',
      'Resultado natural',
      'Pacientes con poco tejido',
      'Proyección específica'
    ],
    price_range_usd: { min: 2200, max: 4500 }
  },
  {
    manufacturer: 'mentor',
    brand: 'Mentor',
    model: 'MemoryGel® Xtra',
    type: 'round',
    surface: 'smooth',
    gel_type: 'MemoryGel® Xtra Cohesive',
    profile: 'extra_high',
    volume_range_cc: { min: 195, max: 800 },
    warranty_years: 10,
    features: [
      'MÁXIMA PROYECCIÓN',
      'Gel extra cohesivo',
      'Polo superior muy lleno',
      'Forma muy redonda',
      'Aprobado FDA'
    ],
    technology: [
      'Xtra Cohesive Gel',
      'Extra High Profile Design',
      'Smooth Surface'
    ],
    ideal_for: [
      'Pacientes que desean máxima proyección',
      'Tórax estrecho',
      'Look "glamoroso"',
      'Fitness/fitness competitors'
    ],
    price_range_usd: { min: 2000, max: 4000 }
  },
  {
    manufacturer: 'mentor',
    brand: 'Mentor',
    model: 'CPG® (Contour Profile Gel)',
    type: 'round',
    surface: 'textured',
    gel_type: 'Contour Profile Gel',
    profile: 'moderate_plus',
    volume_range_cc: { min: 125, max: 800 },
    warranty_years: 10,
    features: [
      'Perfil de contorno optimizado',
      'Textura Siltex®',
      'Gel cohesivo',
      'Forma estable',
      'Proyección balanceada'
    ],
    technology: [
      'Contour Profile Technology',
      'Siltex Texturing',
      'Cohesive Gel'
    ],
    ideal_for: [
      'Balance entre proyección y naturalidad',
      'Pacientes que prefieren textura',
      'Resultado predecible'
    ],
    price_range_usd: { min: 1900, max: 3800 }
  }
]

/**
 * FUNCIÓN: Recomendar implante específico según análisis
 */
export function recommendSpecificImplant(
  volume_cc: number,
  profile: string,
  patient_preference: 'natural' | 'glamorous' | 'technology' | 'budget',
  budget_usd?: number
): BreastImplantProduct[] {
  const allImplants = [...SILIMED_IMPLANTS, ...MOTIVA_IMPLANTS, ...MENTOR_IMPLANTS]
  
  // Filtrar por volumen y perfil
  let filtered = allImplants.filter(implant => {
    const volumeMatch = volume_cc >= implant.volume_range_cc.min && volume_cc <= implant.volume_range_cc.max
    const profileMatch = implant.profile === profile || 
                        (profile === 'moderate' && implant.profile === 'moderate_plus')
    return volumeMatch && profileMatch
  })
  
  // Filtrar por preferencia
  if (patient_preference === 'technology') {
    filtered = filtered.filter(i => i.manufacturer === 'motiva')
  } else if (patient_preference === 'budget') {
    filtered = filtered.filter(i => i.manufacturer === 'silimed')
  } else if (patient_preference === 'natural') {
    filtered = filtered.filter(i => 
      i.type === 'ergonomic' || 
      i.type === 'anatomical' ||
      i.model.includes('MemoryShape')
    )
  } else if (patient_preference === 'glamorous') {
    filtered = filtered.filter(i => 
      i.profile === 'high' || 
      i.profile === 'extra_high' ||
      i.model.includes('Xtra')
    )
  }
  
  // Filtrar por presupuesto
  if (budget_usd) {
    filtered = filtered.filter(i => 
      i.price_range_usd && i.price_range_usd.min <= budget_usd
    )
  }
  
  // Ordenar por precio (menor a mayor)
  filtered.sort((a, b) => {
    const priceA = a.price_range_usd?.min || 0
    const priceB = b.price_range_usd?.min || 0
    return priceA - priceB
  })
  
  return filtered.slice(0, 5) // Top 5 opciones
}

/**
 * FUNCIÓN: Comparar implantes
 */
export function compareImplants(implants: BreastImplantProduct[]): {
  comparison_table: Record<string, any>[]
  best_for_technology: BreastImplantProduct
  best_for_budget: BreastImplantProduct
  best_for_natural: BreastImplantProduct
} {
  const comparison_table = implants.map(imp => ({
    marca: `${imp.brand} ${imp.model}`,
    tipo: imp.type,
    superficie: imp.surface,
    gel: imp.gel_type,
    perfil: imp.profile,
    volumen: `${imp.volume_range_cc.min}-${imp.volume_range_cc.max}cc`,
    precio: imp.price_range_usd ? `$${imp.price_range_usd.min}-${imp.price_range_usd.max}` : 'N/A',
    garantia: `${imp.warranty_years || 0} años`,
    destacado: imp.features[0]
  }))
  
  const motivaErgonomix = implants.find(i => i.model === 'Ergonomix2®') || implants[0]
  const silimed = implants.find(i => i.manufacturer === 'silimed') || implants[0]
  const ergonomic = implants.find(i => i.type === 'ergonomic') || implants[0]
  
  return {
    comparison_table,
    best_for_technology: motivaErgonomix,
    best_for_budget: silimed,
    best_for_natural: ergonomic
  }
}

// ====================
// IMPLANTES GLÚTEOS
// ====================

export interface GlutealImplantProduct {
  manufacturer: 'silimed' | 'motiva' | 'mentor'
  model: string
  shape: 'round' | 'oval' | 'anatomical'
  volume_cc: number
  dimensions_mm: { width: number; height: number; projection: number }
  surface: 'smooth' | 'textured'
  placement: 'submuscular' | 'subfascial'
  features: string[]
  price_usd?: number
}

export const GLUTEAL_IMPLANTS: GlutealImplantProduct[] = [
  {
    manufacturer: 'silimed',
    model: 'Silimed Gluteal Round',
    shape: 'round',
    volume_cc: 300,
    dimensions_mm: { width: 120, height: 120, projection: 40 },
    surface: 'textured',
    placement: 'submuscular',
    features: [
      'Forma redonda para proyección uniforme',
      'Textura de poliuretano',
      'Integración biológica',
      'No rotación'
    ],
    price_usd: 2500
  },
  {
    manufacturer: 'silimed',
    model: 'Silimed Gluteal Oval',
    shape: 'oval',
    volume_cc: 400,
    dimensions_mm: { width: 130, height: 140, projection: 45 },
    surface: 'textured',
    placement: 'submuscular',
    features: [
      'Forma ovalada anatómica',
      'Proyección central aumentada',
      'Resultado natural',
      'Cobertura de poliuretano'
    ],
    price_usd: 2800
  },
  {
    manufacturer: 'motiva',
    model: 'Motiva GlutealArmonic®',
    shape: 'anatomical',
    volume_cc: 350,
    dimensions_mm: { width: 125, height: 135, projection: 42 },
    surface: 'textured',
    placement: 'subfascial',
    features: [
      '🔥 Diseño anatómico armónico',
      'Gel cohesivo de alta densidad',
      'Forma ergonómica',
      'Biocompatibilidad Motiva'
    ],
    price_usd: 4500
  }
]

// ====================
// IMPLANTES DE PANTORRILLA
// ====================

export interface CalfImplantProduct {
  manufacturer: 'silimed' | 'implantech'
  model: string
  type: 'medial' | 'lateral' | 'bilateral'
  volume_cc: number
  dimensions_mm: { length: number; width: number; thickness: number }
  material: 'solid_silicone' | 'gel_filled'
  features: string[]
  price_usd?: number
}

export const CALF_IMPLANTS: CalfImplantProduct[] = [
  {
    manufacturer: 'silimed',
    model: 'Silimed Calf Medial',
    type: 'medial',
    volume_cc: 120,
    dimensions_mm: { length: 140, width: 50, thickness: 25 },
    material: 'solid_silicone',
    features: [
      'Silicona sólida anatómica',
      'Posición medial (más visible)',
      'Forma preconfigurada',
      'Incisión en pliegue posterior rodilla'
    ],
    price_usd: 1800
  },
  {
    manufacturer: 'silimed',
    model: 'Silimed Calf Bilateral',
    type: 'bilateral',
    volume_cc: 100,
    dimensions_mm: { length: 130, width: 45, thickness: 20 },
    material: 'solid_silicone',
    features: [
      'Par medial + lateral',
      'Aumento completo de pantorrilla',
      'Resultado atlético',
      'Silicona sólida'
    ],
    price_usd: 3200
  }
]

/**
 * TODAS LAS MARCAS EN UN OBJETO
 */
export const IMPLANT_CATALOG = {
  breast: {
    silimed: SILIMED_IMPLANTS,
    motiva: MOTIVA_IMPLANTS,
    mentor: MENTOR_IMPLANTS
  },
  gluteal: GLUTEAL_IMPLANTS,
  calf: CALF_IMPLANTS
}

export const MANUFACTURER_INFO = {
  silimed: {
    name: 'Silimed',
    country: 'Brasil',
    founded: 1978,
    specialty: 'Poliuretano, América Latina',
    website: 'https://silimed.com/es',
    reputation: 'Líder en LATAM, excelente calidad-precio'
  },
  motiva: {
    name: 'Motiva® (Establishment Labs)',
    country: 'Costa Rica',
    founded: 2004,
    specialty: 'Tecnología avanzada, RFID, Ergonomix',
    website: 'https://motiva.health/es',
    reputation: 'Premium, última generación, más caro'
  },
  mentor: {
    name: 'Mentor® (Johnson & Johnson)',
    country: 'USA',
    founded: 1969,
    specialty: 'Aprobación FDA, estándar mundial',
    website: 'https://breastimplantsbymentor.net/es-419',
    reputation: 'Marca más reconocida, confiable'
  }
}
