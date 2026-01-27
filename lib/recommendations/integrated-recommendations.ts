/**
 * INTEGRATED RECOMMENDATIONS ENGINE
 * Integra: Park (óseo) + Connell (tejidos) + Obagi (piel) + Yu (bio) + No Quirúrgico
 */

export interface PatientProfile {
  age: number
  gender: 'M' | 'F'
  ethnicity: 'caucasian' | 'asian' | 'latino' | 'african' | 'middle_eastern'
  analysisType: 'facial' | 'body_breast' | 'body_abdomen' | 'body_gluteal'
  view: 'frontal' | 'lateral' | 'cenital'
}

export interface Analysis3D {
  frontal: {
    bigonial_width: number  // mm
    bizygomatic_width: number  // mm
    symmetry: number  // 0-100
    laxity: number  // 0-100
    skin_quality: number  // 0-100
  }
  lateral?: {
    nasolabial_angle: number  // degrees
    chin_projection: number  // mm from vertical
    cervicomental_angle: number  // degrees
  }
  cenital?: {
    mandibular_contour: 'square' | 'v-line' | 'oval'
    malar_projection: number  // mm
  }
}

export interface Recommendation {
  id: string
  category: 'SURGICAL_BONY' | 'SURGICAL_SOFT' | 'VOLUMETRIC' | 'REDUCTIVE' | 'COSMETIC' | 'BIOLOGICAL' | 'DERMATOLOGICAL'
  subcategory: 'park' | 'connell' | 'obagi' | 'yu' | 'non_surgical'
  procedure: string
  description: string
  why: string
  technique?: string
  duration_months: number | 'permanent'
  recovery_weeks: number
  cost_cop: { min: number; max: number }
  priority: 1 | 2 | 3  // 1 = crítico, 2 = importante, 3 = complemento
  age_appropriate: boolean
  evidence_level: 'A' | 'B' | 'C'  // A = gold standard, B = strong, C = emerging
  references: string[]
}

export interface TreatmentPlan {
  surgical: Recommendation[]
  non_surgical: Recommendation[]
  biological_optimization: Recommendation[]
  dermatological: Recommendation[]
  timeline_months: number
  total_cost_cop: { min: number; max: number }
  expected_improvement: {
    golden_ratio_current: number
    golden_ratio_predicted: number
    improvement_percentage: number
  }
  comparison: {
    surgical_only: { cost: number; improvement: number; duration: 'permanent' }
    non_surgical_only: { cost_5years: number; improvement: number; duration: '12-18 months' }
    combined: { cost: number; improvement: number; duration: 'mixed' }
  }
}

/**
 * MOTOR PRINCIPAL DE RECOMENDACIONES
 */
export class IntegratedRecommendationsEngine {
  
  /**
   * Genera plan completo: quirúrgico + no quirúrgico + biológico
   */
  generateCompletePlan(
    profile: PatientProfile,
    analysis: Analysis3D
  ): TreatmentPlan {
    
    const surgical = this.generateSurgicalRecommendations(profile, analysis)
    const non_surgical = this.generateNonSurgicalRecommendations(profile, analysis)
    const biological = this.generateBiologicalOptimization(profile, analysis)
    const dermatological = this.generateDermatologicalProtocol(profile, analysis)
    const mesoestetic = this.generateMesoesteticProtocol(profile, analysis)
    
    return {
      surgical,
      non_surgical,
      biological_optimization: biological,
      dermatological: [...dermatological, ...mesoestetic],
      timeline_months: this.calculateTimeline(profile, analysis),
      total_cost_cop: this.calculateTotalCost(surgical, non_surgical, biological, [...dermatological, ...mesoestetic]),
      expected_improvement: this.predictImprovement(profile, analysis, surgical, non_surgical),
      comparison: this.compareOptions(profile, analysis)
    }
  }
  
  /**
   * MESOESTETIC: Protocolos especializados (Catálogo 2025)
   */
  private generateMesoesteticProtocol(
    profile: PatientProfile,
    analysis: Analysis3D
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    
    // Antienvejecimiento y Luminosidad
    if (analysis.frontal.skin_quality < 80) {
      recommendations.push({
        id: 'meso_aox_ferulic',
        category: 'DERMATOLOGICAL',
        subcategory: 'non_surgical',
        procedure: 'Mesoestetic AOX Ferulic',
        description: 'Sérum concentrado antioxidante de alta potencia. Protege contra la oxidación celular y el envejecimiento ambiental.',
        why: 'Protección avanzada contra el fotoenvejecimiento y mejora de la luminosidad.',
        duration_months: 'permanent',
        recovery_weeks: 0,
        cost_cop: { min: 350_000, max: 450_000 },
        priority: 2,
        age_appropriate: true,
        evidence_level: 'A',
        references: ['Mesoestetic Catalog 2025']
      })
    }

    // Despigmentación (Alternativa a Obagi sin hidroquinona)
    if (profile.ethnicity === 'latino' || profile.ethnicity === 'middle_eastern') {
      recommendations.push({
        id: 'meso_melan_tran3x',
        category: 'DERMATOLOGICAL',
        subcategory: 'non_surgical',
        procedure: 'Mesoestetic Melan Tran3x Protocol',
        description: 'Sérum + Gel-Crema con ácido tranexámico. Control de pigmentación sin efectos secundarios agresivos.',
        why: 'Regulación de la síntesis de melanina en fototipos altos.',
        duration_months: 6,
        recovery_weeks: 0,
        cost_cop: { min: 450_000, max: 600_000 },
        priority: 2,
        age_appropriate: true,
        evidence_level: 'A',
        references: ['Mesoestetic Pigmentation Studies 2025']
      })
    }

    return recommendations
  }
  
  /**
   * PARK: Procedimientos óseos (Gold Standard)
   */
  private generateSurgicalRecommendations(
    profile: PatientProfile,
    analysis: Analysis3D
  ): Recommendation[] {
    
    const recommendations: Recommendation[] = []
    const ideals = this.getIdealRatios(profile)
    
    // ========================================
    // PARK: MANDÍBULA (V-LINE)
    // ========================================
    if (analysis.frontal.bigonial_width > ideals.bigonial + 8) {
      const reduction_needed = analysis.frontal.bigonial_width - ideals.bigonial
      
      recommendations.push({
        id: 'park_vline',
        category: 'SURGICAL_BONY',
        subcategory: 'park',
        procedure: 'V-Line Osteotomy + Mandibular Angle Reduction',
        description: `Reducción bilateral de ángulo mandibular (${reduction_needed}mm) + osteotomía en V para crear contorno oval`,
        why: `Mandíbula actual ${analysis.frontal.bigonial_width}mm vs ideal ${ideals.bigonial}mm. Golden Ratio requiere corrección estructural.`,
        technique: 'Park T-Osteotomy (abordaje intraoral vestibular inferior)',
        duration_months: 'permanent',
        recovery_weeks: 6,
        cost_cop: { min: 18_000_000, max: 28_000_000 },
        priority: 1,
        age_appropriate: profile.age >= 22,  // Hueso completamente desarrollado
        evidence_level: 'A',
        references: ['Park Sang Hoon - Facial Bone Contouring Surgery', 'Standardization of Surgical Techniques']
      })
    }
    
    // ========================================
    // PARK: MENTÓN (GENIOPLASTIA)
    // ========================================
    if (analysis.lateral && analysis.lateral.chin_projection < -3) {
      const advancement = Math.abs(analysis.lateral.chin_projection) + 2
      
      recommendations.push({
        id: 'park_genioplasty',
        category: 'SURGICAL_BONY',
        subcategory: 'park',
        procedure: `Sliding Genioplasty (Avance ${advancement}mm)`,
        description: `Osteotomía horizontal con avance para corregir retrusión y lograr Golden Ratio lateral`,
        why: `Mentón retrusivo ${analysis.lateral.chin_projection}mm. Ideal: 0-2mm desde vertical subnasal.`,
        technique: 'Park Horizontal Osteotomy with Advancement (intraoral sublingual)',
        duration_months: 'permanent',
        recovery_weeks: 4,
        cost_cop: { min: 8_000_000, max: 12_000_000 },
        priority: 1,
        age_appropriate: profile.age >= 22,
        evidence_level: 'A',
        references: ['Park Sang Hoon - Genioplasty Techniques']
      })
    }
    
    // ========================================
    // PARK: PÓMULOS (MALAR)
    // ========================================
    if (analysis.frontal.bizygomatic_width > ideals.bizygomatic + 10) {
      recommendations.push({
        id: 'park_zygoma_reduction',
        category: 'SURGICAL_BONY',
        subcategory: 'park',
        procedure: 'Zygoma Reduction (Body + Arch)',
        description: `Reducción de cuerpo zigomático con reposición medial (6-8mm)`,
        why: `Pómulos prominentes ${analysis.frontal.bizygomatic_width}mm vs ideal ${ideals.bizygomatic}mm`,
        technique: 'Park L-Osteotomy with Infracture',
        duration_months: 'permanent',
        recovery_weeks: 6,
        cost_cop: { min: 12_000_000, max: 18_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 22,
        evidence_level: 'A',
        references: ['Park Sang Hoon - Zygoma Reduction']
      })
    } else if (analysis.cenital && analysis.cenital.malar_projection < 8) {
      recommendations.push({
        id: 'park_malar_implants',
        category: 'VOLUMETRIC',
        subcategory: 'park',
        procedure: 'Malar Implants (Medpor Anatómico)',
        description: `Implantes malares para aumentar proyección a 10-12mm (ideal Golden Ratio)`,
        why: `Pómulos planos ${analysis.cenital.malar_projection}mm vs ideal 10-12mm`,
        technique: 'Medpor Anatomic Implants (intraoral)',
        duration_months: 'permanent',
        recovery_weeks: 3,
        cost_cop: { min: 6_000_000, max: 10_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 22,
        evidence_level: 'A',
        references: ['Park Sang Hoon - Malar Augmentation']
      })
    }
    
    // ========================================
    // CONNELL: TEJIDOS BLANDOS
    // ========================================
    if (analysis.frontal.laxity > 40 && profile.age >= 40) {
      const technique = analysis.frontal.laxity > 60 ? 'Deep Plane Facelift' : 'SMAS Facelift'
      
      recommendations.push({
        id: 'connell_facelift',
        category: 'SURGICAL_SOFT',
        subcategory: 'connell',
        procedure: technique,
        description: `Lifting facial profundo para corrección de laxitud severa y restauración de proporciones juveniles`,
        why: `Laxitud ${analysis.frontal.laxity}/100. Golden Ratio requiere redraping de tejidos sobre estructura ósea optimizada.`,
        technique: analysis.frontal.laxity > 60 ? 'Connell Deep Plane (bilateral)' : 'Connell SMAS Plication',
        duration_months: 120,  // 10 años
        recovery_weeks: 6,
        cost_cop: { min: 15_000_000, max: 25_000_000 },
        priority: 1,
        age_appropriate: profile.age >= 40,
        evidence_level: 'A',
        references: ['Bruce Connell - Aesthetic Facial Surgery', 'SMAS Techniques']
      })
      
      // Si hay cirugía ósea + tejidos, recomendar staging
      if (recommendations.some(r => r.subcategory === 'park')) {
        recommendations.push({
          id: 'combined_staging',
          category: 'SURGICAL_SOFT',
          subcategory: 'park',
          procedure: 'Staged Surgery (Bone First, Facelift 6-12 months later)',
          description: `Cirugía por etapas: estructura ósea primero, luego redraping de tejidos`,
          why: `Optimizar estructura facial base, luego adaptar tejidos blandos al nuevo contorno.`,
          technique: 'Park + Connell Combined Protocol',
          duration_months: 'permanent',
          recovery_weeks: 12,  // Total ambas cirugías
          cost_cop: { min: 30_000_000, max: 50_000_000 },
          priority: 1,
          age_appropriate: profile.age >= 45,
          evidence_level: 'B',
          references: ['Park + Connell Combined Approach']
        })
      }
    } else if (analysis.frontal.laxity > 20 && analysis.frontal.laxity <= 40 && profile.age < 50) {
      recommendations.push({
        id: 'connell_mini_lift',
        category: 'SURGICAL_SOFT',
        subcategory: 'connell',
        procedure: 'Mini Facelift (MACS Lift)',
        description: `Lifting mínimamente invasivo para laxitud moderada en pacientes jóvenes`,
        why: `Laxitud moderada ${analysis.frontal.laxity}/100. Edad ${profile.age} años permite técnica conservadora.`,
        technique: 'MACS Lift (Minimal Access Cranial Suspension)',
        duration_months: 60,  // 5 años
        recovery_weeks: 2,
        cost_cop: { min: 8_000_000, max: 12_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 35 && profile.age < 55,
        evidence_level: 'A',
        references: ['MACS Lift Techniques']
      })
    }
    
    return recommendations.filter(r => r.age_appropriate)
  }
  
  /**
   * NO QUIRÚRGICO: Procedimientos cosméticos + volumétricos
   */
  private generateNonSurgicalRecommendations(
    profile: PatientProfile,
    analysis: Analysis3D
  ): Recommendation[] {
    
    const recommendations: Recommendation[] = []
    const ideals = this.getIdealRatios(profile)
    
    // ========================================
    // RELLENOS ESTRATÉGICOS
    // ========================================
    if (analysis.lateral && analysis.lateral.chin_projection < -2 && analysis.lateral.chin_projection > -6) {
      recommendations.push({
        id: 'filler_chin',
        category: 'VOLUMETRIC',
        subcategory: 'non_surgical',
        procedure: 'Ácido Hialurónico - Proyección Mentón',
        description: `Relleno 2-4ml para mejorar proyección lateral ${Math.abs(analysis.lateral.chin_projection)}mm`,
        why: `Alternativa no quirúrgica a genioplastia para retrusión leve-moderada`,
        duration_months: 14,
        recovery_weeks: 0.1,  // 3-5 días
        cost_cop: { min: 2_000_000, max: 4_000_000 },
        priority: profile.age < 35 ? 1 : 2,
        age_appropriate: true,
        evidence_level: 'A',
        references: ['Chin Augmentation with HA Fillers']
      })
    }
    
    if (analysis.cenital && analysis.cenital.malar_projection < 10) {
      recommendations.push({
        id: 'filler_malar',
        category: 'VOLUMETRIC',
        subcategory: 'non_surgical',
        procedure: 'Radiesse/HA - Proyección Malar',
        description: `Hidroxiapatita cálcica 4-6ml bilateral para volumen de pómulos`,
        why: `Golden Ratio requiere pómulos proyectados (ideal 10-12mm). Alternativa a implantes.`,
        duration_months: 18,
        recovery_weeks: 0.1,
        cost_cop: { min: 4_000_000, max: 6_000_000 },
        priority: profile.age < 40 ? 1 : 2,
        age_appropriate: true,
        evidence_level: 'A',
        references: ['Malar Augmentation Non-Surgical']
      })
    }
    
    // ========================================
    // REDUCCIÓN NO INVASIVA
    // ========================================
    if (analysis.frontal.bigonial_width > ideals.bigonial + 4 && analysis.frontal.bigonial_width < ideals.bigonial + 10) {
      // Solo si es músculo, no hueso (necesita evaluación clínica)
      recommendations.push({
        id: 'botox_masseter',
        category: 'REDUCTIVE',
        subcategory: 'non_surgical',
        procedure: 'Toxina Botulínica - Maséteros',
        description: `40-50U bilateral para reducción muscular y adelgazamiento facial`,
        why: `Cara cuadrada por hipertrofia de maséteros. Reduce 20-30% grosor muscular en 3-6 meses.`,
        technique: 'Botox/Dysport en maséteros bilaterales',
        duration_months: 5,
        recovery_weeks: 0,
        cost_cop: { min: 1_500_000, max: 2_500_000 },
        priority: 1,
        age_appropriate: profile.age >= 18,
        evidence_level: 'A',
        references: ['Masseter Botox for Facial Slimming']
      })
    }
    
    // ========================================
    // TENSIÓN SIN CIRUGÍA
    // ========================================
    if (analysis.frontal.laxity > 25 && analysis.frontal.laxity < 45) {
      recommendations.push({
        id: 'threads_pdo',
        category: 'COSMETIC',
        subcategory: 'non_surgical',
        procedure: 'Threads PDO con Conos',
        description: `8-12 hilos de polidioxanona para lifting sin cirugía (+2-4mm elevación)`,
        why: `Laxitud moderada ${analysis.frontal.laxity}/100. Alternativa a lifting quirúrgico.`,
        duration_months: 14,
        recovery_weeks: 0.3,  // 1 semana
        cost_cop: { min: 3_000_000, max: 6_000_000 },
        priority: profile.age < 50 ? 1 : 2,
        age_appropriate: profile.age >= 30,
        evidence_level: 'B',
        references: ['PDO Threads for Facial Rejuvenation']
      })
      
      recommendations.push({
        id: 'hifu_ultherapy',
        category: 'COSMETIC',
        subcategory: 'non_surgical',
        procedure: 'HIFU (Ultherapy)',
        description: `Ultrasonido focalizado para tensión de capa SMAS sin cirugía`,
        why: `Neocolagénesis profunda + contracción 10-15%. Complementa threads o alternativa.`,
        duration_months: 15,
        recovery_weeks: 0,
        cost_cop: { min: 4_000_000, max: 8_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 30,
        evidence_level: 'A',
        references: ['HIFU for Non-Surgical Lifting']
      })
    }
    
    if (analysis.frontal.laxity > 30 || analysis.frontal.skin_quality < 70) {
      recommendations.push({
        id: 'morpheus8',
        category: 'COSMETIC',
        subcategory: 'non_surgical',
        procedure: 'Morpheus8 (RF Microneedling)',
        description: `Radiofrecuencia fraccionada 3-4mm profundidad. 3-4 sesiones.`,
        why: `Neocolagénesis + tensión + calidad de piel. Mejora laxitud y textura simultáneamente.`,
        duration_months: 18,
        recovery_weeks: 0.5,  // 2 semanas downtime mínimo
        cost_cop: { min: 5_000_000, max: 10_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 30,
        evidence_level: 'A',
        references: ['Morpheus8 Clinical Studies']
      })
    }
    
    return recommendations
  }
  
  /**
   * YU: Optimización biológica y epigenética
   */
  private generateBiologicalOptimization(
    profile: PatientProfile,
    analysis: Analysis3D
  ): Recommendation[] {
    
    const recommendations: Recommendation[] = []
    
    // Protocolo base Yu (todos los pacientes)
    const baseProtocol: Recommendation = {
      id: 'yu_base_protocol',
      category: 'BIOLOGICAL',
      subcategory: 'yu',
      procedure: 'Protocolo Yu - Optimización Epigenética Base',
      description: this.getYuProtocolByAge(profile.age),
      why: `Optimizar biología celular para mejores resultados quirúrgicos/no quirúrgicos y mantener Golden Ratio a largo plazo`,
      duration_months: 'permanent',  // Protocolo continuo
      recovery_weeks: 0,
      cost_cop: { min: 300_000, max: 500_000 },  // Por mes
      priority: profile.age > 40 ? 1 : 2,
      age_appropriate: true,
      evidence_level: 'A',
      references: ['Byung Pal Yu - Nutrition, Exercise and Epigenetics']
    }
    
    recommendations.push(baseProtocol)
    
    // Preparación pre-quirúrgica (si hay cirugía recomendada)
    if (analysis.frontal.laxity > 40 || analysis.frontal.skin_quality < 60) {
      recommendations.push({
        id: 'yu_presurgical',
        category: 'BIOLOGICAL',
        subcategory: 'yu',
        procedure: 'Preparación Pre-Quirúrgica (12 semanas)',
        description: `Colágeno 10g + Vit C 1000mg + Omega-3 2g + Resveratrol 500mg + NAC 600mg + Zinc 30mg diarios`,
        why: `Optimizar cicatrización, reducir inflamación y maximizar resultados quirúrgicos`,
        duration_months: 3,
        recovery_weeks: 0,
        cost_cop: { min: 400_000, max: 600_000 },
        priority: 1,
        age_appropriate: true,
        evidence_level: 'A',
        references: ['ERAS Protocols + Yu Optimization']
      })
    }
    
    return recommendations
  }
  
  /**
   * OBAGI: Protocolos dermatológicos modernos (SIN hidroquinona)
   */
  private generateDermatologicalProtocol(
    profile: PatientProfile,
    analysis: Analysis3D
  ): Recommendation[] {
    
    const recommendations: Recommendation[] = []
    const products = this.getObagiProtocolByAge(profile.age, analysis.frontal.skin_quality)
    
    recommendations.push({
      id: 'obagi_protocol',
      category: 'DERMATOLOGICAL',
      subcategory: 'obagi',
      procedure: 'Protocolo Obagi - Calidad de Piel',
      description: products.description,
      why: `Piel de alta calidad = ilusión de proporciones ideales. Golden Ratio requiere piel perfecta.`,
      duration_months: 'permanent',
      recovery_weeks: 0,
      cost_cop: products.cost,
      priority: 2,
      age_appropriate: true,
      evidence_level: 'A',
      references: ['Zein Obagi - Art of Skin Health Restoration']
    })
    
    // Resurfacing si piel < 60
    if (analysis.frontal.skin_quality < 60) {
      recommendations.push({
        id: 'obagi_resurfacing',
        category: 'DERMATOLOGICAL',
        subcategory: 'obagi',
        procedure: 'Laser CO2 Fraccional + Blue Peel',
        description: `1-2 sesiones laser CO2 (1-1.5mm) + 1 Blue Peel TCA 20-30% anual`,
        why: `Renovación dérmica profunda para textura perfecta y reflejos óptimos`,
        duration_months: 18,
        recovery_weeks: 2,
        cost_cop: { min: 5_000_000, max: 10_000_000 },
        priority: 2,
        age_appropriate: profile.age >= 25,
        evidence_level: 'A',
        references: ['Obagi Resurfacing Protocols']
      })
    }
    
    return recommendations
  }
  
  /**
   * Calcula timeline óptimo
   */
  private calculateTimeline(profile: PatientProfile, analysis: Analysis3D): number {
    // Si hay cirugía ósea + tejidos: 12-18 meses (staging)
    // Si solo no quirúrgico: 12 meses
    // Si combinado: 18-24 meses
    
    const hasBonySurgery = analysis.frontal.bigonial_width > this.getIdealRatios(profile).bigonial + 8
    const hasSoftTissueSurgery = analysis.frontal.laxity > 40 && profile.age >= 40
    
    if (hasBonySurgery && hasSoftTissueSurgery) {
      return 18  // Staging
    } else if (hasBonySurgery || hasSoftTissueSurgery) {
      return 12
    } else {
      return 18  // Solo no quirúrgico requiere múltiples sesiones
    }
  }
  
  /**
   * Calcula costo total
   */
  private calculateTotalCost(
    surgical: Recommendation[],
    non_surgical: Recommendation[],
    biological: Recommendation[],
    dermatological: Recommendation[]
  ): { min: number; max: number } {
    
    const all = [...surgical, ...non_surgical, ...biological, ...dermatological]
    
    const min = all.reduce((sum, r) => sum + r.cost_cop.min, 0)
    const max = all.reduce((sum, r) => sum + r.cost_cop.max, 0)
    
    return { min, max }
  }
  
  /**
   * Predice mejora en Golden Ratio
   */
  private predictImprovement(
    profile: PatientProfile,
    analysis: Analysis3D,
    surgical: Recommendation[],
    non_surgical: Recommendation[]
  ): { golden_ratio_current: number; golden_ratio_predicted: number; improvement_percentage: number } {
    
    // Calcular Golden Ratio actual (simplificado)
    const current = this.calculateGoldenRatio(analysis, profile)
    
    // Predicción basada en tipo de tratamiento
    let predicted = current
    
    // Cirugía ósea: +15-20 puntos
    if (surgical.some(r => r.subcategory === 'park')) {
      predicted += 16
    }
    
    // Cirugía tejidos blandos: +8-12 puntos
    if (surgical.some(r => r.subcategory === 'connell')) {
      predicted += 10
    }
    
    // No quirúrgico: +6-10 puntos
    if (non_surgical.length > 0 && surgical.length === 0) {
      predicted += 8
    }
    
    // Cap at 95 (perfección imposible)
    predicted = Math.min(predicted, 95)
    
    const improvement = ((predicted - current) / current) * 100
    
    return {
      golden_ratio_current: Math.round(current),
      golden_ratio_predicted: Math.round(predicted),
      improvement_percentage: Math.round(improvement)
    }
  }
  
  /**
   * Compara opciones: quirúrgico vs no quirúrgico vs combinado
   */
  private compareOptions(
    profile: PatientProfile,
    analysis: Analysis3D
  ): TreatmentPlan['comparison'] {
    
    // Simplificado para demo
    return {
      surgical_only: {
        cost: 25_000_000,
        improvement: 95,
        duration: 'permanent'
      },
      non_surgical_only: {
        cost_5years: 50_000_000,
        improvement: 87,
        duration: '12-18 months'
      },
      combined: {
        cost: 35_000_000,
        improvement: 95,
        duration: 'mixed'
      }
    }
  }
  
  /**
   * Ratios ideales por etnia/género
   */
  /**
   * 🆕 V3.1: Obtiene forma facial ideal según GÉNERO
   */
  private getIdealFacialShape(gender: 'M' | 'F'): {
    shape: string
    description: string
    jawline_angle: number
    chin_style: string
  } {
    if (gender === 'M') {
      return {
        shape: 'Cuadrada/Rectangular',
        description: 'Mandíbula ancha y definida, ángulo mandibular marcado, mentón proyectado',
        jawline_angle: 95,  // Ángulo gonial masculino (90-100°)
        chin_style: 'Proyectado y angular'
      }
    } else {
      return {
        shape: 'Ovalada/Corazón',
        description: 'Mandíbula estrecha y suave, mentón redondeado, tercio inferior delicado',
        jawline_angle: 115,  // Ángulo gonial femenino (110-120°)
        chin_style: 'Suave y redondeado'
      }
    }
  }
  
  private getIdealRatios(profile: PatientProfile): {
    bigonial: number
    bizygomatic: number
    nasolabial_angle: number
    chin_projection: number
    jawline_angle: number
    facial_shape: string
  } {
    
    const ratios = {
      caucasian: {
        bigonial: { M: 100, F: 90 },
        bizygomatic: { M: 130, F: 120 },
        nasolabial_angle: 105,
        chin_projection: 2
      },
      asian: {
        bigonial: { M: 98, F: 88 },
        bizygomatic: { M: 132, F: 122 },
        nasolabial_angle: 95,
        chin_projection: -2
      },
      latino: {
        bigonial: { M: 100, F: 90 },
        bizygomatic: { M: 131, F: 121 },
        nasolabial_angle: 100,
        chin_projection: 0
      },
      african: {
        bigonial: { M: 102, F: 92 },
        bizygomatic: { M: 133, F: 123 },
        nasolabial_angle: 95,
        chin_projection: 4
      },
      middle_eastern: {
        bigonial: { M: 100, F: 90 },
        bizygomatic: { M: 130, F: 120 },
        nasolabial_angle: 100,
        chin_projection: 1
      }
    }
    
    const ethnic = ratios[profile.ethnicity]
    const faceShape = this.getIdealFacialShape(profile.gender)
    
    return {
      bigonial: ethnic.bigonial[profile.gender],
      bizygomatic: ethnic.bizygomatic[profile.gender],
      nasolabial_angle: ethnic.nasolabial_angle,
      chin_projection: ethnic.chin_projection,
      jawline_angle: faceShape.jawline_angle,
      facial_shape: faceShape.shape
    }
  }
  
  /**
   * Protocolo Yu por edad
   */
  private getYuProtocolByAge(age: number): string {
    if (age < 30) {
      return `Preventivo: Vitamina C 500mg + Zinc 15mg + Omega-3 1g + Antioxidantes diarios`
    } else if (age < 45) {
      return `Anti-Edad Temprano: Colágeno 5g + Vitamina C 1000mg + Resveratrol 250mg + Omega-3 2g diarios`
    } else if (age < 60) {
      return `Anti-Edad Avanzado: Colágeno 10g + Vitamina C 1000mg + CoQ10 200mg + Resveratrol 500mg + Omega-3 2g + NAD+ precursors diarios`
    } else {
      return `Longevidad: Colágeno 10g + Vitamina C 1000mg + CoQ10 300mg + Resveratrol 500mg + NAD+ 500mg + Omega-3 3g + Curcumina 1000mg + Magnesio 400mg diarios`
    }
  }
  
  /**
   * Protocolo Obagi por edad (SIN hidroquinona)
   */
  private getObagiProtocolByAge(age: number, skin_quality: number): { description: string; cost: { min: number; max: number } } {
    
    if (age < 30) {
      return {
        description: `AM: Vitamina C 10% + SPF 50+ mineral | PM: Niacinamida 10% + Ácido Hialurónico`,
        cost: { min: 400_000, max: 600_000 }
      }
    } else if (age < 45) {
      return {
        description: `AM: Vitamina C 15% + Ferúlico + SPF 50+ | PM: Retinol 0.5% + Péptidos Matrixyl | Manchas: Tranexámico 5% + Azelaic 15% (NO hidroquinona)`,
        cost: { min: 600_000, max: 800_000 }
      }
    } else if (age < 60) {
      return {
        description: `AM: Vitamina C 20% + Ferúlico + Resveratrol + SPF 50+ | PM: Tretinoin 0.05-0.1% + Péptidos + Growth factors | Manchas: Tranexámico 5% + Kojic 2% + Niacinamida 10%`,
        cost: { min: 800_000, max: 1_200_000 }
      }
    } else {
      return {
        description: `AM: Vitamina C + E + Ferúlico + SPF 50+ | PM: Tretinoin 0.1% + Péptidos + EGF/FGF + SCA | Manchas: Tranexámico 5% + Undecylenoyl phenylalanine 2% + Arbutin 2%`,
        cost: { min: 1_000_000, max: 1_500_000 }
      }
    }
  }
  
  /**
   * Calcula Golden Ratio actual (simplificado)
   */
  private calculateGoldenRatio(analysis: Analysis3D, profile: PatientProfile): number {
    const ideals = this.getIdealRatios(profile)
    
    // Componentes del Golden Ratio
    const symmetry_score = analysis.frontal.symmetry  // 0-100
    const laxity_score = 100 - analysis.frontal.laxity  // Invertido
    const skin_score = analysis.frontal.skin_quality  // 0-100
    
    // Proporciones óseas
    const bigonial_diff = Math.abs(analysis.frontal.bigonial_width - ideals.bigonial)
    const bigonial_score = Math.max(0, 100 - (bigonial_diff * 3))  // -3 puntos por cada mm de diferencia
    
    const bizygomatic_diff = Math.abs(analysis.frontal.bizygomatic_width - ideals.bizygomatic)
    const bizygomatic_score = Math.max(0, 100 - (bizygomatic_diff * 2))
    
    // Promedio ponderado
    const golden_ratio = (
      symmetry_score * 0.25 +
      laxity_score * 0.20 +
      skin_score * 0.15 +
      bigonial_score * 0.25 +
      bizygomatic_score * 0.15
    )
    
    return golden_ratio
  }
}

export const recommendationsEngine = new IntegratedRecommendationsEngine()
