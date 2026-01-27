/**
 * MÓDULO DE CONEXIÓN CON CÁMARAS DSLR PROFESIONALES
 * 
 * Soporta:
 * - Canon EOS (5D, 6D, 80D, 90D, R5, R6, etc.)
 * - Nikon (D850, D750, Z6, Z7, etc.)
 * - Sony Alpha (A7III, A7IV, A7R, etc.)
 * 
 * Protocolos:
 * - PTP/IP (Picture Transfer Protocol over IP)
 * - USB Tethering
 * - WiFi Direct
 * - SDK nativo del fabricante
 */

export type CameraManufacturer = 'canon' | 'nikon' | 'sony' | 'fujifilm' | 'olympus'
export type ConnectionType = 'usb' | 'wifi' | 'ethernet' | 'bluetooth'
export type CaptureMode = 'single' | 'burst' | 'timelapse' | 'bracketing'

export interface DSLRCameraSettings {
  // EXPOSICIÓN
  iso: number // 100, 200, 400, 800, 1600, 3200, 6400, 12800
  aperture: string // f/1.4, f/2.8, f/4, f/5.6, f/8, f/11, f/16
  shutter_speed: string // 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15
  exposure_compensation: number // -2, -1, 0, +1, +2 EV
  
  // ENFOQUE
  focus_mode: 'manual' | 'auto_single' | 'auto_continuous'
  focus_point: 'center' | 'multi' | 'face_detection' | 'eye_detection'
  
  // BALANCE DE BLANCOS
  white_balance: 'auto' | 'daylight' | 'cloudy' | 'tungsten' | 'fluorescent' | 'flash' | 'custom'
  white_balance_kelvin?: number // 2500-10000K
  
  // CALIDAD DE IMAGEN
  image_format: 'RAW' | 'JPEG' | 'RAW+JPEG'
  jpeg_quality: 'fine' | 'normal' | 'basic'
  image_size: 'large' | 'medium' | 'small' // Megapixels completos, medio, pequeño
  
  // DRIVE MODE
  drive_mode: 'single' | 'continuous_low' | 'continuous_high' | 'timer'
  
  // FLASH
  flash_mode: 'off' | 'auto' | 'on' | 'fill' | 'slow_sync' | 'rear_curtain'
  flash_compensation: number // -2, -1, 0, +1, +2 EV
}

export interface CameraInfo {
  manufacturer: CameraManufacturer
  model: string
  serial_number: string
  firmware_version: string
  battery_level: number // 0-100%
  shots_available: number
  memory_card_capacity: number // GB
  memory_card_free: number // GB
  connection_type: ConnectionType
  is_connected: boolean
}

export interface CaptureResult {
  success: boolean
  file_path?: string
  thumbnail_base64?: string
  metadata: {
    timestamp: string
    camera_model: string
    settings: DSLRCameraSettings
    file_size_mb: number
    resolution: { width: number; height: number }
    exif_data?: Record<string, any>
  }
  error?: string
}

/**
 * CONFIGURACIONES PRE-DEFINIDAS PARA FOTOGRAFÍA MÉDICA
 */
export const MEDICAL_PHOTOGRAPHY_PRESETS = {
  // ROSTRO - Análisis facial de alta precisión
  facial_analysis: {
    iso: 200,
    aperture: 'f/8',
    shutter_speed: '1/125',
    exposure_compensation: 0,
    focus_mode: 'auto_single' as const,
    focus_point: 'face_detection' as const,
    white_balance: 'daylight' as const,
    image_format: 'RAW+JPEG' as const,
    jpeg_quality: 'fine' as const,
    image_size: 'large' as const,
    drive_mode: 'single' as const,
    flash_mode: 'off' as const,
    flash_compensation: 0
  },
  
  // CUERPO - Fotografía corporal completa
  body_full: {
    iso: 400,
    aperture: 'f/11',
    shutter_speed: '1/125',
    exposure_compensation: 0,
    focus_mode: 'auto_single' as const,
    focus_point: 'center' as const,
    white_balance: 'daylight' as const,
    image_format: 'RAW+JPEG' as const,
    jpeg_quality: 'fine' as const,
    image_size: 'large' as const,
    drive_mode: 'single' as const,
    flash_mode: 'fill' as const,
    flash_compensation: -1
  },
  
  // DETALLE - Macro para piel, cicatrices, detalles
  skin_detail: {
    iso: 100,
    aperture: 'f/16',
    shutter_speed: '1/60',
    exposure_compensation: 0,
    focus_mode: 'manual' as const,
    focus_point: 'center' as const,
    white_balance: 'daylight' as const,
    white_balance_kelvin: 5500,
    image_format: 'RAW+JPEG' as const,
    jpeg_quality: 'fine' as const,
    image_size: 'large' as const,
    drive_mode: 'single' as const,
    flash_mode: 'off' as const,
    flash_compensation: 0
  },
  
  // ANTES/DESPUÉS - Consistencia perfecta
  before_after: {
    iso: 200,
    aperture: 'f/8',
    shutter_speed: '1/125',
    exposure_compensation: 0,
    focus_mode: 'manual' as const, // Manual para misma distancia focal
    focus_point: 'center' as const,
    white_balance: 'custom' as const, // Custom WB para consistencia
    white_balance_kelvin: 5500,
    image_format: 'RAW+JPEG' as const,
    jpeg_quality: 'fine' as const,
    image_size: 'large' as const,
    drive_mode: 'single' as const,
    flash_mode: 'fill' as const,
    flash_compensation: 0
  }
}

/**
 * CLASE PRINCIPAL: DSLR Camera Controller
 */
export class DSLRCameraController {
  private manufacturer: CameraManufacturer
  private connectionType: ConnectionType
  private isConnected: boolean = false
  private currentSettings: DSLRCameraSettings
  private cameraInfo: CameraInfo | null = null

  constructor(manufacturer: CameraManufacturer, connectionType: ConnectionType = 'usb') {
    this.manufacturer = manufacturer
    this.connectionType = connectionType
    this.currentSettings = MEDICAL_PHOTOGRAPHY_PRESETS.facial_analysis
  }

  /**
   * Detectar cámaras conectadas
   */
  async detectCameras(): Promise<CameraInfo[]> {
    console.log(`🔍 Buscando cámaras ${this.manufacturer} vía ${this.connectionType}...`)
    
    // En producción, esto usaría:
    // - gPhoto2 (Linux/Mac)
    // - Canon EDSDK (Canon)
    // - Nikon SDK (Nikon)
    // - Sony Remote SDK
    // - libptp (genérico)
    
    // Simulación para desarrollo
    const mockCameras: CameraInfo[] = [
      {
        manufacturer: this.manufacturer,
        model: this.getMockModel(),
        serial_number: `SN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        firmware_version: '1.0.0',
        battery_level: 85,
        shots_available: 450,
        memory_card_capacity: 64,
        memory_card_free: 48.5,
        connection_type: this.connectionType,
        is_connected: false
      }
    ]

    return mockCameras
  }

  /**
   * Conectar con cámara específica
   */
  async connect(serialNumber?: string): Promise<boolean> {
    try {
      const cameras = await this.detectCameras()
      
      if (cameras.length === 0) {
        throw new Error('No se encontraron cámaras conectadas')
      }

      const targetCamera = serialNumber 
        ? cameras.find(c => c.serial_number === serialNumber)
        : cameras[0]

      if (!targetCamera) {
        throw new Error(`No se encontró cámara con serial ${serialNumber}`)
      }

      // Simular conexión
      this.isConnected = true
      this.cameraInfo = { ...targetCamera, is_connected: true }

      console.log(`✅ Conectado a ${this.cameraInfo.manufacturer} ${this.cameraInfo.model}`)
      console.log(`   Batería: ${this.cameraInfo.battery_level}%`)
      console.log(`   Memoria libre: ${this.cameraInfo.memory_card_free}GB`)

      return true
    } catch (error) {
      console.error('❌ Error al conectar:', error)
      return false
    }
  }

  /**
   * Desconectar cámara
   */
  disconnect(): void {
    this.isConnected = false
    if (this.cameraInfo) {
      this.cameraInfo.is_connected = false
    }
    console.log('🔌 Cámara desconectada')
  }

  /**
   * Configurar ajustes de cámara
   */
  async setSettings(settings: Partial<DSLRCameraSettings>): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Cámara no conectada')
    }

    this.currentSettings = { ...this.currentSettings, ...settings }
    console.log('⚙️ Ajustes actualizados:', settings)
    return true
  }

  /**
   * Aplicar preset médico
   */
  async applyMedicalPreset(preset: keyof typeof MEDICAL_PHOTOGRAPHY_PRESETS): Promise<boolean> {
    const presetSettings = MEDICAL_PHOTOGRAPHY_PRESETS[preset]
    return await this.setSettings(presetSettings)
  }

  /**
   * Capturar foto
   */
  async capture(): Promise<CaptureResult> {
    if (!this.isConnected) {
      return {
        success: false,
        error: 'Cámara no conectada',
        metadata: this.getMetadata()
      }
    }

    try {
      console.log('📸 Capturando foto...')
      
      // Simular captura (en producción: comando real a cámara)
      await this.simulateShutterDelay()

      // Simular transferencia de archivo
      const filePath = this.generateFilePath()
      const thumbnailBase64 = this.generateThumbnail()

      console.log(`✅ Foto capturada: ${filePath}`)

      return {
        success: true,
        file_path: filePath,
        thumbnail_base64: thumbnailBase64,
        metadata: this.getMetadata()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        metadata: this.getMetadata()
      }
    }
  }

  /**
   * Captura múltiple (ráfaga)
   */
  async captureBurst(count: number, intervalMs: number = 500): Promise<CaptureResult[]> {
    const results: CaptureResult[] = []

    for (let i = 0; i < count; i++) {
      const result = await this.capture()
      results.push(result)
      
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, intervalMs))
      }
    }

    return results
  }

  /**
   * Live View (preview en tiempo real)
   */
  async startLiveView(): Promise<ReadableStream | null> {
    if (!this.isConnected) {
      throw new Error('Cámara no conectada')
    }

    console.log('📹 Live View iniciado')
    // En producción: retornar stream de video MJPEG o similar
    return null
  }

  /**
   * Obtener información de la cámara
   */
  getCameraInfo(): CameraInfo | null {
    return this.cameraInfo
  }

  /**
   * Obtener ajustes actuales
   */
  getCurrentSettings(): DSLRCameraSettings {
    return { ...this.currentSettings }
  }

  // ==========================================
  // MÉTODOS AUXILIARES PRIVADOS
  // ==========================================

  private getMockModel(): string {
    const models = {
      canon: 'EOS 5D Mark IV',
      nikon: 'D850',
      sony: 'Alpha A7 IV',
      fujifilm: 'X-T4',
      olympus: 'OM-D E-M1 Mark III'
    }
    return models[this.manufacturer] || 'Unknown Model'
  }

  private async simulateShutterDelay(): Promise<void> {
    // Simular tiempo de obturación y transferencia
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  private generateFilePath(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const ext = this.currentSettings.image_format === 'RAW' ? 'CR2' : 'JPG'
    return `/captures/${this.manufacturer}/${timestamp}.${ext}`
  }

  private generateThumbnail(): string {
    // En producción: miniatura real base64
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...'
  }

  private getMetadata(): CaptureResult['metadata'] {
    const resolution = this.getResolutionForSize(this.currentSettings.image_size)
    
    return {
      timestamp: new Date().toISOString(),
      camera_model: this.cameraInfo?.model || 'Unknown',
      settings: { ...this.currentSettings },
      file_size_mb: this.estimateFileSize(),
      resolution,
      exif_data: {
        Make: this.manufacturer,
        Model: this.cameraInfo?.model,
        ISO: this.currentSettings.iso,
        FNumber: this.currentSettings.aperture,
        ExposureTime: this.currentSettings.shutter_speed,
        WhiteBalance: this.currentSettings.white_balance
      }
    }
  }

  private getResolutionForSize(size: string): { width: number; height: number } {
    const resolutions = {
      large: { width: 6720, height: 4480 }, // ~30MP
      medium: { width: 4800, height: 3200 }, // ~15MP
      small: { width: 3360, height: 2240 }   // ~7MP
    }
    return resolutions[size as keyof typeof resolutions] || resolutions.large
  }

  private estimateFileSize(): number {
    const { image_format, image_size } = this.currentSettings
    
    // Estimaciones aproximadas
    if (image_format === 'RAW') return 35
    if (image_format === 'RAW+JPEG') return 45
    
    const jpegSizes = {
      large: { fine: 12, normal: 8, basic: 5 },
      medium: { fine: 7, normal: 5, basic: 3 },
      small: { fine: 4, normal: 2, basic: 1 }
    }
    
    return jpegSizes[image_size as keyof typeof jpegSizes]?.[this.currentSettings.jpeg_quality as keyof typeof jpegSizes.large] || 10
  }
}

/**
 * FACTORY para crear controladores de cámara
 */
export function createCameraController(
  manufacturer: CameraManufacturer,
  connectionType: ConnectionType = 'usb'
): DSLRCameraController {
  return new DSLRCameraController(manufacturer, connectionType)
}

/**
 * UTILIDAD: Validar ajustes de cámara
 */
export function validateCameraSettings(settings: Partial<DSLRCameraSettings>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (settings.iso && ![100, 200, 400, 800, 1600, 3200, 6400, 12800].includes(settings.iso)) {
    errors.push('ISO inválido')
  }

  if (settings.white_balance_kelvin && (settings.white_balance_kelvin < 2500 || settings.white_balance_kelvin > 10000)) {
    errors.push('Temperatura de color fuera de rango (2500-10000K)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
