import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import ParentNav        from '@/components/layout/ParentNav'

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Count pending approvals for badge
  const { count } = await supabase
    .from('trade_requests')
    .select('*', { count: 'exact', head: true })
    .eq('parent_id', user.id)
    .eq('status', 'pending')

  return (
    <div className="min-h-screen bg-cream">
      <ParentNav pendingApprovals={count ?? 0} />
      <div className="page-container">
        {children}
      </div>
    </div>
  )
}
