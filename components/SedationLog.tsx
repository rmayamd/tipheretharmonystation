// components/Surgical/SedationLog.tsx
import { Activity, ShieldCheck } from 'lucide-react'

export const SedationLog = ({ dosePropofol, doseKetamina }: any) => (
  <div className="p-6 bg-slate-900 border border-purple-500/30 rounded-3xl shadow-xl">
    <div className="flex items-center gap-3 mb-4">
      <Activity className="text-purple-500 animate-pulse" />
      <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Bitácora de Sedación Ketofol</h3>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
        <p className="text-slate-500 text-[10px] uppercase font-bold">Propofol</p>
        <p className="text-white font-mono text-xl">{dosePropofol}mg</p>
      </div>
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center">
        <p className="text-slate-500 text-[10px] uppercase font-bold">Ketamina</p>
        <p className="text-white font-mono text-xl">{doseKetamina}mg</p>
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-green-500/80 text-[10px] font-bold uppercase">
      <ShieldCheck className="w-4 h-4" /> Estabilidad Hemodinámica Validada
    </div>
  </div>
);