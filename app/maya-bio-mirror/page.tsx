"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN INAMOVIBLE ===
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Stage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO';
type Layer = 'real' | 'wood' | 'uv' | 'infra' | 'textura' | 'manchas';

export default function TipherethV27() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [stage, setStage] = useState<Stage>('FRENTE');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('real');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.95;
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const startClinicalScan = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
        runFullProtocol(s);
      }
    } catch (err) { alert("Error: Acceso a cámara denegado."); }
  };

  const runFullProtocol = async (activeStream: MediaStream) => {
    await speak("Iniciando Escaneo Maestro Tiphereth. Retire sus gafas y mantenga el rostro despejado.");
    
    setStage('FRENTE');
    await speak("Mire fijamente al frente.");
    await animateProgress(0, 33, 3000);
    capture();

    setStage('PERFIL IZQUIERDO');
    await speak("Gire su rostro a la izquierda.");
    await animateProgress(33, 66, 3000);
    capture();

    setStage('PERFIL DERECHO');
    await speak("Gire su rostro a la derecha.");
    await animateProgress(66, 100, 3000);
    capture();

    await speak("Escaneo de bio-identidad completado. Procesando capas multiespectrales.");
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    simulateAI();
  };

  const simulateAI = () => {
    const msgs = ["Mapeando Estructura Ósea...", "Extrayendo Capas UV...", "Calculando Proporciones Φ...", "Sincronizando InBody...", "Generando ROI Estético..."];
    msgs.forEach((m, i) => setTimeout(() => {
      setLogs(p => [...p, m]);
      if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
    }, i * 1200));
  };

  const animateProgress = (start: number, end: number, duration: number) => {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        setProgress(Math.min(start + (end - start) * (elapsed / duration), end));
        if (elapsed < duration) requestAnimationFrame(animate); else resolve(true);
      };
      requestAnimationFrame(animate);
    });
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) { ctx?.drawImage(videoRef.current, 0, 0, 600, 800); setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* 1. VISUALIZADOR DE ALTA GAMA */}
      {step !== 'report' && (
        <div className="relative w-72 h-72 mb-12 mt-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_cyan]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.6em] font-black mb-4 uppercase italic">Tiphereth Station v27</h1>
                <button onClick={startClinicalScan} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 shadow-inner" />
                <div className="absolute top-0 w-full h-[2px] bg-white shadow-[0_0_15px_white] animate-[scan_2s_linear_infinite]" />
                <div className="absolute bottom-4 inset-x-0 text-[10px] font-black text-cyan-400 text-center tracking-widest uppercase bg-black/40 py-1">{stage}</div>
              </>
            )}
            {(step === 'result' || step === 'lead') && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-[2.5] contrast-[1.5]' : ''}
                ${activeLayer === 'uv' ? 'invert-[1] sepia-[1] saturate-[10] hue-rotate-[180deg]' : ''}
                ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale-[1] invert-[1]' : ''}
                ${activeLayer === 'textura' ? 'contrast-[4] grayscale-[1] brightness-[0.7]' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* 2. FLUJO DE CONVERSIÓN */}
      <div