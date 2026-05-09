'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatSeeds } from '@/lib/utils/format'
import type { SavingsGoal as Goal } from '@/lib/supabase/types'

const GOAL_EMOJIS = ['🎮','🚲','📱','🎸','⚽','🏀','🎨','🎤','🐶','🌍','📚','✈️']

interface Props { goals: Goal[]; childId: string }

export default function SavingsGoalsPanel({ goals: initial, childId }: Props) {
  const router = useRouter()
  const [goals, setGoals] = useState(initial)
  const [open, setOpen]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm]   = useState({ title: '', target: '', emoji: '🎮' })

  async function save() {
    const amt = parseFloat(form.target)
    if (!form.title || isNaN(amt) || amt <= 0) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('savings_goals').insert({
      child_id: childId, title: form.title, emoji: form.emoji, target_amount: amt,
    }).select().single()
    if (data) setGoals(p => [...p, data])
    setLoading(false)
    setOpen(false)
    setForm({ title: '', target: '', emoji: '🎮' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-bark-600">🎯 Savings Goals</h2>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)} icon={<Plus size={14} />}>New Goal</Button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white border border-bark-200 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-2">🎯</p>
          <p className="text-sm text-bark-400">No goals yet — what are you saving for?</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min(100, (g.current_amount / g.target_amount) * 100)
            return (
              <Card key={g.id} className={g.completed ? 'opacity-75' : ''}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-bark-600 text-sm">{g.title}</p>
                    <p className="text-xs text-bark-400">
                      {formatSeeds(g.current_amount)} of {formatSeeds(g.target_amount)}
                    </p>
                  </div>
                  {g.completed && <Check size={18} className="text-sprout-500" />}
                </div>
                <ProgressBar value={pct} color={g.completed ? 'green' : 'gold'} size="md" showPct />
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New Savings Goal" size="sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-bark-600 mb-2">What are you saving for?</p>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {GOAL_EMOJIS.map(e => (
                <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))}
                  className={`text-2xl h-10 rounded-xl transition-all ${form.emoji === e ? 'bg-leaf-light ring-2 ring-sprout-500' : 'hover:bg-bark-50'}`}>
                  {e}
                </button>
              ))}
            </div>
            <Input placeholder="Goal name (e.g. New bike)" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <Input label="Target amount (Seeds 🌱)" type="number" value={form.target}
            onChange={e => setForm(p => ({ ...p, target: e.target.value }))} />
          <Button fullWidth size="lg" loading={loading} onClick={save}>Create Goal</Button>
        </div>
      </Modal>
    </div>
  )
}
