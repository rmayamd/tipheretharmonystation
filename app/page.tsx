"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const WS_NUMBER = "573117936211";

export default function TipherethV117() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS
  const [step, setStep] = useState('login'); 
  const [user, setUser] = useState({ name: '', age: '' });
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // VARIABLES CLÍNICAS
  const [glogau, setGlogau] = useState(1);
  const [fitzpatrick, setFitzpatrick] = useState(3);
  
  // PLAN DE TRATAMIENTO
  const [plan, setPlan] = useState({
    skin: false,
    eyes: false,
    smas: false,
    bone: false
  });

  // INTENSIDAD DE SIMULACIÓN (SIMPLIFICADA Y ESTABLE)
  const [intensity, setIntensity] = useState(50); // Control Maestro

  // 1. LOGIN
  const login = () => {
    if (!user.name) return;
    setLoading(true);
    const age = parseInt(user.age);
    let g = 1;
    if (age > 30) g = 2; if (age > 45) g = 3; if (age > 60) g = 4;
    setGlogau(g);
    setTimeout(() => { setLoading(false); setStep('camera'); }, 800);
  };

  // 2. CÁMARA
  useEffect(() => { if (step === 'camera') startCamera(); }, [step]);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { alert("Cámara requerida."); }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      cvs.width = vid.videoWidth;
      cvs.height = vid.videoHeight;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        // Corrección de espejo
        ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        setPhoto(cvs.toDataURL('image/jpeg'));
        setStep('planner');
      }
    }
  };

  // 3. GENERAR PDF (ESTILO NATIVO)
  const printPDF = () => window.print();

  // 4. GENERAR LINK WHATSAPP
  const getWS = () => {
      let t = `Hola, soy ${user.name}. Mi Plan Tipheret:`;
      if(plan.skin) t+=` Piel(Glogau${glogau}),`;
      if(plan.eyes) t+=` Ojos,`;
      if(plan.smas) t+=` SMAS,`;
      if(plan.bone) t+=` Hueso.`;
      return `https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=${t}`;
  };

  // 5. MOTOR VISUAL ESTABLE (SIN CAPAS DUPLICADAS QUE DISTORSIONEN)
  const getVisualEffect = () => {
      let filters = [];
      // Piel: Suavizado y Brillo
      if (plan.skin) filters.push(`contrast(1.1) brightness(1.1) saturate(1.1) blur(0.3px)`);
      // Ojos: Luz en zona alta
      if (plan.eyes) filters.push(`brightness(1.2)`);
      // Hueso: Contraste para definir mandíbula
      if (plan.bone) filters.push(`contrast(1.2) grayscale(0.2)`);
      
      return filters.join(' ');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* CSS PARA IMPRESIÓN (LIMPIO) */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; color: black; }
          .page-break { page-break-after: always; }
        }
        .print-only { display: none; }
      `}</style>

      {loading && <div className="fixed inset-0 bg-black z-50 flex items-center justify-center no-print"><div className="w-10 h-10 border-t-2 border-cyan-500 rounded-full animate-spin"></div></div>}

      {/* --- VISTA DE PDF (LO QUE SE IMPRIME) --- */}
      <div className="print-only w-full p-8 text-black">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
              <div>
                  <h1 className="text-4xl font-bold">TIPHERET MEDICAL</h1>
                  <p className="text-sm text-gray-600">Dr. Ricardo Maya | Facial Plastic Surgery</p>
              </div>
              <div className="text-right text-sm">
                  <p><strong>PACIENTE:</strong> {user.name}</p>
                  <p><strong>EDAD:</strong> {user.age} | <strong>FITZPATRICK:</strong> {fitzpatrick}</p>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded p-1">
                  <p className="text-xs font-bold bg-gray-200 text-center mb-1">ESTADO ACTUAL</p>
                  {photo && <img src={photo} className="w-full" />}
              </div>
              <div className="border rounded p-1">
                  <p className="text-xs font-bold bg-cyan-100 text-cyan-900 text-center mb-1">PROYECCIÓN</p>
                  {photo && <img src={photo} className="w-full" style={{filter: getVisualEffect()}} />}
              </div>
          </div>

          <table className="w-full text-xs text-left border-collapse mb-8">
              <thead>
                  <tr className="bg-gray-100 border-b-2 border-black">
                      <th className="p-2">CAPA</th>
                      <th className="p-2">DIAGNÓSTICO</th>
                      <th className="p-2">TRATAMIENTO</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="border-b">
                      <td className="p-2 font-bold">PIEL (C1)</td>
                      <td className="p-2">Glogau {glogau}</td>
                      <td className="p-2">{plan.skin ? (fitzpatrick > 3 ? "Microneedling + Despigmentante" : "Láser CO2 / Peeling") : "-"}</td>
                  </tr>
                  <tr className="border-b">
                      <td className="p-2 font-bold">OJOS (C2)</td>
                      <td className="p-2">Dermatochalasis</td>
                      <td className="p-2">{plan.eyes ? "Blefaroplastia Sup/Inf" : "-"}</td>
                  </tr>
                  <tr className="border-b">
                      <td className="p-2 font-bold">SMAS (C3)</td>
                      <td className="p-2">Ptosis Jowl</td>
                      <td className="p-2">{plan.smas ? "Lifting Vectorial (Deep Plane)" : "-"}</td>
                  </tr>
                  <tr className="border-b">
                      <td className="p-2 font-bold">HUESO (C5)</td>
                      <td className="p-2">Retrusión</td>
                      <td className="p-2">{plan.bone ? "Estructura Mandibular" : "-"}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      {/* --- UI APP MÓVIL --- */}

      {/* 1. LOGIN */}
      {step === 'login' && (
        <div className="w-full max-w-md p-6 mt-10 text-center animate-in fade-in no-print">
            <h1 className="text-5xl font-thin mb-2">TIPHERET</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Medical System V117 (Stable)</p>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-left space-y-4">
                <input onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black border-b border-zinc-700 p-3 text-white text-sm" placeholder="Nombre Paciente" />
                <input type="number" onChange={e => setUser({...user, age: e.target.value})} className="w-full bg-black border-b border-zinc-700 p-3 text-white text-sm" placeholder="Edad" />
                
                <p className="text-[10px] text-zinc-500 font-bold mt-2">FOTOTIPO (FITZPATRICK)</p>
                <div className="flex justify-between mt-1">
                    {[1,2,3,4,5,6].map(f => (
                        <button key={f} onClick={() => setFitzpatrick(f)} className={`w-8 h-8 rounded-full border-2 ${fitzpatrick===f ? 'border-white scale-110':'border-transparent opacity-50'}`} style={{backgroundColor: f===1?'#ffe0d0':f===6?'#3b2518':'#c58c85'}}></button>
                    ))}
                </div>
                <p className="text-[9px] text-center text-zinc-400">Tipo {fitzpatrick}</p>

                <button onClick={login} disabled={!user.name} className="w-full bg-white text-black font-bold py-3 rounded mt-4 text-xs">COMENZAR</button>
            </div>
        </div>
      )}

      {/* 2. CÁMARA */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black no-print">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-64 h-80 border border-white/30 rounded-[40%]"></div></div>
            <button onClick={takePhoto} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-zinc-300"></button>
        </div>
      )}

      {/* 3. PLANIFICADOR ESTABLE */}
      {step === 'planner' && photo && (
        <div className="w-full max-w-md bg-black min-h-screen pb-32 no-print">
            
            {/* VISOR 100% ESTABLE (SIN CAPAS FLOTANTES QUE SE MUEVAN) */}
            <div className="relative w-full aspect-[3/4] bg-zinc-900 overflow-hidden">
                {/* IMAGEN PRINCIPAL CON FILTROS CSS SIMULADORES */}
                <img src={photo} className="w-full h-full object-cover transition-all duration-700" 
                     style={{ filter: getVisualEffect() }} />
                
                {/* OVERLAYS ESTÁTICOS (GUIAS MÉDICAS) */}
                {plan.smas && (
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                         <svg width="100%" height="100%">
                            {/* Vectores de Lifting (Estáticos, solo guía visual) */}
                            <path d="M 20% 60% Q 15% 50% 10% 40%" stroke="cyan" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                            <path d="M 80% 60% Q 85% 50% 90% 40%" stroke="cyan" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                         </svg>
                         <div className="absolute top-4 right-4 bg-cyan-900/80 px-2 py-1 rounded text-[9px] text-cyan-300 font-bold border border-cyan-500">VECTOR SMAS ACTIVO</div>
                    </div>
                )}
                {plan.bone && (
                    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay bg-gradient-to-t from-yellow-500/50 via-transparent to-transparent"></div>
                )}
            </div>

            {/* PANEL DE CONTROL */}
            <div className="p-6 space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 text-center uppercase tracking-widest mb-4">SELECCIÓN DE PROCEDIMIENTOS</h3>
                
                {/* PIEL */}
                <div onClick={() => setPlan({...plan, skin: !plan.skin})} className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${plan.skin ? 'bg-zinc-900 border-red-500' : 'border-zinc-800'}`}>
                    <div><p className="text-xs font-bold text-white">PIEL (Glogau {glogau})</p><p className="text-[9px] text-zinc-500">Fitzpatrick {fitzpatrick} (Seguro)</p></div>
                    <div className={`w-4 h-4 rounded border ${plan.skin ? 'bg-red-500 border-red-500' : 'border-zinc-600'}`}></div>
                </div>

                {/* OJOS */}
                <div onClick={() => setPlan({...plan, eyes: !plan.eyes})} className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${plan.eyes ? 'bg-zinc-900 border-cyan-500' : 'border-zinc-800'}`}>
                    <div><p className="text-xs font-bold text-white">BLEFAROPLASTIA</p><p className="text-[9px] text-zinc-500">Corrección de Mirada</p></div>
                    <div className={`w-4 h-4 rounded border ${plan.eyes ? 'bg-cyan-500 border-cyan-500' : 'border-zinc-600'}`}></div>
                </div>

                {/* SMAS */}
                <div onClick={() => setPlan({...plan, smas: !plan.smas})} className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${plan.smas ? 'bg-zinc-900 border-purple-500' : 'border-zinc-800'}`}>
                    <div><p className="text-xs font-bold text-white">LIFTING VECTORIAL</p><p className="text-[9px] text-zinc-500">Deep Plane Facelift</p></div>
                    <div className={`w-4 h-4 rounded border ${plan.smas ? 'bg-purple-500 border-purple-500' : 'border-zinc-600'}`}></div>
                </div>

                {/* HUESO */}
                <div onClick={() => setPlan({...plan, bone: !plan.bone})} className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${plan.bone ? 'bg-zinc-900 border-yellow-500' : 'border-zinc-800'}`}>
                    <div><p className="text-xs font-bold text-white">ESTRUCTURA</p><p className="text-[9px] text-zinc-500">Definición Mandibular</p></div>
                    <div className={`w-4 h-4 rounded border ${plan.bone ? 'bg-yellow-500 border-yellow-500' : 'border-zinc-600'}`}></div>
                </div>

                {/* SLIDER MAESTRO */}
                <div className="pt-4">
                    <p className="text-[10px] text-center text-zinc-500 mb-2">INTENSIDAD DE SIMULACIÓN</p>
                    <input type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg accent-white" />
                </div>
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="fixed bottom-0 inset-x-0 bg-zinc-900/90 p-4 border-t border-zinc-800 flex gap-2 no-print z-50">
                <button onClick={printPDF} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-[10px] border border-zinc-600">IMPRIMIR PDF</button>
                <button onClick={() => window.open(getWS())} className="flex-[2] bg-white text-black font-bold py-3 rounded-xl text-[10px] shadow-lg">COTIZAR ➜</button>
            </div>
        </div>
      )}
    </div>
  );
}