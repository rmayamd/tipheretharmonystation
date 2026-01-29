"use client";
import React, { useRef, useState } from 'react';

// === PROTOCOLO DE CONEXIÓN MAESTRA ===
const WS_BUSINESS = "573117936211";
const WS_PERSONAL = "573014993452";

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type AnalysisLayer = 'REAL' | 'HEMOGLOBIN' | 'MELANIN' | 'UV_DEEP' | 'BONE_STRUCT';

export default function TipherethV30() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<AnalysisLayer>('REAL');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const startClinicalProtocol = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 } } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await speak("Iniciando Escaneo de Bio-Ingeniería Tiphereth. Calibrando sensores multiespectrales.");
        
        let p = 0;
        const interval = setInterval(() => {
          p += 1; setProgress(p);
          if (p === 30) speak("Sincronizando malla de puntos áureos.");
          if (p === 60) speak("Mapeando flujo de hemoglobina sub-dérmica.");
          if (p === 100) {
            clearInterval(interval);
            const canvas = document.createElement('canvas');
            canvas.width = 1080; canvas.height = 1440;
            canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, 1080, 1440);
            setPhotos([canvas.toDataURL('image/jpeg')]);
            s.getTracks().forEach(t => t.stop());
            setStep('sync');
            simulateMasterAI();
          }
        }, 50);
      }
    } catch (e) { alert("Error de acceso a periférico óptico."); }
  };

  const simulateMasterAI = () => {
    const msgs = ["Analizando Desviación Φ...", "Filtro de Wood Activo...", "Detectando Bio-Edad Real...", "Compilando Manifiesto..."];
    msgs.forEach((m, i) => setTimeout(() => {
      setLogs(p => [...p, m]);
      if (i === msgs.length - 1) setTimeout(() => setStep('lead'), 1000);
    }, i * 900));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 p-4 font-mono flex flex-col items-center selection:bg-cyan-900 overflow-x-hidden">
      
      {/* 1. HUD DE BIO-COMANDO (HEADS-UP DISPLAY) */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 group">
          <div className="absolute inset-0 rounded-full border-[0.5px] border-cyan-500/20 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-[2px] rounded-full border-[0.5px] border-white/10" />
          
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke="#06b6d4" strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-200" />
          </svg>

          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/5 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <h1 className="text-white text-[10px] tracking-[0.8em] font-black mb-1 uppercase">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10">Human Engineering Interface</p>
                <button onClick={startClinicalProtocol} className="bg-cyan-500 text-black px-10 py-3 rounded-sm font-black text-[9px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/20">Iniciar Protocolo</button>
              </div>
            )}
            {step === 'scanning' && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-80" />}
            {(step === 'result' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-500 
                ${activeLayer === 'HEMOGLOBIN' ? 'hue-rotate-[-30deg] saturate-[3] contrast-150' : ''}
                ${activeLayer === 'MELANIN' ? 'brightness-50 contrast-200 sepia' : ''}
                ${activeLayer === 'UV_DEEP' ? 'invert brightness-125 saturate-0' : ''}
                ${activeLayer === 'BONE_STRUCT' ? 'grayscale contrast-[4] brightness-75' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* 2. TERMINAL DE DATOS */}
      <div className="w-full max-w-sm">
        {step === 'sync' && <div className="space-y-1 p-6 bg-zinc-900/40 border-l border-cyan-500/50 backdrop-blur-md">{logs.map((l, i) => <p key={i} className="text-[8px] text-cyan-500/80 uppercase">[{new Date().toLocaleTimeString()}] {l}</p>)}</div>}
        
        {step === 'lead' && (
          <div className="space-y-4 p-6 bg-zinc-900/20 border border-white/5 rounded-sm animate-in fade-in duration-700">
            <p className="text-[8px] text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-2">Identidad Biométrica Requerida</p>
            <input type="text" placeholder="ID PACIENTE / NOMBRE" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-3 text-[10px] text-white focus:border-cyan-500 transition-all outline-none" />
            <input type="tel" placeholder="NODO CONTACTO (WHATSAPP)" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-3 text-[10px] text-white focus:border-cyan-500 transition-all outline-none" />
            <button onClick={() => userData.name && setStep('result')} className="w-full border border-cyan-500/50 text-cyan-400 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">Sincronizar Diagnóstico</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-1">
              {(['REAL', 'HEMOGLOBIN', 'MELANIN', 'UV_DEEP', 'BONE_STRUCT'] as AnalysisLayer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`py-2 text-[6px] font-bold border ${activeLayer === l ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_#06b6d4]' : 'border-white/5 text-zinc-600'}`}>{l}</button>
              ))}
            </div>
            <div className="bg-zinc-950 p-6 border-t-2 border-cyan-500">
               <p className="text-[9px] text-cyan-400 font-black uppercase mb-4 tracking-widest">Alerta de Ingeniería Facial</p>
               <p className="text-[10px] text-zinc-400 leading-relaxed italic mb-6">"Pérdida de tensión en el sistema SMAS detectada. Desviación del eje de Park: 7.2%. Requiere Reingeniería Estructural V-Line de forma prioritaria."</p>
               <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">Generar Manifiesto de Ingeniería</button>
            </div>
          </div>
        )}

        {/* 3. EL MANIFIESTO DE INGENIERÍA HUMANA (REPORTE ELITE) */}
        {step === 'report' && (
          <div className="bg-white text-black p-10 shadow-2xl animate-in zoom-in duration-500 mb-20 border-[10px] border-zinc-100">
            <header className="flex justify-between items-start mb-10 border-b-2 border-black pb-4">
               <div className="font-black text-[14px] leading-none italic uppercase">Tiphereth<br/>Harmony<br/>Station</div>
               <div className="text-right">
                  <p className="text-[8px] font-black uppercase bg-black text-white px-2 py-1">Documento Confidencial</p>
                  <p className="text-[7px] text-zinc-400 mt-2 uppercase">Ref: {userData.name.substring(0,3).toUpperCase()}-{Math.floor(Math.random()*999)}</p>
               </div>
            </header>

            {/* Análisis Geométrico */}
            <div className="grid grid-cols-2 gap-8 mb-10">
               <div className="relative">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-2">Base Estructural</p>
                  <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale" />
                  <div className="absolute inset-0 border-[0.5px] border-cyan-500/40 grid grid-cols-6 grid-rows-8 opacity-50" />
               </div>
               <div className="relative">
                  <p className="text-[7px] font-black text-cyan-600 uppercase mb-2">Proyección Φ (Keter)</p>
                  <img src={photos[0]} className="w-full aspect-[3/4] object-cover contrast-125 brightness-110 saturate-[0.5]" />
                  <div className="absolute inset-0 bg-cyan-600/5 mix-blend-overlay" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/50" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400/50" />
               </div>
            </div>

            {/* Dashboard de Bio-Métricas (Superando a Canfield) */}
            <div className="grid grid-cols-2 gap-6 mb-10">
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[8px] font-black uppercase mb-1"><span>Salud Dérmica</span><span>82%</span></div>
                    <div className="w-full h-1 bg-zinc-100"><div className="w-[82%] h-full bg-emerald-500" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[8px] font-black uppercase mb-1"><span>Riesgo UV</span><span className="text-red-500">CRÍTICO</span></div>
                    <div className="w-full h-1 bg-zinc-100"><div className="w-[92%] h-full bg-red-500" /></div>
                  </div>
               </div>
               <div className="bg-zinc-50 p-4 border border-zinc-100 flex flex-col justify-center text-center">
                  <p className="text-[7px] font-black text-zinc-400 uppercase mb-1">Simetría Áurea</p>
                  <p className="text-2xl font-black text-cyan-600 tracking-tighter">94.2%</p>
               </div>
            </div>

            {/* Tabla de Ratios Maestros */}
            <div className="bg-black text-white p-6 mb-10">
               <h3 className="text-center text-[8px] font-black tracking-[0.5em] uppercase mb-6 text-cyan-400">Ratios de Park (1.8 : 2.0 : 1.0)</h3>
               <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-white/10 p-2"><p className="text-[6px] text-zinc-500">SUPERIOR</p><p className="text-[12px] font-bold">1.82</p></div>
                  <div className="border border-white/10 p-2"><p className="text-[6px] text-zinc-500">MEDIO</p><p className="text-[12px] font-bold">2.01</p></div>
                  <div className="border border-cyan-500 p-2 text-red-500"><p className="text-[6px] text-red-400">INFERIOR</p><p className="text-[12px] font-black">0.92</p></div>
               </div>
            </div>

            {/* Prescripción de Bio-Ingeniería */}
            <div className="mb-10 text-[9px] italic text-zinc-600 leading-relaxed space-y-3 border-l-4 border-black pl-4">
               <p><strong>RECOMENDACIÓN TÉCNICA:</strong> Se requiere corrección de ángulo mandibular y reposicionamiento de compartimentos grasos malares.</p>
               <p><strong>ESTADO INTEGRAL:</strong> InBody (Sincronizado) | BioScanner (Normal) | Keter Status (Pendiente).</p>
            </div>

            <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Shalom Dr. Maya, soy ${userData.name.toUpperCase()}. He recibido mi Manifiesto de Ingeniería Tiphereth. Mi Ratio Inferior es de 0.92 y busco alcanzar la Armonía Φ.`)} 
              className="w-full bg-black text-white py-6 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all mb-4">
              Materializar Plan de Ingeniería
            </button>
            <p className="text-center text-[7px] text-zinc-400 uppercase tracking-widest">Protocolo de Alta Fidelidad Bio-Mirror 10.0</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}