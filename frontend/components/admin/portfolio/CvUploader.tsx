'use client'

import { useState, useRef } from 'react'
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export interface CvUploaderProps {
  initialCvUrl?: string | null
  initialFileName?: string | null
  initialFileSize?: number | null
  onCvUpdated: (cv: { file_url: string; file_name: string; file_size: number } | null) => void
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function CvUploader({
  initialCvUrl,
  initialFileName,
  initialFileSize,
  onCvUpdated,
}: CvUploaderProps) {
  const [cvUrl, setCvUrl] = useState<string | null>(initialCvUrl || null)
  const [fileName, setFileName] = useState<string | null>(initialFileName || null)
  const [fileSize, setFileSize] = useState<number | null>(initialFileSize || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Chỉ chấp nhận tệp định dạng PDF')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng tệp vượt quá giới hạn 10MB')
      return
    }

    setError(null)
    setSuccess(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/members/me/cv', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Tải lên thất bại')
      }

      setCvUrl(data.data.file_url)
      setFileName(data.data.file_name)
      setFileSize(data.data.file_size)
      onCvUpdated(data.data)
      setSuccess('Tải lên CV thành công!')
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải lên CV')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa tệp CV này không?')) return

    setError(null)
    setSuccess(null)
    setIsDeleting(true)

    try {
      const res = await fetch('/api/members/me/cv', {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Xóa CV thất bại')
      }

      setCvUrl(null)
      setFileName(null)
      setFileSize(null)
      onCvUpdated(null)
      setSuccess('Đã xóa CV thành công')
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa CV')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hồ sơ năng lực (CV)</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Tải lên bản CV cá nhân (định dạng PDF, tối đa 10MB) để hiển thị trên portfolio.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {cvUrl ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {fileName || 'Curriculum_Vitae.pdf'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(fileSize)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Xem tệp
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Xóa CV
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:border-blue-500"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Đang tải tệp lên máy chủ...
              </p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                Nhấp để tải lên hoặc kéo thả tệp PDF vào đây
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Tối đa 10MB • Định dạng .PDF
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
