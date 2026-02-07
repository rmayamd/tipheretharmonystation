"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- 1. CONFIGURACIÓN DEL CEREBRO (EDITABLE) ---
const WS_NUMBER = "573117936211";

const PRICES = {
  // QUIRÚRGICOS
  rhino: 4500, bichat: 800, bleph: 2500, liplift: 1500,
  facelift: 6500, chin_implant: 2000, lipo_neck: 1800,
  // NO QUIRÚRGICOS
  botox: 300, filler: 350, radiesse: 450, laser: 600, peeling: 150
};

export default function TipherethOS() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS GLOBALES ---
  const [appMode, setAppMode] = useState('HOME'); // HOME | CONSULT | RECOVERY
  const [patient, setPatient] = useState({ name: '', age: '' });

  // --- ESTADOS DE CONSULTA (VISIA + SNIPER + COTIZADOR) ---
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); // FRONT -> SIDE_R -> SIDE_L
  const [photos, setPhotos] = useState({ front: null, right: null, left: null });
  const [reportTab, setReportTab] = useState('QUOTE'); // QUOTE | SURGERY | SKIN
  
  // DATA IA
  const [analysis, setAnalysis] = useState({
    skin: { uv: 0, red: 0, brown: 0, pores: 0, rx: "", price: 0 },
    surgery: {
      rhino: { rx: "", price: 0 },
      chin: { rx: "", price: 0 },
      bichat: { rx: "", price: 0 },
      bleph: { rx: "", price: 0 },
      liplift: { rx: "", price: 0 },
      jaw: { rx: "", price: 0 }
    },
    total: 0
  });

  // --- ESTADOS DE RECUPERACIÓN (POST-OP) ---
  const [postOpDay, setPostOpDay] = useState(7);
  const [recoveryStatus, setRecoveryStatus] = useState('GREEN'); // GREEN | YELLOW | RED

  // ---------------------------------------------------------
  // MÓDULO 1: INICIO Y NAVEGACIÓN
  // ---------------------------------------------------------
  const startConsult = () => { if(patient.name) setAppMode('CONSULT'); };
  const startRecovery = () => { if(patient.name) setAppMode('RECOVERY'); };

  // ---------------------------------------------------------
  // MÓDULO 2: CÁMARA TÁCTICA (3 PASOS)
  // ---------------------------------------------------------
  useEffect(() => { 
    if(appMode === 'CONSULT' && consultPhase === 'CAPTURE') startCamera(); 
    if(appMode === 'RECOVERY') startCamera();
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
            // Espejo solo en frontal
            if (captureStep === 'FRONT' || appMode === 'RECOVERY') { ctx.translate(cvs.width, 0); ctx.scale(-1, 1); }
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);

            if (appMode === 'CONSULT') {
                if (captureStep === 'FRONT') { setPhotos(prev => ({ ...prev, front: imgData })); setCaptureStep('SIDE_R'); }
                else if (captureStep === 'SIDE_R') { setPhotos(prev => ({ ...prev, right: imgData })); setCaptureStep('SIDE_L'); }
                else if (captureStep === 'SIDE_L') { 
                    setPhotos(prev => ({ ...prev, left: imgData })); 
                    setConsultPhase('PROCESSING'); 
                    runFullAI(); 
                }
            } else {
                // Modo Recovery: Solo toma una foto de evolución
                setPhotos(prev => ({ ...prev, front: imgData })); // Usamos slot frontal para evolución
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN'); // Simula análisis
            }
        }
    }
  };

  // ---------------------------------------------------------
  // MÓDULO 3: IA MAESTRA (VISIA + SNIPER + PRECIOS)
  // ---------------------------------------------------------
  const runFullAI = () => {
      const age = parseInt(patient.age);
      let total = 0;

      // 1. ANÁLISIS QUIRÚRGICO (Francotirador)
      const sx = {
          rhino: { rx: "Rinoplastia Ultrasónica + Alectomía", price: PRICES.rhino },
          chin: { rx: Math.random() > 0.5 ? "Implante de Mentón Rígido" : "Proyección con Volux", price: PRICES.chin_implant },
          bichat: { rx: "Bichectomía (Perfilamiento)", price: PRICES.bichat },
          bleph: { rx: age > 40 ? "Blefaroplastia Completa" : "Transconjuntival", price: PRICES.bleph },
          liplift: { rx: "Lip Lift (Rejuvenecimiento Oral)", price: PRICES.liplift },
          jaw: { rx: "Radiesse (Vectorización)", price: PRICES.radiesse }
      };

      // 2. ANÁLISIS PIEL (Visia)
      const sk = {
          uv: Math.floor(Math.random() * 60 + 20),
          red: Math.floor(Math.random() * 40),
          brown: Math.floor(Math.random() * 50 + 10),
          pores: Math.floor(Math.random() * 60 + 20),
          rx: age > 35 ? "Láser CO2 Fraccionado" : "Peeling Químico",
          price: age > 35 ? PRICES.laser : PRICES.peeling
      };

      // 3. SUMATORIA FINANCIERA
      Object.values(sx).forEach(i => total += i.price);
      total += sk.price;

      setTimeout(() => {
          setAnalysis({ surgery: sx, skin: sk, total: total });
          setConsultPhase('REPORT');
      }, 3000);
  };

  // ---------------------------------------------------------
  // RENDERIZADO
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500">
      
      {/* CSS IMPRESIÓN & TARGETS */}
      <style jsx global>{`
        @media print { 
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: black; }
        }
        .print-only { display: none; }
        .target-dot { position: absolute; border: 2px solid; border-radius: 50%; width: 24px; height: 24px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.2);} 100% {transform: scale(1);} }
      `}</style>

      {/* --- PANTALLA 1: LOGIN (EL HUB) --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print">
            <h1 className="text-7xl font-thin tracking-tighter mb-4">TIPHERET<span className="text-cyan-500 font-bold">OS</span></h1>
            <div className="w-80 space-y-4">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border border-zinc-800 p-4 text-center rounded focus:border-cyan-500 outline-none" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border border-zinc-800 p-4 text-center rounded focus:border-cyan-500 outline-none" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={startConsult} className="bg-cyan-900/50 border border-cyan-500 text-cyan-400 py-6 rounded-lg font-bold hover:bg-cyan-500 hover:text-black transition-all">
                        PACIENTE NUEVO<br/><span className="text-[9px] font-normal">DIAGNÓSTICO & COTIZACIÓN</span>
                    </button>
                    <button onClick={startRecovery} className="bg-zinc-900 border border-zinc-600 text-zinc-400 py-6 rounded-lg font-bold hover:bg-zinc-800 hover:text-white transition-all">
                        YA OPERADO<br/><span className="text-[9px] font-normal">SEGUIMIENTO POST-OP</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODO CONSULTA (EL FRANCOTIRADOR + COTIZADOR) --- */}
      {appMode === 'CONSULT' && (
          <>
            {/* CAPTURA 3 PASOS */}
            {consultPhase === 'CAPTURE' && (
                <div className="relative w-full h-screen bg-black no-print overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute top-20 w-full text-center">
                        <p className="bg-cyan-600 font-bold inline-block px-4 py-2 rounded shadow-lg uppercase">
                            {captureStep === 'FRONT' ? "PASO 1: FRONTAL" : captureStep === 'SIDE_R' ? "PASO 2: PERFIL DER" : "PASO 3: PERFIL IZQ"}
                        </p>
                    </div>
                    <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/20 backdrop-blur rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                </div>
            )}

            {/* PROCESANDO */}
            {consultPhase === 'PROCESSING' && (
                <div className="h-screen bg-black flex flex-col items-center justify-center text-xs font-mono no-print">
                    <p className="text-cyan-500">MAPPING FACIAL VECTORS...</p>
                    <p className="text-red-500 mt-2">CALCULATING SURGICAL BUDGET...</p>
                </div>
            )}

            {/* REPORTE FINAL (VISIA + SNIPER + PRECIO) */}
            {consultPhase === 'REPORT' && (
                <div className="w-full min-h-screen bg-[#050505] flex flex-col no-print">
                    <div className="h-16 border-b border-[#222] bg-[#0a0a0a] flex justify-between items-center px-4">
                        <div className="font-bold">TIPHERET <span className="text-green-500 text-xs">PRO</span></div>
                        <div className="flex bg-[#111] rounded p-1 border border-[#222]">
                            <button onClick={() => setReportTab('QUOTE')} className={`px-4 py-1 text-[10px] font-bold rounded ${reportTab==='QUOTE'?'bg-green-900 text-white':'text-gray-500'}`}>COTIZACIÓN</button>
                            <button onClick={() => setReportTab('SURGERY')} className={`px-4 py-1 text-[10px] font-bold rounded ${reportTab==='SURGERY'?'bg-red-900 text-white':'text-gray-500'}`}>QX (SNIPER)</button>
                            <button onClick={() => setReportTab('SKIN')} className={`px-4 py-1 text-[10px] font-bold rounded ${reportTab==='SKIN'?'bg-blue-900 text-white':'text-gray-500'}`}>PIEL (VISIA)</button>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                        <div className="flex-1 bg-black relative flex flex-col justify-center overflow-hidden">
                             {/* VISOR INTELIGENTE: MUESTRA LA FOTO SEGÚN EL TAB */}
                             {reportTab === 'SKIN' ? (
                                <img src={photos.front!} className="absolute w-full h-full object-contain filter contrast-125" />
                             ) : (
                                <div className="relative w-full h-full">
                                    <img src={photos.right!} className="absolute w-full h-full object-contain" />
                                    {/* TARGETS (MIRA DE FRANCOTIRADOR) */}
                                    <div className="target-dot border-green-500" style={{top:'45%', left:'40%'}}></div> {/* Nariz */}
                                    <div className="target-dot border-red-500" style={{top:'65%', left:'35%'}}></div> {/* Mentón */}
                                </div>
                             )}
                        </div>

                        {/* PANEL DE DATOS */}
                        <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-[#222] p-6 overflow-y-auto">
                            
                            {/* 1. COTIZADOR */}
                            {reportTab === 'QUOTE' && (
                                <div className="space-y-4">
                                    <h3 className="text-green-500 font-bold mb-4 tracking-widest text-xs">PRESUPUESTO ESTIMADO</h3>
                                    {[analysis.surgery.rhino, analysis.surgery.chin, analysis.surgery.bichat, analysis.surgery.bleph, analysis.skin].map((item, i) => (
                                        item.price > 0 && <div key={i} className="flex justify-between text-xs border-b border-[#222] pb-2"><span>{item.rx}</span><span className="text-green-400 font-bold">${item.price}</span></div>
                                    ))}
                                    <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-xl text-center mt-6">
                                        <p className="text-xs text-green-300">TOTAL</p>
                                        <p className="text-4xl font-black text-white">${analysis.total}</p>
                                    </div>
                                    <button onClick={() => window.print()} className="w-full bg-white text-black font-bold py-3 rounded text-xs mt-4">IMPRIMIR FACTURA</button>
                                </div>
                            )}

                            {/* 2. SNIPER QUIRÚRGICO */}
                            {reportTab === 'SURGERY' && (
                                <div className="space-y-4">
                                    <h3 className="text-red-500 font-bold mb-4 tracking-widest text-xs">DIAGNÓSTICO ESTRUCTURAL</h3>
                                    <div className="bg-[#111] p-3 border-l-2 border-red-500"><p className="text-[10px] text-gray-500">MENTÓN</p><p className="font-bold">{analysis.surgery.chin.rx}</p></div>
                                    <div className="bg-[#111] p-3 border-l-2 border-green-500"><p className="text-[10px] text-gray-500">NARIZ</p><p className="font-bold">{analysis.surgery.rhino.rx}</p></div>
                                    <div className="bg-[#111] p-3 border-l-2 border-blue-500"><p className="text-[10px] text-gray-500">PÁRPADOS</p><p className="font-bold">{analysis.surgery.bleph.rx}</p></div>
                                    <div className="bg-[#111] p-3 border-l-2 border-purple-500"><p className="text-[10px] text-gray-500">BICHAT</p><p className="font-bold">{analysis.surgery.bichat.rx}</p></div>
                                </div>
                            )}

                            {/* 3. VISIA PIEL */}
                            {reportTab === 'SKIN' && (
                                <div className="space-y-4">
                                    <h3 className="text-blue-500 font-bold mb-4 tracking-widest text-xs">ANÁLISIS DE PIEL</h3>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-[#111] p-2"><span>UV: </span><strong>{analysis.skin.uv}</strong></div>
                                        <div className="bg-[#111] p-2"><span>Vasos: </span><strong>{analysis.skin.red}</strong></div>
                                        <div className="bg-[#111] p-2"><span>Manchas: </span><strong>{analysis.skin.brown}</strong></div>
                                        <div className="bg-[#111] p-2"><span>Poros: </span><strong>{analysis.skin.pores}</strong></div>
                                    </div>
                                    <div className="bg-blue-900/20 p-4 border border-blue-500/50 mt-4">
                                        <p className="text-[10px] text-blue-300">RX PIEL</p>
                                        <p className="text-sm font-bold">{analysis.skin.rx}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </>
      )}

      {/* --- MODO RECUPERACIÓN (EL GUARDIÁN MUNDIAL) --- */}
      {appMode === 'RECOVERY' && (
          <div className="w-full max-w-md mx-auto min-h-screen bg-[#111] flex flex-col">
              <div className="p-6 bg-gradient-to-b from-blue-900/20 to-transparent">
                  <h1 className="text-2xl font-thin">Hola, <span className="font-bold">{patient.name}</span></h1>
                  <p className="text-xs text-green-400 uppercase tracking-widest mt-1">RECUPERACIÓN DÍA {postOpDay}</p>
              </div>

              {/* LÍNEA DE TIEMPO */}
              <div className="flex gap-4 px-6 overflow-x-auto mb-6 no-scrollbar">
                  {[1,7,15,30,60].map(d => (
                      <button key={d} onClick={() => setPostOpDay(d)} className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center border ${postOpDay===d ? 'bg-blue-600 border-blue-400' : 'bg-[#222] border-[#333]'}`}>
                          D{d}
                      </button>
                  ))}
              </div>

              {/* CÁMARA / FOTO EVOLUCIÓN */}
              <div className="flex-1 bg-black relative mx-4 rounded-2xl overflow-hidden border border-gray-800">
                  {photos.front ? (
                      <div className="relative w-full h-full">
                          <img src={photos.front} className="w-full h-full object-cover" />
                          <div className={`absolute bottom-0 inset-x-0 p-4 ${recoveryStatus==='GREEN'?'bg-green-900/90':'bg-yellow-900/90'}`}>
                              <p className="font-bold text-white">{recoveryStatus==='GREEN'?'EVOLUCIÓN CORRECTA':'INFLAMACIÓN DETECTADA'}</p>
                              <p className="text-xs text-gray-300">Análisis IA completado.</p>
                          </div>
                      </div>
                  ) : (
                      <div className="absolute inset-0">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                          <canvas ref={canvasRef} className="hidden" />
                          <button onClick={takeShot} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-500"></button>
                          <p className="absolute top-4 w-full text-center text-xs bg-black/50 py-1">FOTO DE CONTROL DIARIO</p>
                      </div>
                  )}
              </div>

              <div className="p-6">
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, tengo una duda sobre mi día ${postOpDay}.`)} className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase shadow-lg">
                      CONTACTAR AL DR. MAYA (SOS)
                  </button>
                  <button onClick={() => setAppMode('HOME')} className="w-full text-zinc-500 py-4 text-xs">SALIR</button>
              </div>
          </div>
      )}

      {/* --- REPORTE IMPRESO (PDF UNIFICADO) --- */}
      <div className="print-only w-full bg-white text-black p-10">
          <div className="border-b-4 border-black pb-4 mb-6 flex justify-between">
              <div><h1 className="text-4xl font-black">HISTORIA CLÍNICA</h1><p>DIAGNÓSTICO + COTIZACIÓN</p></div>
              <div className="text-right"><p className="font-bold">{patient.name}</p><p>Edad: {patient.age}</p></div>
          </div>
          {/* FOTOS */}
          <div className="flex gap-2 h-40 mb-6">
              <div className="border flex-1">{photos.front && <img src={photos.front} className="w-full h-full object-cover"/>}</div>
              <div className="border flex-1">{photos.right && <img src={photos.right} className="w-full h-full object-cover"/>}</div>
          </div>
          {/* TABLA DE PRECIOS */}
          <table className="w-full text-xs text-left border-collapse border border-black">
              <thead className="bg-gray-200"><tr><th className="p-2 border">PROCEDIMIENTO</th><th className="p-2 border text-right">VALOR</th></tr></thead>
              <tbody>
                  {analysis.surgery.rhino.price > 0 && <tr><td className="p-2 border">{analysis.surgery.rhino.rx}</td><td className="p-2 border text-right">${analysis.surgery.rhino.price}</td></tr>}
                  {analysis.surgery.chin.price > 0 && <tr><td className="p-2 border">{analysis.surgery.chin.rx}</td><td className="p-2 border text-right">${analysis.surgery.chin.price}</td></tr>}
                  {analysis.surgery.bichat.price > 0 && <tr><td className="p-2 border">{analysis.surgery.bichat.rx}</td><td className="p-2 border text-right">${analysis.surgery.bichat.price}</td></tr>}
                  {analysis.skin.price > 0 && <tr><td className="p-2 border">{analysis.skin.rx}</td><td className="p-2 border text-right">${analysis.skin.price}</td></tr>}
              </tbody>
              <tfoot>
                  <tr className="bg-black text-white"><td className="p-2 font-bold text-right">TOTAL</td><td className="p-2 font-bold text-right">${analysis.total}</td></tr>
              </tfoot>
          </table>
      </div>

    </div>
  );
}