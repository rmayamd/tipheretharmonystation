"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'intro' | 'scanning' | 'sync' | 'lead' | 'result'>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ phone: '', email: '' });
  const [activeLayer, setActiveLayer] = useState<'normal' | 'wood' | 'uv' | 'infra'>('normal');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.onend = () => resolve(true);
      window.speechSynthesis.speak(utterance);
    });
  };

  const startFaceID = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: 1280, height: 720 } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => { videoRef.current?.play(); runProtocol(newStream); };
      }
    } catch (err) { alert("Error: Use HTTPS y permita la cámara."); }
  };

  const runProtocol = async (activeStream: MediaStream) => {
    await speak("Iniciando análisis multiespectral a 50 centímetros.");
    await animateProgress(0, 100, 6000); // Escaneo más lento para simular profundidad
    capture();
    activeStream.getTracks().forEach(t => t.stop());
    setStep('sync');
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    const msgs = ["Analizando Melanina (UV)...", "Mapeando Vascularización (IR)...", "Calculando ROI Estético...", "Generando Proyección Áurea..."];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
      }, i * 800);
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
    canvas.width = 480; canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 480, 640);
      setPhotos([canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* 1. VISUALIZADOR CIRCULAR */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
          <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
            strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
        </svg>

        <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10">
          {step === 'intro' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-cyan-400 text-[10px] tracking-[0.5em] font-bold mb-4 uppercase">Dermascope v17</h2>
              <button onClick={startFaceID} className="bg-white text-black px-8 py-4 rounded-full font-black text-[9px] uppercase tracking-widest">Iniciar Escaneo</button>
            </div>
          )}

          {step === 'scanning' && (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
          )}

          {step === 'result' && (
             <div className="relative w-full h-full">
                <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-500 
                  ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-200 contrast-125' : ''}
                  ${activeLayer === 'uv' ? 'invert sepia saturate-[5] hue-rotate-[200deg]' : ''}
                  ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale invert' : ''}
                `} />
                <div className="absolute inset-0 bg-black/20 grid grid-cols-6 grid-rows-6 border border-cyan-500/20" />
             </div>
          )}
        </div>
      </div>

      {/* 2. INTERFAZ DE RESULTADOS Y NEUROMARKETING */}
      <div className="mt-8 w-full max-w-[320px]">
        {step === 'lead' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom">
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest text-center">Sincronizar con Expediente Tiphereth</p>
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <button onClick={() => { if(userData.email && userData.phone) setStep('result'); }} className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Generar Diagnóstico Multiespectral</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Filtros de Piel */}
            <div className="flex justify-between gap-1">
              {['normal', 'wood', 'uv', 'infra'].map((f) => (
                <button key={f} onClick={() => setActiveLayer(f as any)} className={`flex-1 py-2 text-[6px] uppercase border rounded-md ${activeLayer === f ? 'bg-cyan-500 border-cyan-400' : 'border-white/10 text-zinc-500'}`}>{f}</button>
              ))}
            </div>

            {/* Cuadro ROI y Neuromarketing */}
            <div className="bg-zinc-900/50 p-4 rounded-3xl border border-white/5 space-y-3 text-[10px]">
              <div className="flex justify-between border-b border-white/5 pb-2 font-bold">
                <span className="text-cyan-400">PLAN QUIRÚRGICO</span>
                <span className="text-white">ROI: 300% (Social)</span>
              </div>
              <p className="text-zinc-400 leading-tight italic">"Sugerencia: V-Line Osteotomy. Resultados permanentes. Inversión única vs mantenimientos trimestrales."</p>
              
              <div className="flex justify-between border-b border-white/5 pb-2 font-bold pt-2">
                <span className="text-yellow-500">OPCIÓN NO-INVASIVA</span>
                <span className="text-white">ROI: Inmediato</span>
              </div>
              <p className="text-zinc-400 leading-tight italic">"Sugerencia: 4cc Hyaluronic + Toxina. Recuperación 0 días. Ideal para neuromarketing personal."</p>
            </div>

            <button onClick={() => window.open(`https://wa.me/573000000000?text=He visto mi análisis multiespectral. Mi email es ${userData.email}. Deseo el plan con mayor ROI estético.`)} 
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Agendar Mi Transformación</button>
          </div>
        )}
      </div>
    </div>
  );
}