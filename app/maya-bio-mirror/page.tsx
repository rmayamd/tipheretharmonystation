"use client";
import React, { useRef, useState } from 'react';

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result';
type Layer = 'normal' | 'wood' | 'uv' | 'infra';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ phone: '', email: '', name: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('normal');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.onend = () => resolve(true);
        window.speechSynthesis.speak(utterance);
      } else resolve(true);
    });
  };

  const startFaceID = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: { ideal: 1280 } } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => { videoRef.current?.play(); runProtocol(newStream); };
      }
    } catch (err) { alert("Error: Use HTTPS y permita la cámara."); }
  };

  const runProtocol = async (activeStream: MediaStream) => {
    await speak("Iniciando análisis multiespectral a 50 centímetros. Mire al frente.");
    await animateProgress(0, 100, 6000); 
    capture();
    activeStream.getTracks().forEach(t => t.stop());
    setStep('sync');
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    const msgs = ["Analizando Melanina (UV)...", "Mapeando Vascularización...", "Calculando Ratios 1.8:2.0:1.0...", "Generando Plan Maya-Ding..."];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
      }, i * 1000);
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
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 720, 960);
      setPhotos([canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
          <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
            strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
        </svg>

        <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10 shadow-2xl">
          {step === 'intro' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-cyan-400 text-[10px] tracking-[0.5em] font-bold mb-4 uppercase italic">Tiphereth Station v18</h2>
              <button onClick={startFaceID} className="bg-white text-black px-8 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Iniciar Escaneo</button>
            </div>
          )}

          {step === 'scanning' && (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
          )}

          {step === 'result' && (
             <div className="relative w-full h-full">
                <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                  ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-[2.5] contrast-[1.5]' : ''}
                  ${activeLayer === 'uv' ? 'invert-[1] sepia-[1] saturate-[10] hue-rotate-[180deg]' : ''}
                  ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale-[1] invert-[1]' : ''}
                `} />
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-cyan-500/20 opacity-40" />
             </div>
          )}
        </div>
      </div>

      <div className="mt-12 w-full max-w-[320px]">
        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
            <input type="text" placeholder="NOMBRE" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" />
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500" />
            <button onClick={() => { if(userData.email && userData.phone) setStep('result'); }} className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Generar Diagnóstico ROI</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between gap-1">
              {['normal', 'wood', 'uv', 'infra'].map((f) => (
                <button key={f} onClick={() => setActiveLayer(f as any)} className={`flex-1 py-2 text-[7px] font-bold uppercase border rounded-lg transition-all ${activeLayer === f ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_#06b6d4]' : 'border-white/10 text-zinc-500'}`}>{f}</button>
              ))}
            </div>

            <div className="bg-zinc-900/50 p-5 rounded-[2.5rem] border border-white/5 space-y-4 text-[10px]">
              <div className="flex justify-between border-b border-white/5 pb-2 font-bold italic">
                <span className="text-cyan-400 uppercase tracking-tighter tracking-widest">Protocolo Maya-Ding</span>
                <span className="text-white">ROI: +400% Social</span>
              </div>
              <p className="text-zinc-300 leading-tight italic">"Sugerencia: Reingeniería Estructural mediante Laminación Térmica (Láser 1470nm) y Suspensión Poligonal Butterfly."</p>
            </div>

            <button onClick={() => window.open(`https://wa.me/573000000000?text=He visto mi análisis multiespectral Tiphereth. Mi email es ${userData.email}. Deseo agendar mi Reingeniería Estructural.`)} 
              className="w-full bg-white text-black py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">Reclamar Plan Maestro</button>
          </div>
        )}
      </div>
    </div>
  );
}