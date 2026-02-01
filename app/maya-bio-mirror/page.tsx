"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV64() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', city: 'Cali' });
  const [stage, setStage] = useState('');

  // 1. REPARACIÓN DE CÁMARA: Aseguramos flujo de video al entrar en scanning
  useEffect(() => {
    if (step === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            runProtocol(stream);
          }
        })
        .catch(() => { alert("Error: Cámara no detectada."); setStep('intro'); });
    }
  }, [step]);

  const speak = (text: string) => {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.75;
      u.onend = () => setTimeout(resolve, 1500);
      window.speechSynthesis.speak(u);
    });
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
    setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
  };

  const runProtocol = async (stream: MediaStream) => {
    setStage("MATRIZ FRONTAL Φ");
    await speak("Iniciando auditoría Tiphereth. Mire al frente.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    capture();
    
    setStage("PERFILOMETRÍA");
    await speak("Gire a la izquierda. Analizando soporte óseo.");
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();
    
    setStage("VECTORES SMAS");
    await speak("Incline la barbilla. Evaluando laxitud.");
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 90)); }
    capture();

    stream.getTracks().forEach(t => t.stop());
    setStep('lead');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-mono p-4 flex flex-col items-center">
      
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] m-[6%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-[0_0_40px_#06b6d4]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-xl font-black tracking-widest italic mb-2">TIPHERETH</h1>
                <p className="text-[7px] text-cyan-500 uppercase tracking-widest mb-8 italic">DR. MAYA ROMO</p>
                <button onClick={() => setStep('scanning')} className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all hover:bg-cyan-400">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                <div className="absolute bottom-8 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-widest">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-10 bg-zinc-900/40 border border-white/10 rounded-[3rem] mt-10 shadow-2xl backdrop-blur-md">
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[12px] outline-none font-black uppercase" />
          <select onChange={e => setUserData({...userData, city: e.target.value})} className="w-full bg-zinc-900 border-b border-white/10 p-4 text-white text-[11px] outline-none">
            <option value="Cali">Sede Cali (Base)</option>
            <option value="Popayán">Sede Popayán</option>
            <option value="Cartagena">Sede Cartagena</option>
          </select>
          <button onClick={() => setStep('report')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl">Generar Auditoría Final</button>
        </div>
      )}

      {step === 'report' && (
        <div id="capture-area" className="bg-white text-black p-10 rounded-[4rem] w-full max-w-[500px] shadow-2xl my-10 border-[15px] border-zinc-100 relative overflow-hidden animate-in zoom-in">
          <header className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
            <div className="text-[18px] font-black italic uppercase leading-none text-cyan-600">TIPHERETH<br/><span className="text-black text-[12px]">Clinical Engineering Report</span></div>
            <div className="text-right text-[7px] text-zinc-400 uppercase tracking-widest">Master Audit v64.0</div>
          </header>

          <section className="mb-8 space-y-4">
            <h3 className="text-[10px] font-black uppercase border-l-4 border-black pl-3 mb-4 italic">I. Hallazgos por Estratos Biológicos</h3>
            <div className="p-4 bg-zinc-50 rounded-2xl border-l-8 border-red-600 shadow-sm">
                <p className="text-[6px] text-zinc-400 uppercase font-black mb-1">Hueso / Plano Osteofacial:</p>
                <p className="text-[10px] font-bold">MICROGNATIA / RETROGNATIA MANDIBULAR</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border-l-8 border-cyan-500 shadow-sm">
                <p className="text-[6px] text-zinc-400 uppercase font-black mb-1">Piel / Dermis:</p>
                <p className="text-[10px] font-bold">MELASMA G-II / ESCALA GLOGAU III</p>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black text-white p-6 rounded-[2.5rem] text-center shadow-lg">
               <p className="text-[7px] text-cyan-400 uppercase font-black mb-1">Déficit Volumen</p>
               <p className="text-xl font-black">+318.5 cc</p>
            </div>
            <div className="bg-black text-white p-6 rounded-[2.5rem] text-center shadow-lg">
               <p className="text-[7px] text-red-500 uppercase font-black mb-1">Vector Lift</p>
               <p className="text-xl font-black">↑ 5.2 mm</p>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => window.print()} className="w-full bg-zinc-100 text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest border border-zinc-200">Descargar Manifiesto (PDF)</button>
            <button onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth en ${userData.city} indica Micrognatia y déficit de +318.5cc. Deseo proceder.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }} className="w-full bg-black text-white py-6 rounded-2xl font-black text-[12px] uppercase shadow-2xl transition-all hover:bg-cyan-600">Materializar Inmortalidad Φ</button>
          </div>
          
          <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest mt-10 italic border-t pt-4">© 2026 Tiphereth Master Station • Dr. Maya Romo</p>
        </div>
      )}
    </div>
  );
}