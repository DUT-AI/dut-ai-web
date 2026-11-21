'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  contentSelector?: string
}

export default function TableOfContents({ contentSelector = '.prose' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // ref cho container list để cuộn nội bộ
  const navRef = useRef<HTMLElement>(null)
  // ref map từ id → li element
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // ── Parse headings ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const article = document.querySelector(contentSelector)
      if (!article) return
      const nodes = Array.from(article.querySelectorAll('h1, h2, h3, h4'))
      const items: Heading[] = nodes.map((node) => {
        if (!node.id) {
          const text = node.textContent || ''
          node.id = text
            .toLowerCase()
            .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return {
          id: node.id,
          text: node.textContent ?? '',
          level: parseInt(node.tagName[1], 10),
        }
      })
      setHeadings(items)
    }, 300)

    return () => clearTimeout(timer)
  }, [contentSelector])

  // ── Auto-scroll TOC: giữ active item ở giữa container ───────────────────
  useEffect(() => {
    if (!activeId) return

    const activeItem = itemRefs.current.get(activeId)
    const container = navRef.current
    if (!activeItem || !container) return

    const containerRect = container.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()

    const itemOffsetInContainer = itemRect.top - containerRect.top + container.scrollTop
    const itemHeight = activeItem.clientHeight
    const containerHeight = container.clientHeight

    const targetScrollTop = itemOffsetInContainer - containerHeight / 2 + itemHeight / 2

    // SỬ DỤNG behavior: 'auto' (hoặc bỏ behavior) để cập nhật tức thì.
    // Khi dùng 'smooth', nếu setActiveId gọi liên tục (lúc đang cuộn trang),
    // các lệnh scroll của sidebar sẽ bị chồng chéo gây ra hiện tượng "giật".
    container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' })
  }, [activeId])

  // ── Active tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!headings.length) return
    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [headings])

  const handleClick = useCallback((id: string) => {
    // Cuộn trang web
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // KHÔNG gọi setActiveId(id) ở đây.
    // Để IntersectionObserver tự bắt các heading trung gian khi trang cuộn qua.
    // Điều này giúp hiệu ứng "chạy loăng quăng" (sequential highlight) mượt mà hơn.
  }, [])

  if (!headings.length) return null

  return (
    <div className="hidden w-full shrink-0 lg:block lg:w-[300px] xl:w-[320px]">
      <aside
        aria-label="Mục lục bài viết"
        className="sticky top-24 self-start rounded-[24px] bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
      >
        {/* Header row – không cuộn */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 pt-6 pb-4 sm:px-8 sm:pt-8 dark:border-gray-800">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="shrink-0 text-blue-600 dark:text-blue-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <h3 className="text-sm font-extrabold tracking-widest text-gray-900 uppercase dark:text-gray-100">
            MỤC LỤC
          </h3>
        </div>

        {/* Scrollable nav list */}
        <nav
          ref={navRef}
          className="no-scrollbar max-h-[calc(100vh-160px)] overflow-y-auto px-6 py-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <ul className="space-y-4">
            {headings.map(({ id, text, level }, index) => {
              const isActive = activeId === id || (activeId === '' && index === 0)

              return (
                <li
                  key={id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(id, el)
                    else itemRefs.current.delete(id)
                  }}
                >
                  <button
                    onClick={() => handleClick(id)}
                    className={cn(
                      'relative block w-full py-1 text-left transition-all duration-150',
                      level === 1 && 'pl-4 text-[16px] font-extrabold',
                      level === 2 && 'pl-9 text-[15px] font-bold',
                      level === 3 &&
                        'pl-14 text-[14px] font-semibold text-gray-600 dark:text-gray-400',
                      level === 4 &&
                        'pl-20 text-[13px] font-medium text-gray-500 dark:text-gray-500',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {/* Active Highlight Line */}
                    {isActive && (
                      <span className="absolute top-0 bottom-0 left-0 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                    <span className="line-clamp-2 leading-snug">{text}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
