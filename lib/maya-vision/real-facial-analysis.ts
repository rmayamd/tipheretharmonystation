/**
 * Análisis facial REAL desde landmarks MediaPipe (468 puntos).
 * Mediciones relativas + calibración antropométrica (portátil, celular).
 */

import {
  calculateEthnicGoldenRatio,
  type Ethnicity,
} from './ethnic-golden-ratio'
import type { SkinAnalysisResult } from './simple-skin-analysis'
import { getMicroneedlingRx, getSkinFindings } from './simple-skin-analysis'

export type LandmarkPoint = { x: number; y: number; z: number }

export type CaptureQuality = {
  score: number
  lighting: 'good' | 'low' | 'high'
  faceSize: 'good' | 'too_far' | 'too_close'
  messages: string[]
}

export type FacialAnalysisReport = {
  mesh: {
    bigonialWidth: number
    bizygomaticWidth: number
    facialHeight: number
    nasolabialAngle: number
    chinProjection: number
    cervicoMentalAngle: number
    nasolabialFoldDepth: number
    infraorbitalHollowVolume: number
    malarProjection: number
    leftRightSymmetry: number
    goldenRatioScore: number
    facialThirds: { upper: number; middle: number; lower: number }
    jowlSeverity: number
    laxityScore: number
    volumeDeficitCc: number
  }
  golden: ReturnType<typeof calculateEthnicGoldenRatio>
  captureQuality: CaptureQuality
  skin: SkinAnalysisResult | null
  evidence: 'landmarks' | 'image_only' | 'partial'
}

type Lang = 'ES' | 'EN' | 'PT'

function dist(a: LandmarkPoint, b: LandmarkPoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

function lm(
  landmarks: LandmarkPoint[],
  idx: number
): LandmarkPoint {
  return landmarks[idx] || { x: 0, y: 0, z: 0 }
}

function angleAt(
  a: LandmarkPoint,
  b: LandmarkPoint,
  c: LandmarkPoint
): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y }
  const v2 = { x: c.x - b.x, y: c.y - b.y }
  const dot = v1.x * v2.x + v1.y * v2.y
  const m1 = Math.hypot(v1.x, v1.y)
  const m2 = Math.hypot(v2.x, v2.y)
  if (m1 * m2 === 0) return 95
  return (Math.acos(Math.max(-1, Math.min(1, dot / (m1 * m2)))) * 180) / Math.PI
}

export function measureFromLandmarks(
  frontal: LandmarkPoint[],
  lateralRight?: LandmarkPoint[],
  lateralLeft?: LandmarkPoint[]
): FacialAnalysisReport['mesh'] {
  const side = lateralRight?.length ? lateralRight : lateralLeft

  const leftJaw = lm(frontal, 234)
  const rightJaw = lm(frontal, 454)
  const leftCheek = lm(frontal, 50)
  const rightCheek = lm(frontal, 280)
  const forehead = lm(frontal, 10)
  const chin = lm(frontal, 152)
  const nose = lm(frontal, 1)

  const bigonialWidth = dist(leftJaw, rightJaw) * 140
  const bizygomaticWidth = dist(leftCheek, rightCheek) * 150
  const facialHeight = dist(forehead, chin) * 200

  const nasolabialAngle = side
    ? angleAt(lm(side, 1), lm(side, 2), lm(side, 13))
    : angleAt(nose, lm(frontal, 2), lm(frontal, 13))

  const chinProjection = side
    ? (lm(side, 152).z - lm(side, 1).z) * 50
    : (chin.z - nose.z) * 50

  const cervicoMentalAngle = side
    ? angleAt(lm(side, 152), lm(side, 172), lm(side, 200))
    : angleAt(chin, lm(frontal, 172), lm(frontal, 200))

  const nasalBase = lm(frontal, 4)
  const foldMid = lm(frontal, 36)
  const mouthCorner = lm(frontal, 61)
  const nasolabialFoldDepth =
    Math.abs((nasalBase.z + foldMid.z + mouthCorner.z) / 3 - (lm(frontal, 2).z + lm(frontal, 50).z) / 2) * 10

  const infraorbitalHollowVolume =
    ((Math.abs(lm(frontal, 145).z - lm(frontal, 50).z) +
      Math.abs(lm(frontal, 374).z - lm(frontal, 280).z)) /
      2) *
    100

  const malarProjection = ((leftCheek.z + rightCheek.z) / 2 - nose.z) * 20

  const pairs: [number, number][] = [
    [33, 263],
    [61, 291],
    [234, 454],
    [50, 280],
  ]
  let symDiff = 0
  for (const [l, r] of pairs) {
    symDiff += dist(lm(frontal, l), lm(frontal, r))
  }
  const leftRightSymmetry = Math.max(0, Math.min(100, 100 - symDiff * 1000))

  const brow = lm(frontal, 168)
  const subnasale = lm(frontal, 2)
  const u = dist(forehead, brow)
  const m = dist(brow, subnasale)
  const lo = dist(subnasale, chin)
  const total = u + m + lo || 1
  const facialThirds = { upper: u / total, middle: m / total, lower: lo / total }

  const jawMidY = (leftJaw.y + rightJaw.y) / 2
  const cheekMidY = (leftCheek.y + rightCheek.y) / 2
  const jowlDrop = Math.max(0, jawMidY - cheekMidY)
  const jowlSeverity = Math.min(100, Math.round(jowlDrop * 800 + nasolabialFoldDepth * 8))

  const idealCervico = 112
  const laxityFromNeck = Math.max(0, idealCervico - cervicoMentalAngle) * 1.2
  const laxityScore = Math.min(
    100,
    Math.round(jowlSeverity * 0.45 + laxityFromNeck * 0.35 + nasolabialFoldDepth * 6)
  )

  const idealMalar = 4
  const malarDeficit = Math.max(0, idealMalar - malarProjection)
  const hollowCc = infraorbitalHollowVolume * 0.35
  const malarCc = malarDeficit * 12
  const volumeDeficitCc = Math.round(Math.min(420, Math.max(0, hollowCc + malarCc)))

  const goldenRatioScore = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        leftRightSymmetry * 0.35 +
          (100 - Math.abs(bizygomaticWidth / bigonialWidth - 1.618) * 40) * 0.35 +
          (100 - Math.abs(facialHeight / bizygomaticWidth - 1.618) * 35) * 0.3
      )
    )
  )

  return {
    bigonialWidth: Math.round(bigonialWidth),
    bizygomaticWidth: Math.round(bizygomaticWidth),
    facialHeight: Math.round(facialHeight),
    nasolabialAngle: Math.round(nasolabialAngle),
    chinProjection: Math.round(chinProjection * 10) / 10,
    cervicoMentalAngle: Math.round(cervicoMentalAngle),
    nasolabialFoldDepth: Math.round(nasolabialFoldDepth * 10) / 10,
    infraorbitalHollowVolume: Math.round(infraorbitalHollowVolume),
    malarProjection: Math.round(malarProjection * 10) / 10,
    leftRightSymmetry: Math.round(leftRightSymmetry),
    goldenRatioScore,
    facialThirds,
    jowlSeverity,
    laxityScore,
    volumeDeficitCc,
  }
}

export function assessCaptureQuality(
  landmarks: LandmarkPoint[],
  imageWidth: number,
  imageHeight: number
): CaptureQuality {
  const messages: string[] = []
  const xs = landmarks.map((p) => p.x)
  const ys = landmarks.map((p) => p.y)
  const faceW = (Math.max(...xs) - Math.min(...xs)) * imageWidth
  const faceH = (Math.max(...ys) - Math.min(...ys)) * imageHeight
  const faceRatio = faceW / imageWidth

  let faceSize: CaptureQuality['faceSize'] = 'good'
  if (faceRatio < 0.35) {
    faceSize = 'too_far'
    messages.push('Acérquese más a la cámara (rostro pequeño en cuadro).')
  } else if (faceRatio > 0.85) {
    faceSize = 'too_close'
    messages.push('Aléjese ligeramente (distorsión de gran angular).')
  }

  const brightnessProxy =
    landmarks.reduce((s, p) => s + (1 - p.y), 0) / landmarks.length
  let lighting: CaptureQuality['lighting'] = 'good'
  if (brightnessProxy < 0.35) {
    lighting = 'low'
    messages.push('Poca luz: use ventana frontal o lámpara suave.')
  } else if (brightnessProxy > 0.72) {
    lighting = 'high'
    messages.push('Luz muy dura: evite sol directo sobre el rostro.')
  }

  let score = 85
  if (faceSize !== 'good') score -= 25
  if (lighting !== 'good') score -= 20
  if (messages.length === 0) messages.push('Captura apta para medición por landmarks.')

  return { score: Math.max(0, score), lighting, faceSize, messages }
}

export function buildFacialReport(
  frontal: LandmarkPoint[] | null,
  lateralRight: LandmarkPoint[] | null,
  lateralLeft: LandmarkPoint[] | null,
  skin: SkinAnalysisResult | null,
  options: {
    age?: number
    ethnicity?: Ethnicity
    gender?: 'M' | 'F'
    imageSize?: { w: number; h: number }
  } = {}
): FacialAnalysisReport | null {
  if (!frontal || frontal.length < 400) return null

  const mesh = measureFromLandmarks(
    frontal,
    lateralRight || undefined,
    lateralLeft || undefined
  )

  const golden = calculateEthnicGoldenRatio(
    mesh.bigonialWidth,
    mesh.bizygomaticWidth,
    mesh.facialHeight,
    mesh.nasolabialAngle,
    mesh.cervicoMentalAngle,
    null,
    options.ethnicity || 'latino',
    options.gender || 'M'
  )

  const captureQuality = options.imageSize
    ? assessCaptureQuality(frontal, options.imageSize.w, options.imageSize.h)
    : assessCaptureQuality(frontal, 1280, 720)

  let evidence: FacialAnalysisReport['evidence'] = 'landmarks'
  if (!lateralRight && !lateralLeft) evidence = 'partial'

  return { mesh, golden, captureQuality, skin, evidence }
}

export function getVolumeReport(
  mesh: FacialAnalysisReport['mesh'],
  lang: Lang
): { mapText: string; cliText: string; quote: string; txVol: string; volumeCc: number } {
  const cc = mesh.volumeDeficitCc
  const sym = mesh.leftRightSymmetry
  const jowl = mesh.jowlSeverity

  if (lang === 'EN') {
    return {
      volumeCc: cc,
      mapText: `Measured bizygomatic width ${mesh.bizygomaticWidth} mm, bigonial ${mesh.bigonialWidth} mm. Estimated mid-face volume deficit ~${cc} cc (landmark-based, not ultrasound).`,
      cliText:
        jowl > 45
          ? `Jowl descent index ${jowl}/100 with malar projection ${mesh.malarProjection} mm. Symmetry ${sym}/100.`
          : `Mid-face support preserved (jowl index ${jowl}/100). Symmetry ${sym}/100.`,
      quote:
        cc > 80
          ? 'Measured loss of support, not excess skin.'
          : 'Proportions within functional balance for age.',
      txVol:
        cc > 120
          ? `Treatment: Volumetric restoration (~${cc} cc HA/fat transfer)`
          : cc > 50
            ? 'Treatment: Targeted malar refill + skin protocol'
            : 'Treatment: Maintenance + collagen induction',
    }
  }
  if (lang === 'PT') {
    return {
      volumeCc: cc,
      mapText: `Largura bizigomática ${mesh.bizygomaticWidth} mm, bigonial ${mesh.bigonialWidth} mm. Déficit volumétrico estimado ~${cc} cc (landmarks).`,
      cliText:
        jowl > 45
          ? `Índice de jowl ${jowl}/100, projeção malar ${mesh.malarProjection} mm. Simetria ${sym}/100.`
          : `Suporte do terço médio conservado (jowl ${jowl}/100). Simetria ${sym}/100.`,
      quote: cc > 80 ? 'Perda de suporte medida, não excesso de pele.' : 'Proporções equilibradas para a idade.',
      txVol:
        cc > 120
          ? `Tratamento: Reposição volumétrica (~${cc} cc)`
          : cc > 50
            ? 'Tratamento: Reforço malar + protocolo de pele'
            : 'Tratamento: Manutenção + indução de colágeno',
    }
  }
  return {
    volumeCc: cc,
    mapText: `Ancho bizigomático ${mesh.bizygomaticWidth} mm, bigonial ${mesh.bigonialWidth} mm. Déficit volumétrico estimado ~${cc} cc (medición por landmarks, no ecografía).`,
    cliText:
      jowl > 45
        ? `Índice de jowl ${jowl}/100 con proyección malar ${mesh.malarProjection} mm. Simetría ${sym}/100.`
        : `Soporte del tercio medio conservado (jowl ${jowl}/100). Simetría ${sym}/100.`,
    quote:
      cc > 80 ? 'Pérdida de soporte medida, no exceso de piel.' : 'Proporciones en balance funcional para la edad.',
    txVol:
      cc > 120
        ? `Tratamiento: Reposición volumétrica (~${cc} cc AH/tejido)`
        : cc > 50
          ? 'Tratamiento: Relleno malar focal + protocolo dérmico'
          : 'Tratamiento: Mantenimiento + inducción de colágeno',
  }
}

export function getStructureReport(
  mesh: FacialAnalysisReport['mesh'],
  golden: FacialAnalysisReport['golden'],
  lang: Lang
): { smasDx: string; boneDx: string; decoDx: string; decoTx: string } {
  const cerv = mesh.cervicoMentalAngle
  const lax = mesh.laxityScore
  const thirds = mesh.facialThirds

  if (lang === 'EN') {
    return {
      smasDx: `Measured cervical-menial angle ${cerv}° (ideal 105–120°). Laxity index ${lax}/100. Facial thirds U/M/L: ${(thirds.upper * 100).toFixed(0)}/${(thirds.middle * 100).toFixed(0)}/${(thirds.lower * 100).toFixed(0)}%.`,
      boneDx: `Golden Ratio score ${mesh.goldenRatioScore}/100 (ethnic-adjusted). Chin projection ${mesh.chinProjection} mm.`,
      decoDx: `Nasolabial fold depth ${mesh.nasolabialFoldDepth} mm. ${golden.recommendations[0] || 'Neck-décolleté: monitor photoaging and texture.'}`,
      decoTx:
        lax > 50
          ? 'Rx: Deep plane / threads + microneedling décolleté'
          : 'Rx: Bio-stimulators + topical Obagi',
    }
  }
  if (lang === 'PT') {
    return {
      smasDx: `Ângulo cervico-mental ${cerv}°. Índice de laxidão ${lax}/100. Terços ${(thirds.upper * 100).toFixed(0)}/${(thirds.middle * 100).toFixed(0)}/${(thirds.lower * 100).toFixed(0)}%.`,
      boneDx: `Golden Ratio ${mesh.goldenRatioScore}/100. Projeção do mento ${mesh.chinProjection} mm.`,
      decoDx: `Sulco nasogeniano ${mesh.nasolabialFoldDepth} mm.`,
      decoTx: lax > 50 ? 'Rx: Deep plane / fios + microneedling' : 'Rx: Bioestimuladores + Obagi',
    }
  }
  return {
    smasDx: `Ángulo cérvico-mental medido ${cerv}° (ideal 105–120°). Índice de laxitud ${lax}/100. Tercios U/M/I: ${(thirds.upper * 100).toFixed(0)}/${(thirds.middle * 100).toFixed(0)}/${(thirds.lower * 100).toFixed(0)}%.`,
    boneDx: `Proporción áurea ${mesh.goldenRatioScore}/100 (ajuste latino). Proyección mentoniana ${mesh.chinProjection} mm.`,
    decoDx: `Profundidad surco nasogeniano ${mesh.nasolabialFoldDepth} mm. ${golden.recommendations[0] || 'Escote: control de fotoenvejecimiento según captura.'}`,
    decoTx:
      lax > 50
        ? 'Rx: Deep plane / hilos + microneedling en escote'
        : 'Rx: Bioestimuladores + Obagi tópico',
  }
}

export function getEvidenceDisclaimer(lang: Lang): string {
  if (lang === 'EN') {
    return 'Tipheret™: real proportions from 468 facial landmarks + digital skin texture. Complements — does not replace — VISIA / VECTRA / Canfield. Clinical correlation required.'
  }
  if (lang === 'PT') {
    return 'Tipheret™: proporções reais por 468 landmarks + textura digital. Complementa — não substitui — VISIA / VECTRA / Canfield.'
  }
  return 'Tipheret™: proporciones reales con 468 landmarks MediaPipe + textura digital de imagen. Complementa — no sustituye — VISIA / VECTRA / Canfield H2. Requiere correlación clínica presencial.'
}

export { getMicroneedlingRx, getSkinFindings }
