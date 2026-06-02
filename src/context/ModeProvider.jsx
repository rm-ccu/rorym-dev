import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ModeContext = createContext(null)

export function ModeProvider({ children }) {
  const [viewMode, setViewModeRaw] = useState(
    () => localStorage.getItem('viewMode') || 'gui',
  )

  const setViewMode = useCallback((mode) => {
    setViewModeRaw(mode)
    localStorage.setItem('viewMode', mode)
  }, [])

  const toggleMode = useCallback(() => {
    setViewModeRaw((m) => {
      const next = m === 'gui' ? 'cli' : 'gui'
      localStorage.setItem('viewMode', next)
      return next
    })
  }, [])

  // Reflect mode on <html> so external CSS can hook into it if needed
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', viewMode)
  }, [viewMode])

  return (
    <ModeContext.Provider value={{ viewMode, setViewMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
