'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { savePublicEventAction } from './actions'
import type { PublicEvent } from '@/lib/db/features/events/types'

interface PublicEventFormProps {
  initialEvent?: PublicEvent | null
}

export default function PublicEventForm({ initialEvent }: PublicEventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title || '')
  const [summary, setSummary] = useState(initialEvent?.summary || '')
  const [description, setDescription] = useState(initialEvent?.description || '')
  const [imgUrl, setImgUrl] = useState(initialEvent?.img_url || '')
  const [location, setLocation] = useState(initialEvent?.location || '')
  const [registerLink, setRegisterLink] = useState(initialEvent?.register_link || '')
  const [facebookUrl, setFacebookUrl] = useState(initialEvent?.facebook_url || '')
  const [eventsDate, setEventsDate] = useState(
    initialEvent?.events_date ? initialEvent.events_date.replace(' ', 'T').slice(0, 16) : ''
  )
  const [tags, setTags] = useState(initialEvent?.tags?.join(', ') || '')

  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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

      setImgUrl(data.url)
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

    startTransition(async () => {
      const res = await savePublicEventAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <Button type="submit" disabled={isPending} className="gap-2 px-6">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialEvent ? 'Cập nhật sự kiện' : 'Lưu sự kiện'}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {initialEvent?.id && <input type="hidden" name="id" value={initialEvent.id} />}

      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin sự kiện</h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tên sự kiện <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="AI Summit 2026 • Workshop Deep Learning..."
            required
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tóm tắt ngắn (Summary)
          </label>
          <Textarea
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Tóm tắt ngắn về sự kiện hiển thị ở trang chủ..."
            rows={2}
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
            placeholder="Lịch trình chi tiết, diễn giả, nội dung chương trình..."
            rows={4}
            className="mt-2"
          />
        </div>

        {/* Image Upload (MinIO S3) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ảnh sự kiện (MinIO S3)
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <Input
              name="imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
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
          {imgUrl && (
            <div className="mt-3 relative h-36 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <img src={imgUrl} alt="Event preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Thời gian diễn ra
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
              Địa điểm tổ chức
            </label>
            <Input
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Hội trường F, Đại học Bách Khoa..."
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Link đăng ký tham gia (Form)
            </label>
            <Input
              name="registerLink"
              value={registerLink}
              onChange={(e) => setRegisterLink(e.target.value)}
              placeholder="https://forms.gle/..."
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Link bài viết Facebook
            </label>
            <Input
              name="facebookUrl"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/dutaiclub/posts/..."
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tags (Phân cách bởi dấu phẩy)
          </label>
          <Input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="AI, Workshop, SinhVien, BKU"
            className="mt-2"
          />
        </div>
      </div>
    </form>
  )
}
