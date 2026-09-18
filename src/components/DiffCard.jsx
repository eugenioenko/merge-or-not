import { useEffect, useState } from 'react'
import { Diff, Hunk, parseDiff, tokenize } from 'react-diff-view'
import { LANGUAGE_LABELS } from '../cards.js'
import refractor from 'refractor/core.js'
import jsx from 'refractor/lang/jsx.js'
import typescript from 'refractor/lang/typescript.js'
import markup from 'refractor/lang/markup.js'
import go from 'refractor/lang/go.js'
import javascript from 'refractor/lang/javascript.js'
import python from 'refractor/lang/python.js'
import csharp from 'refractor/lang/csharp.js'
import graphql from 'refractor/lang/graphql.js'
import json from 'refractor/lang/json.js'
import yaml from 'refractor/lang/yaml.js'

for (const lang of [jsx, typescript, markup, go, javascript, python, csharp, graphql, json, yaml]) {
  refractor.register(lang)
}


const LANGUAGE_COLORS = {
  react: '#61dafb',
  vue: '#42b883',
  angular: '#dd0031',
  go: '#00add8',
  node: '#68a063',
  python: '#3776ab',
  csharp: '#9b4993',
  graphql: '#e10098',
  rest: '#f5a623',
  auth: '#f5a623',
  ci: '#2088ff',
}

const REFRACTOR_ALIASES = {
  react: 'jsx',
  vue: 'markup',
  angular: 'typescript',
  go: 'go',
  node: 'javascript',
  python: 'python',
  csharp: 'csharp',
  graphql: 'graphql',
  rest: 'json',
  auth: 'javascript',
  ci: 'yaml',
}

export default function DiffCard({ id, context, language }) {
  const [diffText, setDiffText] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setDiffText(null)
    setError(null)

    fetch(`${import.meta.env.BASE_URL}diffs/${language}/${id}.diff`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load card ${id}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setDiffText(text)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [id, language])

  const files = diffText ? parseDiff(diffText) : []
  const refractorLanguage = REFRACTOR_ALIASES[language] || 'javascript'
  const filePath = files.length > 0 ? files[0].newPath : ''
  const langColor = LANGUAGE_COLORS[language] || '#656d76'

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5">
      <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="flex items-start gap-3 border-b border-[var(--border)] px-4 py-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[var(--text-primary)]">Review this change</span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2 py-px text-xs font-medium"
                style={{ color: langColor, borderColor: langColor + '44' }}
              >
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
                {LANGUAGE_LABELS[language] || language}
              </span>
            </div>
            {context ? (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-primary)]">{context}</p>
            ) : null}
          </div>
        </div>

        {filePath ? (
          <div className="flex items-center border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5">
            <svg className="mr-2 h-3.5 w-3.5 text-[var(--text-tertiary)]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
            </svg>
            <span className="font-mono text-xs text-[var(--text-secondary)]">{filePath}</span>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          {error ? (
            <p className="p-4 text-sm text-[var(--accent-red)]">{error}</p>
          ) : !diffText ? (
            <p className="p-4 text-sm text-[var(--text-tertiary)]">Loading...</p>
          ) : (
            files.map((file) => (
              <Diff
                key={file.oldRevision + '-' + file.newRevision}
                viewType="split"
                diffType={file.type}
                hunks={file.hunks}
                tokens={tokenizeHunks(file.hunks, refractorLanguage)}
              >
                {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
              </Diff>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function tokenizeHunks(hunks, language) {
  try {
    return tokenize(hunks, {
      highlight: true,
      refractor,
      language,
    })
  } catch {
    return undefined
  }
}
