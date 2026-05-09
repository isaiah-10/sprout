import { createClient }   from '@/lib/supabase/server'
import { redirect }       from 'next/navigation'
import Link               from 'next/link'
import { Bell, Plus }     from 'lucide-react'
import { StatCard }       from '@/components/ui/Card'
import ChildCard          from '@/components/parent/ChildCard'
import ActivityFeed       from '@/components/parent/ActivityFeed'
import { formatCurrency } from '@/lib/utils/format'
import { getAge }         from '@/lib/utils/age'

export default async function ParentOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: children }, { data: pending }, { data: activity }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('child_profiles').select('*').eq('parent_id', user.id).order('created_at'),
    supabase.from('trade_requests').select('*, child_profiles(name,avatar_emoji,color)')
      .eq('parent_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('activity_log').select('*, child_profiles(name,avatar_emoji,color)')
      .eq('parent_id', user.id).order('created_at', { ascending: false }).limit(10),
  ])

  const totalVirtual = children?.reduce((s, c) => s + (c.virtual_balance ?? 0), 0) ?? 0
  const totalReal    = children?.reduce((s, c) => s + (c.real_balance ?? 0), 0) ?? 0
  const totalXP      = children?.reduce((s, c) => s + (c.xp ?? 0), 0) ?? 0

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="page-inner">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-bark-600">Hey, {firstName} 👋</h1>
          <p className="text-bark-400 text-sm mt-0.5">Here&apos;s what your kids are up to</p>
        </div>
        <div className="flex items-center gap-3">
          {(pending?.length ?? 0) > 0 && (
            <Link href="/parent/approvals" className="relative flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
              <Bell size={16} />
              {pending!.length} pending approval{pending!.length !== 1 ? 's' : ''}
            </Link>
          )}
          <Link href="/parent/children" className="flex items-center gap-2 bg-sprout-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-sprout-800 transition-colors">
            <Plus size={16} />
            Add child
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Kids enrolled"       value={children?.length ?? 0}           icon="👧"  color="green" />
        <StatCard label="Virtual Seeds total" value={`🌱 ${Math.round(totalVirtual).toLocaleString()}`} icon="🌱" color="cream" />
        <StatCard label="Real money invested" value={formatCurrency(totalReal)}        icon="💰"  color="gold" />
        <StatCard label="Total XP earned"     value={`${totalXP.toLocaleString()} XP`} icon="⚡" color="blue" />
      </div>

      {/* Children cards */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Your Kids</h2>
          <Link href="/parent/children" className="text-sm text-sprout-600 font-semibold hover:underline">Manage →</Link>
        </div>

        {(!children || children.length === 0) ? (
          <div className="bg-white border border-bark-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <p className="font-bold text-bark-600 mb-2">No kids added yet</p>
            <p className="text-bark-400 text-sm mb-5">Add your first child to get started</p>
            <Link href="/parent/children" className="bg-sprout-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-sprout-800 transition-colors inline-flex items-center gap-2">
              <Plus size={16} /> Add first child
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map(child => (
              <ChildCard key={child.id} child={child} age={getAge(child.date_of_birth)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="section-title mb-4">Recent Activity</h2>
        <ActivityFeed entries={activity ?? []} />
      </div>
    </div>
  )
}
