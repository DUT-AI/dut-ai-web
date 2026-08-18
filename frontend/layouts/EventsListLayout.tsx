'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import type { PublicEvent, Post, PastEvent } from 'app/api-client'
import Link from '@/components/Link'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import Footer from '@/components/Footer'
import { useTheme } from 'next-themes'

interface PaginationProps {
    totalPages: number
    currentPage: number
}

interface EventsListLayoutProps {
    publicEvents: PublicEvent[]
    posts: Post[]
    initialDisplayPosts?: PastEvent[]
    pagination?: PaginationProps
    error?: boolean
}

// ── Safely parse img_urls that backend may return as Python-style string ──────
function parseImgUrls(urls: string[] | string | undefined | null): string[] {
    if (!urls) return []
    // Already a proper array — filter out junk entries like '[]' or non-http
    if (Array.isArray(urls)) {
        return urls.flatMap((u) => {
            if (typeof u !== 'string') return []
            if (u.startsWith('http')) return [u]
            // element itself might be a stringified list (edge case)
            return (u.match(/https?:\/\/[^'" ,\]]+/g) || [])
        })
    }
    // String — extract every http(s) URL via regex regardless of format
    // Handles: JSON arrays, Python repr lists, plain URLs
    return (urls.match(/https?:\/\/[^'" ,\]]+/g) || [])
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

// ── Scattered photo cards ───────────────────────────────────────────────────
const PhotoStack = ({ images, flip = false }: { images: string[]; flip?: boolean }) => {
    const W = 170, H = 205

    const cards = flip
        ? [
            { top: 0, left: 140, rotate: 12, z: 0, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 18, left: 45, rotate: 5, z: 1, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 108, left: 0, rotate: -7, z: 2, bg: 'linear-gradient(150deg,#a8bfb0,#8eab94)' },
            { top: 100, left: 150, rotate: 3, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]
        : [
            { top: 0, left: 0, rotate: -12, z: 0, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 18, left: 105, rotate: -5, z: 1, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 108, left: 165, rotate: 8, z: 2, bg: 'linear-gradient(150deg,#e8dcc8,#d4c4a0)' },
            { top: 100, left: 10, rotate: -2, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]

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

// ── Pagination component (URL-based) ──────────────────────────────────────────
function Pagination({ totalPages, currentPage }: PaginationProps) {
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
function PastEventsList({ events, pagination }: { events: PastEvent[], pagination?: PaginationProps }) {
    return (
        <div>
            {events.map((ev) => {
                const date = ev.date ? new Date(ev.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : ''
                const fbLink = ev.facebook_url ?? siteMetadata.facebook

                return (
                    <div key={ev.id}
                        className="mb-3 flex items-center gap-4 rounded-2xl p-4 shadow-sm border"
                        style={{
                            background: 'rgba(255,255,255,0.75)',
                            backdropFilter: 'blur(12px)',
                            borderColor: 'rgba(255,255,255,0.7)',
                        }}>
                        {/* Thumbnail */}
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#c5cfc8]">
                            {ev.cover ? (
                                <Image src={ev.cover} alt={ev.title} fill className="object-cover" unoptimized />
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
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
                </div>
            )}
        </div>
    )
}

// ── Main layout inner (handles featured + lists) ───────────────────────────
function EventsListLayoutInner({ publicEvents, posts, initialDisplayPosts, pagination, error }: EventsListLayoutProps) {
    const now = new Date()

    // Workshops & Seminar: find upcoming
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const workshopEvent = publicEvents.find((ev) => {
        const d = ev.events_date ? new Date(ev.events_date) : null
        return d && d >= now
    }) ?? publicEvents[0] ?? null

    // Memorable events
    const memorableEvents = posts.filter((p) => parseImgUrls(p.img_urls).length > 0)

    // Sorted past events
    const allPastEvents: PastEvent[] = [
        ...publicEvents.map((ev) => ({
            id: `pe-${ev.id}`,
            type: 'public_event' as const,
            title: ev.title,
            summary: ev.summary || ev.description,
            cover: ev.img_url,
            date: ev.events_date || ev.created_at,
            facebook_url: ev.facebook_url,
        })),
        ...posts.map((p) => ({
            id: `post-${p.id}`,
            type: 'post' as const,
            title: p.title,
            summary: p.summary || p.description,
            cover: p.img_urls?.[0],
            date: p.events_date || p.created_at,
            facebook_url: p.facebook_url,
        })),
    ].sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return db - da
    })

    const displayEvents = initialDisplayPosts || allPastEvents.slice(0, 5)
    // Use the passed pagination or calculate default for page 1
    const displayPagination = pagination || { currentPage: 1, totalPages: Math.ceil(allPastEvents.length / 5) }

    const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'memory'>('photo')

    const { resolvedTheme } = useTheme()
    const isDark = mounted && resolvedTheme !== 'light'
    const pageBg = mounted ? (isDark ? '#020617' : '#f8fafc') : '#f8fafc'

    // Show featured only on first page
    const showFeatured = !pagination || pagination.currentPage === 1

    return (
        <div className="min-h-screen pb-16" style={{ background: pageBg }}>
            {/* ── Hero + Workshop ── */}
            {showFeatured && (
                <div className="relative px-6 py-10 md:px-12 pt-40">
                    {/* Decorative blobs */}
                    {isDark ? (
                        <>
                            <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }} />
                            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)' }} />
                        </>
                    ) : (
                        <>
                            <div className="pointer-events-none fixed top-[-80px] left-[8%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]" style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />
                            <div className="pointer-events-none fixed top-[35%] right-[5%] h-[320px] w-[320px] rounded-full opacity-30 blur-[80px]" style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }} />
                        </>
                    )}

                    <div className="relative mx-auto max-w-5xl">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/70">Sự kiện sắp diễn ra</span>
                        </div>
                        <h1 className="mb-6 font-extrabold uppercase text-slate-900 dark:text-white" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.02em' }}>DUT AI MOMENTS</h1>
                        <div className="mb-6 border-t border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(100,80,200,0.25)' }} />
                        <h2 className="mb-5 text-xl font-extrabold italic text-slate-800 dark:text-white/90">Workshops &amp; Seminar</h2>

                        {error ? (
                            <div className="mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
                                <p className="text-lg text-slate-200">Không thể kết nối đến server. Vui lòng thử lại sau.</p>
                            </div>
                        ) : workshopEvent ? (
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <div className="flex-1">
                                    <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: 340 }}>
                                        {workshopEvent.img_url ? (
                                            <Image src={workshopEvent.img_url} alt={workshopEvent.title} fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)' }} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {workshopEvent.tags?.filter(t => t !== 'event').slice(0, 3).map(tag => (
                                                    <span key={tag} className="rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white" style={{ borderColor: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>{tag}</span>
                                                ))}
                                            </div>
                                            <h3 className="mb-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">{workshopEvent.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                                <span className="flex items-center gap-1"><CalIcon />{workshopEvent.events_date ? new Date(workshopEvent.events_date).toLocaleDateString('vi-VN') : ''}</span>
                                                {workshopEvent.location && <span className="flex items-center gap-1"><LocIcon />{workshopEvent.location}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-4 lg:w-64">
                                    <div className="rounded-2xl border p-5 shadow-lg" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(14px)', borderColor: 'rgba(255,255,255,0.8)' }}>
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#5c6bc0]">Đăng ký ngay</p>
                                        <p className="mb-2 font-bold text-gray-800">{workshopEvent.title}</p>
                                        {(workshopEvent.summary || workshopEvent.description) && <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-3">{workshopEvent.summary || workshopEvent.description}</p>}
                                        <Link href={workshopEvent.register_link ?? '#'} className="block w-full rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white" style={{ background: '#1a1a3a' }}>Đăng ký tham gia</Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl p-10 text-center text-gray-400" style={{ background: 'rgba(255,255,255,0.6)' }}><span className="text-5xl">📅</span><p className="mt-3 font-semibold">Hiện chưa có workshop sắp tới.</p></div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Memorable Events ── */}
            {showFeatured && memorableEvents.length > 0 && (
                <div className="relative px-6 py-14 md:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div><h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sự kiện đáng nhớ</h2><p className="text-sm text-slate-500 dark:text-white/60">Lưu giữ khoảnh khắc tuyệt vời nhất.</p></div>
                            <div className="flex gap-1 rounded-xl p-1" style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(100,80,200,0.1)', border: '1px solid rgba(0,0,0,0.1)' }}>
                                {['photo', 'video', 'memory'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${activeTab === tab ? 'bg-white text-black shadow' : 'text-gray-500'}`}>{tab === 'photo' ? 'Ảnh' : tab === 'video' ? 'Video' : 'Hồi ức'}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-24">
                            {memorableEvents.slice(0, 4).map((ev, idx) => {
                                const isLeft = idx % 2 === 0
                                const year = ev.events_date ? new Date(ev.events_date).getFullYear() : ''
                                const fbLink = ev.facebook_url ?? siteMetadata.facebook

                                const Text = (
                                    <div className="flex flex-col justify-center">
                                        {year && <span className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-bold bg-[#5c6bc0]/10 text-[#5c6bc0]">Kỷ niệm {year}</span>}
                                        <h3 className="mb-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">{ev.title}</h3>
                                        <p className="mb-5 text-sm text-slate-600 dark:text-white/70 line-clamp-4">{ev.summary || ev.description}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-pink-500">Xem tất cả {parseImgUrls(ev.img_urls).length} ảnh</span>
                                            {fbLink && <a href={fbLink} target="_blank" rel="noreferrer"><FacebookIcon className="text-blue-600" /></a>}
                                        </div>
                                    </div>
                                )
                                const Photos = <PhotoStack images={parseImgUrls(ev.img_urls)} flip={!isLeft} />

                                return (
                                    <div key={ev.id} className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                                        {isLeft ? <>{Photos}{Text}</> : <>{Text}{Photos}</>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Past Events ── */}
            <div className={`px-6 py-12 md:px-12 ${!showFeatured ? 'pt-40' : ''}`}>
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Danh sách sự kiện đã qua</h2>
                    {displayEvents.length > 0 ? (
                        <PastEventsList events={displayEvents} pagination={displayPagination} />
                    ) : (
                        <div className="py-16 text-center text-gray-400">Chưa có sự kiện nào.</div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default function EventsListLayout(props: EventsListLayoutProps) {
    return (
        <Suspense fallback={<div className="min-h-screen pt-40 text-center">Đang tải...</div>}>
            <EventsListLayoutInner {...props} />
        </Suspense>
    )
}
