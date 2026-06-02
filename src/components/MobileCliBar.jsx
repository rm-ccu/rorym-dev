import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCommandParser } from '../hooks/useCommandParser'
import { Result } from './CLI'

export default function MobileCliBar() {
  const { parse, history } = useCommandParser()
  const [input, setInput] = useState('')
  const [outputVisible, setOutputVisible] = useState(false)

  // Most recent command entry — skip the static welcome message
  const lastEntry = [...history].reverse().find((e) => e.input !== null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    parse(input)
    setInput('')
    setOutputVisible(true)
  }

  return (
    // Always LTR — terminals are directionally invariant
    <div dir="ltr">

      {/* Output sheet — slides up above the fixed bar */}
      <AnimatePresence>
        {outputVisible && lastEntry && (
          <>
            {/* Tap-outside dismissal */}
            <motion.div
              className="fixed top-0 bottom-14 start-0 end-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOutputVisible(false)}
            />

            <motion.div
              className="fixed start-0 end-0 bottom-14 z-30
                         bg-[var(--bg)] border-t border-[var(--border)]
                         max-h-[50vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Sheet header */}
              <div className="sticky top-0 flex items-center justify-between
                              ps-4 pe-3 py-2.5
                              bg-[var(--bg)] border-b border-[var(--border)]">
                <p className="font-mono text-xs text-[var(--text)] truncate">
                  <span className="text-[var(--accent)] me-1.5">~$</span>
                  {lastEntry.input}
                </p>
                <button
                  onClick={() => setOutputVisible(false)}
                  aria-label="Close output"
                  className="shrink-0 ms-3 text-[var(--text)] hover:text-[var(--accent)]
                             transition-colors font-mono text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Result */}
              <div className="ps-4 pe-4 py-4 font-mono text-sm">
                <Result result={lastEntry.result} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 ps-4 pe-4 h-14 font-mono text-sm"
      >
        <span className="text-[var(--accent)] select-none shrink-0">~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Quick command"
          className="flex-1 bg-transparent outline-none
                     text-[var(--text-h)] caret-[var(--accent)]
                     placeholder:text-[var(--text)] placeholder:opacity-40"
          placeholder="quick command…"
        />
      </form>
    </div>
  )
}
