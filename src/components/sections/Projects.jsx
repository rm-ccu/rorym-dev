import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section, stagger } from '../../lib/animations'
import { SectionHeading } from './About'
import counterUavGif from '../../assets/projects/counter-uav.gif'
import handsUpGif from '../../assets/projects/hands-up.gif'

const PROJECT_GIFS = {
  counter_uav: counterUavGif,
  hands_up: handsUpGif,
}

function ProjectCard({ project }) {
  const { t } = useTranslation()
  const gif = PROJECT_GIFS[project.id]

  const titleClass = gif
    ? 'text-white group-hover:text-[var(--text-h)]'
    : 'text-[var(--text-h)]'
  const tagClass = gif
    ? 'border-white/30 text-white/90 group-hover:border-[var(--border)] group-hover:text-[var(--text)]'
    : 'border-[var(--border)] text-[var(--text)]'
  const footerBorderClass = gif
    ? 'border-white/20 group-hover:border-[var(--border)]'
    : 'border-[var(--border)]'
  const yearClass = gif
    ? 'text-white/60 group-hover:text-[var(--text)] group-hover:opacity-50'
    : 'text-[var(--text)] opacity-50'

  return (
    <motion.article
      variants={fadeUp}
      className="relative flex flex-col gap-4 rounded-xl border border-[var(--border)] p-6
                 overflow-hidden hover:border-[var(--accent-border)] transition-colors group"
    >
      {gif && (
        <>
          <div className="absolute inset-0 bg-[#0a1237]" />
          <img
            src={gif}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain object-bottom
                       mask-[linear-gradient(to_bottom,transparent,black_45%)]"
          />
          <div
            className="absolute inset-0 bg-black/40 group-hover:bg-[var(--bg)]
                       transition-colors duration-500"
          />
        </>
      )}

      <div className="relative flex items-start justify-between gap-2">
        <h3 className={`font-semibold text-lg leading-snug transition-colors duration-500 ${titleClass}`}>
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

      <p
        className={`relative text-[var(--text)] text-sm leading-relaxed flex-1 ${
          gif ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-500' : ''
        }`}
      >
        {t(`data.projects.${project.id}`)}
      </p>

      <div className="relative flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors duration-500 ${tagClass}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className={`relative flex items-center justify-between text-xs pt-1
                     border-t transition-colors duration-500 ${footerBorderClass}`}
      >
        <span className={`font-mono transition-colors duration-500 ${yearClass}`}>{project.year}</span>
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
        <SectionHeading index="03" label={t('sections.projects')} />
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
