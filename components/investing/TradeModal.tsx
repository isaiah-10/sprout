'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatSeeds, gainLossColor } from '@/lib/utils/format'
import type { StockQuote } from '@/lib/supabase/types'
import type { StockInfo } from '@/lib/stocks/popular-stocks'

interface Props {
  open: boolean
  onClose: () => void
  stock: StockInfo
  quote: StockQuote | null
  childId: string
  isTeen: boolean
  balance: number
  existingShares?: number
}

export default function TradeModal({ open, onClose, stock, quote, childId, isTeen, balance, existingShares = 0 }: Props) {
  const router      = useRouter()
  const [type, setType]   = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('')
  const [note, setNote]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone]   = useState(false)

  const price    = quote?.price ?? 0
  const numShares = parseFloat(shares) || 0
  const total     = numShares * price
  const canAfford = total <= balance
  const hasSell   = existingShares > 0

  async function executeTrade() {
    if (numShares <= 0) { setError('Enter the number of shares.'); return }
    if (type === 'buy' && !canAfford) { setError('Not enough balance.'); return }
    if (type === 'sell' && numShares > existingShares) { setError(`You only have ${existingShares} shares.`); return }
    setLoading(true); setError('')

    const supabase = createClient()

    if (!isTeen) {
      // ── Virtual trade (5–12): execute immediately ──────────────────────
      const newBalance = type === 'buy' ? balance - total : balance + total

      if (type === 'buy') {
        // Upsert virtual holding
        const { data: existing } = await supabase.from('virtual_holdings')
          .select('id,shares,avg_buy_price').eq('child_id', childId).eq('symbol', stock.symbol).single()

        if (existing) {
          const newShares  = existing.shares + numShares
          const newAvgPrice = ((existing.shares * existing.avg_buy_price) + total) / newShares
          await supabase.from('virtual_holdings').update({ shares: newShares, avg_buy_price: newAvgPrice }).eq('id', existing.id)
        } else {
          await supabase.from('virtual_holdings').insert({
            child_id: childId, symbol: stock.symbol, company_name: stock.name,
            shares: numShares, avg_buy_price: price,
          })
        }
      } else {
        // Reduce or remove holding
        const { data: existing } = await supabase.from('virtual_holdings')
          .select('id,shares').eq('child_id', childId).eq('symbol', stock.symbol).single()
        if (existing) {
          if (existing.shares - numShares <= 0.001) {
            await supabase.from('virtual_holdings').delete().eq('id', existing.id)
          } else {
            await supabase.from('virtual_holdings').update({ shares: existing.shares - numShares }).eq('id', existing.id)
          }
        }
      }

      // Update balance
      await supabase.from('child_profiles').update({ virtual_balance: newBalance }).eq('id', childId)
      // Log transaction
      await supabase.from('virtual_transactions').insert({
        child_id: childId, symbol: stock.symbol, company_name: stock.name,
        type, shares: numShares, price_per_share: price, total_amount: total,
      })
    } else {
      // ── Real money trade (13+): submit for parent approval ─────────────
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile }  = await supabase.from('child_profiles').select('parent_id').eq('id', childId).single()

      await supabase.from('trade_requests').insert({
        child_id: childId, parent_id: profile?.parent_id ?? user?.id,
        symbol: stock.symbol, company_name: stock.name,
        asset_type: stock.assetType, trade_type: type,
        shares: numShares, estimated_price: price,
        total_estimated: total, kid_note: note || null,
      })

      // Lock funds for buy
      if (type === 'buy') {
        const { data: cp } = await supabase.from('child_profiles').select('real_balance,real_balance_pending').eq('id', childId).single()
        if (cp) {
          await supabase.from('child_profiles').update({
            real_balance: cp.real_balance - total,
            real_balance_pending: (cp.real_balance_pending ?? 0) + total,
          }).eq('id', childId)
        }
      }
    }

    setLoading(false)
    setDone(true)
    setTimeout(() => { setDone(false); onClose(); router.refresh() }, 2000)
  }

  if (done) return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center py-6">
        <div className="text-5xl mb-4">{isTeen ? '📩' : '✅'}</div>
        <h2 className="font-black text-xl text-bark-600 mb-2">
          {isTeen ? 'Request Sent!' : 'Trade Complete!'}
        </h2>
        <p className="text-bark-400 text-sm">
          {isTeen
            ? "Your parent will review your trade request and let you know!"
            : `You ${type === 'buy' ? 'bought' : 'sold'} ${numShares} share${numShares !== 1 ? 's' : ''} of ${stock.name}`}
        </p>
      </div>
    </Modal>
  )

  return (
    <Modal open={open} onClose={onClose} title={`${stock.emoji} ${stock.name}`} size="md">
      {/* Price display */}
      <div className="bg-bark-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-bark-600">{formatCurrency(price)}</p>
            <p className={`text-sm font-semibold flex items-center gap-1 ${gainLossColor(quote?.change ?? 0)}`}>
              {(quote?.change ?? 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatCurrency(Math.abs(quote?.change ?? 0))} ({quote?.change_pct?.toFixed(2) ?? '0.00'}%) today
            </p>
          </div>
          <Badge variant={stock.assetType === 'stock' ? 'green' : 'blue'}>
            {stock.assetType.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <p className="text-xs text-bark-400 mt-2">
          Your balance: {isTeen ? formatCurrency(balance) : formatSeeds(balance)}
          {existingShares > 0 && ` · You own ${existingShares} shares`}
        </p>
      </div>

      {/* Buy/Sell toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setType('buy')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${type === 'buy' ? 'bg-sprout-700 text-white' : 'bg-bark-100 text-bark-400'}`}>
          Buy
        </button>
        <button onClick={() => setType('sell')} disabled={!hasSell}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${type === 'sell' ? 'bg-red-600 text-white' : 'bg-bark-100 text-bark-400'} disabled:opacity-30`}>
          Sell
        </button>
      </div>

      {/* Shares input */}
      <Input
        label="Number of shares"
        type="number"
        min="0.001"
        step="0.001"
        value={shares}
        onChange={e => setShares(e.target.value)}
        hint={`Max: ${type === 'buy' ? Math.floor(balance / price) : existingShares} shares`}
      />

      {/* Total */}
      {numShares > 0 && (
        <div className={`mt-3 p-3 rounded-xl ${canAfford || type === 'sell' ? 'bg-leaf-light' : 'bg-red-50'}`}>
          <p className="text-sm font-bold text-bark-600">
            Total: {isTeen ? formatCurrency(total) : formatSeeds(total)}
          </p>
          {type === 'buy' && !canAfford && (
            <p className="text-xs text-red-500 mt-0.5">Insufficient balance</p>
          )}
        </div>
      )}

      {/* Note for teens */}
      {isTeen && (
        <>
          <div className="flex items-start gap-2 mt-4 mb-2 text-xs text-bark-400 bg-blue-50 rounded-xl p-3">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Your parent will review this trade request before it executes.
          </div>
          <Input
            label="Tell your parent why (optional)"
            placeholder="e.g. I think Apple will do well this year..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <Button
        fullWidth
        size="lg"
        className="mt-4"
        loading={loading}
        disabled={numShares <= 0 || (type === 'buy' && !canAfford && !isTeen)}
        onClick={executeTrade}
        variant={type === 'sell' ? 'danger' : 'primary'}
      >
        {isTeen
          ? `Request ${type === 'buy' ? 'Buy' : 'Sell'}: ${formatCurrency(total)}`
          : `${type === 'buy' ? 'Buy' : 'Sell'} ${numShares || 0} share${numShares !== 1 ? 's' : ''}`}
      </Button>
    </Modal>
  )
}
