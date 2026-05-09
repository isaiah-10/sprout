import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import Link              from 'next/link'
import { Plus }          from 'lucide-react'
import ChildCard         from '@/components/parent/ChildCard'
import AddChildForm      from '@/components/parent/AddChildForm'
import { getAge }        from '@/lib/utils/age'

export default async function ChildrenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('subscription_plan').eq('id', user.id).single()
  const { data: children } = await supabase.from('child_profiles').select('*').eq('parent_id', user.id).order('created_at')

  const maxChildren = profile?.subscription_plan === 'family' ? 4 : 1
  const canAdd      = (children?.length ?? 0) < maxChildren

  return (
    <div className="page-inner">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="section-title">My Kids</h1>
          <p className="section-sub">Manage your children&apos;s profiles and settings</p>
        </div>
        {canAdd && (
          <Link href="/parent/children?add=1" className="flex items-center gap-2 bg-sprout-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-sprout-800 transition-colors">
            <Plus size={16} /> Add Child
          </Link>
        )}
      </div>

      {!canAdd && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm text-yellow-700">
          <strong>Family plan</strong> supports up to {maxChildren} kids.{' '}
          <Link href="/parent/settings" className="underline font-semibold">Upgrade</Link> to add more.
        </div>
      )}

      {(!children || children.length === 0) ? (
        <div className="bg-white border border-bark-200 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <p className="font-bold text-bark-600 mb-2">Add your first child</p>
          <p className="text-bark-400 text-sm mb-6">Create a profile and they can start learning right away</p>
          <AddChildForm parentId={user.id} />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {children.map(child => (
              <ChildCard key={child.id} child={child} age={getAge(child.date_of_birth)} />
            ))}
          </div>
          {canAdd && <AddChildForm parentId={user.id} />}
        </>
      )}
    </div>
  )
}
