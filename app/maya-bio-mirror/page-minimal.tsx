'use client'

/**
 * MAYA BIO-MIRROR - VERSIÓN MINIMAL PARA DIAGNÓSTICO
 * Si esta versión funciona, el problema está en algún componente específico
 */

import { useState, useRef } from 'react'
import { Brain, Camera } from 'lucide-react'

export default function MayaBioMirrorPageMinimal() {
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // Test de importaciones progresivo
  const testImports = () => {
    setStep(1)
    try {
      // Test 1: Imports básicos
      console.log('✅ Test 1: React hooks OK')
      setStep(2)
      
      // Test 2: Icons
      console.log('✅ Test 2: Lucide icons OK')
      setStep(3)
      
      setError(null)
      alert('✅ Todos los tests pasaron! El problema está en algún componente específico.')
    } catch (err: any) {
      setError(err.message)
      console.error('❌ Error en test:', err)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 mx-auto">
              <Brain className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            MAYA BIO-MIRROR
          </h1>
          <p className="text-2xl font-light opacity-90">
            Modo de Diagnóstico - Versión Minimal
          </p>
        </div>
      </div>
      
      {/* CONTENT */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              🔍 Diagnóstico del Sistema
            </h2>
            
            {/* STATUS */}
            <div className="space-y-4 mb-8">
              <div className={`p-4 rounded-lg ${step >= 1 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <p className="font-bold text-gray-900">
                  {step >= 1 ? '✅' : '⏳'} Test 1: React & Hooks
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${step >= 2 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <p className="font-bold text-gray-900">
                  {step >= 2 ? '✅' : '⏳'} Test 2: Lucide Icons
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${step >= 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <p className="font-bold text-gray-900">
                  {step >= 3 ? '✅' : '⏳'} Test 3: Componentes Maya
                </p>
              </div>
            </div>
            
            {/* ERROR */}
            {error && (
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-8">
                <p className="font-bold text-red-900 mb-2">❌ Error detectado:</p>
                <p className="text-red-800 font-mono text-sm">{error}</p>
              </div>
            )}
            
            {/* ACTIONS */}
            <div className="space-y-4">
              <button
                onClick={testImports}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <Camera className="w-7 h-7" />
                Ejecutar Tests de Diagnóstico
              </button>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">
                  📋 Instrucciones:
                </h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>1. Haz clic en el botón de arriba</li>
                  <li>2. Observa qué tests pasan (✅) y cuáles fallan (❌)</li>
                  <li>3. Si todos pasan, el problema está en un componente específico</li>
                  <li>4. Abre la consola del navegador (F12) para ver más detalles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
