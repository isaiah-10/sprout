// ============================================================
// SPROUT — Alpha Vantage Stock Data Client
// Free tier: 25 req/day. We cache aggressively in Supabase.
// ============================================================

const BASE_URL = 'https://www.alphavantage.co/query'
const API_KEY  = process.env.ALPHA_VANTAGE_API_KEY ?? 'demo'

export interface AVQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
  change_pct: number   // snake_case alias — satisfies StockQuote interface
  high: number
  low: number
  volume: number
  latestTradingDay: string
  previousClose: number
}

export interface AVHistoryPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// ─── Fetch real-time quote ────────────────────────────────────
export async function fetchQuote(symbol: string): Promise<AVQuote | null> {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    const res  = await fetch(url, { next: { revalidate: 300 } }) // 5-min Next.js cache
    const json = await res.json()
    const q    = json['Global Quote']
    if (!q || !q['05. price']) return null

    const changePct = parseFloat(q['10. change percent'].replace('%', ''))
    return {
      symbol:           q['01. symbol'],
      name:             symbol,
      price:            parseFloat(q['05. price']),
      change:           parseFloat(q['09. change']),
      changePct,
      change_pct:       changePct,
      high:             parseFloat(q['03. high']),
      low:              parseFloat(q['04. low']),
      volume:           parseInt(q['06. volume'], 10),
      latestTradingDay: q['07. latest trading day'],
      previousClose:    parseFloat(q['08. previous close']),
    }
  } catch {
    return null
  }
}

// ─── Fetch daily history (last 30 days) ──────────────────────
export async function fetchHistory(
  symbol: string,
  outputsize: 'compact' | 'full' = 'compact'
): Promise<AVHistoryPoint[]> {
  try {
    const url  = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${API_KEY}`
    const res  = await fetch(url, { next: { revalidate: 3600 } }) // 1-hr Next.js cache
    const json = await res.json()
    const ts   = json['Time Series (Daily)']
    if (!ts) return []

    return Object.entries(ts)
      .slice(0, 30)
      .map(([date, vals]) => {
        const v = vals as Record<string, string>
        return {
          date,
          open:   parseFloat(v['1. open']),
          high:   parseFloat(v['2. high']),
          low:    parseFloat(v['3. low']),
          close:  parseFloat(v['4. close']),
          volume: parseInt(v['5. volume'], 10),
        }
      })
      .reverse() // oldest → newest
  } catch {
    return []
  }
}

// ─── Search symbols ──────────────────────────────────────────
export async function searchSymbols(keywords: string): Promise<{ symbol: string; name: string }[]> {
  try {
    const url  = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${API_KEY}`
    const res  = await fetch(url)
    const json = await res.json()
    const matches = json['bestMatches'] ?? []
    return matches.slice(0, 8).map((m: Record<string, string>) => ({
      symbol: m['1. symbol'],
      name:   m['2. name'],
    }))
  } catch {
    return []
  }
}

// ─── Mock price movement (used as fallback / for demos) ──────
// Generates realistic-looking price data seeded by symbol name
export function mockQuote(symbol: string, basePrice: number): AVQuote {
  const seed   = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const jitter = ((seed % 200) - 100) / 10000 // ±1% noise
  const price  = basePrice * (1 + jitter)
  const change = price - basePrice

  const changePct = parseFloat(((change / basePrice) * 100).toFixed(2))
  return {
    symbol,
    name:             symbol,
    price:            parseFloat(price.toFixed(2)),
    change:           parseFloat(change.toFixed(2)),
    changePct,
    change_pct:       changePct,
    high:             parseFloat((price * 1.005).toFixed(2)),
    low:              parseFloat((price * 0.995).toFixed(2)),
    volume:           Math.abs(seed * 1234) % 50_000_000 + 1_000_000,
    latestTradingDay: new Date().toISOString().split('T')[0],
    previousClose:    basePrice,
  }
}

// ─── Realistic seed prices (used if API is unavailable) ──────
export const SEED_PRICES: Record<string, number> = {
  AAPL: 189.30, GOOGL: 175.84, MSFT: 420.55, AMZN: 196.78,
  META: 545.83, NFLX: 780.25,  DIS:   98.42, TSLA: 248.10,
  NVDA: 875.00, SNAP:  10.55,  SPOT: 312.40,  RBLX:  41.20,
  ABNB: 142.30, UBER:  73.15,  NKE:   90.22,  MCD:  286.00,
  SBUX:  79.40, COST:  896.00, V:    278.00,  JPM:  198.50,
  SPY:  527.00, QQQ:  453.00,  VTI:  265.00,  VOO:  482.00,
  ARKK:  46.20, VNQ:   83.50,  O:     53.80,  AMT:  186.00,
}
