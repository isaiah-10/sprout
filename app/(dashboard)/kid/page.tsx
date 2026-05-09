import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import Link              from 'next/link'
import XPBar             from '@/components/kid/XPBar'
import StreakCard         from '@/components/kid/StreakCard'
import { StatCard }      from '@/components/ui/Card'
import Avatar            from '@/components/ui/Avatar'
import { getAge }        from '@/lib/utils/age'
import { getLevelFromXP } from '@/lib/utils/xp'
import { formatSeeds, formatCurrency } from '@/lib/utils/format'

export default async function KidHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('child_profiles').select('*').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const age    = getAge(child.date_of_birth)
  const isTeen = age >= 13
  const level  = getLevelFromXP(child.xp)

  const [{ data: holdings }, { data: achievements }, { data: games }] = await Promise.all([
    isTeen
      ? supabase.from('real_holdings').select('*').eq('child_id', child.id).limit(3)
      : supabase.from('virtual_holdings').select('*').eq('child_id', child.id).limit(3),
    supabase.from('child_achievements').select('achievement_id').eq('child_id', child.id),
    supabase.from('game_sessions').select('game_slug,score,seeds_earned').eq('child_id', child.id).order('played_at', { ascending: false }).limit(3),
  ])

  const greeting = age < 10 ? `Hey ${child.name}! 🌟` : age < 13 ? `What's up, ${child.name}! 💪` : `Welcome back, ${child.name}! 📈`

  return (
    <div className="page-inner">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar emoji={child.avatar_emoji} color={child.color} size="xl" />
        <div>
          <h1 className="text-2xl font-black text-bark-600">{greeting}</h1>
          <p className="text-bark-400 text-sm">{level.emoji} {level.title} · {child.streak_days > 0 ? `🔥 ${child.streak_days} day streak` : 'Start your streak today!'}</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-6">
        <XPBar xp={child.xp} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {isTeen ? (
          <>
            <StatCard label="Cash Balance"    value={formatCurrency(child.real_balance)}  icon="💰" color="green" />
            <StatCard label="Invested"         value={formatCurrency(child.real_balance_pending)}  icon="📈" color="blue" />
          </>
        ) : (
          <>
            <StatCard label="Seeds Balance"   value={formatSeeds(child.virtual_balance)} icon="🌱" color="green" />
            <StatCard label="Games Played"    value={(games?.length ?? 0).toString()}    icon="🎮" color="gold" />
          </>
        )}
        <StatCard label="Achievements"      value={(achievements?.length ?? 0).toString()} icon="🏆" color="gold" />
        <StatCard label="Day Streak"        value={`${child.streak_days}🔥`}            icon="🔥" color="cream" />
      </div>

      {/* Two columns */}
      <div className="grid md:grid-cols-2 gap-6">
        <StreakCard streak={child.streak_days} longestStreak={child.longest_streak} />

        {/* Quick actions */}
        <div className="bg-white border border-bark-200 rounded-2xl p-4">
          <p className="font-bold text-bark-600 mb-3 text-sm">⚡ Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/kid/invest', label: isTeen ? 'Invest' : 'Invest Seeds', emoji: '📈' },
              { href: '/kid/games',  label: 'Play Games',    emoji: '🎮' },
              { href: '/kid/learn',  label: 'Learn',         emoji: '📚' },
              ...(isTeen ? [] : [{ href: '/kid/savings', label: 'Goals', emoji: '🎯' }]),
            ].map(a => (
              <Link key={a.href} href={a.href} className="flex items-center gap-2 bg-bark-50 hover:bg-leaf-light transition-colors rounded-xl p-3 text-sm font-semibold text-bark-600">
                <span className="text-xl">{a.emoji}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent portfolio */}
      {(holdings?.length ?? 0) > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-bark-600">{isTeen ? '📊 Your Portfolio' : '🌱 Your Investments'}</p>
            <Link href="/kid/invest" className="text-xs text-sprout-600 font-semibold">View all →</Link>
          </div>
          <div className="bg-white border border-bark-200 rounded-2xl divide-y divide-bark-100">
            {holdings?.map(h => (
              <div key={h.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">{h.symbol}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-bark-600">{h.company_name}</p>
                  <p className="text-xs text-bark-400">{h.shares} shares</p>
                </div>
                <p className="text-sm font-bold text-bark-600">
                  {isTeen ? formatCurrency(h.avg_buy_price * h.shares) : formatSeeds(h.avg_buy_price * h.shares)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
