/**
 * PASAPORTE DE INMORTALIDAD
 * Documento PDF impactante con todo el plan de reprogramación epigenética del paciente
 */

import { AutomaticPrescription } from '../pharmacology/automatic-vademecum'
import { MechanobiologicalPrediction } from '../mechanobiology/tissue-movement-predictor'
import { IntegratedPediatricAnalysis } from '../diagnosis/integrated-pediatric-analysis'

export interface ImmortalityPassportData {
  // Datos del Paciente
  patient: {
    id: string
    name: string
    age: number
    biological_age: number
    age_delta: number // Diferencia cronológica vs biológica
  }
  
  // Análisis Actual
  current_state: {
    // Maya-Vision
    skin_quality: number
    facial_symmetry: number
    laxity_score: number
    
    // InBody
    muscle_mass: number
    body_fat: number
    phase_angle: number
    visceral_fat: number
    
    // Quantum
    collagen_synthesis: number
    inflammation_level: number
    oxidative_stress: number
    vitamin_deficiencies: string[]
  }
  
  // Predicción Quirúrgica (si aplica)
  surgical_prediction?: MechanobiologicalPrediction
  
  // Prescripción Farmacológica
  prescription: AutomaticPrescription
  
  // Plan Epigenético
  epigenetic_program: {
    phase1_preparation: string[] // 8-12 semanas
    phase2_optimization: string[] // Durante
    phase3_maintenance: string[] // Post
    expected_outcomes: string[]
  }
  
  // Proyección Futura (12 meses)
  future_projection: {
    biological_age_target: number
    skin_quality_target: number
    muscle_mass_target: number
    expected_improvement: string
  }
}

/**
 * Genera el HTML del Pasaporte de Inmortalidad
 * En producción, esto se convertiría a PDF usando jsPDF o similar
 */
export function generateImmortalityPassportHTML(data: ImmortalityPassportData): string {
  
  const ageDelta = data.patient.age - data.patient.biological_age
  const ageStatus = ageDelta > 0 ? '✅ MÁS JOVEN' : '⚠️ ENVEJECIMIENTO ACELERADO'
  const ageColor = ageDelta > 0 ? '#10b981' : '#ef4444'
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pasaporte de Inmortalidad - ${data.patient.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #1a1a2e;
      line-height: 1.6;
    }
    
    .passport-container {
      max-width: 1200px;
      margin: 40px auto;
      background: white;
      border-radius: 30px;
      overflow: hidden;
      box-shadow: 0 30px 90px rgba(0,0,0,0.3);
    }
    
    .passport-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 60px 40px;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .passport-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 8s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .passport-seal {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      backdrop-filter: blur(10px);
      border: 4px solid rgba(255,255,255,0.3);
    }
    
    .passport-title {
      font-size: 48px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 10px;
      text-shadow: 2px 2px 20px rgba(0,0,0,0.2);
    }
    
    .passport-subtitle {
      font-size: 20px;
      font-weight: 300;
      opacity: 0.95;
      letter-spacing: 2px;
    }
    
    .passport-body {
      padding: 60px 40px;
    }
    
    .section {
      margin-bottom: 50px;
      padding: 30px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 20px;
      position: relative;
    }
    
    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .section-icon {
      font-size: 36px;
    }
    
    .bio-age-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .age-box {
      padding: 30px;
      background: white;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .age-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .age-value {
      font-size: 72px;
      font-weight: 800;
      line-height: 1;
    }
    
    .age-unit {
      font-size: 24px;
      color: #999;
      margin-top: 5px;
    }
    
    .delta-card {
      grid-column: 1 / -1;
      padding: 25px;
      background: ${ageColor};
      color: white;
      border-radius: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .metric-card {
      background: white;
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }
    
    .metric-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #999;
      margin-bottom: 10px;
    }
    
    .metric-value {
      font-size: 36px;
      font-weight: 700;
      color: #667eea;
    }
    
    .metric-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 10px;
      margin-top: 15px;
      overflow: hidden;
    }
    
    .metric-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 10px;
      transition: width 1s ease;
    }
    
    .prescription-list {
      margin-top: 20px;
    }
    
    .prescription-item {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 15px;
      border-left: 5px solid #667eea;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    }
    
    .prescription-product {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    
    .prescription-dosage {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .prescription-rationale {
      font-size: 13px;
      color: #888;
      font-style: italic;
      margin-top: 10px;
    }
    
    .prescription-source {
      font-size: 11px;
      color: #aaa;
      margin-top: 5px;
    }
    
    .phase-timeline {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    
    .phase-card {
      background: white;
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }
    
    .phase-number {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      margin: 0 auto 15px;
    }
    
    .phase-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #667eea;
    }
    
    .phase-items {
      text-align: left;
      font-size: 13px;
      color: #666;
      line-height: 1.8;
    }
    
    .future-projection {
      background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
      padding: 40px;
      border-radius: 20px;
      text-align: center;
    }
    
    .projection-title {
      font-size: 32px;
      font-weight: 800;
      color: #2d3436;
      margin-bottom: 20px;
    }
    
    .projection-values {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 30px;
    }
    
    .projection-box {
      background: white;
      padding: 20px;
      border-radius: 15px;
    }
    
    .projection-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
    }
    
    .projection-value {
      font-size: 42px;
      font-weight: 800;
      color: #00b894;
    }
    
    .passport-footer {
      background: #1a1a2e;
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .footer-signature {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .footer-seal {
      font-size: 14px;
      opacity: 0.7;
    }
    
    .stamp {
      display: inline-block;
      padding: 15px 30px;
      background: rgba(255,255,255,0.1);
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      margin-top: 20px;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    @media print {
      body { background: white; }
      .passport-container { box-shadow: none; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="passport-container">
    <!-- HEADER -->
    <div class="passport-header">
      <div class="passport-seal">🧬</div>
      <h1 class="passport-title">Pasaporte de Inmortalidad</h1>
      <p class="passport-subtitle">Plan de Reprogramación Epigenética Personalizado</p>
    </div>
    
    <!-- BODY -->
    <div class="passport-body">
      <!-- SECCIÓN 1: EDAD BIOLÓGICA -->
      <div class="section">
        <h2 class="section-title">
          <span class="section-icon">⏰</span>
          Tu Edad Biológica
        </h2>
        
        <div class="bio-age-card">
          <div class="age-box">
            <div class="age-label">Edad Cronológica</div>
            <div class="age-value">${data.patient.age}</div>
            <div class="age-unit">años</div>
          </div>
          
          <div class="age-box">
            <div class="age-label">Edad Biológica</div>
            <div class="age-value" style="color: ${ageColor}">${data.patient.biological_age}</div>
            <div class="age-unit">años</div>
          </div>
          
          <div class="delta-card">
            ${ageStatus}: ${Math.abs(ageDelta)} años ${ageDelta > 0 ? 'más joven' : 'mayor'}
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Calidad de Piel</div>
            <div class="metric-value">${data.current_state.skin_quality}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${data.current_state.skin_quality}%"></div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Simetría Facial</div>
            <div class="metric-value">${data.current_state.facial_symmetry}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${data.current_state.facial_symmetry}%"></div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Masa Muscular</div>
            <div class="metric-value">${data.current_state.muscle_mass.toFixed(1)}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${Math.min(100, (data.current_state.muscle_mass / 40) * 100)}%"></div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Síntesis Colágeno</div>
            <div class="metric-value">${data.current_state.collagen_synthesis}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${data.current_state.collagen_synthesis}%"></div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Phase Angle</div>
            <div class="metric-value">${data.current_state.phase_angle.toFixed(1)}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${(data.current_state.phase_angle / 8) * 100}%"></div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Grasa Visceral</div>
            <div class="metric-value">${data.current_state.visceral_fat}</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${Math.min(100, data.current_state.visceral_fat * 10)}%; background: ${data.current_state.visceral_fat > 10 ? '#ef4444' : '#10b981'}"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- SECCIÓN 2: PRESCRIPCIÓN PERSONALIZADA -->
      <div class="section">
        <h2 class="section-title">
          <span class="section-icon">💊</span>
          Tu Receta Epigenética
        </h2>
        
        <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
          Protocolo nutracéutico personalizado basado en tu análisis Quantum + InBody
        </p>
        
        <div class="prescription-list">
          ${data.prescription.recommendations.map(rec => `
            <div class="prescription-item">
              <div class="prescription-product">${rec.product_name}</div>
              <div class="prescription-dosage">
                💊 <strong>${rec.dosage}</strong> • ${rec.frequency} • ${rec.timing}
              </div>
              <div class="prescription-dosage">
                ⏱️ Duración: ${rec.duration}
              </div>
              <div class="prescription-rationale">
                ${rec.rationale}
              </div>
              <div class="prescription-source">
                📚 Fuente: ${rec.scientific_source}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 15px; text-align: center;">
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">INVERSIÓN MENSUAL</div>
          <div style="font-size: 48px; font-weight: 800; color: #667eea;">
            $${data.prescription.total_monthly_cost.toLocaleString('es-CO')}
          </div>
          <div style="font-size: 16px; color: #999; margin-top: 5px;">COP / mes</div>
          <div style="margin-top: 20px; padding: 15px; background: #10b981; color: white; border-radius: 10px; font-weight: 700;">
            ✅ Pedido listo para Interdrogas (6024873000)
          </div>
        </div>
      </div>
      
      <!-- SECCIÓN 3: PLAN EPIGENÉTICO -->
      <div class="section">
        <h2 class="section-title">
          <span class="section-icon">🧬</span>
          Tu Plan de Reprogramación Epigenética
        </h2>
        
        <div class="phase-timeline">
          <div class="phase-card">
            <div class="phase-number">1</div>
            <div class="phase-title">Preparación</div>
            <div class="phase-items">
              <strong>8-12 semanas</strong><br><br>
              ${data.epigenetic_program.phase1_preparation.map(item => `• ${item}<br>`).join('')}
            </div>
          </div>
          
          <div class="phase-card">
            <div class="phase-number">2</div>
            <div class="phase-title">Optimización</div>
            <div class="phase-items">
              <strong>Durante protocolo</strong><br><br>
              ${data.epigenetic_program.phase2_optimization.map(item => `• ${item}<br>`).join('')}
            </div>
          </div>
          
          <div class="phase-card">
            <div class="phase-number">3</div>
            <div class="phase-title">Mantenimiento</div>
            <div class="phase-items">
              <strong>Post-protocolo</strong><br><br>
              ${data.epigenetic_program.phase3_maintenance.map(item => `• ${item}<br>`).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <!-- SECCIÓN 4: PROYECCIÓN FUTURA -->
      <div class="future-projection">
        <div class="projection-title">📈 Tu Futuro en 12 Meses</div>
        <p style="font-size: 16px; color: #2d3436; opacity: 0.8;">
          Siguiendo este protocolo, esperamos estos resultados:
        </p>
        
        <div class="projection-values">
          <div class="projection-box">
            <div class="projection-label">Edad Biológica</div>
            <div class="projection-value">${data.future_projection.biological_age_target}</div>
            <div style="font-size: 14px; color: #00b894; font-weight: 700; margin-top: 10px;">
              ${data.patient.biological_age - data.future_projection.biological_age_target} años MENOS
            </div>
          </div>
          
          <div class="projection-box">
            <div class="projection-label">Calidad de Piel</div>
            <div class="projection-value">${data.future_projection.skin_quality_target}</div>
            <div style="font-size: 14px; color: #00b894; font-weight: 700; margin-top: 10px;">
              +${data.future_projection.skin_quality_target - data.current_state.skin_quality} puntos
            </div>
          </div>
          
          <div class="projection-box">
            <div class="projection-label">Masa Muscular</div>
            <div class="projection-value">${data.future_projection.muscle_mass_target.toFixed(1)}</div>
            <div style="font-size: 14px; color: #00b894; font-weight: 700; margin-top: 10px;">
              +${(data.future_projection.muscle_mass_target - data.current_state.muscle_mass).toFixed(1)} kg
            </div>
          </div>
        </div>
        
        <p style="font-size: 18px; font-weight: 700; color: #2d3436; margin-top: 30px;">
          ${data.future_projection.expected_improvement}
        </p>
      </div>
    </div>
    
    <!-- FOOTER -->
    <div class="passport-footer">
      <div class="footer-signature">Dr. Maya - Director de Bioingeniería Humana</div>
      <div class="footer-seal">Maya Harmony Station • Cali, Colombia</div>
      <div class="stamp">
        Sistema Certificado de Medicina Epigenética
      </div>
      <div style="margin-top: 30px; font-size: 12px; opacity: 0.6;">
        Generado: ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Exporta el pasaporte como PDF (en producción)
 */
export async function exportPassportToPDF(data: ImmortalityPassportData): Promise<Blob> {
  // En producción, usar jsPDF o similar
  console.log('📄 Generando PDF del Pasaporte de Inmortalidad...')
  
  const html = generateImmortalityPassportHTML(data)
  
  // Por ahora, retornar como Blob de HTML
  // En producción: convertir HTML a PDF
  const blob = new Blob([html], { type: 'text/html' })
  
  console.log('✅ Pasaporte generado')
  return blob
}

/**
 * Genera los datos completos del pasaporte
 */
export function preparePassportData(
  patientId: string,
  patientName: string,
  age: number,
  biologicalAge: number,
  currentMetrics: any,
  prescription: AutomaticPrescription,
  surgicalPrediction?: MechanobiologicalPrediction
): ImmortalityPassportData {
  
  // Proyección futura (optimista pero realista)
  const targetBioAge = Math.max(age - 10, biologicalAge - 5)
  const targetSkinQuality = Math.min(100, currentMetrics.skin_quality + 20)
  const targetMuscleMass = currentMetrics.muscle_mass + 3
  
  return {
    patient: {
      id: patientId,
      name: patientName,
      age: age,
      biological_age: biologicalAge,
      age_delta: age - biologicalAge
    },
    current_state: currentMetrics,
    surgical_prediction: surgicalPrediction,
    prescription: prescription,
    epigenetic_program: {
      phase1_preparation: [
        'Protocolo nutracéutico completo',
        'Optimización de biomarcadores',
        'Síntesis de colágeno',
        'Reducción de inflamación'
      ],
      phase2_optimization: [
        'Monitoreo continuo InBody',
        'Ajuste de suplementación',
        'Seguimiento Quantum semanal'
      ],
      phase3_maintenance: [
        'Protocolo de mantenimiento',
        'Evaluación trimestral',
        'Ajustes según evolución'
      ],
      expected_outcomes: [
        'Edad biológica reducida',
        'Piel rejuvenecida',
        'Masa muscular optimizada',
        'Inflamación controlada'
      ]
    },
    future_projection: {
      biological_age_target: targetBioAge,
      skin_quality_target: targetSkinQuality,
      muscle_mass_target: targetMuscleMass,
      expected_improvement: `Reducción de ${biologicalAge - targetBioAge} años biológicos con mejora significativa en todos los biomarcadores`
    }
  }
}
