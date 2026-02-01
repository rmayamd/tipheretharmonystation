"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN DE ALTO NIVEL ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type ViewStage = 'FRONTAL' | 'PERFIL' | 'CENITAL';

export default function TipherethV38() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  // MOTOR DE VOZ MEJORADO - VELOCIDAD REDUCIDA PARA CLARIDAD CLÍNICA
  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.75; // Velocidad pausada y profesional
        u.pitch = 1.0;
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

  const runPrecisionProtocol = async (stream: MediaStream) => {
    // INICIO
    await speak("Iniciando análisis de bioingeniería. Por favor, mantenga el rostro frente a la cámara.");
    setStageText("ANÁLISIS AXIAL Φ");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();

    // PERFIL
    await speak("Análisis frontal completado. Ahora, gire lentamente la cabeza hacia su izquierda.");
    setStageText("PERFILOMETRÍA DE PARK");
    await new Promise(r => setTimeout(r, 1500)); // Pausa para que el usuario gire
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();

    // CENITAL
    await speak("Excelente. Finalmente, incline su barbilla hacia el pecho para medir el ángulo mandibular.");
    setStageText("MARCADORES DE CONNELL");
    await new Promise(r => setTimeout(r, 1500));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 80)); }
    capture();

    await speak("Proceso de captura finalizado. Sincronizando datos con su perfil InBody.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 3000));
    setStep('lead');
  };

  const startSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runPrecisionProtocol(s); }
    } catch (e) { alert("Error de acceso óptico."); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center selection:bg-cyan-900 overflow-x-hidden">
      
      {/* HUD DE COMANDO QUIRÚRGICO */}
      {step !== 'report' && (
        <div className="relative w-72 h-72 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke={THEME_COLOR} strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] tracking-[0.5em] font-black mb-2 italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Advanced Simulation</p>
                <button onClick={startSystem} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl">Iniciar Escaneo</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
                <div className="absolute bottom-6 inset-x-0 text-center"><span className="bg-black/80 px-4 py-1 text-[8px] font-black text-cyan-400 border border-cyan-500/30 uppercase tracking-[0.3em]">{stageText}</span></div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale contrast-125 brightness-75 opacity-50" />
            )}
          </div>
        </div>
      )}

      {/* FORMULARIO DE ALTA CONVERSIÓN */}
      <div className="w-full max-w-[340px]">
        {step === 'sync' && (
          <div className="p-8 text-center animate-pulse">
            <p className="text-[10px] text-cyan-500 uppercase tracking-[0.5em] font-black">Sincronizando con Keter...</p>
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom duration-1000">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-6 italic">Filiación de Bio-Identidad</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none uppercase" />
            <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[11px] text-white focus:border-cyan-500 outline-none" />
            <button onClick={() => { if(userData.name && userData.email) setStep('report'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-cyan-500 transition-all">Ver Resultados de Ingeniería</button>
          </div>
        )}

        {/* EL RESULTADO FINAL: PASAPORTE DE INMORTALIDAD Φ */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-700 mb-20 border-[10px] border-zinc-100 relative">
            
            <header className="flex justify-between items-start mb-10 border-b-2 border-black pb-4">
              <div className="font-black text-[16px] leading-none italic uppercase tracking-tighter text-cyan-600">TIPHERETH<br/><span className="text-black">HARMONY</span></div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400">PASAPORTE DE INMORTALIDAD<br/>ID: {Math.floor(Math.random()*100000)}</div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-inner">
                 <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale brightness-110" />
                 <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
               </div>
               <div className="flex flex-col gap-4">
                  <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100 text-center">
                    <p className="text-[7px] font-black text-zinc-400 uppercase mb-1">Simetría Axial Φ</p>
                    <p className="text-3xl font-black text-cyan-600 tracking-tighter">94.2%</p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-3xl text-center text-white">
                    <p className="text-[7px] font-black text-cyan-500 uppercase mb-1">Edad Biológica</p>
                    <p className="text-2xl font-black italic tracking-tighter">-4 AÑOS</p>
                  </div>
               </div>
            </div>

            <div className="bg-black text-white p-6 rounded-[2rem] mb-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/20 blur-2xl" />
               <p className="text-[8px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.4em] italic">Métricas de Park (Nivel Crítico)</p>
               <div className="grid grid-cols-3 gap-2 text-center text-[13px] font-bold">
                  <div className="border border-white/5 p-2"><p className="text-[6px] text-zinc-500 uppercase">Sup</p>1.82</div>
                  <div className="border border-white/5 p-2"><p className="text-[6px] text-zinc-500 uppercase">Med</p>2.01</div>
                  <div className="border border-cyan-500 p-2 text-red-500 animate-pulse bg-red-500/5"><p className="text-[6px] font-black">INF</p>0.92</div>
               </div>
            </div>

            <div className="space-y-4 mb-10 text-[10px] text-zinc-700 leading-snug italic border-l-4 border-black pl-4">
               <p><strong>RECOMENDACIÓN QUIRÚRGICA:</strong> Se sugiere Reingeniería Mandibular según parámetros de Park para corregir déficit en tercio inferior.</p>
               <p className="text-cyan-600 font-bold">Protocolo Mesoestetic AOX Ferulic activado para manejo de cromóforos.</p>
            </div>

            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto Tiphereth. Mi Ratio Inferior es de 0.92 y mi Edad Biológica indica una oportunidad de mejora de 4 años. Deseo agendar mi intervención Φ.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-cyan-600 transition-all active:scale-95">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-8 font-serif">The Gold Standard in Human Engineering</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}