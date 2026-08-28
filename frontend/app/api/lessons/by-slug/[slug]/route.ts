import { NextRequest } from 'next/server'
import { corsHeaders, errorResponse, jsonResponse } from '@/lib/cors'

const quizApiBaseUrl = process.env.QUIZ_API_BASE_URL || 'https://quiz.dutai.site/api/v1'

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
      return errorResponse('Lesson slug is required', 400)
    }

    const headers = new Headers({ Accept: 'application/json' })
    if (process.env.QUIZ_API_KEY) {
      headers.set('x-api-key', process.env.QUIZ_API_KEY)
    }

    const response = await fetch(`${quizApiBaseUrl}/lessons/by-slug/${encodeURIComponent(slug)}`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return errorResponse('Quiz API authentication failed. Check QUIZ_API_KEY.', response.status)
      }

      return errorResponse('Quiz lesson not found', response.status)
    }

    return jsonResponse(await response.json())
  } catch (error) {
    console.error('Failed to fetch lesson from Quiz API:', error)
    return errorResponse('Failed to fetch lesson from Quiz API', 502)
  }
}
