# 🧬 MAYA-SCAN 3D - Documentación Completa

## 🎯 **¿QUÉ ES MAYA-SCAN 3D?**

**MAYA-SCAN 3D** es el sistema de escaneo facial 3D de Maya Harmony Station, inspirado en **Face ID de Apple**. 

A diferencia de la captura de fotos simple (2D), MAYA-SCAN 3D:

✅ Detecta **468 puntos faciales** en tiempo real usando MediaPipe  
✅ Captura **6 ángulos automáticamente** (frontal, oblicuos, laterales, cenital)  
✅ Genera una **malla 3D** con profundidad real  
✅ Calcula **mediciones científicas** (mm, grados, volumen)  
✅ Proporciona **métricas reales**, no simuladas  

---

## 🚀 **CÓMO FUNCIONA**

### **FLUJO DE USUARIO:**

```
1. Usuario selecciona "Escaneo 3D" 
   ↓
2. Se abre pantalla de escaneo tipo Face ID
   ↓
3. Sistema detecta rostro y muestra landmarks en tiempo real
   ↓
4. Instrucciones dinámicas guían al usuario:
   - "Mira al frente" → Captura automática frontal
   - "Gira a la derecha" → Captura automática lateral
   - "Inclina hacia arriba" → Captura automática cenital
   ↓
5. Barra de progreso muestra ángulos completados
   ↓
6. Al completar 6 ángulos, genera malla 3D
   ↓
7. Usuario puede iniciar diagnóstico con datos 3D reales
```

### **TECNOLOGÍA:**

- **MediaPipe Face Mesh**: Detección de 468 landmarks 3D
- **Tracking automático**: Captura cuando el usuario está en posición correcta
- **Sin botones**: El sistema captura automáticamente (como Face ID)
- **Validación en tiempo real**: Solo acepta frames de buena calidad

---

## 📊 **MEDICIONES 3D REALES**

### **Frontales (mm):**
- `bigonialWidth`: Ancho mandibular
- `bizygomaticWidth`: Ancho cigomático
- `facialHeight`: Altura facial total

### **Laterales (mm y grados):**
- `nasolabialAngle`: Ángulo nariz-labio superior (ideal: 95-105°)
- `chinProjection`: Proyección del mentón
- `cervicoMentalAngle`: Ángulo cuello-mentón (ideal: 105-120°)
- `nasolabialFoldDepth`: Profundidad del surco nasolabial (mm)

### **Volumen (mm³):**
- `infraorbitalHollowVolume`: Volumen de ojeras
- `malarProjection`: Proyección de pómulos

### **Simetría (0-100):**
- `leftRightSymmetry`: Simetría bilateral
- `upperLowerSymmetry`: Simetría vertical

### **Golden Ratio 3D (0-100):**
- `goldenRatioScore`: Proximidad al ratio áureo (1.618) considerando múltiples mediciones

### **Depth Maps:**
- `nasolabialDepthMap[]`: Profundidad a lo largo del surco
- `jawlineDepthMap[]`: Definición de la línea mandibular

---

## 🎨 **INTERFAZ DE USUARIO**

### **Características:**

1. **Video en vivo** con overlay de landmarks (468 puntos verdes)
2. **Instrucciones dinámicas** en pantalla según ángulo actual
3. **Barra de progreso** con 6 ángulos visualizados
4. **Indicador de captura** (parpadeante cuando está guardando frames)
5. **Guía circular tipo Face ID** (anillos concéntricos)
6. **Feedback visual** cuando completa un ángulo (✓ verde)

### **Estados:**

- ⏳ **Inicializando**: Cargando MediaPipe y cámara
- 📹 **Escaneando**: Capturando frames activamente
- ✅ **Completado**: Malla 3D generada

---

## 🆚 **MAYA-SCAN 3D vs FOTO SIMPLE**

| Característica | Foto Simple (2D) | MAYA-SCAN 3D |
|---|---|---|
| **Puntos detectados** | 0 (análisis de píxeles) | 468 landmarks 3D |
| **Ángulos** | 1 (frontal) | 6 (frontal, laterales, oblicuos, cenital) |
| **Profundidad** | ❌ No | ✅ Coordenada Z real |
| **Mediciones** | Simuladas | ✅ Reales (mm, grados, mm³) |
| **Tiempo** | ~2 segundos | ~15-20 segundos |
| **Interacción** | Click para capturar | Automático (como Face ID) |
| **Precisión** | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🔬 **VENTAJA SOBRE CANFIELD**

### **Canfield VECTRA 3D:**
- ✅ Escaneo 3D profesional
- ✅ Precisión submilimétrica
- ❌ Requiere hardware especializado ($30,000+)
- ❌ Solo en consultorio

### **MAYA-SCAN 3D:**
- ✅ Escaneo 3D en tiempo real
- ✅ Mediciones científicas reales
- ✅ **Solo requiere webcam/cámara del celular**
- ✅ **Funciona en cualquier navegador**
- ✅ **100% privado** (no sube datos a servidores)
- ✅ **Integrado con InBody + Quantum Analyzer**

**Ventaja única:** MAYA combina escaneo facial 3D + datos biométricos internos (InBody, Quantum) en un solo sistema.

---

## 🧠 **CÓMO LO USA EL SISTEMA**

### **En el Diagnóstico:**

Cuando el usuario completa un MAYA-SCAN 3D, el sistema:

1. **Reemplaza análisis 2D** por datos 3D reales
2. **Usa mediciones reales** para recomendaciones quirúrgicas
3. **Calcula ratios científicos** (Le Fort I, Sagital) con precisión
4. **Detecta asimetrías** reales (no estimadas)
5. **Predice resultados** con mayor precisión

### **En Recomendaciones:**

```typescript
if (mesh3D.nasolabialFoldDepth > 3mm) {
  → Recomendar: "Deep Plane SMAS Lift"
} else if (mesh3D.nasolabialFoldDepth > 1.5mm) {
  → Recomendar: "SMAS Lift tradicional"
} else {
  → Recomendar: "Rellenos de ácido hialurónico"
}
```

**Antes (2D):** "Recomendamos SMAS basado en estimación"  
**Ahora (3D):** "Tu surco nasolabial tiene 3.2mm de profundidad, ideal para Deep Plane SMAS según protocolo de Connell"

---

## 📱 **EXPERIENCIA DE USUARIO**

### **Ventajas:**

1. **Familiar**: Todos conocen Face ID
2. **Sin botones**: Captura automática
3. **Feedback claro**: Instrucciones en tiempo real
4. **Progreso visible**: Barra con ángulos completados
5. **Rápido**: ~15-20 segundos total

### **Instrucciones típicas:**

```
👤 "Mira directamente a la cámara"
↗️ "Gira tu cabeza ligeramente a la derecha"
➡️ "Gira tu cabeza completamente a la derecha (perfil)"
↖️ "Gira tu cabeza ligeramente a la izquierda"
⬅️ "Gira tu cabeza completamente a la izquierda (perfil)"
⬆️ "Inclina tu cabeza hacia atrás (mira hacia arriba)"
```

---

## 🛠️ **ARCHIVOS DEL SISTEMA**

### **Backend:**
- `lib/maya-vision/face-mesh-scanner.ts`: Motor de escaneo MediaPipe
- `lib/maya-vision/mesh-3d-generator.ts`: Generador de malla y métricas 3D

### **Frontend:**
- `components/MayaScan3D.tsx`: Componente UI de escaneo
- `app/maya-bio-mirror/page.tsx`: Integración en dashboard principal

### **Dependencias:**
```json
{
  "@mediapipe/face_mesh": "^0.4.x",
  "@mediapipe/camera_utils": "^0.3.x",
  "@mediapipe/drawing_utils": "^0.3.x"
}
```

---

## 🎯 **RESULTADO FINAL**

Cuando el usuario completa el escaneo, obtiene:

```typescript
{
  bigonialWidth: 132.5,        // mm
  bizygomaticWidth: 145.8,     // mm
  facialHeight: 198.3,         // mm
  nasolabialAngle: 98.2,       // grados
  chinProjection: -2.3,        // mm (negativo = retrusión)
  cervicoMentalAngle: 112.4,   // grados
  nasolabialFoldDepth: 3.2,    // mm
  infraorbitalHollowVolume: 45.7, // mm³
  malarProjection: 8.5,        // mm
  leftRightSymmetry: 94,       // 0-100
  upperLowerSymmetry: 87,      // 0-100
  goldenRatioScore: 82,        // 0-100
  nasolabialDepthMap: [2.1, 2.8, 3.2, 2.9, 2.3],
  jawlineDepthMap: [1.2, 1.5, 1.8, 2.1, 1.9, ...]
}
```

**Esto es lo que Canfield NO tiene:** Integración con datos biométricos internos (InBody, Quantum).

---

## 🚀 **PRÓXIMOS PASOS**

### **V3.3 (Futuro):**
- [ ] Exportar malla 3D en formato OBJ/STL
- [ ] Simulación de cirugía en 3D (no solo 2D)
- [ ] Comparación antes/después en 3D
- [ ] Integración con impresión 3D
- [ ] Modo "selfie" con cámara frontal del celular

---

## 🏆 **CONCLUSIÓN**

**MAYA-SCAN 3D** es el primer sistema de bioingeniería humana que combina:

1. Escaneo facial 3D tipo Face ID
2. Detección de 468 landmarks en tiempo real
3. Mediciones científicas reales (mm, grados, volumen)
4. Integración con biometría interna (InBody + Quantum)
5. **Todo en el navegador, sin hardware especializado**

**Esto hace que Maya Harmony Station sea único en el mundo.**

---

**Desarrollado por:** Maya Harmony Station  
**Tecnología:** MediaPipe Face Mesh + Next.js 14  
**Fecha:** Enero 2026  
**Versión:** 3.2.0
