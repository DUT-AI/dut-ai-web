'use client'

import { Fragment, useState, useRef } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileArchive, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export interface NotionImportSuccessPayload {
  title: string
  slug: string
  isSlugDuplicate: boolean
  summary: string
  content: string
  imagesCount: number
}

interface NotionZipImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (payload: NotionImportSuccessPayload) => void
}

const MAX_ZIP_BYTES = 50 * 1024 * 1024 // 50MB

export default function NotionZipImportDialog({
  isOpen,
  onClose,
  onImportSuccess,
}: NotionZipImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setFile(null)
    setIsDragging(false)
    setIsProcessing(false)
    setStatusMessage('')
    setErrorMessage(null)
  }

  const handleClose = () => {
    if (isProcessing) return
    resetState()
    onClose()
  }

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null)

    if (
      !selectedFile.name.toLowerCase().endsWith('.zip') &&
      selectedFile.type !== 'application/zip' &&
      selectedFile.type !== 'application/x-zip-compressed'
    ) {
      setErrorMessage('Chỉ chấp nhận tệp nén định dạng .zip được xuất từ Notion.')
      return
    }

    if (selectedFile.size > MAX_ZIP_BYTES) {
      setErrorMessage('Dung lượng tệp ZIP vượt quá 50 MB. Vui lòng kiểm tra lại.')
      return
    }

    setFile(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      validateAndSetFile(selected)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsProcessing(true)
    setErrorMessage(null)
    setStatusMessage('Đang tải lên và phân tích tệp ZIP Notion...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      setStatusMessage('Đang giải nén nội dung Markdown và tải ảnh lên MinIO...')

      const res = await fetch('/api/admin/blogs/import-notion', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Quá trình nhập từ ZIP Notion thất bại.')
      }

      toast.success(
        `Đã nhập thành công bài viết "${data.title}" với ${data.imagesCount} hình ảnh!`
      )

      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((warn: string) => {
          toast.warning(warn)
        })
      }

      onImportSuccess({
        title: data.title,
        slug: data.slug,
        isSlugDuplicate: Boolean(data.isSlugDuplicate),
        summary: data.summary || '',
        content: data.content || '',
        imagesCount: data.imagesCount || 0,
      })

      handleClose()
    } catch (err: any) {
      console.error('Import Notion ZIP failed:', err)
      setErrorMessage(err.message || 'Có lỗi xảy ra khi xử lý tệp ZIP.')
    } finally {
      setIsProcessing(false)
      setStatusMessage('')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 text-left align-middle shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"
                  >
                    <FileArchive className="h-5 w-5 text-primary-500" />
                    <span>Nhập bài viết từ file ZIP Notion</span>
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tải lên gói xuất <strong>Markdown & CSV</strong> từ Notion. Hệ thống sẽ tự
                    động trích xuất tiêu đề, slug, tóm tắt, tải toàn bộ hình ảnh lên MinIO và thay
                    thế đường dẫn tương ứng trong bài viết.
                  </p>

                  {/* Dropzone */}
                  {!file ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                        isDragging
                          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                          : 'border-slate-300 hover:border-primary-400 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,application/zip"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-primary-100 dark:bg-primary-950/60 p-3 text-primary-600 dark:text-primary-400 mb-3">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Kéo thả file .zip vào đây hoặc{' '}
                          <span className="text-primary-600 dark:text-primary-400 underline">
                            chọn từ máy tính
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          Hỗ trợ tệp ZIP xuất từ Notion (Tối đa 50 MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="rounded-xl bg-primary-500/10 p-2.5 text-primary-500 shrink-0">
                          <FileArchive className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      {!isProcessing && (
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 transition-colors"
                          title="Chọn file khác"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="rounded-2xl border border-primary-500/20 bg-primary-50/70 p-4 dark:bg-primary-950/40">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary-500 shrink-0" />
                        <span className="text-xs font-semibold text-primary-800 dark:text-primary-200">
                          {statusMessage}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    onClick={handleImport}
                    disabled={!file || isProcessing}
                    className="gap-2 text-xs px-5"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Bắt đầu nhập</span>
                      </>
                    )}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
