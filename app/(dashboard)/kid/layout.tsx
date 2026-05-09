import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import KidNav           from '@/components/layout/KidNav'
import { getAge }       from '@/lib/utils/age'

// Pass child data to child components via a layout-level server fetch
export default async function KidLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get first child — in a real session, we'd store selected child in cookie/session
  const { data: child } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at')
    .limit(1)
    .single()

  if (!child) redirect('/parent')

  const age    = getAge(child.date_of_birth)
  const isTeen = age >= 13

  // Dynamic background by age group
  const bgClass = age >= 17 ? 'bg-sprout-50'
    : age >= 13 ? 'bg-leaf-light/30'
    : age >= 9  ? 'bg-blue-50/40'
    : 'bg-yellow-50/40'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <KidNav child={child} isTeen={isTeen} />
      <div className="page-container-kid">
        {children}
      </div>
    </div>
  )
}
