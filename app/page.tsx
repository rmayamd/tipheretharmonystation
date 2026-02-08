"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// --- CONFIGURACIÓN DE LUJO ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethVogue() {
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

  // --- IA (MÁSCARA) ---
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
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; 
          ctx.lineWidth = 1;
          ctx.stroke();
      };
      // Dibujo sutil para no tapar la cara
      connect(10, 338); connect(338, 297); connect(297, 332); connect(332, 284); connect(284, 251); 
      connect(251, 389); connect(389, 356); connect(356, 454); connect(454, 323); connect(323, 361);
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
            
            // Solo dibujar máscara en la frontal
            if(captureStep === 0) ctx.drawImage(canvasRef.current, 0, 0);
            
            const imgData = finalCanvas.toDataURL('image/jpeg', 1.0); // Alta calidad
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

  // --- COMPONENTE DE CABECERA REPETITIVA ---
  const MagazineHeader = () => (
    <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
        <div>
            <h1 className="text-3xl font-serif tracking-tight text-black">{DR_NAME}</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-1">Advanced Aesthetic Medicine</p>
        </div>
        <div className="text-right">
            <p className="font-serif text-lg italic text-black">{patient.name}</p>
            <p className="text-[9px] uppercase tracking-widest text-gray-400">ID: {patient.phone} | AGE: {patient.age}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* ESTILOS DE REVISTA Y PAGINACIÓN */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        
        body { font-family: 'Lato', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .page-break { page-break-after: always; min-height: 100vh; position: relative; padding: 40px; box-sizing: border-box; }
        
        /* Filtros Médicos Estéticos */
        .filter-vascular { filter: contrast(1.3) saturate(1.5) hue-rotate(-15deg); }
        .filter-fat { filter: grayscale(100%) brightness(1.1) contrast(0.9); }
        .filter-smas { filter: grayscale(100%) contrast(1.2); }
        .filter-bone { filter: invert(100%) grayscale(100%); }

        @media print { 
            @page { size: A4; margin: 0; } 
            body { background: white; -webkit-print-color-adjust: exact; } 
            .no-print { display: none !important; } 
            .print-only { display: block !important; }
        }
        .print-only { display: block; }
      `}</style>

      {/* 1. LOGIN DE LUJO */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-8">
             <div className="border border-white/30 p-12 max-w-lg w-full text-center">
                 <h1 className="text-5xl font-serif italic mb-2">Tiphereth</h1>
                 <p className="text-xs text-gray-400 tracking-[0.5em] uppercase mb-12">The Harmony Station</p>
                 
                 <div className="space-y-6">
                    <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-transparent border-b border-gray-600 p-3 text-center text-white outline-none placeholder:text-gray-700 font-serif text-xl" placeholder="Su Nombre" />
                    <div className="flex gap-4">
                        <input type="tel" onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-transparent border-b border-gray-600 p-3 text-center text-white outline-none placeholder:text-gray-700" placeholder="WhatsApp" />
                        <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-transparent border-b border-gray-600 p-3 text-center text-white outline-none placeholder:text-gray-700" placeholder="Edad" />
                    </div>
                    <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-white text-black py-4 font-serif italic text-lg hover:bg-gray-200 mt-6 transition-all">
                        Iniciar Experiencia
                    </button>
                 </div>
             </div>
        </div>
      )}

      {/* 2. CÁMARA (CLEAN) */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black">
            <Webcam ref={webcamRef} className="w-full h-full object-cover opacity-90" mirrored={true} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            
            <div className="absolute top-12 left-0 w-full text-center">
                <p className="text-white font-serif italic text-2xl drop-shadow-lg">
                    {captureStep === 0 ? "Retrato Frontal" : captureStep === 1 ? "Perfil Derecho" : "Perfil Izquierdo"}
                </p>
            </div>
            
            <button onClick={capture} className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-20 border border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
                <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
            </button>
        </div>
      )}

      {/* 3. TRANSICIÓN */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
             <h2 className="font-serif text-3xl italic mb-4">Analizando Estructura...</h2>
             <div className="w-24 h-[1px] bg-black animate-pulse"></div>
        </div>
      )}

      {/* 4. RESULTADO (REVISTA VOGUE / PDF) */}
      {appMode === 'RESULT' && (
        <div className="bg-gray-100 min-h-screen md:py-10">
            
            {/* BOTÓN FLOTANTE (NO IMPRIMIR) */}
            <div className="fixed bottom-8 right-8 z-50 no-print flex gap-4">
                 <button onClick={() => window.print()} className="bg-black text-white px-8 py-4 font-serif italic hover:scale-105 transition-transform shadow-2xl">
                    Imprimir Revista PDF
                 </button>
                 <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, deseo agendar mi transformación basada en mi análisis.`)} className="bg-white text-black border border-black px-8 py-4 font-serif italic hover:bg-gray-50 transition-colors shadow-xl">
                    Agendar Cita
                 </button>
            </div>

            {/* --- PÁGINA 1: LA PIEL (EL LIENZO) --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />
                
                <h2 className="text-4xl font-serif italic text-center mb-2">Capítulo I: El Lienzo</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">Análisis de Calidad Dérmica & Luminosidad</p>

                <div className="flex gap-8 items-start mb-8">
                    <div className="w-1/2">
                        {/* FOTO CON FILTRO VASCULAR */}
                        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-vascular" />}
                             <div className="absolute bottom-0 left-0 bg-white px-3 py-1 text-[10px] font-bold tracking-widest">FILTRO: MAPA VASCULAR</div>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center h-full pt-10">
                        <div className="mb-6">
                            <h3 className="font-bold uppercase text-xs mb-2 border-b border-black inline-block">Herramienta de Análisis</h3>
                            <p className="text-sm font-light text-justify leading-relaxed text-gray-700">
                                Utilizamos <strong>Espectrometría de Contraste Vascular</strong>. Esta tecnología aísla la hemoglobina para revelar inflamación crónica silente y daño solar acumulado (foto-envejecimiento) que opaca la luminosidad natural del rostro.
                            </p>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-bold uppercase text-xs mb-2 border-b border-black inline-block">Hallazgos</h3>
                            <p className="text-sm font-light text-justify leading-relaxed text-gray-700">
                                Se detecta una textura irregular con poros dilatados en zona T. La barrera cutánea muestra signos de fatiga oxidativa, disminuyendo la capacidad de reflejar la luz.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-l-2 border-black">
                    <h3 className="font-serif text-xl italic mb-2">Diagnóstico & Tratamiento</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Su piel requiere una restauración de la matriz extracelular para recuperar el "Glow" característico de la juventud.
                    </p>
                    <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                        <span className="font-bold text-xs uppercase">Sugerencia Experta:</span>
                        <span className="font-serif italic text-lg">Protocolo Láser + Bio-Revitalización</span>
                    </div>
                </div>
            </div>

            {/* --- PÁGINA 2: VOLÚMENES (LA ESCULTURA) --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />

                <h2 className="text-4xl font-serif italic text-center mb-2">Capítulo II: La Escultura</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">Dinámica de Paquetes Grasos Superficiales y Profundos</p>

                <div className="relative mb-8">
                     {/* FOTO CON ANÁLISIS DE GRASA */}
                     <div className="aspect-video w-full relative overflow-hidden bg-gray-100">
                         {photos.sideR && <img src={photos.sideR} className="w-full h-full object-cover filter-fat opacity-80" />}
                         {/* DIBUJOS DE PAQUETES GRASOS */}
                         <div className="absolute top-[35%] left-[40%] w-16 h-12 bg-yellow-400/40 rounded-full blur-md border border-yellow-200"></div>
                         <div className="absolute top-[60%] left-[35%] w-14 h-14 bg-red-400/30 rounded-full blur-xl border border-red-200 transform translate-y-4"></div>
                         
                         <div className="absolute top-4 right-4 text-right">
                             <p className="text-yellow-600 font-bold text-xs">GRASA MALAR (Profunda)</p>
                             <p className="text-red-800 font-bold text-xs mt-1">JOWL / CAÍDA (Superficial)</p>
                         </div>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-2 border-b border-black inline-block">Tecnología Aplicada</h3>
                        <p className="text-sm font-light text-justify leading-relaxed text-gray-700">
                            Aplicamos <strong>Mapeo Volumétrico Diferencial</strong>. Esto nos permite visualizar cómo los compartimentos grasos profundos (que dan soporte) se atrofian, y cómo los superficiales se desplazan caudalmente por la gravedad.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold uppercase text-xs mb-2 border-b border-black inline-block">Hallazgos Clínicos</h3>
                        <p className="text-sm font-light text-justify leading-relaxed text-gray-700">
                            Existe una deflación en el tercio medio (pómulos), lo que ha provocado que la piel "sobre" y caiga, formando el surco nasogeniano y alterando el óvalo facial.
                        </p>
                    </div>
                </div>

                <div className="text-center border-y border-black py-6">
                    <p className="font-serif italic text-2xl mb-2">"No es exceso de piel, es falta de soporte."</p>
                    <p className="text-xs uppercase tracking-widest font-bold">Tratamiento Sugerido: Reposición Volumétrica Estratégica</p>
                </div>
            </div>

            {/* --- PÁGINA 3: ESTRUCTURA (CIMIENTOS SMAS Y HUESO) --- */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />

                <h2 className="text-4xl font-serif italic text-center mb-2">Capítulo III: Los Cimientos</h2>
                <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">Análisis del SMAS y Soporte Óseo</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    
                    {/* SECCIÓN SMAS */}
                    <div className="bg-gray-50 p-4">
                        <h3 className="text-center font-bold text-sm mb-4">EVALUACIÓN DEL SMAS (Músculo)</h3>
                        <div className="aspect-square relative overflow-hidden mb-4">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-smas opacity-70" />}
                             {/* VECTORES */}
                             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <path d="M30,30 L30,60" stroke="black" strokeWidth="0.5" markerEnd="url(#arrow)" />
                                <path d="M70,30 L70,60" stroke="black" strokeWidth="0.5" markerEnd="url(#arrow)" />
                                <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="black" /></marker></defs>
                             </svg>
                        </div>
                        <p className="text-[10px] text-justify leading-tight mb-2">
                            <strong>Método:</strong> Vectorización de Tensión.
                        </p>
                        <p className="text-[10px] text-justify leading-tight">
                            <strong>Diagnóstico:</strong> Laxitud ligamentaria. La malla de soporte muscular ha perdido tensión, cediendo ante la gravedad.
                        </p>
                         <p className="text-[10px] font-bold mt-2 text-center uppercase">Rx: Tensado Ultrasónico / Hilos</p>
                    </div>

                    {/* SECCIÓN HUESO */}
                    <div className="bg-gray-50 p-4">
                        <h3 className="text-center font-bold text-sm mb-4">SOPORTE ÓSEO (Estructura)</h3>
                        <div className="aspect-square relative overflow-hidden mb-4">
                             {photos.sideL ? <img src={photos.sideL} className="w-full h-full object-cover filter-bone" /> : <img src={photos.sideR || ''} className="w-full h-full object-cover filter-bone" />}
                             <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white opacity-50"></div>
                        </div>
                        <p className="text-[10px] text-justify leading-tight mb-2">
                            <strong>Método:</strong> Proyección de Perfil Digital.
                        </p>
                        <p className="text-[10px] text-justify leading-tight">
                            <strong>Diagnóstico:</strong> Retracción en la apertura piriforme y mandíbula. El "marco" del rostro se está haciendo más pequeño.
                        </p>
                        <p className="text-[10px] font-bold mt-2 text-center uppercase">Rx: Bio-Modelación Estructural</p>
                    </div>

                </div>

                <div className="mt-auto pt-8">
                    <div className="bg-black text-white p-8 text-center">
                        <p className="font-serif italic text-xl mb-4">Su Plan de Transformación Personalizada</p>
                        <p className="text-xs font-light mb-6">
                            Hemos decodificado el lenguaje de su rostro. La combinación de <strong>Bio-Estimulación + Soporte Estructural</strong> devolverá la armonía perdida.
                        </p>
                        <p className="text-sm font-bold uppercase tracking-widest border border-white inline-block px-6 py-2">
                            Aprobado por: Dr. Ricardo Maya Romo
                        </p>
                    </div>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}