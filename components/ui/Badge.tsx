import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'gold' | 'blue' | 'red' | 'gray' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ children, variant = 'green', size = 'md', className }: BadgeProps) {
  const variants = {
    green:   'bg-leaf-light  text-sprout-700 border border-sprout-200',
    gold:    'bg-yellow-50   text-yellow-700 border border-yellow-200',
    blue:    'bg-blue-50     text-blue-700   border border-blue-200',
    red:     'bg-red-50      text-red-600    border border-red-200',
    gray:    'bg-bark-100    text-bark-500   border border-bark-200',
    outline: 'bg-transparent text-sprout-700 border-2 border-sprout-300',
  }
  const sizes = {
    sm: 'text-xs px-2   py-0.5 rounded-full',
    md: 'text-xs px-2.5 py-1   rounded-full font-medium',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1 font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
