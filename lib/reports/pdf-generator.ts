/**
 * Tipheret Harmony Station - Sistema de Reportes PDF
 * Copyright (c) 2026. Todos los derechos reservados.
 * 
 * REQUIERE INSTALACIÓN:
 * npm install jspdf jspdf-autotable
 */

// @ts-ignore - Se instalará en producción
import jsPDF from 'jspdf'
// @ts-ignore
import autoTable from 'jspdf-autotable'

export interface PatientInfo {
  id: string
  name: string
  age: number
  gender: 'M' | 'F'
  ethnicity: string
  email?: string
  phone?: string
  date: string
}

export interface DiagnosisData {
  facial_analysis?: {
    golden_ratio_score: number
    symmetry_score: number
    laxity_score: number
    skin_quality_score: number
    recommended_procedures: string[]
  }
  body_analysis?: {
    golden_ratio_score: number
    measurements: Record<string, number>
    implant_recommendations?: any[]
    abdominoplasty?: any
  }
  ice_analysis?: {
    I: number
    C: number
    E: number
    compatibility_score: number
    is_natural_result: boolean
  }
  photos?: {
    before: string // base64
    after?: string // base64
    analysis?: string // base64
  }
}

export class PDFReportGenerator {
  private doc: typeof jsPDF
  private yPosition: number = 20
  private pageWidth: number = 210 // A4 width in mm
  private pageHeight: number = 297 // A4 height in mm
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
  }

  /**
   * Generar reporte completo
   */
  async generateCompleteReport(
    patientInfo: PatientInfo,
    diagnosisData: DiagnosisData
  ): Promise<Blob> {
    // Página 1: Portada
    this.addCoverPage(patientInfo)

    // Página 2: Análisis Facial
    if (diagnosisData.facial_analysis) {
      this.doc.addPage()
      this.yPosition = 20
      this.addFacialAnalysis(diagnosisData.facial_analysis, diagnosisData.photos)
    }

    // Página 3: Análisis Corporal
    if (diagnosisData.body_analysis) {
      this.doc.addPage()
      this.yPosition = 20
      this.addBodyAnalysis(diagnosisData.body_analysis)
    }

    // Página 4: Análisis ICE (si hay implantes)
    if (diagnosisData.ice_analysis) {
      this.doc.addPage()
      this.yPosition = 20
      this.addICEAnalysis(diagnosisData.ice_analysis)
    }

    // Página 5: Fotos Antes/Después
    if (diagnosisData.photos) {
      this.doc.addPage()
      this.yPosition = 20
      this.addPhotosPage(diagnosisData.photos)
    }

    // Página 6: Plan de Tratamiento
    this.doc.addPage()
    this.yPosition = 20
    this.addTreatmentPlan(diagnosisData)

    // Página Final: Consentimiento y Firma
    this.doc.addPage()
    this.yPosition = 20
    this.addConsentPage(patientInfo)

    // Generar PDF como Blob
    return this.doc.output('blob')
  }

  /**
   * PORTADA
   */
  private addCoverPage(patient: PatientInfo): void {
    // Logo y título
    this.doc.setFontSize(32)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(88, 28, 135) // Purple
    this.doc.text('TIPHERET HARMONY STATION', this.pageWidth / 2, 40, { align: 'center' })

    this.doc.setFontSize(16)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('Reporte de Análisis Estético Integral', this.pageWidth / 2, 50, { align: 'center' })

    // Línea decorativa
    this.doc.setDrawColor(147, 51, 234) // Purple
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, 60, this.pageWidth - this.margin, 60)

    // Información del paciente
    this.yPosition = 80
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(0, 0, 0)
    this.doc.text('INFORMACIÓN DEL PACIENTE', this.margin, this.yPosition)

    this.yPosition += 10
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Nombre: ${patient.name}`, this.margin + 5, this.yPosition)
    this.yPosition += 7
    this.doc.text(`ID: ${patient.id}`, this.margin + 5, this.yPosition)
    this.yPosition += 7
    this.doc.text(`Edad: ${patient.age} años`, this.margin + 5, this.yPosition)
    this.yPosition += 7
    this.doc.text(`Género: ${patient.gender === 'M' ? 'Masculino' : 'Femenino'}`, this.margin + 5, this.yPosition)
    this.yPosition += 7
    this.doc.text(`Etnia: ${patient.ethnicity}`, this.margin + 5, this.yPosition)
    this.yPosition += 7
    this.doc.text(`Fecha: ${new Date(patient.date).toLocaleDateString('es-ES')}`, this.margin + 5, this.yPosition)

    if (patient.email) {
      this.yPosition += 7
      this.doc.text(`Email: ${patient.email}`, this.margin + 5, this.yPosition)
    }

    if (patient.phone) {
      this.yPosition += 7
      this.doc.text(`Teléfono: ${patient.phone}`, this.margin + 5, this.yPosition)
    }

    // Disclaimer
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    const disclaimer = 'Este reporte es confidencial y está destinado exclusivamente al paciente mencionado. ' +
      'Los resultados son orientativos y deben ser evaluados por un profesional médico certificado.'
    const disclaimerLines = this.doc.splitTextToSize(disclaimer, this.pageWidth - 2 * this.margin)
    this.doc.text(disclaimerLines, this.margin, this.pageHeight - 30)

    // Footer
    this.addFooter()
  }

  /**
   * ANÁLISIS FACIAL
   */
  private addFacialAnalysis(analysis: any, photos?: any): void {
    this.addSectionTitle('ANÁLISIS FACIAL')

    // Scores principales
    this.yPosition += 5
    const scores = [
      ['Golden Ratio', `${analysis.golden_ratio_score}/100`, this.getScoreColor(analysis.golden_ratio_score)],
      ['Simetría', `${analysis.symmetry_score}/100`, this.getScoreColor(analysis.symmetry_score)],
      ['Laxitud', `${analysis.laxity_score}/100`, this.getScoreColor(100 - analysis.laxity_score)],
      ['Calidad de Piel', `${analysis.skin_quality_score}/100`, this.getScoreColor(analysis.skin_quality_score)]
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Parámetro', 'Puntuación', 'Estado']],
      body: scores,
      theme: 'grid',
      headStyles: { fillColor: [88, 28, 135], textColor: [255, 255, 255] },
      margin: { left: this.margin, right: this.margin }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    // Procedimientos recomendados
    if (analysis.recommended_procedures && analysis.recommended_procedures.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Procedimientos Recomendados:', this.margin, this.yPosition)

      this.yPosition += 7
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(10)

      analysis.recommended_procedures.forEach((proc: string, idx: number) => {
        if (this.yPosition > this.pageHeight - 30) {
          this.doc.addPage()
          this.yPosition = 20
        }
        this.doc.text(`${idx + 1}. ${proc}`, this.margin + 5, this.yPosition)
        this.yPosition += 6
      })
    }

    this.addFooter()
  }

  /**
   * ANÁLISIS CORPORAL
   */
  private addBodyAnalysis(analysis: any): void {
    this.addSectionTitle('ANÁLISIS CORPORAL')

    // Score general
    this.yPosition += 5
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(88, 28, 135)
    this.doc.text(`${analysis.golden_ratio_score}/100`, this.pageWidth / 2, this.yPosition, { align: 'center' })

    this.yPosition += 7
    this.doc.setFontSize(12)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('Golden Ratio Score Corporal', this.pageWidth / 2, this.yPosition, { align: 'center' })

    // Mediciones
    if (analysis.measurements) {
      this.yPosition += 15
      const measurements = Object.entries(analysis.measurements).map(([key, value]) => [
        key.replace(/_/g, ' ').toUpperCase(),
        `${value} cm`
      ])

      autoTable(this.doc, {
        startY: this.yPosition,
        head: [['Medición', 'Valor']],
        body: measurements,
        theme: 'striped',
        headStyles: { fillColor: [88, 28, 135] },
        margin: { left: this.margin, right: this.margin }
      })

      this.yPosition = (this.doc as any).lastAutoTable.finalY + 10
    }

    this.addFooter()
  }

  /**
   * ANÁLISIS ICE
   */
  private addICEAnalysis(ice: any): void {
    this.addSectionTitle('ANÁLISIS ICE PRINCIPLE')
    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('(Mallucci & Branford, 2016)', this.margin, this.yPosition)

    this.yPosition += 10

    // Fórmula ICE
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('I - C = E', this.pageWidth / 2, this.yPosition, { align: 'center' })

    this.yPosition += 10
    const iceData = [
      ['I (Implante)', `${ice.I} cc`],
      ['C (Capacidad)', `${ice.C} cc`],
      ['E (Exceso)', `${ice.E > 0 ? '+' : ''}${ice.E} cc`],
      ['Compatibilidad', `${ice.compatibility_score}/100`],
      ['Resultado Natural', ice.is_natural_result ? 'Sí ✓' : 'No']
    ]

    autoTable(this.doc, {
      startY: this.yPosition,
      body: iceData,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right' }
      },
      margin: { left: this.margin + 20 }
    })

    this.yPosition = (this.doc as any).lastAutoTable.finalY + 10

    this.addFooter()
  }

  /**
   * FOTOS
   */
  private addPhotosPage(photos: any): void {
    this.addSectionTitle('REGISTRO FOTOGRÁFICO')

    this.yPosition += 10

    if (photos.before) {
      this.doc.text('ANTES:', this.margin, this.yPosition)
      this.yPosition += 5
      try {
        this.doc.addImage(photos.before, 'JPEG', this.margin, this.yPosition, 80, 80)
      } catch (e) {
        this.doc.text('[Imagen no disponible]', this.margin, this.yPosition)
      }
    }

    if (photos.after) {
      this.doc.text('DESPUÉS (SIMULACIÓN):', this.pageWidth / 2 + 10, this.yPosition - 5)
      try {
        this.doc.addImage(photos.after, 'JPEG', this.pageWidth / 2 + 10, this.yPosition, 80, 80)
      } catch (e) {
        this.doc.text('[Imagen no disponible]', this.pageWidth / 2 + 10, this.yPosition)
      }
    }

    this.addFooter()
  }

  /**
   * PLAN DE TRATAMIENTO
   */
  private addTreatmentPlan(data: DiagnosisData): void {
    this.addSectionTitle('PLAN DE TRATAMIENTO RECOMENDADO')

    this.yPosition += 10
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    const plan = [
      'Este plan es orientativo y debe ser evaluado por un cirujano plástico certificado.',
      '',
      'Procedimientos sugeridos según análisis:'
    ]

    plan.forEach(line => {
      this.doc.text(line, this.margin, this.yPosition)
      this.yPosition += 6
    })

    // Agregar procedimientos recomendados
    if (data.facial_analysis?.recommended_procedures) {
      this.yPosition += 5
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Procedimientos Faciales:', this.margin, this.yPosition)
      this.yPosition += 6

      this.doc.setFont('helvetica', 'normal')
      data.facial_analysis.recommended_procedures.forEach((proc: string) => {
        this.doc.text(`• ${proc}`, this.margin + 5, this.yPosition)
        this.yPosition += 5
      })
    }

    this.addFooter()
  }

  /**
   * CONSENTIMIENTO
   */
  private addConsentPage(patient: PatientInfo): void {
    this.addSectionTitle('CONSENTIMIENTO INFORMADO')

    this.yPosition += 10
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')

    const consent = [
      `Yo, ${patient.name}, declaro que:`,
      '',
      '1. He recibido información completa sobre el análisis realizado.',
      '2. Entiendo que los resultados son orientativos y no constituyen diagnóstico médico.',
      '3. Cualquier procedimiento requiere evaluación presencial por especialista certificado.',
      '4. Autorizo el uso de mis fotografías para fines clínicos.',
      '',
      '',
      'Firma del Paciente: _______________________     Fecha: ______________',
      '',
      '',
      'Firma del Especialista: ____________________     Fecha: ______________'
    ]

    consent.forEach(line => {
      if (this.yPosition > this.pageHeight - 40) {
        this.doc.addPage()
        this.yPosition = 20
      }
      this.doc.text(line, this.margin, this.yPosition)
      this.yPosition += 6
    })

    this.addFooter()
  }

  /**
   * UTILIDADES
   */
  private addSectionTitle(title: string): void {
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(88, 28, 135)
    this.doc.text(title, this.margin, this.yPosition)
    this.yPosition += 3

    this.doc.setDrawColor(147, 51, 234)
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition)
    this.yPosition += 8

    this.doc.setTextColor(0, 0, 0)
  }

  private addFooter(): void {
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    this.doc.text(
      `Tipheret Harmony Station - Página ${this.doc.getNumberOfPages()}`,
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    )
  }

  private getScoreColor(score: number): string {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bueno'
    if (score >= 40) return 'Regular'
    return 'Bajo'
  }

  /**
   * Descargar PDF
   */
  downloadPDF(filename: string = 'reporte-maya.pdf'): void {
    this.doc.save(filename)
  }
}

/**
 * FUNCIÓN DE CONVENIENCIA
 */
export async function generatePatientReport(
  patient: PatientInfo,
  diagnosis: DiagnosisData,
  download: boolean = true
): Promise<Blob> {
  const generator = new PDFReportGenerator()
  const pdfBlob = await generator.generateCompleteReport(patient, diagnosis)

  if (download) {
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Reporte_${patient.name.replace(/\s/g, '_')}_${patient.date}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  return pdfBlob
}
