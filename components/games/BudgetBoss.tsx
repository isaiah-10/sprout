'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  onComplete: (score: number, seeds: number) => void
  childAge: number
}

type Category = 'need' | 'want' | 'save' | 'invest'

interface Expense { id: number; name: string; emoji: string; amount: number; correct: Category; hint: string }

const EXPENSES: Expense[] = [
  { id: 1,  name: 'Rent / Mortgage',   emoji: '🏠', amount: 1200, correct: 'need',   hint: 'You need a place to live!' },
  { id: 2,  name: 'Netflix',           emoji: '🎬', amount: 15,   correct: 'want',   hint: 'Fun, but not necessary to survive' },
  { id: 3,  name: 'Groceries',         emoji: '🛒', amount: 300,  correct: 'need',   hint: 'Food is a basic necessity' },
  { id: 4,  name: 'New Air Jordans',   emoji: '👟', amount: 180,  correct: 'want',   hint: 'Cool, but your old shoes still work!' },
  { id: 5,  name: 'Emergency Fund',    emoji: '🏦', amount: 200,  correct: 'save',   hint: 'Always save for unexpected events' },
  { id: 6,  name: 'Electricity Bill',  emoji: '💡', amount: 90,   correct: 'need',   hint: 'Utilities keep your home running' },
  { id: 7,  name: 'Apple Stock',       emoji: '🍎', amount: 150,  correct: 'invest', hint: 'Investing makes your money grow!' },
  { id: 8,  name: 'Video Games',       emoji: '🎮', amount: 60,   correct: 'want',   hint: 'Entertainment — a want, not a need' },
  { id: 9,  name: 'Doctor Visit',      emoji: '🏥', amount: 40,   correct: 'need',   hint: 'Healthcare is a basic need' },
  { id: 10, name: 'Index Fund',        emoji: '📊', amount: 100,  correct: 'invest', hint: 'Smart investors put money to work' },
]

const CATEGORIES: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: 'need',   label: 'Need',    emoji: '✅', color: 'bg-blue-100  border-blue-300  text-blue-700' },
  { key: 'want',   label: 'Want',    emoji: '🛍️', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { key: 'save',   label: 'Save',    emoji: '🐷', color: 'bg-green-100 border-green-300  text-green-700' },
  { key: 'invest', label: 'Invest',  emoji: '📈', color: 'bg-purple-100 border-purple-300 text-purple-700' },
]

export default function BudgetBoss({ onComplete, childAge }: Props) {
  const count = childAge < 10 ? 5 : 8
  const [questions]       = useState(() => EXPENSES.sort(() => Math.random() - 0.5).slice(0, count))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore]           = useState(0)
  const [feedback, setFeedback]     = useState<{ correct: boolean; hint: string } | null>(null)
  const [gameState, setGameState]   = useState<'idle' | 'playing' | 'done'>('idle')
  const [answered, setAnswered]     = useState(false)

  const current = questions[currentIdx]

  function answer(cat: Category) {
    if (answered) return
    const correct = cat === current.correct
    setAnswered(true)
    setFeedback({ correct, hint: current.hint })
    if (correct) setScore(s => s + 10)
    setTimeout(() => {
      setFeedback(null)
      setAnswered(false)
      if (currentIdx + 1 >= questions.length) {
        setGameState('done')
        const total = correct ? score + 10 : score
        onComplete(total, Math.floor(total * 0.6))
      } else {
        setCurrentIdx(i => i + 1)
      }
    }, 1800)
  }

  const progress = ((currentIdx) / questions.length) * 100

  return (
    <div className="max-w-md mx-auto">
      {gameState === 'idle' && (
        <div className="text-center">
          <div className="text-5xl mb-3">💼</div>
          <h3 className="font-black text-xl text-bark-600 mb-2">Budget Boss</h3>
          <p className="text-bark-400 text-sm mb-4">Sort each expense into the right category: <strong>Need</strong>, <strong>Want</strong>, <strong>Save</strong>, or <strong>Invest</strong>.</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {CATEGORIES.map(c => (
              <div key={c.key} className={`rounded-xl p-3 border text-sm font-semibold ${c.color}`}>
                {c.emoji} {c.label}
              </div>
            ))}
          </div>
          <Button size="lg" onClick={() => setGameState('playing')}>Let&apos;s Go!</Button>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <ProgressBar value={progress} color="green" size="md" className="mb-5" label={`${currentIdx + 1} / ${questions.length}`} showPct />

          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white border-2 border-bark-200 rounded-2xl p-6 text-center mb-5">
              <div className="text-5xl mb-3">{current.emoji}</div>
              <h3 className="font-black text-lg text-bark-600 mb-1">{current.name}</h3>
              <p className="text-2xl font-black text-sprout-700">${current.amount}/mo</p>
            </motion.div>
          </AnimatePresence>

          {feedback && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className={`text-center rounded-2xl p-4 mb-4 font-bold text-sm ${feedback.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {feedback.correct ? '✅ Correct!' : '❌ Not quite!'} {feedback.hint}
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => answer(c.key)} disabled={answered}
                className={`border-2 rounded-2xl p-4 text-sm font-bold transition-all ${c.color} hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="text-2xl mb-1">{c.emoji}</div>
                {c.label}
              </button>
            ))}
          </div>

          <p className="text-center text-sm font-bold text-sprout-600 mt-4">Score: {score}</p>
        </div>
      )}

      {gameState === 'done' && (
        <div className="text-center py-4">
          <div className="text-5xl mb-3">{score >= questions.length * 7 ? '🏆' : score >= questions.length * 4 ? '👍' : '📚'}</div>
          <h3 className="font-black text-2xl text-bark-600 mb-1">Score: {score} / {questions.length * 10}</h3>
          <p className="text-sprout-600 font-bold mb-1">+{Math.floor(score * 0.6)} Seeds earned!</p>
          <p className="text-bark-400 text-sm mb-5">{score >= questions.length * 8 ? 'Amazing! You\'re a Budget Boss!' : 'Keep practicing — budgeting takes time!'}</p>
          <Button onClick={() => { setCurrentIdx(0); setScore(0); setGameState('playing') }} variant="secondary">Play Again</Button>
        </div>
      )}
    </div>
  )
}
