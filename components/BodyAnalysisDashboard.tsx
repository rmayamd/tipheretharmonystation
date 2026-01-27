'use client'

/**
 * BODY ANALYSIS DASHBOARD - VERSIÓN DEPLOY FINAL
 */

import { useState } from 'react'
import { Calculator, Ruler, TrendingUp, Activity } from 'lucide-react'
import type {
  BodyMeasurements,
  BodyRatios,
  ImplantRecommendation,
  AbdominoplastyAnalysis
} from '@/lib/body-analysis/golden-ratio-body'

import {
  calculateBodyRatios,
  evaluateGoldenRatioBody,
  recommendBreastImplant,
  recommendGlutealAugmentation,
  recommendCalfImplant,
  analyzeAbdominoplasty,
  addRealBreastProducts,
  addRealGlutealProducts,
  addRealCalfProducts,
  addICEAnalysis
} from '@/lib/body-analysis/golden-ratio-body'

interface BodyAnalysisDashboardProps {
  patientGender: 'M' | 'F'
  patientAge: number
  patientHeight: number
  patientBMI: number
}

export function BodyAnalysisDashboard({
  patientGender,
  patientAge,
  patientHeight,
  patientBMI
}: BodyAnalysisDashboardProps) {
  const [measurements, setMeasurements] = useState<Partial<BodyMeasurements>>({
    total_height: patientHeight,
    sitting_height: patientHeight * 0.52,
    leg_length: patientHeight * 0.48,
    bust_circumference: 90,
    waist_circumference: 70,
    hip_circumference: 95,
    thigh_circumference: 55,
    calf_circumference: 35,
    shoulder_width: 38,
    chest_width: 32,
    hip_width: 34,
    breast_base_width: 12,
    gluteal_projection: 8,
    abdominal_projection: 5
  })
  
  const [analysis, setAnalysis] = useState<any>(null)
  const [breastImplant, setBreastImplant] = useState<ImplantRecommendation | null>(null)
  const [glutealImplant, setGlutealImplant] = useState<ImplantRecommendation | null>(null)
  const [calfImplant, setCalfImplant] = useState<ImplantRecommendation | null>(null)
  const [abdomenAnalysis, setAbdomenAnalysis] = useState<AbdominoplastyAnalysis | null>(null)
  
  const [currentCupSize, setCurrentCupSize] = useState<'AA' | 'A' | 'B'>('A')
  const [desiredCupSize, setDesiredCupSize] = useState<'B' | 'C' | 'D' | 'DD'>('C')
  const [pregnancies, setPregnancies] = useState(0)
  const [cSections, setCSections] = useState(0)
  const [tissueQuality, setTissueQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good')
  const [budget, setBudget] = useState<'economy' | 'standard' | 'premium'>('standard')
  const [naturalLook, setNaturalLook] = useState(true)
  
  const handleAnalyze = () => {
    const fullMeasurements = measurements as BodyMeasurements
    const bodyAnalysis = evaluateGoldenRatioBody(fullMeasurements, patientGender)
    setAnalysis(bodyAnalysis)
    
    if (patientGender === 'F') {
      let breast = recommendBreastImplant(
        fullMeasurements,
        desiredCupSize,
        currentCupSize,
        patientHeight,
        measurements.chest_width || 32
      )
      breast = addRealBreastProducts(breast, tissueQuality, budget, naturalLook)
      breast = addICEAnalysis(breast, fullMeasurements)
      setBreastImplant(breast)
      
      let gluteal = recommendGlutealAugmentation(fullMeasurements, patientGender)
      gluteal = addRealGlutealProducts(gluteal, budget === 'economy' ? 'standard' : 'premium')
      setGlutealImplant(gluteal)
    }
    
    let calf = recommendCalfImplant(fullMeasurements, patientGender)
    calf = addRealCalfProducts(calf)
    setCalfImplant(calf)
    
    const abdomen = analyzeAbdominoplasty(
      fullMeasurements,
      patientBMI,
      patientAge,
      pregnancies,
      cSections
    )
    setAbdomenAnalysis(abdomen)
  }
  
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-4xl font-black mb-2 tracking-tighter italic">📐 ANÁLISIS CORPORAL</h2>
        <p className="text-xl opacity-90 font-medium">Proporción Áurea + Volumetría Inteligente</p>
      </div>
      
      {/* FORMULARIO */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 italic">
          <Ruler className="w-7 h-7 text-purple-600" />
          Medidas Corporales
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Altura Total (cm)</label>
            <input type="number" value={measurements.total_height || ''} onChange={(e) => setMeasurements({ ...measurements, total_height: Number(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none transition-all font-mono" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Busto (cm)</label>
            <input type="number" value={measurements.bust_circumference || ''} onChange={(e) => setMeasurements({ ...measurements, bust_circumference: Number(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none transition-all font-mono" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Cintura (cm)</label>
            <input type="number" value={measurements.waist_circumference || ''} onChange={(e) => setMeasurements({ ...measurements, waist_circumference: Number(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none transition-all font-mono" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Cadera (cm)</label>
            <input type="number" value={measurements.hip_circumference || ''} onChange={(e) => setMeasurements({ ...measurements, hip_circumference: Number(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none transition-all font-mono" />
          </div>
        </div>
        
        <button onClick={handleAnalyze} className="mt-8 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-3 shadow-xl italic tracking-widest">
          <Calculator className="w-6 h-6" />
          🧬 ANALIZAR GOLDEN RATIO CORPORAL
        </button>
      </div>
      
      {/* RESULTADOS */}
      {analysis && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Activity className="w-40 h-40" /></div>
            <div className="text-center mb-8">
              <div className="text-8xl font-black mb-2 italic tracking-tighter">{analysis.overall_score.toFixed(0)}<span className="text-2xl text-purple-400">/100</span></div>
              <div className="text-xs font-black uppercase tracking-[0.4em] text-purple-300">Golden Ratio Score Corporal</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(analysis.deviations).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">{key.replace(/_/g, ' ')}</div>
                  <div className="text-3xl font-mono font-bold">{value.current.toFixed(2)}</div>
                  <div className="text-[9px] text-gray-400 mt-1 uppercase font-bold">Ideal: {value.ideal.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MAMARIOS CON TIPOS CORREGIDOS */}
          {breastImplant && patientGender === 'F' && (
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-gray-100">
              <h3 className="text-3xl font-black text-slate-900 mb-8 italic">🔮 Implantes Mamarios</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-pink-50/50 rounded-[2.5rem] p-8 border border-pink-100">
                  <div className="text-6xl font-black text-pink-600 mb-2 italic tracking-tighter">{breastImplant.volume_cc_optimal}cc</div>
                  <div className="text-xs font-black text-pink-400 uppercase tracking-widest">Sugerencia de Volumen Tiphereth</div>
                </div>
                <div className="space-y-4">
                  {breastImplant.considerations.map((con: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-sm text-blue-800 font-medium">
                      <span className="text-blue-400 font-bold">●</span> {con}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* PRODUCTOS REALES CON TIPOS CORREGIDOS */}
              {breastImplant.recommended_products && breastImplant.recommended_products.length > 0 && (
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                  {breastImplant.recommended_products.map((product: any, idx: number) => (
                    <div key={idx} className="bg-white border-2 border-gray-100 rounded-[2rem] p-6 hover:border-purple-500 transition-all group">
                      <div className="text-[10px] font-black text-purple-600 uppercase mb-4 tracking-widest">{product.manufacturer}</div>
                      <div className="text-3xl font-black text-slate-900 mb-4">{product.volume_cc}cc</div>
                      <div className="space-y-2 mb-6">
                        {product.features.slice(0, 3).map((feature: any, fidx: number) => (
                          <div key={fidx} className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-2">
                            <span className="text-purple-500 italic">✓</span> {feature}
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-purple-600 transition-all">Ver Detalles</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABDOMINOPLASTIA CON TIPOS CORREGIDOS */}
          {abdomenAnalysis && (
            <div className="bg-slate-950 rounded-[3.5rem] p-10 shadow-2xl border border-white/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white italic">✂️ Abdominoplastia</h3>
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${abdomenAnalysis.candidate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400'}`}>
                  {abdomenAnalysis.candidate ? 'Candidata Confirmada' : 'No Recomendado'}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Técnica</div>
                  <div className="text-xl font-black text-white uppercase italic">{abdomenAnalysis.type}</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reducción</div>
                  <div className="text-xl font-black text-emerald-400 italic">-{abdomenAnalysis.expected_improvement.waist_reduction_cm}cm</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reposo</div>
                  <div className="text-xl font-black text-blue-400 italic">{abdomenAnalysis.recovery_weeks} Semanas</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}