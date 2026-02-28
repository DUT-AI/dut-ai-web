import { getProjects, getMembers, Project, Member } from 'app/api-client'
import { genPageMetadata } from 'app/seo'
import NextImage from 'next/image'
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

export const dynamic = 'force-dynamic'

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
    <>
      <style>{`
        .projects-detail-page {
          background: #f8fafc;
        }
        .dark .projects-detail-page {
          background: #020617;
        }
        /* Glass cards — light mode uses solid white, dark uses translucent */
        .proj-glass {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(100,80,200,0.15);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 4px 32px rgba(100,80,200,0.08);
        }
        .dark .proj-glass {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: inset 0 0 25px 1px rgba(255,255,255,0.10);
        }
        /* Pagination counter color */
        .proj-counter { color: rgba(60,60,100,0.7); }
        .dark .proj-counter { color: rgba(255,255,255,0.3); }
        /* Nav prev arrow */
        .proj-nav-prev {
          border: 1px solid rgba(100,80,200,0.25);
          background: rgba(100,80,200,0.08);
          color: #4338ca;
        }
        .dark .proj-nav-prev {
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }
        /* Tech tags */
        .proj-tag {
          background: rgba(100,80,200,0.10);
          color: #4338ca;
        }
        .dark .proj-tag {
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.8);
        }
      `}</style>
      <div
        className="projects-detail-page relative min-h-screen overflow-hidden"
      >
        {/* Light-mode decorative blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden dark:hidden">
          <div className="absolute top-[-80px] left-[10%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
            style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />
          <div className="absolute top-[40%] right-[5%] h-[300px] w-[300px] rounded-full opacity-30 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }} />
          <div className="absolute bottom-[5%] left-[25%] h-[260px] w-[260px] rounded-full opacity-25 blur-[70px]"
            style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }} />
        </div>
        {/* ── Hero ── */}
        <section className="relative px-6 pt-10 pb-6 sm:pt-14 md:px-8 md:pt-32 lg:pt-36">
          <div className="mx-auto max-w-[1220px]">
            <div className="flex items-end justify-between gap-8">
              {/* H1 — indented more */}
              <h1
                className="max-w-[725px] pl-8 md:pl-16 text-5xl font-extrabold text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]"
                style={{
                  fontFamily: 'var(--font-inter)',
                  lineHeight: '0.96em',
                  letterSpacing: '-0.023em',
                }}
              >
                DUT AI <br className="hidden sm:block" />
                Handpicked Projects
              </h1>

              {/* Mascot — right side */}
              <div className="hidden flex-shrink-0 lg:block">
                <NextImage
                  src="/static/images/linh_vat_tach_nen.png"
                  alt="DUT AI mascot"
                  width={220}
                  height={260}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto max-w-[1220px] px-6 md:px-8">
            <div className="mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
              <p className="text-lg text-slate-600 dark:text-slate-200" style={{ fontFamily: 'var(--font-jakarta)' }}>
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
    </>
  )
}
