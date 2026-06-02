# Rory McCulloch — Portfolio

A modern, performant portfolio showcasing projects in AI/ML, embedded systems, and hardware engineering. Built with React 19, Vite, and Tailwind CSS.

**Live:** [rorym.dev](https://rorym.dev)

## About

I'm a dual-degree student in Electrical Engineering and Computing Technology at uOttawa, currently interning at Trench Group as an AI/ML Applied Sciences Intern on Project NOVA. This portfolio highlights work in:

- **AI/ML pipelines** — modernizing legacy data aggregation systems
- **Hardware design** — PCB routing, embedded microcontrollers, signal processing
- **Defense tech** — real-time audio classification for counter-UAV systems
- **Event leadership** — organizing conferences and building industry partnerships

## Features

- **Dark/Light mode** — theme toggle persisted to localStorage, respects `prefers-color-scheme`
- **Internationalization** — English, French, and Arabic with full RTL support
- **CLI mode** — retro terminal interface for browsing projects and resumé
- **Smooth animations** — Framer Motion transitions, staggered entrance animations, glitch effects
- **Canvas background** — animated gradient mesh with accent-color-driven orbs
- **Fully responsive** — mobile-first design with logical CSS properties
- **Resume integration** — preview and download buttons in header, CLI command support
- **Scroll-to-top** — smooth scroll button appears after viewport scroll
- **Live EDT clock** — header displays my timezone with hover reveal animation

## Tech Stack

- **Frontend:** React 19, Vite 8
- **Styling:** Tailwind CSS v4 (with @tailwindcss/vite plugin)
- **Animations:** Framer Motion
- **i18n:** i18next with react-i18next
- **Fonts:** Google Fonts (Changa for EN/FR, Kufam for AR)
- **Deployment:** GitHub Pages with custom domain

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/        # React components (sections, UI)
├── context/          # Global state (Language, Theme, Mode providers)
├── hooks/            # Custom hooks (useCommandParser)
├── i18n/             # i18next config
├── locales/          # Translation files (en, fr, ar)
├── data/             # portfolio.json (meta, projects, leadership)
├── lib/              # Shared utilities (animations.js)
└── index.css         # Global styles + theme CSS variables
docs/
├── DEVLOG.md         # Chronological development log
└── MANUAL_BUILD.md   # Step-by-step rebuild guide
```

## Key Design Decisions

- **No TypeScript:** Focused on shipping quickly; codebase is small enough that runtime checks suffice
- **Snapshot pattern for CLI history:** Results capture translated strings at parse time, so locale switches don't retroactively change history
- **Logical CSS properties:** `ms-*`, `me-*`, `ps-*`, `border-s` automatically flip in RTL contexts
- **Fixed canvas background:** `z-index: 0`, with `#root` at `z-index: 1` to layer content above
- **Three-layer theme cascade:** System default → media query override → explicit `data-theme` attribute

## Deployment

Deploys automatically to GitHub Pages on push to `main` via GitHub Actions. Custom domain configured via `public/CNAME` and GitHub Pages settings.

See [vite.config.js](vite.config.js) for `base: '/'` (correct for custom domains) and [.github/workflows/deploy.yml](.github/workflows/deploy.yml) for the deployment workflow.

## Documentation

- **[docs/DEVLOG.md](docs/DEVLOG.md)** — Full development log with architecture notes and design decisions
- **[docs/MANUAL_BUILD.md](docs/MANUAL_BUILD.md)** — Complete step-by-step rebuild guide (useful for reference or porting)

## Contact

- **Email:** rory.mccu@gmail.com
- **LinkedIn:** [linkedin.com/in/rory-mcculloch](https://linkedin.com/in/rory-mcculloch)
- **Location:** Ottawa, ON

---

Built with attention to performance, accessibility, and craft. Designed for clarity and delight.
