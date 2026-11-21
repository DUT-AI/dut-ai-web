import Image from 'next/image'
import Link from 'next/link'
import { Briefcase, ExternalLink, Github, Sparkles } from 'lucide-react'
import type { UnifiedProject } from '@/features/users/db/types'

export interface PortfolioProjectsProps {
  projects: UnifiedProject[]
}

export function PortfolioProjectCard({ project }: { project: UnifiedProject }) {
  const defaultThumbnail = '/static/images/project-placeholder.png'

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900/60">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-600">
            <Briefcase className="h-10 w-10" />
          </div>
        )}

        {/* Club Verified Badge */}
        {project.isClubProject && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white shadow backdrop-blur-sm dark:border-blue-400">
            <Sparkles className="h-3 w-3" />
            DUT AI Project
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
          {project.clubRole && (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {project.clubRole}
            </span>
          )}
        </div>

        {project.description && (
          <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
            {project.description}
          </p>
        )}

        {project.technologies && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.split(',').map((tech, i) => (
              <span
                key={i}
                className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div className="mt-auto flex items-center gap-3 pt-6">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>
          )}
          {project.isClubProject && (
            <Link
              href={`/projects/${project.id}`}
              className="ml-auto text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Chi tiết →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioProjects({ projects }: PortfolioProjectsProps) {
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="mt-12">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <Briefcase className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dự án nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <PortfolioProjectCard
            key={`${project.isClubProject ? 'club' : 'personal'}-${project.id}-${idx}`}
            project={project}
          />
        ))}
      </div>
    </section>
  )
}
