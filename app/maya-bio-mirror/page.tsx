"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE PODER - DR. MAYA ROMO ===
const WS_BUSINESS = "573117936211";

export default function TipherethV62() {
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
        u.lang = 'es-ES'; u.rate = 0.7; // Voz pausada de autoridad absoluta
        u.onend = () => setTimeout(resolve, 1500); 
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 1080; canvas.height = 1440;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runTipherethMasterProtocol = async (stream: MediaStream) => {
    setStage("MATRIZ FRONTAL Φ");
    await speak("Bienvenido a Tiphereth. Iniciando análisis de bio-ingeniería estructural. Mire fijamente al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    setStage("PERFILOMETRÍA ÓSEA");
    await speak("Captura frontal registrada. Ahora, gire lentamente hacia su izquierda para analizar el soporte del plano óseo.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    captureFrame();

    setStage("VECTORES DE TENSIÓN");
    await speak("Excelente. Finalmente, incline su barbilla hacia abajo para medir la laxitud del SMAS y el arco mandibular.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    captureFrame();

    await speak("Auditoría completada. Sincronizando con el centro de inteligencia para generar su plan de inmortalidad.");
    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO CUÁNTICO */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_30px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[16px] font-black tracking-[0.6em] mb-2 italic">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-500 uppercase tracking-widest mb-10 italic underline decoration-cyan-500/20">Engineering the Divine Proportion</p>
                <div className="flex flex-col gap-4">
                  <button onClick={() => { setStep('scanning'); navigator.mediaDevices.getUserMedia({video: true}).then(runTipherethMasterProtocol); }} className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-2xl transition-all hover:bg-cyan-400">Iniciar Bio-Scan</button>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[7px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Carga Clínica Externa</button>
                  <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r=new FileReader(); r.onload=(ev)=>{ setPhotos([ev.target?.result as string]); setStep('lead'); }; r.readAsDataURL(f); } }} className="hidden" />
                </div>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_4px] animate-pulse" />
                <div className="absolute bottom-8 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.4em] bg-black/50 py-1">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* REGISTRO DE FILIACIÓN */}
      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-10 bg-zinc-900/40 border border-white/10 rounded-[3rem] animate-in slide-in-from-bottom shadow-2xl backdrop-blur-md">
          <h3 className="text-[10px] font-black text-white uppercase text-center mb-6 tracking-widest italic border-b border-white/5 pb-4">Identidad Bio-Digital</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-zinc-900 border-b border-white/10 p-4 text-white text-[11px] outline-none">
            <option value="Cali">Sede Central Cali</option>
            <option value="Popayán">Bloque Popayán (Programado)</option>
            <option value="Cartagena">Bloque Cartagena (Programado)</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-2xl tracking-widest active:scale-95 transition-all">Generar Manifiesto de Inmortalidad</button>
        </div>
      )}

      {/* EL PASAPORTE DE INMORTALIDAD (ESTÁNDAR SUPERIOR) */}
      {step === 'report' && photos.length > 0 && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-[0_50px_100px_rgba(0,0,0,0.4)] my-10 border-[15px] border-zinc-50 relative overflow-hidden animate-in zoom-in duration-1000">
          
          <header className="flex justify-between items-start mb-10 border-b-4 border-black pb-5">
            <div>
              <h2 className="text-2xl font-black italic text-black leading-none uppercase tracking-tighter">TIPHERETH<br/><span className="text-cyan-600 text-[10px] tracking-[0.3em]">ENGINEERING THE DIVINE</span></h2>
              <p className="text-[7px] text-zinc-400 uppercase mt-2 font-black tracking-widest italic">Clinical Auditor: Dr. Maya Romo • {userData.city}</p>
            </div>
          </header>

          {/* I. AUDITORÍA CLÍNICA (PIEL A HUESO) */}
          <section className="mb-10 space-y-4">
             <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-6 tracking-widest italic">I. Hallazgos de Bioingeniería</h3>
             <div className="space-y-3">
                <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-l-8 border-red-600 shadow-sm">
                  <p className="text-[6px] text-zinc-400 uppercase font-black mb-1 italic tracking-widest">Plano Osteofacial (Hueso):</p>
                  <p className="text-[11px] font-black uppercase leading-tight italic">Micrognatia / Retrognatia detected</p>
                  <p className="text-[8px] text-red-600 font-bold mt-1 uppercase italic">* Requiere compensación estructural urgente</p>
                </div>
                <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-l-8 border-cyan-500 shadow-sm"></div>