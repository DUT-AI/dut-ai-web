import { getProjectsQuery } from '@/lib/db/features/projects/queries'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ExternalLink, Users, Code, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteProjectAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsListPage() {
  const projects = await getProjectsQuery().catch(() => [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quản lý Dự án (Projects)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Triển lãm và phân quyền thành viên tham gia các dự án AI
          </p>
        </div>

        <Link href="/admin/projects/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm dự án mới</span>
          </Button>
        </Link>
      </div>

      {/* Projects List Table Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Dự án</th>
                <th className="px-6 py-4">Công nghệ</th>
                <th className="px-6 py-4">Thành viên tham gia</th>
                <th className="px-6 py-4">Liên kết</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{proj.id}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      {proj.image_url && (
                        <img
                          src={proj.image_url.split('\n')[0]}
                          alt={proj.title}
                          className="h-10 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {proj.title}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {proj.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.technologies ? (
                        proj.technologies.split(/[\n,]+/).map((tech, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {tech.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {proj.members?.map((m) => (
                        <Badge key={m.id} variant="secondary" className="text-xs">
                          {m.name} ({m.role})
                        </Badge>
                      ))}
                      {proj.members?.length === 0 && (
                        <span className="text-xs text-slate-400">Chưa gán</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      {proj.demo_url && (
                        <Link
                          href={proj.demo_url}
                          target="_blank"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Demo</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                      {proj.video_url && (
                        <Link
                          href={proj.video_url}
                          target="_blank"
                          className="text-pink-600 hover:underline flex items-center gap-1"
                        >
                          <Video className="h-3 w-3" />
                          <span>Video</span>
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${proj.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </Button>
                      </Link>

                      <form action={deleteProjectAction.bind(null, proj.id)}>
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

              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có dự án nào. Nhấn &quot;Thêm dự án mới&quot; để bắt đầu.
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
