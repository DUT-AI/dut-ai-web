'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader2, Plus, X, Globe, Eye } from 'lucide-react'
import { isValidUsernameFormat } from '@/lib/portfolio/username-generator'
import { isReservedUsername } from '@/lib/portfolio/reserved-usernames'
import type { SkillCategory, UserCv } from '@/features/users/db/types'

export interface PortfolioEditFormProps {
  initialData: Partial<UserCv>
  onSaved?: () => void
}

export default function PortfolioEditForm({ initialData, onSaved }: PortfolioEditFormProps) {
  const [username, setUsername] = useState(initialData.username || '')
  const [headline, setHeadline] = useState(initialData.headline || '')
  const [quote, setQuote] = useState(initialData.quote || '')
  const [bio, setBio] = useState(initialData.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url || '')
  const [githubUrl, setGithubUrl] = useState(initialData.github_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedin_url || '')
  const [facebookUrl, setFacebookUrl] = useState(initialData.facebook_url || '')
  const [websiteUrl, setWebsiteUrl] = useState(initialData.website_url || '')
  const [skills, setSkills] = useState<SkillCategory[]>(initialData.skills || [])
  const [isPublic, setIsPublic] = useState(initialData.is_public ?? true)

  // Skill category state
  const [newCatName, setNewCatName] = useState('')
  const [newSkillText, setNewSkillText] = useState<{ [catIdx: number]: string }>({})

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Username validation helper
  const usernameClean = username.trim().toLowerCase()
  const isUsernameValid = isValidUsernameFormat(usernameClean)
  const isReserved = isReservedUsername(usernameClean)

  const handleAddCategory = () => {
    if (!newCatName.trim()) return
    setSkills([...skills, { category: newCatName.trim(), items: [] }])
    setNewCatName('')
  }

  const handleRemoveCategory = (catIdx: number) => {
    setSkills(skills.filter((_, idx) => idx !== catIdx))
  }

  const handleAddSkill = (catIdx: number) => {
    const text = (newSkillText[catIdx] || '').trim()
    if (!text) return
    const updated = [...skills]
    if (!updated[catIdx].items.includes(text)) {
      updated[catIdx].items.push(text)
    }
    setSkills(updated)
    setNewSkillText({ ...newSkillText, [catIdx]: '' })
  }

  const handleRemoveSkill = (catIdx: number, skillIdx: number) => {
    const updated = [...skills]
    updated[catIdx].items = updated[catIdx].items.filter((_, idx) => idx !== skillIdx)
    setSkills(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isUsernameValid) {
      setError('Username phải từ 3-30 ký tự, chỉ gồm chữ thường, số, dấu _ hoặc -')
      return
    }

    if (isReserved) {
      setError('Username này thuộc danh sách từ khóa hệ thống, vui lòng chọn tên khác')
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch('/api/members/me/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameClean,
          headline: headline || null,
          quote: quote || null,
          bio: bio || null,
          avatar_url: avatarUrl || null,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          facebook_url: facebookUrl || null,
          website_url: websiteUrl || null,
          skills,
          is_public: isPublic,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Cập nhật hồ sơ thất bại')
      }

      setSuccess('Cập nhật hồ sơ portfolio thành công!')
      if (onSaved) onSaved()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu hồ sơ')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Basic Info & Username */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông tin cơ bản</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Định danh trang cá nhân và tiêu đề chuyên môn của bạn.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Username */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Đường dẫn Portfolio (Username) *
            </label>
            <div className="mt-2 flex items-center rounded-xl border border-gray-300 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white dark:border-gray-700 dark:bg-gray-800/50">
              <span className="pl-4 text-sm text-gray-500 dark:text-gray-400">
                dutai.io.vn/members/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                placeholder="phuoc-nguyen"
                className="w-full bg-transparent px-2 py-2.5 text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
              />
            </div>
            {usernameClean && (
              <p
                className={`mt-1.5 text-xs ${
                  isUsernameValid && !isReserved
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-500'
                }`}
              >
                {!isUsernameValid
                  ? '⚠️ Yêu cầu: 3-30 ký tự, chữ thường, số, - hoặc _'
                  : isReserved
                    ? '❌ Tên này thuộc từ khóa hệ thống, vui lòng chọn tên khác'
                    : '✓ Định dạng hợp lệ'}
              </p>
            )}
          </div>

          {/* Headline */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chức danh / Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="VD: Fullstack AI Engineer | DUT AI Core Member"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Quote */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Châm ngôn / Quote
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="VD: Học hỏi không ngừng, chia sẻ đam mê."
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tiểu sử chi tiết (Bio)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Giới thiệu về kinh nghiệm, định hướng học tập và mục tiêu nghiên cứu của bạn..."
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Social Links */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Liên kết Mạng xã hội</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Giúp nhà tuyển dụng và cộng đồng dễ dàng kết nối với bạn.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              Facebook URL
            </label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/username"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
              Website / Blog cá nhân
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourdomain.com"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Skills Manager */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kỹ năng chuyên môn</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nhóm kỹ năng theo danh mục (ví dụ: Languages, Frameworks, Tools).
        </p>

        {/* Existing Categories */}
        <div className="mt-6 space-y-6">
          {skills.map((cat, catIdx) => (
            <div
              key={catIdx}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {cat.category}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(catIdx)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Xóa nhóm
                </button>
              </div>

              {/* Tag Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.items.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(catIdx, sIdx)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill to category */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newSkillText[catIdx] || ''}
                  onChange={(e) => setNewSkillText({ ...newSkillText, [catIdx]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill(catIdx)
                    }
                  }}
                  placeholder="Thêm kỹ năng (nhấn Enter)..."
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(catIdx)}
                  className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                >
                  Thêm
                </button>
              </div>
            </div>
          ))}

          {/* Create new category */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Tên nhóm kỹ năng mới (VD: AI / Machine Learning)"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              Tạo nhóm
            </button>
          </div>
        </div>
      </div>

      {/* 4. Visibility Toggle & Save Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Công khai trang portfolio này cho mọi người xem
          </span>
        </label>

        <div className="flex items-center gap-3">
          {usernameClean && isUsernameValid && (
            <a
              href={`/members/${usernameClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <Eye className="h-4 w-4" />
              Xem trang
            </a>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </form>
  )
}
