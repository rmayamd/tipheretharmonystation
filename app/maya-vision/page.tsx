'use client'

import { useState } from 'react'
import { Upload, Eye, CheckCircle } from 'lucide-react'
import { analyzeImage, analyzeTension } from '@/lib/maya-vision/analyzer'

export default function MayaVisionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [tensionAnalysis, setTensionAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const result = await analyzeImage(selectedFile)
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTensionAnalysis = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const result = await analyzeTension(selectedFile)
      setTensionAnalysis(result)
    } catch (error) {
      console.error('Error analyzing tension:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            Maya-Vision
          </h1>
          <p className="text-lg text-zen-secondary">
            Motor de Análisis Fotográfico Propietario
          </p>
          <p className="text-sm text-luxury-dark/70 mt-2">
            Análisis de Laxitud (Connell), Calidad de Piel (Obagi), Simetría y Mecánica de Tejido
          </p>
        </div>

        {/* Upload Section */}
        <div className="luxury-card mb-6">
          <h2 className="text-2xl font-bold mb-4">Subir Imagen</h2>
          <div className="border-2 border-dashed border-zen-primary rounded-lg p-8 text-center">
            <Upload className="w-16 h-16 text-zen-primary mx-auto mb-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="luxury-button cursor-pointer inline-block"
            >
              Seleccionar Imagen
            </label>
            {selectedFile && (
              <p className="mt-4 text-sm text-luxury-dark/70">
                Archivo seleccionado: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="zen-button flex-1"
            >
              {loading ? 'Analizando...' : 'Análisis Completo'}
            </button>
            <button
              onClick={handleTensionAnalysis}
              disabled={!selectedFile || loading}
              className="luxury-button flex-1"
            >
              {loading ? 'Analizando...' : 'Análisis de Tensión (Ogawa)'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Laxitud */}
            <div className="luxury-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                Análisis de Laxitud (Connell)
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-luxury-dark/70">Score de Laxitud</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-zen-primary h-4 rounded-full"
                      style={{ width: `${analysis.laxity.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{analysis.laxity.score.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="font-semibold">Grado Connell: {analysis.laxity.connellGrade}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Recomendaciones:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.laxity.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Calidad de Piel */}
            <div className="luxury-card">
              <h2 className="text-2xl font-bold mb-4">Calidad de Piel (Obagi)</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-luxury-dark/70">Score General</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-zen-secondary h-4 rounded-full"
                      style={{ width: `${analysis.skinQuality.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{analysis.skinQuality.score.toFixed(1)}%</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-luxury-dark/70">Hidratación</p>
                    <p className="text-lg font-bold">{analysis.skinQuality.hydration.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-dark/70">Elasticidad</p>
                    <p className="text-lg font-bold">{analysis.skinQuality.elasticity.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-luxury-dark/70">Pigmentación</p>
                    <p className="text-lg font-bold">{analysis.skinQuality.pigmentation.toFixed(0)}%</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Tipo Obagi: {analysis.skinQuality.obagiType}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Recomendaciones:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.skinQuality.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Simetría */}
            <div className="luxury-card">
              <h2 className="text-2xl font-bold mb-4">Análisis de Simetría</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-2">Simetría Facial</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-zen-primary h-4 rounded-full"
                      style={{ width: `${analysis.symmetry.facial.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{analysis.symmetry.facial.score.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Simetría Corporal</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-zen-secondary h-4 rounded-full"
                      style={{ width: `${analysis.symmetry.body.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{analysis.symmetry.body.score.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Mecánica de Tejido */}
            <div className="luxury-card">
              <h2 className="text-2xl font-bold mb-4">Mecánica de Tejido</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-luxury-dark/70">Elasticidad Esperada</p>
                  <p className="text-2xl font-bold">{analysis.tissueMechanics.expectedYield.toFixed(1)}%</p>
                  <p className="text-xs text-luxury-dark/70 mt-1">
                    Porcentaje de ceder de la piel según análisis
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Recomendaciones:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.tissueMechanics.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tension Analysis Results */}
        {tensionAnalysis && (
          <div className="luxury-card mt-6 border-l-4 border-red-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Análisis de Tensión Post-Operatoria (Ogawa)
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-luxury-dark/70">Score de Tensión</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      tensionAnalysis.tensionScore > 70
                        ? 'bg-red-600'
                        : tensionAnalysis.tensionScore > 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${tensionAnalysis.tensionScore}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{tensionAnalysis.tensionScore.toFixed(1)}%</p>
              </div>
              <div>
                <p className="font-semibold">
                  Riesgo de Queloide: <span className={
                    tensionAnalysis.keloidRisk === 'high'
                      ? 'text-red-600'
                      : tensionAnalysis.keloidRisk === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }>{tensionAnalysis.keloidRisk.toUpperCase()}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-luxury-dark/70">Progreso de Cicatrización</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-zen-primary h-4 rounded-full"
                    style={{ width: `${tensionAnalysis.healingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">{tensionAnalysis.healingProgress.toFixed(1)}%</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Recomendaciones:</p>
                <ul className="list-disc list-inside space-y-1">
                  {tensionAnalysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
