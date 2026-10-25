import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SproutChildProfiles from '@/components/parent/SproutChildProfiles'

export default async function ChildrenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <div className="page-inner"><SproutChildProfiles /></div>
}
