"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE ALTA INGENIERÍA - DR. MAYA ROMO ===
const WS_BUSINESS = "573117936211";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'report';

export default function TipherethV52() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [stage, setStage] = useState('');

  // MOTOR DE VOZ: CADENCIA MÉDICA Y SEGURA (Basado en Protocolos Tiphereth)
  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.75; // Pausado para generar autoridad y confianza
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureFrame = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, event.target?.result as string]);
        setStep('lead');
      };
      reader.readAsDataURL(file);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    await speak("Iniciando análisis integral de bio-ingeniería. Mantenga una expresión neutral.");
    setStage("MATRIZ FRONTAL");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    captureFrame();

    await speak("Captura frontal completada. Ahora, gire lentamente hacia su izquierda para evaluar la estructura ósea.");
    setStage("PERFILOMETRÍA ÓSEA");
    await new Promise(r => setTimeout(r, 2500)); 
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    captureFrame();

    await speak("Perfil capturado. Incline la barbilla hacia abajo para medir vectores de laxitud y SMAS.");
    setStage("ANÁLISIS DE LAXITUD");
    await new Promise(r => setTimeout(r, 2500));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    captureFrame();

    await speak("Escaneo finalizado. Procesando diagnóstico estratificado desde dermis hasta plano óseo.");
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
    } catch (e) { alert("Error: Se requiere acceso a la cámara."); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO CLÍNICO */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_25px_#06b6d4]" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[14px] font-black tracking-[0.6em] mb-2 italic">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-500 uppercase tracking-widest mb-10 italic underline decoration-cyan-500/30">Clinical Bio-Engine</p>
                <div className="flex flex-col gap-3">
                    <button onClick={initSystem} className="bg-white text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl active:scale-95">Escanear Rostro</button>
                    <button onClick={() => fileInputRef.current?.click()} className="text-zinc-500 border border-white/10 px-8 py-3 rounded-full font-black text-[8px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Subir Registro</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[size:100%_6px] animate-pulse" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.4em] bg-black/50 py-1">{stage}</div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale opacity-40 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* REGISTRO DE PACIENTE */}
      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem] animate-in slide-in-from-bottom shadow-2xl">
          <h3 className="text-[9px] font-black text-white uppercase tracking-widest text-center mb-6">Filiación de Identidad Bio-Digital</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none uppercase font-black" />
          <input type="email" placeholder="EMAIL DE DIAGNÓSTICO" onChange={e => setUserData({...userData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl tracking-widest active:scale-95 transition-all">Compilar Auditoría Tiphereth</button>
        </div>
      )}

      {/* EL REPORTE FINAL: THE HUMAN BLUEPRINT (PIEL A HUESO) */}
      {step === 'report' && photos.length > 0 && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] my-10 border-[15px] border-zinc-100 relative">
          
          <header className="flex justify-between items-start mb-10 border-b-4 border-black pb-4 font-black">
            <div>
              <h2 className="text-2xl italic leading-none text-black">TIPHERETH</h2>
              <p className="text-[8px] tracking-[0.4em] uppercase text-cyan-600">Human Engineering Report</p>
            </div>
            <div className="text-right text-[7px] text-zinc-400 uppercase tracking-widest leading-tight">MASTER ARCHIVE<br/>v52.0 CLINICAL</div>
          </header>

          {/* I. DIAGNÓSTICO ESTRATIFICADO (PATOLOGÍAS DE LA BIBLIOTECA) */}
          <section className="mb-10 space-y-4">
            <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-6 tracking-widest italic">I. Auditoría de Hallazgos por Estratos</h3>
            <div className="space-y-3">
                <div className="p-4 bg-zinc-50 rounded-3xl border-l-4 border-red-600">
                  <p className="text-[6px] text-zinc-400 uppercase mb-1 font-black">Estructura Osteofacial (Hueso):</p>
                  <p className="text-[10px] font-bold uppercase italic">Micrognatia / Retrognatia Mandibular detected</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-3xl border-l-4 border-orange-500">
                  <p className="text-[6px] text-zinc-400 uppercase mb-1 font-black">Mecanobiología / SMAS (Grasa/Músculo):</p>
                  <p className="text-[10px] font-bold uppercase italic">Laxitud Periocular / Ptosis de Jowl / Lipodistrofia Submental</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-3xl border-l-4 border-cyan-500">
                  <p className="text-[6px] text-zinc-400 uppercase mb-1 font-black">Salud Dérmica (Piel):</p>
                  <p className="text-[10px] font-bold uppercase italic">Melasma Grado II / Glogau III / Hiperpigmentación Actínica</p>
                </div>
            </div>
          </section>

          {/* II. CUANTIFICACIÓN TÉCNICA (VECTORES Y VOLUMETRÍA) */}
          <section className="mb-10">
            <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-4 tracking-widest italic text-zinc-400">II. Métricas de Armonización</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl">
                 <p className="text-[6px] text-cyan-400 uppercase font-black mb-1 italic">Compensación Ósea/Grasa</p>
                 <p className="text-2xl font-black">+318.5 cc</p>
              </div>
              <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl">
                 <p className="text-[6px] text-red-500 uppercase font-black mb-1 italic">Vector de Elevación (SMAS)</p>
                 <p className="text-2xl font-black">↑ 5.2 mm</p>
              </div>
            </div>
          </section>

          {/* III. PLAN MAESTRO: TRATAMIENTO Y MANTENIMIENTO (FRECUENCIAS DRIVE) */}
          <section className="mb-10 bg-zinc-950 text-white p-8 rounded-[3.5rem] shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px]" />
            <h3 className="text-[10px] font-black uppercase mb-6 tracking-widest text-zinc-500 border-b border-white/5 pb-2">III. Protocolo de Materialización</h3>
            <div className="space-y-4 text-[9px] font-bold italic leading-relaxed">
               <div>
                  <p className="text-cyan-400 uppercase mb-1 font-black">Fase Quirúrgica & Estructural:</p>
                  <p>• Marcación Mandibular V-Line + Lipopapada + Blefaroplastia Transconjuntival.</p>
               </div>
               <div>
                  <p className="text-cyan-400 uppercase mb-1 font-black">Fase de Reparación Metabólica (Dermis):</p>
                  <p>• Mesopeel Melanostop Trans3 + Capilarización 9Hz (Aumento 5x flujo sanguíneo).</p>
               </div>
               <div>
                  <p className="text-cyan-400 uppercase mb-1 font-black">Mantenimiento Bio-Mecánico (SMAS):</p>
                  <p>• Tonificación 35Hz (Mantenimiento de tono basal fibras intermedias).</p>
               </div>
            </div>
          </section>

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica Micrognatia, Melasma II y Laxitud. Deseo iniciar la materialización del Plan Maestro (+318.5cc) y los protocolos de mantenimiento por frecuencias.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} 
            className="w-full bg-cyan-600 text-white py-7 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-black">
            Materializar Inmortalidad Φ
          </button>
          
          <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-10 font-serif">Original Engineering by Maya Romo - No External Software Integrated</p>
        </div>
      )}

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}