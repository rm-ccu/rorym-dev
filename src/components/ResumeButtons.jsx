import { motion } from 'framer-motion'

export default function ResumeButtons() {
  return (
    <motion.a
      href="/Rory_McCulloch_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.95 }}
      className="px-3 py-1.5 rounded font-mono text-xs
                 border border-[var(--border)] text-[var(--text)]
                 hover:border-[var(--accent)] hover:text-[var(--accent)]
                 transition-colors"
    >
      Resume
    </motion.a>
  )
}

