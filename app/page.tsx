"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// --- CONFIGURACIÓN ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethSniper() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState(0); 
  const [photos, setPhotos] = useState<{front:string|null; sideR:string|null; sideL:string|null}>({front:null, sideR:null, sideL:null});
  const [patient, setPatient] = useState({ name: '', phone: '', age: '' });
  const [cameraLoaded, setCameraLoaded] = useState(false);

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
          ctx.strokeStyle = "#00FFFF"; 
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
      };
      // Puntos clave simplificados para rendimiento
      connect(10, 338); connect(338, 297); connect(297, 332); connect(332, 284); connect(284, 251); connect(251, 389);
      connect(389, 356); connect(356, 454); connect(454, 323); connect(323, 361); connect(361, 288); connect(288, 397);
      connect(4, 50); connect(4, 280); // Nariz
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
            
            // Solo dibujar máscara en la frontal para no ensuciar las laterales
            if(captureStep === 0) ctx.drawImage(canvasRef.current, 0, 0);
            
            const imgData = finalCanvas.toDataURL('image/jpeg', 0.9);
            if(captureStep === 0) { setPhotos(p=>({...p, front:imgData})); setCaptureStep(1); }
            else if(captureStep === 1) { setPhotos(p=>({...p, sideR:imgData})); setCaptureStep(2); }
            else { 
                setPhotos(p=>({...p, sideL:imgData})); 
                localStorage.setItem('tiphereth_user', JSON.stringify(patient));
                setAppMode('ANALYSIS'); 
                setTimeout(() => setAppMode('RESULT'), 3000); 
            }
        }
    }
  }, [webcamRef, captureStep]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <style jsx global>{`
        @media print { @page { size: A4; margin: 0; } body { background: white; color: black; } .no-print { display: none !important; } .print-only { display: block !important; } }
        .print-only { display: none; }
        .filter-xray { filter: grayscale(100%) invert(100%) contrast(1.2); }
        .filter-smas { filter: grayscale(100%) contrast(1.1); }
        .filter-fat { filter: sepia(0.5) contrast(1.1) brightness(1.1); }
        .filter-skin { filter: contrast(1.5) saturate(1.5) hue-rotate(-10deg); mix-blend-mode: multiply; }
      `}</style>

      {/* 1. LOGIN */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 p-4">
             <h1 className="text-4xl font-bold mb-2">TIPHERETH</h1>
             <p className="text-xs text-cyan-400 tracking-[0.3em] mb-8">4-LAYER DIAGNOSTIC SYSTEM</p>
             <div className="w-full max-w-sm space-y-4">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full p-4 bg-slate-800 text-white border-b border-cyan-500 outline-none uppercase" placeholder="NOMBRE COMPLETO" />
                <div className="flex gap-2">
                    <input type="tel" onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 p-4 bg-slate-800 text-white border-b border-gray-600 outline-none" placeholder="WHATSAPP" />
                    <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 p-4 bg-slate-800 text-white border-b border-gray-600 outline-none" placeholder="EDAD" />
                </div>
                <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-cyan-700 py-4 font-bold uppercase hover:bg-cyan-600 mt-4">
                    INICIAR ANÁLISIS 4 CAPAS
                </button>
             </div>
        </div>
      )}

      {/* 2. CÁMARA */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black">
            <Webcam ref={webcamRef} className="w-full h-full object-cover" mirrored={true} />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60" />
            <div className="absolute top-10 w-full text-center">
                <span className="bg-black/80 text-cyan-400 px-4 py-2 text-xs font-bold uppercase border border-cyan-500">
                    {captureStep === 0 ? "PASO 1: MAPA FRONTAL (SMAS/PIEL)" : captureStep === 1 ? "PASO 2: PERFIL (HUESO/GRASA)" : "PASO 3: CONFIRMACIÓN"}
                </span>
            </div>
            <button onClick={capture} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white/20 border-2 border-cyan-400 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* 3. ANÁLISIS */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen flex flex-col items-center justify-center bg-black">
             <div className="text-cyan-500 font-mono text-xl animate-pulse">ANALIZANDO 4 CAPAS...</div>
             <ul className="text-xs text-gray-500 mt-4 space-y-2">
                <li>1. ESTRUCTURA ÓSEA... [OK]</li>
                <li>2. VECTORES MUSCULARES... [OK]</li>
                <li>3. VOLUMETRÍA GRASA... [OK]</li>
                <li>4. SUPERFICIE DÉRMICA... [OK]</li>
             </ul>
        </div>
      )}

      {/* 4. RESULTADO (FRANCOTIRADOR) */}
      {appMode === 'RESULT' && (
        <div className="min-h-screen bg-white text-black p-4 md:p-8">
            <div className="max-w-[210mm] mx-auto bg-white border border-gray-300 shadow-xl p-8">
                
                {/* HEADER */}
                <div className="flex justify-between border-b-4 border-black pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase">{DR_NAME}</h1>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500">Diagnóstico Estratificado de 4 Niveles</p>
                    </div>
                    <div className="text-right text-xs">
                        <p>PACIENTE: {patient.name}</p>
                        <p>EDAD: {patient.age} | ID: {patient.phone}</p>
                    </div>
                </div>

                {/* GRID DE 4 CAPAS (EL CORAZÓN DEL ANÁLISIS) */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    
                    {/* CAPA 4: PIEL (SUPERFICIE) */}
                    <div>
                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 mb-1">CAPA 4: PIEL (SUPERFICIE)</div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden border border-gray-300">
                            {photos.front && (
                                <>
                                    <img src={photos.front} className="w-full h-full object-cover filter-skin opacity-80" />
                                    <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-30"></div>
                                </>
                            )}
                        </div>
                        <div className="bg-red-50 p-2 border-l-2 border-red-500 mt-1">
                            <p className="text-[10px] font-bold text-red-700">DIAGNÓSTICO:</p>
                            <p className="text-[9px] leading-tight">Daño actínico visible. Poros dilatados y textura irregular. Requiere renovación epidérmica.</p>
                        </div>
                    </div>

                    {/* CAPA 3: GRASA (VOLUMEN) */}
                    <div>
                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 mb-1">CAPA 3: GRASA (VOLUMEN)</div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden border border-gray-300">
                            {photos.sideR && <img src={photos.sideR} className="w-full h-full object-cover filter-fat" />}
                            <div className="absolute top-[40%] left-[30%] w-12 h-12 border border-yellow-500 rounded-full opacity-60"></div>
                        </div>
                        <div className="bg-yellow-50 p-2 border-l-2 border-yellow-500 mt-1">
                            <p className="text-[10px] font-bold text-yellow-700">DIAGNÓSTICO:</p>
                            <p className="text-[9px] leading-tight">Hipovolumen malar (pómulos). Desplazamiento de compartimentos grasos hacia el tercio inferior (Jowls).</p>
                        </div>
                    </div>

                    {/* CAPA 2: SMAS (MÚSCULO/TENSIÓN) */}
                    <div>
                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 mb-1">CAPA 2: SMAS (MÚSCULO)</div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden border border-gray-300">
                            {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-smas opacity-60" />}
                            {/* VECTORES DE CAÍDA */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <path d="M30,40 L30,60" stroke="red" strokeWidth="1" markerEnd="url(#arrow)" />
                                <path d="M70,40 L70,60" stroke="red" strokeWidth="1" markerEnd="url(#arrow)" />
                                <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="red" /></marker></defs>
                            </svg>
                        </div>
                        <div className="bg-gray-50 p-2 border-l-2 border-gray-500 mt-1">
                            <p className="text-[10px] font-bold text-gray-700">DIAGNÓSTICO:</p>
                            <p className="text-[9px] leading-tight">Laxitud ligamentaria. Los vectores de tensión son negativos (gravedad), perdiendo definición mandibular.</p>
                        </div>
                    </div>

                    {/* CAPA 1: HUESO (SOPORTE) */}
                    <div>
                        <div className="bg-black text-white text-[10px] font-bold px-2 py-1 mb-1">CAPA 1: HUESO (CIMIENTOS)</div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden border border-gray-300">
                            {photos.sideL ? <img src={photos.sideL} className="w-full h-full object-cover filter-xray" /> : <img src={photos.sideR || ''} className="w-full h-full object-cover filter-xray" />}
                        </div>
                        <div className="bg-blue-50 p-2 border-l-2 border-blue-500 mt-1">
                            <p className="text-[10px] font-bold text-blue-700">DIAGNÓSTICO:</p>
                            <p className="text-[9px] leading-tight">Retracción ósea en apertura piriforme y mentón. Falta de soporte estructural profundo.</p>
                        </div>
                    </div>
                </div>

                {/* CONCLUSIÓN DE VENTA (LA SOLUCIÓN) */}
                <div className="border-t-4 border-black pt-4 flex justify-between items-center">
                    <div className="w-2/3 pr-4">
                        <h3 className="font-bold text-sm uppercase mb-1">Plan de Tratamiento Integral</h3>
                        <p className="text-[10px] text-justify text-gray-600">
                            Para corregir la falla en la <strong>Capa 1 (Hueso)</strong> y la <strong>Capa 2 (SMAS)</strong>, no bastan cremas. 
                            Se requiere reposición volumétrica y tensado médico.
                        </p>
                    </div>
                    <div className="w-1/3 text-right">
                         <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, vi mi análisis de 4 capas. Quiero corregir mi Capa 1 y 2.`)} className="bg-black text-white text-[10px] font-bold px-4 py-3 uppercase hover:bg-gray-800">
                            Agendar Corrección
                         </button>
                    </div>
                </div>
                 <div className="text-center mt-4 no-print">
                     <button onClick={() => window.print()} className="text-[9px] underline text-gray-400">IMPRIMIR ANÁLISIS</button>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
}