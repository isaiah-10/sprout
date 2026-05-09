import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { fetchQuote, mockQuote, SEED_PRICES } from '@/lib/stocks/alphavantage'

const CACHE_TTL_MS = 5 * 60 * 1000  // 5 minutes

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')?.toUpperCase()
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 })

  const supabase = await createServiceClient()

  // Check DB cache first
  const { data: cached } = await supabase
    .from('stock_quote_cache')
    .select('data, cached_at')
    .eq('symbol', symbol)
    .single()

  if (cached) {
    const age = Date.now() - new Date(cached.cached_at).getTime()
    if (age < CACHE_TTL_MS) {
      return NextResponse.json(cached.data)
    }
  }

  // Fetch from Alpha Vantage
  const quote = await fetchQuote(symbol)
  const data  = quote ?? mockQuote(symbol, SEED_PRICES[symbol] ?? 100)

  // Upsert cache
  await supabase.from('stock_quote_cache').upsert({
    symbol,
    data: {
      symbol:     data.symbol,
      name:       data.name,
      price:      data.price,
      change:     data.change,
      change_pct: data.changePct,
      volume:     data.volume,
    },
    cached_at: new Date().toISOString(),
  })

  return NextResponse.json({
    symbol:     data.symbol,
    name:       data.name,
    price:      data.price,
    change:     data.change,
    change_pct: data.changePct,
    volume:     data.volume,
  })
}
