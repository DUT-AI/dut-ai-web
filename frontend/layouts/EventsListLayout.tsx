'use client'

import React, { useState, useEffect, Suspense } from 'react'
import type { PublicEvent, Post, PastEvent } from 'app/api-client'
import Footer from '@/components/Footer'
import { useTheme } from 'next-themes'
import {
    buildPastEvents,
    getUpcomingPublicEvent,
    parseImageUrls,
} from '@/lib/db/features/events/timeline'
import {
    UpcomingWorkshop,
    MemorableEvents,
    PastEventsList,
    type PaginationProps,
} from '@/components/events'

export interface EventsListLayoutProps {
    publicEvents: PublicEvent[]
    posts: Post[]
    initialDisplayPosts?: PastEvent[]
    pagination?: PaginationProps
    error?: boolean
    referenceTime: string
}

function EventsListLayoutInner({
    publicEvents,
    posts,
    initialDisplayPosts,
    pagination,
    error,
    referenceTime,
}: EventsListLayoutProps) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const workshopEvent = getUpcomingPublicEvent(publicEvents, referenceTime)
    const memorableEvents = posts.filter((p) => parseImageUrls(p.img_urls).length > 0)
    const allPastEvents = buildPastEvents(publicEvents, posts, referenceTime)

    const displayEvents = initialDisplayPosts || allPastEvents.slice(0, 5)
    const displayPagination =
        pagination || { currentPage: 1, totalPages: Math.ceil(allPastEvents.length / 5) }

    const { resolvedTheme } = useTheme()
    const isDark = mounted && resolvedTheme !== 'light'
    const pageBg = mounted ? (isDark ? '#020617' : '#f8fafc') : '#f8fafc'
    const showFeatured = !pagination || pagination.currentPage === 1

    return (
        <div className="min-h-screen pb-16" style={{ background: pageBg }}>
            {/* ── Hero + Upcoming Workshop ── */}
            {showFeatured && (
                <UpcomingWorkshop
                    workshopEvent={workshopEvent}
                    error={error}
                    isDark={isDark}
                />
            )}

            {/* ── Memorable Events ── */}
            {showFeatured && (
                <MemorableEvents
                    memorableEvents={memorableEvents}
                    isDark={isDark}
                />
            )}

            {/* ── Past Events ── */}
            <div className={`px-6 py-12 md:px-12 ${!showFeatured ? 'pt-40' : ''}`}>
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                        Danh sách sự kiện đã qua
                    </h2>
                    {displayEvents.length > 0 ? (
                        <PastEventsList
                            events={displayEvents}
                            pagination={displayPagination}
                        />
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
