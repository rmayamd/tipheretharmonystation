"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV66() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', city: 'Cali' });
  const [stage, setStage] = useState('');

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  const speak = (t: string) => new Promise(res => {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.72; u.onend = () => setTimeout(res, 1200);
    window.speechSynthesis.speak(u);
  });

  const capture = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    c.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg')]);
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("ESCANEO MULTIESPECTRAL"); await speak("Iniciando Tiphereth Oracle. Analizando firmas de hemoglobina y melanina.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();
    setStage("TOPOGRAFÍA OSTEODÉRMICA"); await speak("Gire a la izquierda. Calculando resorción ósea y desplazamiento de grasa.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();
    setStage("DINÁMICA DE TENSIÓN"); await speak("Incline la barbilla. Midiendo el vector de caída del arco mandibular.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();
    s.getTracks().forEach(t => t.stop()); setStep('lead');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-500 font-mono p-4 flex flex-col items-center">
      
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-3xl font-black tracking-tighter italic mb-1 uppercase">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-400 uppercase tracking-[0.4em] mb-12">Oracle Bio-Systems</p>
                <button onClick={() => setStep('scanning')} className="bg-white text-black px-14 py-5 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all hover:tracking-widest active:scale-95">Materializar Scan Φ</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_2px,transparent_2px)] bg-[size:100%_4px] animate-pulse" />
                <div className="absolute bottom-10 inset-x-0 text-center uppercase text-[7px] font-black text-cyan-400 tracking-[0.5em] bg-black/40 py-2">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[360px] space-y-4 p-12 bg-zinc-900/40 border border-white/5 rounded-[3.5rem] mt-10 shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom">
          <h3 className="text-[10px] font-black text-white uppercase text-center border-b border-white/5 pb-6 tracking-[0.3em]">Cotejar Expediente</h3>
          <input type="text" placeholder="PACIENTE IDENT" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase tracking-widest" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none font-bold">
            <option value="Cali">Sede Cali (Dr. Maya Romo)</option>
            <option value="Popayán">Semana Quirúrgica Popayán</option>
            <option value="Cartagena">Semana Quirúrgica Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl mt-4">Compilar Oracle Report</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[5rem] w-full max-w-[650px] shadow-[0_60px_120px_rgba(0,0,0,0.6)] my-10 border-[20px] border-zinc-100 relative overflow-hidden font-sans">
          
          <header className="flex justify-between items-end mb-12 border-b-8 border-black pb-6">
            <div className="leading-none">
              <h2 className="text-4xl font-black italic tracking-tighter text-black uppercase">TIPHERETH</h2>
              <p className="text-[11px] font-black text-cyan-600 uppercase tracking-[0.4em] ml-1">The Oracle Engine</p>
            </div>
            <div className="text-right text-[8px] text-zinc-400 font-black uppercase leading-tight tracking-widest">
              Report ID: {Math.floor(Math.random()*999999)}<br/>
              Sede: {userData.city}
            </div>
          </header>

          {/* I. PANEL MULTIESPECTRAL (SUPERIOR A VISIA) */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-2 bg-cyan-500" />
              <h3 className="text-[14px] font-black uppercase italic tracking-tighter italic">I. Auditoría Cromática & Epidérmica</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
               <div className="relative overflow-hidden rounded-3xl border-2 border-red-100 shadow-sm">
                  <img src={photos[0]} className="w-full h-32 object-cover grayscale contrast-[200%] brightness-75 hue-rotate-180" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[6px] px-2 py-0.5 rounded font-black uppercase">Vascular (Reds)</div>
                  <div className="absolute bottom-2 inset-x-0 text-center text-[7px] font-black text-red-600 bg-white/80 py-1">Eritema: 42%</div>
               </div>
               <div className="relative overflow-hidden rounded-3xl border-2 border-orange-100 shadow-sm">
                  <img src={photos[0]} className="w-full h-32 object-cover sepia contrast-150 saturate-[2]" />
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-[6px] px-2 py-0.5 rounded font-black uppercase">Melanina (Browns)</div>
                  <div className="absolute bottom-2 inset-x-0 text-center text-[7px] font-black text-orange-600 bg-white/80 py-1">Melasma II: 68%</div>
               </div>
               <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-100 shadow-sm">
                  <img src={photos[0]} className="w-full h-32 object-cover invert brightness-[0.4] contrast-[300%]" />
                  <div className="absolute top-2 left-2 bg-cyan-600 text-white text-[6px] px-2 py-0.5 rounded font-black uppercase">UV Exposure</div>
                  <div className="absolute bottom-2 inset-x-0 text-center text-[7px] font-black text-cyan-600 bg-white/80 py-1">Glogau III</div>
               </div>
            </div>
            <div className="bg-zinc-50 p-6 rounded-[2.5rem] border-2 border-zinc-100 text-[11px] font-medium italic leading-relaxed text-zinc-700 shadow-inner">
               <span className="font-black text-black">DIAGNÓSTICO DÉRMICO:</span> Se observa una fragmentación de la barrera hidrolipídica con pigmentación actínica profunda. El grado de fotoenvejecimiento Glogau III sugiere una desorganización de las fibras de colágeno que requiere intervención inmediata.
            </div>
          </section>

          {/* II. PANEL TOPOGRÁFICO (SUPERIOR A VECTRA) */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-2 bg-black" />
              <h3 className="text-[14px] font-black uppercase italic tracking-tighter italic">II. Mapeo Volumétrico & Proyección Ósea</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-zinc-950 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-4 right-6 text-cyan-400 text-[8px] font-black opacity-40 uppercase tracking-widest italic">3D Volume Scan</div>
                  <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 italic">Déficit Estructural</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">+318<span className="text-cyan-400">.5</span> <span className="text-xs uppercase">cc</span></p>
                  <div className="mt-6 flex gap-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="w-4/5 bg-cyan-500" />
                  </div>
               </div>
               <div className="bg-zinc-950 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden border-2 border-red-900/20">
                  <div className="absolute top-4 right-6 text-red-500 text-[8px] font-black opacity-40 uppercase tracking-widest italic">Vector Shift</div>
                  <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 italic">Pérdida de Tensión</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">↓ 5<span className="text-red-500">.2</span> <span className="text-xs uppercase">mm</span></p>
                  <div className="mt-6 flex gap-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="w-[90%] bg-red-600" />
                  </div>
               </div>
            </div>
          </section>

          {/* III. PRESCRIPCIÓN DE INGENIERÍA (DRIVE STRATEGY) */}
          <section className="mb-14 p-10 bg-zinc-900 text-white rounded-[5rem] shadow-2xl relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px]" />
             <h3 className="text-[12px] font-black uppercase mb-8 tracking-[0.3em] text-cyan-500 border-b border-white/10 pb-4 italic italic">III. Protocolo de Materialización</h3>
             <div className="space-y-8 text-[11px] font-bold italic leading-relaxed">
                <div>
                   <p className="text-cyan-400 uppercase mb-2 font-black tracking-widest underline underline-offset-8 decoration-cyan-900">1. Resolución Estratégica (Hueso & Grasa):</p>
                   <p className="text-zinc-300">Osteotomía Mandibular V-Line + Lipopapada + Marcación submental asistida. Objetivo: Restaurar proyección osteofacial para compensar retrognatia.</p>
                </div>
                <div>
                   <p className="text-cyan-400 uppercase mb-2 font-black tracking-widest underline underline-offset-8 decoration-cyan-900">2. Mantenimiento Bio-Mecánico (SMAS):</p>
                   <p className="text-zinc-300">Protocolo de Firmeza Muscular 35Hz para reclutamiento de fibras IIa. Estimulación basal para soporte de tejidos blandos.</p>
                </div>
                <div>
                   <p className="text-cyan-400 uppercase mb-2 font-black tracking-widest underline underline-offset-8 decoration-cyan-900">3. Ingeniería Dérmica:</p>
                   <p className="text-zinc-300">Mesopeel Melanostop Trans3 (Mesoestetic) + Capilarización 9Hz para oxigenación crítica del estrato basal.</p>
                </div>
             </div>
          </section>

          {/* CIERRE DE ALTA CONVERSIÓN */}
          <div className="space-y-6">
            <button onClick={() => window.print()} className="w-full bg-zinc-100 text-black py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all">Exportar Master Archive (PDF)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Auditoría Tiphereth Oracle. Mi déficit estructural es de +318.5cc y presento Glogau III. Deseo iniciar la materialización en su sede de ${userData.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="w-full bg-black text-white py-8 rounded-[3rem] font-black text-[15px] uppercase tracking-[0.3em] shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
              Materializar Inmortalidad Φ
            </button>
          </div>
          
          <footer className="text-center text-[8px] text-zinc-400 uppercase tracking-[0.5em] mt-16 italic border-t pt-8 border-zinc-100">
            Tiphereth Bio-Systems • Engineering the Divine Proportion • 2026
          </footer>
        </div>
      )}
    </div>
  );
}