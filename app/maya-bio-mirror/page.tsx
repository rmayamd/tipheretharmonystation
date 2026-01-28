"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Forzamos el inicio del video
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error de acceso:", err);
      alert("Para la visión 2026, activa los permisos de cámara en tu navegador.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1)_0%,rgba(0,0,0,1)_80%)] pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-thin tracking-[0.3em] uppercase transition-all">
            {step === 'camera' ? 'Bio-Mirror' : 'Sincronización'}
          </h1>
          <p className="text-cyan-500 text-[10px] tracking-[0.5em] mt-2 font-bold uppercase opacity-80">Tiphereth Center</p>
        </div>

        {/* CONTENEDOR DE CÁMARA PRO */}
        <div className="relative w-full max-w-lg aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
          
          {/* El Video: muted y playsInline son VITALES */}
          <video 
            ref={videoRef} 
            muted 
            playsInline 
            autoPlay
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isScanning ? 'opacity-100' : 'opacity-0'}`} 
          />

          {/* Estado de Carga / Botón */}
          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
              <button 
                onClick={startCamera} 
                className="w-32 h-32 rounded-full border border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/20 transition-all group active:scale-95"
              >
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </button>
              <p className="mt-6 text-[10px] tracking-widest text-cyan-400 animate-pulse">ESPERANDO SEÑAL BIOMÉTRICA</p>
            </div>
          )}

          {/* Capas de IA */}
          {isScanning && step === 'camera' && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-scan-move" />
              <div className="absolute inset-0 border-[30px] border-black/20" />
            </div>
          )}

          {/* Formulario de Sincronización */}
          {step === 'sync' && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xl flex items-center justify-center p-8">
              <div className="w-full space-y-4">
                <p className="text-center text-xs tracking-widest text-cyan-400 mb-4">VINCULACIÓN BIOLÓGICA</p>
                <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-center" />
                <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-all text-center" />
                <button onClick={() => setStep('result')} className="w-full bg-cyan-600 text-white font-bold py-4 rounded-2xl hover:bg-cyan-400 transition-all uppercase text-[10px] tracking-[0.3em]">
                  Generar Diagnóstico Áureo
                </button>
              </div>
            </div>
          )}
        </div>

        {isScanning && step === 'camera' && (
          <button 
            onClick={() => setStep('sync')} 
            className="mt-8 px-10 py-4 bg-white/5 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all text-[10px] tracking-[0.4em] font-bold uppercase"
          >
            Analizar Armonía
          </button>
        )}
      </main>

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 4s linear infinite; }
      `}</style>
    </div>
  );
}