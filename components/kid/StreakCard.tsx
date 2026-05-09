'use client'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface Props { streak: number; longestStreak: number }

export default function StreakCard({ streak, longestStreak }: Props) {
  const flames = Math.min(streak, 7)

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={20} className="text-orange-500 fill-orange-500" />
        <p className="font-bold text-bark-600 text-sm">Daily Streak</p>
      </div>
      <div className="flex items-end gap-1 mb-2">
        <motion.p
          key={streak}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl font-black text-orange-500"
        >
          {streak}
        </motion.p>
        <p className="text-bark-400 text-sm mb-1.5">days</p>
      </div>
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${i < flames ? 'bg-orange-400' : 'bg-orange-100'}`}
          />
        ))}
      </div>
      <p className="text-xs text-bark-400">Best: {longestStreak} days</p>
    </div>
  )
}
