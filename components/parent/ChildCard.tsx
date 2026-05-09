'use client'
import Link from 'next/link'
import { TrendingUp, Gamepad2, Flame } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Avatar from '@/components/ui/Avatar'
import { getLevelFromXP, getProgressToNextLevel } from '@/lib/utils/xp'
import { formatCurrency, formatSeeds } from '@/lib/utils/format'
import type { ChildProfile } from '@/lib/supabase/types'

interface Props {
  child: ChildProfile
  age: number
}

export default function ChildCard({ child, age }: Props) {
  const level    = getLevelFromXP(child.xp)
  const progress = getProgressToNextLevel(child.xp)
  const isTeen   = age >= 13

  return (
    <Link href={`/parent/children/${child.id}`}>
      <Card hover className="group">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar emoji={child.avatar_emoji} color={child.color} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-bark-600 truncate">{child.name}</h3>
              {child.streak_days >= 3 && (
                <span className="flex items-center gap-0.5 text-xs font-bold text-orange-500">
                  <Flame size={12} className="fill-orange-500" />
                  {child.streak_days}
                </span>
              )}
            </div>
            <p className="text-xs text-bark-400">Age {age} · {isTeen ? '📈 Investor' : '🎮 Explorer'}</p>
          </div>
          <Badge variant={isTeen ? 'green' : 'gold'} size="sm">
            {isTeen ? 'Real Money' : 'Seeds Mode'}
          </Badge>
        </div>

        {/* Balance */}
        <div className="bg-bark-50 rounded-xl p-3 mb-4">
          {isTeen ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-bark-400 mb-0.5">Real Balance</p>
                <p className="font-bold text-bark-600">{formatCurrency(child.real_balance)}</p>
              </div>
              <TrendingUp size={20} className="text-sprout-500" />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-bark-400 mb-0.5">Seeds Balance</p>
                <p className="font-bold text-sprout-700">{formatSeeds(child.virtual_balance)}</p>
              </div>
              <Gamepad2 size={20} className="text-sprout-400" />
            </div>
          )}
        </div>

        {/* XP bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-bark-500">{level.emoji} {level.title}</span>
            <span className="text-xs text-bark-400">Lv {level.level}</span>
          </div>
          <ProgressBar value={progress} color="green" size="sm" />
        </div>
      </Card>
    </Link>
  )
}
