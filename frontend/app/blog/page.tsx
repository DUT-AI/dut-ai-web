import { genPageMetadata } from 'app/seo'
import BlogListLayout from '@/layouts/BlogListLayout'
import { getBlogs, getTopAuthors, getBlogKeywords, mapApiBlogToPost } from 'app/api-client'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({
  title: 'Blog',
  description: 'Bài viết về AI, Machine Learning, Deep Learning và công nghệ từ DUT AI Club.',
  keywords: ['blog AI', 'bài viết machine learning', 'học deep learning', 'AI blog tiếng Việt', 'nghiên cứu AI sinh viên'],
})

export default async function BlogPage() {
  const [apiBlogs, topAuthors, keywords] = await Promise.all([
    getBlogs().catch(() => []),
    getTopAuthors(5).catch(() => []),
    getBlogKeywords().catch(() => []),
  ])

  const posts = apiBlogs.map(mapApiBlogToPost)

  // Build tagCounts from keywords API
  const tagCounts: Record<string, number> = {}
  for (const kw of keywords) {
    tagCounts[kw.keyword_name] = kw.number_blog_contain
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
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
