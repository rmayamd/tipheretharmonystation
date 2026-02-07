"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_NUMBER = "573117936211";

export default function TipherethMastermind() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS DEL SISTEMA
  const [phase, setPhase] = useState('BOOT'); // BOOT -> SCAN -> ANALYZE -> REPORT
  const [photo, setPhoto] = useState<string | null>(null);
  
  // DATOS PACIENTE
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // VISUALIZACIÓN ESPECTRAL
  const [layer, setLayer] = useState('RGB'); // RGB | MELANIN | VASCULAR | TEXTURE

  // CEREBRO DE DIAGNÓSTICO (ESTRUCTURA DE DATOS MÉDICOS)
  const [diagnosis, setDiagnosis] = useState({
    scores: { skinAge: 0, percentile: 0, damageScore: 0 },
    metrics: { spots: 0, wrinkles: 0, texture: 0, pores: 0, uv: 0, red: 0, brown: 0 },
    rx: { primary: "", secondary: "", homecare: "" }
  });

  // 1. BOOT SEQUENCE (INICIO)
  const initializeSystem = () => {
    if(!patient.name || !patient.age) return;
    setPhase('SCAN');
  };

  // 2. CÁMARA & SCANNER
  useEffect(() => { if(phase === 'SCAN') startCamera(); }, [phase]);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 4096 }, height: { ideal: 2160 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { console.error("Camera Error"); }
  };

  const captureBiometrics = () => {
    if(videoRef.current && canvasRef.current) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if(ctx) {
            ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            setPhoto(cvs.toDataURL('image/jpeg', 1.0));
            setPhase('ANALYZE');
            runAI();
        }
    }
  };

  // 3. LA INTELIGENCIA (LÓGICA CLÍNICA)
  const runAI = () => {
      const age = parseInt(patient.age);
      
      // ALGORITMO DE SEVERIDAD (Simulado pero lógico)
      // A mayor edad, mayor probabilidad de daño acumulado
      const baseDamage = age * 1.5;
      const variability = Math.random() * 20;
      
      const m = {
          spots: Math.floor(baseDamage * 0.8 + variability),
          wrinkles: Math.floor(age * 1.2),
          texture: Math.floor(Math.random() * 100), // Indice de suavidad
          pores: Math.floor(Math.random() * 80),
          uv: Math.floor(baseDamage + 10),
          red: Math.floor(Math.random() * 50), // Vascular es independiente
          brown: Math.floor(age * 1.1)
      };

      // CÁLCULO DE EDAD DE PIEL
      const skinAgeCalc = age + (m.uv > 50 ? 5 : -2) + (m.wrinkles > 40 ? 3 : 0);

      // GENERADOR DE RECETAS (RX ENGINE)
      let rxPrimary = "";
      let rxSecondary = "";

      // Prioridad 1: Vascular vs Pigmento
      if (m.red > m.brown) {
          rxPrimary = "Láser Vascular / Luz Pulsada Intensa (IPL)";
      } else {
          rxPrimary = "Protocolo Despigmentante (Melanina)";
      }

      // Prioridad 2: Textura vs Arrugas
      if (m.wrinkles > 50) {
          rxSecondary = "Toxina Botulínica + Reposición de Volumen";
      } else if (m.texture < 50) {
          rxSecondary = "Resurfacing Láser CO2 (Textura)";
      } else {
          rxSecondary = "Bioestimulación de Colágeno";
      }

      setTimeout(() => {
          setDiagnosis({
              scores: { skinAge: skinAgeCalc, percentile: Math.floor(100 - (m.uv/2)), damageScore: m.uv + m.brown },
              metrics: m,
              rx: { primary: rxPrimary, secondary: rxSecondary, homecare: "Antioxidantes + SPF 50+ + Retinol" }
          });
          setPhase('REPORT');
      }, 3000); // Tiempo de "Procesamiento" para dar peso a la data
  };

  // 4. MOTORES VISUALES (FILTROS)
  const getFilter = () => {
      switch(layer) {
          case 'MELANIN': return 'grayscale(1) contrast(1.5) sepia(1) hue-rotate(-30deg) brightness(0.9)'; // VISIA BROWN
          case 'VASCULAR': return 'grayscale(1) sepia(1) hue-rotate(-50deg) saturate(6) contrast(1.5)'; // VISIA RED
          case 'TEXTURE': return 'grayscale(1) contrast(3) brightness(1.2) invert(0.1)'; // VISIA SURFACE
          default: return 'none';
      }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono overflow-x-hidden selection:bg-green-900">
      
      {/* ESTILOS DE "MÁQUINA MÉDICA" */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        body { font-family: 'Share Tech Mono', monospace; }
        .scan-line {
            width: 100%; height: 2px; background: #00ff00;
            box-shadow: 0 0 10px #00ff00;
            animation: scan 2s infinite linear;
        }
        @keyframes scan { 0% {top:0%} 50% {top:100%} 100% {top:0%} }
        
        @media print { 
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: black; font-family: sans-serif; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- REPORTE IMPRESO (TIPO LABORATORIO) --- */}
      <div className="print-only w-full h-screen bg-white text-black p-12">
          <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
              <div><h1 className="text-5xl font-black">TIPHERET LABS</h1><p>ADVANCED DERMATOLOGICAL ANALYSIS</p></div>
              <div className="text-right"><p className="text-2xl font-bold">{patient.name}</p><p>ID: {Date.now().toString().slice(-6)} | AGE: {patient.age}</p></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 h-48">
              <div className="border border-gray-400 p-1"><p className="font-bold text-xs">RGB STANDARD</p>{photo && <img src={photo} className="w-full h-full object-cover" />}</div>
              <div className="border border-gray-400 p-1"><p className="font-bold text-xs">BROWN SPOTS (MELANIN)</p>{photo && <img src={photo} className="w-full h-full object-cover grayscale contrast-150 sepia" />}</div>
              <div className="border border-gray-400 p-1"><p className="font-bold text-xs">RED AREAS (VASCULAR)</p>{photo && <img src={photo} className="w-full h-full object-cover saturate-200 hue-rotate-[-50deg]" />}</div>
          </div>

          <div className="grid grid-cols-2 gap-10">
              <div>
                  <h3 className="font-bold border-b border-black mb-4">QUANTITATIVE METRICS</h3>
                  <div className="space-y-3 text-xs">
                      <div className="flex justify-between"><span>TRUESKIN AGE™</span><span className="font-bold">{diagnosis.scores.skinAge} Yrs</span></div>
                      <div className="flex justify-between"><span>PERCENTILE SCORE</span><span className="font-bold">{diagnosis.scores.percentile}%</span></div>
                      <div className="flex justify-between"><span>UV DAMAGE LOAD</span><span className="font-bold">{diagnosis.metrics.uv}</span></div>
                      <div className="flex justify-between"><span>BROWN SPOTS</span><span className="font-bold">{diagnosis.metrics.brown}</span></div>
                      <div className="flex justify-between"><span>VASCULAR AREAS</span><span className="font-bold">{diagnosis.metrics.red}</span></div>
                  </div>
              </div>
              <div className="bg-gray-100 p-6 border border-black">
                  <h3 className="font-bold border-b border-black mb-4">RX / TREATMENT PLAN</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase">PRIMARY PRIORITY</p>
                  <p className="font-bold text-lg mb-4">{diagnosis.rx.primary}</p>
                  
                  <p className="text-xs font-bold text-gray-500 uppercase">SECONDARY PRIORITY</p>
                  <p className="font-bold text-lg mb-4">{diagnosis.rx.secondary}</p>
                  
                  <p className="text-xs font-bold text-gray-500 uppercase">HOMECARE</p>
                  <p className="text-sm">{diagnosis.rx.homecare}</p>
              </div>
          </div>
          <div className="mt-12 text-center text-xs text-gray-500"><p>Authorized by Dr. Ricardo Maya | Facial Plastic Surgery</p></div>
      </div>

      {/* --- PANTALLA 1: BOOT (LOGIN TÉCNICO) --- */}
      {phase === 'BOOT' && (
        <div className="flex flex-col items-center justify-center h-screen no-print bg-[#050505]">
            <h1 className="text-6xl tracking-widest text-green-500 mb-8 font-bold">TIPHERET_OS</h1>
            <div className="border border-green-500/50 p-8 w-96 bg-black/50 backdrop-blur">
                <p className="text-xs mb-2 opacity-70">INITIALIZING BIOMETRIC MODULE...</p>
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-black border-b border-green-500/50 p-3 text-green-400 outline-none mb-4 text-center uppercase placeholder-green-900" placeholder="ENTER PATIENT ID" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-black border-b border-green-500/50 p-3 text-green-400 outline-none mb-8 text-center placeholder-green-900" placeholder="ENTER AGE" />
                <button onClick={initializeSystem} className="w-full bg-green-900/20 border border-green-500 text-green-400 py-4 hover:bg-green-500 hover:text-black transition-all font-bold tracking-widest">BOOT SYSTEM</button>
            </div>
        </div>
      )}

      {/* --- PANTALLA 2: SCANNER (TEATRALIDAD) --- */}
      {phase === 'SCAN' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60 grayscale" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* OVERLAY TÉCNICO */}
            <div className="absolute inset-0 border-[20px] border-black/50 pointer-events-none"></div>
            <div className="absolute top-10 left-10 text-green-500 text-xs">
                <p>REC: ON</p>
                <p>ISO: 800</p>
                <p>WB: AUTO</p>
            </div>
            
            {/* LÍNEA DE ESCANEO */}
            <div className="absolute w-full h-1 bg-green-500 scan-line opacity-50"></div>
            
            {/* RETÍCULA DE ENFOQUE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[70%] border border-green-500/30 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
                    <p className="absolute -bottom-6 w-full text-center text-green-500 text-xs animate-pulse">ALIGN FACE & CAPTURE</p>
                </div>
            </div>

            <button onClick={captureBiometrics} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-full hover:bg-green-500/30 flex items-center justify-center">
                <div className="w-14 h-14 bg-green-500 rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- PANTALLA 3: ANALIZANDO (PROCESO) --- */}
      {phase === 'ANALYZE' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center no-print text-green-500 p-8">
            <div className="w-full max-w-md font-mono text-xs space-y-2">
                <p className="flex justify-between"><span>MAPPING PORE STRUCTURE</span><span>[OK]</span></p>
                <p className="flex justify-between"><span>CALCULATING UV LOAD</span><span>[OK]</span></p>
                <p className="flex justify-between"><span>SEPARATING CHROMOPHORES</span><span>[OK]</span></p>
                <p className="flex justify-between"><span>GENERATING RX PROTOCOL</span><span>[OK]</span></p>
                <div className="w-full bg-green-900/30 h-2 mt-4"><div className="bg-green-500 h-full animate-[width_3s_ease-out_forwards]" style={{width:'100%'}}></div></div>
            </div>
        </div>
      )}

      {/* --- PANTALLA 4: DASHBOARD MAESTRO (RESULTADO) --- */}
      {phase === 'REPORT' && photo && (
        <div className="min-h-screen bg-[#050505] flex flex-col no-print">
            
            {/* HEADER DATA */}
            <div className="h-14 border-b border-green-900/30 bg-black flex justify-between items-center px-4">
                <div className="text-green-500 font-bold">TIPHERET<span className="text-xs opacity-50 ml-2">CORE V126</span></div>
                <div className="text-right text-xs text-green-400">
                    SKIN AGE: <span className="text-lg font-bold text-white">{diagnosis.scores.skinAge}</span> (ACTUAL: {patient.age})
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                
                {/* COLUMNA VISUAL (VISIA VIEWER) */}
                <div className="flex-1 bg-black relative flex flex-col border-r border-green-900/30">
                    <div className="flex-1 relative overflow-hidden">
                        <img src={photo} className="w-full h-full object-contain" style={{ filter: getFilter() }} />
                        <div className="absolute top-4 left-4 border border-green-500/50 bg-black/80 px-2 py-1 text-[10px] text-green-500">
                            MODE: {layer}
                        </div>
                    </div>
                    {/* BOTONES DE CAPAS */}
                    <div className="h-16 bg-black border-t border-green-900/30 flex justify-center items-center gap-2">
                        {['RGB', 'MELANIN', 'VASCULAR', 'TEXTURE'].map(l => (
                            <button key={l} onClick={() => setLayer(l)} className={`px-3 py-2 text-[10px] border ${layer===l ? 'bg-green-500 text-black border-green-500' : 'bg-black text-green-700 border-green-900/30'} hover:border-green-500 transition-all`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DE DATOS (RX PANEL) */}
                <div className="w-full lg:w-96 bg-[#080808] p-6 overflow-y-auto">
                    
                    {/* DIAGNÓSTICO */}
                    <div className="mb-8">
                        <h3 className="text-xs text-green-700 border-b border-green-900/30 pb-1 mb-4">DIAGNOSTIC METRICS</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] text-green-500 mb-1"><span>UV DAMAGE</span><span>{diagnosis.metrics.uv}/100</span></div>
                                <div className="w-full h-1 bg-green-900/20"><div className="h-full bg-green-500" style={{width: `${diagnosis.metrics.uv}%`}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] text-green-500 mb-1"><span>BROWN SPOTS</span><span>{diagnosis.metrics.brown}/100</span></div>
                                <div className="w-full h-1 bg-green-900/20"><div className="h-full bg-yellow-600" style={{width: `${diagnosis.metrics.brown}%`}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] text-green-500 mb-1"><span>VASCULARITY</span><span>{diagnosis.metrics.red}/100</span></div>
                                <div className="w-full h-1 bg-green-900/20"><div className="h-full bg-red-600" style={{width: `${diagnosis.metrics.red}%`}}></div></div>
                            </div>
                        </div>
                    </div>

                    {/* TRATAMIENTO AUTOMÁTICO */}
                    <div className="bg-green-900/10 border border-green-500/30 p-4 mb-6">
                        <h3 className="text-xs text-white font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            AI PRESCRIPTION GENERATED
                        </h3>
                        
                        <div className="mb-4">
                            <p className="text-[9px] text-green-600 uppercase">PRIMARY TREATMENT</p>
                            <p className="text-sm text-green-400 font-bold">{diagnosis.rx.primary}</p>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-[9px] text-green-600 uppercase">SECONDARY TREATMENT</p>
                            <p className="text-sm text-green-400 font-bold">{diagnosis.rx.secondary}</p>
                        </div>

                        <div>
                            <p className="text-[9px] text-green-600 uppercase">HOMECARE</p>
                            <p className="text-xs text-green-300">{diagnosis.rx.homecare}</p>
                        </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex flex-col gap-2">
                        <button onClick={() => window.print()} className="w-full border border-green-500 text-green-500 py-3 text-[10px] hover:bg-green-500 hover:text-black transition-all font-bold">PRINT MEDICAL REPORT</button>
                        <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, mi sistema generó la receta: ${diagnosis.rx.primary}. Quiero iniciar.`)} className="w-full bg-white text-black py-3 text-[10px] hover:bg-gray-200 transition-all font-bold">SCHEDULE PROCEDURE</button>
                    </div>

                </div>
            </div>
        </div>
      )}
    </div>
  );
}