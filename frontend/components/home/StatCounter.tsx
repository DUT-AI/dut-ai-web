'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
    target: number
    suffix: string
    label: string
    delay?: number
}

function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function StatCounter({ target, suffix, label, delay = 0 }: StatCounterProps) {
    const [count, setCount] = useState(0)
    const [done, setDone] = useState(false)
    const [started, setStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const animRef = useRef<number | null>(null)
    const startTimeRef = useRef<number | null>(null)
    const duration = 1800

    const runAnimation = () => {
        setDone(false)
        setCount(0)
        startTimeRef.current = null

        const step = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp
            }
            const elapsed = timestamp - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeOutExpo(progress)
            setCount(Math.round(eased * target))

            if (progress < 1) {
                animRef.current = requestAnimationFrame(step)
            } else {
                setCount(target)
                setDone(true)
            }
        }

        animRef.current = requestAnimationFrame(step)
    }

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (animRef.current) cancelAnimationFrame(animRef.current)
                        setStarted(false)
                        setDone(false)
                        setCount(0)
                        setTimeout(() => {
                            setStarted(true)
                        }, delay)
                    }
                })
            },
            { threshold: 0.5 }
        )

        observer.observe(el)
        return () => {
            observer.disconnect()
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [delay])

    useEffect(() => {
        if (!started) return
        if (animRef.current) cancelAnimationFrame(animRef.current)
        runAnimation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started])

    return (
        <div ref={ref} className="flex flex-col items-center gap-2 group">
            {/* Number + suffix + label — one line */}
            <span
                className="text-[30px] sm:text-[36px] md:text-[40px] lg:text-[46px] font-bold tracking-[0.012em] whitespace-nowrap leading-none tabular-nums"
                style={{
                    color: '#DF7DC8',
                    filter: done ? 'none' : 'blur(0.5px)',
                    textShadow: done
                        ? '0 0 30px rgba(223,125,200,0.6), 0 0 60px rgba(223,125,200,0.25)'
                        : 'none',
                    transform: done ? 'scale(1.06)' : 'scale(1)',
                    transition: done
                        ? 'text-shadow 0.4s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease'
                        : 'transform 0.1s ease, filter 0.1s ease',
                    animation: done ? 'statGlowPulse 0.7s ease forwards' : 'none',
                }}
            >
                {count}{suffix} {label}
            </span>

            {/* Animated bottom bar */}
            <span
                className="block h-[3px] rounded-full"
                style={{
                    background: 'linear-gradient(90deg, #DF7DC8, #a78bfa)',
                    width: done ? '100%' : '0%',
                    transition: done ? 'width 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s' : 'none',
                }}
            />

            <style>{`
                @keyframes statGlowPulse {
                    0%   { text-shadow: 0 0 30px rgba(223,125,200,0.6), 0 0 60px rgba(223,125,200,0.25); transform: scale(1.06); }
                    40%  { text-shadow: 0 0 50px rgba(223,125,200,0.9), 0 0 100px rgba(167,139,250,0.4); transform: scale(1.10); }
                    70%  { text-shadow: 0 0 30px rgba(223,125,200,0.5), 0 0 60px rgba(223,125,200,0.2); transform: scale(1.04); }
                    100% { text-shadow: 0 0 20px rgba(223,125,200,0.35), 0 0 40px rgba(223,125,200,0.15); transform: scale(1.00); }
                }
            `}</style>
        </div>
    )
}
