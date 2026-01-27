/**
 * Analizador de Salud Dérmica según Zein Obagi
 * Basado en: The Art of Skin Health Restoration and Rejuvenation
 */

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

/**
 * Analiza salud de la piel usando el sistema Obagi
 */
export function analyzeObagiSkin(imageData: any, age: number): ObagiSkinAnalysis {
  // Análisis según los 6 parámetros de Obagi
  const pigmentation = analyzePigmentation(imageData)
  const elasticity = analyzeElasticity(imageData, age)
  const hydration = analyzeHydration(imageData)
  const texture = analyzeTexture(imageData)
  const barrier = analyzeBarrier(imageData)
  const collagen = analyzeCollagen(imageData, age)
  
  const averageScore = (
    pigmentation.score +
    elasticity.score +
    hydration.score +
    texture.score +
    barrier.score +
    collagen.score
  ) / 6
  
  const obagiClassification = classifyObagiType(imageData)
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

function analyzePigmentation(imageData: any): SkinParameter {
  const score = 60 + Math.random() * 30 // Simulación
  
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

function analyzeElasticity(imageData: any, age: number): SkinParameter {
  const baseScore = Math.max(100 - age * 0.8, 30)
  const score = baseScore + (Math.random() * 20 - 10)
  
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

function analyzeHydration(imageData: any): SkinParameter {
  const score = 50 + Math.random() * 40
  
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

function analyzeTexture(imageData: any): SkinParameter {
  const score = 55 + Math.random() * 35
  
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

function analyzeBarrier(imageData: any): SkinParameter {
  const score = 60 + Math.random() * 30
  
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

function analyzeCollagen(imageData: any, age: number): SkinParameter {
  const baseScore = Math.max(100 - age * 1.0, 20)
  const score = baseScore + (Math.random() * 15 - 7)
  
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

function classifyObagiType(imageData: any): 'Type I' | 'Type II' | 'Type III' | 'Type IV' | 'Type V' | 'Type VI' {
  // Clasificación según fototipos Obagi (simulación)
  const types = ['Type I', 'Type II', 'Type III', 'Type IV', 'Type V', 'Type VI'] as const
  return types[Math.floor(Math.random() * 6)]
}

function generateObagiProtocol(score: number, obagiType: string): string {
  if (score < 40) {
    return 'Protocolo Intensivo Obagi: Nu-Derm System completo (12-16 semanas) + Blue Peel RADIANCE'
  } else if (score < 60) {
    return 'Protocolo Moderado Obagi: Professional-C + Retinol 0.5% + HA (8-12 semanas)'
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
