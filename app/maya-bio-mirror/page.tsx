"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera'); // 'camera', 'sync', 'result'

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsScanning(true);
    } catch (err) {
      console.error("Error:", err);
      alert("Acceso denegado a la Bio-Data.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Fondo de Partículas de Luz (Efecto Tiphereth) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.15)_0%,rgba(0,0,0,1)_80%)]" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {/* Título Dinámico */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase">
            {step === 'camera' ? 'Espejo de Armonía' : 'Sincronización Biológica'}
          </h1>
          <p className="text-cyan-400 text-xs tracking-[0.5em] mt-2 opacity-70">
            {step === 'camera' ? 'ANÁLISIS EN TIEMPO REAL' : 'CALIBRACIÓN DE PERFIL ÚNICO'}
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="relative w-full max-w-xl aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-1000">
          
          {/* Cámara y Escáner */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-all duration-1000 ${isScanning ? 'grayscale-0' : 'grayscale'} ${step === 'sync' ? 'blur-2xl scale-110 opacity-50' : ''}`} 
          />

          {/* Efectos de IA sobre la cámara */}
          {isScanning && step === 'camera' && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/50 shadow-[0_0_20px_cyan] animate-scan-move" />
              <div className="absolute inset-0 border-[40px] border-black/20 backdrop-contrast-125" />
              <div className="absolute bottom-10 left-10 text-[10px] tracking-widest text-cyan-300 font-mono">
                DATA_STREAM: ACTIVE <br />
                PHI_RATIO: CALCULATING...
              </div>
            </div>
          )}

          {/* BOTÓN INICIAL */}
          {!isScanning && (
            <button onClick={startCamera} className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 border-t-2 border-cyan-400 rounded-full animate-spin mb-4" />
              <span className="text-[10px] tracking-[0.3em] uppercase">Activar</span>
            </button>
          )}

          {/* INTERFAZ DE SINCRONIZACIÓN (EL PEAJE) */}
          {step === 'sync' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-8 animate-slide-up">
              <div className="w-full space-y-6">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-gray-300">Para revelar tu <span className="text-cyan-400">Simetría Áurea</span>, vincula tu perfil biológico.</p>
                </div>
                
                <div className="space-y-4">
                  <input type="tel" placeholder="WHATSAPP (CÓDIGO PAÍS)" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors text-center tracking-widest" />
                  <input type="email" placeholder="EMAIL PROFESIONAL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors text-center tracking-widest" />
                  <textarea placeholder="ANTECEDENTES DE SALUD / CIRUGÍAS" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors text-center text-xs h-24" />
                </div>

                <button 
                  onClick={() => setStep('result')} 
                  className="w-full bg-cyan-500 text-black font-bold py-5 rounded-2xl hover:bg-white transition-all uppercase tracking-[0.3em] text-xs"
                >
                  Generar Diagnóstico IA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botón de transición cámara -> sincronización */}
        {isScanning && step === 'camera' && (
          <button 
            onClick={() => setStep('sync')} 
            className="mt-8 px-12 py-4 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-[0.4em] text-[10px] font-bold"
          >
            Analizar Proporción Áurea
          </button>
        )}

      </main>

      {/* Animaciones CSS personalizadas */}
      <style jsx global>{`
        @keyframes scan-move {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-move {
          animation: scan-move 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
}