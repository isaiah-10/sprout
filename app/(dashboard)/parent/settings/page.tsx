import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import ParentSettings   from '@/components/parent/ParentSettings'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('child_profiles').select('id,name,avatar_emoji,color,date_of_birth,approval_mode,monthly_invest_limit').eq('parent_id', user.id),
  ])

  return (
    <div className="page-inner">
      <h1 className="section-title">Settings</h1>
      <p className="section-sub">Manage your account and each child&apos;s investing permissions</p>
      <ParentSettings profile={profile} children={children ?? []} />
    </div>
  )
}
