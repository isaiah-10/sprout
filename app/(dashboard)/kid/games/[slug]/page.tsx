'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import CoinCatcher   from '@/components/games/CoinCatcher'
import PiggyBank     from '@/components/games/PiggyBankBuilder'
import BudgetBoss    from '@/components/games/BudgetBoss'
import StockShowdown from '@/components/games/StockShowdown'
import NeedsVsWants  from '@/components/games/NeedsVsWants'
import CompoundQuest from '@/components/games/CompoundQuest'

const GAME_TITLES: Record<string, string> = {
  'coin-catcher':   'Coin Catcher',
  'piggy-bank':     'Piggy Bank Builder',
  'budget-boss':    'Budget Boss',
  'stock-showdown': 'Stock Showdown',
  'needs-vs-wants': 'Needs vs Wants',
  'compound-quest': 'Compound Quest',
}

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router   = useRouter()
  const [childId, setChildId] = useState<string | null>(null)
  const [childAge, setChildAge] = useState(10)
  const [loaded, setLoaded] = useState(false)

  // Fetch child info on mount
  if (!loaded) {
    setLoaded(true)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('child_profiles').select('id,date_of_birth').eq('parent_id', user.id).limit(1).single()
        .then(({ data }) => {
          if (data) {
            setChildId(data.id)
            const age = new Date().getFullYear() - new Date(data.date_of_birth).getFullYear()
            setChildAge(age)
          }
        })
    })
  }

  async function handleComplete(score: number, seeds: number) {
    if (!childId) return
    const supabase = createClient()
    const xp = Math.min(75, Math.floor(score / 2) + 10)

    // Record game session
    await supabase.from('game_sessions').insert({
      child_id: childId, game_slug: slug, score, seeds_earned: seeds, xp_earned: xp, completed: true,
    })

    // Award seeds (under 13 only)
    if (childAge < 13 && seeds > 0) {
      const { data: cp } = await supabase.from('child_profiles').select('virtual_balance').eq('id', childId).single()
      if (cp) {
        await supabase.from('child_profiles').update({ virtual_balance: cp.virtual_balance + seeds, xp: supabase.rpc as unknown as number }).eq('id', childId)
        await supabase.from('virtual_transactions').insert({
          child_id: childId, symbol: 'GAME', company_name: GAME_TITLES[slug] ?? slug,
          type: 'game_reward', total_amount: seeds, note: `Played ${GAME_TITLES[slug]}`,
        })
      }
    }

    // Add XP
    await supabase.rpc('increment_xp', { p_child_id: childId, p_amount: xp })
  }

  const title  = GAME_TITLES[slug] ?? slug
  const isTeen = childAge >= 13

  const gameProps = { onComplete: handleComplete, childAge }

  return (
    <div className="page-inner max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/kid/games" className="flex items-center gap-1.5 text-bark-400 hover:text-bark-600 text-sm font-medium transition-colors">
          <ArrowLeft size={16} />
          Back to Games
        </Link>
        <span className="text-bark-200">/</span>
        <span className="text-sm font-bold text-bark-600">{title}</span>
      </div>

      <div className="bg-white border border-bark-200 rounded-3xl p-6 md:p-8">
        {slug === 'coin-catcher'   && <CoinCatcher   {...gameProps} />}
        {slug === 'piggy-bank'     && <PiggyBank      {...gameProps} />}
        {slug === 'budget-boss'    && <BudgetBoss     {...gameProps} />}
        {slug === 'stock-showdown' && <StockShowdown  onComplete={handleComplete} />}
        {slug === 'needs-vs-wants' && <NeedsVsWants   onComplete={handleComplete} />}
        {slug === 'compound-quest' && <CompoundQuest  onComplete={handleComplete} />}
        {!GAME_TITLES[slug] && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-bark-600">Game not found</p>
            <Link href="/kid/games" className="text-sprout-600 text-sm hover:underline mt-2 block">← Back to all games</Link>
          </div>
        )}
      </div>
    </div>
  )
}
