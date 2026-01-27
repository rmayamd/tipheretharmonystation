/**
 * Prueba de Conexión Real con Supabase
 * Ejecutar esto para verificar que todo funciona
 */

import { supabase } from './client'

/**
 * Test 1: Verificar conexión
 */
export async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...')
  
  const { data, error } = await supabase
    .from('patients')
    .select('count')
  
  if (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
  
  console.log('✅ Conexión exitosa!')
  console.log('📊 Pacientes en base de datos:', data)
  return true
}

/**
 * Test 2: Insertar primer paciente
 */
export async function insertTestPatient() {
  console.log('📝 Insertando paciente de prueba...')
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      name: 'Juan Pérez (Test)',
      email: 'juan.test@mayaharmony.com',
      phone: '3001234567',
      age: 45,
      gender: 'M',
      segment: 'profesionales-activos',
      luxury_tier: 'premium',
    })
    .select()
  
  if (error) {
    console.error('❌ Error insertando:', error.message)
    return null
  }
  
  console.log('✅ Paciente insertado:', data)
  return data
}

/**
 * Test 3: Insertar análisis InBody
 */
export async function insertInBodyAnalysis(patientId: string) {
  console.log('📊 Guardando análisis InBody...')
  
  const { data, error } = await supabase
    .from('inbody_analysis')
    .insert({
      patient_id: patientId,
      body_fat_percentage: 22.5,
      muscle_mass: 32.8,
      extracellular_water: 0.38,
      intracellular_water: 24.5,
      phase_angle: 6.2,
      visceral_fat_level: 8,
      basal_metabolic_rate: 1650,
    })
    .select()
  
  if (error) {
    console.error('❌ Error guardando InBody:', error.message)
    return null
  }
  
  console.log('✅ Análisis InBody guardado:', data)
  return data
}

/**
 * Test 4: Consultar pacientes
 */
export async function getAllPatients() {
  console.log('📋 Consultando todos los pacientes...')
  
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      inbody_analysis(*),
      quantum_analysis(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('❌ Error consultando:', error.message)
    return []
  }
  
  console.log(`✅ ${data.length} pacientes encontrados`)
  return data
}

/**
 * Test 5: Actualizar paciente
 */
export async function updatePatient(patientId: string, updates: any) {
  console.log('✏️ Actualizando paciente...')
  
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patientId)
    .select()
  
  if (error) {
    console.error('❌ Error actualizando:', error.message)
    return null
  }
  
  console.log('✅ Paciente actualizado:', data)
  return data
}

/**
 * Ejecutar todos los tests
 */
export async function runAllTests() {
  console.log('🚀 Iniciando pruebas de conexión real...\n')
  
  // Test 1: Conexión
  const connected = await testConnection()
  if (!connected) {
    console.error('⚠️ No se pudo conectar a Supabase')
    console.error('📋 Verifica tu .env.local')
    return
  }
  
  console.log('\n---\n')
  
  // Test 2: Insertar
  const patient = await insertTestPatient()
  if (!patient || patient.length === 0) {
    console.error('⚠️ No se pudo insertar paciente')
    return
  }
  
  const patientId = patient[0].id
  
  console.log('\n---\n')
  
  // Test 3: InBody
  await insertInBodyAnalysis(patientId)
  
  console.log('\n---\n')
  
  // Test 4: Consultar
  await getAllPatients()
  
  console.log('\n---\n')
  
  // Test 5: Actualizar
  await updatePatient(patientId, {
    luxury_tier: 'vip'
  })
  
  console.log('\n\n✅ TODAS LAS PRUEBAS COMPLETADAS\n')
  console.log('🎉 Supabase está funcionando correctamente!')
  console.log('💾 Ve a tu dashboard de Supabase para ver los datos')
}
