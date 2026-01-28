"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [step, setStep] = useState('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Cámara no disponible. Por favor, sube una foto.");
      fileInputRef.current?.click();
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setIsScanning(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center p-6 overflow-hidden">
      <div className="w-full text-center mt-4 mb-8">
        <h2 className="text-xl tracking-[0.3em] font-light uppercase">Bio-Mirror</h2>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
        {/* Vista de Video o Imagen subida */}
        {!capturedImage ? (
          <video ref={videoRef} muted playsInline className={`w-full h-full object-cover ${isScanning ? 'opacity-100' : 'opacity-0'}`} />
        ) : (
          <img src={capturedImage} className="w-full h-full object-cover" />
        )}

        {/* Pantalla Inicial con DOS OPCIONES */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 p-6">
            {!loading ? (
              <div className="flex flex-col gap-6 w-full items-center">
                <button onClick={startCamera} className="w-20 h-20 rounded-full border border-cyan-500 bg-cyan-500/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold tracking-tighter">CÁMARA</span>
                </button>
                <div className="text-[8px] tracking-[0.4em] text-zinc-600 uppercase">O BIEN</div>
                <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white text-black text-[9px] font-bold rounded-full tracking-widest uppercase">
                  SUBIR FOTO
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[9px] tracking-widest text-zinc-400">SOLICITANDO ACCESO...</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
          </div>
        )}

        {/* Capa de Escaneo */}
        {isScanning && step === 'camera' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-scan-move" />
          </div>
        )}

        {/* Formulario Sync */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 p-6 flex flex-col justify-center space-y-4">
            <p className="text-[9px] tracking-widest text-cyan-400 font-bold text-center mb-4 uppercase">Sincronización</p>
            <input type="tel" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none" />
            <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none" />
            <button onClick={() => setStep('result')} className="w-full bg-cyan-600 py-4 rounded-xl font-bold text-[9px] tracking-widest uppercase">Analizar ADN Áureo</button>
          </div>
        )}
      </div>

      {isScanning && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-8 w-full max-w-[320px] py-4 bg-white text-black font-bold rounded-full text-[9px] tracking-[0.4em] uppercase">
          Continuar
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 4s linear infinite; }
      `}</style>
    </div>
  );
}