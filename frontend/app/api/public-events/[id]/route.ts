import { NextRequest } from 'next/server'
import { getPublicEventByIdQuery } from '@/lib/db/queries'
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
    const eventId = Number(id)
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(eventId) || eventId <= 0) {
      return errorResponse('Invalid event ID', 400)
    }

    const data = await getPublicEventByIdQuery(eventId)
    if (!data) {
      return errorResponse('Event not found', 404)
    }

    return jsonResponse(data)
  } catch (error) {
    console.error('Failed to get public event:', error)
    return errorResponse('Failed to fetch public event', 500)
  }
}
