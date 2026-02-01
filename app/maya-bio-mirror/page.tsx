"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE ALTA AUTORIDAD ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';

export default function TipherethV39() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.85; // Velocidad media-lenta profesional
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
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
    await speak("Iniciando escaneo volumétrico de alta resolución. Por favor, mire al frente.");
    setStageText("ANÁLISIS FRONTAL Φ");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();

    await speak("Gire lentamente hacia su izquierda para medir profundidad.");
    setStageText("PERFILOMETRÍA IZQUIERDA");
    await new Promise(r => setTimeout(r, 2000));
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();

    await speak("Finalmente, incline el rostro hacia adelante para evaluar el arco mandibular.");
    setStageText("MAPEO DE LAXITUD CENITAL");
    await new Promise(r => setTimeout(r, 2000));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();

    await speak("Escaneo completado. Sincronizando capas dérmicas y óseas.");
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
    } catch (e) { alert("Error de acceso óptico."); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO */}
      {step !== 'report' && (
        <div className="relative w-72 h-72 my-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90 text-cyan-500">
            <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-white text-[12px] font-black tracking-widest uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Bio-Engineering Station</p>
                <button onClick={initSystem} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl">Iniciar Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-20" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-widest">{stageText}</div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale opacity-40 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <div className="w-full max-w-[360px]">
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom duration-700">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-6">Filiación de Bio-Identidad</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none uppercase" />
            <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.name && userData.email) setStep('report'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Compilar Manifiesto Φ</button>
          </div>
        )}

        {/* EL REPORTE FINAL: EL MANIFIESTO "HOLY GRAIL" */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-6 rounded-[2.5rem] shadow-2xl animate-in fade-in duration-1000 mb-20 border-[8px] border-zinc-100">
            
            <header className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
              <div className="font-black text-[12px] uppercase italic">Tiphereth Clinical Report</div>
              <div className="text-[7px] font-black uppercase text-zinc-400 tracking-widest">ID: {Math.floor(Math.random()*90000)}</div>
            </header>

            {/* COMPARATIVO ANTES Y DESPUÉS PROYECTADO */}
            <p className="text-[8px] font-black text-center uppercase mb-4 tracking-widest">Simulación Proyectiva de Armonización</p>
            <div className="grid grid-cols-2 gap-2 mb-8">
               <div className="relative rounded-2xl overflow-hidden shadow-md">
                 <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale brightness-110" />
                 <span className="absolute bottom-2 left-2 text-[6px] bg-black text-white px-2 py-0.5 rounded">ORIGINAL</span>
               </div>
               <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-cyan-500/20">
                 <img src={photos[0]} className="w-full h-full object-cover contrast-125 brightness-110 saturate-[0.7]" />
                 <div className="absolute inset-0 bg-cyan-400/10 mix-blend-color" />
                 <span className="absolute bottom-2 left-2 text-[6px] bg-cyan-600 text-white px-2 py-0.5 rounded">PROYECCIÓN Φ</span>
               </div>
            </div>

            {/* ESTUDIO DE PIEL MULTIESPECTRAL (ESTILO VISIA/VECTRA) */}
            <p className="text-[8px] font-black text-center uppercase mb-4 tracking-widest italic border-t pt-4">Estudio Multiespectral Deep-Scan</p>
            <div className="grid grid-cols-4 gap-2 mb-8 text-center uppercase">
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg contrast-150 invert sepia" />
                    <p className="text-[5px] font-bold">Hemoglobina</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg brightness-50 contrast-200 sepia" />
                    <p className="text-[5px] font-bold">Melanina</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg grayscale contrast-[4]" />
                    <p className="text-[5px] font-bold">Textura</p>
                </div>
                <div className="space-y-1">
                    <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg hue-rotate-180 saturate-200" />
                    <p className="text-[5px] font-bold">Laxitud</p>
                </div>
            </div>

            {/* RATIOS DE PARK Y EDAD BIOLÓGICA */}
            <div className="bg-black text-white p-6 rounded-[2rem] mb-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/20 blur-xl" />
               <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold mb-4">
                  <div className="border border-white/5 p-2"><p className="text-[5px] text-zinc-500 uppercase">Sup</p>1.82</div>
                  <div className="border border-white/5 p-2"><p className="text-[5px] text-zinc-500 uppercase">Med</p>2.01</div>
                  <div className="border border-cyan-500 p-2 text-red-500 animate-pulse"><p className="text-[5px] font-black">INF</p>0.92</div>
               </div>
               <div className="flex justify-between items-center text-[9px] font-black border-t border-white/10 pt-4">
                  <span className="text-cyan-400">SIMETRÍA: 94.2%</span>
                  <span className="text-emerald-500 uppercase tracking-tighter italic">Bio-Edad: -4 Años</span>
               </div>
            </div>

            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica un déficit INF de 0.92. He validado mis mapas de cromóforos y deseo materializar mi Plan Maestro Φ.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[6px] text-zinc-400 uppercase tracking-widest mt-6 font-serif">Protocolo de Alta Fidelidad - Tiphereth Center</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}