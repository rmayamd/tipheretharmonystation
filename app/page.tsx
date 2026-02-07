"use client";
import React, { useRef, useState, useEffect } from 'react';

// --- CONFIGURACIÓN ---
const HOTMART_EBOOK_URL = "https://pay.hotmart.com/G104238384O?checkoutMode=10"; 
const WS_NUMBER = "573117936211";

export default function TipherethV116() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // ESTADOS PRINCIPALES
  const [step, setStep] = useState('login'); 
  const [user, setUser] = useState({ name: '', age: '' });
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- VARIABLES CLÍNICAS ---
  const [glogau, setGlogau] = useState(1); // Edad/Daño (1-4)
  const [fitzpatrick, setFitzpatrick] = useState(3); // Color Piel (1-6)
  
  // --- EL MENÚ QUIRÚRGICO (PLAN) ---
  const [plan, setPlan] = useState({
    skin: false,   // Capa 1
    eyes: false,   // Periorbital
    smas: false,   // Capa 3
    bone: false    // Capa 5
  });

  // --- CONTROLES DE SIMULACIÓN ---
  const [boneProjection, setBoneProjection] = useState(50); 
  const [boneDefinition, setBoneDefinition] = useState(0);  
  const [liftVector, setLiftVector] = useState(10);          
  const [skinLightMode, setSkinLightMode] = useState('NORMAL'); // NORMAL | UV | VASCULAR

  // --- 1. LOGIN + FITZPATRICK ---
  const login = () => {
    if (!user.name) return;
    setLoading(true);
    // Glogau automático por edad
    const age = parseInt(user.age);
    let g = 1;
    if (age > 30) g = 2;
    if (age > 45) g = 3;
    if (age > 60) g = 4;
    setGlogau(g);
    setTimeout(() => { setLoading(false); setStep('camera'); }, 800);
  };

  // --- 2. CÁMARA ---
  useEffect(() => { if (step === 'camera') startCamera(); }, [step]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { alert("Cámara necesaria."); }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      cvs.width = vid.videoWidth;
      cvs.height = vid.videoHeight;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        setPhoto(cvs.toDataURL('image/jpeg'));
        setStep('planner');
      }
    }
  };

  // --- LOGICA TERAPÉUTICA SEGURA (FITZPATRICK) ---
  const getSkinTreatment = () => {
      // Si es piel oscura (IV-VI), NO recomendar láser agresivo
      if (fitzpatrick >= 4) return "Microneedling + Despigmentante (Seguro Piel Oscura)";
      // Si es piel clara (I-III) con Glogau alto
      if (glogau >= 3) return "Resurfacing Láser CO2 / Fenol";
      return "Peeling Químico + Protocolo Tópico";
  };

  // --- GENERADOR WHATSAPP ---
  const getWhatsAppLink = () => {
    let msg = `Hola Dr. Maya. Soy ${user.name} (Fitzpatrick ${fitzpatrick}, Glogau ${glogau}). Plan:`;
    if (plan.skin) msg += ` %0A- Piel: ${getSkinTreatment()}`;
    if (plan.eyes) msg += ` %0A- Blefaroplastia`;
    if (plan.smas) msg += ` %0A- Lifting Deep Plane`;
    if (plan.bone) msg += ` %0A- Estructura Mandibular`;
    return `https://api.whatsapp.com/send?phone=${WS_NUMBER}&text=${msg}`;
  };

  // --- GENERADOR PDF ---
  const generatePDF = () => window.print();

  // --- FILTROS DE LUZ (SIMULACIÓN VISIA) ---
  const getSkinFilter = () => {
      if (!plan.skin) return 'none'; // Si no está marcado, no aplica filtro
      // Si está marcado, depende del modo de luz
      switch (skinLightMode) {
          case 'UV': return 'contrast(1.5) grayscale(1) invert(0.1) brightness(0.9)'; // Manchas
          case 'VASCULAR': return 'contrast(1.4) sepia(1) hue-rotate(-50deg) saturate(3) brightness(0.9)'; // Rojeces
          case 'NORMAL': return 'contrast(1.05) brightness(1.1) saturate(1.05) blur(0.5px)'; // Piel "Curada" (Simulación)
          default: return 'none';
      }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center overflow-x-hidden print:bg-white print:text-black">
      
      {/* ESTILOS PDF */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; color: black; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- REPORTE PDF (CLÍNICO + SEGURIDAD) --- */}
      <div className="print-only w-full max-w-4xl p-10">
          <div className="flex justify-between border-b-2 border-black pb-4 mb-6">
              <div><h1 className="text-3xl font-bold">INFORME CLÍNICO</h1><p className="text-gray-500">Dr. Ricardo Maya</p></div>
              <div className="text-right">
                  <p className="font-bold">{user.name.toUpperCase()}</p>
                  <p>Glogau: {glogau} | Fitzpatrick: Tipo {fitzpatrick}</p>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
              <div><p className="font-bold text-xs bg-gray-200 inline-block px-2 mb-2">ACTUAL</p>{photo && <img src={photo} className="w-full rounded border" />}</div>
              <div><p className="font-bold text-xs bg-cyan-100 text-cyan-900 inline-block px-2 mb-2">SIMULACIÓN</p>{photo && <img src={photo} className="w-full rounded border" style={{transform: 'scale(1.02)'}} />}</div>
          </div>

          <table className="w-full text-left border-collapse mb-8 text-sm">
              <thead><tr className="border-b-2 border-black"><th className="py-2">CAPA</th><th className="py-2">DIAGNÓSTICO</th><th className="py-2">TRATAMIENTO SEGURO</th></tr></thead>
              <tbody>
                  <tr className="border-b">
                      <td className="py-2 font-bold text-red-700">PIEL (C1)</td>
                      <td className="py-2">Daño Actínico / Vascular</td>
                      <td className="py-2 font-bold">{plan.skin ? getSkinTreatment() : "-"}</td>
                  </tr>
                  <tr className="border-b">
                      <td className="py-2 font-bold text-purple-700">SMAS (C3)</td>
                      <td className="py-2">Ptosis Jowl / Ligamentos</td>
                      <td className="py-2">{plan.smas ? "Lifting Vectorial (Deep Plane)" : "-"}</td>
                  </tr>
                  <tr className="border-b">
                      <td className="py-2 font-bold text-yellow-700">HUESO (C5)</td>
                      <td className="py-2">Soporte Estructural</td>
                      <td className="py-2">{plan.bone ? "Estructuración Mandibular" : "-"}</td>
                  </tr>
              </tbody>
          </table>
          <p className="text-xs text-center text-gray-500 mt-8">*El tratamiento de piel se ha ajustado según su Fototipo (Fitzpatrick {fitzpatrick}) para evitar hiperpigmentación.</p>
      </div>

      {/* --- UI APP --- */}

      {/* 1. LOGIN + SELECCIÓN DE FOTOTIPO */}
      {step === 'login' && (
        <div className="w-full max-w-md p-8 mt-10 text-center animate-in fade-in no-print">
            <h1 className="text-5xl font-thin mb-2 tracking-tighter">TIPHERET</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-8">Sistema Dermatológico & Quirúrgico V116</p>
            
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-left space-y-4">
                <div><label className="text-[9px] text-zinc-500 font-bold ml-1">NOMBRE</label><input onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-black border-b border-zinc-600 p-3 text-white outline-none focus:border-cyan-500" /></div>
                <div><label className="text-[9px] text-zinc-500 font-bold ml-1">EDAD</label><input type="number" onChange={e => setUser({...user, age: e.target.value})} className="w-full bg-black border-b border-zinc-600 p-3 text-white outline-none focus:border-cyan-500" /></div>
                
                {/* SELECTOR FITZPATRICK */}
                <div>
                    <label className="text-[9px] text-zinc-500 font-bold ml-1">COLOR DE PIEL (FITZPATRICK)</label>
                    <div className="grid grid-cols-6 gap-1 mt-2">
                        {[1,2,3,4,5,6].map(f => (
                            <button key={f} onClick={() => setFitzpatrick(f)} className={`h-8 rounded ${fitzpatrick === f ? 'border-2 border-white scale-110' : 'border border-zinc-700 opacity-50'}`} 
                                style={{backgroundColor: f===1?'#fcece3':f===2?'#f3d8ca':f===3?'#dcbca2':f===4?'#c69d78':f===5?'#98704c':'#563926'}}
                            ></button>
                        ))}
                    </div>
                    <p className="text-[9px] text-center mt-1 text-zinc-400">Tipo {fitzpatrick}: {fitzpatrick < 3 ? 'Clara (Riesgo Solar Alto)' : fitzpatrick > 4 ? 'Oscura (Riesgo Mancha Alta)' : 'Media'}</p>
                </div>

                <button onClick={login} disabled={!user.name || !user.age} className="w-full bg-white text-black font-bold py-4 rounded mt-4 text-xs tracking-widest">INICIAR DIAGNÓSTICO</button>
            </div>
        </div>
      )}

      {/* 2. CÁMARA */}
      {step === 'camera' && (
        <div className="relative w-full h-screen bg-black no-print">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none"><div className="w-64 h-80 border-2 border-dashed border-cyan-500 rounded-[50%]"></div></div>
            <div className="absolute bottom-12 inset-x-0 flex justify-center"><button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-zinc-500"></button></div>
        </div>
      )}

      {/* 3. PLANIFICADOR (CAPAS + LUCES + SEGURIDAD) */}
      {step === 'planner' && photo && (
        <div className="w-full max-w-md bg-black min-h-screen pb-40 animate-in fade-in duration-700 no-print">
            
            {/* VISOR MULTI-CAPA */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden border-b border-zinc-800 sticky top-0 z-0">
                <img src={photo} className="absolute inset-0 w-full h-full object-cover z-0" />

                {/* CAPA 1: PIEL (CON MODOS DE LUZ) */}
                <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${plan.skin ? 'opacity-100' : 'opacity-0'}`} 
                     style={{ filter: getSkinFilter() }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                {/* CAPA 2: OJOS */}
                <div className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-500 ${plan.eyes ? 'opacity-100' : 'opacity-0'}`}
                     style={{ maskImage: 'radial-gradient(circle at 50% 30%, black 20%, transparent 50%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 20%, transparent 50%)', filter: 'brightness(1.2) contrast(1.1)' }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                {/* CAPA 3: SMAS (VECTOR HONG KONG) */}
                <div className={`absolute inset-0 w-full h-full z-30 transition-transform duration-500 ease-out ${plan.smas ? 'translate-x-[4px] -translate-y-[12px]' : 'translate-0'}`}
                     style={{ transform: plan.smas ? `translate(${liftVector * 0.5}px, -${liftVector * 1.3}px)` : 'none', maskImage: 'radial-gradient(circle at 50% 0%, transparent 40%, black 90%)', WebkitMaskImage: 'radial-gradient(circle at 50% 0%, transparent 40%, black 90%)' }}>
                    <img src={photo} className="w-full h-full object-cover" />
                </div>

                 {/* CAPA 5: HUESO (DEFINICIÓN) */}
                 <div className={`absolute inset-0 w-full h-full z-40 transition-all duration-500 ${plan.bone ? 'opacity-100' : 'opacity-0'}`}
                     style={{ transform: `scale(${1 + (boneDefinition/800)}) perspective(500px) rotateX(${boneDefinition/20}deg)`, filter: `contrast(1.2) drop-shadow(0 ${boneProjection/10}px ${boneProjection/5}px rgba(0,0,0,0.6))` }}>
                    <img src={photo} className="w-full h-full object-cover mix-blend-overlay" />
                </div>
            </div>

            {/* PANEL DE CONTROL */}
            <div className="relative z-10 bg-black -mt-6 rounded-t-3xl p-6 border-t border-zinc-900">
                <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6"></div>
                
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 text-center">PLAN DE TRATAMIENTO</h3>
                
                <div className="space-y-4">
                    
                    {/* CAPA 1: PIEL (CON SELECTOR DE LUCES) */}
                    <div className={`p-4 rounded-xl border transition-all ${plan.skin ? 'bg-zinc-900 border-red-500/50' : 'bg-black border-zinc-800'}`}>
                        <label className="flex items-center justify-between cursor-pointer mb-2">
                            <span className="font-bold text-xs text-red-500">CAPA 1: PIEL (FITZ {fitzpatrick})</span>
                            <input type="checkbox" checked={plan.skin} onChange={() => {setPlan({...plan, skin: !plan.skin}); setSkinLightMode('NORMAL');}} className="w-5 h-5 accent-red-500" />
                        </label>
                        {plan.skin && (
                            <div className="animate-in fade-in pt-2">
                                <p className="text-[9px] text-zinc-500 mb-2">MODO DE VISUALIZACIÓN:</p>
                                <div className="flex gap-2 mb-3">
                                    <button onClick={() => setSkinLightMode('UV')} className={`flex-1 py-2 text-[8px] font-bold rounded border ${skinLightMode==='UV'?'bg-red-900 text-white border-red-500':'border-zinc-700 text-zinc-500'}`}>UV (MANCHAS)</button>
                                    <button onClick={() => setSkinLightMode('VASCULAR')} className={`flex-1 py-2 text-[8px] font-bold rounded border ${skinLightMode==='VASCULAR'?'bg-pink-900 text-white border-pink-500':'border-zinc-700 text-zinc-500'}`}>VASCULAR</button>
                                    <button onClick={() => setSkinLightMode('NORMAL')} className={`flex-1 py-2 text-[8px] font-bold rounded border ${skinLightMode==='NORMAL'?'bg-white text-black':'border-zinc-700 text-zinc-500'}`}>SIMULACIÓN</button>
                                </div>
                                <p className="text-[10px] text-white">Rx Sugerido: <span className="text-red-400 font-bold">{getSkinTreatment()}</span></p>
                            </div>
                        )}
                    </div>

                    {/* CAPA 3: SMAS */}
                    <div className={`p-4 rounded-xl border transition-all ${plan.smas ? 'bg-zinc-900 border-purple-500/50' : 'bg-black border-zinc-800'}`}>
                        <label className="flex items-center justify-between cursor-pointer mb-2">
                            <span className="font-bold text-xs text-purple-500">CAPA 3: SMAS (VECTORES)</span>
                            <input type="checkbox" checked={plan.smas} onChange={() => {setPlan({...plan, smas: !plan.smas}); setLiftVector(15);}} className="w-5 h-5 accent-purple-500" />
                        </label>
                        {plan.smas && <input type="range" min="0" max="30" value={liftVector} onChange={(e) => setLiftVector(Number(e.target.value))} className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-purple-500" />}
                    </div>

                    {/* CAPA 5: HUESO */}
                    <div className={`p-4 rounded-xl border transition-all ${plan.bone ? 'bg-zinc-900 border-yellow-500/50' : 'bg-black border-zinc-800'}`}>
                        <label className="flex items-center justify-between cursor-pointer mb-2">
                            <span className="font-bold text-xs text-yellow-500">CAPA 5: ESTRUCTURA</span>
                            <input type="checkbox" checked={plan.bone} onChange={() => {setPlan({...plan, bone: !plan.bone}); setBoneDefinition(20);}} className="w-5 h-5 accent-yellow-500" />
                        </label>
                        {plan.bone && (
                            <div className="space-y-2 pt-2">
                                <input type="range" min="0" max="100" value={boneProjection} onChange={(e) => setBoneProjection(Number(e.target.value))} className="w-full h-2 bg-black rounded-lg accent-yellow-500" />
                                <input type="range" min="0" max="50" value={boneDefinition} onChange={(e) => setBoneDefinition(Number(e.target.value))} className="w-full h-2 bg-black rounded-lg accent-yellow-500" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTONES FINALES */}
            <div className="fixed bottom-0 inset-x-0 bg-black/90 backdrop-blur p-4 border-t border-zinc-800 flex gap-2 no-print z-50">
                 <button onClick={generatePDF} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest border border-zinc-600 flex items-center justify-center gap-2"><span>📄</span> PDF</button>
                <button onClick={() => window.location.href = getWhatsAppLink()} className="flex-[2] bg-white text-black font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.3)]">COTIZAR ➜</button>
            </div>

        </div>
      )}
    </div>
  );
}