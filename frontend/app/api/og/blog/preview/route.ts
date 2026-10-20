import type { NextRequest } from 'next/server'
import { createBlogThumbnail } from '@/lib/blog-thumbnail'
import type { BlogAuthorInfo } from '@/lib/blog-thumbnail-types'

const SAMPLE_TITLE = 'Xây dựng hệ thống AI hiện đại: Từ ý tưởng đến sản phẩm thực tế'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || SAMPLE_TITLE

  // Check if structured authors JSON parameter is passed
  const authorsParam = searchParams.get('authors')
  let parsedAuthors: BlogAuthorInfo[] = []

  if (authorsParam) {
    try {
      const decoded = JSON.parse(authorsParam)
      if (Array.isArray(decoded)) {
        parsedAuthors = decoded
          .filter((item) => item && typeof item.name === 'string')
          .map((item) => ({
            name: String(item.name).trim(),
            avatarUrl: item.avatarUrl ? String(item.avatarUrl) : null,
          }))
      }
    } catch {
      // JSON parse error, ignore and fall back to repeated query params
    }
  }

  // Fallback to repeated 'author' query params
  if (parsedAuthors.length === 0) {
    const rawAuthors = searchParams
      .getAll('author')
      .map((author) => author.trim())
      .filter(Boolean)

    if (rawAuthors.length > 0) {
      parsedAuthors = rawAuthors.map((name) => ({ name, avatarUrl: null }))
    }
  }

  return createBlogThumbnail({
    title,
    authors:
      parsedAuthors.length > 0
        ? parsedAuthors
        : [
            { name: 'Nguyễn Văn An', avatarUrl: null },
            { name: 'DUT AI Team', avatarUrl: null },
          ],
  })
}
