"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DE NEURO-VENTAS ---
// Usamos enlaces directos para reducir fricción.
const HOTMART_PROTOCOL_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const WS_BUSINESS = "573117936211";

export default function TipherethClinical() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS CLÍNICOS
  const [step, setStep] = useState('login'); 
  const [user, setUser] = useState({ name: '', age: '' });
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // MODO DE ANÁLISIS (PRIORIDAD 1 y 2)
  // 'VASCULAR' (Rojo/Inflamación), 'PIGMENT' (UV/Manchas), 'STRUCTURE' (Vectores/Sombras)
  const [clinicalMode, setClinicalMode] = useState('NORMAL'); 
  
  // SIMULADOR DE DESPLAZAMIENTO (PRIORIDAD 2 - TIKTOK LOGIC)
  const [vectorTension, setVectorTension] = useState(0); // 0 a 100% de tracción

  // DIAGNÓSTICO GENERADO (NEUROCIENCIA)
  const [diagnosis, setDiagnosis] = useState<string[]>([]);

  // --- 1. ACCESO RÁPIDO (CERO FRICCIÓN) ---
  const handleLogin = () => {
    if (!user.name) return;
    setStep('camera');
  };

  // --- 2. CÁMARA DE ALTA DEFINICIÓN ---
  useEffect(() => {
    if (step === 'camera') startCamera();
  }, [step]);

  const startCamera = async () => {
    try {
      // Pedimos máxima resolución posible para análisis de poros
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { alert("Cámara requerida para diagnóstico clínico."); }
  };

  // --- 3. PROCESAMIENTO DE IMAGEN (EL CEREBRO DE LA APP) ---
  const captureAndAnalyze = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const vid = videoRef.current;
    const cvs = canvasRef.current;
    cvs.width = vid.videoWidth;
    cvs.height = vid.videoHeight;
    
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    // Captura Espejo
    ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
    
    setPhoto(cvs.toDataURL('image/jpeg', 1.0)); // Calidad máxima
    setAnalyzing(true);

    // SIMULACIÓN DE PROCESAMIENTO DE CAPAS (AQUÍ IRÍA LA IA REAL DE SU DRIVE)
    setTimeout(() => {
      generateDiagnosis();
      setAnalyzing(false);
      setStep('analysis');
    }, 1500);
  };

  // GENERADOR DE REPORTE BASADO EN "LIBRERÍA MÉDICA" (Simulado por ahora)
  const generateDiagnosis = () => {
    const age = parseInt(user.age) || 35;
    const report = [];
    
    // Lógica de Envejecimiento (Prioridad 1)
    if (age > 30) report.push("Daño UV profundo detectado (Capa Dermis Reticular).");
    if (age > 40) report.push("Adelgazamiento epidérmico visible.");
    
    // Lógica Estructural (Prioridad 2)
    report.push("Desplazamiento graso en Jowls (Compartimento Mandibular).");
    report.push("Profundización de Surcos Nasogenianos por ptosis malar.");
    
    setDiagnosis(report);
  };

  // FILTROS TÉCNICOS (VISIA REVERSE ENGINEERING)
  // Usamos CSS filters para simular la separación de canales de luz
  const getFilterStyle = () => {
    switch (clinicalMode) {
      case 'VASCULAR': // Canal Rojo (Hemoglobina/Inflamación)
        return "contrast(2.0) saturate(3) brightness(0.9) sepia(1) hue-rotate(-50deg)"; 
      case 'PIGMENT': // Canal Azul/UV (Melanina/Daño Solar)
        return "grayscale(1) contrast(1.5) brightness(0.7) invert(0.1)"; 
      case 'STRUCTURE': // Relieve/Sombras (Glogau)
        return "grayscale(1) contrast(2.5) brightness(0.9)";
      default:
        return "none";
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* PANTALLA DE LOGIN (NEURO: PERSONALIZACIÓN) */}
      {step === 'login' && (
        <div className="w-full max-w-md p-10 mt-20 text-center animate-in fade-in">
            <h1 className="text-4xl font-light text-white mb-2 tracking-tighter">TIPHERET</h1>
            <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-10">Advanced Clinical Diagnostics</p>
            
            <div className="space-y-4">
                <div className="text-left">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 ml-1">NOMBRE DEL PACIENTE</label>
                    <input onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-cyan-500 transition-colors" placeholder="Ej: Maria Perez" />
                </div>
                <div className="text-left">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 ml-1">EDAD CRONOLÓGICA</label>
                    <input type="number" onChange={e => setUser({...user, age: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-cyan-500 transition-colors" placeholder="Ej: 42" />
                </div>
                <button onClick={handleLogin} disabled={!user.name} className="w-full bg-white text-black font-bold py-4 rounded-lg mt-4 text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all">INICIAR ESCÁNER</button>
            </div>
        </div>
      )}

      {/* CÁMARA CLÍNICA */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* GUIAS ANATÓMICAS (PRIORIDAD 2) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                <div className="w-64 h-84 border-2 border-cyan-500/50 rounded-[40%] relative">
                    <div className="absolute top-1/3 w-full border-t border-dashed border-cyan-500/30"></div> {/* Línea Interpupilar */}
                    <div className="absolute bottom-1/3 w-full border-t border-dashed border-cyan-500/30"></div> {/* Línea Labial */}
                    <div className="absolute w-full h-full border-l border-r border-cyan-500/20 mx-auto w-1/2"></div> {/* Quinto Central */}
                </div>
            </div>
            
            <div className="absolute bottom-12 inset-x-0 flex justify-center z-20">
                <button onClick={captureAndAnalyze} className="w-20 h-20 rounded-full border-4 border-white/80 bg-white/20 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
            </div>
            <p className="absolute bottom-4 inset-x-0 text-center text-[9px] text-zinc-400">Mantenga el rostro neutral y sin maquillaje</p>
        </div>
      )}

      {/* ANÁLISIS EN PROCESO */}
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-500 text-xs font-mono uppercase tracking-widest">ANALIZANDO PROFUNDIDAD DÉRMICA...</p>
            <p className="text-zinc-600 text-[9px] mt-2">Mapeando vectores de gravedad</p>
        </div>
      )}

      {/* RESULTADO CLÍNICO (PRIORIDAD 1, 2, 3 INTEGRADA) */}
      {step === 'analysis' && photo && (
        <div className="w-full max-w-md bg-black min-h-screen pb-20 animate-in slide-in-from-bottom duration-700">
            
            {/* 1. VISOR DIAGNÓSTICO (PRIORIDAD 1 - PIEL) */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden border-b border-zinc-800">
                
                {/* CAPA BASE (IMAGEN) */}
                <div className="w-full h-full transition-transform duration-200 ease-out origin-bottom"
                     style={{ 
                        filter: getFilterStyle(),
                        // LÓGICA DE VECTOR (PRIORIDAD 2 - ESTRUCTURA)
                        // Si está en modo estructura, aplicamos el lifting "TikTok Style"
                        transform: clinicalMode === 'STRUCTURE' ? `translateY(-${vectorTension/2}px) scaleX(${1-(vectorTension/2000)})` : 'none',
                        // Máscara para que el lifting solo afecte tercio medio e inferior
                        maskImage: clinicalMode === 'STRUCTURE' ? 'linear-gradient(to bottom, black 0%, black 100%)' : 'none'
                     }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                {/* OVERLAY DE VECTORES (SOLO EN MODO ESTRUCTURA) */}
                {clinicalMode === 'STRUCTURE' && (
                    <div className="absolute inset-0 pointer-events-none opacity-60">
                        <svg width="100%" height="100%">
                            {/* Vectores de Lifting Deep Plane */}
                            <path d="M 80 400 Q 90 300 70 200" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="4,4" />
                            <path d="M 320 400 Q 310 300 330 200" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="4,4" />
                            <circle cx="70" cy="200" r="4" fill="cyan" />
                            <circle cx="330" cy="200" r="4" fill="cyan" />
                        </svg>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded text-[10px] text-cyan-400 font-bold border border-cyan-500/30">
                            TRACCIÓN VECTORES: {vectorTension}%
                        </div>
                    </div>
                )}

                {/* BOTONERA DE FILTROS CLÍNICOS */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4">
                    <button onClick={() => setClinicalMode('NORMAL')} className={`px-3 py-2 rounded text-[8px] font-bold border ${clinicalMode === 'NORMAL' ? 'bg-white text-black' : 'bg-black/50 text-white border-zinc-600'}`}>REAL</button>
                    <button onClick={() => setClinicalMode('VASCULAR')} className={`px-3 py-2 rounded text-[8px] font-bold border ${clinicalMode === 'VASCULAR' ? 'bg-red-900 text-white border-red-500' : 'bg-black/50 text-white border-zinc-600'}`}>INFLAMACIÓN</button>
                    <button onClick={() => setClinicalMode('PIGMENT')} className={`px-3 py-2 rounded text-[8px] font-bold border ${clinicalMode === 'PIGMENT' ? 'bg-blue-900 text-white border-blue-500' : 'bg-black/50 text-white border-zinc-600'}`}>DAÑO UV</button>
                    <button onClick={() => setClinicalMode('STRUCTURE')} className={`px-3 py-2 rounded text-[8px] font-bold border ${clinicalMode === 'STRUCTURE' ? 'bg-cyan-900 text-white border-cyan-500' : 'bg-black/50 text-white border-zinc-600'}`}>VECTORES</button>
                </div>
            </div>

            {/* 2. PANEL DE DIAGNÓSTICO Y TRATAMIENTO (PRIORIDAD 3 - NEURO) */}
            <div className="p-6">
                
                {/* SI ESTAMOS EN MODO ESTRUCTURA -> SIMULADOR */}
                {clinicalMode === 'STRUCTURE' ? (
                    <div className="animate-in fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-bold text-white uppercase">SIMULADOR QUIRÚRGICO</h3>
                            <span className="text-[9px] text-cyan-500">REPOSICIÓN TISULAR</span>
                        </div>
                        <input type="range" min="0" max="60" value={vectorTension} onChange={(e) => setVectorTension(Number(e.target.value))} className="w-full h-4 bg-zinc-800 rounded-lg appearance-none cursor-pointer mb-6 accent-cyan-500" />
                        
                        <div className="bg-zinc-900 p-4 rounded-xl border border-cyan-900/50 mb-4">
                            <p className="text-[10px] text-zinc-400 mb-2">Este resultado requiere intervención estructural.</p>
                            <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Dr.Maya, vi mi simulación de vectores y quiero ese resultado (Cirugía).`} className="w-full bg-white text-black font-bold py-3 rounded-lg text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-colors">
                                QUIERO ESTE RESULTADO (AGENDAR)
                            </button>
                        </div>
                    </div>
                ) : (
                    // MODO DIAGNÓSTICO
                    <div className="animate-in fade-in">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">HALLAZGOS CLÍNICOS</h3>
                        
                        <div className="space-y-3 mb-6">
                            {diagnosis.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 bg-zinc-900/50 p-3 rounded border-l-2 border-red-500">
                                    <span className="text-red-500 text-lg">⚠</span>
                                    <p className="text-[10px] text-zinc-300 leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>

                        {/* PLAN DE ACCIÓN (NEUROVENTA: EL DOLOR YA ESTÁ, AHORA LA CURA) */}
                        <div className="border-t border-zinc-800 pt-6">
                            <h3 className="text-center text-white font-bold text-sm mb-4 uppercase">PLAN DE TRATAMIENTO</h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {/* OPCIÓN A: NO QUIRÚRGICA (LIBRO) */}
                                <button onClick={() => window.open(HOTMART_PROTOCOL_URL)} className="bg-zinc-800 p-3 rounded-xl border border-zinc-700 hover:border-white transition-all text-left group">
                                    <span className="block text-[9px] text-zinc-500 mb-1">NIVEL 1</span>
                                    <span className="block text-white font-bold text-[10px] mb-2">PROTOCOLO EN CASA</span>
                                    <span className="text-[8px] text-zinc-400 group-hover:text-white">Corregir Piel/Inflamación ➜</span>
                                </button>

                                {/* OPCIÓN B: QUIRÚRGICA (CONSULTA) */}
                                <button onClick={() => window.location.href = `https://api.whatsapp.com/send?phone=${WS_BUSINESS}&text=Hola, quiero valoración para corrección estructural (Vectores).`} className="bg-gradient-to-br from-zinc-800 to-black p-3 rounded-xl border border-amber-900/50 hover:border-amber-500 transition-all text-left group">
                                    <span className="block text-[9px] text-amber-500 mb-1">NIVEL 2</span>
                                    <span className="block text-white font-bold text-[10px] mb-2">CORRECCIÓN ESTRUCTURAL</span>
                                    <span className="text-[8px] text-zinc-400 group-hover:text-amber-400">Valoración Dr. Maya ➜</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}