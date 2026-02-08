"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// --- CONFIGURACIÓN ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO";

export default function TipherethBioMetric() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- ESTADOS ---
  const [appMode, setAppMode] = useState('HOME'); // HOME, CAPTURE, ANALYSIS, RESULT
  const [captureStep, setCaptureStep] = useState(0); // 0=Front, 1=SideR, 2=SideL
  const [photos, setPhotos] = useState<{front:string|null; sideR:string|null; sideL:string|null}>({front:null, sideR:null, sideL:null});
  const [patient, setPatient] = useState({ name: '', phone: '', age: '' });
  const [cameraLoaded, setCameraLoaded] = useState(false);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const saved = localStorage.getItem('tiphereth_user');
    if(saved) setPatient(JSON.parse(saved));
  }, []);

  // --- 1. CONFIGURACIÓN DE MEDIAPIPE (LA IA) ---
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
      
      // DIBUJAR LA MÁSCARA BIO-MÉTRICA
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(ctx, landmarks); // Función personalizada abajo
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

  // --- DIBUJAR CONECTORES (GEOMETRÍA) ---
  const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
      const connect = (index1: number, index2: number) => {
          const p1 = landmarks[index1];
          const p2 = landmarks[index2];
          if(!p1 || !p2) return;
          ctx.beginPath();
          ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
          ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
          ctx.strokeStyle = "#00FFFF"; // CIAN CIENTÍFICO
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
      };
      
      // Conectar puntos clave (Oval facial, cejas, nariz, labios)
      const points = [
          [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152], [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172], [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162], [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10]
      ];
      points.forEach(pair => connect(pair[0], pair[1]));
      
      // Cruz de Marquardt (Nariz a Pómulos)
      connect(4, 50); connect(4, 280); connect(168, 6);
  };

  // --- CAPTURA ---
  const capture = React.useCallback(() => {
    if(webcamRef.current && canvasRef.current) {
        // Crear un canvas final que combine video + máscara
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = webcamRef.current.video!.videoWidth;
        finalCanvas.height = webcamRef.current.video!.videoHeight;
        const ctx = finalCanvas.getContext('2d');
        
        if(ctx) {
            // 1. Dibujar Video (Espejo)
            ctx.translate(finalCanvas.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(webcamRef.current.video!, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
            
            // 2. Dibujar Máscara (Overlay) si es frontal
            if(captureStep === 0) {
                ctx.drawImage(canvasRef.current, 0, 0); 
            }
            
            const imgData = finalCanvas.toDataURL('image/jpeg', 0.9);
            
            if(captureStep === 0) { setPhotos(p=>({...p, front:imgData})); setCaptureStep(1); }
            else if(captureStep === 1) { setPhotos(p=>({...p, sideR:imgData})); setCaptureStep(2); }
            else { 
                setPhotos(p=>({...p, sideL:imgData})); 
                localStorage.setItem('tiphereth_user', JSON.stringify(patient));
                setAppMode('ANALYSIS'); 
                setTimeout(() => setAppMode('RESULT'), 4000); 
            }
        }
    }
  }, [webcamRef, captureStep]);

  const skinAge = patient.age ? parseInt(patient.age) + 9 : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500">
      <style jsx global>{`
        @media print { @page { size: A4; margin: 0; } body { background: white; color: black; } .no-print { display: none !important; } .print-only { display: block !important; } }
        .print-only { display: none; }
      `}</style>

      {/* 1. LOGIN */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-black p-4">
             <h1 className="text-4xl font-bold tracking-tighter mb-2">TIPHERETH</h1>
             <p className="text-[10px] text-cyan-400 tracking-[0.4em] mb-12 uppercase">V300 Bio-Metric AI</p>
             <div className="w-full max-w-sm space-y-4">
                <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-gray-900 border-l-4 border-cyan-500 p-4 text-white uppercase placeholder:text-gray-600 outline-none" placeholder="NOMBRE COMPLETO" />
                <div className="flex gap-2">
                    <input type="tel" onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-gray-900 border-l-4 border-gray-700 p-4 text-white placeholder:text-gray-600 outline-none" placeholder="WHATSAPP" />
                    <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-gray-900 border-l-4 border-gray-700 p-4 text-center text-white placeholder:text-gray-600 outline-none" placeholder="EDAD" />
                </div>
                <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-cyan-800 text-white py-4 font-bold tracking-widest uppercase hover:bg-cyan-700 mt-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    ACTIVAR ESCÁNER IA
                </button>
             </div>
        </div>
      )}

      {/* 2. CÁMARA INTELIGENTE (IA TRACKING) */}
      {appMode === 'CAPTURE' && (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Webcam Real */}
            <Webcam ref={webcamRef} className="absolute inset-0 w-full h-full object-cover" mirrored={true} videoConstraints={{facingMode:"user"}} />
            
            {/* Canvas de IA (La Máscara que se mueve) */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80" />
            
            {/* UI */}
            <div className="absolute top-10 w-full text-center">
                <span className="bg-black/70 text-cyan-400 border border-cyan-500 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                    {captureStep === 0 ? "1. RECONOCIMIENTO FACIAL" : captureStep === 1 ? "2. PERFIL DERECHO" : "3. PERFIL IZQUIERDO"}
                </span>
            </div>
            
            {!cameraLoaded && <div className="absolute inset-0 flex items-center justify-center bg-black text-cyan-500">CARGANDO MODELO NEURONAL...</div>}

            <button onClick={capture} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-cyan-500/20 border-2 border-cyan-400 rounded-full flex items-center justify-center hover:bg-cyan-900/40 z-50">
                <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
        </div>
      )}

      {/* 3. PROCESANDO */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
             <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-cyan-500 font-mono tracking-widest animate-pulse">GENERANDO GEOMETRÍA FACIAL...</p>
        </div>
      )}

      {/* 4. RESULTADO (DOSSIER CIENTÍFICO) */}
      {appMode === 'RESULT' && (
        <div className="w-full min-h-screen bg-white text-black p-4 md:p-10">
            {/* BOTÓN FLOTANTE */}
            <div className="fixed bottom-6 right-6 no-print z-50">
                <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=Dr. Maya, vi mi biometría facial. Necesito corrección.`)} className="bg-green-600 text-white px-6 py-4 rounded-full font-bold shadow-xl hover:scale-110 transition-transform uppercase text-xs tracking-widest flex items-center gap-2">
                    <span className="text-xl">💬</span> Contactar Dr. Maya
                </button>
            </div>

            <div className="max-w-[210mm] mx-auto bg-white border border-gray-200 shadow-2xl p-8 min-h-[297mm]">
                
                {/* HEADER */}
                <div className="flex justify-between border-b-4 border-black pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase">{DR_NAME}</h1>
                        <p className="text-xs font-bold text-gray-500 tracking-[0.3em] mt-1">BIOMETRÍA & PROPORCIÓN ÁUREA</p>
                    </div>
                    <div className="text-right">
                        <p className="bg-black text-white px-2 py-1 text-xs font-bold inline-block mb-1">EVIDENCE REPORT</p>
                        <p className="text-[10px] text-gray-500">ID: {patient.phone}</p>
                    </div>
                </div>

                {/* IMÁGENES DE EVIDENCIA */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* FOTO 1: CON LA MÁSCARA PUESTA */}
                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden border border-gray-300">
                        <span className="absolute top-0 left-0 bg-cyan-700 text-white text-[9px] px-2 py-1 font-bold">1. MÁSCARA BIOMÉTRICA (DETECTADA)</span>
                        {photos.front && <img src={photos.front} className="w-full h-full object-cover grayscale brightness-75" />}
                    </div>

                    {/* FOTO 2: ANÁLISIS VASCULAR (ROJO) */}
                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden border border-gray-300">
                        <span className="absolute top-0 left-0 bg-red-700 text-white text-[9px] px-2 py-1 font-bold">2. INFLAMACIÓN & ROJECES</span>
                        {photos.front && (
                            <div className="w-full h-full relative">
                                <img src={photos.front} className="w-full h-full object-cover grayscale contrast-125 brightness-110" />
                                <div className="absolute inset-0 bg-red-600 mix-blend-multiply opacity-50"></div>
                            </div>
                        )}
                    </div>

                    {/* FOTO 3: PÉRDIDA DE VOLUMEN (AZUL) */}
                    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden border border-gray-300">
                        <span className="absolute top-0 left-0 bg-blue-800 text-white text-[9px] px-2 py-1 font-bold">3. SOPORTE ÓSEO PROFUNDO</span>
                        {/* AQUÍ ESTABA EL ERROR, YA LO CORREGÍ A .sideR */}
                        {photos.sideR && <img src={photos.sideR} className="w-full h-full object-cover grayscale contrast-150" />}
                        {/* Overlay Azul Simulado */}
                        <div className="absolute inset-0 bg-blue-900 mix-blend-soft-light opacity-60"></div>
                        <div className="absolute bottom-2 right-2 text-[8px] text-white bg-black/50 px-1">PERFIL DERECHO</div>
                    </div>

                    {/* DATOS MÉDICOS */}
                    <div className="aspect-[4/5] bg-slate-50 p-6 flex flex-col justify-center border border-gray-300">
                        <h3 className="font-bold text-lg mb-4 uppercase text-center border-b border-gray-300 pb-2">Resultados Algoritmo</h3>
                        <div className="flex justify-between mb-2 text-xs"><span>Edad Real:</span><span className="font-bold">{patient.age}</span></div>
                        <div className="flex justify-between mb-4 text-lg text-red-600 font-bold border-b border-gray-300 pb-2"><span>Edad Estructural:</span><span>{skinAge}</span></div>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Soporte Malar</p>
                                <div className="w-full bg-gray-200 h-2 mt-1"><div className="bg-red-500 h-2 w-[30%]"></div></div>
                                <p className="text-[9px] text-right text-red-500 mt-1">DEFICIENTE (30%)</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Calidad Dérmica</p>
                                <div className="w-full bg-gray-200 h-2 mt-1"><div className="bg-yellow-500 h-2 w-[55%]"></div></div>
                                <p className="text-[9px] text-right text-yellow-600 mt-1">MODERADA (55%)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONCLUSIÓN & VENTA */}
                <div className="border-t-4 border-black pt-6">
                    <p className="font-bold uppercase text-sm mb-2 text-red-700">Dictamen IA:</p>
                    <p className="text-xs text-justify text-gray-700 mb-6 leading-relaxed">
                        El trazo biométrico revela asimetría facial acentuada por la pérdida de volumen en compartimentos grasos profundos. 
                        La máscara de Marquardt no alinea en el tercio medio, indicando resorción ósea maxilar. Se sugiere intervención para armonización.
                    </p>
                    
                    <div className="flex justify-center gap-4 no-print">
                         <button onClick={() => window.print()} className="underline text-xs text-gray-500">IMPRIMIR REPORTE FÍSICO</button>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}