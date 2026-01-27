# Arquitectura Maya Harmony Station

## Visión General

Maya Harmony Station es una estación de bioingeniería humana construida con Next.js 14, Tailwind CSS y Supabase. El sistema supera las capacidades de Canfield mediante algoritmos propios y análisis cruzado de múltiples fuentes de datos.

## Pilares Técnicos

### 1. Motor de Visión Propio (Maya-Vision)
- **Ubicación**: `lib/maya-vision/analyzer.ts`
- **Funcionalidades**:
  - Análisis de laxitud (Connell)
  - Calidad de piel (Obagi)
  - Simetría facial y corporal
  - Mecánica de tejido (cuánto cederá la piel)
- **Superioridad vs Canfield**: Análisis dinámico que considera la mecánica del tejido según datos del InBody

### 2. Integración de Hardware
- **InBody Dial H30**: Análisis de composición física
  - Grasa segmental
  - Agua extracelular (seguridad ERAS)
  - Phase angle
- **Analizador Cuántico**: Biomarcadores internos
  - 53 informes (vitaminas, toxinas, ADN)
  - Síntesis de colágeno
  - Inflamación molecular (NFkB)

### 3. Lógica Médica Cruzada
- **Ubicación**: `lib/medical-logic/cross-validation.ts`
- **Funcionalidad**: Bloquea fechas quirúrgicas si:
  - Síntesis de colágeno < 50%
  - Inflamación NFkB > 60%
  - Agua extracelular > 0.4 (riesgo ERAS)
  - Elasticidad de tejido < 15%
  - Calidad de piel < 40%
- **Resultado**: Genera protocolos de pre-habilitación epigenética automáticamente

### 4. Sistema de Despacho Interdrogas
- **Ubicación**: `lib/interdrogas/order-generator.ts`
- **Funcionalidad**: Genera órdenes completas con:
  - Kit de Preparación de Piel
  - Suplementación Epigenética
  - Kit de Tensión Zero
- **Integración**: Envío automático por WhatsApp al 6024873000

## Módulos Principales

### Módulo A: Diagnóstico de 3 Niveles
1. **Nivel 1 - Bio-Cuántico**: 53 informes del Analizador Cuántico
2. **Nivel 2 - Bio-Físico**: Datos del InBody H30
3. **Nivel 3 - Bio-Estético**: Escaneo 3D (VASER, Deep Plane, Estética Íntima)

### Módulo B: Marketing y Persuasión
- **Patient Journey**: Seguimiento automatizado por etapas
- **Calculadora de Valor Vital**: ROI en longevidad (no "precio")
- **Neuroventas**: Scripts personalizados por segmento

### Módulo C: Recuperación y Epigenética
- **Monitor de Tensión (Ogawa)**: Análisis post-operatorio para prevenir queloides
- **Plan Nutricional Epigenético (Yu)**: Dieta para silenciar genes de envejecimiento

## Base de Datos (Supabase)

### Esquema Principal
- `patients`: Base de datos Luxury con segmentación
- `quantum_analysis`: Análisis Bio-Cuántico
- `inbody_analysis`: Análisis Bio-Físico
- `aesthetic_analysis`: Análisis Bio-Estético
- `procedures`: Procedimientos quirúrgicos con validación
- `epigenetic_protocols`: Protocolos de pre-habilitación
- `recovery_monitoring`: Monitoreo post-operatorio
- `interdrogas_orders`: Órdenes generadas
- `patient_journey`: Seguimiento de marketing
- `vital_value_calculations`: Cálculos de ROI

## Flujo de Trabajo

1. **Ingreso de Paciente** → CRM Inteligente
2. **Diagnóstico 3 Niveles** → Validación Médica Cruzada
3. **Si bloqueado** → Protocolo Epigenético → Re-validación
4. **Si aprobado** → Procedimiento → Monitoreo de Recuperación
5. **Órdenes Interdrogas** → Generación automática según necesidad

## Tecnologías

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js Server Actions, Supabase
- **Base de Datos**: PostgreSQL (Supabase)
- **Estilos**: Tailwind CSS con tema Luxury Zen
- **Análisis de Imágenes**: Canvas API (preparado para TensorFlow.js)

## Próximos Pasos de Desarrollo

1. Integración real de TensorFlow.js para Maya-Vision
2. Conexión real con InBody H30 (API/Bluetooth)
3. Integración con Analizador Cuántico
4. Automatización completa de WhatsApp
5. Dashboard de analytics avanzado
6. Sistema de notificaciones push
