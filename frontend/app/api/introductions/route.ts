import { getIntroductionsQuery } from '@/lib/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET() {
  try {
    const data = await getIntroductionsQuery()
    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get introductions:', error)
    return errorResponse('Failed to fetch introductions', 500)
  }
}
