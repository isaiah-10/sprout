'use client'
import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-500 focus-visible:ring-offset-2 active:scale-[0.98] select-none'

  const variants = {
    primary:   'bg-sprout-700 text-white hover:bg-sprout-800 shadow-sm disabled:bg-bark-200 disabled:text-bark-400',
    secondary: 'bg-leaf-light text-sprout-800 hover:bg-sprout-200 border border-sprout-200',
    ghost:     'text-sprout-700 hover:bg-sprout-50 hover:text-sprout-800',
    danger:    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    outline:   'border-2 border-sprout-700 text-sprout-700 hover:bg-sprout-50 bg-transparent',
  }

  const sizes = {
    sm: 'h-8  px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  )
})
Button.displayName = 'Button'
export default Button
