'use client'

import React from 'react'
import Image from 'next/image'
import { Github, Globe, Sparkles, FolderGit2 } from 'lucide-react'
import type { UnifiedProject } from '@/features/users/db/types'

export interface PortfolioProjectsProps {
  projects: UnifiedProject[]
}

export function PortfolioProjectCard({ project }: { project: UnifiedProject }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-blue-500/30 bg-slate-900/40 shadow-[0_4px_15px_rgba(37,99,235,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/70 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]">
      {/* 1. Image Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 p-2 sm:p-3">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-blue-400">
              <FolderGit2 className="h-12 w-12 opacity-60" />
            </div>
          )}

          {/* Club Verified Badge */}
          {project.isClubProject && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-blue-400/40 bg-blue-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span>DUT AI Project</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Body: Only Title, Description & Action Buttons (Exact my-cv layout) */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title */}
        <h4 className="text-center text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
          {project.title}
        </h4>

        {/* Short & Clean Description */}
        {project.description && (
          <p className="mt-3 line-clamp-4 text-justify text-sm leading-relaxed text-slate-300">
            {project.description}
          </p>
        )}

        <div className="flex-1" />

        {/* Action Buttons: Centered (GitHub / Live Demo) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioProjects({ projects }: PortfolioProjectsProps) {
  return (
    <div className="relative z-10 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          My Recent <span className="text-blue-500">Works</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Here are a few projects I've worked on recently.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-blue-500/20 bg-slate-900/50 p-12 text-center text-slate-400">
          Chưa có dự án nào được công khai trong hồ sơ này.
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj, idx) => (
            <PortfolioProjectCard
              key={`${proj.isClubProject ? 'club' : 'p'}-${proj.id}-${idx}`}
              project={proj}
            />
          ))}
        </div>
      )}
    </div>
  )
}
