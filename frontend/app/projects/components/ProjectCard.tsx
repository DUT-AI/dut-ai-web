import Link from 'next/link'
import type { Project } from 'app/api-client'
import Image from 'next/image'

export default function ProjectCard({ project }: { project: Project }) {
    // Use image_url from API, or imgSrc, or a default fallback
    const imageUrl = project.image_url || project.imgSrc || '/static/images/default-project.jpg'

    return (
        <Link
            href={`/projects/${project.id}`}
            className="group flex flex-col p-4 overflow-hidden rounded-[2.5rem] bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/40 h-full"
        >
            {/* Image container */}
            <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-[2rem] bg-gray-900/50">
                <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    unoptimized // To avoid issues with unconfigured remote domains
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 md:p-6 pt-6 gap-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2">
                    {project.title}
                </h3>
                <p className="text-gray-900 dark:text-gray-300 text-[15px] leading-relaxed line-clamp-3">
                    {project.description}
                </p>
            </div>
        </Link>
    )
}
