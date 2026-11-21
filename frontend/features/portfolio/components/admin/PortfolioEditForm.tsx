'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Globe,
  Eye,
  Check,
  Cpu,
  Wrench,
} from 'lucide-react'
import { isValidUsernameFormat } from '@/lib/portfolio/username-generator'
import { isReservedUsername } from '@/lib/portfolio/reserved-usernames'
import {
  PREDEFINED_TECHSTACK,
  PREDEFINED_TOOLSTACK,
} from '@/features/portfolio/constants/predefined-skills'
import TechIcon from '@/features/portfolio/components/TechIcons'
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
  const [isPublic, setIsPublic] = useState(initialData.is_public ?? true)

  // Parse initial skills into selected tech items & tool items
  const initialSkills = initialData.skills || []
  const initialTech: string[] = []
  const initialTools: string[] = []

  initialSkills.forEach((cat) => {
    const isTool = /tool|công cụ|ide|platform|os|devops/i.test(cat.category)
    if (isTool) {
      initialTools.push(...cat.items)
    } else {
      initialTech.push(...cat.items)
    }
  })

  // Selected tech & tools states
  const [selectedTech, setSelectedTech] = useState<string[]>(
    Array.from(
      new Set(initialTech.length > 0 ? initialTech : ['Python', 'TypeScript', 'React', 'Node.js'])
    )
  )
  const [selectedTools, setSelectedTools] = useState<string[]>(
    Array.from(
      new Set(initialTools.length > 0 ? initialTools : ['VS Code', 'Postman', 'Git', 'Docker'])
    )
  )

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Username validation helper
  const usernameClean = username.trim().toLowerCase()
  const isUsernameValid = isValidUsernameFormat(usernameClean)
  const isReserved = isReservedUsername(usernameClean)

  const toggleTech = (name: string) => {
    if (selectedTech.includes(name)) {
      setSelectedTech(selectedTech.filter((t) => t !== name))
    } else {
      setSelectedTech([...selectedTech, name])
    }
  }

  const toggleTool = (name: string) => {
    if (selectedTools.includes(name)) {
      setSelectedTools(selectedTools.filter((t) => t !== name))
    } else {
      setSelectedTools([...selectedTools, name])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isUsernameValid) {
      setError(
        'Tên người dùng không hợp lệ. Chỉ chấp nhận chữ thường, số, dấu - hoặc _ (3-30 ký tự).'
      )
      return
    }

    if (isReserved) {
      setError(
        `Tên người dùng "${usernameClean}" bị giới hạn bởi hệ thống. Vui lòng chọn tên khác.`
      )
      return
    }

    // Format skills back to category structure for database
    const formattedSkills: SkillCategory[] = [
      {
        category: 'Professional Skillset',
        items: selectedTech,
      },
      {
        category: 'Tools I Use',
        items: selectedTools,
      },
    ]

    try {
      setIsSaving(true)
      const res = await fetch('/api/members/me/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameClean,
          headline: headline.trim() || null,
          quote: quote.trim() || null,
          bio: bio.trim() || null,
          avatarUrl: avatarUrl.trim() || null,
          githubUrl: githubUrl.trim() || null,
          linkedinUrl: linkedinUrl.trim() || null,
          facebookUrl: facebookUrl.trim() || null,
          websiteUrl: websiteUrl.trim() || null,
          skills: formattedSkills,
          isPublic,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Cập nhật hồ sơ thất bại.')
      }

      setSuccess('Cập nhật hồ sơ thành công!')
      if (onSaved) onSaved()
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
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
              GitHub URL / Username
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/phuocnguyen2412"
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

      {/* 3. Predefined Skills & Tools Selector */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Kỹ năng & Công cụ lập trình (Skillset & Tools)
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Chọn trực tiếp từ danh mục công nghệ có sẵn chuẩn hệ thống (tự động hiển thị icon tương
          ứng trên trang cá nhân).
        </p>

        {/* Section A: Professional Skillset */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span>Professional Skillset (Ngôn ngữ, Framework, AI, DB)</span>
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Đã chọn: {selectedTech.length}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PREDEFINED_TECHSTACK.map((tech) => {
              const isSelected = selectedTech.includes(tech.name)
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.name)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500/50'
                  }`}
                >
                  <TechIcon
                    name={tech.name}
                    mini
                    className={isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}
                  />
                  <span>{tech.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section B: Tools I Use */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Wrench className="h-4 w-4 text-blue-500" />
              <span>Tools I Use (IDE, Môi trường, Nền tảng, OS)</span>
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Đã chọn: {selectedTools.length}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PREDEFINED_TOOLSTACK.map((tool) => {
              const isSelected = selectedTools.includes(tool.name)
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.name)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500/50'
                  }`}
                >
                  <TechIcon
                    name={tool.name}
                    mini
                    className={isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}
                  />
                  <span>{tool.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. Privacy & Save */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isPublic"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Công khai trang hồ sơ cá nhân ra bên ngoài (Public Portfolio)
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <span>Lưu thay đổi</span>
          )}
        </button>
      </div>
    </form>
  )
}
