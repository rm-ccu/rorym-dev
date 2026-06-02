# Development Log — Portfolio

A chronological record of every decision, component, hook, context, and configuration built in this project.

---

## Phase 1 — Project Scaffold

### Tooling decisions

- **Vite** chosen as the build tool for its sub-second HMR and native ESM support.
- **React 19** (JSX, no TypeScript) for the UI layer.
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — the new single-import approach (`@import "tailwindcss"` in CSS, no `tailwind.config.js`). v4 maps `mx-*`/`px-*` to `margin-inline`/`padding-inline` (logical CSS), which is important for RTL support.
- **Framer Motion** for all animations — page-load entrance, scroll-triggered section reveals, glitch mode transitions, and the typewriter cursor blink.
- **i18next + react-i18next** for three-locale support (EN / FR / AR). Resources bundled at build time rather than loaded from a CDN.

### `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Both plugins registered — Tailwind processes CSS at build time via the Vite plugin, React Fast Refresh handles JSX.

### `index.html`

Google Fonts added via `<link>` preconnect + stylesheet:
- **Changa** (weights 300–700) — used for EN and FR
- **Kufam** (weights 400–700) — used for AR

An inline `<script>` block was added in `<head>` before any stylesheets load. This is the FOUC-prevention script for the dark/light theme. It runs synchronously, reads `localStorage.theme`, falls back to `prefers-color-scheme`, and sets `data-theme` on `<html>` before any CSS is parsed. Without this, users with a stored light preference on a dark-OS system would see a brief flash of dark.

```html
<script>
  (function () {
    try {
      var s = localStorage.getItem('theme')
      document.documentElement.setAttribute(
        'data-theme',
        s === 'dark' || s === 'light'
          ? s
          : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      )
    } catch (_) {}
  })()
</script>
```

---

## Phase 2 — Global Styles (`src/index.css`)

### CSS custom properties

All design tokens are CSS custom properties on `:root`. The light theme is the default:

| Variable | Purpose |
|---|---|
| `--text` | Body text colour |
| `--text-h` | Heading / high-emphasis text |
| `--bg` | Page background |
| `--border` | Subtle divider colour |
| `--accent` | Brand purple (`#aa3bff` light / `#c084fc` dark) |
| `--accent-bg` | Translucent accent fill |
| `--accent-border` | Translucent accent stroke |
| `--sans` | Body font family (swapped per locale by LanguageProvider) |
| `--heading` | Heading font family (same swap) |
| `--mono` | Monospace stack for CLI + code |
| `--shadow` | Box shadow tokens |

### Theme cascade

Three rules control theming, in priority order:

1. **`:root`** — light defaults (always active)
2. **`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`** — system dark unless the user has explicitly forced light
3. **`:root[data-theme="dark"]`** and **`:root[data-theme="light"]`** — explicit overrides that win over the media query

This cascade ensures: system default → no flash → user override always wins.

### `#root` stacking context

```css
#root {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
```

`position: relative; z-index: 1` creates a stacking context that sits above the fixed-position `CanvasBG` canvas (which has `z-index: 0`). Without this, the canvas would paint over the content.

### RTL logical property utility

```css
.rtl-flip { display: inline-block; }
[dir="rtl"] .rtl-flip { transform: scaleX(-1); }
```

Applied to `→` arrow glyphs in Projects and Contact so they flip to `←` in Arabic.

---

## Phase 3 — Data Layer

### `src/data/portfolio.json`

Single source of truth for all non-translatable content. Structure:

```json
{
  "meta": { "name", "location", "email" },
  "projects": [{ "id", "name", "tech", "url", "year", "featured" }],
  "leadership": [{ "id", "org", "period" }]
}
```

**Decision:** Proper nouns (project names, org names), structured data (URLs, years, tech tags), and personal info (email, location) live here. All human-readable strings that need translation live in locale files. IDs are used as translation keys (`data.projects.luminos`, `data.leadership.ieee_chair.title`), keeping the JSON and locale files in sync without duplication.

---

## Phase 4 — Internationalisation

### `src/i18n.js`

i18next initialised with all three locales bundled inline. `interpolation.escapeValue: false` because React already escapes values.

### Locale file structure (`src/locales/{en,fr,ar}/translation.json`)

Keys are organised into namespaces:

| Namespace | Contents |
|---|---|
| `nav` | Navigation labels |
| `hero` | Hero section copy |
| `sections` | Section headings |
| `about` | Bio + 3 pillar titles/bodies |
| `projects` | "View" + "Featured" labels |
| `leadership` | "at/chez/في" connective |
| `contact` | Heading, body, CTA labels |
| `language` | Language switcher labels |
| `cli` | All terminal strings (welcome, commands, messages) |
| `data` | Long-form translated content (bio, project descriptions, leadership titles/descriptions) |

**Decision — snapshot pattern for CLI:** Result objects in `useCommandParser` capture translated strings at parse time (e.g., `description: t('data.projects.luminos')`). This means history entries keep their language from when they were typed — switching `export LANG=fr` mid-session does not retroactively translate earlier output. New commands after the switch produce French output.

---

## Phase 5 — Context Providers

### `src/context/LanguageProvider.jsx`

Wraps the app and owns locale state. On `changeLocale(lang)`:
1. Calls `i18n.changeLanguage(lang)` to update react-i18next
2. Sets `html[lang]` attribute
3. Sets `html[dir]` to `"rtl"` for Arabic, `"ltr"` otherwise
4. Sets `--sans` and `--heading` CSS custom properties to Kufam (AR) or Changa (EN/FR)

This font swap is done via inline style on `document.documentElement`, which overrides the `:root` CSS value at the highest specificity without needing a class.

Exports `useLanguage()` returning `{ locale, changeLocale }`.

### `src/context/ModeProvider.jsx`

Owns the `viewMode` state (`'gui'` | `'cli'`), persisted to `localStorage`. On change:
- Updates React state
- Writes to `localStorage.viewMode`
- Stamps `data-mode` on `<html>` (available for future CSS hooks)

Exports `useMode()` returning `{ viewMode, setViewMode, toggleMode }`.

**Decision — exclusive modes:** An earlier design had CLI and GUI accessible simultaneously (split pane on desktop, overlay on tablet, bar on mobile). This was replaced with a full-page exclusive toggle after feedback that they should be completely separate views. The `AnimatePresence mode="wait"` in RootLayout enforces the exclusive switch.

### `src/context/ThemeProvider.jsx`

Owns `theme` state (`'dark'` | `'light'`). Initialization priority:
1. `localStorage.getItem('theme')` — stored manual preference
2. `window.matchMedia('(prefers-color-scheme: dark)').matches` — system default
3. `'light'` — hardcoded fallback

On `setTheme(next)`: updates React state, writes `localStorage.theme`, `useEffect` sets `html[data-theme]`.

Registers a `matchMedia` change listener that updates the theme when the OS switches — but only if `localStorage.theme` is empty at the time of the event (checked at event-fire time, not at setup time, so a subsequent manual override is immediately respected).

**CLI integration:** The `theme --dark/light` CLI command was initially calling `document.documentElement.setAttribute('data-theme', mode)` directly. This was refactored to call `setTheme(mode)` from `useTheme()` so the toggle button icon and localStorage both stay in sync with CLI-triggered theme changes.

---

## Phase 6 — Animation Library

### `src/lib/animations.js`

Three shared Framer Motion variant objects used by all four scroll sections (About, Projects, Leadership, Contact):

- **`section`** — the trigger container. `hidden: {}` (no transform), `visible` adds `staggerChildren: 0.1, delayChildren: 0.06`. Using an empty `hidden` means the section container itself doesn't animate — only its children do.
- **`stagger`** — nested stagger container (for card grids). `staggerChildren: 0.1` with no delay.
- **`fadeUp`** — individual item. `opacity: 0, y: 24` → `opacity: 1, y: 0` over 0.6 s with a custom spring easing `[0.16, 1, 0.3, 1]`.

**Decision:** Consolidating variants here was done to unify the animation language across all sections. Previously each section defined its own `reveal` / `cardVariants` / `itemVariants` with slightly different timings. The shared `fadeUp` creates visual consistency and makes adjustments to all sections a single-line change.

---

## Phase 7 — Layout Shell

### `src/App.jsx`

Minimal entry — just renders `<RootLayout />`.

### `src/components/RootLayout.jsx`

The app shell. Renders two siblings via a React Fragment:

1. **`<CanvasBG />`** — `position: fixed`, behind everything
2. **Content div** — `relative z-10 flex-1 flex flex-col max-w-7xl mx-auto border-s border-e`

The `z-10` on the content div creates a stacking context above the canvas.

The sticky header bar contains:
- `{!isCLI && <ThemeToggle />}` — theme toggle, GUI-only
- The `> CLI` / `⊞ GUI` mode toggle button

**BiDi fix:** The button text (`> CLI`, `⊞ GUI`) uses neutral Unicode characters that get reordered by the BiDi algorithm in RTL context — visually becoming `CLI <` and `GUI ⊞`. Fixed by wrapping the text in `<span dir="ltr">`.

Below the header, `AnimatePresence mode="wait"` switches between CLI and GUI with the `glitch` variants.

### Glitch transition variants

```js
const glitch = {
  initial:  { opacity: 0, clipPath: 'inset(46% 0% 46% 0%)', filter: 'blur(8px)' },
  animate:  { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)',   filter: 'blur(0px)' },
  exit:     { opacity: 0, clipPath: 'inset(46% 0% 46% 0%)', filter: 'blur(8px)' },
}
```

`inset(46% 0% 46% 0%)` clips the element to an 8% horizontal sliver in the centre. On exit the content compresses to this bar; on enter it expands from it. Combined with blur, this creates a "monitor switching channels" effect. `clipPath` and `opacity`/`filter` have separate transition durations for fine control.

### `src/components/GuiPane.jsx`

Renders the five sections in order: Hero → About → Projects → Leadership → Contact.

---

## Phase 8 — Canvas Background

### `src/components/CanvasBG.jsx`

An HTML5 Canvas rendered `position: fixed; inset: 0; z-index: 0; pointer-events: none` — below the layout but above the HTML element background.

Four gradient orbs are defined as data:

```js
const ORBS = [
  { x, y, r, sx, sy, speed, phase }
  // x/y = centre position as fraction of viewport
  // r   = radius as fraction of min(W, H)
  // sx/sy = amplitude of horizontal/vertical drift
  // speed = angular velocity (very slow — ~0.00016 rad/frame)
  // phase = starting phase offset so orbs are desynchronised
]
```

Each frame: `cx = (o.x + sin(t * speed + phase) * sx) * W`, `cy = (o.y + cos(t * speed * 0.73 + phase) * sy) * H`. The `0.73` factor on the y-axis creates elliptical rather than circular paths.

Each orb is a radial gradient from `rgba(accent, alpha)` at centre to transparent at the radius. Primary orbs (index < 2) use alpha 0.14; secondary use 0.08.

**Accent colour reading:** `readAccentRgb()` parses the `--accent` CSS variable from `getComputedStyle`. A `MutationObserver` watches `html[data-theme]` and re-reads the accent on theme change, so the orb colours update immediately when the user toggles dark/light.

**Cleanup:** `cancelAnimationFrame`, `observer.disconnect()`, `window.removeEventListener` all called on unmount.

---

## Phase 9 — CLI View

### `src/components/CLI.jsx`

The terminal pane. Always rendered with `dir="ltr"` regardless of locale — terminals are direction-invariant.

#### `Cursor` component

A `motion.span` with `width: 0.5ch; height: 1.1em; marginInlineStart: 1px` (logical property). Animates `opacity: [1, 0]` on an infinite mirror loop with `ease: 'steps(1)'` for a hard blink rather than a fade.

#### `Typewriter` component

Uses `setTimeout(delay)` + `setInterval(speed)` to reveal characters one at a time. Calls `onDone()` when all characters are displayed. While typing, renders a `<Cursor />` inline after the text. After completion, the cursor is removed.

**Mounting behaviour:** CLI unmounts and remounts every time the mode is toggled (because `key="cli"` in AnimatePresence). This means the typewriter intro replays on each visit to CLI mode — intentional, feels like opening a fresh terminal session.

#### `Result` component (named export)

A switch on `result.type` renders:
- `welcome` — italic accent-coloured paragraph (used by MobileCliBar too)
- `help` — two-column grid (`18ch 1fr`) for command / description alignment
- `list` — project list with `border-s-2` accent indent, featured badge, tech tags
- `file` — `about.txt` viewer with field key=value pairs, bio paragraph, leadership entries
- `success` — `text-emerald-400`
- `error` — `text-red-400`

#### `CLI` component

State: `input`, `cmdHistory` (for ArrowUp/Down recall), `historyIdx`, `introDone`.

The `history` array from `useCommandParser` is split: `welcomeEntry` (index 0 if type is `welcome`) is rendered via `<Typewriter>`, and `postWelcome` (the rest) is rendered as animated `motion.div` entries — but **only after** `introDone` is true. The input `<form>` also only renders after `introDone` via `AnimatePresence`.

### `src/hooks/useCommandParser.js`

Custom hook. Consumes `useLanguage()`, `useTheme()`, and `useTranslation()`.

Initial history state is a single welcome entry with `t('cli.welcome')` captured at hook initialisation time.

The `parse(raw)` callback handles:

| Command | Action |
|---|---|
| `help` | Returns a `help` result with all command descriptions translated at parse time |
| `ls projects` | Maps `portfolio.projects` with `t('data.projects.{id}')` for descriptions |
| `cat about.txt` | Builds a `file` result with meta fields, bio, and leadership |
| `theme --dark` / `theme --light` | Calls `setTheme(mode)` from ThemeProvider |
| `export LANG=en/fr/ar` | Calls `changeLocale(lang)` from LanguageProvider |
| `clear` | Calls `setHistory([])` and returns early |
| anything else | Returns an `error` result with `not_found` message |

`parse` is memoised with `useCallback([changeLocale, setTheme, t])`.

---

## Phase 10 — GUI Sections

### `src/components/sections/Hero.jsx`

Full-viewport section (`min-h-svh`). Centred content column.

Language switcher: an absolutely-positioned `<nav>` at `top-6` with three pill buttons. Active locale gets `bg-[var(--accent)] text-white`, inactive gets `border-[var(--border)]` with hover accent. Calls `changeLocale(lang)` from `useLanguage()`.

Entrance animations use the inline `item(delay)` helper (not the shared `fadeUp` because Hero is mount-triggered with fixed delays, not scroll-triggered):
- greeting (0.05 s delay)
- name h1 (0.15 s)
- role (0.25 s)
- tagline (0.35 s)
- CTA buttons (0.45 s)
- scroll hint (1.1 s fade-in only)

CTA links use anchor hrefs: `#work` and `#contact`.

Scroll hint uses `↓` (vertical — not affected by RTL).

### `src/components/sections/About.jsx`

Exports two things: the `About` default export and the `SectionHeading` named export (reused by all sections).

`SectionHeading` renders: index number in mono + `h2` + a `w-10 h-0.5` accent underline div. In RTL, this block-level div aligns to inline-start (right) under the right-aligned text.

About uses `variants={section}` + `whileInView="visible"` + `viewport={{ once: true, margin: '-80px' }}` as the top-level trigger. Children:
- `SectionHeading` wrapper div → `variants={fadeUp}`
- Bio `<p>` → `variants={fadeUp}`
- Pillar grid `motion.div` → `variants={stagger}` (no own initial/whileInView — inherits from parent)
- Each pillar card → `variants={fadeUp}`

### `src/components/sections/Projects.jsx`

`ProjectCard` is a `motion.article variants={fadeUp}`. Card layout:
- Header row: `justify-between` — project name (inline-start) + featured badge (inline-end). Mirrors correctly in RTL.
- Description, tech tag pills (flex-wrap), footer row.
- Footer: year (inline-start) + "View project →" link (inline-end). The `→` is wrapped in `<span aria-hidden className="rtl-flip">` for RTL flip.

Section uses the same `section` + `stagger` pattern as About.

### `src/components/sections/Leadership.jsx`

`LeadershipCard` uses `ps-5 border-s-2 border-[var(--accent)]` — a logical inline-start border that functions as a timeline accent on both LTR and RTL. Header row uses `justify-between` for title and period date.

### `src/components/sections/Contact.jsx`

All six child elements are individually wrapped in `motion.* variants={fadeUp}`:
1. `SectionHeading` wrapper
2. `h3` — heading text
3. `<p>` — body copy
4. `<a>` — email CTA (self-start alignment, `→` with `rtl-flip`)
5. `<dl>` — location and email fields
6. `<p>` — footer with name and year

### `src/components/ThemeToggle.jsx`

`motion.button` with `whileTap={{ scale: 0.88 }}` for tactile feedback. Renders `<SunIcon />` in dark mode (click → switch to light) and `<MoonIcon />` in light mode. Icons are inline SVGs (`width/height: 14`, `stroke="currentColor"`). Styled to match the CLI/GUI toggle button but `p-1.5` (square) rather than `px-3 py-1.5` (text button).

---

## Phase 11 — RTL Audit

A full audit was performed after switching the locale to Arabic (`export LANG=ar`). Findings and fixes:

### Fixed

**`> CLI` / `⊞ GUI` button text** — BiDi algorithm placed `>` and `⊞` after the Latin text in RTL context, rendering as `CLI <` and `GUI ⊞`. Fixed by wrapping in `<span dir="ltr">`.

**`→` arrows in Projects and Contact** — Hardcoded `→` pointed the wrong way in RTL. Wrapped in `<span className="rtl-flip">` with CSS `scaleX(-1)` on `[dir=rtl]`.

### Confirmed correct (no change needed)

| Element | Behaviour |
|---|---|
| `px-*` / `mx-*` | Tailwind v4 maps these to `padding-inline` / `margin-inline` (logical) |
| `justify-between` in card footers | Flex main axis reverses in RTL — year moves to inline-start (right), links to inline-end (left) |
| `justify-end` on sticky header | Button moves to inline-start (left) in RTL — correct |
| `SectionHeading` accent underline | Block-level div starts at inline-start (right in RTL) under right-aligned heading |
| Canvas orbs | Pixel coordinates, unaffected by CSS direction |
| CLI `dir="ltr"` + cursor `marginInlineStart` | Terminal intentionally locked LTR; cursor uses logical property |
| App.css `border-left/right` | Not imported anywhere — dead Vite scaffold code |

---

## File Inventory

```
src/
├── main.jsx                          Entry point, provider chain
├── App.jsx                           Single-line root render
├── i18n.js                           i18next initialisation
├── index.css                         CSS custom properties, themes, utilities
│
├── data/
│   └── portfolio.json                Non-translatable structured data
│
├── locales/
│   ├── en/translation.json
│   ├── fr/translation.json
│   └── ar/translation.json
│
├── lib/
│   └── animations.js                 Shared Framer Motion variants
│
├── context/
│   ├── LanguageProvider.jsx          Locale state, dir/font switching
│   ├── ModeProvider.jsx              gui/cli toggle, localStorage
│   └── ThemeProvider.jsx             dark/light toggle, localStorage, FOUC-safe
│
├── hooks/
│   └── useCommandParser.js           CLI command dispatch + history
│
└── components/
    ├── RootLayout.jsx                Shell, sticky header, glitch transition
    ├── CanvasBG.jsx                  Fixed canvas gradient mesh
    ├── GuiPane.jsx                   Ordered section container
    ├── CLI.jsx                       Typewriter, Result renderer, input form
    ├── ThemeToggle.jsx               Sun/moon icon button
    └── sections/
        ├── Hero.jsx                  Full-viewport intro + language switcher
        ├── About.jsx                 Bio + pillar cards + SectionHeading export
        ├── Projects.jsx              2×2 card grid
        ├── Leadership.jsx            Timeline list
        └── Contact.jsx               CTA + dl + footer
```

---

## Dependency Versions

| Package | Version |
|---|---|
| react | ^19.2.6 |
| react-dom | ^19.2.6 |
| framer-motion | ^12.40.0 |
| i18next | ^26.3.0 |
| react-i18next | ^17.0.8 |
| tailwindcss | ^4.3.0 |
| @tailwindcss/vite | ^4.3.0 |
| vite | ^8.0.12 |
| @vitejs/plugin-react | ^6.0.1 |
