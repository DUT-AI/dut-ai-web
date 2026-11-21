'use client'

import { useRef, useState, useEffect } from 'react'
import Link from '@/components/common/Link'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import type { Blog } from 'app/api-client'
import Image from 'next/image'
import { getBlogThumbnailPath } from '@/lib/blog-thumbnail-url'

interface RelatedPostsProps {
  posts: Blog[]
  hideTitle?: boolean
}

const gradients = [
  'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#22c55e1a] dark:to-[#eab3081a] bg-linear-to-r from-[#EDFCE9] to-[#FEFBE8]', // Green to Yellow
  'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#64748b1a] dark:to-[#14b8a61a] bg-linear-to-r from-[#EDF5FF] to-[#F1F8FF]', // Slate to Teal
  'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#f973161a] dark:to-[#ec48991a] bg-linear-to-r from-[#FFF5F5] to-[#FFF0ED]', // Orange to Pink
  'bg-white dark:bg-transparent dark:bg-linear-to-br dark:from-[#8b5cf61a] dark:to-[#d946ef1a] bg-linear-to-r from-[#F4F2FF] to-[#FCEEFE]', // Purple to Fuchsia
]

export default function RelatedPosts({ posts, hideTitle }: RelatedPostsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Ensure 7 posts
  const displayPosts = posts ? posts.slice(0, 7) : []

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
    if (displayPosts.length === 0) return
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [displayPosts.length])

  if (!posts || posts.length === 0) return null

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth // Scroll by one full view width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })

      // Delay checkScroll slightly to allow smooth scroll to complete
      setTimeout(checkScroll, 500)
    }
  }

  return (
    <div className="w-full">
      {!hideTitle && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900 md:text-3xl dark:text-white">
            Bài viết liên quan
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label="Previous"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-gray-700"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label="Next"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-gray-700"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayPosts.map((post, index) => {
          const backgroundClass = gradients[index % gradients.length]
          const maxTagsDisplay = post.keywords ? post.keywords.slice(0, 1) : []

          return (
            <div key={post.id} className="w-full shrink-0 snap-start md:w-[calc(33.333%-16px)]">
              <article
                className={`rounded-[32px] p-8 ${backgroundClass} group relative flex h-full flex-col overflow-hidden ring-1 ring-gray-100 transition-transform duration-300 hover:-translate-y-1 dark:ring-white/10`}
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="relative mb-5 aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/40">
                    <Image
                      src={post.image_url || getBlogThumbnailPath(post.slug || post.id)}
                      alt={`Ảnh bìa ${post.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Top Row: Date & Tag */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <time
                      dateTime={post.created_at}
                      className="text-xs font-bold tracking-wide text-gray-500/80 dark:text-gray-400"
                    >
                      {formatDate(post.created_at, siteMetadata.locale)}
                    </time>
                    {maxTagsDisplay.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${slug(tag.keyword_name)}`}
                        className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold tracking-wide text-blue-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/60 dark:text-blue-400 dark:hover:bg-gray-800"
                      >
                        <span className="mr-0.5 opacity-60">#</span>
                        {tag.keyword_name}
                      </Link>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 line-clamp-3 text-[20px] leading-snug font-extrabold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      className="rounded-lg focus:outline-none"
                    >
                      <span className="absolute inset-0 z-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="mt-auto line-clamp-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300">
                    {post.summary}
                  </p>
                </div>
              </article>
            </div>
          )
        })}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </div>
  )
}
