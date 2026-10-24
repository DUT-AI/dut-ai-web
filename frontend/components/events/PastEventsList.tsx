'use client'

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import type { PastEvent } from 'app/api-client'
import { parseEventDate } from '@/lib/db/features/events/timeline'
import { FacebookIcon } from './EventIcons'

export interface PaginationProps {
    totalPages: number
    currentPage: number
}

// ── Pagination component (URL-based) ──────────────────────────────────────────
export function EventPagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname()
    const basePath = pathname
        .replace(/^\//, '')
        .replace(/\/page\/\d+\/?$/, '')
        .replace(/\/$/, '')
    const prevPage = currentPage - 1 > 0
    const nextPage = currentPage + 1 <= totalPages

    return (
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <nav className="flex justify-between items-center text-sm font-medium">
                {!prevPage ? (
                    <button className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500" disabled>
                        Trước
                    </button>
                ) : (
                    <Link
                        href={
                            currentPage - 1 === 1
                                ? `/${basePath}`
                                : `/${basePath}/page/${currentPage - 1}`
                        }
                        rel="prev"
                        className="text-[#5c6bc0] hover:opacity-70 transition-opacity"
                    >
                        Trước
                    </Link>
                )}
                <span className="text-gray-600 dark:text-gray-300 font-bold">
                    Trang {currentPage} / {totalPages}
                </span>
                {!nextPage ? (
                    <button className="cursor-auto text-gray-400 disabled:opacity-50 dark:text-gray-500" disabled>
                        Sau
                    </button>
                ) : (
                    <Link
                        href={`/${basePath}/page/${currentPage + 1}`}
                        rel="next"
                        className="text-[#5c6bc0] hover:opacity-70 transition-opacity"
                    >
                        Sau
                    </Link>
                )}
            </nav>
        </div>
    )
}

// ── Past events list ─────────────────────────────────────────────────────
export interface PastEventsListProps {
    events: PastEvent[]
    pagination?: PaginationProps
}

export function PastEventsList({ events, pagination }: PastEventsListProps) {
    return (
        <div>
            {events.map((ev) => {
                const date =
                    parseEventDate(ev.date)?.toLocaleDateString('vi-VN', {
                        month: '2-digit',
                        year: 'numeric',
                        timeZone: 'Asia/Ho_Chi_Minh',
                    }) ?? ''
                const fbLink = ev.facebook_url ?? siteMetadata.facebook

                return (
                    <div
                        key={ev.id}
                        className="mb-3 flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-shadow hover:shadow-md"
                        style={{
                            background: 'rgba(255,255,255,0.75)',
                            backdropFilter: 'blur(12px)',
                            borderColor: 'rgba(255,255,255,0.7)',
                        }}
                    >
                        {/* Thumbnail */}
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#c5cfc8]">
                            {ev.cover ? (
                                <Image
                                    src={ev.cover}
                                    alt={ev.title}
                                    fill
                                    sizes="80px"
                                    quality={70}
                                    className="object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <svg
                                        className="h-8 w-8 text-white/60"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold" style={{ color: '#1e293b' }}>
                                    {ev.title}
                                </p>
                                {fbLink && (
                                    <a
                                        href={fbLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 text-[#1877F2] transition-opacity hover:opacity-75"
                                        title="Xem trên Facebook"
                                    >
                                        <FacebookIcon className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs" style={{ color: '#64748b' }}>
                                {ev.summary ? ev.summary.slice(0, 60) : ''} · Tháng {date}
                            </p>
                        </div>

                        {/* Type badge */}
                        <span className="ml-auto flex-shrink-0 rounded-lg bg-[#5c6bc0]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#5c6bc0]">
                            {ev.type === 'public_event' ? 'Workshop' : 'Kỷ niệm'}
                        </span>
                    </div>
                )
            })}

            {/* Pagination Component */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 border-t border-gray-100/50 pt-2">
                    <EventPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                    />
                </div>
            )}
        </div>
    )
}

export default PastEventsList
