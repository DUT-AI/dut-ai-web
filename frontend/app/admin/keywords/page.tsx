import { getBlogKeywordsQuery } from '@/lib/db/features/keywords/queries'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { saveKeywordAction, deleteKeywordAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminKeywordsPage() {
  const keywords = await getBlogKeywordsQuery().catch(() => [])

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Quản lý Từ khóa SEO (Keywords)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Danh mục từ khóa được gán cho các bài viết blog
        </p>
      </div>

      {/* Add Keyword Form */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Thêm từ khóa mới
        </h2>
        <form action={saveKeywordAction.bind(null, null)} className="flex gap-3">
          <Input
            name="keywordName"
            placeholder="VD: Machine Learning, NLP, Next.js..."
            required
            className="flex-1"
          />
          <Button type="submit" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm từ khóa</span>
          </Button>
        </form>
      </div>

      {/* Keywords List Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Từ khóa</th>
                <th className="px-6 py-4 text-center">Số bài viết chứa</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {keywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{kw.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">
                      #{kw.keyword_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {kw.number_blog_contain} bài
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteKeywordAction.bind(null, kw.id)}>
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
                  </td>
                </tr>
              ))}

              {keywords.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Chưa có từ khóa nào. Nhập tên từ khóa ở trên để tạo.
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
