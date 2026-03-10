import BlogListLayout from '@/layouts/BlogListLayout'
import { notFound } from 'next/navigation'
import { getBlogs, getTopAuthors, mapApiBlogToPost } from 'app/api-client'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  const [apiBlogs, topAuthors] = await Promise.all([
    getBlogs().catch(() => []),
    getTopAuthors(5).catch(() => []),
  ])

  const posts = apiBlogs.map(mapApiBlogToPost)

  // Build tagCounts from keywords
  const tagCounts: Record<string, number> = {}
  for (const blog of apiBlogs) {
    for (const kw of blog.keywords ?? []) {
      tagCounts[kw.keyword_name] = (tagCounts[kw.keyword_name] ?? 0) + 1
    }
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <BlogListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      topAuthors={topAuthors}
      tagCounts={tagCounts}
    />
  )
}
