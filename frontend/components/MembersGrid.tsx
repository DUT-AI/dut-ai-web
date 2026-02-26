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

function SkeletonCard() {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 animate-pulse dark:border-gray-700 dark:bg-gray-800">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
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
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (error || members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center dark:border-gray-700">
                <svg
                    className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600"
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
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                    {error ?? 'Chưa có thành viên.'}
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {members.map((m) => (
                <div
                    key={m.id}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary-100 dark:border-gray-600">
                        <Image
                            src={m.avatar_url || DEFAULT_AVATAR}
                            alt={m.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <p className="line-clamp-2 text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {m.name}
                    </p>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                        {m.role_name}
                    </span>
                </div>
            ))}
        </div>
    )
}
