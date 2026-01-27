'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Check, ArrowRight, RotateCcw } from 'lucide-react'
import { 
  MultiAngleCaptureManager, 
  type CaptureAngle, 
  type MultiAngleCapture 
} from '@/lib/maya-vision/multi-angle-capture'

interface MultiAngleCaptureProps {
  onComplete: (captures: MultiAngleCapture) => void
  onCancel?: () => void
}

export function MultiAngleCapture({ onComplete, onCancel }: MultiAngleCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [manager] = useState(() => new MultiAngleCaptureManager())
  const [cameraActive, setCameraActive] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(manager.getProgress())
  const [showInstructions, setShowInstructions] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  
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
        videoRef.current.play()
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      alert('No se pudo acceder a la cámara. Por favor verifica los permisos.')
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
    const currentAngle = manager.getCurrentAngle()
    
    manager.saveCapture(currentAngle, imageData)
    setCurrentPreview(imageData)
    setProgress(manager.getProgress())
    setShowInstructions(true)
    
    // Si completó todas las capturas
    if (manager.isComplete()) {
      stopCamera()
      onComplete(manager.getAllCaptures())
    }
  }
  
  // Retomar foto
  const handleRetake = () => {
    manager.goBack()
    setCurrentPreview(null)
    setProgress(manager.getProgress())
  }
  
  // Continuar al siguiente ángulo
  const handleNext = () => {
    setCurrentPreview(null)
    setShowInstructions(true)
  }
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])
  
  const instructions = manager.getCurrentInstructions()
  const isComplete = manager.isComplete()
  
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* HEADER CON PROGRESO */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-t-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              📸 Captura Multi-Ángulo
            </h2>
            <button
              onClick={onCancel}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕ Cancelar
            </button>
          </div>
          
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/90">
              <span>Progreso</span>
              <span>{progress.percentage}% completado</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="flex gap-2 mt-4">
              {['frontal', 'lateral_right', 'lateral_left', 'cenital'].map((angle, idx) => {
                const isCompleted = progress.completed.includes(angle as CaptureAngle)
                const isCurrent = progress.current === angle
                
                return (
                  <div
                    key={angle}
                    className={`flex-1 py-2 px-3 rounded-lg text-center text-sm font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {isCompleted && '✓ '}
                    {angle === 'frontal' && 'Frontal'}
                    {angle === 'lateral_right' && 'Perfil →'}
                    {angle === 'lateral_left' && 'Perfil ←'}
                    {angle === 'cenital' && 'Cenital ⬆'}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* CONTENIDO PRINCIPAL */}
        <div className="bg-white rounded-b-2xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* INSTRUCCIONES (IZQUIERDA) */}
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-6xl mb-4 text-center">{instructions.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {instructions.title}
              </h3>
              <ul className="space-y-3">
                {instructions.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold">{idx + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
              
              {progress.nextAngle && (
                <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg">
                  <div className="text-xs font-semibold text-amber-800 mb-1">
                    SIGUIENTE:
                  </div>
                  <div className="text-sm text-amber-900">
                    {progress.nextAngle === 'lateral_right' && '👉 Perfil Derecho'}
                    {progress.nextAngle === 'lateral_left' && '👈 Perfil Izquierdo'}
                    {progress.nextAngle === 'cenital' && '🔝 Vista Cenital'}
                  </div>
                </div>
              )}
            </div>
            
            {/* CÁMARA/PREVIEW (CENTRO/DERECHA) */}
            <div className="lg:col-span-2">
              {currentPreview ? (
                // PREVIEW DE CAPTURA
                <div className="space-y-4">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <img
                      src={currentPreview}
                      alt="Captura"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                      ✓ Capturada
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
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
                      {isComplete ? (
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
                  </div>
                </div>
              ) : (
                // CÁMARA ACTIVA
                <div className="space-y-4">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto transform scale-x-[-1]"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Countdown overlay */}
                    {countdown && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-9xl font-black text-white animate-ping">
                          {countdown}
                        </div>
                      </div>
                    )}
                    
                    {/* Guías visuales según ángulo */}
                    <div className="absolute inset-0 pointer-events-none">
                      {progress.current === 'frontal' && (
                        <>
                          {/* Óvalo facial */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-4 border-cyan-400 rounded-full opacity-50" />
                          {/* Línea vertical */}
                          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-400 opacity-30" />
                          {/* Línea horizontal */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 opacity-30" />
                        </>
                      )}
                      
                      {(progress.current === 'lateral_right' || progress.current === 'lateral_left') && (
                        <>
                          {/* Línea de perfil */}
                          <div className="absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-amber-400 opacity-50" />
                        </>
                      )}
                      
                      {progress.current === 'cenital' && (
                        <>
                          {/* Cruz cenital */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-400 opacity-50" />
                          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-purple-400 opacity-50" />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Activar Cámara
                    </button>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
