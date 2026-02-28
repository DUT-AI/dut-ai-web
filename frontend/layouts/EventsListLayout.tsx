'use client'

import React, { useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import Footer from '@/components/Footer'
import { useTheme } from 'next-themes'

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

// ── Member card placeholder (shown when no image) ──────────────────────────────
const MemberCard = ({ bg }: { bg: string }) => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4" style={{ background: bg }}>
        <svg className="h-10 w-10 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">MEMBER</span>
        <div className="w-10 border-t border-white/35" />
        <p className="mt-1 text-center text-[9px] leading-relaxed text-white/55 line-clamp-3">
            Lorem ipsum dolor sit amet consectetur
        </p>
    </div>
)

// ── Scattered photo cards — 4 cards fanned like the design mockup ─────────────
const PhotoStack = ({ images, flip = false }: { images: string[]; flip?: boolean }) => {
    // W×H for all cards
    const W = 170, H = 205

    // flip=false → PhotoBlock is on the LEFT column (odd rows)
    // flip=true  → PhotoBlock is on the RIGHT column (even rows)
    // Positions carefully match the design screenshots:
    //   left  pattern: back-top-left, back-top-right, front-bottom-right, front-bottom-left
    //   right pattern: back-top-right, back-top-left, front-bottom-left,  front-bottom-right
    const cards = flip
        ? [
            // Right-side layout (2nd screenshot)
            { top: 0, left: 140, rotate: 12, z: 0, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 18, left: 45, rotate: 5, z: 1, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 108, left: 0, rotate: -7, z: 2, bg: 'linear-gradient(150deg,#a8bfb0,#8eab94)' },
            { top: 100, left: 150, rotate: 3, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]
        : [
            // Left-side layout (1st screenshot)
            { top: 0, left: 0, rotate: -12, z: 0, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 18, left: 105, rotate: -5, z: 1, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 108, left: 165, rotate: 8, z: 2, bg: 'linear-gradient(150deg,#e8dcc8,#d4c4a0)' },
            { top: 100, left: 10, rotate: -2, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]

    // Cycle images so all 4 slots are always filled with real photos
    const visible: string[] = Array.from({ length: 4 }, (_, i) =>
        images.length > 0 ? images[i % images.length] : ''
    )

    return (
        <div className="relative" style={{ width: 380, height: 340 }}>
            {cards.map((c, i) => (
                <div
                    key={i}
                    className="absolute overflow-hidden rounded-2xl border-[5px] border-white shadow-2xl transition-transform duration-300 hover:scale-105"
                    style={{
                        width: W,
                        height: H,
                        top: c.top,
                        left: c.left,
                        zIndex: c.z,
                        transform: `rotate(${c.rotate}deg)`,
                    }}
                >
                    {visible[i] ? (
                        <Image src={visible[i]} alt="" fill className="object-cover" unoptimized />
                    ) : (
                        <MemberCard bg={c.bg} />
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
                        className="mb-3 flex items-center gap-4 rounded-2xl p-4 shadow-sm border"
                        style={{
                            background: 'rgba(255,255,255,0.75)',
                            backdropFilter: 'blur(12px)',
                            borderColor: 'rgba(255,255,255,0.7)',
                        }}>
                        {/* Thumbnail */}
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#c5cfc8]">
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
                                <p className="truncate text-sm font-bold" style={{ color: '#1e293b' }}>{ev.title}</p>
                                {fbLink && (
                                    <a href={fbLink} target="_blank" rel="noopener noreferrer"
                                        className="flex-shrink-0 text-[#1877F2] transition-opacity hover:opacity-75"
                                        title="Xem trên Facebook">
                                        <FacebookIcon className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                            <p className="mt-0.5 text-xs" style={{ color: '#64748b' }}>
                                {ev.summary ? ev.summary.slice(0, 60) : ''} · Tháng {date}
                            </p>
                        </div>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="hidden items-center gap-6 text-xs text-gray-500 sm:flex">
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
                            className="ml-auto flex-shrink-0 rounded-lg bg-[#5c6bc0]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#5c6bc0] transition-colors hover:bg-[#5c6bc0]/20">
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
                        className="rounded-full border border-purple-200 px-4 py-1.5 text-sm font-semibold text-gray-600 disabled:opacity-30 hover:bg-white/60">
                        ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${n === page
                                ? 'bg-[#5c6bc0] text-white'
                                : 'text-gray-500 hover:bg-white/60'
                                }`}>
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-full border border-purple-200 px-4 py-1.5 text-sm font-semibold text-gray-600 disabled:opacity-30 hover:bg-white/60">
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

    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme !== 'light'
    const pageBg = isDark
        ? '#020617'
        : '#f8fafc'

    return (
        <div className="min-h-screen pb-16" style={{ background: pageBg }}>
            {/* ── Hero + Workshop section ───────────────────────────────────────── */}
            <div className="relative px-6 py-10 md:px-12 pt-40">
                {/* Decorative blobs — dark mode */}
                {isDark && (
                    <>
                        <div
                            className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full opacity-40 blur-3xl"
                            style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }}
                        />
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-30 blur-3xl"
                            style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)' }}
                        />
                    </>
                )}
                {/* Decorative blobs — light mode */}
                {!isDark && (
                    <>
                        <div className="pointer-events-none fixed top-[-80px] left-[8%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
                            style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />
                        <div className="pointer-events-none fixed top-[35%] right-[5%] h-[320px] w-[320px] rounded-full opacity-30 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }} />
                        <div className="pointer-events-none fixed bottom-[8%] left-[20%] h-[260px] w-[260px] rounded-full opacity-25 blur-[70px]"
                            style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }} />
                    </>
                )}

                <div className="relative mx-auto max-w-5xl">
                    {/* Pill */}
                    <div className="mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/70">
                            Sự kiện sắp diễn ra
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="mb-6 font-extrabold uppercase text-slate-900 dark:text-white"
                        style={{
                            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                            letterSpacing: '-0.02em',
                            textShadow: isDark ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
                        }}
                    >
                        DUT AI MOMENTS
                    </h1>

                    {/* Divider */}
                    <div className="mb-6 border-t border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(100,80,200,0.25)' }} />

                    {/* Workshops & Seminar label */}
                    <h2 className="mb-5 text-xl font-extrabold italic text-slate-800 dark:text-white/90">
                        Workshops &amp; Seminar
                    </h2>

                    {workshopEvent ? (
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Featured event card */}
                            <div className="flex-1">
                                <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: 340 }}>
                                    {workshopEvent.images?.[0] ? (
                                        <Image
                                            src={workshopEvent.images[0]}
                                            alt={workshopEvent.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)' }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            {workshopEvent.tags
                                                ?.filter((t) => t !== 'event')
                                                .slice(0, 3)
                                                .map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                                                        style={{
                                                            borderColor: 'rgba(255,255,255,0.45)',
                                                            background: 'rgba(255,255,255,0.18)',
                                                            backdropFilter: 'blur(6px)',
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                        <h3 className="mb-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">
                                            {workshopEvent.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
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

                            {/* Right sidebar */}
                            <div className="flex w-full flex-col gap-4 lg:w-64">
                                <div
                                    className="rounded-2xl border p-5 shadow-lg"
                                    style={{
                                        background: 'rgba(255,255,255,0.75)',
                                        backdropFilter: 'blur(14px)',
                                        borderColor: 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#5c6bc0]">
                                        Đăng ký ngay
                                    </p>
                                    <p className="mb-2 font-bold text-gray-800">{workshopEvent.title}</p>
                                    {workshopEvent.summary && (
                                        <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-3">
                                            {workshopEvent.summary}
                                        </p>
                                    )}
                                    <Link
                                        href={(workshopEvent as any).registerLink ?? `/${workshopEvent.path}`}
                                        className="block w-full rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80"
                                        style={{ background: '#1a1a3a' }}
                                    >
                                        Đăng ký tham gia
                                    </Link>
                                </div>
                                <div
                                    className="rounded-2xl border p-5 shadow-lg"
                                    style={{
                                        background: 'rgba(255,255,255,0.75)',
                                        backdropFilter: 'blur(14px)',
                                        borderColor: 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <p className="font-semibold text-gray-800">Nhận thông báo</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Không bỏ lỡ bất kỳ sự kiện nào từ CLB
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl p-10 text-center text-gray-400"
                            style={{ background: 'rgba(255,255,255,0.6)' }}
                        >
                            <span className="text-5xl">📅</span>
                            <p className="mt-3 font-semibold">Hiện chưa có workshop/seminar sắp diễn ra.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Sự kiện đáng nhớ ────────────────────────────────────────────────── */}
            <div className="relative px-6 py-14 md:px-12">
                <div className="mx-auto max-w-5xl">
                    {/* Section header */}
                    <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sự kiện đáng nhớ</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
                                Lưu giữ những khoảnh khắc tuyệt vời nhất của DUT AI Club.
                            </p>
                        </div>
                        {/* Tab bar */}
                        <div
                            className="flex gap-1 rounded-xl p-1"
                            style={isDark
                                ? { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }
                                : { background: 'rgba(100,80,200,0.10)', backdropFilter: 'blur(10px)', border: '1px solid rgba(100,80,200,0.2)' }
                            }
                        >
                            {(['photo', 'video', 'memory'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === tab
                                        ? 'bg-white text-[#1a1a3a] shadow'
                                        : isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {tab === 'photo' ? 'Thư viện ảnh' : tab === 'video' ? 'Videos' : 'Hồi ức'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Memory cards — alternating layout */}
                    {memorableEvents.length > 0 ? (
                        <div className="space-y-24">
                            {memorableEvents.slice(0, 6).map((ev, idx) => {
                                const fbLink = ((ev as any).facebook as string | undefined) ?? siteMetadata.facebook
                                const isLeft = idx % 2 === 0
                                const photoCount = ev.images?.length ?? 0
                                const year = ev.date ? new Date(ev.date).getFullYear() : ''

                                const TextBlock = (
                                    <div className="flex flex-col justify-center py-4">
                                        {year && (
                                            <span
                                                className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                                                style={isDark ? {
                                                    background: 'rgba(255,255,255,0.15)',
                                                    color: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(255,255,255,0.25)',
                                                } : {
                                                    background: 'rgba(100,80,200,0.12)',
                                                    color: '#4338ca',
                                                    border: '1px solid rgba(100,80,200,0.25)',
                                                }}
                                            >
                                                Kỷ niệm {year}
                                            </span>
                                        )}
                                        <h3 className="mb-3 text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">{ev.title}</h3>
                                        {ev.summary && (
                                            <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-white/70 line-clamp-3">
                                                {ev.summary}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/${ev.path}`}
                                                className="text-sm font-bold text-pink-600 dark:text-pink-300 hover:underline"
                                            >
                                                Xem tất cả {photoCount} ảnh
                                            </Link>
                                            {fbLink && (
                                                <a
                                                    href={fbLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-500 dark:text-blue-300 transition-opacity hover:opacity-75"
                                                    title="Xem album trên Facebook"
                                                >
                                                    <FacebookIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )

                                const PhotoBlock = (
                                    <div className="flex items-center justify-center">
                                        <PhotoStack images={ev.images ?? []} flip={!isLeft} />
                                    </div>
                                )

                                return (
                                    <div key={ev.path} className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
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
                        <div className="flex flex-col items-center py-16 text-slate-400 dark:text-white/40">
                            <span className="mb-4 text-5xl">🖼️</span>
                            <p className="font-semibold">Chưa có sự kiện đáng nhớ nào.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Danh sách sự kiện đã qua ─────────────────────────────────────── */}
            <div className="px-6 py-12 md:px-12">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-white/70">
                        Danh sách sự kiện đã qua
                    </h2>
                    {past.length > 0 ? (
                        <PastEventsList events={past} />
                    ) : (
                        <div className="flex flex-col items-center py-16 text-slate-400 dark:text-white/40">
                            <span className="mb-4 text-5xl">📭</span>
                            <p className="font-semibold">Chưa có sự kiện đã qua.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
