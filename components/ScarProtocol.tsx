'use client'
import React from 'react';

export const ScarProtocol = ({ daysPostOp }: { daysPostOp: number }) => {
  const isTapePhase = daysPostOp <= 30;

  return (
    <div className="p-6 bg-slate-950 border border-emerald-500/20 rounded-[2rem] shadow-2xl">
      <h4 className="text-white font-black text-[10px] uppercase mb-4 italic">
        Gestión de Cicatriz <span className="text-emerald-500">Tipheret</span>
      </h4>
      <div className="flex gap-4">
        <div className="text-4xl">{isTapePhase ? '🩹' : '🧴'}</div>
        <div>
          <p className="text-emerald-400 font-bold text-xs uppercase">
            Fase: {isTapePhase ? 'Mecanobiología (Cintas)' : 'Remodelación (Geles)'}
          </p>
          <p className="text-slate-400 text-[11px] mt-2">
            {isTapePhase 
              ? "Use las cintas de silicona para reducir la tensión mecánica." 
              : "Inicie Kelo-cote para hidratar el tejido de colágeno."}
          </p>
        </div>
      </div>
    </div>
  );
};