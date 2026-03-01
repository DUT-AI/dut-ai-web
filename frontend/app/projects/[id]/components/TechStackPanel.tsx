import type { Project } from 'app/api-client'
import { glassClass } from './styles'

interface TechStackPanelProps {
  project: Project
}

export default function TechStackPanel({ project }: TechStackPanelProps) {
  return (
    <div className={`${glassClass} relative overflow-y-auto h-[700px] lg:h-[800px] rounded-[40px] p-8 sm:p-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`}>
      {/* Left gradient accent */}
      <div
        className="absolute inset-y-0 left-0 w-1.5 rounded-l-[40px]"
        style={{
          background: 'linear-gradient(180deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)',
        }}
      />

      <div className="mb-6">
        <span className="text-3xl">🔥</span>
      </div>

      <h3
        className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
        style={{ lineHeight: '1.111em' }}
      >
        Tech Stack – Công nghệ sử dụng
      </h3>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
            01. FrontEnd
          </h4>
          <ul className="list-inside list-disc space-y-1.5 text-slate-600 dark:text-[#F1F5F9]">
            <li className="text-sm sm:text-base">React / Next.js – Xây dựng giao diện web</li>
            <li className="text-sm sm:text-base">
              TailwindCSS / Prisma – UI hiển thị, responsive
            </li>
            <li className="text-sm sm:text-base">
              Web SpeechAPI – Thư viện xử lý âm thanh/giọng nói
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
            02. BackEnd
          </h4>
          <ul className="list-inside list-disc space-y-1.5 text-slate-600 dark:text-[#F1F5F9]">
            <li className="text-sm sm:text-base">FastAPI / Django Flask Python – Xây API</li>
            <li className="text-sm sm:text-base">PostgreSQL – Hệ CSDL/Frontend à server</li>
            <li className="text-sm sm:text-base">JWT Authentication – Bảo mật người dùng</li>
          </ul>
        </div>
      </div>

      {/* Tags from project */}
      {project.tags && project.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="proj-tag rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
