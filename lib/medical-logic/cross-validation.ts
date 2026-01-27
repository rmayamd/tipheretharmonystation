/**
 * Lógica Médica Cruzada
 * Bloquea fechas quirúrgicas basado en análisis cruzado de:
 * - Analizador Cuántico (colágeno, inflamación NFkB)
 * - InBody (composición física)
 * - Maya-Vision (mecánica de tejido)
 */

export interface MedicalValidation {
  canProceed: boolean;
  blockReason?: string;
  requiredProtocol?: string;
  estimatedDays?: number;
}

export interface QuantumData {
  collagenSynthesis: number; // 0-100
  nfkbInflammation: number; // 0-100 (mayor = más inflamación)
}

export interface InBodyData {
  extracellularWater: number; // Para seguridad ERAS
  bodyFatPercentage: number;
  phaseAngle: number;
}

export interface AestheticData {
  skinQuality: number;
  tissueMechanics: {
    expectedYield: number;
  };
}

/**
 * Valida si un paciente puede proceder con cirugía
 * basado en análisis cruzado de todos los sistemas
 */
export function validateSurgeryEligibility(
  quantum: QuantumData,
  inBody: InBodyData,
  aesthetic: AestheticData
): MedicalValidation {
  const issues: string[] = [];
  let requiredProtocol: string | undefined;
  let estimatedDays = 0;

  // Validación 1: Síntesis de Colágeno
  if (quantum.collagenSynthesis < 50) {
    issues.push('Síntesis de colágeno baja');
    requiredProtocol = 'collagen_boost';
    estimatedDays = Math.max(estimatedDays, 30);
  }

  // Validación 2: Inflamación Molecular (NFkB)
  if (quantum.nfkbInflammation > 60) {
    issues.push('Inflamación molecular elevada (NFkB)');
    requiredProtocol = 'inflammation_reduction';
    estimatedDays = Math.max(estimatedDays, 45);
  }

  // Validación 3: Agua Extracelular (Seguridad ERAS)
  if (inBody.extracellularWater > 0.4) {
    issues.push('Agua extracelular elevada - riesgo ERAS');
    requiredProtocol = 'eras_optimization';
    estimatedDays = Math.max(estimatedDays, 21);
  }

  // Validación 4: Mecánica de Tejido
  if (aesthetic.tissueMechanics.expectedYield < 15) {
    issues.push('Baja elasticidad de tejido');
    requiredProtocol = 'tissue_preparation';
    estimatedDays = Math.max(estimatedDays, 28);
  }

  // Validación 5: Calidad de Piel
  if (aesthetic.skinQuality < 40) {
    issues.push('Calidad de piel insuficiente');
    if (!requiredProtocol) {
      requiredProtocol = 'skin_preparation';
      estimatedDays = Math.max(estimatedDays, 30);
    }
  }

  if (issues.length > 0) {
    return {
      canProceed: false,
      blockReason: issues.join('; '),
      requiredProtocol: requiredProtocol || 'general_optimization',
      estimatedDays: estimatedDays || 30,
    };
  }

  return {
    canProceed: true,
  };
}

/**
 * Genera protocolo de pre-habilitación epigenética
 */
export interface EpigeneticProtocol {
  type: string;
  duration: number; // días
  nutritionPlan: {
    foods: string[];
    avoid: string[];
    supplements: string[];
  };
  description: string;
}

export function generateEpigeneticProtocol(
  validation: MedicalValidation
): EpigeneticProtocol | null {
  if (validation.canProceed) return null;

  const protocols: Record<string, EpigeneticProtocol> = {
    collagen_boost: {
      type: 'collagen_boost',
      duration: 30,
      nutritionPlan: {
        foods: [
          'Caldo de huesos',
          'Pescado rico en omega-3',
          'Vegetales de hoja verde',
          'Frutas ricas en vitamina C',
        ],
        avoid: [
          'Azúcares refinados',
          'Alimentos procesados',
          'Alcohol',
        ],
        supplements: [
          'Colágeno hidrolizado',
          'Vitamina C',
          'Ácido hialurónico',
        ],
      },
      description: 'Protocolo para aumentar síntesis de colágeno endógeno',
    },
    inflammation_reduction: {
      type: 'inflammation_reduction',
      duration: 45,
      nutritionPlan: {
        foods: [
          'Cúrcuma',
          'Jengibre',
          'Aceite de oliva extra virgen',
          'Pescado azul',
          'Vegetales crucíferos',
        ],
        avoid: [
          'Alimentos inflamatorios',
          'Grasas trans',
          'Azúcares',
        ],
        supplements: [
          'Omega-3 de alta calidad',
          'Curcumina',
          'Resveratrol',
        ],
      },
      description: 'Protocolo para reducir inflamación molecular (NFkB)',
    },
    eras_optimization: {
      type: 'eras_optimization',
      duration: 21,
      nutritionPlan: {
        foods: [
          'Proteínas de alta calidad',
          'Carbohidratos complejos',
          'Hidratación adecuada',
        ],
        avoid: [
          'Sodio excesivo',
          'Alcohol',
        ],
        supplements: [
          'Electrolitos balanceados',
          'Proteína en polvo',
        ],
      },
      description: 'Optimización para seguridad ERAS',
    },
    tissue_preparation: {
      type: 'tissue_preparation',
      duration: 28,
      nutritionPlan: {
        foods: [
          'Alimentos ricos en elastina',
          'Antioxidantes',
          'Proteínas completas',
        ],
        avoid: [
          'Fumar',
          'Exposición solar excesiva',
        ],
        supplements: [
          'Colágeno tipo I y III',
          'Elastina',
          'Antioxidantes',
        ],
      },
      description: 'Preparación de tejido para mejor elasticidad',
    },
    skin_preparation: {
      type: 'skin_preparation',
      duration: 30,
      nutritionPlan: {
        foods: [
          'Alimentos ricos en vitamina A',
          'Beta-carotenos',
          'Antioxidantes',
        ],
        avoid: [
          'Exposición solar',
          'Productos irritantes',
        ],
        supplements: [
          'Retinol tópico',
          'Ácido hialurónico',
          'Vitamina E',
        ],
      },
      description: 'Preparación de piel según estándares Obagi',
    },
  };

  return protocols[validation.requiredProtocol || 'general_optimization'] || protocols.collagen_boost;
}
