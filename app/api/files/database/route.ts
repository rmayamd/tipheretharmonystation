import { NextRequest, NextResponse } from 'next/server'
import { findDatabaseFiles } from '@/lib/knowledge/file-locator'

export async function GET(request: NextRequest) {
  try {
    const files = await findDatabaseFiles()
    return NextResponse.json({
      success: true,
      files,
      count: files.length,
    })
  } catch (error) {
    console.error('Error buscando archivos de base de datos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error buscando archivos de base de datos',
      },
      { status: 500 }
    )
  }
}
