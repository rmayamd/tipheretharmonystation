-- COPIA TODO ESTE CONTENIDO Y PEGALO EN EL SQL EDITOR DE SUPABASE
-- Luego haz clic en "Run" o presiona Ctrl + Enter

-- Base de Datos Maya Harmony Station

-- ============================================
-- TABLA DE Q-SCORE (BODY-Q ASSESSMENTS)
-- ============================================
CREATE TABLE IF NOT EXISTS qscore_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('pre_op', 'post_op_30d', 'post_op_90d', 'post_op_1yr')),
  
  -- Scores Globales (0-100)
  global_satisfaction REAL,
  global_psychological REAL,
  global_physical REAL,
  
  -- Datos Faciales (JSONB para flexibilidad)
  facial_data JSONB,
  
  -- Datos Corporales
  corporal_data JSONB,
  
  -- Risk Flags
  risk_unrealistic_expectations BOOLEAN DEFAULT FALSE,
  risk_body_dysmorphia BOOLEAN DEFAULT FALSE,
  risk_psychological_distress BOOLEAN DEFAULT FALSE,
  
  -- Predicción
  predicted_improvement REAL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para Q-Score
CREATE INDEX IF NOT EXISTS idx_qscore_patient ON qscore_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_qscore_type ON qscore_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_qscore_date ON qscore_assessments(assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_qscore_risks ON qscore_assessments(risk_unrealistic_expectations, risk_body_dysmorphia, risk_psychological_distress);

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  segment TEXT,
  status TEXT DEFAULT 'active',
  luxury_tier TEXT DEFAULT 'standard'
);

CREATE TABLE IF NOT EXISTS quantum_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vitamins JSONB,
  toxins JSONB,
  dna_markers JSONB,
  collagen_synthesis REAL,
  nfkb_inflammation REAL,
  overall_score REAL,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inbody_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  body_fat_percentage REAL,
  muscle_mass REAL,
  segmental_fat JSONB,
  extracellular_water REAL,
  intracellular_water REAL,
  visceral_fat_level REAL,
  basal_metabolic_rate REAL,
  phase_angle REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aesthetic_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  skin_quality_score REAL,
  laxity_score REAL,
  facial_symmetry REAL,
  body_symmetry REAL,
  vaser_simulation JSONB,
  deep_plane_simulation JSONB,
  intimate_aesthetic JSONB,
  maya_vision_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_type TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  block_reason TEXT,
  surgeon_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS epigenetic_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  protocol_type TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  nutrition_plan JSONB,
  supplements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recovery_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  photo_url TEXT,
  tension_score REAL,
  keloid_risk REAL,
  healing_progress REAL,
  notes TEXT,
  monitoring_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interdrogas_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  order_type TEXT,
  items JSONB NOT NULL,
  total_amount REAL NOT NULL,
  phone_number TEXT DEFAULT '6024873000',
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_journey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  stage TEXT,
  content_sent JSONB,
  engagement_score REAL,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vital_value_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  years_added REAL,
  quality_life_score REAL,
  roi_percentage REAL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  image_type TEXT,
  image_url TEXT NOT NULL,
  analysis_data JSONB,
  connell_laxity_score REAL,
  obagi_skin_score REAL,
  tension_markers JSONB,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_post_op INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_luxury (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  age_segment TEXT,
  assigned_script TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_contact_date TIMESTAMP WITH TIME ZONE,
  communication_frequency TEXT,
  preferred_channels JSONB,
  budget_category TEXT,
  concerns JSONB,
  conversion_probability REAL,
  lifetime_value REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neurosales_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  script_name TEXT,
  sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened BOOLEAN DEFAULT FALSE,
  response_received BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  message_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maya_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_type TEXT,
  conditions_detected JSONB,
  recommendations JSONB,
  sources JSONB,
  priority TEXT,
  implemented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SEGURIDAD (Row Level Security - RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantum_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbody_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE aesthetic_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE epigenetic_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE interdrogas_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_value_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_luxury ENABLE ROW LEVEL SECURITY;
ALTER TABLE neurosales_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE maya_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qscore_assessments ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso (Permitir todo a usuarios autenticados)
-- Nota: En producción, deberías restringir esto por user_id si tuvieras login de pacientes
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('CREATE POLICY "Allow all access for authenticated users" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
    END LOOP;
END $$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_patients_segment ON patients(segment);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_age ON patients(age);
CREATE INDEX IF NOT EXISTS idx_quantum_patient ON quantum_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_inbody_patient ON inbody_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_aesthetic_patient ON aesthetic_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedures_patient ON procedures(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedures_date ON procedures(scheduled_date);

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_journey_updated_at BEFORE UPDATE ON patient_journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_luxury_updated_at BEFORE UPDATE ON crm_luxury
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
