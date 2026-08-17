'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Upload, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { saveProjectAction } from './actions'
import type { Project } from '@/lib/db/features/projects/types'
import type { Member } from '@/lib/db/features/users/types'

const AVAILABLE_ROLES = [
  'Project Manager',
  'AI Developer',
  'FrontEnd Developer',
  'BackEnd Developer',
  'Designer',
  'Business Analysis',
]

interface ProjectFormProps {
  initialProject?: Project | null
  allMembers: Member[]
}

export default function ProjectForm({ initialProject, allMembers }: ProjectFormProps) {
  const [title, setTitle] = useState(initialProject?.title || '')
  const [description, setDescription] = useState(initialProject?.description || '')
  const [imageUrl, setImageUrl] = useState(initialProject?.image_url || '')
  const [features, setFeatures] = useState(initialProject?.features || '')
  const [technologies, setTechnologies] = useState(initialProject?.technologies || '')
  const [demoUrl, setDemoUrl] = useState(initialProject?.demo_url || '')
  const [videoUrl, setVideoUrl] = useState(initialProject?.video_url || '')

  const [membersList, setMembersList] = useState<{ userId: number; role: string }[]>(
    initialProject?.members?.map((m) => ({
      userId: m.user_id || m.id,
      role: m.role || 'AI Developer',
    })) || []
  )

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

      setImageUrl(data.url)
    } catch (err: any) {
      alert(`Lỗi upload ảnh MinIO: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const addMemberRow = () => {
    if (allMembers.length === 0) return
    setMembersList((prev) => [...prev, { userId: allMembers[0].id, role: 'AI Developer' }])
  }

  const removeMemberRow = (index: number) => {
    setMembersList((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateMemberRow = (index: number, field: 'userId' | 'role', value: any) => {
    setMembersList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    membersList.forEach((m) => {
      formData.append('userIds', String(m.userId))
      formData.append('roles', m.role)
    })

    startTransition(async () => {
      const res = await saveProjectAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <Button type="submit" disabled={isPending} className="gap-2 px-6">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialProject ? 'Cập nhật dự án' : 'Lưu dự án'}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {initialProject?.id && <input type="hidden" name="id" value={initialProject.id} />}

      {/* Main Info Card */}
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin dự án</h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tên dự án <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Hệ thống AI Điểm danh thông minh..."
            required
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mô tả dự án
          </label>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả mục tiêu, giá trị và cách hoạt động của dự án..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Image Upload (MinIO S3) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ảnh đại diện dự án (MinIO S3)
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
              <img src={imageUrl} alt="Project preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Tính năng nổi bật (Features)
            </label>
            <Textarea
              name="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Mỗi tính năng trên một dòng hoặc phân cách bởi dấu phẩy..."
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Công nghệ sử dụng (Technologies)
            </label>
            <Textarea
              name="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="PyTorch, FastAPI, Next.js, Docker, OpenCV..."
              rows={3}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Demo URL / Website Link
            </label>
            <Input
              name="demoUrl"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://demo.dutai.site/..."
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Video Showcase URL (Youtube/Drive)
            </label>
            <Input
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Project Members Role Assignment */}
      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Thành viên tham gia dự án
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gán thành viên và vai trò tương ứng trong dự án
            </p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={addMemberRow} className="gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm thành viên</span>
          </Button>
        </div>

        <div className="space-y-3">
          {membersList.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <select
                value={row.userId}
                onChange={(e) => updateMemberRow(idx, 'userId', parseInt(e.target.value, 10))}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role_name})
                  </option>
                ))}
              </select>

              <select
                value={row.role}
                onChange={(e) => updateMemberRow(idx, 'role', e.target.value)}
                className="w-48 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeMemberRow(idx)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {membersList.length === 0 && (
            <div className="text-center py-6 text-sm text-slate-400">
              Chưa gán thành viên nào. Bấm &quot;Thêm thành viên&quot; để gán thành viên vào dự án.
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
