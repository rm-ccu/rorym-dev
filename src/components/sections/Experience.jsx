import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section, stagger } from '../../lib/animations'
import { SectionHeading } from './About'
import trenchLogo from '../../assets/experience/trench.jpg'
import aimColoursLogo from '../../assets/experience/aim-colours.webp'

const LOGOS = {
  trench: trenchLogo,
  aim_colours: aimColoursLogo,
}

function ExperienceCard({ job }) {
  const { t } = useTranslation()
  const isContain = job.logoStyle === 'contain'

  return (
    <motion.a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className="flex flex-col gap-3 group"
    >
      <div
        className="relative aspect-[8/5] rounded-xl overflow-hidden border border-[var(--border)]
                   group-hover:border-[var(--accent-border)] transition-colors"
      >
        <img
          src={LOGOS[job.id]}
          alt={job.company}
          className={
            isContain
              ? 'w-full h-full object-contain bg-[#eee5dc] p-10 md:p-14'
              : 'w-full h-full object-cover'
          }
        />
        {job.tech?.length > 0 && (
          <span
            className="absolute top-3 right-3 md:top-4 md:right-4
                       text-[10px] md:text-xs font-mono tracking-wide
                       px-2.5 py-1 rounded-full
                       bg-black/55 backdrop-blur-sm text-white border border-white/15"
          >
            {job.tech.join(' · ')}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-[var(--text-h)] font-semibold group-hover:text-[var(--accent)] transition-colors">
            {t(`data.experience.${job.id}.role`)}
          </h3>
          <p className="text-xs text-[var(--accent)] opacity-80">
            {t('leadership.role_at')} {job.company}
          </p>
        </div>
        <span className="font-mono text-xs text-[var(--text)] opacity-50 shrink-0">
          {job.period}
        </span>
      </div>
    </motion.a>
  )
}

export default function Experience() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="experience"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14
                 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="02" label={t('sections.experience')} />
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
        variants={stagger}
      >
        {portfolio.experience.map((job) => (
          <ExperienceCard key={job.id} job={job} />
        ))}
      </motion.div>
    </motion.section>
  )
}
