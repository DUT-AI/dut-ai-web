import { getBlogs, getFeaturedBlogs, getTopAuthors, getBlogKeywords } from 'app/api-client'
import BlogListLayout from '@/layouts/BlogListLayout'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  const [posts, featuredPosts, featuredAuthors, tags] = await Promise.all([
    getBlogs().catch(() => []),
    getFeaturedBlogs(5).catch(() => []),
    getTopAuthors(5).catch(() => []),
    getBlogKeywords().catch(() => []),
  ])

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1

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
      featuredPosts={featuredPosts}
      featuredAuthors={featuredAuthors}
      tags={tags}
    />
  )
}

