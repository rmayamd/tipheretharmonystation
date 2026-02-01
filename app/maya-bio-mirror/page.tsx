"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV58() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', city: 'Cali' });
  const [stage, setStage] = useState('');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.8;
        u.onend = () => setTimeout(resolve, 800);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 1080; canvas.height = 1440;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    setStage("MAPEO BIOMÉTRICO");
    await speak("Iniciando su Auditoría de Bio-Ingeniería gratuita. Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();

    setStage("ESTRUCTURA ÓSEA");
    await speak("Gire a la izquierda. Analizando soporte mandibular y proyección.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();

    setStage("DINÁMICA EPIDÉRMICA");
    await speak("Incline la barbilla. Evaluando vectores de laxitud y SMAS.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();

    await speak("Análisis completo. Generando su pasaporte de inmortalidad.");
    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-mono p-4 flex flex-col items-center">
      
      {step === 'intro' && (
        <div className="text-center mt-20 space-y-10 animate-in fade-in duration-1000">
          <div className="space-y-2">
            <h1 className="text-white text-4xl font-black tracking-widest italic">TIPHERETH</h1>
            <p className="text-[9px] text-cyan-500 tracking-[0.4em] uppercase">FREE BIO-ENGINEERING ACCESS</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 space-y-4">
             <p className="text-[11px] leading-relaxed text-zinc-300 font-bold italic">
               "Descubre el déficit volumétrico de tu rostro y recibe tu plan maestro de intervención sin costo hoy mismo."
             </p>
             <p className="text-[8px] text-cyan-400 uppercase font-black">Escaneo de Grado Clínico 100% Gratuito</p>
          </div>
          <button onClick={() => { setStep('scanning'); navigator.mediaDevices.getUserMedia({video: true}).then(runProtocol); }} 
            className="bg-white text-black px-16 py-6 rounded-full font-black text-[12px] uppercase shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            Obtener Mi Diagnóstico Gratis
          </button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-80 h-80 my-12 border-2 border-cyan-500 rounded-full overflow-hidden shadow-[0_0_60px_#06b6d4]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px]" />
          <div className="absolute bottom-10 inset-x-0 text-center text-[9px] font-black text-cyan-400 tracking-widest uppercase">{stage}</div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-5 p-10 bg-zinc-900/60 border border-white/10 rounded-[3.5rem] mt-5 shadow-2xl backdrop-blur-xl">
          <h3 className="text-[11px] font-black text-white uppercase text-center border-b border-white/5 pb-4">Personalizar Reporte</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-bold" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none">
            <option value="Cali">Consultorio Cali</option>
            <option value="Popayán">Sede Popayán</option>
            <option value="Cartagena">Sede Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-lg">Descargar Resultados Gratuitos</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-2xl my-10 border-[15px] border-zinc-100 relative">
          <header className="flex justify-between items-center mb-8 border-b-2 border-zinc-200 pb-4">
            <h2 className="text-2xl font-black italic text-black">TIPHERETH</h2>
            <div className="text-right text-[7px] font-black text-zinc-400 uppercase">AUDIT RESULT: FREE PASS</div>
          </header>

          <section className="space-y-6 mb-10">
             <div className="p-6 bg-red-50 rounded-3xl border-l-8 border-red-600">
                <p className="text-[7px] text-red-600 font-black uppercase mb-1">Déficit Crítico Detectado:</p>
                <p className="text-[12px] font-black leading-tight uppercase italic">Micrognatia y Retrognatia con Jowl persistente.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 text-white p-6 rounded-[2.5rem] text-center">
                   <p className="text-[7px] text-cyan-400 font-black uppercase mb-1">Volumen Necesario</p>
                   <p className="text-2xl font-black italic">+318.5 cc</p>
                </div>
                <div className="bg-zinc-950 text-white p-6 rounded-[2.5rem] text-center">
                   <p className="text-[7px] text-red-500 font-black uppercase mb-1">Grado de Envejecimiento</p>
                   <p className="text-2xl font-black italic underline">GLOGAU III</p>
                </div>
             </div>
          </section>

          <div className="bg-zinc-100 p-8 rounded-[3.5rem] mb-10 border border-zinc-200">
             <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Plan Maestro sugerido por Dr. Maya Romo:</p>
             <p className="text-[12px] font-bold italic mb-6 leading-tight">Osteotomía Mandibular V-Line + Protocolo Mesoestetic de Renovación Celular.</p>
             <div className="p-4 bg-white rounded-2xl text-[9px] font-bold text-center border border-zinc-200 text-cyan-600 uppercase">
                Válido para la semana de materialización en {userData.city}
             </div>
          </div>

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He realizado mi auditoría gratuita. Diagnóstico: Glogau III y déficit de +318cc. Deseo agendar valoración presencial en ${userData.city}.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} 
            className="w-full bg-black text-white py-7 rounded-3xl font-black text-[13px] uppercase tracking-tighter hover:bg-cyan-600 transition-all">
            Materializar Mi Inmortalidad Φ
          </button>
          
          <p className="text-center text-[7px] text-zinc-400 uppercase font-black mt-8">Tiphereth by Maya Romo • 2026</p>
        </div>
      )}
    </div>
  );
}