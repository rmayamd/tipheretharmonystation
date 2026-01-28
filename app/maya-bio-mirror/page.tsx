"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera'); // 'camera', 'sync', 'result'
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const openNativeCamera = () => fileInputRef.current?.click();

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setIsScanning(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center p-6 overflow-hidden font-sans">
      
      {/* Header */}
      <div className="mt-4 mb-6 text-center">
        <h1 className="text-xl tracking-[0.4em] font-extralight uppercase">Tiphereth AI</h1>
        <p className="text-cyan-500 text-[7px] tracking-[0.5em] uppercase mt-1">Diagnóstico Bio-Estético</p>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        <input type="file" ref={fileInputRef} accept="image/*" capture="user" className="hidden" onChange={handleCapture} />

        {/* --- ESTADO 1: CAPTURA --- */}
        {step === 'camera' && (
          <>
            {capturedImage ? (
              <div className="relative h-full w-full">
                <img src={capturedImage} className="w-full h-full object-cover" alt="Capture" />
                <div className="absolute inset-0 pointer-events-none border-[20px] border-black/30" />
                <div className="absolute top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-scan-move" />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 p-8 text-center">
                <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin-slow mb-8 opacity-20" />
                <button onClick={openNativeCamera} className="px-8 py-4 bg-cyan-600 rounded-full text-[10px] font-bold tracking-widest uppercase active:scale-95 shadow-lg">Iniciar Escaneo</button>
              </div>
            )}
          </>
        )}

        {/* --- ESTADO 2: SINCRONIZACIÓN --- */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 p-8 flex flex-col justify-center space-y-5">
            <p className="text-center text-[10px] tracking-[0.4em] text-cyan-400 font-bold uppercase">Sincronización</p>
            <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xs outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xs outline-none focus:border-cyan-500" />
            <button onClick={() => setStep('result')} className="w-full bg-white text-black py-5 rounded-2xl font-bold text-[9px] tracking-[0.4em] uppercase active:scale-95">Generar Diagnóstico</button>
          </div>
        )}

        {/* --- ESTADO 3: RESULTADOS (NUEVO) --- */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-black z-[60] p-6 flex flex-col items-center text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full border border-cyan-500 flex items-center justify-center mb-4">
               <span className="text-cyan-400 text-xl font-light">Φ</span>
            </div>
            <h3 className="text-sm tracking-[0.3em] uppercase mb-6">Reporte de Armonía</h3>
            
            <div className="w-full space-y-4 text-left">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[8px] text-cyan-400 tracking-widest uppercase mb-1">Simetría Facial</p>
                <p className="text-lg font-light text-white">84.2%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[8px] text-cyan-400 tracking-widest uppercase mb-1">Índice Áureo (Φ)</p>
                <p className="text-lg font-light text-white">1.59 / 1.61</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[8px] text-pink-400 tracking-widest uppercase mb-1">Recomendación</p>
                <p className="text-[10px] leading-relaxed text-zinc-300 italic">"Se observa una ligera desviación en el arco de Tiphereth. Recomendamos armonización de pómulos para alcanzar el equilibrio universal."</p>
              </div>
            </div>

            <button onClick={() => window.location.href = '/'} className="mt-8 w-full py-4 border border-white/20 rounded-xl text-[9px] tracking-widest uppercase text-zinc-400">Finalizar Sesión</button>
          </div>
        )}
      </div>

      {/* BOTÓN CONTINUAR (Solo visible en paso cámara con foto) */}
      {isScanning && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-10 w-full max-w-[320px] py-5 bg-cyan-500 text-black font-bold rounded-full text-[10px] tracking-[0.4em] uppercase shadow-xl animate-pulse">
          Analizar Armonía
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 3s linear infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}