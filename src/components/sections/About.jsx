import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, section, stagger } from '../../lib/animations'

const PILLARS = ['1', '2', '3']

export default function About() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="about"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14
                 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="01" label={t('sections.about')} />
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mt-8 text-[var(--text)] text-lg leading-relaxed max-w-2xl"
      >
        {t('data.bio')}
      </motion.p>

      {/* Pillar cards — nested stagger fires after the bio text */}
      <motion.div
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
        variants={stagger}
      >
        {PILLARS.map((n) => (
          <motion.div
            key={n}
            variants={fadeUp}
            className="rounded-xl border border-[var(--border)] p-6
                       hover:border-[var(--accent-border)] transition-colors"
          >
            <p className="text-[var(--accent)] font-semibold mb-2">
              {t(`about.pillar_${n}_title`)}
            </p>
            <p className="text-[var(--text)] text-sm leading-relaxed">
              {t(`about.pillar_${n}_body`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export function SectionHeading({ index, label }) {
  return (
    <div>
      <p className="font-mono text-xs text-[var(--accent)] opacity-60 mb-1">
        {index}
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-h)]">
        {label}
      </h2>
      <div className="mt-3 w-10 h-0.5 bg-[var(--accent)]" />
    </div>
  )
}
