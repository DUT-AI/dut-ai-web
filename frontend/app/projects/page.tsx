import { getProjects, Project } from 'app/api-client'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/Image'
import Link from '@/components/Link'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const metadata = genPageMetadata({
  title: 'Projects',
  description: 'Các dự án AI và công nghệ được phát triển bởi thành viên DUT AI Club.',
  keywords: ['dự án AI', 'AI project sinh viên', 'Machine Learning project DUT', 'ứng dụng AI Đà Nẵng'],
})

// Revalidate every 10 minutes on the page level
export const revalidate = 600

export default async function Projects() {
  let projects: Project[] = []
  let error = false

  try {
    projects = await getProjects()
  } catch {
    error = true
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden py-14">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-rose-200 opacity-30 blur-3xl dark:opacity-10" />
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-800 dark:bg-primary-900/40 dark:text-primary-300">
            🚀 Dự án & Nghiên cứu
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl dark:text-white">
            Projects
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-600 dark:text-gray-400">
            Những dự án AI, Machine Learning và Web được xây dựng bởi thành viên DUT AI Club.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-800 dark:bg-rose-900/20">
            <p className="text-rose-600 dark:text-rose-400">Không thể kết nối đến server. Vui lòng thử lại sau.</p>
          </div>
        )}

        {projects.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="mb-4 text-6xl">📦</span>
            <p className="text-lg font-semibold">Chưa có dự án nào.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {(project.imgSrc || project.image_url) && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      alt={project.title}
                      src={project.imgSrc || project.image_url || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold leading-snug text-primary-900 dark:text-white">
                    {project.href ? (
                      <Link href={project.href} aria-label={`Link to ${project.title}`} className="hover:underline">
                        {project.title}
                      </Link>
                    ) : project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed text-primary-600 dark:text-gray-400">
                    {project.description}
                  </CardDescription>
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                {(project.href || project.github_url) && (
                  <CardFooter className="flex gap-3 pt-0">
                    {project.href && (
                      <Link
                        href={project.href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                        aria-label={`Link to ${project.title}`}
                      >
                        Xem thêm →
                      </Link>
                    )}
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        GitHub ↗
                      </Link>
                    )}
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
