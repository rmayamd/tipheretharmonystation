"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN SAGRADA ===
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";
const PHI = 1.618; // La Proporción Divina

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type SkinVision = 'REAL' | 'WOOD' | 'UV' | 'VASCULAR' | 'TEXTURA' | 'MANCHAS';

export default function TipherethKeter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeVision, setActiveVision] = useState<SkinVision>('REAL');
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const runKeterScan = async () => {
    setStep('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        speak("Iniciando Ascenso a Keter. El sistema está mapeando su geometría divina. Manténgase presente.");
        
        let p = 0;
        const interval = setInterval(() => {
          p += 1;
          setProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            capture();
            stream.getTracks().forEach(t => t.stop());
            setStep('sync');
            setTimeout(() => setStep('lead'), 3000);
          }
        }, 60);
      }
    } catch (e) { alert("Acceso denegado a la luz."); }
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (videoRef.current) {
      ctx?.drawImage(videoRef.current, 0, 0, 720, 960);
      setPhotos([canvas.toDataURL('image/jpeg')]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center font-serif selection:bg-cyan-500">
      
      {/* 1. EL ESPEJO DEL ALMA (SCANNER) */}
      {step !== 'report' && (
        <div className="relative group" style={{ width: 300 * PHI / 1.5, height: 300 * PHI / 1.5 }}>
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-pulse scale-105" />
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 relative shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950">
                <h1 className="text-cyan-400 text-[10px] tracking-[0.8em] font-black mb-2 uppercase italic">TIPHERETH STATION</h1>
                <p className="text-[6px] text-zinc-500 uppercase tracking-widest mb-8">Ascenso a la Perfección Estética</p>
                <button onClick={runKeterScan} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-colors shadow-2xl">Aspirar a Keter</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400 shadow-[0_0_15px_cyan] animate-bounce" />
              </>
            )}
            {(step === 'result' || step === 'lead') && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-1000 
                ${activeVision === 'WOOD' ? 'hue-rotate-180 saturate-200 contrast-150' : ''}
                ${activeVision === 'UV' ? 'invert sepia saturate-[5]' : ''}
                ${activeVision === 'VASCULAR' ? 'brightness-110 contrast-200 saturate-200' : ''}
                ${activeVision === 'TEXTURA' ? 'grayscale contrast-[3] brightness-75' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* 2. DATOS DE PODER (LEADS) */}
      <div className="mt-12 w-full max-w-[360px]">
        {step === 'lead' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-1000">
            <h2 className="text-center text-[9px] tracking-widest text-zinc-500 uppercase mb-6 italic">Sincronización de Identidad Divina</h2>
            <input type="text" placeholder="Nombre de su Linaje" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-zinc-900/50 border border-white/5 p-5 rounded-2xl text-[10px] text-white outline-none focus:border-cyan-500 transition-all" />
            <input type="tel" placeholder="WhatsApp (Conexión Directa)" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-zinc-900/50 border border-white/5 p-5 rounded-2xl text-[10px] text-white outline-none focus:border-cyan-500 transition-all" />
            <button onClick={() => setStep('result')} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg">Revelar Mi Destino Estético</button>
          </div>
        )}

        {/* 3. DIAGNÓSTICO Φ (VISIA + INBODY + COMPARATIVO) */}
        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap justify-center gap-1">
              {(['REAL', 'WOOD', 'UV', 'VASCULAR', 'TEXTURA', 'MANCHAS'] as SkinVision[]).map((v) => (
                <button key={v} onClick={() => setActiveVision(v)} className={`px-3 py-2 text-[6px] font-bold rounded-md border transition-all ${activeVision === v ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_cyan]' : 'border-white/5 text-zinc-500 uppercase'}`}>{v}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 p-4 rounded-3xl border border-white/5 text-center">
                <p className="text-[7px] text-zinc-500 uppercase mb-2 italic tracking-tighter">Módulo InBody</p>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-tighter animate-pulse">Sincronizado</div>
                <p className="text-[6px] text-zinc-400 mt-1">Grasa: 14% | Músculo: Óptimo</p>
              </div>
              <div className="bg-zinc-900/80 p-4 rounded-3xl border border-white/5 text-center">
                <p className="text-[7px] text-zinc-500 uppercase mb-2 italic tracking-tighter">Bio-Scanner</p>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-tighter animate-pulse">Activo</div>
                <p className="text-[6px] text-zinc-400 mt-1">Vitalidad Celular: 92%</p>
              </div>
            </div>

            <button onClick={() => setStep('report')} className="w-full bg-white text-black py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">Expedir Certificado Maestro</button>
          </div>
        )}

        {/* 4. REPORTE FINAL: ANTES/DESPUÉS Y TRANSFORMACIÓN */}
        {step === 'report' && (
          <div className="bg-white text-black p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-in zoom-in duration-700">
            <header className="text-center mb-10 border-b pb-6">
              <h1 className="text-[14px] font-black tracking-[0.5em] italic mb-1 uppercase">Tiphereth Clinical Report</h1>
              <p className="text-[8px] text-zinc-400 tracking-[0.2em] font-serif uppercase">The Divine Path to Keter</p>
            </header>

            <div className="grid grid-cols-2 gap-6 mb-10 italic">
              <div>
                <p className="text-[7px] font-black text-zinc-400 uppercase mb-2 text-center">Estado Actual (Sefirot Malkhut)</p>
                <img src={photos[0]} className="w-full aspect-[3/4] object-cover rounded-2xl grayscale opacity-60 grayscale-[0.5]" />
              </div>
              <div>
                <p className="text-[7px] font-black text-cyan-600 uppercase mb-2 text-center">Transformación (Sefirot Keter)</p>
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl">
                  <img src={photos[0]} className="w-full h-full object-cover scale-105 brightness-110 saturate-[0.8] contrast-110" />
                  <div className="absolute inset-0 bg-cyan-400/10 mix-blend-color" />
                  <div className="absolute bottom-2 right-2 text-[6px] bg-black text-white px-2 py-1 rounded-md">SIMULACIÓN Φ</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 bg-zinc-50 p-6 rounded-3xl border border-zinc-100 shadow-inner">
               <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center italic border-b pb-2">Plan Maestro de Reingeniería</p>
               <ul className="text-[10px] space-y-3 font-medium">
                  <li className="flex justify-between"><span>Optimización V-Line (Park 1.0)</span> <span className="text-cyan-600 font-bold">RECOMENDADO</span></li>
                  <li className="flex justify-between"><span>Bio-Estimulación Sefirótica</span> <span className="text-cyan-600 font-bold">RECOMENDADO</span></li>
                  <li className="flex justify-between"><span>Armonización Áurea Orbital</span> <span className="text-emerald-600 font-bold">PRIORIDAD</span></li>
               </ul>
            </div>

            <button 
              onClick={() => {
                const msg = encodeURIComponent(`Shalom Dr. Maya, soy ${userData.name.toUpperCase()}. He visto mi transformación a Keter (94.2% Φ). Deseo materializar mi Plan Maestro de Bioingeniería.`);
                window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=${msg}`);
              }}
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all mb-4">
              Materializar Mi Transformación
            </button>
            <p className="text-[6px] text-zinc-400 text-center uppercase tracking-widest italic leading-relaxed">"Lo que está arriba es como lo que está abajo. Tiphereth es el equilibrio perfecto."</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;900&display=swap');
        body { font-family: 'Cinzel', serif; letter-spacing: 0.05em; }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}