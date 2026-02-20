import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({
  title: 'Blog',
  description: 'Bài viết về AI, Machine Learning, Deep Learning và công nghệ từ DUT AI Club.',
  keywords: ['blog AI', 'bài viết machine learning', 'học deep learning', 'AI blog tiếng Việt', 'nghiên cứu AI sinh viên'],
})

export default async function BlogPage() {
  const allPosts = allCoreContent(sortPosts(allBlogs))
  // Filter out event-tagged posts — those live under /events
  const posts = allPosts.filter((post) => !post.tags?.includes('event'))
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
