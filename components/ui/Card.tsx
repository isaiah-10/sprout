import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, style, padding = 'md', hover = false, onClick }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' }

  return (
    <div
      onClick={onClick}
      style={style}
      className={clsx(
        'bg-white rounded-2xl border border-bark-200 shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-sprout-300 transition-all duration-150 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = 'green',
  className,
}: {
  label: string
  value: string | number
  sub?: string
  icon?: string
  color?: 'green' | 'gold' | 'blue' | 'red' | 'cream'
  className?: string
}) {
  const colors = {
    green: 'bg-leaf-light border-sprout-200',
    gold:  'bg-yellow-50  border-yellow-200',
    blue:  'bg-blue-50    border-blue-200',
    red:   'bg-red-50     border-red-200',
    cream: 'bg-bark-50    border-bark-200',
  }
  return (
    <div className={clsx('rounded-2xl border p-5', colors[color], className)}>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div className="text-2xl font-bold text-bark-600">{value}</div>
      <div className="text-sm font-medium text-bark-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-bark-400 mt-1">{sub}</div>}
    </div>
  )
}
