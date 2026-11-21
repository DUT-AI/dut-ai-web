'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import { useIsMounted } from '@/lib/hooks'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Columns,
  Eye,
  Edit3,
  Upload,
  Loader2,
  Table,
  CheckSquare,
  Maximize2,
  Minimize2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  fullscreenOnly?: boolean
}

type ViewMode = 'write' | 'preview' | 'split'

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết bằng Markdown...',
  minHeight = '450px',
  fullscreenOnly = false,
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mounted = useIsMounted()
  const [uploadingImage, setUploadingImage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle ESC key to exit fullscreen and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  // Focus textarea when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
  }, [isFullscreen])

  // Helper to insert markdown tokens at cursor position
  const insertText = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end) || defaultText

    const replacement = `${prefix}${selected}${suffix}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    // Reset cursor position inside or after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 0)
  }

  // Handle uploading image directly into Markdown body via MinIO
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      const altText = file.name.replace(/\.[^/.]+$/, '')
      insertText(`![${altText}](${data.url})`, '')
    } catch (err: any) {
      alert(`Lỗi upload ảnh: ${err.message || 'Không thể upload ảnh vào MinIO'}`)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const editorContent = (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[99999] flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-slate-950'
          : 'focus-within:ring-primary-500/20 focus-within:border-primary-500 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:ring-2 dark:border-gray-800 dark:bg-gray-950'
      }
    >
      {/* Top Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-b border-gray-200 bg-gray-50/90 p-2 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            title="Đậm (Bold)"
            onClick={() => insertText('**', '**', 'văn bản đậm')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Nghiêng (Italic)"
            onClick={() => insertText('*', '*', 'văn bản nghiêng')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Italic className="h-4 w-4" />
          </button>
          <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <button
            type="button"
            title="Tiêu đề 1"
            onClick={() => insertText('# ', '', 'Tiêu đề lớn')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Tiêu đề 2"
            onClick={() => insertText('## ', '', 'Tiêu đề phụ')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Tiêu đề 3"
            onClick={() => insertText('### ', '', 'Tiêu đề nhỏ')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <button
            type="button"
            title="Danh sách gạch đầu dòng"
            onClick={() => insertText('- ', '', 'Mục')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Danh sách số"
            onClick={() => insertText('1. ', '', 'Mục đầu tiên')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Task list"
            onClick={() => insertText('- [ ] ', '', 'Công việc')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <button
            type="button"
            title="Trích dẫn (Quote)"
            onClick={() => insertText('> ', '', 'Đoạn trích dẫn')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Khối mã (Code block)"
            onClick={() => insertText('```python\n', '\n```', '# Viết mã tại đây')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Bảng (Table)"
            onClick={() =>
              insertText('| Tiêu đề 1 | Tiêu đề 2 |\n|---|---|\n| Nội dung A | Nội dung B |\n', '')
            }
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Table className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Chèn liên kết"
            onClick={() => insertText('[', '](https://example.com)', 'Tiêu đề liên kết')}
            className="rounded-lg p-1.5 text-gray-700 transition hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          {/* Upload and insert image */}
          <button
            type="button"
            title="Tải ảnh chèn vào bài viết"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/50 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition"
          >
            {uploadingImage ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5" />
            )}
            <span>{uploadingImage ? 'Đang tải...' : 'Chèn ảnh'}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* View mode toggle buttons & Fullscreen button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg bg-gray-200/60 p-0.5 text-xs font-medium dark:bg-gray-800/80">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                viewMode === 'write'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Soạn thảo</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden items-center gap-1 rounded-md px-2.5 py-1 transition md:flex ${
                viewMode === 'split'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Hai cột</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Xem trước</span>
            </button>
          </div>

          {/* Fullscreen toggle button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình'}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              isFullscreen
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200/70 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Thu nhỏ (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body (Write / Split / Preview) */}
      <div
        className={`grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-gray-800 ${
          isFullscreen ? 'min-h-0 flex-1 overflow-hidden' : ''
        }`}
        style={isFullscreen ? undefined : { minHeight }}
      >
        {/* Editor Pane */}
        {(viewMode === 'write' || viewMode === 'split') && (
          <div
            className={`flex h-full flex-col overflow-hidden ${
              viewMode === 'write' ? 'md:col-span-2' : 'col-span-1'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`h-full w-full bg-transparent p-4 font-mono text-sm leading-relaxed text-gray-900 placeholder-gray-400 focus:outline-none sm:p-6 sm:text-base dark:text-gray-100 dark:placeholder-gray-600 ${
                isFullscreen ? 'resize-none overflow-y-auto' : 'min-h-[400px] resize-y'
              }`}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col overflow-y-auto bg-gray-50/40 p-6 sm:p-8 dark:bg-gray-900/30 ${
              viewMode === 'preview' ? 'md:col-span-2' : 'col-span-1'
            }`}
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-200/60 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:border-gray-800/60 dark:text-gray-500">
              <span>Xem trước trực tiếp (Live Preview)</span>
              {isFullscreen && (
                <span className="text-[10px] font-normal text-gray-400 lowercase">
                  (nhấn Esc để thu nhỏ)
                </span>
              )}
            </div>
            {value.trim() ? (
              <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none leading-relaxed break-words">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400 italic dark:text-gray-600">
                Nội dung xem trước sẽ hiển thị tại đây khi bạn nhập Markdown...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word / Character count footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <div>
          <span>{value.length} ký tự</span>
          <span className="mx-2">•</span>
          <span>{value.trim() ? value.trim().split(/\s+/).length : 0} từ</span>
        </div>
        <div className="hidden text-[11px] text-gray-400 sm:block dark:text-gray-500">
          {isFullscreen
            ? 'Chế độ toàn màn hình • Nhấn ESC hoặc nút Thu nhỏ để quay lại'
            : 'Hỗ trợ cú pháp Markdown chuẩn (GFM, Code block, List, Table)'}
        </div>
      </div>
    </div>
  )

  // When in fullscreen mode, portal the editor directly to document.body
  // to escape ancestor backdrop-blur and CSS stacking context constraints
  if (isFullscreen && mounted) {
    return (
      <>
        {createPortal(editorContent, document.body)}
        {/* Placeholder in the form layout while in fullscreen */}
        <div
          style={{ minHeight: fullscreenOnly ? '160px' : minHeight }}
          className="border-primary-500/30 bg-primary-50/10 dark:bg-primary-950/10 flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-6 text-center sm:p-8"
        >
          <div className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full p-2.5">
            <Maximize2 className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Trình soạn thảo đang mở ở chế độ Toàn màn hình
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Nhấn phím{' '}
              <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] dark:bg-slate-800">
                ESC
              </kbd>{' '}
              hoặc nút "Thu nhỏ" để quay lại đây
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="mt-1 gap-1.5 text-xs"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Thu nhỏ ngay</span>
          </Button>
        </div>
      </>
    )
  }

  // If fullscreenOnly mode is enabled, hide the inline editor in the form
  // and display a compact trigger card with content summary & preview
  if (fullscreenOnly && !isFullscreen) {
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
    const charCount = value.length
    const hasContent = value.trim().length > 0

    return (
      <div className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all sm:p-5 dark:border-slate-800 dark:bg-slate-900/60">
        {/* Header row with stats & primary Fullscreen action */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Không gian soạn thảo Markdown
                </span>
                {hasContent ? (
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Đã có nội dung
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Chưa nhập
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {hasContent
                  ? `${charCount.toLocaleString()} ký tự • ${wordCount.toLocaleString()} từ • Bấm để mở rộng toàn màn hình`
                  : 'Trình soạn thảo được ẩn ở form để tối ưu diện tích. Bấm mở toàn màn hình để bắt đầu.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="bg-primary-600 hover:bg-primary-700 gap-2 self-start font-medium text-white shadow-xs transition-all hover:shadow sm:self-auto"
          >
            <Maximize2 className="h-4 w-4" />
            <span>{hasContent ? 'Chỉnh sửa toàn màn hình' : 'Mở toàn màn hình'}</span>
          </Button>
        </div>

        {/* Content Preview Box or Empty State Clickable Box */}
        {hasContent ? (
          <div
            onClick={() => setIsFullscreen(true)}
            className="group hover:border-primary-500/50 hover:bg-primary-50/5 dark:hover:border-primary-500/30 relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 dark:border-slate-800 dark:bg-slate-950"
            title="Bấm để mở trình soạn thảo toàn màn hình"
          >
            <div className="max-h-24 overflow-hidden font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-600 select-none dark:text-slate-400">
              {value.slice(0, 360)}
              {value.length > 360 ? '...' : ''}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-xl bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
            <div className="bg-primary-950/5 dark:bg-primary-900/10 absolute inset-0 flex items-center justify-center rounded-xl opacity-0 backdrop-blur-[0.5px] transition-opacity group-hover:opacity-100">
              <span className="text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 flex items-center gap-1.5 rounded-lg border bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-md dark:bg-slate-800/95">
                <Maximize2 className="h-3.5 w-3.5" />
                Mở toàn màn hình để chỉnh sửa
              </span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsFullscreen(true)}
            className="group hover:border-primary-500 hover:bg-primary-50/20 dark:hover:border-primary-500/50 dark:hover:bg-primary-950/20 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-center transition-all duration-200 dark:border-slate-700 dark:bg-slate-950/60"
          >
            <div className="group-hover:text-primary-500 group-hover:border-primary-500/30 rounded-full border border-slate-200 bg-slate-100 p-2.5 text-slate-400 shadow-xs transition-colors dark:border-slate-700 dark:bg-slate-800">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <p className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-sm font-medium text-slate-700 transition-colors dark:text-slate-300">
                Chưa có nội dung bài viết
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Bấm vào đây để mở không gian soạn thảo toàn màn hình (hỗ trợ Live Preview, chèn ảnh,
                phím tắt...)
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return editorContent
}
