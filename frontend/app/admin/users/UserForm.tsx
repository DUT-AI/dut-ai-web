'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { saveUserAction } from './actions'
import type { Member } from '@/lib/db/features/users/types'

interface UserFormProps {
  initialUser?: Member | null
}

const ROLES_PRESETS = [
  { name: 'Admin / Chủ nhiệm', roleId: 1, roleName: 'Admin' },
  { name: 'Phó Chủ nhiệm Học thuật', roleId: 1, roleName: 'PCT. Học thuật' },
  { name: 'Phó Chủ nhiệm Sự kiện', roleId: 1, roleName: 'PCT. Sự kiện' },
  { name: 'Leader / Trưởng ban', roleId: 2, roleName: 'Leader' },
  { name: 'Ban Kỹ thuật (Technical)', roleId: 3, roleName: 'Kỹ thuật' },
  { name: 'Ban Truyền thông (Media)', roleId: 3, roleName: 'Truyền thông' },
  { name: 'Ban Sự kiện (Event)', roleId: 3, roleName: 'Sự kiện' },
  { name: 'Thành viên (Member)', roleId: 3, roleName: 'Member' },
]

export default function UserForm({ initialUser }: UserFormProps) {
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [phoneNumber, setPhoneNumber] = useState(initialUser?.phone_number || '')
  const [roleName, setRoleName] = useState(initialUser?.role_name || 'Member')
  const [roleId, setRoleId] = useState<number>(initialUser?.role_id || 3)
  const [status, setStatus] = useState(initialUser?.status || 'active')
  const [avatarUrl, setAvatarUrl] = useState(initialUser?.avatar_url || '')
  const [discordId, setDiscordId] = useState(initialUser?.discord_id || '')

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

      setAvatarUrl(data.url)
    } catch (err: any) {
      alert(`Lỗi upload avatar MinIO: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRolePreset = (presetRoleName: string, presetRoleId: number) => {
    setRoleName(presetRoleName)
    setRoleId(presetRoleId)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('roleId', String(roleId))

    startTransition(async () => {
      const res = await saveUserAction(null, formData)
      if (res?.error) {
        setErrorMessage(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <Button type="submit" disabled={isPending} className="gap-2 px-6">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{initialUser ? 'Cập nhật thành viên' : 'Lưu thành viên'}</span>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-50/80 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {initialUser?.id && <input type="hidden" name="id" value={initialUser.id} />}

      <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin thành viên</h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
            className="mt-2"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@dutai.site"
              className="mt-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Số điện thoại
            </label>
            <Input
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0905123456"
              className="mt-2"
            />
          </div>
        </div>

        {/* Avatar Upload (MinIO S3) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Ảnh đại diện Avatar (MinIO S3)
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <Input
              name="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://minio.dutai.site/..."
              className="flex-1 font-mono text-xs"
            />
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{uploading ? 'Đang tải lên...' : 'Upload Avatar'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {avatarUrl && (
            <div className="mt-3 relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-800">
              <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Role Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Vai trò / Chức vụ trong CLB
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => handleRolePreset(preset.roleName, preset.roleId)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  roleName === preset.roleName
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500">Tên vai trò tùy chỉnh</label>
              <Input
                name="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="VD: Leader AI Lab"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500">Cấp bậc (Role ID: 1-Admin, 2-Leader, 3-Member)</label>
              <Input
                type="number"
                value={roleId}
                onChange={(e) => setRoleId(parseInt(e.target.value, 10))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Trạng thái hoạt động
            </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="active">Đang hoạt động (active)</option>
              <option value="inactive">Đã tốt nghiệp / Không hoạt động (inactive)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Discord ID
            </label>
            <Input
              name="discordId"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              placeholder="dutai_member#1234"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
