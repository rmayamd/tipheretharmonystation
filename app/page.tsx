"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN MAESTRA ---
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx-kQqKTyfIx_JVqtNvpk47JAMMXWawn9O1-W9QULf0nrSK_GtJnVdeOt10eaBkzGmGDw/exec"; 

export default function TipherethV78() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Sede Principal' });
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAge, setBioAge] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);

  // --- MOTOR DE FILTROS MÉDICOS V78 ---
  const filters = {
    // VECTRA (Mapas de Calor): Mismo de antes, funciona perfecto.
    heatmap: "contrast(1.5) brightness(0.8) sepia(1) hue-rotate(-50deg) saturate(3)", 
    // VISIA (X-Ray): Mismo de antes.
    xray: "grayscale(1) invert(1) contrast(2) brightness(0.9)",
    // ESTRUCTURAL (EL NUEVO): Simula proyección y volumen mediante luz intensa.
    // Aumentamos contraste y brillo para que pómulos/nariz "salten" hacia adelante.
    after: "blur(0.5px) brightness(1.25) contrast(1.15) saturate(1.1) sepia(0.1)", 
  };

  // --- GEOMETRÍA DE PROYECCIÓN V78 ---
  // En lugar de achicar (scale < 1), agrandamos muy sutilmente (scale > 1)
  // y aplicamos perspectiva para que el mentón se vea más prominente.
  const projectionGeometry = {
    transform: 'scale(1.015) perspective(500px) rotateX(1deg)',
    filter: filters.after
  };

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  useEffect(() => { setBioAge(Math.floor(Math.random() * (58 - 38 + 1)) + 38); }, []);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.85; u.pitch = 0.9;
    u.onend = () => setTimeout(res, 500);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.drawImage(videoRef.current!, 0, 0, 1080, 1440);
        ctx.drawImage(c, 0, 0);
    }
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 1.0)]);
  };

  const syncLead = async () => {
    setLoading(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: `TIPHERET V78 STRUCTURAL: Proyección Ósea Requerida / BioAge ${bioAge}`, timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("ESCANEO VOLUMÉTRICO (VECTRA)"); await speak("Mire al frente. Generando mapa de calor volumétrico.");
    for(let i=0; i<=30; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("DENSITOMETRÍA DE COLÁGENO"); await speak("Analizando ruptura de fibras de colágeno.");
    for(let i=31; i<=60; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("PROYECCIÓN ESTRUCTURAL 3D"); await speak("Calculando vectores de aumento y definición mandibular.");
    for(let i=61; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {loading && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
          <div className="w-24 h-24 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mb-6 shadow-[0_0_50px_#06b6d4]" />
          <p className="text-sm font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Renderizando Arquitectura Facial...</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full max-w-md p-6 mt-10 animate-in fade-in zoom-in duration-700 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full border border-cyan-500/30 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden text-center shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                <h1 className="text-white text-3xl font-black italic mb-2 uppercase tracking-tighter">TIPHERET</h1>
                <p className="text-[9px] text-cyan-400 uppercase tracking-[0.5em] mb-8 border-b border-white/5 pb-4">Structural Engine v78.0</p>
                <div className="space-y-4 mb-8 text-left">
                  <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm font-bold uppercase rounded-xl focus:border-cyan-500 outline-none" />
                  <input type="email" placeholder="EMAIL" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm outline-none rounded-xl focus:border-cyan-500" />
                  <input type="tel" placeholder="WHATSAPP (Con Código País)" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm outline-none rounded-xl focus:border-cyan-500" />
                </div>
                <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone || !user.email} 
                    className="w-full bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-6 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50">
                    INICIAR ESCANEO ESTRUCTURAL
                </button>
            </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/30">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20 pointer-events-none">
                 {[...Array(16)].map((_, i) => <div key={i} className="border border-cyan-500/50"></div>)}
            </div>
            <div className="absolute top-4 right-4 text-[8px] text-cyan-500 font-mono animate-pulse">SCANNING: {Math.floor(prog)}%</div>
            <div className="absolute bottom-10 inset-x-0 text-center"><span className="bg-black/80 px-6 py-2 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-cyan-500/50 shadow-lg">{stage}</span></div>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="w-full max-w-2xl bg-zinc-950 min-h-screen p-6 pb-32 animate-in slide-in-from-bottom duration-1000">
          
          <header className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
            <div><h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">TIPHERET <span className="text-cyan-500 text-lg">STRUCTURAL</span></h2></div>
            <div className="text-right">
                <p className="text-[8px] text-cyan-500 font-bold uppercase animate-pulse">AI PROJECTION: READY</p>
            </div>
          </header>

          {/* 1. SIMULACIÓN ESTRUCTURAL (AUMENTO Y DEFINICIÓN) */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">I. Proyección de Definición y Volumen</h3>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl group mb-4 bg-black">
                {/* ANTES (Realidad Cruda con Grid) */}
                <div className="absolute inset-0 w-full h-full">
                    <img src={photos[0]} className="w-full h-full object-cover grayscale contrast-125 brightness-90" />
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20 mix-blend-overlay pointer-events-none">
                        {[...Array(64)].map((_, i) => <div key={i} className="border-[0.5px] border-cyan-500/30"></div>)}
                    </div>
                </div>

                {/* DESPUÉS (El Sueño - PROYECCIÓN + ILUMINACIÓN) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     {/* APLICAMOS LA GEOMETRÍA DE PROYECCIÓN V78 */}
                     <img src={photos[0]} className="w-full h-full object-cover origin-center" 
                          style={projectionGeometry} />
                     
                     {/* Destellos de luz en puntos de proyección (Pómulos/Mentón) */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-500/10 mix-blend-color-dodge" />
                </div>

                {/* SLIDER */}
                <div className="absolute inset-y-0 w-1 bg-cyan-500 cursor-ew-resize shadow-[0_0_25px_#06b6d4]" style={{ left: `${sliderVal}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black border-2 border-cyan-500 rounded-full flex items-center justify-center shadow-xl z-10">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </div>
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
            </div>
            <p className="text-center text-[9px] text-zinc-500 italic">Deslice para visualizar aumento de pómulos, definición mandibular y proyección.</p>
          </section>

          {/* 2. MAPAS VECTRA/VISIA */}
          <section className="mb-12 grid grid-cols-2 gap-4">
            {/* VECTRA HEATMAP */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <p className="text-[8px] text-cyan-400 font-black uppercase mb-2 text-center">Mapa Térmico Volumétrico</p>
                <div className="relative h-36 rounded-lg overflow-hidden border border-zinc-700">
                    <img src={photos[0]} className="w-full h-full object-cover" style={{ filter: filters.heatmap }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/50 to-red-800/50 mix-blend-color" />
                    <div className="absolute bottom-1 inset-x-0 text-center"><span className="text-[6px] text-white bg-black/50 px-2 rounded">AZUL: DÉFICIT / ROJO: PROYECCIÓN</span></div>
                </div>
            </div>

            {/* VISIA X-RAY */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <p className="text-[8px] text-red-400 font-black uppercase mb-2 text-center">Escaneo Estructural Profundo</p>
                <div className="relative h-36 rounded-lg overflow-hidden border border-zinc-700">
                    <img src={photos[1]} className="w-full h-full object-cover" style={{ filter: filters.xray }} />
                    <div className="absolute bottom-1 right-1 bg-red-900/80 px-1 rounded"><span className="text-[6px] text-white font-bold">DAÑO ESTRUCTURAL</span></div>
                </div>
            </div>
          </section>

          {/* CIERRE DE VENTA */}
          <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 mb-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-white to-blue-600" />
            <h3 className="text-white font-black uppercase text-sm tracking-[0.2em] mb-4 mt-2">Protocolo de Definición</h3>
            <p className="text-[10px] text-zinc-300 mb-6 px-4">Se requiere <strong className="text-cyan-400">proyección estratégica</strong> en tercio medio y definición en ángulo mandibular para restaurar el "Triángulo de la Juventud".</p>
            
            <button onClick={() => {
                const msg = encodeURIComponent(`Dr. Maya Romo, mi reporte STRUCTURAL V78 indica necesidad de proyección y definición. Quiero materializar la simulación de aumento. Solicito cita.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full bg-gradient-to-r from-cyan-700 to-blue-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-all border border-white/20">
                MATERIALIZAR PROYECCIÓN Φ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}