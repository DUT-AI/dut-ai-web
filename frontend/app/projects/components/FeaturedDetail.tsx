import type { Project, Member } from 'app/api-client'
import Image from '@/components/Image'
import Link from '@/components/Link'
import { glass, jakarta } from './styles'

interface FeaturedDetailProps {
  project: Project
  members: Member[]
}

export default function FeaturedDetail({ project, members }: FeaturedDetailProps) {
  const imgSrc = project.imgSrc || project.image_url || ''

  return (
    <div className="flex flex-col gap-0 lg:flex-row" style={{ minHeight: 420 }}>
      {/* Left — Glassmorphism info */}
      <div
        className="relative flex flex-col justify-between overflow-hidden rounded-t-[40px] p-8 sm:p-10 lg:w-[46%] lg:rounded-l-[40px] lg:rounded-tr-none"
        style={glass}
      >
        <div>
          {/* Avatars */}
          <div className="mb-6 flex -space-x-2">
            {members.slice(0, 3).map((m, i) => (
              <div
                key={m.id}
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20"
              >
                {m.avatar_url ? (
                  <Image
                    alt={m.name}
                    src={m.avatar_url}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className={`h-full w-full ${['bg-slate-700', 'bg-emerald-700', 'bg-amber-600'][i % 3]
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Title */}
          <h2
            className="text-2xl font-bold text-white sm:text-3xl lg:text-[36px]"
            style={{ ...jakarta, lineHeight: '1.1em' }}
          >
            {project.href ? (
              <Link
                href={project.href}
                className="transition-opacity hover:opacity-80"
                aria-label={`Link to ${project.title}`}
              >
                &ldquo;{project.title}&rdquo;
              </Link>
            ) : (
              <>&ldquo;{project.title}&rdquo;</>
            )}
          </h2>
        </div>

        {/* Description */}
        <p
          className="mt-8 text-base text-[#F1F5F9] sm:text-lg lg:mt-auto lg:text-[20px]"
          style={{ ...jakarta, lineHeight: '2em' }}
        >
          {project.description}
        </p>
      </div>

      {/* Right — Image card */}
      <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-b-[40px] border border-black/40 lg:rounded-r-[40px] lg:rounded-bl-none">
        {imgSrc ? (
          <Image alt={project.title} src={imgSrc} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        {/* Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, rgba(2,6,23,1) 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0) 70%)',
          }}
        />
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mb-2 flex -space-x-1.5">
            {members.slice(0, 1).map((m) => (
              <div
                key={m.id}
                className="h-7 w-7 overflow-hidden rounded-full border-2 border-white/30"
              >
                {m.avatar_url ? (
                  <Image
                    alt={m.name}
                    src={m.avatar_url}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-slate-600" />
                )}
              </div>
            ))}
          </div>
          <h3
            className="text-xl font-bold text-white sm:text-2xl"
            style={{ ...jakarta, lineHeight: '1.333em' }}
          >
            {project.title}
          </h3>
          <p className="mt-0.5 text-sm text-[#CBD5E1]" style={jakarta}>
            {project.tags && project.tags.length > 0
              ? project.tags.join(' · ')
              : project.description && project.description.length > 60
                ? project.description.slice(0, 60) + '…'
                : project.description}
          </p>
        </div>
      </div>
    </div>
  )
}
