'use client'

import { useState, useRef, useEffect } from 'react'
import { cameraAnalyzer, FacialAnalysisResult } from '@/lib/maya-vision/real-camera-analyzer'
import { Camera, Download, RefreshCw, CheckCircle } from 'lucide-react'

export default function PhotoAnalysisPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<FacialAnalysisResult | null>(null)
  const [patientId, setPatientId] = useState('')
  const [patientAge, setPatientAge] = useState<number>(35)
  
  useEffect(() => {
    return () => {
      cameraAnalyzer.stopCamera()
    }
  }, [])
  
  const handleStartCamera = async () => {
    if (videoRef.current) {
      const success = await cameraAnalyzer.startCamera(videoRef.current)
      setCameraActive(success)
    }
  }
  
  const handleCapturePhoto = () => {
    const imageData = cameraAnalyzer.capturePhoto()
    if (imageData) {
      setCapturedImage(imageData)
      cameraAnalyzer.stopCamera()
      setCameraActive(false)
    }
  }
  
  const handleAnalyze = async () => {
    if (!capturedImage) return
    
    setAnalyzing(true)
    try {
      const result = await cameraAnalyzer.analyzePhoto(capturedImage, patientAge)
      setAnalysis(result)
      
      // Guardar en Supabase si hay patientId
      if (patientId) {
        await cameraAnalyzer.saveAnalysis(patientId, capturedImage, result)
      }
    } catch (error) {
      console.error('Error analizando:', error)
    } finally {
      setAnalyzing(false)
    }
  }
  
  const handleRetake = () => {
    setCapturedImage(null)
    setAnalysis(null)
    handleStartCamera()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            📸 Maya-Vision Real
          </h1>
          <p className="text-xl text-gray-600">
            Análisis Fotográfico Avanzado: Connell + Obagi + Golden Ratio
          </p>
        </div>
        
        {/* Patient Info Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-4">Información del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Paciente (opcional)
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="UUID del paciente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad del Paciente ⚠️ <span className="text-red-600 font-bold">IMPORTANTE</span>
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                min="1"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {patientAge < 18 && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Menor de edad: Solo análisis preventivo
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera/Photo Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Captura Facial
            </h2>
            
            <div className="relative aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-6">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captura"
                  className="w-full h-full object-cover"
                />
              )}
              
              {!cameraActive && !capturedImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Haz clic para iniciar la cámara</p>
                  </div>
                </div>
              )}
              
              {cameraActive && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  EN VIVO
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            <div className="flex gap-4">
              {!cameraActive && !capturedImage && (
                <button
                  onClick={handleStartCamera}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Iniciar Cámara
                </button>
              )}
              
              {cameraActive && (
                <button
                  onClick={handleCapturePhoto}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  📸 Capturar Foto
                </button>
              )}
              
              {capturedImage && !analysis && (
                <>
                  <button
                    onClick={handleRetake}
                    className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Repetir
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                  >
                    {analyzing ? '⏳ Analizando...' : '🔍 Analizar'}
                  </button>
                </>
              )}
              
              {analysis && (
                <button
                  onClick={handleRetake}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Nueva Foto
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="space-y-6">
            {analyzing && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-blue-900 font-bold mb-2">🔍 Analizando...</p>
                <p className="text-blue-800 text-sm">
                  Aplicando algoritmos de Connell y Obagi...
                </p>
              </div>
            )}
            
            {analysis && (
              <>
                {/* Scores Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Puntuación General</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Calidad de Piel (Obagi)</span>
                        <span className="font-bold text-green-600">
                          {analysis.obagi_analysis.skin_quality_score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysis.obagi_analysis.skin_quality_score}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Laxitud Facial (Connell)</span>
                        <span className="font-bold text-amber-600">
                          {analysis.connell_analysis.facial_laxity_score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysis.connell_analysis.facial_laxity_score}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Simetría (Golden Ratio)</span>
                        <span className="font-bold text-purple-600">
                          {analysis.symmetry_analysis.golden_ratio_score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${analysis.symmetry_analysis.golden_ratio_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connell Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🔬 Análisis Connell (Laxitud)
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severidad de Jowls:</span>
                      <span className="font-bold">{analysis.connell_analysis.jowl_severity}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surcos Nasolabiales:</span>
                      <span className="font-bold">{analysis.connell_analysis.nasolabial_depth}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Líneas de Marioneta:</span>
                      <span className="font-bold">{analysis.connell_analysis.marionette_lines}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bandas de Cuello:</span>
                      <span className="font-bold">
                        {analysis.connell_analysis.neck_bands ? '✓ Presentes' : '✗ No detectadas'}
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="font-bold text-blue-900">
                        ✨ Técnica Recomendada:
                      </p>
                      <p className="text-blue-800">
                        {analysis.connell_analysis.recommended_technique}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Obagi Analysis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🧪 Análisis Obagi (Piel)
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Textura:</span>
                      <span className="font-bold capitalize">{analysis.obagi_analysis.texture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hidratación:</span>
                      <span className="font-bold">{analysis.obagi_analysis.hydration_level}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pigmentación:</span>
                      <span className="font-bold">{analysis.obagi_analysis.pigmentation}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Elasticidad:</span>
                      <span className="font-bold">{analysis.obagi_analysis.elasticity}/100</span>
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="font-bold text-purple-900">
                        ✨ Protocolo Recomendado:
                      </p>
                      <p className="text-purple-800">
                        {analysis.obagi_analysis.recommended_protocol}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">💎 Recomendaciones</h3>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-90">Inversión Estimada</p>
                        <p className="text-2xl font-bold">
                          ${(analysis.estimated_cost / 1000000).toFixed(1)}M COP
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Recuperación</p>
                        <p className="font-bold">{analysis.recovery_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {patientId && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <p className="text-green-900 font-bold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Análisis guardado en Supabase
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
