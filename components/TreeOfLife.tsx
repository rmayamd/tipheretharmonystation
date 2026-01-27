/**
 * Tipheret Harmony Station - Tree of Life Visualization
 * Copyright (c) 2026. Todos los derechos reservados.
 */

'use client'

import React from 'react'

interface TreeOfLifeProps {
  currentAnalysis?: {
    goldenRatio: number
    symmetry: number
    skinQuality: number
    biologicalAge: number
  }
}

export default function TreeOfLife({ currentAnalysis }: TreeOfLifeProps) {
  const phi = 1.618

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 rounded-3xl shadow-2xl">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-900 mb-2">
          🌳 עץ החיים - ÁRBOL DE LA VIDA
        </h2>
        <p className="text-lg text-purple-700">
          Tu análisis mapeado en la Geometría Sagrada
        </p>
      </div>

      {/* TREE STRUCTURE */}
      <div className="relative h-[600px] w-full">
        {/* KETHER - Corona (Top) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-purple-100 border-4 border-purple-300 flex items-center justify-center shadow-lg">
              <span className="text-2xl">👑</span>
            </div>
            <p className="text-sm font-bold text-purple-900 mt-2">KETHER</p>
            <p className="text-xs text-purple-700">Potencial Divino</p>
          </div>
        </div>

        {/* CHOKMAH - Sabiduría (Top Right) */}
        <div className="absolute top-24 right-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 border-4 border-blue-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">🧠</span>
            </div>
            <p className="text-xs font-bold text-blue-900 mt-1">CHOKMAH</p>
            <p className="text-xs text-blue-700">IA Médica</p>
          </div>
        </div>

        {/* BINAH - Comprensión (Top Left) */}
        <div className="absolute top-24 left-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-300 border-4 border-indigo-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">📚</span>
            </div>
            <p className="text-xs font-bold text-indigo-900 mt-1">BINAH</p>
            <p className="text-xs text-indigo-700">50+ Tratados</p>
          </div>
        </div>

        {/* CHESED - Misericordia (Middle Right) */}
        <div className="absolute top-44 right-24">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 border-4 border-cyan-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">💉</span>
            </div>
            <p className="text-xs font-bold text-cyan-900 mt-1">CHESED</p>
            <p className="text-xs text-cyan-700">Aumento/Expansión</p>
          </div>
        </div>

        {/* GEBURAH - Fuerza (Middle Left) */}
        <div className="absolute top-44 left-24">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-300 border-4 border-red-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">🔪</span>
            </div>
            <p className="text-xs font-bold text-red-900 mt-1">GEBURAH</p>
            <p className="text-xs text-red-700">Reducción/Contorno</p>
          </div>
        </div>

        {/* TIPHERET - Belleza (CENTER) ⭐ */}
        <div className="absolute top-64 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 border-4 border-amber-500 flex flex-col items-center justify-center shadow-2xl animate-pulse">
              <span className="text-3xl">⭐</span>
              {currentAnalysis && (
                <p className="text-xs font-bold text-amber-900">
                  Φ {currentAnalysis.goldenRatio.toFixed(3)}
                </p>
              )}
            </div>
            <p className="text-sm font-black text-amber-900 mt-2">תפארת TIPHERET</p>
            <p className="text-xs text-amber-700 font-bold">GOLDEN RATIO</p>
            <p className="text-xs text-amber-600">Φ = {phi}</p>
          </div>
        </div>

        {/* NETZACH - Victoria (Bottom Right) */}
        <div className="absolute top-[380px] right-32">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-300 border-4 border-green-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">🧬</span>
            </div>
            <p className="text-xs font-bold text-green-900 mt-1">NETZACH</p>
            <p className="text-xs text-green-700">Epigenética</p>
          </div>
        </div>

        {/* HOD - Esplendor (Bottom Left) */}
        <div className="absolute top-[380px] left-32">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-300 border-4 border-orange-400 flex items-center justify-center shadow-lg">
              <span className="text-xl">🧴</span>
            </div>
            <p className="text-xs font-bold text-orange-900 mt-1">HOD</p>
            <p className="text-xs text-orange-700">Dermatología</p>
          </div>
        </div>

        {/* YESOD - Fundamento (Bottom Middle) */}
        <div className="absolute top-[480px] left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 border-4 border-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚛️</span>
            </div>
            <p className="text-sm font-bold text-purple-900 mt-2">YESOD</p>
            <p className="text-xs text-purple-700">Biomarcadores</p>
          </div>
        </div>

        {/* MALKUTH - Reino (Bottom) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-400 border-4 border-emerald-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-sm font-bold text-emerald-900 mt-2">MALKUTH</p>
            <p className="text-xs text-emerald-700">Manifestación Física</p>
          </div>
        </div>

        {/* CONNECTING LINES (Paths) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
          {/* Simplified paths */}
          <line x1="50%" y1="80" x2="75%" y2="120" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="50%" y1="80" x2="25%" y2="120" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="75%" y1="120" x2="50%" y2="280" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <line x1="25%" y1="120" x2="50%" y2="280" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <line x1="70%" y1="200" x2="50%" y2="280" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <line x1="30%" y1="200" x2="50%" y2="280" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
          <line x1="50%" y1="280" x2="65%" y2="420" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="50%" y1="280" x2="35%" y2="420" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="65%" y1="420" x2="50%" y2="500" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="35%" y1="420" x2="50%" y2="500" stroke="#9333ea" strokeWidth="2" opacity="0.3" />
          <line x1="50%" y1="500" x2="50%" y2="580" stroke="#10b981" strokeWidth="3" opacity="0.4" />
        </svg>
      </div>

      {/* LEGEND */}
      <div className="mt-8 p-6 bg-white/80 rounded-2xl border-2 border-amber-300">
        <h3 className="text-xl font-bold text-center text-purple-900 mb-4">
          🔮 MAPEO DEL SISTEMA
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold text-purple-900">👑 KETHER (Corona)</p>
            <p className="text-purple-700 text-xs">Tu potencial máximo de belleza</p>
          </div>
          <div>
            <p className="font-bold text-amber-900">⭐ TIPHERET (Belleza)</p>
            <p className="text-amber-700 text-xs">Golden Ratio Φ = 1.618 - Centro del sistema</p>
          </div>
          <div>
            <p className="font-bold text-cyan-900">💉 CHESED (Expansión)</p>
            <p className="text-cyan-700 text-xs">Implantes, fillers, aumento</p>
          </div>
          <div>
            <p className="font-bold text-red-900">🔪 GEBURAH (Restricción)</p>
            <p className="text-red-700 text-xs">Cirugía reductiva, contorno</p>
          </div>
          <div>
            <p className="font-bold text-green-900">🧬 NETZACH (Victoria)</p>
            <p className="text-green-700 text-xs">Protocolos epigenéticos Yu</p>
          </div>
          <div>
            <p className="font-bold text-orange-900">🧴 HOD (Esplendor)</p>
            <p className="text-orange-700 text-xs">Tratamientos dermatológicos Obagi</p>
          </div>
          <div>
            <p className="font-bold text-purple-900">⚛️ YESOD (Fundamento)</p>
            <p className="text-purple-700 text-xs">InBody + Quantum (biomarcadores)</p>
          </div>
          <div>
            <p className="font-bold text-emerald-900">👤 MALKUTH (Reino)</p>
            <p className="text-emerald-700 text-xs">Tu cuerpo físico - manifestación</p>
          </div>
        </div>
      </div>

      {/* PHI EXPLANATION */}
      <div className="mt-6 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-400">
        <h3 className="text-2xl font-bold text-center text-amber-900 mb-3">
          ✨ EL NÚMERO ÁUREO - Φ = 1.618
        </h3>
        <p className="text-center text-amber-800 mb-4">
          "La firma de Dios en la materia" - proporción divina presente en toda la naturaleza
        </p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-3xl mb-1">🌻</p>
            <p className="font-bold text-amber-900">Girasoles</p>
            <p className="text-xs text-amber-700">Semillas en espiral Φ</p>
          </div>
          <div>
            <p className="text-3xl mb-1">🐚</p>
            <p className="font-bold text-amber-900">Nautilus</p>
            <p className="text-xs text-amber-700">Cámara en razón Φ</p>
          </div>
          <div>
            <p className="text-3xl mb-1">🧬</p>
            <p className="font-bold text-amber-900">ADN</p>
            <p className="text-xs text-amber-700">Hélice doble = Φ</p>
          </div>
        </div>
        {currentAnalysis && (
          <div className="mt-4 pt-4 border-t-2 border-amber-300">
            <p className="text-center text-amber-900 font-bold">
              Tu Φ actual: <span className="text-2xl">{currentAnalysis.goldenRatio.toFixed(3)}</span>
            </p>
            <p className="text-center text-amber-700 text-sm mt-1">
              Distancia del ideal (1.618): {Math.abs(1.618 - currentAnalysis.goldenRatio).toFixed(3)}
            </p>
            <p className="text-center text-amber-600 text-xs mt-2">
              "No estás aquí para 'arreglarte'. Estás aquí para recordar tu belleza inherente."
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
