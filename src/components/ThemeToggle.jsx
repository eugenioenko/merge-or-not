import { useEffect, useState } from 'react'

const MODES = ['system', 'light', 'dark']

function getStored() {
  try {
    const v = localStorage.getItem('theme')
    if (MODES.includes(v)) return v
  } catch {}
  return 'system'
}

function applyTheme(mode) {
  const root = document.documentElement
  if (mode === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(getStored)

  useEffect(() => {
    applyTheme(mode)
    try {
      localStorage.setItem('theme', mode)
    } catch {}
  }, [mode])

  return (
    <div className="flex h-7 items-center gap-px rounded-none border border-[var(--border)] bg-[var(--toggle-bg)] p-0.5">
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={`flex h-6 items-center px-2 text-[11px] transition-colors ${
            mode === m
              ? 'bg-[var(--toggle-active)] font-medium text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {m === 'system' ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14.5 13.5h-13A.5.5 0 0 1 1 13V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a.5.5 0 0 1-.5.5ZM2.5 12h11V4.5h-11V12Z" />
            </svg>
          ) : m === 'light' ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-1.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.06l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z" />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}
