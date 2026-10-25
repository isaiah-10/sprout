import { clsx } from 'clsx'

interface SproutLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showWordmark?: boolean
  className?: string
  light?: boolean
}

const sizes = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 32, text: 'text-xl' },
  lg: { icon: 44, text: 'text-2xl' },
  xl: { icon: 64, text: 'text-4xl' },
}

/** Approved Sprout logo: one green leaf, never a clover or multiple leaves. */
export default function SproutLogo({ size = 'md', showWordmark = true, className, light = false }: SproutLogoProps) {
  const { icon, text } = sizes[size]
  const leafColor = light ? '#B7E4C7' : '#2D6A4F'
  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <svg width={icon} height={icon} viewBox="0 0 64 64" role="img" aria-label="Sprout single leaf" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 52C12 29 27 11 54 8c1 28-13 45-35 46-3 0-5-1-7-2Z" fill={leafColor}/>
        <path d="M12 52c12-19 22-26 37-37" fill="none" stroke={light ? '#356A49' : '#D8F3DC'} strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
      {showWordmark && (
        <span className={clsx('font-bold tracking-tight', text, light ? 'text-white' : 'text-sprout-800')}>
          Sprout
        </span>
      )}
    </div>
  )
}
