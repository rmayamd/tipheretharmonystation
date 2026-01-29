"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE CONTACTO ===
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Stage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO';
type Layer = 'real' | 'wood' | 'uv' | 'infra' | 'textura';

export default function TipherethV28() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [stage, setStage] = useState<Stage>('FRENTE');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('real');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      window.speechSynthesis.speak(u);
    }
  };

  const capture = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 600, 800);
      const data = canvas.toDataURL('image/jpeg');
      setPhotos(prev => [...prev, data]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 800;

    await speak("Iniciando Escaneo Maestro Tiphereth. Retire sus gafas.");
    
    setStage('FRENTE');
    await speak("Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture(canvas);

    setStage('PERFIL IZQUIERDO');
    await speak("Gire a la izquierda.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture(canvas);

    setStage('PERFIL DERECHO');
    await speak("Gire a la derecha.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture(canvas);

    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    
    const messages = ["Analizando Estructura Ósea...", "Extrayendo Capas UV...", "Calculando Ratios Φ...", "Sincronizando Bio-Data..."];
    for (const m of messages) {
      await new Promise(r => setTimeout(r, 1000));
      setLogs(prev => [...prev, m]);
    }
    setStep('lead');
  };

  const startScan = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        runProtocol(s);
      }
    } catch (e) { alert("Permita el acceso a la cámara."); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col items-center overflow-x-hidden">
      
      {step !== 'report' && (
        <div className="relative w-72 h-72 mb-10 mt-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.6em] font-black mb-4 uppercase italic">Tiphereth Station v28</h1>
                <button onClick={startScan} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            )}
            {(step === 'result' || step === 'lead') && photos.length > 0 && (
              <img src={photos[0]} alt="Result" className={`w-full h-full object-cover 
                ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-[2.5]' : ''}
                ${activeLayer === 'uv' ? 'invert sepia saturate-[5]' : ''}
                ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale invert' : ''}
                ${activeLayer === 'textura' ? 'contrast-[4] grayscale brightness-[0.7]' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-[340px]">
        {step === 'sync' && <div className="space-y-2 p-6 bg-zinc-900/40 rounded-3xl border border-white/5 font-mono">{logs.map((l, i) => <p key={i} className="text-[9px] text-cyan-500 uppercase">{">"} {l}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4">
            <input type="text" placeholder="Nombre Completo" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs text-white" />
            <input type="tel" placeholder="WhatsApp" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs text-white" />
            <button onClick={() => { if(userData.name && userData.phone) setStep('result'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase">Generar Diagnóstico</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between gap-1 bg-zinc-900 p-1 rounded-xl">
              {(['real', 'wood', 'uv', 'infra', 'textura'] as Layer[]).map(l => <button key={l} onClick={()=>setActiveLayer(l)} className={`flex-1 py-2 text-[7px] font-bold uppercase rounded-lg transition-all ${activeLayer === l ? 'bg-cyan-500 text-white shadow-lg' : 'text-zinc-500'}`}>{l}</button>)}
            </div>
            <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase">Ver Certificado Φ</button>
          </div>
        )}

        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl mb-10">
            <h2 className="text-center text-[12px] font-black tracking-[0.3em] uppercase mb-8 border-b pb-4 italic">Tiphereth Clinical Analysis</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <img src={photos[0]} alt="Actual" className="w-full aspect-[3/4] object-cover rounded-2xl grayscale" />
               <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-inner">
                  <img src={photos[0]} alt="Keter" className="w-full h-full object-cover contrast-125 brightness-110 saturate-[0.8]" />
                  <div className="absolute inset-0 bg-cyan-400/10 mix-blend-color" />
               </div>
            </div>

            <div className="bg-black text-white p-5 rounded-3xl mb-8 text-center uppercase">
               <p className="text-[7px] font-black text-cyan-400 mb-3 italic">Ratios de Park</p>
               <div className="grid grid-cols-3 text-[12px] font-bold">
                  <div><p className="text-[6px] text-zinc-500">SUP</p>1.82</div>
                  <div><p className="text-[6px] text-zinc-500">MED</p>2.01</div>
                  <div className="text-red-500"><p className="text-[6px]">INF</p>0.92</div>
               </div>
            </div>

            <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Hola Dr. Maya, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth arroja 94.2% de simetría. Deseo mi Plan Maestro.`)} className="w-full bg-black text-white py-6 rounded-3xl font-black text-[10px] uppercase shadow-2xl">Materializar Plan</button>
          </div>
        )}
      </div>

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}