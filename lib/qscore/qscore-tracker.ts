/**
 * SISTEMA DE SEGUIMIENTO Q-SCORE
 * Tracking de evolución del paciente: Día 0 → 30 → 90
 */

import { QScoreComplete } from './body-q-engine'

export interface QScoreEvolution {
  patient_id: string
  patient_name: string
  
  // Timeline
  day_0_preop: QScoreComplete
  day_30_preop?: QScoreComplete // Después de protocolo Interdrogas
  day_90_postop?: QScoreComplete
  day_365_postop?: QScoreComplete
  
  // Métricas de Mejora
  satisfaction_improvement: number // %
  psychological_improvement: number // %
  physical_improvement: number // %
  
  // Estado del Journey
  current_phase: 'pre_op_assessment' | 'pre_op_optimization' | 'post_op_recovery' | 'post_op_stable'
  next_assessment_date: string
}

/**
 * Calcula la mejora entre dos assessments
 */
export function calculateImprovement(
  baseline: QScoreComplete,
  followup: QScoreComplete
): {
  satisfaction_change: number
  psychological_change: number
  physical_change: number
  overall_success: 'excellent' | 'good' | 'moderate' | 'poor'
} {
  const satisfactionChange = followup.global_satisfaction - baseline.global_satisfaction
  const psychologicalChange = followup.global_psychological_wellbeing - baseline.global_psychological_wellbeing
  const physicalChange = followup.global_physical_wellbeing - baseline.global_physical_wellbeing
  
  // Calcular éxito general
  const avgChange = (satisfactionChange + psychologicalChange + physicalChange) / 3
  
  let success: 'excellent' | 'good' | 'moderate' | 'poor'
  if (avgChange >= 30) success = 'excellent'
  else if (avgChange >= 20) success = 'good'
  else if (avgChange >= 10) success = 'moderate'
  else success = 'poor'
  
  return {
    satisfaction_change: satisfactionChange,
    psychological_change: psychologicalChange,
    physical_change: physicalChange,
    overall_success: success
  }
}

/**
 * GENERA ALERTAS DE MARKETING AUTOMÁTICO
 */
export function generateMarketingTriggers(
  qscore: QScoreComplete
): {
  trigger_type: 'low_satisfaction' | 'high_distress' | 'ready_for_surgery' | 'needs_optimization' | 'post_op_success'
  message: string
  action: string
  priority: 'high' | 'medium' | 'low'
}[] {
  const triggers: any[] = []
  
  // Trigger 1: Satisfacción Baja = Oportunidad de Venta
  if (qscore.global_satisfaction < 50) {
    triggers.push({
      trigger_type: 'low_satisfaction',
      message: `Paciente ${qscore.patient_id} tiene Q-Score de satisfacción bajo (${qscore.global_satisfaction}/100)`,
      action: 'Enviar invitación para simulación 3D y presupuesto personalizado',
      priority: 'high'
    })
  }
  
  // Trigger 2: Alto Distress = Necesita Soporte
  if (qscore.facial?.distress_social && qscore.facial.distress_social > 70) {
    triggers.push({
      trigger_type: 'high_distress',
      message: `Paciente con alto distress psicosocial (${qscore.facial.distress_social}/100)`,
      action: 'Protocolo de neuro-alineación + sesión educativa',
      priority: 'high'
    })
  }
  
  // Trigger 3: Listo para Cirugía
  if (qscore.predicted_satisfaction_increase && qscore.predicted_satisfaction_increase < 15) {
    triggers.push({
      trigger_type: 'ready_for_surgery',
      message: `Paciente optimizado biológicamente. Predicción de éxito: Alta`,
      action: 'Enviar propuesta quirúrgica con fecha disponible',
      priority: 'high'
    })
  }
  
  // Trigger 4: Necesita Optimización Pre-Op
  if (qscore.predicted_satisfaction_increase && qscore.predicted_satisfaction_increase > 20) {
    triggers.push({
      trigger_type: 'needs_optimization',
      message: `Se puede mejorar satisfacción ${qscore.predicted_satisfaction_increase}% con protocolo Interdrogas`,
      action: 'Enviar kit de preparación epigenética (30 días pre-op)',
      priority: 'medium'
    })
  }
  
  // Trigger 5: Post-Op Éxito = Testimonial
  if (qscore.assessment_type === 'post_op_90d' && qscore.global_satisfaction > 85) {
    triggers.push({
      trigger_type: 'post_op_success',
      message: `Éxito post-operatorio excelente (${qscore.global_satisfaction}/100)`,
      action: 'Solicitar testimonial + fotos para marketing + referral program',
      priority: 'medium'
    })
  }
  
  return triggers
}

/**
 * GUARDA Q-SCORE EN SUPABASE
 */
export async function saveQScoreToDatabase(qscore: QScoreComplete): Promise<void> {
  try {
    const { supabase } = await import('../supabase/client')
    
    const { error } = await supabase
      .from('qscore_assessments')
      .insert({
        patient_id: qscore.patient_id,
        assessment_date: qscore.assessment_date,
        assessment_type: qscore.assessment_type,
        
        // Scores Globales
        global_satisfaction: qscore.global_satisfaction,
        global_psychological: qscore.global_psychological_wellbeing,
        global_physical: qscore.global_physical_wellbeing,
        
        // Facial
        facial_data: qscore.facial,
        
        // Corporal
        corporal_data: qscore.corporal,
        
        // Risk Flags
        risk_unrealistic_expectations: qscore.risk_unrealistic_expectations,
        risk_body_dysmorphia: qscore.risk_body_dysmorphia,
        risk_psychological_distress: qscore.risk_psychological_distress,
        
        // Predicción
        predicted_improvement: qscore.predicted_satisfaction_increase
      })
    
    if (error) {
      console.error('Error guardando Q-Score:', error)
    } else {
      console.log('✅ Q-Score guardado en Supabase')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

/**
 * OBTIENE EVOLUCIÓN COMPLETA DEL PACIENTE
 */
export async function getPatientEvolution(patientId: string): Promise<QScoreEvolution | null> {
  try {
    const { supabase } = await import('../supabase/client')
    
    const { data, error } = await supabase
      .from('qscore_assessments')
      .select('*')
      .eq('patient_id', patientId)
      .order('assessment_date', { ascending: true })
    
    if (error || !data || data.length === 0) {
      return null
    }
    
    // Construir evolución
    const evolution: any = {
      patient_id: patientId,
      patient_name: '',
      current_phase: 'pre_op_assessment',
      satisfaction_improvement: 0,
      psychological_improvement: 0,
      physical_improvement: 0
    }
    
    // Organizar por tipo
    data.forEach((assessment: any) => {
      const qscore: QScoreComplete = {
        patient_id: assessment.patient_id,
        assessment_date: assessment.assessment_date,
        assessment_type: assessment.assessment_type,
        facial: assessment.facial_data,
        corporal: assessment.corporal_data,
        global_satisfaction: assessment.global_satisfaction,
        global_psychological_wellbeing: assessment.global_psychological,
        global_physical_wellbeing: assessment.global_physical,
        risk_unrealistic_expectations: assessment.risk_unrealistic_expectations,
        risk_body_dysmorphia: assessment.risk_body_dysmorphia,
        risk_psychological_distress: assessment.risk_psychological_distress,
        predicted_satisfaction_increase: assessment.predicted_improvement
      }
      
      if (assessment.assessment_type === 'pre_op') {
        evolution.day_0_preop = qscore
      } else if (assessment.assessment_type === 'post_op_30d') {
        evolution.day_30_preop = qscore
      } else if (assessment.assessment_type === 'post_op_90d') {
        evolution.day_90_postop = qscore
      } else if (assessment.assessment_type === 'post_op_1yr') {
        evolution.day_365_postop = qscore
      }
    })
    
    // Calcular mejoras
    if (evolution.day_0_preop && evolution.day_90_postop) {
      const improvement = calculateImprovement(evolution.day_0_preop, evolution.day_90_postop)
      evolution.satisfaction_improvement = improvement.satisfaction_change
      evolution.psychological_improvement = improvement.psychological_change
      evolution.physical_improvement = improvement.physical_change
    }
    
    return evolution
  } catch (error) {
    console.error('Error obteniendo evolución:', error)
    return null
  }
}
