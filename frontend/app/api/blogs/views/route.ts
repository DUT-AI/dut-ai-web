import { NextRequest } from 'next/server'
import { incrementBlogViewsQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const id = body.id ? Number(body.id) : undefined
    const slug = body.slug ? String(body.slug) : undefined

    if (!id && !slug) {
      return errorResponse('Missing blog id or slug', 400)
    }

    const views = await incrementBlogViewsQuery({ id, slug })
    if (views === null) {
      return errorResponse('Blog not found', 404)
    }

    return jsonResponse({ success: true, views })
  } catch (error) {
    console.error('Failed to increment blog views:', error)
    return errorResponse('Failed to increment views', 500)
  }
}
