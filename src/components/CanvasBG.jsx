import { useEffect, useRef } from 'react'

// Four gradient orbs that drift slowly on sinusoidal paths.
// Positions/radii are expressed as fractions of viewport dimensions.
const ORBS = [
  { x: 0.15, y: 0.22, r: 0.55, sx: 0.07, sy: 0.05, speed: 0.00016, phase: 0.0 },
  { x: 0.82, y: 0.70, r: 0.48, sx: 0.06, sy: 0.08, speed: 0.00021, phase: 1.4 },
  { x: 0.48, y: 0.52, r: 0.38, sx: 0.04, sy: 0.06, speed: 0.00013, phase: 2.8 },
  { x: 0.88, y: 0.18, r: 0.30, sx: 0.05, sy: 0.04, speed: 0.00018, phase: 4.2 },
]

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function readAccentRgb() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  return raw.startsWith('#') ? hexToRgb(raw) : [170, 59, 255]
}

export default function CanvasBG() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0
    let accent = readAccentRgb()

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function draw() {
      t++
      const W = canvas.width
      const H = canvas.height
      const [r, g, b] = accent

      ctx.clearRect(0, 0, W, H)

      ORBS.forEach((o, i) => {
        const cx  = (o.x + Math.sin(t * o.speed + o.phase) * o.sx) * W
        const cy  = (o.y + Math.cos(t * o.speed * 0.73 + o.phase) * o.sy) * H
        const rad = o.r * Math.min(W, H)
        // Alternate alpha: primary orbs brighter, accent orbs softer
        const alpha = i < 2 ? 0.14 : 0.08

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        grd.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`)
        grd.addColorStop(0.45, `rgba(${r},${g},${b},${(alpha * 0.35).toFixed(3)})`)
        grd.addColorStop(1,    `rgba(${r},${g},${b},0)`)

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    // Re-read accent when data-theme attribute changes
    const observer = new MutationObserver(() => { accent = readAccentRgb() })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
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
