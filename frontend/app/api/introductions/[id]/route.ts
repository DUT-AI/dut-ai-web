import { NextRequest } from 'next/server'
import { getIntroductionByIdQuery } from '@/lib/db/queries'
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
    const introId = parseInt(id, 10)
    if (isNaN(introId)) {
      return errorResponse('Invalid introduction ID', 400)
    }

    const data = await getIntroductionByIdQuery(introId)
    if (!data) {
      return errorResponse('Introduction not found', 404)
    }

    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get introduction:', error)
    return errorResponse('Failed to fetch introduction', 500)
  }
}
