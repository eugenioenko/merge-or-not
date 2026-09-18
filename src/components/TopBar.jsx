import { LANGUAGE_LABELS } from '../cards.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function TopBar({ score, streak, language, languages, onLanguageChange }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-4">
          <svg className="h-5 w-5 text-[var(--text-primary)]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.25 4a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
          </svg>
          <span className="text-sm text-[var(--text-primary)]">Merge or Not?</span>
          <select
            value={language || ''}
            onChange={(e) => onLanguageChange(e.target.value || null)}
            className="rounded-sm border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none"
          >
            <option value="">All</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang] || lang}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 pr-2 text-xs">
          <span className="text-[var(--text-secondary)]">
            Score: <span className="font-semibold text-[var(--text-primary)]">{score}</span>
          </span>
          <span className="text-[var(--text-secondary)]">
            Streak: <span className="font-semibold text-[var(--text-primary)]">{streak}</span>
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
