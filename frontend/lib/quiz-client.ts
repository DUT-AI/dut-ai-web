export interface QuizLessonResponse {
  id: string
  name: string
  slug: string
  description?: string
  content_md?: string
  module_id?: string
  order?: number
  questions?: unknown[]
  has_game_questions?: boolean
  created_at?: string
  updated_at?: string
}

export async function fetchLessonBySlugFromQuiz(slug: string): Promise<QuizLessonResponse | null> {
  try {
    const cleanSlug = slug.trim()
    const headers = new Headers({ Accept: 'application/json' })
    if (process.env.QUIZ_API_KEY) {
      headers.set('x-api-key', process.env.QUIZ_API_KEY)
    }

    const quizApiBaseUrl = process.env.QUIZ_API_BASE_URL || 'https://quiz.dutai.site/api/v1'
    const res = await fetch(`${quizApiBaseUrl}/lessons/by-slug/${encodeURIComponent(cleanSlug)}`, {
      headers,
      next: { revalidate: 300 }, // 5 minutes cache
    })

    if (!res.ok) return null
    return (await res.json()) as QuizLessonResponse
  } catch (error) {
    console.error('Failed to fetch lesson from quiz.dutai.site:', error)
    return null
  }
}
