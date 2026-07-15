import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section, stagger } from '../../lib/animations'
import { SectionHeading } from './About'

function LeadershipCard({ role }) {
  const { t } = useTranslation()

  return (
    <motion.article
      variants={fadeUp}
      className="ps-5 border-s-2 border-[var(--accent)] flex flex-col gap-2 py-1"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[var(--text-h)] font-semibold">
          {t(`data.leadership.${role.id}.title`)}
        </h3>
        <span className="font-mono text-xs text-[var(--text)] opacity-50 shrink-0">
          {role.period}
        </span>
      </div>
      <p className="text-xs text-[var(--accent)] opacity-80">
        {t('leadership.role_at')} {role.org}
      </p>
      <p className="text-[var(--text)] text-sm leading-relaxed">
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
