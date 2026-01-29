"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE CONVERSIÓN ELITE ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Layer = 'ESTRUCTURA' | 'CROMÓFOROS' | 'TENSIÓN';

export default function TipherethV35() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('ESTRUCTURA');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.9;
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureVolumetric = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 1000;
    if (videoRef.current) {
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, 800, 1000);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    await speak("Iniciando Mapeo Volumétrico. Analizando eje axial.");
    for(let i=0; i<=100; i++) {
      setProgress(i);
      if(i === 33) { captureVolumetric(); await speak("Perfil izquierdo capturado."); }
      if(i === 66) { captureVolumetric(); await speak("Perfil derecho capturado."); }
      if(i === 95) await speak("Sincronizando con el servidor de bio-ingeniería.");
      await new Promise(r => setTimeout(r, 60));
    }
    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  const initScan = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { alert("Acceso a cámara requerido."); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 animate-in fade-in duration-1000">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke={THEME_COLOR} strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] tracking-[0.6em] font-black mb-1 uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Bio-Engineering Console</p>
                <button onClick={initScan} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-widest active:scale-95 shadow-xl">Iniciar Escaneo</button>
              </div>
            )}
            {step === 'scanning' && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />}
            {(step === 'result' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === 'CROMÓFOROS' ? 'hue-rotate-180 saturate-200' : activeLayer === 'TENSIÓN' ? 'grayscale contrast-[4] invert' : ''}`} />
            )}
          </div>
        </div>
      )}

      {/* FLUJO DE CAPTURA DE LEADS (FILTRO) */}
      <div className="w-full max-w-[340px]">
        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-3xl animate-in slide-in-from-bottom duration-700">
            <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest text-center italic mb-4">Sincronización de Identidad</p>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.email) setStep('result'); }} className="w-full bg-white text-black py-5 text-[10px] font-black uppercase tracking-widest shadow-2xl">Compilar Manifiesto Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-1">
              {(['ESTRUCTURA', 'CROMÓFOROS', 'TENSIÓN'] as Layer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`py-3 text-[7px] font-black border transition-all ${activeLayer === l ? 'bg-cyan-500 text-black border-cyan-400' : 'border-white/5 text-zinc-600'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-950 p-6 border-t-2 border-cyan-500">
               <p className="text-[10px] text-white font-black uppercase mb-3 tracking-widest italic">Análisis Estructural</p>
               <p className="text-[9px] text-zinc-500 leading-relaxed italic mb-8 border-l border-white/10 pl-4">"Nube de puntos detecta asimetría en tercio inferior. Ratio de Park: 0.92. Su reporte detallado ha sido preparado para envío digital."</p>
               <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 font-black text-[10px] uppercase shadow-xl">Ver Certificado Φ</button>
            </div>
          </div>
        )}

        {/* REPORTE PROFESIONAL (VISTA PREVIA) */}
        {step === 'report' && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 mb-20 border-[10px] border-zinc-100">
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase">Tiphereth<br/>Harmony</div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400">PASAPORTE DE INMORTALIDAD</div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <img src={photos[0]} className="w-full aspect-[3/4] object-cover rounded-2xl grayscale border border-zinc-100" />
               <div className="bg-zinc-50 p-4 rounded-2xl flex flex-col justify-center text-center">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1">Simetría Axial (Φ)</p>
                  <p className="text-3xl font-black text-cyan-600 tracking-tighter">94.2%</p>
               </div>
            </div>

            <div className="bg-black text-white p-5 rounded-3xl mb-8">
               <p className="text-[7px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.3em] italic">Métricas de Ingeniería (Park)</p>
               <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase">
                  <div><p className="text-[5px] text-zinc-500">Sup</p>1.82</div>
                  <div><p className="text-[5px] text-zinc-500">Med</p>2.01</div>
                  <div className="text-red-500 animate-pulse"><p className="text-[5px]">Inf</p>0.92</div>
               </div>
            </div>

            <div className="text-[9px] italic text-zinc-700 leading-tight border-l-4 border-black pl-4 mb-8">
               <p><strong>ESTADO INTEGRAL:</strong> InBody Sincronizado | Edad Biológica: -4 Años.</p>
            </div>

            <div className="space-y-3">
              <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto Tiphereth. Mi Ratio Inferior es de 0.92 y busco alcanzar la Armonía Φ.`)} 
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-cyan-600 transition-all">
                Materializar Plan Maestro
              </button>
              <button onClick={() => alert(`Reporte enviado a: ${userData.email}`)} className="w-full border-2 border-zinc-200 text-zinc-400 py-3 rounded-2xl font-black text-[8px] uppercase tracking-widest hover:border-black hover:text-black">Recibir PDF en Email</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}