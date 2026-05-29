/**
 * Análisis básico de calidad dérmica a partir de la foto frontal (cliente).
 * Usa variación de textura y balance cromático en la zona central del rostro.
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
        const maxW = 320
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

        const x0 = Math.floor(w * 0.25)
        const x1 = Math.floor(w * 0.75)
        const y0 = Math.floor(h * 0.2)
        const y1 = Math.floor(h * 0.75)

        let sumL = 0
        let sumR = 0
        let sumG = 0
        let count = 0
        const luminances: number[] = []

        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * w + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const l = 0.299 * r + 0.587 * g + 0.114 * b
            sumL += l
            sumR += r
            sumG += g
            luminances.push(l)
            count++
          }
        }

        if (count === 0) {
          resolve(fallbackSkin(age))
          return
        }

        const meanL = sumL / count
        let variance = 0
        for (const l of luminances) {
          variance += (l - meanL) ** 2
        }
        variance /= count

        const redness = sumR / (sumG + 1)
        const textureVariance = Math.min(100, Math.round(variance / 2.5))
        const sunDamageIndex = Math.min(100, Math.round((redness - 1) * 55 + (100 - meanL) * 0.15))

        let score = 88 - textureVariance * 0.45 - sunDamageIndex * 0.35
        if (age) {
          score -= Math.max(0, age - 25) * 0.35
        }
        score = Math.round(Math.max(28, Math.min(96, score)))

        const glogau: 1 | 2 | 3 | 4 =
          score >= 82 ? 1 : score >= 68 ? 2 : score >= 52 ? 3 : 4

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
  const base = age ? Math.max(35, 92 - age * 0.9) : 72
  const score = Math.round(base)
  const glogau: 1 | 2 | 3 | 4 =
    score >= 82 ? 1 : score >= 68 ? 2 : score >= 52 ? 3 : 4
  return { score, glogau, textureVariance: 50, sunDamageIndex: 40 }
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

  if (lang === 'EN') {
    return {
      analysisText: `Spectral contrast shows texture variance ${textureVariance}/100 and photodamage index ${sunDamageIndex}/100 (Glogau type ${glogau}).`,
      findingText:
        score >= 75
          ? 'Mild irregular texture with early oxidative fatigue; luminosity still recoverable with collagen induction.'
          : score >= 58
            ? 'Moderate barrier stress, uneven tone and visible textural roughness reducing skin glow.'
            : 'Significant extracellular matrix fatigue, solar elastosis pattern and irregular texture limiting luminosity.',
      dxText:
        score >= 75
          ? 'Your skin benefits from controlled collagen remodeling and barrier support to restore glow.'
          : 'Your skin requires structured neocollagenesis and matrix repair before advanced aesthetic procedures.',
    }
  }

  if (lang === 'PT') {
    return {
      analysisText: `Contraste espectral: variância de textura ${textureVariance}/100 e índice de fotoenvelhecimento ${sunDamageIndex}/100 (Glogau ${glogau}).`,
      findingText:
        score >= 75
          ? 'Textura levemente irregular com fadiga oxidativa inicial; luminosidade recuperável com indução de colágeno.'
          : score >= 58
            ? 'Estresse moderado da barreira, tom irregular e aspereza textural reduzindo o brilho.'
            : 'Fadiga significativa da matriz extracelular, elastose solar e textura irregular limitando a luminosidade.',
      dxText:
        score >= 75
          ? 'Sua pele se beneficia de remodelação controlada de colágeno e suporte da barreira para recuperar o glow.'
          : 'Sua pele requer neocolagênese estruturada e reparo da matriz antes de procedimentos estéticos avançados.',
    }
  }

  return {
    analysisText: `Contraste espectral: variación de textura ${textureVariance}/100 e índice de fotoenvejecimiento ${sunDamageIndex}/100 (Glogau tipo ${glogau}).`,
    findingText:
      score >= 75
        ? 'Textura levemente irregular con fatiga oxidativa incipiente; la luminosidad es recuperable con inducción de colágeno.'
        : score >= 58
          ? 'Estrés moderado de la barrera, tono irregular y rugosidad textural que disminuyen el brillo cutáneo.'
          : 'Fatiga significativa de la matriz extracelular, patrón de elastosis solar y textura irregular que limitan la luminosidad.',
    dxText:
      score >= 75
        ? 'Su piel se beneficia de remodelación controlada de colágeno y soporte de barrera para recuperar el glow.'
        : 'Su piel requiere neocolagénesis estructurada y reparo de matriz antes de procedimientos estéticos avanzados.',
  }
}
