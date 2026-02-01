"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'report';

export default function TipherethV41() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '' });

  const runProtocol = async (stream: MediaStream) => {
    // Simulamos 3 capturas: Rostro, Torso Superior, Perfil Corporal
    for(let i=0; i<=100; i++) {
      if(i === 20 || i === 50 || i === 80) {
        const canvas = document.createElement('canvas');
        canvas.width = 1080; canvas.height = 1440;
        canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
        setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
      }
      await new Promise(r => setTimeout(r, 50));
    }
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 2000));
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step === 'intro' && (
        <div className="mt-20 text-center">
          <h1 className="text-white text-xl font-black mb-4 tracking-[0.4em]">TIPHERETH STATION</h1>
          <p className="text-[8px] text-cyan-500 uppercase tracking-widest mb-12 italic">Human Engineering & Body Contouring</p>
          <button onClick={initSystem} className="bg-white text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95">Iniciar Escaneo Integral</button>
        </div>
      )}

      {step === 'scanning' && (
        <div className="relative w-80 h-80 my-10 border-2 border-cyan-500 rounded-full overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.3)]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent animate-pulse" />
        </div>
      )}

      {step === 'lead' && (
        <div className="mt-20 space-y-6 w-full max-w-xs">
          <h2 className="text-white text-[10px] text-center font-black uppercase tracking-widest">Compilar Bio-Expediente</h2>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-zinc-800 p-4 text-white outline-none focus:border-cyan-500" />
          <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-zinc-800 p-4 text-white outline-none focus:border-cyan-500" />
          <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Ver Manifiesto de Armonía Total</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-8 rounded-[3rem] w-full max-w-[420px] shadow-2xl mb-20">
          <header className="border-b-2 border-black pb-4 mb-8 flex justify-between items-center">
            <span className="font-black italic text-sm uppercase">Tiphereth Matrix</span>
            <div className="text-[7px] font-bold text-zinc-400 text-right uppercase">Body & Face Engineering<br/>v41.0 Total Vision</div>
          </header>

          {/* SECCIÓN 1: FACIAL & SKIN (NIVEL VISIA+) */}
          <p className="text-[9px] font-black uppercase mb-4 tracking-tighter border-l-4 border-cyan-500 pl-2">I. Ingeniería de Piel y Bio-Estímulo</p>
          <div className="grid grid-cols-4 gap-1 mb-6">
            <div className="text-center"><img src={photos[0]} className="rounded contrast-200 invert" /><p className="text-[5px] mt-1">Porosidad</p></div>
            <div className="text-center"><img src={photos[0]} className="rounded brightness-50 contrast-150" /><p className="text-[5px] mt-1">Vascular</p></div>
            <div className="text-center"><img src={photos[0]} className="rounded grayscale" /><p className="text-[5px] mt-1">Arrugas</p></div>
            <div className="text-center"><img src={photos[0]} className="rounded sepia contrast-125" /><p className="text-[5px] mt-1">UV Damage</p></div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-2xl mb-8 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black">ESTADO SIMETRÍA:</span>
              <span className="text-[8px] text-emerald-600 font-bold uppercase italic">Perfecto Φ (Ideal)</span>
            </div>
            <div className="text-[9px] text-zinc-600 italic leading-tight">
               "Paciente con estructura ósea ideal. Se recomienda mantenimiento preventivo con <strong>Toxina Botulínica</strong> y <strong>Bio-estimuladores de Colágeno</strong> para preservar la elasticidad SMAS."
            </div>
          </div>

          {/* SECCIÓN 2: CORPORAL (NIVEL CRISALIX) */}
          <p className="text-[9px] font-black uppercase mb-4 tracking-tighter border-l-4 border-emerald-500 pl-2">II. Escultura Corporal Proyectiva</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-100 p-4 rounded-3xl text-center border border-zinc-200 shadow-inner">
               <p className="text-[7px] font-black uppercase text-zinc-400 mb-2">Simulación Mamaria</p>
               <div className="h-16 flex items-center justify-center text-zinc-300">
                  <span className="text-[8px] italic tracking-tighter">[Análisis de Volumen Proyectado]</span>
               </div>
               <p className="text-[8px] font-black text-emerald-600 mt-2">SUGERIDO: MASTOPEXIA Φ</p>
            </div>
            <div className="bg-zinc-100 p-4 rounded-3xl text-center border border-zinc-200 shadow-inner">
               <p className="text-[7px] font-black uppercase text-zinc-400 mb-2">Contorno Abdominal</p>
               <div className="h-16 flex items-center justify-center text-zinc-300">
                  <span className="text-[8px] italic tracking-tighter">[Lipo-Escultura HD 360]</span>
               </div>
               <p className="text-[8px] font-black text-emerald-600 mt-2">SUGERIDO: LIPECTOMÍA</p>
            </div>
          </div>

          {/* PLAN MAESTRO UNIFICADO */}
          <div className="bg-black text-white p-6 rounded-[2.5rem] mb-8 shadow-xl">
             <p className="text-[7px] font-black text-cyan-400 uppercase mb-3 tracking-widest text-center">Hoja de Ruta Tiphereth</p>
             <ul className="text-[9px] space-y-2 font-bold italic">
               <li className="flex justify-between"><span>- Limpieza Profunda Facial</span> <span className="text-cyan-400">OK</span></li>
               <li className="flex justify-between"><span>- Armonización de Glúteos</span> <span className="text-cyan-400">URGENTE</span></li>
               <li className="flex justify-between"><span>- Mantenimiento Colágeno</span> <span className="text-cyan-400">PREVENTIVO</span></li>
             </ul>
          </div>

          <button onClick={() => {
            const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He analizado mi Manifiesto V41. Aunque mi simetría facial es ideal, deseo proceder con los protocolos de Mantenimiento de Colágeno y la Proyección de Contorno Corporal (Lipo/Mamas) que sugiere el sistema.`);
            window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
          }} 
          className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 hover:bg-emerald-600 transition-all">
            Materializar Plan Maestro Total
          </button>
        </div>
      )}
    </div>
  );
}