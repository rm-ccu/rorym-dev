import { useEffect, useRef } from 'react'

// Particle network: dots drift slowly, nearby ones link with a fading line,
// and the cursor pushes particles away (offset velocity that decays back to drift).
const DENSITY = 0.00008 // particles per px^2
const MAX_PARTICLES = 90
const LINK_DIST = 130
const MOUSE_RADIUS = 150
const MOUSE_FORCE = 0.6
const MAX_OFFSET_SPEED = 2.5

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function readAccentRgb() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  return raw.startsWith('#') ? hexToRgb(raw) : [59, 130, 246]
}

function createParticles(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    ox: 0,
    oy: 0,
  }))
}

export default function CanvasBG() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf
    let accent = readAccentRgb()
    let particles = []
    const mouse = { x: -9999, y: -9999, active: false }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.min(MAX_PARTICLES, Math.round(canvas.width * canvas.height * DENSITY))
      particles = createParticles(count, canvas.width, canvas.height)
    }

    function step() {
      const W = canvas.width
      const H = canvas.height

      for (const p of particles) {
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < MOUSE_RADIUS && dist > 0.01) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE
            p.ox += (dx / dist) * force
            p.oy += (dy / dist) * force
          }
        }

        const offSpeed = Math.hypot(p.ox, p.oy)
        if (offSpeed > MAX_OFFSET_SPEED) {
          p.ox = (p.ox / offSpeed) * MAX_OFFSET_SPEED
          p.oy = (p.oy / offSpeed) * MAX_OFFSET_SPEED
        }

        p.x += p.vx + p.ox
        p.y += p.vy + p.oy
        p.ox *= 0.94
        p.oy *= 0.94

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
      }
    }

    function draw() {
      const W = canvas.width
      const H = canvas.height
      const [r, g, b] = accent
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const c = particles[j]
          const dist = Math.hypot(a.x - c.x, a.y - c.y)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(c.x, c.y)
            ctx.stroke()
          }
        }
      }

      if (mouse.active) {
        for (const p of particles) {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.5
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = `rgba(${r},${g},${b},0.6)`
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function frame() {
      step()
      draw()
      raf = requestAnimationFrame(frame)
    }

    function handlePointerMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    function handlePointerLeave() {
      mouse.active = false
    }

    // Re-read accent when data-theme attribute changes
    const observer = new MutationObserver(() => { accent = readAccentRgb() })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove)
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)

    if (reduceMotion) {
      draw()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
