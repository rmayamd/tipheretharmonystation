"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import {
  analyzeSkinFromImageDataUrl,
  getMicroneedlingRx,
  getSkinFindings,
  type SkinAnalysisResult,
} from '@/lib/maya-vision/simple-skin-analysis';

// --- CONFIGURACIÓN BLINDADA ---
const WS_NUMBER = "573117936211";
const DR_NAME = "DR. RICARDO MAYA ROMO"; 

// --- LINKS DINÁMICOS DE HOTMART ---
const EBOOK_LINKS = {
    ES: "https://go.hotmart.com/G104238384O", // Español
    EN: "https://go.hotmart.com/S104239705W", // Inglés
    PT: "https://go.hotmart.com/S104239705W"  // Portugués
};

const CONTENT = {
    ES: {
        subtitle: "The Harmony Station", placeholderName: "SU NOMBRE", placeholderAge: "EDAD", enterBtn: "ENTRAR AL ESTUDIO",
        step1: "Frente + Escote", step2: "Perfil Derecho", step3: "Perfil Izquierdo", processing: "Escaneando Piel y Estructura...",
        coverTitle: "The Aesthetic Dossier", coverCollection: "Collection", director: "Director Médico", edition: "Edition",
        
        // Pág 1: PIEL
        ch1Title: "I. El Lienzo", ch1Sub: "Análisis de Calidad Dérmica", filterVasc: "Filtro Vascular",
        analysisTitle: "Análisis Espectral", analysisText: "Utilizamos Espectrometría de Contraste Vascular. Revela la inflamación crónica silente y el daño solar acumulado.",
        findingTitle: "Hallazgos", findingText: "Se detecta una barrera cutánea con signos de fatiga oxidativa y textura irregular, disminuyendo la luminosidad.",
        dxTitle: "Diagnóstico & Tratamiento", dxText: "Su piel requiere una restauración profunda de la matriz extracelular para recuperar el 'Glow'.", suggestion: "Sugerencia Experta", rx1: "Microneedling + Bio-Revitalización",
        
        // Pág 2: VOLUMEN
        ch2Title: "II. La Escultura", ch2Sub: "Dinámica de Paquetes Grasos", tagCheek: "▲ PÓMULO", tagJowl: "▼ JOWL",
        mapTitle: "Mapeo Volumétrico", mapText: "Visualizamos cómo los compartimentos de soporte se atrofian y los superficiales caen por gravedad.",
        cliTitle: "Hallazgos Clínicos", cliText: "Existe deflación en el tercio medio (pómulos), provocando que la piel pierda su anclaje y descienda.",
        quote: "No es exceso de piel, es falta de soporte.", txVol: "Tratamiento: Reposición Volumétrica",
        
        // Pág 3: ESTRUCTURA, CUELLO Y ESCOTE (NUEVO)
        ch3Title: "III. Cimientos y Escote", ch3Sub: "SMAS, Perfil y Calidad de Cuello",
        smasTitle: "SMAS (Tensión)", smasDx: "Dx: Laxitud ligamentaria y pérdida de tensión muscular.",
        boneTitle: "Perfil Cervical", boneDx: "Dx: Pérdida del ángulo de la juventud (90°).",
        neckTag: "Ángulo Cervical",
        
        // NUEVA SECCIÓN ESCOTE
        decoTitle: "Análisis de Escote (Décolleté)",
        decoDx: "Dx: Signos de Elastosis Solar y líneas horizontales (Anillos de Venus / Tech-Neck). La piel del cuello muestra adelgazamiento.",
        decoTx: "Rx: Bio-Estimuladores + Hilos",

        planTitle: "Su Plan de Transformación", optA: "Opción A: Médico", optADesc: "Intervención experta en consultorio.", btnBook: "Agendar Cita",
        optB: "Opción B: Casa", optBDesc: "Guía digital de cuidados.", btnBuy: "Comprar Ebook", approved: "Aprobado por", print: "Imprimir PDF", whatsapp: "Hola Dr. Maya, vi mi revista digital y quiero agendar."
    },
    EN: {
        subtitle: "The Harmony Station", placeholderName: "YOUR NAME", placeholderAge: "AGE", enterBtn: "ENTER STUDIO",
        step1: "Front + Décolleté", step2: "Right Profile", step3: "Left Profile", processing: "Scanning Skin & Structure...",
        coverTitle: "The Aesthetic Dossier", coverCollection: "Collection", director: "Medical Director", edition: "Edition",
        
        ch1Title: "I. The Canvas", ch1Sub: "Dermal Quality Analysis", filterVasc: "Vascular Filter",
        analysisTitle: "Spectral Analysis", analysisText: "We use Vascular Contrast Spectrometry. It reveals silent chronic inflammation and accumulated sun damage.",
        findingTitle: "Findings", findingText: "A skin barrier with signs of oxidative fatigue and irregular texture is detected, diminishing luminosity.",
        dxTitle: "Diagnosis & Treatment", dxText: "Your skin requires deep restoration of the extracellular matrix to recover its natural 'Glow'.", suggestion: "Expert Suggestion", rx1: "Microneedling + Bio-Revitalization",
        
        ch2Title: "II. The Sculpture", ch2Sub: "Fat Pad Dynamics", tagCheek: "▲ CHEEK", tagJowl: "▼ JOWL",
        mapTitle: "Volumetric Mapping", mapText: "We visualize how support compartments atrophy and superficial ones descend due to gravity.",
        cliTitle: "Clinical Findings", cliText: "There is deflation in the mid-face (cheeks), causing the skin to lose its anchor and descend.",
        quote: "It's not excess skin, it's lack of support.", txVol: "Treatment: Volumetric Repositioning",
        
        ch3Title: "III. Foundation & Neck", ch3Sub: "SMAS, Profile & Neck Quality",
        smasTitle: "SMAS (Tension)", smasDx: "Dx: Ligamentous laxity and loss of muscle tension.",
        boneTitle: "Cervical Profile", boneDx: "Dx: Loss of the angle of youth (90°).",
        neckTag: "Cervical Angle",
        
        decoTitle: "Décolleté Analysis",
        decoDx: "Dx: Signs of Solar Elastosis and horizontal lines (Venus Rings / Tech-Neck). Neck skin shows thinning.",
        decoTx: "Rx: Bio-Stimulators + Threads",

        planTitle: "Your Transformation Plan", optA: "Option A: Medical", optADesc: "Expert office intervention.", btnBook: "Book Appointment",
        optB: "Option B: At Home", optBDesc: "Digital care guide.", btnBuy: "Buy Ebook", approved: "Approved by", print: "Print PDF", whatsapp: "Hello Dr. Maya, I saw my digital magazine and I want to book."
    },
    PT: {
        subtitle: "A Estação da Harmonia", placeholderName: "SEU NOME", placeholderAge: "IDADE", enterBtn: "ENTRAR NO ESTÚDIO",
        step1: "Frente + Colo", step2: "Perfil Direito", step3: "Perfil Esquerdo", processing: "Escaneando Pele e Estrutura...",
        coverTitle: "Dossiê Estético", coverCollection: "Coleção", director: "Diretor Médico", edition: "Edição",
        
        ch1Title: "I. A Tela", ch1Sub: "Análise de Qualidade Dérmica", filterVasc: "Filtro Vascular",
        analysisTitle: "Análise Espectral", analysisText: "Utilizamos Espectrometria de Contraste Vascular. Revela inflamação crônica silenciosa e dano solar acumulado.",
        findingTitle: "Achados", findingText: "Detecta-se uma barreira cutânea com sinais de fadiga oxidativa e textura irregular, diminuindo a luminosidade.",
        dxTitle: "Diagnóstico & Tratamento", dxText: "Sua pele requer uma restauração profunda da matriz extracelular para recuperar o 'Glow' natural.", suggestion: "Sugestão de Especialista", rx1: "Microneedling + Bio-Revitalização",
        
        ch2Title: "II. A Escultura", ch2Sub: "Dinâmica dos Compartimentos de Gordura", tagCheek: "▲ MALAR", tagJowl: "▼ JOWL",
        mapTitle: "Mapeamento Volumétrico", mapText: "Visualizamos como os compartimentos de suporte atrofiam e os superficiais descem pela gravidade.",
        cliTitle: "Achados Clínicos", cliText: "Existe deflação no terço médio (maçãs do rosto), fazendo com que a pele perca sua ancoragem e desça.",
        quote: "Não é excesso de pele, é falta de suporte.", txVol: "Tratamento: Reposição Volumétrica",
        
        ch3Title: "III. Fundamentos e Colo", ch3Sub: "SMAS, Perfil e Qualidade do Pescoço",
        smasTitle: "SMAS (Tensão)", smasDx: "Dx: Laxidez ligamentar e perda de tensão muscular.",
        boneTitle: "Perfil Cervical", boneDx: "Dx: Perda do ângulo da juventude (90°).",
        neckTag: "Ângulo Cervical",
        
        decoTitle: "Análise do Colo (Décolleté)",
        decoDx: "Dx: Sinais de Elastose Solar e linhas horizontais (Anéis de Vênus / Tech-Neck). A pele do pescoço mostra afinamento.",
        decoTx: "Rx: Bio-Estimuladores + Fios",

        planTitle: "Seu Plano de Transformação", optA: "Opção A: Médico", optADesc: "Intervenção especializada.", btnBook: "Agendar Consulta",
        optB: "Opção B: Em Casa", optBDesc: "Guia digital de cuidados.", btnBuy: "Comprar Ebook", approved: "Aprovado por", print: "Imprimir PDF", whatsapp: "Olá Dr. Maya, vi minha revista digital e quero agendar."
    }
};

type LangType = 'ES' | 'EN' | 'PT';

export default function TipherethV1100() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<LangType>('ES');
  const [appMode, setAppMode] = useState('HOME'); 
  const [captureStep, setCaptureStep] = useState(0); 
  const [photos, setPhotos] = useState<{front:string|null; sideR:string|null; sideL:string|null}>({front:null, sideR:null, sideL:null});
  const [patient, setPatient] = useState({ name: '', phone: '', age: '' });
  const [skinReport, setSkinReport] = useState<SkinAnalysisResult | null>(null);

  const t = CONTENT[lang];
  const skinCopy = skinReport ? getSkinFindings(skinReport, lang) : null;
  const skinRx = skinReport ? getMicroneedlingRx(skinReport.score, lang) : t.rx1;

  const saveLead = (data: any) => {
      const existingLeads = localStorage.getItem('tiphereth_leads');
      let leads = existingLeads ? JSON.parse(existingLeads) : [];
      const index = leads.findIndex((l: any) => l.phone === data.phone);
      if (index >= 0) { leads[index] = data; } else { leads.push(data); }
      localStorage.setItem('tiphereth_leads', JSON.stringify(leads));
      localStorage.setItem('tiphereth_user', JSON.stringify(data));
  };

  useEffect(() => {
    const saved = localStorage.getItem('tiphereth_user');
    if(saved) setPatient(JSON.parse(saved));
  }, []);

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
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"; 
          ctx.lineWidth = 1; 
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
                const frontPhoto = photos.front;
                setPhotos(p=>({...p, sideL:imgData})); 
                saveLead(patient);
                setAppMode('ANALYSIS');
                const ageNum = patient.age ? parseInt(patient.age, 10) : undefined;
                const runAnalysis = frontPhoto
                  ? analyzeSkinFromImageDataUrl(frontPhoto, ageNum).then(setSkinReport).catch(() => setSkinReport(null))
                  : Promise.resolve();
                runAnalysis.finally(() => {
                  setTimeout(() => setAppMode('RESULT'), 2500);
                });
            }
        }
    }
  }, [webcamRef, captureStep, patient]);

  const MagazineHeader = () => (
    <div className="flex justify-between items-end border-b border-black pb-4 mb-6 md:mb-10">
        <div>
            <h1 className="text-xl md:text-3xl font-serif tracking-tight text-black uppercase">{DR_NAME}</h1>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-gray-500 mt-1">Haute Couture Aesthetic Medicine</p>
        </div>
        <div className="text-right">
            <p className="font-serif text-sm md:text-xl italic text-black uppercase">{patient.name}</p>
            <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-gray-400">ID: {patient.phone}</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        body { font-family: 'Lato', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .page-break { page-break-after: always; min-height: 100vh; position: relative; padding: 20px; box-sizing: border-box; }
        @media (min-width: 768px) { .page-break { padding: 50px; } }
        .filter-vascular { filter: contrast(1.3) saturate(1.5) hue-rotate(-15deg); }
        .filter-fat { filter: grayscale(100%) brightness(1.1) contrast(0.9); }
        .filter-smas { filter: grayscale(100%) contrast(1.2); }
        .filter-bone { filter: invert(100%) grayscale(100%); }
        .filter-deco { filter: contrast(1.4) saturate(1.3) sepia(0.2); }
        @media print { 
            @page { size: A4; margin: 0; } 
            body { background: white; -webkit-print-color-adjust: exact; } 
            .no-print { display: none !important; } 
            .print-only { display: block !important; }
            .magazine-col { flex-direction: row !important; }
            .magazine-width { width: 50% !important; }
        }
      `}</style>

      {/* 1. LOGIN */}
      {appMode === 'HOME' && (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 relative">
             <div className="absolute top-8 right-8 flex gap-4 text-xs font-bold tracking-widest z-50">
                 <button onClick={() => setLang('ES')} className={`${lang === 'ES' ? 'text-white border-b-2 border-white' : 'text-gray-500'} pb-1`}>ES</button>
                 <button onClick={() => setLang('EN')} className={`${lang === 'EN' ? 'text-white border-b-2 border-white' : 'text-gray-500'} pb-1`}>EN</button>
                 <button onClick={() => setLang('PT')} className={`${lang === 'PT' ? 'text-white border-b-2 border-white' : 'text-gray-500'} pb-1`}>PT</button>
             </div>
             <div className="border border-white/20 p-8 md:p-12 max-w-lg w-full text-center backdrop-blur-sm">
                 <h1 className="text-5xl md:text-7xl font-serif italic mb-2 tracking-tighter">Tiphereth</h1>
                 <p className="text-[10px] text-gray-400 tracking-[0.4em] uppercase mb-12">{t.subtitle}</p>
                 <div className="space-y-6">
                    <input onChange={e => setPatient({...patient, name: e.target.value})} className="w-full bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600 font-serif text-xl uppercase" placeholder={t.placeholderName} />
                    <div className="flex gap-4">
                        <input type="tel" onChange={e => setPatient({...patient, phone: e.target.value})} className="w-2/3 bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600" placeholder="WhatsApp" />
                        <input type="number" onChange={e => setPatient({...patient, age: e.target.value})} className="w-1/3 bg-transparent border-b border-white/40 p-3 text-center text-white outline-none placeholder:text-gray-600" placeholder={t.placeholderAge} />
                    </div>
                    <button onClick={() => { if(patient.name) setAppMode('CAPTURE') }} className="w-full bg-white text-black py-4 font-serif italic text-lg hover:bg-gray-200 mt-8 transition-all tracking-widest">
                        {t.enterBtn}
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
            <div className="absolute top-12 left-0 w-full text-center"><p className="text-white font-serif italic text-2xl md:text-3xl drop-shadow-lg">{captureStep === 0 ? t.step1 : captureStep === 1 ? t.step2 : t.step3}</p></div>
            <button onClick={capture} className="absolute bottom-20 left-1/2 -translate-x-1/2 w-20 h-20 border border-white/50 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"><div className="w-16 h-16 bg-white/90 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)]"></div></button>
        </div>
      )}

      {/* 3. ANÁLISIS */}
      {appMode === 'ANALYSIS' && (
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
             <h2 className="font-serif text-3xl italic mb-6">{t.processing}</h2>
             <div className="w-32 h-[2px] bg-black animate-pulse"></div>
        </div>
      )}

      {/* 4. RESULTADO */}
      {appMode === 'RESULT' && (
        <div className="bg-[#f0f0f0] min-h-screen md:py-10">
            <div className="fixed bottom-6 right-6 z-50 no-print flex flex-col gap-3 items-end">
                 <button onClick={() => window.open(EBOOK_LINKS[lang])} className="bg-gray-800 text-white px-4 py-2 font-serif italic text-xs hover:scale-105 shadow-xl border border-gray-600">
                    📚 {t.btnBuy}
                 </button>
                 <div className="flex gap-2">
                    <button onClick={() => window.print()} className="bg-black text-white px-6 py-3 font-serif italic text-sm hover:scale-105 shadow-2xl">
                        🖨️ {t.print}
                    </button>
                    <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=${t.whatsapp}`)} className="bg-white text-black border border-black px-6 py-3 font-serif italic text-sm hover:bg-gray-50 shadow-xl">
                        💬 {t.btnBook}
                    </button>
                 </div>
            </div>

            {/* HOJA 0: PORTADA */}
            <div className="w-full md:max-w-[210mm] mx-auto bg-[#fafafa] shadow-2xl page-break flex flex-col justify-between items-center text-center py-16 md:py-24 px-6 md:px-12 border-[10px] md:border-[20px] border-white outline outline-1 outline-gray-200">
                <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-400 mb-6">{t.coverTitle}</p>
                    <h1 className="text-5xl md:text-9xl font-serif tracking-tighter text-black mb-4 leading-none break-words">TIPHERETH</h1>
                    <div className="w-20 md:w-32 h-1 bg-black mx-auto"></div>
                </div>
                <div className="relative w-48 h-72 md:w-64 md:h-96 my-8 opacity-90">
                    <svg viewBox="0 0 200 300" className="w-full h-full overflow-visible">
                        <path d="M100,50 L100,250 M50,150 L150,150 M75,100 L125,200 M125,100 L75,200" stroke="#C4A484" strokeWidth="1.5" opacity="0.6" />
                        <circle cx="100" cy="50" r="20" fill="black" /> <circle cx="100" cy="150" r="25" fill="transparent" stroke="black" strokeWidth="2" /> <circle cx="100" cy="250" r="20" fill="black" />
                        <text x="100" y="155" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic" fontSize="14" fill="black">Harmony</text>
                    </svg>
                </div>
                <div>
                    <p className="font-serif italic text-2xl md:text-3xl mb-3 text-gray-800 uppercase">The {patient.name || "Patient"} {t.edition}</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black mb-10">{new Date().getFullYear()} {t.coverCollection}</p>
                    <div className="border-t-2 border-black pt-6 inline-block px-8 md:px-16">
                        <p className="text-sm md:text-base font-bold uppercase tracking-widest">{DR_NAME}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">{t.director}</p>
                    </div>
                </div>
            </div>

            {/* HOJA 1: PIEL */}
            <div className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />
                <h2 className="text-3xl md:text-5xl font-serif italic text-center mb-4">{t.ch1Title}</h2>
                <p className="text-center text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-8">{t.ch1Sub}</p>
                <div className="flex flex-col md:flex-row magazine-col gap-8 md:gap-12 items-start mb-12 px-4 md:pl-8">
                    <div className="w-full md:w-[45%] magazine-width shadow-xl md:rotate-[-2deg]">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-vascular" />}
                             <div className="absolute bottom-4 left-0 bg-black text-white px-4 py-2 text-[9px] font-bold tracking-[0.2em] uppercase">{t.filterVasc}</div>
                        </div>
                    </div>
                    <div className="w-full md:w-[55%] magazine-width flex flex-col justify-center pt-4 md:pt-8 md:pr-8">
                        <div className="mb-6 md:mb-8"><h3 className="font-bold uppercase text-xs md:text-sm mb-2 border-b-2 border-black inline-block pb-1">{t.analysisTitle}</h3><p className="text-sm md:text-base font-serif leading-relaxed text-gray-700">{skinCopy?.analysisText ?? t.analysisText}</p></div>
                        <div className="mb-6 md:mb-8"><h3 className="font-bold uppercase text-xs md:text-sm mb-2 border-b-2 border-black inline-block pb-1">{t.findingTitle}</h3><p className="text-sm md:text-base font-serif leading-relaxed text-gray-700">{skinCopy?.findingText ?? t.findingText}</p></div>
                        {skinReport && (
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-6">Calidad dérmica estimada: {skinReport.score}/100 · Glogau {skinReport.glogau}</p>
                        )}
                    </div>
                </div>
                <div className="bg-[#fafafa] p-6 md:p-8 border-l-4 border-black mx-4 md:mx-8">
                    <h3 className="font-serif text-xl md:text-2xl italic mb-4">{t.dxTitle}</h3>
                    <p className="text-sm md:text-base text-gray-700 mb-4 font-serif">{skinCopy?.dxText ?? t.dxText}</p>
                    <div className="flex justify-between items-center border-t border-gray-300 pt-4"><span className="font-bold text-xs uppercase tracking-widest">{t.suggestion}:</span><span className="font-serif italic text-lg md:text-2xl">{skinRx}</span></div>
                </div>
            </div>

            {/* HOJA 2: VOLÚMENES */}
            <div className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl page-break">
                <MagazineHeader />
                <h2 className="text-3xl md:text-5xl font-serif italic text-center mb-4">{t.ch2Title}</h2>
                <p className="text-center text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-8">{t.ch2Sub}</p>
                <div className="relative mb-8 md:mb-12 mx-4 md:mx-8 shadow-2xl">
                     <div className="aspect-video w-full relative overflow-hidden bg-gray-100">
                         {photos.sideR && <img src={photos.sideR} className="w-full h-full object-cover filter-fat opacity-90" />}
                         <div className="absolute top-[32%] left-[32%] w-16 h-12 bg-[#C4A484]/50 rounded-full blur-md border-2 border-[#C4A484]"></div>
                         <div className="absolute top-[75%] left-[38%] w-16 h-14 bg-black/40 rounded-full blur-xl border-2 border-black transform rotate-12"></div>
                         <div className="absolute top-4 right-4 text-right bg-white/50 p-2 md:p-4 backdrop-blur-sm rounded">
                             <p className="text-[#C4A484] font-bold text-[10px] md:text-xs tracking-widest">{t.tagCheek}</p>
                             <p className="text-black font-bold text-[10px] md:text-xs mt-1 tracking-widest">{t.tagJowl}</p>
                         </div>
                     </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 magazine-col gap-6 md:gap-12 mb-8 mx-4 md:mx-8">
                    <div className="magazine-width"><h3 className="font-bold uppercase text-xs mb-2 border-b-2 border-black inline-block pb-1">{t.mapTitle}</h3><p className="text-sm font-serif leading-relaxed text-gray-700">{t.mapText}</p></div>
                    <div className="magazine-width"><h3 className="font-bold uppercase text-xs mb-2 border-b-2 border-black inline-block pb-1">{t.cliTitle}</h3><p className="text-sm font-serif leading-relaxed text-gray-700">{t.cliText}</p></div>
                </div>
                <div className="text-center border-y-2 border-black py-6 md:py-8 mx-4 md:mx-8">
                    <p className="font-serif italic text-xl md:text-3xl mb-2">"{t.quote}"</p>
                    <p className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold">{t.txVol}</p>
                </div>
            </div>

            {/* HOJA 3: CIMENTOS, CUELLO Y ESCOTE */}
            <div className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl page-break flex flex-col">
                <MagazineHeader />
                <h2 className="text-3xl md:text-5xl font-serif italic text-center mb-4">{t.ch3Title}</h2>
                <p className="text-center text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-8">{t.ch3Sub}</p>
                
                {/* FILA SUPERIOR: SMAS y PERFIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 magazine-col gap-6 md:gap-8 mb-6 mx-4 md:mx-8">
                    <div className="bg-[#fafafa] p-4 flex flex-col magazine-width">
                        <h3 className="text-center font-bold text-xs uppercase tracking-widest mb-2">{t.smasTitle}</h3>
                        <div className="aspect-square relative overflow-hidden mb-2 shadow-lg">
                             {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-smas opacity-80" />}
                             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"><path d="M30,30 L30,70" stroke="black" strokeWidth="0.8" markerEnd="url(#arrow)" /><path d="M70,30 L70,70" stroke="black" strokeWidth="0.8" markerEnd="url(#arrow)" /><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto"><path d="M0,0 L0,8 L8,4 z" fill="black" /></marker></defs></svg>
                        </div>
                        <p className="text-[10px] font-serif text-justify mt-auto">{t.smasDx}</p>
                    </div>
                    <div className="bg-[#fafafa] p-4 flex flex-col magazine-width">
                        <h3 className="text-center font-bold text-xs uppercase tracking-widest mb-2">{t.boneTitle}</h3>
                        <div className="aspect-square relative overflow-hidden mb-2 shadow-lg">
                             {photos.sideL ? <img src={photos.sideL} className="w-full h-full object-cover filter-bone" /> : <img src={photos.sideR || ''} className="w-full h-full object-cover filter-bone" />}
                             <div className="absolute bottom-4 left-[35%] w-16 h-1 border-t-2 border-red-500 opacity-60 rotate-12"></div>
                             <div className="absolute bottom-4 left-[35%] h-16 w-1 border-l-2 border-red-500 opacity-60"></div>
                             <p className="absolute bottom-16 left-[40%] text-red-500 font-bold text-[9px] uppercase tracking-widest">{t.neckTag}</p>
                        </div>
                        <p className="text-[10px] font-serif text-justify mt-auto">{t.boneDx}</p>
                    </div>
                </div>

                {/* FILA INFERIOR (NUEVA): ESCOTE */}
                <div className="mx-4 md:mx-8 mb-6">
                    <h3 className="font-bold uppercase text-xs mb-2 border-b border-black inline-block">{t.decoTitle}</h3>
                    <div className="flex gap-4 items-center">
                        <div className="w-1/3 aspect-[4/3] relative overflow-hidden shadow-md">
                            {/* FOTO FRONTAL ENFOCADA ABAJO (OBJECT POSITION) Y CON FILTRO ROJO */}
                            {photos.front && <img src={photos.front} className="w-full h-full object-cover filter-deco" style={{objectPosition: '0% 80%'}} />}
                        </div>
                        <div className="w-2/3">
                            <p className="text-[10px] font-serif text-justify leading-relaxed">{t.decoDx}</p>
                            <p className="text-[10px] font-bold mt-2 uppercase text-red-800">{t.decoTx}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-6 md:p-8 mx-4 md:mx-8 mb-8">
                    <p className="font-serif italic text-xl md:text-2xl mb-6 text-center">{t.planTitle}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 magazine-col gap-6 border-t border-white/30 pt-6">
                        <div className="text-center md:text-right md:border-r md:border-white/30 md:pr-8 magazine-width">
                            <p className="text-xs font-bold uppercase text-[#C4A484] mb-2">{t.optA}</p>
                            <p className="text-xs font-light mb-4">{t.optADesc}</p>
                            <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=${t.whatsapp}`)} className="bg-white text-black px-4 py-2 text-xs font-bold uppercase hover:bg-gray-200">{t.btnBook}</button>
                        </div>
                        <div className="text-center md:text-left md:pl-4 magazine-width">
                            <p className="text-xs font-bold uppercase text-[#C4A484] mb-2">{t.optB}</p>
                            <p className="text-xs font-light mb-4">{t.optBDesc}</p>
                            <button onClick={() => window.open(EBOOK_LINKS[lang])} className="border border-white text-white px-4 py-2 text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors">{t.btnBuy}</button>
                        </div>
                    </div>
                    <div className="mt-8 text-center"><p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] inline-block">{t.approved}: {DR_NAME}</p></div>
                </div>
            </div>

        </div>
      )}
    </div>
  );
}