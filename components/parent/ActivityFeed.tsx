import { formatRelativeTime } from '@/lib/utils/format'
import type { ActivityLogEntry } from '@/lib/supabase/types'

const TYPE_ICONS: Record<string, string> = {
  trade_request:     '📩',
  trade_executed:    '✅',
  game_played:       '🎮',
  lesson_completed:  '📚',
  goal_created:      '🎯',
  goal_completed:    '🏆',
  achievement_earned:'⭐',
  deposit_received:  '💰',
  streak_milestone:  '🔥',
}

interface Props { entries: ActivityLogEntry[] }

export default function ActivityFeed({ entries }: Props) {
  if (!entries.length) {
    return (
      <div className="bg-white border border-bark-200 rounded-2xl p-8 text-center">
        <p className="text-3xl mb-2">📋</p>
        <p className="text-bark-400 text-sm">No activity yet — check back once your kids start playing!</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-bark-200 rounded-2xl divide-y divide-bark-100 overflow-hidden">
      {entries.map(entry => (
        <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-bark-50 transition-colors">
          <div className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[entry.type] ?? '📌'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              {entry.child && (
                <span className="text-xs font-bold" style={{ color: entry.child.color }}>
                  {entry.child.avatar_emoji} {entry.child.name}
                </span>
              )}
              <span className="text-sm text-bark-600 font-medium">{entry.title}</span>
            </div>
            {entry.description && (
              <p className="text-xs text-bark-400 mt-0.5 truncate">{entry.description}</p>
            )}
          </div>
          <span className="text-xs text-bark-300 flex-shrink-0">{formatRelativeTime(entry.created_at)}</span>
        </div>
      ))}
    </div>
  )
}
