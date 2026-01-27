/**
 * CALCULADORA: CIRUGÍA VS NO QUIRÚRGICO
 * Muestra ROI a 5 años y comparación completa
 */

'use client'

import { useState } from 'react'

interface CalculatorProps {
  currentGoldenRatio: number
  age: number
  laxityScore: number
  boneDeficiency: number
}

export function SurgeryCalculator({ currentGoldenRatio, age, laxityScore, boneDeficiency }: CalculatorProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Cálculos
  const surgical = {
    cost_initial: boneDeficiency > 8 ? 25_000_000 : 15_000_000,
    improvement: boneDeficiency > 8 ? 16 : 10,
    duration: 'Permanente',
    maintenance_5y: 5_000_000,  // Retoque menor cada 10 años
    total_5y: (boneDeficiency > 8 ? 25_000_000 : 15_000_000) + 5_000_000
  }
  
  const non_surgical = {
    cost_initial: 20_000_000,  // Primera vez completo
    improvement: 8,
    duration: '12-18 meses',
    maintenance_18m: 15_000_000,  // Retoque cada 18 meses
    sessions_5y: Math.floor(60 / 18),  // 3.3 sesiones
    total_5y: 20_000_000 + (15_000_000 * Math.floor(60 / 18))
  }
  
  const combined = {
    cost_initial: 35_000_000,
    improvement: 18,
    duration: 'Mixto',
    total_5y: 45_000_000
  }
  
  const predicted_surgical = Math.min(currentGoldenRatio + surgical.improvement, 95)
  const predicted_non_surgical = Math.min(currentGoldenRatio + non_surgical.improvement, 90)
  const predicted_combined = Math.min(currentGoldenRatio + combined.improvement, 95)
  
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        💰 Calculadora: Cirugía vs No Quirúrgico
      </h2>
      
      <p className="text-gray-600 mb-6">
        Comparación de inversión, resultados y duración a 5 años
      </p>
      
      {/* COMPARACIÓN VISUAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* SOLO QUIRÚRGICO */}
        <div className="border-4 border-green-500 rounded-2xl p-6 bg-green-50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            MÁS ECONÓMICO 5 AÑOS
          </div>
          
          <h3 className="text-xl font-bold text-green-900 mt-4 mb-4">
            Solo Quirúrgico
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Inversión Inicial:</p>
              <p className="text-2xl font-bold text-green-700">
                ${(surgical.cost_initial / 1_000_000).toFixed(1)}M COP
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Total 5 Años:</p>
              <p className="text-xl font-bold text-green-900">
                ${(surgical.total_5y / 1_000_000).toFixed(1)}M COP
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Golden Ratio:</p>
              <p className="text-lg font-bold">
                <span className="text-gray-400">{currentGoldenRatio}</span>
                <span className="text-green-600"> → {predicted_surgical}</span>
              </p>
              <p className="text-xs text-green-600 font-semibold">
                +{surgical.improvement} puntos
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Duración:</p>
              <p className="font-bold text-green-700">✅ {surgical.duration}</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Mantenimiento:</p>
              <p className="text-xs text-gray-700">Retoque menor cada 10+ años</p>
            </div>
          </div>
        </div>
        
        {/* SOLO NO QUIRÚRGICO */}
        <div className="border-4 border-orange-500 rounded-2xl p-6 bg-orange-50">
          <h3 className="text-xl font-bold text-orange-900 mb-4">
            Solo No Quirúrgico
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Inversión Inicial:</p>
              <p className="text-2xl font-bold text-orange-700">
                ${(non_surgical.cost_initial / 1_000_000).toFixed(1)}M COP
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Total 5 Años:</p>
              <p className="text-xl font-bold text-orange-900">
                ${(non_surgical.total_5y / 1_000_000).toFixed(1)}M COP
              </p>
              <p className="text-xs text-orange-600">
                ({non_surgical.sessions_5y} sesiones de retoque)
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Golden Ratio:</p>
              <p className="text-lg font-bold">
                <span className="text-gray-400">{currentGoldenRatio}</span>
                <span className="text-orange-600"> → {predicted_non_surgical}</span>
              </p>
              <p className="text-xs text-orange-600 font-semibold">
                +{non_surgical.improvement} puntos
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Duración:</p>
              <p className="font-bold text-orange-700">⏰ {non_surgical.duration}</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Mantenimiento:</p>
              <p className="text-xs text-gray-700">Retoque cada 18 meses</p>
            </div>
          </div>
        </div>
        
        {/* COMBINADO */}
        <div className="border-4 border-purple-500 rounded-2xl p-6 bg-purple-50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            MEJOR RESULTADO
          </div>
          
          <h3 className="text-xl font-bold text-purple-900 mt-4 mb-4">
            Combinado
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Inversión Inicial:</p>
              <p className="text-2xl font-bold text-purple-700">
                ${(combined.cost_initial / 1_000_000).toFixed(1)}M COP
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Total 5 Años:</p>
              <p className="text-xl font-bold text-purple-900">
                ${(combined.total_5y / 1_000_000).toFixed(1)}M COP
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Golden Ratio:</p>
              <p className="text-lg font-bold">
                <span className="text-gray-400">{currentGoldenRatio}</span>
                <span className="text-purple-600"> → {predicted_combined}</span>
              </p>
              <p className="text-xs text-purple-600 font-semibold">
                +{combined.improvement} puntos
              </p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Duración:</p>
              <p className="font-bold text-purple-700">💎 {combined.duration}</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-gray-600">Estrategia:</p>
              <p className="text-xs text-gray-700">Óseo permanente + mantenimiento cosmético</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* RECOMENDACIÓN */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="font-bold text-lg text-gray-900 mb-3">
          🎯 Recomendación Basada en Tu Perfil:
        </h3>
        
        {age < 35 && boneDeficiency < 10 ? (
          <div>
            <p className="font-bold text-orange-700 mb-2">
              → Comenzar con NO QUIRÚRGICO
            </p>
            <p className="text-sm text-gray-700">
              Tu edad ({age} años) y deficiencia ósea moderada ({boneDeficiency}mm) permiten excelentes resultados 
              con procedimientos no invasivos. Considera cirugía solo si deseas resultados permanentes.
            </p>
          </div>
        ) : age >= 35 && age < 50 && boneDeficiency > 8 ? (
          <div>
            <p className="font-bold text-purple-700 mb-2">
              → COMBINADO (Óptimo)
            </p>
            <p className="text-sm text-gray-700">
              Tu edad ({age} años) y deficiencia ósea significativa ({boneDeficiency}mm) hacen que la cirugía ósea 
              (Park) sea la base ideal, complementada con procedimientos cosméticos para mantenimiento.
            </p>
          </div>
        ) : age >= 50 || laxityScore > 60 ? (
          <div>
            <p className="font-bold text-green-700 mb-2">
              → QUIRÚRGICO (Park + Connell)
            </p>
            <p className="text-sm text-gray-700">
              Tu edad ({age} años) y laxitud ({laxityScore}/100) requieren corrección estructural completa. 
              Los procedimientos no quirúrgicos no darán resultados satisfactorios a largo plazo.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-bold text-blue-700 mb-2">
              → Evaluación Personalizada Recomendada
            </p>
            <p className="text-sm text-gray-700">
              Tu perfil requiere análisis detallado para determinar la mejor estrategia.
            </p>
          </div>
        )}
      </div>
      
      {/* BOTÓN DETALLES */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
      >
        {showDetails ? '▲ Ocultar Detalles' : '▼ Ver Detalles Completos'}
      </button>
      
      {/* DETALLES EXPANDIDOS */}
      {showDetails && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">📊 Análisis Financiero Detallado:</h4>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2">Concepto</th>
                  <th className="text-right py-2">Quirúrgico</th>
                  <th className="text-right py-2">No Quirúrgico</th>
                  <th className="text-right py-2">Combinado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Año 0 (Inicial)</td>
                  <td className="text-right">${(surgical.cost_initial / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right">${(non_surgical.cost_initial / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right">${(combined.cost_initial / 1_000_000).toFixed(1)}M</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Año 1-2 (Mantenimiento)</td>
                  <td className="text-right">$0</td>
                  <td className="text-right">${(non_surgical.maintenance_18m / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right">$5M</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Año 3-4 (Retoque)</td>
                  <td className="text-right">$2M</td>
                  <td className="text-right">${(non_surgical.maintenance_18m / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right">$5M</td>
                </tr>
                <tr className="border-b-2 border-gray-300 font-bold">
                  <td className="py-2">TOTAL 5 AÑOS</td>
                  <td className="text-right text-green-700">${(surgical.total_5y / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right text-orange-700">${(non_surgical.total_5y / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right text-purple-700">${(combined.total_5y / 1_000_000).toFixed(1)}M</td>
                </tr>
                <tr className="font-bold text-green-600">
                  <td className="py-2">AHORRO vs No Quirúrgico</td>
                  <td className="text-right">${((non_surgical.total_5y - surgical.total_5y) / 1_000_000).toFixed(1)}M</td>
                  <td className="text-right">-</td>
                  <td className="text-right">${((non_surgical.total_5y - combined.total_5y) / 1_000_000).toFixed(1)}M</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">💡 Conclusiones:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ <strong>Cirugía es más económica</strong> a partir del año 3</li>
              <li>✅ <strong>No quirúrgico</strong> requiere compromiso de retoque cada 18 meses</li>
              <li>✅ <strong>Resultados quirúrgicos</strong> son permanentes (+{surgical.improvement} puntos Golden Ratio)</li>
              <li>✅ <strong>No quirúrgico</strong> logra 70% del potencial (+{non_surgical.improvement} puntos)</li>
              <li>✅ <strong>Combinado</strong> da mejores resultados (+{combined.improvement} puntos) con mantenimiento mínimo</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
