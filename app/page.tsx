"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEGOCIO ---
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzRJhVFuBNbbThtJ5pSWSPvKK3M_xtuk04DvBx8Z6hg2fOs4BZ_DFCKKpx-XlHi4YV_dA/exec"; 
const HOTMART_EBOOK_URL = "const HOTMART_EBOOK_URL = "https://go.hotmart.com/G104238384O?dp=1";"; // <--- PEGUE SU LINK AQUÍ

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

  // --- FILTROS DE DIAGNÓSTICO ---
  const filters = {
    heatmap: "contrast(1.5) brightness(0.8) sepia(1) hue-rotate(-50deg) saturate(3)", 
    xray: "grayscale(1) invert(1) contrast(2) brightness(0.9)",
    after: "blur(0.5px) brightness(1.25) contrast(1.15) saturate(1.1) sepia(0.1)", 
  };

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
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 1.0)]);
    }
  };

  const syncLead = async () => {
    setLoading(true);
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
    setStage("SCANNING VOLUMETRIC..."); await speak("Iniciando escaneo volumétrico.");
    for(let i=0; i<=30; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 
    setStage("ANALYZING COLLAGEN..."); await speak("Analizando fibras de colágeno.");
    for(let i=31; i<=60; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 
    setStage("3D PROJECTION..."); await speak("Calculando proyección final.");
    for(let i=61; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); 
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center selection:bg-cyan-500">
      
      {loading && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-4 border-t-cyan-500 border-b-cyan-500 rounded-full animate-spin mb-6" />
          <p className="text-cyan-500 animate-pulse uppercase tracking-widest text-xs">Sincronizando con Servidor Médico...</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full max-w-md p-6 mt-10 animate-in fade-in duration-700">
            <div className="w-full border border-cyan-500/30 bg-zinc-900/50 p-8 rounded-[2rem] text-center shadow-xl">
                <h1 className="text-white text-3xl font-black mb-2 uppercase italic">TIPHERET</h1>
                <p className="text-[9px] text-cyan-400 uppercase tracking-[0.5em] mb-8 border-b border-white/5 pb-4">Structural Engine v78.0</p>
                
                <div className="space-y-4 mb-8">
                  <input type="text" placeholder="FULL NAME" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none" />
                  <input type="email" placeholder="EMAIL" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none" />
                  <input type="tel" placeholder="WHATSAPP" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/60 border border-white/10 p-4 text-white text-sm rounded-xl focus:border-cyan-500 outline-none" />
                </div>

                <button 
                  onClick={() => setStep('scanning')} 
                  disabled={!user.name || !user.phone || !user.email} 
                  data-i18n="screens.welcome"
                  className="w-full bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-6 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg disabled:opacity-50">
                    START STRUCTURAL SCAN
                </button>
            </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
          <div className="relative w-full max-w-lg aspect-[3/4] border-2 border-cyan-500/30 rounded-3xl overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            <div className="absolute top-4 right-4 text-[8px] text-cyan-500 animate-pulse">SCANNING: {Math.floor(prog)}%</div>
            <div className="absolute bottom-10 inset-x-0 text-center"><span className="bg-black/80 px-6 py-2 rounded-full text-[9px] text-white uppercase border border-cyan-500/50">{stage}</span></div>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="w-full max-w-2xl bg-zinc-950 p-6 pb-32">
          <header className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
            <h2 className="text-2xl font-black italic text-white uppercase">TIPHERET <span className="text-cyan-500">STRUCTURAL</span></h2>
          </header>

          <section className="mb-12">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-zinc-800 bg-black">
                <div className="absolute inset-0 w-full h-full"><img src={photos[0]} className="w-full h-full object-cover grayscale" /></div>
                <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}>
                     <img src={photos[0]} className="w-full h-full object-cover" style={projectionGeometry} />
                </div>
                <input type="range" min="0" max="100" value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
              <p className="text-[8px] text-cyan-400 font-black uppercase text-center mb-2" data-i18n="screens.heatmap">HEATMAP SCAN</p>
              <img src={photos[0]} className="h-32 w-full object-cover rounded-lg" style={{ filter: filters.heatmap }} />
            </div>
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
              <p className="text-[8px] text-red-400 font-black uppercase text-center mb-2" data-i18n="screens.xray">X-RAY ANALYSIS</p>
              <img src={photos[1]} className="h-32 w-full object-cover rounded-lg" style={{ filter: filters.xray }} />
            </div>
          </section>

          <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-cyan-500/20 mb-6 text-center shadow-2xl">
            <h3 className="text-white font-black text-sm uppercase mb-2" data-i18n="monetization.buy_ebook_title">UNBLOCK 21-DAY PROTOCOL</h3>
            <p className="text-[10px] text-zinc-400 mb-6" data-i18n="monetization.buy_ebook_desc">Download the manual to drain and redefine your face.</p>
            <button 
              onClick={() => window.open(HOTMART_EBOOK_URL)}
              data-i18n="monetization.buy_ebook"
              className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-5 rounded-2xl font-black text-xs uppercase shadow-lg">
                DOWNLOAD EBOOK ($DOWNLOAD EBOOK ($35.00))
            </button>
          </div>

          <button 
            onClick={() => {
              const msg = encodeURIComponent(`Dr. Maya Romo, mi BioAge es ${bioAge}. Solicito cita para materializar la proyección.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }}
            className="w-full bg-zinc-800 text-zinc-400 py-4 rounded-2xl font-black text-[10px] uppercase border border-zinc-700">
              SOLICITAR CITA PRESENCIAL
          </button>
        </div>
      )}
    </div>
  );
}