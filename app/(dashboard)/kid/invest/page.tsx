import { createClient }   from '@/lib/supabase/server'
import { redirect }       from 'next/navigation'
import StockCard          from '@/components/investing/StockCard'
import HoldingRow         from '@/components/investing/HoldingRow'
import { StatCard }       from '@/components/ui/Card'
import Badge              from '@/components/ui/Badge'
import { getAge }         from '@/lib/utils/age'
import { getFeaturedStocks } from '@/lib/stocks/popular-stocks'
import { fetchQuote, SEED_PRICES, mockQuote } from '@/lib/stocks/alphavantage'
import { formatCurrency, formatSeeds } from '@/lib/utils/format'

export default async function InvestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('child_profiles').select('*').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const age    = getAge(child.date_of_birth)
  const isTeen = age >= 13

  const [holdings, pendingRequests] = await Promise.all([
    isTeen
      ? supabase.from('real_holdings').select('*').eq('child_id', child.id).then(r => r.data ?? [])
      : supabase.from('virtual_holdings').select('*').eq('child_id', child.id).then(r => r.data ?? []),
    isTeen
      ? supabase.from('trade_requests').select('*').eq('child_id', child.id).eq('status', 'pending').then(r => r.data ?? [])
      : Promise.resolve([]),
  ])

  const featured = getFeaturedStocks(age)

  // Fetch quotes for featured stocks — use mock if rate-limited
  const quotes: Record<string, ReturnType<typeof mockQuote>> = {}
  for (const stock of featured.slice(0, 8)) {
    const q = await fetchQuote(stock.symbol)
    quotes[stock.symbol] = q ?? mockQuote(stock.symbol, SEED_PRICES[stock.symbol] ?? 100)
  }
  for (const h of holdings) {
    if (!quotes[h.symbol]) {
      const q = await fetchQuote(h.symbol)
      quotes[h.symbol] = q ?? mockQuote(h.symbol, SEED_PRICES[h.symbol] ?? 100)
    }
  }

  const balance = isTeen ? child.real_balance : child.virtual_balance

  // Portfolio total value
  const portfolioValue = holdings.reduce((sum, h) => {
    const price = quotes[h.symbol]?.price ?? h.avg_buy_price
    return sum + price * h.shares
  }, 0)
  const portfolioCost  = holdings.reduce((sum, h) => sum + h.avg_buy_price * h.shares, 0)
  const portfolioGain  = portfolioValue - portfolioCost
  const portfolioGainPct = portfolioCost > 0 ? (portfolioGain / portfolioCost) * 100 : 0

  return (
    <div className="page-inner">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="section-title mb-0">{isTeen ? '📈 Your Portfolio' : '🌱 Seeds Investing'}</h1>
          <Badge variant={isTeen ? 'green' : 'gold'}>
            {isTeen ? 'Real Money' : 'Simulated'}
          </Badge>
        </div>
        <p className="text-bark-400 text-sm">
          {isTeen
            ? 'Real stocks, real money. All trades need parent approval.'
            : 'Real companies and real prices — but with virtual Seeds. Learn the market risk-free!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Cash Available" value={isTeen ? formatCurrency(balance) : formatSeeds(balance)} icon="💰" color="green" />
        <StatCard label="Portfolio Value" value={isTeen ? formatCurrency(portfolioValue) : formatSeeds(portfolioValue)} icon="📊" color="blue" />
        <StatCard label="Total Gain/Loss"
          value={isTeen ? formatCurrency(portfolioGain) : formatSeeds(portfolioGain)}
          icon={portfolioGain >= 0 ? '📈' : '📉'}
          color={portfolioGain >= 0 ? 'green' : 'red'}
        />
        <StatCard label="Holdings" value={holdings.length.toString()} icon="🏦" color="cream" />
      </div>

      {/* Pending requests (teens) */}
      {pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
          <p className="font-bold text-yellow-700 text-sm mb-1">⏳ {pendingRequests.length} trade{pendingRequests.length !== 1 ? 's' : ''} waiting for parent approval</p>
          <p className="text-xs text-yellow-600">Your parent will be notified to review your requests.</p>
        </div>
      )}

      {/* Current holdings */}
      {holdings.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-bark-600 mb-3">Your Holdings</h2>
          <div className="bg-white border border-bark-200 rounded-2xl overflow-hidden divide-y divide-bark-100">
            {holdings.map(h => (
              <HoldingRow
                key={h.id}
                holding={h}
                quote={quotes[h.symbol] ?? null}
                childId={child.id}
                isTeen={isTeen}
                balance={balance}
              />
            ))}
          </div>
        </div>
      )}

      {/* Browse stocks */}
      <div>
        <h2 className="font-bold text-bark-600 mb-1">
          {isTeen ? '🔍 Stocks, ETFs & REITs' : '🔍 Browse Companies'}
        </h2>
        <p className="text-xs text-bark-400 mb-4">
          {isTeen
            ? 'Stocks, index funds, ETFs, and real estate (REITs) — all available to invest in'
            : 'Invest your Seeds in real companies. Watch prices move just like the real stock market!'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(stock => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              quote={quotes[stock.symbol] ?? null}
              childId={child.id}
              isTeen={isTeen}
              balance={balance}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
