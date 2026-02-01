"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV67() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [prog, setProg] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [user, setUser] = useState({ name: '', city: 'Cali' });
  const [stage, setStage] = useState('');

  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((s) => { if (videoRef.current) { videoRef.current.srcObject = s; run(s); } })
        .catch(() => setStep('intro'));
    }
  }, [step]);

  const speak = (t: string) => new Promise(res => {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'es-ES'; u.rate = 0.75; u.onend = () => setTimeout(res, 1000);
    window.speechSynthesis.speak(u);
  });

  const cap = () => {
    const c = document.createElement('canvas');
    c.width = 1080; c.height = 1440;
    c.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
    setPhotos(prev => [...prev, c.toDataURL('image/jpeg')]);
  };

  const run = async (s: MediaStream) => {
    setStage("AUDITORÍA CROMÁTICA Φ"); await speak("Iniciando escaneo multiespectral. No parpadee.");
    for(let i=0; i<=33; i++) { setProg(i); await new Promise(r => setTimeout(r, 50)); }
    cap();
    setStage("TOPOGRAFÍA OSTEODÉRMICA"); await speak("Gire a la izquierda. Analizando resorción de la rama mandibular.");
    for(let i=34; i<=66; i++) { setProg(i); await new Promise(r => setTimeout(r, 80)); }
    cap();
    setStage("DINÁMICA DE LAXITUD"); await speak("Incline la barbilla. Evaluando vectores de tensión del SMAS.");
    for(let i=67; i<=100; i++) { setProg(i); await new Promise(r => setTimeout(r, 80)); }
    cap();
    s.getTracks().forEach(t => t.stop()); setStep('lead');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12 group animate-in zoom-in duration-500">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (prog * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-3xl font-black tracking-tighter italic mb-1 uppercase">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-400 uppercase tracking-[0.4em] mb-12">Oracle Master Engine</p>
                <button onClick={() => setStep('scanning')} className="bg-white text-black px-14 py-5 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all hover:tracking-widest active:scale-95">Iniciar Bio-Scan Φ</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_2px,transparent_2px)] bg-[size:100%_4px] animate-pulse" />
                <div className="absolute bottom-10 inset-x-0 text-center uppercase text-[7px] font-black text-cyan-400 tracking-[0.5em] bg-black/60 py-2">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[360px] space-y-4 p-12 bg-zinc-900/40 border border-white/5 rounded-[3.5rem] mt-10 shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom">
          <h3 className="text-[10px] font-black text-white uppercase text-center border-b border-white/5 pb-6 tracking-[0.3em]">Registro de Paciente</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase tracking-widest" />
          <select onChange={e => setUser({...user, city: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none font-bold">
            <option value="Cali">Sede Cali (HQ)</option>
            <option value="Popayán">Semana Quirúrgica Popayán</option>
            <option value="Cartagena">Semana Quirúrgica Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl mt-4">Compilar Oracle Report</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[700px] shadow-[0_60px_120px_rgba(0,0,0,0.6)] my-10 border-[20px] border-zinc-100 relative overflow-hidden font-sans animate-in slide-in-from-bottom duration-1000">
          
          {/* SECCIÓN A: CABECERA MÉDICA */}
          <header className="flex justify-between items-end mb-12 border-b-8 border-black pb-8">
            <div className="leading-none">
              <h2 className="text-5xl font-black italic tracking-tighter text-black uppercase">TIPHERETH</h2>
              <p className="text-[12px] font-black text-cyan-600 uppercase tracking-[0.5em] ml-1">Structural Engineering Station</p>
            </div>
            <div className="text-right text-[9px] text-zinc-400 font-black uppercase leading-tight tracking-[0.2em]">
              CERTIFICATE: MASTER ORACLE<br/>
              DIRECTOR: DR. MAYA ROMO<br/>
              LOCATION: {user.city.toUpperCase()}
            </div>
          </header>

          {/* SECCIÓN B: ANÁLISIS MULTIESPECTRAL (KILLER VISIA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div>
              <h3 className="text-[12px] font-black uppercase border-l-8 border-cyan-500 pl-4 mb-6 italic tracking-tighter italic">01. Auditoría Cromática (Epidermis)</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-100 shadow-sm">
                    <img src={photos[0]} className="w-full h-32 object-cover grayscale contrast-[200%] brightness-75 invert" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[6px] px-2 py-0.5 rounded font-black uppercase">Hemoglobin-X</div>
                 </div>
                 <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-100 shadow-sm">
                    <img src={photos[0]} className="w-full h-32 object-cover sepia contrast-[150%] brightness-50" />
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-[6px] px-2 py-0.5 rounded font-black uppercase">Melanin-Y</div>
                 </div>
              </div>
              <div className="space-y-4 text-[10px] font-bold italic text-zinc-800 leading-tight">
                <p className="flex justify-between border-b pb-1"><span>Indice Glogau:</span> <span className="text-red-600">Grado III (Fotoenvejecimiento)</span></p>
                <p className="flex justify-between border-b pb-1"><span>Melasma Actínico:</span> <span className="text-cyan-600">Tipo II (Dérmico)</span></p>
                <p className="flex justify-between border-b pb-1"><span>Capilarización:</span> <span className="text-red-600">Déficit Crítico</span></p>
              </div>
            </div>

            {/* SECCIÓN C: INGENIERÍA DE PROYECCIÓN (KILLER VECTRA/CRISALIX) */}
            <div>
              <h3 className="text-[12px] font-black uppercase border-l-8 border-black pl-4 mb-6 italic tracking-tighter italic">02. Topografía Estructural (Plano Óseo)</h3>
              <div className="bg-zinc-950 text-white p-8 rounded-[3.5rem] shadow-2xl mb-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
                <p className="text-[8px] text-zinc-500 uppercase font-black mb-4 tracking-widest italic">Análisis de Resorción Mandibular</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-cyan-400 uppercase italic">Déficit Volumétrico</p>
                    <p className="text-5xl font-black italic tracking-tighter">+318.5 <span className="text-xs">cc</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-red-500 uppercase italic">Caída Vectorial</p>
                    <p className="text-5xl font-black italic tracking-tighter">↓ 5.2 <span className="text-xs">mm</span></p>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 text-[10px] font-black italic text-center text-zinc-500 uppercase">
                Patología: Micrognatia con Ptosis de Jowl Nivel 2
              </div>
            </div>
          </div>

          {/* SECCIÓN D: PRESCRIPCIÓN DE INGENIERÍA (DRIVE CONTENT) */}
          <section className="mb-14 p-12 bg-zinc-900 text-white rounded-[5rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative">
             <div className="absolute top-6 right-10 text-cyan-500 text-[9px] font-black italic uppercase tracking-[0.3em]">Plan Maestro Materializado</div>
             <h3 className="text-[14px] font-black uppercase mb-10 tracking-[0.2em] text-white border-b border-white/10 pb-4 italic">III. Protocolo de Re-Ingeniería</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-[10px] font-bold italic leading-relaxed">
                <div className="space-y-4">
                   <p className="text-cyan-400 uppercase text-[12px] font-black underline underline-offset-8 decoration-cyan-900 mb-4 tracking-tighter">Fase 1: Estructura & Soporte</p>
                   <p className="text-zinc-300">• Marcación V-Line Mandibular (Resolución de Micrognatia).<br/>• Lipopapada Laser para definición de ángulo cervical.<br/>• Blefaroplastia Superior (Mantenimiento Periocular).</p>
                </div>
                <div className="space-y-4">
                   <p className="text-cyan-400 uppercase text-[12px] font-black underline underline-offset-8 decoration-cyan-900 mb-4 tracking-tighter">Fase 2: Biomecánica & Dermis</p>
                   <p className="text-zinc-300">• Firmeza Muscular 35Hz (Recuperación de Tono Basal).<br/>• Capilarización 9Hz (Oxigenación Crítica de Estrato Basal).<br/>• Mesopeel Melanostop Trans3 (Mesoestetic Protocol).</p>
                </div>
             </div>
          </section>

          {/* SECCIÓN E: CONVERSIÓN DE ALTO VALOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="bg-zinc-100 text-black py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-sm">Exportar Oracle Master Archive (PDF)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${user.name.toUpperCase()}. He recibido mi Auditoría Master Oracle. Mi diagnóstico indica Glogau III, Micrognatia y déficit de +318.5cc. Deseo iniciar la materialización en su sede de ${user.city}.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} 
              className="bg-black text-white py-6 rounded-[2.5rem] font-black text-[15px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 hover:scale-[1.02] transition-all">
              Materializar Inmortalidad Φ
            </button>
          </div>
          
          <footer className="text-center text-[8px] text-zinc-400 uppercase tracking-[0.6em] mt-16 italic border-t pt-8 border-zinc-100">
            Tiphereth Bio-Systems • No Third-Party Software Integrated • Maya Romo Engineering • 2026
          </footer>
        </div>
      )}
    </div>
  );
}