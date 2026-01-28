"use client";
import React, { useRef, useState, useEffect } from 'react';

type Module = 'facial' | 'breast' | 'body';

export default function BioMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState('camera'); // camera, sync, analysis, result
  const [module, setModule] = useState<Module>('facial');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ whatsapp: '', email: '' });

  // Iniciar Cámara
  const startCamera = async () => {
    try {
      const constraints = { video: { facingMode: "user" } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
        setStream(newStream);
      }
    } catch (err) { fileInputRef.current?.click(); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        if (stream) stream.getTracks().forEach(t => t.stop());
        setStream(null);
        setStep('sync');
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    if (!formData.whatsapp || !formData.email) {
      alert("Sincronización requerida para el protocolo Tiphereth.");
      return;
    }
    setStep('analysis');
    setTimeout(() => setStep('result'), 3500);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 font-sans selection:bg-cyan-500 overflow-x-hidden">
      
      {/* HEADER DINÁMICO */}
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-xl tracking-[0.5em] font-extralight uppercase">MAYA BIO-MIRROR</h1>
        <p className="text-cyan-500 text-[7px] tracking-[0.4em] uppercase mt-1">Unidad de Bioingeniería Tiphereth</p>
      </div>

      {/* SELECTOR DE MÓDULO */}
      {step === 'camera' && (
        <div className="flex justify-center gap-2 mb-6">
          {(['facial', 'breast', 'body'] as Module[]).map((m) => (
            <button 
              key={m}
              onClick={() => setModule(m)}
              className={`px-4 py-2 rounded-full text-[8px] tracking-widest uppercase border transition-all ${module === m ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-white/10 text-zinc-500'}`}
            >
              {m === 'facial' ? 'Rostro' : m === 'breast' ? 'Mamas' : 'Lipo HD'}
            </button>
          ))}
        </div>
      )}

      {/* ÁREA DE ESCANEO */}
      <div className="relative w-full max-w-[340px] mx-auto aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
        
        {/* VIDEO / IMAGEN */}
        {(step !== 'result') && (
          <div className="relative h-full w-full">
            {capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000" />
            ) : (
              <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
            )}

            {/* OVERLAY DE MÁSCARA (Medidas del PDF) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Guías de Proporción 1.8 : 2.0 : 1.0 */}
              <div className="absolute top-0 w-full h-[37.5%] border-b border-cyan-500/20 flex items-end justify-start p-2">
                <span className="text-[6px] text-cyan-400">SEC_A: 1.8</span>
              </div>
              <div className="absolute top-[37.5%] w-full h-[41.6%] border-b border-cyan-500/20 flex items-end justify-start p-2">
                <span className="text-[6px] text-cyan-400">SEC_B: 2.0 (Φ)</span>
              </div>
              <div className="absolute bottom-0 w-full h-[20.9%] flex items-start justify-start p-2">
                <span className="text-[6px] text-cyan-400">SEC_C: 1.0</span>
              </div>
              
              {/* LANDMARKS DINÁMICOS */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[75%] border border-cyan-500/10 rounded-full" />
            </div>

            {/* ANIMACIÓN DE ESCANEO */}
            {step === 'analysis' && (
              <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="absolute top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_cyan] animate-scan-move" />
                <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[8px] tracking-[0.5em] text-cyan-400 uppercase font-bold animate-pulse">Analizando Estructura Ósea...</p>
              </div>
            )}
          </div>
        )}

        {/* INICIO SIN IMAGEN */}
        {step === 'camera' && !capturedImage && !stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 gap-4 p-8">
            <button onClick={startCamera} className="w-full py-4 bg-cyan-600 rounded-xl text-[9px] font-bold tracking-widest uppercase">Activar Bio-Sensor</button>
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold tracking-widest uppercase">Subir Registro</button>
          </div>
        )}

        {/* REGISTRO DE DATOS */}
        {step === 'sync' && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-50 p-8 flex flex-col justify-center gap-4 animate-in fade-in duration-500">
            <p className="text-center text-[9px] tracking-[0.4em] text-cyan-400 uppercase mb-4">Sincronización Biométrica</p>
            <input type="tel" placeholder="WHATSAPP" onChange={(e)=>setFormData({...formData, whatsapp:e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" />
            <input type="email" placeholder="EMAIL" onChange={(e)=>setFormData({...formData, email:e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs outline-none focus:border-cyan-500" />
            <button onClick={startAnalysis} className="w-full bg-white text-black py-4 rounded-xl font-bold text-[9px] tracking-[0.3em] uppercase transition-all active:bg-cyan-500">Procesar Diagnóstico</button>
          </div>
        )}

        {/* RESULTADOS (VECTRA H2 STYLE) */}
        {step === 'result' && (
          <div className="absolute inset-0 bg-zinc-950 z-[60] flex flex-col p-6 overflow-y-auto animate-in slide-in-from-bottom duration-1000">
            <header className="flex justify-between items-center mb-6">
              <span className="text-[7px] text-cyan-400 tracking-[0.4em] uppercase">Reporte Tiphereth v12</span>
              <span className="text-white text-[9px] font-bold border-b border-white/20 cursor-pointer uppercase" onClick={() => window.location.reload()}>Reset</span>
            </header>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[6px] text-zinc-500 uppercase tracking-widest mb-1">Simetría Φ</p>
                  <p className="text-xl font-light text-cyan-400">94.2%</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[6px] text-zinc-500 uppercase tracking-widest mb-1">Estado Tisular</p>
                  <p className="text-xl font-light text-green-400">Óptimo</p>
                </div>
              </div>

              {/* RECOMENDACIONES SEGÚN MÓDULO */}
              <div className="p-5 bg-gradient-to-b from-cyan-900/20 to-transparent rounded-3xl border border-cyan-500/20 text-left">
                <h4 className="text-[9px] text-cyan-400 tracking-widest uppercase font-bold mb-3 italic">Plan Maestro de Armonía:</h4>
                
                {module === 'facial' && (
                  <div className="space-y-4">
                    <div className="text-[9px] text-zinc-300 leading-relaxed">
                      <b className="text-white">Análisis Óseo:</b> Déficit en ángulo Gonion y Pogonion. Se requiere definir la <i className="text-cyan-400">V-Line</i>.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <p className="text-[6px] text-cyan-500 uppercase mb-1">Quirúrgico</p>
                        <p className="text-[8px]">Reducción de Cigoma y Mentoplastia (Método Sanghoon Park).</p>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <p className="text-[6px] text-cyan-500 uppercase mb-1">No Invasivo</p>
                        <p className="text-[8px]">MD Codes: 4cc Hyaluronic en mentón y botox en maseteros.</p>
                      </div>
                    </div>
                  </div>
                )}

                {module === 'breast' && (
                  <p className="text-[9px] leading-relaxed text-zinc-300">
                    <b className="text-white">Ratio Φ detectado: 50:50.</b> Se sugiere redistribución de volumen para alcanzar el <b className="text-cyan-400">45:55</b> ideal mediante Mastopexia o Implantes Ergonómicos de 320cc.
                  </p>
                )}

                {module === 'body' && (
                  <p className="text-[9px] leading-relaxed text-zinc-300">
                    <b className="text-white">WHR (Cintura/Cadera): 0.78.</b> Objetivo: 0.70. Recomendación: Lipoescultura HD con transferencia grasa a cuadrantes superiores de glúteos.
                  </p>
                )}
              </div>
            </div>

            <button onClick={() => window.open(`https://wa.me/573000000000?text=Hola, mi diagnóstico Tiphereth arrojó 94.2% de simetría en el módulo ${module}. Deseo una valoración.`)} className="mt-8 w-full py-5 bg-cyan-600 text-white font-bold rounded-2xl text-[9px] tracking-[0.4em] uppercase shadow-lg shadow-cyan-900/40 active:scale-95 transition-all">
              Agendar Protocolo Tiphereth
            </button>
          </div>
        )}

        <input type="file" ref={fileInputRef} accept="image/*" capture="user" className="hidden" onChange={handleFile} />
      </div>

      {/* BOTÓN CONTINUAR */}
      {(capturedImage || stream) && step === 'camera' && (
        <button onClick={() => setStep('sync')} className="mt-8 w-full max-w-[340px] py-5 bg-white text-black font-bold rounded-full text-[10px] tracking-[0.4em] uppercase shadow-2xl mx-auto block animate-bounce-subtle">
          Analizar Armonía
        </button>
      )}

      <style jsx global>{`
        @keyframes scan-move { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-move { animation: scan-move 3.5s linear infinite; }
        .animate-bounce-subtle { animation: bounce 3s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
}