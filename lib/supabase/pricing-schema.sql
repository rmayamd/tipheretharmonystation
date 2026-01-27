/**
 * Copyright (c) 2024-2026 Dr. Ricardo Maya Romo
 * Tipheret Harmony Station - Schema de Precios
 * Todos los derechos reservados.
 */

-- TABLA: product_costs (Productos e Insumos)
CREATE TABLE IF NOT EXISTS product_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  units_per_package DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (cost_per_unit * units_per_package) STORED,
  supplier VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: procedure_prices (Procedimientos y Precios)
CREATE TABLE IF NOT EXISTS procedure_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Costos
  labor_cost DECIMAL(10, 2) DEFAULT 0,
  overhead_cost DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (labor_cost + overhead_cost) STORED,
  
  -- Precios
  price_base DECIMAL(10, 2) NOT NULL,
  price_premium DECIMAL(10, 2) DEFAULT 0,
  price_tourism DECIMAL(10, 2) DEFAULT 0,
  
  -- Otros
  duration_minutes INTEGER DEFAULT 0,
  margin_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN labor_cost + overhead_cost > 0 
      THEN ((price_base - (labor_cost + overhead_cost)) / (labor_cost + overhead_cost) * 100)
      ELSE 0 
    END
  ) STORED,
  
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: procedure_products (Relación Procedimientos-Productos)
CREATE TABLE IF NOT EXISTS procedure_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID REFERENCES procedure_prices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES product_costs(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: pricing_strategies (Estrategias de Precios)
CREATE TABLE IF NOT EXISTS pricing_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'premium', 'competitive', 'penetration'
  description TEXT,
  markup_percentage DECIMAL(5, 2) NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TABLA: competitor_prices (Precios de Competencia)
CREATE TABLE IF NOT EXISTS competitor_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_name VARCHAR(255) NOT NULL,
  competitor_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  quality_tier VARCHAR(50), -- 'economy', 'standard', 'premium', 'luxury'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- INDICES para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_products_category ON product_costs(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON product_costs(active);
CREATE INDEX IF NOT EXISTS idx_procedures_category ON procedure_prices(category);
CREATE INDEX IF NOT EXISTS idx_procedures_active ON procedure_prices(active);
CREATE INDEX IF NOT EXISTS idx_competitor_procedure ON competitor_prices(procedure_name);

-- TRIGGERS para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_costs_updated_at BEFORE UPDATE ON product_costs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedure_prices_updated_at BEFORE UPDATE ON procedure_prices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_strategies_updated_at BEFORE UPDATE ON pricing_strategies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_prices_updated_at BEFORE UPDATE ON competitor_prices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DATOS INICIALES: Estrategias de precios por defecto
INSERT INTO pricing_strategies (name, type, description, markup_percentage, active) VALUES
('Premium', 'premium', 'Precios 20-30% superior al mercado. Justificado por tecnología de punta y experiencia.', 25.00, FALSE),
('Competitivo', 'competitive', 'Precios similares al mercado. Enfoque en volumen y servicio excelente.', 10.00, TRUE),
('Penetración', 'penetration', 'Precios 10-20% inferior al inicio. Ganar mercado rápido, subir después.', -10.00, FALSE)
ON CONFLICT DO NOTHING;

-- COMENTARIOS
COMMENT ON TABLE product_costs IS 'Productos e insumos médicos con costos';
COMMENT ON TABLE procedure_prices IS 'Procedimientos médicos con precios y márgenes';
COMMENT ON TABLE procedure_products IS 'Relación entre procedimientos y productos utilizados';
COMMENT ON TABLE pricing_strategies IS 'Estrategias de precios configurables';
COMMENT ON TABLE competitor_prices IS 'Precios de la competencia para análisis';
