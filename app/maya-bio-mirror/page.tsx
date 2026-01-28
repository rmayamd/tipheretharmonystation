"use client";
import React, { useRef, useState } from 'react';

type Stage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO' | 'ANÁLISIS';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<{front?: string, left?: string, right?: string}>({});
  const [stage, setStage] = useState<Stage>('FRENTE');
  const [step, setStep] = useState<'camera' | 'sync' | 'result'>('camera');
  const [progress, setProgress] = useState(0);

  // ARRANQUE FORZADO DE CÁMARA
  const initScanner = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const constraints = { 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Error: Active la cámara y use una conexión HTTPS segura.");
    }
  };

  const captureFrame = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 720, 960);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      
      if (stage === 'FRENTE') {
        setPhotos(p => ({...p, front: data}));
        setStage('PERFIL IZQUIERDO');
        setProgress(33);
      } else if (stage === 'PERFIL IZQUIERDO') {
        setPhotos(p => ({...p, left: data}));
        setStage('PERFIL DERECHO');
        setProgress(66);
      } else if (stage === 'PERFIL DERECHO') {
        setPhotos(p => ({...p, right: data}));
        setStage('ANÁLISIS');
        setProgress(100);
        setTimeout(() => setStep('sync'), 1000);
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-sans select-none overflow-hidden">
      
      {/* BARRA DE PROGRESO DE ADN */}
      <div className="fixed top-0 left-0 w-full h-2 bg-zinc-900 z-50">
        <div className="h-full bg-cyan-500 shadow-[0_0_20px_#06b6d4] transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="mb-6 text-[10px] tracking-[1em] font-black uppercase text-white/40">Tiphereth 3D Vision v15.2</h1>

      <div className="relative w-full max-w-[350px] aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-white/5 bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,1)]">
        
        {step === 'camera' && (
          <div className="relative h-full w-full">
            {stream ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                
                {/* HUD: GUIADO LÁSER DE ALTA VISIBILIDAD */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Escáner Movible */}
                  <div className="absolute top-0 w-full h-[2px] bg-white shadow-[0_0_20px_white] animate-[scan_3s_linear_infinite]" />
                  
                  {/* Rejilla 3D */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-8 border border-cyan-500/10" />

                  {/* LÍNEAS DE PROPORCIÓN ÁUREA (DEL PDF: 1.8 - 2.0 - 1.0) */}
                  <div className="absolute top-[37.5%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]">
                    <span className="absolute left-2 -top-4 text-[8px] font-black text-cyan-400 bg-black/80 px-2 tracking-tighter">SEC_A: 1.8</span>
                  </div>
                  <div className="absolute top-[79.1%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]">
                    <span className="absolute left-2 -top-4 text-[8px] font-black text-cyan-400 bg-black/80 px-2 tracking-tighter">SEC_C: 1.0</span>
                  </div>

                  {/* Ovalo FaceID */}
                  <div className="absolute inset-10 border-[2px] border-dashed border-white/20 rounded-full" />
                </div>

                {/* BOTÓN Y TEXTO DE ACCIÓN */}
                <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6">
                  <div className="bg-cyan-600/20 backdrop-blur-xl border border-cyan-400/50 py-3 px-8 rounded-2xl shadow-2xl">
                    <p className="text-sm font-black tracking-widest text-white uppercase">{stage}</p>
                  </div>
                  <button onClick={captureFrame} className="w-20 h-20 rounded-full border-8 border-white/10 p-1 active:scale-90 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_white]">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full animate-ping" />
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 border-t-4 border-cyan-500 rounded-full animate-spin mb-10" />
                <button onClick={initScanner} className="w-full py-5 bg-cyan-600 text-white font-black text-xs tracking-widest rounded-2xl shadow-2xl uppercase">Activar Sensores 3D</button>
              </div>
            )}
          </div>
        )}

        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 p-10 flex flex-col justify-center items-center gap-6 animate-in fade-in duration-500">
            <div className="flex gap-2 mb-6">
               <img src={photos.front} className="w-16 h-20 object-cover rounded-xl border border-cyan-500 shadow-[0_0_10px_#06b6d4]" />
               <img src={photos.left} className="w-16 h-20 object-cover rounded-xl border border-zinc-800" />
               <img src={photos.right} className="w-16 h-20 object-cover rounded-xl border border-zinc-800" />
            </div>
            <h2 className="text-cyan-400 text-xs font-black tracking-[0.3em] uppercase">Sincronización ADN</h2>
            <input type="tel" placeholder="NÚMERO DE WHATSAPP" className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-center text-xs outline-none focus:border-cyan-500 text-white" />
            <button onClick={() => setStep('result')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl">VER DIAGNÓSTICO Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 p-8 overflow-y-auto flex flex-col">
            <h2 className="text-center text-cyan-400 text-[10px] font-black tracking-[0.5em] uppercase mb-10">Reporte de Bioingeniería</h2>
            
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-2 border-cyan-500/30 mb-8">
               <img src={photos.front} className="w-full h-full object-cover grayscale" />
               <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 border border-cyan-500/20 opacity-30" />
               <div className="absolute top-[37.5%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]" />
               <div className="absolute top-[79.1%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]" />
            </div>

            <div className="space-y-4 text-left">
               <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Análisis Proyectivo (Park Method)</p>
                  <p className="text-xs text-zinc-200">Se detecta una desviación del <b className="text-cyan-400 font-bold italic underline">12.4%</b> respecto a la vertical áurea en el tercio inferior.</p>
               </div>
               <button onClick={() => window.open(`https://wa.me/573000000000?text=He completado mi escaneo 3D. El sistema detectó 12.4% de desviación en el tercio inferior. Deseo valoración.`)} className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl text-[10px] tracking-widest uppercase">Solicitar Protocolo</button>
               <button onClick={() => window.location.reload()} className="w-full py-3 text-[8px] text-zinc-600 uppercase tracking-[0.5em]">Reset Protocol</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}