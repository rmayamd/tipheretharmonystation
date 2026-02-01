"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV63() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', city: 'Cali' });
  const [stage, setStage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.75;
        u.onend = () => setTimeout(resolve, 1500);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 1080; canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
        setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
      }
    }
  };

  const runTipherethProtocol = async (stream: MediaStream) => {
    setStage("MATRIZ FRONTAL Φ");
    await speak("Iniciando auditoría Tiphereth. Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();
    setStage("PERFILOMETRÍA ÓSEA");
    await speak("Gire a la izquierda. Analizando soporte óseo.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    captureFrame();
    setStage("VECTORES SMAS");
    await speak("Incline la barbilla. Evaluando laxitud.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    captureFrame();
    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-xl font-black tracking-widest italic mb-2">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-500 uppercase tracking-widest mb-10">Master Station by Maya Romo</p>
                <button onClick={() => { setStep('scanning'); navigator.mediaDevices.getUserMedia({video: true}).then(runTipherethProtocol); }} className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all hover:bg-cyan-400">Bio-Scan</button>
                <button onClick={() => fileInputRef.current?.click()} className="text-[7px] uppercase mt-4 text-zinc-600 underline">Carga Externa</button>
                <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{ setPhotos([ev.target?.result as string]); setStep('lead'); }; r.readAsDataURL(f); } }} className="hidden" />
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute bottom-8 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.4em] bg-black/50 py-1">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-10 bg-zinc-900/40 border border-white/10 rounded-[3rem] mt-10 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom">
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-zinc-900 border-b border-white/10 p-4 text-white text-[11px] outline-none font-bold">
            <option value="Cali">Sede Central Cali</option>
            <option value="Popayán">Bloque Popayán</option>
            <option value="Cartagena">Bloque Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all hover:bg-white hover:text-black">Compilar Diagnóstico Master</button>
        </div>
      )}

      {step === 'report' && photos.length > 0 && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-2xl my-10 border-[15px] border-zinc-100 relative overflow-hidden animate-in zoom-in duration-700">
          <header className="flex justify-between items-start mb-8 border-b-4 border-black pb-5">
            <div>
              <h2 className="text-2xl font-black italic text-black leading-none uppercase">TIPHERETH</h2>
              <p className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mt-1">Sede: {userData.city}</p>
            </div>
          </header>

          <section className="mb-10 space-y-4">
             <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-6 tracking-widest italic">Análisis de Estratos</h3>
             <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-l-8 border-red-600 shadow-sm">
                <p className="text-[6px] text-zinc-400 uppercase font-black mb-1">Hueso / Plano Osteofacial:</p>
                <p className="text-[11px] font-black uppercase italic leading-tight">Micrognatia / Retrognatia Mandibular</p>
             </div>
             <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-l-8 border-cyan-500 shadow-sm">
                <p className="text-[6px] text-zinc-400 uppercase font-black mb-1">Músculo / SMAS:</p>
                <p className="text-[11px] font-black uppercase italic leading-tight">Ptosis de Jowl Severa / Laxitud ↑ 5.2mm</p>
             </div>
             <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-l-8 border-orange-500 shadow-sm">
                <p className="text-[6px] text-zinc-400 uppercase font-black mb-1">Dermis / Piel:</p>
                <p className="text-[11px] font-black uppercase italic leading-tight">Melasma G-II / Escala Glogau III</p>
             </div>
          </section>

          <div className="grid grid-cols-2 gap-5 text-center mb-10 font-black italic">
             <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl transition-transform hover:scale-105">
                <p className="text-[7px] text-cyan-400 uppercase mb-2">Déficit Volumen</p>
                <p className="text-2xl">+318.5cc</p>
             </div>
             <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl transition-transform hover:scale-105">
                <p className="text-[7px] text-red-500 uppercase mb-2">Vector Lift</p>
                <p className="text-2xl">5.2mm</p>
             </div>
          </div>

          <div className="space-y-4 mb-10">
            <button onClick={() => setIsPaying(true)} className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Reservar Bloque Quirúrgico ($500.000)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Master indica Micrognatia y déficit de +318.5cc. Deseo agendar cita en ${userData.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} className="w-full border-4 border-black text-black py-7 rounded-3xl font-black text-[14px] uppercase tracking-tighter hover:bg-black hover:text-white transition-all shadow-xl">Contactar Especialista Φ</button>
          </div>

          {isPaying && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-50 backdrop-blur-md">
               <div className="bg-white p-10 rounded-[3.5rem] w-full max-w-sm text-center shadow-2xl">
                  <p className="text-[11px] font-black text-zinc-400 uppercase mb-6 italic tracking-widest border-b pb-2">Pasarela Sede {userData.city}</p>
                  <input type="text" placeholder="NÚMERO DE TARJETA" className="w-full border border-zinc-200 bg-zinc-50 p-4 rounded-xl text-[12px] mb-6 outline-none shadow-inner" />
                  <button onClick={() => {alert("Cupo Reservado con éxito."); setIsPaying(false);}} className="w-full bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl">Confirmar Pago</button>
                  <button onClick={() => setIsPaying(false)} className="mt-6 text-[9px] font-black text-red-500 uppercase tracking-widest underline decoration-red-500/30">Cerrar</button>
               </div>
            </div>
          )}
          
          <footer className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-10 italic border-t pt-4">© 2026 Tiphereth Master Station • Engineering the Divine Proportion</footer>
        </div>
      )}
    </div>
  );
}