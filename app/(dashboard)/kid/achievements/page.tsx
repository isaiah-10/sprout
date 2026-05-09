import { createClient }   from '@/lib/supabase/server'
import { redirect }       from 'next/navigation'
import AchievementGrid    from '@/components/kid/AchievementGrid'
import { StatCard }       from '@/components/ui/Card'
import { getAge }         from '@/lib/utils/age'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase.from('child_profiles').select('id,date_of_birth,xp').eq('parent_id', user.id).order('created_at').limit(1).single()
  if (!child) redirect('/parent')

  const age = getAge(child.date_of_birth)

  const [{ data: allAchievements }, { data: earned }] = await Promise.all([
    supabase.from('achievements').select('*').lte('min_age', age).gte('max_age', age).order('category'),
    supabase.from('child_achievements').select('*, achievement:achievements(*)').eq('child_id', child.id),
  ])

  const earnedCount = earned?.length ?? 0
  const totalXPFromAchievements = earned?.reduce((s, e) => {
    const a = e.achievement as { xp_reward?: number }
    return s + (a?.xp_reward ?? 0)
  }, 0) ?? 0

  return (
    <div className="page-inner">
      <h1 className="section-title">🏆 Achievements</h1>
      <p className="section-sub">Earn badges by learning, investing, and playing. How many can you unlock?</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard label="Earned"     value={earnedCount.toString()}                    icon="🏅" color="gold" />
        <StatCard label="Available"  value={(allAchievements?.length ?? 0).toString()} icon="🔒" color="cream" />
        <StatCard label="XP from Badges" value={`${totalXPFromAchievements} XP`}      icon="⚡" color="blue" />
      </div>

      <AchievementGrid
        achievements={allAchievements ?? []}
        earned={earned ?? []}
      />
    </div>
  )
}
