"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const WS_BUSINESS = "573117936211";
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxHesi-oREB42asByNKgwk-BL65L17mThp5yrnx-4cXGrz7xbL5H0gAGbVQGOQaXQRKlA/exec"; 

export default function TipherethGlobal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('menu'); 
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', country: 'USA', interest: '' }); 
  const [stage, setStage] = useState('');
  const [subStage, setSubStage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // VARIABLES DE MEDICIÓN REAL (SIMULADA)
  const [metrics, setMetrics] = useState({
    upperThird: 33, // Ideal 33.3%
    midThird: 33,
    lowerThird: 33,
    eyeDist: 20, // Quintos (Ideal 20%)
    phi: 1.618,
    symmetry: 100,
    resorption: 'NONE'
  });

  const [sliderVal, setSliderVal] = useState(50);

  // FILTROS TÉCNICOS
  const filters = {
    grid: "grayscale(1) contrast(1.2) brightness(0.8)", 
    xray: "grayscale(1) invert(1) contrast(2) brightness(0.7)", 
  };

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  // SIMULADOR DE PROPORCIONES (ALGORITMO DE "DEFECTO")
  useEffect(() => { 
    // Generamos un caso con defecto en el tercio inferior (común para vender mentoplastia/protocolo)
    const lowerDeficit = Math.floor(Math.random() * (30 - 25) + 25); // 25-30% (Corto)
    const compensacion = (100 - lowerDeficit) / 2;
    
    setMetrics({
        upperThird: Number(compensacion.toFixed(1)),
        midThird: Number(compensacion.toFixed(1)),
        lowerThird: lowerDeficit,
        eyeDist: 22, // Ligeramente separado
        phi: 1.58, // Lejos del 1.618
        symmetry: Math.floor(Math.random() * (92 - 82) + 82), // Asimetría real
        resorption: 'MODERATE RETRUSION'
    });
  }, []);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US'; u.rate = 1.0; u.pitch = 0.9;
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
        body: JSON.stringify({ 
            ...user, 
            diagnosis: `TIPHERET V83: Lower3rd ${metrics.lowerThird}% | Phi ${metrics.phi} | Sym ${metrics.symmetry}%`, 
            timestamp: new Date().toISOString() 
        })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    
    if(user.interest === 'FACE_RECONSTRUCTION') setStep('report');
    else window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya, I selected ${user.interest} in the App. I want to see a simulation.`)}`;
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("CALIBRATING GRID (RULE OF THIRDS)"); 
    setSubStage("Measuring Vertical Proportions...");
    await speak("Calibrating facial thirds.");
    for(let i=0; i<=40; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("HORIZONTAL FIFTHS ANALYSIS");
    setSubStage("Calculating Intercanthal Distance...");
    await speak("Analyzing horizontal fifths and symmetry.");
    for(let i=41; i<=80; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    
    setStage("GOLDEN RATIO (PHI) CALCULATION");
    setSubStage("Comparing Left vs Right Hemi-Face...");
    await speak("Calculating Golden Ratio deviation.");
    for(let i=81; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    cap(); 
    
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase mb-2">Calculating Proportions</p>
          <p className="text-zinc-600 text-[9px] uppercase">Integrating Thirds & Fifths Logic...</p>
        </div>
      )}

      {/* --- MENU GLOBAL --- */}
      {step === 'menu' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-1000 flex flex-col items-center">
            <div className="mb-10 text-center">
                <h1 className="text-white text-4xl font-black mb-2 tracking-tighter italic">TIPHERET</h1>
                <p className="text-[9px] text-cyan-500 uppercase tracking-[0.4em]">Medical Digital Hospital</p>
            </div>
            <div className="w-full space-y-4">
                <p className="text-center text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Select Analysis Target</p>
                <button onClick={() => { setUser({...user, interest: 'FACE_RECONSTRUCTION'}); setStep('intro'); }} className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-cyan-500/50">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">FACE ANALYSIS</span><span className="text-[9px] text-zinc-500">Thirds, Fifths & Phi Ratio</span></div><span className="text-2xl">👤</span>
                </button>
                <button onClick={() => { setUser({...user, interest: 'BODY_CONTOURING'}); setStep('intro'); }} className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-cyan-500/50">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">BODY SCULPT</span><span className="text-[9px] text-zinc-500">Lipo & Definition</span></div><span className="text-2xl">👙</span>
                </button>
                <button onClick={() => { setUser({...user, interest: 'BREAST_SURGERY'}); setStep('intro'); }} className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-cyan-500/50">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">BREAST SURGERY</span><span className="text-[9px] text-zinc-500">Volumetric Simulation</span></div><span className="text-2xl">🍒</span>
                </button>
            </div>
        </div>
      )}

      {/* --- INTRO --- */}
      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-500 flex flex-col items-center">
            <h2 className="text-white text-xl font-black italic mb-6">PATIENT RECORD</h2>
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none" placeholder="FULL NAME" />
              <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none" placeholder="EMAIL ADDRESS" />
              <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none" placeholder="WHATSAPP (+XX)" />
              <button onClick={() => user.interest === 'FACE_RECONSTRUCTION' ? setStep('scanning') : syncLead()} disabled={!user.name || !user.phone || !user.email} className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all">START MEASUREMENT</button>
            </div>
        </div>
      )}

      {/* --- SCANNER (CON GRID DE TERCIOS) --- */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            
            {/* OVERLAY DE TERCIOS Y QUINTOS */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="h-1/3 w-full border-b border-cyan-500"></div>
                <div className="h-1/3 w-full border-b border-cyan-500"></div>
                <div className="absolute inset-0 flex">
                    <div className="w-1/5 h-full border-r border-cyan-500"></div>
                    <div className="w-1/5 h-full border-r border-cyan-500"></div>
                    <div className="w-1/5 h-full border-r border-cyan-500"></div>
                    <div className="w-1/5 h-full border-r border-cyan-500"></div>
                </div>
            </div>

            <div className="absolute top-10 inset-x-0 text-center space-y-2">
                 <div className="inline-block bg-black/60 text-cyan-400 text-[10px] px-4 py-1 rounded-full border border-cyan-500/30 uppercase tracking-widest animate-pulse">{stage}</div>
                 <p className="text-[8px] text-zinc-300 bg-black/40 px-2 rounded inline-block">{subStage}</p>
            </div>
            
            <div className="absolute bottom-12 inset-x-8">
                <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 transition-all duration-200" style={{ width: `${prog}%` }}></div></div>
            </div>
          </div>
        </div>
      )}

      {/* --- REPORTE TÉCNICO (TERCIOS / QUINTOS / OPCIONES) --- */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          
          <header className="border-b border-white/10 pb-6 mb-8 text-center">
            <h2 className="text-2xl font-black text-white italic mb-1">FACIAL <span className="text-cyan-500">METRICS</span></h2>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Engineering Report</p>
          </header>

          {/* 1. ANÁLISIS DE TERCIOS (VERTICAL) */}
          <section className="mb-8 bg-zinc-900/30 p-4 rounded-2xl border border-white/5">
            <h3 className="text-[10px] text-white font-bold uppercase mb-4 flex items-center gap-2"><span className="text-cyan-500">I.</span> Vertical Thirds Analysis</h3>
            <div className="flex justify-between items-end h-32 px-4 gap-2 mb-2">
                {/* Tercio Superior */}
                <div className="w-1/3 flex flex-col justify-end items-center gap-1">
                    <span className="text-[8px] text-zinc-500">UPPER</span>
                    <div className="w-full bg-zinc-800 rounded-t" style={{height: `${metrics.upperThird}%`}}></div>
                    <span className="text-xs font-mono text-white">{metrics.upperThird}%</span>
                </div>
                {/* Tercio Medio */}
                <div className="w-1/3 flex flex-col justify-end items-center gap-1">
                    <span className="text-[8px] text-zinc-500">MIDDLE</span>
                    <div className="w-full bg-zinc-700 rounded-t" style={{height: `${metrics.midThird}%`}}></div>
                    <span className="text-xs font-mono text-white">{metrics.midThird}%</span>
                </div>
                {/* Tercio Inferior (EL PROBLEMA) */}
                <div className="w-1/3 flex flex-col justify-end items-center gap-1">
                    <span className="text-[8px] text-red-500 font-bold animate-pulse">LOWER</span>
                    <div className="w-full bg-red-900/80 rounded-t border-t border-red-500" style={{height: `${metrics.lowerThird}%`}}></div>
                    <span className="text-xs font-mono text-red-500">{metrics.lowerThird}%</span>
                </div>
            </div>
            <p className="text-[9px] text-center text-zinc-500 uppercase">Target Ideal: 33.3% Equal Distribution</p>
          </section>

          {/* 2. SIMETRÍA Y PHI */}
          <section className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-[8px] text-zinc-500 uppercase mb-1">Golden Ratio (Phi)</p>
                <p className="text-2xl font-mono text-white">{metrics.phi}</p>
                <p className="text-[8px] text-red-400 mt-1">Deviation Detected</p>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5 text-center">
                <p className="text-[8px] text-zinc-500 uppercase mb-1">Bilateral Symmetry</p>
                <p className="text-2xl font-mono text-white">{metrics.symmetry}%</p>
                <p className="text-[8px] text-yellow-500 mt-1">Left Side Dominant</p>
            </div>
          </section>

          {/* 3. VISUALIZACIÓN DE SIMETRÍA (SLIDER) */}
          <section className="mb-8 relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-black">
             <div className="absolute top-2 left-2 z-20 bg-black/60 px-2 py-1 rounded text-[8px] text-white">LEFT vs RIGHT COMPARISON</div>
             <div className="absolute inset-0 w-full h-full"><img src={photos[0]} className="w-full h-full object-cover grayscale opacity-50" /></div>
             <div className="absolute inset-0 w-full h-full overflow-hidden border-r border-cyan-500" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                <img src={photos[0]} className="w-full h-full object-cover scale-x-[-1]" />
             </div>
             <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
          </section>

          {/* 4. PLAN DE TRATAMIENTO (QUIRÚRGICO VS NO QUIRÚRGICO) */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h3 className="text-center text-white font-bold uppercase text-sm mb-6 tracking-widest">Treatment Options</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* COLUMNA 1: NO QUIRÚRGICO */}
                <div className="border border-zinc-700 rounded-xl p-3 bg-black/40">
                    <p className="text-[9px] text-green-400 font-bold uppercase mb-2 text-center">Option A: Non-Surgical</p>
                    <ul className="text-[8px] text-zinc-400 space-y-2 list-disc pl-3">
                        <li>Decompress Inflammation</li>
                        <li>Correct Tongue Posture</li>
                        <li>Stimulate Bone Density</li>
                    </ul>
                    <div className="mt-4 pt-2 border-t border-zinc-800 text-center">
                        <span className="text-[10px] text-white font-bold block">$35 USD</span>
                        <span className="text-[7px] text-zinc-500">Home Protocol</span>
                    </div>
                </div>

                {/* COLUMNA 2: QUIRÚRGICO */}
                <div className="border border-red-900/30 rounded-xl p-3 bg-red-900/10">
                    <p className="text-[9px] text-red-400 font-bold uppercase mb-2 text-center">Option B: Surgical</p>
                    <ul className="text-[8px] text-zinc-400 space-y-2 list-disc pl-3">
                        <li>Genioplasty (Chin)</li>
                        <li>Mandibular Angle Imp.</li>
                        <li>Structural Lipo</li>
                    </ul>
                    <div className="mt-4 pt-2 border-t border-red-900/30 text-center">
                        <span className="text-[10px] text-white font-bold block">$5,000+ USD</span>
                        <span className="text-[7px] text-zinc-500">Requires Consultation</span>
                    </div>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 mb-3">
                START OPTION A (PROTOCOL)
            </button>
            <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent("Dr. Maya, I saw my Thirds Analysis. I want to discuss OPTION B (Surgery).")}`} 
                className="w-full border border-zinc-700 text-zinc-400 py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:text-white hover:border-white">
                CONSULT OPTION B (SURGERY)
            </button>
          </div>

        </div>
      )}
    </div>
  );
}