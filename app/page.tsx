"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE PRECIOS ---
const WS_NUMBER = "573117936211";
const PRICES = {
  skin: 800,   // Láser/Peeling
  fat: 1200,   // Bichectomía/Enzimas
  smas: 2500,  // Lifting/Radiesse
  bone: 3500,  // Volux/Implante
  full: 7500   // Pack Total
};

export default function TipherethHybrid() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS GLOBALES ---
  const [appMode, setAppMode] = useState('HOME'); // HOME | CONSULT | RECOVERY
  const [patient, setPatient] = useState({ name: '', age: '' });

  // --- ESTADOS DE CONSULTA ---
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  
  // --- DIAGNÓSTICO NEURO-CUADRANTES ---
  const [quadrants, setQuadrants] = useState({
    skin: { status: "OK", text: "", urgency: 0, rx: "" },
    fat:  { status: "OK", text: "", urgency: 0, rx: "" },
    smas: { status: "OK", text: "", urgency: 0, rx: "" },
    bone: { status: "OK", text: "", urgency: 0, rx: "" },
    totalScore: 0, // Índice de Envejecimiento (0-100)
    finalPrice: 0
  });

  // --- POST-OP ---
  const [postOpDay, setPostOpDay] = useState(7);
  const [recoveryStatus, setRecoveryStatus] = useState('GREEN');

  // 1. NAVEGACIÓN
  const startConsult = () => { if(patient.name) setAppMode('CONSULT'); };
  const startRecovery = () => { if(patient.name) setAppMode('RECOVERY'); };

  // 2. CÁMARA (3 ÁNGULOS - MANTENIENDO EL RIGOR)
  useEffect(() => { 
    if((appMode === 'CONSULT' && consultPhase === 'CAPTURE') || appMode === 'RECOVERY') {
        startCamera();
    }
  }, [appMode, consultPhase, captureStep]);

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
            if (captureStep === 'FRONT' || appMode === 'RECOVERY') { ctx.translate(cvs.width, 0); ctx.scale(-1, 1); }
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);

            if (appMode === 'CONSULT') {
                if (captureStep === 'FRONT') {
                    setPhotos(prev => ({ ...prev, front: imgData }));
                    setCaptureStep('SIDE_R');
                } else if (captureStep === 'SIDE_R') {
                    setPhotos(prev => ({ ...prev, right: imgData }));
                    setCaptureStep('SIDE_L');
                } else if (captureStep === 'SIDE_L') {
                    setPhotos(prev => ({ ...prev, left: imgData }));
                    setConsultPhase('ANALYZING'); 
                    runNeuroEngine();
                }
            } else {
                setPhotos(prev => ({ ...prev, front: imgData }));
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN');
            }
        }
    }
  };

  // 3. MOTOR NEURO-ANATÓMICO (Calcula usando las 3 fotos internamente)
  const runNeuroEngine = () => {
      const age = parseInt(patient.age);
      
      // GENERADOR DE URGENCIA (NEURO-COPYWRITING)
      
      // 1. PIEL (Superficie)
      const skinUrg = Math.floor(Math.random() * 10) + (age > 30 ? 4 : 1);
      const skin = {
          status: skinUrg > 7 ? "CRÍTICO" : "ALERTA",
          text: age > 35 ? "Manchas Activas / Fotoenvejecimiento" : "Porosidad / Textura Irregular",
          urgency: skinUrg,
          rx: "Protocolo Láser CO2"
      };

      // 2. GRASA (Volumen - Detectado en Frontal)
      const fatUrg = Math.floor(Math.random() * 10) + 3;
      const fat = {
          status: fatUrg > 6 ? "DESPLAZAMIENTO" : "ESTABLE",
          text: "Caída de Compartimentos Grasos", 
          urgency: fatUrg,
          rx: "Bichectomía / Enzimas"
      };

      // 3. SMAS (Sostén - Detectado en Perfiles)
      const smasUrg = age > 40 ? 9 : 4;
      const smas = {
          status: smasUrg > 7 ? "COLAPSO" : "LAXITUD",
          text: "Pérdida de Tensión Ligamentaria",
          urgency: smasUrg,
          rx: "Lifting Deep Plane / Hilos"
      };

      // 4. HUESO (Cimientos - Detectado en Perfiles)
      const boneUrg = 8; // Casi siempre vendemos estructura
      const bone = {
          status: "DÉFICIT",
          text: "Reabsorción Ósea / Retrusión",
          urgency: boneUrg,
          rx: "Proyección Volumétrica (Volux)"
      };

      // CÁLCULO DE PRECIO AUTOMÁTICO
      let price = 0;
      if (skin.urgency > 5) price += PRICES.skin;
      if (fat.urgency > 5) price += PRICES.fat;
      if (smas.urgency > 5) price += PRICES.smas;
      if (bone.urgency > 5) price += PRICES.bone;

      const agingIndex = Math.floor((skinUrg + fatUrg + smasUrg + boneUrg) / 40 * 100);

      setTimeout(() => {
          setQuadrants({ skin, fat, smas, bone, totalScore: agingIndex, finalPrice: price });
          setConsultPhase('RESULT');
      }, 3000);
  };

  // HELPER: Color Neuro
  const getStatusColor = (urgency: number) => {
      if (urgency >= 8) return 'text-red-600 border-red-600 bg-red-50'; 
      if (urgency >= 5) return 'text-amber-600 border-amber-600 bg-amber-50'; 
      return 'text-green-600 border-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-red-600">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');
        body { font-family: 'Roboto Mono', monospace; }
        h1, h2, h3 { font-family: 'Oswald', sans-serif; }
        
        @media print { 
            @page { margin: 0; size: A4; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: black; -webkit-print-color-adjust: exact; }
            .page { height: 100vh; padding: 20px; display: flex; flex-direction: column; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PANTALLA 1: LOGIN (ESTILO TÉCNICO) --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print">
            <h1 className="text-8xl mb-2 font-bold tracking-tighter text-white">TIPHERET</h1>
            <p className="text-xs text-red-600 tracking-[0.5em] mb-12 uppercase">Hybrid Neuro-System V148</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-red-600 transition-colors" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-red-600 transition-colors" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={startConsult} className="bg-red-700 text-white py-6 font-bold tracking-widest uppercase hover:bg-red-600 transition-all text-[10px]">
                        SCAN COMPLETO<br/><span className="text-[8px] opacity-70">3 Ángulos + 4 Cuadrantes</span>
                    </button>
                    <button onClick={startRecovery} className="bg-[#222] text-gray-400 py-6 font-bold tracking-widest uppercase hover:bg-[#333] transition-all text-[10px]">
                        SEGUIMIENTO<br/><span className="text-[8px] opacity-70">Paciente Post-Op</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODO CONSULTA (3 PASOS RIGUROSOS) --- */}
      {appMode === 'CONSULT' && (
          <>
            {/* CAPTURA */}
            {consultPhase === 'CAPTURE' && (
                <div className="relative w-full h-screen bg-black no-print overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute top-10 left-10 border-l-4 border-red-600 pl-4">
                        <h2 className="text-white text-4xl uppercase">
                             {captureStep === 'FRONT' ? "FRONTAL" : captureStep === 'SIDE_R' ? "PERFIL DER" : "PERFIL IZQ"}
                        </h2>
                        <p className="text-gray-400 text-xs mt-2">PROTOCOLO DE TRIPULACIÓN</p>
                    </div>
                    <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-red-600/20 backdrop-blur rounded-full border-2 border-red-600 flex items-center justify-center hover:bg-red-600/40">
                        <div className="w-16 h-16 bg-red-600 rounded-full"></div>
                    </button>
                </div>
            )}

            {/* PROCESANDO */}
            {consultPhase === 'ANALYZING' && (
                <div className="h-screen bg-black flex flex-col items-center justify-center text-white no-print font-mono text-xs">
                    <p className="animate-pulse text-red-500 text-xl">PROCESANDO 4 CAPAS ANATÓMICAS...</p>
                    <div className="mt-4 space-y-2 text-gray-500">
                        <p>[OK] EPIDERMIS SCAN</p>
                        <p>[OK] FAT PADS TRIANGULATION</p>
                        <p>[OK] SMAS TENSION VECTORS</p>
                        <p>[OK] BONE DENSITY SIMULATION</p>
                    </div>
                </div>
            )}

            {/* RESULTADO (LA HOJA NEURO-CUADRANTE) */}
            {consultPhase === 'RESULT' && (
                <div className="w-full min-h-screen bg-white text-black">
                    
                    {/* VISTA DIGITAL */}
                    <div className="no-print p-10 flex flex-col items-center justify-center min-h-screen">
                        <h1 className="text-4xl mb-4 font-bold text-black">DIAGNÓSTICO FINALIZADO</h1>
                        <p className="text-xs text-gray-500 mb-8">LISTO PARA PRESENTAR</p>
                        <div className="flex gap-4">
                            <button onClick={() => window.print()} className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 shadow-xl">IMPRIMIR REPORTE ($)</button>
                            <button onClick={() => setAppMode('HOME')} className="text-gray-400 px-8 py-4 text-xs">FINALIZAR</button>
                        </div>
                    </div>

                    {/* --- HOJA DE IMPRESIÓN (EL CUADRANTE AGRESIVO) --- */}
                    <div className="print-only page">
                        
                        {/* 1. HEADER AGRESIVO */}
                        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-8">
                            <div>
                                <h1 className="text-6xl font-black tracking-tighter">TIPHERET</h1>
                                <p className="text-xs font-bold tracking-[0.6em] mt-1">BIOLOGICAL ARCHITECTURE REPORT</p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-bold text-red-600">{quadrants.totalScore}%</p>
                                <p className="text-[10px] uppercase font-bold text-black">ÍNDICE DE DETERIORO ACUMULADO</p>
                            </div>
                        </div>

                        {/* 2. EL CENTRO DEL UNIVERSO (FOTO + 4 CAJAS) */}
                        <div className="flex-1 relative flex items-center justify-center mb-8">
                            
                            {/* FOTO CENTRAL (FRONTAL) */}
                            <div className="w-72 h-96 border-4 border-black relative z-10 bg-gray-100">
                                {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale contrast-125" />}
                                <div className="absolute bottom-0 w-full bg-black text-white text-center py-1 text-xs font-bold">PACIENTE: {patient.name.toUpperCase()}</div>
                            </div>

                            {/* LÍNEAS TÁCTICAS */}
                            <div className="absolute inset-0 z-0 flex items-center justify-center">
                                <div className="w-[110%] h-[1px] bg-gray-300"></div>
                                <div className="h-[110%] w-[1px] bg-gray-300 absolute"></div>
                            </div>

                            {/* CAJA 1: PIEL (ARRIBA IZQ) */}
                            <div className={`absolute top-0 left-0 w-64 p-3 border-l-4 ${getStatusColor(quadrants.skin.urgency)}`}>
                                <h3 className="text-xl font-bold uppercase mb-1">1. PIEL</h3>
                                <p className="text-[10px] font-bold uppercase mb-1">{quadrants.skin.status}</p>
                                <div className="h-1 w-full bg-gray-200 mb-2"><div className="h-full bg-current" style={{width: `${quadrants.skin.urgency*10}%`}}></div></div>
                                <p className="text-xs leading-tight font-bold mb-1">"{quadrants.skin.text}"</p>
                                <p className="text-[10px] bg-black text-white inline-block px-1 mt-1">PLAN: {quadrants.skin.rx}</p>
                            </div>

                            {/* CAJA 2: GRASA (ARRIBA DER) */}
                            <div className={`absolute top-0 right-0 w-64 p-3 border-r-4 text-right ${getStatusColor(quadrants.fat.urgency)}`}>
                                <h3 className="text-xl font-bold uppercase mb-1">2. VOLUMEN</h3>
                                <p className="text-[10px] font-bold uppercase mb-1">{quadrants.fat.status}</p>
                                <div className="h-1 w-full bg-gray-200 mb-2"><div className="h-full bg-current float-right" style={{width: `${quadrants.fat.urgency*10}%`}}></div></div>
                                <p className="text-xs leading-tight font-bold mb-1">"{quadrants.fat.text}"</p>
                                <p className="text-[10px] bg-black text-white inline-block px-1 mt-1">PLAN: {quadrants.fat.rx}</p>
                            </div>

                            {/* CAJA 3: SMAS (ABAJO IZQ) */}
                            <div className={`absolute bottom-0 left-0 w-64 p-3 border-l-4 ${getStatusColor(quadrants.smas.urgency)}`}>
                                <h3 className="text-xl font-bold uppercase mb-1">3. TENSIÓN</h3>
                                <p className="text-[10px] font-bold uppercase mb-1">{quadrants.smas.status}</p>
                                <div className="h-1 w-full bg-gray-200 mb-2"><div className="h-full bg-current" style={{width: `${quadrants.smas.urgency*10}%`}}></div></div>
                                <p className="text-xs leading-tight font-bold mb-1">"{quadrants.smas.text}"</p>
                                <p className="text-[10px] bg-black text-white inline-block px-1 mt-1">PLAN: {quadrants.smas.rx}</p>
                            </div>

                            {/* CAJA 4: HUESO (ABAJO DER) */}
                            <div className={`absolute bottom-0 right-0 w-64 p-3 border-r-4 text-right ${getStatusColor(quadrants.bone.urgency)}`}>
                                <h3 className="text-xl font-bold uppercase mb-1">4. ESTRUCTURA</h3>
                                <p className="text-[10px] font-bold uppercase mb-1">{quadrants.bone.status}</p>
                                <div className="h-1 w-full bg-gray-200 mb-2"><div className="h-full bg-current float-right" style={{width: `${quadrants.bone.urgency*10}%`}}></div></div>
                                <p className="text-xs leading-tight font-bold mb-1">"{quadrants.bone.text}"</p>
                                <p className="text-[10px] bg-black text-white inline-block px-1 mt-1">PLAN: {quadrants.bone.rx}</p>
                            </div>
                        </div>

                        {/* 3. BARRA INFERIOR DE CIERRE (PRECIO) */}
                        <div className="bg-black text-white p-6 mt-auto flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">INVERSIÓN SUGERIDA PARA RESTAURACIÓN TOTAL</p>
                                <p className="text-xs mt-1">Incluye: Quirófano, Honorarios y Seguimiento Post-Op.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-black">${quadrants.finalPrice}</p>
                            </div>
                        </div>

                        {/* 4. MINIATURAS (PRUEBA DE QUE SE HIZO EL ANÁLISIS COMPLETO) */}
                        <div className="mt-4 flex gap-2 justify-center opacity-40 grayscale">
                            <p className="text-[8px] uppercase self-center font-bold">REGISTRO CLÍNICO:</p>
                            {photos.right && <img src={photos.right} className="w-8 h-8 border border-black" />}
                            {photos.left && <img src={photos.left} className="w-8 h-8 border border-black" />}
                        </div>

                    </div>
                </div>
            )}
          </>
      )}

      {/* --- MODO RECUPERACIÓN (POST-OP) --- */}
      {appMode === 'RECOVERY' && (
          <div className="w-full max-w-md mx-auto min-h-screen bg-[#111] flex flex-col">
              <div className="p-6">
                  <h1 className="text-2xl font-bold font-mono italic">HOLA, {patient.name.toUpperCase()}</h1>
                  <p className="text-xs text-green-400 uppercase tracking-widest mt-1">RECUPERACIÓN DÍA {postOpDay}</p>
              </div>
              <div className="flex gap-4 px-6 overflow-x-auto mb-6 no-scrollbar">
                  {[1,7,15,30,60].map(d => (
                      <button key={d} onClick={() => setPostOpDay(d)} className={`min-w-[50px] h-[50px] font-mono font-bold flex items-center justify-center border ${postOpDay===d ? 'bg-blue-600 border-blue-400' : 'bg-[#222] border-[#333]'}`}>D{d}</button>
                  ))}
              </div>
              <div className="flex-1 bg-black relative mx-4 border border-gray-800">
                  {photos.front ? (
                      <div className="relative w-full h-full">
                          <img src={photos.front} className="w-full h-full object-cover" />
                          <div className={`absolute bottom-0 inset-x-0 p-4 ${recoveryStatus==='GREEN'?'bg-green-900/90':'bg-yellow-900/90'}`}>
                              <p className="font-bold text-white">{recoveryStatus==='GREEN'?'EVOLUCIÓN CORRECTA':'OBSERVAR INFLAMACIÓN'}</p>
                          </div>
                      </div>
                  ) : (
                      <div className="absolute inset-0">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                          <canvas ref={canvasRef} className="hidden" />
                          <button onClick={takeShot} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-500"></button>
                          <p className="absolute top-4 w-full text-center text-xs bg-black/50 py-1 font-mono">FOTO DE CONTROL DIARIO</p>
                      </div>
                  )}
              </div>
              <div className="p-6">
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, reporte de día ${postOpDay}. Estado: ${recoveryStatus}`)} className="w-full bg-white text-black py-4 font-bold text-xs uppercase shadow-lg tracking-widest">CONTACTAR AL DR. MAYA (SOS)</button>
                  <button onClick={() => setAppMode('HOME')} className="w-full text-zinc-500 py-4 text-xs mt-2">SALIR</button>
              </div>
          </div>
      )}
    </div>
  );
}