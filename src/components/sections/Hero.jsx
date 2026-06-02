import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageProvider'

const LOCALES = ['en', 'fr', 'ar']

const item = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

export default function Hero() {
  const { t } = useTranslation()
  const { locale, changeLocale } = useLanguage()

  return (
    <section
      id="home"
      className="relative min-h-svh flex flex-col items-center justify-center
                 text-center px-6 py-20"
    >
      {/* Language switcher — top of section */}
      <nav
        className="absolute top-6 flex gap-2 flex-wrap justify-center"
        aria-label={t('language.label')}
      >
        {LOCALES.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLocale(lang)}
            aria-pressed={locale === lang}
            className={[
              'px-4 py-1 rounded-full text-sm font-medium border transition-colors',
              locale === lang
                ? 'bg-[var(--accent)] text-white border-transparent'
                : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]',
            ].join(' ')}
          >
            {t(`language.${lang}`)}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex flex-col items-center gap-5 max-w-3xl">
        <motion.p
          {...item(0.05)}
          className="font-mono text-sm text-[var(--accent)] tracking-widest uppercase"
        >
          {t('hero.greeting')}
        </motion.p>

        <motion.h1
          {...item(0.15)}
          className="text-5xl sm:text-7xl md:text-8xl font-semibold
                     text-[var(--text-h)] leading-none tracking-tight"
        >
          {t('hero.name')}
        </motion.h1>

        <motion.p
          {...item(0.25)}
          className="text-xl sm:text-2xl text-[var(--accent)] font-medium"
        >
          {t('hero.role')}
        </motion.p>

        <motion.p
          {...item(0.35)}
          className="text-[var(--text)] text-base sm:text-lg max-w-md leading-relaxed"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div {...item(0.45)} className="flex gap-3 mt-2 flex-wrap justify-center">
          <a
            href="#work"
            className="px-6 py-2.5 rounded-full bg-[var(--accent)] text-white
                       font-medium hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full border border-[var(--border)]
                       text-[var(--text)] font-medium
                       hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-colors"
          >
            {t('hero.contact_cta')}
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-20 flex flex-col items-center gap-1.5
                   text-xs text-[var(--text)] opacity-40 select-none"
      >
        <span>{t('hero.scroll_hint')}</span>
        <span className="text-base leading-none">↓</span>
      </motion.div>
    </section>
  )
}
