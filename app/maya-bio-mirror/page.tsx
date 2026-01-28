"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera');
  const [error, setError] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(true); // Si falla, mostramos las opciones alternativas
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center p-6 font-sans">
      
      <div className="mt-8 mb-8 text-center">
        <h2 className="text-xl tracking-[0.3em] uppercase font-light">Bio-Mirror</h2>
        <p className="text-cyan-500 text-[8px] tracking-[0.4em] uppercase mt-1">Análisis Facial</p>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
        <video ref={videoRef} muted playsInline className={`w-full h-full object-cover ${isScanning ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* INTERFAZ INICIAL O DE ERROR */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 p-6 text-center">
            {!error ? (
              <button onClick={startCamera} className="w-24 h-24 rounded-full border border-cyan-500 flex flex-col items-center justify-center bg-cyan-500/10 active:scale-90 transition-all">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-[8px] font-bold tracking-widest text-white">ACTIVAR</span>
              </button>
            ) : (
              <div className="space-y-6">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Cámara bloqueada o no detectada</p>
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Subir Foto de Galería
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={() => setIsScanning(true)} />
          </div>
        )}

        {/* Formulario (Step Sync) */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-40 p-6 flex flex-col justify-center space-y-4">
            <p className="text-center text-[10px] tracking-widest text-cyan-400 font-bold mb-4">SINCRONIZACIÓN</p>
            <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-sm outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-sm outline-none focus:border-cyan-500" />
            <button onClick={() => setStep('result')} className="w-full bg-cyan-600 py-4 rounded-xl font-bold text-[10px] tracking-widest uppercase">Obtener Diagnóstico</button>
          </div>
        )}
      </div>

      {isScanning && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-8 w-full max-w-[320px] py-4 bg-white text-black font-bold rounded-full text-[10px] tracking-[0.3em] uppercase">
          Analizar Simetría
        </button>
      )}
    </div>
  );
}