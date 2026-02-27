'use client'

import React, { useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import Footer from '@/components/Footer'

interface EventsListLayoutProps {
    posts: CoreContent<Blog>[]
    initialDisplayPosts?: CoreContent<Blog>[]
    pagination?: { totalPages: number; currentPage: number }
}

// ── Facebook SVG icon ──────────────────────────────────────────────────────────
const FacebookIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
)

// ── Calendar icon ──────────────────────────────────────────────────────────────
const CalIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

// ── Location icon ──────────────────────────────────────────────────────────────
const LocIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

// ── Stacked photo cards visual ─────────────────────────────────────────────────
const PhotoStack = ({ images, flip = false }: { images: string[]; flip?: boolean }) => {
    const angles = flip ? ['-rotate-6', '-rotate-2', 'rotate-3'] : ['rotate-6', 'rotate-2', '-rotate-3']
    const visible = images.slice(0, 3)
    while (visible.length < 3) visible.push('')
    return (
        <div className={`relative h-60 w-72 ${flip ? 'scale-x-[-1]' : ''}`}>
            {visible.map((src, i) => (
                <div
                    key={i}
                    className={`absolute rounded-xl border-4 border-white dark:border-gray-800 bg-[#c5cfc8] dark:bg-gray-700 shadow-md transition-transform duration-300 ${angles[i]}`}
                    style={{ width: 140, height: 180, top: i * 10, left: i * 14 }}
                >
                    {src ? (
                        <Image src={src} alt="" fill className="rounded-lg object-cover" unoptimized />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#b0bbb3] dark:bg-gray-600">
                            <svg className="h-12 w-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ── Past events paged list ─────────────────────────────────────────────────────
const PAST_PER_PAGE = 5

function PastEventsList({ events }: { events: CoreContent<Blog>[] }) {
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(events.length / PAST_PER_PAGE)
    const slice = events.slice((page - 1) * PAST_PER_PAGE, page * PAST_PER_PAGE)

    return (
        <div>
            {slice.map((ev) => {
                const cover = ev.images?.[0] ?? null
                const date = ev.date ? new Date(ev.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : ''
                const fbLink = ((ev as any).facebook as string | undefined) ?? siteMetadata.facebook
                const stats: { label: string }[] = []
                if ((ev as any).attendees) stats.push({ label: `${(ev as any).attendees} Người tham gia` })
                if ((ev as any).awards) stats.push({ label: `${(ev as any).awards} Giải thưởng lớn` })
                if ((ev as any).members) stats.push({ label: `${(ev as any).members}+ Thành viên` })
                if ((ev as any).mentors) stats.push({ label: `${(ev as any).mentors} Mentors` })

                return (
                    <div key={ev.path}
                        className="mb-3 flex items-center gap-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 p-4 shadow-sm backdrop-blur border border-transparent dark:border-gray-700/50">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#c5cfc8] dark:bg-gray-700">
                            {cover ? (
                                <Image src={cover} alt={ev.title} fill className="object-cover" unoptimized />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <svg className="h-8 w-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-100">{ev.title}</p>
                                {fbLink && (
                                    <a href={fbLink} target="_blank" rel="noopener noreferrer"
                                        className="flex-shrink-0 text-[#1877F2] transition-opacity hover:opacity-75"
                                        title="Xem trên Facebook">
                                        <FacebookIcon className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                {ev.summary ? ev.summary.slice(0, 60) : ''} · Tháng {date}
                            </p>
                        </div>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="hidden items-center gap-6 text-xs text-gray-500 dark:text-gray-400 sm:flex">
                                {stats.map((s) => (
                                    <span key={s.label} className="flex items-center gap-1">
                                        <span className="text-[#5c6bc0]">•</span>
                                        {s.label}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action */}
                        <Link href={`/${ev.path}`}
                            className="ml-auto flex-shrink-0 rounded-lg bg-[#5c6bc0]/10 dark:bg-[#5c6bc0]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#5c6bc0] dark:text-indigo-300 transition-colors hover:bg-[#5c6bc0]/20 dark:hover:bg-[#5c6bc0]/30">
                            {(ev as any).hasGallery ? 'Xem lại ảnh' : 'Tài liệu'}
                        </Link>
                    </div>
                )
            })}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700">
                        ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${n === page
                                ? 'bg-[#5c6bc0] text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}>
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-full border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Sau →
                    </button>
                </div>
            )}
        </div>
    )
}

// ── Main layout ────────────────────────────────────────────────────────────────
export default function EventsListLayout({ posts }: EventsListLayoutProps) {
    const now = new Date()
    const upcoming = posts.filter((p) => {
        const d = p.date ? new Date(p.date) : null
        return d && d >= now
    })
    const past = posts.filter((p) => {
        const d = p.date ? new Date(p.date) : null
        return !d || d < now
    })

    const workshopEvent =
        upcoming.find((p) => p.tags?.some((t) => ['workshop', 'seminar', 'Workshop', 'Seminar'].includes(t))) ??
        upcoming[0] ??
        null

    const memorableEvents = past.filter((p) => p.images && p.images.length > 0)

    const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'memory'>('photo')

    return (
        <div className="min-h-screen pb-16 bg-[#e8edf7] dark:bg-gray-900">

            {/* ── Hero + Workshop section ───────────────────────────────────────── */}
            <div className="relative  px-6 py-10 md:px-12 pt-40">
                <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-blue-200 dark:bg-blue-900 opacity-30 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-purple-200 dark:bg-purple-900 opacity-20 blur-3xl" />

                <div className="relative mx-auto max-w-5xl">
                    {/* Pill */}
                    <div className="mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                            Sự kiện sắp diễn ra
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 font-extrabold uppercase text-[#1a1a3a] dark:text-white"
                        style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.02em' }}>
                        DUT AI MOMENTS
                    </h1>

                    {/* Divider */}
                    <div className="mb-6 border-t border-dashed border-[#5c6bc0]/40 dark:border-indigo-700/50" />

                    {/* Workshops & Seminar label */}
                    <h2 className="mb-5 text-xl font-extrabold italic text-[#e05c8a] dark:text-pink-400">
                        Workshops &amp; Seminar
                    </h2>

                    {workshopEvent ? (
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Featured event card */}
                            <div className="flex-1">
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#6366f1] shadow-lg">
                                    {workshopEvent.images?.[0] && (
                                        <Image
                                            src={workshopEvent.images[0]}
                                            alt={workshopEvent.title}
                                            fill
                                            className="object-cover opacity-20"
                                            unoptimized
                                        />
                                    )}
                                    <div className="relative p-6">
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {workshopEvent.tags?.filter((t) => t !== 'event').slice(0, 3).map((tag) => (
                                                <span key={tag}
                                                    className="rounded-full border border-white/40 bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="mb-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">
                                            {workshopEvent.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                            <span className="flex items-center gap-1">
                                                <CalIcon />
                                                {workshopEvent.date
                                                    ? new Date(workshopEvent.date).toLocaleDateString('vi-VN', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                                    })
                                                    : ''}
                                            </span>
                                            {(workshopEvent as any).location && (
                                                <span className="flex items-center gap-1">
                                                    <LocIcon />
                                                    {(workshopEvent as any).location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right sidebar cards */}
                            <div className="flex w-full flex-col gap-4 lg:w-64">
                                {/* Register card */}
                                <div className="rounded-2xl border border-[#5c6bc0]/20 dark:border-indigo-700/40 bg-white dark:bg-gray-800 p-5 shadow-sm">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#5c6bc0] dark:text-indigo-400">
                                        Đăng ký ngay
                                    </p>
                                    <p className="mb-2 font-bold text-gray-800 dark:text-gray-100">{workshopEvent.title}</p>
                                    {workshopEvent.summary && (
                                        <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {workshopEvent.summary}
                                        </p>
                                    )}
                                    <Link
                                        href={(workshopEvent as any).registerLink ?? `/${workshopEvent.path}`}
                                        className="block w-full rounded-xl bg-[#1a1a3a] dark:bg-indigo-600 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80">
                                        Đăng ký tham gia
                                    </Link>
                                </div>
                                {/* Notification card */}
                                <div className="rounded-2xl border border-[#5c6bc0]/20 dark:border-indigo-700/40 bg-white dark:bg-gray-800 p-5 shadow-sm">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">Nhận thông báo</p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        Không bỏ lỡ bất kỳ sự kiện nào từ CLB
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 p-10 text-center text-gray-400">
                            <span className="text-5xl">📅</span>
                            <p className="mt-3 font-semibold dark:text-gray-300">Hiện chưa có workshop/seminar sắp diễn ra.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Sự kiện đáng nhớ ────────────────────────────────────────────────── */}
            <div className="relative  px-6 py-14 md:px-12">
                <div className="mx-auto max-w-5xl">
                    {/* Section header */}
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#1a1a3a] dark:text-white">Sự kiện đáng nhớ</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Lưu giữ những khoảnh khắc tuyệt vời nhất của DUT AI Club.
                            </p>
                        </div>
                        {/* Tab bar */}
                        <div className="flex gap-1 rounded-xl bg-white/60 dark:bg-gray-800/60 p-1 shadow-sm backdrop-blur">
                            {(['photo', 'video', 'memory'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === tab
                                        ? 'bg-white dark:bg-gray-700 text-[#1a1a3a] dark:text-white shadow'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}>
                                    {tab === 'photo' ? 'Thư viện ảnh' : tab === 'video' ? 'Videos' : 'Hồi ức'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Memory cards — alternating layout */}
                    {memorableEvents.length > 0 ? (
                        <div className="space-y-16">
                            {memorableEvents.slice(0, 6).map((ev, idx) => {
                                const fbLink = ((ev as any).facebook as string | undefined) ?? siteMetadata.facebook
                                const isLeft = idx % 2 === 0
                                const photoCount = ev.images?.length ?? 0
                                const year = ev.date ? new Date(ev.date).getFullYear() : ''

                                const TextBlock = (
                                    <div className="flex flex-col justify-center">
                                        {year && (
                                            <span className="mb-2 inline-block w-fit rounded-full bg-[#5c6bc0]/10 dark:bg-indigo-900/40 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-[#5c6bc0] dark:text-indigo-300">
                                                Kỷ niệm {year}
                                            </span>
                                        )}
                                        <h3 className="mb-2 text-2xl font-extrabold text-[#e05c8a] dark:text-pink-400">{ev.title}</h3>
                                        {ev.summary && (
                                            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
                                                {ev.summary}
                                            </p>
                                        )}
                                        {/* Xem tất cả + Facebook */}
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/${ev.path}`}
                                                className="text-sm font-semibold text-[#e05c8a] dark:text-pink-400 hover:underline">
                                                Xem tất cả {photoCount} ảnh
                                            </Link>
                                            {fbLink && (
                                                <a
                                                    href={fbLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[#1877F2] transition-opacity hover:opacity-75"
                                                    title="Xem album trên Facebook">
                                                    <FacebookIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )

                                const PhotoBlock = (
                                    <div className="flex justify-center">
                                        <PhotoStack images={ev.images ?? []} flip={!isLeft} />
                                    </div>
                                )

                                return (
                                    <div key={ev.path} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                        {isLeft ? (
                                            <>
                                                {PhotoBlock}
                                                {TextBlock}
                                            </>
                                        ) : (
                                            <>
                                                {TextBlock}
                                                {PhotoBlock}
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-16 text-gray-400">
                            <span className="mb-4 text-5xl">🖼️</span>
                            <p className="font-semibold dark:text-gray-500">Chưa có sự kiện đáng nhớ nào.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Danh sách sự kiện đã qua ─────────────────────────────────────── */}
            <div className=" px-6 py-12 md:px-12">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#5c6bc0] dark:text-indigo-400">
                        Danh sách sự kiện đã qua
                    </h2>
                    {past.length > 0 ? (
                        <PastEventsList events={past} />
                    ) : (
                        <div className="flex flex-col items-center py-16 text-gray-400">
                            <span className="mb-4 text-5xl">📭</span>
                            <p className="font-semibold dark:text-gray-500">Chưa có sự kiện đã qua.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
