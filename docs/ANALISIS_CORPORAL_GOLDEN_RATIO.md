# 📐 MAYA HARMONY - ANÁLISIS CORPORAL GOLDEN RATIO

## 🎯 NUEVA FUNCIONALIDAD IMPLEMENTADA

### Sistema Completo de Proporción Áurea Corporal

Maya Harmony ahora incluye análisis corporal completo basado en el **Golden Ratio (φ = 1.618)** aplicado a todo el cuerpo humano.

---

## 🔥 CARACTERÍSTICAS PRINCIPALES

### 1. **Golden Ratio Corporal**
Análisis de proporciones ideales del cuerpo:

- **WHR (Waist-to-Hip Ratio):** Ideal mujer 0.7, hombre 0.9
- **Busto/Cintura:** Ideal 1.4-1.5
- **Cadera/Cintura:** Ideal mujer 1.4, hombre 1.1
- **Piernas/Altura:** Ideal 0.618 (61.8% de altura total)
- **Ombligo/Altura:** Ideal 0.618 (divide el cuerpo en phi)
- **Hombro/Cadera:** Ideal mujer 1.0-1.1, hombre 1.3-1.4
- **Muslo/Pantorrilla:** Ideal 1.618

### 2. **Calculadora de Implantes Mamarios** 🔮
Recomendación inteligente de volumen basada en:

- **Entrada:**
  - Copa actual (AA, A, B)
  - Copa deseada (B, C, D, DD)
  - Altura del paciente
  - Ancho torácico
  - Ancho de base mamaria

- **Salida:**
  - Volumen óptimo en cc (min-max-optimal)
  - Perfil recomendado (low/moderate/moderate_plus/high/extra_high)
  - Forma (round/anatomical)
  - Predicción de medidas post-operatorias
  - ¿Alcanza Golden Ratio?

**Fórmula:**
```
Base = 150-200cc por copa
Factor altura = altura_paciente / 165cm
Factor ancho = ancho_torácico / 32cm
Volumen = Base × Factor_altura × Factor_ancho
```

### 3. **Calculadora de Implantes Glúteos** 🍑
Recomendación para BBL o implantes glúteos:

- **Análisis:**
  - Ratio actual cadera/cintura
  - Proyección glútea actual vs ideal (35% del ancho de cadera)
  - Déficit de proyección

- **Salida:**
  - Volumen óptimo en cc
  - Perfil y forma anatómica
  - Predicción de ratio post-operatorio
  - Consideraciones (tejido disponible, alternativa BBL)

**Fórmula:**
```
Proyección_ideal = ancho_cadera × 0.35
Déficit = Proyección_ideal - Proyección_actual
Volumen = Déficit_cm × 100cc/cm
```

### 4. **Calculadora de Implantes de Pantorrilla** 🦵
Armonización de proporción muslo/pantorrilla:

- **Análisis:**
  - Ratio actual muslo/pantorrilla
  - Ratio ideal: 1.5
  - Déficit de circunferencia

- **Salida:**
  - Volumen óptimo (80-180cc)
  - Implante anatómico subfascial medial
  - Predicción de proporciones post-op

**Fórmula:**
```
Circunferencia_ideal_pantorrilla = muslo / 1.5
Déficit = ideal - actual
Volumen = (Déficit_cm / 2) × 100cc
```

### 5. **Análisis de Abdominoplastia** ✂️
Sistema de evaluación para tummy tuck:

- **Tipos de abdominoplastia:**
  - **Mini:** Exceso grado 2, sin laxitud muscular
  - **Full:** Exceso grado 2-3 + laxitud muscular/diástasis
  - **Extended:** Exceso grado 4 o BMI>30 + grado 3
  - **Circumferential:** Body lift 360°, exceso lateral significativo
  - **Fleur de lis:** Exceso vertical masivo (cruz)

- **Evaluación:**
  - Grado de exceso de piel (1-4)
  - Laxitud muscular (diástasis >2cm)
  - Severidad de estrías
  - Cicatrices de cesárea

- **Predicción:**
  - Reducción de cintura esperada (3-20cm)
  - Mejora en Golden Ratio
  - Ubicación de incisión
  - Semanas de recuperación
  - Combinación con liposucción

**Graduación de exceso de piel:**
- Grado 1: ≤5cm proyección
- Grado 2: 5-8cm
- Grado 3: 8-12cm
- Grado 4: >12cm

### 6. **Simulador Visual de Abdominoplastia** 🖼️
Genera imágenes "antes/después":

- Compresión horizontal progresiva (efecto de reducción)
- Suavizado de contorno lateral
- Aumento de contraste (efecto de tensión de piel)
- Aplanamiento de línea media (reparación de diástasis)
- Marcado de líneas de incisión quirúrgica
- Visualización comparativa lado a lado

---

## 📊 DATOS CIENTÍFICOS

### Basado en:

1. **Hombre de Vitruvio (Leonardo da Vinci)**
   - Proporciones phi en cuerpo humano
   - Ombligo como punto de división áurea

2. **Estudios antropométricos modernos**
   - WHR y atractivo (Singh, 1993)
   - Proporciones corporales y salud

3. **Murcia Garzón - "Evolución morfológica del cuerpo"**
   - Clasificación morfológica
   - Variaciones étnicas y de género

4. **Protocolos quirúrgicos:**
   - ASPS (American Society of Plastic Surgeons)
   - ISAPS (International Society)
   - Consensos de implantes mamarios y glúteos

---

## 💻 ARCHIVOS CREADOS

```
lib/body-analysis/
├── golden-ratio-body.ts              # Motor principal de análisis
├── abdominoplasty-simulator.ts       # Simulador visual tummy tuck

components/
├── BodyAnalysisDashboard.tsx         # Dashboard completo con UI

docs/
├── ANALISIS_CORPORAL_GOLDEN_RATIO.md # Esta documentación
```

---

## 🚀 CÓMO USAR

### En el código:

```typescript
import { evaluateGoldenRatioBody, recommendBreastImplant } from '@/lib/body-analysis/golden-ratio-body'

// Análisis general
const analysis = evaluateGoldenRatioBody(measurements, 'F')
console.log(`Score: ${analysis.overall_score}/100`)

// Implantes mamarios
const breast = recommendBreastImplant(
  measurements,
  'C',           // Copa deseada
  'A',           // Copa actual
  165,           // Altura en cm
  32             // Ancho torácico
)
console.log(`Volumen óptimo: ${breast.volume_cc_optimal}cc`)
```

### En la UI:

```tsx
import { BodyAnalysisDashboard } from '@/components/BodyAnalysisDashboard'

<BodyAnalysisDashboard
  patientGender="F"
  patientAge={32}
  patientHeight={165}
  patientBMI={23}
/>
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ **Sistema Golden Ratio Corporal** - COMPLETADO
2. ✅ **Calculadora de implantes** - COMPLETADO
3. ✅ **Simulador de abdominoplastia** - COMPLETADO
4. 🔄 **Integrar con Maya Bio-Mirror principal**
5. 🔄 **Captura de fotos corporales (frontal + lateral)**
6. 🔄 **Análisis automático con IA de medidas**
7. 🔄 **Simulación 3D con malla corporal**

---

## 📐 EJEMPLO DE RECOMENDACIONES

### Paciente Mujer, 32 años, 165cm

**Medidas actuales:**
- Busto: 88cm
- Cintura: 72cm
- Cadera: 96cm

**Análisis:**
- WHR: 0.75 (vs ideal 0.70) ✓ Muy bueno
- Busto/Cintura: 1.22 (vs ideal 1.40) ⚠️ Subóptimo
- Score general: 78/100

**Recomendaciones:**
1. 💡 **Implantes mamarios**: 300cc, perfil moderado
   - Copa A → C
   - Alcanza Golden Ratio: ✓ Sí
   - Busto post-op: 98cm (ratio 1.36)

2. 💡 **Abdominoplastia**: No candidata
   - Exceso grado 1
   - Sin laxitud muscular
   - Recomendación: Mantener con ejercicio

---

## 🧬 INTEGRACIÓN CON MAYA HARMONY

Esta funcionalidad se integra perfectamente con:

- **Maya-Vision:** Análisis facial + corporal completo
- **InBody H30:** Composición corporal real
- **Quantum Analyzer:** Biomarcadores
- **Pasaporte de Inmortalidad:** Plan integral estético

**¡Maya Harmony ahora es la única plataforma que une análisis facial Y corporal con Golden Ratio científico!** 🚀

---

**Autor:** Maya Harmony AI System  
**Fecha:** Enero 2026  
**Versión:** 4.0 - Body Analysis Module
