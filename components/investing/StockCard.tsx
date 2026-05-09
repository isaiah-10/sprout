'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '@/components/ui/Card'
import TradeModal from './TradeModal'
import { formatCurrency, formatPercent, gainLossColor } from '@/lib/utils/format'
import type { StockQuote } from '@/lib/supabase/types'
import type { StockInfo } from '@/lib/stocks/popular-stocks'

interface Props {
  stock: StockInfo
  quote: StockQuote | null
  childId: string
  isTeen: boolean
  balance: number
  onClick?: () => void
}

export default function StockCard({ stock, quote, childId, isTeen, balance, onClick }: Props) {
  const [showTrade, setShowTrade] = useState(false)
  const price     = quote?.price  ?? 0
  const change    = quote?.change ?? 0
  const changePct = quote?.change_pct ?? 0
  const isUp      = change >= 0

  return (
    <>
      <Card hover className="cursor-pointer" onClick={() => { onClick?.(); setShowTrade(true) }}>
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">{stock.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-bark-600 text-sm leading-tight">{stock.name}</p>
                <p className="text-xs text-bark-400">{stock.symbol}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-bark-600">{formatCurrency(price)}</p>
                <p className={`text-xs font-semibold flex items-center gap-0.5 justify-end ${gainLossColor(change)}`}>
                  {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {formatPercent(changePct)}
                </p>
              </div>
            </div>
            <p className="text-xs text-bark-300 mt-1.5 leading-tight">{stock.description}</p>
          </div>
        </div>
      </Card>

      <TradeModal
        open={showTrade}
        onClose={() => setShowTrade(false)}
        stock={stock}
        quote={quote}
        childId={childId}
        isTeen={isTeen}
        balance={balance}
      />
    </>
  )
}
