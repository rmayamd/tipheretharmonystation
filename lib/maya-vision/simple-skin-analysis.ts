/**
 * Análisis básico de calidad dérmica a partir de la foto frontal (cliente).
 * Usa textura (desviación estándar de luminancia) y tono en mejillas/frente.
 */

export type SkinAnalysisResult = {
  score: number
  glogau: 1 | 2 | 3 | 4
  textureVariance: number
  sunDamageIndex: number
}

export async function analyzeSkinFromImageDataUrl(
  dataUrl: string,
  age?: number
): Promise<SkinAnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const maxW = 400
        const scale = maxW / img.width
        const w = maxW
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas no disponible'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        const { data } = ctx.getImageData(0, 0, w, h)

        const regions = [
          { x0: 0.32, x1: 0.68, y0: 0.28, y1: 0.52 },
          { x0: 0.22, x1: 0.42, y0: 0.38, y1: 0.58 },
          { x0: 0.58, x1: 0.78, y0: 0.38, y1: 0.58 },
        ]

        const luminances: number[] = []
        let sumR = 0
        let sumG = 0
        let sumB = 0
        let count = 0

        for (const region of regions) {
          const x0 = Math.floor(w * region.x0)
          const x1 = Math.floor(w * region.x1)
          const y0 = Math.floor(h * region.y0)
          const y1 = Math.floor(h * region.y1)

          for (let y = y0; y < y1; y += 2) {
            for (let x = x0; x < x1; x += 2) {
              const i = (y * w + x) * 4
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              const l = 0.299 * r + 0.587 * g + 0.114 * b
              if (l < 40 || l > 235) continue
              luminances.push(l)
              sumR += r
              sumG += g
              sumB += b
              count++
            }
          }
        }

        if (count < 80) {
          resolve(fallbackSkin(age))
          return
        }

        const meanL = luminances.reduce((a, b) => a + b, 0) / luminances.length
        let variance = 0
        for (const l of luminances) {
          variance += (l - meanL) ** 2
        }
        variance /= luminances.length
        const stdDev = Math.sqrt(variance)

        const avgR = sumR / count
        const avgG = sumG / count
        const avgB = sumB / count
        const redness = avgR / (avgG + 1)
        const melaninProxy = (avgR + avgG) / 2 - avgB
        const toneUnevenness = Math.min(100, Math.round(stdDev * 2.2))

        const textureVariance = Math.min(
          100,
          Math.max(0, Math.round((stdDev - 8) * 3.8))
        )
        const sunDamageIndex = Math.min(
          100,
          Math.max(
            0,
            Math.round(
              Math.max(0, redness - 1.02) * 35 +
                melaninProxy * 0.12 +
                toneUnevenness * 0.25 +
                Math.max(0, 128 - meanL) * 0.08
            )
          )
        )

        let score =
          92 -
          textureVariance * 0.38 -
          sunDamageIndex * 0.32 -
          toneUnevenness * 0.12
        if (age) {
          score -= Math.max(0, age - 28) * 0.28
        }
        score = Math.round(Math.max(35, Math.min(94, score)))

        const glogau: 1 | 2 | 3 | 4 =
          score >= 82 ? 1 : score >= 70 ? 2 : score >= 55 ? 3 : 4

        resolve({ score, glogau, textureVariance, sunDamageIndex })
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = dataUrl
  })
}

function fallbackSkin(age?: number): SkinAnalysisResult {
  const base = age ? Math.max(40, 88 - age * 0.75) : 72
  const score = Math.round(base)
  const glogau: 1 | 2 | 3 | 4 =
    score >= 82 ? 1 : score >= 70 ? 2 : score >= 55 ? 3 : 4
  return {
    score,
    glogau,
    textureVariance: Math.round(100 - score * 0.6),
    sunDamageIndex: Math.round(100 - score * 0.5),
  }
}

export function getMicroneedlingRx(score: number, lang: 'ES' | 'EN' | 'PT'): string {
  if (score >= 78) {
    return lang === 'EN'
      ? 'Gentle Microneedling + Bio-Revitalization'
      : lang === 'PT'
        ? 'Microneedling Suave + Bio-Revitalização'
        : 'Microneedling suave + Bio-Revitalización'
  }
  if (score >= 58) {
    return lang === 'EN'
      ? 'Medical Microneedling (Dermapen) + PRP'
      : lang === 'PT'
        ? 'Microneedling Médico (Dermapen) + PRP'
        : 'Microneedling médico (Dermapen) + PRP'
  }
  return lang === 'EN'
    ? 'Deep Microneedling + Growth Factors'
    : lang === 'PT'
      ? 'Microneedling Profundo + Fatores de Crescimento'
      : 'Microneedling profundo + factores de crecimiento'
}

export function getSkinFindings(
  result: SkinAnalysisResult,
  lang: 'ES' | 'EN' | 'PT'
): { findingText: string; dxText: string; analysisText: string } {
  const { score, glogau, textureVariance, sunDamageIndex } = result
  const sunNote =
    sunDamageIndex >= 45
      ? 'con componente fotoquímico visible'
      : sunDamageIndex >= 25
        ? 'con fotoenvejecimiento leve'
        : 'sin fotoenvejecimiento marcado en la captura'

  if (lang === 'EN') {
    return {
      analysisText: `Regional sampling: texture index ${textureVariance}/100, photodamage ${sunDamageIndex}/100 (${sunNote}). Estimated Glogau type ${glogau}.`,
      findingText: buildFindingEN(score, textureVariance, sunDamageIndex),
      dxText: buildDxEN(score),
    }
  }

  if (lang === 'PT') {
    return {
      analysisText: `Amostragem regional: índice de textura ${textureVariance}/100, fotoenvelhecimento ${sunDamageIndex}/100 (${sunNote}). Glogau ${glogau}.`,
      findingText: buildFindingPT(score, textureVariance, sunDamageIndex),
      dxText: buildDxPT(score),
    }
  }

  return {
    analysisText: `Muestreo en mejillas y tercio medio: índice de textura ${textureVariance}/100, fotoenvejecimiento ${sunDamageIndex}/100 (${sunNote}). Glogau tipo ${glogau}.`,
    findingText: buildFindingES(score, textureVariance, sunDamageIndex),
    dxText: buildDxES(score),
  }
}

function buildFindingES(
  score: number,
  texture: number,
  sun: number
): string {
  if (score >= 75) {
    return 'Textura global conservada con leve opacidad superficial; la luminosidad responde bien a inducción de colágeno.'
  }
  if (score >= 58) {
    return `Irregularidad textural moderada (${texture}/100) y variación de tono; beneficio claro de protocolo regenerativo.`
  }
  if (sun >= 40) {
    return 'Textura irregular, fatiga de matriz y signos de daño solar acumulado que limitan el brillo cutáneo.'
  }
  return 'Textura irregular y fatiga de matriz extracelular; priorizar regeneración dérmica antes de procedimientos invasivos.'
}

function buildFindingEN(score: number, texture: number, sun: number): string {
  if (score >= 75) {
    return 'Overall texture preserved with mild surface dullness; luminosity responds well to collagen induction.'
  }
  if (score >= 58) {
    return `Moderate textural irregularity (${texture}/100) and tone variation; clear benefit from a regenerative protocol.`
  }
  if (sun >= 40) {
    return 'Irregular texture, matrix fatigue and accumulated photodamage limiting skin glow.'
  }
  return 'Irregular texture and extracellular matrix fatigue; prioritize dermal regeneration before invasive procedures.'
}

function buildFindingPT(score: number, texture: number, sun: number): string {
  if (score >= 75) {
    return 'Textura global preservada com leve opacidade superficial; luminosidade responde bem à indução de colágeno.'
  }
  if (score >= 58) {
    return `Irregularidade textural moderada (${texture}/100) e variação de tom; benefício claro de protocolo regenerativo.`
  }
  if (sun >= 40) {
    return 'Textura irregular, fadiga da matriz e sinais de dano solar acumulado limitando o brilho.'
  }
  return 'Textura irregular e fadiga da matriz extracelular; priorizar regeneração dérmica antes de procedimentos invasivos.'
}

function buildDxES(score: number): string {
  if (score >= 75) {
    return 'Su piel se beneficia de microneedling de mantenimiento y bio-revitalización para optimizar el glow.'
  }
  if (score >= 58) {
    return 'Indicado microneedling médico con PRP para neocolagénesis y homogeneización del tono.'
  }
  return 'Requiere microneedling profundo con factores de crecimiento y preparación dérmica antes de cirugía o láser.'
}

function buildDxEN(score: number): string {
  if (score >= 75) {
    return 'Your skin benefits from maintenance microneedling and bio-revitalization to optimize glow.'
  }
  if (score >= 58) {
    return 'Medical microneedling with PRP is indicated for neocollagenesis and tone homogenization.'
  }
  return 'Deep microneedling with growth factors and dermal preparation is needed before surgery or laser.'
}

function buildDxPT(score: number): string {
  if (score >= 75) {
    return 'Sua pele se beneficia de microneedling de manutenção e bio-revitalização para otimizar o glow.'
  }
  if (score >= 58) {
    return 'Indicado microneedling médico com PRP para neocolagênese e homogeneização do tom.'
  }
  return 'Requer microneedling profundo com fatores de crescimento e preparação dérmica antes de cirurgia ou laser.'
}
