'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { LayoutDashboard, Users, Bell, DollarSign, Settings, LogOut } from 'lucide-react'
import SproutLogo from './SproutLogo'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/parent',           label: 'Overview',   icon: LayoutDashboard },
  { href: '/parent/children',  label: 'My Kids',    icon: Users },
  { href: '/parent/approvals', label: 'Approvals',  icon: Bell },
  { href: '/parent/allowance', label: 'Allowance',  icon: DollarSign },
  { href: '/parent/settings',  label: 'Settings',   icon: Settings },
]

interface ParentNavProps {
  pendingApprovals?: number
}

export default function ParentNav({ pendingApprovals = 0 }: ParentNavProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-bark-200 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-bark-100">
        <SproutLogo size="md" />
        <p className="text-xs text-bark-400 mt-1 ml-1">Parent Dashboard</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/parent' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              active
                ? 'bg-sprout-700 text-white shadow-sm'
                : 'text-bark-500 hover:bg-bark-50 hover:text-bark-600'
            )}>
              <Icon size={18} />
              {label}
              {label === 'Approvals' && pendingApprovals > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingApprovals > 9 ? '9+' : pendingApprovals}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 border-t border-bark-100 pt-3">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-bark-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
