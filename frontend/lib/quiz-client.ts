export interface QuizLessonResponse {
  id: number
  title: string
  slug: string
  summary?: string
  content?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export async function fetchLessonBySlugFromQuiz(slug: string): Promise<QuizLessonResponse | null> {
  try {
    const cleanSlug = slug.trim()
    const res = await fetch(`https://quiz.dutai.site/api/v1/lessons/by-slug/${encodeURIComponent(cleanSlug)}`, {
      next: { revalidate: 300 }, // 5 minutes cache
    })

    if (!res.ok) return null
    return (await res.json()) as QuizLessonResponse
  } catch (error) {
    console.error('Failed to fetch lesson from quiz.dutai.site:', error)
    return null
  }
}
