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

export default function TableOfContents({
    contentSelector = '.prose',
}: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const [expanded, setExpanded] = useState(false)
    const observerRef = useRef<IntersectionObserver | null>(null)

    // ── Parse headings ──────────────────────────────────────────────────────────
    useEffect(() => {
        const article = document.querySelector(contentSelector)
        if (!article) return
        const nodes = Array.from(article.querySelectorAll('h2, h3, h4'))
        const items: Heading[] = nodes.map((node, i) => {
            if (!node.id) node.id = `toc-${i}`
            return {
                id: node.id,
                text: node.textContent ?? '',
                level: parseInt(node.tagName[1], 10),
            }
        })
        setHeadings(items)
    }, [contentSelector])

    // ── Active tracking ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!headings.length) return
        observerRef.current?.disconnect()
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible.length) setActiveId(visible[0].target.id)
            },
            { rootMargin: '0px 0px -68% 0px', threshold: 0 }
        )
        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observerRef.current?.observe(el)
        })
        return () => observerRef.current?.disconnect()
    }, [headings])

    const handleClick = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveId(id)
        setExpanded(false)   // collapse after navigation
    }, [])

    if (!headings.length) return null

    // How far (0–1) through the document the active heading is
    const activeIndex = headings.findIndex((h) => h.id === activeId)
    const progress = headings.length > 1 ? Math.max(0, activeIndex) / (headings.length - 1) : 0

    return (
        <div className="hidden lg:block w-full lg:w-[300px] xl:w-[320px] shrink-0">
            <aside
                aria-label="Mục lục bài viết"
                className="sticky top-24 self-start bg-white dark:bg-gray-900 rounded-[24px] p-6 sm:p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800"
            >
                {/* Header row */}
                <div className="mb-6 flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600 dark:text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 dark:text-gray-100">
                        MỤC LỤC
                    </h3>
                </div>

                <nav>
                    <ul className="space-y-4">
                        {headings.map(({ id, text, level }, index) => {
                            const isActive = activeId === id || (activeId === '' && index === 0);

                            return (
                                <li key={id}>
                                    <button
                                        onClick={() => handleClick(id)}
                                        className={cn(
                                            'relative block w-full text-left transition-all duration-150 py-1 pl-4',
                                            level === 2 && 'text-[15px] font-bold',
                                            level === 3 && 'ml-4 text-[14px] font-semibold text-gray-600 dark:text-gray-400',
                                            level === 4 && 'ml-8 text-[13px] font-medium text-gray-500 dark:text-gray-500',
                                            isActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                                        )}
                                        aria-current={isActive ? 'location' : undefined}
                                    >
                                        {/* Active Highlight Line */}
                                        {isActive && (
                                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
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
