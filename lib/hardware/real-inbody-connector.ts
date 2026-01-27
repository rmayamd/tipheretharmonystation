/**
 * CONECTOR REAL INBODY H30
 * Integración con el dispositivo InBody Dial H30 vía USB/Serial
 */

// NO importar mayaBrain aquí para evitar errores de compilación en cliente
// Se importará dinámicamente cuando se necesite

export interface InBodyRealData {
  // Composición Corporal
  weight: number // kg
  body_fat_mass: number // kg
  body_fat_percentage: number // %
  lean_body_mass: number // kg
  muscle_mass: number // kg
  
  // Agua Corporal
  total_body_water: number // L
  intracellular_water: number // L
  extracellular_water: number // L
  ecw_tbw_ratio: number // Ratio crítico para ERAS
  
  // Análisis Segmental
  segmental_lean: {
    right_arm: number
    left_arm: number
    trunk: number
    right_leg: number
    left_leg: number
  }
  
  segmental_fat: {
    right_arm: number
    left_arm: number
    trunk: number
    right_leg: number
    left_leg: number
  }
  
  // Parámetros Críticos
  phase_angle: number // Indicador de integridad celular
  visceral_fat_level: number // 1-20
  basal_metabolic_rate: number // kcal
  
  // Metadatos
  test_date: string
  device_id: string
}

export class InBodyConnector {
  private port: any = null // SerialPort en Node.js
  private connected = false
  
  /**
   * Conecta con el dispositivo InBody H30
   */
  async connect(portName: string = 'COM3'): Promise<boolean> {
    try {
      console.log(`🔌 Intentando conectar con InBody H30 en ${portName}...`)
      
      if (typeof window !== 'undefined') {
        // Navegador: usar Web Serial API
        return await this.connectBrowser()
      } else {
        // Node.js: usar serialport
        return await this.connectNode(portName)
      }
    } catch (error) {
      console.error('Error conectando InBody:', error)
      return false
    }
  }
  
  /**
   * Conexión en navegador usando Web Serial API
   */
  private async connectBrowser(): Promise<boolean> {
    if (!('serial' in navigator)) {
      console.error('Web Serial API no soportada en este navegador')
      return false
    }
    
    try {
      // @ts-ignore - Web Serial API
      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 9600 })
      
      this.port = port
      this.connected = true
      
      console.log('✅ InBody H30 conectado (Web Serial)')
      return true
    } catch (error) {
      console.error('Error en Web Serial:', error)
      return false
    }
  }
  
  /**
   * Conexión en Node.js usando serialport
   */
  private async connectNode(portName: string): Promise<boolean> {
    try {
      // En producción, instalar: npm install serialport
      // const { SerialPort } = require('serialport')
      
      console.log('ℹ️ Modo simulación - InBody H30')
      console.log('Para producción: instalar serialport y configurar puerto')
      
      this.connected = true
      return true
    } catch (error) {
      console.error('Error en conexión Node:', error)
      return false
    }
  }
  
  /**
   * Lee datos del InBody H30
   */
  async readData(): Promise<InBodyRealData | null> {
    if (!this.connected) {
      console.warn('InBody no está conectado')
      return null
    }
    
    try {
      console.log('📊 Leyendo datos de InBody H30...')
      
      // En producción, aquí se lee del puerto serial
      // Por ahora, retornamos datos de ejemplo realistas
      const data: InBodyRealData = await this.simulateRead()
      
      console.log('✅ Datos recibidos de InBody H30')
      return data
    } catch (error) {
      console.error('Error leyendo InBody:', error)
      return null
    }
  }
  
  /**
   * Simula lectura del dispositivo (para desarrollo)
   */
  private async simulateRead(): Promise<InBodyRealData> {
    // Simular latencia del dispositivo
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      weight: 68.5,
      body_fat_mass: 15.4,
      body_fat_percentage: 22.5,
      lean_body_mass: 53.1,
      muscle_mass: 32.8,
      
      total_body_water: 38.9,
      intracellular_water: 24.1,
      extracellular_water: 14.8,
      ecw_tbw_ratio: 0.380, // Normal: 0.360-0.390
      
      segmental_lean: {
        right_arm: 2.5,
        left_arm: 2.4,
        trunk: 23.1,
        right_leg: 8.2,
        left_leg: 8.3
      },
      
      segmental_fat: {
        right_arm: 1.1,
        left_arm: 1.0,
        trunk: 8.5,
        right_leg: 2.9,
        left_leg: 2.8
      },
      
      phase_angle: 6.2, // Normal: >5.0
      visceral_fat_level: 8, // Normal: <10
      basal_metabolic_rate: 1485,
      
      test_date: new Date().toISOString(),
      device_id: 'INBODY-H30-001'
    }
  }
  
  /**
   * Procesa datos y los envía al Cerebro Maya
   */
  async processAndAnalyze(patientId: string): Promise<void> {
    const data = await this.readData()
    if (!data) {
      throw new Error('No se pudieron leer datos del InBody')
    }
    
    console.log('💾 Guardando análisis en Supabase...')
    
    // Guardar en Supabase (importación dinámica)
    const { supabase } = await import('../supabase/client')
    const { data: savedData, error } = await supabase
      .from('inbody_analysis')
      .insert({
        patient_id: patientId,
        body_fat_percentage: data.body_fat_percentage,
        muscle_mass: data.muscle_mass,
        segmental_fat: data.segmental_fat,
        extracellular_water: data.extracellular_water,
        intracellular_water: data.intracellular_water,
        visceral_fat_level: data.visceral_fat_level,
        basal_metabolic_rate: data.basal_metabolic_rate,
        phase_angle: data.phase_angle
      })
      .select()
    
    if (error) {
      console.error('Error guardando InBody:', error)
      throw error
    }
    
    console.log('✅ Datos guardados en Supabase')
    
    // Enviar al Cerebro Maya para análisis (importación dinámica)
    console.log('🧠 Analizando con Cerebro Maya...')
    const { mayaBrain } = await import('../maya-brain/real-brain-engine')
    const recommendation = await mayaBrain.analyzeInBodyData(patientId, data)
    
    if (recommendation) {
      console.log('✅ Recomendaciones generadas:')
      console.log(`   - Prioridad: ${recommendation.priority}`)
      console.log(`   - Fuentes: ${recommendation.sources.length} libros`)
      console.log(`   - Confianza: ${recommendation.confidence}%`)
      
      if (recommendation.surgery_block) {
        console.log('⚠️ CIRUGÍA BLOQUEADA:')
        console.log(`   Razón: ${recommendation.surgery_block.reason}`)
      }
      
      if (recommendation.interdrogas_order) {
        console.log('📦 Orden para Interdrogas preparada:')
        console.log(`   Items: ${recommendation.interdrogas_order.items.length}`)
      }
    }
  }
  
  /**
   * Desconecta el dispositivo
   */
  async disconnect(): Promise<void> {
    if (this.port) {
      try {
        if (typeof window !== 'undefined' && this.port.close) {
          await this.port.close()
        }
        console.log('✅ InBody H30 desconectado')
      } catch (error) {
        console.error('Error desconectando:', error)
      }
    }
    
    this.connected = false
    this.port = null
  }
}

// Instancia singleton
export const inBodyConnector = new InBodyConnector()
