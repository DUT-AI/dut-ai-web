import { notFound } from 'next/navigation'
import { getBlogByIdQuery } from '@/lib/db/features/blogs/queries'
import { getMembersQuery, getBlogKeywordsQuery } from '@/lib/db/queries'
import BlogForm from '@/app/admin/blogs/BlogForm'

export const dynamic = 'force-dynamic'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const blogId = parseInt(idStr, 10)
  if (isNaN(blogId)) notFound()

  const [blog, authors, keywords] = await Promise.all([
    getBlogByIdQuery(blogId),
    getMembersQuery().catch(() => []),
    getBlogKeywordsQuery().catch(() => []),
  ])

  if (!blog) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chỉnh sửa Bài viết
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa thông tin bài viết #{blog.id} & liên kết Quiz slug
        </p>
      </div>

      <BlogForm initialBlog={blog} authors={authors} keywords={keywords} />
    </div>
  )
}
