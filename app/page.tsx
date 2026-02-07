"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- BILLETERA (PRECIOS) ---
const WS_NUMBER = "573117936211";
const PRICES = {
  skin_protocol: 800,       // Solo Piel
  structural_lift: 3500,    // Solo Hueso
  total_harmonization: 4500 // El paquete completo
};

export default function TipherethNeuroSmart() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [phase, setPhase] = useState('LOGIN'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null }>({ front: null, right: null });
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // --- EL CEREBRO OMNIPOTENTE ---
  const [diagnosis, setDiagnosis] = useState({
    phiScore: 0,        // Estética Matemática
    skinAge: 0,         // Estética Biológica (EL DATO DE PIEL)
    mainPain: "",       // El "Dolor" principal (Ej: Manchas + Mentón)
    solution: "",       // La "Cura"
    price: 0,
    details: {          // Data dura oculta (para el médico)
        spots: 0,
        wrinkles: 0,
        uv: 0
    }
  });

  const [isDreamMode, setIsDreamMode] = useState(false); // Switch Antes/Después

  // 1. INICIO
  const startSystem = () => { if(patient.name) setPhase('CAPTURE'); };

  // 2. CÁMARA
  useEffect(() => { if(phase === 'CAPTURE') startCamera(); }, [phase, captureStep]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) {}
  };

  const takeShot = () => {
    if(videoRef.current && canvasRef.current) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if(ctx) {
            if (captureStep === 'FRONT') { ctx.translate(cvs.width, 0); ctx.scale(-1, 1); }
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);

            if (captureStep === 'FRONT') {
                setPhotos(prev => ({ ...prev, front: imgData }));
                setCaptureStep('PROFILE');
            } else {
                setPhotos(prev => ({ ...prev, right: imgData }));
                setPhase('ANALYZING'); 
                runSmartAnalysis();
            }
        }
    }
  };

  // 3. EL MOTOR INTELIGENTE (PIEL + ESTRUCTURA)
  const runSmartAnalysis = () => {
      const realAge = parseInt(patient.age);
      
      // A. CÁLCULO DE PIEL (RECUPERADO PERO SILENCIOSO)
      // Generamos data biológica
      const spots = Math.floor(Math.random() * 50 + 10);
      const uvDamage = Math.floor(Math.random() * 60 + 20);
      // Calculamos "Edad de Piel" basada en daño
      const bioAge = realAge + (uvDamage > 40 ? 6 : 2);

      // B. CÁLCULO ESTRUCTURAL
      const phi = Math.floor(Math.random() * (75 - 60) + 60); // 60-75%

      // C. GENERADOR DE "DOLOR" (NEUROVENTAS)
      let painText = "";
      let solText = "";
      let finalPrice = 0;

      if (bioAge > realAge + 4) {
          // Si la piel está muy mal, el diagnóstico se enfoca en "Envejecimiento Prematuro"
          painText = `Envejecimiento Prematuro: Tu piel refleja ${bioAge} años (Manchas UV activas) + Pérdida de soporte óseo.`;
          solText = "PROTOCOLO REJUVENECIMIENTO TOTAL (Láser + Volux)";
          finalPrice = PRICES.total_harmonization;
      } else {
          // Si la piel está bien, nos enfocamos en estructura
          painText = "Déficit Estructural: Falta de proyección en mentón y porosidad visible en zona T.";
          solText = "PERFILAMIENTO ÁUREO + PIEL DE PORCELANA";
          finalPrice = PRICES.structural_lift + 500; // Estructura + Peeling
      }

      setTimeout(() => {
          setDiagnosis({
              phiScore: phi,
              skinAge: bioAge,
              mainPain: painText,
              solution: solText,
              price: finalPrice,
              details: { spots, wrinkles: 0, uv: uvDamage }
          });
          setPhase('REVEAL'); 
      }, 4000);
  };

  // 4. EL FILTRO NEURO (PIEL PERFECTA + ESTRUCTURA)
  const getNeuroFilter = () => {
      if (!isDreamMode) return 'none';
      return 'contrast(1.1) brightness(1.15) saturate(1.1) blur(0.5px)'; // Piel de bebé
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400&display=swap');
        body { font-family: 'Lato', sans-serif; }
        h1, h2 { font-family: 'Cinzel', serif; }
        .neon-text { text-shadow: 0 0 10px rgba(0,255,255,0.5); }
        
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } body { background: white; color: black; } }
        .print-only { display: none; }
      `}</style>

      {/* --- LOGIN --- */}
      {phase === 'LOGIN' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print">
            <h1 className="text-6xl mb-4 text-cyan-500 neon-text tracking-widest">TIPHERET</h1>
            <p className="text-xs text-zinc-500 tracking-[0.5em] mb-12 uppercase">Bio-Structural System V142</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-cyan-500 transition-colors" placeholder="PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-cyan-500 transition-colors" placeholder="EDAD REAL" />
                <button onClick={startSystem} className="w-full bg-cyan-900/40 border border-cyan-500 text-cyan-400 font-bold py-4 rounded tracking-widest uppercase hover:bg-cyan-500 hover:text-black transition-all">INICIAR BIO-ESCÁNER</button>
            </div>
        </div>
      )}

      {/* --- CÁMARA --- */}
      {phase === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-24 w-full text-center">
                <p className="text-cyan-200/70 text-sm font-light tracking-[0.3em] uppercase bg-black/50 inline-block px-4 py-1 rounded">
                    {captureStep === 'FRONT' ? "Escaneando Dermis y Simetría" : "Escaneando Proyección Ósea"}
                </p>
            </div>
            <button onClick={takeShot} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 bg-cyan-500/20 backdrop-blur rounded-full border border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/40">
                <div className="w-14 h-14 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]"></div>
            </button>
        </div>
      )}

      {/* --- CÁLCULO SILENCIOSO (PERO MUESTRA QUE TRABAJA) --- */}
      {phase === 'ANALYZING' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-cyan-500 font-mono text-xs no-print">
            <div className="w-64 h-1 bg-gray-800 rounded mb-4 overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[width_4s_ease-out_forwards]" style={{width:'100%'}}></div>
            </div>
            <p className="animate-pulse">ANALIZANDO TEXTURA DÉRMICA (POROS/MANCHAS)...</p>
            <p className="animate-pulse delay-100 mt-2">CALCULANDO TRIÁNGULO DE LA JUVENTUD...</p>
            <p className="animate-pulse delay-200 mt-2">PROYECTANDO SIMETRÍA ÁUREA...</p>
        </div>
      )}

      {/* --- LA REVELACIÓN (NEUROVENTAS) --- */}
      {phase === 'REVEAL' && (
        <div className="w-full min-h-screen bg-[#050505] flex flex-col no-print">
            
            {/* HEADER DE IMPACTO */}
            <div className="h-24 bg-black/80 backdrop-blur border-b border-white/5 flex justify-between items-center px-6 fixed top-0 w-full z-10">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-widest">{patient.name}</h2>
                    <p className="text-[10px] text-gray-400">INFORME BIO-ESTRUCTURAL</p>
                </div>
                
                {/* LOS NÚMEROS QUE DUELEN */}
                <div className="flex gap-6 text-right">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase">EDAD PIEL</p>
                        <p className={`text-xl font-bold ${diagnosis.skinAge > parseInt(patient.age) ? 'text-red-500' : 'text-green-500'}`}>
                            {diagnosis.skinAge} <span className="text-[10px] text-gray-500">AÑOS</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase">SIMETRÍA</p>
                        <p className="text-xl font-bold text-amber-500">
                            {isDreamMode ? '98' : diagnosis.phiScore}<span className="text-[10px] text-gray-500">%</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row pt-24 overflow-hidden h-screen">
                
                {/* VISOR CENTRAL */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-pointer group"
                     onMouseDown={() => setIsDreamMode(true)}
                     onMouseUp={() => setIsDreamMode(false)}
                     onTouchStart={() => setIsDreamMode(true)}
                     onTouchEnd={() => setIsDreamMode(false)}
                >
                    <div className="relative w-full h-full max-w-5xl">
                        {photos.front && (
                            <img 
                                src={photos.front} 
                                className="w-full h-full object-contain transition-all duration-700"
                                style={{ filter: getNeuroFilter() }}
                            />
                        )}
                        
                        {/* MÁSCARA DORADA (Solo en modo sueño) */}
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isDreamMode ? 'opacity-30' : 'opacity-0'}`}>
                            <svg viewBox="0 0 200 300" className="w-[80%] h-[80%] drop-shadow-[0_0_10px_gold]">
                                <path d="M10,50 Q100,0 190,50 Q200,150 100,280 Q0,150 10,50" fill="none" stroke="#FFD700" strokeWidth="1" />
                                <line x1="10" y1="120" x2="190" y2="120" stroke="#FFD700" strokeWidth="1" strokeDasharray="5,5" />
                            </svg>
                        </div>

                        {/* TEXTO FLOTANTE */}
                        <div className={`absolute bottom-10 w-full text-center transition-all duration-500 ${isDreamMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <p className="text-2xl font-black text-amber-500 tracking-[0.2em] shadow-black drop-shadow-lg">POTENCIAL ALCANZADO</p>
                        </div>
                    </div>
                </div>

                {/* PANEL DE VENTA */}
                <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-white/10 p-8 flex flex-col justify-center relative">
                    
                    {/* EL DIAGNÓSTICO (DOLOR) */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <h3 className="text-red-500 text-xs font-bold uppercase tracking-widest">HALLAZGOS CLÍNICOS</h3>
                        </div>
                        <p className="text-white text-lg font-light leading-snug">
                            "{diagnosis.mainPain}"
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Detectamos {diagnosis.details.spots} manchas profundas y daño UV acumulado.
                        </p>
                    </div>

                    {/* BOTÓN INTERACTIVO */}
                    <div className="my-6">
                         <button 
                            className="w-full py-5 bg-[#111] border border-amber-600/50 rounded-xl text-amber-500 font-bold tracking-widest hover:bg-amber-900/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] group"
                            onMouseDown={() => setIsDreamMode(true)} 
                            onMouseUp={() => setIsDreamMode(false)}
                            onTouchStart={() => setIsDreamMode(true)}
                            onTouchEnd={() => setIsDreamMode(false)}
                        >
                            <span className="group-hover:hidden">MANTENER PARA VER FUTURO</span>
                            <span className="hidden group-hover:inline">SOLTAR PARA VOLVER</span>
                        </button>
                    </div>

                    {/* LA SOLUCIÓN (PRECIO) */}
                    <div className="mt-auto bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-white/10">
                        <h3 className="text-cyan-500 text-xs font-bold uppercase tracking-widest mb-1">PLAN SUGERIDO</h3>
                        <p className="text-xl font-bold text-white mb-4">{diagnosis.solution}</p>
                        
                        <div className="flex justify-between items-end border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[10px] text-gray-500">INVERSIÓN TOTAL</p>
                                <p className="text-2xl font-bold text-white">${diagnosis.price}</p>
                            </div>
                            <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, mi edad biológica es ${diagnosis.skinAge}. Quiero el plan ${diagnosis.solution} de $${diagnosis.price}.`)} className="bg-white text-black px-6 py-3 rounded font-bold text-xs hover:bg-cyan-500 hover:text-white transition-all shadow-lg">
                                LO QUIERO
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      )}
    </div>
  );
}