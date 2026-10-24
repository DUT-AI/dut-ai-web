'use client'

import React, { useState } from 'react'
import type { Post } from 'app/api-client'
import siteMetadata from '@/data/siteMetadata'
import { parseEventDate, parseImageUrls } from '@/lib/db/features/events/timeline'
import { FacebookIcon } from './EventIcons'
import { PhotoStack } from './PhotoStack'

interface MemorableEventsProps {
    memorableEvents: Post[]
    isDark?: boolean
}

export const MemorableEvents = ({ memorableEvents, isDark }: MemorableEventsProps) => {
    const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'memory'>('photo')

    if (!memorableEvents || memorableEvents.length === 0) {
        return null
    }

    return (
        <div className="relative px-6 py-14 md:px-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Sự kiện đáng nhớ
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-white/60">
                            Lưu giữ khoảnh khắc tuyệt vời nhất.
                        </p>
                    </div>
                    <div
                        className="flex gap-1 rounded-xl p-1"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(100,80,200,0.1)',
                            border: '1px solid rgba(0,0,0,0.1)',
                        }}
                    >
                        {(['photo', 'video', 'memory'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                                    activeTab === tab
                                        ? 'bg-white text-black shadow'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
                                }`}
                            >
                                {tab === 'photo' ? 'Ảnh' : tab === 'video' ? 'Video' : 'Hồi ức'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-24">
                    {memorableEvents.slice(0, 4).map((ev, idx) => {
                        const isLeft = idx % 2 === 0
                        const year =
                            parseEventDate(ev.events_date)?.toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                timeZone: 'Asia/Ho_Chi_Minh',
                            }) ?? ''
                        const fbLink = ev.facebook_url ?? siteMetadata.facebook

                        const Text = (
                            <div className="flex flex-col justify-center">
                                {year && (
                                    <span className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-bold bg-[#5c6bc0]/10 text-[#5c6bc0]">
                                        Kỷ niệm {year}
                                    </span>
                                )}
                                <h3 className="mb-4 text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
                                    {ev.title}
                                </h3>
                                <p className="mb-5 text-sm text-slate-600 dark:text-white/70 line-clamp-4">
                                    {ev.summary || ev.description}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-pink-500">
                                        Xem tất cả {parseImageUrls(ev.img_urls).length} ảnh
                                    </span>
                                    {fbLink && (
                                        <a href={fbLink} target="_blank" rel="noreferrer">
                                            <FacebookIcon className="text-blue-600 hover:opacity-80 transition-opacity" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )

                        const Photos = <PhotoStack images={parseImageUrls(ev.img_urls)} flip={!isLeft} />

                        return (
                            <div key={ev.id} className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                                {isLeft ? (
                                    <>
                                        {Photos}
                                        {Text}
                                    </>
                                ) : (
                                    <>
                                        {Text}
                                        {Photos}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MemorableEvents
