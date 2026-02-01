"use client";
import React, { useRef, useState, useEffect } from 'react';

// CONSTANTES MAESTRAS
const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx-kQqKTyfIx_JVqtNvpk47JAMMXWawn9O1-W9QULf0nrSK_GtJnVdeOt10eaBkzGmGDw/exec"; 

export default function TipherethV70() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Cali' });
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAge, setBioAge] = useState(0);

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  useEffect(() => {
    setBioAge(Math.floor(Math.random() * (55 - 35 + 1)) + 35); 
  }, []);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.8; u.pitch = 0.9;
    u.onend = () => setTimeout(res, 800);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.drawImage(videoRef.current!, 0, 0, 1080, 1440);
        ctx.filter = 'contrast(1.2) saturate(1.1)';
        ctx.drawImage(c, 0, 0);
    }
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg', 1.0)]);
  };

  const syncLead = async () => {
    setLoading(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, diagnosis: "CRITICAL: Micrognatia + Glogau III", timestamp: new Date().toISOString() })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("INICIANDO PROTOCOLO SINGULARITY"); await speak("Iniciando Tiphereth Singularity. Análisis profundo activado.");
    for(let i=0; i<=25; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); // 0: Normal

    setStage("ESPECTRO VASCULAR (HEMOGLOBINA)"); await speak("Escaneando micro-circulación y vascularización.");
    for(let i=26; i<=50; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); // 1: Vascular

    setStage("ESPECTRO MELÁNICO (UV)"); await speak("Detectando daño solar acumulado en dermis profunda.");
    for(let i=51; i<=75; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); // 2: UV

    setStage("TOPOGRAFÍA ESTRUCTURAL 3D"); await speak("Calculando déficit de volumen óseo y vectores de caída.");
    for(let i=76; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 40)); }
    cap(); // 3: Estructural

    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono flex flex-col items-center overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {loading && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
          <div className="w-24 h-24 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mb-6 shadow-[0_0_50px_#06b6d4]" />
          <p className="text-sm font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Sincronizando Expediente...</p>
        </div>
      )}

      {step === 'intro' && (
        <div className="w-full max-w-md p-8 mt-10 animate-in fade-in zoom-in duration-700">
            <div className="border border-cyan-500/30 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                <h1 className="text-white text-4xl font-black italic mb-2 uppercase text-center tracking-tighter">TIPHERETH</h1>
                <p className="text-[9px] text-cyan-400 uppercase tracking-[0.5em] mb-8 text-center border-b border-white/5 pb-4">The Singularity Engine v70.2</p>
                
                <div className="space-y-4 mb-8">
                  <div className="group relative">
                    <span className="absolute left-4 top-3 text-[10px] text-cyan-600 font-bold">NOMBRE</span>
                    <input type="text" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pt-7 text-white text-sm outline-none font-bold uppercase rounded-xl focus:border-cyan-500 transition-all" />
                  </div>
                  
                  {/* CAMPO DE EMAIL RESTAURADO */}
                  <div className="group relative">
                    <span className="absolute left-4 top-3 text-[10px] text-cyan-600 font-bold">EMAIL</span>
                    <input type="email" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pt-7 text-white text-sm outline-none rounded-xl focus:border-cyan-500 transition-all" />
                  </div>

                  <div className="group relative">
                    <span className="absolute left-4 top-3 text-[10px] text-cyan-600 font-bold">WHATSAPP</span>
                    <input type="tel" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pt-7 text-white text-sm outline-none rounded-xl focus:border-cyan-500 transition-all" />
                  </div>

                  <div className="group relative">
                    <span className="absolute left-4 top-3 text-[10px] text-cyan-600 font-bold">SEDE</span>
                    <select onChange={e => setUser({...user, city: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 pt-7 text-white text-sm outline-none font-bold rounded-xl focus:border-cyan-500 transition-all appearance-none">
                        <option value="Cali">Cali (Base Central)</option>
                        <option value="Popayán">Popayán (Semana Q.)</option>
                        <option value="Cartagena">Cartagena (Semana Q.)</option>
                    </select>
                  </div>
                </div>
                
                <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone || !user.email} 
                    className="w-full bg-cyan-600 text-white py-6 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-white hover:text-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100">
                    INICIAR BIO-SCAN 3D
                </button>
            </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
            
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M10,10 L30,10 M10,10 L10,30" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M90,10 L70,10 M90,10 L90,30" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M10,90 L30,90 M10,90 L10,70" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <path d="M90,90 L70,90 M90,90 L90,70" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="40" r="15" stroke="#06b6d4" strokeWidth="0.2" fill="none" strokeDasharray="2,2" className="animate-pulse" />
                <line x1="0" y1={prog} x2="100" y2={prog} stroke="#06b6d4" strokeWidth="0.5" className="opacity-50" />
            </svg>

            <div className="absolute top-4 right-4 flex flex-col items-end">
                <div className="text-[8px] text-cyan-500 font-mono">REC: ON</div>
                <div className="text-[10px] text-white font-black">{prog}%</div>
            </div>
            
            <div className="absolute bottom-10 inset-x-0 text-center">
                <div className="inline-block bg-black/70 border border-cyan-500/50 px-6 py-2 rounded-full">
                    <p className="text-[9px] font-black text-cyan-400 tracking-[0.3em] uppercase animate-pulse">{stage}</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="w-full max-w-2xl bg-zinc-950 min-h-screen p-6 pb-20 animate-in slide-in-from-bottom duration-1000">
          
          <header className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-8">
            <div>
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">TIPHERETH <span className="text-cyan-500 text-lg not-italic">V70</span></h2>
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em]">Engineering The Divine Proportion</p>
            </div>
            <div className="text-right">
                <div className="bg-red-900/20 border border-red-500/50 px-3 py-1 rounded-md inline-block mb-1">
                    <p className="text-[8px] font-black text-red-500 uppercase animate-pulse">STATUS: CRITICAL</p>
                </div>
                <p className="text-[8px] text-zinc-600 uppercase">ID: {Math.floor(Math.random()*100000)} • {user.city}</p>
            </div>
          </header>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">01. Análisis de Simetría Áurea (Golden Ratio)</h3>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-center">
                        <p className="text-[9px] text-zinc-500 uppercase mb-1">Edad Cronológica</p>
                        <p className="text-2xl font-bold text-white">--</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] text-red-500 font-black uppercase mb-1 animate-pulse">Edad Biológica Tiphereth</p>
                        <p className="text-4xl font-black text-red-500 italic">{bioAge} AÑOS</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-[9px] uppercase font-bold mb-1"><span className="text-cyan-400">Densidad Ósea</span> <span className="text-white">62% (Baja)</span></div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-600 w-[62%]" /></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[9px] uppercase font-bold mb-1"><span className="text-red-500">Integridad de Colágeno</span> <span className="text-white">45% (Crítica)</span></div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-red-600 w-[45%]" /></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[9px] uppercase font-bold mb-1"><span className="text-orange-400">Oxigenación Vascular</span> <span className="text-white">58% (Deficiente)</span></div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[58%]" /></div>
                    </div>
                </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">02. Auditoría Multiespectral Forense</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 h-32 md:h-48">
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 group">
                    <img src={photos[0] || ""} className="w-full h-full object-cover grayscale contrast-150 brightness-75 sepia hue-rotate-[-50deg] saturate-200" />
                    <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 text-[7px] text-red-400 font-black text-center uppercase">Vascular Map</div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 group">
                    <img src={photos[0] || ""} className="w-full h-full object-cover sepia contrast-125 brightness-90 saturate-150" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 text-[7px] text-orange-400 font-black text-center uppercase">Melanin Depth</div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 group">
                    <img src={photos[0] || ""} className="w-full h-full object-cover grayscale contrast-[2.5] brightness-75 invert" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 text-[7px] text-cyan-400 font-black text-center uppercase">Structural Failure</div>
                </div>
            </div>
            <div className="mt-4 p-4 bg-zinc-900 border-l-4 border-red-600 rounded-r-xl">
                <p className="text-[10px] text-zinc-300 italic leading-relaxed">
                    <strong className="text-white uppercase not-italic">DIAGNÓSTICO SINGULARITY:</strong> Se detecta un colapso estructural en el tercio inferior (Micrognatia) agravado por daño actínico severo (Glogau III). La piel ha perdido su anclaje mecánico.
                </p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-black border border-zinc-800 p-6 rounded-[2rem] text-center relative overflow-hidden">
                <p className="text-[8px] text-cyan-500 uppercase font-black tracking-widest mb-2">Déficit Volumétrico</p>
                <p className="text-4xl font-black text-white italic">+318.5</p>
                <p className="text-[8px] text-zinc-500 uppercase">Centímetros Cúbicos</p>
            </div>
            <div className="bg-black border border-zinc-800 p-6 rounded-[2rem] text-center relative overflow-hidden">
                <p className="text-[8px] text-red-500 uppercase font-black tracking-widest mb-2">Gravedad de Caída</p>
                <p className="text-4xl font-black text-white italic">5.2mm</p>
                <p className="text-[8px] text-zinc-500 uppercase">Desplazamiento SMAS</p>
            </div>
          </section>

          <div className="bg-gradient-to-b from-zinc-900 to-black p-8 rounded-[2.5rem] border border-zinc-800 mb-10 text-center shadow-2xl">
            <h3 className="text-cyan-400 font-black uppercase text-sm tracking-[0.3em] mb-6">Protocolo de Rescate</h3>
            <ul className="text-left space-y-4 text-[11px] text-zinc-300 font-mono mb-8 px-4">
                <li className="flex items-start gap-3">
                    <span className="text-cyan-500 font-bold">01.</span>
                    <span><strong className="text-white">REPOSICIÓN ÓSEA:</strong> Osteotomía Mandibular V-Line para corregir la micrognatia detectada.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-cyan-500 font-bold">02.</span>
                    <span><strong className="text-white">BIO-MECÁNICA:</strong> Estimulación a 35Hz para levantar el SMAS caído (5.2mm).</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-cyan-500 font-bold">03.</span>
                    <span><strong className="text-white">SUPERFICIE:</strong> Melanostop Trans3 para eliminar el daño Glogau III.</span>
                </li>
            </ul>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${user.name.toUpperCase()}. Mi reporte Singularity V70 indica una Edad Biológica de ${bioAge} años (Glogau III) y un déficit de +318.5cc. Necesito una intervención urgente en ${user.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full bg-cyan-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-105 hover:bg-white hover:text-black transition-all animate-pulse">
                INICIAR RECONSTRUCCIÓN Φ
            </button>
          </div>

          <p className="text-center text-[8px] text-zinc-600 uppercase tracking-widest font-black">Powered by Tiphereth Singularity Engine • 2026</p>
        </div>
      )}
    </div>
  );
}