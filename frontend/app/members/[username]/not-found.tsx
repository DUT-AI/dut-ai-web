import Link from 'next/link'
import { UserX, ArrowLeft, Users } from 'lucide-react'

export default function MemberNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <UserX className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Không tìm thấy thành viên
      </h1>

      <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
        Hồ sơ bạn đang tìm kiếm không tồn tại, đã thay đổi username hoặc chưa được công khai.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <Users className="h-4 w-4" />
          Danh sách thành viên
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Trang chủ
        </Link>
      </div>
    </div>
  )
}
