/**
 * Síntesis Avanzada del Cerebro Maya
 * Casos específicos y combinaciones complejas de múltiples tratados
 */

export interface AdvancedSynthesis {
  caseName: string
  conditions: string[]
  combinedProtocol: {
    phase1: ProtocolPhase
    phase2?: ProtocolPhase
    phase3?: ProtocolPhase
  }
  sources: string[]
  expectedOutcome: string
  timeline: number // días
}

export interface ProtocolPhase {
  duration: number // días
  interventions: Array<{
    name: string
    dosage: string
    timing: string
    source: string
  }>
  nutrition: string[]
  exercise?: string
}

/**
 * Síntesis avanzadas para casos complejos
 */
export const ADVANCED_SYNTHESES: AdvancedSynthesis[] = [
  {
    caseName: 'Paciente Pre-Quirúrgico Completo',
    conditions: ['baja_masa_muscular', 'piel_preparacion_prequirurgica', 'inflamacion_molecular_elevada'],
    combinedProtocol: {
      phase1: {
        duration: 30,
        interventions: [
          {
            name: 'BCAA + Leucina',
            dosage: '15g BCAA + 5g Leucina',
            timing: 'Pre-entrenamiento',
            source: 'Byung Pal Yu + Manual de Nutrigenómica',
          },
          {
            name: 'Kit Obagi Preparación',
            dosage: 'Retinol 0.5% + Vit C 20% + HA',
            timing: 'Retinol nocturno, Vit C matutino, HA 2x/día',
            source: 'Zein Obagi',
          },
          {
            name: 'Protocolo Anti-Inflamatorio',
            dosage: 'Omega-3 2g + Curcumina 1g + Resveratrol 500mg',
            timing: 'Omega-3 y Curcumina con comida, Resveratrol nocturno',
            source: 'Byung Pal Yu + Oxidative Stress and Mitochondrial Health',
          },
        ],
        nutrition: [
          'Proteínas completas 1.6g/kg (Byung Pal Yu)',
          'Vegetales crucíferos diarios (Epigenetic Modulation)',
          'Pescado azul 3x/semana (Longevity Interventions)',
          'Evitar azúcares refinados (The Metabolic Basis)',
        ],
        exercise: 'Resistencia 3x/semana + Cardio moderado 2x/semana',
      },
      phase2: {
        duration: 14,
        interventions: [
          {
            name: 'Optimización Pre-Quirúrgica',
            dosage: 'Continuar protocolo + Vitamina D3 5000 UI',
            timing: 'Vit D3 matutino con grasa',
            source: 'Bio-Identical Hormone Replacement',
          },
        ],
        nutrition: [
          'Mantener protocolo + Electrolitos balanceados',
        ],
      },
    },
    sources: [
      'Byung Pal Yu - Nutrition Exercise and Epigenetics',
      'Zein Obagi - The Art of Skin Health Restoration',
      'Manual de Nutrigenómica y Nutrigenética Clínica',
      'Oxidative Stress and Mitochondrial Health in Ageing',
      'Bio-Identical Hormone Replacement Therapy Manual',
    ],
    expectedOutcome: 'Paciente optimizado para cirugía: masa muscular mejorada, piel preparada, inflamación reducida',
    timeline: 44,
  },
  
  {
    caseName: 'Recuperación Post-Deep Plane Completa',
    conditions: ['riesgo_queloide_alto', 'tension_mecanica_elevada', 'piel_post_operatoria'],
    combinedProtocol: {
      phase1: {
        duration: 7,
        interventions: [
          {
            name: 'Protocolo Tensión Zero Inmediato',
            dosage: 'Silicona médica 2x/día + Masaje suave 3x/día',
            timing: 'Silicona mañana y noche, masaje cada 8 horas',
            source: 'Rei Ogawa - The Science of Scar Management',
          },
          {
            name: 'Aceite de Rosa Mosqueta',
            dosage: 'Aplicación tópica',
            timing: 'Después del masaje',
            source: 'Mecanobiología de los Tejidos Blandos',
          },
        ],
        nutrition: [
          'Proteínas completas 2g/kg (ERAS Complete Protocols)',
          'Vitamina C 1000mg diario (Handbook of Perioperative Care)',
          'Zinc 15mg diario (Scar Management)',
        ],
      },
      phase2: {
        duration: 30,
        interventions: [
          {
            name: 'Protocolo Tensión Zero Continuado',
            dosage: 'Silicona + Masaje + Presión',
            timing: 'Silicona 2x/día, masaje 2x/día, presión continua',
            source: 'Rei Ogawa',
          },
          {
            name: 'Vitamina E Tópica',
            dosage: 'Gel tópico',
            timing: 'Alternar con silicona',
            source: 'Scar Management Protocols',
          },
        ],
        nutrition: [
          'Continuar protocolo + Antioxidantes (Oxidative Stress and Mitochondrial Health)',
        ],
      },
      phase3: {
        duration: 60,
        interventions: [
          {
            name: 'Monitoreo y Mantenimiento',
            dosage: 'Protección solar estricta + Continuar silicona',
            timing: 'SPF 50+ cada 2 horas, silicona nocturna',
            source: 'Zein Obagi + Rei Ogawa',
          },
        ],
        nutrition: [
          'Mantener protocolo anti-inflamatorio',
        ],
      },
    },
    sources: [
      'Rei Ogawa - The Science of Scar Management',
      'ERAS Complete Protocols',
      'Handbook of Perioperative Care',
      'Mecanobiología de los Tejidos Blandos',
      'Zein Obagi - Skin Health Restoration',
    ],
    expectedOutcome: 'Cicatrización óptima sin queloides, tensión reducida, resultado estético superior',
    timeline: 97,
  },
  
  {
    caseName: 'Optimización Epigenética para Longevidad',
    conditions: ['envejecimiento_celular', 'mitocondrial_health_low', 'hormonal_optimization'],
    combinedProtocol: {
      phase1: {
        duration: 90,
        interventions: [
          {
            name: 'Protocolo Longevidad Completo',
            dosage: 'NMN 500mg + Resveratrol 500mg + Metformina 500mg (supervisión médica)',
            timing: 'NMN matutino, Resveratrol nocturno, Metformina con comida',
            source: 'Byung Pal Yu + The Biology of Senescence',
          },
          {
            name: 'Optimización Hormonal',
            dosage: 'Hormonas bioidénticas según perfil (supervisión médica)',
            timing: 'Según protocolo de Bio-Identical Hormone Replacement',
            source: 'Bio-Identical Hormone Replacement Therapy Manual',
          },
          {
            name: 'Suplementación Mitocondrial',
            dosage: 'CoQ10 200mg + PQQ 20mg + Ácido Alfa Lipoico 600mg',
            timing: 'Con comida, 2x/día',
            source: 'Oxidative Stress and Mitochondrial Health',
          },
        ],
        nutrition: [
          'Restricción calórica intermitente 16:8 (Byung Pal Yu)',
          'Alimentos ricos en polifenoles diarios',
          'Vegetales crucíferos para activación Nrf2',
          'Pescado azul 3x/semana para omega-3',
          'Evitar completamente: azúcares, procesados, grasas trans',
        ],
        exercise: 'HIIT 2x/semana + Resistencia 2x/semana + Cardio moderado 3x/semana',
      },
    },
    sources: [
      'Byung Pal Yu - Nutrition Exercise and Epigenetics',
      'The Biology of Senescence and Longevity Interventions',
      'Oxidative Stress and Mitochondrial Health in Ageing',
      'Bio-Identical Hormone Replacement Therapy Manual',
      'Epigenetic Modulation in Clinical Practice',
    ],
    expectedOutcome: 'Mejora en marcadores de longevidad, salud mitocondrial optimizada, función hormonal restaurada',
    timeline: 90,
  },
]

/**
 * Genera síntesis avanzada para casos complejos
 */
export function generateAdvancedSynthesis(conditions: string[]): AdvancedSynthesis | null {
  // Buscar síntesis que coincida con las condiciones
  const matching = ADVANCED_SYNTHESES.find(synthesis => {
    const matches = synthesis.conditions.filter(cond =>
      conditions.some(c => c.includes(cond) || cond.includes(c))
    )
    return matches.length >= 2 // Al menos 2 condiciones deben coincidir
  })
  
  return matching || null
}
