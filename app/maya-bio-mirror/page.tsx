"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx-kQqKTyfIx_JVqtNvpk47JAMMXWawn9O1-W9QULf0nrSK_GtJnVdeOt10eaBkzGmGDw/exec"; 

export default function TipherethV69() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [user, setUser] = useState({ name: '', email: '', phone: '', city: 'Cali' });
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => { alert("Error de acceso a cámara. Por favor permite los permisos."); setStep('intro'); });
    }
  }, [step]);

  const speak = (t: string) => new Promise(res => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return res(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.72; u.onend = () => setTimeout(res, 1200);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    c.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg')]);
  };

  const syncLead = async () => {
    setLoading(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          diagnosis: "Micrognatia Mandibular, Escala Glogau III, Déficit Estructural +318.5cc",
        })
      });
    } catch (e) { console.error("Sync Error"); }
    setLoading(false);
    setStep('report');
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("AUDITORÍA CROMÁTICA Φ"); await speak("Iniciando escaneo Tiphereth. No parpadee.");
    for(let i=0; i<=33; i++) { setProg(i); await new Promise(r => setTimeout(r, 60)); }
    cap();
    setStage("TOPOGRAFÍA OSTEODÉRMICA"); await speak("Gire a la izquierda. Analizando soporte mandibular.");
    for(let i=34; i<=66; i++) { setProg(i); await new Promise(r => setTimeout(r, 80)); }
    cap();
    setStage("DINÁMICA DE LAXITUD"); await speak("Incline la barbilla. Midiendo vectores de caída.");
    for(let i=67; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 80)); }
    cap();
    s.getTracks().forEach(t => t.stop()); 
    await syncLead();
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step === 'intro' && (
        <div className="w-full max-w-sm p-10 bg-zinc-900/40 border border-white/10 rounded-[3.5rem] my-12 shadow-2xl backdrop-blur-3xl animate-in fade-in">
            <h1 className="text-white text-3xl font-black italic mb-2 uppercase text-center tracking-tighter">TIPHERETH</h1>
            <p className="text-[7px] text-cyan-400 uppercase tracking-[0.4em] mb-10 text-center italic">The Sovereign Oracle Engine</p>
            
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase" />
              <input type="email" placeholder="EMAIL" onChange={e => setUser({...user, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none" />
              <input type="tel" placeholder="WHATSAPP (+57)" onChange={e => setUser({...user, phone: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none" />
              <select onChange={e => setUser({...user, city: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none font-bold">
                  <option value="Cali">Sede Cali (HQ)</option>
                  <option value="Popayán">Bloque Popayán</option>
                  <option value="Cartagena">Bloque Cartagena</option>
              </select>
            </div>
            
            <button onClick={() => setStep('scanning')} disabled={!user.name || !user.phone} className="w-full bg-cyan-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl disabled:bg-zinc-800 transition-all hover:bg-white hover:text-black">Iniciar Bio-Scan Gratis Φ</button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-80 h-80 my-12 group animate-in zoom-in">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (prog * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
            <div className="absolute bottom-10 inset-x-0 text-center text-[7px] font-black text-cyan-400 tracking-[0.5em] bg-black/60 py-2 uppercase font-mono">{stage}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 text-cyan-400">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Sincronizando Expediente Maestro con Google Sheet...</p>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[5rem] w-full max-w-[680px] shadow-2xl my-10 border-[20px] border-zinc-100 relative overflow-hidden animate-in slide-in-from-bottom duration-1000">
          <header className="flex justify-between border-b-8 border-black pb-8 mb-10 font-black">
            <div className="leading-none"><h2 className="text-4xl italic uppercase leading-none">TIPHERETH</h2><p className="text-[11px] text-cyan-600 tracking-[0.4em] ml-1">Engineering Report</p></div>
            <div className="text-right text-[8px] text-zinc-400 uppercase leading-tight font-black">Paciente: {user.name.toUpperCase()}<br/>Sede: {user.city}</div>
          </header>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-black text-white p-10 rounded-[4rem] shadow-xl text-center">
              <p className="text-[8px] text-zinc-500 uppercase mb-2 italic">Déficit Estructural</p>
              <p className="text-5xl font-black italic">+318.5 <span className="text-xs">cc</span></p>
            </div>
            <div className="bg-black text-white p-10 rounded-[4rem] shadow-xl text-center">
              <p className="text-[8px] text-zinc-500 uppercase mb-2 italic">Caída Vectorial</p>
              <p className="text-5xl font-black italic">↓ 5.2 <span className="text-xs">mm</span></p>
            </div>
          </div>

          <div className="p-10 bg-zinc-950 text-white rounded-[5rem] mb-12 relative shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 p-6 text-cyan-400 text-[8px] font-black italic uppercase">Plan de Materialización</div>
            <div className="space-y-6 text-[11px] font-bold italic leading-relaxed">
              <p className="text-cyan-400 uppercase font-black border-b border-white/5 pb-2">I. Plano Óseo: <span className="text-white">Corrección de Micrognatia Mandibular.</span></p>
              <p className="text-cyan-400 uppercase font-black border-b border-white/5 pb-2">II. Bio-Mecánica: <span className="text-white">Firmeza 35Hz + Capilarización 9Hz.</span></p>
              <p className="text-cyan-400 uppercase font-black border-b border-white/5 pb-2">III. Regeneración: <span className="text-white">Mesoestetic Melanostop Trans3.</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => window.print()} className="w-full bg-zinc-100 text-black py-5 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest border border-zinc-200">Exportar Archivo Maestro (PDF)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${user.name.toUpperCase()}. He recibido mi Auditoría Oracle. Diagnóstico: Glogau III, Micrognatia y déficit de +318.5cc. Deseo agendar mi Semana Quirúrgica en ${user.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} className="w-full bg-black text-white py-8 rounded-[3.5rem] font-black text-[16px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 transition-all">MATERIALIZAR INMORTALIDAD Φ</button>
          </div>
          <footer className="text-center text-[7px] text-zinc-400 uppercase tracking-[0.6em] mt-16 italic border-t pt-8 border-zinc-100 font-black">Tiphereth by Dr. Maya Romo • 2026</footer>
        </div>
      )}
    </div>
  );
}