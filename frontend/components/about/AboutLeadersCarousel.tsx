'use client'

import { useMemo, useState } from 'react'
import type { Member } from '@/lib/db/features/users/types'
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
        <section className="space-y-6">
            <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Trưởng ban & Trưởng nhóm
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                    Đội ngũ Leaders
                </h2>
            </div>

            <div className="relative">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
                    {items.map((leader) => (
                        <article
                            key={leader.id}
                            className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-center shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60"
                        >
                            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-2xl border-2 border-white/80 shadow-md dark:border-slate-800">
                                {leader.avatar_url ? (
                                    <Image
                                        src={leader.avatar_url}
                                        alt={leader.name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                                        {leader.name.slice(0, 1)}
                                    </div>
                                )}
                            </div>
                            <p className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                                {leader.name}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {humanizeRoleName(leader.role_name)}
                            </p>
                        </article>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-3 sm:justify-end">
                        <button
                            type="button"
                            aria-label="Leaders previous"
                            onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            &larr;
                        </button>
                        <button
                            type="button"
                            aria-label="Leaders next"
                            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                        >
                            &rarr;
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
