'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Member {
    id: number
    name: string
    role_name: string
    avatar_url?: string | null
    status?: string
}

const DEFAULT_AVATAR = '/static/images/chiikawa.jpeg'
const EXCLUDED_ROLES = ['admin', 'leader']

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
        <div
            className="flex flex-col items-center gap-2 rounded-2xl p-4 animate-pulse"
            style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
            }}
        >
            <div className="w-14 h-14 rounded-full bg-white/30" />
            <div className="h-2.5 w-16 rounded bg-white/20" />
            <div className="h-2 w-12 rounded bg-white/15" />
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

export default function MembersGrid() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/members')
            .then((r) => {
                if (!r.ok) throw new Error('fetch failed')
                return r.json() as Promise<Member[]>
            })
            .then((data) => {
                const filtered = data.filter(
                    (m) =>
                        m.status === 'active' &&
                        !EXCLUDED_ROLES.includes((m.role_name ?? '').toLowerCase()),
                )
                setMembers(filtered)
            })
            .catch(() => setError('Không thể tải danh sách thành viên.'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
                {Array.from({ length: 14 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (error || members.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center rounded-3xl py-16 text-center"
                style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.18)',
                }}
            >
                <svg
                    className="mb-4 h-12 w-12 text-white/30"
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
                <p className="text-sm font-semibold text-white/40">
                    {error ?? 'Chưa có thành viên.'}
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            {members.map((m, idx) => {
                const avatarGradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                const hasRealAvatar = m.avatar_url && m.avatar_url !== DEFAULT_AVATAR
                return (
                    <div
                        key={m.id}
                        className="group flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all hover:scale-105 hover:shadow-xl"
                        style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.22)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Avatar — green gradient placeholder OR real photo */}
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
                            {m.avatar_url ? (
                                <Image
                                    src={m.avatar_url}
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

                        <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-white">
                            {m.name}
                        </p>
                        <span
                            className="rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/80"
                            style={{ background: 'rgba(255,255,255,0.18)' }}
                        >
                            {m.role_name}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
