import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section, stagger } from '../../lib/animations'
import { SectionHeading } from './About'

const toAlphaHex = (a) =>
  Math.round(Math.min(Math.max(a, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')

function buildCardGradient(colors, vibrant) {
  if (!colors?.length) return undefined
  const boost = vibrant ? 1.6 : 1
  const baseAlphas = [0.22, 0.15, 0.1, 0.07]
  const stops = colors.map((color, i) => {
    const pos = Math.round((i / Math.max(colors.length - 1, 1)) * 65)
    const alpha = Math.min((baseAlphas[i] ?? 0.06) * boost, 0.85)
    return `${color}${toAlphaHex(alpha)} ${pos}%`
  })
  return `linear-gradient(120deg, ${stops.join(', ')}, var(--card-fade) 88%)`
}

function ChainIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function LeadershipCard({ role }) {
  const { t } = useTranslation()
  const gradient = buildCardGradient(role.colors, role.vibrant)

  return (
    <motion.article
      variants={fadeUp}
      className="relative overflow-hidden rounded-xl border border-[var(--border)]
                 ps-6 pe-5 py-5 flex flex-col gap-2"
    >
      {gradient && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: gradient }} />
      )}
      <div
        className="absolute inset-y-0 start-0 w-1"
        style={{ backgroundColor: role.colors?.[0] ?? 'var(--accent)' }}
      />

      {role.url && (
        <a
          href={role.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={role.org}
          className="absolute z-10 bottom-3 end-3 flex items-center justify-center w-8 h-8
                     rounded-full border border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-sm
                     text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent-border)]
                     transition-colors"
        >
          <ChainIcon />
        </a>
      )}

      <div className="relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[var(--text-h)] font-semibold">
          {t(`data.leadership.${role.id}.title`)}
        </h3>
        <span className="font-mono text-xs text-[var(--text)] opacity-50 shrink-0">
          {role.period}
        </span>
      </div>
      <p className="relative text-xs text-[var(--accent)] opacity-80">
        {t('leadership.role_at')} {role.org}
      </p>
      <p className="relative text-[var(--text)] text-sm leading-relaxed pe-8">
        {t(`data.leadership.${role.id}.description`)}
      </p>
    </motion.article>
  )
}

export default function Leadership() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="leadership"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14
                 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="04" label={t('sections.leadership')} />
      </motion.div>

      <motion.div className="mt-10 flex flex-col gap-8" variants={stagger}>
        {portfolio.leadership.map((role) => (
          <LeadershipCard key={role.id} role={role} />
        ))}
      </motion.div>
    </motion.section>
  )
}
