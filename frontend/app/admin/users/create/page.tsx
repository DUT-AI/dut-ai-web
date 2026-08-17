import UserForm from '@/app/admin/users/UserForm'

export const dynamic = 'force-dynamic'

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Thêm Thành viên Mới
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tạo thông tin thành viên và phân quyền Ban chủ nhiệm / Leaders
        </p>
      </div>

      <UserForm />
    </div>
  )
}
