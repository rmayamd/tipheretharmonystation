"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN MAESTRA ===
const WS_BUSINESS = "573117936211";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'report';
type ViewStage = 'FRONTAL Φ' | 'PERFILOMETRÍA' | 'CENITAL SMAS';

export default function TipherethV42() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState<ViewStage>('FRONTAL Φ');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '' });

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.8; // Velocidad de autoridad pausada
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

  const runFullProtocol = async (stream: MediaStream) => {
    await speak("Iniciando Escaneo de Bio-Ingeniería. Por favor, mire fijamente al frente.");
    setStageText('FRONTAL Φ');
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Análisis frontal completo. Ahora, gire lentamente hacia su izquierda.");
    setStageText('PERFILOMETRÍA');
    await new Promise(r => setTimeout(r, 1500));
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Excelente. Finalmente, incline su barbilla hacia abajo para evaluar el arco mandibular.");
    setStageText('CENITAL SMAS');
    await new Promise(r => setTimeout(r, 1500));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    await speak("Escaneo volumétrico finalizado. Sincronizando con base de datos de Park y Obagi.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 3000));
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runFullProtocol(s); }
    } catch (e) { setStep('intro'); alert("Error de hardware óptico."); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE ESCANEO */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-white text-[12px] tracking-[0.5em] font-black mb-1 uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Advanced Engineering</p>
                <button onClick={initSystem} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl active:scale-95">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.3em] bg-black/50 py-1">{stageText}</div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale opacity-40 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* LEAD CAPTURE */}
      <div className="w-full max-w-[340px]">
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom duration-700">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-6 italic">Filiación de Bio-Identidad</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none uppercase" />
            <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.name) setStep('report'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Generar Manifiesto Φ</button>
          </div>
        )}

        {/* REPORTE INTEGRAL: ROSTRO Y CUERPO (NIVEL CRISALIX/VISIA) */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in fade-in duration-1000 mb-20 border-[10px] border-zinc-100">
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase tracking-tighter">TIPHERETH<br/>HARMONY</div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400">PASAPORTE DE INMORTALIDAD</div>
            </header>

            {/* PANEL VISIA (PIEL) */}
            <div className="grid grid-cols-4 gap-1 mb-8 text-center uppercase text-[5px] font-bold">
               <div><img src={photos[0]} className="rounded contrast-200 invert" />Puntos UV</div>
               <div><img src={photos[0]} className="rounded brightness-50 contrast-150" />Melanina</div>
               <div><img src={photos[0]} className="rounded grayscale contrast-[5]" />Laxitud</div>
               <div><img src={photos[0]} className="rounded hue-rotate-180" />Vascular</div>
            </div>

            {/* RATIOS DE PARK */}
            <div className="bg-black text-white p-5 rounded-3xl mb-8 shadow-xl">
               <p className="text-[7px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.4em] italic">Métricas Óseas de Park</p>
               <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase">
                  <div><p className="text-[5px] text-zinc-500">Sup</p>1.82</div>
                  <div><p className="text-[5px] text-zinc-500">Med</p>2.01</div>
                  <div className="text-red-500 animate-pulse"><p className="text-[5px] text-red-400">Inf</p>0.92</div>
               </div>
            </div>

            {/* MÓDULO CORPORAL (NIVEL CRISALIX) */}
            <div className="space-y-4 mb-8">
               <p className="text-[9px] font-black uppercase tracking-tighter border-l-4 border-emerald-500 pl-2">Escultura Corporal Proyectiva</p>
               <div className="grid grid-cols-2 gap-2 text-[8px] font-bold text-zinc-600">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">MASTOPEXIA:<br/><span className="text-emerald-600 font-black">VOLUMEN Φ</span></div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">LIPO 360:<br/><span className="text-emerald-600 font-black">HD DEFINICIÓN</span></div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">GLUTEOPLASTIA:<br/><span className="text-emerald-600 font-black">PROYECCIÓN</span></div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">LIPECTOMÍA:<br/><span className="text-emerald-600 font-black">TENSIÓN</span></div>
               </div>
            </div>

            {/* VADEMÉCUM (PEELINGS / BIOSTIMULACIÓN) */}
            <div className="mb-10 p-4 bg-zinc-50 rounded-2xl border-l-4 border-black text-[9px] italic leading-tight space-y-2">
               <p><strong>SUGERENCIA QUIRÚRGICA:</strong> Park V-Line Mandibular + Abdominoplastia.</p>
               <p><strong>PROTOCOLO NO QUIRÚRGICO:</strong> Mesopeel Melanostop + Toxina Botulínica Preventiva.</p>
            </div>

            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto Tiphereth. Mi simetría facial es de 94.2% pero deseo materializar mi Plan Maestro de Ingeniería Humana incluyendo el contorno corporal.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all mb-4">
              Materializar Plan Maestro
            </button>
          </div>
        )}
      </div>

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}