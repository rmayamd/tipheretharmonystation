import { createClient } from '@supabase/supabase-js'

/**
 * MAYA-CORE: RESOLUCIÓN DE CREDENCIALES
 * Conexión directa a la base de datos de Tipheret Harmony Station
 */

// 1. Definimos las llaves con respaldo real para evitar caídas en el Build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zodwsbuzvvdxlfsuyilr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-ZdlFmwezhARZMknFG7M3w_JNhrJBfe'

// 2. Inicialización blindada
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('📡 Maya Core: Conectando vía resolución directa (Build Stage).')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)