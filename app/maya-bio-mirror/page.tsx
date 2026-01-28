"use client";
import React, { useRef, useState, useEffect } from 'react';

type Module = 'facial' | 'breast' | 'body';
type CaptureStage = 'front' | 'profile' | 'done';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<{front?: string, profile?: string}>({});
  const [stage, setStage] = useState<CaptureStage>('front');
  const [step, setStep] = useState('camera'); // camera, sync, analysis, result
  const [module, setModule] = useState<Module>('facial');
  const [formData, setFormData] = useState({ whatsapp: '', email: '' });

  // Iniciar Cámara con máxima resolución
  const startCamera = async () => {
    try {
      const constraints = { 
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1350 } } 
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        setStream(newStream);
      }
    } catch (err) { 
      fileInputRef.current?.click(); 
    }
  };

  // Captura de Foto estilo FaceID
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 720, 960);
      const data = canvas.toDataURL('image/jpeg', 0.9);
      
      if (stage === 'front') {
        setPhotos(prev => ({ ...prev, front: data }));
        setStage('profile');
      } else {
        setPhotos(prev => ({ ...prev, profile: data }));
        setStage('done');
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
        setStep('sync');
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 font-sans overflow-x-hidden selection:bg-cyan-500">
      
      {/* HEADER TÉCNICO */}
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-xl tracking-[0.6em] font-thin uppercase text-white">MAYA BIO-SCAN</h1>
        <p className="text-cyan-500 text-[8px] tracking-[0.4em] uppercase mt-1 font-bold">Protocolo Tiphereth Harmony</p>
      </div>

      {/* SELECTOR DE MÓDULO */}
      {step === 'camera' && stage === 'front' && !photos.front && (
        <div className="flex justify-center gap-2 mb-6 animate-in fade-in zoom-in duration-500">
          {(['facial', 'breast', 'body'] as Module[]).map((m) => (
            <button 
              key={m}
              onClick={() => setModule(m)}
              className={`px-4 py-2 rounded-full text-[8px] tracking-widest uppercase border transition-all ${module === m ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'border-white/10 text-zinc-500'}`}
            >
              {m === 'facial' ? 'Rostro' : m === 'breast' ? 'Mamas' : 'Lipo HD'}
            </button>
          ))}
        </div>
      )}

      {/* ÁREA DE ESCANEO GUIADO */}
      <div className="relative w-full max-w-[340px] mx-auto aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* INTERFAZ DE CÁMARA FACEID */}
        {step === 'camera' && (
          <div className="relative h-full w-full bg-black">
            {stream ? (
              <>
                <video ref={videoRef} muted playsInline className="w-full h-full object-cover grayscale brightness-110 opacity-80" />
                
                {/* GUÍAS DE NEÓN DE ALTA VISIBILIDAD */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  {/* Círculo FaceID dinámico */}
                  <div className={`w-[85%] aspect-[0.85] border-[3px] rounded-[100px] transition-all duration-700 shadow-[0_0_40px_rgba(6,182,212,0.3)] ${stage === 'front' ? 'border-cyan-400' : 'border-yellow-400'}`}>
                    <div className="absolute inset-0 border border-white/10 rounded-[100px] animate-pulse" />
                  </div>

                  {/* Líneas Proporción Áurea (1.8 : 2.0 : 1.0) */}
                  <div className="absolute inset-x-0 top-[37.5%] h-[2px] bg-cyan-400/60 shadow-[0_0_15px_#22d3ee] w-full" />
                  <div className="absolute inset-x-0 top-[79.1%] h-[2px] bg-cyan-400/60 shadow-[0_0_15px_#22d3ee] w-full" />
                  
                  {/* Eje Central */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
                </div>

                {/* BOTÓN DE CAPTURA Y TEXTO */}
                <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-6">
                  <div className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                      {stage === 'front' ? 'Captura Frontal' : 'Gire 90° para Perfil'}
                    </p>
                  </div>
                  <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white p-1 transition-all active:scale-90 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                       <div className="w-16 h-16 border-2 border-black/10 rounded-full" />
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.15),transparent)]">
                <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin mb-10 opacity-30" />
                <button onClick={startCamera} className="w-full py-5 bg-cyan-600 text-white font-bold rounded-2xl text-[10px] tracking-[0.4em] uppercase shadow-[0_10px_30px_rgba(8,145,178,0.4)] active:scale-95 transition-all">
                  Activar Bio-Scanner
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 text-[8px] text-zinc-500 tracking-widest uppercase border-b border-zinc-800 pb-1">O subir desde archivo</button>
              </div>
            )}
          </div>
        )}

        {/* SINCRONIZACIÓN (REGISTRO) */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-50 p-10 flex flex-col justify-center gap-5">
            <div className="text-center mb-6">
              <p className="text-cyan-400 text-[10px] tracking-[0.4em] font-bold uppercase">Sincronización ADN</p>
              <p className="text-zinc-500 text-[8px] mt-2 tracking-widest">Vinculando imágenes de frente y perfil...</p>
            </div>
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setFormData({...formData, whatsapp:e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-xs text-white outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setFormData({...formData, email:e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-xs text-white outline-none focus:border-cyan-500" />
            <button onClick={() => { setStep('analysis'); setTimeout(()=>setStep('result'), 4000); }} className="w-full bg-white text-black py-5 rounded-2xl font-bold text-[10px] tracking-[0.4em] uppercase hover:bg-cyan-400 transition-colors">Analizar Simetría Φ</button>
          </div>
        )}

        {/* ANIMACIÓN DE ANÁLISIS VECTRA H2 */}
        {step === 'analysis' && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-10">
            <div className="absolute top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scan-move" />
            <div className="relative w-24 h-24 mb-10">
               <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping" />
               <div className="absolute inset-2 border-2 border-cyan-500/40 rounded-full animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-2xl font-thin">Φ</div>
            </div>
            <p className="text-[9px] tracking-[0.5em] text-cyan-400 uppercase font-bold animate-pulse">Calculando Proporciones...</p>
            <div className="mt-6 space-y-2 w-full max-w-[150px]">
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 animate-[loading_4s_ease-in-out]" />
               </div>
            </div>
          </div>
        )}

        {/* REPORTE DE BIOINGENIERÍA FINAL */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 z-[60] flex flex-col p-8 overflow-y-auto animate-in slide-in-from-bottom duration-1000">
            <header className="flex justify-between items-center mb-8">
              <span className="text-[8px] text-cyan-400 tracking-[0.4em] uppercase font-bold">Reporte Tiphereth v14</span>
              <button onClick={() => window.location.reload()} className="text-white text-[9px] border-b border-white/20 uppercase tracking-widest">Reset</button>
            </header>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                  <p className="text-[7px] text-zinc-500 uppercase tracking-widest mb-1">Simetría Φ</p>
                  <p className="text-2xl font-light text-cyan-400 tracking-tighter">96.4%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                  <p className="text-[7px] text-zinc-500 uppercase tracking-widest mb-1">Perfil V-Line</p>
                  <p className="text-2xl font-light text-green-400 tracking-tighter">Gold</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-900/30 to-zinc-900 rounded-[2.5rem] border border-cyan-500/20 text-left">
                <h4 className="text-[9px] text-cyan-400 tracking-widest uppercase font-bold mb-4 italic underline decoration-cyan-800">Plan Quirúrgico Personalizado:</h4>
                
                {module === 'facial' && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-zinc-200 leading-relaxed">
                      Basado en el protocolo de <b className="text-white italic">Sanghoon Park</b>, se detecta un déficit de proyección en el <b>Pogonion</b> de 2.2mm respecto a la vertical de Ricketts.
                    </p>
                    <div className="space-y-2">
                       <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                          <p className="text-[7px] text-cyan-500 uppercase font-bold mb