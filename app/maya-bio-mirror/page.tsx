"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera');
  const [errorMsg, setErrorMsg] = useState('');

  const startCamera = async () => {
    setErrorMsg('');
    try {
      // Simplificamos los requisitos para máxima compatibilidad
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // El secreto: esperar a que el video esté listo antes de mostrarlo
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsScanning(true);
        };
      }
    } catch (err: any) {
      console.error("Error de cámara:", err);
      setErrorMsg(err.name === 'NotAllowedError' ? "PERMISO DENEGADO" : "SENSOR NO DETECTADO");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-xl aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-cyan-500/20 shadow-2xl bg-zinc-950">
        
        {/* VIDEO TAG - Los atributos muted y playsInline son obligatorios para móviles */}
        <video 
          ref={videoRef} 
          muted 
          playsInline 
          className={`w-full h-full object-cover transition-opacity duration-700 ${isScanning ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* UI DE CARGA / ERROR */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            {errorMsg ? (
              <div className="text-center p-6">
                <p className="text-red-500 tracking-[0.3em] text-[10px] mb-4 uppercase">Error de Sincronización</p>
                <p className="text-white text-xs mb-8">{errorMsg}</p>
                <button onClick={startCamera} className="text-cyan-400 border border-cyan-400 px-6 py-2 rounded-full text-[10px] uppercase">Reintentar</button>
              </div>
            ) : (
              <button onClick={startCamera} className="w-32 h-32 rounded-full border border-cyan-500/30 flex flex-col items-center justify-center hover:bg-cyan-500/10 transition-all">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-[10px] tracking-widest uppercase text-cyan-400">Activar</span>
              </button>
            )}
          </div>
        )}

        {/* Capas de IA (Solo activas si hay video) */}
        {isScanning && step === 'camera' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-scan-move" />
            <div className="absolute inset-0 border-[30px] border-black/40" />
            <div className="absolute bottom-6 left-6 text-[8px] tracking-[0.5em] text-cyan-300 font-mono">
              BIOMETRIC_SCAN: RUNNING
            </div>
          </div>
        )}

        {/* Sincronización (Formulario) */}
        {step === 'sync' && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-2xl flex items-center justify-center p-8">
            <div className="w-full space-y-6">
              <p className="text-center text-[10px] tracking-[0.4em] text-cyan-400">CALIBRACIÓN PERFIL BIOLÓGICO</p>
              <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center outline-none focus:border-cyan-500" />
              <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center outline-none focus:border-cyan-500" />
              <button onClick={() => setStep('result')} className="w-full bg-cyan-600 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/50">Generar ADN Áureo</button>
            </div>
          </div>
        )}
      </div>

      {isScanning && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-8 px-12 py-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all text-[10px] tracking-[0.4em] uppercase font-bold">
          Analizar Armonía
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 4s linear infinite; }
      `}</style>
    </div>
  );
}