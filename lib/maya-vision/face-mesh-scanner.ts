/**
 * MAYA-SCAN 3D - Motor de Escaneo Facial Real
 * Usa MediaPipe Face Mesh para detectar 468 landmarks en tiempo real
 * Tracking 3D de movimiento de cabeza tipo Face ID
 */

import { FaceMesh, Results } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

export interface FaceLandmark {
  x: number // 0-1 normalizado
  y: number // 0-1 normalizado
  z: number // profundidad relativa
}

export interface FaceMeshData {
  landmarks: FaceLandmark[] // 468 puntos
  rotationAngles: {
    pitch: number // inclinación vertical (arriba/abajo)
    yaw: number // rotación horizontal (izquierda/derecha)
    roll: number // inclinación lateral
  }
  timestamp: number
}

export type ScanAngle = 'frontal' | 'lateral_right' | 'lateral_left' | 'cenital' | 'oblique_right' | 'oblique_left'

export interface ScanProgress {
  current: ScanAngle
  completed: ScanAngle[]
  frames: Map<ScanAngle, FaceMeshData[]>
  percentage: number
}

export class FaceMeshScanner {
  private faceMesh: FaceMesh | null = null
  private camera: Camera | null = null
  private videoElement: HTMLVideoElement | null = null
  private isScanning: boolean = false
  private frames: Map<ScanAngle, FaceMeshData[]> = new Map()
  private currentAngle: ScanAngle = 'frontal'
  private completedAngles: Set<ScanAngle> = new Set()
  private onProgressCallback?: (progress: ScanProgress) => void
  private onCompleteCallback?: (allFrames: Map<ScanAngle, FaceMeshData[]>) => void
  
  // Secuencia de ángulos a capturar
  private readonly angleSequence: ScanAngle[] = [
    'frontal',
    'oblique_right',
    'lateral_right',
    'oblique_left',
    'lateral_left',
    'cenital'
  ]
  
  /**
   * Inicializa MediaPipe Face Mesh
   */
  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    this.videoElement = videoElement
    
    // Configurar MediaPipe Face Mesh
    this.faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      }
    })
    
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // Detección de iris y contornos precisos
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    
    this.faceMesh.onResults((results: Results) => {
      this.processResults(results)
    })
    
    // Iniciar cámara
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      }
    })
    
    videoElement.srcObject = stream
    await videoElement.play()
    
    // Conectar cámara con Face Mesh
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.faceMesh && this.isScanning) {
          await this.faceMesh.send({ image: videoElement })
        }
      },
      width: 1280,
      height: 720
    })
    
    await this.camera.start()
  }
  
  /**
   * Procesa resultados de Face Mesh
   */
  private processResults(results: Results): void {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      return
    }
    
    const landmarks = results.multiFaceLandmarks[0]
    
    // Convertir a nuestro formato
    const faceLandmarks: FaceLandmark[] = landmarks.map(lm => ({
      x: lm.x,
      y: lm.y,
      z: lm.z || 0
    }))
    
    // Calcular ángulos de rotación de la cabeza
    const rotationAngles = this.calculateHeadRotation(faceLandmarks)
    
    // Detectar ángulo actual automáticamente
    const detectedAngle = this.detectCurrentAngle(rotationAngles)
    
    // Crear frame data
    const frameData: FaceMeshData = {
      landmarks: faceLandmarks,
      rotationAngles,
      timestamp: Date.now()
    }
    
    // Si el ángulo detectado coincide con el que estamos buscando, guardar frame
    if (detectedAngle === this.currentAngle) {
      if (!this.frames.has(this.currentAngle)) {
        this.frames.set(this.currentAngle, [])
      }
      
      const angleFrames = this.frames.get(this.currentAngle)!
      angleFrames.push(frameData)
      
      // Si tenemos suficientes frames (30 frames = ~1 segundo), pasar al siguiente ángulo
      if (angleFrames.length >= 30) {
        this.completeCurrentAngle()
      }
    }
    
    // Notificar progreso
    this.notifyProgress()
  }
  
  /**
   * Calcula ángulos de rotación de la cabeza (pitch, yaw, roll)
   */
  private calculateHeadRotation(landmarks: FaceLandmark[]): { pitch: number; yaw: number; roll: number } {
    // Puntos clave para cálculo de rotación
    const noseTip = landmarks[1] // Punta de la nariz
    const noseBridge = landmarks[168] // Puente nasal
    const leftEye = landmarks[33] // Ojo izquierdo
    const rightEye = landmarks[263] // Ojo derecho
    const chin = landmarks[152] // Barbilla
    const forehead = landmarks[10] // Frente
    
    // YAW (rotación horizontal): -90° (izquierda) a +90° (derecha)
    const eyeCenterX = (leftEye.x + rightEye.x) / 2
    const yaw = (noseTip.x - eyeCenterX) * 180 // Aproximación
    
    // PITCH (inclinación vertical): -90° (abajo) a +90° (arriba)
    const faceHeight = Math.abs(forehead.y - chin.y)
    const noseToForehead = Math.abs(noseTip.y - forehead.y)
    const pitch = ((noseToForehead / faceHeight) - 0.5) * 180
    
    // ROLL (inclinación lateral)
    const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x)
    const roll = eyeAngle * (180 / Math.PI)
    
    return { pitch, yaw, roll }
  }
  
  /**
   * Detecta qué ángulo está mostrando el usuario actualmente
   */
  private detectCurrentAngle(rotation: { pitch: number; yaw: number; roll: number }): ScanAngle {
    const { pitch, yaw } = rotation
    
    // Frontal: yaw cercano a 0
    if (Math.abs(yaw) < 15 && Math.abs(pitch) < 15) {
      return 'frontal'
    }
    
    // Cenital: pitch positivo (mirando hacia arriba/cámara desde arriba)
    if (pitch > 30) {
      return 'cenital'
    }
    
    // Lateral derecho: yaw positivo
    if (yaw > 60) {
      return 'lateral_right'
    }
    
    // Lateral izquierdo: yaw negativo
    if (yaw < -60) {
      return 'lateral_left'
    }
    
    // Oblicuo derecho
    if (yaw > 15 && yaw <= 60) {
      return 'oblique_right'
    }
    
    // Oblicuo izquierdo
    if (yaw < -15 && yaw >= -60) {
      return 'oblique_left'
    }
    
    return this.currentAngle // Mantener actual si no hay match
  }
  
  /**
   * Completa el ángulo actual y pasa al siguiente
   */
  private completeCurrentAngle(): void {
    this.completedAngles.add(this.currentAngle)
    
    // Buscar siguiente ángulo no completado
    const nextAngle = this.angleSequence.find(angle => !this.completedAngles.has(angle))
    
    if (nextAngle) {
      this.currentAngle = nextAngle
    } else {
      // Escaneo completo
      this.finishScan()
    }
  }
  
  /**
   * Finaliza el escaneo
   */
  private finishScan(): void {
    this.isScanning = false
    
    if (this.onCompleteCallback) {
      this.onCompleteCallback(this.frames)
    }
  }
  
  /**
   * Notifica progreso actual
   */
  private notifyProgress(): void {
    if (!this.onProgressCallback) return
    
    const progress: ScanProgress = {
      current: this.currentAngle,
      completed: Array.from(this.completedAngles),
      frames: this.frames,
      percentage: (this.completedAngles.size / this.angleSequence.length) * 100
    }
    
    this.onProgressCallback(progress)
  }
  
  /**
   * Inicia el escaneo
   */
  startScan(
    onProgress?: (progress: ScanProgress) => void,
    onComplete?: (allFrames: Map<ScanAngle, FaceMeshData[]>) => void
  ): void {
    this.isScanning = true
    this.frames.clear()
    this.completedAngles.clear()
    this.currentAngle = 'frontal'
    this.onProgressCallback = onProgress
    this.onCompleteCallback = onComplete
  }
  
  /**
   * Detiene el escaneo
   */
  stopScan(): void {
    this.isScanning = false
    
    if (this.camera) {
      this.camera.stop()
    }
    
    if (this.videoElement && this.videoElement.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }
  
  /**
   * Obtiene instrucciones para el ángulo actual
   */
  getCurrentInstructions(): string {
    const instructions: Record<ScanAngle, string> = {
      frontal: '👤 Mira directamente a la cámara',
      oblique_right: '↗️ Gira tu cabeza ligeramente a la derecha',
      lateral_right: '➡️ Gira tu cabeza completamente a la derecha (perfil)',
      oblique_left: '↖️ Gira tu cabeza ligeramente a la izquierda',
      lateral_left: '⬅️ Gira tu cabeza completamente a la izquierda (perfil)',
      cenital: '⬆️ Inclina tu cabeza hacia atrás (mira hacia arriba)'
    }
    
    return instructions[this.currentAngle]
  }
}
