import { notFound } from 'next/navigation'
import { getUserByIdQuery } from '@/lib/db/features/users/queries'
import UserForm from '@/app/admin/users/UserForm'

export const dynamic = 'force-dynamic'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const userId = parseInt(idStr, 10)
  if (isNaN(userId)) notFound()

  const user = await getUserByIdQuery(userId)
  if (!user) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chỉnh sửa Thành viên
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa thông tin thành viên #{user.id} ({user.name})
        </p>
      </div>

      <UserForm initialUser={user} />
    </div>
  )
}
