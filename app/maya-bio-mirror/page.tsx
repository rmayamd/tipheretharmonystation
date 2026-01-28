"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ESPERANDO INICIO');
  const [step, setStep] = useState<'intro' | 'scanning' | 'sync' | 'result'>('intro');
  const [photos, setPhotos] = useState<string[]>([]);

  // Función de Voz (Web Speech API)
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startFaceID = async () => {
    setStep('scanning');
    try {
      const constraints = { 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        
        // --- INICIO DEL PROTOCOLO GUIADO ---
        runProtocol();
      }
    } catch (err) {
      alert("Error: Active la cámara en su navegador.");
    }
  };

  const runProtocol = async () => {
    // 1. Frente
    setStatus('MIRE AL FRENTE');
    speak("Iniciando escaneo biométrico. Por favor, mire fijamente al frente.");
    await animateProgress(0, 33, 3000);
    capture();

    // 2. Izquierda
    setStatus('GIRE LENTAMENTE A LA IZQUIERDA');
    speak("Bien. Ahora gire lentamente su rostro hacia la izquierda.");
    await animateProgress(33, 66, 3000);
    capture();

    // 3. Derecha
    setStatus('GIRE LENTAMENTE A LA DERECHA');
    speak("Correcto. Finalmente, gire hacia la derecha.");
    await animateProgress(66, 100, 3000);
    capture();

    // Finalizar
    speak("Escaneo completado. Procesando reconstrucción 3D.");
    setStatus('ESCÁNEO COMPLETO');
    setTimeout(() => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStep('sync');
    }, 1000);
  };

  const animateProgress = (start: number, end: number, duration: number) => {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const currentProgress = Math.min(start + (end - start) * (elapsed / duration), end);
        setProgress(currentProgress);
        if (elapsed < duration) requestAnimationFrame(animate);
        else resolve(true);
      };
      requestAnimationFrame(animate);
    });
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 480; canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 480, 640);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* HEADER TÉCNICO */}
      <h1 className="mb-8 text-[10px] tracking-[1em] font-black uppercase text-cyan-500 opacity-80">
        Tiphereth AI Scan
      </h1>

      <div className="relative w-full max-w-[350px] aspect-square rounded-full flex items-center justify-center">
        
        {/* ANILLO DE PROGRESO CIRCULAR (FACE ID STYLE) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
          <circle 
            cx="50%" cy="50%" r="48%" 
            stroke="#06b6d4" strokeWidth="6" fill="none" 
            strokeDasharray="1000" 
            strokeDashoffset={1000 - (progress * 10)}
            strokeLinecap="round"
            className="transition-all duration-100 ease-linear shadow-[0_0_15px_#06b6d4]"
          />
        </svg>

        {/* CONTENEDOR DE CÁMARA CIRCULAR */}
        <div className="w-[90%] h-[90%] rounded-full overflow-hidden bg-zinc-900 border border-white/10 relative">
          {step === 'intro' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
              <div className="w-16 h-16 border-2 border-cyan-500 rounded-full mb-6 animate-pulse flex items-center justify-center">
                <span className="text-cyan-400 text-xs">Φ</span>
              </div>
              <p className="text-[10px] tracking-widest leading-relaxed mb-8 uppercase text-zinc-400">
                Iniciará un escaneo de 3 etapas para análisis óseo profundo.
              </p>
              <button onClick={startFaceID} className="bg-white text-black px-8 py-4 rounded-full font-black text-[10px] tracking-widest uppercase active:scale-95 transition-all">
                EMPEZAR REGISTRO
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] grayscale brightness-110" />
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
              {/* Línea de Escaneo Láser */}
              <div className="absolute top-0 w-full h-[2px] bg-white shadow-[0_0_15px_white] animate-[scan_2s_linear_infinite]" />
            </>
          )}

          {(step === 'sync' || step === 'result') && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <p className="text-cyan-400 text-[10px] animate-pulse uppercase tracking-[0.4em]">Procesando ADN...</p>
              </div>
          )}
        </div>

        {/* FEEDBACK DE ESTADO */}
        {step === 'scanning' && (
            <div className="absolute -bottom-16 w-full text-center">
                <p className="text-xs font-black tracking-widest text-cyan-400 uppercase drop-shadow-lg">{status}</p>
                <p className="text-[8px] text-zinc-500 mt-2 uppercase">{Math.round(progress)}% COMPLETADO</p>
            </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}