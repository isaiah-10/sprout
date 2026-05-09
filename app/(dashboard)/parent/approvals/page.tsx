'use client'
import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ApprovalCard from '@/components/parent/ApprovalCard'
import Skeleton from '@/components/ui/Skeleton'
import type { TradeRequest } from '@/lib/supabase/types'

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<TradeRequest[]>([])
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('trade_requests')
      .select('*, child:child_profiles(id,name,avatar_emoji,color)')
      .eq('parent_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    setRequests((data as TradeRequest[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="page-inner">
      <div className="flex items-center gap-3 mb-2">
        <Bell size={22} className="text-sprout-700" />
        <h1 className="section-title mb-0">Trade Approvals</h1>
        {requests.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
            {requests.length}
          </span>
        )}
      </div>
      <p className="section-sub">Review and approve or deny your kids&apos; investment requests.</p>

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-bark-200 rounded-2xl p-16 text-center">
          <CheckCircle size={40} className="text-sprout-400 mx-auto mb-4" />
          <p className="font-bold text-bark-600 mb-1">All caught up!</p>
          <p className="text-bark-400 text-sm">No pending trade requests from your kids.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {requests.map(r => (
            <ApprovalCard key={r.id} request={r} onReviewed={load} />
          ))}
        </div>
      )}
    </div>
  )
}
