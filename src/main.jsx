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
