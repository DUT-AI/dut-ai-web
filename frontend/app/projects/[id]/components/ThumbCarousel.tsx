import { useRef, useState, useEffect } from 'react'
import type { Project } from 'app/api-client'
import ThumbCard from './ThumbCard'

/** How many cards are visible at once (desktop). */
const VISIBLE = 4
const GAP = 18

interface ThumbCarouselProps {
  projects: Project[]
  selected: number
  onSelect: (i: number) => void
}

export default function ThumbCarousel({ projects, selected, onSelect }: ThumbCarouselProps) {
  const total = projects.length
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(280)

  /* Measure container so cards fill exactly VISIBLE slots — no clipping. */
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth
        setCardW((w - (VISIBLE - 1) * GAP) / VISIBLE)
      }
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  /* Slot-2 anchor: selected card lands at position 2 from card 3 onward. */
  const maxOffset = Math.max(0, total - VISIBLE)
  const rawOffset = Math.max(0, selected - 1)
  const offset = Math.min(rawOffset, maxOffset)
  const translateX = -(offset * (cardW + GAP))

  const nav = (dir: -1 | 1) => {
    const n = selected + dir
    onSelect(n < 0 ? total - 1 : n >= total ? 0 : n)
  }

  return (
    <div
      className="space-y-6"
      style={{ opacity: 0, animation: 'fadeInUp 0.6s ease forwards' }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Carousel track ── */}
      <div ref={containerRef} className="w-full overflow-hidden">
        <div
          className="flex gap-[18px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="flex-shrink-0"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.55s ease forwards',
                animationDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              <ThumbCard project={p} active={i === selected} onClick={() => onSelect(i)} cardW={cardW} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Pagination counter + nav arrows ── */}
      <div
        className="flex items-end justify-between pt-2"
        style={{ opacity: 0, animation: 'fadeInUp 0.55s ease forwards', animationDelay: '0.45s' }}
      >
        <p>
          <span
            className="proj-counter text-[48px] font-bold leading-none sm:text-[60px] lg:text-[72px]"
          >
            {String(selected + 1).padStart(2, '0')}
          </span>
          <span
            className="proj-counter ml-1 text-lg font-bold sm:text-2xl lg:text-[30px]"
          >
            /{total}
          </span>
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => nav(-1)}
            className="proj-nav-prev flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:opacity-90 sm:h-12 sm:w-12"
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            onClick={() => nav(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all hover:bg-orange-600 sm:h-12 sm:w-12"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
