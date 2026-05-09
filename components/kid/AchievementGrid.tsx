import Badge from '@/components/ui/Badge'
import type { Achievement, ChildAchievement } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils/format'

interface Props {
  achievements: Achievement[]
  earned: ChildAchievement[]
}

export default function AchievementGrid({ achievements, earned }: Props) {
  const earnedIds = new Set(earned.map(e => e.achievement_id))
  const earnedMap = Object.fromEntries(earned.map(e => [e.achievement_id, e.earned_at]))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {achievements.map(a => {
        const isEarned = earnedIds.has(a.id)
        return (
          <div
            key={a.id}
            className={`rounded-2xl border p-4 text-center transition-all ${
              isEarned
                ? 'bg-white border-sprout-200 shadow-sm'
                : 'bg-bark-50 border-bark-100 opacity-50 grayscale'
            }`}
          >
            <div className={`text-3xl mb-2 ${isEarned ? '' : 'filter grayscale'}`}>{a.emoji}</div>
            <p className="text-xs font-bold text-bark-600 mb-0.5">{a.name}</p>
            <p className="text-xs text-bark-400 leading-tight mb-2">{a.description}</p>
            {isEarned ? (
              <Badge variant="green" size="sm">+{a.xp_reward} XP</Badge>
            ) : (
              <Badge variant="gray" size="sm">Locked</Badge>
            )}
            {isEarned && earnedMap[a.id] && (
              <p className="text-xs text-bark-300 mt-1">{formatDate(earnedMap[a.id])}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
