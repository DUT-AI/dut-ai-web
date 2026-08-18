import { getIntroductionsQuery } from '@/lib/db/features/introductions/queries'
import { Edit2, Save, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { saveIntroductionAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminIntroductionsPage() {
  const intros = await getIntroductionsQuery().catch(() => [])

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Quản lý Giới thiệu CLB (Introductions)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa các đoạn văn bản giới thiệu về sứ mệnh, tầm nhìn hiển thị trên trang chủ
        </p>
      </div>

      <div className="space-y-6">
        {intros.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Đoạn giới thiệu #{item.id}
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {item.id}</span>
            </div>

            <form action={saveIntroductionAction.bind(null, null)} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <Textarea
                name="content"
                defaultValue={item.content}
                rows={4}
                required
                className="font-normal"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </Button>
              </div>
            </form>
          </div>
        ))}

        {/* Add new introduction section */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Thêm đoạn giới thiệu mới
          </h2>
          <form action={saveIntroductionAction.bind(null, null)} className="space-y-4">
            <Textarea
              name="content"
              placeholder="Nhập nội dung giới thiệu mới..."
              rows={3}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                <span>Thêm mới</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
