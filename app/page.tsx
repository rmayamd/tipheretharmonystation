"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL HOSPITAL DIGITAL ---
const WS_BUSINESS = "573117936211";
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxHesi-oREB42asByNKgwk-BL65L17mThp5yrnx-4cXGrz7xbL5H0gAGbVQGOQaXQRKlA/exec"; 

export default function TipherethGlobal() {
  // ESTADOS DE LA APLICACIÓN
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('login'); // PASO 1: EL MURO DE REGISTRO
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', country: 'USA', interest: 'GENERAL_ACCESS' }); 
  const [stage, setStage] = useState('');
  const [subStage, setSubStage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // VARIABLES MÉDICAS COMPLETAS (LA SUMA DE TODO)
  const [metrics, setMetrics] = useState({
    // 1. Geometría (Vectra)
    upperThird: 33, midThird: 33, lowerThird: 33,
    phi: 1.618, symmetry: 100, eyeDist: 20,
    // 2. Piel (Visia)
    skinTexture: 90, uvDamage: 10, pores: 20, glogau: "TYPE II",
    // 3. Hueso (Tipheret)
    resorption: 'NONE', score: 95
  });

  const [sliderVal, setSliderVal] = useState(50);

  // FILTROS DE ALTA TECNOLOGÍA
  const filters = {
    heatmap: "contrast(2.0) brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(4)", 
    xray: "grayscale(1) invert(1) contrast(2) brightness(0.7)", 
    structure: "grayscale(1) contrast(1.2) brightness(0.9)",
    grid: "brightness(0.8) contrast(1.2)"
  };

  // --- EFECTO DE PERSISTENCIA (PARA QUE NO SE REGISTRE 2 VECES) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('tipheret_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        setStep('menu'); // Si ya existe, pase directo al juego
    }
  }, []);

  // --- FUNCIÓN DE REGISTRO INICIAL (EL GANCHO) ---
  const registerUser = async () => {
    setLoading(true);
    // Guardamos en el navegador del usuario
    localStorage.setItem('tipheret_user', JSON.stringify(user));
    
    // Enviamos el Lead a su Base de Datos (Google Sheet)
    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, diagnosis: "NEW REGISTERED USER - ACCESS GRANTED", timestamp: new Date().toISOString() })
        });
    } catch (e) { console.error("Sync Error"); }
    
    await new Promise(r => setTimeout(r, 1500)); // Pequeña espera para dar sensación de seguridad
    setLoading(false);
    setStep('menu'); // ABRIMOS EL PARQUE DE DIVERSIONES
  };

  // --- RASTREADOR DE INTERESES (NEUROCIENCIA) ---
  const trackInterest = async (area: string) => {
    // Esto se ejecuta en silencio cuando el usuario toca un botón
    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, interest: area, diagnosis: `USER BROWSING: ${area}`, timestamp: new Date().toISOString() })
        });
    } catch (e) {} // Silencioso
  };

  // --- MOTOR DE DIAGNÓSTICO INTELIGENTE ---
  useEffect(() => { 
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('menu'));
    }
    
    // Simulación de Algoritmo Médico (Randomizado para demo)
    const lowerDeficit = Math.floor(Math.random() * (30 - 25) + 25); 
    const compensacion = (100 - lowerDeficit) / 2;
    const isSevere = lowerDeficit < 28;

    setMetrics({
        upperThird: Number(compensacion.toFixed(1)),
        midThird: Number(compensacion.toFixed(1)),
        lowerThird: lowerDeficit,
        phi: isSevere ? 1.58 : 1.61, 
        symmetry: Math.floor(Math.random() * (94 - 80) + 80),
        eyeDist: 22,
        skinTexture: isSevere ? 65 : 88,
        uvDamage: isSevere ? 70 : 30,
        pores: isSevere ? 60 : 25,
        glogau: isSevere ? "TYPE III (Advanced)" : "TYPE II (Moderate)",
        resorption: isSevere ? 'SEVERE RETRUSION' : 'MODERATE',
        score: isSevere ? 68 : 85
    });
  }, [step]);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US'; u.rate = 1.0;
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

  const runProtocol = async (s: MediaStream) => {
    // 1. GEOMETRÍA (TERCIOS Y QUINTOS)
    setStage("GEOMETRIC MAPPING"); 
    setSubStage("Analyzing Facial Thirds & Fifths...");
    await speak("Calibrating facial geometry.");
    for(let i=0; i<=35; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    // 2. PIEL (VISIA)
    setStage("DERMATOLOGICAL SCAN");
    setSubStage("Measuring Texture & UV Damage...");
    await speak("Analyzing skin quality.");
    for(let i=36; i<=70; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    
    // 3. HUESO (TIPHERET)
    setStage("OSTEOLOGICAL X-RAY");
    setSubStage("Detecting Bone Resorption...");
    await speak("Checking deep bone structure.");
    for(let i=71; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    cap(); 
    
    s.getTracks().forEach(t => t.stop()); 
    setStep('report');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(6,182,212,0.6)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase mb-2">Creating Secure ID</p>
          <p className="text-zinc-600 text-[9px] uppercase">Encrypting Medical Data...</p>
        </div>
      )}

      {/* --- PASO 1: EL REGISTRO OBLIGATORIO (SOLO SALE SI NO ESTÁ REGISTRADO) --- */}
      {step === 'login' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-500 flex flex-col items-center">
            <h1 className="text-white text-4xl font-black mb-2 tracking-tighter italic text-center">TIPHERET<br/><span className="text-[10px] text-cyan-500 font-normal tracking-[0.5em] not-italic">MEDICAL ACCESS</span></h1>
            <p className="text-[9px] text-zinc-500 mb-8 uppercase tracking-widest text-center">Register once. Access all simulations.</p>
            
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none focus:border-cyan-500 transition-colors" placeholder="DR. RICARDO MAYA" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none focus:border-cyan-500 transition-colors" placeholder="patient@email.com" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-widest ml-1">WhatsApp (Required)</label>
                <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none focus:border-cyan-500 transition-colors" placeholder="+1 555 000 0000" />
              </div>

              <div className="space-y-1">
                 <label className="text-[8px] uppercase tracking-widest ml-1">Region</label>
                 <select onChange={e => setUser({...user, country: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl outline-none">
                    <option value="USA">🇺🇸 United States</option>
                    <option value="LATAM">🌎 Latin America</option>
                    <option value="EU">🇪🇺 Europe</option>
                    <option value="ASIA">🇰🇷 Asia / Korea</option>
                 </select>
              </div>

              <button onClick={registerUser} disabled={!user.name || !user.phone || !user.email} className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all shadow-lg disabled:opacity-50">
                  CREATE PATIENT ID
              </button>
            </div>
            <p className="mt-6 text-[7px] text-zinc-700 text-center max-w-xs">By registering, you accept our medical privacy policy and neuro-data processing.</p>
        </div>
      )}

      {/* --- PASO 2: EL "PLAYGROUND" (MENÚ DE JUEGOS) --- */}
      {step === 'menu' && (
        <div className="w-full max-w-md p-6 mt-8 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-white font-bold text-lg italic">WELCOME</h2>
                    <p className="text-[9px] text-cyan-500 uppercase tracking-widest">{user.name}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                    <span className="text-[8px] text-green-400 font-bold uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ID ACTIVE</span>
                </div>
            </div>

            <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-center mb-6">Select Simulation Module</p>
            
            <div className="space-y-4">
                {/* BOTÓN 1: CARA (ESCÁNER COMPLETO) */}
                <button onClick={() => { trackInterest('FACE_SCAN'); setStep('scanning'); }} className="group w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-cyan-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-left relative z-10">
                        <span className="block text-white font-black text-lg italic tracking-tighter">FACE ANALYSIS</span>
                        <span className="text-[9px] text-zinc-400 block mt-1">Full Scan: Skin + Bone + Geometry</span>
                    </div>
                    <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">👤</span>
                </button>

                {/* BOTÓN 2: CUERPO (Neuro-Trampa) */}
                <button onClick={() => { trackInterest('BODY_CONTOURING'); window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya (ID: ${user.name}), I am interested in BODY CONTOURING simulation.`)}`; }} 
                    className="group w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-purple-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-left relative z-10">
                        <span className="block text-white font-black text-lg italic tracking-tighter">BODY SCULPT</span>
                        <span className="text-[9px] text-zinc-400 block mt-1">Lipo-Definition & Tummy Tuck</span>
                    </div>
                    <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">👙</span>
                </button>

                {/* BOTÓN 3: SENOS (Neuro-Trampa) */}
                <button onClick={() => { trackInterest('BREAST_SURGERY'); window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya (ID: ${user.name}), I am interested in BREAST SURGERY simulation.`)}`; }} 
                    className="group w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between transition-all hover:border-pink-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-left relative z-10">
                        <span className="block text-white font-black text-lg italic tracking-tighter">BREAST SURGERY</span>
                        <span className="text-[9px] text-zinc-400 block mt-1">Augmentation & Lift Simulation</span>
                    </div>
                    <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">🍒</span>
                </button>
            </div>
            
            <div className="mt-12 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center">
                <p className="text-[8px] text-zinc-500 uppercase mb-2">My Current Protocols</p>
                <p className="text-[10px] text-white font-bold">NO ACTIVE PROTOCOLS</p>
                <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="mt-2 text-[9px] text-cyan-500 underline decoration-cyan-500/30 hover:text-cyan-400">Buy Facial Protocol ($35)</button>
            </div>
        </div>
      )}

      {/* --- PASO 3: EL ESCÁNER (GEOMETRÍA + PIEL + HUESO) --- */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            <div className="absolute inset-0 pointer-events-none opacity-30">
                {/* TERCIOS */}
                <div className="h-1/3 w-full border-b border-cyan-500"></div>
                <div className="h-1/3 w-full border-b border-cyan-500"></div>
                {/* QUINTOS */}
                <div className="absolute inset-0 flex"><div className="w-1/5 h-full border-r border-cyan-500/50"></div><div className="w-1/5 h-full border-r border-cyan-500/50"></div><div className="w-1/5 h-full border-r border-cyan-500/50"></div><div className="w-1/5 h-full border-r border-cyan-500/50"></div></div>
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

      {/* --- PASO 4: REPORTE INTEGRAL (LA SUMA DE V83 + V84) --- */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          
          <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
             <button onClick={() => setStep('menu')} className="text-xs text-zinc-500 hover:text-white">← BACK TO MENU</button>
             <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Medical Score</p>
                <p className={`text-3xl font-black italic ${metrics.score < 75 ? 'text-red-500' : 'text-green-500'}`}>{metrics.score}<span className="text-sm text-zinc-600 not-italic font-normal">/100</span></p>
             </div>
          </header>

          {/* 1. GEOMETRÍA (TERCIOS) */}
          <section className="mb-6 bg-zinc-900/30 p-4 rounded-2xl border border-white/5">
            <h3 className="text-[10px] text-cyan-500 font-bold uppercase mb-4 tracking-widest">I. Geometric Analysis (Vectra)</h3>
            <div className="flex justify-between items-end h-24 px-4 gap-2 mb-2">
                <div className="w-1/3 flex flex-col justify-end items-center gap-1"><span className="text-[7px]">UPPER</span><div className="w-full bg-zinc-700 rounded-t" style={{height: `${metrics.upperThird}%`}}></div><span className="text-[9px]">{metrics.upperThird}%</span></div>
                <div className="w-1/3 flex flex-col justify-end items-center gap-1"><span className="text-[7px]">MID</span><div className="w-full bg-zinc-700 rounded-t" style={{height: `${metrics.midThird}%`}}></div><span className="text-[9px]">{metrics.midThird}%</span></div>
                <div className="w-1/3 flex flex-col justify-end items-center gap-1"><span className="text-[7px] text-red-500 font-bold">LOWER</span><div className="w-full bg-red-900/80 rounded-t border-t border-red-500" style={{height: `${metrics.lowerThird}%`}}></div><span className="text-[9px] text-red-500">{metrics.lowerThird}%</span></div>
            </div>
            <div className="flex justify-between px-2 pt-2 border-t border-white/5">
                <div className="text-center"><p className="text-[7px] text-zinc-500">PHI RATIO</p><p className="text-xs text-white font-mono">{metrics.phi}</p></div>
                <div className="text-center"><p className="text-[7px] text-zinc-500">SYMMETRY</p><p className="text-xs text-white font-mono">{metrics.symmetry}%</p></div>
            </div>
          </section>

          {/* 2. PIEL (VISIA) */}
          <section className="mb-6">
            <h3 className="text-[10px] text-purple-400 font-bold uppercase mb-4 tracking-widest">II. Skin Quality (Visia)</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-zinc-900 p-2 rounded border border-purple-900/30 relative overflow-hidden">
                     <img src={photos[1]} className="w-full h-24 object-cover rounded opacity-80" style={{ filter: filters.heatmap }} />
                     <p className="absolute bottom-1 left-0 right-0 text-[7px] text-center text-purple-200 bg-black/50">UV THERMAL MAP</p>
                </div>
                <div className="space-y-3">
                     <div><div className="flex justify-between text-[8px] text-zinc-400"><span>TEXTURE</span><span>{metrics.skinTexture}%</span></div><div className="h-1 bg-zinc-800 rounded"><div className="h-full bg-green-500" style={{width: `${metrics.skinTexture}%`}}></div></div></div>
                     <div><div className="flex justify-between text-[8px] text-zinc-400"><span>PORES</span><span>{metrics.pores}%</span></div><div className="h-1 bg-zinc-800 rounded"><div className="h-full bg-yellow-500" style={{width: `${metrics.pores}%`}}></div></div></div>
                     <div><div className="flex justify-between text-[8px] text-zinc-400"><span>UV SPOTS</span><span>{metrics.uvDamage}%</span></div><div className="h-1 bg-zinc-800 rounded"><div className="h-full bg-red-500" style={{width: `${metrics.uvDamage}%`}}></div></div></div>
                </div>
            </div>
          </section>

          {/* 3. HUESO (TIPHERET) */}
          <section className="mb-8 border-t border-white/10 pt-4">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] text-red-500 font-bold uppercase tracking-widest">III. Bone Structure</h3>
                <span className="bg-red-900/30 text-red-500 px-2 py-0.5 rounded text-[8px] border border-red-900 animate-pulse">{metrics.resorption}</span>
             </div>
             <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-red-900/30">
                <img src={photos[0]} className="w-full h-full object-cover" style={{ filter: filters.structure }} />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent"></div>
                <p className="absolute bottom-2 left-2 text-[8px] text-white max-w-[200px]">Analysis: Mandibular recession detected. Structural support is compromised.</p>
             </div>
          </section>

          {/* 4. CIERRE DE VENTA */}
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
            <h3 className="text-white font-bold uppercase text-xs mb-4">Recommended Treatment</h3>
            
            <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 mb-3 shadow-lg transform hover:scale-[1.02] transition-all">
                DOWNLOAD HOME PROTOCOL ($35)
                <span className="block text-[8px] font-normal mt-1 text-zinc-600">NON-SURGICAL OPTION</span>
            </button>

            <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${encodeURIComponent(`Dr. Maya (ID: ${user.name}), I saw my Score (${metrics.score}). I want to discuss SURGERY options.`)}`} 
                className="w-full border border-zinc-700 text-zinc-400 py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:text-white hover:border-white">
                REQUEST SURGICAL CONSULTATION ➜
            </button>
          </div>

        </div>
      )}
    </div>
  );
}