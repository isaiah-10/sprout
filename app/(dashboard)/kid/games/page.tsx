import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { getAge }       from '@/lib/utils/age'
import Badge            from '@/components/ui/Badge'

interface GameMeta {
  slug: string; title: string; emoji: string; desc: string
  minAge: number; maxAge: number; seeds: string; xp: string; color: string
}

const ALL_GAMES: GameMeta[] = [
  { slug: 'coin-catcher',    title: 'Coin Catcher',     emoji: '🪙', desc: 'Catch falling coins and learn money denominations!',              minAge: 5,  maxAge: 12, seeds: 'Up to 50', xp: '25',  color: 'bg-yellow-50 border-yellow-200' },
  { slug: 'piggy-bank',      title: 'Piggy Bank Builder',emoji: '🐷', desc: 'Set savings goals and do chores to reach them.',                  minAge: 5,  maxAge: 12, seeds: 'Up to 40', xp: '30',  color: 'bg-pink-50 border-pink-200' },
  { slug: 'budget-boss',     title: 'Budget Boss',       emoji: '💼', desc: 'Sort expenses into Needs, Wants, Savings, and Investments.',       minAge: 8,  maxAge: 18, seeds: 'Up to 60', xp: '40',  color: 'bg-blue-50 border-blue-200' },
  { slug: 'stock-showdown',  title: 'Stock Showdown',    emoji: '⚔️', desc: 'Compare real stocks and guess which has a higher price.',         minAge: 9,  maxAge: 18, seeds: 'Up to 35', xp: '35',  color: 'bg-purple-50 border-purple-200' },
  { slug: 'needs-vs-wants',  title: 'Needs vs Wants',    emoji: '⚖️', desc: 'Decide whether each item is a need or a want — fast!',          minAge: 5,  maxAge: 18, seeds: 'Up to 30', xp: '30',  color: 'bg-green-50 border-green-200' },
  { slug: 'compound-quest',  title: 'Compound Quest',    emoji: '📈', desc: 'Discover the magic of compound interest with interactive charts.', minAge: 11, maxAge: 18, seeds: '30',       xp: '75',  color: 'bg-sprout-50 border-sprout-200' },
]

export default async function GamesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase.from('child_profiles').select('id,date_of_birth,xp').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const age      = getAge(child.date_of_birth)
  const isTeen   = age >= 13

  const { data: played } = await supabase.from('game_sessions')
    .select('game_slug').eq('child_id', child.id).eq('completed', true)
  const playedSlugs = new Set(played?.map(s => s.game_slug) ?? [])

  const available = ALL_GAMES.filter(g => age >= g.minAge && age <= g.maxAge)

  return (
    <div className="page-inner">
      <h1 className="section-title">🎮 Games</h1>
      <p className="section-sub">
        {isTeen
          ? 'Educational finance games — earn XP and sharpen your investing knowledge!'
          : 'Learn about money through fun games — and earn Seeds to invest!'}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {available.map(game => (
          <Link key={game.slug} href={`/kid/games/${game.slug}`}>
            <div className={`rounded-2xl border-2 p-5 ${game.color} hover:shadow-md transition-all cursor-pointer group`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{game.emoji}</span>
                {playedSlugs.has(game.slug) && (
                  <Badge variant="green" size="sm">✓ Played</Badge>
                )}
              </div>
              <h3 className="font-black text-bark-600 mb-1">{game.title}</h3>
              <p className="text-bark-400 text-xs leading-relaxed mb-3">{game.desc}</p>
              <div className="flex gap-2 text-xs">
                {!isTeen && <span className="bg-white/70 rounded-full px-2.5 py-1 font-semibold text-sprout-700">🌱 {game.seeds} Seeds</span>}
                <span className="bg-white/70 rounded-full px-2.5 py-1 font-semibold text-bark-500">⚡ {game.xp} XP</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isTeen && (
        <div className="mt-6 bg-white border border-bark-200 rounded-2xl p-5 text-sm text-bark-500">
          <p className="font-bold text-bark-600 mb-1">🎓 About Teen Mode Games</p>
          <p>Games are educational tools — they teach real finance concepts and earn you XP. Your investing money comes from your parent-funded account, not from games.</p>
        </div>
      )}
    </div>
  )
}
