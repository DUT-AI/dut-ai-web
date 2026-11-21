'use client'

import React from 'react'
import Image from 'next/image'
import { Upload, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlogCoverImageSectionProps {
  imageUrl: string
  selectedFile: File | null
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearImage: () => void
  thumbnailPreviewUrl: string
  generatedThumbnailUrl: string
  isPending: boolean
}

export default function BlogCoverImageSection({
  imageUrl,
  selectedFile,
  onFileSelect,
  onClearImage,
  thumbnailPreviewUrl,
  generatedThumbnailUrl,
  isPending,
}: BlogCoverImageSectionProps) {
  const hasCustomImage = Boolean(selectedFile || imageUrl)

  return (
    <div>
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
            Ảnh bìa bài viết (MinIO S3)
          </label>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Chọn ảnh bìa từ thiết bị. Ảnh sẽ được tự động tải lên MinIO S3 khi bạn bấm lưu bài viết.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
            <Upload className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span>
              {selectedFile ? 'Đổi ảnh khác' : imageUrl ? 'Đổi ảnh bìa khác' : 'Chọn ảnh bìa'}
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onFileSelect}
              disabled={isPending}
              className="hidden"
            />
          </label>

          {hasCustomImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearImage}
              className="h-8 gap-1.5 rounded-xl border-red-200 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              title="Gỡ ảnh để dùng ảnh tạo tự động"
            >
              <X className="h-3.5 w-3.5" />
              <span>Dùng ảnh tự động</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 max-w-xl">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {selectedFile
                ? 'Ảnh vừa chọn (Sẽ tải lên khi lưu)'
                : imageUrl
                  ? 'Ảnh bìa tùy chỉnh đã lưu'
                  : 'Xem trước Thumbnail tự động'}
            </span>
            {selectedFile ? (
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                Chờ tải lên
              </span>
            ) : imageUrl ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                Ảnh tùy chỉnh
              </span>
            ) : (
              <span className="bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400 border-primary-200 dark:border-primary-800 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium">
                Tự động tạo
              </span>
            )}
          </div>
          {!hasCustomImage && (
            <a
              href={generatedThumbnailUrl}
              download="dut-ai-blog-thumbnail.png"
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1.5 text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5" />
              Mở / tải ảnh PNG
            </a>
          )}
        </div>
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <Image
            src={thumbnailPreviewUrl}
            alt="Xem trước ảnh bìa bài viết"
            fill
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
