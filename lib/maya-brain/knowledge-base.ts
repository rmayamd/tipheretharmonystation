/**
 * CEREBRO MAYA - Sistema de Síntesis Cruzada de Conocimiento
 * V5.2 INTERNATIONAL EDITION (Sin dependencias de terceros)
 */

export interface MedicalKnowledge {
  source: string
  category: KnowledgeCategory
  concepts: string[]
  recommendations: Recommendation[]
}

export type KnowledgeCategory =
  | 'longevity'
  | 'nutrigenomics'
  | 'epigenetics'
  | 'surgery'
  | 'aesthetics'
  | 'recovery'
  | 'hormones'
  | 'nutrition'
  | 'supplements'
  | 'complications'
  | 'anatomy'

export interface Recommendation {
  condition: string
  intervention: string
  dosage?: string
  protocol?: string
  sources: string[]
  evidenceLevel: 'high' | 'medium' | 'low'
}

export const MAYA_BRAIN_KNOWLEDGE: MedicalKnowledge[] = [
  {
    source: 'Byung Pal Yu - Nutrition Exercise and Epigenetics',
    category: 'epigenetics',
    concepts: ['Silenciamiento de genes', 'Activación mTOR', 'Restricción calórica'],
    recommendations: [
      {
        condition: 'baja_masa_muscular',
        intervention: 'Aminoácidos de cadena ramificada (BCAA) + Leucina',
        dosage: '10-15g BCAA + 5g Leucina pre-entrenamiento',
        protocol: 'Activar vía mTOR mediante ejercicio de resistencia',
        sources: ['Byung Pal Yu - Nutrition Exercise and Epigenetics'],
        evidenceLevel: 'high',
      },
    ],
  },
  {
    source: 'Zein Obagi - The Art of Skin Health Restoration',
    category: 'aesthetics',
    concepts: ['Preparación pre-quirúrgica', 'Manejo de pigmentación'],
    recommendations: [
      {
        condition: 'piel_preparacion_prequirurgica',
        intervention: 'Kit Tipheret Skin: Retinol 0.5% + Vit C + HA',
        dosage: 'Protocolo de 30 días pre-op',
        sources: ['Zein Obagi - The Art of Skin Health Restoration'],
        evidenceLevel: 'high',
      },
    ],
  },
  {
    source: 'Bruce Connell - Aesthetic Facial Surgery',
    category: 'surgery',
    concepts: ['Deep Plane Facelift', 'Vectores de Connell'],
    recommendations: [
      {
        condition: 'laxitud_grado_III_IV',
        intervention: 'Deep Plane Facelift según Connell',
        protocol: 'Disección en plano profundo con preservación de SMAS',
        sources: ['Bruce Connell - Aesthetic Facial Surgery'],
        evidenceLevel: 'high',
      },
    ],
  }
];

/**
 * Busca recomendaciones basadas en datos de hardware (InBody/Quantum)
 */
export function searchCrossReferencedRecommendations(
  conditions: string[],
  inBodyData?: {
    muscleMass?: number
    extracellularWater?: number
  }
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Síntesis: baja masa muscular
  if (inBodyData?.muscleMass && inBodyData.muscleMass < 30) {
    recommendations.push({
      condition: 'baja_masa_muscular',
      intervention: 'Protocolo de Reconstrucción Proteica Tipheret',
      dosage: 'BCAA 15g + Leucina 5g + Creatina 5g',
      sources: ['Byung Pal Yu', 'Manual de Nutrigenómica'],
      evidenceLevel: 'high',
    });
  }

  // Síntesis: inflamación (CORREGIDO EL ERROR DE SINTAXIS AQUÍ)
  if (inBodyData?.extracellularWater && inBodyData.extracellularWater > 0.4) {
    recommendations.push({
      condition: 'inflamacion_molecular_elevada',
      intervention: 'Protocolo Anti-Inflamatorio Epigenético Tipheret',
      dosage: 'Omega-3 2g, Curcumina 1g, Resveratrol 500mg',
      sources: ['Byung Pal Yu - Epigenetics', 'Oxidative Stress in Ageing'],
      evidenceLevel: 'high',
    });
  }

  return recommendations;
}

/**
 * Genera orden para E-commerce Tipheret
 */
export function generateTipheretOrder(
  patientName: string,
  recommendations: Recommendation[]
) {
  const items = recommendations.map(rec => ({
    condition: rec.condition,
    intervention: rec.intervention,
    dosage: rec.dosage
  }));

  return {
    patientName,
    items,
    timestamp: new Date().toISOString(),
    status: 'ready_for_checkout'
  };
}