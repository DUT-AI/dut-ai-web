'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { GenerationMember } from '@/lib/db/features/organization/types'

interface MemberDetailModalProps {
  member: GenerationMember | null
  departmentName?: string
  generationName?: string
  accentColor?: string
  onClose: () => void
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function MemberDetailModal({
  member,
  departmentName,
  generationName,
  accentColor = '#2563eb',
  onClose,
}: MemberDetailModalProps) {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!member) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [member, onClose])

  if (!member) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-[2.25rem] bg-white shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container with Close Button */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
          {member.avatar_url ? (
            <Image
              src={member.avatar_url}
              alt={member.name}
              fill
              sizes="(min-width: 640px) 450px, 90vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-5xl font-black text-white"
              style={{
                background: `linear-gradient(145deg, ${accentColor}, #0f172a)`,
              }}
            >
              {initials(member.name)}
            </div>
          )}


          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur transition-all duration-200 hover:bg-black hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info Body */}
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              {member.name}
            </h3>
            {departmentName && (
              <span
                className="text-xs font-bold"
                style={{ color: accentColor }}
              >
                {departmentName}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {member.title}{generationName ? ` · Thế hệ ${generationName}` : ''}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
            {member.quote || 'Một mảnh ghép nhiệt huyết trên hành trình trưởng thành và cống hiến cùng DUT AI.'}
          </p>
        </div>
      </div>
    </div>
  )
}
