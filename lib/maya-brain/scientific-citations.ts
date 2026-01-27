/**
 * MAYA BRAIN - CITADOR CIENTÍFICO
 * Consulta la biblioteca de Google Drive y cita tratados de Obagi, Park, Connell, etc.
 */

import { GOOGLE_DRIVE_LIBRARY_ID } from '@/lib/knowledge/book-paths'

export interface ScientificCitation {
  author: string
  title: string
  reference: string
  relevance: string
  driveLink?: string
}

/**
 * Genera citas científicas basadas en el diagnóstico
 */
export async function generateScientificCitations(
  diagnosis: string,
  skinType: string,
  ethnicity: string
): Promise<ScientificCitation[]> {
  const citations: ScientificCitation[] = []

  // OBAGI - Dermatología y rejuvenecimiento
  if (diagnosis.includes('pigmentación') || diagnosis.includes('skin quality') || skinType.includes('damaged')) {
    citations.push({
      author: 'Zein E. Obagi, MD',
      title: 'The Art of Skin Health Restoration and Rejuvenation',
      reference: 'Obagi Skin Health Protocol - Chapter 4: Pigmentation Control',
      relevance: 'El Dr. Obagi establece que la restauración de la salud cutánea requiere control de melanocitos antes de cualquier procedimiento invasivo.',
      driveLink: await fetchDriveLink('Obagi')
    })
  }

  // PARK - Cirugía ósea facial (para asiáticos y latinos con necesidad de contorno)
  if (ethnicity === 'asian' || diagnosis.includes('mandibular') || diagnosis.includes('facial bone')) {
    citations.push({
      author: 'Dr. Suh-Goo Park, MD, PhD',
      title: 'Facial Bone Contouring Surgery',
      reference: 'Park\'s Principles of Mandibular Contouring - Asian Aesthetic Standards',
      relevance: 'El Dr. Park documenta que el contorno óseo debe preceder a procedimientos de tejidos blandos para resultados armónicos en pacientes asiáticos.',
      driveLink: await fetchDriveLink('Park')
    })
  }

  // CONNELL - Lifting facial
  if (diagnosis.includes('flacidez') || diagnosis.includes('sagging') || diagnosis.includes('SMAS')) {
    citations.push({
      author: 'Bruce Connell, MD',
      title: 'Aesthetic Rejuvenation of the Face and Neck',
      reference: 'Connell\'s SMAS Technique - Chapter 7: Vector Analysis',
      relevance: 'Connell demuestra que el análisis vectorial del envejecimiento facial es esencial para determinar el tipo de lifting requerido.',
      driveLink: await fetchDriveLink('Connell')
    })
  }

  return citations
}

/**
 * Consulta el link de Google Drive de un libro específico
 */
async function fetchDriveLink(author: string): Promise<string | undefined> {
  try {
    const response = await fetch(`/api/drive/books?folderId=${GOOGLE_DRIVE_LIBRARY_ID}&bookId=${author}`)
    const data = await response.json()
    
    if (data && data.webViewLink) {
      return data.webViewLink
    }
    
    return undefined
  } catch (error) {
    console.error(`Error buscando libro de ${author}:`, error)
    return undefined
  }
}

/**
 * Formatea las citas para mostrar en el diagnóstico
 */
export function formatCitationsForReport(citations: ScientificCitation[]): string {
  if (citations.length === 0) return ''

  let report = '\n\n📚 REFERENCIAS CIENTÍFICAS:\n\n'
  
  citations.forEach((citation, index) => {
    report += `${index + 1}. ${citation.author} - "${citation.title}"\n`
    report += `   ${citation.reference}\n`
    report += `   💡 ${citation.relevance}\n`
    if (citation.driveLink) {
      report += `   🔗 Consultar: ${citation.driveLink}\n`
    }
    report += '\n'
  })

  return report
}
