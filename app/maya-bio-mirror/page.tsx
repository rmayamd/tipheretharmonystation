"use client";
import React, { useRef, useState } from 'react';

// CONFIGURACIÓN DE CONTACTO REAL
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Layer = 'normal' | 'wood' | 'uv' | 'infra' | 'textura';

export default function TipherethV26() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('normal');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const startScan = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 1280 } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await speak("Iniciando escaneo multiespectral. Analizando geometría y capas profundas.");
        let p = 0;
        const interval = setInterval(() => {
          p += 1; setProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            const canvas = document.createElement('canvas');
            canvas.width = 600; canvas.height = 800;
            canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 600, 800);
            setPhotos([canvas.toDataURL('image/jpeg')]);
            s.getTracks().forEach(t => t.stop());
            setStep('sync');
            simulateAI();
          }
        }, 50);
      }
    } catch (e) { alert("Error de cámara"); }
  };

  const simulateAI = () => {
    const msgs = ["Analizando Puntos Φ...", "Mapeando Daño UV...", "Sincronizando InBody...", "Generando ROI Estético..."];
    msgs.forEach((m, i) => setTimeout(() => {
      setLogs(p => [...p, m]);
      if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
    }, i * 1000));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col items-center">
      
      {/* 1. INTERFAZ DE CAPTURA */}
      {step !== 'report' && (
        <div className="relative w-72 h-72 mb-10 mt-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-100 shadow-[0_0_15px_cyan]" />
          </svg>
          <div className="w-[90%] h-[90%] m-[5%] rounded-full overflow-hidden bg-zinc-900 border border-white/5 relative">
            {step === 'intro' && <div className="absolute inset-0 flex items-center justify-center p-6 text-center"><button onClick={startScan} className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest">Iniciar Scan</button></div>}
            {step === 'scanning' && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale" />}
            {(step === 'result' || step === 'lead') && <img src={photos[0]} className={`w-full h-full object-cover ${activeLayer === 'wood' ? 'hue-rotate-180 saturate-200' : activeLayer === 'uv' ? 'invert sepia saturate-150' : activeLayer === 'infra' ? 'brightness-150 contrast-200 grayscale' : activeLayer === 'textura' ? 'contrast-[4] brightness-75 grayscale' : ''}`} />}
          </div>
        </div>
      )}

      {/* 2. FLUJO DE LEADS */}
      <div className="w-full max-w-sm">
        {step === 'sync' && <div className="space-y-2">{logs.map((l, i) => <p key={i} className="text-[9px] text-cyan-500 font-mono animate-pulse">{">"} {l}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4 p-6 bg-zinc-900/50 rounded-[2.5rem] border border-white/5">
            <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sincronización Clínica</p>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <button onClick={() => { if(userData.name && userData.phone) setStep('result'); }} className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-[10px] uppercase">Ver Dashboard Tiphereth</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="flex justify-between gap-1">
              {(['normal', 'wood', 'uv', 'infra', 'textura'] as Layer[]).map(l => <button key={l} onClick={()=>setActiveLayer(l)} className={`flex-1 py-2 text-[6px] font-bold uppercase rounded-lg border transition-all ${activeLayer === l ? 'bg-cyan-500 border-cyan-400' : 'border-white/5 text-zinc-500'}`}>{l}</button>)}
            </div>
            <div className="bg-zinc-900/80 p-6 rounded-[2.5rem] border border-cyan-500/20">
               <p className="text-[10px] text-cyan-400 font-black uppercase mb-3">Bio-Insight</p>
               <p className="text-xs text-zinc-300 italic mb-4">"Déficit en ángulo mandibular. Sugerencia: Reingeniería Estructural V-Line."</p>
               <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase">Generar Reporte Maestro</button>
            </div>
          </div>
        )}

        {/* 3. REPORTE FINAL VISIA-KILLER (EL CERTIFICADO) */}
        {step === 'report' && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-start mb-8 border-b border-zinc-100 pb-4">
               <div>
                 <h2 className="text-[12px] font-black tracking-widest uppercase italic">Tiphereth Station</h2>
                 <p className="text-[7px] text-zinc-400 uppercase tracking-widest">Clinical Bio-Report | v26.0</p>
               </div>
               <div className="text-right text-[8px] font-bold text-zinc-300 uppercase">Top Priority Case</div>
            </div>

            {/* Comparativo Antes/Después */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="text-center space-y-2">
                 <p className="text-[7px] font-black text-zinc-400 uppercase">Actual</p>
                 <img src={photos[0]} className="w-full aspect-[3/4] object-cover rounded-2xl grayscale" />
               </div>
               <div className="text-center space-y-2">
                 <p className="text-[7px] font-black text-cyan-600 uppercase">Simulación Φ</p>
                 <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-inner">
                    <img src={photos[0]} className="w-full h-full object-cover contrast-125 brightness-110 saturate-[0.8]" />
                    <div className="absolute inset-0 bg-cyan-400/10 mix-blend-color" />
                 </div>
               </div>
            </div>

            {/* Análisis Multiespectral (Estilo Visia) */}
            <div className="grid grid-cols-3 gap-2 mb-8 text-center uppercase tracking-tighter">
               <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-[6px] text-zinc-400">UV Damage</p>
                  <p className="text-[10px] font-black text-red-500">ALTO</p>
               </div>
               <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-[6px] text-zinc-400">Simetría</p>
                  <p className="text-[10px] font-black text-cyan-600">94.2%</p>
               </div>
               <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <p className="text-[6px] text-zinc-400">Bio-Edad</p>
                  <p className="text-[10px] font-black">-2 AÑOS</p>
               </div>
            </div>

            {/* Ratios de Park */}
            <div className="bg-zinc-950 text-white p-5 rounded-3xl mb-8">
               <p className="text-[8px] font-black text-cyan-400 uppercase mb-3 text-center tracking-widest italic">Ratios de Park (1.8 : 2.0 : 1.0)</p>
               <div className="grid grid-cols-3 text-center text-[12px] font-mono">
                  <div><p className="text-[6px] text-zinc-500">SUP</p><p>1.82</p></div>
                  <div><p className="text-[6px] text-zinc-500">MED</p><p>2.01</p></div>
                  <div className="text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"><p className="text-[6px] text-red-400">INF</p><p>0.92</p></div>
               </div>
            </div>

            {/* InBody & BioScanner */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-[8px] uppercase font-bold text-zinc-500">
               <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-2xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> InBody: Sincronizado
               </div>
               <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-2xl">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" /> Bio-Scanner: On
               </div>
            </div>

            <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Hola Dr. Maya, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth muestra un ROI Estético del 400% y un déficit INF de 0.92. Deseo agendar mi Reingeniería.`)} 
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all mb-4">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase font-serif italic">"Excellence is not an act, but a habit. Welcome to the Tiphereth Experience."</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}