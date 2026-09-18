import { useState } from 'react'
import { buildShareUrl } from '../lib/cards.js'

export default function Reveal({ id, correct, explanation, onNext }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = buildShareUrl(id)
    const text = `Can you call this diff — Merge or Reject? ${url}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Merge or Not?', text, url })
        return
      } catch {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-6">
      <div
        className={`rounded-sm border p-4 ${
          correct
            ? 'border-[var(--correct-border)] bg-[var(--correct-bg)]'
            : 'border-[var(--wrong-border)] bg-[var(--wrong-bg)]'
        }`}
      >
        <div className="flex items-center gap-2">
          {correct ? (
            <svg className="h-5 w-5 text-[var(--accent-green)]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-[var(--accent-red)]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          )}
          <span className={`text-sm font-semibold ${correct ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
            {correct ? 'Correct' : 'Incorrect'}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{explanation}</p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onNext}
            className="rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)] active:scale-[0.98]"
          >
            Next
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] active:scale-[0.98]"
          >
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
