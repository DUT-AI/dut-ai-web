import { NextRequest } from 'next/server'
import { getMemberPortfolioByUsername } from '@/features/users/db/queries'
import { jsonResponse, errorResponse, corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    if (!username) {
      return errorResponse('Username parameter is required', 400)
    }

    const portfolio = await getMemberPortfolioByUsername(username)
    if (!portfolio || !portfolio.isPublic) {
      return errorResponse('Member portfolio not found', 404)
    }

    return jsonResponse(portfolio)
  } catch (error) {
    console.error('API Error fetching member portfolio:', error)
    return errorResponse('Internal server error', 500)
  }
}
