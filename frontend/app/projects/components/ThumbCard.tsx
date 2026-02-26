import type { Project } from 'app/api-client'
import Image from '@/components/Image'
import { jakarta } from './styles'

interface ThumbCardProps {
  project: Project
  active: boolean
  onClick: () => void
  cardW?: number
}

export default function ThumbCard({ project, active, onClick, cardW = 280 }: ThumbCardProps) {
  const src = project.imgSrc || project.image_url || ''

  return (
    <button
      onClick={onClick}
      className={`group relative flex-shrink-0 overflow-hidden rounded-[40px] transition-all duration-500 focus:outline-none ${
        active
          ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent'
          : 'opacity-75 hover:opacity-100'
      }`}
      style={{ width: cardW, height: Math.round(cardW * (213 / 280)) }}
    >
      {/* BG */}
      {src ? (
        <Image
          alt={project.title}
          src={src}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(0deg, rgba(30,41,59,0.8) 0%, rgba(30,41,59,0.2) 50%, rgba(30,41,59,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
        <h3
          className="text-[22px] font-bold leading-[1.2] text-white sm:text-[26px] lg:text-[30px]"
          style={jakarta}
        >
          {project.title}
        </h3>
        <p
          className="mt-0.5 text-sm text-[#CBD5E1] lg:text-base"
          style={{ ...jakarta, lineHeight: '1.55em' }}
        >
          {project.description && project.description.length > 50
            ? project.description.slice(0, 50) + '…'
            : project.description}
        </p>
        {/* Mini avatars */}
        <div className="mt-2 flex -space-x-1.5">
          <div className="h-6 w-6 rounded-full border-[1.5px] border-white/30 bg-emerald-600" />
          <div className="h-6 w-6 rounded-full border-[1.5px] border-white/30 bg-amber-500" />
        </div>
      </div>
    </button>
  )
}
