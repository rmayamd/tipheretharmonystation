/**
 * GENERADOR DE CERTIFICADO Q-SCORE DE ALTA TECNOLOGÍA
 * Diseño profesional para el PDF del paciente
 */

import { QScoreComplete } from './body-q-engine'
import { QScoreEvolution } from './qscore-tracker'

export function generateQScoreCertificateHTML(
  patientName: string,
  patientId: string,
  qscore: QScoreComplete,
  evolution?: QScoreEvolution
): string {
  const now = new Date()
  const certificateNumber = `QSCORE-${patientId}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
  
  // Determinar color según score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981' // Verde
    if (score >= 60) return '#f59e0b' // Amarillo
    if (score >= 40) return '#f97316' // Naranja
    return '#ef4444' // Rojo
  }
  
  // Determinar nivel de satisfacción
  const getSatisfactionLevel = (score: number) => {
    if (score >= 85) return 'EXCELENTE'
    if (score >= 70) return 'BUENO'
    if (score >= 50) return 'MODERADO'
    return 'BAJO'
  }
  
  return `
<div style="page-break-before: always; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
  
  <!-- HEADER CERTIFICADO -->
  <div style="background: white; border-radius: 20px; padding: 40px; margin-bottom: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <div style="text-align: center; border-bottom: 4px solid #7c3aed; padding-bottom: 30px; margin-bottom: 30px;">
      <div style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; margin-bottom: 10px;">
        BODY-Q® VALIDATED ASSESSMENT
      </div>
      <h1 style="font-size: 48px; color: #7c3aed; margin: 0; font-weight: 900; letter-spacing: -1px;">
        Q-SCORE CERTIFICATE
      </h1>
      <div style="font-size: 16px; color: #6b7280; margin-top: 10px;">
        Memorial Sloan Kettering Cancer Center Protocol
      </div>
      <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
        Maya Harmony Station™ | Bioengineering Institute
      </div>
    </div>
    
    <!-- DATOS DEL PACIENTE -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Paciente</div>
        <div style="font-size: 24px; color: #1f2937; font-weight: bold;">${patientName}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">ID</div>
        <div style="font-size: 24px; color: #1f2937; font-weight: bold;">${patientId}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Fecha de Evaluación</div>
        <div style="font-size: 18px; color: #1f2937; font-weight: bold;">${new Date(qscore.assessment_date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">Certificado N°</div>
        <div style="font-size: 18px; color: #7c3aed; font-weight: bold;">${certificateNumber}</div>
      </div>
    </div>
    
    <!-- SCORE GLOBAL DESTACADO -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 40px; text-align: center; color: white; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
      <div style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; margin-bottom: 10px; font-weight: bold;">
        Q-SCORE GLOBAL DE SATISFACCIÓN
      </div>
      <div style="font-size: 96px; font-weight: 900; line-height: 1; margin-bottom: 10px;">
        ${qscore.global_satisfaction}
      </div>
      <div style="font-size: 28px; font-weight: bold; opacity: 0.95;">
        / 100 puntos
      </div>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.3);">
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 1px;">
          NIVEL: ${getSatisfactionLevel(qscore.global_satisfaction)}
        </div>
      </div>
    </div>
    
    <!-- SCORES DETALLADOS -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
      <div style="background: #f9fafb; border-radius: 12px; padding: 25px; text-align: center; border-left: 4px solid ${getScoreColor(qscore.global_satisfaction)};">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">
          Satisfacción General
        </div>
        <div style="font-size: 48px; font-weight: 900; color: ${getScoreColor(qscore.global_satisfaction)}; line-height: 1;">
          ${qscore.global_satisfaction}
        </div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">/ 100</div>
      </div>
      
      <div style="background: #f9fafb; border-radius: 12px; padding: 25px; text-align: center; border-left: 4px solid ${getScoreColor(qscore.global_psychological_wellbeing)};">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">
          Bienestar Psicológico
        </div>
        <div style="font-size: 48px; font-weight: 900; color: ${getScoreColor(qscore.global_psychological_wellbeing)}; line-height: 1;">
          ${qscore.global_psychological_wellbeing}
        </div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">/ 100</div>
      </div>
      
      <div style="background: #f9fafb; border-radius: 12px; padding: 25px; text-align: center; border-left: 4px solid ${getScoreColor(qscore.global_physical_wellbeing)};">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">
          Bienestar Físico
        </div>
        <div style="font-size: 48px; font-weight: 900; color: ${getScoreColor(qscore.global_physical_wellbeing)}; line-height: 1;">
          ${qscore.global_physical_wellbeing}
        </div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">/ 100</div>
      </div>
    </div>
    
    ${qscore.facial ? `
    <!-- SCORES FACIALES -->
    <div style="background: #faf5ff; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 2px solid #e9d5ff;">
      <h3 style="color: #7c3aed; font-size: 20px; margin: 0 0 20px 0; font-weight: bold;">
        📊 Análisis Facial Detallado
      </h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Satisfacción General</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.facial.satisfaction_overall)};">${qscore.facial.satisfaction_overall}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Nariz</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.facial.satisfaction_nose)};">${qscore.facial.satisfaction_nose}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Ojos</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.facial.satisfaction_eyes)};">${qscore.facial.satisfaction_eyes}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Línea Mandibular</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.facial.satisfaction_jawline)};">${qscore.facial.satisfaction_jawline}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Calidad de Piel</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.facial.satisfaction_skin)};">${qscore.facial.satisfaction_skin}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Distress Psicosocial</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(100 - qscore.facial.distress_social)};">${qscore.facial.distress_social}</span>
        </div>
      </div>
    </div>
    ` : ''}
    
    ${qscore.corporal ? `
    <!-- SCORES CORPORALES -->
    <div style="background: #f0fdf4; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 2px solid #bbf7d0;">
      <h3 style="color: #059669; font-size: 20px; margin: 0 0 20px 0; font-weight: bold;">
        📊 Análisis Corporal Detallado
      </h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Satisfacción Mamaria</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.corporal.satisfaction_breast)};">${qscore.corporal.satisfaction_breast}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Satisfacción Abdominal</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.corporal.satisfaction_abdomen)};">${qscore.corporal.satisfaction_abdomen}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Confianza Sexual</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(qscore.corporal.sexual_confidence)};">${qscore.corporal.sexual_confidence}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px;">
          <span style="color: #6b7280; font-weight: 600;">Imagen Corporal</span>
          <span style="font-size: 24px; font-weight: bold; color: ${getScoreColor(100 - qscore.corporal.distress_body_image)};">${100 - qscore.corporal.distress_body_image}</span>
        </div>
      </div>
    </div>
    ` : ''}
    
    ${qscore.predicted_satisfaction_increase > 0 ? `
    <!-- PREDICCIÓN DE MEJORA -->
    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 30px; margin-bottom: 20px; color: white; text-align: center;">
      <div style="font-size: 16px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.95; margin-bottom: 10px; font-weight: bold;">
        PREDICCIÓN CIENTÍFICA
      </div>
      <div style="font-size: 56px; font-weight: 900; line-height: 1; margin-bottom: 10px;">
        +${qscore.predicted_satisfaction_increase}%
      </div>
      <div style="font-size: 20px; opacity: 0.95; font-weight: 600;">
        Mejora Esperada con Protocolo de Optimización Biológica
      </div>
      <div style="margin-top: 20px; font-size: 14px; opacity: 0.9; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.3);">
        Basado en marcadores de inflamación (NFκB), síntesis de colágeno y composición corporal
      </div>
    </div>
    ` : ''}
    
    ${(qscore.risk_unrealistic_expectations || qscore.risk_body_dysmorphia || qscore.risk_psychological_distress) ? `
    <!-- ALERTAS CLÍNICAS -->
    <div style="background: #fef2f2; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
      <h3 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
        ⚠️ ALERTAS CLÍNICAS
      </h3>
      ${qscore.risk_unrealistic_expectations ? '<div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; color: #991b1b; font-weight: 600;">• Expectativas no realistas detectadas - Requiere sesión educativa</div>' : ''}
      ${qscore.risk_body_dysmorphia ? '<div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; color: #991b1b; font-weight: 600;">• Posible trastorno dismórfico corporal - Evaluación psicológica recomendada</div>' : ''}
      ${qscore.risk_psychological_distress ? '<div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; color: #991b1b; font-weight: 600;">• Alto distress psicológico - Soporte psicológico recomendado</div>' : ''}
    </div>
    ` : ''}
    
    ${evolution ? `
    <!-- EVOLUCIÓN DEL PACIENTE -->
    <div style="background: #eff6ff; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 2px solid #bfdbfe;">
      <h3 style="color: #1e40af; font-size: 20px; margin: 0 0 20px 0; font-weight: bold;">
        📈 Evolución del Tratamiento
      </h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        ${evolution.day_0_preop ? `
        <div style="background: white; border-radius: 10px; padding: 20px; text-align: center;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">DÍA 0 (Pre-Op)</div>
          <div style="font-size: 42px; font-weight: 900; color: #6b7280;">${evolution.day_0_preop.global_satisfaction}</div>
        </div>
        ` : ''}
        ${evolution.day_30_preop ? `
        <div style="background: white; border-radius: 10px; padding: 20px; text-align: center;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">DÍA 30 (Optimización)</div>
          <div style="font-size: 42px; font-weight: 900; color: #f59e0b;">${evolution.day_30_preop.global_satisfaction}</div>
        </div>
        ` : ''}
        ${evolution.day_90_postop ? `
        <div style="background: white; border-radius: 10px; padding: 20px; text-align: center;">
          <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;">DÍA 90 (Post-Op)</div>
          <div style="font-size: 42px; font-weight: 900; color: #10b981;">${evolution.day_90_postop.global_satisfaction}</div>
        </div>
        ` : ''}
      </div>
      ${evolution.satisfaction_improvement > 0 ? `
      <div style="margin-top: 20px; text-align: center; padding: 15px; background: white; border-radius: 8px;">
        <span style="color: #059669; font-size: 28px; font-weight: 900;">↑ ${evolution.satisfaction_improvement} puntos de mejora</span>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    <!-- VALIDACIÓN CIENTÍFICA -->
    <div style="border-top: 3px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
      <div style="font-size: 12px; color: #6b7280; text-align: center; line-height: 1.8;">
        <p style="margin: 0 0 10px 0;"><strong style="color: #1f2937;">VALIDACIÓN CIENTÍFICA:</strong></p>
        <p style="margin: 0 0 5px 0;">Este Q-Score utiliza el instrumento BODY-Q® desarrollado por Memorial Sloan Kettering Cancer Center</p>
        <p style="margin: 0 0 5px 0;">Metodología Rasch validada internacionalmente para medición de Patient-Reported Outcomes (PRO)</p>
        <p style="margin: 0 0 20px 0;">Correlación con biomarcadores según protocolos de Byung Pal Yu (Epigenética) y Bruce Connell (Cirugía Facial)</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid #e5e7eb;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: left;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">CERTIFICADO POR:</div>
              <div style="color: #7c3aed; font-weight: bold;">Dr. Maya | Director de Bioingeniería Humana</div>
              <div style="color: #6b7280; font-size: 11px; margin-top: 3px;">Maya Harmony Station™</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; color: #1f2937; margin-bottom: 5px;">FECHA DE EMISIÓN:</div>
              <div style="color: #1f2937; font-weight: 600;">${new Date().toLocaleDateString('es-CO')}</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
          <div style="color: white; font-weight: bold; font-size: 14px; margin-bottom: 10px;">
            🔬 MAYA HARMONY STATION™
          </div>
          <div style="color: white; opacity: 0.9; font-size: 12px;">
            Sistema Integrado de Bioingeniería Humana | Cali, Colombia
          </div>
          <div style="color: white; opacity: 0.8; font-size: 11px; margin-top: 5px;">
            Protocolo validado con 50+ tratados médicos internacionales
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `
}
