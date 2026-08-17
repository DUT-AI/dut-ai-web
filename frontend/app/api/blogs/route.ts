import { NextRequest } from 'next/server'
import { getBlogsQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || undefined
    const keyword = searchParams.get('keyword') || undefined

    const data = await getBlogsQuery({ title, keyword })
    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get blogs:', error)
    return errorResponse('Failed to fetch blogs', 500)
  }
}
