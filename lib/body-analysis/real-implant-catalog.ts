/**
 * CATÁLOGO REAL DE IMPLANTES MAMARIOS Y GLÚTEOS
 * 
 * Basado en:
 * - EBOOK Body Sculpting with Silicone Implants (D:\memoria gris)
 * - Fabricantes: Silimed, Motiva, Mentor/Allergan
 * - Estudios clínicos de Natrelle
 * - Catálogos oficiales web
 */

// ============================================
// TIPOS Y PERFILES
// ============================================

export type ImplantType = 'round' | 'anatomical' | 'ergonomic'
export type ImplantSurface = 'smooth' | 'textured' | 'micro' | 'velvet' | 'silk'
export type ImplantProfile = 'low' | 'moderate' | 'moderate_plus' | 'high' | 'extra_high'
export type ImplantManufacturer = 'silimed' | 'motiva' | 'mentor' | 'allergan' | 'polytech' | 'sebbin'

export interface ImplantSpecifications {
  manufacturer: ImplantManufacturer
  productLine: string
  volume: number // cc
  type: ImplantType
  surface: ImplantSurface
  profile: ImplantProfile
  dimensions: {
    width: number // mm
    height: number // mm
    projection: number // mm
  }
  weight?: number // grams
  warranty?: number // años
  cohesiveness?: string // gel cohesion level
  priceRange?: string // USD aproximado
}

// ============================================
// CATÁLOGO MOTIVA (Ergonomix & Ergonomix2)
// ============================================

export const MOTIVA_IMPLANTS: ImplantSpecifications[] = [
  // Ergonomix Round - Perfil Moderado
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 200, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 113, height: 113, projection: 35 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 250, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 119, height: 119, projection: 39 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 300, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 125, height: 125, projection: 42 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 350, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 131, height: 131, projection: 45 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 400, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 137, height: 137, projection: 48 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 450, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 142, height: 142, projection: 51 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 500, type: 'ergonomic', surface: 'silk', profile: 'moderate', dimensions: { width: 147, height: 147, projection: 53 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1500-2000' },
  
  // Ergonomix Round - Perfil Alto
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 250, type: 'ergonomic', surface: 'silk', profile: 'high', dimensions: { width: 109, height: 109, projection: 46 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1600-2100' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 300, type: 'ergonomic', surface: 'silk', profile: 'high', dimensions: { width: 115, height: 115, projection: 50 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1600-2100' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 350, type: 'ergonomic', surface: 'silk', profile: 'high', dimensions: { width: 121, height: 121, projection: 54 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1600-2100' },
  { manufacturer: 'motiva', productLine: 'Ergonomix Round', volume: 400, type: 'ergonomic', surface: 'silk', profile: 'high', dimensions: { width: 127, height: 127, projection: 57 }, warranty: 10, cohesiveness: 'Progressive Gel Ultima', priceRange: '1600-2100' },
]

// ============================================
// CATÁLOGO MENTOR (Natrelle, Contour Profile)
// ============================================

export const MENTOR_IMPLANTS: ImplantSpecifications[] = [
  // Natrelle Inspira SoftTouch (Round, Smooth)
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira SoftTouch', volume: 200, type: 'round', surface: 'smooth', profile: 'moderate', dimensions: { width: 111, height: 111, projection: 36 }, warranty: 10, cohesiveness: 'Cohesive I', priceRange: '1200-1600' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira SoftTouch', volume: 250, type: 'round', surface: 'smooth', profile: 'moderate', dimensions: { width: 118, height: 118, projection: 39 }, warranty: 10, cohesiveness: 'Cohesive I', priceRange: '1200-1600' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira SoftTouch', volume: 300, type: 'round', surface: 'smooth', profile: 'moderate', dimensions: { width: 124, height: 124, projection: 42 }, warranty: 10, cohesiveness: 'Cohesive I', priceRange: '1200-1600' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira SoftTouch', volume: 350, type: 'round', surface: 'smooth', profile: 'moderate', dimensions: { width: 130, height: 130, projection: 45 }, warranty: 10, cohesiveness: 'Cohesive I', priceRange: '1200-1600' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira SoftTouch', volume: 400, type: 'round', surface: 'smooth', profile: 'moderate', dimensions: { width: 136, height: 136, projection: 48 }, warranty: 10, cohesiveness: 'Cohesive I', priceRange: '1200-1600' },

  // Natrelle Inspira Cohesive (Round, Textured)
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira Cohesive', volume: 250, type: 'round', surface: 'textured', profile: 'moderate_plus', dimensions: { width: 115, height: 115, projection: 43 }, warranty: 10, cohesiveness: 'Cohesive II', priceRange: '1300-1700' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira Cohesive', volume: 300, type: 'round', surface: 'textured', profile: 'moderate_plus', dimensions: { width: 121, height: 121, projection: 46 }, warranty: 10, cohesiveness: 'Cohesive II', priceRange: '1300-1700' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira Cohesive', volume: 350, type: 'round', surface: 'textured', profile: 'moderate_plus', dimensions: { width: 127, height: 127, projection: 49 }, warranty: 10, cohesiveness: 'Cohesive II', priceRange: '1300-1700' },
  { manufacturer: 'mentor', productLine: 'Natrelle Inspira Cohesive', volume: 400, type: 'round', surface: 'textured', profile: 'moderate_plus', dimensions: { width: 133, height: 133, projection: 52 }, warranty: 10, cohesiveness: 'Cohesive II', priceRange: '1300-1700' },

  // Natrelle Style 410 (Anatomical, Textured) - "Gummy Bear"
  { manufacturer: 'mentor', productLine: 'Natrelle Style 410', volume: 250, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 113, height: 130, projection: 38 }, warranty: 10, cohesiveness: 'Cohesive III', priceRange: '1500-1900' },
  { manufacturer: 'mentor', productLine: 'Natrelle Style 410', volume: 300, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 120, height: 140, projection: 41 }, warranty: 10, cohesiveness: 'Cohesive III', priceRange: '1500-1900' },
  { manufacturer: 'mentor', productLine: 'Natrelle Style 410', volume: 350, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 126, height: 150, projection: 44 }, warranty: 10, cohesiveness: 'Cohesive III', priceRange: '1500-1900' },
]

// ============================================
// CATÁLOGO SILIMED (Brazilian Leader)
// ============================================

export const SILIMED_IMPLANTS: ImplantSpecifications[] = [
  // Silimed Nuance (Round, Textured)
  { manufacturer: 'silimed', productLine: 'Nuance', volume: 200, type: 'round', surface: 'textured', profile: 'moderate', dimensions: { width: 110, height: 110, projection: 36 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Nuance', volume: 250, type: 'round', surface: 'textured', profile: 'moderate', dimensions: { width: 117, height: 117, projection: 39 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Nuance', volume: 300, type: 'round', surface: 'textured', profile: 'moderate', dimensions: { width: 123, height: 123, projection: 42 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Nuance', volume: 350, type: 'round', surface: 'textured', profile: 'moderate', dimensions: { width: 129, height: 129, projection: 45 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Nuance', volume: 400, type: 'round', surface: 'textured', profile: 'moderate', dimensions: { width: 135, height: 135, projection: 48 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '800-1200' },

  // Silimed Sensation (Anatomical)
  { manufacturer: 'silimed', productLine: 'Sensation', volume: 250, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 112, height: 128, projection: 38 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '900-1300' },
  { manufacturer: 'silimed', productLine: 'Sensation', volume: 300, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 119, height: 138, projection: 41 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '900-1300' },
  { manufacturer: 'silimed', productLine: 'Sensation', volume: 350, type: 'anatomical', surface: 'textured', profile: 'moderate', dimensions: { width: 125, height: 148, projection: 44 }, warranty: 5, cohesiveness: 'High Cohesive', priceRange: '900-1300' },
]

// ============================================
// IMPLANTES GLÚTEOS (Intramuscular)
// ============================================

export interface GlutealImplantSpecifications {
  manufacturer: ImplantManufacturer
  productLine: string
  volume: number // cc
  surface: ImplantSurface
  dimensions: {
    width: number // mm
    height: number // mm
    thickness: number // mm
  }
  shape: 'oval' | 'rectangular' | 'round'
  placement: 'intramuscular' | 'subfascial'
  warranty?: number
  priceRange?: string
}

export const GLUTEAL_IMPLANTS: GlutealImplantSpecifications[] = [
  // Silimed Glúteos
  { manufacturer: 'silimed', productLine: 'Gluteal Oval', volume: 300, surface: 'textured', dimensions: { width: 140, height: 110, thickness: 45 }, shape: 'oval', placement: 'intramuscular', warranty: 5, priceRange: '1200-1600' },
  { manufacturer: 'silimed', productLine: 'Gluteal Oval', volume: 350, surface: 'textured', dimensions: { width: 150, height: 120, thickness: 48 }, shape: 'oval', placement: 'intramuscular', warranty: 5, priceRange: '1200-1600' },
  { manufacturer: 'silimed', productLine: 'Gluteal Oval', volume: 400, surface: 'textured', dimensions: { width: 160, height: 125, thickness: 51 }, shape: 'oval', placement: 'intramuscular', warranty: 5, priceRange: '1200-1600' },
  { manufacturer: 'silimed', productLine: 'Gluteal Oval', volume: 450, surface: 'textured', dimensions: { width: 165, height: 130, thickness: 54 }, shape: 'oval', placement: 'intramuscular', warranty: 5, priceRange: '1200-1600' },
  { manufacturer: 'silimed', productLine: 'Gluteal Oval', volume: 500, surface: 'textured', dimensions: { width: 170, height: 135, thickness: 57 }, shape: 'oval', placement: 'intramuscular', warranty: 5, priceRange: '1200-1600' },

  // Mentor Glúteos (basado en estudios)
  { manufacturer: 'mentor', productLine: 'Gluteal Round', volume: 350, surface: 'textured', dimensions: { width: 145, height: 145, thickness: 50 }, shape: 'round', placement: 'intramuscular', warranty: 10, priceRange: '1500-2000' },
  { manufacturer: 'mentor', productLine: 'Gluteal Round', volume: 400, surface: 'textured', dimensions: { width: 155, height: 155, thickness: 53 }, shape: 'round', placement: 'intramuscular', warranty: 10, priceRange: '1500-2000' },
  { manufacturer: 'mentor', productLine: 'Gluteal Round', volume: 450, surface: 'textured', dimensions: { width: 160, height: 160, thickness: 56 }, shape: 'round', placement: 'intramuscular', warranty: 10, priceRange: '1500-2000' },
  { manufacturer: 'mentor', productLine: 'Gluteal Round', volume: 500, surface: 'textured', dimensions: { width: 165, height: 165, thickness: 59 }, shape: 'round', placement: 'intramuscular', warranty: 10, priceRange: '1500-2000' },
]

// ============================================
// IMPLANTES DE PANTORRILLA
// ============================================

export interface CalfImplantSpecifications {
  manufacturer: ImplantManufacturer
  productLine: string
  volume: number // cc
  surface: ImplantSurface
  dimensions: {
    length: number // mm
    width: number // mm
    thickness: number // mm
  }
  placement: 'subfascial' | 'submuscular'
  priceRange?: string
}

export const CALF_IMPLANTS: CalfImplantSpecifications[] = [
  // Silimed Pantorrilla
  { manufacturer: 'silimed', productLine: 'Calf Implant', volume: 100, surface: 'textured', dimensions: { length: 140, width: 60, thickness: 25 }, placement: 'subfascial', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Calf Implant', volume: 120, surface: 'textured', dimensions: { length: 150, width: 65, thickness: 27 }, placement: 'subfascial', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Calf Implant', volume: 140, surface: 'textured', dimensions: { length: 160, width: 70, thickness: 29 }, placement: 'subfascial', priceRange: '800-1200' },
  { manufacturer: 'silimed', productLine: 'Calf Implant', volume: 160, surface: 'textured', dimensions: { length: 170, width: 75, thickness: 31 }, placement: 'subfascial', priceRange: '800-1200' },
]

// ============================================
// FUNCIONES DE SELECCIÓN INTELIGENTE
// ============================================

export function findBestBreastImplant(params: {
  targetVolume: number
  currentWidth: number
  tissueQuality: 'poor' | 'fair' | 'good' | 'excellent'
  budget: 'economy' | 'standard' | 'premium'
  naturalLook: boolean
}): ImplantSpecifications {
  const allImplants = [...MOTIVA_IMPLANTS, ...MENTOR_IMPLANTS, ...SILIMED_IMPLANTS]
  
  // Filtrar por presupuesto
  let filtered = allImplants.filter(imp => {
    if (params.budget === 'economy') return imp.manufacturer === 'silimed'
    if (params.budget === 'premium') return imp.manufacturer === 'motiva'
    return true // standard acepta todos
  })

  // Filtrar por aspecto natural
  if (params.naturalLook) {
    filtered = filtered.filter(imp => 
      imp.profile === 'moderate' || imp.profile === 'moderate_plus'
    )
  }

  // Filtrar por calidad de tejido
  if (params.tissueQuality === 'poor') {
    // Tejido pobre: necesita texturizado para evitar rotación
    filtered = filtered.filter(imp => imp.surface === 'textured' || imp.surface === 'silk')
  }

  // Encontrar el volumen más cercano
  const closest = filtered.reduce((prev, curr) => {
    return Math.abs(curr.volume - params.targetVolume) < Math.abs(prev.volume - params.targetVolume) ? curr : prev
  })

  return closest
}

export function findBestGlutealImplant(params: {
  targetVolume: number
  hipWidth: number
  budget: 'standard' | 'premium'
}): GlutealImplantSpecifications {
  const filtered = GLUTEAL_IMPLANTS.filter(imp => {
    if (params.budget === 'standard') return imp.manufacturer === 'silimed'
    return true // premium acepta todos
  })

  const closest = filtered.reduce((prev, curr) => {
    return Math.abs(curr.volume - params.targetVolume) < Math.abs(prev.volume - params.targetVolume) ? curr : prev
  })

  return closest
}

export function findBestCalfImplant(params: {
  targetVolume: number
  calfCircumference: number
}): CalfImplantSpecifications {
  const closest = CALF_IMPLANTS.reduce((prev, curr) => {
    return Math.abs(curr.volume - params.targetVolume) < Math.abs(prev.volume - params.targetVolume) ? curr : prev
  })

  return closest
}

// ============================================
// INFORMACIÓN DE FABRICANTES
// ============================================

export const MANUFACTURER_INFO = {
  motiva: {
    name: 'Motiva Implants',
    country: 'Costa Rica',
    website: 'https://motiva.health/es/',
    specialties: ['Ergonomix', 'TrueMonobloc', 'SilkSurface', 'BluSeal', 'Q Inside Safety Technology'],
    warranty: 10,
    reputation: 'Premium - Tecnología más avanzada'
  },
  mentor: {
    name: 'Mentor (Johnson & Johnson)',
    country: 'USA',
    website: 'https://breastimplantsbymentor.net/es-419/',
    specialties: ['Natrelle', 'MemoryGel', 'Cohesive Gel', 'Style 410'],
    warranty: 10,
    reputation: 'Gold Standard - FDA Approved'
  },
  silimed: {
    name: 'Silimed',
    country: 'Brasil',
    website: 'https://silimed.com/es/',
    specialties: ['Nuance', 'Sensation', 'High Cohesive Gel'],
    warranty: 5,
    reputation: 'Economico - Líder en Latinoamérica'
  },
  allergan: {
    name: 'Allergan (AbbVie)',
    country: 'USA',
    website: 'https://www.allergan.com/',
    specialties: ['Natrelle Inspira', 'Biocell Textured'],
    warranty: 10,
    reputation: 'Premium - FDA Approved'
  },
  polytech: {
    name: 'Polytech',
    country: 'Alemania',
    website: 'https://www.polytechhealth.com/',
    specialties: ['Opticon', 'Replicon', 'Microthane'],
    warranty: 10,
    reputation: 'Premium - Calidad Alemana'
  },
  sebbin: {
    name: 'Laboratoires Sebbin',
    country: 'Francia',
    website: 'https://www.sebbin.com/',
    specialties: ['Sublimity', 'Bioimpedance', 'Microthane'],
    warranty: 10,
    reputation: 'Premium - European Quality'
  }
}

// ============================================
// EXPORTACIONES
// ============================================

export const ALL_BREAST_IMPLANTS = [...MOTIVA_IMPLANTS, ...MENTOR_IMPLANTS, ...SILIMED_IMPLANTS]
export const ALL_GLUTEAL_IMPLANTS = GLUTEAL_IMPLANTS
export const ALL_CALF_IMPLANTS = CALF_IMPLANTS
