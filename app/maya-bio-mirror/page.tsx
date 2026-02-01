"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'report';

export default function TipherethV45() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [stage, setStage] = useState('INICIALIZANDO');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const startProtocol = async () => {
    setStep('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      await speak("Iniciando escaneo biométrico. Por favor, mantenga el rostro al frente.");
      setStage("FRONTAL Φ");
      for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
      capture();

      await speak("Gire lentamente a la izquierda. Analizando perfilometría.");
      setStage("PERFIL IZQ");
      for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
      capture();

      await speak("Incline el rostro hacia abajo. Evaluando tensión mandibular.");
      setStage("CENITAL SMAS");
      for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
      capture();

      stream.getTracks().forEach(t => t.stop());
      setStep('sync');
      await new Promise(r => setTimeout(r, 2000));
      setStep('lead');
    } catch (e) { alert("Error de cámara"); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD DE COMANDO */}
      {step !== 'report' && (
        <div className="relative w-72 h-72 my-12 animate-in zoom-in duration-500">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[90%] h-[90%] m-[5%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-white text-[14px] font-black tracking-[0.4em] uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase mb-8">Clinical Bio-Engine</p>
                <button onClick={startProtocol} className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-60" />
            )}
            {step === 'sync' && <div className="absolute inset-0 flex items-center justify-center text-[8px] animate-pulse text-cyan-400 font-black">CALCULANDO VECTORES...</div>}
          </div>
        </div>
      )}

      {/* REGISTRO */}
      {step === 'lead' && (
        <div className="w-full max-w-[320px] space-y-4 p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-bottom">
          <input type="text" placeholder="NOMBRE" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-3 text-white text-[11px] outline-none" />
          <input type="email" placeholder="EMAIL" onChange={e => setUserData({...userData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-3 text-white text-[11px] outline-none" />
          <button onClick={() => setStep('report')} className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase">Ver Auditoría Completa</button>
        </div>
      )}

      {/* EL REPORTE ABSOLUTO (SUPERIOR A VISIA) */}
      {step === 'report' && photos.length > 0 && (
        <div className="bg-white text-black p-8 rounded-[3.5rem] w-full max-w-[500px] shadow-2xl animate-in fade-in duration-1000 mb-20 border-[12px] border-zinc-100">
          
          <header className="flex justify-between items-start mb-10 border-b-4 border-black pb-4">
            <div>
              <h2 className="font-black text-2xl italic text-cyan-600">TIPHERETH</h2>
              <p className="text-[7px] font-bold tracking-widest uppercase">Clinical Engineering Passport</p>
            </div>
            <div className="text-right text-[6px] font-black leading-tight">STATION ID: BOG-MASTER<br/>DATE: 01/02/2026</div>
          </header>

          {/* I. PROYECCIÓN COMPARATIVA (CRISALIX/VECTRA) */}
          <section className="mb-10">
            <h3 className="text-[9px] font-black uppercase border-l-4 border-black pl-2 mb-4">I. Simulación de Armonización 3D</h3>
            <div className="grid grid-cols-2 gap-2 h-64">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-200">
                <img src={photos[0]} className="w-full h-full object-cover grayscale brightness-90" />
                <span className="absolute bottom-2 left-2 bg-black text-white text-[5px] px-2 py-1 rounded">ESTADO ACTUAL</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-cyan-100 ring-2 ring-cyan-500">
                <img src={photos[0]} className="w-full h-full object-cover brightness-110 contrast-125 saturate-[0.7]" />
                <div className="absolute inset-0 bg-cyan-400/10 mix-blend-overlay" />
                <span className="absolute bottom-2 left-2 bg-cyan-600 text-white text-[5px] px-2 py-1 rounded">PROYECCIÓN Φ</span>
              </div>
            </div>
          </section>

          {/* II. DASHBOARD MULTIESPECTRAL (VISIA RBX) */}
          <section className="mb-10">
            <h3 className="text-[9px] font-black uppercase border-l-4 border-red-600 pl-2 mb-4">II. Diagnóstico Multiespectral RBX®</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="text-center">
                <img src={photos[0]} className="rounded-lg contrast-150 invert sepia hue-rotate-180" />
                <p className="text-[5px] font-black mt-1 uppercase">Hemoglobina</p>
              </div>
              <div className="text-center">
                <img src={photos[0]} className="rounded-lg brightness-50 contrast-[2.5] sepia" />
                <p className="text-[5px] font-black mt-1 uppercase">Melanina</p>
              </div>
              <div className="text-center">
                <img src={photos[0]} className="rounded-lg grayscale contrast-[6]" />
                <p className="text-[5px] font-black mt-1 uppercase">Textura</p>
              </div>
              <div className="text-center">
                <img src={photos[0]} className="rounded-lg saturate-[3] brightness-75 hue-rotate-90" />
                <p className="text-[5px] font-black mt-1 uppercase">Daño UV</p>
              </div>
            </div>
            
            {/* PERCENTILES COMPARATIVOS (NEUROVENTAS) */}
            <div className="bg-black text-white p-6 rounded-[2rem] space-y-4">
              <p className="text-[7px] font-black text-cyan-400 text-center uppercase tracking-widest">Score de Integridad Biológica</p>
              {[
                { label: 'Puntos Marrones (UV)', score: 38, color: 'bg-red-500' },
                { label: 'Integridad SMAS', score: 92, color: 'bg-emerald-500' },
                { label: 'Ratio de Park', score: 45, color: 'bg-red-600' }
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[6px] font-bold mb-1 uppercase"><span>{item.label}</span><span>{item.score}%</span></div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full"><div className={`h-full ${item.color} ${item.score < 50 ? 'animate-pulse' : ''}`} style={{ width: `${item.score}%` }} /></div>
                </div>
              ))}
            </div>
          </section>

          {/* III. MÉTRICAS QUIRÚRGICAS Y VOLUMETRÍA */}
          <section className="mb-10">
            <h3 className="text-[9px] font-black uppercase border-l-4 border-cyan-500 pl-2 mb-4">III. Cuantificación de Escultura</h3>
            <div className="grid grid-cols-2 gap-4 text-center font-black">
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <p className="text-[6px] text-zinc-400 uppercase mb-2">Volumen Proyectado</p>
                <p className="text-3xl font-black text-cyan-600">+315<span className="text-sm">cc</span></p>
              </div>
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <p className="text-[6px] text-zinc-400 uppercase mb-2">Vector de Tensión</p>
                <p className="text-3xl font-black text-red-600">↑ 5.2<span className="text-sm">mm</span></p>
              </div>
            </div>
          </section>

          {/* IV. PLAN MAESTRO MESOESTETIC */}
          <section className="mb-10 bg-cyan-50 p-6 rounded-[2.5rem] border-2 border-cyan-100">
            <h3 className="text-[9px] font-black uppercase text-cyan-800 mb-4 tracking-tighter italic">IV. Prescripción Médica de Ingeniería</h3>
            <ul className="text-[8.5px] font-bold space-y-3 list-disc pl-4 text-zinc-700">
              <li><span className="text-black uppercase">Quirúrgico:</span> Mastopexia de aumento + Lipoescultura HD 360 + Lipectomía de tensión.</li>
              <li><span className="text-black uppercase">Skin Protocol:</span> Mesopeel Melanostop Trans3 + Mesopeel Glycolic.</li>
              <li><span className="text-black uppercase">Mantenimiento:</span> Age Element Firming System + AOX Ferulic.</li>
            </ul>
          </section>

          <button onClick={() => {
            const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica un percentil crítico en Ratios de Park (45%) y un déficit volumétrico de +315cc. Deseo agendar mi intervención.`);
            window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
          }} className="w-full bg-black text-white py-7 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95">
            Materializar Inmortalidad Φ
          </button>
        </div>
      )}

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}