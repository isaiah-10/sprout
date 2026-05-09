import { clsx } from 'clsx'

interface AvatarProps {
  emoji?: string
  color?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'w-6  h-6  text-xs',
  sm: 'w-8  h-8  text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-2xl',
  xl: 'w-20 h-20 text-4xl',
}

export default function Avatar({ emoji = '🌱', color = '#52B788', name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={clsx('rounded-full flex items-center justify-center font-medium flex-shrink-0', sizes[size], className)}
      style={{ backgroundColor: `${color}22`, border: `2px solid ${color}44` }}
      title={name}
    >
      {emoji}
    </div>
  )
}
