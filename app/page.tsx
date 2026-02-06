"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const HUMAN_SUPPORT_LINK = "https://api.whatsapp.com/send?phone=573117936211&text=Hola,%20necesito%20ayuda%20humana.";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxHesi-oREB42asByNKgwk-BL65L17mThp5yrnx-4cXGrz7xbL5H0gAGbVQGOQaXQRKlA/exec"; 

export default function TipherethGlobal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS DE NAVEGACIÓN
  const [step, setStep] = useState('login'); 
  const [user, setUser] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  
  // ESTADOS DE CÁMARA Y FOTO
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [stage, setStage] = useState(''); // Texto de carga durante análisis

  // ESTADOS DEL REPORTE (PESTAÑAS)
  const [activeTab, setActiveTab] = useState('TRUTH'); // TRUTH, SKIN, VECTORS, MIRACLES, ACCESS
  const [visualMode, setVisualMode] = useState('REALITY'); // Filtros visuales

  // HERRAMIENTAS INTERACTIVAS
  const [liftLevel, setLiftLevel] = useState(0); // Vector Simulator (0-100)
  const [compareVal, setCompareVal] = useState(50); // Before/After Slider

  // CONCIERGE
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('IDLE');
  const [ticketID, setTicketID] = useState('');

  // MÉTRICAS CLÍNICAS (SIMULADAS)
  const [metrics, setMetrics] = useState({
    score: 0, bioAge: 0,
    inflammation: 0, texture: 0, pores: 0, uvDamage: 0,
    upper: 33, mid: 33, lower: 33,
    resorption: "NONE"
  });

  // FILTROS VISUALES (VISIA/VECTRA)
  const filters = {
    REALITY: "none", 
    INFLAMED: "contrast(1.5) sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.8)", 
    STRUCTURE: "grayscale(1) invert(1) contrast(2) brightness(0.7)", 
    DIVINE: "grayscale(1) contrast(1.2) brightness(1.1)" 
  };

  // --- 1. LOGIN Y PERSISTENCIA ---
  useEffect(() => {
    const savedUser = localStorage.getItem('tipheret_user_v99');
    if (savedUser) { setUser(JSON.parse(savedUser)); setStep('menu'); }
  }, []);

  const login = () => {
    if (!user.name) return;
    setLoading(true);
    localStorage.setItem('tipheret_user_v99', JSON.stringify(user));
    setTimeout(() => { setLoading(false); setStep('menu'); }, 1000);
  };

  // --- 2. CÁMARA ROBUSTA (LA QUE SÍ FUNCIONA) ---
  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    // Limpieza al salir
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraError(false);
      }
    } catch (err) {
      console.error(err);
      setCameraError(true);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0); ctx.scale(-1, 1); // Espejo
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/jpeg'));
        runAnalysisSimulation();
      }
    }
  };

  // --- 3. ANÁLISIS (SIMULACIÓN DE MÁQUINAS) ---
  const runAnalysisSimulation = async () => {
    setStep('analysis');
    setStage("CONECTANDO VISIA..."); await new Promise(r => setTimeout(r, 800));
    setStage("ESCANEO DE VECTORES..."); await new Promise(r => setTimeout(r, 800));
    setStage("ANÁLISIS DE HUESO..."); await new Promise(r => setTimeout(r, 800));
    
    // Generar datos
    const isSevere = Math.random() < 0.6;
    setMetrics({
        score: isSevere ? 68 : 85,
        bioAge: isSevere ? 48 : 38,
        inflammation: isSevere ? 75 : 30, 
        texture: isSevere ? 55 : 88, 
        pores: isSevere ? 45 : 80, 
        uvDamage: isSevere ? 60 : 20,
        upper: 33.1, mid: 34.5, lower: isSevere ? 32.4 : 33.0,
        resorption: isSevere ? "SEVERE (Grade III)" : "MILD (Grade I)"
    });
    
    setStep('report');
  };

  // --- 4. CONCIERGE (RESERVA) ---
  const submitBooking = async (urgency: string) => {
    setBookingStatus('SENDING');
    const newTicket = `TPH-${Math.floor(Math.random() * 90000) + 10000}`;
    setTicketID(newTicket);
    await new Promise(r => setTimeout(r, 2000));
    setBookingStatus('SUCCESS');
  };

  // COMPONENTE: BARRA MÉTRICA
  const MetricBar = ({ label, val, reverse = false }: any) => {
    let color = "bg-green-500";
    if (!reverse) { if (val < 50) color = "bg-red-500"; else if (val < 80) color = "bg-amber-500"; }
    else { if (val > 60) color = "bg-red-500"; else if (val > 30) color = "bg-amber-500"; else color = "bg-green-500"; }
    return (
        <div className="mb-2"><div className="flex justify-between text-[8px] uppercase tracking-widest text-zinc-400 mb-1"><span>{label}</span><span>{val}%</span></div><div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full ${color} transition-all duration-1000`} style={{width: `${val}%`}}></div></div></div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col items-center selection:bg-amber-500 overflow-x-hidden">
      
      {loading && (<div className="fixed inset-0 bg-black z-50 flex items-center justify-center"><div className="w-12 h-12 border-t-2 border-amber-500 rounded-full animate-spin"></div></div>)}

      {/* --- MODAL CONCIERGE --- */}
      {bookingMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in">
            <div className="w-full max-w-md border border-amber-900/50 rounded-2xl p-6 bg-zinc-900/50 shadow-2xl relative">
                <button onClick={() => setBookingMode(false)} className="absolute top-2 right-4 text-zinc-500 text-2xl">×</button>
                {bookingStatus === 'IDLE' && (
                    <>
                        <h3 className="text-xl font-thin text-white mb-2 text-center">SURGICAL ACCESS</h3>
                        <p className="text-[9px] text-zinc-400 text-center uppercase tracking-widest mb-6">Elige tu vía de acceso</p>
                        <div className="space-y-3 mb-6">
                            <button onClick={() => submitBooking('PRIORITY')} className="w-full p-4 border border-amber-500/30 bg-amber-900/10 rounded-xl hover:bg-amber-900/20 text-left group"><span className="block text-amber-500 font-bold text-xs uppercase group-hover:text-amber-400">📅 Ticket Prioritario</span><span className="text-[9px] text-zinc-500">Sistema Automático</span></button>
                            <button onClick={() => window.open(HUMAN_SUPPORT_LINK)} className="w-full p-4 border border-zinc-700 bg-zinc-800 rounded-xl hover:bg-zinc-700 text-left flex justify-between items-center"><div><span className="block text-white font-bold text-xs uppercase">👤 Hablar con Asesor</span><span className="text-[9px] text-zinc-400">WhatsApp Humano</span></div><span className="text-lg">💬</span></button>
                        </div>
                    </>
                )}
                {bookingStatus === 'SENDING' && (<div className="text-center py-10"><p className="text-amber-500 text-[10px] animate-pulse">GENERANDO TICKET...</p></div>)}
                {bookingStatus === 'SUCCESS' && (<div className="text-center py-6"><h3 className="text-xl text-white font-light mb-1">TICKET: {ticketID}</h3><p className="text-xs text-zinc-400 mb-6">Recibido. Te contactaremos en breve.</p><button onClick={() => { setBookingMode(false); setBookingStatus('IDLE'); }} className="w-full bg-white text-black font-bold py-3 rounded text-[10px] uppercase">CERRAR</button></div>)}
            </div>
        </div>
      )}

      {/* 1. LOGIN */}
      {step === 'login' && (
        <div className="w-full max-w-md p-8 mt-20 text-center animate-in fade-in">
            <h1 className="text-5xl font-thin text-white mb-4 tracking-tighter">TIPHERET</h1>
            <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] mb-12">Medical Diary & Simulator</p>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                <input onChange={e => setUser({...user, name: e.target.value})} placeholder="TU NOMBRE" className="w-full bg-black border-b border-zinc-600 p-4 text-center text-white outline-none focus:border-amber-500 mb-4" />
                <button onClick={login} disabled={!user.name} className="w-full bg-white text-black font-bold py-4 rounded hover:bg-amber-400 transition-all tracking-widest text-xs">INGRESAR</button>
            </div>
        </div>
      )}

      {/* 2. MENU */}
      {step === 'menu' && (
        <div className="w-full max-w-md p-6 mt-8 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
                <h2 className="text-xl text-white font-light">Hola, {user.name}</h2>
                <button onClick={() => window.open(HUMAN_SUPPORT_LINK)} className="text-[9px] bg-zinc-800 px-3 py-1 rounded-full text-zinc-300 border border-zinc-600">SOPORTE</button>
            </div>
            <button onClick={() => setStep('camera')} className="group relative w-full h-64 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500 transition-all duration-500 shadow-2xl mb-4">
                <img src="https://images.unsplash.com/photo-1616886479361-b4c2b998399c?auto=format&fit=crop&q=80&w=500" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-left">
                    <span className="text-amber-500 text-[9px] font-bold tracking-[0.2em] block mb-2">SIMULADOR DE VECTORES</span>
                    <span className="text-3xl text-white font-thin block tracking-tighter italic">ESCANEAR ROSTRO</span>
                </div>
            </button>
        </div>
      )}

      {/* 3. CÁMARA */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black">
            {cameraError ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <p className="text-red-500 font-bold mb-4">Error de Cámara</p>
                    <p className="text-xs text-zinc-400">Por favor permite el acceso o usa otro navegador.</p>
                    <button onClick={() => setStep('menu')} className="mt-4 text-white underline">Volver</button>
                </div>
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30"><div className="w-64 h-80 border-2 border-dashed border-cyan-500 rounded-[50%]"></div></div>
                    <div className="absolute bottom-10 inset-x-0 flex flex-col items-center z-20">
                        <p className="text-white bg-black/50 px-4 py-1 rounded-full text-xs mb-4 backdrop-blur">Ubica tu rostro en el centro</p>
                        <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-zinc-300 shadow-[0_0_30px_white] hover:scale-105 transition-transform"></button>
                    </div>
                </>
            )}
        </div>
      )}

      {/* 4. ANÁLISIS (TRANSICIÓN) */}
      {step === 'analysis' && (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-black">
            <div className="w-full max-w-md aspect-[3/4] relative overflow-hidden rounded-2xl border border-amber-500/30">
                {photo && <img src={photo} className="w-full h-full object-cover opacity-50 grayscale" />}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="w-full h-1 bg-amber-500/50 absolute top-1/2 animate-pulse"></div>
                    <p className="bg-black/80 px-4 py-2 text-amber-500 font-mono text-xs tracking-widest mt-8">{stage}</p>
                </div>
            </div>
        </div>
      )}

      {/* 5. REPORTE COMPLETO (INTEGRACIÓN) */}
      {step === 'report' && photo && (
        <div className="w-full max-w-md bg-black min-h-screen pb-20 animate-in fade-in duration-1000">
            
            {/* TABS NAVEGACIÓN */}
            <div className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/10 flex justify-between px-4 pt-4 pb-2 overflow-x-auto scrollbar-hide">
                {['TRUTH', 'SKIN', 'VECTORS', 'MIRACLES', 'ACCESS'].map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); 
                        if(tab === 'TRUTH') setVisualMode('REALITY');
                        if(tab === 'SKIN') setVisualMode('INFLAMED');
                        if(tab === 'VECTORS') setVisualMode('STRUCTURE');
                        if(tab === 'MIRACLES') setVisualMode('DIVINE');
                    }} className={`text-[9px] font-bold px-4 py-3 rounded-full border transition-all whitespace-nowrap ${activeTab === tab ? 'bg-amber-900/20 border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-white'}`}>
                        {tab === 'TRUTH' ? 'RESUMEN' : tab === 'SKIN' ? 'PIEL' : tab === 'VECTORS' ? 'LIFTING' : tab === 'MIRACLES' ? 'MILAGROS' : 'ACCESO'}
                    </button>
                ))}
            </div>

            {/* VISOR PRINCIPAL CON LA FOTO CAPTURADA */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden border-b border-white/10">
                <div className="w-full h-full transition-transform duration-100 ease-out origin-bottom" 
                     style={{ 
                        filter: filters[visualMode as keyof typeof filters], 
                        transform: activeTab === 'VECTORS' ? `scaleY(${1 + (liftLevel/400)}) translateY(-${liftLevel/10}%)` : 'none' 
                     }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                {/* MALLA DE VECTORES (SOLO EN TAB VECTORS) */}
                {activeTab === 'VECTORS' && (
                    <div className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-100 ease-out" style={{ transform: `scaleY(${1 + (liftLevel/400)}) translateY(-${liftLevel/6}%)` }}>
                        <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full"><p className="text-[10px] text-cyan-400 font-bold">SIMULACIÓN: {liftLevel}%</p></div>
                    </div>
                )}
            </div>

            {/* CONTENIDO DE LAS PESTAÑAS */}
            <div className="p-6">
                
                {/* 1. RESUMEN (TRUTH) */}
                {activeTab === 'TRUTH' && (
                    <div className="text-center animate-in slide-in-from-right">
                        <h2 className="text-5xl font-thin text-white mb-2">{metrics.score}/100</h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-6">PUNTAJE DE HOY</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center"><p className="text-[8px] text-zinc-500 uppercase">EDAD REAL</p><p className="text-xl font-bold text-white">40</p></div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center relative"><p className="text-[8px] text-red-500 uppercase">EDAD BIOLÓGICA</p><p className="text-xl font-bold text-red-500">{metrics.bioAge}</p></div>
                        </div>
                        <button onClick={() => setActiveTab('VECTORS')} className="text-cyan-400 text-xs underline uppercase tracking-widest mt-4">IR AL SIMULADOR DE LIFTING ➜</button>
                    </div>
                )}

                {/* 2. LIFTING (VECTORS) - EL DEDO MÁGICO */}
                {activeTab === 'VECTORS' && (
                    <div className="animate-in slide-in-from-right">
                        <p className="text-center text-zinc-400 text-xs mb-2">Desliza para ver el efecto del Lifting</p>
                        <input type="range" min="0" max="100" value={liftLevel} onChange={(e) => setLiftLevel(Number(e.target.value))} className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer mb-6 accent-cyan-500" />
                        
                        <div className="space-y-3">
                            <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-3"><span className="text-2xl">⚠️</span><div><p className="text-[10px] text-red-400 font-bold uppercase">DIAGNÓSTICO:</p><p className="text-xs text-white">Caída de tejidos por falta de soporte óseo.</p></div></div>
                            <button onClick={() => setBookingMode(true)} className="w-full bg-white text-black font-bold py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-cyan-400 shadow-[0_0_20px_rgba(255,255,255,0.2)]">QUIERO ESTE RESULTADO</button>
                        </div>
                    </div>
                )}

                {/* 3. PIEL (SKIN) */}
                {activeTab === 'SKIN' && (
                    <div className="animate-in slide-in-from-right">
                         <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-white uppercase tracking-widest">MAPA DE INFLAMACIÓN</h3><span className="text-[9px] text-red-500 border border-red-500/50 px-2 py-1 rounded">DETECTADA</span></div>
                         <MetricBar label="Inflamación" val={metrics.inflammation} reverse={true} />
                         <MetricBar label="Poros" val={metrics.pores} reverse={true} />
                         <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full mt-4 bg-zinc-800 text-white py-3 rounded border border-zinc-600 font-bold text-[10px] uppercase tracking-widest hover:bg-red-900 hover:border-red-500">DESCARGAR PROTOCOLO ($35)</button>
                    </div>
                )}

                {/* 4. MILAGROS (ANTES/DESPUÉS) */}
                {activeTab === 'MIRACLES' && (
                    <div className="animate-in slide-in-from-right">
                        <h3 className="text-center text-white font-thin mb-4 uppercase tracking-widest">POSIBILIDAD REAL</h3>
                        <div className="relative w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-4 border border-zinc-700">
                             <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover" style={{filter: filters.INFLAMED}} />
                             <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ width: `${compareVal}%` }}><img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full max-w-none object-cover" style={{filter: filters.DIVINE}} /><div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_white]"></div></div>
                             <input type="range" min="0" max="100" value={compareVal} onChange={(e) => setCompareVal(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
                             <span className="absolute top-2 left-2 bg-red-900/80 text-white text-[7px] font-bold px-2 py-1 rounded backdrop-blur">ANTES</span><span className="absolute top-2 right-2 bg-green-900/80 text-white text-[7px] font-bold px-2 py-1 rounded backdrop-blur">DESPUÉS</span>
                        </div>
                        <button onClick={() => window.open(HOTMART_EBOOK_URL)} className="w-full bg-zinc-800 text-white py-3 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-amber-500">QUIERO ESTA TRANSFORMACIÓN</button>
                    </div>
                )}

                {/* 5. ACCESO (CONCIERGE) */}
                {activeTab === 'ACCESS' && (
                    <div className="animate-in slide-in-from-right text-center">
                        <h3 className="text-white font-bold mb-4 uppercase">¿LISTO PARA ASCENDER?</h3>
                        <button onClick={() => setBookingMode(true)} className="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all mb-4">ABRIR CONCIERGE QUIRÚRGICO</button>
                        <p className="text-[10px] text-zinc-500">Sistema Seguro de Tickets • Acceso Prioritario</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}