"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE PRECIOS Y CONTACTO ---
const WS_NUMBER = "573117936211";
const PRICES = {
  skin_protocol: 800,
  structural_lift: 3500,
  total_harmonization: 4500
};

export default function TipherethUltimate() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS GLOBALES ---
  const [appMode, setAppMode] = useState('HOME'); // HOME | CONSULT | RECOVERY
  const [patient, setPatient] = useState({ name: '', age: '' });

  // --- ESTADOS DE CONSULTA ---
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  // Corrección de tipos para fotos
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null }>({ front: null, right: null });
  
  // --- DATA DEL CEREBRO (DIAGNÓSTICO) ---
  const [diagnosis, setDiagnosis] = useState({
    phiScore: 0,
    skinAge: 0,
    mainPain: "",
    solution: "",
    price: 0,
    details: { spots: 0, uv: 0 }
  });

  const [isDreamMode, setIsDreamMode] = useState(false); // Neuro-Switch

  // --- ESTADOS DE RECUPERACIÓN (POST-OP) ---
  const [postOpDay, setPostOpDay] = useState(7);
  const [recoveryStatus, setRecoveryStatus] = useState('GREEN'); // GREEN | YELLOW | RED

  // ---------------------------------------------------------
  // MÓDULO 1: NAVEGACIÓN
  // ---------------------------------------------------------
  const startConsult = () => { if(patient.name) setAppMode('CONSULT'); };
  const startRecovery = () => { if(patient.name) setAppMode('RECOVERY'); };

  // ---------------------------------------------------------
  // MÓDULO 2: CÁMARA
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
            // Espejo solo en frontal o recuperación
            if (captureStep === 'FRONT' || appMode === 'RECOVERY') { ctx.translate(cvs.width, 0); ctx.scale(-1, 1); }
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);

            if (appMode === 'CONSULT') {
                if (captureStep === 'FRONT') {
                    setPhotos(prev => ({ ...prev, front: imgData }));
                    setCaptureStep('PROFILE');
                } else {
                    setPhotos(prev => ({ ...prev, right: imgData }));
                    setConsultPhase('ANALYZING'); 
                    runSmartAnalysis();
                }
            } else {
                // Modo Recovery
                setPhotos(prev => ({ ...prev, front: imgData }));
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN');
            }
        }
    }
  };

  // ---------------------------------------------------------
  // MÓDULO 3: INTELIGENCIA SILENCIOSA (PIEL + HUESO)
  // ---------------------------------------------------------
  const runSmartAnalysis = () => {
      const realAge = parseInt(patient.age);
      // Simulación de datos biológicos
      const spots = Math.floor(Math.random() * 50 + 10);
      const uvDamage = Math.floor(Math.random() * 60 + 20);
      const bioAge = realAge + (uvDamage > 40 ? 6 : 2); // Edad Piel
      const phi = Math.floor(Math.random() * (75 - 60) + 60); // Simetría

      let painText = "";
      let solText = "";
      let finalPrice = 0;

      // Lógica de Neuroventas
      if (bioAge > realAge + 4) {
          painText = "Fotoenvejecimiento Acelerado + Pérdida de Soporte.";
          solText = "REJUVENECIMIENTO TOTAL (Láser + Volux)";
          finalPrice = PRICES.total_harmonization;
      } else {
          painText = "Déficit de Proyección Anterior (Mentón).";
          solText = "PERFILAMIENTO ÁUREO";
          finalPrice = PRICES.structural_lift;
      }

      setTimeout(() => {
          setDiagnosis({
              phiScore: phi,
              skinAge: bioAge,
              mainPain: painText,
              solution: solText,
              price: finalPrice,
              details: { spots, uv: uvDamage }
          });
          setConsultPhase('REVEAL'); 
      }, 3000);
  };

  // ---------------------------------------------------------
  // RENDERIZADO
  // ---------------------------------------------------------
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
            .gold-accent { color: #b48b3e !important; border-color: #b48b3e !important; }
            .bg-gold { background-color: #f9f7f2 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PANTALLA 1: LOGIN (EL HUB) --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <h1 className="text-7xl serif italic mb-2 tracking-widest text-white">Tiphereth</h1>
            <p className="text-xs text-zinc-500 tracking-[0.5em] mb-12 uppercase">Ultimate OS V144</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={startConsult} className="bg-white text-black py-6 rounded-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition-all text-[10px]">
                        NUEVA CONSULTA<br/><span className="serif italic text-xs capitalize">Diagnóstico & Venta</span>
                    </button>
                    <button onClick={startRecovery} className="bg-[#111] border border-gray-700 text-gray-400 py-6 rounded-sm font-bold tracking-widest uppercase hover:bg-[#222] transition-all text-[10px]">
                        PACIENTE VIP<br/><span className="serif italic text-xs capitalize">Seguimiento Post-Op</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODO CONSULTA --- */}
      {appMode === 'CONSULT' && (
          <>
            {/* CAPTURA */}
            {consultPhase === 'CAPTURE' && (
                <div className="relative w-full h-screen bg-black no-print overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute top-24 w-full text-center">
                        <p className="text-white text-xl serif italic">{captureStep === 'FRONT' ? "Análisis Frontal" : "Análisis de Perfil"}</p>
                    </div>
                    <button onClick={takeShot} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 border border-white rounded-full flex items-center justify-center hover:bg-white/10">
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                </div>
            )}

            {/* PROCESANDO */}
            {consultPhase === 'ANALYZING' && (
                <div className="h-screen bg-black flex flex-col items-center justify-center text-white serif italic no-print">
                    <p className="animate-pulse text-2xl">Calibrando Proporciones...</p>
                    <p className="text-xs font-sans mt-4 text-gray-500 uppercase tracking-widest">Escaneando Dermis & Estructura</p>
                </div>
            )}

            {/* REVEAL (PANTALLA DIGITAL + BOTÓN IMPRIMIR) */}
            {consultPhase === 'REVEAL' && (
                <div className="w-full min-h-screen bg-[#111]">
                    <div className="no-print p-8 flex flex-col items-center justify-center min-h-screen">
                        <h2 className="text-3xl serif text-amber-500 mb-2">ANÁLISIS COMPLETADO</h2>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Diagnóstico Inteligente Listo</p>
                        
                        {/* PREVISUALIZACIÓN */}
                        <div className="flex gap-4 mb-8">
                            <div className="w-48 h-64 bg-gray-900 border border-gray-800 relative">
                                <p className="absolute top-2 left-2 text-[8px] text-gray-500 uppercase">ACTUAL</p>
                                {photos.front && <img src={photos.front} className="w-full h-full object-cover opacity-80" />}
                            </div>
                            <div className="w-48 h-64 bg-gray-900 border border-amber-900 relative">
                                <p className="absolute top-2 left-2 text-[8px] text-amber-500 uppercase">PROYECCIÓN</p>
                                {photos.front && <img src={photos.front} className="w-full h-full object-cover mix-blend-overlay" style={{filter: 'contrast(1.2) brightness(1.2)'}} />}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => window.print()} className="bg-white text-black px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-200">IMPRIMIR DOSSIER</button>
                            <button onClick={() => setAppMode('HOME')} className="text-gray-500 px-8 py-4 text-xs hover:text-white">FINALIZAR</button>
                        </div>
                    </div>

                    {/* --- EL DOSSIER DE MILLÓN DE DÓLARES (IMPRESIÓN) --- */}
                    <div className="print-only page-container bg-white">
                        {/* 1. HEADER */}
                        <div className="flex justify-between items-end border-b-2 border-black pb-6 mb-8">
                            <div>
                                <h1 className="text-5xl serif italic font-black text-black leading-none">Tiphereth</h1>
                                <p className="text-xs uppercase tracking-[0.4em] mt-2 text-gray-600">Advanced Aesthetic Planning</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg uppercase tracking-widest">{patient.name}</p>
                                <p className="text-sm text-gray-500">ID: {Math.floor(Math.random()*10000)} | {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* 2. EVIDENCIA VISUAL */}
                        <div className="grid grid-cols-2 gap-8 mb-10 h-80">
                            <div className="relative border border-gray-200 bg-gray-50 p-2">
                                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">ESTADO ACTUAL</p>
                                <div className="w-full h-full overflow-hidden grayscale">
                                    {photos.front && <img src={photos.front} className="w-full h-full object-cover" />}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black text-white px-2 py-1 text-xs font-bold">SIMETRÍA: {diagnosis.phiScore}%</div>
                            </div>
                            <div className="relative border-2 border-[#b48b3e] p-2">
                                <p className="text-xs font-bold uppercase tracking-widest mb-2 gold-accent">PROYECCIÓN ÁUREA</p>
                                <div className="w-full h-full overflow-hidden relative">
                                    {photos.front && <img src={photos.front} className="w-full h-full object-cover" style={{filter: 'contrast(1.1) brightness(1.1) blur(0.2px)'}} />}
                                    <div className="absolute inset-0 border border-[#b48b3e] opacity-30 rounded-full scale-90"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-[#b48b3e] text-white px-2 py-1 text-xs font-bold">POTENCIAL: 98%</div>
                            </div>
                        </div>

                        {/* 3. DIAGNÓSTICO INTELIGENTE */}
                        <div className="grid grid-cols-2 gap-12 mb-10">
                            <div>
                                <h3 className="serif text-2xl italic border-b border-gray-300 pb-2 mb-4">Análisis Biológico</h3>
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>EDAD REAL: {patient.age}</span>
                                        <span className="text-red-600">EDAD PIEL: {diagnosis.skinAge}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-black" style={{width: `${(parseInt(patient.age)/100)*100}%`}}></div>
                                        <div className="h-full bg-red-500 opacity-50 -mt-2" style={{width: `${(diagnosis.skinAge/100)*100}%`}}></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 italic">Brecha biológica activa por daño solar acumulado.</p>
                                </div>
                                <ul className="text-sm space-y-2 text-gray-700">
                                    <li><strong>• Pigmentación:</strong> {diagnosis.details.spots} lesiones visibles.</li>
                                    <li><strong>• Daño UV:</strong> Nivel {diagnosis.details.uv}/100.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="serif text-2xl italic border-b border-gray-300 pb-2 mb-4">Dictamen Estructural</h3>
                                <p className="text-lg font-bold text-gray-800 mb-2 leading-tight">"{diagnosis.mainPain}"</p>
                                <p className="text-sm text-gray-600 text-justify">El análisis de vectores revela pérdida de soporte estructural. Se requiere intervención para restaurar la proporción áurea facial.</p>
                            </div>
                        </div>

                        {/* 4. PLAN DE TRATAMIENTO */}
                        <div className="bg-[#f9f7f2] border border-[#b48b3e] p-8 mt-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b48b3e]">PLAN SUGERIDO</h3>
                                <p className="serif italic text-3xl font-black">${diagnosis.price}</p>
                            </div>
                            <div className="text-2xl font-serif text-black mb-2">{diagnosis.solution}</div>
                            <p className="text-sm text-gray-600 mb-6">Incluye: Corrección estructural + Protocolo dérmico.</p>
                            <div className="flex justify-between items-end border-t border-gray-300 pt-6">
                                <div className="text-xs text-gray-400"><p>DR. JULIÁN MAYA</p><p>MEDICINA ESTÉTICA AVANZADA</p></div>
                                <div className="border border-black px-4 py-2 text-xs font-bold uppercase">APROBADO PARA AGENDA</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </>
      )}

      {/* --- MODO RECUPERACIÓN (EL GUARDIÁN) --- */}
      {appMode === 'RECOVERY' && (
          <div className="w-full max-w-md mx-auto min-h-screen bg-[#111] flex flex-col">
              <div className="p-6 bg-gradient-to-b from-blue-900/20 to-transparent">
                  <h1 className="text-2xl font-thin serif italic">Hola, <span className="font-bold sans-serif not-italic">{patient.name}</span></h1>
                  <p className="text-xs text-green-400 uppercase tracking-widest mt-1">DÍA {postOpDay} DE RECUPERACIÓN</p>
              </div>

              {/* LÍNEA DE TIEMPO */}
              <div className="flex gap-4 px-6 overflow-x-auto mb-6 no-scrollbar">
                  {[1,7,15,30,60].map(d => (
                      <button key={d} onClick={() => setPostOpDay(d)} className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center border ${postOpDay===d ? 'bg-blue-600 border-blue-400' : 'bg-[#222] border-[#333]'}`}>
                          D{d}
                      </button>
                  ))}
              </div>

              {/* FOTO EVOLUCIÓN */}
              <div className="flex-1 bg-black relative mx-4 rounded-2xl overflow-hidden border border-gray-800">
                  {photos.front ? (
                      <div className="relative w-full h-full">
                          <img src={photos.front} className="w-full h-full object-cover" />
                          <div className={`absolute bottom-0 inset-x-0 p-4 ${recoveryStatus==='GREEN'?'bg-green-900/90':'bg-yellow-900/90'}`}>
                              <p className="font-bold text-white">{recoveryStatus==='GREEN'?'EVOLUCIÓN CORRECTA':'OBSERVAR INFLAMACIÓN'}</p>
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
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, reporte de día ${postOpDay}. Estado: ${recoveryStatus}`)} className="w-full bg-white text-black py-4 rounded-sm font-bold text-xs uppercase shadow-lg tracking-widest">
                      CONTACTAR AL DR. MAYA (SOS)
                  </button>
                  <button onClick={() => setAppMode('HOME')} className="w-full text-zinc-500 py-4 text-xs mt-2">SALIR</button>
              </div>
          </div>
      )}

    </div>
  );
}