'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { Member } from '@/lib/db/features/users/types'

const DEFAULT_AVATAR = '/static/images/chiikawa.jpeg'
const EXCLUDED_ROLES = ['admin', 'leader']
const PAGE_SIZE = 18
const ADMIN_ROLE_ID = 1
const LEADER_ROLE_ID = 2

// Avatar placeholder background gradients — cycling modern tones
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
]

function SkeletonCard() {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center shadow-sm backdrop-blur-xl animate-pulse dark:border-white/10 dark:bg-slate-900/60">
            <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-1 h-2 w-10 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
    )
}

function AvatarPlaceholder({ gradient }: { gradient: string }) {
    return (
        <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: gradient }}
        >
            <svg className="h-6 w-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
        </div>
    )
}

function normalizeRoleName(roleName: string | undefined) {
    return (roleName ?? '').trim().toLowerCase()
}

function isExcludedRole(member: Member) {
    const roleName = normalizeRoleName(member.role_name)
    return (
        member.role_id === ADMIN_ROLE_ID ||
        member.role_id === LEADER_ROLE_ID ||
        EXCLUDED_ROLES.includes(roleName)
    )
}

export default function MembersGrid() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(0)

    useEffect(() => {
        fetch('/api/members')
            .then((r) => {
                if (!r.ok) throw new Error('fetch failed')
                return r.json() as Promise<Member[]>
            })
            .then((data) => {
                const filtered = data.filter((m) => m.status === 'active' && !isExcludedRole(m))
                setMembers(filtered)
            })
            .catch(() => setError('Không thể tải danh sách thành viên.'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        setPage(0)
    }, [members.length])

    const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE))

    const visibleMembers = useMemo(() => {
        const start = page * PAGE_SIZE
        return members.slice(start, start + PAGE_SIZE)
    }, [members, page])

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (error || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/70 py-16 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                <svg
                    className="mb-4 h-12 w-12 text-slate-400 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {error ?? 'Chưa có thành viên.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
                {visibleMembers.map((m, idx) => {
                    const avatarGradient =
                        AVATAR_GRADIENTS[(idx + page * PAGE_SIZE) % AVATAR_GRADIENTS.length]
                    const hasRealAvatar = m.avatar_url && m.avatar_url !== DEFAULT_AVATAR
                    return (
                        <div
                            key={m.id}
                            className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60"
                        >
                            {/* Avatar */}
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white shadow-sm dark:border-slate-800">
                                {hasRealAvatar ? (
                                    <Image
                                        src={m.avatar_url!}
                                        alt={m.name}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <AvatarPlaceholder gradient={avatarGradient} />
                                )}
                            </div>

                            <p className="mt-2.5 line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                                {m.name}
                            </p>
                            <span className="mt-0.5 line-clamp-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {m.role_name}
                            </span>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-3 pt-2 sm:justify-end">
                    <button
                        type="button"
                        aria-label="Members previous"
                        onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        &larr;
                    </button>
                    <button
                        type="button"
                        aria-label="Members next"
                        onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                    >
                        &rarr;
                    </button>
                </div>
            )}
        </div>
    )
}
