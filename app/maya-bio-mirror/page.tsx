"use client";
import React, { useRef,换个 useState, useEffect } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState('camera'); // 'camera', 'sync', 'result'
  const [loading, setLoading] = useState(false);

  // 1. Activar Cámara en Vivo
  const startLiveCamera = async () => {
    try {
      const constraints = { video: { facingMode: "user" }, audio: false };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        setStream(newStream);
      }
    } catch (err) {
      alert("No se pudo activar la cámara. Usa la opción de 'Subir Foto'.");
    }
  };

  // 2. Capturar Foto de Galería o Cámara Nativa
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Simular Procesamiento de IA
  const processResult = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('result');
      window.scrollTo(0, 0); // Asegura que el resultado se vea desde arriba
    }, 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center p-4 font-sans">
      
      {/* Header Fijo */}
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-xl tracking-[0.3em] font-extralight uppercase">Tiphereth Station</h1>
        <div className="h-[1px] w-8 bg-cyan-500 mx-auto mt-2 opacity-50" />
      </div>

      {/* ÁREA DE VISUALIZACIÓN */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* Paso 1 y 2: Captura/Video */}
        {(step === 'camera' || step === 'sync') && (
          <>
            {capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover" />
            ) : (
              <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
            )}

            {!stream && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 gap-6 p-6">
                <button onClick={startLiveCamera} className="w-full py-4 bg-cyan-600 rounded-xl text-[10px] font-bold tracking-widest uppercase">Usar Cámara en Vivo</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/10 border border-white/20 rounded-xl text-[10px] font-bold tracking-widest uppercase">Subir Foto / Captura</button>
              </div>
            )}
          </>
        )}

        {/* Paso de Sincronización (Overlay) */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col justify-center p-8 space-y-4 animate-in fade-in duration-500">
            {loading ? (
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[9px] tracking-[0.3em] text-cyan-400 uppercase">Analizando ADN Áureo...</p>
              </div>
            ) : (
              <>
                <p className="text-center text-[10px] tracking-widest text-cyan-400 uppercase mb-4">Vincular Identidad</p>
                <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" />
                <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" />
                <button onClick={processResult} className="w-full bg-white text-black py-4 rounded-xl font-bold text-[10px] tracking-widest uppercase">Ver Mi Diagnóstico</button>
              </>
            )}
          </div>
        )}

        {/* Paso 3: Resultados (Independiente) */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center p-6 text-center animate-in slide-in-from-bottom duration-700">
            <div className="mt-8 mb-6">
              <span className="text-cyan-400 text-4xl font-thin">$\phi$</span>
            </div>
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-zinc-500 mb-8">Reporte Generado</h2>
            
            <div className="w-full space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[7px] text-cyan-400 tracking-[0.3em] uppercase mb-1">Simetría Detectada</p>
                <p className="text-2xl font-light">91.5%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[7px] text-zinc-500 tracking-[0.3em] uppercase mb-2">Análisis Tiphereth</p>
                <p className="text-[10px] leading-relaxed text-zinc-300 italic">"Estructura ósea compatible con el ideal áureo. Se sugiere optimización en el tercio medio para maximizar la armonía."</p>
              </div>
            </div>

            <button onClick={() => window.location.reload()} className="mt-auto mb-4 w-full py-4 border border-white/10 rounded-xl text-[8px] tracking-widest uppercase text-zinc-500">Nuevo Escaneo</button>
          </div>
        )}

        <input type="file" ref={fileInputRef} accept="image/*" capture="user" className="hidden" onChange={handleFile} />
      </div>

      {/* Botones Flotantes de Navegación */}
      {(stream || capturedImage) && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-8 w-full max-w-[320px] py-5 bg-cyan-600 text-white font-bold rounded-full text-[10px] tracking-[0.4em] uppercase shadow-lg shadow-cyan-900/20">
          Analizar Simetría
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 4s linear infinite; }
      `}</style>
    </div>
  );
}