import { getProjects, Project } from 'app/api-client'
import { genPageMetadata } from 'app/seo'
import ProjectsListClient from './ProjectsListClient'
import Footer from '@/components/Footer'

export const metadata = genPageMetadata({
    title: 'Projects',
    description: 'Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người. Triển lãm những dự án được phát triển bởi Câu lạc bộ DUT AI.',
    keywords: [
        'dự án AI',
        'AI project sinh viên',
        'Machine Learning project DUT',
        'ứng dụng AI Đà Nẵng',
    ],
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
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] bg-purple-300/40 dark:bg-purple-900/40 blur-[100px]" />
                <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-300/30 dark:bg-blue-900/30 blur-[120px]" />
                <div className="absolute bottom-[-10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-fuchsia-300/30 dark:bg-fuchsia-900/20 blur-[120px]" />
            </div>

            {/* ── Hero ── */}
            <section className="relative z-10 px-6 pt-32 pb-16 sm:pt-40 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md mb-8 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                    <span className="text-[13px] font-black tracking-[0.15em] text-blue-700 dark:text-blue-200 uppercase">OUR PORTFOLIO</span>
                </div>

                <h1
                    className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-blue-100 dark:via-white dark:to-pink-200 sm:text-6xl md:text-7xl lg:text-[84px] mb-8"
                    style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.03em', lineHeight: '1.05' }}
                >
                    Next-Gen <br />
                    AI Innovations
                </h1>

                <p className="max-w-[700px] mx-auto text-[17px] md:text-[19px] text-gray-600 dark:text-slate-300 leading-[1.7] font-medium px-4">
                    Khám phá những giới hạn giao thoa giữa học máy và sáng tạo con người.<br className="hidden md:block" />
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
                    <p className="text-lg font-semibold">
                        Chưa có dự án nào.
                    </p>
                </div>
            ) : (
                !error && <ProjectsListClient initialProjects={projects} />
            )}
            <Footer />
        </div>
    )
}
