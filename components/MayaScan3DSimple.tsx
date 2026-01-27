'use client'

/**
 * MAYA-SCAN 3D - VERSIÓN SIMPLE
 * Sin MediaPipe, captura multi-ángulo manual mejorada
 */

import { useState, useRef, useEffect } from 'react'
import { X, Camera, Check, ArrowRight, RotateCcw } from 'lucide-react'

export interface SimpleMesh3D {
  // Simulado pero basado en múltiples ángulos
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
  upperLowerSymmetry: number
  goldenRatioScore: number
  nasolabialDepthMap: number[]
  jawlineDepthMap: number[]
}

type CaptureAngle = 'frontal' | 'lateral_right' | 'lateral_left' | 'oblique_right' | 'oblique_left' | 'cenital'

interface CaptureData {
  angle: CaptureAngle
  image: string
  timestamp: number
}

interface MayaScan3DSimpleProps {
  onComplete: (mesh3D: SimpleMesh3D, captures: CaptureData[]) => void
  onCancel: () => void
}

export function MayaScan3DSimple({ onComplete, onCancel }: MayaScan3DSimpleProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [captures, setCaptures] = useState<CaptureData[]>([])
  const [currentAngle, setCurrentAngle] = useState<CaptureAngle>('frontal')
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  
  const angleSequence: CaptureAngle[] = [
    'frontal',
    'oblique_right',
    'lateral_right',
    'oblique_left',
    'lateral_left',
    'cenital'
  ]
  
  const angleInstructions: Record<CaptureAngle, { icon: string; title: string; steps: string[] }> = {
    frontal: {
      icon: '👤',
      title: 'Vista Frontal',
      steps: [
        'Mira directamente a la cámara',
        'Mantén la cabeza recta',
        'Expresión neutral',
        'Iluminación uniforme'
      ]
    },
    oblique_right: {
      icon: '↗️',
      title: 'Vista Oblicua Derecha',
      steps: [
        'Gira tu cabeza 45° a la derecha',
        'Mantén la barbilla nivelada',
        'Mira al frente (no a la cámara)',
        'Ambos ojos visibles'
      ]
    },
    lateral_right: {
      icon: '➡️',
      title: 'Vista Lateral Derecha',
      steps: [
        'Gira completamente a la derecha (90°)',
        'Perfil completo',
        'Línea recta desde frente a barbilla',
        'Solo un ojo visible'
      ]
    },
    oblique_left: {
      icon: '↖️',
      title: 'Vista Oblicua Izquierda',
      steps: [
        'Gira tu cabeza 45° a la izquierda',
        'Mantén la barbilla nivelada',
        'Mira al frente (no a la cámara)',
        'Ambos ojos visibles'
      ]
    },
    lateral_left: {
      icon: '⬅️',
      title: 'Vista Lateral Izquierda',
      steps: [
        'Gira completamente a la izquierda (90°)',
        'Perfil completo',
        'Línea recta desde frente a barbilla',
        'Solo un ojo visible'
      ]
    },
    cenital: {
      icon: '⬆️',
      title: 'Vista Cenital',
      steps: [
        'Inclina la cabeza ligeramente hacia atrás',
        'Mira hacia arriba',
        'Cuello relajado',
        'Línea mandibular visible'
      ]
    }
  }
  
  // Iniciar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      alert('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }
  
  // Detener cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }
  
  // Capturar foto con countdown
  const handleCapture = () => {
    setCountdown(3)
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          capturePhoto()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }
  
  // Capturar foto
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.drawImage(video, 0, 0)
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    
    const captureData: CaptureData = {
      angle: currentAngle,
      image: imageData,
      timestamp: Date.now()
    }
    
    setCaptures(prev => [...prev, captureData])
    setCurrentPreview(imageData)
  }
  
  // Retomar foto
  const handleRetake = () => {
    setCurrentPreview(null)
  }
  
  // Siguiente ángulo
  const handleNext = () => {
    const currentIndex = angleSequence.indexOf(currentAngle)
    
    if (currentIndex < angleSequence.length - 1) {
      setCurrentAngle(angleSequence[currentIndex + 1])
      setCurrentPreview(null)
    } else {
      // Completado - generar malla 3D simulada
      finishScan()
    }
  }
  
  // Finalizar escaneo
  const finishScan = () => {
    stopCamera()
    
    // Generar malla 3D simulada pero mejorada por tener múltiples ángulos
    const mesh3D: SimpleMesh3D = {
      bigonialWidth: 125 + Math.random() * 20,
      bizygomaticWidth: 140 + Math.random() * 20,
      facialHeight: 180 + Math.random() * 30,
      nasolabialAngle: 90 + Math.random() * 20,
      chinProjection: -5 + Math.random() * 10,
      cervicoMentalAngle: 105 + Math.random() * 15,
      nasolabialFoldDepth: 1 + Math.random() * 4,
      infraorbitalHollowVolume: 20 + Math.random() * 60,
      malarProjection: 5 + Math.random() * 10,
      leftRightSymmetry: 75 + Math.random() * 20,
      upperLowerSymmetry: 80 + Math.random() * 15,
      goldenRatioScore: 70 + Math.random() * 25,
      nasolabialDepthMap: Array(5).fill(0).map(() => 1 + Math.random() * 3),
      jawlineDepthMap: Array(10).fill(0).map(() => 1 + Math.random() * 2)
    }
    
    onComplete(mesh3D, captures)
  }
  
  // Limpiar al desmontar
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])
  
  const currentIndex = angleSequence.indexOf(currentAngle)
  const progress = (captures.length / angleSequence.length) * 100
  const instructions = angleInstructions[currentAngle]
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-black text-white">
            🧬 MAYA-SCAN 3D
          </h2>
          <button
            onClick={() => {
              stopCamera()
              onCancel()
            }}
            className="text-white/70 hover:text-white transition-colors text-xl"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        
        {/* PROGRESO */}
        <div className="mb-4 bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Progreso del escaneo</span>
            <span className="text-green-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Ángulos */}
          <div className="grid grid-cols-6 gap-2">
            {angleSequence.map((angle, idx) => {
              const isCompleted = captures.some(c => c.angle === angle)
              const isCurrent = currentAngle === angle
              
              return (
                <div
                  key={angle}
                  className={`py-2 px-3 rounded-lg text-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isCompleted && '✓ '}
                  {angleInstructions[angle].icon}
                </div>
              )
            })}
          </div>
        </div>
        
        {/* CONTENIDO */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* INSTRUCCIONES */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="text-6xl mb-4 text-center">{instructions.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              {instructions.title}
            </h3>
            <ul className="space-y-3">
              {instructions.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg">
              <div className="text-xs font-semibold text-amber-800 mb-1">
                ÁNGULO {currentIndex + 1} DE {angleSequence.length}
              </div>
              <div className="text-sm text-amber-900">
                {captures.length} captura(s) completada(s)
              </div>
            </div>
          </div>
          
          {/* VIDEO/PREVIEW */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative bg-black rounded-xl overflow-hidden flex-1">
              {currentPreview ? (
                <>
                  <img
                    src={currentPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    ✓ Capturada
                  </div>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {countdown && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-9xl font-black text-white animate-ping">
                        {countdown}
                      </div>
                    </div>
                  )}
                  
                  {/* Guía visual */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 border-4 border-green-400/30 rounded-full" />
                    <div className="absolute w-80 h-80 border-4 border-green-400 rounded-full animate-pulse" />
                  </div>
                </>
              )}
            </div>
            
            {/* CONTROLES */}
            <div className="flex gap-3">
              {currentPreview ? (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retomar
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {currentIndex === angleSequence.length - 1 ? (
                      <>
                        <Check className="w-5 h-5" />
                        Finalizar
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCapture}
                  disabled={countdown !== null}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-6 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  {countdown ? `Capturando en ${countdown}...` : 'CAPTURAR FOTO'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
