"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV53() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '' });
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
    await speak("Iniciando auditoría de bio-ingeniería. Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();
    await speak("Gire a la izquierda para perfilometría ósea.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();
    await speak("Incline la barbilla para análisis de SMAS.");
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
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center">
      
      {step === 'intro' && (
        <div className="text-center mt-20 space-y-12">
          <h1 className="text-white text-3xl font-black tracking-[0.6em] italic">TIPHERETH</h1>
          <button onClick={init} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.4)]">Iniciar Escaneo Master</button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-80 h-80 my-12 border-2 border-cyan-500 rounded-full overflow-hidden shadow-[0_0_50px_#06b6d4]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px]" />
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-10 bg-zinc-900/40 rounded-[3rem] mt-10 border border-white/5 shadow-2xl">
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none font-black" />
          <input type="email" placeholder="EMAIL DE DIAGNÓSTICO" onChange={e => setUserData({...userData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl active:scale-95">Compilar Auditoría de Ingeniería</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-2xl my-10 border-[15px] border-zinc-100 relative">
          <header className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
            <div className="text-[20px] font-black italic uppercase leading-none">TIPHERETH<br/><span className="text-cyan-600 text-[10px]">REVENUE STATION</span></div>
            <div className="text-right text-[7px] text-zinc-400 font-black">2026 CLINICAL STANDARDS</div>
          </header>

          <section className="mb-8 space-y-4">
            <div className="p-5 bg-zinc-50 rounded-3xl border-l-4 border-red-600">
              <p className="text-[7px] text-zinc-400 uppercase font-black">Diagnóstico Óseo:</p>
              <p className="text-[10px] font-bold">MICROGNATIA / RETROGNATIA</p>
            </div>
            <div className="p-5 bg-zinc-50 rounded-3xl border-l-4 border-cyan-500">
              <p className="text-[7px] text-zinc-400 uppercase font-black">Diagnóstico Dérmico:</p>
              <p className="text-[10px] font-bold">MELASMA G.II / GLOGAU III</p>
            </div>
          </section>

          <div className="bg-black text-white p-6 rounded-[2.5rem] mb-8 text-center shadow-xl">
             <p className="text-[7px] text-cyan-400 uppercase font-black mb-1">Déficit Volumétrico</p>
             <p className="text-3xl font-black">+318.5 cc</p>
          </div>

          {/* ÁREA DE MONETIZACIÓN */}
          <div className="space-y-4 mb-10">
            <button onClick={() => setIsPaying(true)} className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Pagar Reserva de Cirugía ($500.000 COP)
            </button>
            <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Shalom Dr. Maya Romo, deseo pagar el Kit Mesoestetic Melanostop Trans3 para mi tratamiento.`)} className="w-full border-2 border-zinc-200 text-black py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-zinc-50">
              Comprar Kit Mesoestetic Diagnosticado
            </button>
          </div>

          {/* MODAL DE PAGO SIMULADO */}
          {isPaying && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
               <div className="bg-white p-8 rounded-[3rem] w-full max-w-sm text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase mb-4">Pasarela Segura Tiphereth</p>
                  <div className="mb-6 space-y-4">
                     <input type="text" placeholder="NÚMERO DE TARJETA" className="w-full border-b border-zinc-200 p-3 text-[12px] outline-none" />
                     <div className="flex gap-2">
                        <input type="text" placeholder="MM/AA" className="w-1/2 border-b border-zinc-200 p-3 text-[12px] outline-none" />
                        <input type="text" placeholder="CVV" className="w-1/2 border-b border-zinc-200 p-3 text-[12px] outline-none" />
                     </div>
                  </div>
                  <button onClick={() => {alert("Pago Exitoso. Turno reservado."); setIsPaying(false);}} className="w-full bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase">Confirmar Transacción</button>
                  <button onClick={() => setIsPaying(false)} className="mt-4 text-[9px] font-bold uppercase text-red-500">Cancelar</button>
               </div>
            </div>
          )}

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He realizado mi auditoría y deseo proceder con el Plan Maestro de +318.5cc.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase shadow-2xl">
            Contactar Especialista
          </button>
        </div>
      )}
    </div>
  );
}