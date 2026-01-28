"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ESPERANDO INICIO');
  const [step, setStep] = useState<'intro' | 'scanning' | 'sync' | 'result'>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const speak = (text: string) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.onend = () => resolve(true); // El sistema espera a que termine de hablar
      window.speechSynthesis.speak(utterance);
    });
  };

  const startFaceID = async () => {
    setStep('scanning');
    try {
      const constraints = { 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } 
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          runProtocol(newStream);
        };
      }
    } catch (err) {
      alert("Error: Active la cámara para el diagnóstico.");
    }
  };

  const runProtocol = async (activeStream: MediaStream) => {
    // 1. Frente
    setStatus('MIRE AL FRENTE');
    await speak("Iniciando escaneo biométrico. Por favor, mire al frente.");
    await animateProgress(0, 33, 2500);
    capture();

    // 2. Izquierda
    setStatus('GIRE A LA IZQUIERDA');
    await speak("Bien. Gire lentamente su rostro hacia la izquierda.");
    await animateProgress(33, 66, 2500);
    capture();

    // 3. Derecha
    setStatus('GIRE A LA DERECHA');
    await speak("Correcto. Gire ahora hacia la derecha.");
    await animateProgress(66, 100, 2500);
    capture();

    // Finalizar proceso de voz antes de apagar imagen
    setStatus('DATOS CAPTURADOS');
    await speak("Escaneo completado con éxito. Iniciando reconstrucción ósea.");
    
    // Apagar cámara
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    
    // Simular Procesamiento Clínico
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    const messages = [
      "Extrayendo landmarks faciales...",
      "Calculando Proporción Áurea (Φ)...",
      "Analizando perfil según Sanghoon Park...",
      "Comparando con base de datos Tiphereth...",
      "Generando Plan de Armonización..."
    ];
    messages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === messages.length - 1) setTimeout(() => setStep('result'), 1500);
      }, i * 1200);
    });
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
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        {/* Anillo de Progreso */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="4" fill="none" />
          <circle 
            cx="50%" cy="50%" r="48%" 
            stroke="#06b6d4" strokeWidth="6" fill="none" 
            strokeDasharray="1000" 
            strokeDashoffset={1000 - (progress * 10)}
            strokeLinecap="round"
            className="transition-all duration-200 shadow-[0_0_20px_#06b6d4]"
          />
        </svg>

        {/* Cámara / Contenedor */}
        <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 border border-white/5 relative">
          {step === 'intro' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-cyan-400 text-[10px] tracking-[0.5em] font-black mb-4 uppercase">Bio-Identidad</h2>
              <button onClick={startFaceID} className="bg-white text-black px-8 py-4 rounded-full font-black text-[9px] tracking-widest uppercase">
                Iniciar Registro
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] grayscale brightness-125" />
          )}

          {step === 'sync' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black">
               <div className="w-full space-y-2">
                  {logs.map((log, i) => (
                    <p key={i} className="text-[8px] text-cyan-500 font-mono tracking-widest animate-pulse">
                      {">"} {log}
                    </p>
                  ))}
               </div>
            </div>
          )}
          
          {step === 'result' && (
             <img src={photos[0]} className="w-full h-full object-cover grayscale brightness-50" />
          )}
        </div>
      </div>

      {/* Footer de Instrucción */}
      <div className="mt-20 text-center h-20">
         {step === 'scanning' && (
            <>
              <p className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase animate-pulse">{status}</p>
              <div className="w-48 h-1 bg-zinc-900 mx-auto mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{width: `${progress}%`}} />
              </div>
            </>
         )}
         {step === 'result' && (
            <div className="animate-in fade-in slide-in-from-bottom duration-1000">
               <p className="text-xs font-bold text-white tracking-widest mb-4 uppercase">Diagnóstico Completado</p>
               <button onClick={() => window.open(`https://wa.me/573000000000?text=He completado mi escaneo 3D. Deseo recibir mi reporte de armonía facial.`)} className="bg-cyan-600 px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase">
                 Ver Resultados
               </button>
            </div>
         )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}