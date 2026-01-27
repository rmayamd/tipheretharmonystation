'use client'
import { useState } from 'react'
import { AlertCircle, Thermometer, Activity } from 'lucide-react'

export function PatientRecoveryPortal() {
  const [painLevel, setPainLevel] = useState(0)
  
  return (
    <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl">
      <h3 className="text-white font-black uppercase text-sm tracking-widest mb-6 italic">
        Monitoreo Post-Op <span className="text-purple-500">Real-Time</span>
      </h3>
      
      {/* Alerta de Seguridad basada en el Manual de Terapéutica */}
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-8">
        <p className="text-red-400 text-[10px] font-bold uppercase flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Signos de Alerta (Reportar Inmediato)
        </p>
        <ul className="text-white/60 text-[9px] mt-2 list-disc ml-4 font-mono">
          <li>Fiebre mayor a 38.3°C</li>
          <li>Dolor pantorrillas (Riesgo TVP - Ref: Clexane)</li>
          <li>Dificultad respiratoria</li>
        </ul>
      </div>

      <div className="space-y-6">
        <p className="text-slate-400 text-xs uppercase font-bold">Nivel de Dolor (EVA): {painLevel}/10</p>
        <input 
          type="range" min="0" max="10" value={painLevel} 
          onChange={(e) => setPainLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        
        {painLevel > 6 && (
          <p className="text-amber-400 text-[10px] italic">
            * Se recomienda dosis de rescate: Ibuprofeno + Codeína (Ref: p.724 Manual CIB).
          </p>
        )}
      </div>
    </div>
  )
}