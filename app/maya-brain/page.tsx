'use client'

// Forzar renderizado dinámico para Netlify
export const dynamic = 'force-dynamic';

import { useState } from 'react'
import { Brain, Activity, AlertTriangle, CheckCircle, BookOpen, ShoppingBag } from 'lucide-react'
import { analyzeWithMayaBrain, generateEpigeneticProtocol } from '@/lib/maya-brain/inbody-analyzer'
import { generateTipheretOrder } from '@/lib/maya-brain/knowledge-base'

export default function MayaBrainPage() {
  const [inBodyData, setInBodyData] = useState({
    muscleMass: 28,
    bodyFat: 22,
    phaseAngle: 6.2,
    extracellularWater: 0.38,
    intracellularWater: 25,
    visceralFatLevel: 8,
    basalMetabolicRate: 1400,
    segmentalFat: {
      rightArm: 15,
      leftArm: 16,
      trunk: 25,
      rightLeg: 18,
      leftLeg: 19,
    },
  })
  const [analysis, setAnalysis] = useState<any>(null)
  const [protocol, setProtocol] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)

  const handleAnalyze = () => {
    const result = analyzeWithMayaBrain(inBodyData)
    setAnalysis(result)
    
    if (result.requiredProtocol) {
      const protocolResult = generateEpigeneticProtocol(result)
      setProtocol(protocolResult)
    }
  }

  const handleGenerateOrder = () => {
    if (!analysis || !analysis.recommendations.length) return

    // Sincronizado con la nueva función internacional
    const orderResult = generateTipheretOrder(
      'Paciente Tipheret',
      analysis.recommendations
    )
    setOrder(orderResult)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="inline-block p-4 bg-purple-500/10 rounded-full mb-4">
            <Brain className="w-12 h-12 text-purple-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
            Cerebro <span className="text-purple-500">Maya</span>
          </h1>
          <p className="text-slate-400 text-lg font-light">
            Síntesis Cruzada de 50+ Tratados Médicos Internacionales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ENTRADA DE DATOS */}
          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-purple-400" /> Biometría InBody H30
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Masa Muscular (kg)</label>
                <input type="number" value={inBodyData.muscleMass} onChange={(e) => setInBodyData({...inBodyData, muscleMass: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Grasa Corporal (%)</label>
                <input type="number" value={inBodyData.bodyFat} onChange={(e) => setInBodyData({...inBodyData, bodyFat: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1" />
              </div>
            </div>
            <button onClick={handleAnalyze} className="w-full bg-purple-600 py-4 rounded-xl mt-6 font-bold hover:bg-purple-500 transition-all">
              EJECUTAR SÍNTESIS CLÍNICA
            </button>
          </div>

          {/* ESTADO QUIRÚRGICO */}
          {analysis && (
            <div className={`p-8 rounded-[2rem] border ${analysis.blockSurgery ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'}`}>
              <div className="flex items-center gap-3 mb-4">
                {analysis.blockSurgery ? <AlertTriangle className="text-red-500 w-8 h-8" /> : <CheckCircle className="text-green-500 w-8 h-8" />}
                <h2 className="text-2xl font-black uppercase tracking-tighter">{analysis.blockSurgery ? 'Cirugía Diferida' : 'Apto para Intervención'}</h2>
              </div>
              <p className="text-sm opacity-80">{analysis.blockReason || 'Integridad celular óptima para cicatrización avanzada.'}</p>
            </div>
          )}
        </div>

        {/* ORDEN DE COMPRA INTERNACIONAL */}
        {analysis && (
          <div className="bg-white text-black p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <ShoppingBag className="text-purple-600" /> Protocolo de Longevidad Tipheret
            </h2>
            
            <button onClick={handleGenerateOrder} className="bg-black text-white px-8 py-4 rounded-2xl font-bold mb-8 hover:bg-slate-800">
              GENERAR CARRITO PERSONALIZADO
            </button>

            {order && (
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center border-b border-black/5 pb-4">
                    <div>
                      <p className="font-bold text-sm uppercase">{item.intervention}</p>
                      <p className="text-xs text-slate-500">{item.condition}</p>
                    </div>
                    <p className="font-black text-purple-600 uppercase text-xs">Farmacia Propia</p>
                  </div>
                ))}
                <div className="pt-6 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">E-commerce Internacional</p>
                  <p className="text-lg font-bold text-green-600">Sincronizado con Tiphereth Boutique Cartagena</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}