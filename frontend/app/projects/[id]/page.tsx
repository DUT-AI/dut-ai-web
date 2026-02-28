import { getProjects, getMembers, Project, Member } from 'app/api-client'
import { genPageMetadata } from 'app/seo'
import ProjectsClient from './ProjectsClient'
import Footer from '@/components/Footer'

export const metadata = genPageMetadata({
  title: 'Projects',
  description: 'Các dự án AI và công nghệ được phát triển bởi thành viên DUT AI Club.',
  keywords: [
    'dự án AI',
    'AI project sinh viên',
    'Machine Learning project DUT',
    'ứng dụng AI Đà Nẵng',
  ],
})

export const revalidate = 600

export default async function Projects(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const initialProjectId = parseInt(params.id, 10)

  let projects: Project[] = []
  let members: Member[] = []
  let error = false

  try {
    ;[projects, members] = await Promise.all([getProjects(), getMembers()])
  } catch {
    error = true
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 0% 0%, #1E293B 0%, #334155 25%, #701A75 75%, #4C1D95 100%)',
      }}
    >
      {/* ── Hero ── */}
      <section className="relative px-6 pt-10 pb-6 sm:pt-14 md:px-8 md:pt-32 lg:pt-36">
        <div className="mx-auto max-w-[1220px]">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-center lg:gap-12">
            <div className="relative hidden lg:block">
              <div
                className="h-[280px] w-[600px] rounded-3xl opacity-50 xl:h-[370px] xl:w-[805px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%)',
                  boxShadow: '0 1px 1px 0 rgba(0,0,0,0.05)',
                }}
              />
            </div>
            <h1
              className="max-w-[725px] text-5xl font-extrabold text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]"
              style={{
                fontFamily: 'var(--font-inter)',
                lineHeight: '0.96em',
                letterSpacing: '-0.023em',
              }}
            >
              DUT AI <br className="hidden sm:block" />
              Handpicked Projects
            </h1>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-[1220px] px-6 md:px-8">
          <div className="mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
            <p className="text-lg text-slate-200" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Không thể kết nối đến server. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {projects.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <span className="mb-4 text-6xl">📦</span>
          <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Chưa có dự án nào.
          </p>
        </div>
      )}

      {/* Interactive content */}
      {projects.length > 0 && <ProjectsClient projects={projects} members={members} initialProjectId={initialProjectId} />}

      <Footer />
    </div>
  )
}
