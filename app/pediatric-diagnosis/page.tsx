'use client'

import { useState } from 'react'
import { analyzepediatricPatient, IntegratedPediatricAnalysis } from '@/lib/diagnosis/integrated-pediatric-analysis'

export default function PediatricDiagnosisPage() {
  const [analysis, setAnalysis] = useState<IntegratedPediatricAnalysis | null>(null)
  const [scenario, setScenario] = useState<'healthy' | 'malnourished' | 'obese' | 'solar'>('healthy')
  
  const scenarios = {
    healthy: {
      name: 'Niño Sano de 10 años',
      description: 'Nutrición adecuada, sin exposición solar excesiva',
      mayaVision: {
        obagi_analysis: { skin_quality_score: 88, hydration_level: 82, elasticity: 85, pigmentation: 1 },
        connell_analysis: { nasolabial_depth: 1, marionette_lines: 0 }
      },
      inBody: {
        body_fat_percentage: 18,
        muscle_mass: 28,
        visceral_fat_level: 2,
        ecw_tbw_ratio: 0.375
      },
      quantum: {
        vitamins: { vitamin_d: 75, vitamin_c: 80, b12: 85 },
        minerals: { calcium: 80, iron: 78, zinc: 82 },
        nfkb_inflammation: 25,
        oxidative_stress: 30,
        collagen_synthesis: 90
      }
    },
    malnourished: {
      name: 'Niño Desnutrido de 10 años',
      description: 'Bajo peso, múltiples deficiencias nutricionales',
      mayaVision: {
        obagi_analysis: { skin_quality_score: 58, hydration_level: 45, elasticity: 52, pigmentation: 2 },
        connell_analysis: { nasolabial_depth: 4, marionette_lines: 3 }
      },
      inBody: {
        body_fat_percentage: 8,
        muscle_mass: 18,
        visceral_fat_level: 1,
        ecw_tbw_ratio: 0.42
      },
      quantum: {
        vitamins: { vitamin_d: 32, vitamin_c: 38, b12: 42 },
        minerals: { calcium: 45, iron: 38, zinc: 40 },
        nfkb_inflammation: 65,
        oxidative_stress: 72,
        collagen_synthesis: 35
      }
    },
    obese: {
      name: 'Niño con Obesidad de 10 años',
      description: 'Sobrepeso, grasa visceral elevada',
      mayaVision: {
        obagi_analysis: { skin_quality_score: 72, hydration_level: 68, elasticity: 70, pigmentation: 3 },
        connell_analysis: { nasolabial_depth: 7, marionette_lines: 5 }
      },
      inBody: {
        body_fat_percentage: 38,
        muscle_mass: 26,
        visceral_fat_level: 12,
        ecw_tbw_ratio: 0.385
      },
      quantum: {
        vitamins: { vitamin_d: 48, vitamin_c: 65, b12: 70 },
        minerals: { calcium: 65, iron: 68, zinc: 62 },
        nfkb_inflammation: 78,
        oxidative_stress: 68,
        collagen_synthesis: 62
      }
    },
    solar: {
      name: 'Niño con Exposición Solar Crónica de 10 años',
      description: 'Fotoenvejecimiento prematuro',
      mayaVision: {
        obagi_analysis: { skin_quality_score: 62, hydration_level: 55, elasticity: 58, pigmentation: 7 },
        connell_analysis: { nasolabial_depth: 3, marionette_lines: 2 }
      },
      inBody: {
        body_fat_percentage: 19,
        muscle_mass: 27,
        visceral_fat_level: 3,
        ecw_tbw_ratio: 0.370
      },
      quantum: {
        vitamins: { vitamin_d: 65, vitamin_c: 58, b12: 72 },
        minerals: { calcium: 70, iron: 72, zinc: 68 },
        nfkb_inflammation: 45,
        oxidative_stress: 68,
        collagen_synthesis: 55
      }
    }
  }
  
  const handleAnalyze = async () => {
    const data = scenarios[scenario]
    
    const result = await analyzepediatricPatient(
      10,
      data.mayaVision as any,
      data.inBody as any,
      data.quantum as any
    )
    
    setAnalysis(result)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-3">
            🔬 Análisis Integral Pediátrico
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema Multinivel: Superficie + Composición Corporal + Bioquímica
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg max-w-2xl mx-auto">
            <p className="text-yellow-900 font-bold">
              ⚠️ La edad NO determina el estado de salud
            </p>
            <p className="text-yellow-800 text-sm mt-1">
              Un niño puede tener alteraciones que un adulto sano no tiene
            </p>
          </div>
        </div>
        
        {/* Selector de Escenarios */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Selecciona un Escenario Clínico</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(scenarios).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setScenario(key as any)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  scenario === key
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{data.name}</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleAnalyze}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            🔍 Analizar Paciente (3 Niveles)
          </button>
        </div>
        
        {/* Resultados */}
        {analysis && (
          <div className="space-y-6">
            {/* Alertas Clínicas */}
            {analysis.clinical_alerts.severity !== 'none' && (
              <div className={`rounded-2xl shadow-xl p-8 ${
                analysis.clinical_alerts.severity === 'urgent'
                  ? 'bg-red-50 border-4 border-red-500'
                  : 'bg-yellow-50 border-4 border-yellow-500'
              }`}>
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  {analysis.clinical_alerts.severity === 'urgent' ? '🚨' : '⚠️'}
                  Alertas Clínicas - {analysis.clinical_alerts.severity === 'urgent' ? 'URGENTE' : 'Monitoreo'}
                </h2>
                
                <div className="space-y-3">
                  {analysis.clinical_alerts.flags.map((flag, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                      <p className="font-bold text-lg">{flag}</p>
                    </div>
                  ))}
                </div>
                
                {analysis.clinical_alerts.requires_specialist && (
                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="font-bold text-lg mb-2">📋 Derivar a:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.clinical_alerts.specialist_type.map((spec, i) => (
                        <li key={i} className="text-gray-800">{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nivel 1: Superficie */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📸 Nivel 1: Superficie
                  <span className="text-sm font-normal text-gray-500">(Maya-Vision)</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className={`font-bold text-lg ${
                      analysis.surface_analysis.skin_condition === 'normal' ? 'text-green-600' :
                      analysis.surface_analysis.skin_condition === 'compromised' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {analysis.surface_analysis.skin_condition.toUpperCase()}
                    </p>
                  </div>
                  
                  {analysis.surface_analysis.premature_aging_signs.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Signos Detectados:</p>
                      <ul className="space-y-1">
                        {analysis.surface_analysis.premature_aging_signs.map((sign, i) => (
                          <li key={i} className="text-sm bg-yellow-50 p-2 rounded">{sign}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    {analysis.surface_analysis.photo_quality_warning}
                  </div>
                </div>
              </div>
              
              {/* Nivel 2: Composición */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  💪 Nivel 2: Composición
                  <span className="text-sm font-normal text-gray-500">(InBody)</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Estado Nutricional</p>
                    <p className={`font-bold ${
                      analysis.body_composition.nutritional_status === 'normal' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {analysis.body_composition.nutritional_status.toUpperCase()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Desarrollo Muscular</p>
                    <p className="font-bold">{analysis.body_composition.muscle_development}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Percentil Grasa Corporal</p>
                    <p className="font-bold">{Math.round(analysis.body_composition.body_fat_percentile)}%</p>
                  </div>
                  
                  {analysis.body_composition.visceral_fat_concern && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-red-800 font-bold">⚠️ Grasa visceral elevada</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Hidratación</p>
                    <p className={`font-bold ${
                      analysis.body_composition.hydration_status === 'normal' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {analysis.body_composition.hydration_status}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Nivel 3: Bioquímico */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  ⚛️ Nivel 3: Bioquímico
                  <span className="text-sm font-normal text-gray-500">(Quantum)</span>
                </h3>
                
                <div className="space-y-3">
                  {analysis.biochemical_markers.nutritional_deficiencies.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Deficiencias:</p>
                      <ul className="space-y-1">
                        {analysis.biochemical_markers.nutritional_deficiencies.map((def, i) => (
                          <li key={i} className="text-sm bg-red-50 p-2 rounded text-red-800">{def}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800">✅ Sin deficiencias detectadas</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Inflamación</p>
                    <p className={`font-bold ${
                      analysis.biochemical_markers.inflammation_markers === 'normal' ? 'text-green-600' :
                      analysis.biochemical_markers.inflammation_markers === 'elevated' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {analysis.biochemical_markers.inflammation_markers.toUpperCase()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Síntesis de Colágeno</p>
                    <p className={`font-bold ${
                      analysis.biochemical_markers.collagen_synthesis === 'normal' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {analysis.biochemical_markers.collagen_synthesis.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recomendaciones */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">💎 Recomendaciones Contextualizadas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    🚨 Acciones Inmediatas
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.immediate_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    🍽️ Intervenciones Nutricionales
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.nutritional_interventions.map((intervention, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    📋 Seguimiento Médico
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.medical_followup.map((followup, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{followup}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    🚫 Contraindicaciones
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.contraindications.map((contra, i) => (
                      <li key={i} className="flex items-start gap-2 bg-red-500/20 p-2 rounded">
                        <span>•</span>
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
