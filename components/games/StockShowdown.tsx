'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { POPULAR_STOCKS } from '@/lib/stocks/popular-stocks'

interface Props { onComplete: (score: number, seeds: number) => void }

interface Round {
  stockA: typeof POPULAR_STOCKS[0]
  stockB: typeof POPULAR_STOCKS[0]
  questionType: 'price' | 'older' | 'marketcap'
  priceA: number
  priceB: number
  correct: 'A' | 'B'
  question: string
}

const SEED_PRICES: Record<string, number> = {
  AAPL: 189, GOOGL: 175, MSFT: 420, AMZN: 196, META: 545, NFLX: 780,
  DIS: 98, TSLA: 248, NVDA: 875, SNAP: 10, SPOT: 312, RBLX: 41,
  ABNB: 142, UBER: 73, NKE: 90, MCD: 286, SBUX: 79, COST: 896, V: 278, JPM: 198,
}

function buildRound(): Round {
  const pool  = POPULAR_STOCKS.filter(s => s.assetType === 'stock' && SEED_PRICES[s.symbol])
  const picks = pool.sort(() => Math.random() - 0.5).slice(0, 2)
  const [a, b] = picks
  const pA = SEED_PRICES[a.symbol]
  const pB = SEED_PRICES[b.symbol]
  const correct: 'A' | 'B' = pA > pB ? 'A' : 'B'
  return {
    stockA: a, stockB: b, questionType: 'price',
    priceA: pA, priceB: pB, correct,
    question: 'Which stock has a HIGHER share price?',
  }
}

export default function StockShowdown({ onComplete }: Props) {
  const ROUNDS = 7
  const [rounds]   = useState<Round[]>(() => Array.from({ length: ROUNDS }, buildRound))
  const [idx, setIdx]             = useState(0)
  const [score, setScore]         = useState(0)
  const [streak, setStreak]       = useState(0)
  const [feedback, setFeedback]   = useState<'correct' | 'wrong' | null>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>('idle')

  const round = rounds[idx]

  function pick(choice: 'A' | 'B') {
    if (feedback) return
    const correct = choice === round.correct
    const pts = correct ? (10 + streak * 2) : 0
    setFeedback(correct ? 'correct' : 'wrong')
    setScore(s => s + pts)
    setStreak(s => correct ? s + 1 : 0)

    setTimeout(() => {
      setFeedback(null)
      if (idx + 1 >= ROUNDS) {
        setGameState('done')
        onComplete(score + pts, Math.floor((score + pts) / 2))
      } else {
        setIdx(i => i + 1)
      }
    }, 1400)
  }

  if (gameState === 'idle') return (
    <div className="text-center max-w-sm mx-auto">
      <div className="text-5xl mb-3">⚔️</div>
      <h3 className="font-black text-xl text-bark-600 mb-2">Stock Showdown!</h3>
      <p className="text-bark-400 text-sm mb-4">Compare two stocks and pick the right answer. Get streaks for bonus Seeds!</p>
      <Button size="lg" onClick={() => setGameState('playing')}>Let&apos;s Battle!</Button>
    </div>
  )

  if (gameState === 'done') return (
    <div className="text-center py-4">
      <div className="text-5xl mb-3">{score >= 50 ? '🏆' : '📈'}</div>
      <h3 className="font-black text-2xl text-bark-600 mb-1">Final Score: {score}</h3>
      <p className="text-sprout-600 font-bold mb-4">+{Math.floor(score / 2)} Seeds earned!</p>
      <Button onClick={() => { setIdx(0); setScore(0); setStreak(0); setGameState('playing') }} variant="secondary">Play Again</Button>
    </div>
  )

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ProgressBar value={(idx / ROUNDS) * 100} color="green" size="sm" className="flex-1 mr-4" />
        <span className="text-sm font-bold text-bark-500">{idx + 1}/{ROUNDS}</span>
        {streak >= 2 && <span className="text-xs font-bold text-orange-500 ml-2">🔥 x{streak}</span>}
      </div>

      <p className="text-center font-bold text-bark-600 mb-5 text-sm">{round.question}</p>

      {feedback && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
          className={`text-center rounded-2xl p-3 mb-4 font-bold text-sm ${feedback === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {feedback === 'correct'
            ? `✅ Correct! ${round.stockA.name}: $${round.priceA} vs ${round.stockB.name}: $${round.priceB}`
            : `❌ Nope! ${round.correct === 'A' ? round.stockA.name : round.stockB.name} has the higher price`}
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'A', stock: round.stockA, price: round.priceA },
          { label: 'B', stock: round.stockB, price: round.priceB },
        ].map(({ label, stock, price }) => (
          <button
            key={label}
            onClick={() => pick(label as 'A' | 'B')}
            disabled={!!feedback}
            className="bg-white border-2 border-bark-200 hover:border-sprout-400 rounded-2xl p-5 text-center transition-all hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="text-4xl mb-2">{stock.emoji}</div>
            <p className="font-black text-bark-600">{stock.name}</p>
            <p className="text-xs text-bark-400">{stock.symbol}</p>
            <p className="text-lg font-black text-sprout-700 mt-2">???</p>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-bark-400 mt-4">Score: <strong className="text-bark-600">{score}</strong></p>
    </div>
  )
}
