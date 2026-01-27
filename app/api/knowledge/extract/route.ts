import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/google/drive-client'
import { google } from 'googleapis'

/**
 * API Route para extraer conocimiento de PDFs desde Google Drive
 * POST /api/knowledge/extract
 */
export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'fileId es requerido' },
        { status: 400 }
      )
    }
    
    // Obtener metadata del archivo desde Google Drive
    try {
      const drive = await getDriveClient()
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, size, modifiedTime, mimeType'
      })
      
      const file = response.data
      const fileName = file.name || 'Sin nombre'
      
      const knowledge = {
        bookTitle: fileName,
        category: detectCategory(fileName),
        concepts: extractConcepts(fileName),
        protocols: [],
        dosages: [],
        contraindications: [],
        evidence_level: 'B' as const,
        fileSize: parseInt(file.size || '0'),
        lastModified: file.modifiedTime
      }
      
      return NextResponse.json(knowledge)
    } catch (error: any) {
      console.error('Error buscando archivo en Google Drive:', error)
      return NextResponse.json(
        { error: 'Archivo no encontrado en Google Drive', fileId: fileId },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('Error extrayendo conocimiento:', error)
    return NextResponse.json(
      { error: 'Error procesando archivo' },
      { status: 500 }
    )
  }
}

function detectCategory(fileName: string): string {
  const lower = fileName.toLowerCase()
  
  if (lower.includes('obagi') || lower.includes('skin')) return 'dermatología'
  if (lower.includes('connell') || lower.includes('facial')) return 'cirugía_facial'
  if (lower.includes('garcia') || lower.includes('body')) return 'cirugía_corporal'
  if (lower.includes('yu') || lower.includes('nutrition')) return 'nutrigenómica'
  if (lower.includes('ogawa') || lower.includes('scar')) return 'cicatrización'
  
  return 'general'
}

function extractConcepts(fileName: string): string[] {
  const concepts: string[] = []
  const lower = fileName.toLowerCase()
  
  if (lower.includes('skin')) concepts.push('salud_dermal')
  if (lower.includes('aging')) concepts.push('envejecimiento')
  if (lower.includes('surgery')) concepts.push('técnica_quirúrgica')
  if (lower.includes('nutrition')) concepts.push('nutrición')
  
  return concepts
}
