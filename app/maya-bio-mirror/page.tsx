"use client";
import React, { useRef, useState, useEffect } from 'react';

// === CONFIGURACIÓN MAESTRA DR. MAYA ROMO ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4"; // Cian Tiphereth

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type View = 'FRENTE' | 'PERFIL' | 'CENITAL';
type Layer = 'BIOMÉTRICA' | 'CROMÓFOROS' | 'VASCULAR' | 'TENSIÓN';

export default function TipherethV33() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<Step>('intro');
  const [view, setView] = useState<View>('FRENTE');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', phone: '', age: '' });
  const [activeLayer, setActiveLayer] = useState<Layer>('BIOMÉTRICA');

  const speak = (txt: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'es-ES'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const captureFrame = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 1080, 1440);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const runProtocol = async (stream: MediaStream) => {
    await speak("Iniciando Reconocimiento de Ingeniería Humana. Mantenga el eje central.");
    
    // Captura Frontal
    setView('FRENTE');
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();
    await speak("Gire rostro a noventa grados para perfilometría.");

    // Captura Perfil
    setView('PERFIL');
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();
    await speak("Incline levemente para análisis de arco mandibular.");

    // Captura Cenital
    setView('CENITAL');
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureFrame();

    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    
    const m = [
      "Sincronizando con InBody H30...",
      "Calculando Ratios de Park (Φ)...",
      "Analizando Capas de Cromóforos...",
      "Cruzando Tratados de Obagi y Connell...",
      "Generando Manifiesto de Inmortalidad..."
    ];
    for (const msg of m) {
      setLogs(p => [...p, msg]);
      await new Promise(r => setTimeout(r, 1000));
    }
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        runProtocol(s);
      }
    } catch (e) { alert("Error de Calibración Óptica."); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center overflow-x-hidden">
      
      {/* HUD - EL OJO DE TIPHERETH */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 animate-in fade-in zoom-in duration-700">
          <div className="absolute inset-0 rounded-full border-[0.5px] border-cyan-500/20 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-[0.5px] border-white/5 shadow-[0_0_50px_rgba(6,182,212,0.05)]" />
          
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke={THEME_COLOR} strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300" />
          </svg>

          <div className="w-[84%] h-[84%] m-[8%] rounded-full overflow-hidden bg-black relative border border-white/10 shadow-inner">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] tracking-[0.8em] font-black mb-1 italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Sovereign Medical System</p>
                <button onClick={initSystem} className="bg-cyan-500 text-black px-12 py-4 rounded-sm font-black text-[9px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-lg shadow-cyan-500/20 active:scale-95">Iniciar Escaneo</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-70" />
                <div className="absolute top-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-[scan_3s_linear_infinite]" />
                <div className="absolute bottom-6 inset-x-0 text-center">
                  <span className="bg-black/60 px-4 py-1 rounded text-[8px] font-black text-cyan-400 border border-cyan-500/30 uppercase tracking-[0.4em]">{view} ACTIVADA</span>
                </div>
              </>
            )}
            {(step === 'result' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === 'CROMÓFOROS' ? 'contrast-150 saturate-[2.5] hue-rotate-180' : ''}
                ${activeLayer === 'VASCULAR' ? 'sepia contrast-[1.8] brightness-75' : ''}
                ${activeLayer === 'TENSIÓN' ? 'grayscale contrast-[4] invert' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* TERMINAL DE LOGS */}
      <div className="w-full max-w-sm space-y-6">
        {step === 'sync' && (
          <div className="bg-zinc-900/40 p-6 border-l-2 border-cyan-500 backdrop-blur-sm animate-pulse">
            {logs.map((l, i) => <p key={i} className="text-[8px] text-cyan-500/80 mb-1 uppercase">[{new Date().toLocaleTimeString()}] {l}</p>)}
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-lg animate-in slide-in-from-bottom duration-700">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.5em] text-center mb-6">Filiación de Ingeniería</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[10px] text-white focus:border-cyan-500 outline-none transition-all uppercase" />
            <input type="tel" placeholder="NODO WHATSAPP" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[10px] text-white focus:border-cyan-500 outline-none transition-all" />
            <button onClick={() => userData.name && setStep('result')} className="w-full bg-white text-black py-5 text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-colors">Generar Manifiesto</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-1">
              {(['BIOMÉTRICA', 'CROMÓFOROS', 'VASCULAR', 'TENSIÓN'] as Layer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`py-3 text-[6px] font-black border transition-all ${activeLayer === l ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_#06b6d4]' : 'border-white/5 text-zinc-600'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-950 p-6 border-t-2 border-cyan-500 shadow-2xl">
              <p className="text-[10px] text-white font-black uppercase mb-4 tracking-widest">Hallazgo Crítico Detectado</p>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic mb-8 border-l border-white/10 pl-4">"Deficiencia en la matriz de colágeno detectada vía Bioscáner. Simetría mandibular en 0.92 (Déficit Φ). Se recomienda Reingeniería Tiphereth inmediata."</p>
              <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 font-black text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-all">Ver Pasaporte de Inmortalidad</button>
            </div>
          </div>
        )}

        {/* REPORTE: EL PASAPORTE DE INMORTALIDAD */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-10 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.2)] animate-in zoom-in duration-500 mb-20 border-[12px] border-zinc-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16" />
            
            <header className="flex justify-between items-start mb-12 border-b-2 border-black pb-6">
              <div className="font-black text-[16px] leading-none italic uppercase tracking-tighter">TIPHERETH<br/>HARMONY<br/>STATION</div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase bg-black text-white px-3 py-1 mb-2">Manifiesto Confidencial</p>
                <p className="text-[7px] text-zinc-400 font-bold uppercase tracking-widest">Dr. Ricardo Maya Romo</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="relative group">
                <img src={photos[0]} className="w-full aspect-[3/4] object-cover rounded-2xl grayscale contrast-125" />
                <div className="absolute inset-0 border border-cyan-500/40 grid grid-cols-6 grid-rows-8 opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-zinc-50 p-4 border border-zinc-100 rounded-xl">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Simetría Axial (Φ)</p>
                  <p className="text-3xl font-black text-cyan-600 tracking-tighter">94.2%</p>
                </div>
                <div className="bg-zinc-50 p-4 border border-zinc-100 rounded-xl">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1 tracking-widest">Edad Biológica (Quantum)</p>
                  <p className="text-3xl font-black text-black tracking-tighter">-4 AÑOS</p>
                </div>
              </div>
            </div>

            {/* RATIOS DE PARK - EL CORAZÓN DE LA VENTA */}
            <div className="bg-black text-white p-6 rounded-3xl mb-10 shadow-xl">
              <h3 className="text-center text-[8px] font-black tracking-[0.5em] uppercase mb-6 text-cyan-400 italic">Análisis Estructural de Park</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="border border-white/10 p-3"><p className="text-[6px] text-zinc-500 uppercase mb-1">Superior</p><p className="text-[14px] font-black">1.82</p></div>
                <div className="border border-white/10 p-3"><p className="text-[6px] text-zinc-500 uppercase mb-1">Medio</p><p className="text-[14px] font-black">2.01</p></div>
                <div className="border border-cyan-500 p-3 text-red-500 animate-pulse"><p className="text-[6px] text-red-400 uppercase mb-1 font-black">Inferior</p><p className="text-[14px] font-black">0.92</p></div>
              </div>
            </div>

            {/* CONSEJO TERAPÉUTICO (NIVEL 5 Y 6) */}
            <div className="space-y-6 mb-12">
              <div className="border-l-4 border-black pl-6">
                <p className="text-[8px] font-black text-zinc-400 uppercase mb-2">Intervención Quirúrgica Sugerida</p>
                <p className="text-[11px] font-bold text-black italic leading-tight uppercase">Park V-Line Mandibular + Reposicionamiento de SMAS (Connell)</p>
              </div>
              <div className="border-l-4 border-cyan-500 pl-6">
                <p className="text-[8px] font-black text-cyan-600 uppercase mb-2">Protocolo Preventivo Mesoestetic</p>
                <p className="text-[10px] font-medium text-zinc-600 leading-snug">Uso de AOX Ferulic cada 12h + Melan Tran3x para control de cromóforos activos detectados.</p>
              </div>
            </div>

            <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto Tiphereth. Mi Ratio Inferior es de 0.92 y busco alcanzar la Armonía Φ a través de su intervención quirúrgica.`)} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all mb-4 hover:bg-cyan-600">
              Materializar Plan Maestro
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase tracking-[0.5em] mt-8 font-serif italic">The absolute standard in aesthetic engineering.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}