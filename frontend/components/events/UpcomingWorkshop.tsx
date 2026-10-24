'use client'

import React from 'react'
import Image from 'next/image'
import Link from '@/components/Link'
import type { PublicEvent } from 'app/api-client'
import { parseEventDate } from '@/lib/db/features/events/timeline'
import { CalIcon, LocIcon } from './EventIcons'

interface UpcomingWorkshopProps {
    workshopEvent: PublicEvent | null
    error?: boolean
    isDark?: boolean
}

export const UpcomingWorkshop = ({ workshopEvent, error, isDark }: UpcomingWorkshopProps) => {
    return (
        <div className="relative px-6 py-10 md:px-12 pt-40">
            {/* Decorative blobs */}
            {isDark ? (
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
            ) : (
                <>
                    <div
                        className="pointer-events-none fixed top-[-80px] left-[8%] h-[420px] w-[420px] rounded-full opacity-40 blur-[90px]"
                        style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
                    />
                    <div
                        className="pointer-events-none fixed top-[35%] right-[5%] h-[320px] w-[320px] rounded-full opacity-30 blur-[80px]"
                        style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }}
                    />
                </>
            )}

            <div className="relative mx-auto max-w-5xl">
                <div className="mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/70">
                        Sự kiện sắp diễn ra
                    </span>
                </div>
                <h1
                    className="mb-6 font-extrabold uppercase text-slate-900 dark:text-white"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.02em' }}
                >
                    DUT AI MOMENTS
                </h1>
                <div
                    className="mb-6 border-t border-dashed"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(100,80,200,0.25)' }}
                />
                <h2 className="mb-5 text-xl font-extrabold italic text-slate-800 dark:text-white/90">
                    Workshops &amp; Seminar
                </h2>

                {error ? (
                    <div className="mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
                        <p className="text-lg text-slate-200">Không thể kết nối đến server. Vui lòng thử lại sau.</p>
                    </div>
                ) : workshopEvent ? (
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="flex-1">
                            <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: 340 }}>
                                {workshopEvent.img_url ? (
                                    <Image
                                        src={workshopEvent.img_url}
                                        alt={workshopEvent.title}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 700px"
                                        className="object-cover"
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
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                        <span className="flex items-center gap-1">
                                            <CalIcon />
                                            {parseEventDate(workshopEvent.events_date)?.toLocaleDateString('vi-VN', {
                                                timeZone: 'Asia/Ho_Chi_Minh',
                                            }) ?? ''}
                                        </span>
                                        {workshopEvent.location && (
                                            <span className="flex items-center gap-1">
                                                <LocIcon />
                                                {workshopEvent.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                {(workshopEvent.summary || workshopEvent.description) && (
                                    <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-3">
                                        {workshopEvent.summary || workshopEvent.description}
                                    </p>
                                )}
                                <Link
                                    href={workshopEvent.register_link ?? '#'}
                                    className="block w-full rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white"
                                    style={{ background: '#1a1a3a' }}
                                >
                                    Đăng ký tham gia
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="rounded-2xl p-10 text-center text-gray-400"
                        style={{ background: 'rgba(255,255,255,0.6)' }}
                    >
                        <span className="text-5xl">📅</span>
                        <p className="mt-3 font-semibold">Hiện chưa có workshop sắp tới.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UpcomingWorkshop
