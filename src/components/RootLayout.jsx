import { AnimatePresence, motion } from 'framer-motion'
import { useMode } from '../context/ModeProvider'
import CanvasBG from './CanvasBG'
import GuiPane from './GuiPane'
import CLI from './CLI'
import ThemeToggle from './ThemeToggle'
import ScrollToTop from './ScrollToTop'
import SocialLinks from './SocialLinks'
import Clock from './Clock'
import ResumeButtons from './ResumeButtons'

// Compress to a horizontal sliver on exit, expand from sliver on enter.
// The blur+opacity layer adds the glitch texture.
const glitch = {
  initial: {
    opacity: 0,
    clipPath: 'inset(46% 0% 46% 0%)',
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'blur(0px)',
    transition: {
      clipPath: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
      opacity:  { duration: 0.35 },
      filter:   { duration: 0.32 },
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(46% 0% 46% 0%)',
    filter: 'blur(8px)',
    transition: {
      clipPath: { duration: 0.24, ease: [0.4, 0, 1, 1] },
      opacity:  { duration: 0.26 },
      filter:   { duration: 0.2 },
    },
  },
}

export default function RootLayout() {
  const { viewMode, toggleMode } = useMode()
  const isCLI = viewMode === 'cli'

  return (
    <>
      <CanvasBG />
      <ScrollToTop />
      <SocialLinks />

      {/* z-10 creates a stacking context above the fixed canvas */}
      <div
        className="relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto
                   border-s border-e border-[var(--border)]"
      >
        {/* Sticky header — clock on left, theme toggle + mode toggle on right */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 shrink-0
                     bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]/40"
        >
          <Clock />
          <div className="flex items-center justify-end gap-2">
            {!isCLI && <ResumeButtons />}
            {!isCLI && <ThemeToggle />}
            <button
              onClick={toggleMode}
              aria-label={isCLI ? 'Switch to GUI' : 'Switch to CLI'}
              className="px-3 py-1.5 rounded font-mono text-xs
                         border border-[var(--border)] text-[var(--text)]
                         hover:border-[var(--accent)] hover:text-[var(--accent)]
                         transition-colors"
            >
              {/* dir=ltr prevents BiDi reordering of > and ⊞ glyphs in RTL context */}
              <span dir="ltr">{isCLI ? '⊞ GUI' : '> CLI'}</span>
            </button>
          </div>
        </div>

        {/* Full-view switcher — CLI or GUI, never both at once */}
        <AnimatePresence mode="wait">
          {isCLI ? (
            <motion.div
              key="cli"
              {...glitch}
              className="flex-1 flex flex-col ps-6 pe-8 pb-8 md:ps-10 md:pe-12"
            >
              <CLI />
            </motion.div>
          ) : (
            <motion.div
              key="gui"
              {...glitch}
              className="flex-1 flex flex-col"
            >
              <GuiPane />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
