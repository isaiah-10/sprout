import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import LearnClient      from './LearnClient'
import { getAge }       from '@/lib/utils/age'

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase.from('child_profiles').select('id,date_of_birth').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const { data: progress } = await supabase.from('learn_progress').select('lesson_id').eq('child_id', child.id)
  const completedIds = new Set(progress?.map(p => p.lesson_id) ?? [])
  const age = getAge(child.date_of_birth)

  return <LearnClient childId={child.id} completedIds={Array.from(completedIds)} age={age} />
}
