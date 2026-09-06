import type { NextRequest } from 'next/server'
import { getBlogByIdCached, getBlogBySlugCached } from '@/lib/db/cached-queries'
import { createBlogThumbnail } from '@/lib/blog-thumbnail'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post =
    (await getBlogBySlugCached(slug)) ||
    (/^\d+$/.test(slug) ? await getBlogByIdCached(Number(slug)) : null)

  if (!post) {
    return new Response('Blog not found', { status: 404 })
  }

  return createBlogThumbnail({
    title: post.title,
    authors: post.authors.map((author) => author.name),
  })
}
