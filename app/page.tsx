"use client";
import React, { useRef, useState, useEffect } from 'react';

const WS_NUMBER = "573117936211";

export default function TipherethVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // --- DIAGNÓSTICO DETALLADO ---
  const [report, setReport] = useState({
    skin: { title: "Dermis (Superficie)", finding: "", treatment: "" },
    wrinkles: { title: "Mios (Movimiento)", finding: "", treatment: "" },
    fat: { title: "Volumen (Grasa)", finding: "", treatment: "" },
    bone: { title: "Soporte (Hueso)", finding: "", treatment: "" },
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
                    runVisualAnalysis();
                }
            } else {
                setPhotos(prev => ({ ...prev, front: imgData }));
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN');
            }
        }
    }
  };

  // 3. MOTOR VISUAL (Genera los hallazgos textuales)
  const runVisualAnalysis = () => {
      const age = parseInt(patient.age);
      
      // Lógica simple para generar texto médico persuasivo
      const skinTxt = age > 30 ? "Se observan léntigos solares y discromías en zona malar." : "Poros dilatados y exceso de producción sebácea en zona T.";
      const skinRx = age > 30 ? "Láser CO2 Fraccionado" : "Peeling Químico + Hydrafacial";

      const wrinkleTxt = age > 35 ? "Líneas estáticas visibles en frente y patas de gallo (fractura dérmica)." : "Líneas dinámicas al movimiento (inicio de marcación).";
      const wrinkleRx = "Toxina Botulínica (Botox) + Revitalización";

      const fatTxt = age > 40 ? "Desplazamiento descendente de cojinetes grasos (Jowls)." : "Hipertrofia de bolsas de Bichat (Rostro redondo).";
      const fatRx = age > 40 ? "Enzimas Recombinantes / Hilos" : "Bichectomía / Lipólisis";

      const boneTxt = "Retrusión del mentón y falta de definición mandibular.";
      const boneRx = "Proyección Estructural con Volux";

      setTimeout(() => {
          setReport({
            skin: { title: "1. CALIDAD DE PIEL", finding: skinTxt, treatment: skinRx },
            wrinkles: { title: "2. ARRUGAS & EXPRESIÓN", finding: wrinkleTxt, treatment: wrinkleRx },
            fat: { title: "3. VOLUMEN & CONTORNO", finding: fatTxt, treatment: fatRx },
            bone: { title: "4. SOPORTE ÓSEO", finding: boneTxt, treatment: boneRx },
          });
          setConsultPhase('RESULT');
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-amber-500">
      
      {/* ESTILOS DE IMPRESIÓN LIMPIOS Y ELEGANTES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        body { font-family: 'Lato', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        
        @media print { 
            @page { margin: 0; size: A4; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { background: white; color: #333; -webkit-print-color-adjust: exact; }
            .page { padding: 40px; }
            .section-break { page-break-inside: avoid; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PANTALLA 1: LOGIN --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black no-print">
            <h1 className="text-6xl mb-2 font-serif italic text-amber-500">Tiphereth</h1>
            <p className="text-xs text-gray-500 tracking-[0.4em] mb-12 uppercase">Visual Evidence System V149</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-[#111] border-b border-gray-700 p-4 text-center text-white outline-none focus:border-amber-500 transition-colors" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={startConsult} className="bg-white text-black py-4 font-bold tracking-widest uppercase hover:bg-gray-200 text-[10px]">
                        ANÁLISIS VISUAL<br/><span className="lowercase italic opacity-70">3 Ángulos + Reporte</span>
                    </button>
                    <button onClick={startRecovery} className="bg-[#222] text-gray-400 py-4 font-bold tracking-widest uppercase hover:bg-[#333] text-[10px]">
                        SEGUIMIENTO<br/><span className="lowercase italic opacity-70">Paciente Post-Op</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODO CONSULTA (3 PASOS) --- */}
      {consultPhase === 'CAPTURE' && appMode === 'CONSULT' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-10 left-10 border-l-4 border-amber-500 pl-4">
                <h2 className="text-white text-3xl italic">
                     {captureStep === 'FRONT' ? "Vista Frontal" : captureStep === 'SIDE_R' ? "Perfil Derecho" : "Perfil Izquierdo"}
                </h2>
                <p className="text-gray-400 text-xs mt-1">PROTOCOLO FOTOGRÁFICO</p>
            </div>
            <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- PROCESANDO --- */}
      {consultPhase === 'ANALYZING' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white no-print">
            <h2 className="text-3xl font-serif italic text-amber-500 animate-pulse">Generando Evidencia Visual...</h2>
            <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Mapeando lesiones, arrugas y volúmenes.</p>
        </div>
      )}

      {/* --- RESULTADO (EL DOSSIER VISUAL) --- */}
      {consultPhase === 'RESULT' && (
        <div className="w-full min-h-screen bg-white text-black">
            
            {/* PREVIA DIGITAL */}
            <div className="no-print p-10 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl mb-2 font-serif italic">ANÁLISIS COMPLETADO</h1>
                <p className="text-xs text-gray-500 mb-8 uppercase">El reporte está listo para impresión.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.print()} className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 shadow-xl">IMPRIMIR REPORTE VISUAL</button>
                    <button onClick={() => setAppMode('HOME')} className="text-gray-400 px-8 py-4 text-xs">FINALIZAR</button>
                </div>
            </div>

            {/* --- HOJA DE IMPRESIÓN (EL REPORTE PEDAGÓGICO) --- */}
            <div className="print-only page">
                
                {/* 1. HEADER ELEGANTE */}
                <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
                    <div>
                        <h1 className="text-5xl font-serif italic font-bold">Tiphereth</h1>
                        <p className="text-xs uppercase tracking-[0.3em] mt-2 text-gray-500">Advanced Aesthetic Planning</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg uppercase">{patient.name}</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleDateString()} | EDAD: {patient.age}</p>
                    </div>
                </div>

                {/* 2. INTRODUCCIÓN VISUAL */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase mb-4 border-l-4 border-black pl-3">REGISTRO FOTOGRÁFICO</h2>
                    <div className="flex gap-4 h-48">
                        {photos.front && <img src={photos.front} className="h-full object-cover border border-gray-200" />}
                        {photos.right && <img src={photos.right} className="h-full object-cover border border-gray-200" />}
                        {photos.left && <img src={photos.left} className="h-full object-cover border border-gray-200" />}
                    </div>
                </div>

                {/* 3. DESGLOSE CAPA POR CAPA (CON EVIDENCIA VISUAL) */}
                
                {/* CAPA 1: PIEL (FOTO CON FILTRO DE CONTRASTE SIMULADO) */}
                <div className="section-break flex gap-6">
                    <div className="w-1/3">
                        {photos.front && (
                            <div className="relative h-48 w-full overflow-hidden border border-gray-300">
                                <img src={photos.front} className="w-full h-full object-cover" style={{filter: 'contrast(1.5) grayscale(1)'}} />
                                <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold">FILTRO: MANCHAS/POROS</div>
                                {/* Puntero simulado */}
                                <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute top-1/2 left-1/2 w-20 h-[1px] bg-red-500 rotate-45 origin-left"></div>
                            </div>
                        )}
                    </div>
                    <div className="w-2/3">
                        <h3 className="text-lg font-bold text-amber-600 mb-2">{report.skin.title}</h3>
                        <p className="text-sm font-bold text-gray-800 mb-1">HALLAZGO:</p>
                        <p className="text-sm text-gray-600 mb-4 italic">"{report.skin.finding}"</p>
                        <p className="text-sm font-bold text-gray-800 mb-1">SOLUCIÓN MÉDICA:</p>
                        <p className="text-sm font-bold text-black border-b border-gray-200 inline-block pb-1">{report.skin.treatment}</p>
                    </div>
                </div>

                {/* CAPA 2: ARRUGAS (FOTO B/N) */}
                <div className="section-break flex gap-6">
                    <div className="w-1/3">
                        {photos.front && (
                            <div className="relative h-48 w-full overflow-hidden border border-gray-300">
                                <img src={photos.front} className="w-full h-full object-cover grayscale" />
                                <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold">FILTRO: LÍNEAS DE EXPRESIÓN</div>
                                {/* Puntero en ojos */}
                                <div className="absolute top-[40%] left-[30%] w-6 h-6 border border-red-500 rounded-full"></div>
                                <div className="absolute top-[40%] right-[30%] w-6 h-6 border border-red-500 rounded-full"></div>
                            </div>
                        )}
                    </div>
                    <div className="w-2/3">
                        <h3 className="text-lg font-bold text-amber-600 mb-2">{report.wrinkles.title}</h3>
                        <p className="text-sm font-bold text-gray-800 mb-1">HALLAZGO:</p>
                        <p className="text-sm text-gray-600 mb-4 italic">"{report.wrinkles.finding}"</p>
                        <p className="text-sm font-bold text-gray-800 mb-1">SOLUCIÓN MÉDICA:</p>
                        <p className="text-sm font-bold text-black border-b border-gray-200 inline-block pb-1">{report.wrinkles.treatment}</p>
                    </div>
                </div>

                {/* CAPA 3: PERFIL/HUESO (FOTO LATERAL) */}
                <div className="section-break flex gap-6">
                    <div className="w-1/3">
                        {photos.right ? (
                            <div className="relative h-48 w-full overflow-hidden border border-gray-300">
                                <img src={photos.right} className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold">FILTRO: PERFILOMETRÍA</div>
                                {/* Línea de perfil */}
                                <div className="absolute top-[30%] right-[30%] w-[1px] h-20 bg-red-500"></div>
                            </div>
                        ) : <div className="h-48 bg-gray-100 flex items-center justify-center text-xs">PERFIL NO DISPONIBLE</div>}
                    </div>
                    <div className="w-2/3">
                        <h3 className="text-lg font-bold text-amber-600 mb-2">{report.bone.title}</h3>
                        <p className="text-sm font-bold text-gray-800 mb-1">HALLAZGO:</p>
                        <p className="text-sm text-gray-600 mb-4 italic">"{report.bone.finding}"</p>
                        <p className="text-sm font-bold text-gray-800 mb-1">SOLUCIÓN MÉDICA:</p>
                        <p className="text-sm font-bold text-black border-b border-gray-200 inline-block pb-1">{report.bone.treatment}</p>
                    </div>
                </div>

                {/* 4. CIERRE DE VENTA (EL LIBRO) */}
                <div className="mt-8 bg-black text-white p-8 text-center">
                    <h3 className="text-2xl font-serif italic mb-2">Comienza Tu Transformación</h3>
                    <p className="text-sm text-gray-300 mb-4">El presupuesto detallado se entrega en consulta personalizada.</p>
                    <div className="border border-white/30 p-4 inline-block">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1">RECOMENDACIÓN INICIAL</p>
                        <p className="text-lg font-bold">ADQUIRIR EL LIBRO: "LA CIENCIA DE LA BELLEZA"</p>
                        <p className="text-[10px] text-gray-400 mt-1">Disponible en recepción.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-[10px] text-gray-500 uppercase">
                        <span>DR. JULIÁN MAYA</span>
                        <span>MEDICINA ESTÉTICA AVANZADA</span>
                    </div>
                </div>

            </div>
        </div>
      )}

      {/* --- MODO RECUPERACIÓN (MANTENIDO IGUAL) --- */}
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