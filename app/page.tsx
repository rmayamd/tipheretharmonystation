"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxHesi-oREB42asByNKgwk-BL65L17mThp5yrnx-4cXGrz7xbL5H0gAGbVQGOQaXQRKlA/exec"; 
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 

export default function TipherethGlobal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('menu'); // AHORA INICIAMOS EN EL MENÚ GLOBAL
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', country: 'USA', interest: '' }); 
  const [stage, setStage] = useState('');
  const [subStage, setSubStage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // VARIABLES CLÍNICAS (FACIAL)
  const [bioAge, setBioAge] = useState(0);
  const [fitzpatrick, setFitzpatrick] = useState("III");
  const [glogau, setGlogau] = useState("TYPE II");
  const [goldenRatio, setGoldenRatio] = useState(1.45);
  const [resorcion, setResorcion] = useState("MODERATE");
  const [symmetry, setSymmetry] = useState(82); 
  const [sliderVal, setSliderVal] = useState(50);

  // FILTROS VISUALES
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

  useEffect(() => { 
    // SIMULACIÓN DE DATOS CLÍNICOS
    const calculatedAge = Math.floor(Math.random() * (58 - 38 + 1)) + 38;
    setBioAge(calculatedAge);
    if(calculatedAge > 45) {
        setGlogau("TYPE III (Advanced)");
        setResorcion("SEVERE (Surgical Case)");
        setGoldenRatio(1.32); 
        setSymmetry(76);
    } else {
        setGlogau("TYPE II (Moderate)");
        setResorcion("INCIPIENT (Treatable)");
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
    u.lang = 'en-US'; 
    u.rate = 0.95; u.pitch = 0.8;
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
      // AQUÍ ENVIAMOS EL INTERÉS ESPECÍFICO (NEURODATA) A SU GOOGLE SHEET
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...user, 
            diagnosis: `TIPHERET V81: Interest: ${user.interest} | BioAge ${bioAge} | Resorption ${resorcion} | Country: ${user.country}`, 
            timestamp: new Date().toISOString() 
        })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    
    // SI ES CARA -> REPORTE FACIAL. SI ES CUERPO -> VENTA DIRECTA (POR AHORA)
    if(user.interest === 'FACE_RECONSTRUCTION') {
        setStep('report');
    } else {
        // Para cuerpo y senos, los mandamos a agendar simulación profesional
        window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya, I selected ${user.interest} in the App. I want to see a simulation of my body/breasts.`)}`;
    }
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("VOLUMETRIC STRUCTURAL SCAN"); 
    setSubStage("Mapping 3D Depth & Asymmetry...");
    await speak("Initializing volumetric structural scan.");
    for(let i=0; i<=30; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("EPIDERMAL PIGMENTATION ANALYSIS");
    setSubStage("Scanning Texture & Pore Density...");
    await speak("Analyzing epidermal texture and pigmentation.");
    for(let i=31; i<=60; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    
    setStage("MAXILLOFACIAL DENSITY CHECK");
    setSubStage("Detecting Bone Resorption Levels...");
    await speak("Measuring deep bone density and resorption.");
    for(let i=61; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    cap(); 
    
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase mb-2">Processing Neuro-Metrics</p>
          <p className="text-zinc-600 text-[9px] uppercase">Integrating Surgical Protocol...</p>
        </div>
      )}

      {/* --- PANTALLA 1: MENÚ GLOBAL ANATÓMICO (NEUROSELECCIÓN) --- */}
      {step === 'menu' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-1000 flex flex-col items-center">
            <div className="mb-10 text-center">
                <h1 className="text-white text-4xl font-black mb-2 tracking-tighter italic">TIPHERET</h1>
                <p className="text-[9px] text-cyan-500 uppercase tracking-[0.4em]">Medical Digital Hospital</p>
            </div>

            <div className="w-full space-y-4">
                <p className="text-center text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Select Target Area for Simulation</p>
                
                {/* BOTÓN 1: CARA (Lleva al Scanner Facial) */}
                <button onClick={() => { setUser({...user, interest: 'FACE_RECONSTRUCTION'}); setStep('intro'); }} 
                    className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left">
                        <span className="block text-white font-bold text-sm tracking-widest group-hover:text-cyan-400 transition-colors">FACE & NECK</span>
                        <span className="text-[9px] text-zinc-500">Analysis: Bone, Skin & Symmetry</span>
                    </div>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">👤</span>
                </button>

                {/* BOTÓN 2: CUERPO (Captura interés de Lipo/Abdo) */}
                <button onClick={() => { setUser({...user, interest: 'BODY_CONTOURING'}); setStep('intro'); }} 
                    className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left">
                        <span className="block text-white font-bold text-sm tracking-widest group-hover:text-cyan-400 transition-colors">BODY CONTOURING</span>
                        <span className="text-[9px] text-zinc-500">Sim: Lipo-Definition & Tummy Tuck</span>
                    </div>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">👙</span>
                </button>

                {/* BOTÓN 3: MAMARIO (Captura interés de Implantes) */}
                <button onClick={() => { setUser({...user, interest: 'BREAST_SURGERY'}); setStep('intro'); }} 
                    className="group w-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all duration-300 flex items-center justify-between">
                    <div className="text-left">
                        <span className="block text-white font-bold text-sm tracking-widest group-hover:text-cyan-400 transition-colors">BREAST SURGERY</span>
                        <span className="text-[9px] text-zinc-500">Sim: Augmentation & Lift</span>
                    </div>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">🍒</span>
                </button>
            </div>
            <p className="mt-8 text-[8px] text-zinc-700 text-center max-w-xs">
                By accessing Tipheret A.I., you agree to the medical data processing for diagnostic and surgical planning purposes.
            </p>
        </div>
      )}

      {/* --- PANTALLA 2: CAPTURA DE DATOS --- */}
      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-500 flex flex-col items-center">
            <div className="mb-8 text-center">
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest">Protocol: {user.interest.replace('_', ' ')}</p>
                <h2 className="text-white text-2xl font-black italic">PATIENT DATA</h2>
            </div>
            
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="FULL NAME" />
              <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="EMAIL ADDRESS" />
              <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none placeholder:text-zinc-700" placeholder="WHATSAPP (+XX)" />
              
              <div className="relative">
                <select onChange={e => setUser({...user, country: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none appearance-none">
                    <option value="USA">🇺🇸 United States</option>
                    <option value="KOREA">🇰🇷 South Korea</option>
                    <option value="UAE">🇦🇪 UAE (Dubai)</option>
                    <option value="EU">🇪🇺 Europe</option>
                    <option value="GLOBAL">🌎 Rest of World</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs">▼</div>
              </div>

              <button onClick={() => user.interest === 'FACE_RECONSTRUCTION' ? setStep('scanning') : syncLead()} disabled={!user.name || !user.phone || !user.email} className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  INITIALIZE {user.interest === 'FACE_RECONSTRUCTION' ? 'SCANNER' : 'SIMULATION'}
              </button>
            </div>
        </div>
      )}

      {/* --- PANTALLA 3: ESCÁNER FACIAL (SOLO SI ELIGIÓ CARA) --- */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            
            <div className="absolute top-0 left-0 p-4 space-y-1">
                <p className="text-[8px] text-cyan-500 font-mono">REC: ACTIVE</p>
                <p className="text-[8px] text-cyan-500 font-mono">MODE: {user.interest}</p>
                <p className="text-[8px] text-cyan-500 font-mono">GRID: PHI-1.618</p>
            </div>

            <div className="absolute top-10 inset-x-0 flex flex-col items-center gap-2">
                 <div className="bg-black/60 backdrop-blur text-cyan-400 text-[10px] px-6 py-2 rounded-full border border-cyan-500/30 uppercase tracking-widest animate-pulse shadow-lg text-center">
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

      {/* --- PANTALLA 4: REPORTE FACIAL --- */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
            <div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Tipheret Center</p>
                <h2 className="text-2xl font-black text-white italic">CLINICAL <span className="text-cyan-500">REPORT</span></h2>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Bio-Age</p>
                <p className="text-3xl font-mono text-white">{bioAge} <span className="text-sm text-zinc-600">YRS</span></p>
            </div>
          </header>

          <section className="mb-8 space-y-2">
            <div className="flex justify-between items-center px-2">
                <p className="text-[9px] text-cyan-500 uppercase tracking-[0.2em]">Volumetric Projection</p>
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Target: Structural Restoration</p>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
                <div className="absolute inset-0 w-full h-full"><img src={photos[0]} className="w-full h-full object-cover filter grayscale contrast-125 brightness-90" /></div>
                <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-cyan-500 shadow-[0_0_20px_cyan]" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     <img src={photos[0]} className="w-full h-full object-cover" style={projectionGeometry} />
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
            </div>
          </section>

          <section className="bg-zinc-900/40 p-5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
             <h4 className="text-[10px] text-white font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                Integrated Diagnostics
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Maxillofacial Density</span>
                    <div className="text-right">
                        <span className="text-red-500 font-bold text-xs animate-pulse">{resorcion}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Epidermal Pigmentation</span>
                    <span className="text-white font-mono text-xs bg-zinc-800 px-2 py-1 rounded">{glogau}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] text-zinc-400 uppercase">Volumetric Symmetry</span>
                    <div className="text-right">
                        <span className="text-white font-mono text-xs">{symmetry}%</span>
                        <span className="block text-[7px] text-zinc-500">Normal Range: 96-99%</span>
                    </div>
                </div>
             </div>
          </section>

          <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8 rounded-[2rem] border border-cyan-500/30 mb-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.1)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Structural Alert
            </div>
            
            <h3 className="text-white font-black text-xl italic uppercase mt-2 mb-2">PROTOCOL ACTIVATION</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed max-w-sm mx-auto border-l-2 border-red-500 pl-4 text-left">
                <span className="text-red-400 font-bold">DIAGNOSIS:</span> Significant bone resorption detected. <br/>
                <span className="text-white">RECOMMENDATION:</span> Immediate activation of the drainage protocol is required to prepare tissue for future reconstruction.
            </p>
            
            <button 
              onClick={() => window.open(HOTMART_EBOOK_URL)}
              className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-cyan-400 transition-all transform hover:scale-[1.02] mb-4">
                DOWNLOAD PROTOCOL ($35 USD)
                <span className="block text-[8px] font-normal mt-1 text-zinc-600">STEP 1: HOME PREPARATION</span>
            </button>

            <button 
                onClick={() => {
                const msg = encodeURIComponent(`Dr. Maya Romo, my Tipheret Scan shows SEVERE Resorption. I have downloaded the protocol but I need a SURGICAL ASSESSMENT.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
                }}
                className="w-full py-4 text-[9px] text-cyan-500 border border-cyan-900/50 rounded-xl uppercase tracking-widest hover:bg-cyan-900/10 transition-colors">
                REQUEST SURGICAL ASSESSMENT ➜
            </button>
          </div>

        </div>
      )}
    </div>
  );
}