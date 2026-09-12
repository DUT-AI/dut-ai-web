import { notFound } from 'next/navigation'
import { getBlogByIdQuery } from '@/lib/db/features/blogs/queries'
import { getBlogKeywordsQuery } from '@/lib/db/queries'
import { getManageUsers } from '@/lib/manage-users'
import BlogForm from '@/app/admin/blogs/BlogForm'

export const dynamic = 'force-dynamic'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const blogId = parseInt(idStr, 10)
  if (isNaN(blogId)) notFound()

  const [blog, authors, keywords] = await Promise.all([
    getBlogByIdQuery(blogId),
    getManageUsers().catch(() => []),
    getBlogKeywordsQuery().catch(() => []),
  ])

  if (!blog) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
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
