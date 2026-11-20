'use client'

import { useState, useEffect } from 'react'
import { Loader2, UserCircle, ExternalLink, RefreshCw } from 'lucide-react'
import PortfolioEditForm from '@/components/admin/portfolio/PortfolioEditForm'
import CvUploader from '@/components/admin/portfolio/CvUploader'
import PersonalProjectsManager from '@/components/admin/portfolio/PersonalProjectsManager'
import type { UserCv, UserPortfolioProjectModel } from '@/lib/db/features/users/types'

export default function AdminPortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    user?: any
    cv?: Partial<UserCv> | null
    projects?: {
      personal: UserPortfolioProjectModel[]
      club: any[]
    }
  } | null>(null)

  const refetch = () => {
    setLoading(true)
    setError(null)
    fetch('/api/members/me/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải thông tin hồ sơ của bạn')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Lỗi khi tải dữ liệu')
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false

    fetch('/api/members/me/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải thông tin hồ sơ của bạn')
        return res.json()
      })
      .then((json) => {
        if (!ignore) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Lỗi khi tải dữ liệu')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Đang tải hồ sơ cá nhân...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/60 dark:bg-red-950/30">
        <p className="text-base font-semibold text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    )
  }

  const cv = data.cv || {}
  const username = cv.username || ''

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <UserCircle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Quản lý Hồ sơ Portfolio
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chỉnh sửa thông tin cá nhân, cập nhật kỹ năng, tải lên CV và thêm dự án của bạn.
            </p>
          </div>
        </div>

        {username && (
          <a
            href={`/members/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <ExternalLink className="h-4 w-4" />
            Xem trang công khai
          </a>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Form Info & Skills */}
        <div className="space-y-8 lg:col-span-2">
          <PortfolioEditForm initialData={cv} onSaved={refetch} />
          <PersonalProjectsManager
            initialProjects={data.projects?.personal || []}
            onProjectsChanged={refetch}
          />
        </div>

        {/* Right 1 Col: CV Uploader & Club Projects Summary */}
        <div className="space-y-8">
          <CvUploader
            initialCvUrl={cv.cv_file_url}
            initialFileName={cv.cv_file_name}
            initialFileSize={cv.cv_file_size}
            onCvUpdated={refetch}
          />

          {/* Club Projects Readonly Box */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Dự án CLB đã tham gia
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Đồng bộ tự động từ hệ thống quản lý dự án chính thức của DUT AI.
            </p>

            <div className="mt-4 space-y-3">
              {!data.projects?.club || data.projects.club.length === 0 ? (
                <p className="text-xs text-gray-500">Chưa ghi nhận dự án CLB nào.</p>
              ) : (
                data.projects.club.map((proj: any, idx: number) => (
                  <div
                    key={`club-${proj.id}-${idx}`}
                    className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {proj.title}
                    </p>
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      Vai trò: {proj.clubRole || 'Thành viên'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
