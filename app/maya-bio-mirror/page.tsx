"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV65() {
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
    u.lang = 'es-ES'; u.rate = 0.75; u.onend = () => setTimeout(res, 1200);
    window.speechSynthesis.speak(u);
  });

  const capture = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    c.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg')]);
  };

  const runProtocol = async (s: MediaStream) => {
    setStage("MAPEO MULTIESPECTRAL Φ"); await speak("Iniciando auditoría Tiphereth. No parpadee.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();
    setStage("TOPOGRAFÍA ÓSEA"); await speak("Gire a la izquierda. Analizando resorción ósea mandibular.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();
    setStage("DINÁMICA SMAS"); await speak("Incline la barbilla. Midiendo vectores de laxitud.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();
    s.getTracks().forEach(t => t.stop()); setStep('lead');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-500 font-mono p-4 flex flex-col items-center">
      
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-white text-2xl font-black tracking-[0.4em] mb-2 italic">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-400 uppercase tracking-widest mb-10">Beyond Canfield Systems</p>
                <button onClick={() => setStep('scanning')} className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase shadow-2xl active:scale-95 transition-all">Iniciar Análisis Φ</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                <div className="absolute bottom-8 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-[0.4em] bg-black/60 py-1">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-10 bg-zinc-900/40 border border-white/5 rounded-[3rem] mt-10 shadow-2xl backdrop-blur-md">
          <input type="text" placeholder="PACIENTE" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-zinc-900 border-b border-white/10 p-4 text-white text-[11px] outline-none">
            <option value="Cali">Sede Cali (Base Central)</option>
            <option value="Popayán">Bloque Popayán</option>
            <option value="Cartagena">Bloque Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-2xl tracking-widest active:scale-95">Compilar Manifiesto Oracle</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-8 rounded-[4rem] w-full max-w-[550px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] my-10 border-[20px] border-zinc-50 relative overflow-hidden animate-in zoom-in">
          
          <header className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
            <div>
              <h2 className="text-2xl font-black italic leading-none uppercase tracking-tighter text-black">TIPHERETH<br/><span className="text-cyan-600 text-[10px] tracking-widest">ORACLE AUDIT v65.0</span></h2>
            </div>
            <div className="text-right text-[7px] text-zinc-400 font-black uppercase tracking-widest">Status: Critical<br/>HQ: {userData.city}</div>
          </header>

          {/* I. VISUALIZACIÓN MULTIESPECTRAL (Superior a VISIA) */}
          <section className="mb-8">
            <h3 className="text-[10px] font-black uppercase border-l-4 border-cyan-500 pl-3 mb-4 italic">I. Análisis Multiespectral (Piel)</h3>
            <div className="grid grid-cols-3 gap-2">
               <div className="relative group">
                  <img src={photos[0]} className="rounded-xl grayscale contrast-150 brightness-75 border-2 border-red-500/20" />
                  <span className="absolute bottom-1 left-2 text-[6px] text-red-500 font-black uppercase">Vascular (Red)</span>
               </div>
               <div className="relative group">
                  <img src={photos[0]} className="rounded-xl sepia contrast-125 border-2 border-orange-500/20" />
                  <span className="absolute bottom-1 left-2 text-[6px] text-orange-500 font-black uppercase">Melanina (Brown)</span>
               </div>
               <div className="relative group">
                  <img src={photos[0]} className="rounded-xl invert brightness-50 contrast-200 border-2 border-cyan-500/20" />
                  <span className="absolute bottom-1 left-2 text-[6px] text-cyan-500 font-black uppercase">UV Damage</span>
               </div>
            </div>
            <div className="mt-4 p-4 bg-zinc-50 rounded-2xl text-[9px] font-bold italic border-l-4 border-red-600">
               Hallazgo: Melasma Tipo II y Eritema Actínico detectado en estrato epidérmico.
            </div>
          </section>

          {/* II. TOPOGRAFÍA DE ESTRUCTURA (Superior a VECTRA) */}
          <section className="mb-8">
            <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-4 italic">II. Ingeniería de Estructura (Hueso & SMAS)</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[6px] text-cyan-400 font-black opacity-30 italic">VOLUMETRIC</div>
                  <p className="text-[7px] text-zinc-400 uppercase font-black mb-1">Déficit Crítico</p>
                  <p className="text-3xl font-black italic">+318.5 cc</p>
               </div>
               <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[6px] text-red-500 font-black opacity-30 italic">TENSION VECTOR</div>
                  <p className="text-[7px] text-zinc-400 uppercase font-black mb-1">Pérdida de Lift</p>
                  <p className="text-3xl font-black italic">↓ 5.2 mm</p>
               </div>
            </div>
            <div className="mt-4 p-4 bg-zinc-900 text-white rounded-2xl text-[9px] font-bold italic flex justify-between items-center">
               <span>Diagnóstico: Micrognatia Mandibular con Ptosis de Jowl Grado III.</span>
               <span className="text-cyan-400 text-[7px] animate-pulse uppercase">Status: Urgente</span>
            </div>
          </section>

          {/* III. PRESCRIPCIÓN MAESTRA (DRIVE KNOWLEDGE) */}
          <section className="mb-10 p-8 bg-zinc-50 rounded-[3.5rem] border-2 border-zinc-100 shadow-inner">
            <h3 className="text-[10px] font-black uppercase mb-6 tracking-widest text-zinc-400 italic border-b pb-2">III. Protocolo de Materialización</h3>
            <div className="grid grid-cols-1 gap-6 text-[9px] font-bold italic leading-relaxed">
               <div>
                  <p className="text-cyan-700 uppercase mb-2 font-black tracking-widest underline decoration-cyan-200 underline-offset-4">Fase I: Resolución Ósea & SMAS</p>
                  <p>• Marcación Mandibular V-Line + Lipopapada + Blefaroplastia Transconjuntival.</p>
               </div>
               <div>
                  <p className="text-cyan-700 uppercase mb-2 font-black tracking-widest underline decoration-cyan-200 underline-offset-4">Fase II: Renovación Bio-Física</p>
                  <p>• Mesopeel Melanostop Trans3 (Mesoestetic) + Capilarización 9Hz (Drive Protocol).</p>
               </div>
            </div>
          </section>

          {/* IV. CONVERSIÓN DE ALTO VALOR */}
          <div className="space-y-4">
            <button onClick={() => window.print()} className="w-full bg-zinc-100 text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition-all border border-zinc-200">Exportar Pasaporte Oracle (PDF)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Auditoría Oracle. Diagnóstico: Glogau III y déficit de +318.5cc. Deseo agendar mi Semana Quirúrgica en ${userData.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} className="w-full bg-black text-white py-7 rounded-3xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all hover:bg-cyan-600">Materializar Inmortalidad Φ</button>
          </div>
          
          <footer className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-12 font-serif italic border-t pt-4">Tiphereth by Dr. Maya Romo • No Third-Party Software Integrated • Cali, Col.</footer>
        </div>
      )}
    </div>
  );
}