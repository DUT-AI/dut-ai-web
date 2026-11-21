'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit3, ExternalLink, Github, Loader2 } from 'lucide-react'
import type { UserPortfolioProjectModel } from '@/features/users/db/types'

export interface PersonalProjectsManagerProps {
  initialProjects: UserPortfolioProjectModel[]
  onProjectsChanged: () => void
}

export default function PersonalProjectsManager({
  initialProjects,
  onProjectsChanged,
}: PersonalProjectsManagerProps) {
  const [projects, setProjects] = useState<UserPortfolioProjectModel[]>(initialProjects || [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<UserPortfolioProjectModel | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [technologies, setTechnologies] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openAddModal = () => {
    setEditingProject(null)
    setTitle('')
    setDescription('')
    setImageUrl('')
    setDemoUrl('')
    setRepoUrl('')
    setTechnologies('')
    setError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (p: UserPortfolioProjectModel) => {
    setEditingProject(p)
    setTitle(p.title)
    setDescription(p.description || '')
    setImageUrl(p.imageUrl || '')
    setDemoUrl(p.demoUrl || '')
    setRepoUrl(p.repoUrl || '')
    setTechnologies(p.technologies || '')
    setError(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tiêu đề dự án không được để trống')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        repo_url: repoUrl.trim() || null,
        technologies: technologies.trim() || null,
      }

      if (editingProject) {
        // Update
        const res = await fetch(`/api/members/me/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Không thể cập nhật dự án')
      } else {
        // Create
        const res = await fetch('/api/members/me/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Không thể thêm dự án')
      }

      setIsModalOpen(false)
      onProjectsChanged()

      // Refresh list
      const updatedRes = await fetch('/api/members/me/projects')
      if (updatedRes.ok) {
        const list = await updatedRes.json()
        setProjects(list)
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu dự án')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này không?')) return

    try {
      const res = await fetch(`/api/members/me/projects/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
        onProjectsChanged()
      }
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dự án cá nhân</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bổ sung các dự án độc lập, đồ án nghiên cứu hoặc hackathon cá nhân của bạn.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Thêm dự án
        </button>
      </div>

      {/* Projects List */}
      <div className="mt-6 space-y-4">
        {projects.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Chưa có dự án cá nhân nào. Nhấp "Thêm dự án" để bắt đầu!
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{p.title}</h4>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                    {p.description}
                  </p>
                )}
                {p.technologies && (
                  <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                    {p.technologies}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-500 hover:text-blue-600"
                    title="Live Demo"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    title="Repository"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Chỉnh sửa"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Xóa dự án"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              {editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h4>

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Tên dự án *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Công nghệ sử dụng (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="VD: Next.js, PyTorch, Tailwind CSS"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Demo Link
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Repo Link
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Lưu dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
