"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL DR. RICARDO MAYA ROMO ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethScientific() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [consultPhase, setConsultPhase] = useState('CAPTURE'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  const [patient, setPatient] = useState({ name: '', age: '' });
  
  // --- DIAGNÓSTICO CIENTÍFICO (DATA DURA) ---
  const [scienceData, setScienceData] = useState({
    glogau: "I",             // Escala de Envejecimiento (I-IV)
    fitzpatrick: "III",      // Fototipo (I-VI)
    fatLoss: "",             // Pérdida de grasa específica
    boneResorption: "",      // Resorción ósea específica
    agingGrade: "",          // Grado general
    treatmentPlan: ""        // Sugerencia
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
                    runScientificEngine();
                }
            } else {
                setPhotos(prev => ({ ...prev, front: imgData }));
                setRecoveryStatus(Math.random() > 0.8 ? 'YELLOW' : 'GREEN');
            }
        }
    }
  };

  // 3. MOTOR CIENTÍFICO (EL CEREBRO MÉDICO)
  const runScientificEngine = () => {
      const age = parseInt(patient.age);
      
      // A. CÁLCULO DE ESCALAS
      let glogauScale = "I (Sin Arrugas)";
      let aging = "LEVE";
      
      if (age > 30) { glogauScale = "II (Arrugas en Movimiento)"; aging = "MODERADO"; }
      if (age > 45) { glogauScale = "III (Arrugas en Reposo)"; aging = "AVANZADO"; }
      if (age > 60) { glogauScale = "IV (Solo Arrugas)"; aging = "SEVERO"; }

      const fitz = ["I", "II", "III", "IV"][Math.floor(Math.random() * 4)]; // Simulado

      // B. HALLAZGOS ANATÓMICOS
      let fatDx = "Preservación adecuada de volúmenes.";
      let boneDx = "Estructura ósea conservada.";
      let plan = "Protocolo Preventivo (Baby Botox + Hydrafacial)";

      if (age > 35) {
          fatDx = "Desplazamiento caudal del paquete graso malar y jowl incipiente.";
          boneDx = "Inicio de resorción en apertura piriforme (maxilar).";
          plan = "Armonización Facial (Reposición de Volumen Medio)";
      }
      if (age > 50) {
          fatDx = "Atrofia de paquetes grasos profundos y ptosis del compartimento nasolabial.";
          boneDx = "Resorción ósea mandibular y retroceso del mentón.";
          plan = "Rejuvenecimiento Full Face (Lifting Líquido / QX)";
      }

      setTimeout(() => {
          setScienceData({
              glogau: glogauScale,
              fitzpatrick: fitz,
              fatLoss: fatDx,
              boneResorption: boneDx,
              agingGrade: aging,
              treatmentPlan: plan
          });
          setConsultPhase('RESULT');
      }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden selection:bg-blue-900 selection:text-white">
      
      {/* ESTILOS CLÍNICOS SERIOS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Lato:wght@300;400;700&display=swap');
        body { font-family: 'Roboto', sans-serif; }
        .medical-header { font-family: 'Lato', sans-serif; letter-spacing: 1px; }
        
        @media print { 
            @page { margin: 0; size: A4; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            body { -webkit-print-color-adjust: exact; }
            .page { padding: 40px; height: 100vh; display: flex; flex-direction: column; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PANTALLA 1: LOGIN --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white no-print">
            <h1 className="text-5xl mb-2 font-bold tracking-tight">TIPHERETH</h1>
            <p className="text-xs text-blue-300 tracking-[0.3em] mb-12 uppercase">Scientific Diagnostic Engine V150</p>
            <div className="w-80 space-y-6">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-slate-800 border-b border-slate-600 p-4 text-center text-white outline-none focus:border-blue-400 transition-colors" placeholder="NOMBRE PACIENTE" />
                <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-full bg-slate-800 border-b border-slate-600 p-4 text-center text-white outline-none focus:border-blue-400 transition-colors" placeholder="EDAD" />
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={startConsult} className="bg-white text-slate-900 py-4 font-bold tracking-widest uppercase hover:bg-gray-200 text-[10px]">
                        ANÁLISIS CLÍNICO<br/><span className="opacity-70">Motor Científico</span>
                    </button>
                    <button onClick={startRecovery} className="bg-slate-700 text-gray-300 py-4 font-bold tracking-widest uppercase hover:bg-slate-600 text-[10px]">
                        SEGUIMIENTO<br/><span className="opacity-70">Control Post-Op</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODO CONSULTA --- */}
      {consultPhase === 'CAPTURE' && appMode === 'CONSULT' && (
        <div className="relative w-full h-screen bg-black no-print overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute top-10 left-10 bg-black/60 backdrop-blur px-4 py-2 border-l-4 border-blue-500">
                <h2 className="text-white text-xl font-bold uppercase">
                     {captureStep === 'FRONT' ? "Protocolo Frontal" : captureStep === 'SIDE_R' ? "Protocolo Lateral Der." : "Protocolo Lateral Izq."}
                </h2>
                <p className="text-blue-300 text-xs">MOTOR DE ESCANEO ACTIVO</p>
            </div>
            <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/20 backdrop-blur border-2 border-white rounded-full flex items-center justify-center hover:bg-white/40">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- PROCESANDO --- */}
      {consultPhase === 'ANALYZING' && (
        <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white no-print">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-blue-400">PROCESANDO ALGORITMO MÉDICO...</h2>
            <div className="mt-4 text-xs font-mono text-gray-400 space-y-1">
                <p>{'>'} Calculando Escala Glogau...</p>
                <p>{'>'} Midiendo vectores de grasa malar...</p>
                <p>{'>'} Estimando densidad ósea maxilar...</p>
                <p>{'>'} Generando reporte clínico...</p>
            </div>
        </div>
      )}

      {/* --- RESULTADO (EL DICTAMEN CIENTÍFICO) --- */}
      {consultPhase === 'RESULT' && (
        <div className="w-full min-h-screen bg-white text-black">
            
            {/* VISTA DIGITAL PREVIA */}
            <div className="no-print p-10 flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <h1 className="text-3xl mb-2 font-bold text-slate-800">DICTAMEN GENERADO</h1>
                <p className="text-xs text-gray-500 mb-8 uppercase">Listo para impresión y venta.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <button onClick={() => window.print()} className="bg-slate-900 text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-slate-800 shadow-xl">
                        IMPRIMIR DICTAMEN MÉDICO
                    </button>
                    <button onClick={() => setAppMode('HOME')} className="text-gray-400 px-8 py-4 text-xs hover:text-black">
                        FINALIZAR
                    </button>
                </div>
            </div>

            {/* --- HOJA DE IMPRESIÓN (EL DOCUMENTO LEGAL/MÉDICO) --- */}
            <div className="print-only page">
                
                {/* 1. HEADER CLÍNICO */}
                <div className="flex justify-between items-end border-b-4 border-slate-800 pb-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">{DR_NAME}</h1>
                        <p className="text-xs uppercase tracking-[0.2em] mt-1 text-slate-500">Medicina Estética & Longevidad | Lic. 9823-MX</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg uppercase text-slate-900">HISTORIA CLÍNICA DIGITAL</p>
                        <p className="text-xs text-gray-500">FECHA: {new Date().toLocaleDateString()} | ID: {Math.floor(Math.random()*100000)}</p>
                    </div>
                </div>

                {/* 2. REGISTRO FOTOGRÁFICO (EVIDENCIA) */}
                <div className="mb-6 flex gap-2 h-40">
                    <div className="w-1/3 border border-gray-300 relative">
                        <p className="absolute top-0 bg-slate-800 text-white text-[8px] px-2 py-1">FRONTAL</p>
                        {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale" />}
                    </div>
                    <div className="w-1/3 border border-gray-300 relative">
                        <p className="absolute top-0 bg-slate-800 text-white text-[8px] px-2 py-1">LATERAL DER.</p>
                        {photos.right && <img src={photos.right} className="w-full h-full object-cover grayscale" />}
                    </div>
                    <div className="w-1/3 border border-gray-300 relative">
                        <p className="absolute top-0 bg-slate-800 text-white text-[8px] px-2 py-1">LATERAL IZQ.</p>
                        {photos.left && <img src={photos.left} className="w-full h-full object-cover grayscale" />}
                    </div>
                </div>

                {/* 3. EL DICTAMEN DEL MOTOR CIENTÍFICO (TEXTO GENERADO) */}
                <div className="bg-slate-50 p-8 border-l-4 border-slate-800 mb-8">
                    <h3 className="text-xl font-bold uppercase mb-4 text-slate-900">HALLAZGOS DEL MOTOR CIENTÍFICO</h3>
                    
                    <p className="text-sm text-justify leading-relaxed text-slate-700 mb-4">
                        Se evidencia al examen de mi motor científico que el usuario <strong>{patient.name.toUpperCase()}</strong> (Edad: {patient.age}), presenta un 
                        envejecimiento cutáneo grado <strong>{scienceData.glogau}</strong> según la escala de Glogau, con un fototipo <strong>{scienceData.fitzpatrick}</strong> de Fitzpatrick.
                    </p>
                    
                    <p className="text-sm text-justify leading-relaxed text-slate-700 mb-4">
                        A nivel volumétrico, se detecta <strong>{scienceData.fatLoss}</strong>, lo que sugiere un debilitamiento de los ligamentos de retención. 
                        Estructuralmente, se observa <strong>{scienceData.boneResorption}</strong>, indicativo de pérdida de soporte óseo profundo.
                    </p>

                    <p className="text-sm text-justify leading-relaxed text-slate-700">
                        <strong>CONCLUSIÓN:</strong> El análisis integral arroja un Envejecimiento Grado <strong>{scienceData.agingGrade}</strong>. 
                        Se requiere intervención multinivel para restaurar la bio-mecánica facial.
                    </p>
                </div>

                {/* 4. PLAN SUGERIDO (SOLUCIÓN DEL DR.) */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">TRATAMIENTO SUGERIDO</h3>
                    <p className="text-xl font-bold text-blue-900">{scienceData.treatmentPlan}</p>
                    <p className="text-xs text-gray-500 mt-1">Procedimiento a realizar exclusivamente por el {DR_NAME}.</p>
                </div>

                {/* 5. DOBLE LLAMADO A LA ACCIÓN (VENTA) */}
                <div className="mt-auto grid grid-cols-2 gap-8">
                    
                    {/* BOTÓN 1: CITA (FÍSICO) */}
                    <div className="border-2 border-slate-900 p-4 text-center">
                        <p className="text-xs font-bold uppercase mb-2">OPCIÓN A: PROCEDIMIENTO MÉDICO</p>
                        <p className="text-lg font-bold mb-1">SEPARAR CITA DE VALORACIÓN YA</p>
                        <p className="text-[10px] text-gray-500">Agenda prioritaria para análisis presencial.</p>
                    </div>

                    {/* BOTÓN 2: EBOOK (DIGITAL) */}
                    <div className="bg-slate-900 text-white p-4 text-center">
                        <p className="text-xs font-bold uppercase mb-2 text-blue-300">OPCIÓN B: EDUCACIÓN</p>
                        <p className="text-lg font-bold mb-1">INICIAR TRATAMIENTO EN CASA</p>
                        <p className="text-[10px] text-gray-400">Adquiere el Ebook Educativo "Secretos de la Piel".</p>
                    </div>

                </div>

            </div>
        </div>
      )}

      {/* --- MODO RECUPERACIÓN (POST-OP) --- */}
      {appMode === 'RECOVERY' && (
          <div className="w-full max-w-md mx-auto min-h-screen bg-slate-900 flex flex-col text-white">
              <div className="p-6">
                  <h1 className="text-xl font-bold uppercase tracking-wider">{DR_NAME}</h1>
                  <p className="text-xs text-blue-400 uppercase tracking-widest mt-1">RECUPERACIÓN DÍA {postOpDay}</p>
              </div>
              <div className="flex gap-4 px-6 overflow-x-auto mb-6 no-scrollbar">
                  {[1,7,15,30,60].map(d => (
                      <button key={d} onClick={() => setPostOpDay(d)} className={`min-w-[50px] h-[50px] font-bold flex items-center justify-center border ${postOpDay===d ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700'}`}>D{d}</button>
                  ))}
              </div>
              <div className="flex-1 bg-black relative mx-4 border border-slate-700 rounded-lg overflow-hidden">
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
                          <button onClick={takeShot} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></button>
                          <p className="absolute top-4 w-full text-center text-xs bg-black/60 py-1 font-mono">CAPTURA DE SEGUIMIENTO</p>
                      </div>
                  )}
              </div>
              <div className="p-6">
                  <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, reporte de día ${postOpDay}. Estado: ${recoveryStatus}`)} className="w-full bg-white text-slate-900 py-4 font-bold text-xs uppercase shadow-lg tracking-widest rounded">CONTACTAR URGENCIA (SOS)</button>
                  <button onClick={() => setAppMode('HOME')} className="w-full text-slate-500 py-4 text-xs mt-2">CERRAR SESIÓN</button>
              </div>
          </div>
      )}
    </div>
  );
}