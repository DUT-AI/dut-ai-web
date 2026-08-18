import { NextRequest } from 'next/server'
import { getBlogBySlugQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug) {
      return errorResponse('Slug is required', 400)
    }

    const data = await getBlogBySlugQuery(decodeURIComponent(slug))
    if (!data) {
      return errorResponse('Blog not found', 404)
    }

    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get blog by slug:', error)
    return errorResponse('Failed to fetch blog', 500)
  }
}
