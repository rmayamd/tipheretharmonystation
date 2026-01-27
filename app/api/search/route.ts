import { NextRequest, NextResponse } from 'next/server'
import { searchLibrary } from '@/lib/utils/search-engine'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const categories = category ? [category] : undefined
    const results = searchLibrary(query, categories)

    return NextResponse.json({
      query,
      results,
      count: results.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
