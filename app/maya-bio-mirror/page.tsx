"use client";
import React, { useRef, useState } from 'react';

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result';
type Layer = 'real' | 'uv_damage' | 'vascular' | 'bone_structure';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ phone: '', email: '', name: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('real');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        utterance.onend = () => resolve(true);
        window.speechSynthesis.speak(utterance);
      } else resolve(true);
    });
  };

  const startAnalysis = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: 1280 } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          runScanner(newStream);
        };
      }
    } catch (err) { alert("Error de Acceso Biométrico."); }
  };

  const runScanner = async (activeStream: MediaStream) => {
    await speak("Iniciando Escaneo Tiphereth de Alta Resolución. No parpadee.");
    await animateProgress(0, 100, 7000); // 7 segundos de "suspenso tecnológico"
    capture();
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    simulateAI();
  };

  const simulateAI = () => {
    const msgs = [
      "Mapeando Melanina Profunda (UV)...",
      "Calculando Desviación Áurea (1.8:2.0:1.0)...",
      "Analizando ROI de Armonización...",
      "Generando Diagnóstico Sanghoon Park..."
    ];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
      }, i * 1200);
    });
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
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 600, 800);
      setPhotos([canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* CÍRCULO DE ESCANEO PROFESIONAL */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
          <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
            strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
        </svg>

        <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          {step === 'intro' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-zinc-900 to-black">
              <h1 className="text-cyan-400 text-[12px] tracking-[0.6em] font-black mb-4 uppercase">TIPHERETH HARMONY</h1>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-10 leading-relaxed italic">
                La plataforma de bioingeniería facial más avanzada del mundo.
              </p>
              <button onClick={startAnalysis} className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-white/20 shadow-xl">
                INICIAR BIO-SCAN
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
              <div className="absolute top-0 w-full h-[4px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[scan_2s_linear_infinite]" />
            </>
          )}

          {step === 'result' && (
             <div className="relative w-full h-full">
                <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                  ${activeLayer === 'uv_damage' ? 'saturate-[4] contrast-[1.5] hue-rotate-[200deg] invert-[0.2]' : ''}
                  ${activeLayer === 'vascular' ? 'brightness-[1.2] contrast-[2] sepia-[0.5] saturate-[5]' : ''}
                  ${activeLayer === 'bone_structure' ? 'grayscale brightness-[1.5] contrast-[2]' : ''}
                `} />
                <div className="absolute inset-0 bg-black/10 border border-cyan-500/30" />
             </div>
          )}
        </div>
      </div>

      {/* MOTOR DE CONVERSIÓN DE 100M+ */}
      <div className="mt-10 w-full max-w-[320px]">
        {step === 'sync' && (
           <div className="space-y-3 bg-zinc-900/30 p-4 rounded-3xl border border-white/5">
              {logs.map((log, i) => (
                <p key={i} className="text-[9px] text-cyan-500 font-mono tracking-widest animate-pulse">✓ {log}</p>
              ))}
           </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
            <div className="text-center">
               <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase">Escaneo Exitoso</p>
               <p className="text-[8px] text-zinc-500 uppercase mt-1 italic">Sincronizando diagnóstico con el Dr. Maya</p>
            </div>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900/80 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL PROFESIONAL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900/80 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="tel" placeholder="WHATSAPP PERSONAL" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900/80 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <button onClick={() => { if(userData.email && userData.phone) setStep('result'); }} className="w-full bg-cyan-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              RECIBIR DIAGNÓSTICO MAESTRO
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in duration-1000">
            {/* Capas Multiespectrales (Superior a Canfield) */}
            <div className="flex justify-between gap-1 p-1 bg-zinc-900 rounded-xl border border-white/5">
              {(['real', 'uv_damage', 'vascular', 'bone_structure'] as Layer[]).map((l) => (
                <button key={l} onClick={() => setActiveLayer(l)} className={`flex-1 py-3 text-[6px] font-bold uppercase rounded-lg transition-all ${activeLayer === l ? 'bg-cyan-500 text-white shadow-lg' : 'text-zinc-500'}`}>
                  {l === 'real' ? 'Real' : l === 'uv_damage' ? 'UV' : l === 'vascular' ? 'Vasc' : 'Hueso'}
                </button>
              ))}
            </div>

            {/* Neuromarketing: El ROI de la Belleza */}
            <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-[2.5rem] border border-cyan-500/20 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-cyan