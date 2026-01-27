/**
 * Motor de Búsqueda Inteligente para la Biblioteca
 */

import { COMPREHENSIVE_KNOWLEDGE_BASE } from '../maya-brain/comprehensive-knowledge'

export interface SearchResult {
  bookName: string
  category: string[]
  matchScore: number
  matchedConcepts: string[]
  recommendations: Array<{
    condition: string
    intervention: string
  }>
}

/**
 * Busca en toda la biblioteca usando búsqueda semántica
 */
export function searchLibrary(query: string, categories?: string[]): SearchResult[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)

  const results: SearchResult[] = COMPREHENSIVE_KNOWLEDGE_BASE
    .filter(knowledge => {
      // Filtrar por categoría si se especifica
      if (categories && categories.length > 0) {
        return categories.some(cat => knowledge.category.includes(cat))
      }
      return true
    })
    .map(knowledge => {
      let score = 0
      const matchedConcepts: string[] = []

      // Buscar en nombre del libro
      if (knowledge.bookName.toLowerCase().includes(queryLower)) {
        score += 10
      }

      // Buscar en conceptos clave
      knowledge.keyConcepts.forEach(concept => {
        const conceptLower = concept.toLowerCase()
        queryWords.forEach(word => {
          if (conceptLower.includes(word)) {
            score += 5
            if (!matchedConcepts.includes(concept)) {
              matchedConcepts.push(concept)
            }
          }
        })
      })

      // Buscar en recomendaciones
      knowledge.specificRecommendations.forEach(rec => {
        const recText = `${rec.condition} ${rec.intervention}`.toLowerCase()
        queryWords.forEach(word => {
          if (recText.includes(word)) {
            score += 3
          }
        })
      })

      // Buscar en categorías
      knowledge.category.forEach(cat => {
        if (queryLower.includes(cat.toLowerCase())) {
          score += 2
        }
      })

      return {
        bookName: knowledge.bookName,
        category: knowledge.category,
        matchScore: score,
        matchedConcepts,
        recommendations: knowledge.specificRecommendations
          .filter(rec => {
            const recText = `${rec.condition} ${rec.intervention}`.toLowerCase()
            return queryWords.some(word => recText.includes(word))
          })
          .map(rec => ({
            condition: rec.condition,
            intervention: rec.intervention,
          })),
      }
    })
    .filter(result => result.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)

  return results
}

/**
 * Busca recomendaciones específicas por condición
 */
export function searchRecommendationsByCondition(condition: string): SearchResult[] {
  return searchLibrary(condition, [])
}

/**
 * Busca por categoría
 */
export function searchByCategory(category: string): SearchResult[] {
  return COMPREHENSIVE_KNOWLEDGE_BASE
    .filter(knowledge => knowledge.category.includes(category))
    .map(knowledge => ({
      bookName: knowledge.bookName,
      category: knowledge.category,
      matchScore: 10,
      matchedConcepts: knowledge.keyConcepts,
      recommendations: knowledge.specificRecommendations.map(rec => ({
        condition: rec.condition,
        intervention: rec.intervention,
      })),
    }))
}
