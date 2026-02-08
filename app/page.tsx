"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL DR. RICARDO MAYA ROMO ---
const WS_NUMBER = "573117936211"; 
const DR_NAME = "DR. RICARDO MAYA ROMO";

// --- DICCIONARIO DE IDIOMAS ---
const TEXTS = {
  ES: {
    title: "DIAGNÓSTICO CIENTÍFICO",
    namePlace: "NOMBRE COMPLETO",
    agePlace: "EDAD",
    phonePlace: "WHATSAPP (ID ÚNICO)",
    start: "INICIAR ESCANEO FACIAL",
    analyzing: "ANALIZANDO ESTRUCTURA...",
    problemTitle: "ZONAS CRÍTICAS DETECTADAS",
    problemSub: "La IA ha detectado colapso estructural en las zonas marcadas.",
    redZone: "FRACTURA DÉRMICA (ARRUGAS)",
    blueZone: "PÉRDIDA DE VOLUMEN (HUESO/GRASA)",
    ctaDoctor: "SOLUCIÓN QUIRÚRGICA",
    ctaDoctorSub: "Agendar Cita con Dr. Maya",
    ctaBook: "SOLUCIÓN EN CASA",
    ctaBookSub: "Descargar Protocolo (Ebook)",
    print: "DESCARGAR REPORTE MÉDICO",
    conclusion: "Su rostro muestra una edad biológica superior a su edad cronológica debido a la falta de soporte óseo."
  },
  EN: {
    title: "SCIENTIFIC DIAGNOSIS",
    namePlace: "FULL NAME",
    agePlace: "AGE",
    phonePlace: "WHATSAPP (UNIQUE ID)",
    start: "START FACE SCAN",
    analyzing: "ANALYZING STRUCTURE...",
    problemTitle: "CRITICAL ZONES DETECTED",
    problemSub: "AI has detected structural collapse in marked areas.",
    redZone: "DERMAL FRACTURE (WRINKLES)",
    blueZone: "VOLUME LOSS (BONE/FAT)",
    ctaDoctor: "SURGICAL SOLUTION",
    ctaDoctorSub: "Book Dr. Maya Appointment",
    ctaBook: "HOME SOLUTION",
    ctaBookSub: "Download Protocol (Ebook)",
    print: "DOWNLOAD MEDICAL REPORT",
    conclusion: "Your face shows a biological age older than your chronological age due to lack of bone support."
  }
};

export default function TipherethScientific() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- ESTADOS ---
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState('FRONT'); 
  const [photos, setPhotos] = useState<{ front: string | null }>({ front: null });
  const [patient, setPatient] = useState({ name: '', age: '', phone: '' });
  const [analyzing, setAnalyzing] = useState(false);

  // RECUPERAR USUARIO ANTIGUO (SIMULACIÓN DE BASE DE DATOS LOCAL)
  useEffect(() => {
    const savedPhone = localStorage.getItem('tiphereth_user_phone');
    if(savedPhone) {
        // Aquí podrías cargar datos antiguos si tuvieras base de datos real
        setPatient(prev => ({ ...prev, phone: savedPhone }));
    }
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
  }, [appMode]);

  // 2. TOMAR FOTO
  const takeShot = () => {
    if(videoRef.current && canvasRef.current) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if(ctx) {
            ctx.translate(cvs.width, 0); ctx.scale(-1, 1); // Modo Espejo
            ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
            const imgData = cvs.toDataURL('image/jpeg', 0.9);
            setPhotos({ front: imgData });
            
            // GUARDAR ID EN CELULAR DEL USUARIO
            localStorage.setItem('tiphereth_user_phone', patient.phone);
            
            setAppMode('ANALYSIS');
            setAnalyzing(true);
            setTimeout(() => { setAnalyzing(false); setAppMode('RESULT'); }, 4000); // 4 seg de "análisis"
        }
    }
  };

  const t = TEXTS[lang]; // Shortcut para idioma

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* ESTILOS PARA IMPRESIÓN LIMPIA */}
      <style jsx global>{`
        @media print { 
            @page { margin: 0; size: A4; }
            body { background: white; color: black; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; } 
            .red-overlay, .blue-overlay { border: 2px solid red !important; opacity: 0.5 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PANTALLA 1: LOGIN (CON IDENTIFICACIÓN) --- */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-black p-6">
            <div className="absolute top-6 right-6 flex gap-2">
                <button onClick={()=>setLang('ES')} className={`text-xs px-2 py-1 border ${lang==='ES'?'bg-white text-black':'border-gray-600'}`}>ES</button>
                <button onClick={()=>setLang('EN')} className={`text-xs px-2 py-1 border ${lang==='EN'?'bg-white text-black':'border-gray-600'}`}>EN</button>
            </div>

            <h1 className="text-4xl mb-2 font-bold tracking-tight text-center">TIPHERETH</h1>
            <p className="text-[10px] text-blue-400 tracking-[0.3em] mb-12 uppercase">V155 Bio-Scanner ID</p>
            
            <div className="w-full max-w-sm space-y-4">
                <input value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-slate-800/50 border-b border-slate-600 p-4 text-center text-white outline-none focus:border-blue-500 uppercase placeholder:text-gray-500" placeholder={t.namePlace} />
                
                <div className="flex gap-2">
                    <input type="tel" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-slate-800/50 border-b border-slate-600 p-4 text-center text-white outline-none focus:border-blue-500 placeholder:text-gray-500" placeholder={t.phonePlace} />
                    <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-slate-800/50 border-b border-slate-600 p-4 text-center text-white outline-none focus:border-blue-500 placeholder:text-gray-500" placeholder={t.agePlace} />
                </div>

                <button onClick={() => { if(patient.name && patient.phone) setAppMode('CAPTURE') }} className="w-full bg-blue-600 text-white py-5 font-bold tracking-widest uppercase hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.5)] mt-6 text-sm">
                    {t.start}
                </button>
                <p className="text-[9px] text-gray-600 text-center mt-4">Protected by Dr. Maya Medical Algorithm™</p>
            </div>
        </div>
      )}

      {/* --- PANTALLA 2: CÁMARA --- */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* GUI DE ESCÁNER */}
            <div className="absolute inset-0 border-[20px] border-black/30 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border border-blue-400/50 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,1)] animate-pulse pointer-events-none"></div>

            <button onClick={takeShot} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/10 backdrop-blur border-2 border-white rounded-full flex items-center justify-center hover:bg-white/30 z-50">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* --- PANTALLA 3: ANÁLISIS (DRAMA VISUAL) --- */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Foto de fondo borrosa */}
            {photos.front && <img src={photos.front} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />}
            
            <div className="z-10 bg-black/80 p-8 rounded-xl border border-blue-900/50 backdrop-blur-md flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-bold text-blue-400 animate-pulse">{t.analyzing}</h2>
                <div className="mt-4 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-full animate-[wiggle_4s_linear]"></div>
                </div>
            </div>
        </div>
      )}

      {/* --- PANTALLA 4: RESULTADO (EL EFECTO ESPEJO) --- */}
      {appMode === 'RESULT' && (
        <div className="w-full min-h-screen bg-slate-900 text-white pb-20">
            
            {/* CABECERA ALARMANTE */}
            <div className="p-6 bg-black border-b border-red-900/50 text-center">
                <h2 className="text-red-500 font-bold tracking-widest text-lg animate-pulse">⚠️ {t.problemTitle}</h2>
                <p className="text-xs text-gray-400 mt-1">{t.problemSub}</p>
            </div>

            {/* FOTO CON DIAGNÓSTICO VISUAL (HEATMAPS) */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                {photos.front && <img src={photos.front} className="w-full h-full object-cover opacity-60 grayscale" />}
                
                {/* ZONAS ROJAS (ARRUGAS) - Simuladas con CSS */}
                <div className="absolute top-[35%] left-[20%] w-[20%] h-[10%] bg-red-600/40 blur-xl rounded-full animate-pulse mix-blend-overlay"></div>
                <div className="absolute top-[35%] right-[20%] w-[20%] h-[10%] bg-red-600/40 blur-xl rounded-full animate-pulse mix-blend-overlay"></div>
                
                {/* ZONAS AZULES (PÉRDIDA ÓSEA) */}
                <div className="absolute bottom-[30%] left-[25%] w-[15%] h-[15%] bg-blue-600/40 blur-xl rounded-full mix-blend-color-dodge"></div>
                <div className="absolute bottom-[30%] right-[25%] w-[15%] h-[15%] bg-blue-600/40 blur-xl rounded-full mix-blend-color-dodge"></div>

                {/* ETIQUETAS FLOTANTES (Punteros) */}
                <div className="absolute top-[38%] left-[10%] bg-red-900/80 border border-red-500 text-[8px] px-2 py-1 text-white rounded shadow-lg">
                    {t.redZone}
                </div>
                <div className="absolute bottom-[25%] right-[10%] bg-blue-900/80 border border-blue-500 text-[8px] px-2 py-1 text-white rounded shadow-lg">
                    {t.blueZone}
                </div>
            </div>

            {/* SECCIÓN DE VENTAS (LA CURA) */}
            <div className="px-6 -mt-6 relative z-10">
                <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700">
                    <p className="text-sm text-center text-gray-300 mb-6 italic">"{t.conclusion}"</p>
                    
                    <div className="space-y-4">
                        {/* OPCIÓN 1: HIGH TICKET */}
                        <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, vi mi escaneo con colapso estructural. Necesito cita urgente.`)} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black py-4 rounded-lg font-bold shadow-lg hover:scale-[1.02] transition-transform">
                            <div className="text-xs uppercase tracking-widest mb-1 opacity-70">{t.ctaDoctor}</div>
                            <div className="text-lg">{t.ctaDoctorSub} ➔</div>
                        </button>

                        {/* SEPARADOR */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                            <div className="h-px bg-gray-700 flex-1"></div>
                            <span>O</span>
                            <div className="h-px bg-gray-700 flex-1"></div>
                        </div>

                        {/* OPCIÓN 2: LOW TICKET (EBOOK) */}
                        <button className="w-full bg-slate-700 text-white py-4 rounded-lg font-bold border border-slate-600 hover:bg-slate-600">
                             <div className="text-[10px] uppercase tracking-widest mb-1 text-blue-300">{t.ctaBook}</div>
                             <div className="text-sm">{t.ctaBookSub}</div>
                        </button>

                        {/* BOTÓN IMPRIMIR (SIN ESTORBAR) */}
                        <button onClick={() => window.print()} className="w-full mt-4 py-2 text-xs text-gray-500 underline decoration-dotted">
                            {t.print}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FORMATO OCULTO PARA IMPRESIÓN (PDF) --- */}
            <div className="print-only fixed inset-0 bg-white text-black p-10 z-[100]">
                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-3xl font-bold">{DR_NAME}</h1>
                    <div className="text-right text-xs">
                        <p>ID: {patient.phone}</p>
                        <p>FECHA: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-4 mb-6">
                    <div className="w-1/2">
                        {photos.front && <img src={photos.front} className="w-full grayscale border border-black" />}
                        <p className="text-[10px] text-center mt-1">EVIDENCIA FOTOGRÁFICA</p>
                    </div>
                    <div className="w-1/2 space-y-4">
                        <div className="border border-red-500 p-2 bg-red-50">
                            <p className="font-bold text-red-900 text-sm">ZONA SUPERIOR: COLAPSO DÉRMICO</p>
                            <p className="text-xs">Se observan rhytides dinámicas profundas que requieren bloqueo neuromuscular inmediato.</p>
                        </div>
                        <div className="border border-blue-500 p-2 bg-blue-50">
                            <p className="font-bold text-blue-900 text-sm">ZONA MEDIA: REABSORCIÓN ÓSEA</p>
                            <p className="text-xs">Pérdida de soporte en maxilar y cigomático. Urgente reposición de volumen.</p>
                        </div>
                    </div>
                </div>
                <div className="border-t-2 border-black pt-4">
                    <p className="text-center font-bold text-lg">PLAN DE ACCIÓN RECOMENDADO</p>
                    <p className="text-center text-sm mt-2">1. Cita presencial de valoración.</p>
                    <p className="text-center text-sm">2. Protocolo de Skincare (Ebook) como mantenimiento.</p>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}
