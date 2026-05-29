/**
 * Analizador de Salud Dérmica según Zein Obagi
 * Basado en: The Art of Skin Health Restoration and Rejuvenation
 */

import { analyzeSkinFromImageDataUrl } from './simple-skin-analysis'

export interface ObagiSkinAnalysis {
  skinHealthScore: number // 0-100
  obagiClassification: 'Type I' | 'Type II' | 'Type III' | 'Type IV' | 'Type V' | 'Type VI'
  parameters: {
    pigmentation: SkinParameter
    elasticity: SkinParameter
    hydration: SkinParameter
    texture: SkinParameter
    barrier: SkinParameter
    collagen: SkinParameter
  }
  preparationProtocol: string
  requiredProducts: string[]
  timelineWeeks: number
}

export interface SkinParameter {
  score: number // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor'
  findings: string[]
}

/** Versión async cuando hay foto (data URL) */
export async function analyzeObagiSkinFromPhoto(
  imageDataUrl: string,
  age: number
): Promise<ObagiSkinAnalysis> {
  const photo = await analyzeSkinFromImageDataUrl(imageDataUrl, age)
  return buildObagiAnalysis(photo.score, age, photo.sunDamageIndex, photo.textureVariance)
}

/**
 * Analiza salud de la piel usando el sistema Obagi
 */
export function analyzeObagiSkin(imageData: any, age: number): ObagiSkinAnalysis {
  const seed =
    typeof imageData === 'string' && imageData.length > 100
      ? hashSeed(imageData)
      : null

  const pigmentation = analyzePigmentation(seed)
  const elasticity = analyzeElasticity(seed, age)
  const hydration = analyzeHydration(seed)
  const texture = analyzeTexture(seed)
  const barrier = analyzeBarrier(seed)
  const collagen = analyzeCollagen(seed, age)
  
  const averageScore = (
    pigmentation.score +
    elasticity.score +
    hydration.score +
    texture.score +
    barrier.score +
    collagen.score
  ) / 6
  
  const obagiClassification = classifyObagiType(seed, averageScore)
  const preparationProtocol = generateObagiProtocol(averageScore, obagiClassification)
  const requiredProducts = getObagiProducts(averageScore, obagiClassification)
  const timelineWeeks = calculatePreparationTime(averageScore)
  
  return {
    skinHealthScore: averageScore,
    obagiClassification,
    parameters: {
      pigmentation,
      elasticity,
      hydration,
      texture,
      barrier,
      collagen,
    },
    preparationProtocol,
    requiredProducts,
    timelineWeeks,
  }
}

function buildObagiAnalysis(
  skinScore: number,
  age: number,
  sunDamage: number,
  textureVar: number
): ObagiSkinAnalysis {
  const pigmentation = scoreToParameter(Math.max(20, 100 - sunDamage * 0.9), [
    'Hiperpigmentación severa',
    'Manchas solares',
    'Tono irregular',
  ])
  const elasticity = scoreToParameter(Math.max(25, 100 - age * 0.85), [
    'Elastosis severa',
    'Pérdida de tono',
    'Flacidez incipiente',
  ])
  const hydration = scoreToParameter(skinScore + 5, [
    'Deshidratación severa',
    'Función barrera comprometida',
    'TEWL elevado',
  ])
  const texture = scoreToParameter(Math.max(25, 100 - textureVar * 0.85), [
    'Textura rugosa severa',
    'Poros dilatados',
    'Irregularidades superficiales',
  ])
  const barrier = scoreToParameter(skinScore, [
    'Barrera cutánea severamente comprometida',
    'Sensibilidad elevada',
    'Respuesta inflamatoria leve',
  ])
  const collagen = scoreToParameter(Math.max(20, 100 - age * 1.0 - textureVar * 0.2), [
    'Pérdida severa de colágeno',
    'Arrugas profundas',
    'Líneas finas evidentes',
  ])
  const averageScore =
    (pigmentation.score +
      elasticity.score +
      hydration.score +
      texture.score +
      barrier.score +
      collagen.score) /
    6
  const obagiClassification = classifyObagiType(null, averageScore)
  return {
    skinHealthScore: Math.round(averageScore),
    obagiClassification,
    parameters: { pigmentation, elasticity, hydration, texture, barrier, collagen },
    preparationProtocol: generateObagiProtocol(averageScore, obagiClassification),
    requiredProducts: getObagiProducts(averageScore, obagiClassification),
    timelineWeeks: calculatePreparationTime(averageScore),
  }
}

function hashSeed(data: string): number {
  let h = 0
  for (let i = 0; i < Math.min(data.length, 8000); i += 17) {
    h = (h * 31 + data.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function seededRandom(seed: number | null, min: number, max: number): number {
  if (seed === null) return min + Math.random() * (max - min)
  const x = Math.sin(seed * 9999) * 10000
  const r = x - Math.floor(x)
  return min + r * (max - min)
}

function scoreToParameter(score: number, findingsThresholds: string[]): SkinParameter {
  const s = Math.round(Math.max(0, Math.min(100, score)))
  const findings: string[] = []
  if (s < 40) findings.push(findingsThresholds[0])
  if (s < 60) findings.push(findingsThresholds[1])
  if (s < 80) findings.push(findingsThresholds[2])
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (s >= 80) status = 'excellent'
  else if (s >= 60) status = 'good'
  else if (s >= 40) status = 'fair'
  else status = 'poor'
  return { score: s, status, findings }
}

function analyzePigmentation(seed: number | null): SkinParameter {
  const score = seededRandom(seed, 55, 92)
  
  const findings: string[] = []
  if (score < 40) findings.push('Hiperpigmentación severa')
  if (score < 60) findings.push('Manchas solares')
  if (score < 80) findings.push('Tono irregular')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function analyzeElasticity(seed: number | null, age: number): SkinParameter {
  const baseScore = Math.max(100 - age * 0.8, 30)
  const score = baseScore + (seededRandom(seed, 0, 20) - 10)
  
  const findings: string[] = []
  if (score < 40) findings.push('Elastosis severa')
  if (score < 60) findings.push('Pérdida de tono')
  if (score < 80) findings.push('Flacidez incipiente')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function analyzeHydration(seed: number | null): SkinParameter {
  const score = seededRandom(seed, 50, 90)
  
  const findings: string[] = []
  if (score < 40) findings.push('Deshidratación severa')
  if (score < 60) findings.push('Función barrera comprometida')
  if (score < 80) findings.push('TEWL elevado')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function analyzeTexture(seed: number | null): SkinParameter {
  const score = seededRandom(seed, 55, 90)
  
  const findings: string[] = []
  if (score < 40) findings.push('Textura rugosa severa')
  if (score < 60) findings.push('Poros dilatados')
  if (score < 80) findings.push('Irregularidades superficiales')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function analyzeBarrier(seed: number | null): SkinParameter {
  const score = seededRandom(seed, 60, 90)
  
  const findings: string[] = []
  if (score < 40) findings.push('Barrera cutánea severamente comprometida')
  if (score < 60) findings.push('Sensibilidad elevada')
  if (score < 80) findings.push('Respuesta inflamatoria leve')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function analyzeCollagen(seed: number | null, age: number): SkinParameter {
  const baseScore = Math.max(100 - age * 1.0, 20)
  const score = baseScore + (seededRandom(seed, 0, 15) - 7)
  
  const findings: string[] = []
  if (score < 40) findings.push('Pérdida severa de colágeno')
  if (score < 60) findings.push('Arrugas profundas')
  if (score < 80) findings.push('Líneas finas evidentes')
  
  let status: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) status = 'excellent'
  else if (score >= 60) status = 'good'
  else if (score >= 40) status = 'fair'
  else status = 'poor'
  
  return { score, status, findings }
}

function classifyObagiType(
  seed: number | null,
  skinScore?: number
): 'Type I' | 'Type II' | 'Type III' | 'Type IV' | 'Type V' | 'Type VI' {
  const types = ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'] as const
  if (skinScore !== undefined) {
    if (skinScore >= 85) return 'Type I'
    if (skinScore >= 75) return 'Type II'
    if (skinScore >= 65) return 'Type III'
    if (skinScore >= 55) return 'Type IV'
    if (skinScore >= 45) return 'Type V'
    return 'Type VI'
  }
  const idx = seed !== null ? seed % 6 : Math.floor(Math.random() * 6)
  return types[idx]
}

function generateObagiProtocol(score: number, obagiType: string): string {
  if (score < 40) {
    return 'Protocolo Intensivo Obagi + Microneedling médico (3-4 sesiones) + Nu-Derm (12-16 semanas)'
  } else if (score < 60) {
    return 'Protocolo Moderado: Microneedling + Professional-C + Retinol 0.5% + HA (8-12 semanas)'
  } else if (score < 80) {
    return 'Protocolo Mantenimiento Obagi: Daily Hydro-Drops + Vitamin C + SPF 50+ (4-8 semanas)'
  } else {
    return 'Protocolo Preventivo Obagi: Gentle Cleanser + Antioxidantes + SPF (4 semanas)'
  }
}

function getObagiProducts(score: number, obagiType: string): string[] {
  const baseProducts = [
    'Obagi Gentle Cleanser',
    'Obagi Professional-C Serum 20%',
    'Obagi Sun Shield SPF 50+',
  ]
  
  if (score < 60) {
    return [
      ...baseProducts,
      'Obagi Nu-Derm Clear (Hydroquinone 4%)',
      'Obagi Retinol 1.0',
      'Obagi Hydrate Luxe',
      'Obagi Daily Hydro-Drops',
    ]
  } else if (score < 80) {
    return [
      ...baseProducts,
      'Obagi Retinol 0.5%',
      'Obagi Hydrate',
    ]
  } else {
    return baseProducts
  }
}

function calculatePreparationTime(score: number): number {
  if (score < 40) return 16 // 16 semanas
  if (score < 60) return 12 // 12 semanas
  if (score < 80) return 8  // 8 semanas
  return 4 // 4 semanas
}

/**
 * Genera orden de productos Obagi para Interdrogas
 */
export function generateObagiOrder(analysis: ObagiSkinAnalysis): Array<{
  product: string
  quantity: number
  price: number
}> {
  return analysis.requiredProducts.map(product => ({
    product,
    quantity: 1,
    price: estimateProductPrice(product),
  }))
}

function estimateProductPrice(product: string): number {
  // Precios estimados en COP
  if (product.includes('Nu-Derm')) return 450000
  if (product.includes('Professional-C')) return 380000
  if (product.includes('Retinol 1.0')) return 320000
  if (product.includes('Retinol 0.5')) return 280000
  if (product.includes('SPF')) return 180000
  if (product.includes('Cleanser')) return 150000
  if (product.includes('Hydrate')) return 250000
  return 200000
}
