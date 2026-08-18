import { getMembersQuery, getBlogKeywordsQuery } from '@/lib/db/queries'
import BlogForm from '@/app/admin/blogs/BlogForm'

export const dynamic = 'force-dynamic'

export default async function CreateBlogPage() {
  const [authors, keywords] = await Promise.all([
    getMembersQuery().catch(() => []),
    getBlogKeywordsQuery().catch(() => []),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Thêm Bài viết Blog Mới
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Nhập slug bài học từ quiz.dutai.site để đồng bộ nội dung tự động
        </p>
      </div>

      <BlogForm authors={authors} keywords={keywords} />
    </div>
  )
}
