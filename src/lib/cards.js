import { CARD_COUNT } from '../cards.js'

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

export function markSeen(id) {
  const seen = getSeenCards()
  if (!seen.includes(id)) {
    writeJSON(KEYS.seenCards, [...seen, id])
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

export function pickNextCardId() {
  const allIds = Array.from({ length: CARD_COUNT }, (_, i) => i + 1)
  const seen = getSeenCards()
  let unseen = allIds.filter((id) => !seen.includes(id))

  if (unseen.length === 0) {
    writeJSON(KEYS.seenCards, [])
    unseen = allIds
  }

  return unseen[Math.floor(Math.random() * unseen.length)]
}

export function getCardIdFromUrl() {
  const raw = window.location.hash.replace('#', '')
  if (!raw) return null
  const id = Number(raw)
  if (!Number.isInteger(id) || id < 1 || id > CARD_COUNT) return null
  return id
}

export function buildShareUrl(id) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = '#' + id
  return url.toString()
}
