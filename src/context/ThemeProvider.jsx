import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function readStored() {
  try {
    const v = localStorage.getItem('theme')
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStored() ?? getSystemTheme())

  // Keep data-theme attribute in sync with React state.
  // The inline script in index.html already set the initial value before mount,
  // so this effect only fires on actual changes.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    try { localStorage.setItem('theme', next) } catch {}
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('theme', next) } catch {}
      return next
    })
  }, [])

  // Mirror system changes only while the user has no stored manual preference.
  // Checked at event time, so a subsequent manual choice immediately takes effect.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (readStored()) return
      setThemeState(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
