import { CARDS, LANGUAGES, LANG_COUNTS } from '../cards.js'

const KEYS = {
  seenCards: 'seenCards',
  score: 'score',
  streak: 'streak',
  bestStreak: 'bestStreak',
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function getSeenCards() {
  return readJSON(KEYS.seenCards, [])
}

export function markSeen(key) {
  const seen = getSeenCards()
  if (!seen.includes(key)) {
    writeJSON(KEYS.seenCards, [...seen, key])
  }
}

export function getScore() {
  return readJSON(KEYS.score, 0)
}

export function setScore(value) {
  writeJSON(KEYS.score, value)
}

export function getStreak() {
  return readJSON(KEYS.streak, 0)
}

export function setStreak(value) {
  writeJSON(KEYS.streak, value)
}

export function getBestStreak() {
  return readJSON(KEYS.bestStreak, 0)
}

export function setBestStreak(value) {
  writeJSON(KEYS.bestStreak, value)
}

function allCardKeys(language) {
  if (language) {
    const count = LANG_COUNTS[language] || 0
    return Array.from({ length: count }, (_, i) => `${language}/${i + 1}`)
  }
  const keys = []
  for (const lang of LANGUAGES) {
    const count = LANG_COUNTS[lang] || 0
    for (let i = 1; i <= count; i++) {
      keys.push(`${lang}/${i}`)
    }
  }
  return keys
}

export function pickNextCardKey(language) {
  const all = allCardKeys(language)
  const seen = getSeenCards()
  let unseen = all.filter((k) => !seen.includes(k))

  if (unseen.length === 0) {
    writeJSON(KEYS.seenCards, [])
    unseen = all
  }

  return unseen[Math.floor(Math.random() * unseen.length)]
}

export function getCardKeyFromUrl() {
  const raw = window.location.hash.replace('#', '')
  if (!raw) return null
  if (!CARDS[raw]) return null
  return raw
}

export function buildShareUrl(key) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = '#' + key
  return url.toString()
}
