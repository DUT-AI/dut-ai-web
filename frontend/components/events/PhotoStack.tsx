'use client'

import React, { useState } from 'react'
import Image from 'next/image'

// ── Modern Animated Photo Skeleton ──────────────────────────────────────────
export const PhotoSkeleton = ({ bg }: { bg: string }) => (
    <div
        className="relative flex h-full w-full flex-col items-center justify-between p-3.5 overflow-hidden select-none"
        style={{ background: bg }}
    >
        {/* Style for dynamic shimmer animation */}
        <style>{`
            @keyframes photoShimmerSweep {
                0% { transform: translateX(-150%) rotate(15deg); }
                100% { transform: translateX(150%) rotate(15deg); }
            }
        `}</style>

        {/* Shimmer light sweep */}
        <div
            className="pointer-events-none absolute -inset-full opacity-60"
            style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                animation: 'photoShimmerSweep 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
        />

        {/* Top bar: Pill badge + subtle pulse bar */}
        <div className="flex w-full items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white/90 backdrop-blur-md border border-white/25 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DUT AI
            </span>
            <div className="h-1.5 w-6 rounded-full bg-white/30 backdrop-blur-sm animate-pulse" />
        </div>

        {/* Center: Camera artwork with glassmorphism */}
        <div className="flex flex-col items-center justify-center gap-2 z-10 my-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-md backdrop-blur-md border border-white/30">
                <svg
                    className="h-6 w-6 text-white/90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                </svg>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="h-1.5 w-14 rounded-full bg-white/40 animate-pulse" />
                <div className="h-1 w-8 rounded-full bg-white/25 animate-pulse" />
            </div>
        </div>

        {/* Bottom bar */}
        <div className="flex w-full items-center justify-center gap-1 z-10">
            <span className="h-1 w-4 rounded-full bg-white/40" />
            <span className="h-1 w-1.5 rounded-full bg-white/20" />
            <span className="h-1 w-1.5 rounded-full bg-white/20" />
        </div>
    </div>
)

// ── Photo card with loading placeholder & optimized sizes ───────────────────────
export const PhotoCard = ({
    src,
    bg,
    top,
    left,
    rotate,
    z,
    isHovered,
    isTop,
    onHover,
    onLeave,
}: {
    src: string
    bg: string
    top: number
    left: number
    rotate: number
    z: number
    isHovered: boolean
    isTop: boolean
    onHover: () => void
    onLeave: () => void
}) => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div
            className="absolute overflow-hidden rounded-2xl border-[5px] border-white shadow-2xl cursor-pointer select-none"
            style={{
                width: 170,
                height: 205,
                top,
                left,
                zIndex: isHovered ? 50 : z,
                transform: isHovered
                    ? 'translate(0, -16px) rotate(0deg) scale(1.08)'
                    : `rotate(${rotate}deg) scale(1)`,
                transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), z-index 0ms, box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: isHovered
                    ? '0 20px 35px rgba(0,0,0,0.28), 0 8px 16px rgba(0,0,0,0.15)'
                    : '0 12px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
                background: bg,
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onFocus={onHover}
            onBlur={onLeave}
            tabIndex={0}
        >
            {src ? (
                <>
                    {/* Modern Skeleton while image loads from remote storage */}
                    {!isLoaded && <PhotoSkeleton bg={bg} />}
                    <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 170px, 200px"
                        quality={70}
                        className={`object-cover pointer-events-none transition-opacity duration-300 ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading={isTop ? 'eager' : 'lazy'}
                        onLoad={() => setIsLoaded(true)}
                    />
                </>
            ) : (
                <PhotoSkeleton bg={bg} />
            )}
        </div>
    )
}

// ── Scattered photo cards with ArchGallery hover effect ─────────────────────────
export const PhotoStack = ({ images, flip = false }: { images: string[]; flip?: boolean }) => {
    const [hovered, setHovered] = useState<number | null>(null)

    const cards = flip
        ? [
            { top: 0, left: 140, rotate: 12, z: 0, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 18, left: 45, rotate: 5, z: 1, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 108, left: 0, rotate: -7, z: 2, bg: 'linear-gradient(150deg,#a8bfb0,#8eab94)' },
            { top: 100, left: 150, rotate: 3, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]
        : [
            { top: 0, left: 0, rotate: -12, z: 0, bg: 'linear-gradient(150deg,#c8ddc8,#a8c8ac)' },
            { top: 18, left: 105, rotate: -5, z: 1, bg: 'linear-gradient(150deg,#dce8dc,#bdd4c0)' },
            { top: 108, left: 165, rotate: 8, z: 2, bg: 'linear-gradient(150deg,#e8dcc8,#d4c4a0)' },
            { top: 100, left: 10, rotate: -2, z: 3, bg: 'linear-gradient(150deg,#3d6b5e,#2d5045)' },
        ]

    const visible: string[] = Array.from({ length: 4 }, (_, i) =>
        images.length > 0 ? images[i % images.length] : ''
    )

    return (
        <div className="relative mx-auto" style={{ width: 380, height: 340 }}>
            {cards.map((c, i) => (
                <PhotoCard
                    key={i}
                    src={visible[i]}
                    bg={c.bg}
                    top={c.top}
                    left={c.left}
                    rotate={c.rotate}
                    z={c.z}
                    isHovered={hovered === i}
                    isTop={c.z === 3}
                    onHover={() => setHovered(i)}
                    onLeave={() => setHovered(null)}
                />
            ))}
        </div>
    )
}

export default PhotoStack
