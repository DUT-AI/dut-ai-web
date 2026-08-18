import { notFound } from 'next/navigation'
import { getProjectByIdQuery } from '@/lib/db/features/projects/queries'
import { getMembersQuery } from '@/lib/db/queries'
import ProjectForm from '@/app/admin/projects/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const projectId = parseInt(idStr, 10)
  if (isNaN(projectId)) notFound()

  const [project, members] = await Promise.all([
    getProjectByIdQuery(projectId),
    getMembersQuery().catch(() => []),
  ])

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chỉnh sửa Dự án
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Chỉnh sửa thông tin dự án #{project.id} ({project.title})
        </p>
      </div>

      <ProjectForm initialProject={project} allMembers={members} />
    </div>
  )
}
