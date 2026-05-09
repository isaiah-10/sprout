'use client'
import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, icon, suffix, className, id, ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-bark-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-bark-400 pointer-events-none">{icon}</div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full h-11 rounded-xl border bg-white text-bark-600 placeholder-bark-300',
            'text-sm transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-sprout-500 focus:border-transparent',
            error ? 'border-red-400' : 'border-bark-200 hover:border-bark-300',
            icon   ? 'pl-10' : 'pl-3.5',
            suffix ? 'pr-10' : 'pr-3.5',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 text-bark-400 pointer-events-none">{suffix}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-bark-400">{hint}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
