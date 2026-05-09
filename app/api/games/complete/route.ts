import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest }    from 'next/server'
import { XP_REWARDS }                        from '@/lib/utils/xp'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { childId, gameSlug, score, seedsEarned } = await req.json()

  const service = await createServiceClient()

  // Verify parent owns this child
  const { data: child } = await service.from('child_profiles')
    .select('id,parent_id,virtual_balance,xp,date_of_birth').eq('id', childId).single()
  if (!child || child.parent_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const xp    = XP_REWARDS.GAME_COMPLETED
  const age   = new Date().getFullYear() - new Date(child.date_of_birth).getFullYear()
  const seeds = age < 13 ? (seedsEarned ?? 0) : 0

  // Record session
  await service.from('game_sessions').insert({
    child_id: childId, game_slug: gameSlug, score,
    seeds_earned: seeds, xp_earned: xp, completed: true,
  })

  // Update child XP and balance
  const updates: Record<string, number> = { xp: child.xp + xp }
  if (seeds > 0) {
    updates.virtual_balance = child.virtual_balance + seeds
    // Log as transaction
    await service.from('virtual_transactions').insert({
      child_id: childId, symbol: 'SEEDS', company_name: gameSlug,
      type: 'game_reward', total_amount: seeds, note: `Completed ${gameSlug}`,
    })
  }

  await service.from('child_profiles').update(updates).eq('id', childId)

  // Activity log
  await service.from('activity_log').insert({
    child_id: childId, parent_id: user.id,
    type: 'game_played', title: `Played ${gameSlug.replace(/-/g, ' ')}`,
    description: `Score: ${score}${seeds ? ` · +${seeds} Seeds` : ''} · +${xp} XP`,
  })

  return NextResponse.json({ success: true, xpAwarded: xp, seedsAwarded: seeds })
}
