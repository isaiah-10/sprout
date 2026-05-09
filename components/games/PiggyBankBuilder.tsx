'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface Props { onComplete: (score: number, seeds: number) => void }

interface Goal { name: string; emoji: string; cost: number }

const GOALS: Goal[] = [
  { name: 'New Bike',    emoji: '🚲', cost: 200 },
  { name: 'Headphones',  emoji: '🎧', cost: 80  },
  { name: 'Switch Game', emoji: '🎮', cost: 60  },
  { name: 'Sneakers',    emoji: '👟', cost: 120 },
  { name: 'Science Kit', emoji: '🔬', cost: 45  },
]
const CHORES = [
  { label: 'Wash dishes 🍽️',    earn: 2  },
  { label: 'Mow the lawn 🌿',    earn: 10 },
  { label: 'Walk the dog 🐕',    earn: 5  },
  { label: 'Clean your room 🧹', earn: 3  },
  { label: 'Help with laundry 👕',earn: 4 },
  { label: 'Vacuum 🧹',          earn: 3  },
  { label: 'Wash the car 🚗',    earn: 8  },
]

export default function PiggyBankBuilder({ onComplete }: Props) {
  const [goal]          = useState<Goal>(() => GOALS[Math.floor(Math.random() * GOALS.length)])
  const [savings, setSavings] = useState(0)
  const [week, setWeek]       = useState(1)
  const [selectedChore, setSelected] = useState<number | null>(null)
  const [done, setDone]       = useState(false)
  const [totalEarned, setTotalEarned] = useState(0)

  function earnMoney() {
    if (selectedChore === null) return
    const chore = CHORES[selectedChore]
    const newSavings = savings + chore.earn
    setSavings(newSavings)
    setTotalEarned(t => t + chore.earn)
    setSelected(null)
    setWeek(w => w + 1)

    if (newSavings >= goal.cost) {
      setDone(true)
      const seeds = 15 + Math.min(25, Math.floor((goal.cost - newSavings + goal.cost) / goal.cost * 25))
      onComplete(week * 5, seeds)
    }
  }

  const pct = Math.min(100, (savings / goal.cost) * 100)

  if (done) return (
    <div className="text-center py-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="text-6xl mb-3">🎉</div>
      </motion.div>
      <h3 className="font-black text-2xl text-bark-600 mb-1">Goal Reached!</h3>
      <p className="text-lg text-bark-500 mb-1">You saved up for your {goal.emoji} {goal.name}!</p>
      <p className="text-sprout-600 font-bold mb-2">Took {week - 1} week{week !== 2 ? 's' : ''} of hard work!</p>
      <p className="text-bark-400 text-sm">That&apos;s the power of saving — slow and steady wins the race! 🐢</p>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto">
      {/* Goal card */}
      <div className="bg-white border-2 border-sprout-200 rounded-2xl p-5 text-center mb-5">
        <div className="text-4xl mb-2">{goal.emoji}</div>
        <p className="font-black text-bark-600 mb-1">Goal: {goal.name}</p>
        <p className="text-2xl font-black text-sprout-700 mb-3">${savings} / ${goal.cost}</p>

        {/* Piggy bank */}
        <div className="relative h-20 bg-pink-50 rounded-xl overflow-hidden border border-pink-200 mb-2">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-pink-300"
            animate={{ height: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🐷</span>
          </div>
        </div>
        <p className="text-xs text-bark-400">{Math.round(pct)}% saved · Week {week}</p>
      </div>

      {/* Pick a chore */}
      <p className="text-sm font-bold text-bark-600 mb-3">Pick a chore to do this week:</p>
      <div className="space-y-2 mb-4">
        {CHORES.map((c, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              selectedChore === i ? 'border-sprout-500 bg-leaf-light text-sprout-800' : 'border-bark-200 bg-white text-bark-600 hover:border-sprout-300'
            }`}>
            <span>{c.label}</span>
            <span className="font-black text-sprout-600">+${c.earn}</span>
          </button>
        ))}
      </div>

      <Button fullWidth size="lg" disabled={selectedChore === null} onClick={earnMoney}>
        Do the Chore & Earn 💪
      </Button>

      <p className="text-center text-xs text-bark-400 mt-3">Total earned: ${totalEarned}</p>
    </div>
  )
}
