'use client'

import { useState } from 'react'
import { Shield, Upload, TrendingUp, BookOpen } from 'lucide-react'
import { analyzeTension } from '@/lib/maya-vision/analyzer'

export default function RecoveryPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
            Recuperación y Epigenética
          </h1>
          <p className="text-lg text-zen-secondary">
            Monitor de Tensión (Ogawa) y Plan Nutricional Epigenético (Yu)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monitor de Tensión */}
          <div className="luxury-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Monitor de Tensión (Ogawa)
            </h2>
            <p className="text-sm text-luxury-dark/70 mb-4">
              Análisis de tensión mecánica post-operatoria para prevenir queloides
            </p>

            <div className="border-2 border-dashed border-zen-primary rounded-lg p-6 text-center mb-4">
              <Upload className="w-12 h-12 text-zen-primary mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="tension-upload"
              />
              <label
                htmlFor="tension-upload"
                className="luxury-button cursor-pointer inline-block"
              >
                Subir Foto Post-Operatoria
              </label>
              {selectedFile && (
                <p className="mt-4 text-sm text-luxury-dark/70">
                  {selectedFile.name}
                </p>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="zen-button w-full"
            >
              {loading ? 'Analizando...' : 'Analizar Tensión'}
            </button>

            {tensionAnalysis && (
              <div className="mt-6 space-y-4">
                <div className={`p-4 rounded-lg ${
                  tensionAnalysis.keloidRisk === 'high'
                    ? 'bg-red-50 border-2 border-red-500'
                    : tensionAnalysis.keloidRisk === 'medium'
                    ? 'bg-yellow-50 border-2 border-yellow-500'
                    : 'bg-green-50 border-2 border-green-500'
                }`}>
                  <p className="font-semibold mb-2">Riesgo de Queloide</p>
                  <p className={`text-2xl font-bold ${
                    tensionAnalysis.keloidRisk === 'high'
                      ? 'text-red-600'
                      : tensionAnalysis.keloidRisk === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {tensionAnalysis.keloidRisk.toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-luxury-dark/70 mb-2">Score de Tensión</p>
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
                  <p className="text-sm text-luxury-dark/70 mb-2">Progreso de Cicatrización</p>
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
            )}
          </div>

          {/* Plan Nutricional Epigenético */}
          <div className="luxury-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Plan Nutricional Epigenético (Byung Pal Yu)
            </h2>
            <p className="text-sm text-luxury-dark/70 mb-4">
              Dieta para silenciar genes de envejecimiento
            </p>

            <div className="space-y-4">
              <div className="bg-zen-light p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Alimentos que Activan Longevidad:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Vegetales crucíferos (brócoli, coliflor)</li>
                  <li>Pescado rico en omega-3 (salmón, sardinas)</li>
                  <li>Frutos rojos (arándanos, frambuesas)</li>
                  <li>Nueces y semillas</li>
                  <li>Té verde</li>
                  <li>Cúrcuma</li>
                  <li>Aceite de oliva extra virgen</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-red-700">Alimentos a Evitar:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>Azúcares refinados</li>
                  <li>Alimentos procesados</li>
                  <li>Grasas trans</li>
                  <li>Alcohol en exceso</li>
                  <li>Carne roja procesada</li>
                </ul>
              </div>

              <div className="bg-luxury-gold/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Principios Epigenéticos:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Restricción calórica intermitente</li>
                  <li>Ayuno intermitente (16:8)</li>
                  <li>Alimentos ricos en polifenoles</li>
                  <li>Actividad física regular</li>
                  <li>Manejo del estrés</li>
                </ul>
              </div>

              <div className="bg-zen-light p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Suplementación Recomendada:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Resveratrol (activador de SIRT1)</li>
                  <li>NMN (Nicotinamida Mononucleótido)</li>
                  <li>Metformina (bajo supervisión médica)</li>
                  <li>Rapamicina (bajo supervisión médica)</li>
                  <li>Omega-3 de alta pureza</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Protocolo de Tensión Zero */}
        <div className="luxury-card mt-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Protocolo de Tensión Zero
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zen-light p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Fase 1: Inmediata (0-7 días)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Silicona médica 2x al día</li>
                <li>Masaje suave con aceite de rosa mosqueta</li>
                <li>Evitar exposición solar</li>
              </ul>
            </div>
            <div className="bg-zen-light p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Fase 2: Intermedia (7-30 días)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Continuar silicona</li>
                <li>Gel de aloe vera puro</li>
                <li>Vitamina E tópica</li>
                <li>Masaje terapéutico diario</li>
              </ul>
            </div>
            <div className="bg-zen-light p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Fase 3: Mantenimiento (30+ días)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Monitoreo continuo</li>
                <li>Protección solar estricta</li>
                <li>Evaluación de resultados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
