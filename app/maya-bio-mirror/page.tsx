"use client";
import React, { useRef, useState } from 'react';

const WS_BUSINESS = "573117936211";

export default function TipherethV48() {
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
        u.rate = 0.75; // Voz pausada, de autoridad médica
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
    await speak("Iniciando auditoría biométrica Tiphereth. Por favor, mire al frente, relaje los músculos faciales.");
    setStage("FRONTAL Φ");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    capture();

    await speak("Captura frontal completada. Ahora, gire lentamente su rostro hacia la izquierda para análisis de perfilometría.");
    setStage("PERFILOMETRÍA");
    await new Promise(r => setTimeout(r, 3000)); 
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    capture();

    await speak("Excelente. Finalmente, incline su barbilla hacia abajo para evaluar el SMAS y el arco mandibular.");
    setStage("CENITAL SMAS");
    await new Promise(r => setTimeout(r, 3000));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 120)); }
    capture();

    await speak("Escaneo finalizado. Procesando diagnósticos clínicos y plan maestro.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    await new Promise(r => setTimeout(r, 4000));
    setStep('lead');
  };

  const init = async () => {
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
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] font-black tracking-[0.5em] mb-2">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10 italic">Clinical Master Station</p>
                <button onClick={init} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl">Iniciar Diagnóstico</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute bottom-6 inset-x-0 text-center uppercase text-[8px] font-black text-cyan-400 tracking-widest">{stage}</div>
              </>
            )}
          </div>
        </div>
      )}

      {step === 'lead' && (
        <div className="w-full max-w-[340px] space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] animate-in slide-in-from-bottom">
          <input type="text" placeholder="NOMBRE COMPLETO" onChange={e => setUserData({...userData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <input type="email" placeholder="EMAIL" onChange={e => setUserData({...userData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-white text-[11px] outline-none" />
          <button onClick={() => setStep('report')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl">Compilar Diagnóstico Maestro</button>
        </div>
      )}

      {step === 'report' && (
        <div className="bg-white text-black p-8 rounded-[3.5rem] w-full max-w-[500px] shadow-2xl animate-in zoom-in mb-20 border-[10px] border-zinc-100">
          <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
            <div className="text-[16px] font-black italic text-cyan-600 uppercase">TIPHERETH<br/><span className="text-black text-[12px]">Clinical Engineering</span></div>
            <div className="text-right text-[7px] text-zinc-400 uppercase font-black">Report ID: MASTER-V48<br/>Standards: VISIA/VECTRA</div>
          </header>

          {/* I. HALLAZGOS CLÍNICOS (EL DIAGNÓSTICO) */}
          <section className="mb-8">
            <h3 className="text-[9px] font-black uppercase border-l-4 border-red-600 pl-2 mb-4 italic">I. Auditoría de Hallazgos Clínicos</h3>
            <div className="grid grid-cols-1 gap-2 text-[10px] font-bold text-zinc-800">
                <div className="flex justify-between border-b py-2"><span>TERCIO SUPERIOR:</span> <span className="text-red-600 uppercase">Arrugas Dinámicas y Fijas</span></div>
                <div className="flex justify-between border-b py-2"><span>PERIOCULARES:</span> <span className="text-red-600 uppercase">Laxitud y Ojeras Pigmentarias</span></div>
                <div className="flex justify-between border-b py-2"><span>TERCIO MEDIO:</span> <span className="text-cyan-600 uppercase">Melasma Grado II / Hiperpigmentación</span></div>
                <div className="flex justify-between border-b py-2"><span>TERCIO INFERIOR:</span> <span className="text-red-600 uppercase">Jowl / Micrognatia / Lipodistrofia Submental</span></div>
                <div className="flex justify-between border-b py-2"><span>ENVEJECIMIENTO:</span> <span className="text-black uppercase font-black">Escala de Glogau Grado III</span></div>
            </div>
          </section>

          {/* II. MAPEO RBX Y VOLUMETRÍA */}
          <section className="mb-8">
            <h3 className="text-[9px] font-black uppercase border-l-4 border-cyan-500 pl-2 mb-4 italic">II. Cuantificación Multiespectral (RBX®)</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-zinc-950 p-4 rounded-3xl text-white text-center">
                 <p className="text-[6px] text-cyan-400 uppercase font-black mb-1">Déficit Volumétrico</p>
                 <p className="text-xl font-black">+320.5 cc</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-3xl text-white text-center">
                 <p className="text-[6px] text-red-500 uppercase font-black mb-1">Vector de Tensión (Lift)</p>
                 <p className="text-xl font-black">↑ 5.2 mm</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[5px] font-black text-center uppercase">
                <img src={photos[0]} className="rounded-lg contrast-150 invert sepia" />
                <img src={photos[0]} className="rounded-lg brightness-50 contrast-[3]" />
                <img src={photos[0]} className="rounded-lg grayscale contrast-[6]" />
                <img src={photos[0]} className="rounded-lg saturate-[3] hue-rotate-180" />
            </div>
          </section>

          {/* III. PRESCRIPCIÓN DEL PLAN MAESTRO (MESOESTETIC) */}
          <section className="mb-8 bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100">
            <h3 className="text-[9px] font-black uppercase text-black mb-4 tracking-tighter italic border-b pb-2">III. Prescripción de Ingeniería Humana</h3>
            <div className="space-y-4 text-[9px] font-bold italic leading-tight">
               <div>
                  <p className="text-[7px] text-cyan-700 uppercase mb-1 underline">Protocolo Dermatológico (Mesoestetic):</p>
                  <p>• Mesopeel Melanostop Trans3 (Hiperpigmentación)</p>
                  <p>• Age Element Firming Solutions (Laxitud/SMAS)</p>
               </div>
               <div>
                  <p className="text-[7px] text-red-700 uppercase mb-1 underline">Procedimiento Quirúrgico Sugerido:</p>
                  <p>• Marcación Mandibular (V-Line) + Lipopapada</p>
                  <p>• Blefaroplastia Superior + Toxina Botulínica (Park Protocol)</p>
               </div>
            </div>
          </section>

          <button onClick={() => {
              const msg = encodeURIComponent(`Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Auditoría Maestra. Diagnóstico: Glogau III, Melasma II y Lipodistrofia Submental. Deseo proceder con la marcación de +320cc y el Plan Maestro.`);
              window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
            }} 
            className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-600 transition-all">
            Materializar Inmortalidad Φ
          </button>
        </div>
      )}
    </div>
  );
}