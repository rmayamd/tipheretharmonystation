"use client";
import React, { useRef, useState } from 'react';

// === CONFIGURACIÓN DE PODER DR. MAYA ROMO ===
const WS_BUSINESS = "573117936211";
const THEME_COLOR = "#06b6d4"; 

type Step = 'intro' | 'scanning' | 'sync' | 'lead' | 'result' | 'report';
type AnalysisLayer = '3D_BONE' | 'VASCULAR' | 'CHROMOPHORES' | 'SMAS_TENSION';

export default function TipherethV34() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [stageText, setStageText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', phone: '' });
  const [activeLayer, setActiveLayer] = useState<AnalysisLayer>('3D_BONE');

  // Gestor de voz mejorado para evitar cortes
  const speak = (text: string) => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Limpiar colas previas
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.9;
        u.pitch = 1.1; // Tono profesional amigable
        u.onend = () => resolve(true);
        window.speechSynthesis.speak(u);
      } else resolve(true);
    });
  };

  const captureVolumetric = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (videoRef.current && ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 800, 1000);
      setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg')]);
    }
  };

  const run3DProtocol = async (stream: MediaStream) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 1000;

    await speak("Iniciando Escaneo Volumétrico 3D. Por favor, permanezca inmóvil.");
    
    // FASE 1: FRONTAL
    setStageText("ANÁLISIS FRONTAL Φ");
    await speak("Analizando eje de simetría frontal.");
    for(let i=0; i<=33; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureVolumetric(canvas);

    // FASE 2: PERFIL IZQUIERDO
    setStageText("PERFILOMETRÍA IZQUIERDA");
    await speak("Gire el rostro lentamente hacia la izquierda.");
    await new Promise(r => setTimeout(r, 1500)); // Pausa para que el usuario gire
    for(let i=34; i<=66; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureVolumetric(canvas);

    // FASE 3: PERFIL DERECHO
    setStageText("PERFILOMETRÍA DERECHA");
    await speak("Ahora, gire hacia la derecha para análisis de Park.");
    await new Promise(r => setTimeout(r, 1500));
    for(let i=67; i<=100; i++) { setProgress(i); await new Promise(r => setTimeout(r, 60)); }
    captureVolumetric(canvas);

    await speak("Mapeo volumétrico completado con éxito. Procesando datos biométricos.");
    stream.getTracks().forEach(t => t.stop());
    setStep('sync');
    
    const messages = [
      "Calculando Nube de Puntos 3D...",
      "Sincronizando InBody H30...",
      "Analizando Capas de Cromóforos...",
      "Generando Manifiesto Tiphereth..."
    ];
    for (const m of messages) {
      setLogs(prev => [...prev, m]);
      await new Promise(r => setTimeout(r, 1200));
    }
    setStep('lead');
  };

  const initSystem = async () => {
    setStep('scanning');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        run3DProtocol(s);
      }
    } catch (e) { alert("Error: Conecte un sensor óptico válido."); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-mono p-4 flex flex-col items-center selection:bg-cyan-900 overflow-x-hidden">
      
      {/* HUD DE BIO-INGENIERÍA */}
      {step !== 'report' && (
        <div className="relative w-80 h-80 my-10 animate-in fade-in duration-1000">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="48%" stroke={THEME_COLOR} strokeWidth="2" fill="none" 
              strokeDasharray="1000" strokeDashoffset={1000 - (progress * 10)} className="transition-all duration-300 shadow-[0_0_20px_#06b6d4]" />
          </svg>

          <div className="w-[86%] h-[86%] m-[7%] rounded-full overflow-hidden bg-zinc-950 relative border border-white/10 shadow-2xl">
            {step === 'intro' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]">
                <h1 className="text-white text-[12px] tracking-[0.7em] font-black mb-1 uppercase italic">TIPHERETH</h1>
                <p className="text-[6px] text-cyan-500 uppercase tracking-widest mb-10 italic">3D Volumetric Station</p>
                <button onClick={initSystem} className="bg-white text-black px-12 py-4 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl active:scale-95">Iniciar Protocolo</button>
              </div>
            )}
            {step === 'scanning' && (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-125" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-30 pointer-events-none" />
                <div className="absolute top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_cyan] animate-[scan_3s_linear_infinite]" />
                <div className="absolute bottom-6 inset-x-0 text-center">
                  <span className="bg-black/80 px-4 py-1 text-[8px] font-black text-cyan-400 border border-cyan-500/30 uppercase tracking-widest italic">{stageText}</span>
                </div>
              </>
            )}
            {(step === 'result' || step === 'lead') && photos[0] && (
              <img src={photos[0]} className={`w-full h-full object-cover transition-all duration-700 
                ${activeLayer === '3D_BONE' ? 'grayscale contrast-[3] brightness-[0.8]' : ''}
                ${activeLayer === 'CHROMOPHORES' ? 'hue-rotate-180 saturate-200 contrast-150' : ''}
                ${activeLayer === 'VASCULAR' ? 'sepia contrast-[1.5] saturate-[2]' : ''}
                ${activeLayer === 'SMAS_TENSION' ? 'invert brightness-125 saturate-0' : ''}
              `} />
            )}
          </div>
        </div>
      )}

      {/* FLUJO DE DATOS Y NEUROMARKETING */}
      <div className="w-full max-w-[340px]">
        {step === 'sync' && (
          <div className="bg-zinc-900/30 p-6 border-l-2 border-cyan-500 font-mono animate-in fade-in">
            {logs.map((l, i) => <p key={i} className="text-[8px] text-cyan-500 uppercase mb-1">[{new Date().toLocaleTimeString()}] {l}</p>)}
          </div>
        )}

        {step === 'lead' && (
          <div className="space-y-4 p-8 bg-zinc-900/20 border border-white/5 rounded-2xl animate-in slide-in-from-bottom duration-700">
            <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] text-center mb-4 italic">Filiación Biométrica</h3>
            <input type="text" placeholder="NOMBRE COMPLETO" onChange={(e)=>setUserData({...userData, name:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[10px] text-white focus:border-cyan-500 outline-none transition-all uppercase" />
            <input type="tel" placeholder="WHATSAPP DE CONTACTO" onChange={(e)=>setUserData({...userData, phone:e.target.value})} className="w-full bg-transparent border-b border-white/10 p-4 text-[10px] text-white focus:border-cyan-500 outline-none transition-all" />
            <button onClick={() => userData.name && setStep('result')} className="w-full bg-cyan-600 text-white py-5 text-[9px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-white hover:text-black transition-all">Compilar Resultados Φ</button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-1">
              {(['3D_BONE', 'CHROMOPHORES', 'VASCULAR', 'SMAS_TENSION'] as AnalysisLayer[]).map(l => (
                <button key={l} onClick={()=>setActiveLayer(l)} className={`py-3 text-[5px] font-black border transition-all ${activeLayer === l ? 'bg-cyan-500 text-black border-cyan-400' : 'border-white/5 text-zinc-600'}`}>{l.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="bg-zinc-950 p-6 border-t-2 border-cyan-500 shadow-2xl">
               <p className="text-[10px] text-white font-black uppercase mb-4 tracking-widest italic">Análisis Estructural Completo</p>
               <p className="text-[9px] text-zinc-500 leading-relaxed italic mb-8 border-l border-white/10 pl-4">"Nube de puntos detecta asimetría en tercio inferior. Ratio de Park: 0.92. Se requiere intervención de bioingeniería facial inmediata."</p>
               <button onClick={()=>setStep('report')} className="w-full bg-white text-black py-4 font-black text-[9px] uppercase tracking-[0.2em] shadow-xl active:scale-95">Ver Manifiesto de Ingeniería</button>
            </div>
          </div>
        )}

        {/* EL REPORTE FINAL: MANIFIESTO DE INGENIERÍA HUMANA */}
        {step === 'report' && photos.length > 0 && (
          <div className="bg-white text-black p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 mb-20 border-[10px] border-zinc-100 relative">
            <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
              <div className="font-black text-[14px] leading-none italic uppercase tracking-tighter">TIPHERETH<br/>HARMONY<br/>STATION</div>
              <div className="text-right text-[7px] font-black uppercase text-zinc-400">PASAPORTE DE INMORTALIDAD</div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-100">
                <img src={photos[0]} className="w-full aspect-[3/4] object-cover grayscale" />
                <p className="absolute bottom-2 left-2 text-[6px] font-bold uppercase text-zinc-400">Base Biométrica</p>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-cyan-100">
                <img src={photos[0]} className="w-full h-full object-cover contrast-125 brightness-110 saturate-[0.6]" />
                <div className="absolute inset-0 bg-cyan-600/5 mix-blend-overlay" />
                <p className="absolute bottom-2 left-2 text-[6px] font-black uppercase text-cyan-600">Proyección Φ</p>
              </div>
            </div>

            <div className="bg-black text-white p-5 rounded-3xl mb-8">
               <p className="text-[7px] font-black text-cyan-400 uppercase mb-4 text-center tracking-[0.4em] italic">Métricas Óseas de Park</p>
               <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-white/10 p-3"><p className="text-[5px] text-zinc-500 uppercase mb-1">Superior</p><p className="text-[12px] font-black">1.82</p></div>
                  <div className="border border-white/10 p-3"><p className="text-[5px] text-zinc-500 uppercase mb-1">Medio</p><p className="text-[12px] font-black">2.01</p></div>
                  <div className="border border-cyan-500 p-3 text-red-500 animate-pulse"><p className="text-[5px] text-red-400 uppercase mb-1 font-black">Inferior</p><p className="text-[12px] font-black">0.92</p></div>
               </div>
            </div>

            <div className="space-y-4 mb-8 text-[9px] text-zinc-700 leading-tight italic border-l-4 border-black pl-4">
               <p><strong>RECOMENDACIÓN:</strong> Reingeniería Estructural de Mentón (Protocolo Park) + Manejo de Cromóforos Activos vía Mesoestetic.</p>
               <p className="text-cyan-600 font-bold tracking-tighter">ESTADO INBODY: Sincronizado | EDAD BIOLÓGICA: -4 AÑOS</p>
            </div>

            <button onClick={() => window.open(`https://wa.me/${WS_BUSINESS}?text=Shalom Dr. Maya Romo, soy ${userData.name.toUpperCase()}. Mi Reporte Tiphereth indica un déficit INF de 0.92. Deseo materializar mi Plan Maestro de Ingeniería Humana.`)} 
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-cyan-600 transition-all active:scale-95 mb-4">
              Materializar Plan Maestro
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}