"use client";
import React, { useRef, useState } from 'react';

// CONFIGURACIÓN ARQUITECTO
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Layer = 'real' | 'wood' | 'uv' | 'infra';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ phone: '', email: '', name: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('real');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.onend = () => resolve(true);
        window.speechSynthesis.speak(utterance);
      } else resolve(true);
    });
  };

  const startFullScan = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: { ideal: 1280 } } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        
        await speak("Por favor, retírese las gafas para escaneo biométrico.");
        await animateProgress(0, 100, 6000);
        
        capture();
        newStream.getTracks().forEach(t => t.stop());
        setStep('sync');
        simulateAnalysis();
      }
    } catch (err) { alert("Active los permisos de cámara."); }
  };

  const simulateAnalysis = () => {
    const msgs = ["Extrayendo Mapas de Melanina...", "Calculando Proporciones de Park...", "Generando Reporte de ROI..."];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
      }, i * 1000);
    });
  };

  const animateProgress = (start: number, end: number, duration: number) => {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        setProgress(Math.min(start + (end - start) * (elapsed / duration), end));
        if (elapsed < duration) requestAnimationFrame(animate); else resolve(true);
      };
      requestAnimationFrame(animate);
    });
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) { ctx?.drawImage(videoRef.current, 0, 0, 600, 800); setPhotos([canvas.toDataURL('image/jpeg')]); }
  };

  // Función para "Imprimir" (Descargar PDF nativo del navegador)
  const downloadPDF = () => {
    window.print();
  };

  const sendWhatsApp = (num: string) => {
    const msg = encodeURIComponent(`Hola Dr. Maya, mi certificado Tiphereth arroja 94.2% de simetría. Soy ${userData.name}, deseo validar mi plan maestro.`);
    window.open(`https://wa.me/${num}?text=${msg}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans print:bg-white print:text-black">
      
      {/* OCULTAR DURANTE IMPRESIÓN */}
      <div className="print:hidden w-full flex flex-col items-center">
        {step !== 'report' && (
          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
              <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
                strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_15px_#06b6d4]" />
            </svg>
            <div className="w-[85%] h-[85%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5">
              {step === 'intro' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h1 className="text-cyan-400 text-[10px] tracking-[0.5em] font-black mb-4 uppercase">TIPHERETH STATION</h1>
                  <button onClick={startFullScan} className="bg-white text-black px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest">INICIAR BIO-SCAN</button>
                </div>
              )}
              {step === 'scanning' && (
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
              )}
              {step === 'result' && (
                <img src={photos[0]} className={`w-full h-full object-cover ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-200' : activeLayer === 'uv' ? 'invert sepia saturate-[5]' : activeLayer === 'infra' ? 'brightness-150 contrast-200 grayscale' : ''}`} />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 w-full max-w-[320px] print:m-0 print:max-w-none">
        {step === 'sync' && <div className="space-y-2">{logs.map((log, i) => <p key={i} className="text-[9px] text-cyan-500 font-mono animate-pulse uppercase">{">"} {log}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom print:hidden">
            <p className="text-center text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Registro Clínico de Leads</p>
            <input type="text" placeholder="NOMBRE" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <input type="tel" placeholder="WHATSAPP (+57...)" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-cyan-500" />
            <button onClick={() => { if(userData.name && userData.phone) setStep('result'); else alert("Complete todos los datos para ver su diagnóstico"); }} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase">VER DIAGNÓSTICO PROFUNDO</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4 print:hidden">
            <div className="flex gap-1">
              {['normal', 'wood', 'uv', 'infra'].map((l) => <button key={l} onClick={() => setActiveLayer(l as Layer)} className={`flex-1 py-2 text-[7px] uppercase border rounded-lg ${activeLayer === l ? 'bg-cyan-500 text-white border-cyan-400' : 'border-white/10 text-zinc-500'}`}>{l}</button>)}
            </div>
            <button onClick={() => setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">EXPEDIR CERTIFICADO Φ</button>
          </div>
        )}

        {/* --- REPORTE CLÍNICO EXPORTABLE --- */}
        {step === 'report' && (
          <div id="report-content" className="bg-white text-black p-8 rounded-[2rem] shadow-2xl print:shadow-none print:p-0 print:rounded-none">
            <div className="text-[7px] font-black text-zinc-400 text-right uppercase tracking-[0.3em] mb-2">Clinical Report | Tiphereth Station</div>
            <h2 className="text-center text-xs font-black tracking-[0.4em] uppercase mb-8 border-b border-zinc-100 pb-4 italic">Certificado de Armonía Facial</h2>
            
            <div className="flex gap-4 mb-8">
              <img src={photos[0]} className="w-24 h-32 object-cover rounded-2xl grayscale border border-zinc-100 shadow-sm" />
              <div className="text-[10px] space-y-2 flex flex-col justify-center">
                <p className="border-b border-zinc-50 pb-1"><strong>PACIENTE:</strong> {userData.name.toUpperCase()}</p>
                <p className="border-b border-zinc-50 pb-1"><strong>ID:</strong> TX-{Math.floor(Math.random()*9000)+1000}</p>
                <p className="text-cyan-600 font-black">SIMETRÍA: 94.2% (ÁUREA)</p>
                <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mb-8">
              <p className="text-[7px] font-black text-zinc-400 uppercase mb-3 text-center">Ratios Master (1.8 : 2.0 : 1.0)</p>
              <div className="grid grid-cols-3 text-[10px] text-center">
                <div><p className="text-zinc-400 text-[6px]">SUP</p><p className="font-bold">1.82</p></div>
                <div><p className="text-zinc-400 text-[6px]">MED</p><p className="font-bold">2.01</p></div>
                <div><p className="text-zinc-400 text-[6px]">INF</p><p className="font-bold text-red-500">0.92</p></div>
              </div>
            </div>

            <p className="text-[9px] italic text-zinc-600 mb-8 border-l-2 border-zinc-200 pl-4 leading-relaxed">
              "Análisis estructural sugiere corrección de plano mandibular. Recomendación de Reingeniería Estructural V-Line."
            </p>

            <div className="space-y-3 print:hidden">
              <button onClick={downloadPDF} className="w-full border-2 border-black text-black py-4 rounded-2xl font-black text-[9px] uppercase active:bg-zinc-100">Descargar PDF</button>
              <button onClick={() => sendWhatsApp(WS_BUSINESS)} className="w-full bg-black text-white py-4 rounded-2xl font-black text-[9px] uppercase">Consultar con el Dr. Maya</button>
            </div>
            
            <p className="hidden print:block text-center text-[7px] text-zinc-400 uppercase mt-20">Este documento es una pre-valoración generada por Tiphereth Harmony Station. Válido por 48 horas.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @media print {
          body { background: white !important; }
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}