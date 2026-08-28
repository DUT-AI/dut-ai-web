'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Upload, Loader2, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { saveBlogAction } from './actions'
import type { Blog } from '@/lib/db/features/blogs/types'
import type { Member } from '@/lib/db/features/users/types'
import type { BlogKeyword } from '@/lib/db/features/keywords/types'

interface BlogFormProps {
  initialBlog?: Blog | null
  authors: Member[]
  keywords: BlogKeyword[]
}

export default function BlogForm({ initialBlog, authors, keywords }: BlogFormProps) {
  const [slug, setSlug] = useState(initialBlog?.slug || '')
  const [title, setTitle] = useState(initialBlog?.title || '')
  const [summary, setSummary] = useState(initialBlog?.summary || '')
  const [imageUrl, setImageUrl] = useState(initialBlog?.image_url || '')
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>(
    initialBlog?.authors?.map((a) => a.id) || []
  )
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>(
    initialBlog?.keywords?.map((k) => k.id) || []
  )

  const [uploading, setUploading] = useState(false)
  const [fetchingQuiz, setFetchingQuiz] = useState(false)
  const [quizPreview, setQuizPreview] = useState<{ name?: string; description?: string; content_md?: string; slug?: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Fetch lesson data through the local API proxy.
  const handleFetchFromQuiz = async () => {
    if (!slug.trim()) {
      alert('Vui lòng nhập slug trước khi tìm nạp!')
      return
    }

    setFetchingQuiz(true)
    setErrorMessage(null)
    try {
      const res = await fetch(`/api/lessons/by-slug/${encodeURIComponent(slug.trim())}`)
      if (!res.ok) {
        throw new Error(`Không tìm thấy bài học với slug "${slug}" trên quiz.dutai.site`)
      }
      const data = await res.json()
      setQuizPreview(data)

      // Auto-fill fields from the Quiz API response if they are empty.
      if (!title && data.name) setTitle(data.name)
      if (!summary && data.description) setSummary(data.description)
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi gọi API Quiz.')
    } finally {
      setFetchingQuiz(false)
    }
  }

  // Handle MinIO Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setImageUrl(data.url)
    } catch (err: any) {
      alert(`Lỗi upload ảnh MinIO: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    selectedAuthors.forEach((id) => formData.append('authorIds', String(id)))
    selectedKeywords.forEach((id) => formData.append('keywordIds', String(id)))

    startTransition(async () => {
      const res = await saveBlogAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  const toggleAuthor = (id: number) => {
    setSelectedAuthors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleKeyword = (id: number) => {
    setSelectedKeywords((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <Button type="submit" disabled={isPending} className="gap-2 px-6">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialBlog ? 'Cập nhật bài viết' : 'Lưu bài viết'}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {initialBlog?.id && <input type="hidden" name="id" value={initialBlog.id} />}

      {/* Main Form Fields */}
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Thông tin bài viết & Đồng bộ Quiz
        </h2>

        {/* Slug input + Sync Button */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Slug bài học (từ quiz.dutai.site) <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex gap-3">
            <Input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="nhap-mon-machine-learning"
              required
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleFetchFromQuiz}
              disabled={fetchingQuiz}
              className="gap-2 whitespace-nowrap"
            >
              {fetchingQuiz ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-blue-600" />
              )}
              <span>Tìm nạp từ Quiz</span>
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Nội dung bài viết sẽ được tự động stream trực tiếp từ Quiz API khi độc giả truy cập.
          </p>
        </div>

        {/* Quiz Preview Box */}
        {quizPreview && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-50/50 p-5 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                ✓ Dữ liệu tìm nạp thành công từ Quiz API
              </span>
              <span className="text-xs font-mono text-slate-400">{quizPreview.slug}</span>
            </div>
            <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
              {quizPreview.name}
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {quizPreview.description}
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tiêu đề hiển thị trên Web <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập môn Machine Learning cơ bản..."
            required
            className="mt-2"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tóm tắt ngắn (Summary)
          </label>
          <Textarea
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Tóm tắt ngắn gọn nội dung bài viết hiển thị ở trang danh sách..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Image Upload (MinIO S3) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ảnh bìa bài viết (MinIO S3)
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <Input
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://minio.dutai.site/..."
              className="flex-1 font-mono text-xs"
            />
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{uploading ? 'Đang tải lên MinIO...' : 'Upload ảnh'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {imageUrl && (
            <div className="mt-3 relative h-36 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <img src={imageUrl} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Select Authors */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Gán tác giả (Thành viên CLB)
          </label>
          <div className="mt-2 flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            {authors.map((author) => {
              const selected = selectedAuthors.includes(author.id)
              return (
                <button
                  type="button"
                  key={author.id}
                  onClick={() => toggleAuthor(author.id)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {selected ? '✓ ' : '+ '}
                  {author.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Select Keywords */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Từ khóa SEO (Keywords)
          </label>
          <div className="mt-2 flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            {keywords.map((kw) => {
              const selected = selectedKeywords.includes(kw.id)
              return (
                <button
                  type="button"
                  key={kw.id}
                  onClick={() => toggleKeyword(kw.id)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    selected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {selected ? '✓ ' : '# '}
                  {kw.keyword_name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </form>
  )
}
