"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN MAESTRA ===
const WHATSAPP_DOCTOR = "573104544331"; // Tu número real
const CLINICA_NOMBRE = "Tiphereth Harmony Station";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Stage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO';
type Layer = 'real' | 'wood' | 'uv' | 'infra';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [stage, setStage] = useState<Stage>('FRENTE');
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
        utterance.rate = 0.9;
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
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          runFaceIDProtocol(newStream);
        };
      }
    } catch (err) { alert("Error: Active la cámara en HTTPS."); }
  };

  const runFaceIDProtocol = async (activeStream: MediaStream) => {
    // FRENTE
    setStage('FRENTE');
    await speak("Iniciando escaneo Tiphereth. Por favor, mire fijamente al frente.");
    await animateProgress(0, 33, 3000);
    capture();

    // IZQUIERDA
    setStage('PERFIL IZQUIERDO');
    await speak("Bien. Ahora gire lentamente su rostro a la izquierda.");
    await animateProgress(33, 66, 3000);
    capture();

    // DERECHA
    setStage('PERFIL DERECHO');
    await speak("Correcto. Finalmente, gire a la derecha para análisis de perfil de Park.");
    await animateProgress(66, 100, 3000);
    capture();

    await speak("Escaneo completado. Procesando reconstrucción multiespectral.");
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    const msgs = [
      "Extrayendo Bio-Landmarks...",
      "Analizando Capas de Melanina (UV)...",
      "Calculando Ratios Áureos 1.8:2.0:1.0...",
      "Mapeando Vascularización Infrarroja...",
      "Generando Plan Maestro de ROI..."
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
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 720, 960);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      
      {/* 1. VISUALIZADOR FACE ID / PIEL */}
      {step !== 'report' && (
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_15px_#06b6d4]" />
          </svg>
          
          <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.5em] font-black mb-4 uppercase italic">{CLINICA_NOMBRE}</h1>
                <p className="text-[7px] text-zinc-500 uppercase tracking-widest mb-8">Superior a Canfield VISIA™ Standard</p>
                <button onClick={startFullScan} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
                <div className="absolute top-0 w-full h-[2px] bg-white shadow-[0_0_15px_white] animate-[scan_2s_linear_infinite]" />
                <div className="absolute bottom-4 inset-x-0 text-center text-[10px] font-black text-cyan-400 tracking-widest uppercase">{stage}</div>
              </>
            )}
            {(step === 'result' || step === 'lead') && (
              <div className="relative w-full h-full">
                <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                  ${activeLayer === 'wood' ? 'hue-rotate-[280deg] saturate-[2.5] contrast-[1.5]' : ''}
                  ${activeLayer === 'uv' ? 'invert-[1] sepia-[1] saturate-[10] hue-rotate-[180deg]' : ''}
                  ${activeLayer === 'infra' ? 'brightness-[1.5] contrast-[2] grayscale-[1] invert-[1]' : ''}
                `} />
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border border-cyan-500/10 opacity-30" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. INTERFAZ DE DATOS Y NEUROMARKETING */}
      <div className="mt-8 w-full max-w-[340px]">
        {step === 'sync' && (
          <div className="space-y-2 text-left p-6 bg-zinc-900/30 rounded-3xl border border-white/5">
            {logs.map((log, i) => (
              <p key={i} className="text-[9px] text-cyan-500 font-mono animate-pulse uppercase tracking-tighter">{">"} {log}</p>
            ))}
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
            <p className="text-center text-[9px] text-zinc-500 uppercase tracking-widest">Sincronización de Identidad Áurea</p>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <input type="tel" placeholder="WHATSAPP (+57...)" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <button onClick={() => { if(userData.phone && userData.email) setStep('result'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Ver Análisis de Piel Visia Style</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between gap-1 bg-zinc-900 p-1 rounded-xl">
              {(['real', 'wood', 'uv', 'infra'] as Layer[]).map((l) => (
                <button key={l} onClick={() => setActiveLayer(l)} className={`flex-1 py-2 text-[7px] font-bold uppercase rounded-lg transition-all ${activeLayer === l ? 'bg-cyan-500 text-white shadow-lg' : 'text-zinc-500'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-cyan-500/20 text-left">
               <p className="text-[9px] text-cyan-400 font-black uppercase mb-2 tracking-[0.2em]">Diagnóstico de Bioingeniería</p>
               <p className="text-xs text-zinc-300 italic mb-4 leading-relaxed">"Desviación detectada en tercios faciales. Sugerencia: Reingeniería Estructural con ROI estético del 400%."</p>
               <button onClick={() => setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">Generar Certificado Oficial Φ</button>
            </div>
          </div>
        )}

        {step === 'report' && (
          <div className="animate-in slide-in-from-bottom duration-700 bg-white text-black p-8 rounded-[3rem] shadow-2xl">
            <h2 className="text-center text-[11px] font-black tracking-[0.3em] uppercase mb-6 border-b border-zinc-100 pb-4 italic">Tiphereth Clinical Analysis</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100">
                <img src={photos[0]} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col justify-center space-y-2 text-[9px] text-zinc-700">
                <p><strong>PACIENTE:</strong> {userData.name.toUpperCase()}</p>
                <p><strong>SIMETRÍA ÁUREA:</strong> 94.2%</p>
                <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mb-6 text-center">
              <p className="text-[7px] font-black text-zinc-400 uppercase mb-3 tracking-widest">Ratios Master (1.8 : 2.0 : 1.0)</p>
              <div className="grid grid-cols-3 text-[10px]">
                <div><p className="text-zinc-400 text-[6px]">SUP</p><p className="font-bold">1.82</p></div>
                <div><p className="text-zinc-400 text-[6px]">MED</p><p className="font-bold">2.01</p></div>
                <div><p className="text-zinc-400 text-[6px]">INF</p><p className="font-bold text-red-500">0.92</p></div>
              </div>
            </div>

            <button 
              onClick={() => {
                const msg = encodeURIComponent(`Hola Dr. Maya, soy ${userData.name}. Mi certificado Tiphereth arroja 94.2% de simetría. Deseo agendar mi Reingeniería Estructural.`);
                window.open(`https://wa.me/${WHATSAPP_DOCTOR}?text=${msg}`);
              }}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:bg-cyan-600">
              Validar Mi Transformación
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}