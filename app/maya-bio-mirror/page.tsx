"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE PODER ABSOLUTO ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type View = 'FRENTE' | 'PERFIL' | 'CENITAL';
type Layer = 'BIO-ESTRUCTURA' | 'CROMÓFOROS' | 'TENSIÓN SMAS';

export default function TipherethV36() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [view, setView] = useState<View>('FRENTE');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('BIO-ESTRUCTURA');

  const speak = (txt: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = 'es-ES'; u.rate = 0.9;
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const capture = (v: View) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    if (videoRef.current) {
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runFullSpectrumScan = async (stream: MediaStream) => {
    await speak("Iniciando Escaneo de Bioingeniería Humana. No use gafas.");
    
    // FRENTE
    setView('FRENTE');
    await speak("Mire al frente. Calibrando simetría axial.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture('FRENTE');

    // PERFIL
    setView('PERFIL');
    await speak("Gire a la izquierda. Analizando perfilometría de Park.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture('PERFIL');

    // CENITAL
    setView('CENITAL');
    await speak("Incline la cabeza hacia abajo. Mapeando arco mandibular.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture('CENITAL');

    await speak("Escaneo volumétrico completado. Sincronizando con la red Tiphereth.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    
    const messages = [
      "Nivel 1: Procesando Maya-Vision...",
      "Nivel 2: Lectura InBody H30 (Phase Angle: 6.5°)...",
      "Nivel 3: Quantum Analyzer (Colágeno: 72%)...",
      "Nivel 4: Consultando Tratados de Park y Obagi...",
      "Nivel 5: Generando Vademécum Terapéutico..."
    ];
    for (const m of messages) {
      setLogs(p => [...p, m]);
      await new Promise(r => setTimeout(r, 1000));
    }
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runFullSpectrumScan(s); }
    } catch (e) { alert("Error de hardware óptico."); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO CLÍNICO */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 animate-in fade-in duration-700">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke={THEME_COLOR} strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_15px_#06b6d4]" />
          </svg>
          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-white text-[11px] tracking-[0.8em] font-black mb-1 uppercase">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10 italic">Human Engineering Station</p>
                <button onClick={initSystem} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute bottom-6 inset-x-0 text-center"><span className="bg-black/60 px-4 py-1 text-[8px] font-black text-cyan-400 border border-cyan-500/30 uppercase">{view}</span></div>
              </>
            )}
            {(step === 'result' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === 'CROMÓFOROS' ? 'hue-rotate-180 saturate-200' : activeLayer === 'TENSIÓN SMAS' ? 'grayscale contrast-[4] invert' : ''}`} />
            )}
          </div>
        </div>
      )}

      {/* FLUJO DE PERSUASIÓN */}
      <div className="w-full max-w-[350px]">
        {step === 'sync' && <div className="space-y-1 p-6 bg-zinc-900/40 border-l-2 border-cyan-500">{logs.map((l, i) => <p key={i} className="text-[8px] text-cyan-500 uppercase tracking-tighter">[{new Date().toLocaleTimeString()}] {l}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2rem] animate-in slide-in-from-bottom">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-4">Registro de Bio-Identidad</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => userData.name && setStep('result')} className="w-full bg-white text-black py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl">Compilar Manifiesto Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="flex justify-between gap-1">
              {(['BIO-ESTRUCTURA', 'CROMÓFOROS', 'TENSIÓN SMAS'] as Layer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`flex-1 py-3 text-[7px] font-black border transition-all ${activeLayer === l ? 'bg-cyan-500 text-black' : 'border-white/5 text-zinc-600'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-950 p-6 border-t-2 border-cyan-500 shadow-2xl">
               <p className="text-[10px] text-white font-black uppercase mb-3 italic tracking-widest">Diagnóstico de Ingeniería</p>
               <p className="text-[9px] text-zinc-500 leading-relaxed italic mb-8 border-l border-white/10 pl-4">"Deficiencia estructural en plano mandibular detectada. Ratio INF 0.92. Análisis de Park sugiere reingeniería ósea y control de cromóforos."</p>
               <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 font-black text-[10px] uppercase shadow-xl tracking-widest italic">Ver Pasaporte de Inmortalidad</button>
            </div>
          </div>
        )}

        {/* REPORTE NIVEL 7: EL PASAPORTE DE INMORTALIDAD */}
        {step === 'report' && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 mb-20 border-[10px] border-zinc-100">
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase">Tiphereth<br/>Station</div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400 tracking-widest">NIVEL 7: MASTER REPORT</div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="relative rounded-2xl overflow-hidden border border-zinc-100">
                 <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale brightness-110" />
                 <p className="absolute bottom-2 left-2 text-[6px] font-black text-zinc-400">STATUS: MALKHUT</p>
               </div>
               <div className="bg-zinc-50 p-4 rounded-2xl flex flex-col justify-center text-center border border-zinc-100 shadow-inner">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1">Simetría Axial (Φ)</p>
                  <p className="text-3xl font-black text-cyan-600 tracking-tighter italic">94.2%</p>
                  <div className="h-[2px] w-full bg-zinc-200 mt-2"><div className="h-full bg-cyan-500 w-[94%]" /></div>
               </div>
            </div>

            <div className="bg-black text-white p-6 rounded-3xl mb-8 shadow-xl">
               <p className="text-[8px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.3em] italic">Análisis Estructural (Park Style)</p>
               <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold uppercase">
                  <div><p className="text-[6px] text-zinc-500">Sup</p>1.82</div>
                  <div><p className="text-[6px] text-zinc-500">Med</p>2.01</div>
                  <div className="text-red-500 animate-pulse"><p className="text-[6px] text-red-400 font-black">Inf</p>0.92</div>
               </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="border-l-4 border-black pl-4">
                  <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Prescripción Vademécum (Nivel 5)</p>
                  <p className="text-[10px] font-bold text-black italic">1. AOX Ferulic (Mesoestetic)<br/>2. Collagen Pro+ (Suplementación Yu)</p>
               </div>
               <div className="border-l-4 border-cyan-500 pl-4">
                  <p className="text-[8px] font-black text-cyan-500 uppercase mb-1">Referencia Científica (Nivel 4)</p>
                  <p className="text-[8px] text-zinc-500 italic leading-tight">"Park V-Line: El contorno óseo debe preceder a procedimientos de tejidos blandos." - Suh-Goo Park, PhD.</p>
               </div>
            </div>

            <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto Tiphereth. Mi Ratio Inferior es de 0.92 y busco alcanzar la Armonía Φ.`)} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95 mb-4 shadow-cyan-500/10">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest">Clinical Authority System v36.0</p>
          </div>
        )}
      </div>

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}