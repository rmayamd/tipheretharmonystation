// components/Surgical/BiovigilancePortal.tsx
'use client'
import { AlertTriangle } from 'lucide-react'

export function BiovigilancePortal({ painScore }: { painScore: number }) {
  const isEmergency = painScore >= 7;

  return (
    <div className={`p-6 rounded-3xl border ${isEmergency ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-slate-900'}`}>
      <div className="flex items-center gap-3">
        {isEmergency && <AlertTriangle className="text-red-500 animate-bounce" />}
        <h3 className="text-white font-bold text-sm uppercase">Estado de Recuperación</h3>
      </div>
      {isEmergency ? (
        <p className="text-red-400 text-[10px] mt-2 font-black uppercase">
          ALERTA: El doctor ha sido notificado. Tome su dosis de rescate y espere contacto.
        </p>
      ) : (
        <p className="text-slate-500 text-[10px] mt-2 italic">
          Protocolo dentro de rangos normales. Continúe con su blindaje antibiótico.
        </p>
      )}
    </div>
  );
}