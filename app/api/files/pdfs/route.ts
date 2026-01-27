import { NextRequest, NextResponse } from 'next/server'
import { findPDFFiles } from '@/lib/knowledge/file-locator'

export async function GET(request: NextRequest) {
  try {
    const files = await findPDFFiles()
    return NextResponse.json({
      success: true,
      files,
      count: files.length,
    })
  } catch (error) {
    console.error('Error buscando PDFs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error buscando archivos PDF',
      },
      { status: 500 }
    )
  }
}
