'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { TrendingUp, Clock, ShieldCheck, DollarSign, Activity, Plus, Trash2 } from 'lucide-react'
import {
  ProductCost,
  ProcedurePrice,
  COMMON_PROCEDURES
} from '@/lib/admin/pricing-types'

export default function AdminPricingPanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'procedures' | 'strategy'>('procedures')
  const [procedures, setProcedures] = useState<ProcedurePrice[]>([])

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2 uppercase tracking-tighter">
            ESTRATEGIA DE VALOR TIPHERET
          </h1>
          <p className="text-slate-400 font-light italic">"Inversión Estructural vs. Mantenimiento Recurrente - Febrero 2026 Ready"</p>
        </div>

        <div className="p-8 bg-slate-900 border border-white/10 rounded-3xl">
          <ProceduresTab procedures={procedures} setProcedures={setProcedures} />
        </div>
      </div>
    </div>
  )
}

function ProceduresTab({ procedures, setProcedures }: { procedures: ProcedurePrice[], setProcedures: Function }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProcedure, setNewProcedure] = useState({
    name: '',
    category: 'injectable' as any,
    price_base: 0,
    labor_cost: 0,
    overhead_cost: 0,
    duration_minutes: 60
  })

  const calculateROI = (price: number, category: string) => {
    const durability = category === 'body_surgery' ? 10 : 1.5;
    return { annual: price / durability, years: durability };
  }

  const addProcedure = () => {
    const totalCost = newProcedure.labor_cost + newProcedure.overhead_cost;
    const marginPercent = newProcedure.price_base > 0 
      ? ((newProcedure.price_base - totalCost) / newProcedure.price_base) * 100 
      : 0;

    const procedure: ProcedurePrice = {
      id: Date.now().toString(),
      ...newProcedure,
      total_cost: totalCost,
      margin_percentage: marginPercent,
      active: true,
      last_updated: new Date(),
      price_premium: newProcedure.price_base * 1.2,
      price_tourism: newProcedure.price_base * 1.5,
      product_costs: [],
      description: ''
    };
    setProcedures([...procedures, procedure]);
    setShowAddForm(false);
  }

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(COMMON_PROCEDURES).map(([key, template]) => (
          <button
            key={key}
            onClick={() => {
              setNewProcedure({
                ...newProcedure,
                name: template.name,
                category: template.category as any,
                duration_minutes: template.duration_minutes
              });
              setShowAddForm(true);
            }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase text-slate-400 hover:border-purple-500 hover:text-white transition-all"
          >
            {template.name}
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-3xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Procedimiento</label>
              <input type="text" value={newProcedure.name} onChange={e => setNewProcedure({...newProcedure, name: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Precio Venta (COP)</label>
              <input type="number" value={newProcedure.price_base} onChange={e => setNewProcedure({...newProcedure, price_base: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1 text-green-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Costo Insumos (COP)</label>
              <input type="number" value={newProcedure.labor_cost} onChange={e => setNewProcedure({...newProcedure, labor_cost: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1 text-red-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Costos Fijos (COP)</label>
              <input type="number" value={newProcedure.overhead_cost} onChange={e => setNewProcedure({...newProcedure, overhead_cost: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-3 rounded-xl mt-1 text-red-400" />
            </div>
          </div>
          <button onClick={addProcedure} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all">
            Inyectar en Base de Datos
          </button>
        </div>
      )}

      <div className="space-y-6">
        {procedures.map(proc => {
          const roi = calculateROI(proc.price_base, proc.category);
          return (
            <div key={proc.id} className="bg-black/40 border border-white/5 rounded-3xl p-8 hover:border-purple-500/40 transition-all">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase">{proc.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-slate-500 uppercase">{proc.category}</span>
                    <span className="text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded text-green-500 uppercase">Margen: {proc.margin_percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Inversión Real Anualizada</p>
                  <p className="text-3xl font-black text-green-400">${Math.round(roi.annual).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                  <Clock className="text-purple-500 w-5 h-5" />
                  <p className="text-sm font-bold uppercase">Vida Útil: {roi.years} Años</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                  <ShieldCheck className="text-purple-500 w-5 h-5" />
                  <p className="text-sm font-bold uppercase">{proc.category === 'body_surgery' ? 'Restauración' : 'Mantenimiento'}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                  <TrendingUp className="text-purple-500 w-5 h-5" />
                  <p className="text-sm font-bold uppercase">ROI: {proc.category === 'body_surgery' ? 'Óptimo' : 'Recurrente'}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}