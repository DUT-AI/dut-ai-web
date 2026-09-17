import { notFound } from 'next/navigation'
import GenerationForm from '../../GenerationForm'
import { getManageUsers } from '@/lib/manage-users'
import { getGenerationAlbumByIdQuery } from '@/lib/db/features/organization/queries'

export const dynamic = 'force-dynamic'

export default async function EditGenerationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const generationId = Number(id)
  if (!Number.isFinite(generationId)) notFound()

  const [album, users] = await Promise.all([
    getGenerationAlbumByIdQuery(generationId),
    getManageUsers().catch(() => []),
  ])
  if (!album) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          Chỉnh sửa {album.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cập nhật nội dung album, phòng ban và thứ tự thành viên.
        </p>
      </div>
      <GenerationForm users={users} initialAlbum={album} />
    </div>
  )
}
