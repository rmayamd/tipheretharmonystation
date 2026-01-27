'use client'

/**
 * PÁGINA DE DIAGNÓSTICO - TEST
 * Para identificar qué está causando la pantalla en blanco
 */

import { useState } from 'react'

export default function TestPage() {
  const [step, setStep] = useState(1)
  
  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-8">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          🧪 PÁGINA DE TEST - MAYA
        </h1>
        
        <p className="text-lg text-gray-700 mb-4">
          Si ves esto, significa que React está funcionando correctamente.
        </p>
        
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-bold">
            ✅ Estado actual: Step {step}
          </p>
        </div>
        
        <button
          onClick={() => setStep(step + 1)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700"
        >
          Siguiente paso (actual: {step})
        </button>
        
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h2 className="font-bold text-gray-900 mb-2">Información del Sistema:</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Cliente: OK ✅</li>
            <li>• React: OK ✅</li>
            <li>• Estado (useState): OK ✅</li>
            <li>• Tailwind CSS: OK ✅</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
