/**
 * SIMULADOR VISUAL DE ABDOMINOPLASTIA
 * Genera imágenes "antes" y "después" de tummy tuck
 * Similar al simulador facial pero para contorno abdominal
 */

export interface AbdomenPhoto {
  frontal: string // base64
  lateral?: string // base64
}

export interface TummyTuckSimulation {
  original: string
  simulated: string
  improvements: {
    waist_reduction_cm: number
    contour_smoothness: number
    skin_tightening: number
    muscle_repair: boolean
  }
  surgical_marks: {
    incision_line: { x: number; y: number }[]
    umbilicus_new_position?: { x: number; y: number }
    resection_area: { x: number; y: number }[]
  }
}

/**
 * Simular resultado de abdominoplastia en imagen
 */
export async function simulateAbdominoplasty(
  imageData: string,
  type: 'mini' | 'full' | 'extended' | 'circumferential' | 'fleur_de_lis',
  waist_reduction_cm: number,
  repair_diastasis: boolean
): Promise<TummyTuckSimulation> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve({
          original: imageData,
          simulated: imageData,
          improvements: {
            waist_reduction_cm: 0,
            contour_smoothness: 0,
            skin_tightening: 0,
            muscle_repair: false
          },
          surgical_marks: {
            incision_line: [],
            resection_area: []
          }
        })
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      
      // Dibujar imagen original
      ctx.drawImage(img, 0, 0)
      
      // Obtener datos de píxeles
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageDataObj.data
      
      // Detectar área abdominal (centro inferior de la imagen)
      const abdomen_top = Math.floor(canvas.height * 0.4)
      const abdomen_bottom = Math.floor(canvas.height * 0.85)
      const abdomen_left = Math.floor(canvas.width * 0.3)
      const abdomen_right = Math.floor(canvas.width * 0.7)
      
      // EFECTO 1: Reducir proyección abdominal (comprimir horizontalmente)
      const compression_factor = 1 - (waist_reduction_cm / 20) // max 20cm
      
      for (let y = abdomen_top; y < abdomen_bottom; y++) {
        // Efecto más pronunciado en el centro del abdomen
        const center_factor = 1 - Math.abs((y - (abdomen_top + abdomen_bottom) / 2) / ((abdomen_bottom - abdomen_top) / 2))
        const row_compression = 1 - (compression_factor * center_factor * 0.3)
        
        for (let x = abdomen_left; x < abdomen_right; x++) {
          const idx = (y * canvas.width + x) * 4
          
          // Calcular nueva posición x (comprimir hacia el centro)
          const center_x = (abdomen_left + abdomen_right) / 2
          const distance_from_center = x - center_x
          const new_x = Math.floor(center_x + (distance_from_center * row_compression))
          
          if (new_x >= abdomen_left && new_x < abdomen_right) {
            const source_idx = (y * canvas.width + new_x) * 4
            
            // Copiar píxel comprimido
            data[idx] = data[source_idx]
            data[idx + 1] = data[source_idx + 1]
            data[idx + 2] = data[source_idx + 2]
          }
        }
      }
      
      // EFECTO 2: Suavizar contorno (blur en bordes)
      for (let y = abdomen_top; y < abdomen_bottom; y++) {
        for (let x = abdomen_left + 5; x < abdomen_right - 5; x++) {
          // Solo en los bordes laterales
          if (x < abdomen_left + 20 || x > abdomen_right - 20) {
            const idx = (y * canvas.width + x) * 4
            
            // Promedio con píxeles vecinos (blur simple)
            let r = 0, g = 0, b = 0, count = 0
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                const ny = y + dy
                const nx = x + dx
                if (ny >= 0 && ny < canvas.height && nx >= 0 && nx < canvas.width) {
                  const nidx = (ny * canvas.width + nx) * 4
                  r += data[nidx]
                  g += data[nidx + 1]
                  b += data[nidx + 2]
                  count++
                }
              }
            }
            
            data[idx] = Math.floor(r / count)
            data[idx + 1] = Math.floor(g / count)
            data[idx + 2] = Math.floor(b / count)
          }
        }
      }
      
      // EFECTO 3: Tensar piel (aumentar contraste ligeramente)
      if (type === 'full' || type === 'extended') {
        for (let y = abdomen_top; y < abdomen_bottom; y++) {
          for (let x = abdomen_left; x < abdomen_right; x++) {
            const idx = (y * canvas.width + x) * 4
            
            // Aumentar contraste un 10%
            const contrast = 1.1
            data[idx] = Math.min(255, Math.max(0, (data[idx] - 128) * contrast + 128))
            data[idx + 1] = Math.min(255, Math.max(0, (data[idx + 1] - 128) * contrast + 128))
            data[idx + 2] = Math.min(255, Math.max(0, (data[idx + 2] - 128) * contrast + 128))
          }
        }
      }
      
      // EFECTO 4: Reparación de diástasis (aplanar línea media)
      if (repair_diastasis) {
        const center_x = (abdomen_left + abdomen_right) / 2
        const diastasis_width = 20 // píxeles
        
        for (let y = abdomen_top; y < abdomen_bottom; y++) {
          for (let x = center_x - diastasis_width / 2; x < center_x + diastasis_width / 2; x++) {
            const idx = (y * canvas.width + Math.floor(x)) * 4
            
            // Oscurecer ligeramente (efecto de "aplanamiento")
            data[idx] = Math.max(0, data[idx] * 0.95)
            data[idx + 1] = Math.max(0, data[idx + 1] * 0.95)
            data[idx + 2] = Math.max(0, data[idx + 2] * 0.95)
          }
        }
      }
      
      // Aplicar cambios
      ctx.putImageData(imageDataObj, 0, 0)
      
      // Dibujar marcas quirúrgicas (línea de incisión)
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      
      const incision_y = Math.floor(canvas.height * 0.82) // Línea suprapúbica
      const incision_line: { x: number; y: number }[] = []
      
      if (type === 'mini') {
        // Línea corta central
        ctx.beginPath()
        ctx.moveTo(abdomen_left + 40, incision_y)
        ctx.lineTo(abdomen_right - 40, incision_y)
        ctx.stroke()
        
        incision_line.push(
          { x: abdomen_left + 40, y: incision_y },
          { x: abdomen_right - 40, y: incision_y }
        )
      } else if (type === 'full') {
        // Línea larga de cadera a cadera
        ctx.beginPath()
        ctx.moveTo(abdomen_left, incision_y)
        ctx.lineTo(abdomen_right, incision_y)
        ctx.stroke()
        
        // Marca periareolar
        const umbilicus_y = Math.floor(canvas.height * 0.55)
        ctx.beginPath()
        ctx.arc(canvas.width / 2, umbilicus_y, 10, 0, 2 * Math.PI)
        ctx.stroke()
        
        incision_line.push(
          { x: abdomen_left, y: incision_y },
          { x: abdomen_right, y: incision_y }
        )
      } else if (type === 'extended' || type === 'circumferential') {
        // Línea extendida a flancos
        ctx.beginPath()
        ctx.moveTo(0, incision_y)
        ctx.lineTo(canvas.width, incision_y)
        ctx.stroke()
        
        incision_line.push(
          { x: 0, y: incision_y },
          { x: canvas.width, y: incision_y }
        )
      } else if (type === 'fleur_de_lis') {
        // Línea horizontal
        ctx.beginPath()
        ctx.moveTo(abdomen_left, incision_y)
        ctx.lineTo(abdomen_right, incision_y)
        ctx.stroke()
        
        // Línea vertical
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2, abdomen_top)
        ctx.lineTo(canvas.width / 2, incision_y)
        ctx.stroke()
        
        incision_line.push(
          { x: abdomen_left, y: incision_y },
          { x: abdomen_right, y: incision_y },
          { x: canvas.width / 2, y: abdomen_top },
          { x: canvas.width / 2, y: incision_y }
        )
      }
      
      ctx.setLineDash([]) // Reset dash
      
      // Agregar texto indicador
      ctx.font = '16px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 3
      
      const text = `Simulación: ${type.toUpperCase()}`
      const textWidth = ctx.measureText(text).width
      const textX = (canvas.width - textWidth) / 2
      const textY = 30
      
      ctx.strokeText(text, textX, textY)
      ctx.fillText(text, textX, textY)
      
      const simulated = canvas.toDataURL('image/jpeg', 0.92)
      
      resolve({
        original: imageData,
        simulated,
        improvements: {
          waist_reduction_cm,
          contour_smoothness: type === 'mini' ? 60 : type === 'full' ? 85 : 95,
          skin_tightening: type === 'mini' ? 50 : type === 'full' ? 80 : 90,
          muscle_repair: repair_diastasis
        },
        surgical_marks: {
          incision_line,
          umbilicus_new_position: type === 'full' || type === 'extended' 
            ? { x: canvas.width / 2, y: Math.floor(canvas.height * 0.55) }
            : undefined,
          resection_area: [
            { x: abdomen_left, y: incision_y },
            { x: abdomen_right, y: incision_y },
            { x: abdomen_right, y: abdomen_bottom },
            { x: abdomen_left, y: abdomen_bottom }
          ]
        }
      })
    }
    
    img.src = imageData
  })
}

/**
 * Generar visualización comparativa "Antes vs Después"
 */
export function generateBeforeAfterComparison(
  original: string,
  simulated: string,
  improvements: TummyTuckSimulation['improvements']
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return original
  
  const imgOriginal = new Image()
  const imgSimulated = new Image()
  
  return new Promise<string>((resolve) => {
    let loadedCount = 0
    
    const onLoad = () => {
      loadedCount++
      if (loadedCount === 2) {
        // Crear canvas con ambas imágenes lado a lado
        canvas.width = imgOriginal.width * 2 + 40
        canvas.height = imgOriginal.height + 100
        
        // Fondo
        ctx.fillStyle = '#f3f4f6'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // ANTES
        ctx.drawImage(imgOriginal, 20, 60)
        ctx.font = 'bold 24px Arial'
        ctx.fillStyle = '#1f2937'
        ctx.fillText('ANTES', 20, 40)
        
        // DESPUÉS
        ctx.drawImage(imgSimulated, imgOriginal.width + 40, 60)
        ctx.fillText('DESPUÉS', imgOriginal.width + 40, 40)
        
        // Stats debajo
        ctx.font = '16px Arial'
        ctx.fillStyle = '#059669'
        const stats = [
          `✓ Cintura: -${improvements.waist_reduction_cm}cm`,
          `✓ Contorno: ${improvements.contour_smoothness}%`,
          `✓ Tensión piel: ${improvements.skin_tightening}%`,
          improvements.muscle_repair ? '✓ Músculos reparados' : ''
        ].filter(Boolean)
        
        stats.forEach((stat, idx) => {
          ctx.fillText(stat, 20, imgOriginal.height + 80 + (idx * 25))
        })
        
        resolve(canvas.toDataURL('image/jpeg', 0.95))
      }
    }
    
    imgOriginal.onload = onLoad
    imgSimulated.onload = onLoad
    imgOriginal.src = original
    imgSimulated.src = simulated
  }) as any
}
