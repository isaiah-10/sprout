'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import TradeModal from './TradeModal'
import { formatCurrency, formatSeeds, formatPercent, gainLossColor, gainLossBg } from '@/lib/utils/format'
import { findStock } from '@/lib/stocks/popular-stocks'
import type { VirtualHolding, RealHolding, StockQuote } from '@/lib/supabase/types'

interface Props {
  holding: VirtualHolding | RealHolding
  quote: StockQuote | null
  childId: string
  isTeen: boolean
  balance: number
}

export default function HoldingRow({ holding, quote, childId, isTeen, balance }: Props) {
  const [showTrade, setShowTrade] = useState(false)
  const stock   = findStock(holding.symbol)
  const price   = quote?.price ?? holding.avg_buy_price
  const value   = price * holding.shares
  const gain    = value - (holding.avg_buy_price * holding.shares)
  const gainPct = (gain / (holding.avg_buy_price * holding.shares)) * 100

  return (
    <>
      <button
        onClick={() => setShowTrade(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-bark-50 transition-colors text-left"
      >
        <div className="text-2xl">{stock?.emoji ?? '📊'}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-bark-600">{holding.company_name}</p>
          <p className="text-xs text-bark-400">{holding.shares} shares · avg {isTeen ? formatCurrency(holding.avg_buy_price) : formatSeeds(holding.avg_buy_price)}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black text-bark-600">{isTeen ? formatCurrency(value) : formatSeeds(value)}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${gainLossBg(gain)}`}>
            {gain >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {formatPercent(gainPct)}
          </span>
        </div>
      </button>

      {stock && (
        <TradeModal
          open={showTrade}
          onClose={() => setShowTrade(false)}
          stock={stock}
          quote={quote}
          childId={childId}
          isTeen={isTeen}
          balance={balance}
          existingShares={holding.shares}
        />
      )}
    </>
  )
}
