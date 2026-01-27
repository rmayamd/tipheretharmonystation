'use client'

import { AlertTriangle, TrendingUp, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RevelationPage() {
  // Simulación de datos del paciente
  const patientData = {
    name: 'Juan Pérez',
    inflammation: 75.3,
    collagen: 38.5,
    oxidativeStress: 68.2,
    cellularAge: 52,
    chronologicalAge: 45,
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Alarmante */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Revelación Importante</h1>
              <p className="text-sm opacity-90">Dr. Maya - Análisis Cuántico</p>
            </div>
          </div>
          
          <p className="text-lg">
            {patientData.name}, tu último escaneo cuántico revela marcadores críticos que requieren atención inmediata.
          </p>
        </div>
        
        {/* Hallazgos Críticos */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-zen-primary mb-6">📊 Hallazgos Críticos</h2>
          
          <div className="space-y-6">
            {/* Inflamación NFκB */}
            <div className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-red-600">Inflamación Molecular (NFκB)</h3>
                <span className="text-3xl font-bold text-red-600">{patientData.inflammation}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-700"
                  style={{ width: `${patientData.inflammation}%` }}
                ></div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-bold text-red-700 mb-2">🚨 NIVEL CRÍTICO</p>
                <p className="text-sm text-luxury-dark/80">
                  Tu marcador NFκB está en {patientData.inflammation}% - muy por encima del umbral seguro (50%). 
                  Esto indica inflamación molecular crónica que acelera el envejecimiento.
                </p>
              </div>
              <div className="mt-3 text-sm text-luxury-dark/70">
                <p className="font-bold mb-1">Consecuencias si no actúas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Envejecimiento acelerado (3-5 años por año cronológico)</li>
                  <li>Mayor riesgo de complicaciones post-quirúrgicas</li>
                  <li>Cicatrización comprometida</li>
                  <li>Respuesta inflamatoria exagerada</li>
                </ul>
              </div>
            </div>
            
            {/* Síntesis de Colágeno */}
            <div className="border-l-4 border-amber-500 pl-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-amber-600">Síntesis de Colágeno</h3>
                <span className="text-3xl font-bold text-amber-600">{patientData.collagen}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${patientData.collagen}%` }}
                ></div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm font-bold text-amber-700 mb-2">⚠️ POR DEBAJO DEL UMBRAL QUIRÚRGICO</p>
                <p className="text-sm text-luxury-dark/80">
                  Tu capacidad de síntesis de colágeno está en {patientData.collagen}% - por debajo del 60% 
                  requerido para procedimientos quirúrgicos seguros.
                </p>
              </div>
              <div className="mt-3 text-sm text-luxury-dark/70">
                <p className="font-bold mb-1">Esto significa:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cicatrización lenta (2-3x tiempo normal)</li>
                  <li>Mayor riesgo de queloides y cicatrices hipertróficas</li>
                  <li>Resultados quirúrgicos subóptimos</li>
                  <li>Necesitas preparación epigenética 12+ semanas</li>
                </ul>
              </div>
            </div>
            
            {/* Estrés Oxidativo */}
            <div className="border-l-4 border-orange-500 pl-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-orange-600">Estrés Oxidativo</h3>
                <span className="text-3xl font-bold text-orange-600">{patientData.oxidativeStress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${patientData.oxidativeStress}%` }}
                ></div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-luxury-dark/80">
                  Tus células están bajo estrés oxidativo elevado, acelerando el daño celular 
                  y el envejecimiento prematuro.
                </p>
              </div>
            </div>
            
            {/* Edad Celular */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-luxury-dark/70 mb-1">Tu Edad Celular Real</p>
                  <p className="text-5xl font-bold text-purple-600">{patientData.cellularAge} años</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-luxury-dark/70 mb-1">Edad Cronológica</p>
                  <p className="text-3xl font-bold text-luxury-dark">{patientData.chronologicalAge} años</p>
                </div>
              </div>
              <div className="mt-4 bg-purple-100 rounded-lg p-3">
                <p className="text-sm font-bold text-purple-700">
                  ⚠️ Estás envejeciendo {patientData.cellularAge - patientData.chronologicalAge} años más rápido 
                  de lo que deberías
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* El Plan de Rescate */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-10 h-10 text-green-600" />
            <h2 className="text-2xl font-bold text-green-700">Tu Plan de Rescue Nutricional</h2>
          </div>
          
          <p className="text-luxury-dark mb-6">
            Basado en tu perfil cuántico, el Cerebro Maya ha generado un protocolo personalizado 
            de 12 semanas para revertir estos marcadores:
          </p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-zen-primary mb-2">🔬 Protocolo Anti-Inflamatorio</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Curcumina 1g</strong> + <strong>Piperina</strong> - Reduce NFκB hasta 60%</li>
                <li>• <strong>Omega-3 EPA/DHA 2g</strong> - Anti-inflamatorio molecular</li>
                <li>• <strong>Resveratrol 500mg</strong> - Activación SIRT1</li>
              </ul>
              <p className="text-xs text-luxury-dark/60 mt-2">
                Fuentes: Byung Pal Yu + Epigenetic Modulation in Clinical Practice
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-zen-primary mb-2">💪 Protocolo de Colágeno</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>Colágeno Hidrolizado 15g</strong> - Síntesis directa</li>
                <li>• <strong>Vitamina C 1000mg</strong> - Cofactor esencial</li>
                <li>• <strong>Zinc 15mg</strong> + <strong>Cobre 2mg</strong> - Activadores enzimáticos</li>
              </ul>
              <p className="text-xs text-luxury-dark/60 mt-2">
                Fuentes: Zein Obagi + Scar Management Protocols
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-zen-primary mb-2">⚡ Protocolo Antioxidante</h3>
              <ul className="text-sm space-y-2">
                <li>• <strong>CoQ10 200mg</strong> - Función mitocondrial</li>
                <li>• <strong>NAC 600mg</strong> - Glutatión precursor</li>
                <li>• <strong>Vitamina E 400 UI</strong> - Protección membranas</li>
              </ul>
              <p className="text-xs text-luxury-dark/60 mt-2">
                Fuentes: Oxidative Stress and Mitochondrial Health
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-green-600 text-white rounded-xl p-4">
            <p className="font-bold mb-2">✅ RESULTADO ESPERADO (12 semanas):</p>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-2xl font-bold">-40%</p>
                <p className="text-xs">Inflamación</p>
              </div>
              <div>
                <p className="text-2xl font-bold">+30%</p>
                <p className="text-xs">Colágeno</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-7 años</p>
                <p className="text-xs">Edad Celular</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://wa.me/576024873000?text=Hola%20Dr.%20Maya,%20vi%20mi%20revelación.%20Necesito%20iniciar%20mi%20plan%20de%20rescate%20inmediatamente."
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center space-x-2">
              <span>Iniciar Mi Protocolo Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          
          <Link href="/patient-app">
            <button className="w-full bg-white text-zen-primary border-2 border-zen-primary py-4 rounded-xl font-bold hover:bg-zen-primary hover:text-white transition-all">
              ← Volver al Bio-Mirror
            </button>
          </Link>
        </div>
        
        {/* Timer de Urgencia */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-red-500 text-white px-6 py-3 rounded-full">
            <p className="text-sm font-bold">⏰ Tu ventana de optimización cierra en 48 horas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
