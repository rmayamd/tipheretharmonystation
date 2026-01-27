-- Base de Datos Maya Harmony Station
-- Esquema completo para el sistema de bioingeniería humana

-- Tabla de Pacientes (Base de Datos Luxury)
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  segment TEXT, -- 'joven', 'maduro', 'longevidad'
  status TEXT DEFAULT 'active',
  luxury_tier TEXT DEFAULT 'standard'
);

-- Tabla de Diagnósticos Bio-Cuánticos (Nivel 1)
CREATE TABLE IF NOT EXISTS quantum_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vitamins JSONB, -- 53 informes de vitaminas
  toxins JSONB,
  dna_markers JSONB,
  collagen_synthesis REAL, -- Síntesis de colágeno
  nfkb_inflammation REAL, -- Inflamación molecular (NFkB)
  overall_score REAL,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Análisis InBody (Nivel 2 - Bio-Físico)
CREATE TABLE IF NOT EXISTS inbody_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  body_fat_percentage REAL,
  muscle_mass REAL,
  segmental_fat JSONB, -- Grasa segmental
  extracellular_water REAL, -- Agua extracelular para seguridad ERAS
  intracellular_water REAL,
  visceral_fat_level REAL,
  basal_metabolic_rate REAL,
  phase_angle REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Análisis Estético (Nivel 3 - Bio-Estético)
CREATE TABLE IF NOT EXISTS aesthetic_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  skin_quality_score REAL, -- Obagi
  laxity_score REAL, -- Connell
  facial_symmetry REAL,
  body_symmetry REAL,
  vaser_simulation JSONB, -- Simulación VASER (Garcia Jr.)
  deep_plane_simulation JSONB, -- Simulación Deep Plane (Connell)
  intimate_aesthetic JSONB, -- Estética Íntima (Triana)
  maya_vision_data JSONB, -- Datos del motor Maya-Vision
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Procedimientos Quirúrgicos
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_type TEXT NOT NULL, -- 'vaser', 'deep_plane', 'intimate', etc.
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'blocked', 'completed'
  block_reason TEXT, -- Razón de bloqueo (baja síntesis colágeno, inflamación, etc.)
  surgeon_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Protocolos de Pre-habilitación Epigenética
CREATE TABLE IF NOT EXISTS epigenetic_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  protocol_type TEXT, -- 'collagen_boost', 'inflammation_reduction', 'general'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  nutrition_plan JSONB, -- Plan basado en Byung Pal Yu
  supplements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Recuperación Post-Operatoria
CREATE TABLE IF NOT EXISTS recovery_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  photo_url TEXT,
  tension_score REAL, -- Score de tensión mecánica (Ogawa)
  keloid_risk REAL, -- Riesgo de queloides
  healing_progress REAL,
  notes TEXT,
  monitoring_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Órdenes a Interdrogas
CREATE TABLE IF NOT EXISTS interdrogas_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  order_type TEXT, -- 'preparation', 'supplements', 'recovery'
  items JSONB NOT NULL, -- Lista de insumos
  total_amount REAL NOT NULL,
  phone_number TEXT DEFAULT '6024873000',
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'confirmed', 'delivered'
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Patient Journey (Marketing)
CREATE TABLE IF NOT EXISTS patient_journey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  stage TEXT, -- 'awareness', 'consideration', 'decision', 'post_op', 'retention'
  content_sent JSONB, -- Contenido de autoridad enviado
  engagement_score REAL,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Valor Vital (ROI en Longevidad)
CREATE TABLE IF NOT EXISTS vital_value_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  years_added REAL, -- Años de longevidad añadidos
  quality_life_score REAL,
  roi_percentage REAL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Seguimiento de Imágenes (Ogawa)
CREATE TABLE IF NOT EXISTS image_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  image_type TEXT, -- 'pre_op', 'post_op', 'follow_up'
  image_url TEXT NOT NULL,
  analysis_data JSONB, -- Datos de Maya-Vision
  connell_laxity_score REAL,
  obagi_skin_score REAL,
  tension_markers JSONB, -- Marcadores de tensión Ogawa
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days_post_op INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de CRM Base Luxury (Segmentación y Retoma)
CREATE TABLE IF NOT EXISTS crm_luxury (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  age_segment TEXT, -- 'millennials-preventivos', 'profesionales-activos', 'ejecutivos-premium', etc.
  assigned_script TEXT, -- 'regeneracion', 'simetria', 'global'
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_contact_date TIMESTAMP WITH TIME ZONE,
  communication_frequency TEXT, -- 'high', 'medium', 'low'
  preferred_channels JSONB, -- ['WhatsApp', 'Email', etc.]
  budget_category TEXT, -- 'low', 'medium', 'high'
  concerns JSONB, -- Lista de preocupaciones
  conversion_probability REAL, -- 0-100
  lifetime_value REAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Guiones de Neuroventas (Tracking)
CREATE TABLE IF NOT EXISTS neurosales_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  script_name TEXT, -- 'Regeneración', 'Simetría', 'Global'
  sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened BOOLEAN DEFAULT FALSE,
  response_received BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  message_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Maya Brain Recommendations (Cerebro Maya)
CREATE TABLE IF NOT EXISTS maya_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_type TEXT, -- 'inbody', 'quantum', 'aesthetic', 'combined'
  conditions_detected JSONB,
  recommendations JSONB, -- Recomendaciones con síntesis cruzada
  sources JSONB, -- Lista de tratados consultados
  priority TEXT, -- 'low', 'medium', 'high', 'urgent'
  implemented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_patients_segment ON patients(segment);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_age ON patients(age);
CREATE INDEX IF NOT EXISTS idx_quantum_patient ON quantum_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_inbody_patient ON inbody_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_aesthetic_patient ON aesthetic_analysis(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedures_patient ON procedures(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedures_date ON procedures(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_image_tracking_patient ON image_tracking(patient_id);
CREATE INDEX IF NOT EXISTS idx_image_tracking_procedure ON image_tracking(procedure_id);
CREATE INDEX IF NOT EXISTS idx_crm_luxury_patient ON crm_luxury(patient_id);
CREATE INDEX IF NOT EXISTS idx_crm_luxury_segment ON crm_luxury(age_segment);
CREATE INDEX IF NOT EXISTS idx_neurosales_patient ON neurosales_tracking(patient_id);
CREATE INDEX IF NOT EXISTS idx_maya_recommendations_patient ON maya_recommendations(patient_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_journey_updated_at BEFORE UPDATE ON patient_journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_luxury_updated_at BEFORE UPDATE ON crm_luxury
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
