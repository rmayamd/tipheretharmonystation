/**
 * Generador de Reportes para Maya Harmony Station
 */

export interface ReportData {
  patientName: string
  date: string
  analysis: {
    inBody?: any
    quantum?: any
    aesthetic?: any
  }
  recommendations: any[]
  protocol?: any
  order?: any
}

/**
 * Genera reporte en formato texto
 */
export function generateTextReport(data: ReportData): string {
  let report = `
═══════════════════════════════════════════════════════════
    MAYA HARMONY STATION - REPORTE DE ANÁLISIS
═══════════════════════════════════════════════════════════

Paciente: ${data.patientName}
Fecha: ${data.date}
Generado por: Cerebro Maya - Sistema de Síntesis Cruzada

───────────────────────────────────────────────────────────
ANÁLISIS
───────────────────────────────────────────────────────────

`

  if (data.analysis.inBody) {
    report += `INBODY H30:
- Masa Muscular: ${data.analysis.inBody.muscleMass || 'N/A'} kg
- Grasa Corporal: ${data.analysis.inBody.bodyFat || 'N/A'}%
- Phase Angle: ${data.analysis.inBody.phaseAngle || 'N/A'}
- Agua Extracelular: ${data.analysis.inBody.extracellularWater || 'N/A'}

`
  }

  if (data.analysis.quantum) {
    report += `ANÁLISIS BIO-CUÁNTICO:
- Síntesis de Colágeno: ${data.analysis.quantum.collagenSynthesis || 'N/A'}%
- Inflamación NFkB: ${data.analysis.quantum.nfkbInflammation || 'N/A'}%

`
  }

  if (data.analysis.aesthetic) {
    report += `ANÁLISIS BIO-ESTÉTICO:
- Calidad de Piel: ${data.analysis.aesthetic.skinQuality || 'N/A'}%
- Elasticidad: ${data.analysis.aesthetic.tissueMechanics?.expectedYield || 'N/A'}%

`
  }

  if (data.recommendations && data.recommendations.length > 0) {
    report += `───────────────────────────────────────────────────────────
RECOMENDACIONES - SÍNTESIS CRUZADA
───────────────────────────────────────────────────────────

`
    data.recommendations.forEach((rec, idx) => {
      report += `${idx + 1}. ${rec.condition || 'Recomendación'}
   Intervención: ${rec.intervention || 'N/A'}
   ${rec.dosage ? `Dosificación: ${rec.dosage}` : ''}
   ${rec.protocol ? `Protocolo: ${rec.protocol}` : ''}
   Fuentes: ${rec.sources?.join(', ') || 'N/A'}

`
    })
  }

  if (data.protocol) {
    report += `───────────────────────────────────────────────────────────
PROTOCOLO EPIGENÉTICO
───────────────────────────────────────────────────────────

Nombre: ${data.protocol.protocolName || 'N/A'}
Duración: ${data.protocol.duration || 'N/A'} días

ALIMENTOS RECOMENDADOS:
${data.protocol.nutritionPlan?.foods?.map((f: string) => `- ${f}`).join('\n') || 'N/A'}

SUPLEMENTOS:
${data.protocol.nutritionPlan?.supplements?.map((s: any) => 
  `- ${s.name}: ${s.dosage} (${s.timing}) - Fuentes: ${s.sources?.join(', ')}`
).join('\n') || 'N/A'}

`
  }

  if (data.order) {
    report += `───────────────────────────────────────────────────────────
ORDEN INTERDROGAS
───────────────────────────────────────────────────────────

`
    data.order.items?.forEach((item: any, idx: number) => {
      report += `${idx + 1}. ${item.name}
   Cantidad: ${item.quantity}
   Precio: $${item.unitPrice?.toLocaleString() || '0'}
   Subtotal: $${(item.unitPrice * item.quantity)?.toLocaleString() || '0'}

`
    })
    report += `TOTAL: $${data.order.totalAmount?.toLocaleString() || '0'} COP

`
  }

  report += `───────────────────────────────────────────────────────────
NOTAS
───────────────────────────────────────────────────────────

Este reporte fue generado por el Cerebro Maya utilizando síntesis
cruzada de múltiples tratados médicos. Todas las recomendaciones
están basadas en evidencia científica integrada.

═══════════════════════════════════════════════════════════
`

  return report
}

/**
 * Genera reporte en formato JSON
 */
export function generateJSONReport(data: ReportData): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Descarga reporte como archivo
 */
export function downloadReport(report: string, filename: string, type: 'text' | 'json' = 'text') {
  const blob = new Blob([report], {
    type: type === 'json' ? 'application/json' : 'text/plain',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
