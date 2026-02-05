"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL HOSPITAL DIGITAL TIPHERET ---
const WS_BUSINESS = "573117936211";
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxHesi-oREB42asByNKgwk-BL65L17mThp5yrnx-4cXGrz7xbL5H0gAGbVQGOQaXQRKlA/exec"; 

export default function TipherethGlobal() {
  // --- ESTADOS DEL SISTEMA ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('login'); 
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', country: 'USA' }); 
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  
  // ESTADOS DEL REPORTE (PROFUNDIDAD CLÍNICA)
  const [activeTab, setActiveTab] = useState('TRUTH'); // TRUTH, KLIPPAH, YESOD, ASCENSION
  const [visualMode, setVisualMode] = useState('REALITY'); // Filtros del visor

  // ESTADO DEL SLIDER (ANTES/DESPUÉS)
  const [compareVal, setCompareVal] = useState(50);

  // MÉTRICAS COMPLETAS (CIENCIA + MÍSTICA)
  const [metrics, setMetrics] = useState({
    // General
    score: 0, bioAge: 0,
    // Klippah (Piel/Cáscara - Visia)
    inflammation: 0, texture: 0, pores: 0, uvDamage: 0,
    // Yesod (Estructura/Fundamento - Vectra/Tipheret)
    upper: 33, mid: 33, lower: 33, symmetry: 0,
    // Tipheret (Diagnóstico Central)
    resorption: "NONE", potential: 0
  });

  // FILTROS DE ALTA TECNOLOGÍA (VISIA/VECTRA SIMULATOR)
  const filters = {
    REALITY: "none", 
    INFLAMED: "contrast(1.5) sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.8)", // Visia Red
    DAMAGE: "contrast(1.5) grayscale(1) invert(0.1) brightness(0.7)", // Visia UV
    STRUCTURE: "grayscale(1) invert(1) contrast(2) brightness(0.7)", // X-Ray
    DIVINE: "grayscale(1) contrast(1.2) brightness(1.1)" // Ideal Perfection
  };

  // --- PERSISTENCIA DE USUARIO ---
  useEffect(() => {
    const saved = localStorage.getItem('tipheret_user_v93');
    if (saved) { setUser(JSON.parse(saved)); setStep('menu'); }
  }, []);

  const register = async () => {
    setLoading(true);
    localStorage.setItem('tipheret_user_v93', JSON.stringify(user));
    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, action: "INITIATION_V93", date: new Date().toISOString() })
        });
    } catch (e) {}
    setTimeout(() => { setLoading(false); setStep('menu'); }, 1500);
  };

  // --- MOTOR DE DIAGNÓSTICO (ALGORITMO GENERATIVO) ---
  useEffect(() => {
    if (step === 'report') {
        const isSevere = Math.random() < 0.6; // 60% probabilidad de que necesite ayuda
        const ageBase = Math.floor(Math.random() * (55 - 35) + 35);
        
        setMetrics({
            score: isSevere ? 68 : 85,
            bioAge: isSevere ? ageBase + 8 : ageBase - 2,
            // Datos de Piel (Klippah)
            inflammation: isSevere ? 75 : 30, // Alto es malo
            texture: isSevere ? 55 : 88,      // Bajo es malo
            pores: isSevere ? 45 : 80,
            uvDamage: isSevere ? 60 : 20,
            // Datos de Estructura (Yesod)
            upper: 33.1, mid: 34.5, lower: isSevere ? 32.4 : 33.0,
            symmetry: isSevere ? 82 : 96,
            resorption: isSevere ? "SEVERE (Grade III)" : "MILD (Grade I)",
            potential: 98 // Todos tienen potencial divino
        });
    }
  }, [step]);

  // --- LÓGICA DEL ESCÁNER ---
  const startScan = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(s => { if(videoRef.current) videoRef.current.srcObject = s; setStep('scanning'); runSequence(s); });
  };

  const cap = () => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx && videoRef.current) {
        ctx.translate(1080, 0); ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
        setPhotos(p => [...p, c.toDataURL('image/jpeg', 0.8)]);
    }
  };

  const runSequence = async (s: MediaStream) => {
    // Simulamos las máquinas reales
    setStage("CALIBRATING BIOLOGICAL FIELD..."); await new Promise(r => setTimeout(r, 800)); setProg(25); 
    setStage("MAPPING INFLAMMATION (VISIA)..."); await new Promise(r => setTimeout(r, 800)); setProg(50); cap();
    setStage("ANALYZING STRUCTURE (VECTRA)..."); await new Promise(r => setTimeout(r, 800)); setProg(75);
    setStage("REVEALING DIVINE POTENTIAL..."); await new Promise(r => setTimeout(r, 800)); setProg(100); cap();
    s.getTracks().forEach(t => t.stop()); setStep('report');
  };

  // --- COMPONENTES UI (Barra de Progreso Médica) ---
  const MetricBar = ({ label, val, reverse = false }: any) => {
    let color = "bg-green-500";
    if (!reverse) { if (val < 50) color = "bg-red-500"; else if (val < 80) color = "bg-amber-500"; }
    else { if (val > 60) color = "bg-red-500"; else if (val > 30) color = "bg-amber-500"; else color = "bg-green-500"; }
    return (
        <div className="mb-3">
            <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-400 mb-1">
                <span>{label}</span><span>{val}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${color} transition-all duration-1000`} style={{width: `${val}%`}}></div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans flex flex-col items-center selection:bg-amber-500 overflow-x-hidden">
      
      {/* LOADING MÍSTICO */}
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 border-t-2 border-b-2 border-amber-500 rounded-full animate-spin mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]"></div>
                <p className="text-amber-500 text-xs tracking-[0.4em] uppercase font-bold animate-pulse">OPENING PORTAL</p>
            </div>
        </div>
      )}

      {/* 1. LOGIN (EL UMBRAL) */}
      {step === 'login' && (
        <div className="w-full max-w-md p-8 mt-20 text-center animate-in fade-in duration-1000">
            <h1 className="text-5xl font-thin text-white mb-2 tracking-tighter">TIPHERET</h1>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] mb-12">Science • Mysticism • Beauty</p>
            
            <div className="space-y-6 bg-zinc-900/30 p-8 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                <p className="text-xs text-zinc-300 font-light italic">"We must know who seeks transformation."</p>
                <input onChange={e => setUser({...user, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-black/50 border-b border-zinc-700 p-3 text-center text-white outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-700" />
                <input onChange={e => setUser({...user, email: e.target.value})} placeholder="EMAIL ADDRESS" className="w-full bg-black/50 border-b border-zinc-700 p-3 text-center text-white outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-700" />
                <button onClick={register} disabled={!user.name} className="w-full bg-white text-black font-bold py-4 rounded-lg mt-4 hover:bg-amber-400 transition-all tracking-[0.2em] text-[10px] uppercase shadow-[0_0_20px_rgba(255,255,255,0.15)]">BEGIN INITIATION</button>
            </div>
        </div>
      )}

      {/* 2. MENU (EL SENDERO) */}
      {step === 'menu' && (
        <div className="w-full max-w-md p-6 mt-8 animate-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
                <div><p className="text-[9px] text-amber-500 uppercase tracking-widest mb-1">INITIATE</p><h2 className="text-2xl text-white font-light">{user.name}</h2></div>
                <div className="text-right"><p className="text-[9px] text-zinc-500">LEVEL</p><p className="text-xs text-white">Seeker</p></div>
            </div>

            <div className="space-y-6">
                <button onClick={startScan} className="group relative w-full h-64 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500 transition-all duration-500 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1605642914107-df08e4726484?auto=format&fit=crop&q=80&w=500" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-left">
                        <span className="text-amber-500 text-[9px] font-bold tracking-[0.2em] block mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> THE MIRROR OF TRUTH</span>
                        <span className="text-4xl text-white font-thin block tracking-tighter italic">REVEAL YOURSELF</span>
                        <p className="text-[9px] text-zinc-400 mt-2 max-w-[220px]">Full diagnostic: Inflammation (Klippah), Structure (Yesod) & Potential (Tipheret).</p>
                    </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Body`)} className="h-32 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col justify-center items-center hover:bg-zinc-800 transition-all"><span className="text-3xl mb-2 opacity-60">🔮</span><span className="text-[9px] font-bold text-zinc-300 tracking-widest">BODY ALCHEMY</span></button>
                     <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Breast`)} className="h-32 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col justify-center items-center hover:bg-zinc-800 transition-all"><span className="text-3xl mb-2 opacity-60">✨</span><span className="text-[9px] font-bold text-zinc-300 tracking-widest">FEMININE FORM</span></button>
                </div>
            </div>
        </div>
      )}

      {/* 3. SCANNER (LA REVELACIÓN) */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale" />
            <div className="z-20 w-full px-10 text-center">
                <div className="w-full h-px bg-zinc-800 mb-6"><div className="h-full bg-amber-500 transition-all duration-300 shadow-[0_0_20px_orange]" style={{width: `${prog}%`}}></div></div>
                <p className="text-amber-500 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">{stage}</p>
            </div>
            {/* GRID SAGRADO OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                <div className="border border-amber-500/50 w-[80%] h-[60%] rounded-[50%]"></div>
                <div className="absolute w-[1px] h-full bg-amber-500/30"></div>
                <div className="absolute h-[1px] w-full bg-amber-500/30 top-1/3"></div>
                <div className="absolute h-[1px] w-full bg-amber-500/30 top-2/3"></div>
            </div>
        </div>
      )}

      {/* 4. REPORTE CATEDRAL (TODO INCLUIDO) */}
      {step === 'report' && (
        <div className="w-full max-w-md bg-black min-h-screen pb-20 animate-in fade-in duration-1000">
            
            {/* NAVEGACIÓN DE NIVELES (TABS) */}
            <div className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/10 flex justify-between px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide">
                {['TRUTH', 'KLIPPAH', 'YESOD', 'ASCENSION'].map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); 
                        // Auto-cambiar filtro visual según tab
                        if(tab === 'TRUTH') setVisualMode('REALITY');
                        if(tab === 'KLIPPAH') setVisualMode('INFLAMED');
                        if(tab === 'YESOD') setVisualMode('STRUCTURE');
                        if(tab === 'ASCENSION') setVisualMode('DIVINE');
                    }} className={`text-[9px] font-bold px-4 py-3 rounded-full border transition-all whitespace-nowrap ${activeTab === tab ? 'bg-amber-900/20 border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-white'}`}>
                        {tab === 'TRUTH' ? 'SUMMARY' : tab === 'KLIPPAH' ? 'PURIFY (SKIN)' : tab === 'YESOD' ? 'STRUCTURE' : 'RESULTS'}
                    </button>
                ))}
            </div>

            {/* --- VISOR CENTRAL INTERACTIVO (EL JUGUETE) --- */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden group border-b border-white/10">
                <img src={photos[0]} className="w-full h-full object-cover transition-all duration-700" style={{ filter: filters[visualMode as keyof typeof filters] }} />
                
                {/* LEYENDA FLOTANTE */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-white/10 shadow-xl">
                    <p className="text-[8px] text-zinc-400 uppercase tracking-widest">VISUAL MODE</p>
                    <p className="text-[10px] text-white font-bold uppercase flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${visualMode === 'INFLAMED' ? 'bg-red-500' : 'bg-green-500'}`}></span> {visualMode}</p>
                </div>

                {/* BOTONES DENTRO DEL VISOR */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                    {['REALITY', 'INFLAMED', 'DAMAGE', 'STRUCTURE', 'DIVINE'].map(mode => (
                        <button key={mode} onClick={() => setVisualMode(mode)} className={`w-10 h-10 rounded-full border flex items-center justify-center text-[7px] font-bold transition-all shadow-lg ${visualMode === mode ? 'bg-white text-black border-white scale-110' : 'bg-black/60 text-zinc-400 border-zinc-700 backdrop-blur'}`}>
                            {mode.substring(0,3)}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENIDO DE LAS PESTAÑAS (DETALLE MÉDICO + MÍSTICO) --- */}
            
            {/* TAB 1: TRUTH (RESUMEN) */}
            {activeTab === 'TRUTH' && (
                <div className="p-6 animate-in slide-in-from-right">
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-thin text-white mb-2 tracking-tighter">{metrics.score} <span className="text-sm text-zinc-500 font-normal">/ 100</span></h2>
                        <p className="text-[9px] text-amber-500 uppercase tracking-widest">CURRENT VIBRATION SCORE</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                            <p className="text-[8px] text-zinc-500 uppercase tracking-wider">CHRONOLOGICAL</p>
                            <p className="text-2xl font-bold text-white">40</p>
                            <p className="text-[8px] text-zinc-600">YEARS</p>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-red-900/10 animate-pulse"></div>
                            <p className="text-[8px] text-red-400 uppercase relative z-10 tracking-wider">BIOLOGICAL</p>
                            <p className="text-2xl font-bold text-red-500 relative z-10">{metrics.bioAge}</p>
                            <p className="text-[8px] text-red-900 relative z-10">ACCELERATED AGING</p>
                        </div>
                    </div>
                    
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-400 text-center italic leading-relaxed">
                            "Your structure is divine, but inflammation (Klippah) obscures your true form. We must clear the path to reveal your Tipheret."
                        </p>
                    </div>
                </div>
            )}

            {/* TAB 2: KLIPPAH (PIEL / VISIA) */}
            {activeTab === 'KLIPPAH' && (
                <div className="p-6 animate-in slide-in-from-right">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">THE SHELL (SKIN)</h3>
                        <span className="text-[9px] bg-red-900/30 text-red-400 px-3 py-1 rounded-full border border-red-500/30">HIGH INFLAMMATION</span>
                    </div>
                    
                    <div className="space-y-5 mb-8">
                        <MetricBar label="Inflammation (Redness)" val={metrics.inflammation} reverse={true} />
                        <MetricBar label="Surface Texture" val={metrics.texture} />
                        <MetricBar label="Pore Density" val={metrics.pores} reverse={true} />
                        <MetricBar label="Deep UV Damage" val={metrics.uvDamage} reverse={true} />
                    </div>

                    <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-xl border border-red-900/50 shadow-lg relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-20 h-20 bg-red-500/20 blur-3xl rounded-full"></div>
                        <p className="text-[9px] text-red-400 font-bold uppercase mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> PHASE I: PURIFICATION</p>
                        <p className="text-[10px] text-zinc-300 mb-6 leading-relaxed">
                            You cannot build on inflamed ground. Use the <b>De-Inflammation Protocol</b> to remove the "Klippah" (Shell) and prepare for reconstruction.
                        </p>
                        <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full bg-white text-black py-4 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-400 transition-all flex justify-between px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <span>DOWNLOAD PURIFICATION GUIDE</span>
                            <span>$35</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 3: YESOD (BONE / VECTRA) */}
            {activeTab === 'YESOD' && (
                <div className="p-6 animate-in slide-in-from-right">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">THE FOUNDATION</h3>
                        <span className="text-[9px] bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">{metrics.resorption}</span>
                    </div>

                    {/* GRÁFICA DE TERCIOS */}
                    <div className="flex justify-between items-end h-32 gap-3 mb-8 px-2">
                        <div className="w-1/3 bg-zinc-800/50 rounded-t relative h-full flex flex-col justify-end overflow-hidden"><div className="w-full bg-zinc-600 rounded-t transition-all duration-1000" style={{height: `${metrics.upper}%`}}></div><span className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-white font-bold tracking-widest">UPPER</span></div>
                        <div className="w-1/3 bg-zinc-800/50 rounded-t relative h-full flex flex-col justify-end overflow-hidden"><div className="w-full bg-zinc-600 rounded-t transition-all duration-1000" style={{height: `${metrics.mid}%`}}></div><span className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-white font-bold tracking-widest">MID</span></div>
                        <div className="w-1/3 bg-zinc-800/50 rounded-t relative h-full flex flex-col justify-end overflow-hidden border-t-2 border-red-500"><div className="w-full bg-red-600 rounded-t transition-all duration-1000" style={{height: `${metrics.lower}%`}}></div><span className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-white font-bold tracking-widest">LOWER</span></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-xl border border-amber-900/50 shadow-lg">
                        <p className="text-[9px] text-amber-500 font-bold uppercase mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> PHASE II: ARCHITECTURE</p>
                        <p className="text-[10px] text-zinc-300 mb-6 leading-relaxed">
                            Your foundation (Mandible/Chin) is receding. This causes the skin to collapse. We must restore the <b>Structural Columns</b> to support the face.
                        </p>
                        <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=SurgeryRequest`} className="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all flex justify-between px-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <span>BOOK STRUCTURAL SURGERY</span>
                            <span>CONSULT</span>
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 4: ASCENSION (BEFORE & AFTER / PLAN) */}
            {activeTab === 'ASCENSION' && (
                <div className="p-6 animate-in slide-in-from-right">
                    <h2 className="text-center text-white font-thin text-xl mb-8 tracking-widest">THE HALL OF MIRACLES</h2>
                    
                    {/* TESTIMONIO 1: PIEL (LIBRO) */}
                    <div className="mb-10">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3 text-center">RESULTS OF PURIFICATION (PROTOCOL)</p>
                        <div className="relative w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 group shadow-2xl">
                            {/* IMAGEN ANTES (INFLAMADA) */}
                            <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover" style={{filter: filters.INFLAMED}} />
                            {/* IMAGEN DESPUÉS (LIMPIA) */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ width: `${compareVal}%` }}>
                                <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full max-w-none object-cover" style={{filter: filters.DIVINE}} />
                                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_white]"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"><span className="text-[8px] text-black font-bold">↔</span></div>
                            </div>
                            <input type="range" min="0" max="100" value={compareVal} onChange={(e) => setCompareVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
                            {/* ETIQUETAS */}
                            <span className="absolute top-2 left-2 bg-red-900/80 text-white text-[7px] font-bold px-2 py-1 rounded backdrop-blur">BEFORE</span>
                            <span className="absolute top-2 right-2 bg-green-900/80 text-white text-[7px] font-bold px-2 py-1 rounded backdrop-blur">AFTER (14 DAYS)</span>
                        </div>
                        <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full mt-3 bg-white text-black py-3 rounded font-bold text-[9px] uppercase tracking-widest hover:bg-amber-400 shadow-lg">ACHIEVE THIS WITH PROTOCOL ($35)</button>
                    </div>

                    {/* TESTIMONIO 2: HUESO (CIRUGÍA) */}
                    <div className="mb-8">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3 text-center">RESULTS OF ASCENSION (SURGERY)</p>
                        <div className="relative w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden border border-amber-900/50 group shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1588510064527-2bbc48842a6b?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
                             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="text-center p-4">
                                    <p className="text-white text-lg font-light italic mb-2">"My jawline is now defined. My face is lifted."</p>
                                    <p className="text-[9px] text-amber-500 uppercase tracking-widest">STRUCTURAL PATIENT</p>
                                </div>
                             </div>
                        </div>
                        <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=SurgeryRequest`} className="w-full mt-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white py-3 rounded font-bold text-[9px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">REQUEST SURGICAL CONSULT</button>
                    </div>

                </div>
            )}

        </div>
      )}
    </div>
  );
}