import PublicEventForm from '@/app/admin/events/PublicEventForm'

export const dynamic = 'force-dynamic'

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Thêm Sự kiện Mới
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tạo thông tin sự kiện và mở cổng đăng ký cho sinh viên
        </p>
      </div>

      <PublicEventForm />
    </div>
  )
}
