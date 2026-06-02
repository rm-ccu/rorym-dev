import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCommandParser } from '../hooks/useCommandParser'

// Block cursor — used inside Typewriter while typing
function Cursor() {
  return (
    <motion.span
      aria-hidden
      className="inline-block align-middle bg-[var(--accent)]"
      style={{ width: '0.5ch', height: '1.1em', marginInlineStart: '1px' }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.55, repeat: Infinity, repeatType: 'mirror', ease: 'steps(1)' }}
    />
  )
}

// Types `text` one character at a time; calls onDone when finished
function Typewriter({ text, delay = 0, speed = 22, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let tid, iid
    let i = 0
    setDisplayed('')
    setDone(false)

    tid = setTimeout(() => {
      iid = setInterval(() => {
        i += 1
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(iid)
          setDone(true)
          onDone?.()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(tid)
      clearInterval(iid)
    }
  }, [text, delay, speed])

  return (
    <p className="text-[var(--accent)] italic">
      {displayed}
      {!done && <Cursor />}
    </p>
  )
}

// Named export so MobileCliBar can reuse the same renderer
export function Result({ result }) {
  switch (result.type) {
    case 'welcome':
      return <p className="text-[var(--accent)] italic">{result.message}</p>

    case 'help':
      return (
        <div className="flex flex-col gap-1.5">
          <p className="text-[var(--text)] mb-1">{result.header}</p>
          {result.commands.map(({ cmd, description }) => (
            <div key={cmd} className="grid gap-x-6" style={{ gridTemplateColumns: '18ch 1fr' }}>
              <span className="text-[var(--accent)] truncate">{cmd}</span>
              <span className="text-[var(--text)]">{description}</span>
            </div>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--accent)]">{result.label}</p>
          {result.items.map((item) => (
            <div key={item.name} className="ps-3 border-s-2 border-[var(--border)] flex flex-col gap-0.5">
              <p className="text-[var(--text-h)]">
                {item.name}
                {item.featuredLabel && (
                  <span className="ms-2 text-xs text-[var(--accent)] opacity-70">{item.featuredLabel}</span>
                )}
                <span className="ms-2 text-[var(--text)] opacity-50 text-xs">{item.year}</span>
              </p>
              <p className="text-[var(--text)] text-sm">{item.description}</p>
              <p className="text-xs opacity-60 text-[var(--accent)]">{item.tech.join('  ·  ')}</p>
            </div>
          ))}
        </div>
      )

    case 'file':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--accent)]">──── {result.filename} ────</p>
          <div className="flex flex-col gap-1 text-sm">
            {result.fields.map(([key, val]) => (
              <p key={key}>
                <span className="text-[var(--text-h)] inline-block w-24">{key}</span>
                <span className="text-[var(--text)] opacity-40 mx-1">=</span>
                <span className="text-[var(--text)]">{val}</span>
              </p>
            ))}
          </div>
          <p className="text-[var(--text)] text-sm leading-relaxed">{result.bio}</p>
          <p className="text-[var(--accent)] mt-1">{result.leadershipHeader}</p>
          {result.leadership.map((l) => (
            <div key={l.id} className="ps-3 border-s-2 border-[var(--border)] flex flex-col gap-0.5">
              <p className="text-[var(--text-h)] text-sm">
                {l.title}
                <span className="text-[var(--text)] opacity-50"> @ {l.org}</span>
                <span className="text-[var(--text)] opacity-40 text-xs ms-2">{l.period}</span>
              </p>
              <p className="text-[var(--text)] text-sm">{l.description}</p>
            </div>
          ))}
        </div>
      )

    case 'success':
      return <p className="text-emerald-400">{result.message}</p>

    case 'error':
      return <p className="text-red-400">{result.message}</p>

    default:
      return null
  }
}

export default function CLI() {
  const { parse, history } = useCommandParser()
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [introDone, setIntroDone] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Focus input as soon as typewriter finishes
  useEffect(() => {
    if (introDone) inputRef.current?.focus()
  }, [introDone])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    setCmdHistory((h) => [input, ...h])
    setHistoryIdx(-1)
    parse(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  // Separate the welcome entry from the rest so it can be typewriter-animated
  const welcomeEntry = history[0]?.result?.type === 'welcome' ? history[0] : null
  const postWelcome  = welcomeEntry ? history.slice(1) : history

  return (
    // Force LTR — terminal direction is invariant of locale
    <div
      dir="ltr"
      className="flex-1 flex flex-col w-full font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable output */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-2 pe-1">

        {/* Typewriter welcome — fades in then types the message */}
        {welcomeEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <Typewriter
              text={welcomeEntry.result.message}
              delay={400}
              onDone={() => setIntroDone(true)}
            />
          </motion.div>
        )}

        {/* History entries — only rendered after intro finishes */}
        {introDone && postWelcome.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5"
          >
            {entry.input !== null && (
              <p className="flex gap-2 text-[var(--text-h)]">
                <span className="text-[var(--accent)] select-none">~$</span>
                {entry.input}
              </p>
            )}
            <div className="ps-5">
              <Result result={entry.result} />
            </div>
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input prompt — fades in after intro completes */}
      <AnimatePresence>
        {introDone && (
          <motion.form
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[var(--border)] pt-3 mt-3 shrink-0"
          >
            <span className="text-[var(--accent)] select-none shrink-0">~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
              className="flex-1 bg-transparent outline-none text-[var(--text-h)] caret-[var(--accent)]
                         placeholder:text-[var(--text)] placeholder:opacity-40"
              placeholder="type a command…"
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
