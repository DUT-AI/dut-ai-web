import { getPostsQuery } from '@/lib/db/features/events/queries'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Calendar, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePostAction } from '../events/actions'

export const dynamic = 'force-dynamic'

export default async function AdminPostsListPage() {
  const posts = await getPostsQuery().catch(() => [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quản lý Khoảnh khắc (Moments / Posts)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Hình ảnh kỷ niệm, hoạt động thường ngày và các bài đăng của câu lạc bộ
          </p>
        </div>

        <Link href="/admin/posts/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm khoảnh khắc mới</span>
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Bài đăng</th>
                <th className="px-6 py-4">Số lượng ảnh</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{post.id}</td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {post.img_urls && post.img_urls[0] && (
                        <img
                          src={post.img_urls[0]}
                          alt={post.title}
                          className="h-10 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {post.title}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {post.summary || post.description || post.hashtag}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      <span>{post.img_urls?.length || 0} ảnh</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {post.events_date || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </Button>
                      </Link>

                      <form action={deletePostAction.bind(null, post.id)}>
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

              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Chưa có bài đăng khoảnh khắc nào. Bấm &quot;Thêm khoảnh khắc mới&quot; để tạo.
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
