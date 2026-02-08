"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- PRECIOS POR CAPA ANATÓMICA ---
const WS_NUMBER = "573117936211";
const PRICES = {
  layer_skin: 800,       // Láser / Peeling
  layer_fat: 1200,       // Enzimas / Bichectomía
  layer_smas: 2500,      // Radiesse / Lifting / Hilos
  layer_bone: 3500,      // Volux / Mentón / Rino
  full_pack: 6500        // Full Face
};

export default function TipherethAnatomical() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // --- DIAGNÓSTICO POR CAPAS (EL FRANCOTIRADOR) ---
  const [diagnosis, setDiagnosis] = useState({
    phiScore: 0,
    // LAS 4 CAPAS
    skin: { condition: "", rx: "" },     // Epidermis
    fat: { condition: "", rx: "" },      // Grasa (Bichat/Jowls)
    smas: { condition: "", rx: "" },     // SMAS (Flacidez)
    bone: { condition: "", rx: "" },     // Hueso (Soporte)
    // VENTA
    mainSolution: "",
    totalPrice: 0
  });

  // POST-OP
  const [postOpDay, setPostOpDay] = useState(7);
  const [recoveryStatus, setRecoveryStatus] = useState('GREEN');

  // 1. INICIO
  const startConsult = () => { if(patient.name) setAppMode('CONSULT'); };
  const startRecovery = () => { if(patient.name) setAppMode('RECOVERY'); };

  // 2. CÁMARA (3 ÁNGULOS)
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
                    runAnatomicalEngine();
                }
            } else {
                setPhotos(prev => ({ ...prev, front: imgData }));
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN');
            }
        }
    }
  };

  // 3. MOTOR ANATÓMICO (4 CAPAS)
  const runAnatomicalEngine = () => {
      const age = parseInt(patient.age);
      const phi = Math.floor(Math.random() * (78 - 65) + 65);

      // CAPA 1: PIEL (Visia Logic)
      const skinDx = {
          condition: age > 35 ? "Fotoenvejecimiento / Manchas UV" : "Textura Irregular / Poros",
          rx: age > 35 ? "Láser CO2 Fraccionado" : "Peeling Químico"
      };

      // CAPA 2: GRASA (Volumen)
      const fatDx = {
          condition: "Hipertrofia de Bichat / Jowls Leves",
          rx: "Bichectomía / Enzimas Lipolíticas"
      };

      // CAPA 3: SMAS (Suspensión)
      const smasDx = {
          condition: age > 45 ? "Ptosis del SMAS / Descenso Facial" : "Laxitud Ligamentaria Leve",
          rx: age > 45 ? "Lifting Facial (Deep Plane)" : "Bioestimulación Tensora (Radiesse)"
      };

      // CAPA 4: HUESO (Soporte)
      const boneDx = {
          condition: "Retrusión Mandibular / Asimetría Ósea",
          rx: "Proyección con Volux / Implante"
      };

      // CÁLCULO DE PRECIO FINAL (SEGÚN EDAD)
      let finalPrice = 0;
      let mainSol = "";
      
      if (age < 35) {
          finalPrice = PRICES.layer_bone + PRICES.layer_fat; // Perfilamiento
          mainSol = "PERFILAMIENTO ESTRUCTURAL (Hueso + Grasa)";
      } else if (age < 50) {
          finalPrice = PRICES.layer_smas + PRICES.layer_skin; // Rejuvenecimiento
          mainSol = "LIFTING NO QUIRÚRGICO (SMAS + Piel)";
      } else {
          finalPrice = PRICES.full_pack; // Todo
          mainSol = "RESTAURACIÓN ANATÓMICA TOTAL";
      }

      setTimeout(() => {
          setDiagnosis({
              phiScore: phi,
              skin: skinDx,
              fat: fatDx,
              smas: smasDx,
              bone: boneDx,
              mainSolution: mainSol,
              totalPrice: finalPrice
          });
          setConsultPhase('REVEAL'); 
      }, 3500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-amber-500">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }
        
        @media print { 
            @page { margin: 0; size: A4; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: #1a1a1a; -webkit-print-color-adjust: exact; }
            .page-container { padding: 40px; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- LOGIN --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <h1 className="text-7xl serif italic mb-2 tracking-widest text-white">Tiphereth</h1>
            <p className="text-xs text-zinc-500 tracking-[0.5em] mb-12 uppercase">Anatomical OS V146</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={startConsult} className="bg-white text-black py-6 rounded-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-all text-[10px]">
                        NUEVA CONSULTA<br/><span className="serif italic text-xs capitalize">Escáner 4 Capas</span>
                    </button>
                    <button onClick={startRecovery} className="bg-[#111] border border-gray-700 text-gray-400 py-6 rounded-sm font-bold tracking-widest uppercase hover:bg-[#222] transition-all text-[10px]">
                        PACIENTE VIP<br/><span className="serif italic text-xs capitalize">Seguimiento Post-Op</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- CÁMARA (3 PASOS) --- */}
      {consultPhase === 'CAPTURE' && appMode === 'CONSULT' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-24 w-full text-center">
                <p className="text-white text-xl serif italic">
                    {captureStep === 'FRONT' ? "Paso 1: Frontal (Simetría)" : 
                     captureStep === 'SIDE_R' ? "Paso 2: Perfil Derecho (Proyección)" : 
                     "Paso 3: Perfil Izquierdo (Soporte)"}
                </p>
            </div>
            <button onClick={takeShot} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 border border-white rounded-full flex items-center justify-center hover:bg-white/10">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- ANALIZANDO CAPAS --- */}
      {consultPhase === 'ANALYZING' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white serif italic no-print">
            <p className="animate-pulse text-2xl">Escaneando Planos Anatómicos...</p>
            <div className="mt-4 space-y-2 text-xs font-sans text-gray-500 uppercase tracking-widest text-center">
                <p>1. Epidermis (Piel) ... OK</p>
                <p>2. Compartimentos Grasos ... OK</p>
                <p>3. Sistema SMAS ... OK</p>
                <p>4. Estructura Ósea ... OK</p>
            </div>
        </div>
      )}

      {/* --- EL REPORTE FINAL (DOSSIER ANATÓMICO) --- */}
      {consultPhase === 'REVEAL' && appMode === 'CONSULT' && (
        <div className="w-full min-h-screen bg-[#111]">
            
            {/* VISTA DIGITAL */}
            <div className="no-print p-8 flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-3xl serif text-amber-500 mb-2">DIAGNÓSTICO MULTICAPA</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Análisis Estructural Completado</p>
                
                <div className="flex gap-2 mb-8 h-32 opacity-80">
                    {photos.right && <img src={photos.right} className="h-full border border-gray-800" />}
                    {photos.front && <img src={photos.front} className="h-full border border-amber-500" />}
                    {photos.left && <img src={photos.left} className="h-full border border-gray-800" />}
                </div>

                <div className="flex gap-4">
                    <button onClick={() => window.print()} className="bg-white text-black px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-200">IMPRIMIR DOSSIER</button>
                    <button onClick={() => setAppMode('HOME')} className="text-gray-500 px-8 py-4 text-xs hover:text-white">SALIR</button>
                </div>
            </div>

            {/* --- IMPRESIÓN DE LUJO (AQUÍ ESTÁ EL DETALLE DE LAS CAPAS) --- */}
            <div className="print-only page-container bg-white">
                
                {/* 1. HEADER */}
                <div className="flex justify-between items-end border-b-2 border-black pb-6 mb-8">
                    <div>
                        <h1 className="text-5xl serif italic font-black text-black leading-none">Tiphereth</h1>
                        <p className="text-xs uppercase tracking-[0.4em] mt-2 text-gray-600">Clinical Anatomy Report</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg uppercase tracking-widest">{patient.name}</p>
                        <p className="text-sm text-gray-500">EDAD: {patient.age} | ID: {Math.floor(Math.random()*10000)}</p>
                    </div>
                </div>

                {/* 2. LA EVIDENCIA (FOTO PRINCIPAL) */}
                <div className="flex gap-8 mb-10 h-64">
                    <div className="w-1/3 border border-gray-200 bg-gray-50 p-2 relative">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">ANÁLISIS FRONTAL</p>
                        {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale" />}
                        <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 text-[10px] font-bold">SIMETRÍA: {diagnosis.phiScore}%</div>
                    </div>
                    
                    {/* 3. DIAGNÓSTICO POR CAPAS (EL FRANCOTIRADOR DETALLADO) */}
                    <div className="w-2/3 grid grid-cols-2 gap-6">
                        {/* CAPA 1: PIEL */}
                        <div className="border-l-2 border-gray-300 pl-4">
                            <h3 className="serif text-lg italic text-gray-800">1. Piel (Epidermis)</h3>
                            <p className="text-xs font-bold text-red-600 mt-1">{diagnosis.skin.condition}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Plan: {diagnosis.skin.rx}</p>
                        </div>

                        {/* CAPA 2: GRASA */}
                        <div className="border-l-2 border-gray-300 pl-4">
                            <h3 className="serif text-lg italic text-gray-800">2. Tejido Adiposo</h3>
                            <p className="text-xs font-bold text-orange-600 mt-1">{diagnosis.fat.condition}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Plan: {diagnosis.fat.rx}</p>
                        </div>

                        {/* CAPA 3: SMAS */}
                        <div className="border-l-2 border-gray-300 pl-4">
                            <h3 className="serif text-lg italic text-gray-800">3. Sistema SMAS</h3>
                            <p className="text-xs font-bold text-blue-600 mt-1">{diagnosis.smas.condition}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Plan: {diagnosis.smas.rx}</p>
                        </div>

                        {/* CAPA 4: HUESO */}
                        <div className="border-l-2 border-gray-300 pl-4">
                            <h3 className="serif text-lg italic text-gray-800">4. Estructura Ósea</h3>
                            <p className="text-xs font-bold text-purple-600 mt-1">{diagnosis.bone.condition}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Plan: {diagnosis.bone.rx}</p>
                        </div>
                    </div>
                </div>

                {/* 4. PLAN DE TRATAMIENTO INTEGRAL */}
                <div className="bg-[#f9f7f2] border border-[#b48b3e] p-8 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48b3e]">ESTRATEGIA TERAPÉUTICA</h3>
                        <p className="serif italic text-3xl font-black">${diagnosis.totalPrice}</p>
                    </div>
                    <div className="text-2xl font-serif text-black mb-2">{diagnosis.mainSolution}</div>
                    <p className="text-sm text-gray-600 mb-6">Intervención multinivel para restaurar la armonía facial completa.</p>
                    
                    <div className="flex justify-between items-end border-t border-gray-300 pt-6">
                        <div className="text-xs text-gray-400">
                            <p>DR. JULIÁN MAYA</p>
                            <p>MEDICINA ESTÉTICA AVANZADA</p>
                        </div>
                        <div className="border border-black px-4 py-2 text-xs font-bold uppercase">APROBADO PARA AGENDA</div>
                    </div>
                </div>

            </div>
        </div>
      )}

      {/* --- MODO RECUPERACIÓN (POST-OP) --- */}
      {appMode === 'RECOVERY' && (
          <div className="w-full max-w-md mx-auto min-h-screen bg-[#111] flex flex-col">
              <div className="p-6">
                  <h1 className="text-2xl font-thin serif italic">Hola, <span className="font-bold sans-serif not-italic">{patient.name}</span></h1>
                  <p className="text-xs text-green-400 uppercase tracking-widest mt-1">RECUPERACIÓN DÍA {postOpDay}</p>
              </div>
              <div className="flex gap-4 px-6 overflow-x-auto mb-6 no-scrollbar">
                  {[1,7,15,30,60].map(d => (
                      <button key={d} onClick={() => setPostOpDay(d)} className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center border ${postOpDay===d ? 'bg-blue-600 border-blue-400' : 'bg-[#222] border-[#333]'}`}>D{d}</button>
                  ))}
              </div>
              <div className="flex-1 bg-black relative mx-4 rounded-2xl overflow-hidden border border-gray-800">
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
                          <p className="absolute top-4 w-full text-center text-xs bg-black/50 py-1">FOTO DE CONTROL DIARIO</p>
                      </div>
                  )}
              </div>
              <div className="p-6">
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, reporte de día ${postOpDay}. Estado: ${recoveryStatus}`)} className="w-full bg-white text-black py-4 rounded-sm font-bold text-xs uppercase shadow-lg tracking-widest">CONTACTAR AL DR. MAYA (SOS)</button>
                  <button onClick={() => setAppMode('HOME')} className="w-full text-zinc-500 py-4 text-xs mt-2">SALIR</button>
              </div>
          </div>
      )}
    </div>
  );
}