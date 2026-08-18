import { NextRequest } from 'next/server'
import { getTopAuthorsQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const data = await getTopAuthorsQuery(limit)
    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get top authors:', error)
    return errorResponse('Failed to fetch top authors', 500)
  }
}
