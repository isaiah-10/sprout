'use client'
import { useState } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { findStock } from '@/lib/stocks/popular-stocks'
import type { TradeRequest } from '@/lib/supabase/types'

interface Props {
  request: TradeRequest
  onReviewed: () => void
}

export default function ApprovalCard({ request: req, onReviewed }: Props) {
  const [note, setNote]       = useState('')
  const [loading, setLoading] = useState<'approve' | 'deny' | null>(null)
  const stock = findStock(req.symbol)

  async function review(action: 'approve' | 'deny') {
    setLoading(action)
    const supabase = createClient()

    if (action === 'approve') {
      // Update trade request
      await supabase.from('trade_requests').update({
        status: 'approved', parent_note: note || null, reviewed_at: new Date().toISOString(),
      }).eq('id', req.id)

      // Execute virtual/real trade
      if (req.trade_type === 'buy') {
        // Deduct balance
        await supabase.rpc('execute_trade', {
          p_child_id:    req.child_id,
          p_symbol:      req.symbol,
          p_company_name: req.company_name,
          p_asset_type:  req.asset_type,
          p_trade_type:  req.trade_type,
          p_shares:      req.shares,
          p_price:       req.estimated_price,
          p_request_id:  req.id,
        })
      }
    } else {
      await supabase.from('trade_requests').update({
        status: 'denied', parent_note: note || null, reviewed_at: new Date().toISOString(),
      }).eq('id', req.id)

      // Release pending funds
      await supabase.from('child_profiles')
        .update({ real_balance_pending: supabase.rpc('greatest', { a: 0, b: req.total_estimated }) })
        .eq('id', req.child_id)
    }

    setLoading(null)
    onReviewed()
  }

  const expires = new Date(req.expires_at)
  const hoursLeft = Math.max(0, Math.floor((expires.getTime() - Date.now()) / 3_600_000))

  return (
    <Card className="border-l-4" style={{ borderLeftColor: '#2D6A4F' } as React.CSSProperties}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {req.child && <Avatar emoji={req.child.avatar_emoji} color={req.child.color} size="md" />}
        <div className="flex-1">
          <p className="font-bold text-bark-600 text-sm">{req.child?.name}</p>
          <p className="text-xs text-bark-400 flex items-center gap-1">
            <Clock size={11} /> {formatRelativeTime(req.created_at)} · expires in {hoursLeft}h
          </p>
        </div>
        <span className={`text-lg px-2.5 py-1 rounded-xl font-bold text-sm ${req.trade_type === 'buy' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {req.trade_type === 'buy' ? '↑ BUY' : '↓ SELL'}
        </span>
      </div>

      {/* Stock info */}
      <div className="bg-bark-50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{stock?.emoji ?? '📊'}</div>
          <div className="flex-1">
            <p className="font-bold text-bark-600">{req.company_name}</p>
            <p className="text-xs text-bark-400">{req.symbol} · {req.asset_type.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-lg text-bark-600">{formatCurrency(req.total_estimated)}</p>
            <p className="text-xs text-bark-400">{req.shares} shares @ {formatCurrency(req.estimated_price)}</p>
          </div>
        </div>
      </div>

      {/* Kid's note */}
      {req.kid_note && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-blue-700 mb-0.5">💬 {req.child?.name} says:</p>
          <p className="text-sm text-blue-600">"{req.kid_note}"</p>
        </div>
      )}

      {/* Parent note */}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Optional: leave a note for your kid (e.g. why you approved/denied)..."
        rows={2}
        className="w-full text-sm rounded-xl border border-bark-200 px-3 py-2.5 text-bark-500 placeholder-bark-300 resize-none focus:outline-none focus:ring-2 focus:ring-sprout-500 mb-4"
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="danger"
          onClick={() => review('deny')}
          loading={loading === 'deny'}
          icon={<X size={16} />}
          className="flex-1"
        >
          Deny
        </Button>
        <Button
          onClick={() => review('approve')}
          loading={loading === 'approve'}
          icon={<Check size={16} />}
          className="flex-1"
        >
          Approve
        </Button>
      </div>
    </Card>
  )
}
