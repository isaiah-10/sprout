import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { requestId, parentNote } = await req.json()
  if (!requestId) return NextResponse.json({ error: 'requestId required' }, { status: 400 })

  const service = await createServiceClient()

  // Fetch the trade request
  const { data: tradeReq, error: fetchErr } = await service
    .from('trade_requests')
    .select('*')
    .eq('id', requestId)
    .eq('parent_id', user.id)
    .eq('status', 'pending')
    .single()

  if (fetchErr || !tradeReq) return NextResponse.json({ error: 'Trade request not found' }, { status: 404 })

  // Mark approved
  await service.from('trade_requests').update({
    status: 'approved', parent_note: parentNote ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', requestId)

  // Execute the trade
  if (tradeReq.trade_type === 'buy') {
    // Upsert real holding
    const { data: existing } = await service.from('real_holdings')
      .select('id,shares,avg_buy_price')
      .eq('child_id', tradeReq.child_id)
      .eq('symbol', tradeReq.symbol)
      .single()

    if (existing) {
      const newShares    = existing.shares + tradeReq.shares
      const newAvgPrice  = ((existing.shares * existing.avg_buy_price) + tradeReq.total_estimated) / newShares
      await service.from('real_holdings').update({ shares: newShares, avg_buy_price: newAvgPrice }).eq('id', existing.id)
    } else {
      await service.from('real_holdings').insert({
        child_id: tradeReq.child_id, symbol: tradeReq.symbol, company_name: tradeReq.company_name,
        asset_type: tradeReq.asset_type, shares: tradeReq.shares, avg_buy_price: tradeReq.estimated_price,
      })
    }

    // Move from pending to invested (reduce pending balance)
    const { data: cp } = await service.from('child_profiles').select('real_balance_pending').eq('id', tradeReq.child_id).single()
    if (cp) {
      await service.from('child_profiles').update({
        real_balance_pending: Math.max(0, (cp.real_balance_pending ?? 0) - tradeReq.total_estimated),
      }).eq('id', tradeReq.child_id)
    }
  } else {
    // SELL: remove/reduce holding, add cash back
    const { data: existing } = await service.from('real_holdings')
      .select('id,shares').eq('child_id', tradeReq.child_id).eq('symbol', tradeReq.symbol).single()
    if (existing) {
      if (existing.shares - tradeReq.shares <= 0.001) {
        await service.from('real_holdings').delete().eq('id', existing.id)
      } else {
        await service.from('real_holdings').update({ shares: existing.shares - tradeReq.shares }).eq('id', existing.id)
      }
    }
    // Return proceeds to balance
    const { data: cp } = await service.from('child_profiles').select('real_balance').eq('id', tradeReq.child_id).single()
    if (cp) {
      await service.from('child_profiles').update({ real_balance: cp.real_balance + tradeReq.total_estimated }).eq('id', tradeReq.child_id)
    }
  }

  // Log transaction
  await service.from('real_transactions').insert({
    child_id: tradeReq.child_id, trade_request_id: requestId,
    symbol: tradeReq.symbol, company_name: tradeReq.company_name, asset_type: tradeReq.asset_type,
    type: tradeReq.trade_type, shares: tradeReq.shares,
    price_per_share: tradeReq.estimated_price, total_amount: tradeReq.total_estimated,
  })

  // Activity log
  await service.from('activity_log').insert({
    child_id: tradeReq.child_id, parent_id: user.id,
    type: 'trade_executed',
    title: `${tradeReq.trade_type === 'buy' ? 'Bought' : 'Sold'} ${tradeReq.shares} shares of ${tradeReq.company_name}`,
    metadata: { symbol: tradeReq.symbol, shares: tradeReq.shares, total: tradeReq.total_estimated },
  })

  return NextResponse.json({ success: true })
}
