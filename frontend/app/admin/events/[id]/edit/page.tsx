import { notFound } from 'next/navigation'
import { getPublicEventByIdQuery } from '@/lib/db/features/events/queries'
import PublicEventForm from '@/app/admin/events/PublicEventForm'

export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const eventId = Number(idStr)
  if (!/^\d+$/.test(idStr) || !Number.isSafeInteger(eventId) || eventId <= 0) notFound()

  const event = await getPublicEventByIdQuery(eventId)
  if (!event) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chỉnh sửa Sự kiện
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa thông tin sự kiện #{event.id} ({event.title})
        </p>
      </div>

      <PublicEventForm initialEvent={event} />
    </div>
  )
}
