import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, resolve } from 'path'

function cardsPlugin() {
  const virtualId = 'virtual:cards'
  const resolvedId = '\0' + virtualId

  return {
    name: 'cards-plugin',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      const diffsDir = resolve(__dirname, 'public/diffs')
      const cards = {}
      const langCounts = {}
      const dirs = readdirSync(diffsDir).filter(f => {
        try { return statSync(join(diffsDir, f)).isDirectory() } catch { return false }
      })
      for (const lang of dirs) {
        const langDir = join(diffsDir, lang)
        const jsonFiles = readdirSync(langDir).filter(f => f.endsWith('.json'))
        langCounts[lang] = jsonFiles.length
        for (const file of jsonFiles) {
          const card = JSON.parse(readFileSync(join(langDir, file), 'utf-8'))
          const key = `${lang}/${card.id}`
          cards[key] = card
        }
      }
      const languages = Object.keys(langCounts).sort()
      return [
        `export const CARDS = ${JSON.stringify(cards)};`,
        `export const CARD_COUNT = ${Object.keys(cards).length};`,
        `export const LANG_COUNTS = ${JSON.stringify(langCounts)};`,
        `export const LANGUAGES = ${JSON.stringify(languages)};`,
      ].join('\n')
    },
  }
}

export default defineConfig({
  base: '/merge-or-not/',
  plugins: [react(), cardsPlugin()],
})
