/**
 * MAYA MESH 3D - Generador de Malla Facial 3D
 * Convierte landmarks de MediaPipe en mediciones 3D reales
 */

import { FaceLandmark, FaceMeshData, ScanAngle } from './face-mesh-scanner'

export interface FaceMesh3D {
  // Mediciones frontales (mm)
  bigonialWidth: number // Ancho mandibular
  bizygomaticWidth: number // Ancho cigomático
  facialHeight: number // Altura facial total
  
  // Mediciones laterales (mm y grados)
  nasolabialAngle: number // Ángulo nasolabial
  chinProjection: number // Proyección del mentón
  cervicoMentalAngle: number // Ángulo cérvico-mental
  nasolabialFoldDepth: number // Profundidad del surco nasolabial
  
  // Mediciones de volumen (mm³)
  infraorbitalHollowVolume: number // Volumen de ojeras
  malarProjection: number // Proyección cigomática
  
  // Simetría
  leftRightSymmetry: number // 0-100, 100 = perfecta
  upperLowerSymmetry: number // 0-100
  
  // Golden Ratio 3D
  goldenRatioScore: number // 0-100
  
  // Depth maps
  nasolabialDepthMap: number[] // Profundidad a lo largo del surco
  jawlineDepthMap: number[] // Definición de la mandíbula
}

export class Mesh3DGenerator {
  /**
   * Genera malla 3D desde todos los ángulos capturados
   */
  static generateMesh3D(allFrames: Map<ScanAngle, FaceMeshData[]>): FaceMesh3D {
    // Obtener frame representativo de cada ángulo (el del medio)
    const frontalFrame = this.getRepresentativeFrame(allFrames.get('frontal') || [])
    const lateralRightFrame = this.getRepresentativeFrame(allFrames.get('lateral_right') || [])
    const lateralLeftFrame = this.getRepresentativeFrame(allFrames.get('lateral_left') || [])
    const cenitalFrame = this.getRepresentativeFrame(allFrames.get('cenital') || [])
    
    if (!frontalFrame) {
      throw new Error('No se pudo obtener frame frontal')
    }
    
    // Calcular mediciones frontales
    const bigonialWidth = this.calculateBigonialWidth(frontalFrame)
    const bizygomaticWidth = this.calculateBizygomaticWidth(frontalFrame)
    const facialHeight = this.calculateFacialHeight(frontalFrame)
    
    // Calcular mediciones laterales
    const nasolabialAngle = lateralRightFrame 
      ? this.calculateNasolabialAngle(lateralRightFrame) 
      : 95
    const chinProjection = lateralRightFrame
      ? this.calculateChinProjection(lateralRightFrame)
      : 0
    const cervicoMentalAngle = lateralRightFrame
      ? this.calculateCervicoMentalAngle(lateralRightFrame)
      : 110
    
    // Calcular profundidades usando coordenada Z
    const nasolabialFoldDepth = this.calculateNasolabialFoldDepth(frontalFrame)
    const infraorbitalHollowVolume = this.calculateInfraorbitalVolume(frontalFrame)
    const malarProjection = this.calculateMalarProjection(frontalFrame)
    
    // Calcular simetrías
    const leftRightSymmetry = this.calculateLeftRightSymmetry(frontalFrame)
    const upperLowerSymmetry = this.calculateUpperLowerSymmetry(frontalFrame)
    
    // Calcular Golden Ratio 3D
    const goldenRatioScore = this.calculateGoldenRatio3D(
      bigonialWidth,
      bizygomaticWidth,
      facialHeight,
      nasolabialAngle,
      cervicoMentalAngle
    )
    
    // Generar depth maps
    const nasolabialDepthMap = this.generateNasolabialDepthMap(frontalFrame)
    const jawlineDepthMap = this.generateJawlineDepthMap(frontalFrame)
    
    return {
      bigonialWidth,
      bizygomaticWidth,
      facialHeight,
      nasolabialAngle,
      chinProjection,
      cervicoMentalAngle,
      nasolabialFoldDepth,
      infraorbitalHollowVolume,
      malarProjection,
      leftRightSymmetry,
      upperLowerSymmetry,
      goldenRatioScore,
      nasolabialDepthMap,
      jawlineDepthMap
    }
  }
  
  /**
   * Obtiene el frame más representativo (el del medio)
   */
  private static getRepresentativeFrame(frames: FaceMeshData[]): FaceMeshData | null {
    if (frames.length === 0) return null
    return frames[Math.floor(frames.length / 2)]
  }
  
  /**
   * Calcula ancho bigonial (distancia entre ángulos mandibulares)
   */
  private static calculateBigonialWidth(frame: FaceMeshData): number {
    const leftJaw = frame.landmarks[234] // Ángulo mandibular izquierdo
    const rightJaw = frame.landmarks[454] // Ángulo mandibular derecho
    
    const distance = this.euclideanDistance(leftJaw, rightJaw)
    
    // Convertir de unidades normalizadas a mm (aproximado)
    // Asumiendo ancho facial promedio de ~140mm
    return distance * 140
  }
  
  /**
   * Calcula ancho bicigomático (distancia entre pómulos)
   */
  private static calculateBizygomaticWidth(frame: FaceMeshData): number {
    const leftCheek = frame.landmarks[234] // Pómulo izquierdo
    const rightCheek = frame.landmarks[454] // Pómulo derecho
    
    const distance = this.euclideanDistance(leftCheek, rightCheek)
    return distance * 150 // Promedio ~150mm
  }
  
  /**
   * Calcula altura facial
   */
  private static calculateFacialHeight(frame: FaceMeshData): number {
    const forehead = frame.landmarks[10] // Punto superior
    const chin = frame.landmarks[152] // Mentón
    
    const distance = this.euclideanDistance(forehead, chin)
    return distance * 200 // Promedio ~200mm
  }
  
  /**
   * Calcula ángulo nasolabial (nariz-labio superior)
   */
  private static calculateNasolabialAngle(frame: FaceMeshData): number {
    const noseTip = frame.landmarks[1]
    const noseBase = frame.landmarks[2]
    const upperLip = frame.landmarks[13]
    
    // Calcular ángulo usando vectores
    const vector1 = {
      x: noseTip.x - noseBase.x,
      y: noseTip.y - noseBase.y
    }
    
    const vector2 = {
      x: upperLip.x - noseBase.x,
      y: upperLip.y - noseBase.y
    }
    
    const angle = Math.acos(
      (vector1.x * vector2.x + vector1.y * vector2.y) /
      (Math.sqrt(vector1.x ** 2 + vector1.y ** 2) * Math.sqrt(vector2.x ** 2 + vector2.y ** 2))
    )
    
    return angle * (180 / Math.PI)
  }
  
  /**
   * Calcula proyección del mentón
   */
  private static calculateChinProjection(frame: FaceMeshData): number {
    const chin = frame.landmarks[152]
    const noseTip = frame.landmarks[1]
    
    // Proyección en eje Z (profundidad)
    const projection = (chin.z - noseTip.z) * 50 // Convertir a mm
    return projection
  }
  
  /**
   * Calcula ángulo cérvico-mental
   */
  private static calculateCervicoMentalAngle(frame: FaceMeshData): number {
    const chin = frame.landmarks[152]
    const neck = frame.landmarks[200] // Aproximación del cuello
    const jaw = frame.landmarks[172]
    
    // Similar al ángulo nasolabial
    const vector1 = { x: chin.x - jaw.x, y: chin.y - jaw.y }
    const vector2 = { x: neck.x - jaw.x, y: neck.y - jaw.y }
    
    const angle = Math.acos(
      (vector1.x * vector2.x + vector1.y * vector2.y) /
      (Math.sqrt(vector1.x ** 2 + vector1.y ** 2) * Math.sqrt(vector2.x ** 2 + vector2.y ** 2))
    )
    
    return angle * (180 / Math.PI)
  }
  
  /**
   * Calcula profundidad del surco nasolabial usando coordenada Z
   */
  private static calculateNasolabialFoldDepth(frame: FaceMeshData): number {
    // Puntos a lo largo del surco nasolabial
    const nasalBase = frame.landmarks[4]
    const foldMid = frame.landmarks[36]
    const mouthCorner = frame.landmarks[61]
    
    // La diferencia en Z indica profundidad del surco
    const avgZ = (nasalBase.z + foldMid.z + mouthCorner.z) / 3
    const surroundingZ = (frame.landmarks[2].z + frame.landmarks[50].z) / 2
    
    const depth = Math.abs(avgZ - surroundingZ) * 10 // Convertir a mm
    return depth
  }
  
  /**
   * Calcula volumen de ojeras (infraorbital hollows)
   */
  private static calculateInfraorbitalVolume(frame: FaceMeshData): number {
    const leftEyeBottom = frame.landmarks[145]
    const rightEyeBottom = frame.landmarks[374]
    const cheekLeft = frame.landmarks[50]
    const cheekRight = frame.landmarks[280]
    
    // Diferencia en profundidad indica volumen perdido
    const leftDepth = Math.abs(leftEyeBottom.z - cheekLeft.z)
    const rightDepth = Math.abs(rightEyeBottom.z - cheekRight.z)
    
    const avgDepth = (leftDepth + rightDepth) / 2
    return avgDepth * 100 // Escalar a mm³ aproximado
  }
  
  /**
   * Calcula proyección malar (pómulos)
   */
  private static calculateMalarProjection(frame: FaceMeshData): number {
    const leftCheek = frame.landmarks[234]
    const rightCheek = frame.landmarks[454]
    const nose = frame.landmarks[1]
    
    const avgCheekZ = (leftCheek.z + rightCheek.z) / 2
    const projection = (avgCheekZ - nose.z) * 20 // mm
    return projection
  }
  
  /**
   * Calcula simetría izquierda-derecha
   */
  private static calculateLeftRightSymmetry(frame: FaceMeshData): number {
    // Comparar landmarks correspondientes de cada lado
    const pairs = [
      [33, 263], // Ojos
      [61, 291], // Comisuras labiales
      [234, 454], // Mandíbula
      [50, 280] // Mejillas
    ]
    
    let totalDifference = 0
    
    for (const [leftIdx, rightIdx] of pairs) {
      const left = frame.landmarks[leftIdx]
      const right = frame.landmarks[rightIdx]
      
      // Calcular diferencia en posición
      const diff = this.euclideanDistance(left, right)
      totalDifference += diff
    }
    
    // Normalizar: menos diferencia = más simetría
    const symmetry = 100 - (totalDifference * 1000)
    return Math.max(0, Math.min(100, symmetry))
  }
  
  /**
   * Calcula simetría superior-inferior
   */
  private static calculateUpperLowerSymmetry(frame: FaceMeshData): number {
    const forehead = frame.landmarks[10]
    const chin = frame.landmarks[152]
    const nose = frame.landmarks[1]
    
    const upperHalf = Math.abs(forehead.y - nose.y)
    const lowerHalf = Math.abs(nose.y - chin.y)
    
    const ratio = Math.min(upperHalf, lowerHalf) / Math.max(upperHalf, lowerHalf)
    return ratio * 100
  }
  
  /**
   * Calcula Golden Ratio 3D considerando múltiples mediciones
   */
  private static calculateGoldenRatio3D(
    bigonialWidth: number,
    bizygomaticWidth: number,
    facialHeight: number,
    nasolabialAngle: number,
    cervicoMentalAngle: number
  ): number {
    const GOLDEN_RATIO = 1.618
    
    // Ratio ancho cigomático / ancho mandibular (ideal: ~1.618)
    const widthRatio = bizygomaticWidth / bigonialWidth
    const widthScore = 100 - Math.abs(widthRatio - GOLDEN_RATIO) * 50
    
    // Ratio altura / ancho (ideal: ~1.618)
    const heightRatio = facialHeight / bizygomaticWidth
    const heightScore = 100 - Math.abs(heightRatio - GOLDEN_RATIO) * 50
    
    // Ángulos ideales
    const nasolabialScore = 100 - Math.abs(nasolabialAngle - 95) * 2
    const cervicoMentalScore = 100 - Math.abs(cervicoMentalAngle - 110) * 1.5
    
    // Promedio ponderado
    const totalScore = (
      widthScore * 0.3 +
      heightScore * 0.3 +
      nasolabialScore * 0.2 +
      cervicoMentalScore * 0.2
    )
    
    return Math.max(0, Math.min(100, totalScore))
  }
  
  /**
   * Genera mapa de profundidad del surco nasolabial
   */
  private static generateNasolabialDepthMap(frame: FaceMeshData): number[] {
    // Puntos a lo largo del surco nasolabial derecho
    const foldPoints = [36, 42, 39, 37, 61]
    
    return foldPoints.map(idx => {
      const point = frame.landmarks[idx]
      return point.z * 10 // Normalizar profundidad
    })
  }
  
  /**
   * Genera mapa de profundidad de la línea mandibular
   */
  private static generateJawlineDepthMap(frame: FaceMeshData): number[] {
    // Puntos a lo largo de la mandíbula
    const jawPoints = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397, 288, 435]
    
    return jawPoints.map(idx => {
      const point = frame.landmarks[idx]
      return point.z * 10
    })
  }
  
  /**
   * Calcula distancia euclidiana 3D entre dos puntos
   */
  private static euclideanDistance(p1: FaceLandmark, p2: FaceLandmark): number {
    return Math.sqrt(
      (p1.x - p2.x) ** 2 +
      (p1.y - p2.y) ** 2 +
      (p1.z - p2.z) ** 2
    )
  }
}
