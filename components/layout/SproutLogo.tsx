import { clsx } from 'clsx'

interface SproutLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showWordmark?: boolean
  className?: string
  light?: boolean    // white version for dark backgrounds
}

const sizes = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 32, text: 'text-xl' },
  lg: { icon: 44, text: 'text-2xl' },
  xl: { icon: 64, text: 'text-4xl' },
}

export default function SproutLogo({ size = 'md', showWordmark = true, className, light = false }: SproutLogoProps) {
  const { icon, text } = sizes[size]

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      {/* Clover SVG Icon */}
      <svg width={icon} height={icon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Four-leaf clover */}
        <circle cx="32" cy="20" r="12" fill={light ? '#B7E4C7' : '#2D6A4F'} opacity="0.9" />
        <circle cx="44" cy="32" r="12" fill={light ? '#B7E4C7' : '#2D6A4F'} opacity="0.9" />
        <circle cx="32" cy="44" r="12" fill={light ? '#B7E4C7' : '#2D6A4F'} opacity="0.9" />
        <circle cx="20" cy="32" r="12" fill={light ? '#B7E4C7' : '#2D6A4F'} opacity="0.9" />
        {/* Center hub */}
        <circle cx="32" cy="32" r="8"  fill={light ? '#D8F3DC' : '#40916C'} />
        {/* Stem */}
        <path d="M32 54 Q36 60 32 64" stroke={light ? '#95D5B2' : '#1B4332'} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Center dot */}
        <circle cx="32" cy="32" r="3"  fill={light ? '#52B788' : '#D8F3DC'} />
      </svg>

      {showWordmark && (
        <span className={clsx('font-bold tracking-tight', text, light ? 'text-white' : 'text-sprout-800')}>
          Sprout
        </span>
      )}
    </div>
  )
}
