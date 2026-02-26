'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Project } from 'app/api-client'
import ProjectCard from './components/ProjectCard'

export default function ProjectsListClient({ initialProjects }: { initialProjects: Project[] }) {
    // Config: Number of projects to display initially and load per scroll
    const ITEMS_PER_PAGE = 6

    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
    const loaderRef = useRef<HTMLDivElement>(null)

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0]
        if (target.isIntersecting && displayCount < initialProjects.length) {
            // Simulate slight network delay for smooth UX transition
            setTimeout(() => {
                setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, initialProjects.length))
            }, 400)
        }
    }, [displayCount, initialProjects.length])

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        }
        const observer = new IntersectionObserver(handleObserver, option)
        if (loaderRef.current) observer.observe(loaderRef.current)

        return () => observer.disconnect()
    }, [handleObserver])

    const displayedProjects = initialProjects.slice(0, displayCount)
    const hasMore = displayCount < initialProjects.length

    return (
        <div className="mx-auto max-w-[1220px] px-6 md:px-8 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* Infinity Scroll Loader */}
            {hasMore && (
                <div ref={loaderRef} className="py-16 flex justify-center items-center gap-3">
                    <div className="w-6 h-6 border-3 border-gray-400 dark:border-gray-500 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Đang tải thêm...</span>
                </div>
            )}
        </div>
    )
}
