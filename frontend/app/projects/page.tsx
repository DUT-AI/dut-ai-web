import { getProjectsCached as getProjects } from '@/lib/db/cached-queries'
import type { Project } from '@/lib/db/features/projects/types'
import { genPageMetadata } from 'app/seo'
import ProjectsListClient from './ProjectsListClient'
import Footer from '@/components/Footer'

export const metadata = genPageMetadata({
  title: 'Dự án',
  description:
    'Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người. Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI.',
  keywords: [
    'dự án AI',
    'AI project sinh viên',
    'Machine Learning project DUT',
    'ứng dụng AI Đà Nẵng',
  ],
  path: '/projects',
})

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  let projects: Project[] = []
  let error = false

  try {
    projects = await getProjects()
  } catch {
    error = true
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-[100%] bg-purple-300/40 blur-[100px] dark:bg-purple-900/40" />
        <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[120px] dark:bg-blue-900/30" />
        <div className="absolute -right-[10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-fuchsia-300/30 blur-[120px] dark:bg-fuchsia-900/20" />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-32 pb-16 text-center sm:pt-40">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-5 py-2.5 shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
          <span className="text-[13px] font-black tracking-[0.15em] text-blue-700 uppercase dark:text-blue-200">
            OUR PORTFOLIO
          </span>
        </div>

        <h1
          className="mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl md:text-7xl lg:text-[84px] dark:from-blue-100 dark:via-white dark:to-pink-200"
          style={{ letterSpacing: '-0.03em', lineHeight: '1.05' }}
        >
          Next-Gen <br />
          AI Innovations
        </h1>

        <p className="mx-auto max-w-[700px] px-4 text-[17px] leading-[1.7] font-medium text-gray-600 md:text-[19px] dark:text-slate-300">
          Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người.
          <br className="hidden md:block" />
          Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-[1220px] px-6 md:px-8">
          <div className="mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
            <p className="text-lg text-slate-200">
              Không thể kết nối đến server. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      )}

      {/* Interactive content */}
      {!error && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <span className="mb-4 text-6xl">📦</span>
          <p className="text-lg font-semibold">Chưa có dự án nào.</p>
        </div>
      ) : (
        !error && <ProjectsListClient initialProjects={projects} />
      )}
      <Footer />
    </div>
  )
}
