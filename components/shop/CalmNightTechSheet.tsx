'use client'

import React from 'react';
import { Moon, Zap, ShieldCheck, Beaker, Info } from 'lucide-react';

export const CalmNightTechSheet = () => {
  return (
    <div className="bg-slate-950 border border-purple-500/20 rounded-[3rem] overflow-hidden shadow-2xl max-w-2xl mx-auto">
      {/* Header con Imagen Estilizada */}
      <div className="h-48 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <Moon className="w-20 h-20 text-purple-400 animate-pulse" />
        <div className="absolute bottom-4 left-6">
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic">Calm Night</h2>
          <p className="text-purple-300 text-[10px] font-bold uppercase tracking-[0.3em]">Tintura Edition 1:5</p>
        </div>
      </div>

      {/* Cuerpo de la Ficha */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <Zap className="text-amber-400 w-5 h-5 mb-2" />
            <p className="text-white font-bold text-xs uppercase">Bio-Eficacia</p>
            <p className="text-slate-500 text-[10px] mt-1">+35% Biodisponibilidad vs Extracto Seco</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <ShieldCheck className="text-emerald-400 w-5 h-5 mb-2" />
            <p className="text-white font-bold text-xs uppercase">Seguridad Post-Op</p>
            {/* AQUÍ ESTABA EL ERROR CORREGIDO ABAJO */}
            <p className="text-slate-500 text-[10px] mt-1">Opioid-Sparing: Reduce necesidad de sedantes químicos</p>
          </div>
        </div>

        {/* Sección de Ciencia de Autor */}
        <div className="space-y-4 mb-8">
          <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Beaker className="w-3 h-3" /> Especificaciones Farmacopéuticas (USP/Ph.Eur)
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-slate-400 font-medium">Principio Activo:</span>
              <span className="text-white font-mono">Valeriana Officinalis (Tintura 1:5)</span>
            </div>
            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-slate-400 font-medium">Vehículo:</span>
              <span className="text-white font-mono">Chocolate Amargo 70% Cacao</span>
            </div>
            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-slate-400 font-medium">Inicio de Acción:</span>
              <span className="text-white font-mono">20 - 30 Minutos</span>
            </div>
          </div>
        </div>

        {/* Alerta de Consumo */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-4 items-start">
          <Info className="text-blue-400 w-5 h-5 shrink-0" />
          <p className="text-blue-200 text-[9px] leading-relaxed italic">
            <strong>Instrucción Tiphereth:</strong> Consumir 1 tableta 30 minutos antes de dormir. La microencapsulación en el chocolate protege los valepotriatos de la degradación gástrica.
          </p>
        </div>

        {/* Botón de Añadir al Kit */}
        <button className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-purple-900/40 transition-all">
          Añadir a mi Protocolo Post-Op
        </button>
      </div>
    </div>
  );
};