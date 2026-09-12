import GenerationForm from '../GenerationForm'
import { getManageUsers } from '@/lib/manage-users'

export const dynamic = 'force-dynamic'

export default async function CreateGenerationPage() {
  const users = await getManageUsers().catch(() => [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          Tạo album thế hệ
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Thiết lập câu chuyện, cơ cấu phòng ban và các gương mặt của thế hệ mới.
        </p>
      </div>
      <GenerationForm users={users} />
    </div>
  )
}
