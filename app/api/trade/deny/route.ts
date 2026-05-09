import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { requestId, parentNote } = await req.json()
  const service = await createServiceClient()

  const { data: tradeReq } = await service.from('trade_requests')
    .select('*').eq('id', requestId).eq('parent_id', user.id).eq('status', 'pending').single()

  if (!tradeReq) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await service.from('trade_requests').update({
    status: 'denied', parent_note: parentNote ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', requestId)

  // Refund locked funds for buy requests
  if (tradeReq.trade_type === 'buy') {
    const { data: cp } = await service.from('child_profiles')
      .select('real_balance,real_balance_pending').eq('id', tradeReq.child_id).single()
    if (cp) {
      await service.from('child_profiles').update({
        real_balance:         cp.real_balance + tradeReq.total_estimated,
        real_balance_pending: Math.max(0, (cp.real_balance_pending ?? 0) - tradeReq.total_estimated),
      }).eq('id', tradeReq.child_id)
    }
  }

  return NextResponse.json({ success: true })
}
