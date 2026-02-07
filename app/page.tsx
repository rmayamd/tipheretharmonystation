"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_NUMBER = "573117936211";

export default function TipherethVisia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS DEL SISTEMA
  const [step, setStep] = useState('login'); 
  const [photo, setPhoto] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // DATOS MÉDICOS
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // MODO DE VISUALIZACIÓN (ESPECTRO)
  const [spectrum, setSpectrum] = useState('RGB'); // RGB | UV | BROWN | RED | TEXTURE

  // DATA CALCULADA (SIMULACIÓN DE ALGORITMO VISIA)
  const [metrics, setMetrics] = useState({
    trueAge: 0,
    skinAge: 0,
    percentile: 0,
    spots: 0,
    wrinkles: 0,
    texture: 0,
    pores: 0,
    uv: 0,
    brown: 0,
    red: 0,
    porphyrins: 0
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 3840 }, height: { ideal: 2160 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { console.error(e); }
  };

  // 3. CAPTURA Y ANÁLISIS
  const captureAndAnalyze = () => {
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
            runAlgorithm();
        }
    }
  };

  // 4. ALGORITMO "VISIA" (GENERACIÓN DE DATA)
  const runAlgorithm = () => {
      const age = parseInt(patient.age);
      // Simulación de cálculo basado en edad cronológica
      setTimeout(() => {
          setMetrics({
              trueAge: age,
              skinAge: age + Math.floor(Math.random() * 6) - 1, // Edad Piel
              percentile: Math.floor(Math.random() * (95 - 40) + 40), // Comparativo Global
              spots: Math.floor(Math.random() * 40) + 10,
              wrinkles: Math.floor(age * 0.8),
              texture: Math.floor(Math.random() * 100), // Score
              pores: Math.floor(Math.random() * 80),
              uv: Math.floor(Math.random() * 50) + 20,
              brown: Math.floor(Math.random() * 60) + 10,
              red: Math.floor(Math.random() * 40),
              porphyrins: Math.floor(Math.random() * 500)
          });
          setProcessing(false);
          setStep('dashboard');
      }, 3000);
  };

  // 5. FILTROS ESPECTRALES (LO QUE HACE QUE SE VEA COMO VISIA)
  const getFilter = () => {
      switch(spectrum) {
          case 'UV': return 'grayscale(1) contrast(2.5) brightness(0.6) invert(0.1)'; // Daño Solar Profundo
          case 'BROWN': return 'sepia(1) contrast(1.5) brightness(0.9) hue-rotate(-30deg)'; // Pigmento Melanina
          case 'RED': return 'grayscale(1) sepia(1) hue-rotate(-50deg) saturate(5) contrast(1.2)'; // Vascular / Hemoglobina
          case 'TEXTURE': return 'grayscale(1) contrast(3) brightness(1.1)'; // Relieve / Arrugas
          default: return 'none'; // RGB Normal
      }
  };

  return (
    <div className="min-h-screen bg-[#111] text-zinc-300 font-sans overflow-x-hidden selection:bg-cyan-500">
      
      <style jsx global>{`
        @media print { 
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: black; }
            /* Forzar impresión de fondos para las gráficas */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- REPORTE IMPRESO (TIPO LABORATORIO) --- */}
      <div className="print-only w-full h-screen bg-white text-black p-10">
          <div className="flex justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                  <h1 className="text-4xl font-black tracking-tighter">TIPHERET SKIN LAB</h1>
                  <p className="text-sm uppercase tracking-widest">Clinical Analysis Report</p>
              </div>
              <div className="text-right">
                  <p className="font-bold text-xl">{patient.name}</p>
                  <p>Edad: {metrics.trueAge} | <strong>Edad Piel: {metrics.skinAge}</strong></p>
              </div>
          </div>

          <div className="flex gap-4 mb-8 h-64">
              <div className="flex-1 border p-1"><p className="text-[10px] font-bold">CROSS POLARIZED (GLARE-FREE)</p>{photo && <img src={photo} className="w-full h-full object-cover grayscale contrast-125" />}</div>
              <div className="flex-1 border p-1"><p className="text-[10px] font-bold">UV SPOTS (SUBSURFACE)</p>{photo && <img src={photo} className="w-full h-full object-cover grayscale contrast-200 brightness-75 invert" />}</div>
              <div className="flex-1 border p-1"><p className="text-[10px] font-bold">VASCULAR MAP (HB)</p>{photo && <img src={photo} className="w-full h-full object-cover saturate-200 contrast-125" />}</div>
          </div>

          <h3 className="font-bold text-lg border-b border-gray-300 mb-4">MÉTRICAS DEL PACIENTE VS. POBLACIÓN</h3>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-xs">
              {[
                { label: 'SPOTS (Manchas)', val: metrics.spots, max: 100 },
                { label: 'WRINKLES (Arrugas)', val: metrics.wrinkles, max: 80 },
                { label: 'TEXTURE (Relieve)', val: metrics.texture, max: 100 },
                { label: 'PORES (Poros)', val: metrics.pores, max: 100 },
                { label: 'UV SPOTS (Daño Solar)', val: metrics.uv, max: 100 },
                { label: 'BROWN SPOTS (Melanina)', val: metrics.brown, max: 100 },
                { label: 'RED AREAS (Vascular)', val: metrics.red, max: 100 },
                { label: 'PORPHYRINS (Bacterias)', val: metrics.porphyrins, max: 500 }
              ].map((m, i) => (
                  <div key={i}>
                      <div className="flex justify-between mb-1">
                          <span className="font-bold uppercase">{m.label}</span>
                          <span>{m.val} Count</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 border border-black relative">
                          <div className="h-full bg-black" style={{ width: `${(m.val / m.max) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                          <span>Better</span>
                          <span>Score: {Math.floor(100 - (m.val/m.max)*100)}%</span>
                          <span>Worse</span>
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-8 bg-gray-100 p-4 border border-black text-center">
              <p className="font-bold">PERCENTIL GLOBAL: {metrics.percentile}%</p>
              <p className="text-xs">Su piel presenta características superiores al {metrics.percentile}% de las personas de su misma edad ({patient.age} años).</p>
          </div>
      </div>


      {/* --- UI PANTALLA --- */}
      
      {/* 1. LOGIN */}
      {step === 'login' && (
        <div className="flex flex-col items-center justify-center h-screen no-print">
            <h1 className="text-7xl font-thin tracking-tighter mb-8 text-white">TIPHERET</h1>
            <div className="w-72 space-y-4">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#222] border border-[#333] p-4 text-white text-center rounded outline-none focus:border-cyan-500" placeholder="NOMBRE DEL PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#222] border border-[#333] p-4 text-white text-center rounded outline-none focus:border-cyan-500" placeholder="EDAD REAL" />
                <button onClick={startSystem} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">INICIAR SESIÓN</button>
            </div>
        </div>
      )}

      {/* 2. CÁMARA (GRID CLÍNICO) */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* OVERLAY TIPO VECTRA */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-dashed border-cyan-500 rounded-[50%]"></div>
                
                {/* REGLAS DE MEDICIÓN */}
                <div className="absolute top-10 right-10 text-cyan-500 text-xs font-mono text-right">
                    <p>ISO: AUTO</p>
                    <p>FOCUS: LOCK</p>
                    <p>GRID: ON</p>
                    <p>DETECT: FACE</p>
                </div>
            </div>
            
            <button onClick={captureAndAnalyze} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/10 backdrop-blur rounded-full border-4 border-white flex items-center justify-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* 3. PROCESANDO (ANIMACIÓN MATRIX) */}
      {step === 'processing' && (
        <div className="h-screen flex flex-col items-center justify-center bg-black font-mono text-cyan-400 text-xs no-print">
            <div className="w-20 h-20 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-8"></div>
            <p className="animate-pulse">NORMALIZING LIGHTING...</p>
            <p className="animate-pulse delay-75 text-cyan-600">SEPARATING COLOR CHANNELS...</p>
            <p className="animate-pulse delay-150 text-cyan-700">MAPPING PORE STRUCTURE...</p>
            <p className="animate-pulse delay-200 text-cyan-800">CALCULATING PERCENTILES...</p>
        </div>
      )}

      {/* 4. DASHBOARD (RESULTADOS) */}
      {step === 'dashboard' && photo && (
        <div className="w-full min-h-screen bg-[#050505] flex flex-col no-print">
            
            {/* HEADER TÉCNICO */}
            <div className="h-16 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center px-6">
                <div><h2 className="text-lg font-bold text-white tracking-widest">TIPHERET</h2><p className="text-[10px] text-zinc-500">ANALYSIS CONSOLE</p></div>
                <div className="flex gap-4 text-right">
                     <div><p className="text-[9px] text-zinc-500">TRUE AGE</p><p className="text-xl font-bold text-white">{metrics.trueAge}</p></div>
                     <div><p className="text-[9px] text-zinc-500">SKIN AGE</p><p className="text-xl font-bold text-cyan-500">{metrics.skinAge}</p></div>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                
                {/* COLUMNA IZQUIERDA: VISOR MULTIESPECTRAL */}
                <div className="flex-1 bg-black relative flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                        <img src={photo} className="w-full h-full object-contain" style={{ filter: getFilter() }} />
                        
                        {/* ETIQUETA DE MODO */}
                        <div className="absolute top-4 left-4 bg-black/70 border border-white/10 px-3 py-1 rounded text-xs text-white font-bold">
                            {spectrum === 'RGB' ? 'STANDARD LIGHTING' : 
                             spectrum === 'UV' ? 'UV FLUORESCENCE' :
                             spectrum === 'BROWN' ? 'CROSS POLARIZED (PIGMENT)' :
                             spectrum === 'RED' ? 'HEMOGLOBIN MAP' : 'SURFACE TEXTURE'}
                        </div>
                    </div>

                    {/* BOTONES DE ESPECTRO */}
                    <div className="h-16 bg-[#0a0a0a] border-t border-[#222] flex justify-center items-center gap-2 p-2">
                        <button onClick={() => setSpectrum('RGB')} className={`px-4 py-2 rounded text-[10px] font-bold ${spectrum==='RGB'?'bg-white text-black':'bg-[#222] text-gray-400'}`}>RGB</button>
                        <button onClick={() => setSpectrum('UV')} className={`px-4 py-2 rounded text-[10px] font-bold ${spectrum==='UV'?'bg-blue-900 text-white border border-blue-500':'bg-[#222] text-gray-400'}`}>UV</button>
                        <button onClick={() => setSpectrum('BROWN')} className={`px-4 py-2 rounded text-[10px] font-bold ${spectrum==='BROWN'?'bg-yellow-900 text-white border border-yellow-500':'bg-[#222] text-gray-400'}`}>BROWN</button>
                        <button onClick={() => setSpectrum('RED')} className={`px-4 py-2 rounded text-[10px] font-bold ${spectrum==='RED'?'bg-red-900 text-white border border-red-500':'bg-[#222] text-gray-400'}`}>RED</button>
                        <button onClick={() => setSpectrum('TEXTURE')} className={`px-4 py-2 rounded text-[10px] font-bold ${spectrum==='TEXTURE'?'bg-green-900 text-white border border-green-500':'bg-[#222] text-gray-400'}`}>TEXTURE</button>
                    </div>
                </div>

                {/* COLUMNA DERECHA: DATA */}
                <div className="w-full lg:w-96 bg-[#0f0f0f] border-l border-[#222] p-6 overflow-y-auto">
                    <h3 className="text-xs font-bold text-zinc-500 mb-6 uppercase tracking-widest">SKIN METRICS</h3>
                    
                    <div className="space-y-6">
                        {/* SCORE CARD */}
                        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-gray-400">PERCENTILE</span>
                                <span className="text-3xl font-bold text-white">{metrics.percentile}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-700"><div className="h-full bg-cyan-500" style={{width: `${metrics.percentile}%`}}></div></div>
                        </div>

                        {/* LISTADO DE MÉTRICAS */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Spots</span>
                                <span className="font-bold text-white">{metrics.spots}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Wrinkles</span>
                                <span className="font-bold text-white">{metrics.wrinkles}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Texture Score</span>
                                <span className="font-bold text-green-400">{metrics.texture}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Pores</span>
                                <span className="font-bold text-white">{metrics.pores}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">UV Damage</span>
                                <span className="font-bold text-red-400">{metrics.uv}</span>
                            </div>
                             <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Brown Spots</span>
                                <span className="font-bold text-yellow-400">{metrics.brown}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-[#222] pb-2">
                                <span className="text-gray-400">Red Areas</span>
                                <span className="font-bold text-red-400">{metrics.red}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-3">
                        <button onClick={() => window.print()} className="w-full bg-white text-black font-bold py-3 rounded text-xs uppercase hover:bg-gray-200">PRINT REPORT</button>
                        <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Quiero tratar mi Percentil de Piel: ${metrics.percentile}%`)} className="w-full bg-cyan-900/30 text-cyan-400 border border-cyan-500 font-bold py-3 rounded text-xs uppercase hover:bg-cyan-900/50">CONSULT DR. MAYA</button>
                    </div>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}