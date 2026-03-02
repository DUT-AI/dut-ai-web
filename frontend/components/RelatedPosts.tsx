'use client'

import { useRef, useState, useEffect } from 'react'
import Link from '@/components/Link'
import { slug } from 'github-slugger'
import type { BlogPost } from 'app/api-client'

interface RelatedPostsProps {
    posts: BlogPost[]
    hideTitle?: boolean
    title?: string
}

const gradients = [
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#22c55e1a] dark:to-[#eab3081a] bg-linear-to-r from-[#EDFCE9] to-[#FEFBE8]', // Green to Yellow
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#64748b1a] dark:to-[#14b8a61a] bg-linear-to-r from-[#EDF5FF] to-[#F1F8FF]', // Slate to Teal
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#f973161a] dark:to-[#ec48991a] bg-linear-to-r from-[#FFF5F5] to-[#FFF0ED]', // Orange to Pink
    'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#8b5cf61a] dark:to-[#d946ef1a] bg-linear-to-r from-[#F4F2FF] to-[#FCEEFE]', // Purple to Fuchsia
]

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}


export default function RelatedPosts({ posts, hideTitle, title = "Bài viết liên quan" }: RelatedPostsProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    if (!posts || posts.length === 0) return null

    // Ensure 7 posts max
    const displayPosts = posts.slice(0, 7)

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setCanScrollLeft(scrollLeft > 0)
            // add a small buffer (1px) to prevent rounding issues
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
        }
    }

    // Initial check on mount
    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [displayPosts])

    const scrollByAmount = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth // Scroll by one full view width
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })

            // Delay checkScroll slightly to allow smooth scroll to complete
            setTimeout(checkScroll, 500)
        }
    }

    return (
        <div className="w-full">
            {!hideTitle && (
                <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scrollByAmount('left')}
                            disabled={!canScrollLeft}
                            className={`flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-10 h-10 rounded-full border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label="Previous"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollByAmount('right')}
                            disabled={!canScrollRight}
                            className={`flex items-center justify-center bg-white hover:bg-gray-50 transition-colors w-10 h-10 rounded-full border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label="Next"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayPosts.map((post, index) => {
                    const backgroundClass = gradients[index % gradients.length]

                    return (
                        <div key={post.id} className="w-full md:w-[calc(33.333%-16px)] shrink-0 snap-start">
                            <article
                                className={`rounded-[32px] p-8 ${backgroundClass} transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden group flex flex-col h-full ring-1 ring-gray-100 dark:ring-white/10`}
                            >
                                <div className="flex flex-col h-full relative z-10 text-pretty">
                                    {/* Top Row: Date & Tag */}
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <time dateTime={post.created_at} className="text-xs font-bold tracking-wide text-gray-500/80 dark:text-gray-400">
                                            {formatDate(post.created_at)}
                                        </time>
                                        {post.keywords?.[0] && (
                                            <Link href={`/blog?tag=${encodeURIComponent(post.keywords[0].keyword_name)}`} className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/60 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                                <span className="opacity-60 mr-0.5">#</span>{post.keywords[0].keyword_name}
                                            </Link>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[20px] leading-snug font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                                        <Link href={`/blog/${post.slug || post.id}`} className="focus:outline-none rounded-lg">
                                            <span className="absolute inset-0 z-0" aria-hidden="true" />
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {/* Summary */}
                                    <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mt-auto">
                                        {post.summary}
                                    </p>
                                </div>
                            </article>
                        </div>
                    )
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
        </div>
    )
}