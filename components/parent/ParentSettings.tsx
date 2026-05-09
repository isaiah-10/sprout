'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { getAge } from '@/lib/utils/age'
import type { Profile } from '@/lib/supabase/types'

interface ChildSetting {
  id: string; name: string; avatar_emoji: string; color: string
  date_of_birth: string; approval_mode: string; monthly_invest_limit: number | null
}

interface Props { profile: Profile | null; children: ChildSetting[] }

export default function ParentSettings({ profile, children }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)
  const [limits, setLimits] = useState<Record<string, string>>(
    Object.fromEntries(children.map(c => [c.id, c.monthly_invest_limit?.toString() ?? '']))
  )
  const [modes, setModes] = useState<Record<string, string>>(
    Object.fromEntries(children.map(c => [c.id, c.approval_mode]))
  )

  async function saveChild(childId: string) {
    setSaving(childId)
    const supabase = createClient()
    const limitVal = limits[childId] ? parseFloat(limits[childId]) : null
    await supabase.from('child_profiles').update({
      approval_mode: modes[childId],
      monthly_invest_limit: limitVal,
    }).eq('id', childId)
    setSaving(null)
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Account info */}
      <Card>
        <h2 className="font-bold text-bark-600 mb-4">👤 Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-bark-400">Name</span><span className="font-medium text-bark-600">{profile?.full_name}</span></div>
          <div className="flex justify-between"><span className="text-bark-400">Email</span><span className="font-medium text-bark-600">{profile?.email}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-bark-400">Plan</span>
            <Badge variant="green">{profile?.subscription_plan ?? 'Free Trial'}</Badge>
          </div>
        </div>
      </Card>

      {/* Per-child approval settings */}
      <Card>
        <h2 className="font-bold text-bark-600 mb-1">🔒 Investing Permissions per Child</h2>
        <p className="text-xs text-bark-400 mb-5">Ages 13–16 always require your approval. Ages 17–18 can be set to self-approve.</p>

        <div className="space-y-5">
          {children.map(child => {
            const age   = getAge(child.date_of_birth)
            const isTeen = age >= 13
            const is17plus = age >= 17

            if (!isTeen) return (
              <div key={child.id} className="flex items-center gap-3 py-3 border-b border-bark-100 last:border-0 opacity-50">
                <Avatar emoji={child.avatar_emoji} color={child.color} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-bark-600">{child.name}</p>
                  <p className="text-xs text-bark-400">Age {age} · Seeds mode (real investing unlocks at 13)</p>
                </div>
              </div>
            )

            return (
              <div key={child.id} className="py-3 border-b border-bark-100 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar emoji={child.avatar_emoji} color={child.color} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-bark-600">{child.name}</p>
                    <p className="text-xs text-bark-400">Age {age} · Real investing</p>
                  </div>
                </div>

                <div className="pl-11 space-y-3">
                  {is17plus && (
                    <Toggle
                      label="Allow self-approval"
                      description={`${child.name} can approve their own trades without asking you`}
                      checked={modes[child.id] === 'self'}
                      onChange={v => setModes(p => ({ ...p, [child.id]: v ? 'self' : 'all' }))}
                    />
                  )}
                  {!is17plus && (
                    <p className="text-xs text-bark-400 italic">All trades require your approval (ages 13–16)</p>
                  )}

                  <div className="flex items-end gap-3">
                    <Input
                      label="Monthly invest limit (USD)"
                      type="number"
                      min="0"
                      value={limits[child.id]}
                      onChange={e => setLimits(p => ({ ...p, [child.id]: e.target.value }))}
                      hint="Leave blank for no limit"
                      className="max-w-[180px]"
                    />
                    <Button size="sm" loading={saving === child.id} onClick={() => saveChild(child.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {children.length === 0 && (
            <p className="text-sm text-bark-400 text-center py-4">No children added yet</p>
          )}
        </div>
      </Card>
    </div>
  )
}
