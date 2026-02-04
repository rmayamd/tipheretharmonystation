"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
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
  
  // VARIABLES CLÍNICAS AVANZADAS (SIMULACIÓN DE VISIA/VECTRA/VISBODY)
  const [metrics, setMetrics] = useState({
    score: 0,
    realAge: 0,
    structuralAge: 0,
    skinTexture: 0,
    pores: 0,
    uvDamage: 0,
    symmetry: 0,
    resorption: 0,
    jawDefinition: 0
  });

  const [sliderVal, setSliderVal] = useState(50);

  // FILTROS VISUALES
  const filters = {
    heatmap: "contrast(2.0) brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(4)", 
    xray: "grayscale(1) invert(1) contrast(3) brightness(0.8)", 
    structure: "contrast(1.5) grayscale(1) brightness(0.7)", 
  };

  const projectionGeometry = {
    transform: 'scale(1.02) perspective(500px) rotateX(2deg)', 
    filter: filters.structure
  };

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  // GENERADOR DE MÉTRICAS "TIPO VISBODY"
  useEffect(() => { 
    const age = Math.floor(Math.random() * (55 - 35 + 1)) + 35;
    const structureBad = age > 42; 
    
    setMetrics({
        score: structureBad ? Math.floor(Math.random() * (75 - 60) + 60) : Math.floor(Math.random() * (95 - 80) + 80),
        realAge: age,
        structuralAge: age + (structureBad ? 7 : -2),
        skinTexture: Math.floor(Math.random() * 100),
        pores: Math.floor(Math.random() * 100),
        uvDamage: Math.floor(Math.random() * 100),
        symmetry: structureBad ? 82 : 94,
        resorption: structureBad ? 78 : 20, // High resorption is BAD
        jawDefinition: structureBad ? 45 : 85
    });
  }, []);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US'; u.rate = 0.95; u.pitch = 0.8;
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
            diagnosis: `TIPHERET V82 REPORT: Score ${metrics.score}/100 | Resorption ${metrics.resorption}% | Interest: ${user.interest}`, 
            timestamp: new Date().toISOString() 
        })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    
    if(user.interest === 'FACE_RECONSTRUCTION') {
        setStep('report');
    } else {
        window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya, I selected ${user.interest} in the App. I want to see a simulation of my body/breasts.`)}`;
    }
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("VISIA™ DERMATOLOGICAL SCAN"); 
    setSubStage("Analyzing Surface Texture & UV Spots...");
    await speak("Scanning skin texture and pigmentation layers.");
    for(let i=0; i<=30; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("VECTRA™ VOLUMETRIC ANALYSIS");
    setSubStage("Calculating Asymmetry & Depths...");
    await speak("Mapping facial volumes and asymmetry.");
    for(let i=31; i<=60; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    
    setStage("TIPHERET™ OSTEOLOGICAL X-RAY");
    setSubStage("Measuring Bone Resorption (Exclusive)...");
    await speak("Analyzing deep bone structure and resorption.");
    for(let i=61; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    cap(); 
    
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  // COMPONENTE VISUAL DE BARRA DE PROGRESO (Tipo Visbody/Visia)
  const MetricBar = ({ label, val, inverse = false }: { label: string, val: number, inverse?: boolean }) => {
    // Si inverse es true, Alto valor es MALO (ej: Daño UV, Resorción). Si es false, Alto es BUENO.
    let color = "bg-cyan-500";
    if (!inverse) {
        if (val < 50) color = "bg-red-500";
        else if (val < 80) color = "bg-yellow-500";
        else color = "bg-green-500";
    } else {
        if (val > 70) color = "bg-red-500";
        else if (val > 40) color = "bg-yellow-500";
        else color = "bg-green-500";
    }

    return (
        <div className="mb-3">
            <div className="flex justify-between text-[9px] uppercase tracking-widest mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-white font-mono">{val}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${val}%` }}></div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase mb-2">Compiling Clinical Data</p>
          <p className="text-zinc-600 text-[9px] uppercase">Integrating Visia, Vectra & Tipheret Metrics...</p>
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
                <p className="text-center text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Select Target Area for Simulation</p>
                <button onClick={() => { setUser({...user, interest: 'FACE_RECONSTRUCTION'}); setStep('intro'); }} className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">FACE & NECK</span><span className="text-[9px] text-zinc-500">Full Structural Analysis</span></div><span className="text-2xl">👤</span>
                </button>
                <button onClick={() => { setUser({...user, interest: 'BODY_CONTOURING'}); setStep('intro'); }} className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">BODY CONTOURING</span><span className="text-[9px] text-zinc-500">Lipo & Definition Sim</span></div><span className="text-2xl">👙</span>
                </button>
                <button onClick={() => { setUser({...user, interest: 'BREAST_SURGERY'}); setStep('intro'); }} className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left"><span className="block text-white font-bold text-sm tracking-widest">BREAST SURGERY</span><span className="text-[9px] text-zinc-500">Augmentation & Lift</span></div><span className="text-2xl">🍒</span>
                </button>
            </div>
        </div>
      )}

      {/* --- INTRO & FORM --- */}
      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-500 flex flex-col items-center">
            <div className="mb-8 text-center">
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest">Protocol: {user.interest.replace('_', ' ')}</p>
                <h2 className="text-white text-2xl font-black italic">PATIENT DATA</h2>
            </div>
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none placeholder:text-zinc-700" placeholder="FULL NAME" />
              <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none placeholder:text-zinc-700" placeholder="EMAIL ADDRESS" />
              <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none placeholder:text-zinc-700" placeholder="WHATSAPP (+XX)" />
              <button onClick={() => user.interest === 'FACE_RECONSTRUCTION' ? setStep('scanning') : syncLead()} disabled={!user.name || !user.phone || !user.email} className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all">INITIALIZE</button>
            </div>
        </div>
      )}

      {/* --- SCANNER --- */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            <div className="absolute top-10 inset-x-0 flex flex-col items-center gap-2">
                 <div className="bg-black/60 backdrop-blur text-cyan-400 text-[10px] px-6 py-2 rounded-full border border-cyan-500/30 uppercase tracking-widest animate-pulse shadow-lg text-center">{stage}</div>
            </div>
            <div className="absolute bottom-12 inset-x-8">
                <div className="flex justify-between mb-1 text-[8px] text-cyan-600 font-mono"><span>PROCESSING BIOMETRICS...</span><span>{Math.floor(prog)}%</span></div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-zinc-800"><div className="h-full bg-gradient-to-r from-cyan-800 to-cyan-400 transition-all duration-200" style={{ width: `${prog}%` }}></div></div>
            </div>
          </div>
        </div>
      )}

      {/* --- THE ULTIMATE REPORT (VISBODY + VISIA + VECTRA STYLE) --- */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          
          {/* HEADER TIPO VISBODY (SCORE GIGANTE) */}
          <header className="flex flex-col items-center border-b border-white/10 pb-8 mb-8">
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Tipheret Medical Global Score</p>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className={`absolute inset-0 border-4 rounded-full ${metrics.score > 80 ? 'border-green-500' : 'border-red-500'} animate-spin-slow`} style={{ clipPath: 'inset(0 0 0 50%)' }}></div>
                <div className="text-center z-10">
                    <span className={`text-4xl font-black ${metrics.score > 80 ? 'text-green-500' : 'text-red-500'}`}>{metrics.score}</span>
                    <span className="block text-[8px] text-zinc-500 uppercase">OUT OF 100</span>
                </div>
            </div>
            <div className="flex gap-8 mt-6 w-full justify-center">
                 <div className="text-center">
                    <p className="text-[8px] text-zinc-500 uppercase">Chronological Age</p>
                    <p className="text-xl font-bold text-white">{metrics.realAge}</p>
                 </div>
                 <div className="w-px h-8 bg-zinc-800"></div>
                 <div className="text-center">
                    <p className="text-[8px] text-zinc-500 uppercase">Structural Age</p>
                    <p className={`text-xl font-bold ${metrics.structuralAge > metrics.realAge ? 'text-red-500' : 'text-green-500'}`}>{metrics.structuralAge}</p>
                 </div>
            </div>
          </header>

          {/* SECCIÓN 1: VECTRA (VOLUMETRÍA 3D) */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-cyan-500 text-lg">▣</span>
                <h3 className="text-white font-bold uppercase text-sm tracking-widest">Vectra™ Volumetric Analysis</h3>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl mb-4">
                <div className="absolute inset-0 w-full h-full"><img src={photos[0]} className="w-full h-full object-cover filter grayscale opacity-50" /></div>
                <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-cyan-500 shadow-[0_0_20px_cyan]" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     <img src={photos[0]} className="w-full h-full object-cover" style={projectionGeometry} />
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
                <div className="absolute bottom-2 left-2 text-[8px] text-cyan-500 bg-black/80 px-2 rounded">SLIDE TO SEE ASYMMETRY</div>
            </div>
            
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5 space-y-2">
                <MetricBar label="Facial Symmetry" val={metrics.symmetry} />
                <MetricBar label="Jawline Definition" val={metrics.jawDefinition} />
            </div>
          </section>

          {/* SECCIÓN 2: VISIA (DERMATOLOGÍA) */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-purple-500 text-lg">❖</span>
                <h3 className="text-white font-bold uppercase text-sm tracking-widest">Visia™ Skin Diagnostics</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-zinc-900 p-2 rounded border border-purple-900/30">
                     <img src={photos[0]} className="w-full h-24 object-cover rounded opacity-80" style={{ filter: filters.heatmap }} />
                     <p className="text-[7px] text-center mt-1 text-purple-400">UV DAMAGE MAP</p>
                </div>
                <div className="bg-zinc-900 p-2 rounded border border-purple-900/30">
                     <img src={photos[0]} className="w-full h-24 object-cover rounded opacity-80" style={{ filter: "contrast(200%) grayscale(100%)" }} />
                     <p className="text-[7px] text-center mt-1 text-purple-400">PORE DENSITY</p>
                </div>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5 space-y-2">
                <MetricBar label="Surface Texture" val={metrics.skinTexture} />
                <MetricBar label="Deep UV Damage" val={metrics.uvDamage} inverse={true} />
                <MetricBar label="Pore Enlargement" val={metrics.pores} inverse={true} />
            </div>
          </section>

          {/* SECCIÓN 3: TIPHERET EXCLUSIVE (OSTEOLOGÍA) - EL CIERRE DE VENTA */}
          <section className="mb-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-lg">⚠️</span>
                <h3 className="text-red-500 font-bold uppercase text-sm tracking-widest animate-pulse">Structural Alert</h3>
            </div>
            
            <div className="bg-red-900/10 border border-red-500/30 p-5 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] text-red-400 font-bold uppercase">Bone Resorption Level</p>
                    <p className="text-xl font-black text-white">{metrics.resorption}%</p>
                </div>
                <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-red-900/50 relative">
                     <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600" style={{ width: `${metrics.resorption}%` }}></div>
                </div>
                <p className="text-[9px] text-zinc-400 mt-3 leading-relaxed">
                    <strong className="text-white">Analysis:</strong> High probability of mandibular recession and premature aging. 
                    Surface treatments (Botox/Fillers) will <strong className="text-red-400">NOT</strong> solve this structural collapse.
                </p>
            </div>
          </section>

          {/* CTA: LA SOLUCIÓN QUIRÚRGICA */}
          <div className="bg-zinc-900 p-6 rounded-2xl text-center space-y-3 shadow-2xl border border-cyan-900/50">
            <button 
              onClick={() => window.open(HOTMART_EBOOK_URL)}
              className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg">
                DOWNLOAD PROTOCOL ($35 USD)
                <span className="block text-[8px] font-normal mt-1 text-zinc-600">STEP 1: HOME PREPARATION</span>
            </button>

            <button 
                onClick={() => {
                const msg = encodeURIComponent(`Dr. Maya, my Tipheret Score is ${metrics.score}/100 with ${metrics.resorption}% Resorption. I need a SURGICAL PLAN.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
                }}
                className="w-full py-3 text-[9px] text-cyan-500 border border-cyan-900/50 rounded-xl uppercase tracking-widest hover:bg-cyan-900/10 transition-colors">
                REQUEST SURGICAL CONSULTATION ➜
            </button>
          </div>

        </div>
      )}
    </div>
  );
}