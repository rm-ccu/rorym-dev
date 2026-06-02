import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Clock() {
  const [time, setTime] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setTime(now)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="text-xs font-mono text-[var(--text)]"
        animate={{
          opacity: isHovered ? 1 : 0.5,
          textShadow: isHovered
            ? `0 0 8px var(--accent), 0 0 16px var(--accent)`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        {time || '──:──:──'}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-5 left-0 text-xs font-mono text-[var(--accent)] whitespace-nowrap"
          >
            My time (EDT)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
