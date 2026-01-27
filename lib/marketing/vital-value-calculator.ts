/**
 * Calculadora de Valor Vital
 * No muestra "precio", muestra "Retorno de Inversión en Longevidad"
 * Basado en principios de longevidad y calidad de vida
 */

export interface VitalValueCalculation {
  procedureType: string;
  baseInvestment: number;
  yearsAdded: number;
  qualityLifeMultiplier: number;
  roiPercentage: number;
  monthlyValue: number;
  dailyValue: number;
  hourlyValue: number;
  comparison: {
    vsLuxuryCar: string;
    vsLuxuryWatch: string;
    vsVacation: string;
  };
  message: string;
}

export interface ProcedureData {
  type: string;
  baseCost: number;
  expectedYearsAdded: number;
  qualityImprovement: number; // 0-100
}

/**
 * Calcula el Valor Vital de un procedimiento
 */
export function calculateVitalValue(
  procedure: ProcedureData,
  patientAge: number
): VitalValueCalculation {
  const yearsAdded = procedure.expectedYearsAdded;
  const qualityMultiplier = 1 + procedure.qualityImprovement / 100;
  
  // Cálculo de ROI: Años añadidos * Calidad de vida * Valor de año de vida
  // Valor de un año de vida saludable: $50,000 USD (estándar internacional)
  const yearValueUSD = 50000;
  const yearValueCOP = yearValueUSD * 4000; // Aproximado
  
  const totalValue = yearsAdded * qualityMultiplier * yearValueCOP;
  const roiPercentage = ((totalValue - procedure.baseCost) / procedure.baseCost) * 100;
  
  const monthlyValue = totalValue / (yearsAdded * 12);
  const dailyValue = totalValue / (yearsAdded * 365);
  const hourlyValue = dailyValue / 24;

  // Comparaciones
  const luxuryCarCost = 300000000; // $300M COP
  const luxuryWatchCost = 50000000; // $50M COP
  const luxuryVacationCost = 15000000; // $15M COP

  const vsCar = procedure.baseCost < luxuryCarCost 
    ? `Menos que un auto de lujo, pero con retorno de inversión en longevidad`
    : `Inversión comparable a un auto de lujo, con valor añadido de ${yearsAdded} años de vida`;

  const vsWatch = procedure.baseCost < luxuryWatchCost
    ? `Similar a un reloj de lujo, pero con impacto en longevidad`
    : `Más que un reloj, pero con retorno medible en años de vida`;

  const vsVacation = procedure.baseCost > luxuryVacationCost
    ? `Más que unas vacaciones, pero con beneficios permanentes`
    : `Similar a unas vacaciones, pero con impacto duradero`;

  const message = generateROIMessage(roiPercentage, yearsAdded, patientAge);

  return {
    procedureType: procedure.type,
    baseInvestment: procedure.baseCost,
    yearsAdded,
    qualityLifeMultiplier: qualityMultiplier,
    roiPercentage,
    monthlyValue,
    dailyValue,
    hourlyValue,
    comparison: {
      vsLuxuryCar: vsCar,
      vsLuxuryWatch: vsWatch,
      vsVacation: vsVacation,
    },
    message,
  };
}

function generateROIMessage(
  roi: number,
  yearsAdded: number,
  age: number
): string {
  if (roi > 500) {
    return `Inversión excepcional: Retorno del ${roi.toFixed(0)}% en longevidad. A los ${age} años, añadir ${yearsAdded} años de vida saludable es invaluable.`;
  } else if (roi > 200) {
    return `Excelente inversión: Retorno del ${roi.toFixed(0)}% en calidad y años de vida. Una decisión inteligente para tu futuro.`;
  } else if (roi > 100) {
    return `Buena inversión: Retorno del ${roi.toFixed(0)}% mientras añades ${yearsAdded} años de vida con mayor calidad.`;
  } else if (roi > 0) {
    return `Inversión positiva: Retorno del ${roi.toFixed(0)}% con beneficios medibles en longevidad.`;
  } else {
    return `Inversión en longevidad: Aunque el retorno financiero es del ${roi.toFixed(0)}%, el valor de ${yearsAdded} años adicionales de vida saludable es incalculable.`;
  }
}

/**
 * Genera mensaje de neuroventas basado en perfil
 */
export function generateNeuroSalesMessage(
  patientAge: number,
  segment: 'joven' | 'maduro' | 'longevidad',
  procedureType: string
): string {
  if (segment === 'joven' || patientAge < 35) {
    return `Dr. Maya ha analizado tu perfil biológico y califica para una optimización preventiva. ${procedureType} no es solo estética, es inversión en tu futuro biológico. Actúa ahora mientras tu cuerpo tiene máxima capacidad de regeneración.`;
  } else if (segment === 'maduro' || (patientAge >= 35 && patientAge < 50)) {
    return `Dr. Maya ha identificado oportunidades de regeneración epigenética en tu perfil. ${procedureType} puede activar mecanismos de longevidad que tu cuerpo aún conserva. Este es el momento óptimo para la intervención.`;
  } else {
    return `Dr. Maya ha analizado tu historial y tu perfil biológico califica para una actualización epigenética. ${procedureType} puede revertir marcadores de envejecimiento y añadir años de vida saludable. La ciencia de la longevidad está de tu lado.`;
  }
}
