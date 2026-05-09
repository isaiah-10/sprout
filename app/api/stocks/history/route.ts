import { NextResponse, type NextRequest } from 'next/server'
import { fetchHistory, SEED_PRICES } from '@/lib/stocks/alphavantage'

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')?.toUpperCase()
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 })

  const history = await fetchHistory(symbol)

  // If no history from API, generate realistic mock data
  if (!history.length) {
    const base   = SEED_PRICES[symbol] ?? 150
    const points = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const noise = (Math.random() - 0.48) * (base * 0.025)
      const close = parseFloat((base + noise * (i + 1) * 0.1).toFixed(2))
      return {
        date:   date.toISOString().split('T')[0],
        open:   parseFloat((close * 0.998).toFixed(2)),
        high:   parseFloat((close * 1.005).toFixed(2)),
        low:    parseFloat((close * 0.995).toFixed(2)),
        close,
        volume: Math.floor(Math.random() * 50_000_000 + 5_000_000),
      }
    })
    return NextResponse.json(points)
  }

  return NextResponse.json(history)
}
