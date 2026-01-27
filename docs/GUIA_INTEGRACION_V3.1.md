# 🚀 GUÍA DE INTEGRACIÓN V3.1 - PASO A PASO

## ⏱️ TIEMPO ESTIMADO: 1-2 HORAS

---

## 📋 CHECKLIST:

```
□ 1. Importar nuevos componentes y funciones
□ 2. Agregar estados para modales
□ 3. Reemplazar sistema de captura simple por multi-ángulo
□ 4. Integrar simulación volumétrica
□ 5. Conectar botones compartir/email a modales
□ 6. Probar con 1 paciente real
□ 7. Ajustar según feedback
```

---

## 🔧 PASO 1: IMPORTACIONES (5 min)

**Archivo:** `app/maya-bio-mirror/page.tsx`

**Agregar al inicio del archivo:**

```typescript
// 🆕 V3.1: Componentes multi-captura
import { MultiAngleCapture, type MultiAngleCapture as CapturesType } from '@/lib/maya-vision/multi-angle-capture'
import { MultiAngleCapture as MultiAngleCaptureUI } from '@/components/MultiAngleCapture'

// 🆕 V3.1: Simulación volumétrica
import { 
  applyVolumetricSimulation, 
  calculateVolumetricChanges 
} from '@/lib/maya-vision/volumetric-simulation'

// 🆕 V3.1: Modales
import { SocialShareModal } from '@/components/SocialShareModal'
import { EmailSendModal } from '@/components/EmailSendModal'
```

---

## 🎯 PASO 2: ESTADOS (5 min)

**Agregar después de los estados existentes:**

```typescript
// 🆕 V3.1: Sistema multi-captura
const [showMultiCapture, setShowMultiCapture] = useState(false)
const [capturedImages, setCapturedImages] = useState<CapturesType | null>(null)

// 🆕 V3.1: Modales
const [showShareModal, setShowShareModal] = useState(false)
const [showEmailModal, setShowEmailModal] = useState(false)
```

---

## 📸 PASO 3: CAPTURA MULTI-ÁNGULO (15 min)

**Buscar la sección de captura de foto y reemplazar:**

### **ANTES:**
```typescript
<button onClick={handleStartCamera}>
  📸 Activar Cámara
</button>
{cameraActive && <video ref={videoRef} />}
<button onClick={handleCapturePhoto}>
  📸 Capturar Foto
</button>
```

### **DESPUÉS:**
```typescript
{/* 🆕 V3.1: Botón para iniciar captura multi-ángulo */}
{!capturedImages && (
  <button
    onClick={() => setShowMultiCapture(true)}
    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-6 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-2"
  >
    <Camera className="w-6 h-6" />
    📸 INICIAR CAPTURA 4 ÁNGULOS
  </button>
)}

{/* Preview de capturas */}
{capturedImages && (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <div className="text-sm font-semibold mb-2">Frontal</div>
      <img src={capturedImages.frontal!} alt="Frontal" className="w-full rounded-xl" />
    </div>
    <div>
      <div className="text-sm font-semibold mb-2">Lateral Derecho</div>
      <img src={capturedImages.lateral_right!} alt="Lateral D" className="w-full rounded-xl" />
    </div>
    <div>
      <div className="text-sm font-semibold mb-2">Lateral Izquierdo</div>
      <img src={capturedImages.lateral_left!} alt="Lateral I" className="w-full rounded-xl" />
    </div>
    <div>
      <div className="text-sm font-semibold mb-2">Cenital</div>
      <img src={capturedImages.cenital!} alt="Cenital" className="w-full rounded-xl" />
    </div>
  </div>
)}

{/* Botón retomar */}
{capturedImages && (
  <button
    onClick={() => setCapturedImages(null)}
    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-all"
  >
    🔄 Retomar Fotos
  </button>
)}

{/* 🆕 V3.1: Modal de captura multi-ángulo */}
{showMultiCapture && (
  <MultiAngleCaptureUI
    onComplete={(captures) => {
      setCapturedImages(captures)
      setShowMultiCapture(false)
    }}
    onCancel={() => setShowMultiCapture(false)}
  />
)}
```

---

## 🎨 PASO 4: SIMULACIÓN VOLUMÉTRICA (20 min)

**Buscar la función `handleCompleteDiagnosis` y modificar la generación de visualizaciones:**

### **ENCONTRAR:**
```typescript
const visuals = await imageProcessor.generateVisualAnalysis(
  capturedImage,
  {
    laxityScore: mayaVisionResult.connell_analysis.facial_laxity_score,
    skinQuality: mayaVisionResult.obagi_analysis.skin_quality_score,
    symmetryScore: mayaVisionResult.symmetry_analysis.golden_ratio_score,
    age: patientAge
  }
)
```

### **REEMPLAZAR POR:**
```typescript
// 🆕 V3.1: Calcular cambios volumétricos necesarios
const volumetricChanges = calculateVolumetricChanges({
  age: patientAge,
  laxityScore: mayaVisionResult.connell_analysis.facial_laxity_score,
  skinQuality: mayaVisionResult.obagi_analysis.skin_quality_score,
  gender: patientGender
})

console.log('📊 Cambios volumétricos calculados:', volumetricChanges)

// Generar visualizaciones estándar
const visuals = await imageProcessor.generateVisualAnalysis(
  capturedImages?.frontal || capturedImage,  // Usar foto frontal
  {
    laxityScore: mayaVisionResult.connell_analysis.facial_laxity_score,
    skinQuality: mayaVisionResult.obagi_analysis.skin_quality_score,
    symmetryScore: mayaVisionResult.symmetry_analysis.golden_ratio_score,
    age: patientAge
  }
)

// 🆕 V3.1: Aplicar simulación volumétrica REAL
console.log('🎨 Aplicando simulación volumétrica...')
const volumetricSimulation = await applyVolumetricSimulation(
  capturedImages?.frontal || capturedImage,
  volumetricChanges
)

// Reemplazar la simulación "después" con la volumétrica
visuals.afterSimulation = volumetricSimulation

console.log('✅ Simulación volumétrica aplicada')
```

---

## 📱 PASO 5: MODALES COMPARTIR/EMAIL (10 min)

**Buscar los botones de compartir y email:**

### **ENCONTRAR:**
```typescript
<button 
  onClick={handleShare}
  className="..."
>
  📱 Compartir
</button>
<button 
  onClick={handleSendEmail}
  className="..."
>
  📧 Enviar por Email
</button>
```

### **REEMPLAZAR POR:**
```typescript
{/* 🆕 V3.1: Botón con modal de redes sociales */}
<button 
  onClick={() => setShowShareModal(true)}
  disabled={!result}
  className="flex-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-400 py-4 rounded-xl font-bold transition-all"
>
  📱 Compartir
</button>

{/* 🆕 V3.1: Botón con modal de email */}
<button 
  onClick={() => setShowEmailModal(true)}
  disabled={!result}
  className="flex-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-400 py-4 rounded-xl font-bold transition-all"
>
  📧 Enviar por Email
</button>
```

**AL FINAL DEL COMPONENTE (antes del último `</div>`):**

```typescript
{/* 🆕 V3.1: Modales */}
{showShareModal && result && (
  <SocialShareModal
    patientName={patientName}
    patientId={patientId}
    biologicalAge={result.biologicalAge}
    chronologicalAge={result.chronologicalAge}
    symmetryScore={result.symmetryScore}
    onClose={() => setShowShareModal(false)}
  />
)}

{showEmailModal && result && (
  <EmailSendModal
    patientName={patientName}
    patientId={patientId}
    biologicalAge={result.biologicalAge}
    chronologicalAge={result.chronologicalAge}
    symmetryScore={result.symmetryScore}
    skinQuality={result.skinQuality}
    laxityScore={result.laxityScore}
    onClose={() => setShowEmailModal(false)}
  />
)}
```

---

## ✅ PASO 6: VALIDACIÓN (10 min)

### **VERIFICAR QUE NO HAYA ERRORES:**

```bash
# Limpiar caché
rmdir /s /q .next

# Reiniciar servidor
npm run dev
```

### **ABRIR:**
```
http://localhost:3000/maya-bio-mirror
```

### **PROBAR:**
1. ✅ Botón "INICIAR CAPTURA 4 ÁNGULOS" aparece
2. ✅ Modal se abre con instrucciones
3. ✅ Captura 4 fotos secuencialmente
4. ✅ Preview muestra las 4 fotos
5. ✅ Diagnóstico se completa
6. ✅ Simulación "después" muestra cambios volumétricos
7. ✅ Botón "Compartir" abre modal con redes sociales
8. ✅ Botón "Email" abre modal con inputs
9. ✅ Ratios por género son correctos

---

## 🐛 TROUBLESHOOTING:

### **ERROR: "Cannot find module"**
**SOLUCIÓN:**
```bash
npm install
rmdir /s /q .next
npm run dev
```

### **ERROR: "capturedImages is null"**
**SOLUCIÓN:** Agregar validación:
```typescript
if (!capturedImages && !capturedImage) {
  alert('Por favor captura las fotos primero')
  return
}
```

### **ERROR: Modales no aparecen**
**SOLUCIÓN:** Verificar que `z-index: 50` en los modales y que estén después de todo el contenido.

### **Simulación "después" sin cambios**
**SOLUCIÓN:** Verificar en consola (F12) que `applyVolumetricSimulation` se ejecutó. Debería aparecer:
```
📊 Cambios volumétricos calculados: {...}
🎨 Aplicando simulación volumétrica...
✅ Simulación volumétrica aplicada
```

---

## 🎉 RESULTADO ESPERADO:

### **CAPTURA:**
- Usuario hace click → Modal se abre
- Captura frontal con guías → ✓ Capturada
- Gira a perfil derecho → ✓ Capturada
- Gira a perfil izquierdo → ✓ Capturada
- Inclina cabeza atrás (cenital) → ✓ Capturada
- **Total: 4 fotos en ~2 minutos**

### **SIMULACIÓN:**
- Surcos nasolabiales **reducidos visiblemente**
- Ojeras **aclaradas**
- Pómulos **con volumen**
- Mandíbula **definida**
- Cuello **más limpio**

### **COMPARTIR:**
- Click "Compartir" → Modal con 8 opciones
- Click WhatsApp → Se abre con texto pre-cargado
- Click Instagram → Instrucciones + texto copiado
- Click Copiar → Texto en clipboard

### **EMAIL:**
- Click "Email" → Modal con inputs
- Completa destinatario → Click "Enviar"
- Se abre Outlook/Gmail con email pre-escrito
- Usuario adjunta PDF y envía

---

## ⏰ TIEMPO TOTAL ESTIMADO:

```
Paso 1 (Importaciones):         5 min
Paso 2 (Estados):                5 min
Paso 3 (Captura multi):         15 min
Paso 4 (Simulación volumétrica): 20 min
Paso 5 (Modales):               10 min
Paso 6 (Validación):            10 min
Ajustes/Debug:                  15 min
---
TOTAL:                          80 min (~1.5 horas)
```

---

## 💬 SI ALGO SALE MAL:

**Opción 1:** Revisar consola (F12) para ver errores
**Opción 2:** Comparar con esta guía paso a paso
**Opción 3:** Preguntar al asistente con el error específico

---

## 🚀 SIGUIENTE NIVEL (Opcional):

Una vez funcione todo:
- [ ] Agregar análisis 3D real con TensorFlow.js
- [ ] Integrar Face Landmarks para mediciones precisas
- [ ] Mejora de simulación con morphing avanzado
- [ ] Exportar video 360° giratorio

---

**¡VAMOS, PARCERO! EN 1.5 HORAS TENDRÁS EL SISTEMA PERFECTO** 🚀✨💎
