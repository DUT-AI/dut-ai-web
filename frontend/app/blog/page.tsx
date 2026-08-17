import { genPageMetadata } from 'app/seo'
import {
  getBlogsCached as getBlogs,
  getFeaturedBlogsCached as getFeaturedBlogs,
  getTopAuthorsCached as getTopAuthors,
  getBlogKeywordsCached as getBlogKeywords,
} from '@/lib/db/cached-queries'
import BlogListLayout from '@/layouts/BlogListLayout'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({
  title: 'Blog',
  description: 'Bài viết về AI, Machine Learning, Deep Learning và công nghệ từ DUT AI Club.',
  keywords: ['blog AI', 'bài viết machine learning', 'học deep learning', 'AI blog tiếng Việt', 'nghiên cứu AI sinh viên'],
})

export default async function BlogPage() {
  const [posts, featuredPosts, featuredAuthors, tags] = await Promise.all([
    getBlogs().catch(() => []),
    getFeaturedBlogs(5).catch(() => []),
    getTopAuthors(5).catch(() => []),
    getBlogKeywords().catch(() => []),
  ])

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
      featuredPosts={featuredPosts}
      featuredAuthors={featuredAuthors}
      tags={tags}
    />
  )
}
