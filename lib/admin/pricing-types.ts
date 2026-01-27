/**
 * Copyright (c) 2024-2026 Dr. Ricardo Maya Romo
 * Tipheret Harmony Station - Sistema de Gestión de Precios
 * Todos los derechos reservados.
 */

export interface ProductCost {
  id: string
  name: string
  brand: string
  cost_per_unit: number
  units_per_package: number
  total_cost: number
  supplier: string
  last_updated: Date
}

export interface ProcedurePrice {
  id: string
  category: 'consultation' | 'injectable' | 'facial' | 'body_surgery' | 'other'
  name: string
  description: string
  
  // Costos
  product_costs: {
    product_id: string
    quantity: number
  }[]
  labor_cost: number
  overhead_cost: number
  total_cost: number
  
  // Precios
  price_base: number
  price_premium: number
  price_tourism: number
  
  // Otros
  duration_minutes: number
  margin_percentage: number
  active: boolean
  last_updated: Date
}

export interface PricingStrategy {
  id: string
  name: string
  type: 'premium' | 'competitive' | 'penetration'
  description: string
  markup_percentage: number
  active: boolean
}

export interface CompetitorPrice {
  id: string
  procedure_name: string
  competitor_name: string
  location: string
  price: number
  quality_tier: 'economy' | 'standard' | 'premium' | 'luxury'
  last_updated: Date
}

// Categorías de productos
export const PRODUCT_CATEGORIES = {
  TOXIN: 'Toxina Botulínica',
  FILLER: 'Ácido Hialurónico',
  THREADS: 'Hilos Tensores',
  ANESTHESIA: 'Anestésicos',
  SUPPLIES: 'Material Descartable',
  IMPLANTS: 'Implantes',
  MEDICATIONS: 'Medicamentos',
  OTHER: 'Otros'
} as const

// Categorías de procedimientos
export const PROCEDURE_CATEGORIES = {
  consultation: 'Consultas',
  injectable: 'Inyectables (Botox/Rellenos)',
  facial: 'Procedimientos Faciales',
  body_surgery: 'Cirugías Corporales',
  other: 'Otros'
} as const

// Template de productos comunes
export const COMMON_PRODUCTS = {
  BOTOX: {
    name: 'Botox',
    brand: 'Allergan',
    units_per_package: 100,
    category: 'TOXIN'
  },
  DYSPORT: {
    name: 'Dysport',
    brand: 'Galderma',
    units_per_package: 300,
    category: 'TOXIN'
  },
  XEOMIN: {
    name: 'Xeomin',
    brand: 'Merz',
    units_per_package: 100,
    category: 'TOXIN'
  },
  JUVEDERM: {
    name: 'Juvederm',
    brand: 'Allergan',
    units_per_package: 1,
    category: 'FILLER'
  },
  RESTYLANE: {
    name: 'Restylane',
    brand: 'Galderma',
    units_per_package: 1,
    category: 'FILLER'
  }
}

// Template de procedimientos comunes
export const COMMON_PROCEDURES = {
  CONSULTATION: {
    name: 'Consulta Diagnóstica',
    category: 'consultation' as const,
    duration_minutes: 45
  },
  BOTOX_FOREHEAD: {
    name: 'Botox - Frente',
    category: 'injectable' as const,
    duration_minutes: 15
  },
  BOTOX_GLABELLA: {
    name: 'Botox - Entrecejo',
    category: 'injectable' as const,
    duration_minutes: 15
  },
  BOTOX_CROWS_FEET: {
    name: 'Botox - Patas de Gallo',
    category: 'injectable' as const,
    duration_minutes: 15
  },
  BOTOX_MASSETERS: {
    name: 'Botox - Masseteros',
    category: 'injectable' as const,
    duration_minutes: 20
  },
  FILLER_LIPS: {
    name: 'Relleno Labial',
    category: 'injectable' as const,
    duration_minutes: 30
  },
  FILLER_CHEEKS: {
    name: 'Relleno Pómulos',
    category: 'injectable' as const,
    duration_minutes: 45
  },
  LIPO: {
    name: 'Liposucción HD',
    category: 'body_surgery' as const,
    duration_minutes: 180
  },
  BREAST_AUG: {
    name: 'Aumento Mamario',
    category: 'body_surgery' as const,
    duration_minutes: 120
  },
  ABDOMINOPLASTY: {
    name: 'Abdominoplastia',
    category: 'body_surgery' as const,
    duration_minutes: 180
  },
  RHINOPLASTY: {
    name: 'Rinoplastia',
    category: 'body_surgery' as const,
    duration_minutes: 150
  }
}
