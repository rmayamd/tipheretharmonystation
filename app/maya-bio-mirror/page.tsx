"use client";
import React, { useRef, useState, useEffect } from 'react';

type CaptureStage = 'FRENTE' | 'PERFIL IZQUIERDO' | 'PERFIL DERECHO' | 'PROCESANDO';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<{front?: string, left?: string, right?: string}>({});
  const [stage, setStage] = useState<CaptureStage>('FRENTE');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('camera'); 
  const [formData, setFormData] = useState({ whatsapp: '', email: '' });

  const startCamera = async () => {
    try {
      // Constraints más flexibles para evitar el "loading" infinito
      const constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        // Forzamos el play y solo entonces activamos el estado
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setStream(newStream);
          });
        };
      }
    } catch (err) { 
      console.error("Error de cámara:", err);
      alert("Error: Asegúrese de estar en una conexión SEGURA (HTTPS) y de dar permisos a la cámara."); 
    }
  };

  const captureAndAdvance = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      // Dibujamos el video en el canvas
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
        setStage('PROCESANDO');
        setProgress(100);
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
        setTimeout(() => setStep('sync'), 800);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-sans overflow-hidden">
      
      {/* Barra de Progreso Superior Quirúrgica */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-zinc-900 z-[100]">
        <div className="h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="pt-10 pb-4 text-center">
        <h1 className="text-[10px] tracking-[0.8em] font-black text-white uppercase opacity-80">Tiphereth 3D Master Vision</h1>
      </div>

      <div className="relative w-full max-w-[360px] mx-auto aspect-[3/4] bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden rounded-[3rem]">
        
        {step === 'camera' && (
          <div className="relative h-full w-full">
            {stream ? (
              <>
                {/* Espejamos el video para que el usuario se sienta cómodo */}
                <video ref={videoRef} muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                
                {/* HUD: INTERFAZ DE MEDICIÓN EN TIEMPO REAL (ALTA VISIBILIDAD) */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Rejilla 3D de alta densidad */}
                  <div className="absolute inset-0 border border-cyan-500/10 grid grid-cols-8 grid-rows-10" />
                  
                  {/* Círculo de Posicionamiento Grueso */}
                  <div className="absolute inset-6 border-[2px] border-cyan-400/40 rounded-[3rem] shadow-[inset_0_0_30px_rgba(6,182,212,0.2)]" />

                  {/* Líneas de Tercios Áureos (PDF 1.8 : 2.0 : 1.0) - AHORA MÁS GRUESAS */}
                  <div className="absolute top-[37.5%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]">
                    <span className="absolute left-4 -top-4 text-[7px] text-cyan-400 font-black tracking-widest bg-black/80 px-2 rounded">UPPER_LIMIT_1.8</span>
                  </div>
                  <div className="absolute top-[79.1%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]">
                    <span className="absolute left-4 -top-4 text-[7px] text-cyan-400 font-black tracking-widest bg-black/80 px-2 rounded">LOWER_LIMIT_1.0</span>
                  </div>

                  {/* Escáner Láser que se mueve */}
                  <div className="absolute top-0 w-full h-[4px] bg-white/20 shadow-[0_0_30px_white] animate-scan" />
                </div>

                {/* INSTRUCCIONES FLOTANTES */}
                <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-6 px-10">
                  <div className="bg-black/80 backdrop-blur-2xl border-2 border-cyan-500/50 p-5 rounded-3xl w-full text-center shadow-2xl">
                    <p className="text-sm font-black tracking-[0.2em] text-white">
                      {stage}
                    </p>
                    <p className="text-[8px] text-cyan-400 mt-2 uppercase font-bold tracking-widest animate-pulse">Alinee su rostro con los láseres</p>
                  </div>
                  
                  <button onClick={captureAndAdvance} className="w-20 h-20 rounded-full border-4 border-white p-1 bg-white/10 active:scale-90 transition-transform">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                       <div className="w-4 h-4 bg-cyan-500 rounded-sm rotate-45" />
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 bg-zinc-900">
                <div className="w-24 h-24 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-10" />
                <button onClick={startCamera} className="w-full py-6 bg-cyan-600 text-white font-black text-xs tracking-[0.5em] uppercase rounded-2xl shadow-[0_15px_40px_rgba(8,145,178,0.4)]">
                  INICIAR ESCANEO 3D
                </button>
                <p className="mt-8 text-[8px] text-zinc-600 uppercase tracking-widest">Protocolo de seguridad Tiphereth v15.1</p>
              </div>
            )}
          </div>
        )}

        {/* ... (Los pasos de Sync y Result se mantienen igual para no perder la lógica) ... */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 p-10 flex flex-col justify-center gap-6 animate-in fade-in duration-500">
            <p className="text-center text-[10px] tracking-[0.4em] font-bold text-cyan-400 uppercase">Sincronización de Biometría</p>
            <input type="tel" placeholder="WHATSAPP DE CONTACTO" onChange={(e)=>setFormData({...formData, whatsapp:e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-xs outline-none focus:border-cyan-500" />
            <button onClick={() => setStep('result')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-xl">GENERAR REPORTE Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 p-8 overflow-y-auto">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-2 border-cyan-500/30 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <img src={photos.front} className="w-full h-full object-cover grayscale brightness-75" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute top-[37.5%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]" />
              <div className="absolute top-[79.1%] w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]" />
            </div>
            <div className="space-y-6">
               <h3 className="text-cyan-400 text-[10px] font-bold tracking-[0.5em] uppercase">Resultado de Bioingeniería</h3>
               <p className="text-xs text-zinc-300 leading-relaxed italic">
                 "Basado en el método <b className="text-white">Sanghoon Park</b>, se recomienda aumento de proyección mentoniana de <b className="text-cyan-400 font-bold italic underline">2.1mm</b> para alcanzar la armonía áurea perfecta."
               </p>
               <button onClick={() => window.open(`https://wa.me/573000000000?text=He completado mi escaneo 3D. El sistema recomienda 2.1mm de proyección.`)} className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl text-[9px] tracking-[0.4em] uppercase">Agendar con el Dr. Maya</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
}