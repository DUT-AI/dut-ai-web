import { NextRequest } from 'next/server'
import { getPostByIdQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = Number(id)
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(postId) || postId <= 0) {
      return errorResponse('Invalid post ID', 400)
    }

    const data = await getPostByIdQuery(postId)
    if (!data) {
      return errorResponse('Post not found', 404)
    }

    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get post:', error)
    return errorResponse('Failed to fetch post', 500)
  }
}
