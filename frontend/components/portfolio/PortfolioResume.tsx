'use client'

import { FileText, Download, ExternalLink } from 'lucide-react'

export interface PortfolioResumeProps {
  cvUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return ''
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function PortfolioResume({ cvUrl, fileName, fileSize }: PortfolioResumeProps) {
  if (!cvUrl) {
    return null
  }

  const formattedSize = formatBytes(fileSize)

  return (
    <section id="cv" className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Curriculum Vitae (CV)
          </h2>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href={cvUrl}
            download={fileName || 'CV.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Download className="h-4 w-4" />
            Tải CV {formattedSize && `(${formattedSize})`}
          </a>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" />
            Mở tab mới
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer on Desktop */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="relative aspect-[3/4] w-full min-h-[600px] sm:min-h-[850px]">
          <object
            data={`${cvUrl}#toolbar=0`}
            type="application/pdf"
            className="h-full w-full"
            aria-label="CV Document Preview"
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <FileText className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Không thể hiển thị bản xem trước trực tiếp trên thiết bị này.
              </p>
              <a
                href={cvUrl}
                download
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Tải xuống để xem CV
              </a>
            </div>
          </object>
        </div>
      </div>
    </section>
  )
}
