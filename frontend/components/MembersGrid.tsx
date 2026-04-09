'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

interface Member {
    id: number
    name: string
    role_id?: number
    role_name: string
    avatar_url?: string | null
    status?: string
}

const DEFAULT_AVATAR = '/static/images/chiikawa.jpeg'
const EXCLUDED_ROLES = ['admin', 'leader']
const PAGE_SIZE = 18
const ADMIN_ROLE_ID = 1
const LEADER_ROLE_ID = 2

// Avatar placeholder background gradients — cycling green tones
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
    'linear-gradient(135deg, #386641 0%, #1e3a1e 100%)',
    'linear-gradient(135deg, #3d7a5a 0%, #2d5a3d 100%)',
    'linear-gradient(135deg, #2f5f41 0%, #1a3b28 100%)',
    'linear-gradient(135deg, #40724d 0%, #264d36 100%)',
]

function SkeletonCard() {
    return (
        <div className="about-member-card animate-pulse">
            <div className="about-member-avatar bg-indigo-100/70 dark:bg-white/15" />
            <div className="mt-3 h-2.5 w-16 rounded-full bg-indigo-200 dark:bg-white/20" />
            <div className="mt-1 h-2 w-10 rounded-full bg-indigo-100 dark:bg-white/15" />
        </div>
    )
}

function AvatarPlaceholder({ gradient }: { gradient: string }) {
    return (
        <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: gradient }}
        >
            <svg className="h-7 w-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
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
                {Array.from({ length: 14 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (error || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-indigo-200/40 bg-white/70 py-16 text-center dark:border-white/18 dark:bg-white/10">
                <svg
                    className="mb-4 h-12 w-12 text-indigo-300 dark:text-white/30"
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
                <p className="text-sm font-semibold text-indigo-400 dark:text-white/40">
                    {error ?? 'Chưa có thành viên.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {visibleMembers.map((m, idx) => {
                    const avatarGradient =
                        AVATAR_GRADIENTS[(idx + page * PAGE_SIZE) % AVATAR_GRADIENTS.length]
                    const hasRealAvatar = m.avatar_url && m.avatar_url !== DEFAULT_AVATAR
                    return (
                        <div
                            key={m.id}
                            className="about-member-card group transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            {/* Avatar */}
                            <div className="about-member-avatar shadow-sm">
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

                            <p className="about-member-name line-clamp-2">{m.name}</p>
                            <span className="about-member-role line-clamp-1">{m.role_name}</span>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-3 pt-1 sm:justify-end">
                    <button
                        type="button"
                        aria-label="Members previous"
                        onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                        className="about-nav-btn about-nav-btn-muted"
                    >
                        <span aria-hidden="true">&larr;</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Members next"
                        onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                        className="about-nav-btn"
                    >
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            )}
        </div>
    )
}
