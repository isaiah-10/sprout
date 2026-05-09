// ============================================================
// SPROUT — Formatting Utilities
// ============================================================

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatSeeds(amount: number): string {
  return `🌱 ${new Intl.NumberFormat('en-US').format(Math.round(amount))}`
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatShares(shares: number): string {
  if (shares < 1) return shares.toFixed(4)
  if (Number.isInteger(shares)) return shares.toString()
  return shares.toFixed(2)
}

export function formatNumber(n: number, compact = false): string {
  if (compact && n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (compact && n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDateShort(date)
}

export function gainLossColor(value: number): string {
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-500'
  return 'text-bark-400'
}

export function gainLossBg(value: number): string {
  if (value > 0) return 'bg-green-50 text-green-700'
  if (value < 0) return 'bg-red-50 text-red-600'
  return 'bg-bark-100 text-bark-500'
}
