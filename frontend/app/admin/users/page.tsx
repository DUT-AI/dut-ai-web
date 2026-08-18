import { getMembersQuery } from '@/lib/db/features/users/queries'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Mail, Phone, Shield, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteUserAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersListPage() {
  const users = await getMembersQuery().catch(() => [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Quản lý Thành viên CLB
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Danh sách Ban chủ nhiệm, Leaders và các thành viên của DUT AI Club
          </p>
        </div>

        <Link href="/admin/users/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm thành viên mới</span>
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Thành viên</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          user.name.slice(0, 1)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {user.name}
                        </div>
                        {user.discord_id && (
                          <p className="text-xs font-mono text-slate-400">Discord: {user.discord_id}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                    <div className="space-y-1">
                      {user.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      {user.phone_number && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{user.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        user.role_name?.toLowerCase().includes('admin') || user.role_id === 1
                          ? 'default'
                          : user.role_name?.toLowerCase().includes('lead') || user.role_id === 2
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {user.role_name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{user.status || 'active'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </Button>
                      </Link>

                      <form action={deleteUserAction.bind(null, user.id)}>
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

              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa có thành viên nào. Bấm &quot;Thêm thành viên mới&quot; để tạo.
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
