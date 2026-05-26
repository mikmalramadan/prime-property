'use client'

import { useEffect, useRef } from 'react'

// Each particle: position, size, speed, opacity, angle drift
interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  opacityDelta: number
  color: string
}

const COLORS = [
  'rgba(201,169,97,', // brand-gold
  'rgba(255,255,255,', // white
]

function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  const color = COLORS[Math.random() < 0.7 ? 0 : 1]
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: Math.random() * 1.8 + 0.4,
    speedY: -(Math.random() * 0.4 + 0.1),
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.5 + 0.1,
    opacityDelta: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    color,
  }
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrameId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Reset particles on resize
      particles = Array.from({ length: 80 }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Move
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.opacityDelta

        // Bounce opacity
        if (p.opacity >= 0.7 || p.opacity <= 0.05) {
          p.opacityDelta *= -1
        }

        // Wrap around top
        if (p.y < -5) {
          p.y = canvas.height + 5
          p.x = Math.random() * canvas.width
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, `${p.color}${p.opacity})`)
        gradient.addColorStop(1, `${p.color}0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(p.opacity + 0.3, 1)})`
        ctx.fill()
      }

      animFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  )
}
