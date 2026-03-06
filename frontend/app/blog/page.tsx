import { genPageMetadata } from 'app/seo'
import { getBlogs, getFeaturedBlogs, getTopAuthors, getBlogKeywords } from 'app/api-client'
import type { BlogPost, BlogKeyword, AuthorStats } from 'app/api-client'
import BlogListLayout from '@/layouts/BlogListLayout'

const POSTS_PER_PAGE = 10

export const metadata = genPageMetadata({
  title: 'Blog',
  description: 'Bài viết về AI, Machine Learning, Deep Learning và công nghệ từ DUT AI Club.',
  keywords: ['blog AI', 'bài viết machine learning', 'học deep learning', 'AI blog tiếng Việt', 'nghiên cứu AI sinh viên'],
})

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: BlogPost[] = []
  let featuredPosts: BlogPost[] = []
  let featuredAuthors: AuthorStats[] = []
  let tags: BlogKeyword[] = []
  let error = false

  try {
    ;[posts, featuredPosts, featuredAuthors, tags] = await Promise.all([
      getBlogs(),
      getFeaturedBlogs(5),
      getTopAuthors(5),
      getBlogKeywords(),
    ])
  } catch {
    error = true
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
      featuredPosts={featuredPosts}
      featuredAuthors={featuredAuthors}
      tags={tags}
    />
  )
}
