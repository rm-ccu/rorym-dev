import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageProvider'
import { useTheme } from '../context/ThemeProvider'
import portfolio from '../data/portfolio.json'

const SUPPORTED_LANGS = ['en', 'fr', 'ar']

export function useCommandParser() {
  const { changeLocale } = useLanguage()
  const { setTheme } = useTheme()
  const { t } = useTranslation()

  const [history, setHistory] = useState(() => [
    {
      input: null,
      result: { type: 'welcome', message: t('cli.welcome') },
    },
  ])

  const parse = useCallback(
    (raw) => {
      const input = raw.trim()
      if (!input) return

      let result

      if (input === 'help') {
        result = {
          type: 'help',
          header: t('cli.help_header'),
          commands: [
            { cmd: 'ls projects',        description: t('cli.cmd_ls')    },
            { cmd: 'cat about.txt',      description: t('cli.cmd_cat')   },
            { cmd: 'resume',             description: t('cli.cmd_resume') },
            { cmd: 'help',               description: t('cli.cmd_help')  },
            { cmd: 'theme --dark',       description: t('cli.cmd_dark')  },
            { cmd: 'theme --light',      description: t('cli.cmd_light') },
            { cmd: 'export LANG=<loc>',  description: t('cli.cmd_lang')  },
            { cmd: 'clear',              description: t('cli.cmd_clear') },
          ],
        }

      } else if (input === 'ls projects') {
        result = {
          type: 'list',
          label: t('cli.proj_label'),
          items: portfolio.projects.map((p) => ({
            name:         p.name,
            year:         p.year,
            description:  t(`data.projects.${p.id}`),
            tech:         p.tech,
            featured:     p.featured,
            featuredLabel: p.featured ? t('cli.featured') : null,
          })),
        }

      } else if (input === 'cat about.txt') {
        result = {
          type: 'file',
          filename: 'about.txt',
          leadershipHeader: t('cli.leadership_header'),
          fields: [
            [t('cli.field_name'),     portfolio.meta.name],
            [t('cli.field_role'),     t('hero.role')],
            [t('cli.field_location'), portfolio.meta.location],
            [t('cli.field_email'),    portfolio.meta.email],
          ],
          bio: t('data.bio'),
          leadership: portfolio.leadership.map((l) => ({
            id:          l.id,
            org:         l.org,
            period:      l.period,
            title:       t(`data.leadership.${l.id}.title`),
            description: t(`data.leadership.${l.id}.description`),
          })),
        }

      } else if (input === 'resume') {
        window.open('/resume.pdf', '_blank')
        result = { type: 'success', message: t('cli.resume_opened') }

      } else if (/^theme\s+--?(dark|light)$/.test(input)) {
        const mode = /dark/.test(input) ? 'dark' : 'light'
        setTheme(mode)
        result = { type: 'success', message: t('cli.theme_set', { mode }) }

      } else if (/^export\s+LANG=(\w+)$/.test(input)) {
        const [, lang] = input.match(/LANG=(\w+)/)
        if (!SUPPORTED_LANGS.includes(lang)) {
          result = {
            type: 'error',
            message: t('cli.lang_error', { lang, supported: SUPPORTED_LANGS.join(', ') }),
          }
        } else {
          changeLocale(lang)
          result = { type: 'success', message: t('cli.lang_set', { lang }) }
        }

      } else if (input === 'clear') {
        setHistory([])
        return

      } else {
        result = { type: 'error', message: t('cli.not_found', { cmd: input }) }
      }

      setHistory((prev) => [...prev, { input, result }])
    },
    [changeLocale, setTheme, t],
  )

  return { parse, history }
}
