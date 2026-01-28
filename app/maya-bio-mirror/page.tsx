"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Esta función abre la cámara nativa del celular directamente
  const openNativeCamera = () => {
    fileInputRef.current?.click();
  };

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
      
      <div className="mt-6 mb-10 text-center">
        <h1 className="text-2xl tracking-[0.4em] font-extralight uppercase text-white">Bio-Mirror</h1>
        <p className="text-cyan-500 text-[8px] tracking-[0.5em] uppercase mt-2 opacity-80">Protocolo Tiphereth</p>
      </div>

      {/* CONTENEDOR DE ESCANEO */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* INPUT MÁGICO: 'capture="user"' obliga al celular a abrir la cámara frontal */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          capture="user" 
          className="hidden" 
          onChange={handleCapture} 
        />

        {capturedImage ? (
          <img src={capturedImage} className="w-full h-full object-cover animate-fade-in" alt="Bio-Capture" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50 p-8 text-center">
            <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin-slow mb-8 opacity-20" />
            <button 
              onClick={openNativeCamera}
              className="group relative px-8 py-4 bg-cyan-600 rounded-full overflow-hidden transition-all active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            >
              <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase">Iniciar Escaneo</span>
            </button>
            <p className="mt-6 text-[9px] text-zinc-500 tracking-widest uppercase leading-loose">
              Presione para activar <br/> sensores biométricos
            </p>
          </div>
        )}

        {/* Capa de Escaneo IA (Solo aparece cuando ya hay foto) */}
        {isScanning && step === 'camera' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_cyan] animate-scan-move" />
            <div className="absolute inset-0 border-[25px] border-black/30" />
          </div>
        )}

        {/* STEP 2: FORMULARIO DE SINCRONIZACIÓN */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 p-8 flex flex-col justify-center space-y-5">
            <div className="text-center mb-4">
              <p className="text-[10px] tracking-[0.4em] text-cyan-400 font-bold uppercase">Sincronización</p>
              <p className="text-[8px] text-zinc-500 tracking-widest mt-2 uppercase">Vincule su perfil para el reporte</p>
            </div>
            <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xs outline-none focus:border-cyan-500 transition-all" />
            <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xs outline-none focus:border-cyan-500 transition-all" />
            <button onClick={() => setStep('result')} className="w-full bg-white text-black py-5 rounded-2xl font-bold text-[9px] tracking-[0.4em] uppercase shadow-lg active:scale-95 transition-transform">Generar Diagnóstico</button>
          </div>
        )}
      </div>

      {/* BOTÓN DE ACCIÓN INFERIOR */}
      {isScanning && step === 'camera' && (
        <button 
          onClick={() => setStep('sync')} 
          className="mt-10 w-full max-w-[320px] py-5 bg-cyan-500 text-black font-bold rounded-full text-[10px] tracking-[0.4em] uppercase shadow-[0_10px_30px_rgba(6,182,212,0.3)] animate-bounce-subtle"
        >
          Analizar Simetría Áurea
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 3s linear infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
