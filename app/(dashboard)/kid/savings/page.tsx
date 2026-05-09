import { createClient }   from '@/lib/supabase/server'
import { redirect }       from 'next/navigation'
import SavingsGoalsPanel  from '@/components/kid/SavingsGoal'
import { StatCard }       from '@/components/ui/Card'
import { getAge }         from '@/lib/utils/age'
import { formatSeeds }    from '@/lib/utils/format'

export default async function SavingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase.from('child_profiles').select('id,date_of_birth,virtual_balance').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const age = getAge(child.date_of_birth)
  if (age >= 13) redirect('/kid/invest')  // teens don't use this page

  const { data: goals } = await supabase.from('savings_goals').select('*').eq('child_id', child.id).order('created_at')

  const completed   = goals?.filter(g => g.completed).length ?? 0
  const totalSaved  = goals?.reduce((s, g) => s + g.current_amount, 0) ?? 0

  return (
    <div className="page-inner">
      <h1 className="section-title">🐷 Savings Goals</h1>
      <p className="section-sub">Set goals and save your Seeds to reach them!</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Seeds Balance" value={formatSeeds(child.virtual_balance)} icon="🌱" color="green" />
        <StatCard label="Goals Active"  value={(goals?.length ?? 0).toString()} icon="🎯" color="gold" />
        <StatCard label="Goals Done"    value={completed.toString()} icon="✅" color="blue" />
      </div>

      <SavingsGoalsPanel goals={goals ?? []} childId={child.id} />
    </div>
  )
}
