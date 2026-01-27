// components/Surgical/AnesthesiaSafety.tsx
import { ShieldCheck, Activity } from 'lucide-react'

export const AnesthesiaSafety = ({ propofolDose, ketaminaDose }: any) => (
  <div className="p-5 bg-black border border-purple-500/40 rounded-3xl">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-white text-[10px] font-black uppercase tracking-widest italic">Protocolo Sedación Tipheret</h4>
      <ShieldCheck className="text-purple-500 w-5 h-5" />
    </div>
    <div className="flex gap-4">
      <div className="flex-1 bg-purple-500/10 p-3 rounded-2xl">
        <p className="text-purple-300 text-[8px] uppercase font-bold">Propofol (Hipnosis)</p>
        <p className="text-white font-mono text-lg">{propofolDose} <span className="text-[10px]">mg</span></p>
      </div>
      <div className="flex-1 bg-purple-500/10 p-3 rounded-2xl">
        <p className="text-purple-300 text-[8px] uppercase font-bold">Ketamina (Analgesia)</p>
        <p className="text-white font-mono text-lg">{ketaminaDose} <span className="text-[10px]">mg</span></p>
      </div>
    </div>
    <div className="mt-3 text-[9px] text-slate-500 italic">
      Estabilidad hemodinámica y amnesia anterógrada garantizada (Ref: Manual Terapéutica p.1102).
    </div>
  </div>
);