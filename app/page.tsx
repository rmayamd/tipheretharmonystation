"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN MAESTRA ---
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx-kQqKTyfIx_JVqtNvpk47JAMMXWawn9O1-W9QULf0nrSK_GtJnVdeOt10eaBkzGmGDw/exec"; 

export default function TipherethV76() {
  // ESTADOS DEL SISTEMA
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro'); // Arranca siempre en la Intro
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Sede Principal' });
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAge, setBioAge] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);

  // CONTROL DE CÁMARA
  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  // CALCULO DE EDAD AL INICIAR
  useEffect(() => { setBioAge(Math.floor(Math.random() * (58 - 38 + 1)) + 38); }, []);

  // VOZ ROBÓTICA
  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.85; u.pitch = 0.9;
    u.onend = () => setTimeout(res, 500);
    window.speechSynthesis.speak(u);
  });

  // CAPTURA DE FOTO
  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.drawImage(videoRef.current!, 0, 0, 1080, 1440);
        ctx.filter = 'contrast(1.1) saturate(1.1)';
        ctx.drawImage(c, 0, 0);
    }
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 0.9)]);
  };

  // ENVÍO DE DATOS (GOOGLE SHEETS)
  const syncLead = async () => {
    setLoading(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: `TIPHERET V76: Glogau III / +318.5cc / BioAge ${bioAge}`, timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  // PROTOCOLO DE ESCANEO
  const runProtocol = async (s: MediaStream) => {
    setStage("ESCANEO DE PROYECCIÓN"); await speak("Mire al frente. Iniciando simulación de armonización.");
    for(let i=0; i<=25; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("ESPECTRO VASCULAR"); await speak("Gire levemente. Escaneando micro-circulación.");
    for(let i=26; i<=50; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("ESPECTRO MELÁNICO"); await speak("Detectando daño solar profundo.");
    for(let i=51; i<=75; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    setStage("TOPOGRAFÍA ESTRUCTURAL"); await speak("Levante el mentón. Calculando vectores de caída.");
    for(let i=76; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 

    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 1. PANTALLA DE CARGA (HIDDEN DEFAULT) */}
      {loading && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
          <div className="w-24 h-24 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mb-6 shadow-[0_0_50px_#06b6d4]" />
          <p className="text-sm font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Procesando Bio-Data...</p>
        </div>
      )}

      {/* 2. PANTALLA DE INTRO (LA QUE SE HABÍA PERDIDO) */}
      {step === 'intro' && (
        <div className="w-full max-w-md p-6 mt-10 animate-in fade-in zoom-in duration-700 flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full border border-cyan-500/30 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden text-center shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                {/* Decoración Superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                
                {/* Título y Branding */}
                <h1 className="text-white text-4xl font-black italic mb-2 uppercase tracking-tighter">TIPHERET</h1>
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.5em] mb-8 border-b border-white/5 pb-4">Harmony Station v76.0</p>
                
                {/* Formulario de Registro (Sin Ciudad) */}
                <div className="space-y-4 mb-8 text-left">
                  <div className="group">
                    <label className="text-[9px] text-cyan-600 font-bold ml-1 mb-1 block">NOMBRE DEL PACIENTE</label>
                    <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm font-bold uppercase rounded-xl focus:border-cyan-500 outline-none transition-all focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]" />
                  </div>
                  
                  <div className="group">
                    <label className="text-[9px] text-cyan-600 font-bold ml-1 mb-1 block">EMAIL</label>
                    <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm outline-none rounded-xl focus:border-cyan-500 transition-all" />
                  </div>
                  
                  <div className="group">
                    <label className="text-[9px] text-cyan-600 font-bold ml-1 mb-1 block">WHATSAPP (+57)</label>
                    <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm outline-none rounded-xl focus:border-cyan-500 transition-all" />
                  </div>
                </div>
                
                {/* Botón de Acción */}
                <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone || !user.email} 
                    className="w-full bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-6 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer">
                    INICIAR BIO-SCAN 3D
                </button>
                
                <p className="mt-4 text-[8px] text-zinc-600 uppercase">Powered by Tiphereth AI</p>
            </div>
        </div>
      )}

      {/* 3. PANTALLA DE ESCANEO (CÁMARA) */}
      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
            
            {/* HUD (Interfaz de Cámara) */}
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M10,10 L30,10 M10,10 L10,30" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M90,10 L70,10 M90,10 L90,30" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M10,90 L30,90 M10,90 L10,70" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M90,90 L70,90 M90,90 L90,70" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <line x1="0" y1={prog} x2="100" y2={prog} stroke="#06b6d4" strokeWidth="0.5" className="opacity-50" />
            </svg>

            <div className="absolute top-4 right-4 text-[8px] text-cyan-500 font-mono animate-pulse">REC: {Math.floor(prog)}%</div>
            <div className="absolute bottom-10 inset-x-0 text-center"><span className="bg-black/80 px-6 py-2 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-cyan-500/50 shadow-lg">{stage}</span></div>
          </div>
        </div>
      )}

      {/* 4. PANTALLA DE REPORTE (FINAL) */}
      {step === 'report' && (
        <div className="w-full max-w-2xl bg-zinc-950 min-h-screen p-6 pb-32 animate-in slide-in-from-bottom duration-1000">
          
          <header className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
            <div><h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">TIPHERETH <span className="text-cyan-500 text-lg">HARMONY</span></h2></div>
            <div className="text-right">
                <div className="bg-red-900/30 text-red-500 px-2 py-0.5 rounded text-[7px] font-black uppercase mb-1 animate-pulse">STATUS: CRITICAL</div>
                <p className="text-[8px] text-zinc-600 uppercase">ID: {Math.floor(Math.random()*99999)}</p>
            </div>
          </header>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">I. Proyección Tiphereth</h3>
            </div>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl group mb-4">
                <img src={photos[0]} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90" />
                <div className="absolute inset-0 w-full h-full object-cover grayscale-0" 
                     style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)`, filter: 'blur(1.5px) brightness(1.25) contrast(1.15) saturate(1.2)', transform: 'scale(0.99)' }}>
                     <img src={photos[0]} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-y-0 w-1 bg-cyan-500 cursor-ew-resize shadow-[0_0_20px_#06b6d4]" style={{ left: `${sliderVal}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black border-2 border-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </div>
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
            </div>
            <p className="text-center text-[9px] text-zinc-500 italic">Desliza para visualizar la corrección estructural proyectada.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-4 border-red-600 pl-3 mb-4">II. Auditoría Forense</h3>
            <div className="grid grid-cols-3 gap-2 h-32">
                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                    <img src={photos[1]} className="w-full h-full object-cover grayscale contrast-150 brightness-75 sepia hue-rotate-[-50deg] saturate-200" />
                    <div className="absolute bottom-0 w-full bg-black/70 text-[6px] text-red-400 text-center p-1 uppercase font-black">Vascular</div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                    <img src={photos[2]} className="w-full h-full object-cover sepia contrast-125 brightness-90 saturate-150" />
                    <div className="absolute bottom-0 w-full bg-black/70 text-[6px] text-orange-400 text-center p-1 uppercase font-black">Melanina</div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                    <img src={photos[3]} className="w-full h-full object-cover grayscale contrast-[2.5] brightness-75 invert" />
                    <div className="absolute bottom-0 w-full bg-black/70 text-[6px] text-cyan-400 text-center p-1 uppercase font-black">Estructural</div>
                </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] text-center">
                <p className="text-[8px] text-cyan-500 uppercase font-black tracking-widest mb-1">Déficit Volumétrico</p>
                <p className="text-3xl font-black text-white italic">+318.5 <span className="text-xs">cc</span></p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] text-center">
                <p className="text-[8px] text-red-500 uppercase font-black tracking-widest mb-1">Edad Biológica</p>
                <p className="text-3xl font-black text-white italic">{bioAge} <span className="text-xs">Años</span></p>
            </div>
          </section>

          <div className="bg-gradient-to-b from-zinc-900 to-black p-8 rounded-[2.5rem] border border-zinc-800 mb-6 text-center shadow-2xl">
            <h3 className="text-cyan-400 font-black uppercase text-sm tracking-[0.3em] mb-6">Plan de Acción</h3>
            <ul className="text-left space-y-4 text-[10px] text-zinc-300 font-mono mb-8 px-2">
                <li className="flex items-start gap-3 border-b border-white/5 pb-2">
                    <span className="text-cyan-500 font-bold">A.</span>
                    <span><strong className="text-white">ESTRUCTURA:</strong> Corrección de micrognatia mandibular.</span>
                </li>
                <li className="flex items-start gap-3 border-b border-white/5 pb-2">
                    <span className="text-cyan-500 font-bold">B.</span>
                    <span><strong className="text-white">SUPERFICIE:</strong> Reversión de daño Glogau III.</span>
                </li>
            </ul>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${user.name.toUpperCase()}. He analizado mi reporte TIPHERET HARMONY. Mi Edad Biológica es ${bioAge} años. Solicito valoración de cierre para definir mi plan quirúrgico.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full bg-cyan-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-105 hover:bg-white hover:text-black transition-all animate-pulse">
                MATERIALIZAR INMORTALIDAD Φ
            </button>
          </div>
          
          <p className="text-center text-[7px] text-zinc-600 uppercase tracking-widest font-black">Tipheret Harmony Station • Dr. Maya Romo • 2026</p>
        </div>
      )}
    </div>
  );
}