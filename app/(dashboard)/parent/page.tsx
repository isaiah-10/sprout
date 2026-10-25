import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ParentOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: children, error } = await supabase.from('sprout_child_profiles')
    .select('id,nickname,age_band,consent_status').eq('parent_id',user.id).order('created_at')
  const { data: profile } = await supabase.from('sprout_adult_profiles').select('display_name').eq('user_id',user.id).maybeSingle()
  return (
    <section className="page-inner space-y-6">
      <div><h1 className="text-3xl font-black text-sprout-800">Welcome to Sprout</h1>
        <p className="text-bark-500 mt-2">Adult-managed family learning · No payments or subscriptions.</p></div>
      {error && <p role="alert" className="text-red-700">Could not load family profiles: {error.message}</p>}
      <div className="bg-white rounded-2xl border border-bark-200 p-7">
        <h2 className="text-xl font-bold text-sprout-800 mb-3">Your family</h2>
        <p className="text-bark-500">Hi {profile?.display_name || user.email?.split('@')[0] || 'there'}! You have {children?.length ?? 0} child profile(s).</p>
        <p className="text-sm text-amber-800 mt-3">Learning is locked for children until the parental consent verification system has been tested and enabled. This ensures no child-data collection begins without appropriate controls.</p>
        <Link href="/parent/children" className="inline-block bg-sprout-700 text-white px-5 py-3 rounded-xl font-semibold mt-6">Manage child profiles</Link>
      </div>
      <div className="bg-white rounded-2xl border border-bark-200 p-7">
        <h2 className="text-xl font-bold text-sprout-800 mb-2">Explore · Build · Thrive</h2>
        <p className="text-bark-500">Sprout is preparing the full 40-module experience for families ages 5–17. We will not show unfinished lessons, charge money or suggest real investing.</p>
      </div>
    </section>
  )
}
