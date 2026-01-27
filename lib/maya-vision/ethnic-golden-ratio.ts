/**
 * GOLDEN RATIO FACIAL - ESTÁNDARES INTERNACIONALES
 * Incluye ajustes por etnia según Dr. Suh-Goo Park (Korea) y estándares occidentales
 */

export const GOLDEN_RATIO_PHI = 1.618;

/**
 * Estándares de Golden Ratio ajustados por etnia
 * Basado en:
 * - Dr. Suh-Goo Park: "Facial Bone Contouring Surgery" (Korean standards)
 * - Dr. Bruce Connell: "Aesthetic Rejuvenation" (Western standards)
 * - Farkas et al.: "Anthropometric facial norms" (Multi-ethnic)
 */
export const ETHNIC_GOLDEN_RATIOS = {
  caucasian: {
    bigonialToBizygomatic: 0.73, // Ancho mandibular / Ancho cigomático
    facialHeightToWidth: 1.618, // Altura / Ancho (phi)
    gonialAngle: { min: 115, max: 125 }, // Ángulo gonial ideal
    nasolabialAngle: { min: 90, max: 105 }, // Ángulo nasolabial
    cervicoMentalAngle: { min: 105, max: 120 }, // Ángulo cérvico-mental
    facialThirds: {
      male: { upper: 0.31, middle: 0.34, lower: 0.35 },
      female: { upper: 0.32, middle: 0.35, lower: 0.33 }
    }
  },
  asian: {
    bigonialToBizygomatic: 0.70, // Mandíbula más angosta = V-Line ideal (Park)
    facialHeightToWidth: 1.618,
    gonialAngle: { min: 120, max: 130 }, // Ángulo más obtuso para V-Line
    nasolabialAngle: { min: 85, max: 95 }, // Menos proyección nasal
    cervicoMentalAngle: { min: 110, max: 125 },
    facialThirds: {
      male: { upper: 0.30, middle: 0.35, lower: 0.35 },
      female: { upper: 0.31, middle: 0.36, lower: 0.33 }
    },
    // 🔥 ESPECÍFICO PARK: V-Line Assessment
    vLineIdeal: {
      chinProjection: { min: -3, max: 2 }, // mm desde línea vertical
      mandibularTaper: 0.75 // Ratio temporal/mandibular width
    }
  },
  latino: {
    bigonialToBizygomatic: 0.72, // Intermedio
    facialHeightToWidth: 1.618,
    gonialAngle: { min: 117, max: 127 },
    nasolabialAngle: { min: 88, max: 100 },
    cervicoMentalAngle: { min: 108, max: 122 },
    facialThirds: {
      male: { upper: 0.31, middle: 0.34, lower: 0.35 },
      female: { upper: 0.32, middle: 0.35, lower: 0.33 }
    }
  },
  african: {
    bigonialToBizygomatic: 0.78, // Mandíbula más ancha
    facialHeightToWidth: 1.618,
    gonialAngle: { min: 110, max: 120 },
    nasolabialAngle: { min: 80, max: 95 },
    cervicoMentalAngle: { min: 100, max: 115 },
    facialThirds: {
      male: { upper: 0.30, middle: 0.34, lower: 0.36 },
      female: { upper: 0.31, middle: 0.35, lower: 0.34 }
    }
  },
  middle_eastern: {
    bigonialToBizygomatic: 0.74,
    facialHeightToWidth: 1.618,
    gonialAngle: { min: 115, max: 125 },
    nasolabialAngle: { min: 85, max: 100 },
    cervicoMentalAngle: { min: 105, max: 120 },
    facialThirds: {
      male: { upper: 0.31, middle: 0.34, lower: 0.35 },
      female: { upper: 0.32, middle: 0.35, lower: 0.33 }
    }
  }
};

export type Ethnicity = keyof typeof ETHNIC_GOLDEN_RATIOS;

/**
 * Calcula el Golden Ratio Score con PRECISIÓN ÉTNICA (Park + Connell)
 */
export function calculateEthnicGoldenRatio(
  bigonialWidth: number,
  bizygomaticWidth: number,
  facialHeight: number,
  nasolabialAngle: number,
  cervicoMentalAngle: number,
  gonialAngle: number | null,
  ethnicity: Ethnicity,
  gender: 'M' | 'F'
): {
  totalScore: number;
  breakdown: {
    widthRatio: { value: number; score: number; ideal: number };
    heightRatio: { value: number; score: number; ideal: number };
    nasolabialScore: { value: number; score: number; ideal: { min: number; max: number } };
    cervicoMentalScore: { value: number; score: number; ideal: { min: number; max: number } };
    gonialScore: { value: number | null; score: number; ideal: { min: number; max: number } };
    facialThirdsScore: number;
  };
  recommendations: string[];
  surgeryNeeded: boolean;
} {
  const standards = ETHNIC_GOLDEN_RATIOS[ethnicity];
  
  // 1. Ratio ancho mandibular/cigomático (Park's V-Line principle)
  const widthRatio = bigonialWidth / bizygomaticWidth;
  const widthDeviation = Math.abs(widthRatio - standards.bigonialToBizygomatic);
  const widthScore = Math.max(0, 100 - (widthDeviation * 200));
  
  // 2. Ratio altura/ancho (Golden Phi)
  const heightRatio = facialHeight / bizygomaticWidth;
  const heightDeviation = Math.abs(heightRatio - standards.facialHeightToWidth);
  const heightScore = Math.max(0, 100 - (heightDeviation * 50));
  
  // 3. Ángulo nasolabial
  const nasolabialInRange = nasolabialAngle >= standards.nasolabialAngle.min && nasolabialAngle <= standards.nasolabialAngle.max;
  const nasolabialDeviation = nasolabialInRange ? 0 : Math.min(
    Math.abs(nasolabialAngle - standards.nasolabialAngle.min),
    Math.abs(nasolabialAngle - standards.nasolabialAngle.max)
  );
  const nasolabialScore = Math.max(0, 100 - (nasolabialDeviation * 2));
  
  // 4. Ángulo cérvico-mental (Connell's laxity marker)
  const cervicoMentalInRange = cervicoMentalAngle >= standards.cervicoMentalAngle.min && cervicoMentalAngle <= standards.cervicoMentalAngle.max;
  const cervicoMentalDeviation = cervicoMentalInRange ? 0 : Math.min(
    Math.abs(cervicoMentalAngle - standards.cervicoMentalAngle.min),
    Math.abs(cervicoMentalAngle - standards.cervicoMentalAngle.max)
  );
  const cervicoMentalScore = Math.max(0, 100 - (cervicoMentalDeviation * 1.5));
  
  // 5. Ángulo gonial (Park's mandibular angle - CRÍTICO para asiáticos)
  let gonialScore = 100; // Default si no se tiene medición
  if (gonialAngle !== null) {
    const gonialInRange = gonialAngle >= standards.gonialAngle.min && gonialAngle <= standards.gonialAngle.max;
    const gonialDeviation = gonialInRange ? 0 : Math.min(
      Math.abs(gonialAngle - standards.gonialAngle.min),
      Math.abs(gonialAngle - standards.gonialAngle.max)
    );
    gonialScore = Math.max(0, 100 - (gonialDeviation * 2));
  }
  
  // 6. Thirds faciales (simplificado - en producción usar landmarks reales)
  const facialThirdsScore = 90; // Placeholder
  
  // SCORE TOTAL PONDERADO (Park emphasizes bone structure = higher weight)
  const totalScore = (
    widthScore * 0.30 +        // V-Line (mandibular width) - MÁS IMPORTANTE en Park
    heightScore * 0.20 +       // Proporción vertical
    nasolabialScore * 0.15 +   // Proyección nasal
    cervicoMentalScore * 0.15 + // Contorno cuello
    gonialScore * 0.15 +       // Ángulo mandibular (Park)
    facialThirdsScore * 0.05   // Balance vertical
  );
  
  // RECOMENDACIONES BASADAS EN DESVIACIONES
  const recommendations: string[] = [];
  let surgeryNeeded = false;
  
  if (widthScore < 70) {
    surgeryNeeded = true;
    if (widthRatio > standards.bigonialToBizygomatic + 0.05) {
      recommendations.push(
        ethnicity === 'asian' || ethnicity === 'latino'
          ? `📐 Park V-Line Surgery: Mandíbula ancha (${(widthRatio * 100).toFixed(1)}% vs ideal ${(standards.bigonialToBizygomatic * 100).toFixed(1)}%). Reducción mandibular + mentoplastia.`
          : `📐 Mandibular Reduction: Ratio ${(widthRatio * 100).toFixed(1)}% (ideal: ${(standards.bigonialToBizygomatic * 100).toFixed(1)}%). Considerar osteotomía.`
      );
    } else {
      recommendations.push(`📐 Malar Augmentation: Pómulos sub-proyectados. Implantes cigomáticos para balance.`);
    }
  }
  
  if (gonialScore < 70 && gonialAngle !== null) {
    surgeryNeeded = true;
    if (gonialAngle < standards.gonialAngle.min) {
      recommendations.push(`🔧 Ángulo gonial agudo (${gonialAngle.toFixed(0)}°). Park recomienda mandibular angle osteotomy para suavizar.`);
    } else {
      recommendations.push(`🔧 Ángulo gonial obtuso (${gonialAngle.toFixed(0)}°). Evaluar hipertrofia maseterina vs estructura ósea.`);
    }
  }
  
  if (nasolabialScore < 70) {
    if (nasolabialAngle < standards.nasolabialAngle.min) {
      recommendations.push(`👃 Ángulo nasolabial bajo (${nasolabialAngle.toFixed(0)}°). Rinoplastia de rotación o injerto columelar.`);
    } else {
      recommendations.push(`👃 Ángulo nasolabial elevado (${nasolabialAngle.toFixed(0)}°). Reducción de dorso o aumento de punta.`);
    }
  }
  
  if (cervicoMentalScore < 70) {
    if (cervicoMentalAngle < standards.cervicoMentalAngle.min) {
      recommendations.push(`🦢 Ángulo cérvico-mental pobre (${cervicoMentalAngle.toFixed(0)}°). Connell recomienda Deep Plane Lift + liposucción submentoniana.`);
    }
  }
  
  return {
    totalScore: Math.round(totalScore),
    breakdown: {
      widthRatio: {
        value: widthRatio,
        score: Math.round(widthScore),
        ideal: standards.bigonialToBizygomatic
      },
      heightRatio: {
        value: heightRatio,
        score: Math.round(heightScore),
        ideal: standards.facialHeightToWidth
      },
      nasolabialScore: {
        value: nasolabialAngle,
        score: Math.round(nasolabialScore),
        ideal: standards.nasolabialAngle
      },
      cervicoMentalScore: {
        value: cervicoMentalAngle,
        score: Math.round(cervicoMentalScore),
        ideal: standards.cervicoMentalAngle
      },
      gonialScore: {
        value: gonialAngle,
        score: Math.round(gonialScore),
        ideal: standards.gonialAngle
      },
      facialThirdsScore: facialThirdsScore
    },
    recommendations,
    surgeryNeeded
  };
}

/**
 * Wrapper para mantener compatibilidad con código existente
 */
export function calculateGoldenRatio3D_Legacy(
  bigonialWidth: number,
  bizygomaticWidth: number,
  facialHeight: number,
  nasolabialAngle: number,
  cervicoMentalAngle: number
): number {
  // Usa estándar caucásico por defecto
  const result = calculateEthnicGoldenRatio(
    bigonialWidth,
    bizygomaticWidth,
    facialHeight,
    nasolabialAngle,
    cervicoMentalAngle,
    null, // sin ángulo gonial
    'caucasian',
    'F'
  );
  return result.totalScore;
}
