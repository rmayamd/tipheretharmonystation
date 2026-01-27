'use client'

/**
 * COMPONENTE: Professional Hardware Studio
 * Control de cámaras DSLR y escáneres 3D profesionales
 */

import { useState, useEffect } from 'react'
import { Camera, Box, Wifi, Usb, Battery, Zap } from 'lucide-react'
import type { CameraManufacturer, ConnectionType, DSLRCameraSettings, CaptureResult } from '@/lib/hardware/dslr-camera-controller'
import type { Scanner3DType, ScanMode, ScanResult, BodyMeasurements3D } from '@/lib/hardware/scanner-3d-controller'

interface ProfessionalHardwareStudioProps {
  mode: 'photography' | '3d_scan' | 'both'
  onCaptureComplete?: (result: CaptureResult) => void
  onScanComplete?: (result: ScanResult) => void
  onMeasurementsComplete?: (measurements: BodyMeasurements3D) => void
}

export function ProfessionalHardwareStudio({
  mode,
  onCaptureComplete,
  onScanComplete,
  onMeasurementsComplete
}: ProfessionalHardwareStudioProps) {
  // ESTADO - CÁMARA DSLR
  const [cameraManufacturer, setCameraManufacturer] = useState<CameraManufacturer>('canon')
  const [cameraConnected, setCameraConnected] = useState(false)
  const [cameraSettings, setCameraSettings] = useState({
    iso: 200,
    aperture: 'f/8',
    shutter_speed: '1/125'
  })
  const [captureInProgress, setCaptureInProgress] = useState(false)
  const [lastCapture, setLastCapture] = useState<CaptureResult | null>(null)

  // ESTADO - ESCÁNER 3D
  const [scannerType, setScannerType] = useState<Scanner3DType>('intel_realsense_d435')
  const [scannerConnected, setScannerConnected] = useState(false)
  const [scanMode, setScanMode] = useState<ScanMode>('body')
  const [scanProgress, setScanProgress] = useState(0)
  const [scanInProgress, setScanInProgress] = useState(false)
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)

  // ESTADO - GENERAL
  const [activeTab, setActiveTab] = useState<'camera' | 'scanner'>('camera')

  /**
   * CONECTAR CÁMARA DSLR
   */
  const handleConnectCamera = async () => {
    // Aquí se llamaría a la API/módulo real
    // const controller = createCameraController(cameraManufacturer)
    // const connected = await controller.connect()
    
    // Simulación
    setCameraConnected(true)
    console.log(`✅ Cámara ${cameraManufacturer} conectada`)
  }

  /**
   * CAPTURAR FOTO DSLR
   */
  const handleCapture = async () => {
    if (!cameraConnected) return

    setCaptureInProgress(true)
    
    // Simulación de captura
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockResult: CaptureResult = {
      success: true,
      file_path: `/captures/${Date.now()}.jpg`,
      thumbnail_base64: 'data:image/jpeg;base64,...',
      metadata: {
        timestamp: new Date().toISOString(),
        camera_model: `${cameraManufacturer} Professional`,
        settings: cameraSettings as any,
        file_size_mb: 12.5,
        resolution: { width: 6720, height: 4480 }
      }
    }

    setLastCapture(mockResult)
    setCaptureInProgress(false)
    onCaptureComplete?.(mockResult)
    
    console.log('📸 Foto capturada exitosamente')
  }

  /**
   * CONECTAR ESCÁNER 3D
   */
  const handleConnectScanner = async () => {
    setScannerConnected(true)
    console.log(`✅ Escáner ${scannerType} conectado`)
  }

  /**
   * INICIAR ESCANEO 3D
   */
  const handleStartScan = async () => {
    if (!scannerConnected) return

    setScanInProgress(true)
    setScanProgress(0)

    // Simulación de progreso
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Esperar a completar
    await new Promise(resolve => setTimeout(resolve, 4500))

    const mockResult: ScanResult = {
      success: true,
      file_path: `/scans/${Date.now()}.ply`,
      preview_thumbnail: 'data:image/jpeg;base64,...',
      metadata: {
        scanner_type: scannerType,
        settings: {} as any,
        timestamp: new Date().toISOString(),
        scan_duration: 4.5,
        file_size_mb: 35
      }
    }

    setLastScan(mockResult)
    setScanInProgress(false)
    onScanComplete?.(mockResult)
    
    console.log('🎬 Escaneo 3D completado')
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-8">
        <h2 className="text-4xl font-black mb-2">🎬 STUDIO PROFESIONAL</h2>
        <p className="text-xl opacity-90">Cámaras DSLR + Escáneres 3D</p>
      </div>

      {/* TABS */}
      {mode === 'both' && (
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'camera'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Camera className="inline-block w-6 h-6 mr-2" />
            Cámara DSLR
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
              activeTab === 'scanner'
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Box className="inline-block w-6 h-6 mr-2" />
            Escáner 3D
          </button>
        </div>
      )}

      {/* SECCIÓN CÁMARA DSLR */}
      {(mode === 'photography' || (mode === 'both' && activeTab === 'camera')) && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Camera className="w-8 h-8 text-purple-600" />
            Cámara DSLR Profesional
          </h3>

          {/* SELECCIÓN DE CÁMARA */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fabricante
              </label>
              <select
                value={cameraManufacturer}
                onChange={(e) => setCameraManufacturer(e.target.value as CameraManufacturer)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={cameraConnected}
              >
                <option value="canon">Canon (EOS 5D, R5, R6)</option>
                <option value="nikon">Nikon (D850, Z6, Z7)</option>
                <option value="sony">Sony Alpha (A7III, A7IV)</option>
                <option value="fujifilm">Fujifilm (X-T4, GFX)</option>
              </select>
            </div>

            <div className="flex items-end">
              {!cameraConnected ? (
                <button
                  onClick={handleConnectCamera}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Usb className="w-5 h-5" />
                  Conectar Cámara
                </button>
              ) : (
                <div className="w-full bg-green-100 text-green-700 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Conectada
                </div>
              )}
            </div>
          </div>

          {/* AJUSTES DE CÁMARA */}
          {cameraConnected && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6 p-6 bg-gray-50 rounded-2xl">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">ISO</label>
                  <select
                    value={cameraSettings.iso}
                    onChange={(e) => setCameraSettings({ ...cameraSettings, iso: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="400">400</option>
                    <option value="800">800</option>
                    <option value="1600">1600</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Apertura</label>
                  <select
                    value={cameraSettings.aperture}
                    onChange={(e) => setCameraSettings({ ...cameraSettings, aperture: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    <option value="f/2.8">f/2.8</option>
                    <option value="f/4">f/4</option>
                    <option value="f/5.6">f/5.6</option>
                    <option value="f/8">f/8</option>
                    <option value="f/11">f/11</option>
                    <option value="f/16">f/16</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Velocidad</label>
                  <select
                    value={cameraSettings.shutter_speed}
                    onChange={(e) => setCameraSettings({ ...cameraSettings, shutter_speed: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    <option value="1/1000">1/1000</option>
                    <option value="1/500">1/500</option>
                    <option value="1/250">1/250</option>
                    <option value="1/125">1/125</option>
                    <option value="1/60">1/60</option>
                  </select>
                </div>
              </div>

              {/* BOTÓN CAPTURAR */}
              <button
                onClick={handleCapture}
                disabled={captureInProgress}
                className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all ${
                  captureInProgress
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105'
                }`}
              >
                {captureInProgress ? '📸 CAPTURANDO...' : '📸 CAPTURAR FOTO'}
              </button>

              {/* ÚLTIMA CAPTURA */}
              {lastCapture && (
                <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
                  <div className="text-sm font-bold text-green-700 mb-2">✅ Última captura</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>📁 {lastCapture.file_path}</div>
                    <div>📐 {lastCapture.metadata.resolution.width} x {lastCapture.metadata.resolution.height} px</div>
                    <div>💾 {lastCapture.metadata.file_size_mb} MB</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* SECCIÓN ESCÁNER 3D */}
      {(mode === '3d_scan' || (mode === 'both' && activeTab === 'scanner')) && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Box className="w-8 h-8 text-indigo-600" />
            Escáner 3D Profesional
          </h3>

          {/* SELECCIÓN DE ESCÁNER */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Escáner
              </label>
              <select
                value={scannerType}
                onChange={(e) => setScannerType(e.target.value as Scanner3DType)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={scannerConnected}
              >
                <option value="intel_realsense_d435">Intel RealSense D435</option>
                <option value="intel_realsense_d455">Intel RealSense D455</option>
                <option value="artec_eva">Artec Eva (Pro)</option>
                <option value="artec_leo">Artec Leo (Wireless)</option>
                <option value="structure_sensor">Structure Sensor</option>
                <option value="kinect_azure">Kinect Azure</option>
              </select>
            </div>

            <div className="flex items-end">
              {!scannerConnected ? (
                <button
                  onClick={handleConnectScanner}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Conectar Escáner
                </button>
              ) : (
                <div className="w-full bg-green-100 text-green-700 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Conectado
                </div>
              )}
            </div>
          </div>

          {/* MODO DE ESCANEO */}
          {scannerConnected && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Modo de Escaneo
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {(['body', 'face', 'skull', 'limb', 'custom'] as ScanMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setScanMode(mode)}
                      className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                        scanMode === mode
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {mode === 'body' && '🧍 Cuerpo'}
                      {mode === 'face' && '😊 Rostro'}
                      {mode === 'skull' && '💀 Cráneo'}
                      {mode === 'limb' && '🦵 Extremidad'}
                      {mode === 'custom' && '⚙️ Custom'}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTÓN ESCANEAR */}
              <button
                onClick={handleStartScan}
                disabled={scanInProgress}
                className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all ${
                  scanInProgress
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-2xl hover:scale-105'
                }`}
              >
                {scanInProgress ? '🎬 ESCANEANDO...' : '🎬 INICIAR ESCANEO 3D'}
              </button>

              {/* BARRA DE PROGRESO */}
              {scanInProgress && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                    <span>Progreso del escaneo</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* ÚLTIMO ESCANEO */}
              {lastScan && (
                <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <div className="text-sm font-bold text-blue-700 mb-2">✅ Último escaneo</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>📁 {lastScan.file_path}</div>
                    <div>⏱️ {lastScan.metadata.scan_duration}s</div>
                    <div>💾 {lastScan.metadata.file_size_mb} MB</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
