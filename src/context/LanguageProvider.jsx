import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FONTS = {
  ar: "'Kufam', system-ui, sans-serif",
  default: "'Changa', system-ui, sans-serif",
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [locale, setLocale] = useState(i18n.language || 'en')

  const applyLocale = useCallback((lang) => {
    const html = document.documentElement
    const isRTL = lang === 'ar'
    const font = FONTS[lang] ?? FONTS.default

    html.setAttribute('lang', lang)
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    html.style.setProperty('--sans', font)
    html.style.setProperty('--heading', font)
  }, [])

  const changeLocale = useCallback(
    (lang) => {
      i18n.changeLanguage(lang)
      setLocale(lang)
      applyLocale(lang)
    },
    [i18n, applyLocale],
  )

  // Sync on mount in case i18n already has a non-default language
  useEffect(() => {
    applyLocale(i18n.language || 'en')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LanguageContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
