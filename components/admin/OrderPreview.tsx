'use client'

import React from 'react';
import { FileText, Send, X, Share2 } from 'lucide-react';

export const OrderPreview = ({ order, onClose }: { order: any, onClose: () => void }) => {
  const shareToWhatsApp = () => {
    const message = `Hola, Tiphereth Center solicita: ${order.items.map((i:any) => `${i.qty} ${i.unit} de ${i.name}`).join(', ')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/30 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Documento: FM-MD-07</h3>
            <p className="text-purple-400 text-[10px] font-mono">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-purple-500/20 p-4 rounded-2xl">
              <FileText className="text-purple-500 w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Proveedor</p>
              <p className="text-white font-bold text-lg">{order.provider}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-[9px] uppercase font-black">Detalle del Pedido</p>
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-white text-xs font-medium">{item.name}</span>
                <span className="text-purple-400 font-mono font-bold">{item.qty} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
          <button 
            onClick={shareToWhatsApp}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Share2 className="w-4 h-4" /> Enviar por WhatsApp
          </button>
          <button className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest">
            <Send className="w-4 h-4" /> Firmar PDF
          </button>
        </div>
      </div>
    </div>
  );
};