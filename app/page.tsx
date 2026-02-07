"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN DEL SISTEMA TIPHERET ---
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const HUMAN_SUPPORT_LINK = "https://api.whatsapp.com/send?phone=573117936211&text=Hola,%20necesito%20ayuda%20humana.";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS PRINCIPALES
  const [step, setStep] = useState('login'); 
  const [user, setUser] = useState({ name: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  // SIMULACIÓN DE VECTORES
  const [liftLevel, setLiftLevel] = useState(0); // Intensidad del vector (0-100)
  const [showGuide, setShowGuide] = useState(true); // Mostrar flechas guías

  // DIAGNÓSTICO AUTOMÁTICO (Simulado)
  const [diagnosis, setDiagnosis] = useState({
    skin: "Inflamación Crónica Detectada (Rosácea/UV)",
    smas: "Ptosis de Ligamentos Cigomáticos (Caída)",
    bone: "Retrusión Mandibular Leve (Soporte Débil)"
  });

  // --- 1. LOGIN ---
  const login = () => {
    if (!user.name) return;
    setLoading(true);
    // Simulamos carga de base de datos
    setTimeout(() => { setLoading(false); setStep('camera'); }, 1000);
  };

  // --- 2. CÁMARA ---
  useEffect(() => { 
    if (step === 'camera') startCamera(); 
    // Limpieza al desmontar
    return () => { 
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(t => t.stop());
        }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.error("Error cámara", e); }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      cvs.width = vid.videoWidth;
      cvs.height = vid.videoHeight;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        // Efecto espejo para que sea natural
        ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        const dataUrl = cvs.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        setStep('analysis');
      }
    }
  };

  // --- 3. GENERADOR DE PDF NATIVO ---
  const generatePDF = () => {
    window.print(); // Invoca el diálogo de impresión del sistema
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center overflow-x-hidden print:bg-white print:text-black">
      
      {/* ESTILOS DE IMPRESIÓN (CSS INYECTADO) 
          Oculta la interfaz de la app y muestra solo el reporte limpio al imprimir */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; color: black; }
          /* Forzamos que se impriman los fondos/imágenes */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* LOADER GLOBAL */}
      {loading && (<div className="fixed inset-0 bg-black z-50 flex items-center justify-center no-print"><div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin"></div></div>)}

      {/* =================================================================================
          SECCIÓN 1: REPORTE PDF OCULTO (SOLO APARECE AL DARLE A "DESCARGAR PDF")
         ================================================================================= */}
      <div className="print-only w-full max-w-4xl p-10">
          <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
              <div>
                  <h1 className="text-4xl font-bold tracking-tight">TIPHERET MEDICAL</h1>
                  <p className="text-sm text-gray-500">Dr. Ricardo Maya - Facial Plastic Surgery</p>
              </div>
              <div className="text-right">
                  <p className="text-sm font-bold">PACIENTE: {user.name.toUpperCase()}</p>
                  <p className="text-sm">FECHA: {new Date().toLocaleDateString()}</p>
              </div>
          </div>

          {/* FOTOS COMPARATIVAS PARA EL PDF */}
          <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                  <p className="font-bold mb-2 text-xs bg-gray-200 inline-block px-2 py-1 rounded">ESTADO INICIAL</p>
                  {photo && <img src={photo} className="w-full rounded-lg border border-gray-300" alt="Antes" />}
              </div>
              <div>
                  <p className="font-bold mb-2 text-xs bg-cyan-100 text-cyan-800 inline-block px-2 py-1 rounded">PROYECCIÓN VECTORIAL</p>
                  {/* Aquí mostramos la foto simulada estática para el papel */}
                  {photo && <img src={photo} className="w-full rounded-lg border border-gray-300" style={{ transform: 'scale(1.03) translateY(-10px)' }} alt="Después" />} 
                  <p className="text-[10px] text-gray-500 mt-1 italic">*Simulación de reposición de tejidos blandos (SMAS).</p>
              </div>
          </div>

          {/* DIAGNÓSTICO ESCRITO */}
          <div className="space-y-4 mb-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold">ANÁLISIS ESTRUCTURAL</h3>
              <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-red-50 rounded border border-red-100">
                      <p className="font-bold text-red-800 text-xs mb-1">CAPA 1: PIEL</p>
                      <p className="text-xs">{diagnosis.skin}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-100">
                      <p className="font-bold text-blue-800 text-xs mb-1">CAPA 3: SMAS</p>
                      <p className="text-xs">{diagnosis.smas}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
                      <p className="font-bold text-yellow-800 text-xs mb-1">CAPA 5: HUESO</p>
                      <p className="text-xs">{diagnosis.bone}</p>
                  </div>
              </div>
          </div>

          <div className="text-center mt-12 bg-black text-white p-6 rounded-xl">
              <p className="font-bold text-lg mb-2">PRESUPUESTO ESTIMADO</p>
              <div className="flex justify-between max-w-xs mx-auto text-sm border-b border-gray-700 pb-2 mb-2">
                  <span>Protocolo Piel (Casa)</span>
                  <span>$35 USD</span>
              </div>
              <div className="flex justify-between max-w-xs mx-auto text-sm">
                  <span>Valoración Quirúrgica</span>
                  <span>CONSULTAR</span>
              </div>
          </div>
      </div>

      {/* =================================================================================
          SECCIÓN 2: INTERFAZ MÓVIL (LO QUE VE EL USUARIO EN EL CELULAR)
         ================================================================================= */}
      
      {/* 1. LOGIN */}
      {step === 'login' && (
        <div className="w-full max-w-md p-8 mt-20 text-center animate-in fade-in no-print">
            <h1 className="text-6xl font-thin text-white mb-4 tracking-tighter">TIPHERET</h1>
            <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] mb-12">Vector Analysis System V108</p>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md">
                <input onChange={e => setUser({...user, name: e.target.value})} placeholder="TU NOMBRE COMPLETO" className="w-full bg-black border-b border-zinc-600 p-4 text-center text-white outline-none focus:border-cyan-500 mb-6 transition-all placeholder:text-zinc-700" />
                <button onClick={login} disabled={!user.name} className="w-full bg-white text-black font-bold py-4 rounded hover:bg-cyan-400 transition-all tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)]">INICIAR DIAGNÓSTICO</button>
            </div>
        </div>
      )}

      {/* 2. CÁMARA */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black no-print">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Guía Facial */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
                <div className="w-56 h-72 border-2 border-dashed border-cyan-500 rounded-[50%] relative shadow-[0_0_30px_cyan]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-cyan-500 text-[10px] font-bold tracking-widest bg-black px-2">ENCAJA TU ROSTRO</div>
                </div>
            </div>

            <div className="absolute bottom-12 inset-x-0 flex flex-col items-center z-20">
                <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-zinc-300 shadow-[0_0_30px_white] hover:scale-105 transition-transform"></button>
            </div>
        </div>
      )}

      {/* 3. PANTALLA DE CARGA (ANÁLISIS) */}
      {step === 'analysis' && (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-black no-print">
            <p className="text-cyan-500 text-xs animate-pulse tracking-[0.2em] mb-4">CALCULANDO VECTORES DE TRACCIÓN...</p>
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[width_2s_ease-in-out_forwards]" style={{width: '100%'}}></div>
            </div>
            {/* Auto-avance al reporte después de 2 seg */}
            {setTimeout(() => setStep('report'), 2000) && ""}
        </div>
      )}

      {/* 4. REPORTE INTERACTIVO (SIMULADOR DE VECTORES) */}
      {step === 'report' && photo && (
        <div className="w-full max-w-md bg-black min-h-screen pb-20 animate-in fade-in duration-1000 no-print">
            
            {/* CABECERA */}
            <div className="p-4 flex justify-between items-center bg-zinc-900/80 backdrop-blur border-b border-zinc-800 sticky top-0 z-50">
                <h2 className="text-xs font-bold text-white tracking-widest">SIMULADOR SMAS</h2>
                <button onClick={() => setShowGuide(!showGuide)} className="text-[9px] text-cyan-500 border border-cyan-500/50 px-2 py-1 rounded">{showGuide ? 'OCULTAR GUÍAS' : 'VER GUÍAS'}</button>
            </div>

            {/* --- EL VISOR "DR. HONG KONG" --- */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden border-b border-zinc-800">
                
                {/* CAPA 1: FONDO ESTÁTICO (Ojos, Frente, Nariz) */}
                <img src={photo} className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 grayscale" />
                
                {/* CAPA 2: TEJIDO MÓVIL (Pómulos y Mandíbula) 
                    Esta es la que se mueve. Usamos una máscara radial para que solo afecte los bordes y abajo.
                */}
                <div className="absolute inset-0 w-full h-full z-10 transition-transform duration-100 ease-out will-change-transform"
                     style={{ 
                        // LA MATEMÁTICA DEL VECTOR DIAGONAL:
                        // X: liftLevel * 0.5 (Se mueve un poco hacia afuera/atrás)
                        // Y: liftLevel * 1.3 (Se mueve mucho hacia arriba)
                        transform: `translate(${liftLevel * 0.5}px, -${liftLevel * 1.3}px)`, 
                        
                        // MÁSCARA: Un círculo degradado que es transparente en el centro (ojos) y opaco en los bordes
                        maskImage: 'radial-gradient(circle at 50% 40%, transparent 30%, black 80%)',
                        WebkitMaskImage: 'radial-gradient(circle at 50% 40%, transparent 30%, black 80%)'
                     }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                {/* FLECHAS VECTORIALES (UI) */}
                {showGuide && (
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-80">
                        <svg width="100%" height="100%">
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#06b6d4" />
                                </marker>
                            </defs>
                            {/* Líneas diagonales simulando el vector de tracción */}
                            <line x1="25%" y1="65%" x2="15%" y2="45%" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4,4" />
                            <line x1="75%" y1="65%" x2="85%" y2="45%" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4,4" />
                        </svg>
                        {/* Etiqueta flotante */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded-full border border-cyan-500/30 backdrop-blur">
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                                {liftLevel === 0 ? 'ESTADO ACTUAL' : `VECTOR: ${liftLevel}%`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLES Y VENTAS */}
            <div className="p-6 space-y-6">
                
                {/* 1. SLIDER MAGICO */}
                <div>
                    <p className="text-center text-zinc-400 text-[10px] mb-2 uppercase tracking-widest">Desliza para aplicar tracción (Deep Plane)</p>
                    <input 
                        type="range" min="0" max="45" step="0.5" 
                        value={liftLevel} 
                        onChange={(e) => setLiftLevel(Number(e.target.value))} 
                        className="w-full h-6 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400" 
                    />
                </div>

                {/* 2. DIAGNÓSTICO RÁPIDO */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
                    <span className="text-2xl">🧬</span>
                    <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">ANÁLISIS DE TEJIDOS</p>
                        <p className="text-xs text-white leading-relaxed">
                            Se observa descenso de los compartimentos grasos malares y laxitud ligamentaria. <span className="text-cyan-500 font-bold">Requiere reposición vectorial.</span>
                        </p>
                    </div>
                </div>

                {/* 3. BOTONES DE ACCIÓN (VENTA) */}
                <div className="space-y-3 pt-2">
                    {/* BOTÓN PRINCIPAL: DESCARGAR PDF */}
                    <button onClick={generatePDF} className="w-full bg-zinc-100 text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.1em] hover:bg-white hover:scale-[1.01] transition-all shadow-xl flex justify-center items-center gap-2">
                        <span>📄</span> DESCARGAR REPORTE PDF
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* VENTA PROTOCOLO */}
                        <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="bg-zinc-900 text-zinc-300 font-bold py-4 rounded-xl text-[9px] uppercase tracking-widest border border-zinc-700 hover:border-white transition-all">
                            PROTOCOLO PIEL ($35)
                        </button>
                        {/* VENTA HUMANA */}
                        <button onClick={() => window.open(HUMAN_SUPPORT_LINK)} className="bg-gradient-to-r from-cyan-900 to-black text-white font-bold py-4 rounded-xl text-[9px] uppercase tracking-widest border border-cyan-800 hover:border-cyan-500 transition-all">
                            HABLAR CON ASESORA
                        </button>
                    </div>
                </div>

                <p className="text-[8px] text-center text-zinc-600 mt-4">Tipheret Medical Systems © 2026</p>
            </div>
        </div>
      )}
    </div>
  );
}