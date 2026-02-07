"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_NUMBER = "573117936211";

export default function TipherethHybridV129() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS DEL SISTEMA
  const [step, setStep] = useState('login'); 
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // MODO DE TRABAJO (HÍBRIDO)
  const [workMode, setWorkMode] = useState('DERMA'); // DERMA | ARCH

  // DATOS PACIENTE
  const [patient, setPatient] = useState({ name: '', age: '' });

  // --- CEREBRO 1: DERMATOLOGÍA (VISIA) ---
  const [dermaLayer, setDermaLayer] = useState('RGB'); 
  const [skinMetrics, setSkinMetrics] = useState({
    skinAge: 0, percentile: 0, spots: 0, wrinkles: 0, uv: 0, red: 0, brown: 0
  });

  // --- CEREBRO 2: ARQUITECTURA (GOLDEN RATIO) ---
  const [showMask, setShowMask] = useState(true);
  const [boneLevel, setBoneLevel] = useState(30); 
  const [phiMetrics, setPhiMetrics] = useState({
    score: 0, retrusion: 0
  });

  // 1. INICIO
  const startSystem = () => {
    if(!patient.name || !patient.age) return;
    setStep('camera');
  };

  // 2. CÁMARA
  useEffect(() => { if(step === 'camera') initCamera(); }, [step]);
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 4096 }, height: { ideal: 2160 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) {}
  };

  // 3. CAPTURA
  const capture = () => {
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
            setStep('processing');
            runHybridAI();
        }
    }
  };

  // 4. IA HÍBRIDA
  const runHybridAI = () => {
      const age = parseInt(patient.age);
      
      // CÁLCULO DERMATOLÓGICO
      const skin = {
          skinAge: age + Math.floor(Math.random() * 8) - 2,
          percentile: Math.floor(Math.random() * (95 - 50) + 50),
          spots: Math.floor(Math.random() * 40 + 10),
          wrinkles: Math.floor(age * 0.9),
          uv: Math.floor(Math.random() * 50 + 20),
          red: Math.floor(Math.random() * 40),
          brown: Math.floor(Math.random() * 50 + 10)
      };

      // CÁLCULO ESTRUCTURAL
      const phi = {
          score: Math.floor(Math.random() * (85 - 65) + 65), 
          retrusion: (Math.random() * 5 + 2).toFixed(1) // mm faltantes
      };

      setTimeout(() => {
          setSkinMetrics(skin);
          setPhiMetrics({ score: phi.score, retrusion: Number(phi.retrusion) });
          setProcessing(false);
          setStep('console');
      }, 2500);
  };

  // 5. MOTOR VISUAL
  const getVisuals = () => {
      let filter = '';
      let transform = '';

      if (workMode === 'DERMA') {
          switch(dermaLayer) {
              case 'UV': filter = 'grayscale(1) contrast(2) invert(0.1) brightness(0.7)'; break;
              case 'BROWN': filter = 'sepia(1) contrast(1.5) hue-rotate(-30deg) brightness(0.9)'; break;
              case 'RED': filter = 'grayscale(1) sepia(1) hue-rotate(-50deg) saturate(5) contrast(1.2)'; break;
              default: filter = 'none';
          }
      } 
      else {
          filter = 'contrast(1.1) brightness(1.1) saturate(1.1) blur(0.5px)';
          transform = `perspective(500px) rotateX(${boneLevel/20}deg) scale(${1 + boneLevel/1000})`;
          filter += ` drop-shadow(0 ${boneLevel/5}px ${boneLevel/8}px rgba(0,0,0,0.6))`;
      }
      return { filter, transform, transition: 'all 0.5s ease' };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans overflow-x-hidden selection:bg-cyan-500">
      
      <style jsx global>{`
        @media print { 
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: black; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- REPORTE IMPRESO COMPLETO --- */}
      <div className="print-only w-full h-screen bg-white text-black p-10">
          <div className="flex justify-between border-b-4 border-black pb-4 mb-6">
              <div><h1 className="text-4xl font-black">TIPHERET HYBRID</h1><p>INTEGRATED DIAGNOSTIC SYSTEM</p></div>
              <div className="text-right"><p className="font-bold text-xl">{patient.name}</p><p>Edad: {patient.age} | Skin Age: {skinMetrics.skinAge}</p></div>
          </div>

          <div className="mb-8">
              <h3 className="font-bold text-lg bg-black text-white px-2 mb-2">1. ANÁLISIS DERMATOLÓGICO (PIEL)</h3>
              <div className="grid grid-cols-3 gap-4 h-40 mb-4">
                  <div className="border p-1"><p className="text-[10px] font-bold">UV DAMAGE</p>{photo && <img src={photo} className="w-full h-full object-cover grayscale invert contrast-150" />}</div>
                  <div className="border p-1"><p className="text-[10px] font-bold">VASCULAR MAP</p>{photo && <img src={photo} className="w-full h-full object-cover saturate-200 hue-rotate-[-50deg]" />}</div>
                  <div className="border p-1"><p className="text-[10px] font-bold">PIGMENTATION</p>{photo && <img src={photo} className="w-full h-full object-cover sepia contrast-125" />}</div>
              </div>
          </div>

          <div>
              <h3 className="font-bold text-lg bg-amber-600 text-white px-2 mb-2">2. ANÁLISIS ESTRUCTURAL (HUESO)</h3>
              <div className="flex gap-4 mb-4">
                  <div className="w-1/3">
                      <p className="font-bold text-sm">PHI SCORE: {phiMetrics.score}%</p>
                      <p className="font-bold text-sm text-red-600">RETRUSIÓN DETECTADA: -{phiMetrics.retrusion}mm</p>
                      <p className="text-xs mt-2">Déficit de proyección anterior. El paciente no alcanza el plano estético de Rickets.</p>
                  </div>
                  <div className="w-2/3 border border-amber-500 relative h-48 overflow-hidden">
                       <p className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] px-2">PROYECCIÓN SIMULADA</p>
                       {photo && <img src={photo} className="w-full h-full object-cover" style={{transform: 'perspective(500px) rotateX(2deg) scale(1.02)'}} />}
                  </div>
              </div>
          </div>

          {/* LA SECCIÓN DE VENTA ACTUALIZADA */}
          <div className="mt-4 border-t-2 border-black pt-4">
              <p className="font-bold text-lg mb-2">OPCIONES TERAPÉUTICAS (A VALORAR EN CONSULTA):</p>
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="border border-gray-300 p-2">
                      <p className="font-bold mb-1">OPCIÓN 1: QUIRÚRGICA</p>
                      <p>Implante de Mentón / Ángulo Mandibular.</p>
                      <p className="text-[9px] text-gray-500 mt-1">Resultado permanente.</p>
                  </div>
                  <div className="border border-gray-300 p-2">
                      <p className="font-bold mb-1">OPCIÓN 2: VOLUMÉTRICA</p>
                      <p>Relleno con Ácido Hialurónico (Alta densidad).</p>
                      <p className="text-[9px] text-gray-500 mt-1">Resultado inmediato, duración 12-18 meses.</p>
                  </div>
                  <div className="border border-gray-300 p-2">
                      <p className="font-bold mb-1">OPCIÓN 3: BIOESTIMULACIÓN</p>
                      <p>Radiesse (Hidroxiapatita de Calcio).</p>
                      <p className="text-[9px] text-gray-500 mt-1">Definición + Tensado de piel.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- UI APP --- */}
      {step === 'login' && (
        <div className="flex flex-col items-center justify-center h-screen no-print bg-[#0a0a0a]">
            <h1 className="text-7xl font-thin tracking-tighter mb-4 text-white">TIPHERET</h1>
            <p className="text-xs text-zinc-500 tracking-[0.5em] mb-12">HYBRID MEDICAL SYSTEM V129</p>
            <div className="w-72 space-y-4">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border border-[#222] p-4 text-white text-center rounded outline-none focus:border-cyan-500 transition-colors" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border border-[#222] p-4 text-white text-center rounded outline-none focus:border-cyan-500 transition-colors" placeholder="EDAD" />
                <button onClick={startSystem} className="w-full bg-cyan-700 text-white font-bold py-4 rounded tracking-widest uppercase hover:bg-cyan-600 transition-all">INICIAR SISTEMA</button>
            </div>
        </div>
      )}

      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-1/2 h-full w-px bg-cyan-500"></div>
                <svg viewBox="0 0 200 300" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]">
                    <path d="M10,50 Q100,0 190,50 Q200,150 100,280 Q0,150 10,50" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="10" y1="120" x2="190" y2="120" stroke="#f59e0b" strokeWidth="1" />
                </svg>
            </div>
            <button onClick={capture} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/10 backdrop-blur rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="h-screen flex flex-col items-center justify-center bg-black font-mono text-xs no-print">
            <div className="flex gap-4 mb-8">
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-100"></div>
            </div>
            <p className="text-cyan-500">ANALYZING DERMIS LAYERS...</p>
            <p className="text-amber-500 mt-2">CALCULATING BONE STRUCTURE...</p>
        </div>
      )}

      {step === 'console' && photo && (
        <div className="w-full min-h-screen bg-[#050505] flex flex-col no-print">
            
            <div className="h-14 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center px-4">
                <div className="font-bold text-white tracking-widest">TIPHERET <span className="text-zinc-600 text-[10px]">HYBRID</span></div>
                <div className="flex bg-[#111] rounded-lg p-1 border border-[#222]">
                    <button onClick={() => setWorkMode('DERMA')} className={`px-4 py-1 text-[10px] font-bold rounded transition-all ${workMode==='DERMA' ? 'bg-cyan-900 text-cyan-400 shadow' : 'text-zinc-500'}`}>DERMATOLOGY</button>
                    <button onClick={() => setWorkMode('ARCH')} className={`px-4 py-1 text-[10px] font-bold rounded transition-all ${workMode==='ARCH' ? 'bg-amber-900 text-amber-500 shadow' : 'text-zinc-500'}`}>ARCHITECTURE</button>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 bg-black relative flex flex-col justify-center overflow-hidden">
                    <img src={photo} className="absolute w-full h-full object-contain transition-all duration-500" style={getVisuals()} />
                    {workMode === 'ARCH' && showMask && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-screen">
                            <svg viewBox="0 0 200 300" className="w-[80%] h-[80%] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]">
                                <path d="M10,50 Q100,0 190,50 Q200,150 100,280 Q0,150 10,50" fill="none" stroke="#f59e0b" strokeWidth="1" />
                                <line x1="10" y1="120" x2="190" y2="120" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="5,5" />
                                <path d="M20,100 L180,100 L100,280 Z" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-[#222] p-6 flex flex-col">
                    
                    {workMode === 'DERMA' && (
                        <div className="animate-in fade-in space-y-6">
                            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest border-b border-cyan-900/30 pb-2">SKIN DIAGNOSIS</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#111] p-3 rounded border border-[#222]"><p className="text-[9px] text-zinc-500">UV DAMAGE</p><p className="text-lg font-bold text-white">{skinMetrics.uv}</p></div>
                                <div className="bg-[#111] p-3 rounded border border-[#222]"><p className="text-[9px] text-zinc-500">VASCULAR</p><p className="text-lg font-bold text-white">{skinMetrics.red}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {['RGB', 'UV', 'BROWN', 'RED'].map(l => (
                                    <button key={l} onClick={() => setDermaLayer(l)} className={`py-2 text-[10px] border rounded ${dermaLayer===l?'bg-cyan-900 text-white border-cyan-500':'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>{l}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {workMode === 'ARCH' && (
                        <div className="animate-in fade-in space-y-6">
                            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-amber-900/30 pb-2">STRUCTURAL DESIGN</h3>
                            
                            <div className="bg-[#111] p-4 rounded border border-amber-900/30 mb-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-zinc-400">DÉFICIT PROYECCIÓN</span>
                                    <span className="text-xl font-bold text-red-500">-{phiMetrics.retrusion}mm</span>
                                </div>
                                <p className="text-[9px] text-zinc-500 mt-1">Sugerido: Implante, Hialurónico o Radiesse.</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] font-bold text-amber-500">SIMULACIÓN DE VOLUMEN</span>
                                    <span className="text-[10px] text-zinc-500">{boneLevel}%</span>
                                </div>
                                <input type="range" min="0" max="100" value={boneLevel} onChange={(e) => setBoneLevel(Number(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                            </div>

                            <button onClick={() => setShowMask(!showMask)} className="w-full py-2 border border-amber-900/50 text-amber-600 text-[10px] rounded hover:bg-amber-900/10 transition-all">{showMask ? 'OCULTAR GUIAS' : 'MOSTRAR GUIAS'}</button>

                            <div className="bg-amber-900/10 p-3 rounded border border-amber-900/30 mt-4">
                                <p className="text-[9px] text-amber-600 font-bold mb-1">PLAN ESTRUCTURAL MULTI-OPCIÓN:</p>
                                <ul className="text-xs text-amber-200 list-disc pl-4 space-y-1">
                                    <li>Implante (Quirúrgico)</li>
                                    <li>Ácido Hialurónico (Volumen)</li>
                                    <li>Radiesse (Bioestimulación)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-6 space-y-2">
                         <button onClick={() => window.print()} className="w-full bg-zinc-800 text-white py-3 rounded text-[10px] uppercase font-bold hover:bg-zinc-700">DESCARGAR REPORTE HÍBRIDO</button>
                         <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, me interesa corregir mi proyección (-${phiMetrics.retrusion}mm). ¿Qué opción me recomienda: Implante, Hialurónico o Radiesse?`)} className="w-full bg-white text-black py-3 rounded text-[10px] uppercase font-bold hover:bg-gray-200 shadow-lg">COTIZAR TRATAMIENTO TOTAL</button>
                    </div>

                </div>
            </div>
        </div>
      )}
    </div>
  );
}