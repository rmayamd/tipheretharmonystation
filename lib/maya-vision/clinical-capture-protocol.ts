/**
 * Protocolo de captura clínica estandarizada (tipo VISIA / Canfield).
 * Usa lámparas reales del consultorio + celular en trípode.
 */

export type CaptureModality =
  | 'standard'
  | 'polarized'
  | 'wood'
  | 'profile_right'
  | 'profile_left'

export type CaptureStepConfig = {
  id: CaptureModality
  title: string
  subtitle: string
  lampInstruction: string
  roomInstruction: string
  faceGuide: 'front' | 'profile'
  minFaceRatio: number
  maxFaceRatio: number
  requiresDarkRoom?: boolean
}

export const VISIA_CAPTURE_SEQUENCE: CaptureStepConfig[] = [
  {
    id: 'standard',
    title: '1. Luz clínica estándar',
    subtitle: 'Referencia a color (obligatoria)',
    lampInstruction:
      'Luz blanca 5000–5500 K (anel LED o panel). Sin flash del teléfono. Apagar luces de techo si crean sombras duras.',
    roomInstruction: 'Fondo neutro (gris o blanco). Paciente sin maquillaje.',
    faceGuide: 'front',
    minFaceRatio: 0.42,
    maxFaceRatio: 0.72,
  },
  {
    id: 'polarized',
    title: '2. Luz polarizada cruzada',
    subtitle: 'Vascular / pigmento profundo',
    lampInstruction:
      'Misma distancia. Filtro polarizador en la lámpara Y en la cámara del celular, orientación cruzada (90°).',
    roomInstruction: 'Misma posición que paso 1. No mover trípode.',
    faceGuide: 'front',
    minFaceRatio: 0.42,
    maxFaceRatio: 0.72,
  },
  {
    id: 'wood',
    title: '3. Lámpara de Wood (UV)',
    subtitle: 'Fluorescencia',
    lampInstruction: 'Solo lámpara de Wood. Apagar todas las demás luces.',
    roomInstruction: 'Cabina oscura. Ojos protegidos si el paciente mira la lámpara.',
    faceGuide: 'front',
    minFaceRatio: 0.38,
    maxFaceRatio: 0.75,
    requiresDarkRoom: true,
  },
  {
    id: 'profile_right',
    title: '4. Perfil derecho',
    subtitle: 'Estructura / ángulo cervical',
    lampInstruction: 'Volver a luz clínica estándar (paso 1).',
    roomInstruction: 'Rotación 90°. Mentón perpendicular al hombro.',
    faceGuide: 'profile',
    minFaceRatio: 0.35,
    maxFaceRatio: 0.78,
  },
  {
    id: 'profile_left',
    title: '5. Perfil izquierdo',
    subtitle: 'Simetría estructural',
    lampInstruction: 'Misma luz clínica.',
    roomInstruction: 'Espejo del perfil derecho.',
    faceGuide: 'profile',
    minFaceRatio: 0.35,
    maxFaceRatio: 0.78,
  },
]

export type FrameQualityCheck = {
  ok: boolean
  faceRatio: number
  score: number
  messages: string[]
}

export function checkFrameQuality(
  landmarks: { x: number; y: number }[],
  imageWidth: number,
  imageHeight: number,
  step: CaptureStepConfig
): FrameQualityCheck {
  const messages: string[] = []
  if (!landmarks.length) {
    return {
      ok: false,
      faceRatio: 0,
      score: 0,
      messages: ['Rostro no detectado. Centre la cara en el óvalo.'],
    }
  }

  const xs = landmarks.map((p) => p.x)
  const ys = landmarks.map((p) => p.y)
  const faceW = (Math.max(...xs) - Math.min(...xs)) * imageWidth
  const faceRatio = faceW / imageWidth

  if (faceRatio < step.minFaceRatio) {
    messages.push('Acérquese: rostro muy pequeño (distancia VISIA ~55–65 cm).')
  } else if (faceRatio > step.maxFaceRatio) {
    messages.push('Aléjese: rostro muy grande (distorsión de gran angular).')
  }

  let score = 90
  if (faceRatio < step.minFaceRatio || faceRatio > step.maxFaceRatio) score -= 35

  const ok = messages.length === 0
  if (ok) messages.push('Encuadre estándar VISIA OK.')

  return { ok, faceRatio: Math.round(faceRatio * 100), score: Math.max(0, score), messages }
}

export type WoodAnalysis = {
  fluorescenceIndex: number
  brightSpotCount: number
  summary: string
}

/** Análisis básico de foto bajo Wood: puntos brillantes sobre fondo oscuro */
export async function analyzeWoodFluorescence(
  dataUrl: string
): Promise<WoodAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const w = 320
      const h = Math.round(img.height * (w / img.width))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      const { data } = ctx.getImageData(0, 0, w, h)
      let bright = 0
      let total = 0
      const x0 = Math.floor(w * 0.2)
      const x1 = Math.floor(w * 0.8)
      const y0 = Math.floor(h * 0.15)
      const y1 = Math.floor(h * 0.85)

      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const i = (y * w + x) * 4
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          total++
          if (lum > 200 && data[i + 1] > data[i] * 0.9) bright++
        }
      }

      const ratio = total ? bright / total : 0
      const fluorescenceIndex = Math.min(100, Math.round(ratio * 800))
      const brightSpotCount = Math.round(ratio * 120)

      resolve({
        fluorescenceIndex,
        brightSpotCount,
        summary:
          fluorescenceIndex > 25
            ? 'Fluorescencia visible: correlacionar clínicamente (hongos, porfirinas, aceites).'
            : 'Fluorescencia discreta o ausente en la captura.',
      })
    }
    img.onerror = () => reject(new Error('Imagen Wood'))
    img.src = dataUrl
  })
}

export const KIT_CHECKLIST = [
  'Trípode con soporte para celular (altura ojos)',
  'Marca en el suelo a 60 cm del trípode',
  'Fondo gris o blanco mate (1.5 x 2 m)',
  'Luz LED 5000 K (anel o panel)',
  'Par polarizador lineal x2 (lámpara + lente celular)',
  'Lámpara de Wood (UV-A)',
  'Cortina oscura o cabina sin ventana (para Wood)',
  'Tarjeta gris 18% (opcional, calibrar exposición)',
]
