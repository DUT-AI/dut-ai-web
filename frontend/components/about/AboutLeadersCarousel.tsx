'use client'

import { useMemo, useState } from 'react'
import type { Member } from 'app/api-client'
import Image from 'next/image'

type AboutLeadersCarouselProps = {
    leaders: Member[]
}

const PAGE_SIZE = 6

function normalizeRoleName(roleName: string | undefined) {
    return (roleName ?? '').trim().toLowerCase()
}

function humanizeRoleName(roleName: string | undefined) {
    const normalized = normalizeRoleName(roleName)
    if (!normalized) return 'Leader'

    if (normalized === 'leader') return 'Leader'
    if (normalized === 'team_lead' || normalized === 'team-lead') return 'Team Lead'
    if (normalized === 'co_leader' || normalized === 'co-leader') return 'Co-leader'
    if (normalized === 'vice_leader' || normalized === 'vice-leader') return 'Phó Leader'

    return normalized
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AboutLeadersCarousel({ leaders }: AboutLeadersCarouselProps) {
    const [page, setPage] = useState(0)
    const totalPages = Math.max(1, Math.ceil(leaders.length / PAGE_SIZE))

    const items = useMemo(() => {
        const start = page * PAGE_SIZE
        return leaders.slice(start, start + PAGE_SIZE)
    }, [leaders, page])

    return (
        <section className="space-y-5 sm:space-y-6">
            <h2 className="about-section-title text-center">Đội ngũ Leaders</h2>

            <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
                    {items.map((leader) => (
                        <article key={leader.id} className="about-leader-card">
                            <div className="about-leader-avatar">
                                {leader.avatar_url ? (
                                    <Image
                                        src={leader.avatar_url}
                                        alt={leader.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="about-avatar-fallback">{leader.name.slice(0, 1)}</div>
                                )}
                            </div>
                            <p className="about-leader-name">{leader.name}</p>
                            <p className="about-leader-role">{humanizeRoleName(leader.role_name)}</p>
                        </article>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-3 sm:justify-end">
                        <button
                            type="button"
                            aria-label="Leaders previous"
                            onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                            className="about-nav-btn about-nav-btn-muted"
                        >
                            <span aria-hidden="true">&larr;</span>
                        </button>
                        <button
                            type="button"
                            aria-label="Leaders next"
                            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                            className="about-nav-btn"
                        >
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
