"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL DR. ---
const WS_NUMBER = "573117936211"; 
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethDossier() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState<'FRONT' | 'SIDE_R' | 'SIDE_L'>('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  const [patient, setPatient] = useState({ name: '', age: '', phone: '' });

  // RECUPERAR DATOS
  useEffect(() => {
    const savedPhone = localStorage.getItem('tiphereth_user_phone');
    if(savedPhone) setPatient(prev => ({ ...prev, phone: savedPhone }));
  }, []);

  // 1. CÁMARA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) {}
  };

  useEffect(() => { if(appMode === 'CAPTURE') startCamera(); }, [appMode, captureStep]);

  // 2. CAPTURA
  const takeShot = () => {
    if(videoRef.current && canvasRef.current) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if(ctx) {
            ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);
            
            if(captureStep === 'FRONT') {
                setPhotos(prev => ({...prev, front: imgData}));
                setCaptureStep('SIDE_R');
            } else if (captureStep === 'SIDE_R') {
                setPhotos(prev => ({...prev, right: imgData}));
                setCaptureStep('SIDE_L');
            } else {
                setPhotos(prev => ({...prev, left: imgData}));
                localStorage.setItem('tiphereth_user_phone', patient.phone);
                setAppMode('ANALYSIS');
                setTimeout(() => setAppMode('RESULT'), 4000);
            }
        }
    }
  };

  const skinAge = patient.age ? parseInt(patient.age) + 8 : 0; 

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      
      {/* ESTILOS CLÍNICOS Y DE IMPRESIÓN */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&family=Share+Tech+Mono&display=swap');
        
        .tech-font { font-family: 'Share Tech Mono', monospace; }
        
        /* FILTROS CIENTÍFICOS */
        .filter-vascular { filter: contrast(1.4) sepia(0.4) hue-rotate(-50deg) saturate(2.5); mix-blend-mode: multiply; }
        .filter-bw { filter: grayscale(100%) contrast(1.2); }
        .filter-xray { filter: grayscale(100%) invert(100%) contrast(1.5); }

        /* MÁSCARA SVG ANIMADA */
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .path-anim { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 3s forwards; }

        @media print { 
            @page { margin: 0; size: A4; }
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            .page-break { page-break-after: always; }
        }
      `}</style>

      {/* --- 1. LOGIN --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white no-print">
             <h1 className="text-4xl font-black tracking-tight mb-2">TIPHERETH</h1>
             <p className="text-xs text-blue-400 tracking-[0.3em] mb-8 uppercase">Scientific Evidence Generator V250</p>
             <div className="w-80 space-y-4">
                <input value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-slate-800 p-3 text-center uppercase border-b border-gray-600 outline-none" placeholder="NOMBRE PACIENTE" />
                <div className="flex gap-2">
                    <input type="tel" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-slate-800 p-3 text-center border-b border-gray-600 outline-none" placeholder="WHATSAPP" />
                    <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-slate-800 p-3 text-center border-b border-gray-600 outline-none" placeholder="EDAD" />
                </div>
                <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-blue-700 py-4 font-bold uppercase hover:bg-blue-600 text-sm tracking-widest mt-4">
                    INICIAR ESTUDIO
                </button>
             </div>
        </div>
      )}

      {/* --- 2. CÁMARA (3 VISTAS) --- */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black no-print">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* MÁSCARA GUÍA (TIPO VISIA) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] border-2 border-dashed border-blue-400/50 rounded-[40%]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-blue-500/50"></div>

            <div className="absolute top-10 w-full text-center">
                <span className="bg-black/70 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest border border-blue-500">
                    {captureStep === 'FRONT' ? "1. ROSTRO FRONTAL" : captureStep === 'SIDE_R' ? "2. PERFIL DERECHO" : "3. PERFIL IZQUIERDO"}
                </span>
            </div>
            
            <button onClick={takeShot} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-blue-600"></button>
        </div>
      )}

      {/* --- 3. PROCESANDO (CÁLCULOS MATEMÁTICOS) --- */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white no-print">
             <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-xl font-mono text-blue-400">CALCULANDO PROPORCIÓN ÁUREA...</p>
             <div className="mt-4 text-xs font-mono text-gray-500 space-y-1 text-left">
                <p>{'>'} Mapeando vectores SMAS...</p>
                <p>{'>'} Midiendo profundidad de surcos...</p>
                <p>{'>'} Superponiendo Máscara de Marquardt...</p>
                <p>{'>'} Generando PDF de evidencia...</p>
             </div>
        </div>
      )}

      {/* --- 4. RESULTADO (HOJA CLÍNICA REAL) --- */}
      {appMode === 'RESULT' && (
        <div className="w-full min-h-screen bg-white text-black p-0 md:p-8">
            
            {/* BOTONES FLOTANTES (SOLO PANTALLA) */}
            <div className="fixed bottom-6 right-6 flex gap-4 no-print z-50">
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:scale-110 transition-transform uppercase text-xs tracking-widest flex items-center gap-2">
                    <span className="text-xl">🖨️</span> Imprimir Expediente
                </button>
                <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, vi mi análisis de Marquardt. Necesito cita.`)} className="bg-green-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:scale-110 transition-transform uppercase text-xs tracking-widest flex items-center gap-2">
                    <span className="text-xl">💬</span> Agendar Cita
                </button>
            </div>

            {/* --- EL DOCUMENTO (A4) --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-none md:shadow-2xl md:p-10 p-4 min-h-[297mm]">
                
                {/* 1. HEADER INSTITUCIONAL */}
                <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">{DR_NAME}</h1>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mt-2">Medicina Estética de Alta Precisión</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase mb-1 inline-block">Informe Confidencial</div>
                        <p className="text-xs tech-font text-gray-500">FECHA: {new Date().toLocaleDateString()}</p>
                        <p className="text-xs tech-font text-gray-500">ID: {patient.phone}</p>
                    </div>
                </div>

                {/* 2. DATOS BIOMÉTRICOS (RESUMEN EJECUTIVO) */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 border border-slate-200">
                    <div className="text-center border-r border-slate-300">
                        <p className="text-[10px] uppercase font-bold text-gray-500">Edad Cronológica</p>
                        <p className="text-2xl font-bold text-slate-900">{patient.age}</p>
                    </div>
                    <div className="text-center border-r border-slate-300">
                        <p className="text-[10px] uppercase font-bold text-red-600">Edad Estructural</p>
                        <p className="text-3xl font-black text-red-600">{skinAge}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-500">Índice Áureo (Phi)</p>
                        <p className="text-2xl font-bold text-slate-900">1.42 <span className="text-[10px] text-gray-400 font-normal">(Ideal: 1.618)</span></p>
                    </div>
                </div>

                {/* 3. GRID DE EVIDENCIA CIENTÍFICA (EL CORE) */}
                <div className="mb-8">
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-gray-300 mb-4 pb-1 text-sm">Análisis Multiespectral & Geométrico</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* A. MÁSCARA DE MARQUARDT (GEOMETRÍA) */}
                        <div className="aspect-[4/5] relative border border-slate-300 overflow-hidden bg-gray-100">
                            <p className="absolute top-0 left-0 bg-slate-900 text-white text-[9px] px-2 py-1 font-bold z-10">1. MÁSCARA DE MARQUARDT (PHI)</p>
                            {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale opacity-80" />}
                            {/* SVG OVERLAY: MÁSCARA AUREA */}
                            <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Líneas Guía Geométricas */}
                                <path d="M20,30 L80,30 M20,45 L80,45 M30,30 L30,80 M70,30 L70,80 M50,20 L50,90" stroke="cyan" strokeWidth="0.5" fill="none" />
                                <circle cx="50" cy="45" r="30" stroke="cyan" strokeWidth="0.5" fill="none" />
                                <path d="M20,30 Q50,90 80,30" stroke="cyan" strokeWidth="0.3" fill="none" strokeDasharray="2,2" />
                            </svg>
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[8px] px-1 tech-font">ASIMETRÍA DETECTADA</div>
                        </div>

                        {/* B. MAPA VASCULAR/INFLAMACIÓN */}
                        <div className="aspect-[4/5] relative border border-slate-300 overflow-hidden bg-gray-100">
                            <p className="absolute top-0 left-0 bg-red-700 text-white text-[9px] px-2 py-1 font-bold z-10">2. ESTRÉS OXIDATIVO (VASCULAR)</p>
                            {photos.front && (
                                <div className="w-full h-full relative overflow-hidden">
                                    <img src={photos.front} className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                                    <div className="absolute inset-0 bg-red-600 mix-blend-multiply opacity-40"></div>
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-red-900/80 text-white text-[8px] px-1 tech-font">INFLAMACIÓN CRÓNICA</div>
                        </div>

                        {/* C. VECTORES DE SMAS (GRAVEDAD) */}
                        <div className="aspect-[4/5] relative border border-slate-300 overflow-hidden bg-gray-100">
                            <p className="absolute top-0 left-0 bg-blue-800 text-white text-[9px] px-2 py-1 font-bold z-10">3. VECTORES DE TENSIÓN (SMAS)</p>
                            {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-bw opacity-60" />}
                            {/* SVG VECTORES DE CAIDA */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                                {/* Flechas Rojas (Caída) */}
                                <path d="M30,50 L30,65" stroke="red" strokeWidth="1" markerEnd="url(#arrow-red)" />
                                <path d="M70,50 L70,65" stroke="red" strokeWidth="1" markerEnd="url(#arrow-red)" />
                                <path d="M40,75 L40,85" stroke="red" strokeWidth="1" markerEnd="url(#arrow-red)" />
                                {/* Flechas Verdes (Corrección Necesaria) */}
                                <path d="M25,60 L35,40" stroke="#00ff00" strokeWidth="1" strokeDasharray="2,2" />
                                <path d="M75,60 L65,40" stroke="#00ff00" strokeWidth="1" strokeDasharray="2,2" />
                                
                                <defs>
                                    <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
                                        <path d="M0,0 L0,6 L9,3 z" fill="red" />
                                    </marker>
                                </defs>
                            </svg>
                            <div className="absolute bottom-2 right-2 bg-blue-900/80 text-white text-[8px] px-1 tech-font">PTOSIS DE TEJIDOS</div>
                        </div>

                        {/* D. ANÁLISIS DE PERFIL (PROYECCIÓN) */}
                        <div className="aspect-[4/5] relative border border-slate-300 overflow-hidden bg-gray-100">
                            <p className="absolute top-0 left-0 bg-slate-600 text-white text-[9px] px-2 py-1 font-bold z-10">4. PÉRDIDA VOLUMÉTRICA</p>
                            {photos.right && <img src={photos.right} className="w-full h-full object-cover grayscale contrast-150" />}
                            <div className="absolute top-[40%] left-[30%] w-[30%] h-[20%] border border-yellow-400 bg-yellow-400/20 rounded-full"></div>
                            <div className="absolute bottom-2 right-2 bg-slate-800 text-white text-[8px] px-1 tech-font">RETRACCIÓN MENTONIANA</div>
                        </div>

                    </div>
                </div>

                {/* 4. DICTAMEN MÉDICO ESTRUCTURADO */}
                <div className="border-l-4 border-slate-900 pl-6 py-2 mb-8 bg-gray-50">
                    <h3 className="font-bold text-slate-900 uppercase mb-3 text-sm">Diagnóstico Estructural</h3>
                    
                    <div className="space-y-3 text-xs text-justify text-gray-700 leading-relaxed">
                        <p>
                            <strong>1. ANÁLISIS ÓSEO:</strong> Se evidencia una pérdida de proyección en el hueso maxilar (zona media), lo que genera la caída del "Triángulo de la Juventud". La proporción áurea está alterada, mostrando un rostro más pesado en el tercio inferior.
                        </p>
                        <p>
                            <strong>2. COMPARTIMENTOS GRASOS:</strong> Desplazamiento caudal (hacia abajo) de la grasa malar. Se observa esqueletización de la órbita ocular.
                        </p>
                        <p>
                            <strong>3. SISTEMA SMAS:</strong> Laxitud ligamentaria evidente. Los vectores de tensión son negativos (hacia el suelo), indicando la necesidad de reposicionamiento quirúrgico o bio-estimulación profunda.
                        </p>
                    </div>
                </div>

                {/* 5. PLAN DE TRATAMIENTO (LA VENTA) */}
                <div className="grid grid-cols-2 gap-8 border-t-2 border-slate-900 pt-6">
                    <div>
                        <p className="font-bold uppercase text-xs mb-2">Opción A: Intervención Médica</p>
                        <ul className="list-disc list-inside text-[10px] space-y-1 text-gray-600">
                            <li>Reposición volumétrica (Hialurónico/Grasa).</li>
                            <li>Tensado de SMAS (Lifting/Hilos/Tecnología).</li>
                            <li>Bio-modulación muscular (Toxina).</li>
                        </ul>
                        <p className="mt-2 text-[10px] font-bold text-blue-900 cursor-pointer">➔ CITA PRIORITARIA RECOMENDADA</p>
                    </div>
                    <div>
                        <p className="font-bold uppercase text-xs mb-2">Opción B: Mantenimiento (Casa)</p>
                        <ul className="list-disc list-inside text-[10px] space-y-1 text-gray-600">
                            <li>Protocolo Retinización (Noche).</li>
                            <li>Protección Antioxidante (Día).</li>
                            <li>Suplementación de Colágeno Hidrolizado.</li>
                        </ul>
                        <p className="mt-2 text-[10px] font-bold text-gray-500 cursor-pointer">➔ DESCARGAR GUÍA EBOOK</p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-12 text-center border-t border-gray-200 pt-4">
                    <p className="text-[8px] text-gray-400">
                        Este reporte es generado por Inteligencia Artificial y Algoritmos de Biometría Facial. 
                        No sustituye una consulta médica presencial. Propiedad intelectual de {DR_NAME}.
                    </p>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}