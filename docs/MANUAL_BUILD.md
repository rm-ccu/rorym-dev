# Manual Build Guide — Portfolio

A complete step-by-step guide to recreating this portfolio from scratch. Follow every step in order. Every install command, file path, and code block is included.

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (comes with Node 18+)
- A terminal

---

## Step 1 — Scaffold the project

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
```

This creates a React + Vite project with the default template. You will have `src/App.jsx`, `src/main.jsx`, `src/App.css`, `src/index.css`, and `index.html`.

---

## Step 2 — Install dependencies

```bash
npm install framer-motion i18next react-i18next
npm install -D tailwindcss @tailwindcss/vite
```

**Final `package.json` dependencies section:**

```json
{
  "dependencies": {
    "framer-motion": "^12.40.0",
    "i18next": "^26.3.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-i18next": "^17.0.8"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/vite": "^4.3.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "tailwindcss": "^4.3.0",
    "vite": "^8.0.12"
  }
}
```

---

## Step 3 — Configure Vite

Replace the entire contents of `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

> Note: Tailwind v4 requires NO `tailwind.config.js`. The `@tailwindcss/vite` plugin handles everything automatically. Do not create a config file.

---

## Step 4 — Set up `index.html`

Replace the entire contents of `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>portfolio</title>
    <!-- Sets data-theme before CSS loads to prevent a flash of wrong theme -->
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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Changa:wght@300;400;500;600;700&family=Kufam:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

> The inline `<script>` must come **before** the font `<link>` tags. It sets `data-theme` synchronously, preventing a flash of the wrong colour scheme on first load.

---

## Step 5 — Global CSS (`src/index.css`)

Delete all existing content and replace with:

```css
@import "tailwindcss";

:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: 'Changa', system-ui, sans-serif;
  --heading: 'Changa', system-ui, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }
}

/* Explicit dark override — wins over system preference */
:root[data-theme="dark"] {
  --text: #9ca3af;
  --text-h: #f3f4f6;
  --bg: #16171d;
  --border: #2e303a;
  --code-bg: #1f2028;
  --accent: #c084fc;
  --accent-bg: rgba(192, 132, 252, 0.15);
  --accent-border: rgba(192, 132, 252, 0.5);
  --social-bg: rgba(47, 48, 58, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
}

/* Explicit light override — wins over system preference */
:root[data-theme="light"] {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
}

body {
  margin: 0;
}

/* Flip directional glyphs (→ arrows, etc.) in RTL layouts */
.rtl-flip {
  display: inline-block;
}
[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}

#root {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}
h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}
p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}
```

---

## Step 6 — Create directory structure

```bash
mkdir -p src/context src/hooks src/components/sections src/data src/lib
mkdir -p src/locales/en src/locales/fr src/locales/ar
```

---

## Step 7 — Portfolio data (`src/data/portfolio.json`)

Create `src/data/portfolio.json`:

```json
{
  "meta": {
    "name": "Alex Moreau",
    "location": "Ottawa, ON",
    "email": "alex@example.com"
  },
  "projects": [
    { "id": "luminos",  "name": "Luminos",   "tech": ["WebGL", "React", "Web MIDI API"],         "url": "https://luminos.example.com",         "year": 2024, "featured": true  },
    { "id": "inkflow",  "name": "InkFlow",   "tech": ["Canvas API", "CRDT", "TypeScript"],       "url": "https://inkflow.example.com",         "year": 2023, "featured": true  },
    { "id": "sonance",  "name": "Sonance",   "tech": ["Web Audio API", "D3.js", "Svelte"],       "url": "https://sonance.example.com",         "year": 2023, "featured": false },
    { "id": "gridlang", "name": "GridLang",  "tech": ["Chrome Extensions", "CSS", "TypeScript"], "url": "https://github.com/example/gridlang", "year": 2022, "featured": false }
  ],
  "leadership": [
    { "id": "ieee_chair",  "org": "IEEE uOttawa Student Branch", "period": "2024 – present" },
    { "id": "ieee_events", "org": "IEEE uOttawa Student Branch", "period": "2023 – 2024"   },
    { "id": "ieee_tech",   "org": "IEEE uOttawa Student Branch", "period": "2022 – 2023"   }
  ]
}
```

---

## Step 8 — Locale files

### `src/locales/en/translation.json`

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "work": "Work",
    "contact": "Contact"
  },
  "hero": {
    "name": "Alex Moreau",
    "greeting": "Hello, I'm",
    "role": "Creative Developer",
    "tagline": "Crafting interfaces where code meets craft.",
    "cta": "See my work",
    "contact_cta": "Get in touch",
    "scroll_hint": "Scroll to explore"
  },
  "sections": {
    "about": "About",
    "projects": "Projects",
    "leadership": "Leadership",
    "contact": "Contact"
  },
  "about": {
    "body": "I design and build thoughtful digital experiences with a focus on performance, accessibility, and craft.",
    "pillar_1_title": "Performance",
    "pillar_1_body": "Obsessed with Core Web Vitals, rendering pipelines, and every millisecond that stands between a user and delight.",
    "pillar_2_title": "Craft",
    "pillar_2_body": "Detail-driven from system typography down to micro-interaction timing curves.",
    "pillar_3_title": "Creativity",
    "pillar_3_body": "Pushing boundaries with generative art, WebGL, and interactive media that surprises."
  },
  "projects": {
    "view": "View project",
    "featured": "Featured"
  },
  "leadership": {
    "role_at": "at"
  },
  "contact": {
    "heading": "Let's Work Together",
    "body": "Have a project in mind or just want to say hello? I'd love to hear from you.",
    "email_cta": "Send an email",
    "email_label": "Email",
    "location_label": "Based in"
  },
  "language": {
    "label": "Language",
    "en": "English",
    "fr": "Français",
    "ar": "العربية"
  },
  "cli": {
    "welcome": "Portfolio CLI v1.0.0  —  type 'help' to get started.",
    "help_header": "Available commands:",
    "cmd_ls":      "List all portfolio projects",
    "cmd_cat":     "Display bio, contact, and leadership",
    "cmd_help":    "Show this help text",
    "cmd_dark":    "Switch to dark colour theme",
    "cmd_light":   "Switch to light colour theme",
    "cmd_lang":    "Change language: en | fr | ar",
    "cmd_clear":   "Clear terminal output",
    "theme_set":   "Theme set to {{mode}}.",
    "lang_set":    "LANG exported as '{{lang}}'.",
    "lang_error":  "Unsupported locale '{{lang}}'. Supported: {{supported}}.",
    "not_found":   "command not found: {{cmd}}",
    "proj_label":  "projects/",
    "featured":    "★ featured",
    "leadership_header": "──── leadership ────",
    "field_name":     "name",
    "field_role":     "role",
    "field_location": "location",
    "field_email":    "email"
  },
  "data": {
    "bio": "I design and build thoughtful digital experiences with a focus on performance, accessibility, and craft. Currently open to senior frontend and creative technologist roles.",
    "projects": {
      "luminos":  "Generative light installation controlled via WebGL and MIDI",
      "inkflow":  "Real-time collaborative canvas for type and illustration",
      "sonance":  "Audio-reactive data visualisation built on the Web Audio API",
      "gridlang": "Experimental CSS grid layout debugger browser extension"
    },
    "leadership": {
      "ieee_chair":   { "title": "Branch Chairperson",   "description": "Led all executive operations of the IEEE uOttawa Student Branch, forged partnerships with the Faculty of Engineering, and grew active membership by 40% in one year." },
      "ieee_events":  { "title": "Events Director",       "description": "Planned and executed 20+ technical workshops, hackathons, and networking sessions with a consistent 80+ attendee turnout each semester." },
      "ieee_tech":    { "title": "Technical Lead",         "description": "Spearheaded the branch's open-source projects, including a campus-wide IoT sensor dashboard and a browser-based circuit simulation tool used by 300+ students." }
    }
  }
}
```

### `src/locales/fr/translation.json`

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos",
    "work": "Projets",
    "contact": "Contact"
  },
  "hero": {
    "name": "Alex Moreau",
    "greeting": "Bonjour, je suis",
    "role": "Développeur Créatif",
    "tagline": "Créer des interfaces où le code rencontre le soin.",
    "cta": "Voir mes projets",
    "contact_cta": "Me contacter",
    "scroll_hint": "Défiler pour explorer"
  },
  "sections": {
    "about": "À propos",
    "projects": "Projets",
    "leadership": "Leadership",
    "contact": "Contact"
  },
  "about": {
    "body": "Je conçois et développe des expériences numériques soignées, axées sur la performance, l'accessibilité et le soin du détail.",
    "pillar_1_title": "Performance",
    "pillar_1_body": "Obsédé par les Core Web Vitals, les pipelines de rendu et chaque milliseconde qui sépare l'utilisateur du plaisir.",
    "pillar_2_title": "Soin",
    "pillar_2_body": "Orienté détail, de la typographie système aux courbes de timing des micro-interactions.",
    "pillar_3_title": "Créativité",
    "pillar_3_body": "Repousser les limites avec l'art génératif, WebGL et des médias interactifs qui surprennent."
  },
  "projects": {
    "view": "Voir le projet",
    "featured": "Sélectionné"
  },
  "leadership": {
    "role_at": "chez"
  },
  "contact": {
    "heading": "Travaillons Ensemble",
    "body": "Vous avez un projet en tête ou souhaitez simplement dire bonjour ? J'adorerais avoir de vos nouvelles.",
    "email_cta": "Envoyer un e-mail",
    "email_label": "E-mail",
    "location_label": "Basé à"
  },
  "language": {
    "label": "Langue",
    "en": "English",
    "fr": "Français",
    "ar": "العربية"
  },
  "cli": {
    "welcome": "Portfolio CLI v1.0.0  —  tapez 'help' pour commencer.",
    "help_header": "Commandes disponibles :",
    "cmd_ls":      "Lister tous les projets du portfolio",
    "cmd_cat":     "Afficher la bio, le contact et la direction",
    "cmd_help":    "Afficher ce texte d'aide",
    "cmd_dark":    "Passer au thème sombre",
    "cmd_light":   "Passer au thème clair",
    "cmd_lang":    "Changer de langue : en | fr | ar",
    "cmd_clear":   "Effacer la sortie du terminal",
    "theme_set":   "Thème réglé sur {{mode}}.",
    "lang_set":    "LANG défini sur '{{lang}}'.",
    "lang_error":  "Locale '{{lang}}' non supportée. Supportées : {{supported}}.",
    "not_found":   "commande introuvable : {{cmd}}",
    "proj_label":  "projets/",
    "featured":    "★ sélectionné",
    "leadership_header": "──── direction ────",
    "field_name":     "nom",
    "field_role":     "rôle",
    "field_location": "lieu",
    "field_email":    "e-mail"
  },
  "data": {
    "bio": "Je conçois et développe des expériences numériques soignées, axées sur la performance, l'accessibilité et le soin du détail. Actuellement disponible pour des postes senior en développement frontend et technologie créative.",
    "projects": {
      "luminos":  "Installation lumineuse générative pilotée par WebGL et MIDI",
      "inkflow":  "Canevas collaboratif en temps réel pour la typographie et l'illustration",
      "sonance":  "Visualisation de données audio-réactive construite sur la Web Audio API",
      "gridlang": "Extension de navigateur expérimentale pour déboguer les mises en page CSS grid"
    },
    "leadership": {
      "ieee_chair":   { "title": "Président de la section",    "description": "Direction de l'ensemble des opérations exécutives de la section IEEE uOttawa, partenariats avec la Faculté de génie et croissance du membership de 40 % en un an." },
      "ieee_events":  { "title": "Directeur des événements",   "description": "Planification et organisation de plus de 20 ateliers techniques, hackathons et événements de réseautage avec un taux de participation moyen de 80+ personnes par semestre." },
      "ieee_tech":    { "title": "Responsable technique",      "description": "Pilotage des projets open-source de la section, dont un tableau de bord IoT à l'échelle du campus et un simulateur de circuits utilisé par plus de 300 étudiants." }
    }
  }
}
```

### `src/locales/ar/translation.json`

```json
{
  "nav": {
    "home": "الرئيسية",
    "about": "من أنا",
    "work": "أعمالي",
    "contact": "تواصل"
  },
  "hero": {
    "name": "Alex Moreau",
    "greeting": "مرحباً، أنا",
    "role": "مطوّر إبداعي",
    "tagline": "أصنع واجهات حيث يلتقي الكود بالإتقان.",
    "cta": "اطّلع على أعمالي",
    "contact_cta": "تواصل معي",
    "scroll_hint": "انتقل للاستكشاف"
  },
  "sections": {
    "about": "نبذة عني",
    "projects": "المشاريع",
    "leadership": "القيادة",
    "contact": "تواصل"
  },
  "about": {
    "body": "أصمّم وأبني تجارب رقمية مدروسة تركّز على الأداء وسهولة الوصول والاهتمام بالتفاصيل.",
    "pillar_1_title": "الأداء",
    "pillar_1_body": "مهووس بـ Core Web Vitals وخطوط أنابيب العرض وكل ميلي ثانية تفصل المستخدم عن تجربة مبهجة.",
    "pillar_2_title": "الإتقان",
    "pillar_2_body": "اهتمام بالتفاصيل من الطباعة الحرفية إلى منحنيات توقيت التفاعلات الدقيقة.",
    "pillar_3_title": "الإبداع",
    "pillar_3_body": "دفع الحدود بالفن التوليدي وWebGL والوسائط التفاعلية المدهشة."
  },
  "projects": {
    "view": "عرض المشروع",
    "featured": "مميّز"
  },
  "leadership": {
    "role_at": "في"
  },
  "contact": {
    "heading": "لنعمل معاً",
    "body": "هل لديك مشروع في ذهنك أو تريد فقط أن تقول مرحباً؟ يسعدني التواصل معك.",
    "email_cta": "إرسال بريد إلكتروني",
    "email_label": "البريد الإلكتروني",
    "location_label": "المقر"
  },
  "language": {
    "label": "اللغة",
    "en": "English",
    "fr": "Français",
    "ar": "العربية"
  },
  "cli": {
    "welcome": "Portfolio CLI v1.0.0  —  اكتب 'help' للبدء.",
    "help_header": "الأوامر المتاحة:",
    "cmd_ls":      "عرض جميع مشاريع الملف الشخصي",
    "cmd_cat":     "عرض النبذة ومعلومات التواصل والقيادة",
    "cmd_help":    "عرض هذا النص التوجيهي",
    "cmd_dark":    "التبديل إلى السمة الداكنة",
    "cmd_light":   "التبديل إلى السمة الفاتحة",
    "cmd_lang":    "تغيير اللغة: en | fr | ar",
    "cmd_clear":   "مسح مخرجات الطرفية",
    "theme_set":   "تم ضبط السمة على {{mode}}.",
    "lang_set":    "تم تعيين LANG على '{{lang}}'.",
    "lang_error":  "اللغة '{{lang}}' غير مدعومة. المدعومة: {{supported}}.",
    "not_found":   "الأمر غير موجود: {{cmd}}",
    "proj_label":  "المشاريع/",
    "featured":    "★ مميّز",
    "leadership_header": "──── القيادة ────",
    "field_name":     "الاسم",
    "field_role":     "الدور",
    "field_location": "الموقع",
    "field_email":    "البريد"
  },
  "data": {
    "bio": "أصمّم وأبني تجارب رقمية مدروسة تركّز على الأداء وسهولة الوصول والاهتمام بالتفاصيل. أبحث حالياً عن أدوار متقدمة في تطوير الواجهات الأمامية والتكنولوجيا الإبداعية.",
    "projects": {
      "luminos":  "تثبيت ضوئي توليدي يُتحكم به عبر WebGL وMIDI",
      "inkflow":  "لوحة تعاونية في الوقت الفعلي للطباعة والرسم التوضيحي",
      "sonance":  "تصوير بياني للبيانات يستجيب للصوت مبني على Web Audio API",
      "gridlang": "إضافة متصفح تجريبية لتصحيح تخطيطات CSS grid"
    },
    "leadership": {
      "ieee_chair":   { "title": "رئيس الفرع",          "description": "قيادة جميع العمليات التنفيذية لفرع IEEE الطلابي في uOttawa، وبناء شراكات مع كلية الهندسة، وتنمية العضوية النشطة بنسبة 40% في عام واحد." },
      "ieee_events":  { "title": "مدير الفعاليات",      "description": "تخطيط وتنفيذ أكثر من 20 ورشة عمل تقنية وهاكاثون وفعالية تواصل، مع معدل حضور ثابت يتجاوز 80 مشاركاً كل فصل دراسي." },
      "ieee_tech":    { "title": "المسؤول التقني",      "description": "قيادة مشاريع الفرع مفتوحة المصدر، بما في ذلك لوحة تحكم IoT على مستوى الحرم الجامعي ومحاكي دوائر عبر المتصفح يستخدمه أكثر من 300 طالب." }
    }
  }
}
```

---

## Step 9 — i18n setup (`src/i18n.js`)

Create `src/i18n.js`:

```js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/translation.json'
import fr from './locales/fr/translation.json'
import ar from './locales/ar/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
```

---

## Step 10 — Animation library (`src/lib/animations.js`)

Create `src/lib/animations.js`:

```js
// Shared Framer Motion variants used across all GUI sections.
// Sections use `section` as the trigger container; children use `fadeUp`.
// Nested stagger containers use `stagger`.

export const section = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}
```

---

## Step 11 — Context providers

### `src/context/LanguageProvider.jsx`

```jsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FONTS = {
  ar: "'Kufam', system-ui, sans-serif",
  default: "'Changa', system-ui, sans-serif",
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [locale, setLocale] = useState(i18n.language || 'en')

  const applyLocale = useCallback((lang) => {
    const html = document.documentElement
    const isRTL = lang === 'ar'
    const font = FONTS[lang] ?? FONTS.default

    html.setAttribute('lang', lang)
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    html.style.setProperty('--sans', font)
    html.style.setProperty('--heading', font)
  }, [])

  const changeLocale = useCallback(
    (lang) => {
      i18n.changeLanguage(lang)
      setLocale(lang)
      applyLocale(lang)
    },
    [i18n, applyLocale],
  )

  // Sync on mount in case i18n already has a non-default language
  useEffect(() => {
    applyLocale(i18n.language || 'en')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LanguageContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
```

### `src/context/ModeProvider.jsx`

```jsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ModeContext = createContext(null)

export function ModeProvider({ children }) {
  const [viewMode, setViewModeRaw] = useState(
    () => localStorage.getItem('viewMode') || 'gui',
  )

  const setViewMode = useCallback((mode) => {
    setViewModeRaw(mode)
    localStorage.setItem('viewMode', mode)
  }, [])

  const toggleMode = useCallback(() => {
    setViewModeRaw((m) => {
      const next = m === 'gui' ? 'cli' : 'gui'
      localStorage.setItem('viewMode', next)
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', viewMode)
  }, [viewMode])

  return (
    <ModeContext.Provider value={{ viewMode, setViewMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
```

### `src/context/ThemeProvider.jsx`

```jsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function readStored() {
  try {
    const v = localStorage.getItem('theme')
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStored() ?? getSystemTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    try { localStorage.setItem('theme', next) } catch {}
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('theme', next) } catch {}
      return next
    })
  }, [])

  // Mirror system changes only while the user has no stored manual preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (readStored()) return
      setThemeState(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

---

## Step 12 — Command parser hook (`src/hooks/useCommandParser.js`)

```js
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
            name:          p.name,
            year:          p.year,
            description:   t(`data.projects.${p.id}`),
            tech:          p.tech,
            featured:      p.featured,
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
```

---

## Step 13 — Canvas background (`src/components/CanvasBG.jsx`)

```jsx
import { useEffect, useRef } from 'react'

const ORBS = [
  { x: 0.15, y: 0.22, r: 0.55, sx: 0.07, sy: 0.05, speed: 0.00016, phase: 0.0 },
  { x: 0.82, y: 0.70, r: 0.48, sx: 0.06, sy: 0.08, speed: 0.00021, phase: 1.4 },
  { x: 0.48, y: 0.52, r: 0.38, sx: 0.04, sy: 0.06, speed: 0.00013, phase: 2.8 },
  { x: 0.88, y: 0.18, r: 0.30, sx: 0.05, sy: 0.04, speed: 0.00018, phase: 4.2 },
]

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function readAccentRgb() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  return raw.startsWith('#') ? hexToRgb(raw) : [170, 59, 255]
}

export default function CanvasBG() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0
    let accent = readAccentRgb()

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function draw() {
      t++
      const W = canvas.width
      const H = canvas.height
      const [r, g, b] = accent

      ctx.clearRect(0, 0, W, H)

      ORBS.forEach((o, i) => {
        const cx  = (o.x + Math.sin(t * o.speed + o.phase) * o.sx) * W
        const cy  = (o.y + Math.cos(t * o.speed * 0.73 + o.phase) * o.sy) * H
        const rad = o.r * Math.min(W, H)
        const alpha = i < 2 ? 0.14 : 0.08

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        grd.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`)
        grd.addColorStop(0.45, `rgba(${r},${g},${b},${(alpha * 0.35).toFixed(3)})`)
        grd.addColorStop(1,    `rgba(${r},${g},${b},0)`)

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    const observer = new MutationObserver(() => { accent = readAccentRgb() })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
```

---

## Step 14 — Theme toggle button (`src/components/ThemeToggle.jsx`)

```jsx
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeProvider'

function SunIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.88 }}
      className="p-1.5 rounded border border-[var(--border)] text-[var(--text)]
                 hover:border-[var(--accent)] hover:text-[var(--accent)]
                 transition-colors"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </motion.button>
  )
}
```

---

## Step 15 — CLI component (`src/components/CLI.jsx`)

```jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCommandParser } from '../hooks/useCommandParser'

function Cursor() {
  return (
    <motion.span
      aria-hidden
      className="inline-block align-middle bg-[var(--accent)]"
      style={{ width: '0.5ch', height: '1.1em', marginInlineStart: '1px' }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.55, repeat: Infinity, repeatType: 'mirror', ease: 'steps(1)' }}
    />
  )
}

function Typewriter({ text, delay = 0, speed = 22, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let tid, iid
    let i = 0
    setDisplayed('')
    setDone(false)

    tid = setTimeout(() => {
      iid = setInterval(() => {
        i += 1
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(iid)
          setDone(true)
          onDone?.()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(tid)
      clearInterval(iid)
    }
  }, [text, delay, speed])

  return (
    <p className="text-[var(--accent)] italic">
      {displayed}
      {!done && <Cursor />}
    </p>
  )
}

export function Result({ result }) {
  switch (result.type) {
    case 'welcome':
      return <p className="text-[var(--accent)] italic">{result.message}</p>

    case 'help':
      return (
        <div className="flex flex-col gap-1.5">
          <p className="text-[var(--text)] mb-1">{result.header}</p>
          {result.commands.map(({ cmd, description }) => (
            <div key={cmd} className="grid gap-x-6" style={{ gridTemplateColumns: '18ch 1fr' }}>
              <span className="text-[var(--accent)] truncate">{cmd}</span>
              <span className="text-[var(--text)]">{description}</span>
            </div>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--accent)]">{result.label}</p>
          {result.items.map((item) => (
            <div key={item.name} className="ps-3 border-s-2 border-[var(--border)] flex flex-col gap-0.5">
              <p className="text-[var(--text-h)]">
                {item.name}
                {item.featuredLabel && (
                  <span className="ms-2 text-xs text-[var(--accent)] opacity-70">{item.featuredLabel}</span>
                )}
                <span className="ms-2 text-[var(--text)] opacity-50 text-xs">{item.year}</span>
              </p>
              <p className="text-[var(--text)] text-sm">{item.description}</p>
              <p className="text-xs opacity-60 text-[var(--accent)]">{item.tech.join('  ·  ')}</p>
            </div>
          ))}
        </div>
      )

    case 'file':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[var(--accent)]">──── {result.filename} ────</p>
          <div className="flex flex-col gap-1 text-sm">
            {result.fields.map(([key, val]) => (
              <p key={key}>
                <span className="text-[var(--text-h)] inline-block w-24">{key}</span>
                <span className="text-[var(--text)] opacity-40 mx-1">=</span>
                <span className="text-[var(--text)]">{val}</span>
              </p>
            ))}
          </div>
          <p className="text-[var(--text)] text-sm leading-relaxed">{result.bio}</p>
          <p className="text-[var(--accent)] mt-1">{result.leadershipHeader}</p>
          {result.leadership.map((l) => (
            <div key={l.id} className="ps-3 border-s-2 border-[var(--border)] flex flex-col gap-0.5">
              <p className="text-[var(--text-h)] text-sm">
                {l.title}
                <span className="text-[var(--text)] opacity-50"> @ {l.org}</span>
                <span className="text-[var(--text)] opacity-40 text-xs ms-2">{l.period}</span>
              </p>
              <p className="text-[var(--text)] text-sm">{l.description}</p>
            </div>
          ))}
        </div>
      )

    case 'success':
      return <p className="text-emerald-400">{result.message}</p>

    case 'error':
      return <p className="text-red-400">{result.message}</p>

    default:
      return null
  }
}

export default function CLI() {
  const { parse, history } = useCommandParser()
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [introDone, setIntroDone] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (introDone) inputRef.current?.focus()
  }, [introDone])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    setCmdHistory((h) => [input, ...h])
    setHistoryIdx(-1)
    parse(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  const welcomeEntry = history[0]?.result?.type === 'welcome' ? history[0] : null
  const postWelcome  = welcomeEntry ? history.slice(1) : history

  return (
    <div
      dir="ltr"
      className="flex-1 flex flex-col w-full font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-2 pe-1">
        {welcomeEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <Typewriter
              text={welcomeEntry.result.message}
              delay={400}
              onDone={() => setIntroDone(true)}
            />
          </motion.div>
        )}

        {introDone && postWelcome.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5"
          >
            {entry.input !== null && (
              <p className="flex gap-2 text-[var(--text-h)]">
                <span className="text-[var(--accent)] select-none">~$</span>
                {entry.input}
              </p>
            )}
            <div className="ps-5">
              <Result result={entry.result} />
            </div>
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>

      <AnimatePresence>
        {introDone && (
          <motion.form
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[var(--border)] pt-3 mt-3 shrink-0"
          >
            <span className="text-[var(--accent)] select-none shrink-0">~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
              className="flex-1 bg-transparent outline-none text-[var(--text-h)] caret-[var(--accent)]
                         placeholder:text-[var(--text)] placeholder:opacity-40"
              placeholder="type a command…"
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

## Step 16 — GUI sections

### `src/components/sections/About.jsx`

```jsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, section, stagger } from '../../lib/animations'

const PILLARS = ['1', '2', '3']

export default function About() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="about"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14 border-t border-[var(--border)]"
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
      <p className="font-mono text-xs text-[var(--accent)] opacity-60 mb-1">{index}</p>
      <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-h)]">{label}</h2>
      <div className="mt-3 w-10 h-0.5 bg-[var(--accent)]" />
    </div>
  )
}
```

### `src/components/sections/Hero.jsx`

```jsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageProvider'

const LOCALES = ['en', 'fr', 'ar']

const item = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

export default function Hero() {
  const { t } = useTranslation()
  const { locale, changeLocale } = useLanguage()

  return (
    <section
      id="home"
      className="relative min-h-svh flex flex-col items-center justify-center
                 text-center px-6 py-20"
    >
      <nav
        className="absolute top-6 flex gap-2 flex-wrap justify-center"
        aria-label={t('language.label')}
      >
        {LOCALES.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLocale(lang)}
            aria-pressed={locale === lang}
            className={[
              'px-4 py-1 rounded-full text-sm font-medium border transition-colors',
              locale === lang
                ? 'bg-[var(--accent)] text-white border-transparent'
                : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]',
            ].join(' ')}
          >
            {t(`language.${lang}`)}
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-5 max-w-3xl">
        <motion.p
          {...item(0.05)}
          className="font-mono text-sm text-[var(--accent)] tracking-widest uppercase"
        >
          {t('hero.greeting')}
        </motion.p>

        <motion.h1
          {...item(0.15)}
          className="text-5xl sm:text-7xl md:text-8xl font-semibold
                     text-[var(--text-h)] leading-none tracking-tight"
        >
          {t('hero.name')}
        </motion.h1>

        <motion.p
          {...item(0.25)}
          className="text-xl sm:text-2xl text-[var(--accent)] font-medium"
        >
          {t('hero.role')}
        </motion.p>

        <motion.p
          {...item(0.35)}
          className="text-[var(--text)] text-base sm:text-lg max-w-md leading-relaxed"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div {...item(0.45)} className="flex gap-3 mt-2 flex-wrap justify-center">
          <a
            href="#work"
            className="px-6 py-2.5 rounded-full bg-[var(--accent)] text-white
                       font-medium hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full border border-[var(--border)]
                       text-[var(--text)] font-medium
                       hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-colors"
          >
            {t('hero.contact_cta')}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 flex flex-col items-center gap-1.5
                   text-xs text-[var(--text)] opacity-40 select-none"
      >
        <span>{t('hero.scroll_hint')}</span>
        <span className="text-base leading-none">↓</span>
      </motion.div>
    </section>
  )
}
```

### `src/components/sections/Projects.jsx`

```jsx
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

      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border)]">
        <span className="text-[var(--text)] opacity-50 font-mono">{project.year}</span>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] font-medium hover:opacity-70 transition-opacity"
        >
          {t('projects.view')} <span aria-hidden className="rtl-flip">→</span>
        </a>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="work"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14 border-t border-[var(--border)]"
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
```

### `src/components/sections/Leadership.jsx`

```jsx
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
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="03" label={t('sections.leadership')} />
      </motion.div>

      <motion.div className="mt-10 flex flex-col gap-8" variants={stagger}>
        {portfolio.leadership.map((role) => (
          <LeadershipCard key={role.id} role={role} />
        ))}
      </motion.div>
    </motion.section>
  )
}
```

### `src/components/sections/Contact.jsx`

```jsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import portfolio from '../../data/portfolio.json'
import { fadeUp, section } from '../../lib/animations'
import { SectionHeading } from './About'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <motion.section
      id="contact"
      className="py-24 md:py-32 px-6 md:px-10 lg:px-14 border-t border-[var(--border)]"
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div variants={fadeUp}>
        <SectionHeading index="04" label={t('sections.contact')} />
      </motion.div>

      <div className="mt-8 max-w-xl flex flex-col gap-6">
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

        <motion.dl variants={fadeUp} className="flex flex-col gap-1.5 text-sm">
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

      <motion.p
        variants={fadeUp}
        className="mt-20 text-xs text-[var(--text)] opacity-30 font-mono"
      >
        {t('hero.name')} · {new Date().getFullYear()}
      </motion.p>
    </motion.section>
  )
}
```

---

## Step 17 — GuiPane and RootLayout

### `src/components/GuiPane.jsx`

```jsx
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Leadership from './sections/Leadership'
import Contact from './sections/Contact'

export default function GuiPane() {
  return (
    <div className="flex-1 flex flex-col">
      <Hero />
      <About />
      <Projects />
      <Leadership />
      <Contact />
    </div>
  )
}
```

### `src/components/RootLayout.jsx`

```jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useMode } from '../context/ModeProvider'
import CanvasBG from './CanvasBG'
import GuiPane from './GuiPane'
import CLI from './CLI'
import ThemeToggle from './ThemeToggle'

const glitch = {
  initial: {
    opacity: 0,
    clipPath: 'inset(46% 0% 46% 0%)',
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'blur(0px)',
    transition: {
      clipPath: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
      opacity:  { duration: 0.35 },
      filter:   { duration: 0.32 },
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(46% 0% 46% 0%)',
    filter: 'blur(8px)',
    transition: {
      clipPath: { duration: 0.24, ease: [0.4, 0, 1, 1] },
      opacity:  { duration: 0.26 },
      filter:   { duration: 0.2 },
    },
  },
}

export default function RootLayout() {
  const { viewMode, toggleMode } = useMode()
  const isCLI = viewMode === 'cli'

  return (
    <>
      <CanvasBG />

      <div
        className="relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto
                   border-s border-e border-[var(--border)]"
      >
        <div
          className="sticky top-0 z-20 flex items-center justify-end gap-2 pe-4 py-3 shrink-0
                     bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]/40"
        >
          {!isCLI && <ThemeToggle />}
          <button
            onClick={toggleMode}
            aria-label={isCLI ? 'Switch to GUI' : 'Switch to CLI'}
            className="px-3 py-1.5 rounded font-mono text-xs
                       border border-[var(--border)] text-[var(--text)]
                       hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-colors"
          >
            <span dir="ltr">{isCLI ? '⊞ GUI' : '> CLI'}</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isCLI ? (
            <motion.div
              key="cli"
              {...glitch}
              className="flex-1 flex flex-col ps-6 pe-8 pb-8 md:ps-10 md:pe-12"
            >
              <CLI />
            </motion.div>
          ) : (
            <motion.div
              key="gui"
              {...glitch}
              className="flex-1 flex flex-col"
            >
              <GuiPane />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
```

---

## Step 18 — App entry point

### `src/App.jsx`

```jsx
import RootLayout from './components/RootLayout'

export default function App() {
  return <RootLayout />
}
```

### `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import { LanguageProvider } from './context/LanguageProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { ModeProvider } from './context/ModeProvider'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <ModeProvider>
          <App />
        </ModeProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
```

> **Import order matters:** `./i18n` must be imported before `./index.css` and before any component that calls `useTranslation()`.

---

## Step 19 — Delete Vite scaffold files

The default Vite template creates files you no longer need:

```bash
rm src/App.css        # (or leave — it is not imported anywhere)
rm src/assets/react.svg
```

`src/index.css` was already replaced in Step 5.

---

## Step 20 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## RTL Checklist

When adding new content, follow these rules to keep Arabic RTL support correct:

| Instead of | Use |
|---|---|
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `border-left` / `border-right` (CSS) | `border-inline-start` / `border-inline-end` |
| `border-l-*` / `border-r-*` | `border-s-*` / `border-e-*` |
| `left-0` / `right-0` (positioning) | `start-0` / `end-0` |
| Hardcoded `→` arrow | Wrap in `<span className="rtl-flip">→</span>` |
| Technical strings in RTL context (`> CLI`) | Wrap in `<span dir="ltr">` |

`px-*` and `mx-*` are fine — Tailwind v4 maps them to `padding-inline` / `margin-inline` (symmetric, logical).

The terminal (`CLI.jsx`) always has `dir="ltr"` — do not remove this.

---

## Adding a new section

1. Create `src/components/sections/MySection.jsx`
2. Import `{ fadeUp, section, stagger }` from `../../lib/animations`
3. Use `variants={section} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}` on the root `motion.section`
4. Wrap the `<SectionHeading>` call in `<motion.div variants={fadeUp}>`
5. Add text/data content with `variants={fadeUp}`
6. Use a `motion.div variants={stagger}` container for any card/list grid
7. Give each card/list item `variants={fadeUp}` (no `initial`/`whileInView` — they inherit from the stagger container)
8. Add the section to `GuiPane.jsx`

## Adding a new CLI command

1. Add translation keys to all three locale files (`cli.cmd_mycommand` for help, and whatever output strings are needed)
2. Add a new `else if` branch in the `parse` callback in `useCommandParser.js`
3. Add a new `case` in the `Result` switch in `CLI.jsx` if the output shape is new
4. Add the command to the `help` result's `commands` array
