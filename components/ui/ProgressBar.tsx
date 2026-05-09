import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number        // 0–100
  max?: number
  color?: 'green' | 'gold' | 'blue' | 'red'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showPct?: boolean
  animated?: boolean
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'green',
  size = 'md',
  label,
  showPct = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    green: 'bg-sprout-500',
    gold:  'bg-yellow-400',
    blue:  'bg-blue-500',
    red:   'bg-red-500',
  }
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className={className}>
      {(label || showPct) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-bark-500">{label}</span>}
          {showPct && <span className="text-xs font-semibold text-bark-500">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-bark-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={clsx(colors[color], heights[size], 'rounded-full transition-all duration-700 ease-out', animated && 'transition-[width]')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
