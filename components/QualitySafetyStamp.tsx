// components/Surgical/QualitySafetyStamp.tsx
import { CheckCircle, PackageSearch } from 'lucide-react'

export const QualitySafetyStamp = ({ sterilizationBatch }: { sterilizationBatch: string }) => (
  <div className="bg-gradient-to-r from-emerald-900/20 to-transparent p-4 rounded-2xl border border-emerald-500/20 mt-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <CheckCircle className="text-emerald-500 w-5 h-5" />
        <div>
          <p className="text-white text-[10px] font-black uppercase tracking-tighter italic">Protocolo de Esterilización OK</p>
          <p className="text-emerald-500/60 text-[9px] font-mono">LOTE: {sterilizationBatch} (Ref: FM-ES-01)</p>
        </div>
      </div>
      <PackageSearch className="text-white/20 w-8 h-8" />
    </div>
  </div>
);