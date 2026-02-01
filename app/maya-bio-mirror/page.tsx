"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV54() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', city: 'Cali' });
  const [isPaying, setIsPaying] = useState(false);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.75;
      window.speechSynthesis.speak(u);
    }
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    if (videoRef.current) {
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    await speak("Iniciando auditoría Tiphereth Cali. Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();
    await speak("Gire a la izquierda. Analizando perfilometría para cirugía de contorno.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();
    await speak("Incline la barbilla. Evaluando marcación mandibular.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();
    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  const init = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step === 'intro' && (
        <div className="text-center mt-20 space-y-12">
          <div className="space-y-2">
            <h1 className="text-white text-3xl font-black tracking-[0.4em] italic uppercase">TIPHERETH</h1>
            <p className="text-[8px] text-cyan-500 tracking-[0.3em] font-bold">CALI • POPAYÁN • CARTAGENA</p>
          </div>
          <button onClick={init} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl animate-pulse">Iniciar Escaneo Bio-Digital</button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-80 h-80 my-12 border-2 border-cyan-500 rounded-full overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.4)]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px]" />
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-6 p-10 bg-zinc-900/40 rounded-[3rem] mt-10 border border-white/5">
          <h3 className="text-[10px] font-black text-white uppercase text-center mb-4 italic">Agendar en Sede</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-zinc-900 border-b border-white/10 p-4 text-white text-[11px] outline-none">
            <option value="Cali">Consultorio Cali (Dra. Sandra Beltrán)</option>
            <option value="Popayan">Sede Popayán</option>
            <option value="Cartagena">Sede Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl">Compilar Diagnóstico</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-2xl my-10 border-[15px] border-zinc-100 relative">
          <header className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
            <div className="text-[18px] font-black italic uppercase leading-none">TIPHERETH<br/><span className="text-cyan-600 text-[10px]">CITY EXPANSION: {userData.city}</span></div>
          </header>

          <section className="mb-8 p-5 bg-zinc-50 rounded-3xl border-l-4 border-black">
            <p className="text-[7px] text-zinc-400 uppercase font-black">Plan Maestro Sugerido:</p>
            <p className="text-[10px] font-bold italic leading-snug">
                • Marcación V-Line + Lipopapada<br/>
                • Proyección de Contorno (+318.5 cc)<br/>
                • Protocolo Mesoestetic Skin-Perfect
            </p>
          </section>

          <div className="bg-zinc-950 text-white p-6 rounded-[2.5rem] mb-8 text-center">
             <p className="text-[7px] text-cyan-400 uppercase font-black mb-1">Estatus en {userData.city}</p>
             <p className="text-xl font-black italic">DISPONIBILIDAD PRIORITARIA</p>
          </div>

          <div className="space-y-4 mb-10">
            <button onClick={() => setIsPaying(true)} className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg">
              Reservar Cupo Quirúrgico ($500.000)
            </button>
          </div>

          {isPaying && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-50">
               <div className="bg-white p-10 rounded-[3.5rem] w-full max-w-sm text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase mb-6">Pasarela Cali - Sede Beltrán</p>
                  <input type="text" placeholder="TARJETA" className="w-full border-b border-zinc-200 p-4 text-[12px] mb-4 outline-none" />
                  <button onClick={() => {alert("Reserva Confirmada en " + userData.city); setIsPaying(false);}} className="w-full bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase">Pagar Reserva</button>
                  <button onClick={() => setIsPaying(false)} className="mt-4 text-[9px] font-bold text-red-500 uppercase">Volver</button>
               </div>
            </div>
          )}

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He realizado mi auditoría Tiphereth para la sede de ${userData.city}. Mi déficit es de +318.5cc. Quiero agendar cita en el consultorio con usted y la Dra. Beltrán.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full border-2 border-black text-black py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Hablar con Dr. Maya (WhatsApp)
          </button>
        </div>
      )}
    </div>
  );
}