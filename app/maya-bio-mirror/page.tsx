"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV46() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [stage, setStage] = useState('');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.7; // VOZ MUY PAUSADA Y PROFESIONAL
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
    await speak("Bienvenido a Tiphereth. Iniciando análisis de bioingeniería. Mire fijamente al frente.");
    setStage("FRONTAL Φ");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 100)); }
    capture();

    await speak("Captura frontal exitosa. Ahora, gire lentamente su rostro hacia la izquierda.");
    setStage("PERFILOMETRÍA");
    await new Promise(r => setTimeout(r, 2000)); // PAUSA PARA GIRAR
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 100)); }
    capture();

    await speak("Perfil capturado. Finalmente, incline su barbilla hacia abajo para medir el arco mandibular.");
    setStage("CENITAL SMAS");
    await new Promise(r => setTimeout(r, 2000)); // PAUSA PARA INCLINAR
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 100)); }
    capture();

    await speak("Protocolo de captura completado. Procesando nube de puntos y capas multiespectrales.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 3000));
    setStep('lead');
  };

  const start = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) { videoRef.current.srcObject = s; runProtocol(s); }
    } catch (e) { alert("Error de cámara"); setStep('intro'); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-500 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] font-black tracking-[0.5em] mb-2 uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10 italic">Advanced 3D Station</p>
                <button onClick={start} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 shadow-2xl">Iniciar Escaneo</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-widest">{stage}</div>
              </>
            )}
            {(step === 'sync' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className="w-full h-full object-cover grayscale opacity-40 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom">
          <h3 className="text-[9px] font-black text-white uppercase tracking-widest text-center mb-4">Bio-Identidad del Paciente</h3>
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <input type="email" placeholder="EMAIL PARA REPORTE PDF" onChange={e => setUserData({...userData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <button onClick={() => setStep('report')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl">Compilar Auditoría Final</button>
        </div>
      )}

      {step === 'report' && photos.length > 0 && (
        <div className="bg-white text-black p-8 rounded-[3.5rem] w-full max-w-[450px] shadow-2xl animate-in zoom-in mb-20 border-[10px] border-zinc-100">
          <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4 font-black">
            <div className="text-[16px] italic leading-none text-cyan-600">TIPHERETH<br/><span className="text-black">HARMONY</span></div>
            <div className="text-right text-[7px] text-zinc-400 uppercase tracking-widest">Master Audit v46.0<br/>Canfield Standard</div>
          </header>

          {/* SIMULACIÓN VECTRA H2 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-inner">
               <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale brightness-110" />
               <p className="absolute bottom-2 left-2 text-[6px] font-black bg-black text-white px-2 py-0.5 rounded">ORIGINAL</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden ring-2 ring-cyan-500 shadow-xl">
               <img src={photos[0]} className="w-full h-full object-cover brightness-110 saturate-[0.6] contrast-125" />
               <div className="absolute inset-0 bg-cyan-400/10 mix-blend-overlay" />
               <p className="absolute bottom-2 left-2 text-[6px] font-black bg-cyan-600 text-white px-2 py-0.5 rounded">PROYECCIÓN Φ</p>
            </div>
          </div>

          {/* PANEL MULTIESPECTRAL VISIA RBX */}
          <p className="text-[8px] font-black text-center uppercase mb-4 tracking-[0.4em] italic border-t pt-4">Diagnóstico Multiespectral RBX®</p>
          <div className="grid grid-cols-4 gap-2 mb-8 text-center uppercase">
              <div className="space-y-1">
                  <img src={photos[0]} className="w-full aspect-square object-cover rounded-lg contrast-150 invert sepia" />
                  <p className="text-[5px] font-bold">Rojos (RBX)</p>
              </div>
              <div className="space-y-1">
                  <img src={photos[0]} className="rounded-lg brightness-50 contrast-[3] sepia" />
                  <p className="text-[5px] font-bold">Marrones (UV)</p>
              </div>
              <div className="space-y-1">
                  <img src={photos[0]} className="rounded-lg grayscale contrast-[5]" />
                  <p className="text-[5px] font-bold">Porosidad</p>
              </div>
              <div className="space-y-1">
                  <img src={photos[0]} className="rounded-lg saturate-[3] hue-rotate-180" />
                  <p className="text-[5px] font-bold">Laxitud</p>
              </div>
          </div>

          {/* MÉTRICAS DE INGENIERÍA */}
          <div className="bg-black text-white p-6 rounded-[2.5rem] mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/20 blur-3xl animate-pulse" />
             <p className="text-[7px] font-black text-cyan-400 uppercase text-center mb-4 tracking-widest italic">Ratios de Park e InBody Score</p>
             <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-black">
                <div className="border border-white/10 p-2"><p className="text-[5px] text-zinc-500">SUP</p>1.82</div>
                <div className="border border-white/10 p-2"><p className="text-[5px] text-zinc-500">MED</p>2.01</div>
                <div className="border border-cyan-500 p-2 text-red-500 animate-pulse"><p className="text-[5px]">INF</p>0.92</div>
             </div>
             <div className="mt-6 flex justify-between text-[7px] font-black border-t border-white/10 pt-4 uppercase">
                <span className="text-emerald-500 tracking-tighter italic">Bio-Edad: -4 Años</span>
                <span className="text-cyan-500 tracking-tighter">Simetría: 94.2%</span>
             </div>
          </div>

          {/* PLAN MAESTRO CUERPO Y ROSTRO */}
          <div className="bg-zinc-50 p-6 rounded-[2.5rem] mb-8 border border-zinc-100 space-y-3">
             <p className="text-[8px] font-black uppercase text-zinc-400 border-l-4 border-black pl-2">Vademécum de Ingeniería Sugerido</p>
             <ul className="text-[9px] font-bold text-zinc-700 space-y-1 italic leading-tight">
                <li>• Químico: Mesopeel Melanostop Trans3 (Mesoestetic)</li>
                <li>• Estructural: Park V-Line Mandibular Reduction</li>
                <li>• Corporal: Lipectomía HD 360 + Aumento Mamario (+320cc)</li>
             </ul>
          </div>

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Auditoría Tiphereth indica un déficit INF de 0.92 y requiero ajuste de +320cc en contorno corporal. Deseo proceder.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} 
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95 transition-all mb-4 hover:bg-cyan-600">
            Materializar Plan Maestro Φ
          </button>
        </div>
      )}

      <style jsx global>{` @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } } `}</style>
    </div>
  );
}