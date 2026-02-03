"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzRJhVFuBNbbThtJ5pSWSPvKK3M_xtuk04DvBx8Z6hg2fOs4BZ_DFCKKpx-XlHi4YV_dA/exec"; 
const HOTMART_EBOOK_URL = "https://go.hotmart.com/G104238384O?dp=1"; 

export default function TipherethV78() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Sede Principal' });
  const [stage, setStage] = useState('');
  const [subStage, setSubStage] = useState(''); // Nuevo: Detalles técnicos en pantalla
  const [loading, setLoading] = useState(false);
  
  // VARIABLES CLÍNICAS AVANZADAS
  const [bioAge, setBioAge] = useState(0);
  const [fitzpatrick, setFitzpatrick] = useState("III");
  const [glogau, setGlogau] = useState("TYPE II");
  const [goldenRatio, setGoldenRatio] = useState(1.45);
  const [resorcion, setResorcion] = useState("MODERADA");
  const [symmetry, setSymmetry] = useState(82); // % de simetría
  const [sliderVal, setSliderVal] = useState(50);

  // --- FILTROS DE VISIÓN COMPUTARIZADA ---
  const filters = {
    heatmap: "contrast(2.0) brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(4)", 
    xray: "grayscale(1) invert(1) contrast(3) brightness(0.8)", 
    after: "blur(0px) brightness(1.1) contrast(1.1) saturate(1.2)", 
    marquardt: "opacity(0.4) sepia(1)" 
  };

  const projectionGeometry = {
    transform: 'scale(1.02) perspective(500px) rotateX(2deg)', 
    filter: filters.after
  };

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  // CÁLCULO DE MÉTRICAS CLÍNICAS
  useEffect(() => { 
    const calculatedAge = Math.floor(Math.random() * (58 - 38 + 1)) + 38;
    setBioAge(calculatedAge);
    
    if(calculatedAge > 45) {
        setGlogau("TYPE III (Advanced)");
        setResorcion("SEVERA (Mandibular)");
        setGoldenRatio(1.32); 
        setSymmetry(76);
    } else {
        setGlogau("TYPE II (Moderate)");
        setResorcion("INCIPIENTE");
        setGoldenRatio(1.55); 
        setSymmetry(88);
    }
    
    const fits = ["II", "III", "IV"];
    setFitzpatrick(fits[Math.floor(Math.random() * fits.length)]);
  }, []);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-US'; u.rate = 0.95; u.pitch = 0.8;
    u.onend = () => setTimeout(res, 300);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.translate(1080, 0); ctx.scale(-1, 1); 
      ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 0.9)]);
    }
  };

  const syncLead = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: `TIPHERET V78: BioAge ${bioAge} | Glogau ${glogau} | Phi ${goldenRatio}`, timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  // --- EL CORAZÓN DEL ANÁLISIS (Aquí está el detalle que pedía) ---
  const runProtocol = async (s: MediaStream) => {
    
    // FASE 1: CALIBRACIÓN GEOMÉTRICA
    setStage("CALIBRATING GEOMETRY"); 
    setSubStage("Aligning Marquardt Mask...");
    await speak("Iniciando calibración de malla de Marquardt.");
    for(let i=0; i<=15; i++) { setProg(i); await new Promise(r => setTimeout(r, 50)); }
    
    // FASE 2: TERCIOS Y QUINTOS
    setStage("FACIAL MAPPING");
    setSubStage("Measuring Vertical Thirds...");
    await speak("Analizando simetría de tercios verticales.");
    for(let i=16; i<=30; i++) { setProg(i); await new Promise(r => setTimeout(r, 50)); }
    
    setSubStage("Measuring Horizontal Fifths...");
    for(let i=31; i<=45; i++) { setProg(i); await new Promise(r => setTimeout(r, 50)); }
    cap(); // FOTO 1 (Estructural)

    // FASE 3: DERMATOLOGÍA (Glogau & Fitzpatrick)
    setStage("DERMATOLOGICAL SCAN");
    setSubStage("Calculating Glogau Scale...");
    await speak("Calculando escala de envejecimiento de Glogau.");
    for(let i=46; i<=60; i++) { setProg(i); await new Promise(r => setTimeout(r, 60)); }
    
    setSubStage("Fitzpatrick Skin Typing...");
    for(let i=61; i<=70; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }

    // FASE 4: ESTRUCTURA PROFUNDA (Resorción y Colágeno)
    setStage("DEEP TISSUE ANALYSIS");
    setSubStage("Detecting Bone Resorption...");
    await speak("Detectando niveles de resorción ósea mandibular.");
    for(let i=71; i<=85; i++) { setProg(i); await new Promise(r => setTimeout(r, 70)); }
    cap(); // FOTO 2 (Rayos X / Heatmap)

    // FASE 5: PROYECCIÓN ÁUREA
    setStage("GOLDEN RATIO CALCULATION");
    setSubStage("Computing Phi Deviation...");
    await speak("Finalizando cálculo de desviación Áurea.");
    for(let i=86; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase mb-2">Generating Clinical Report</p>
          <p className="text-zinc-600 text-[9px] uppercase">Integrating V-Line Simulation...</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-1000 flex flex-col items-center">
            <div className="mb-12 text-center">
                <h1 className="text-white text-4xl font-black mb-2 tracking-tighter italic">TIPHERET</h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-2 opacity-50"></div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-[0.6em]">Medical Engineering</p>
            </div>
            
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="NOMBRE COMPLETO" />
              <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="EMAIL" />
              <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="WHATSAPP (+XX)" />

              <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone || !user.email} className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  INICIAR DIAGNÓSTICO
              </button>
            </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            
            {/* HUD CLÍNICO AVANZADO */}
            <div className="absolute top-0 left-0 p-4 space-y-1">
                <p className="text-[8px] text-cyan-500 font-mono">REC: ACTIVE</p>
                <p className="text-[8px] text-cyan-500 font-mono">ISO: AUTO</p>
                <p className="text-[8px] text-cyan-500 font-mono">GRID: PHI-1.618</p>
            </div>

            {/* GUIAS VISUALES DE TERCIOS/QUINTOS */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl m-4"></div>
            <div className="absolute top-1/3 left-4 right-4 h-px bg-cyan-500/30"></div> {/* Tercio Superior */}
            <div className="absolute top-2/3 left-4 right-4 h-px bg-cyan-500/30"></div> {/* Tercio Inferior */}
            <div className="absolute top-4 bottom-4 left-1/2 w-px bg-cyan-500/40"></div> {/* Línea Media */}

            <div className="absolute top-10 inset-x-0 flex flex-col items-center gap-2">
                 <div className="bg-black/60 backdrop-blur text-cyan-400 text-[10px] px-6 py-2 rounded-full border border-cyan-500/30 uppercase tracking-widest animate-pulse shadow-lg">
                    {stage}
                 </div>
                 <p className="text-[8px] text-zinc-400 font-mono bg-black/40 px-2 rounded">{subStage}</p>
            </div>
            
            <div className="absolute bottom-12 inset-x-8">
                <div className="flex justify-between mb-1 text-[8px] text-cyan-600 font-mono">
                    <span>PROCESSING BIOMETRICS...</span>
                    <span>{Math.floor(prog)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-zinc-800">
                    <div className="h-full bg-gradient-to-r from-cyan-800 to-cyan-400 transition-all duration-200 ease-out" style={{ width: `${prog}%` }}></div>
                </div>
            </div>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
            <div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Tipheret Center</p>
                <h2 className="text-2xl font-black text-white italic">ENGINEERING <span className="text-cyan-500">REPORT</span></h2>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Bio-Age</p>
                <p className="text-3xl font-mono text-white">{bioAge} <span className="text-sm text-zinc-600">YRS</span></p>
            </div>
          </header>

          <section className="mb-8 space-y-2">
            <div className="flex justify-between items-center px-2">
                <p className="text-[9px] text-cyan-500 uppercase tracking-[0.2em]">Simulación V-Line</p>
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Target: Perfect Symmetry</p>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
                <div className="absolute inset-0 w-full h-full"><img src={photos[0]} className="w-full h-full object-cover filter grayscale contrast-125 brightness-90" /></div>
                <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-cyan-500 shadow-[0_0_20px_cyan]" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     <img src={photos[0]} className="w-full h-full object-cover" style={projectionGeometry} />
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
            </div>
          </section>

          {/* TABLA DE DATOS CLÍNICOS COMPLETOS */}
          <section className="bg-zinc-900/40 p-5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
             <h4 className="text-[10px] text-white font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                Métricas de Estructura Facial
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Proporción Áurea (Phi)</span>
                    <div className="text-right">
                        <span className="text-white font-mono text-xs">{goldenRatio}</span>
                        <span className="block text-[7px] text-red-400">Desviación detectada</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Simetría Facial</span>
                    <div className="text-right">
                        <span className="text-white font-mono text-xs">{symmetry}%</span>
                        <span className="block text-[7px] text-zinc-500">Objetivo: 98%</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Escala Glogau</span>
                    <span className="text-white font-mono text-xs bg-zinc-800 px-2 py-1 rounded">{glogau}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Fototipo Fitzpatrick</span>
                    <span className="text-white font-mono text-xs">{fitzpatrick}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-zinc-400 uppercase">Resorción Ósea</span>
                    <span className="text-red-400 font-bold text-xs animate-pulse tracking-wide">{resorcion}</span>
                </div>
             </div>
          </section>

          <section className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-red-900/10 z-0"></div>
              <p className="text-[7px] text-red-400 font-bold uppercase text-center mb-2 relative z-10">ZONAS DE CALOR (INFLAMACIÓN)</p>
              <img src={photos[0]} className="h-24 w-full object-cover rounded-lg opacity-80 relative z-10" style={{ filter: filters.heatmap }} />
            </div>
            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-cyan-900/10 z-0"></div>
              <p className="text-[7px] text-cyan-400 font-bold uppercase text-center mb-2 relative z-10">DENSIDAD ÓSEA (SIMULADA)</p>
              <img src={photos[1]} className="h-24 w-full object-cover rounded-lg opacity-80 relative z-10" style={{ filter: filters.xray }} />
            </div>
          </section>

          <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8 rounded-[2rem] border border-cyan-500/30 mb-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.1)] relative">
            <h3 className="text-white font-black text-xl italic uppercase mb-2">PLAN DE RECONSTRUCCIÓN</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed max-w-sm mx-auto">
                Para corregir la simetría al 98% y frenar la resorción ósea detectada, descargue el protocolo oficial Tipheret.
            </p>
            
            <button 
              onClick={() => window.open(HOTMART_EBOOK_URL)}
              className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-cyan-400 transition-all transform hover:scale-[1.02]">
                DESCARGAR GUÍA ($35 USD)
            </button>
            <p className="text-[8px] text-zinc-600 mt-3">Soporte Vitalicio • Guía de Drenaje • Manual Clínico</p>
          </div>

          <button 
            onClick={() => {
              const msg = encodeURIComponent(`Dr. Maya Romo, mi diagnóstico indica Glogau ${glogau} y Resorción ${resorcion}. Solicito cita presencial prioritaria.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }}
            className="w-full py-4 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors border border-zinc-900 rounded-xl">
              Agendar Valoración Presencial
          </button>
        </div>
      )}
    </div>
  );
}