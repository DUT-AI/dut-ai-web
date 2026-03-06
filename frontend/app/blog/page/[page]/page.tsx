import { getBlogs, getFeaturedBlogs, getTopAuthors, getBlogKeywords } from 'app/api-client'
import type { BlogPost, BlogKeyword, AuthorStats } from 'app/api-client'
import BlogListLayout from '@/layouts/BlogListLayout'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 10

export const dynamic = 'force-dynamic'

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

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

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
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
