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
        <aside
            aria-label="Mục lục bài viết"
            className="hidden xl:block sticky top-24 self-start"
        >
            {/* ── Collapsed: minimal lines view ── */}
            {!expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    aria-label="Mở mục lục"
                    className="group flex flex-col items-start gap-1.5 w-12 p-2 rounded-xl
                               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {/* Progress indicator label */}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors">
                        nội dung
                    </span>

                    {/* Line map — one thin bar per heading */}
                    <div className="flex flex-col gap-[3px] w-full">
                        {headings.map((h, i) => (
                            <div
                                key={h.id}
                                className={cn(
                                    'rounded-full transition-all duration-300',
                                    // indent by level
                                    h.level === 2 ? 'w-full' : h.level === 3 ? 'w-[72%]' : 'w-[50%]',
                                    // height: active = taller
                                    h.id === activeId ? 'h-[3px]' : 'h-[2px]',
                                    // color
                                    h.id === activeId
                                        ? 'bg-primary-500'
                                        : i <= activeIndex
                                            ? 'bg-gray-300 dark:bg-gray-600'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                )}
                            />
                        ))}
                    </div>

                    {/* Progress fraction */}
                    <span className="text-[9px] tabular-nums text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors">
                        {activeIndex + 1}/{headings.length}
                    </span>
                </button>
            )}

            {/* ── Expanded: full text sidebar ── */}
            {expanded && (
                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
                    {/* Header row with collapse button */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="h-0.5 w-5 rounded-full bg-primary-400" />
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                Nội dung
                            </p>
                        </div>
                        <button
                            onClick={() => setExpanded(false)}
                            aria-label="Thu gọn mục lục"
                            className="rounded-md p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M9.5 3L6 6.5 2.5 3 2 3.5 6 7.5l4-4z" />
                            </svg>
                        </button>
                    </div>

                    <nav>
                        <ul className="space-y-0.5">
                            {headings.map(({ id, text, level }) => (
                                <li key={id}>
                                    <button
                                        onClick={() => handleClick(id)}
                                        className={cn(
                                            'block w-full text-left rounded-md px-2 py-1 transition-all duration-150',
                                            level === 2 && 'pl-2 text-sm',
                                            level === 3 && 'pl-5 text-xs',
                                            level === 4 && 'pl-8 text-xs',
                                            activeId === id
                                                ? 'bg-primary-50 font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                                        )}
                                        aria-current={activeId === id ? 'location' : undefined}
                                    >
                                        <span className="line-clamp-2 leading-snug">{text}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </aside>
    )
}
