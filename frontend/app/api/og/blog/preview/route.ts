import type { NextRequest } from 'next/server'
import { createBlogThumbnail } from '@/lib/blog-thumbnail'

const SAMPLE_TITLE = 'Xây dựng hệ thống AI hiện đại: Từ ý tưởng đến sản phẩm thực tế'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || SAMPLE_TITLE
  const authors = searchParams
    .getAll('author')
    .map((author) => author.trim())
    .filter(Boolean)

  return createBlogThumbnail({
    title,
    authors: authors.length > 0 ? authors : ['Nguyễn Văn An', 'DUT AI Team'],
  })
}
