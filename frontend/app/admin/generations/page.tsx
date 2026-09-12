import Link from 'next/link'
import { BookOpen, Edit2, Plus, RefreshCw, Trash2, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getGenerationAlbumsQuery } from '@/lib/db/features/organization/queries'
import { deleteGenerationAction, syncManageUsersAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function GenerationsPage({
  searchParams,
}: {
  searchParams: Promise<{ synced?: string }>
}) {
  const [albums, params] = await Promise.all([
    getGenerationAlbumsQuery({ publishedOnly: false }).catch(() => []),
    searchParams,
  ])

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
            DUT AI Archive
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Album các thế hệ
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Quản lý cơ cấu phòng ban và gán thành viên từ hệ thống Manage cho từng thế hệ.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={syncManageUsersAction}>
            <Button type="submit" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Đồng bộ user
            </Button>
          </form>
          <Link href="/admin/generations/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Tạo album
            </Button>
          </Link>
        </div>
      </div>

      {params.synced === '1' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          Đã cập nhật danh sách user mới nhất từ Manage.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {albums.map((album) => {
          const members = album.departments.reduce(
            (sum, department) => sum + department.members.length,
            0
          )
          return (
            <article
              key={album.id}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              <div className="h-2" style={{ backgroundColor: album.accent_color }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        {album.name}
                      </h2>
                      <Badge variant={album.is_published ? 'default' : 'outline'}>
                        {album.is_published ? 'Đang hiển thị' : 'Bản nháp'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-400">
                      {album.period || 'Chưa đặt niên khóa'} · /{album.slug}
                    </p>
                  </div>
                  <BookOpen className="h-7 w-7 shrink-0 text-slate-300 dark:text-slate-700" />
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {album.description || 'Chưa có lời giới thiệu cho thế hệ này.'}
                </p>
                <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4 text-sm font-bold text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <span>{album.departments.length} phòng ban</span>
                  <span className="inline-flex items-center gap-1.5">
                    <UsersRound className="h-4 w-4" /> {members} thành viên
                  </span>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Link href={`/admin/generations/${album.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="h-4 w-4" /> Chỉnh sửa
                    </Button>
                  </Link>
                  <form action={deleteGenerationAction.bind(null, album.id)}>
                    <Button type="submit" variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" /> Xóa
                    </Button>
                  </form>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {albums.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
          <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
            Chưa có album thế hệ
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tạo album đầu tiên rồi thêm phòng ban và thành viên.
          </p>
        </div>
      )}
    </div>
  )
}
