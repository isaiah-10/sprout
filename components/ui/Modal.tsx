'use client'
import { useEffect } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlay?: boolean
}

export default function Modal({ open, onClose, title, children, size = 'md', closeOnOverlay = true }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', down)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', down)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <div className={clsx(
        'relative w-full bg-white rounded-3xl shadow-2xl animate-grow overflow-hidden',
        sizes[size]
      )}>
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-bark-100">
            <h2 className="text-lg font-bold text-bark-600">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-bark-400 hover:text-bark-600 hover:bg-bark-100 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-bark-400 hover:text-bark-600 hover:bg-bark-100 transition-colors">
            <X size={18} />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
