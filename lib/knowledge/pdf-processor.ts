/**
 * Procesador de PDFs para extraer conocimiento técnico
 * Integra información de los libros médicos en el sistema
 */

export interface BookKnowledge {
  bookName: string
  author: string
  topics: string[]
  extractedConcepts: {
    [key: string]: string[]
  }
}

/**
 * Procesa un PDF y extrae conceptos clave
 * En producción, esto usaría una librería como pdf-parse o similar
 * 
 * Rutas soportadas:
 * - docs/books/ (dentro del proyecto)
 * - Desktop/ (escritorio del usuario)
 * - Cualquier ruta absoluta
 */
export async function processPDF(filePath: string): Promise<BookKnowledge> {
  // En producción, esto procesaría el PDF real
  // Por ahora, retorna estructura base
  
  // Normalizar rutas (Windows/Unix)
  const normalizedPath = filePath.replace(/\\/g, '/')
  const fileName = normalizedPath.split('/').pop() || ''
  
  // Mapeo de libros conocidos
  const bookMap: { [key: string]: BookKnowledge } = {
    'obagi': {
      bookName: 'Obagi Skin Health',
      author: 'Dr. Zein Obagi',
      topics: ['skin_quality', 'pigmentation', 'hydration', 'elasticity'],
      extractedConcepts: {
        skin_quality: [
          'Evaluación de calidad de piel según tipo Obagi',
          'Protocolos de preparación pre-quirúrgica',
          'Manejo de pigmentación',
        ],
      },
    },
    'connell': {
      bookName: 'Connell Deep Plane',
      author: 'Dr. Connell',
      topics: ['laxity', 'deep_plane', 'facial_analysis'],
      extractedConcepts: {
        laxity: [
          'Grados de laxitud según Connell',
          'Técnicas de Deep Plane',
          'Análisis de mecánica facial',
        ],
      },
    },
    'triana': {
      bookName: 'Estética Íntima',
      author: 'Dr. Triana',
      topics: ['intimate_aesthetics', 'body_symmetry'],
      extractedConcepts: {
        intimate_aesthetics: [
          'Principios de estética íntima',
          'Simetría corporal',
        ],
      },
    },
    'garcia_jr': {
      bookName: 'VASER Techniques',
      author: 'Dr. Garcia Jr',
      topics: ['vaser', 'body_contouring', 'fat_removal'],
      extractedConcepts: {
        vaser: [
          'Técnicas VASER para contorno corporal',
          'Simulación de resultados',
        ],
      },
    },
    'ogawa': {
      bookName: 'Keloid Prevention',
      author: 'Dr. Ogawa',
      topics: ['tension', 'keloid_prevention', 'scar_management'],
      extractedConcepts: {
        tension: [
          'Análisis de tensión mecánica',
          'Protocolo de Tensión Zero',
          'Prevención de queloides',
        ],
      },
    },
    'yu_epigenetics': {
      bookName: 'Epigenetics and Longevity',
      author: 'Byung Pal Yu',
      topics: ['epigenetics', 'longevity', 'nutrition', 'aging'],
      extractedConcepts: {
        epigenetics: [
          'Silenciamiento de genes de envejecimiento',
          'Protocolos nutricionales epigenéticos',
          'Activación de vías de longevidad',
        ],
      },
    },
  }

  // Detectar libro por nombre de archivo
  const bookKey = Object.keys(bookMap).find(key => 
    fileName.toLowerCase().includes(key)
  )

  return bookKey 
    ? bookMap[bookKey]
    : {
        bookName: fileName,
        author: 'Unknown',
        topics: [],
        extractedConcepts: {},
      }
}

/**
 * Extrae conceptos específicos de un libro para usar en análisis
 */
export function getConceptsForTopic(
  bookKnowledge: BookKnowledge[],
  topic: string
): string[] {
  const concepts: string[] = []
  
  bookKnowledge.forEach(book => {
    if (book.topics.includes(topic) && book.extractedConcepts[topic]) {
      concepts.push(...book.extractedConcepts[topic])
    }
  })
  
  return concepts
}
