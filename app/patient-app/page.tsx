'use client'

import { useState, useEffect } from 'react'
import { User, Zap, Target, Clock, Phone, MessageCircle, ShoppingCart, Video } from 'lucide-react'
import Link from 'next/link'

export default function PatientAppPage() {
  const [biologicalAge, setBiologicalAge] = useState(35)
  const [chronologicalAge, setChronologicalAge] = useState(45)
  const [symmetryScore, setSymmetryScore] = useState(72)
  const [urgencyTimer, setUrgencyTimer] = useState(48)
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true)
  
  // Simular timer de urgencia
  useEffect(() => {
    const timer = setInterval(() => {
      setUrgencyTimer(prev => prev > 0 ? prev - 0.01 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const ageDifference = chronologicalAge - biologicalAge
  const agePercentage = (biologicalAge / chronologicalAge) * 100
  const inflammationStatus = ageDifference >= 10 ? 'optimizado' : 'atencion'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-light via-white to-zen-secondary/5">
      {/* Header de Autoridad */}
      <header className="bg-gradient-to-r from-zen-primary to-zen-primary/90 text-white p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-luxury-accent rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. Maya</h1>
              <p className="text-sm opacity-90">Director de Bioingeniería Humana</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Sistema Maya Harmony Station®</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-80">Mi Progreso</p>
            <p className="text-3xl font-bold">{symmetryScore}%</p>
            <p className="text-xs">Hacia la Proporción Áurea</p>
          </div>
        </div>
      </header>
      
      {/* Banner de Urgencia Flotante */}
      {showUrgencyBanner && (
        <div className="fixed top-24 left-0 right-0 z-50 mx-4 animate-slide-down">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-bold">⚡ VENTANA DE OPTIMIZACIÓN EPIGENÉTICA</p>
                <p className="text-sm">Tu protocolo personalizado cierra en {urgencyTimer.toFixed(0)} horas. Solo 3 cupos disponibles.</p>
              </div>
            </div>
            <button
              onClick={() => setShowUrgencyBanner(false)}
              className="text-white hover:bg-white/20 p-2 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto p-6 mt-4">
        {/* Maya Bio-Mirror - Dashboard Principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zen-primary mb-2">Maya Bio-Mirror</h2>
          <p className="text-luxury-dark/70">Tu Espejo Biológico en Tiempo Real</p>
        </div>
        
        {/* Indicadores Principales */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Widget Izquierdo: Edad Biológica */}
          <div className={`rounded-2xl p-8 shadow-2xl border-4 ${
            inflammationStatus === 'optimizado' 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500' 
              : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-500'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zen-primary">Edad Biológica</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                inflammationStatus === 'optimizado' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-amber-500 text-white'
              }`}>
                {inflammationStatus === 'optimizado' ? '✓ OPTIMIZADO' : '⚠ ATENCIÓN'}
              </div>
            </div>
            
            {/* Anillo Dinámico */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                {/* Anillo de fondo */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Anillo de progreso */}
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={inflammationStatus === 'optimizado' ? '#22c55e' : '#f59e0b'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${agePercentage * 5.03} 503`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-zen-primary">{biologicalAge}</p>
                <p className="text-sm text-luxury-dark/70">años celulares</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-luxury-dark/70 mb-2">Edad Cronológica: {chronologicalAge} años</p>
              <p className="text-2xl font-bold text-green-600">
                {ageDifference >= 0 ? '+' : ''}{ageDifference} años más joven
              </p>
              <p className="text-xs text-luxury-dark/60 mt-2">
                Basado en Analizador Cuántico + Byung Pal Yu
              </p>
            </div>
          </div>
          
          {/* Widget Derecho: Potencial de Simetría */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-8 shadow-2xl border-4 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zen-primary">Potencial de Simetría</h3>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            
            {/* Barra de Progreso */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-luxury-dark/70">Actual</span>
                <span className="font-bold text-zen-primary">{symmetryScore}%</span>
                <span className="text-luxury-dark/70">Proporción Áurea</span>
              </div>
              <div className="w-full h-6 bg-white rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-luxury-accent transition-all duration-1000 flex items-center justify-end pr-2"
                  style={{ width: `${symmetryScore}%` }}
                >
                  <span className="text-white text-xs font-bold">{symmetryScore}%</span>
                </div>
              </div>
            </div>
            
            {/* Proyección Antes/Después */}
            <div className="bg-white/70 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-center mb-3">Proyección Maya-Vision</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">ACTUAL</span>
                  </div>
                  <p className="text-xs text-luxury-dark/70">Tu estado actual</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-32 bg-gradient-to-br from-luxury-accent to-yellow-400 rounded-lg mb-2 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">POTENCIAL</span>
                  </div>
                  <p className="text-xs text-luxury-dark/70">Proporción Áurea</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-luxury-dark/60">
              Análisis: Connell + Garcia Jr. + ID Hospital
            </p>
          </div>
        </div>
        
        {/* Botón de Acción Directa */}
        <div className="mb-8">
          <a
            href="https://wa.me/576024873000?text=Hola%20Dr.%20Maya,%20quiero%20mi%20Presupuesto%20de%20Inmortalidad"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button className="w-full bg-gradient-to-r from-luxury-accent via-yellow-500 to-luxury-accent text-white py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse-slow">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-8 h-8" />
                <span>Solicitar mi Presupuesto de Inmortalidad</span>
                <Zap className="w-8 h-8" />
              </div>
              <p className="text-sm mt-2 opacity-90">Conexión directa con Interdrogas + Dr. Maya</p>
            </button>
          </a>
        </div>
        
        {/* Flujo de Persuasión - Las 3 Revelaciones */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Paso 1: La Revelación */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-red-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-zen-primary">1. La Revelación</h3>
            </div>
            <p className="text-sm text-luxury-dark/80 mb-4">
              Dr. Maya detectó un marcador de oxidación celular en tu último escaneo.
            </p>
            <Link href="/patient-app/revelation">
              <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                Ver mi Plan de Rescate
              </button>
            </Link>
          </div>
          
          {/* Paso 2: La Solución Exclusiva */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-blue-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-zen-primary">2. Tu Solución</h3>
            </div>
            <p className="text-sm text-luxury-dark/80 mb-4">
              Técnica exclusiva Connell que respeta tu arquitectura ósea única.
            </p>
            <Link href="/patient-app/solution">
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Ver Video del Dr. Maya
              </button>
            </Link>
          </div>
          
          {/* Paso 3: La Facilitación */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-l-4 border-green-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-zen-primary">3. Tu Kit Listo</h3>
            </div>
            <p className="text-sm text-luxury-dark/80 mb-4">
              Tu kit de preparación celular está listo en Interdrogas.
            </p>
            <Link href="/patient-app/order">
              <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                Recíbelo Mañana
              </button>
            </Link>
          </div>
        </div>
        
        {/* Chat Directo */}
        <div className="bg-gradient-to-br from-zen-primary to-zen-secondary rounded-2xl p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Consulta con el Arquitecto</h3>
              <p className="text-sm opacity-90">Chat IA + Conexión Directa con Dr. Maya</p>
            </div>
            <MessageCircle className="w-12 h-12 opacity-80" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/patient-app/chat">
              <button className="w-full bg-white text-zen-primary py-4 rounded-xl font-bold hover:bg-luxury-light transition-colors shadow-lg">
                💬 Chat Rápido IA
                <p className="text-xs mt-1 opacity-70">Respuestas basadas en 50+ tratados</p>
              </button>
            </Link>
            
            <a
              href="https://wa.me/576024873000?text=Hola%20Dr.%20Maya,%20necesito%20consulta%20personalizada"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full bg-luxury-accent text-white py-4 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-lg">
                👨‍⚕️ Conexión Dr. Maya
                <p className="text-xs mt-1 opacity-90">Con tu reporte completo adjunto</p>
              </button>
            </a>
          </div>
        </div>
        
        {/* Selector de Modo */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <button className="text-zen-primary hover:text-zen-secondary transition-colors text-sm">
              🔄 Cambiar a Modo Doctor
            </button>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
