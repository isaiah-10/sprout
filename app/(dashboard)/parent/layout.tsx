import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SproutLogo from '@/components/layout/SproutLogo'
import ParentSignOut from '@/components/parent/ParentSignOut'

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-bark-200">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap justify-between items-center gap-5">
          <Link href="/parent"><SproutLogo size="sm" /></Link>
          <nav aria-label="Parent account navigation" className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <Link href="/parent">Overview</Link>
            <Link href="/parent/children">Child profiles</Link>
            <Link href="/parent/learn">Curriculum</Link>
            <Link href="/parent/play">Practice games</Link>
            <ParentSignOut />
          </nav>
        </div>
      </header>
      <div className="page-container">{children}</div>
    </div>
  )
}
