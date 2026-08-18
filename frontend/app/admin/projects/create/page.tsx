import { getMembersQuery } from '@/lib/db/queries'
import ProjectForm from '@/app/admin/projects/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function CreateProjectPage() {
  const members = await getMembersQuery().catch(() => [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Thêm Dự án Mới
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tạo dự án mới và gán các thành viên tham gia
        </p>
      </div>

      <ProjectForm allMembers={members} />
    </div>
  )
}
