import type { Project, Member } from 'app/api-client'
import Image from '@/components/Image'
import { glassClass, jakarta } from './styles'

interface DemoPanelProps {
  project: Project
  members: Member[]
  projects: Project[]
  selected: number
}

export default function DemoPanel({ project, members, projects, selected }: DemoPanelProps) {
  const imgSrc = project.imgSrc || project.image_url || ''
  const total = projects.length

  return (
    <div className={`${glassClass} flex flex-col gap-0 overflow-hidden rounded-[40px] lg:flex-row h-[700px] lg:h-[800px]`}>
      {/* Left — Text info */}
      <div className="flex flex-col p-8 sm:p-10 lg:w-[45%] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div>
          {/* Mini avatars */}
          <div className="mb-4 flex -space-x-2">
            {members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-indigo-200/30 dark:border-white/20"
              >
                {m.avatar_url ? (
                  <Image
                    alt={m.name}
                    src={m.avatar_url}
                    width={32}
                    height={32}
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
            className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-[36px]"
            style={{ ...jakarta, lineHeight: '1.111em' }}
          >
            Demo
          </h3>
          <h4
            className="text-2xl font-bold sm:text-3xl lg:text-[36px]"
            style={{ ...jakarta, lineHeight: '1.111em', color: '#F97316' }}
          >
            Dự án
          </h4>
        </div>

        <div className="mt-6">
          <p
            className="text-sm leading-relaxed text-slate-600 dark:text-[#F1F5F9] sm:text-base"
            style={{ ...jakarta, lineHeight: '1.8em' }}
          >
            {project.description || 'Xem trước giao diện và trải nghiệm thực tế của dự án.'}
          </p>

          {/* Dot indicators */}
          <div className="mt-6 flex gap-2">
            {projects.slice(0, Math.min(5, total)).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all ${i === selected ? 'w-8 bg-orange-500' : 'w-2.5 bg-indigo-200/50 dark:bg-white/20'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right — Image */}
      <div className="relative min-h-[280px] flex-1 overflow-hidden lg:rounded-r-[40px]">
        {imgSrc ? (
          <Image alt={project.title} src={imgSrc} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.3) 50%, rgba(2,6,23,0) 80%)',
          }}
        />
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 p-6 sm:p-8">
          {/* Lead avatar */}
          {members[0] && (
            <div className="absolute right-6 top-6 h-14 w-14 overflow-hidden rounded-full border-2 border-white/30 sm:right-8 sm:top-8">
              {members[0].avatar_url ? (
                <Image
                  alt={members[0].name}
                  src={members[0].avatar_url}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-slate-600" />
              )}
            </div>
          )}
          <div>
            <h4
              className="text-xl font-bold text-white sm:text-2xl"
              style={{ ...jakarta, lineHeight: '1.333em' }}
            >
              {project.title}
            </h4>
            <p className="mt-0.5 text-sm text-[#CBD5E1]" style={jakarta}>
              {project.tags && project.tags.length > 0
                ? project.tags.slice(0, 2).join(' · ')
                : 'AI Digital Website'}
            </p>
          </div>
          {/* Status dot */}
          <span className="ml-auto mb-1 h-3 w-3 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  )
}
