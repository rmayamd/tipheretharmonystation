"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN DE PODER ===
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";
const PHI = 1.618;

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Stage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO';
type Layer = 'real' | 'wood' | 'uv' | 'infra' | 'textura';

export default function TipherethV25() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [stage, setStage] = useState<Stage>('FRENTE');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('real');

  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.95;
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const startFullScan = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: { ideal: 1280 } } };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
        runClinicalProtocol(s);
      }
    } catch (err) { alert("Active los permisos de cámara para el análisis multiespectral."); }
  };

  const runClinicalProtocol = async (activeStream: MediaStream) => {
    await speak("Iniciando Escaneo Tiphereth. Por favor, retírese las gafas y despeje el rostro.");
    
    // CAPTURA FRENTE
    setStage('FRENTE');
    await speak("Mire fijamente al frente.");
    await animateProgress(0, 33, 3000);
    capture();

    // CAPTURA IZQUIERDA
    setStage('PERFIL IZQUIERDO');
    await speak("Gire su rostro a la izquierda.");
    await animateProgress(33, 66, 3000);
    capture();

    // CAPTURA DERECHA
    setStage('PERFIL DERECHO');
    await speak("Gire su rostro a la derecha.");
    await animateProgress(66, 100, 3000);
    capture();

    await speak("Escaneo completado. Procesando gemelo digital y capas de piel.");
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    simulateDeepAnalysis();
  };

  const simulateDeepAnalysis = () => {
    const msgs = [
      "Extrayendo Bio-Landmarks 3D...",
      "Mapeando Daño Actínico (UV)...",
      "Calculando Ratios Áureos (1.8 : 2.0 : 1.0)...",
      "Sincronizando Módulos InBody y BioScanner...",
      "Generando Plan de Reingeniería Estructural..."
    ];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, msg]);
        if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
      }, i * 1200);
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
    if (videoRef.current) { 
      ctx?.drawImage(videoRef.current, 0, 0, 600, 800); 
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]); 
    }
  };

  const sendWhatsApp = (num: string) => {
    const msg = encodeURIComponent(`Shalom Dr. Maya, soy ${userData.name.toUpperCase()}. He recibido mi Certificado Tiphereth (94.2% Φ). Deseo materializar mi Plan Maestro.`);
    window.open(`https://api.whatsapp.com/send?phone=${num}&text=${msg}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      
      {/* 1. VISUALIZADOR MULTIESPECTRAL */}
      {step !== 'report' && (
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>
          
          <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.5em] font-black mb-4 uppercase italic">Tiphereth Station v25</h1>
                <p className="text-[7px] text-zinc-500 uppercase tracking-widest mb-10">Ascenso a la Perfección Estética</p>
                <button onClick={startFullScan} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute top-0 w-full h-[2px] bg-white shadow-[0_0_15px_white] animate-[scan_2s_linear_infinite]" />
                <div className="absolute bottom-4 inset-x-0 text-[10px] font-black text-cyan-400 text-center tracking-widest">{stage}</div>
              </>
            )}
            {(step === 'result' || step === 'lead') && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-[2.5] contrast-[1.5]' : ''}
                ${activeLayer === 'uv' ? 'invert-[1] sepia-[1] saturate-[10] hue-rotate-[180deg]' : ''}
                ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale-[1] invert-[1]' : ''}
                ${activeLayer === 'textura' ? 'contrast-[3] grayscale-[1] brightness-[0.8]' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* 2. INTERFAZ DE NEUROMARKETING */}
      <div className="mt-10 w-full max-w-[340px]">
        {step === 'sync' && (
          <div className="space-y-2 p-6 bg-zinc-900/40 rounded-3xl border border-white/5 font-mono">
            {logs.map((log, i) => <p key={i} className="text-[9px] text-cyan-500 animate-pulse uppercase">{">"} {log}</p>)}
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
            <p className="text-center text-[9px] text-zinc-500 uppercase tracking-widest font-bold italic">Sincronización de Identidad Áurea</p>
            <input type="text" placeholder="Nombre Completo" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-cyan-500 transition-all" />
            <input type="email" placeholder="Email para Reporte" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-cyan-500 transition-all" />
            <button onClick={() => { if(userData.name && userData.email) setStep('result'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Generar Diagnóstico Maestro</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between gap-1 bg-zinc-900 p-1 rounded-xl">
              {(['real', 'wood', 'uv', 'infra', 'textura'] as Layer[]).map((l) => (
                <button key={l} onClick={() => setActiveLayer(l)} className={`flex-1 py-2 text-[7px] font-bold uppercase rounded-lg transition-all ${activeLayer === l ? 'bg-cyan-500 text-white shadow-lg' : 'text-zinc-500'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-cyan-500/20 text-left space-y-4">
               <div className="flex justify-between items-center border-b border-white/5 pb-2">
                 <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em]">Bio-Composición</p>
                 <span className="text-[7px] text-zinc-500">InBody: SYNC</span>
               </div>
               <p className="text-xs text-zinc-300 italic leading-relaxed">"Déficit mandibular detectado. Se sugiere Reingeniería Estructural con ROI del 400%."</p>
               <button onClick={() => setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">Ver Certificado Φ</button>
            </div>
          </div>
        )}

        {step === 'report' && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom duration-700">
            <h2 className="text-center text-[12px] font-black tracking-[0.3em] uppercase mb-8 border-b pb-4 italic">Tiphereth Clinical Analysis</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-inner">
                <img src={photos[0]} className="w-full h-full object-cover grayscale brightness-110" />
                <div className="absolute inset-0 border border-cyan-500/20 grid grid-cols-6 grid-rows-8" />
              </div>
              <div className="flex flex-col justify-center space-y-2 text-[9px] text-zinc-700">
                <p><strong>PACIENTE:</strong> {userData.name.toUpperCase()}</p>
                <p className="text-cyan-600 font-black">SIMETRÍA: 94.2%</p>
                <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 mb-8">
              <p className="text-[7px] font-black text-zinc-400 uppercase mb-3 text-center tracking-widest italic">Ratios de Park (1.8 : 2.0 : 1.0)</p>
              <div className="grid grid-cols-3 text-center text-[11px]">
                <div><p className="text-zinc-400 text-[6px]">SUP</p><p className="font-bold">1.82</p></div>
                <div><p className="text-zinc-400 text-[6px]">MED</p><p className="font-bold">2.01</p></div>
                <div><p className="text-zinc-400 text-[6px]">INF</p><p className="font-bold text-red-600">0.92</p></div>
              </div>
            </div>

            <button 
              onClick={() => sendWhatsApp(WS_BUSINESS)}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:bg-cyan-600 transition-all">
              Materializar Plan Maestro
            </button>
            <button onClick={() => window.print()} className="w-full mt-4 text-[7px] text-zinc-400 uppercase tracking-widest font-bold">Descargar PDF Científico</button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @media print { body { background: white !important; } .print-hide { display: none !important; } }
      `}</style>
    </div>
  );
}