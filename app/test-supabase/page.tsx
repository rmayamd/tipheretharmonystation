'use client'

import { useState } from 'react'
import { runAllTests, testConnection, insertTestPatient } from '@/lib/supabase/real-connection-test'

export default function TestSupabasePage() {
  const [log, setLog] = useState<string[]>([])
  const [testing, setTesting] = useState(false)
  
  const addLog = (message: string) => {
    setLog(prev => [...prev, message])
  }
  
  const handleRunTests = async () => {
    setTesting(true)
    setLog([])
    
    // Redirigir console.log a nuestro log
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      addLog(args.join(' '))
      originalLog(...args)
    }
    
    console.error = (...args) => {
      addLog('❌ ' + args.join(' '))
      originalError(...args)
    }
    
    try {
      await runAllTests()
    } catch (error) {
      addLog(`❌ Error: ${error}`)
    }
    
    console.log = originalLog
    console.error = originalError
    setTesting(false)
  }
  
  const handleQuickTest = async () => {
    setTesting(true)
    setLog([])
    
    const connected = await testConnection()
    setLog(prev => [...prev, connected ? '✅ Conexión exitosa' : '❌ Error de conexión'])
    
    setTesting(false)
  }
  
  return (
    <div className="min-h-screen bg-luxury-light p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-zen-primary mb-4">
          🧪 Pruebas de Supabase Real
        </h1>
        
        <p className="text-luxury-dark/70 mb-8">
          Usa esta página para verificar que Supabase está conectado correctamente.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pasos previos:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Crear proyecto en <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">supabase.com</a></li>
            <li>Ejecutar migraciones en SQL Editor</li>
            <li>Copiar credenciales a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></li>
            <li>Reiniciar servidor (Ctrl+C y npm run dev)</li>
          </ol>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleQuickTest}
            disabled={testing}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚡ Prueba Rápida
          </button>
          
          <button
            onClick={handleRunTests}
            disabled={testing}
            className="bg-zen-primary text-white px-6 py-3 rounded-lg hover:bg-zen-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Prueba Completa
          </button>
        </div>
        
        {testing && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">⏳ Ejecutando pruebas...</p>
          </div>
        )}
        
        {log.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 overflow-auto max-h-96">
            <h3 className="text-white font-bold mb-4">📋 Log:</h3>
            {log.map((line, i) => (
              <div key={i} className="text-green-400 font-mono text-sm mb-1">
                {line}
              </div>
            ))}
          </div>
        )}
        
        {!testing && log.length === 0 && (
          <div className="bg-gray-100 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Haz click en un botón para empezar las pruebas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
