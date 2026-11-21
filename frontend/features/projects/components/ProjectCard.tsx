import Link from 'next/link'
import type { Project } from '@/lib/api-client'
import Image from 'next/image'
import { buildProjectPath } from '@/app/projects/project-route'

export default function ProjectCard({ project }: { project: Project }) {
  // Use image_url from API, or imgSrc, or a default fallback
  const imageUrl = project.image_url || project.imgSrc || '/static/images/default-project.jpg'

  return (
    <Link
      href={buildProjectPath(project)}
      className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-white/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-white/10 dark:bg-white/5"
    >
      {/* Image container */}
      <div className="relative h-56 w-full overflow-hidden rounded-[2rem] bg-gray-900/50 md:h-72">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          unoptimized // To avoid issues with unconfigured remote domains
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 pt-6 md:p-6">
        <h3 className="line-clamp-2 text-2xl font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-[15px] leading-relaxed text-gray-900 dark:text-gray-300">
          {project.description}
        </p>
      </div>
    </Link>
  )
}
