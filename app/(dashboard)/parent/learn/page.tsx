import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SproutLearning from '@/components/parent/SproutLearning'

export default async function ParentLearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <div className="page-inner"><SproutLearning /></div>
}
