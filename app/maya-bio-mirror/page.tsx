"use client";
import React, { useRef, useState, useEffect } from 'react';

// CONSTANTES
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx-kQqKTyfIx_JVqtNvpk47JAMMXWawn9O1-W9QULf0nrSK_GtJnVdeOt10eaBkzGmGDw/exec"; 

export default function TipherethV71() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]); // [0]: Frontal, [1]: Lateral, [2]: Mandibular
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Cali' });
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAge, setBioAge] = useState(0);
  const [sliderVal, setSliderVal] = useState(50); // Para el Antes/Después

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  useEffect(() => { setBioAge(Math.floor(Math.random() * (55 - 35 + 1)) + 35); }, []);

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
        // Filtro base para mejorar calidad
        ctx.filter = 'contrast(1.1) saturate(1.1)';
        ctx.drawImage(c, 0, 0);
    }
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 0.9)]);
  };

  const syncLead = async () => {
    setLoading(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: "PROPHET SIMULATION: V-Line Required", timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  const runProtocol = async (s: MediaStream) => {
    // TOMA 1: FRONTAL
    setStage("POSICIÓN FRONTAL"); await speak("Mire al frente. Iniciando escaneo de simetría.");
    for(let i=0; i<=33; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); // Foto 0: Frontal

    // TOMA 2: LATERAL
    setStage("PERFIL IZQUIERDO"); await speak("Gire su rostro lentamente a la izquierda. Analizando proyección.");
    for(let i=34; i<=66; i++) { setProg(i); await new Promise(r => setTimeout(r, 60)); }
    cap(); // Foto 1: Lateral

    // TOMA 3: MANDIBULAR
    setStage("ÁNGULO MANDIBULAR"); await speak("Levante el mentón y tense el cuello. Midiendo laxitud.");
    for(let i=67; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 60)); }
    cap(); // Foto 2: Mandibular (Base para simulación)

    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {loading && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
          <div className="w-24 h-24 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mb-6 shadow-[0_0_50px_#06b6d4]" />
          <p className="text-sm font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Generando Simulación Prophet...</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full max-w-md p-6 mt-6 animate-in fade-in zoom-in duration-700">
            <div className="border border-cyan-500/30 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                <h1 className="text-white text-4xl font-black italic mb-2 uppercase tracking-tighter">TIPHERETH</h1>
                <p className="text-[9px] text-cyan-400 uppercase tracking-[0.5em] mb-8 border-b border-white/5 pb-4">The Prophet Engine v71.0</p>
                
                <div className="space-y-4 mb-8 text-left">
                  <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white text-xs font-bold uppercase rounded-xl focus:border-cyan-500 outline-none" />
                  <input type="email" placeholder="EMAIL" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white text-xs outline-none rounded-xl focus:border-cyan-500" />
                  <input type="tel" placeholder="WHATSAPP" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white text-xs outline-none rounded-xl focus:border-cyan-500" />
                  <select onChange={e => setUser({...user, city: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 text-white text-xs font-bold rounded-xl focus:border-cyan-500 outline-none">
                        <option value="Cali">Cali (HQ)</option><option value="Popayán">Popayán</option><option value="Cartagena">Cartagena</option>
                  </select>
                </div>
                <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone || !user.email} 
                    className="w-full bg-cyan-600 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50">
                    INICIAR SIMULACIÓN 3D
                </button>
            </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/30">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
            <div className="absolute top-4 right-4 text-[8px] text-cyan-500 font-mono animate-pulse">REC: {Math.floor(prog)}%</div>
            <div className="absolute bottom-10 inset-x-0 text-center"><span className="bg-black/80 px-4 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-cyan-500/50">{stage}</span></div>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="w-full max-w-2xl bg-zinc-950 min-h-screen p-6 pb-20 animate-in slide-in-from-bottom duration-1000">
          
          <header className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
            <div><h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">TIPHERETH <span className="text-cyan-500 text-lg">V71</span></h2></div>
            <div className="text-right"><p className="text-[8px] text-zinc-600 uppercase">ID: {Math.floor(Math.random()*99999)}</p></div>
          </header>

          {/* SIMULACIÓN ANTES / DESPUÉS (LA JOYA DE LA CORONA) */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">01. Proyección de Materialización (Prophet Engine)</h3>
            </div>
            
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl group">
                {/* FONDO: FOTO ORIGINAL (ANTES) */}
                <img src={photos[0]} className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90" />
                
                {/* CAPA SUPERIOR: SIMULACIÓN (DESPUÉS) - Usamos filtros CSS para simular cirugía */}
                <div className="absolute inset-0 w-full h-full object-cover grayscale-0 contrast-110 brightness-110 saturate-110 sepia-[0.2]" 
                     style={{ 
                         clipPath: `inset(0 ${100 - sliderVal}% 0 0)`,
                         filter: 'blur(0.5px) brightness(1.15) contrast(1.05)', // Piel lisa
                         transform: 'scale(0.98)' // Efecto V-Line (al reducir ligeramente se ve mas delgado)
                     }}>
                     <img src={photos[0]} className="w-full h-full object-cover" />
                </div>
                
                {/* LINEA DIVISORIA DEL SLIDER */}
                <div className="absolute inset-y-0 w-1 bg-cyan-500 cursor-ew-resize shadow-[0_0_20px_#06b6d4]" style={{ left: `${sliderVal}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-black border-2 border-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </div>
                </div>

                {/* LABELS */}
                <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-[8px] font-black text-zinc-500 uppercase">REALIDAD ACTUAL</div>
                <div className="absolute top-4 right-4 bg-cyan-600/90 px-2 py-1 rounded text-[8px] font-black text-white uppercase shadow-lg">PROYECCIÓN TIPHERETH</div>

                {/* CONTROL SLIDER INVISIBLE PARA TOUCH */}
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
            </div>
            
            <p className="text-center text-[9px] text-zinc-500 mt-3 italic animate-pulse">Desliza para visualizar la corrección estructural</p>
          </section>

          {/* DIAGNÓSTICO DE CIRUGÍA (EL POR QUÉ DEL CAMBIO) */}
          <section className="grid grid-cols-2 gap-3 mb-10">
             <div className="col-span-2 bg-zinc-900 border-l-4 border-red-500 p-4 rounded-r-xl mb-2">
                 <h4 className="text-[10px] font-black text-red-500 uppercase mb-1">Diagnóstico de Base</h4>
                 <p className="text-[10px] text-zinc-300">Déficit óseo mandibular severo (+318cc) y caída de tejido blando. Se requiere intervención estructural.</p>
             </div>
             
             {/* FOTOS LATERALES PEQUEÑAS */}
             <div className="relative h-24 rounded-xl overflow-hidden border border-zinc-800">
                 <img src={photos[1]} className="w-full h-full object-cover grayscale contrast-150" />
                 <div className="absolute bottom-0 w-full bg-black/70 text-[6px] text-white text-center p-1 uppercase">Perfil Izquierdo</div>
             </div>
             <div className="relative h-24 rounded-xl overflow-hidden border border-zinc-800">
                 <img src={photos[2]} className="w-full h-full object-cover grayscale contrast-150" />
                 <div className="absolute bottom-0 w-full bg-black/70 text-[6px] text-white text-center p-1 uppercase">Ángulo Mandibular</div>
             </div>
          </section>

          {/* BOTÓN DE CIERRE DE VENTA */}
          <div className="sticky bottom-4 z-30">
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${user.name.toUpperCase()}. He visto mi Simulación Prophet. Quiero materializar el 'Después' que me muestra la app. Agenda mi cirugía en ${user.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(6,182,212,0.4)] hover:scale-105 transition-all border border-white/20">
                MATERIALIZAR ESTE RESULTADO Φ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}