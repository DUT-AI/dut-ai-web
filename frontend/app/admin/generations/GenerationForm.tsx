'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, Loader2, Plus, Trash2, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Member } from '@/lib/db/features/users/types'
import type { GenerationAlbum } from '@/lib/db/features/organization/types'
import { saveGenerationAction } from './actions'

type EditorMember = {
  external_user_id: number
  title: string
  display_order: number
  is_featured: boolean
}

type EditorDepartment = {
  key: string
  name: string
  description: string
  accent_color: string
  display_order: number
  members: EditorMember[]
}

function createKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function GenerationForm({
  users,
  initialAlbum,
}: {
  users: Member[]
  initialAlbum?: GenerationAlbum | null
}) {
  const [name, setName] = useState(initialAlbum?.name || '')
  const [slug, setSlug] = useState(initialAlbum?.slug || '')
  const [period, setPeriod] = useState(initialAlbum?.period || '')
  const [description, setDescription] = useState(initialAlbum?.description || '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialAlbum?.cover_image_url || '')
  const [accentColor, setAccentColor] = useState(initialAlbum?.accent_color || '#2563eb')
  const [displayOrder, setDisplayOrder] = useState(initialAlbum?.display_order || 0)
  const [isPublished, setIsPublished] = useState(initialAlbum?.is_published || false)
  const [departments, setDepartments] = useState<EditorDepartment[]>(
    initialAlbum?.departments.map((department) => ({
      key: String(department.id),
      name: department.name,
      description: department.description || '',
      accent_color: department.accent_color,
      display_order: department.display_order,
      members: department.members.map((member) => ({
        external_user_id: member.id,
        title: member.title,
        display_order: member.display_order,
        is_featured: member.is_featured,
      })),
    })) || []
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])

  const updateDepartment = (index: number, patch: Partial<EditorDepartment>) => {
    setDepartments((current) =>
      current.map((department, departmentIndex) =>
        departmentIndex === index ? { ...department, ...patch } : department
      )
    )
  }

  const addDepartment = () => {
    setDepartments((current) => [
      ...current,
      {
        key: createKey(),
        name: '',
        description: '',
        accent_color: accentColor,
        display_order: current.length,
        members: [],
      },
    ])
  }

  const addMember = (departmentIndex: number) => {
    const department = departments[departmentIndex]
    const available = users.find(
      (user) => !department.members.some((member) => member.external_user_id === user.id)
    )
    if (!available) return
    updateDepartment(departmentIndex, {
      members: [
        ...department.members,
        {
          external_user_id: available.id,
          title: 'Thành viên',
          display_order: department.members.length,
          is_featured: false,
        },
      ],
    })
  }

  const updateMember = (
    departmentIndex: number,
    memberIndex: number,
    patch: Partial<EditorMember>
  ) => {
    const department = departments[departmentIndex]
    updateDepartment(departmentIndex, {
      members: department.members.map((member, index) =>
        index === memberIndex ? { ...member, ...patch } : member
      ),
    })
  }

  const uploadCover = async (file?: File) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Upload failed')
      setCoverImageUrl(payload.url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Không thể tải ảnh bìa.')
    } finally {
      setUploading(false)
    }
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    formData.set(
      'payload',
      JSON.stringify({
        name,
        slug,
        period,
        description,
        cover_image_url: coverImageUrl,
        accent_color: accentColor,
        display_order: displayOrder,
        is_published: isPublished,
        departments: departments.map((department, index) => ({
          ...department,
          display_order: index,
          members: department.members.map((member, memberIndex) => ({
            ...member,
            display_order: memberIndex,
          })),
        })),
      })
    )

    startTransition(async () => {
      const result = await saveGenerationAction(null, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {initialAlbum && <input type="hidden" name="id" value={initialAlbum.id} />}
      <input type="hidden" name="payload" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/generations"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
        <Button type="submit" disabled={pending || uploading} className="gap-2 px-6">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialAlbum ? 'Cập nhật album' : 'Tạo album'}
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-6 rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_.8fr] dark:border-white/10 dark:bg-slate-900/80">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Tên thế hệ
            </label>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (!initialAlbum) setSlug(slugify(event.target.value))
              }}
              placeholder="Gen 2"
              className="mt-2"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slug</label>
              <Input
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                placeholder="gen-2"
                className="mt-2 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Niên khóa
              </label>
              <Input
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                placeholder="2025 – 2026"
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Lời giới thiệu
            </label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-2"
              placeholder="Dấu ấn và câu chuyện của thế hệ này..."
            />
          </div>
        </div>

        <div className="space-y-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-950/60">
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ảnh bìa</label>
            <Input
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="https://..."
              className="mt-2"
            />
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => uploadCover(event.target.files?.[0])}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Màu album
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(event) => setAccentColor(event.target.value)}
                  className="h-10 w-12 rounded-lg border-0 bg-transparent"
                />
                <Input
                  value={accentColor}
                  onChange={(event) => setAccentColor(event.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Thứ tự</label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(event) => setDisplayOrder(Number(event.target.value))}
                className="mt-2"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold dark:border-slate-800 dark:bg-slate-900">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            Hiển thị trên trang About
          </label>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              Phòng ban & thành viên
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mỗi thế hệ có thể dùng một cơ cấu hoàn toàn khác nhau.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addDepartment} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm phòng ban
          </Button>
        </div>

        {departments.map((department, departmentIndex) => (
          <article
            key={department.key}
            className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-sm dark:border-white/10 dark:bg-slate-900/80"
          >
            <div className="grid gap-4 border-b border-slate-200 p-5 sm:grid-cols-[1fr_1.5fr_auto] sm:p-6 dark:border-white/10">
              <Input
                value={department.name}
                onChange={(event) =>
                  updateDepartment(departmentIndex, { name: event.target.value })
                }
                placeholder="Tên phòng ban"
                required
              />
              <Input
                value={department.description}
                onChange={(event) =>
                  updateDepartment(departmentIndex, { description: event.target.value })
                }
                placeholder="Mô tả ngắn"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() =>
                  setDepartments((current) =>
                    current.filter((_, index) => index !== departmentIndex)
                  )
                }
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" /> Xóa ban
              </Button>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              {department.members.map((member, memberIndex) => {
                const selectedUser = usersById.get(member.external_user_id)
                return (
                  <div
                    key={`${member.external_user_id}-${memberIndex}`}
                    className="grid items-center gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1.25fr_1fr_auto_auto] dark:bg-slate-950/60"
                  >
                    <select
                      value={member.external_user_id}
                      onChange={(event) =>
                        updateMember(departmentIndex, memberIndex, {
                          external_user_id: Number(event.target.value),
                        })
                      }
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                          {user.status !== 'active' ? ' · OFF' : ''}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={member.title}
                      onChange={(event) =>
                        updateMember(departmentIndex, memberIndex, { title: event.target.value })
                      }
                      placeholder="Chức danh trong gen"
                    />
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${selectedUser?.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                    >
                      {selectedUser?.status === 'active' ? 'ACTIVE' : 'OFF'}
                    </span>
                    <button
                      type="button"
                      aria-label="Xóa thành viên"
                      onClick={() =>
                        updateDepartment(departmentIndex, {
                          members: department.members.filter((_, index) => index !== memberIndex),
                        })
                      }
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addMember(departmentIndex)}
                disabled={users.length === 0}
                className="gap-2"
              >
                <UsersRound className="h-4 w-4" /> Thêm thành viên
              </Button>
            </div>
          </article>
        ))}

        {departments.length === 0 && (
          <button
            type="button"
            onClick={addDepartment}
            className="w-full rounded-3xl border-2 border-dashed border-slate-300 px-6 py-14 text-center text-sm font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700"
          >
            <Plus className="mx-auto mb-3 h-6 w-6" /> Thêm phòng ban đầu tiên
          </button>
        )}
      </section>
    </form>
  )
}
