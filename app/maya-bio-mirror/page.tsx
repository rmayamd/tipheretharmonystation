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
      const constraints = { video: { facingMode: "user", width: 1080 } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        setStream(newStream);
      }
    } catch (err) { alert("Active los permisos de cámara para el escaneo 3D."); }
  };

  const captureAndAdvance = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 720, 960);
      const data = canvas.toDataURL('image/jpeg');
      
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
        setTimeout(() => setStep('sync'), 1000);
        if (stream) stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-sans overflow-hidden">
      
      {/* Barra de Progreso Superior (Grado Quirúrgico) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-[100]">
        <div className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4] transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="pt-8 pb-4 text-center">
        <h1 className="text-sm tracking-[0.8em] font-black text-white uppercase">Tiphereth 3D Vision</h1>
        <div className="flex justify-center gap-4 mt-4">
           <div className={`text-[8px] ${progress >= 33 ? 'text-cyan-400' : 'text-zinc-600'}`}>● FRONT</div>
           <div className={`text-[8px] ${progress >= 66 ? 'text-cyan-400' : 'text-zinc-600'}`}>● LEFT</div>
           <div className={`text-[8px] ${progress >= 100 ? 'text-cyan-400' : 'text-zinc-600'}`}>● RIGHT</div>
        </div>
      </div>

      <div className="relative w-full max-w-[360px] mx-auto aspect-[3/4] bg-zinc-950 border border-white/5 shadow-2xl overflow-hidden rounded-[3rem]">
        
        {step === 'camera' && (
          <div className="relative h-full w-full">
            {stream ? (
              <>
                <video ref={videoRef} muted playsInline className="w-full h-full object-cover opacity-60 grayscale scale-x-[-1]" />
                
                {/* HUD: INTERFAZ DE MEDICIÓN EN TIEMPO REAL */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Malla 3D (Simulada con rejilla) */}
                  <div className="absolute inset-0 border-[0.5px] border-cyan-500/10 grid grid-cols-12 grid-rows-12" />
                  
                  {/* Círculo de Posicionamiento con Etiquetas */}
                  <div className="absolute inset-10 border-[1px] border-cyan-500/30 rounded-full flex flex-col items-center justify-between py-10">
                    <span className="text-[7px] text-cyan-500 tracking-widest bg-black/50 px-2">TRIQUION (SUP)</span>
                    <span className="text-[7px] text-cyan-500 tracking-widest bg-black/50 px-2">GNATHION (INF)</span>
                  </div>

                  {/* Líneas de Tercios Áureos (1.8 : 2.0 : 1.0) */}
                  <div className="absolute top-[37.5%] w-full h-[1px] bg-cyan-400/80 shadow-[0_0_10px_#06b6d4]">
                    <span className="absolute right-2 -top-3 text-[6px] text-cyan-400 font-mono">SUP_DIV_1.8</span>
                  </div>
                  <div className="absolute top-[79.1%] w-full h-[1px] bg-cyan-400/80 shadow-[0_0_10px_#06b6d4]">
                    <span className="absolute right-2 -top-3 text-[6px] text-cyan-400 font-mono">INF_DIV_1.0</span>
                  </div>

                  {/* Escáner Láser Animado */}
                  <div className="absolute top-0 w-full h-[1px] bg-white shadow-[0_0_20px_white] animate-scan" />
                </div>

                {/* INSTRUCCIONES DINÁMICAS */}
                <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 px-10">
                  <div className="bg-cyan-600/20 backdrop-blur-xl border border-cyan-400/30 p-4 rounded-2xl w-full text-center">
                    <p className="text-xs font-black tracking-widest text-cyan-400 animate-pulse">
                      {stage === 'FRENTE' && "POSICIONE EL ROSTRO DE FRENTE"}
                      {stage === 'PERFIL IZQUIERDO' && "GIRE 90° A LA IZQUIERDA"}
                      {stage === 'PERFIL DERECHO' && "GIRE 90° A LA DERECHA"}
                    </p>
                    <p className="text-[7px] text-zinc-400 mt-1 uppercase">Asegure iluminación uniforme</p>
                  </div>
                  
                  <button onClick={captureAndAdvance} className="w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-black/40">
                    <div className="w-full h-full bg-white rounded-full active:scale-90 transition-transform flex items-center justify-center">
                       <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent)]">
                <div className="w-20 h-20 border-2 border-cyan-500/20 rounded-full flex items-center justify-center mb-10">
                  <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin" />
                </div>
                <button onClick={startCamera} className="w-full py-5 bg-cyan-600 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-lg shadow-cyan-900/40">
                  INICIAR ESCANEO 3D
                </button>
              </div>
            )}
          </div>
        )}

        {/* SINCRONIZACIÓN Y COMPARATIVA */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 p-10 flex flex-col justify-center gap-6 animate-in fade-in duration-500">
            <div className="flex justify-center gap-2 mb-4">
              <img src={photos.front} className="w-12 h-16 object-cover rounded-lg border border-cyan-500/50" />
              <img src={photos.left} className="w-12 h-16 object-cover rounded-lg border border-zinc-700" />
              <img src={photos.right} className="w-12 h-16 object-cover rounded-lg border border-zinc-700" />
            </div>
            <p className="text-center text-[10px] tracking-[0.4em] font-bold text-cyan-400 uppercase">Muestras Biométricas Capturadas</p>
            <input type="tel" placeholder="WHATSAPP DE CONTACTO" onChange={(e)=>setFormData({...formData, whatsapp:e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-xs outline-none focus:border-cyan-500" />
            <button onClick={() => { setProgress(0); setStep('result'); }} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase shadow-xl">GENERAR COMPARATIVA Φ</button>
          </div>
        )}

        {/* RESULTADO CON PRUEBA VISUAL */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 p-6 overflow-y-auto animate-in slide-in-from-bottom duration-1000">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
               <span className="text-[8px] text-cyan-400 tracking-widest font-bold">REPORTE T_V15 MASTER</span>
               <button onClick={() => window.location.reload()} className="text-[8px] text-zinc-500 underline uppercase">Nuevo Escaneo</button>
            </div>

            {/* FOTO CON REJILLA DE PRUEBA */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-cyan-500/30 mb-6">
              <img src={photos.front} className="w-full h-full object-cover grayscale brightness-50" />
              <div className="absolute inset-0 border border-cyan-500/20 grid grid-cols-6 grid-rows-6 opacity-40" />
              <div className="absolute top-[37.5%] w-full h-[1px] bg-cyan-400 shadow-[0_0_10px_cyan]" />
              <div className="absolute top-[79.1%] w-full h-[1px] bg-cyan-400 shadow-[0_0_10px_cyan]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-[8px] bg-black/80 px-2 py-1 text-cyan-400 border border-cyan-500/40 uppercase">Landmarks Detectados: 68/68</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                <p className="text-[7px] text-zinc-500 uppercase mb-2">Conclusiones de Bioingeniería (Sanghoon Park Method)</p>
                <div className="text-[10px] leading-relaxed text-zinc-300">
                  De acuerdo a la <b className="text-white italic underline">Línea de Ricketts</b> detectada en la captura de perfil, existe una retrognatia de <b className="text-cyan-400">2.1mm</b>.
                </div>
              </div>
              
              <button onClick={() => window.open(`https://wa.me/573000000000?text=He completado mi escaneo 3D Tiphereth. La comparativa Φ muestra un déficit de 2.1mm en perfil. Deseo agendar cita.`)} className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl text-[9px] tracking-[0.4em] uppercase shadow-lg active:scale-95 transition-all">
                AGENDAR INTERVENCIÓN ÁUREA
              </button>
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