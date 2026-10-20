'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
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
  const [mounted, setMounted] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      )
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
          ? 'fixed inset-0 z-[99999] flex flex-col bg-white dark:bg-slate-950 h-screen w-screen overflow-hidden'
          : 'flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500'
      }
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-gray-50/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            title="Đậm (Bold)"
            onClick={() => insertText('**', '**', 'văn bản đậm')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Nghiêng (Italic)"
            onClick={() => insertText('*', '*', 'văn bản nghiêng')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Italic className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
          <button
            type="button"
            title="Tiêu đề 1"
            onClick={() => insertText('# ', '', 'Tiêu đề lớn')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Tiêu đề 2"
            onClick={() => insertText('## ', '', 'Tiêu đề phụ')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Tiêu đề 3"
            onClick={() => insertText('### ', '', 'Tiêu đề nhỏ')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
          <button
            type="button"
            title="Danh sách gạch đầu dòng"
            onClick={() => insertText('- ', '', 'Mục')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Danh sách số"
            onClick={() => insertText('1. ', '', 'Mục đầu tiên')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Task list"
            onClick={() => insertText('- [ ] ', '', 'Công việc')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
          <button
            type="button"
            title="Trích dẫn (Quote)"
            onClick={() => insertText('> ', '', 'Đoạn trích dẫn')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Khối mã (Code block)"
            onClick={() => insertText('```python\n', '\n```', '# Viết mã tại đây')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Bảng (Table)"
            onClick={() =>
              insertText(
                '| Tiêu đề 1 | Tiêu đề 2 |\n|---|---|\n| Nội dung A | Nội dung B |\n',
                ''
              )
            }
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Chèn liên kết"
            onClick={() => insertText('[', '](https://example.com)', 'Tiêu đề liên kết')}
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Upload and insert image */}
          <button
            type="button"
            title="Tải ảnh chèn vào bài viết"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition font-medium"
          >
            {uploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
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
          <div className="flex items-center bg-gray-200/60 dark:bg-gray-800/80 rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                viewMode === 'write'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Soạn thảo</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Hai cột</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước</span>
            </button>
          </div>

          {/* Fullscreen toggle button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              isFullscreen
                ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thu nhỏ (Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body (Write / Split / Preview) */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800 ${
          isFullscreen ? 'flex-1 min-h-0 overflow-hidden' : ''
        }`}
        style={isFullscreen ? undefined : { minHeight }}
      >
        {/* Editor Pane */}
        {(viewMode === 'write' || viewMode === 'split') && (
          <div
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'write' ? 'md:col-span-2' : 'col-span-1'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full h-full p-4 sm:p-6 text-sm sm:text-base font-mono leading-relaxed bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none ${
                isFullscreen ? 'resize-none overflow-y-auto' : 'min-h-[400px] resize-y'
              }`}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex flex-col p-6 sm:p-8 overflow-y-auto bg-gray-50/40 dark:bg-gray-900/30 ${
              viewMode === 'preview' ? 'md:col-span-2' : 'col-span-1'
            }`}
          >
            <div className="flex items-center justify-between text-xs uppercase font-semibold tracking-wider text-gray-400 dark:text-gray-500 mb-4 pb-2 border-b border-gray-200/60 dark:border-gray-800/60">
              <span>Xem trước trực tiếp (Live Preview)</span>
              {isFullscreen && (
                <span className="text-[10px] lowercase font-normal text-gray-400">
                  (nhấn Esc để thu nhỏ)
                </span>
              )}
            </div>
            {value.trim() ? (
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base leading-relaxed break-words">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-sm italic text-gray-400 dark:text-gray-600 flex items-center justify-center h-48">
                Nội dung xem trước sẽ hiển thị tại đây khi bạn nhập Markdown...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word / Character count footer */}
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div>
          <span>{value.length} ký tự</span>
          <span className="mx-2">•</span>
          <span>{value.trim() ? value.trim().split(/\s+/).length : 0} từ</span>
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-[11px] hidden sm:block">
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
          className="rounded-2xl border-2 border-dashed border-primary-500/30 bg-primary-50/10 dark:bg-primary-950/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2.5"
        >
          <div className="rounded-full bg-primary-100 dark:bg-primary-900/40 p-2.5 text-primary-600 dark:text-primary-400">
            <Maximize2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Trình soạn thảo đang mở ở chế độ Toàn màn hình
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> hoặc nút "Thu nhỏ" để quay lại đây
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="gap-1.5 text-xs mt-1"
          >
            <Minimize2 className="w-3.5 h-3.5" />
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
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 sm:p-5 space-y-3.5 transition-all">
        {/* Header row with stats & primary Fullscreen action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Không gian soạn thảo Markdown
                </span>
                {hasContent ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Đã có nội dung
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Chưa nhập
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hasContent
                  ? `${charCount.toLocaleString()} ký tự • ${wordCount.toLocaleString()} từ • Bấm để mở rộng toàn màn hình`
                  : 'Trình soạn thảo được ẩn ở form để tối ưu diện tích. Bấm mở toàn màn hình để bắt đầu.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-xs self-start sm:self-auto transition-all hover:shadow"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{hasContent ? 'Chỉnh sửa toàn màn hình' : 'Mở toàn màn hình'}</span>
          </Button>
        </div>

        {/* Content Preview Box or Empty State Clickable Box */}
        {hasContent ? (
          <div
            onClick={() => setIsFullscreen(true)}
            className="group relative cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-all duration-200 hover:border-primary-500/50 hover:bg-primary-50/5 dark:hover:border-primary-500/30"
            title="Bấm để mở trình soạn thảo toàn màn hình"
          >
            <div className="max-h-24 overflow-hidden text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed select-none whitespace-pre-wrap">
              {value.slice(0, 360)}
              {value.length > 360 ? '...' : ''}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none rounded-b-xl" />
            <div className="absolute inset-0 bg-primary-950/5 dark:bg-primary-900/10 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 text-xs font-semibold text-primary-600 dark:text-primary-400 shadow-md border border-primary-200 dark:border-primary-800">
                <Maximize2 className="w-3.5 h-3.5" />
                Mở toàn màn hình để chỉnh sửa
              </span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsFullscreen(true)}
            className="group cursor-pointer rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-950/60 p-6 flex flex-col items-center justify-center text-center gap-2 hover:border-primary-500 hover:bg-primary-50/20 dark:hover:border-primary-500/50 dark:hover:bg-primary-950/20 transition-all duration-200"
          >
            <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-primary-500 group-hover:border-primary-500/30 transition-colors">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Chưa có nội dung bài viết
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bấm vào đây để mở không gian soạn thảo toàn màn hình (hỗ trợ Live Preview, chèn ảnh, phím tắt...)
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return editorContent
}
