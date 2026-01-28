"use client";
import React, { useRef, useState } from 'react';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState('camera'); 
  const [loading, setLoading] = useState(false);
  
  // Datos del paciente
  const [formData, setFormData] = useState({ whatsapp: '', email: '' });

  const startLiveCamera = async () => {
    try {
      const constraints = { video: { facingMode: "user" } };
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processResult = () => {
    if (!formData.whatsapp || !formData.email) {
      alert("Arquitecto, para la sincronización Tiphereth el Email y WhatsApp son obligatorios.");
      return;
    }
    setLoading(true);
    // Simulación de análisis profundo
    setTimeout(() => {
      setLoading(false);
      setStep('result');
    }, 2500);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center p-4 font-sans selection:bg-cyan-500">
      
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-xl tracking-[0.4em] font-extralight uppercase">Tiphereth Station</h1>
        <div className="h-[1px] w-8 bg-cyan-500 mx-auto mt-2 opacity-50" />
      </div>

      <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* VISUALIZADOR */}
        {(step === 'camera' || step === 'sync') && (
          <>
            {capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover animate-pulse-subtle" />
            ) : (
              <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
            )}

            {!stream && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/95 gap-4 p-8">
                <button onClick={startLiveCamera} className="w-full py-4 bg-cyan-600 rounded-xl text-[10px] font-bold tracking-widest uppercase active:scale-95">Activar Bio-Sensor</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase">Importar Registro</button>
              </div>
            )}
          </>
        )}

        {/* SINCRONIZACIÓN (OBLIGATORIA) */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-50 p-8 flex flex-col justify-center space-y-4">
            {loading ? (
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[9px] tracking-[0.4em] text-cyan-400 uppercase">Calculando Geometría Sagrada...</p>
              </div>
            ) : (
              <>
                <p className="text-center text-[10px] tracking-widest text-cyan-400 uppercase mb-4">Registro de ADN</p>
                <input 
                  type="tel" 
                  placeholder="WHATSAPP" 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" 
                />
                <input 
                  type="email" 
                  placeholder="EMAIL" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" 
                />
                <button onClick={processResult} className="w-full bg-white text-black py-4 rounded-xl font-bold text-[10px] tracking-widest uppercase active:bg-cyan-400 transition-colors">Generar Reporte Φ</button>
              </>
            )}
          </div>
        )}

        {/* RESULTADOS (LA REVELACIÓN) */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center p-8 text-center animate-in fade-in duration-1000">
            <div className="w-12 h-12 rounded-full border border-cyan-500 flex items-center justify-center mb-6 mt-4">
              <span className="text-cyan-400 text-2xl font-light">Φ</span>
            </div>
            
            <div className="w-full space-y-5">
              <div className="p-5 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] border border-white/10">
                <p className="text-[8px] text-cyan-400 tracking-[0.3em] uppercase mb-1">Simetría Áurea</p>
                <p className="text-3xl font-extralight text-white">98.8%</p>
                <p className="text-[7px] text-zinc-500 mt-2 uppercase tracking-widest">Casi Perfección Universal</p>
              </div>

              <div className="text-left space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Tercio Superior</span>
                  <span className="text-[10px] text-cyan-400">1.618</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Proyección Nasal</span>
                  <span className="text-[10px] text-cyan-400">Óptima</span>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed text-zinc-400 italic font-light pt-4 border-t border-white/5">
                "Su estructura sigue los principios de la Belleza Universal. No se sugieren cambios invasivos, solo mantenimiento de la armonía actual."
              </p>
            </div>

            <button onClick={() => window.location.reload()} className="mt-auto mb-2 w-full py-4 text-[8px] tracking-widest uppercase text-zinc-600 border border-white/5 rounded-xl">Reiniciar Protocolo</button>
          </div>
        )}

        <input type="file" ref={fileInputRef} accept="image/*" capture="user" className="hidden" onChange={handleFile} />
      </div>

      {(stream || capturedImage) && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-10 w-full max-w-[320px] py-5 bg-cyan-600 text-white font-bold rounded-full text-[10px] tracking-[0.4em] uppercase shadow-2xl animate-bounce-subtle">
          Analizar Armonía
        </button>
      )}
    </div>
  );
}