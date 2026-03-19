'use client'

import { useState } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

interface StatCounterProps {
    target: number
    suffix: string
    label: string
    delay?: number
}

export default function StatCounter({ target, suffix, label, delay = 0 }: StatCounterProps) {
    const [done, setDone] = useState(false)
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    })

    return (
        <div ref={ref} className="flex flex-col items-center gap-2 group min-w-[120px]">
            {/* Number + suffix + label — one line */}
            <span
                className="text-[30px] sm:text-[36px] md:text-[40px] lg:text-[46px] font-bold tracking-[0.012em] whitespace-nowrap leading-none tabular-nums flex items-center gap-1"
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
                {inView ? (
                    <CountUp
                        start={0}
                        end={target}
                        duration={1.5}
                        delay={delay / 1000}
                        onStart={() => setDone(false)}
                        onEnd={() => setDone(true)}
                        useEasing={true}
                    />
                ) : (
                    0
                )}
                <span>{suffix}</span>
                <span className="ml-1">{label}</span>
            </span>

            {/* Animated bottom bar */}
            <div className="w-full h-[3px] bg-gray-200/20 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, #DF7DC8, #a78bfa)',
                        width: done ? '100%' : '0%',
                        transition: done ? 'width 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s' : 'none',
                    }}
                />
            </div>

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
