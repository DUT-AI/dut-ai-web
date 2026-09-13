import { getPublicEventsQuery } from '@/lib/db/features/events/queries'
import Link from 'next/link'
import { Plus, Edit2, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DeleteEventItemButton from './DeleteEventItemButton'
import type { PublicEvent } from '@/lib/db/features/events/types'

export const dynamic = 'force-dynamic'

export default async function AdminEventsListPage() {
  let events: PublicEvent[] = []
  let loadError = false
  try {
    events = await getPublicEventsQuery()
  } catch (error) {
    loadError = true
    console.error('Failed to load admin events:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quản lý Sự kiện (Public Events)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Các buổi workshop, hội thảo và sự kiện mở của câu lạc bộ
          </p>
        </div>

        <Link href="/admin/events/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm sự kiện mới</span>
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Sự kiện</th>
                <th className="px-6 py-4">Thời gian & Địa điểm</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{event.id}</td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {event.img_url && (
                        <img
                          src={event.img_url}
                          alt={event.title}
                          className="h-10 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {event.title}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {event.summary || event.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span>{event.events_date || 'Chưa định ngày'}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {event.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </Button>
                      </Link>

                      <DeleteEventItemButton
                        id={event.id}
                        kind="event"
                        title={event.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {loadError && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-red-600 dark:text-red-400">
                    Không thể tải danh sách sự kiện. Vui lòng thử lại.
                  </td>
                </tr>
              )}

              {!loadError && events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Chưa có sự kiện nào. Bấm &quot;Thêm sự kiện mới&quot; để tạo.
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
