'use client'

import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'

interface PaginationProps {
    totalPages: number
    currentPage: number
}
interface EventsListLayoutProps {
    posts: CoreContent<Blog>[]
    initialDisplayPosts?: CoreContent<Blog>[]
    pagination?: PaginationProps
}

const CALENDAR_ICON = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname()
    const basePath = pathname.replace(/^\//, '').replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '')
    const prevPage = currentPage - 1 > 0
    const nextPage = currentPage + 1 <= totalPages
    return (
        <div className="flex items-center justify-between pt-8">
            {prevPage ? (
                <Link href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:border-gray-700 dark:text-primary-300 dark:hover:bg-gray-800">
                    ← Trang trước
                </Link>
            ) : <span />}
            <span className="text-sm text-gray-500 dark:text-gray-400">{currentPage} / {totalPages}</span>
            {nextPage ? (
                <Link href={`/${basePath}/page/${currentPage + 1}`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:border-gray-700 dark:text-primary-300 dark:hover:bg-gray-800">
                    Trang sau →
                </Link>
            ) : <span />}
        </div>
    )
}

export default function EventsListLayout({
    posts,
    initialDisplayPosts = [],
    pagination,
}: EventsListLayoutProps) {
    const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

    return (
        <div className="min-h-screen pb-16">
            {/* Page Header */}
            <div className="relative overflow-hidden py-14">
                <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-rose-200 opacity-30 blur-3xl dark:opacity-10" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-200 opacity-30 blur-3xl dark:opacity-10" />
                <div className="relative mx-auto max-w-5xl px-6">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                        🗓 Sự kiện CLB
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl dark:text-white">
                        Events & Hoạt động
                    </h1>
                    <p className="mt-3 max-w-xl text-base text-primary-600 dark:text-gray-400">
                        Tất cả workshop, cuộc thi và sự kiện do DUT AI Club tổ chức — {posts.length} sự kiện đã đăng.
                    </p>
                </div>
            </div>

            {/* Events Grid */}
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayPosts.map((post) => {
                        const { path, date, title, summary, tags, images } = post
                        const coverImg = images && images.length > 0 ? images[0] : null
                        const nonEventTags = tags?.filter((t) => t !== 'event') ?? []
                        return (
                            <article key={path} className="group flex flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {/* Cover image */}
                                {coverImg ? (
                                    <div className="relative h-40 w-full overflow-hidden bg-primary-50 dark:bg-gray-900">
                                        <Image src={coverImg} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                    </div>
                                ) : (
                                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary-100 to-rose-100 dark:from-primary-900/40 dark:to-rose-900/30">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    {/* Date */}
                                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
                                        {CALENDAR_ICON}
                                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                                    </div>

                                    {/* Title */}
                                    <h2 className="mb-2 text-base font-bold leading-snug text-primary-900 dark:text-white">
                                        <Link href={`/${path}`} className="hover:underline">{title}</Link>
                                    </h2>

                                    {/* Tags */}
                                    {nonEventTags.length > 0 && (
                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {nonEventTags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Summary */}
                                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-primary-600 dark:text-gray-400">{summary}</p>

                                    {/* CTA */}
                                    <div className="mt-4">
                                        <Link href={`/${path}`} className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300">
                                            Xem chi tiết →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {displayPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <span className="mb-4 text-6xl">📭</span>
                        <p className="text-lg font-semibold">Chưa có sự kiện nào.</p>
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
                )}
            </div>
        </div>
    )
}
