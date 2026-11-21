'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  opacitySpeed: number
}

export interface PortfolioParticlesProps {
  count?: number
  className?: string
}

export default function PortfolioParticles({
  count = 120,
  className = '',
}: PortfolioParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speedX: prefersReducedMotion ? 0 : (Math.random() - 0.2) * 0.25,
      speedY: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      opacitySpeed: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      stars.forEach((star) => {
        // Twinkle
        star.opacity += star.opacitySpeed
        if (star.opacity > 0.95 || star.opacity < 0.15) {
          star.opacitySpeed = -star.opacitySpeed
        }

        // Move
        star.x += star.speedX
        star.y += star.speedY

        // Wrap around borders
        if (star.x < 0) star.x = width
        if (star.x > width) star.x = 0
        if (star.y < 0) star.y = height
        if (star.y > height) star.y = 0

        // Draw star with soft blue glow
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${Math.max(0.1, Math.min(1, star.opacity))})`
        ctx.shadowBlur = star.size > 1.2 ? 6 : 2
        ctx.shadowColor = 'rgba(59, 130, 246, 0.7)'
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
