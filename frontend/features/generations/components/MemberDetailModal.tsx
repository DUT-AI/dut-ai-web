'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ExternalLink } from 'lucide-react'
import type { GenerationMember } from '@/features/generations/db/types'

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
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white shadow-2xl duration-200 sm:max-w-md dark:border-white/10 dark:bg-slate-900"
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
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-black active:scale-95"
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
              <span className="text-xs font-bold" style={{ color: accentColor }}>
                {departmentName}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {member.title}
            {generationName ? ` · Thế hệ ${generationName}` : ''}
          </p>

          <p className="mt-3 text-sm leading-relaxed font-normal text-slate-600 dark:text-slate-300">
            {member.quote ||
              'Một mảnh ghép nhiệt huyết trên hành trình trưởng thành và cống hiến cùng DUT AI.'}
          </p>

          {member.username && (
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-white/10">
              <Link
                href={`/members/${member.username}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                Xem trang Portfolio cá nhân
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
