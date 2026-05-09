'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Home, TrendingUp, Gamepad2, BookOpen, PiggyBank, Trophy } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import type { ChildProfile } from '@/lib/supabase/types'

const NAV_YOUNG = [
  { href: '/kid',             label: 'Home',    icon: Home },
  { href: '/kid/invest',      label: 'Invest',  icon: TrendingUp },
  { href: '/kid/games',       label: 'Games',   icon: Gamepad2 },
  { href: '/kid/savings',     label: 'Savings', icon: PiggyBank },
  { href: '/kid/learn',       label: 'Learn',   icon: BookOpen },
  { href: '/kid/achievements',label: 'Awards',  icon: Trophy },
]

const NAV_TEEN = [
  { href: '/kid',             label: 'Home',     icon: Home },
  { href: '/kid/invest',      label: 'Invest',   icon: TrendingUp },
  { href: '/kid/learn',       label: 'Learn',    icon: BookOpen },
  { href: '/kid/achievements',label: 'Awards',   icon: Trophy },
]

interface KidNavProps {
  child: ChildProfile
  isTeen: boolean
}

export default function KidNav({ child, isTeen }: KidNavProps) {
  const pathname = usePathname()
  const nav      = isTeen ? NAV_TEEN : NAV_YOUNG

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-white border-r border-bark-200 flex-col z-30">
        <div className="px-4 py-5 border-b border-bark-100 flex items-center gap-3">
          <Avatar emoji={child.avatar_emoji} color={child.color} size="md" />
          <div>
            <p className="font-bold text-bark-600 text-sm">{child.name}</p>
            <p className="text-xs text-bark-400">⭐ {child.xp} XP</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/kid' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-sprout-700 text-white shadow-sm'
                  : 'text-bark-500 hover:bg-bark-50 hover:text-bark-600'
              )}>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 pb-4 text-xs text-bark-300 border-t border-bark-100 pt-3">
          🌱 Sprout · {isTeen ? 'Investor' : 'Explorer'} Mode
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-bark-200 z-30 flex">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/kid' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={clsx(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors',
              active ? 'text-sprout-700' : 'text-bark-400'
            )}>
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
