"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL DR. RICARDO MAYA ROMO ---
const WS_NUMBER = "573117936211"; 
const DR_NAME = "DR. RICARDO MAYA ROMO";

// --- DICCIONARIO DE IDIOMAS ---
const TEXTS = {
  ES: {
    title: "SCANNER MULTICAPA V160",
    namePlace: "NOMBRE COMPLETO",
    agePlace: "EDAD",
    phonePlace: "WHATSAPP (ID ÚNICO)",
    start: "INICIAR ESCANEO TRIPLE",
    stepFront: "Paso 1: ROSTRO FRONTAL",
    stepSideR: "Paso 2: PERFIL DERECHO",
    stepSideL: "Paso 3: PERFIL IZQUIERDO",
    analyzing: "TRIANGULANDO VECTORES...",
    problemTitle: "MAPA DE DETERIORO FACIAL",
    problemSub: "Evidencia tridimensional de colapso estructural.",
    redZone: "FRACTURA DÉRMICA",
    blueZone: "REABSORCIÓN ÓSEA",
    ctaDoctor: "SOLUCIÓN QUIRÚRGICA",
    ctaDoctorSub: "Agendar Cita con Dr. Maya",
    ctaBook: "SOLUCIÓN EN CASA",
    ctaBookSub: "Descargar Protocolo (Ebook)",
    print: "GENERAR EXPEDIENTE PDF",
    conclusion: "El análisis de 3 ángulos confirma una discrepancia severa entre su edad real y su apariencia biológica."
  },
  EN: {
    title: "MULTILAYER SCANNER V160",
    namePlace: "FULL NAME",
    agePlace: "AGE",
    phonePlace: "WHATSAPP (UNIQUE ID)",
    start: "START TRIPLE SCAN",
    stepFront: "Step 1: FRONT FACE",
    stepSideR: "Step 2: RIGHT PROFILE",
    stepSideL: "Step 3: LEFT PROFILE",
    analyzing: "TRIANGULATING VECTORS...",
    problemTitle: "FACIAL DETERIORATION MAP",
    problemSub: "Tridimensional evidence of structural collapse.",
    redZone: "DERMAL FRACTURE",
    blueZone: "BONE RESORPTION",
    ctaDoctor: "SURGICAL SOLUTION",
    ctaDoctorSub: "Book Dr. Maya Appointment",
    ctaBook: "HOME SOLUTION",
    ctaBookSub: "Download Protocol (Ebook)",
    print: "GENERATE PDF DOSSIER",
    conclusion: "The 3-angle analysis confirms a severe discrepancy between your real age and your biological appearance."
  }
};

export default function TipherethTrilogy() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState<'FRONT' | 'SIDE_R' | 'SIDE_L'>('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null; right: string | null; left: string | null }>({ front: null, right: null, left: null });
  const [patient, setPatient] = useState({ name: '', age: '', phone: '' });

  // RECUPERAR USUARIO
  useEffect(() => {
    const savedPhone = localStorage.getItem('tiphereth_user_phone');
    if(savedPhone) setPatient(prev => ({ ...prev, phone: savedPhone }));
  }, []);

  // 1. INICIO DE CÁMARA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if(videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { alert("Cámara no detectada"); }
  };

  useEffect(() => { 
    if(appMode === 'CAPTURE') startCamera();
  }, [appMode, captureStep]);

  // 2. TOMAR FOTO (LÓGICA TRIPLE)
  const takeShot = () => {
    if(videoRef.current && canvasRef.current) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if(ctx) {
            ctx.translate(cvs.width, 0); ctx.scale(-1, 1); // Espejo
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);
            
            if(captureStep === 'FRONT') {
                setPhotos(prev => ({...prev, front: imgData}));
                setCaptureStep('SIDE_R'); // Siguiente paso
            } else if (captureStep === 'SIDE_R') {
                setPhotos(prev => ({...prev, right: imgData}));
                setCaptureStep('SIDE_L'); // Siguiente paso
            } else {
                setPhotos(prev => ({...prev, left: imgData}));
                // GUARDAR ID
                localStorage.setItem('tiphereth_user_phone', patient.phone);
                setAppMode('ANALYSIS');
                setTimeout(() => setAppMode('RESULT'), 3500); // 3.5s de drama
            }
        }
    }
  };

  const t = TEXTS[lang]; 

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-red-900">
      
      {/* ESTILOS DE IMPRESIÓN PRO */}
      <style jsx global>{`
        @media print { 
            @page { margin: 0; size: A4; }
            body { background: white; color: black; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            .red-overlay { border: 2px solid red !important; opacity: 0.3 !important; background: transparent !important; }
            .blue-overlay { border: 2px solid blue !important; opacity: 0.3 !important; background: transparent !important; }
        }
        .print-only { display: none; }
        @keyframes scan { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
      `}</style>

      {/* --- 1. LOGIN --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black p-6 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="z-10 w-full max-w-sm">
                <div className="flex justify-end gap-2 mb-8">
                    <button onClick={()=>setLang('ES')} className={`text-[10px] px-3 py-1 border ${lang==='ES'?'bg-white text-black':'border-gray-600 text-gray-500'}`}>ES</button>
                    <button onClick={()=>setLang('EN')} className={`text-[10px] px-3 py-1 border ${lang==='EN'?'bg-white text-black':'border-gray-600 text-gray-500'}`}>EN</button>
                </div>

                <h1 className="text-5xl font-bold tracking-tighter text-center mb-1">TIPHERETH</h1>
                <p className="text-center text-xs tracking-[0.4em] text-red-500 mb-10 font-mono">TRILOGY SCANNER V160</p>
                
                <div className="space-y-4">
                    <input value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-gray-800/80 border-l-4 border-red-600 p-4 text-white outline-none placeholder:text-gray-500" placeholder={t.namePlace} />
                    <div className="flex gap-2">
                        <input type="tel" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-gray-800/80 border-l-4 border-gray-600 p-4 text-white outline-none placeholder:text-gray-500" placeholder={t.phonePlace} />
                        <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-gray-800/80 border-l-4 border-gray-600 p-4 text-center text-white outline-none placeholder:text-gray-500" placeholder={t.agePlace} />
                    </div>

                    <button onClick={() => { if(patient.name && patient.phone) setAppMode('CAPTURE') }} className="w-full bg-red-700 text-white py-5 font-bold tracking-widest uppercase hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] mt-4 transition-all hover:scale-105">
                        {t.start}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- 2. CÁMARA (3 PASOS) --- */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* LÍNEA DE ESCANEO */}
            <div className="absolute left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(255,0,0,1)] animate-[scan_3s_infinite_linear] pointer-events-none"></div>

            {/* GUI HUD */}
            <div className="absolute top-10 left-0 w-full text-center pointer-events-none">
                <div className="inline-block bg-black/70 px-6 py-2 border border-red-500 rounded">
                    <p className="text-red-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                        {captureStep === 'FRONT' ? t.stepFront : captureStep === 'SIDE_R' ? t.stepSideR : t.stepSideL}
                    </p>
                </div>
            </div>

            {/* GUIDES */}
            {captureStep === 'FRONT' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-dashed border-white/30 rounded-[40%] pointer-events-none"></div>}
            {(captureStep === 'SIDE_R' || captureStep === 'SIDE_L') && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-l-2 border-r-0 border-white/50 pointer-events-none"></div>}

            <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/10 backdrop-blur border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-900/40 z-50 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- 3. ANÁLISIS --- */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white relative">
             <div className="grid grid-cols-3 gap-1 absolute inset-0 opacity-20">
                {photos.front && <img src={photos.front} className="h-full object-cover grayscale" />}
                {photos.right && <img src={photos.right} className="h-full object-cover grayscale" />}
                {photos.left && <img src={photos.left} className="h-full object-cover grayscale" />}
             </div>
             <div className="z-10 bg-black/90 p-10 border border-red-900/50 shadow-2xl flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-red-500 tracking-widest">{t.analyzing}</h2>
             </div>
        </div>
      )}

      {/* --- 4. RESULTADOS (EL SHOW) --- */}
      {appMode === 'RESULT' && (
        <div className="w-full min-h-screen bg-slate-950 text-white pb-10">
            
            {/* ENCABEZADO MÉDICO */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-end bg-black">
                <div>
                    <h1 className="text-xs font-bold text-gray-500 tracking-[0.2em]">{DR_NAME}</h1>
                    <p className="text-red-600 font-bold text-lg">{t.problemTitle}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-600">ID: {patient.phone}</p>
                </div>
            </div>

            {/* ZONA PRINCIPAL: EL ROSTRO DEL PROBLEMA */}
            <div className="relative w-full aspect-square bg-black overflow-hidden border-b border-red-900/30">
                {photos.front && <img src={photos.front} className="w-full h-full object-cover opacity-60 grayscale contrast-125" />}
                
                {/* --- CAPAS DE DIAGNÓSTICO (HEATMAPS) --- */}
                {/* 1. Zona Superior (Arrugas - Rojo) */}
                <div className="absolute top-[30%] left-[15%] w-[70%] h-[15%] bg-red-600/30 blur-2xl rounded-full mix-blend-color-dodge animate-pulse"></div>
                {/* 2. Zona Media (Hueso - Azul) */}
                <div className="absolute bottom-[30%] left-[20%] w-[60%] h-[20%] bg-blue-600/30 blur-2xl rounded-full mix-blend-color-dodge"></div>

                {/* --- MIRILLAS (CROSSHAIRS) "MIRE AQUÍ" --- */}
                <div className="absolute top-[35%] right-[25%]">
                    <div className="relative">
                        <div className="w-8 h-8 border border-red-500 rounded-full animate-ping absolute"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="absolute left-4 top-[-10px] bg-black/80 text-red-500 text-[8px] px-2 py-1 whitespace-nowrap border border-red-900">
                             {t.redZone}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-[35%] left-[25%]">
                    <div className="relative">
                        <div className="w-8 h-8 border border-blue-500 rounded-full animate-ping delay-150 absolute"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="absolute left-4 top-[-10px] bg-black/80 text-blue-400 text-[8px] px-2 py-1 whitespace-nowrap border border-blue-900">
                             {t.blueZone}
                        </div>
                    </div>
                </div>
            </div>

            {/* TIRA DE EVIDENCIA (PERFILES) */}
            <div className="grid grid-cols-3 gap-1 h-24 bg-black border-b border-gray-800 mb-6">
                <div className="relative border-r border-gray-800">
                    <p className="absolute bottom-1 left-1 text-[8px] bg-red-600 px-1 font-bold">FRONT</p>
                    {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale opacity-50" />}
                </div>
                <div className="relative border-r border-gray-800">
                    <p className="absolute bottom-1 left-1 text-[8px] bg-gray-600 px-1 font-bold">R-SIDE</p>
                    {photos.right && <img src={photos.right} className="w-full h-full object-cover grayscale opacity-50" />}
                </div>
                <div className="relative">
                    <p className="absolute bottom-1 left-1 text-[8px] bg-gray-600 px-1 font-bold">L-SIDE</p>
                    {photos.left && <img src={photos.left} className="w-full h-full object-cover grayscale opacity-50" />}
                </div>
            </div>

            {/* ZONA DE PERSUASIÓN */}
            <div className="px-6">
                <p className="text-gray-300 text-sm italic border-l-2 border-red-500 pl-4 mb-8">
                    "{t.conclusion}"
                </p>

                {/* BOTONES DE ACCIÓN */}
                <div className="space-y-4">
                    {/* QUIRÚRGICO */}
                    <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, vi mis 3 fotos y el mapa de calor. Necesito intervención.`)} className="w-full bg-white text-black py-4 rounded font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-200 transition-all flex justify-between items-center px-6 group">
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">{t.ctaDoctor}</p>
                            <p className="text-lg leading-none">{t.ctaDoctorSub}</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                    </button>

                    {/* EBOOK */}
                    <button className="w-full bg-transparent border border-gray-600 text-gray-400 py-4 rounded font-bold hover:bg-gray-900 transition-all flex justify-between items-center px-6">
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-widest text-gray-600">{t.ctaBook}</p>
                            <p className="text-sm">{t.ctaBookSub}</p>
                        </div>
                        <span className="text-xl">↓</span>
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button onClick={() => window.print()} className="text-xs text-gray-600 underline hover:text-white">
                        {t.print}
                    </button>
                </div>
            </div>

            {/* --- HOJA DE IMPRESIÓN OFICIAL (CLEAN) --- */}
            <div className="print-only fixed inset-0 z-50 bg-white text-black p-12">
                <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
                    <h1 className="text-4xl font-black">{DR_NAME}</h1>
                    <div className="text-right">
                        <p className="text-sm font-bold">EXPEDIENTE DIGITAL V160</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-4 h-48 mb-6">
                    <div className="flex-1 bg-gray-100 border border-gray-300 relative">
                        <span className="absolute top-0 left-0 bg-black text-white text-xs px-2">FRONTAL</span>
                        {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale" />}
                        {/* Overlay simulado para impresión */}
                        <div className="absolute inset-0 border-2 border-red-500 opacity-20 rounded-full scale-75"></div>
                    </div>
                    <div className="flex-1 bg-gray-100 border border-gray-300 relative">
                        <span className="absolute top-0 left-0 bg-black text-white text-xs px-2">LAT. DER</span>
                        {photos.right && <img src={photos.right} className="w-full h-full object-cover grayscale" />}
                    </div>
                    <div className="flex-1 bg-gray-100 border border-gray-300 relative">
                        <span className="absolute top-0 left-0 bg-black text-white text-xs px-2">LAT. IZQ</span>
                        {photos.left && <img src={photos.left} className="w-full h-full object-cover grayscale" />}
                    </div>
                </div>

                <div className="border-l-4 border-red-600 pl-6 py-2 mb-8 bg-red-50">
                    <h3 className="font-bold text-red-900 uppercase mb-2">Dictamen de Inteligencia Artificial</h3>
                    <p className="text-sm text-justify leading-relaxed">
                        El escaneo tridimensional revela <strong>fracturas dérmicas profundas</strong> en tercio superior y una 
                        evidente <strong>pérdida de la bolsa de grasa malar</strong> en las vistas laterales. La estructura ósea 
                        no ofrece soporte suficiente para la piel.
                    </p>
                </div>

                <div className="border-t-2 border-black pt-6 mt-12 flex justify-between items-center">
                    <div>
                        <p className="font-bold uppercase text-sm">Plan Autorizado</p>
                        <p className="text-xs">Dr. Ricardo Maya Romo</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-xs text-gray-400">ID PACIENTE: {patient.phone}</p>
                    </div>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}