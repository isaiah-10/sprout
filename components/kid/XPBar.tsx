'use client'
import { motion } from 'framer-motion'
import ProgressBar from '@/components/ui/ProgressBar'
import { getLevelFromXP, getProgressToNextLevel, getXPToNextLevel } from '@/lib/utils/xp'

interface Props { xp: number; animated?: boolean }

export default function XPBar({ xp, animated = true }: Props) {
  const level    = getLevelFromXP(xp)
  const progress = getProgressToNextLevel(xp)
  const toNext   = getXPToNextLevel(xp)

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-bark-200 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{level.emoji}</span>
          <div>
            <p className="text-xs font-bold text-bark-600">Level {level.level} · {level.title}</p>
            <p className="text-xs text-bark-400">{xp.toLocaleString()} XP total</p>
          </div>
        </div>
        {toNext > 0 && (
          <p className="text-xs text-bark-400">{toNext} XP to level up</p>
        )}
      </div>
      {animated ? (
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} style={{ transformOrigin: 'left' }}>
          <ProgressBar value={progress} color="green" size="md" />
        </motion.div>
      ) : (
        <ProgressBar value={progress} color="green" size="md" />
      )}
    </div>
  )
}
