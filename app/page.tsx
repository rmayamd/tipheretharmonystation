"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// --- CONFIGURACIÓN DE LUJO ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethVogueCover() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState(0); 
  const [photos, setPhotos] = useState<{front:string|null; sideR:string|null; sideL:string|null}>({front:null, sideR:null, sideL:null});
  const [patient, setPatient] = useState({ name: '', phone: '', age: '' });
  const [cameraLoaded, setCameraLoaded] = useState(false);

  // --- CARGA DATOS ---
  useEffect(() => {
    const saved = localStorage.getItem('tiphereth_user');
    if(saved) setPatient(JSON.parse(saved));
  }, []);

  // --- IA (MÁSCARA SUTIL) ---
  const onResults = useCallback((results: any) => {
    if (!canvasRef.current || !webcamRef.current?.video || appMode !== 'CAPTURE') return;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.clearRect(0, 0, videoWidth, videoHeight);
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(ctx, landmarks);
        }
      }
      ctx.restore();
    }
  }, [appMode]);

  useEffect(() => {
    if(appMode === 'CAPTURE') {
        const faceMesh = new FaceMesh({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`});
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        faceMesh.onResults(onResults);
        if (webcamRef.current?.video) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => { if(webcamRef.current?.video) await faceMesh.send({image: webcamRef.current.video}); },
                width: 1280, height: 720
            });
            camera.start();
            setCameraLoaded(true);
        }
    }
  }, [appMode, onResults]);

  const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
      const connect = (index1: number, index2: number) => {
          const p1 = landmarks[index1];
          const p2 = landmarks[index2];
          if(!p1 || !p2) return;
          ctx.beginPath();
          ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
          ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; 
          ctx.lineWidth = 0.8; 
          ctx.stroke();
      };
      connect(10, 338); connect(338, 297); connect(297, 332); connect(332, 284); connect(284, 251); 
      connect(251, 389); connect(389, 356); connect(356, 454); connect(454, 323); connect(323, 361);
      connect(361, 288); connect(288, 397); connect(397, 365); connect(365, 379); connect(379, 378);
      connect(6, 168); connect(168, 197); connect(197, 5); connect(5, 4);
  };

  const capture = React.useCallback(() => {
    if(webcamRef.current && canvasRef.current) {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = webcamRef.current.video!.videoWidth;
        finalCanvas.height = webcamRef.current.video!.videoHeight;
        const ctx = finalCanvas.getContext('2d');
        if(ctx) {
            ctx.translate(finalCanvas.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(webcamRef.current.video!, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if(captureStep === 0) ctx.drawImage(canvasRef.current, 0, 0);
            const imgData = finalCanvas.toDataURL('image/jpeg', 1.0);
            if(captureStep === 0) { setPhotos(p=>({...p, front:imgData})); setCaptureStep(1); }
            else if(captureStep === 1) { setPhotos(p=>({...p, sideR:imgData})); setCaptureStep(2); }
            else { 
                setPhotos(p=>({...p, sideL:imgData})); 
                localStorage.setItem('tiphereth_user', JSON.stringify(patient));
                setAppMode('ANALYSIS'); 
                setTimeout(() => setAppMode('RESULT'), 2500); 
            }
        }
    }
  }, [webcamRef, captureStep]);

  // --- CABECERA INTERNA ---
  const MagazineHeader = () => (
    <div className="flex justify-between items-end border-b border-black pb-6 mb-10">
        <div>
            <h1 className="text-3xl font-serif tracking-tight text-black">{DR_NAME}</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mt-2">Haute Couture Aesthetic Medicine</p>
        </div>
        <div className="text-right">
            <p className="font-serif text-xl italic text-black">{patient.name}</p>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">ID: {patient.phone}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        body { font-family: 'Lato', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .page-break { page-break-after: always; min-height: 100vh; position: relative; padding: 50px; box-sizing: border-box; }
        .filter-vascular { filter: contrast(1.3) saturate(1.5) hue-rotate(-15deg); }
        .filter-fat { filter: grayscale(100%) brightness(1.1) contrast(0.9); }
        .filter-smas { filter: grayscale(100%) contrast(1.2); }
        .filter-bone { filter: invert(100%) grayscale(100%); }
        @media print { @page { size: A4; margin: 0; } body { background: white; -webkit-print-color-adjust: exact; } .no-print { display: none !important; } .print-only { display: block !important; } }
        .print-only { display: block; }
      `}</style>

      {/* 1. LOGIN */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8">
             <div className="border border-white/20 p-12 max-w-lg w-full text-center backdrop-blur-sm">
                 <h1 className="text-6xl font-serif italic mb-2">Tiphereth</h1>
                 <p className="text-xs text-gray-400 tracking-[0.6em] uppercase mb-16">The Harmony Station</p>
                 <div className="space-y-8">
                    <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600 font-serif text-2xl" placeholder="Su Nombre" />
                    <div className="flex gap-6">
                        <input type="tel" onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600" placeholder="WhatsApp" />
                        <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600" placeholder="Edad" />
                    </div>
                    <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-white text-black py-4 font-serif italic text-xl hover:bg-gray-200 mt-8 transition-all tracking-widest">
                        Entrar al Estudio
                    </button>
                 </div>
             </div>
        </div>
      )}

      {/* 2. CÁMARA */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black">
            <Webcam ref={webcamRef} className="w-full h-full object-cover opacity-90" mirrored={true} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div className="absolute top-12 left-0 w-full text-center"><p className="text-white font-serif italic text-3xl drop-shadow-lg">{captureStep === 0 ? "Retrato Frontal" : captureStep === 1 ? "Perfil Derecho" : "Perfil Izquierdo"}</p></div>
            <button onClick={capture} className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 border border-white/50 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"><div className="w-20 h-20 bg-white/90 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"></div></button>
        </div>
      )}

      {/* 3. ANÁLISIS */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
             <h2 className="font-serif text-4xl italic mb-6">Procesando Belleza...</h2>
             <div className="w-32 h-[2px] bg-black animate-pulse"></div>
        </div>
      )}

      {/* 4. RESULTADO FINAL (REVISTA CON PORTADA) */}
      {appMode === 'RESULT' && (
        <div className="bg-[#f0f0f0] min-h-screen md:py-10">
            <div className="fixed bottom-8 right-8 z-50 no-print flex gap-4">
                 <button onClick={() => window.print()} className="bg-black text-white px-8 py-4 font-serif italic hover:scale-105 transition-transform shadow-2xl">Imprimir Revista PDF</button>
                 <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, deseo agendar mi transformación basada en mi revista personal.`)} className="bg-white text-black border border-black px-8 py-4 font-serif italic hover:bg-gray-50 transition-colors shadow-xl">Agendar Cita</button>
            </div>

            {/* --- HOJA 0: LA PORTADA MÍSTICA --- */}
            <div className="max-w-[210mm] mx-auto bg-[#fafafa] shadow-2xl page-break flex flex-col justify-between items-center text-center py-24 px-12 border-[20px] border-white outline outline-1 outline-gray-200">
                <div>
                    <p className="text-xs uppercase tracking-[0.6em] text-gray-400 mb-6">The Aesthetic Dossier</p>
                    <h1 className="text-7xl md:text-9xl font-serif tracking-tighter text-black mb-4 leading-none">TIPHERETH</h1>
                    <div className="w-32 h-1 bg-black mx-auto"></div>
                </div>

                {/* GRÁFICO ÁRBOL DE LA VIDA (ABSTRACTO/ESFERAS) */}
                <div className="relative w-64 h-96 my-12 opacity-90">
                    <svg viewBox="0 0 200 300" className="w-full h-full overflow-visible">
                        {/* Conexiones Doradas */}
                        <path d="M100,50 L100,250 M50,150 L150,150 M75,100 L125,200 M125,100 L75,200" stroke="#C4A484" strokeWidth="1.5" opacity="0.6" />
                        {/* Esferas Místicas */}
                        <circle cx="100" cy="50" r="20" fill="black" /> <circle cx="100" cy="150" r="25" fill="transparent" stroke="black" strokeWidth="2" /> <circle cx="100" cy="250" r="20" fill="black" />
                        <circle cx="50" cy="100" r="15" fill="gray" opacity="0.5" /> <circle cx="150" cy="100" r="15" fill="gray" opacity="0.5" />
                        <circle cx="50" cy="200" r="15" fill="gray" opacity="0.5" /> <circle cx="150" cy="200" r="15" fill="gray" opacity="0.5" />
                        {/* Texto Central */}
                        <text x="100" y="155" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="14" fill="black">Harmony</text>
                    </svg>
                </div>

                <div>
                    <p className="font-serif italic text-3xl mb-3 text-gray-800">The {patient.name || "Patient"} Edition</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black mb-10">{new Date().getFullYear()} Collection</p>
                    <div className="border-t-2 border-black pt-6 inline-block px-16">
                        <p className="text-base font-bold uppercase tracking-widest">{DR_NAME}</p>
                        <p className="text-[10px] text-gray-500 mt-1 tracking-widest">Medical Director</p>
                    </div>
                </div>
            </div>

            {/* --- HOJA 1: PIEL --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />
                <h2 className="text-5xl font-serif italic text-center mb-4">I. El Lienzo</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-12">Análisis de Calidad Dérmica & Luminosidad</p>
                <div className="flex gap-12 items-start mb-12 pl-8">
                    <div className="w-[45%] shadow-xl rotate-[-2deg] transition-transform hover:rotate-0">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-vascular" />}
                             <div className="absolute bottom-4 left-0 bg-black text-white px-4 py-2 text-[9px] font-bold tracking-[0.2em] uppercase">Filtro Vascular</div>
                        </div>
                    </div>
                    <div className="w-[55%] flex flex-col justify-center h-full pt-8 pr-8">
                        <div className="mb-8"><h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black inline-block pb-1">Análisis Espectral</h3><p className="text-base font-serif leading-relaxed text-gray-700">Utilizamos <strong>Espectrometría de Contraste Vascular</strong>. Esta tecnología revela la inflamación crónica silente y el daño solar acumulado que opaca su luminosidad natural.</p></div>
                        <div className="mb-8"><h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black inline-block pb-1">Hallazgos</h3><p className="text-base font-serif leading-relaxed text-gray-700">Se detecta una barrera cutánea con signos de fatiga oxidativa y textura irregular en zona T, disminuyendo la capacidad de reflejar la luz.</p></div>
                    </div>
                </div>
                <div className="bg-[#fafafa] p-8 border-l-4 border-black mx-8">
                    <h3 className="font-serif text-2xl italic mb-4">Diagnóstico & Tratamiento</h3>
                    <p className="text-base text-gray-700 mb-6 font-serif">Su piel requiere una restauración profunda de la matriz extracelular para recuperar el "Glow" característico de la juventud.</p>
                    <div className="flex justify-between items-center border-t border-gray-300 pt-6"><span className="font-bold text-sm uppercase tracking-widest">Sugerencia Experta:</span><span className="font-serif italic text-2xl">Protocolo Láser + Bio-Revitalización</span></div>
                </div>
            </div>

            {/* --- HOJA 2: VOLÚMENES --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />
                <h2 className="text-5xl font-serif italic text-center mb-4">II. La Escultura</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-12">Dinámica de Paquetes Grasos</p>
                <div className="relative mb-12 mx-8 shadow-2xl">
                     <div className="aspect-video w-full relative overflow-hidden bg-gray-100">
                         {photos.sideR && <img src={photos.sideR} className="w-full h-full object-cover filter-fat opacity-90" />}
                         <div className="absolute top-[35%] left-[40%] w-20 h-16 bg-[#C4A484]/50 rounded-full blur-md border-2 border-[#C4A484]"></div>
                         <div className="absolute top-[65%] left-[30%] w-16 h-16 bg-black/30 rounded-full blur-xl border-2 border-black transform translate-y-4"></div>
                         <div className="absolute top-8 right-8 text-right"><p className="text-[#C4A484] font-bold text-sm tracking-widest">GRASA MALAR (Soporte)</p><p className="text-black font-bold text-sm mt-2 tracking-widest">JOWL / CAÍDA (Peso)</p></div>
                     </div>
                </div>
                <div className="grid grid-cols-2 gap-12 mb-12 mx-8">
                    <div><h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black inline-block pb-1">Mapeo Volumétrico</h3><p className="text-base font-serif leading-relaxed text-gray-700">Visualizamos cómo los compartimentos grasos profundos de soporte se atrofian, y cómo los superficiales se desplazan por la gravedad.</p></div>
                    <div><h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black inline-block pb-1">Hallazgos Clínicos</h3><p className="text-base font-serif leading-relaxed text-gray-700">Existe una deflación en el tercio medio (pómulos), provocando que la piel pierda su anclaje y descienda, alterando el óvalo facial.</p></div>
                </div>
                <div className="text-center border-y-2 border-black py-8 mx-8">
                    <p className="font-serif italic text-3xl mb-4">"No es exceso de piel, es falta de soporte."</p>
                    <p className="text-sm uppercase tracking-[0.2em] font-bold">Tratamiento: Reposición Volumétrica Estratégica</p>
                </div>
            </div>

            {/* --- HOJA 3: ESTRUCTURA --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break flex flex-col">
                <MagazineHeader />
                <h2 className="text-5xl font-serif italic text-center mb-4">III. Los Cimientos</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-12">Análisis del SMAS y Soporte Óseo</p>
                <div className="grid grid-cols-2 gap-8 mb-12 mx-8 flex-grow">
                    <div className="bg-[#fafafa] p-8 flex flex-col">
                        <h3 className="text-center font-bold text-sm uppercase tracking-widest mb-6">SMAS (Tensión Muscular)</h3>
                        <div className="aspect-[3/4] relative overflow-hidden mb-6 shadow-lg rotate-1">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-smas opacity-80" />}
                             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"><path d="M30,30 L30,70" stroke="black" strokeWidth="0.8" markerEnd="url(#arrow)" /><path d="M70,30 L70,70" stroke="black" strokeWidth="0.8" markerEnd="url(#arrow)" /><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto"><path d="M0,0 L0,8 L8,4 z" fill="black" /></marker></defs></svg>
                        </div>
                        <p className="text-sm font-serif text-justify leading-relaxed mt-auto"><strong>Diagnóstico:</strong> Laxitud ligamentaria. La malla de soporte muscular ha perdido tensión, cediendo ante la gravedad.</p>
                        <p className="text-sm font-bold mt-4 text-center uppercase border border-black py-2">Rx: Tensado Ultrasónico</p>
                    </div>
                    <div className="bg-[#fafafa] p-8 flex flex-col">
                        <h3 className="text-center font-bold text-sm uppercase tracking-widest mb-6">Soporte Óseo (Estructura)</h3>
                        <div className="aspect-[3/4] relative overflow-hidden mb-6 shadow-lg rotate-[-1deg]">
                             {photos.sideL ? <img src={photos.sideL} className="w-full h-full object-cover filter-bone" /> : <img src={photos.sideR || ''} className="w-full h-full object-cover filter-bone" />}
                             <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white opacity-60"></div>
                        </div>
                        <p className="text-sm font-serif text-justify leading-relaxed mt-auto"><strong>Diagnóstico:</strong> Retracción en la apertura piriforme y mandíbula. El "marco" óseo del rostro se está contrayendo.</p>
                        <p className="text-sm font-bold mt-4 text-center uppercase border border-black py-2">Rx: Bio-Modelación Estructural</p>
                    </div>
                </div>
                <div className="bg-black text-white p-10 text-center mx-8 mb-8">
                    <p className="font-serif italic text-2xl mb-4">Su Plan de Transformación Personalizada</p>
                    <p className="text-base font-light mb-8 font-serif leading-relaxed">Hemos decodificado el lenguaje de su rostro. La combinación de <strong>Bio-Estimulación + Soporte Estructural</strong> devolverá la armonía perdida.</p>
                    <p className="text-base font-bold uppercase tracking-[0.3em] border-2 border-white inline-block px-8 py-3">Aprobado por: Dr. Ricardo Maya Romo</p>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}