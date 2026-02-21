'use client'

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from './ui/card'

// ── Types ────────────────────────────────────────────────────────────────────
interface Member {
    id: number
    name: string
    email: string
    phone_number: string
    status: string
    role_id: number
    role_name: string
    avatar_url: string | null
    discord_id: string | null
}

type FilterRole = 'BCN' | 'Leader' | 'Teammate'

function getRoleFilter(roleName: string): FilterRole {
    if (roleName === 'admin') return 'BCN'
    if (roleName === 'leader') return 'Leader'
    return 'Teammate'
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DEFAULT_AVATAR = '/static/images/chiikawa.jpeg'
const MOBILE_BREAKPOINT = 640
// Momentum scroll: lower = more inertia (silky glide), higher = snappier
const MOMENTUM_FRICTION = 0.93

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex-shrink-0 w-[180px] h-[260px] flex flex-col items-center justify-center p-4 rounded-2xl border border-primary-100 bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
            <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4" />
            <div className="h-3.5 w-28 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
    )
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-primary-100 bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
                    <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-3" />
                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                    <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
            ))}
        </div>
    )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[220px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-10 text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Không có thành viên trong nhóm này.</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Thử chọn vai trò khác để xem danh sách.</p>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OrganizationSystem() {
    const [activeRole, setActiveRole] = useState<FilterRole>('BCN')
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    // Momentum scroll refs (no re-render needed)
    const targetScrollLeft = useRef(0)
    const currentScrollLeft = useRef(0)
    const rafId = useRef<number | null>(null)

    // Grab-to-drag
    const isDragging = useRef(false)
    const dragVelocity = useRef(0) // for post-drag momentum

    // ── 1. Responsive detect ─────────────────────────────────────────────────
    useLayoutEffect(() => {
        const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        check()
        const ro = new ResizeObserver(check)
        ro.observe(document.documentElement)
        return () => ro.disconnect()
    }, [])

    // ── 2. Fetch ──────────────────────────────────────────────────────────────
    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await fetch('/api/members')
                if (!res.ok) throw new Error('Failed to fetch members')
                const data: Member[] = await res.json()
                setMembers(data.filter((m) => m.status === 'active'))
            } catch {
                setError('Không thể tải danh sách thành viên.')
            } finally {
                setLoading(false)
            }
        }
        fetchMembers()
    }, [])

    // ── 3. Momentum scroll engine (rAF) ──────────────────────────────────────
    const animateMomentum = useCallback(() => {
        const container = scrollRef.current
        if (!container) return

        const diff = targetScrollLeft.current - currentScrollLeft.current
        // If close enough, stop
        if (Math.abs(diff) < 0.5) {
            currentScrollLeft.current = targetScrollLeft.current
            container.scrollLeft = targetScrollLeft.current
            rafId.current = null
            return
        }

        currentScrollLeft.current += diff * (1 - MOMENTUM_FRICTION)
        container.scrollLeft = currentScrollLeft.current
        rafId.current = requestAnimationFrame(animateMomentum)
    }, [])

    const scheduleScroll = useCallback((delta: number) => {
        const container = scrollRef.current
        if (!container) return
        const maxScroll = container.scrollWidth - container.clientWidth
        targetScrollLeft.current = Math.max(0, Math.min(maxScroll, targetScrollLeft.current + delta))
        if (rafId.current === null) {
            rafId.current = requestAnimationFrame(animateMomentum)
        }
    }, [animateMomentum])

    // ── 4. Wheel — isolation + momentum ──────────────────────────────────────
    const handleWheel = useCallback((e: WheelEvent) => {
        if (isMobile) return
        e.preventDefault()
        // Support trackpads (deltaX) and mice (deltaY)
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
        scheduleScroll(delta * 2)
    }, [isMobile, scheduleScroll])

    useEffect(() => {
        const container = scrollRef.current
        if (!container || isMobile) return
        // Sync target with actual position when content changes
        targetScrollLeft.current = container.scrollLeft
        currentScrollLeft.current = container.scrollLeft

        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => {
            container.removeEventListener('wheel', handleWheel)
            if (rafId.current !== null) cancelAnimationFrame(rafId.current)
        }
    }, [handleWheel, isMobile, members, activeRole])

    // ── 5. Grab-to-drag ───────────────────────────────────────────────────────
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return
        isDragging.current = true
        dragVelocity.current = 0
        // Cancel ongoing momentum so drag takes over
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current)
            rafId.current = null
        }
        const container = scrollRef.current
        if (container) {
            targetScrollLeft.current = container.scrollLeft
            currentScrollLeft.current = container.scrollLeft
        }
        e.preventDefault()
    }, [isMobile])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging.current || isMobile) return
        const container = scrollRef.current
        if (!container) return
        const dx = e.movementX
        dragVelocity.current = dx
        const maxScroll = container.scrollWidth - container.clientWidth
        const next = Math.max(0, Math.min(maxScroll, container.scrollLeft - dx))
        container.scrollLeft = next
        targetScrollLeft.current = next
        currentScrollLeft.current = next
    }, [isMobile])

    const stopDragging = useCallback(() => {
        if (!isDragging.current) return
        isDragging.current = false
        // Release with remaining velocity as post-drag momentum
        if (Math.abs(dragVelocity.current) > 1) {
            scheduleScroll(-dragVelocity.current * 4)
        }
        dragVelocity.current = 0
    }, [scheduleScroll])

    // ── 6. Role helpers ───────────────────────────────────────────────────────
    const getRoleLabel = useCallback((filter: FilterRole) => {
        if (filter === 'BCN') return 'Ban Chấp Hành'
        if (filter === 'Leader') return 'Trưởng ban'
        return 'Thành viên'
    }, [])

    const getMemberRoleLabel = useCallback((roleName: string) => {
        if (roleName === 'admin') return 'Ban Chấp Hành'
        if (roleName === 'leader') return 'Leader'
        return 'Thành viên'
    }, [])

    const filteredMembers = members.filter((m) => getRoleFilter(m.role_name) === activeRole)

    // ── 7. Render ─────────────────────────────────────────────────────────────
    return (
        /*
         * Parent section in page.tsx is now full-width (no max-w-5xl card).
         * OrgSystem just needs its own internal padding for header/filters,
         * while the scroll track can extend fully.
         */
        <div className="py-4">

            {/* Header + Filter */}
            <div className="px-6 md:px-12">
                <h2 className="mb-6 text-2xl font-bold text-primary-900 dark:text-white">
                    Hệ thống tổ chức
                </h2>

                <div className="flex flex-wrap gap-4 mb-8" role="group" aria-label="Lọc theo vai trò">
                    {(['BCN', 'Leader', 'Teammate'] as FilterRole[]).map((role) => (
                        <button
                            key={role}
                            onClick={() => setActiveRole(role)}
                            aria-label={`Lọc thành viên: ${getRoleLabel(role)}`}
                            aria-pressed={activeRole === role}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary-500 ${activeRole === role
                                ? 'bg-rose-500 text-white shadow-md dark:bg-rose-600'
                                : 'bg-white/70 text-primary-600 hover:bg-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {getRoleLabel(role)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && <p className="px-6 md:px-12 text-red-500 font-medium">{error}</p>}

            {loading && (
                isMobile
                    ? <div className="px-6 md:px-12"><SkeletonGrid /></div>
                    : (
                        <div className="flex flex-row gap-6 overflow-x-auto pb-4 h-[300px] scrollbar-hide px-6 md:px-12">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )
            )}

            {/* Content */}
            {!loading && !error && (
                isMobile ? (
                    /* ── Mobile: 2-col vertical grid ── */
                    <div className="px-6 md:px-12">
                        {filteredMembers.length === 0
                            ? <EmptyState />
                            : (
                                <div className="grid grid-cols-2 gap-4">
                                    {filteredMembers.map((member) => (
                                        <MemberCard key={member.id} member={member} getRoleLabel={getMemberRoleLabel} mobile />
                                    ))}
                                </div>
                            )
                        }
                    </div>
                ) : (
                    /* ── Desktop: full-bleed horizontal scroll with gradient mask ── */
                    <div className="relative">
                        {/* Left fade gradient — matches rose-50 (light) / gray-900 (dark) section bg */}
                        <div
                            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-rose-50 to-transparent dark:from-gray-900"
                            aria-hidden="true"
                        />
                        {/* Right fade gradient */}
                        <div
                            className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-rose-50 to-transparent dark:from-gray-900"
                            aria-hidden="true"
                        />

                        {/* Scroll container */}
                        <div
                            ref={scrollRef}
                            className="flex flex-row gap-5 overflow-x-auto pb-6 h-[300px] scrollbar-hide select-none cursor-grab active:cursor-grabbing"
                            style={{
                                // No scroll-behavior: smooth — our rAF handles it
                                WebkitOverflowScrolling: 'touch',
                                touchAction: 'pan-x',
                                overscrollBehaviorX: 'contain',
                                scrollSnapType: 'x mandatory',
                                paddingLeft: '1.5rem',      // px-6 equivalent
                                paddingRight: '1.5rem',
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={stopDragging}
                            onMouseLeave={stopDragging}
                        >
                            {filteredMembers.length === 0
                                ? <EmptyState />
                                : filteredMembers.map((member) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        getRoleLabel={getMemberRoleLabel}
                                        mobile={false}
                                    />
                                ))
                            }
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

// ── MemberCard ────────────────────────────────────────────────────────────────
interface MemberCardProps {
    member: { id: number; name: string; role_name: string; avatar_url: string | null }
    getRoleLabel: (roleName: string) => string
    mobile: boolean
}

function MemberCard({ member, getRoleLabel, mobile }: MemberCardProps) {
    return (
        <Card
            className={`group flex flex-col items-center p-4 transition-all duration-300
                hover:shadow-2xl hover:border-primary-500
                border border-primary-100 bg-white
                dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-400
                ${mobile
                    ? 'w-full rounded-2xl'
                    : 'flex-shrink-0 w-[180px] h-[260px] rounded-2xl'
                }
            `}
            style={mobile ? undefined : { scrollSnapAlign: 'center' }}
        >
            <CardContent className="flex flex-col items-center p-0 w-full justify-center h-full">
                {/* Avatar — perfect square via explicit w/h */}
                <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-2xl border-2 border-primary-100 group-hover:border-primary-500 transition-all duration-300 shadow-sm dark:border-gray-700 dark:group-hover:border-primary-400 flex-shrink-0 will-change-transform">
                    <Image
                        src={member.avatar_url || DEFAULT_AVATAR}
                        alt={member.name}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={!!member.avatar_url}
                    />
                </div>

                <h4 className="font-bold text-sm text-center uppercase leading-tight line-clamp-2 px-2 text-primary-900 dark:text-white">
                    {member.name}
                </h4>

                <p className="text-[10px] uppercase tracking-widest text-center mt-3 font-bold text-rose-500 dark:text-rose-400">
                    {getRoleLabel(member.role_name)}
                </p>
            </CardContent>
        </Card>
    )
}