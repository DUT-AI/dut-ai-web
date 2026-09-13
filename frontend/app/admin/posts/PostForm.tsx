'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { savePostAction } from '../events/actions'
import type { Post } from '@/lib/db/features/events/types'

interface PostFormProps {
  initialPost?: Post | null
}

export default function PostForm({ initialPost }: PostFormProps) {
  const [title, setTitle] = useState(initialPost?.title || '')
  const [summary, setSummary] = useState(initialPost?.summary || '')
  const [description, setDescription] = useState(initialPost?.description || '')
  const [hashtag, setHashtag] = useState(initialPost?.hashtag || '')
  const [facebookUrl, setFacebookUrl] = useState(initialPost?.facebook_url || '')
  const [eventsDate, setEventsDate] = useState(
    initialPost?.events_date ? initialPost.events_date.replace(' ', 'T').slice(0, 16) : ''
  )
  const [imgUrls, setImgUrls] = useState(initialPost?.img_urls?.join('\n') || '')

  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Handle MinIO Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    e.target.value = ''

    setUploading(true)
    setErrorMessage(null)
    const uploadedUrls: string[] = []
    const failedFiles: string[] = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'moments')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        uploadedUrls.push(data.url)
      } catch {
        failedFiles.push(file.name)
      }
    }

    if (uploadedUrls.length > 0) {
      setImgUrls((previous) => {
        const urls = previous.split('\n').map((url) => url.trim()).filter(Boolean)
        return [...new Set([...urls, ...uploadedUrls])].join('\n')
      })
    }
    if (failedFiles.length > 0) {
      setErrorMessage(`Không thể upload: ${failedFiles.join(', ')}`)
    }
    setUploading(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await savePostAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  const urlList = imgUrls.split('\n').map((u) => u.trim()).filter(Boolean)

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <Button type="submit" disabled={isPending || uploading} className="gap-2 px-6">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialPost ? 'Cập nhật khoảnh khắc' : 'Lưu khoảnh khắc'}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {initialPost?.id && <input type="hidden" name="id" value={initialPost.id} />}

      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin khoảnh khắc</h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tiêu đề khoảnh khắc <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kỷ niệm ngày thành lập DUT AI Club..."
            required
            maxLength={255}
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mô tả chi tiết
          </label>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả đầy đủ về hoạt động và những khoảnh khắc trong album..."
            rows={4}
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mô tả / Tóm tắt
          </label>
          <Textarea
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Những kỷ niệm khó quên cùng các thành viên..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Multiple Images Upload (MinIO S3) */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Danh sách URLs ảnh (Mỗi link một dòng)
            </label>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>{uploading ? 'Đang tải lên...' : '+ Upload thêm ảnh lên MinIO'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <Textarea
            name="imgUrls"
            value={imgUrls}
            onChange={(e) => setImgUrls(e.target.value)}
            placeholder="https://minio.dutai.site/...\nhttps://minio.dutai.site/..."
            rows={4}
            className="mt-2 font-mono text-xs"
          />

          {urlList.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {urlList.map((url, idx) => (
                <div key={idx} className="relative h-20 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Thời gian
            </label>
            <Input
              type="datetime-local"
              name="eventsDate"
              value={eventsDate}
              onChange={(e) => setEventsDate(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Hashtag (#)
            </label>
            <Input
              name="hashtag"
              value={hashtag}
              maxLength={255}
              onChange={(e) => setHashtag(e.target.value)}
              placeholder="#dutaiclub #welcome_newbie"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Link Facebook Post
          </label>
          <Input
            name="facebookUrl"
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="https://facebook.com/dutaiclub/posts/..."
            className="mt-2"
          />
        </div>
      </div>
    </form>
  )
}
