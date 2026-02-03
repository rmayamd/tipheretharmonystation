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
  const [loading, setLoading] = useState(false);
  const [bioAge, setBioAge] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);

  // --- RECUPERANDO LA ESTÉTICA TIPHERET (Filtros Agresivos) ---
  const filters = {
    heatmap: "contrast(2.0) brightness(0.6) sepia(1) hue-rotate(-50deg) saturate(4)", // Más dramático
    xray: "grayscale(1) invert(1) contrast(3) brightness(0.8)", // Más clínico
    after: "blur(0px) brightness(1.1) contrast(1.1) saturate(1.2)", // Piel perfecta pero realista
  };

  const projectionGeometry = {
    transform: 'scale(1.02) perspective(500px) rotateX(2deg)', // Proyección sutil hacia adelante
    filter: filters.after
  };

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  // BioEdad calculada para generar impacto (siempre mayor a 35 para vender)
  useEffect(() => { setBioAge(Math.floor(Math.random() * (58 - 38 + 1)) + 38); }, []);

  // --- VOZ CON AUTORIDAD CLÍNICA ---
  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    // Intentamos forzar una voz más grave si está disponible, o velocidad más lenta y precisa
    u.lang = 'es-US'; // Español neutro o latino
    u.rate = 0.9; // Un poco más lento para ser más analítico
    u.pitch = 0.8; // Tono más bajo = más autoridad
    u.onend = () => setTimeout(res, 600);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx && videoRef.current) {
      // Efecto espejo para que el usuario se vea natural
      ctx.translate(1080, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 0.9)]);
    }
  };

  const syncLead = async () => {
    setLoading(true);
    // Simulamos un tiempo de "procesamiento en servidor médico" para generar ansiedad/expectativa
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: `TIPHERET V78: BioAge ${bioAge}`, timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("INITIALIZING OPTICAL SENSORS..."); 
    await speak("Iniciando escáner estructural Tipheret.");
    
    // Fase 1: Volumetría
    setStage("MAPPING VOLUMETRIC DATA...");
    for(let i=0; i<=40; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    cap(); // Foto 1 (Base)
    
    // Fase 2: Análisis profundo (Dramatismo)
    setStage("DETECTING COLLAGEN FRACTURES..."); 
    await speak("Detectando micro fracturas de colágeno y retención de líquidos.");
    for(let i=41; i<=80; i++) { setProg(i); await new Promise(r => setTimeout(r, 50)); }
    cap(); // Foto 2 (Para filtros)
    
    // Fase 3: Proyección
    setStage("CALCULATING IDEAL GEOMETRY..."); 
    await speak("Generando proyección de geometría ideal.");
    for(let i=81; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 30)); }
    
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500 overflow-x-hidden">
      
      {/* PANTALLA DE CARGA "MÉDICA" */}
      {loading && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
          <p className="text-cyan-500 animate-pulse text-xs tracking-[0.3em] uppercase">Processing Biological Data...</p>
        </div>
      )}

      {/* INTRODUCCIÓN: SOBRIA Y ELEGANTE */}
      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-12 animate-in fade-in duration-1000 flex flex-col items-center">
            <div className="mb-12 text-center">
                <h1 className="text-white text-4xl font-black mb-2 tracking-tighter italic">TIPHERET</h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-2 opacity-50"></div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-[0.6em]">Structural Diagnosis</p>
            </div>
            
            <div className="w-full space-y-5 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 ml-2 uppercase tracking-wider">Patient Name</label>
                <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-zinc-700" placeholder="NOMBRE COMPLETO" />
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] text-zinc-500 ml-2 uppercase tracking-wider">Contact Email</label>
                 <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-zinc-700" placeholder="CORREO ELECTRÓNICO" />
              </div>
              <div className="space-y-1">
                 <label className="text-[9px] text-zinc-500 ml-2 uppercase tracking-wider">Mobile Number</label>
                 <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/80 border border-zinc-800 p-4 text-white text-sm rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-zinc-700" placeholder="WHATSAPP (+XX...)" />
              </div>

              <button 
                onClick={() => setStep('scanning')} 
                disabled={!user.name || !user.phone || !user.email} 
                className="w-full mt-4 bg-white text-black py-5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  INICIAR ESCANEO
              </button>
            </div>
            <p className="mt-8 text-[8px] text-zinc-600 text-center max-w-xs leading-relaxed">
              *Al continuar, acepta el procesamiento biométrico de sus datos para fines de diagnóstico estético según el protocolo Tipheret.
            </p>
        </div>
      )}

      {/* ESCANEO: CIBERNÉTICO */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
          {/* Grid de fondo */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative w-full max-w-lg aspect-[3/4] border border-cyan-900/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,200,255,0.1)] z-10">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            
            {/* Interfaz sobrepuesta (HUD) */}
            <div className="absolute inset-0 border-[1px] border-cyan-500/20 m-4 rounded-2xl"></div>
            <div className="absolute top-8 left-0 right-0 flex justify-center">
                 <div className="bg-black/60 backdrop-blur text-cyan-400 text-[10px] px-4 py-1 rounded-full border border-cyan-500/30 uppercase tracking-widest animate-pulse">
                    {stage}
                 </div>
            </div>
            
            {/* Barra de progreso central */}
            <div className="absolute bottom-12 inset-x-8">
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all duration-300 ease-out shadow-[0_0_10px_cyan]" style={{ width: `${prog}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[8px] text-cyan-600 font-mono">
                    <span>BIO-SENSORS: ACTIVE</span>
                    <span>{Math.floor(prog)}% COMPLETE</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTE FINAL: EL MOMENTO DE LA VENTA */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-black min-h-screen p-6 animate-in slide-in-from-bottom duration-1000">
          <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
            <div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Diagnosis Report</p>
                <h2 className="text-2xl font-black text-white italic">TIPHERET <span className="text-cyan-500">PRO</span></h2>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Bio-Age</p>
                <p className="text-3xl font-mono text-white">{bioAge} <span className="text-sm text-zinc-600">YRS</span></p>
            </div>
          </header>

          {/* SIMULACIÓN PRINCIPAL: ANTES / DESPUÉS */}
          <section className="mb-10 space-y-2">
            <p className="text-[9px] text-cyan-500 uppercase tracking-[0.2em] text-center mb-4">Proyección Estructural (Desliza)</p>
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl">
                {/* Imagen ORIGINAL (Grisácea/Realidad Cruda) */}
                <div className="absolute inset-0 w-full h-full">
                    <img src={photos[0]} className="w-full h-full object-cover filter grayscale contrast-125 brightness-90" />
                    <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-[8px] text-white">ACTUAL</div>
                </div>
                
                {/* Imagen PROYECTADA (Color/Perfección) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-cyan-500 shadow-[0_0_20px_cyan]" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     <img src={photos[0]} className="w-full h-full object-cover" style={projectionGeometry} />
                     <div className="absolute top-4 right-4 bg-cyan-900/80 px-3 py-1 rounded text-[8px] text-cyan-100 border border-cyan-500/50">PROYECCIÓN</div>
                </div>
                
                {/* Slider invisible */}
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
                
                {/* Línea guía del slider */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-500 pointer-events-none z-20 shadow-[0_0_15px_cyan]" style={{ left: `${sliderVal}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black/50 backdrop-blur border border-cyan-500 rounded-full flex items-center justify-center">
                        <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                    </div>
                </div>
            </div>
          </section>

          {/* EVIDENCIA DEL PROBLEMA (HEATMAPS) */}
          <section className="grid grid-cols-2 gap-3 mb-12">
            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5">
              <p className="text-[7px] text-cyan-400 font-bold uppercase text-center mb-2 tracking-wider">RETENCIÓN DE LÍQUIDOS</p>
              <img src={photos[0]} className="h-28 w-full object-cover rounded-lg opacity-80" style={{ filter: filters.heatmap }} />
            </div>
            <div className="bg-zinc-900/50 p-2 rounded-xl border border-white/5">
              <p className="text-[7px] text-red-400 font-bold uppercase text-center mb-2 tracking-wider">FRACTURA DÉRMICA</p>
              <img src={photos[1]} className="h-28 w-full object-cover rounded-lg opacity-80" style={{ filter: filters.xray }} />
            </div>
          </section>

          {/* ZONA DE CONVERSIÓN (VENTA) */}
          <div className="bg-gradient-to-b from-zinc-900 to-black p-8 rounded-[2rem] border border-zinc-800 mb-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
            <h3 className="text-white font-black text-xl italic uppercase mb-2">PROTOCOLO DE DESBLOQUEO</h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed max-w-sm mx-auto">
                Su análisis muestra una bio-edad de <strong className="text-white">{bioAge} años</strong>. 
                Para revertir la estructura a la proyección ideal, es necesario drenar el líquido retenido y reposicionar el tejido.
            </p>
            
            {/* EL BOTÓN QUE COBRA 35 DÓLARES */}
            <button 
              onClick={() => window.open(HOTMART_EBOOK_URL)}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] border border-white/10">
                DESCARGAR PROTOCOLO ($35 USD)
            </button>
            <p className="text-[8px] text-zinc-600 mt-3">Acceso inmediato • PDF Clínico • Guía paso a paso</p>
          </div>

          <button 
            onClick={() => {
              const msg = encodeURIComponent(`Dr. Maya Romo, mi BioAge es ${bioAge}. Solicito cita para materializar la proyección.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }}
            className="w-full py-4 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
              Prefiero una cita presencial
          </button>
        </div>
      )}
    </div>
  );
}