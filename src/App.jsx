import { useEffect, useState } from 'react'
import { CARDS, LANGUAGES } from './cards.js'
import {
  getBestStreak,
  getCardKeyFromUrl,
  getScore,
  getStreak,
  markSeen,
  pickNextCardKey,
  setBestStreak,
  setScore,
  setStreak,
} from './lib/cards.js'
import TopBar from './components/TopBar.jsx'
import DiffCard from './components/DiffCard.jsx'
import ActionButtons from './components/ActionButtons.jsx'
import Reveal from './components/Reveal.jsx'

export default function App() {
  const [language, setLanguage] = useState(null)
  const [cardKey, setCardKey] = useState(() => getCardKeyFromUrl() || pickNextCardKey())
  const [choice, setChoice] = useState(null)
  const [score, setScoreState] = useState(() => getScore())
  const [streak, setStreakState] = useState(() => getStreak())

  useEffect(() => {
    markSeen(cardKey)
    window.location.hash = '#' + cardKey
  }, [cardKey])

  const card = CARDS[cardKey]
  const answered = choice !== null
  const correct = answered && choice === card.answer

  function handleChoose(value) {
    if (answered) return
    setChoice(value)

    const isCorrect = value === card.answer
    const nextScore = isCorrect ? score + 1 : score
    const nextStreak = isCorrect ? streak + 1 : 0

    setScoreState(nextScore)
    setStreakState(nextStreak)
    setScore(nextScore)
    setStreak(nextStreak)

    if (nextStreak > getBestStreak()) {
      setBestStreak(nextStreak)
    }
  }

  function handleNext() {
    const next = pickNextCardKey(language)
    setChoice(null)
    setCardKey(next)
  }

  function handleLanguageChange(lang) {
    setLanguage(lang)
    const next = pickNextCardKey(lang)
    setChoice(null)
    setCardKey(next)
  }

  return (
    <div className="min-h-screen pb-8">
      <TopBar score={score} streak={streak} language={language} languages={LANGUAGES} onLanguageChange={handleLanguageChange} />

      <main className="pt-6">
        <DiffCard id={card.id} context={card.context} language={card.language} />
        <ActionButtons disabled={answered} onChoose={handleChoose} />

        {answered ? (
          <Reveal cardKey={cardKey} correct={correct} explanation={card.explanation} onNext={handleNext} />
        ) : null}
      </main>
    </div>
  )
}
