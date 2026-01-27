'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, Users, MessageSquare } from 'lucide-react'
import { calculateVitalValue, generateNeuroSalesMessage } from '@/lib/marketing/vital-value-calculator'

export default function MarketingPage() {
  const [patientAge, setPatientAge] = useState(45)
  const [segment, setSegment] = useState<'joven' | 'maduro' | 'longevidad'>('maduro')
  const [procedureType, setProcedureType] = useState('Deep Plane')
  const [baseCost, setBaseCost] = useState(15000000)
  const [yearsAdded, setYearsAdded] = useState(8)
  const [qualityImprovement, setQualityImprovement] = useState(35)
  const [calculation, setCalculation] = useState<any>(null)
  const [neuroMessage, setNeuroMessage] = useState('')

  const handleCalculate = () => {
    const result = calculateVitalValue(
      {
        type: procedureType,
        baseCost,
        expectedYearsAdded: yearsAdded,
        qualityImprovement,
      },
      patientAge
    )
    setCalculation(result)
  }

  const handleGenerateMessage = () => {
    const message = generateNeuroSalesMessage(patientAge, segment, procedureType)
    setNeuroMessage(message)
  }

  return (
    <div className="min-h-screen zen-gradient p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zen-dark mb-2">
            Marketing & Persuasión
          </h1>
          <p className="text-lg text-zen-secondary">
            Patient Journey, Calculadora de Valor Vital y Neuroventas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculadora de Valor Vital */}
          <div className="luxury-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Calculator className="w-6 h-6 mr-2" />
              Calculadora de Valor Vital
            </h2>
            <p className="text-sm text-luxury-dark/70 mb-4">
              Retorno de Inversión en Longevidad (no "precio")
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tipo de Procedimiento
                </label>
                <input
                  type="text"
                  value={procedureType}
                  onChange={(e) => setProcedureType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Inversión Base (COP)
                </label>
                <input
                  type="number"
                  value={baseCost}
                  onChange={(e) => setBaseCost(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Años de Longevidad Añadidos
                </label>
                <input
                  type="number"
                  value={yearsAdded}
                  onChange={(e) => setYearsAdded(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mejora de Calidad de Vida (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={qualityImprovement}
                  onChange={(e) => setQualityImprovement(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <button
                onClick={handleCalculate}
                className="zen-button w-full"
              >
                Calcular Valor Vital
              </button>
            </div>

            {calculation && (
              <div className="mt-6 space-y-4">
                <div className="bg-zen-light p-4 rounded-lg">
                  <p className="text-sm text-luxury-dark/70">ROI en Longevidad</p>
                  <p className="text-3xl font-bold text-zen-primary">
                    {calculation.roiPercentage.toFixed(0)}%
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-luxury-dark/70">Mensual</p>
                    <p className="text-lg font-bold">
                      ${(calculation.monthlyValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-luxury-dark/70">Diario</p>
                    <p className="text-lg font-bold">
                      ${(calculation.dailyValue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-luxury-dark/70">Por Hora</p>
                    <p className="text-lg font-bold">
                      ${calculation.hourlyValue.toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="bg-luxury-gold/10 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Mensaje de Valor:</p>
                  <p className="text-sm">{calculation.message}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">Comparaciones:</p>
                  <p className="text-xs text-luxury-dark/70">
                    {calculation.comparison.vsLuxuryCar}
                  </p>
                  <p className="text-xs text-luxury-dark/70">
                    {calculation.comparison.vsLuxuryWatch}
                  </p>
                  <p className="text-xs text-luxury-dark/70">
                    {calculation.comparison.vsVacation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Neuroventas */}
          <div className="luxury-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Generador de Neuroventas
            </h2>
            <p className="text-sm text-luxury-dark/70 mb-4">
              Scripts personalizados basados en perfil biológico
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Edad del Paciente
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Segmento
                </label>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as any)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="joven">Joven (Fitness/Prevención)</option>
                  <option value="maduro">Maduro (Regeneración)</option>
                  <option value="longevidad">Longevidad (45+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tipo de Procedimiento
                </label>
                <input
                  type="text"
                  value={procedureType}
                  onChange={(e) => setProcedureType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <button
                onClick={handleGenerateMessage}
                className="zen-button w-full"
              >
                Generar Mensaje
              </button>
            </div>

            {neuroMessage && (
              <div className="mt-6 bg-zen-light p-4 rounded-lg">
                <p className="font-semibold mb-2">Mensaje Generado:</p>
                <p className="text-sm italic">{neuroMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient Journey Section */}
        <div className="luxury-card mt-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Patient Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Awareness', 'Consideration', 'Decision', 'Post-Op', 'Retention'].map((stage, idx) => (
              <div key={idx} className="bg-zen-light p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-zen-primary text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  {idx + 1}
                </div>
                <p className="font-semibold text-sm">{stage}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-luxury-dark/70 mt-4">
            Sistema de seguimiento automatizado que envía contenido de autoridad basado en el procedimiento del paciente
          </p>
        </div>
      </div>
    </div>
  )
}
