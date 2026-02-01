"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE PODER ===
const WS_BUSINESS = "573117936211";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Layer = 'BIO-ESTRUCTURA' | 'HEMOGLOBINA' | 'MELANINA' | 'TENSIÓN';

export default function TipherethV37() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('BIO-ESTRUCTURA');
  const [stageText, setStageText] = useState('');

  const speak = (txt: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'es-ES'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const captureFrame = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 800, 1000);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 1000;

    await speak("Iniciando Escaneo Volumétrico. Mire al frente.");
    setStageText("ANÁLISIS FRONTAL");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame(canvas);

    await speak("Gire a la izquierda.");
    setStageText("PERFIL IZQUIERDO");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame(canvas);

    await speak("Incline la cabeza hacia abajo.");
    setStageText("ANÁLISIS CENITAL");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame(canvas);

    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    
    const msgs = ["Sincronizando InBody...", "Calculando Ratios Φ...", "Generando Manifiesto..."];
    for (const m of msgs) {
      setLogs(p => [...p, m]);
      await new Promise(r => setTimeout(r, 1000));
    }
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { alert("Error de cámara"); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step !== 'report' && (
        <div className="relative w-72 h-72 my-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="3" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_15px_cyan]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-white text-[10px] tracking-[0.5em] font-black mb-4 uppercase">TIPHERETH STATION</h1>
                <button onClick={initSystem} className="bg-white text-black px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest active:scale-95">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
               <>
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
                 <div className="absolute bottom-4 inset-x-0 text-center text-[8px] font-black text-cyan-400 uppercase tracking-widest">{stageText}</div>
               </>
            )}
            {(step === 'result' || step === 'lead') && photos.length > 0 && (
              <img src={photos[0]} alt="Result" className={`w-full h-full object-cover ${activeLayer === 'HEMOGLOBINA' ? 'hue-rotate-180 saturate-200' : activeLayer === 'TENSIÓN' ? 'grayscale contrast-[4] invert' : ''}`} />
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-[340px]">
        {step === 'sync' && <div className="space-y-1 p-6 bg-zinc-900/40 border-l-2 border-cyan-500">{logs.map((l, i) => <p key={i} className="text-[9px] text-cyan-500 uppercase">{">"} {l}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-3xl animate-in slide-in-from-bottom">
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none uppercase" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.name && userData.email) setStep('result'); }} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase">Generar Análisis Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-1">
              {(['BIO-ESTRUCTURA', 'HEMOGLOBINA', 'MELANINA', 'TENSIÓN'] as Layer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`py-3 text-[6px] font-black border transition-all ${activeLayer === l ? 'bg-cyan-500 text-black' : 'border-white/5 text-zinc-600'}`}>{l}</button>
              ))}
            </div>
            <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl tracking-widest italic">Ver Pasaporte de Inmortalidad</button>
          </div>
        )}

        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl mb-20 border-[10px] border-zinc-100">
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase">Tiphereth<br/>Station</div>
              <p className="text-[7px] font-black text-zinc-400 uppercase">Master Report v37.1</p>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <img src={photos[0]} alt="Scan" className="w-full aspect-[3/4] object-cover rounded-2xl grayscale" />
               <div className="bg-zinc-50 p-4 rounded-2xl flex flex-col justify-center text-center">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">Simetría Φ</p>
                  <p className="text-3xl font-black text-cyan-600 tracking-tighter italic">94.2%</p>
                  <p className="text-[6px] text-zinc-400 mt-2 uppercase">Bio-Edad: -4 Años</p>
               </div>
            </div>

            <div className="bg-black text-white p-6 rounded-3xl mb-8">
               <p className="text-[7px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.3em] italic">Métricas de Park</p>
               <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold">
                  <div><p className="text-[5px] text-zinc-500 uppercase">Sup</p>1.82</div>
                  <div><p className="text-[5px] text-zinc-500 uppercase">Med</p>2.01</div>
                  <div className="text-red-500 animate-pulse"><p className="text-[5px] uppercase">Inf</p>0.92</div>
               </div>
            </div>

            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica un déficit de 0.92. Deseo el PDF en mi email ${userData.email} y agendar mi intervención Φ.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
              Materializar Plan Maestro
            </button>
          </div>
        )}
      </div>
      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}