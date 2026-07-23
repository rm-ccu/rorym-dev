import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section } from '../../lib/animations'
import { SectionHeading } from './About'
import avatar from '../../assets/contact/avatar.png'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="contact"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14
                 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="04" label={t('sections.contact')} />
      </motion.div>

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-20">
        <div className="max-w-xl flex flex-col gap-6">
          <motion.h3
            variants={fadeUp}
            className="text-2xl md:text-3xl font-semibold text-[var(--text-h)] leading-snug"
          >
            {t('contact.heading')}
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[var(--text)] text-base leading-relaxed">
            {t('contact.body')}
          </motion.p>

          <motion.a
            variants={fadeUp}
            href={`mailto:${portfolio.meta.email}`}
            className="inline-flex items-center gap-2 self-start
                       px-6 py-3 rounded-full bg-[var(--accent)] text-white
                       font-medium hover:opacity-90 transition-opacity"
          >
            {t('contact.email_cta')}
            <span aria-hidden="true" className="rtl-flip">→</span>
          </motion.a>

          <motion.dl variants={fadeUp} className="flex flex-col gap-1.5 text-sm mt-8">
            <div className="flex gap-2">
              <dt className="text-[var(--text)] opacity-50 shrink-0">
                {t('contact.location_label')}
              </dt>
              <dd className="text-[var(--text)]">{portfolio.meta.location}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[var(--text)] opacity-50 shrink-0">
                {t('contact.email_label')}
              </dt>
              <dd>
                <a
                  href={`mailto:${portfolio.meta.email}`}
                  className="text-[var(--accent)] hover:opacity-70 transition-opacity"
                >
                  {portfolio.meta.email}
                </a>
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          variants={fadeUp}
          className="group shrink-0 mx-auto lg:mx-0 lg:ml-auto w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96
                     perspective-distant"
        >
          <div
            className="relative w-full h-full transition-transform duration-700 ease-out
                       transform-3d group-hover:rotate-y-180"
          >
            <div
              className="absolute inset-0 rounded-full overflow-hidden
                         border-4 border-[#c0c0c0] backface-hidden"
            >
              <img
                src={avatar}
                alt={portfolio.meta.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute inset-0 rounded-full overflow-hidden
                         border-4 border-[#c0c0c0] backface-hidden rotate-y-180"
            >
              <img
                src={avatar}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.p
        variants={fadeUp}
        className="mt-20 text-xs text-[var(--text)] opacity-30 font-mono"
      >
        {t('hero.name')} · {new Date().getFullYear()}
      </motion.p>
    </motion.section>
  )
}
