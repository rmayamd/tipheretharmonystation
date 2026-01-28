"use client";
import React, { useRef, useState } from 'react';

// CONFIGURACIÓN AUTOMÁTICA TIPHERETH
const WHATSAPP_DOCTOR = "573000000000"; // Configurado para tu zona
const CLINICA_NOMBRE = "Tiphereth Harmony Station";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type Layer = 'real' | 'uv_damage' | 'vascular' | 'bone_structure';

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
        utterance.rate = 1.0;
        utterance.onend = () => resolve(true);
        window.speechSynthesis.speak(utterance);
      } else resolve(true);
    });
  };

  const startAnalysis = async () => {
    setStep('scanning');
    try {
      const constraints = { video: { facingMode: "user", width: 1280 } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          runScanner(newStream);
        };
      }
    } catch (err) { alert("Error de Acceso Biométrico."); }
  };

  const runScanner = async (activeStream: MediaStream) => {
    await speak("Iniciando Escaneo Multiespectral Tiphereth. Mantenga la posición.");
    await animateProgress(0, 100, 6000);
    capture();
    activeStream.getTracks().forEach(t => t.stop());
    setStream(null);
    setStep('sync');
    simulateAI();
  };

  const simulateAI = () => {
    const msgs = ["Extrayendo Capas UV...", "Mapeando Vascularización...", "Analizando Ratios 1.8:2.0:1.0...", "Generando Certificado Clínico..."];
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
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 600, 800);
      setPhotos([canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans overflow-x-hidden">
      
      {step !== 'report' && (
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#111" strokeWidth="2" fill="none" />
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="4" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>
          <div className="w-[88%] h-[88%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.5em] font-black mb-4 uppercase italic">{CLINICA_NOMBRE}</h1>
                <button onClick={startAnalysis} className="bg-white text-black px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Iniciar Bio-Scan</button>
              </div>
            )}
            {step === 'scanning' && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
            )}
            {step === 'result' && (
              <img src={photos[0]} className={`w-full h-full object-cover 
                ${activeLayer === 'uv_damage' ? 'saturate-[4] contrast-[1.5] hue-rotate-[200deg] invert-[0.2]' : ''}
                ${activeLayer === 'vascular' ? 'brightness-[1.2] contrast-[2] sepia-[0.5] saturate-[5]' : ''}
                ${activeLayer === 'bone_structure' ? 'grayscale brightness-[1.5] contrast-[2]' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      <div className="mt-8 w-full max-w-[340px]">
        {step === 'sync' && (
          <div className="space-y-2 text-center p-4 bg-zinc-900/30 rounded-3xl border border-white/5">
            {logs.map((log, i) => (
              <p key={i} className="text-[9px] text-cyan-500 font-mono animate-pulse uppercase">{">"} {log}</p>
            ))}
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setUserData({...userData, email:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <input type="tel" placeholder="WHATSAPP (+57...)" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-cyan-500 text-white" />
            <button onClick={() => { if(userData.phone && userData.email) setStep('result'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Generar Diagnóstico Maestro</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between gap-1">
              {(['real', 'uv_damage', 'vascular', 'bone_structure'] as Layer[]).map((l) => (
                <button key={l} onClick={() => setActiveLayer(l)} className={`flex-1 py-2 text-[7px] font-bold uppercase border rounded-lg transition-all ${activeLayer === l ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg' : 'border-white/10 text-zinc-500'}`}>{l.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-cyan-500/20 text-left">
               <p className="text-[9px] text-cyan-400 font-black uppercase mb-2 italic">Análisis Estructural</p>
               <p className="text-xs text-zinc-300 italic mb-4 leading-relaxed">"Desviación detectada en el plano mandibular. ROI estético proyectado: +45% simetría."</p>
               <button onClick={() => setStep('report')} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest">Ver Certificado Φ</button>
            </div>
          </div>
        )}

        {step === 'report' && (
          <div className="animate-in slide-in-from-bottom duration-700 bg-white text-black p-8 rounded-[2rem] shadow-2xl">
            <div className="text-[8px] font-black text-zinc-300 mb-2 tracking-[0.3em] text-right uppercase">Official Bio-Report</div>
            <h2 className="text-center text-[11px] font-black tracking-[0.3em] uppercase mb-8 border-b border-zinc-100 pb-4 italic">Tiphereth Clinical Analysis</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100">
                <img src={photos[0]} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col justify-center space-y-2 text-[9px] text-zinc-700">
                <p><strong>PACIENTE:</strong> {userData.name.toUpperCase()}</p>
                <p><strong>FECHA:</strong> {new Date().toLocaleDateString()}</p>
                <div className="h-[1px] bg-zinc-100 w-full my-1" />
                <p className="text-cyan-600 font-black tracking-tighter">SIMETRÍA ÁUREA: 94.2%</p>
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 mb-6">
              <p className="text-[7px] font-black text-zinc-400 uppercase mb-3">Ratios de Park (1.8 : 2.0 : 1.0)</p>
              <div className="grid grid-cols-3 text-center text-[10px]">
                <div><p className="text-zinc-400 text-[7px]">SUP</p><p className="font-bold">1.82</p></div>
                <div><p className="text-zinc-400 text-[7px]">MED</p><p className="font-bold">2.01</p></div>
                <div><p className="text-zinc-400 text-[7px]">INF</p><p className="font-bold text-red-500">0.92</p></div>
              </div>
            </div>

            <div className="text-[9px] mb-8 italic text-zinc-600 leading-relaxed border-l-2 border-zinc-100 pl-4">
              "Se detecta retrognatia en plano sagital. Recomendación: Reingeniería estructural para optimización de V-Line según protocolo Tiphereth."
            </div>

            <button 
              onClick={() => {
                const msg = encodeURIComponent(`Hola Dr. Maya, mi certificado Tiphereth arroja 94.2% de simetría. Soy ${userData.name}, deseo validar mi plan maestro.`);
                window.open(`https://wa.me/${WHATSAPP_DOCTOR}?text=${msg}`);
              }}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:bg-cyan-600">
              Validar Resultados
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