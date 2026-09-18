import { useEffect, useState } from 'react'
import { CARDS } from './cards.js'
import {
  getBestStreak,
  getCardIdFromUrl,
  getScore,
  getStreak,
  markSeen,
  pickNextCardId,
  setBestStreak,
  setScore,
  setStreak,
} from './lib/cards.js'
import TopBar from './components/TopBar.jsx'
import DiffCard from './components/DiffCard.jsx'
import ActionButtons from './components/ActionButtons.jsx'
import Reveal from './components/Reveal.jsx'

export default function App() {
  const [cardId, setCardId] = useState(() => getCardIdFromUrl() || pickNextCardId())
  const [choice, setChoice] = useState(null)
  const [score, setScoreState] = useState(() => getScore())
  const [streak, setStreakState] = useState(() => getStreak())

  useEffect(() => {
    markSeen(cardId)
    window.location.hash = '#' + cardId
  }, [cardId])

  const card = CARDS[cardId]
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
    const nextId = pickNextCardId()
    window.location.hash = '#' + nextId

    setChoice(null)
    setCardId(nextId)
  }

  return (
    <div className="min-h-screen pb-8">
      <TopBar score={score} streak={streak} />

      <main className="pt-6">
        <DiffCard id={card.id} context={card.context} language={card.language} />
        <ActionButtons disabled={answered} onChoose={handleChoose} />

        {answered ? (
          <Reveal id={card.id} correct={correct} explanation={card.explanation} onNext={handleNext} />
        ) : null}
      </main>
    </div>
  )
}
