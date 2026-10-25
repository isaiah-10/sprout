'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { onComplete: (score: number, seeds: number) => void }

const ITEMS = [
  { name: 'Water',           emoji: '💧', type: 'need',  reason: 'You need water to survive!' },
  { name: 'Designer Bag',    emoji: '👜', type: 'want',  reason: 'It\'s nice, but not necessary.' },
  { name: 'Food',            emoji: '🍕', type: 'need',  reason: 'Food keeps you alive and healthy.' },
  { name: 'Video Game',      emoji: '🎮', type: 'want',  reason: 'Fun — but a want, not a need.' },
  { name: 'Medicine',        emoji: '💊', type: 'need',  reason: 'Health is a basic need.' },
  { name: 'Movie Ticket',    emoji: '🎟️', type: 'want',  reason: 'Entertainment is optional.' },
  { name: 'Shoes',           emoji: '👟', type: 'need',  reason: 'Shoes protect your feet — a basic need.' },
  { name: 'Luxury Sneakers', emoji: '🏅', type: 'want',  reason: 'A second pair of fancy shoes is a want.' },
  { name: 'Electricity',     emoji: '💡', type: 'need',  reason: 'Modern living requires power.' },
  { name: 'Streaming App',   emoji: '📺', type: 'want',  reason: 'Entertainment you could live without.' },
  { name: 'School Supplies', emoji: '✏️', type: 'need',  reason: 'Education is a basic need.' },
  { name: 'Candy',           emoji: '🍭', type: 'want',  reason: 'A treat, not a requirement.' },
]

export default function NeedsVsWants({ onComplete }: Props) {
  const [items]           = useState(() => [...ITEMS].sort(() => Math.random() - 0.5))
  const [idx, setIdx]     = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<{ ok: boolean; reason: string } | null>(null)
  const [done, setDone]   = useState(false)

  const current = items[idx]

  function choose(type: 'need' | 'want') {
    if (feedback) return
    const ok = type === current.type
    setFeedback({ ok, reason: current.reason })
    if (ok) setScore(s => s + 10)
    setTimeout(() => {
      setFeedback(null)
      if (idx + 1 >= items.length) {
        setDone(true)
        onComplete(score + (ok ? 10 : 0), Math.floor((score + (ok ? 10 : 0)) * 0.5))
      } else {
        setIdx(i => i + 1)
      }
    }, 1600)
  }

  if (done) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-3">🎓</div>
      <h3 className="font-black text-2xl text-bark-600 mb-1">Score: {score} / {items.length * 10}</h3>
      <p className="text-sprout-600 font-bold mb-4">Practice score: {score} points · Fictional reward: {Math.floor(score * 0.5)} Seeds</p>
      <p className="text-bark-400 text-sm">Understanding needs vs wants is the first step to great budgeting!</p>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-xs font-bold text-bark-400 mb-1">{idx + 1} / {items.length}</p>
      <h3 className="font-bold text-bark-600 mb-5 text-sm">Is this a <span className="text-blue-600">Need</span> or a <span className="text-yellow-600">Want</span>?</h3>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white border-2 border-bark-200 rounded-3xl p-8 mb-5">
          <div className="text-6xl mb-3">{current.emoji}</div>
          <p className="font-black text-xl text-bark-600">{current.name}</p>
        </motion.div>
      </AnimatePresence>

      {feedback && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`rounded-2xl p-3 mb-4 text-sm font-semibold ${feedback.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {feedback.ok ? '✅ Correct! ' : '❌ Not quite! '}{feedback.reason}
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => choose('need')} disabled={!!feedback}
          className="bg-blue-50 border-2 border-blue-200 text-blue-700 font-bold py-4 rounded-2xl text-lg hover:bg-blue-100 active:scale-95 transition-all disabled:opacity-50">
          ✅ Need
        </button>
        <button onClick={() => choose('want')} disabled={!!feedback}
          className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 font-bold py-4 rounded-2xl text-lg hover:bg-yellow-100 active:scale-95 transition-all disabled:opacity-50">
          🛍️ Want
        </button>
      </div>
      <p className="text-sm text-bark-400 mt-4">Score: <strong>{score}</strong></p>
    </div>
  )
}
