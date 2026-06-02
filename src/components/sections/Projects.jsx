import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section, stagger } from '../../lib/animations'
import { SectionHeading } from './About'

function ProjectCard({ project }) {
  const { t } = useTranslation()

  return (
    <motion.article
      variants={fadeUp}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] p-6
                 hover:border-[var(--accent-border)] transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[var(--text-h)] font-semibold text-lg leading-snug">
          {project.name}
        </h3>
        {project.featured && (
          <span
            className="shrink-0 mt-0.5 text-xs font-mono text-[var(--accent)]
                       border border-[var(--accent-border)] rounded-full px-2.5 py-0.5"
          >
            {t('projects.featured')}
          </span>
        )}
      </div>

      <p className="text-[var(--text)] text-sm leading-relaxed flex-1">
        {t(`data.projects.${project.id}`)}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-0.5 rounded-full
                       border border-[var(--border)] text-[var(--text)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="flex items-center justify-between text-xs pt-1
                   border-t border-[var(--border)]"
      >
        <span className="text-[var(--text)] opacity-50 font-mono">{project.year}</span>
        {project.url && project.url !== '#' && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] font-medium hover:opacity-70 transition-opacity"
          >
            {t('projects.view')} <span aria-hidden className="rtl-flip">→</span>
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="work"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14
                 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="02" label={t('sections.projects')} />
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={stagger}
      >
        {portfolio.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </motion.section>
  )
}
