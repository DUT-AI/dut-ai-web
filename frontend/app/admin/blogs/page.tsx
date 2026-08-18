import { getBlogsQuery } from '@/lib/db/features/blogs/queries'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ExternalLink, Eye, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteBlogAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminBlogsListPage() {
  const blogs = await getBlogsQuery().catch(() => [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quản lý Bài viết Blog
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cấu hình slug bài viết đồng bộ với hệ thống Quiz API (quiz.dutai.site)
          </p>
        </div>

        <Link href="/admin/blogs/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm bài viết mới</span>
          </Button>
        </Link>
      </div>

      {/* Blogs List Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Tiêu đề bài viết</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Từ khóa</th>
                <th className="px-6 py-4 text-center">Lượt xem</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{blog.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {blog.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      {blog.authors?.map((author) => (
                        <span key={author.id} className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {author.name}
                        </span>
                      ))}
                      {blog.authors?.length === 0 && (
                        <span className="text-xs text-slate-400 italic">Chưa gán</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.keywords?.map((kw) => (
                        <span
                          key={kw.id}
                          className="rounded-lg border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200"
                        >
                          #{kw.keyword_name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {blog.views}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {blog.slug && (
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Button variant="secondary" size="sm" className="h-8 gap-1 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Truy cập</span>
                          </Button>
                        </Link>
                      )}

                      <Link href={`/admin/blogs/${blog.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </Button>
                      </Link>

                      <form action={deleteBlogAction.bind(null, blog.id)}>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          type="submit"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Xóa</span>
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {blogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có bài viết blog nào. Nhấn &quot;Thêm bài viết mới&quot; để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
