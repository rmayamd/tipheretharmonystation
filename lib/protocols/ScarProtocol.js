'use client'

import React from 'react';
import { PencilLine, Droplets } from 'lucide-react';

interface ScarProtocolProps {
  daysPostOp: number;
}

export const ScarProtocol = ({ daysPostOp = 0 }: ScarProtocolProps) => {
  // Lógica: Los primeros 30 días son de control mecánico (Cintas)
  // Después de los 30 días es remodelación química (Geles/Kelo-cote)
  const isTapePhase = daysPostOp <= 30;
  
  return (
    <div className="p-6 bg-slate-950 border border-emerald-500/20 rounded-[2.5rem] shadow-2xl transition-all hover:border-emerald-500/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
           {isTapePhase ? <PencilLine className="w-4 h-4 text-emerald-500" /> : <Droplets className="w-4 h-4 text-emerald-400" />}
        </div>
        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic">
          Gestión de Cicatriz <span className="text-emerald-500">Tipheret</span>
        </h4>
      </div>

      <div className="flex gap-5 items-start">
        <div className="text-4xl filter drop-shadow-md">
          {isTapePhase ? '🩹' : '🧴'}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-emerald-400 font-bold text-xs uppercase tracking-tight">
            Fase Actual: {isTapePhase ? 'Mecanobiología (Cintas)' : 'Remodelación (Geles)'}
          </p>
          <p className="text-slate-400 text-[11px] mt-2 leading-relaxed font-medium">
            {isTapePhase 
              ? "Protocolo de Compresión: Use las cintas de silicona para reducir la tensión mecánica y prevenir queloides." 
              : "Protocolo de Hidratación: Inicie Kelo-cote para ocluir y aplanar el tejido de colágeno en formación."}
          </p>
          <div className="mt-4 inline-flex items-center text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">
            Día {daysPostOp} de Recuperación • Protocolo Ogawa
          </div>
        </div>
      </div>
    </div>
  );
};