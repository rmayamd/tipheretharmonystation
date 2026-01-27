'use client'

import { useState } from 'react'
import { Activity, Database, Eye, CheckCircle, XCircle } from 'lucide-react'
import { validateSurgeryEligibility, generateEpigeneticProtocol } from '@/lib/medical-logic/cross-validation'

export default function DiagnosisPage() {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | null>(null)
  const [quantumData, setQuantumData] = useState({
    collagenSynthesis: 65,
    nfkbInflammation: 45,
  })
  const [inBodyData, setInBodyData] = useState({
    extracellularWater: 0.35,
    bodyFatPercentage: 22,
    phaseAngle: 6.5,
  })
  const [aestheticData, setAestheticData] = useState({
    skinQuality: 75,
    tissueMechanics: {
      expectedYield: 25,
    },
  })
  const [validation, setValidation] = useState<any>(null)

  const handleValidate = () => {
    const result = validateSurgeryEligibility(quantumData, inBodyData, aestheticData)
    setValidation(result)
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-zen-dark mb-8">
          Diagnóstico de 3 Niveles
        </h1>

        {/* Niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setCurrentLevel(1)}
            className={`luxury-card text-left hover:scale-105 transition-transform ${
              currentLevel === 1 ? 'border-2 border-zen-primary' : ''
            }`}
          >
            <Database className="w-12 h-12 text-zen-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nivel 1: Bio-Cuántico</h2>
            <p className="text-luxury-dark/70">
              53 informes: Vitaminas, Toxinas, ADN
            </p>
          </button>

          <button
            onClick={() => setCurrentLevel(2)}
            className={`luxury-card text-left hover:scale-105 transition-transform ${
              currentLevel === 2 ? 'border-2 border-zen-primary' : ''
            }`}
          >
            <Activity className="w-12 h-12 text-zen-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nivel 2: Bio-Físico</h2>
            <p className="text-luxury-dark/70">
              InBody H30: Composición física y ERAS
            </p>
          </button>

          <button
            onClick={() => setCurrentLevel(3)}
            className={`luxury-card text-left hover:scale-105 transition-transform ${
              currentLevel === 3 ? 'border-2 border-zen-primary' : ''
            }`}
          >
            <Eye className="w-12 h-12 text-zen-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nivel 3: Bio-Estético</h2>
            <p className="text-luxury-dark/70">
              Escaneo 3D: VASER, Deep Plane, Estética Íntima
            </p>
          </button>
        </div>

        {/* Formulario de Nivel 1 */}
        {currentLevel === 1 && (
          <div className="luxury-card mb-6">
            <h2 className="text-2xl font-bold mb-4">Análisis Bio-Cuántico</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Síntesis de Colágeno (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quantumData.collagenSynthesis}
                  onChange={(e) =>
                    setQuantumData({
                      ...quantumData,
                      collagenSynthesis: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Inflamación NFkB (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quantumData.nfkbInflammation}
                  onChange={(e) =>
                    setQuantumData({
                      ...quantumData,
                      nfkbInflammation: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Formulario de Nivel 2 */}
        {currentLevel === 2 && (
          <div className="luxury-card mb-6">
            <h2 className="text-2xl font-bold mb-4">Análisis InBody H30</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Agua Extracelular (0-1)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={inBodyData.extracellularWater}
                  onChange={(e) =>
                    setInBodyData({
                      ...inBodyData,
                      extracellularWater: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Porcentaje de Grasa Corporal
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inBodyData.bodyFatPercentage}
                  onChange={(e) =>
                    setInBodyData({
                      ...inBodyData,
                      bodyFatPercentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phase Angle
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={inBodyData.phaseAngle}
                  onChange={(e) =>
                    setInBodyData({
                      ...inBodyData,
                      phaseAngle: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Formulario de Nivel 3 */}
        {currentLevel === 3 && (
          <div className="luxury-card mb-6">
            <h2 className="text-2xl font-bold mb-4">Análisis Bio-Estético</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Calidad de Piel (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={aestheticData.skinQuality}
                  onChange={(e) =>
                    setAestheticData({
                      ...aestheticData,
                      skinQuality: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Elasticidad Esperada (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={aestheticData.tissueMechanics.expectedYield}
                  onChange={(e) =>
                    setAestheticData({
                      ...aestheticData,
                      tissueMechanics: {
                        expectedYield: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Validación Médica Cruzada */}
        <div className="luxury-card">
          <h2 className="text-2xl font-bold mb-4">Validación Médica Cruzada</h2>
          <button
            onClick={handleValidate}
            className="zen-button mb-4"
          >
            Validar Elegibilidad Quirúrgica
          </button>

          {validation && (
            <div className={`p-6 rounded-lg ${
              validation.canProceed
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}>
              <div className="flex items-center mb-4">
                {validation.canProceed ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                )}
                <h3 className="text-xl font-bold">
                  {validation.canProceed
                    ? 'Paciente Apto para Cirugía'
                    : 'Cirugía Bloqueada - Protocolo Requerido'}
                </h3>
              </div>

              {!validation.canProceed && (
                <div className="space-y-3">
                  <p className="font-semibold text-red-700">
                    Razón: {validation.blockReason}
                  </p>
                  <p className="text-sm">
                    Protocolo requerido: {validation.requiredProtocol}
                  </p>
                  <p className="text-sm">
                    Duración estimada: {validation.estimatedDays} días
                  </p>

                  {validation.requiredProtocol && (
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <h4 className="font-bold mb-2">Plan de Pre-habilitación:</h4>
                      {(() => {
                        const protocol = generateEpigeneticProtocol(validation)
                        if (!protocol) return null
                        return (
                          <div>
                            <p className="text-sm mb-2">{protocol.description}</p>
                            <p className="text-sm font-semibold">Alimentos recomendados:</p>
                            <ul className="list-disc list-inside text-sm">
                              {protocol.nutritionPlan.foods.map((food, idx) => (
                                <li key={idx}>{food}</li>
                              ))}
                            </ul>
                            <p className="text-sm font-semibold mt-2">Suplementos:</p>
                            <ul className="list-disc list-inside text-sm">
                              {protocol.nutritionPlan.supplements.map((supp, idx) => (
                                <li key={idx}>{supp}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
