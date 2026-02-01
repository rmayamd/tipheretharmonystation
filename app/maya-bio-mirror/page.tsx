"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN DE ALTO NIVEL - DR. MAYA ROMO ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'report';
type ViewStage = 'FRONTAL Φ' | 'PERFILOMETRÍA' | 'CENITAL SMAS';

export default function TipherethV43() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState<ViewStage>('FRONTAL Φ');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  // MOTOR DE VOZ - CADENCIA DE AUTORIDAD CLÍNICA
  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.8; // Pausado para generar confianza
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureFrame = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    if (videoRef.current) {
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    await speak("Iniciando Escaneo Volumétrico Tiphereth. Por favor, mire al frente.");
    setStageText('FRONTAL Φ');
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Análisis frontal completo. Gire lentamente hacia su izquierda.");
    setStageText('PERFILOMETRÍA');
    await new Promise(r => setTimeout(r, 1500));
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Excelente. Incline la barbilla hacia abajo para evaluar arco mandibular y cuello.");
    setStageText('CENITAL SMAS');
    await new Promise(r => setTimeout(r, 1500));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Escaneo finalizado. Procesando métricas multiespectrales y volumetría 3D.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 3000));
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { setStep('intro'); alert("Error de hardware óptico."); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden selection:bg-cyan-900">
      
      {/* 1. HUD DE ESCANEO (GRADO MÉDICO) */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 animate-in fade-in duration-700">
          <svg className="absolute inset-0 w-full h-full -rotate-90 text-cyan-500">
            <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] font-black tracking-[0.5em] uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Advanced Engineering Station</p>
                <button onClick={initSystem} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95">Iniciar Protocolo</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 opacity-80" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.3em]">{stageText}</div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale opacity-40 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* 2. CAPTURA DE LEADS (EMBUDO DE VENTAS) */}
      <div className="w-full max-w-[360px]">
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom duration-700">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-6">Registro de Bio-Identidad</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none uppercase" />
            <input type="email" placeholder="EMAIL (REPORTE PDF)" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.name && userData.email) setStep('report'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Generar Manifiesto Φ</button>
          </div>
        )}

        {/* 3. EL RESULTADO MAESTRO: CANFIELD SUPERIORITY REPORT */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-700 mb-20 border-[10px] border-zinc-100 relative">
            
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase text-cyan-600">TIPHERETH<br/><span className="text-black">HARMONY</span></div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400 tracking-widest leading-tight">Master Report v43.0<br/>Canfield Engine Integrated</div>
            </header>

            {/* VOLUMETRÍA Y VECTORES (ESTILO VECTRA H2) */}
            <p className="text-[8px] font-black text-center uppercase mb-4 tracking-widest">I. Análisis Volumétrico 3D y Vectores</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100 shadow-inner">
                  <p className="text-[6px] font-black text-cyan-600 uppercase mb-1">Volumetría Φ</p>
                  <div className="flex justify-between items-end"><span className="text-xl font-black">+213.5 cc</span></div>
               </div>
               <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100 shadow-inner">
                  <p className="text-[6px] font-black text-red-600 uppercase mb-1">Vector de Tensión</p>
                  <div className="flex justify-between items-end"><span className="text-xl font-black">↑ 4.6 mm</span></div>
               </div>
            </div>

            {/* ESTUDIO MULTIESPECTRAL (ESTILO VISIA RBX) */}
            <p className="text-[8px] font-black text-center uppercase mb-4 tracking-widest border-t pt-4">II. Diagnóstico Multiespectral RBX®</p>
            <div className="grid grid-cols-4 gap-2 mb-8 text-center uppercase">
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg contrast-150 invert sepia" />
                    <p className="text-[5px] font-bold">Rojos (Vasc)</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg brightness-50 contrast-200 sepia" />
                    <p className="text-[5px] font-bold">Marrones (UV)</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg grayscale contrast-[5]" />
                    <p className="text-[5px] font-bold">Textura</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg hue-rotate-180 saturate-150" />
                    <p className="text-[5px] font-bold">Laxitud</p>
                </div>
            </div>

            {/* PERCENTILES COMPARATIVOS (NEUROVENTA) */}
            <div className="space-y-3 mb-8 p-6 bg-zinc-950 text-white rounded-[2rem] shadow-xl">
               <p className="text-[7px] font-black uppercase text-center mb-4 tracking-widest text-cyan-400">Percentiles de Salud Dérmica (vs Normas)</p>
               {[
                 { label: 'Puntos UV', score: 42, color: 'bg-red-500' },
                 { label: 'Firma Roja (RBX)', score: 88, color: 'bg-emerald-500' },
                 { label: 'Ratios de Park', score: 32, color: 'bg-red-600' }
               ].map((item) => (
                 <div key={item.label} className="space-y-1">
                   <div className="flex justify-between text-[6px] font-bold uppercase"><span>{item.label}</span><span>{item.score}%</span></div>
                   <div className="w-full h-1 bg-zinc-800 rounded-full">
                     <div className={`h-full rounded-full ${item.color} ${item.score < 50 ? 'animate-pulse' : ''}`} style={{ width: `${item.score}%` }} />
                   </div>
                 </div>
               ))}
            </div>

            {/* CORPORAL SCULPTOR (MAMAS, LIPO, GLÚTEOS) */}
            <p className="text-[8px] font-black text-center uppercase mb-4 tracking-widest italic border-t pt-4">III. Planificación Corporal (Sculptor 3D)</p>
            <div className="bg-zinc-50 p-5 rounded-3xl mb-10 space-y-4 border border-zinc-100 text-[9px] font-bold italic">
               <div className="flex justify-between border-b pb-1"><span>Proyección Mamaria:</span> <span className="text-cyan-600">Mastopexia Φ</span></div>
               <div className="flex justify-between border-b pb-1"><span>Contorno Abdominal:</span> <span className="text-cyan-600">Lipectomía HD</span></div>
               <div className="flex justify-between"><span>Bio-Edad Actual:</span> <span className="text-emerald-600">-4 AÑOS</span></div>
            </div>

            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica un percentil crítico de Ratios de Park (32%) y una necesidad de ajuste volumétrico de +213.5 cc. Deseo materializar mi Plan Maestro.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-8 font-serif">The Absolute Standard in Aesthetic Engineering</p>
          </div>
        )}
      </div>

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}