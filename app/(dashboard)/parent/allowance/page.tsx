import { createClient }    from '@/lib/supabase/server'
import { redirect }        from 'next/navigation'
import AllowanceManager    from '@/components/parent/AllowanceManager'

export default async function AllowancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: children }, { data: allowances }] = await Promise.all([
    supabase.from('child_profiles').select('id,name,avatar_emoji,color,date_of_birth,real_balance,virtual_balance').eq('parent_id', user.id),
    supabase.from('allowances').select('*').eq('parent_id', user.id).eq('active', true),
  ])

  return (
    <div className="page-inner">
      <h1 className="section-title">Allowance & Funding</h1>
      <p className="section-sub">Set up recurring allowances and add real money for your 13+ investors</p>
      <AllowanceManager
        parentId={user.id}
        children={children ?? []}
        allowances={allowances ?? []}
      />
    </div>
  )
}
