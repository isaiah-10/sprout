'use client'
import { clsx } from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={clsx('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sprout-500',
          checked ? 'bg-sprout-600' : 'bg-bark-200'
        )}
      >
        <span className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-semibold text-bark-600">{label}</p>}
          {description && <p className="text-xs text-bark-400">{description}</p>}
        </div>
      )}
    </label>
  )
}
