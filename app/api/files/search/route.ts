import { NextRequest, NextResponse } from 'next/server'
import { findFileByName } from '@/lib/knowledge/file-locator'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get('name')

    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nombre de archivo requerido',
        },
        { status: 400 }
      )
    }

    const file = await findFileByName(fileName)
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Archivo no encontrado',
      })
    }

    return NextResponse.json({
      success: true,
      file,
    })
  } catch (error) {
    console.error('Error buscando archivo:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error buscando archivo',
      },
      { status: 500 }
    )
  }
}
