'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, DollarSign, Coins } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { addDays, addWeeks, addMonths, format } from 'date-fns'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import { formatCurrency, formatSeeds } from '@/lib/utils/format'
import { getAge } from '@/lib/utils/age'
import type { Allowance } from '@/lib/supabase/types'

interface ChildBasic { id: string; name: string; avatar_emoji: string; color: string; date_of_birth: string; real_balance: number; virtual_balance: number }
interface Props { parentId: string; children: ChildBasic[]; allowances: Allowance[] }

const FREQ_OPTIONS = [
  { value: 'weekly',    label: 'Every week' },
  { value: 'biweekly',  label: 'Every 2 weeks' },
  { value: 'monthly',   label: 'Every month' },
]

function nextDate(freq: string) {
  const now = new Date()
  if (freq === 'weekly')   return format(addWeeks(now, 1), 'yyyy-MM-dd')
  if (freq === 'biweekly') return format(addDays(now, 14),  'yyyy-MM-dd')
  return format(addMonths(now, 1), 'yyyy-MM-dd')
}

export default function AllowanceManager({ parentId, children, allowances: initial }: Props) {
  const router = useRouter()
  const [allowances, setAllowances] = useState(initial)
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [deposit, setDeposit] = useState({ childId: '', amount: '' })
  const [depositOpen, setDepositOpen] = useState(false)

  const [form, setForm] = useState({ childId: '', amount: '', frequency: 'weekly', type: 'seeds' })
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const selectedChild = children.find(c => c.id === form.childId)
  const childAge = selectedChild ? getAge(selectedChild.date_of_birth) : 0

  async function saveAllowance() {
    if (!form.childId || !form.amount) { setError('Select a child and enter an amount.'); return }
    const amt = parseFloat(form.amount)
    if (isNaN(amt) || amt <= 0) { setError('Enter a valid amount.'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.from('allowances').insert({
      child_id: form.childId, parent_id: parentId,
      amount: amt, currency_type: form.type,
      frequency: form.frequency,
      next_payment_date: nextDate(form.frequency),
    }).select().single()
    if (err) { setError(err.message); setLoading(false); return }
    setAllowances(p => [...p, data])
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function deleteAllowance(id: string) {
    const supabase = createClient()
    await supabase.from('allowances').update({ active: false }).eq('id', id)
    setAllowances(p => p.filter(a => a.id !== id))
  }

  async function addDeposit() {
    const amt = parseFloat(deposit.amount)
    if (!deposit.childId || isNaN(amt) || amt <= 0) { setError('Select a child and enter an amount.'); return }
    setLoading(true)
    const supabase = createClient()
    // Add to real_balance
    const child = children.find(c => c.id === deposit.childId)!
    await supabase.from('child_profiles').update({ real_balance: (child.real_balance || 0) + amt }).eq('id', deposit.childId)
    await supabase.from('real_transactions').insert({
      child_id: deposit.childId, type: 'deposit', total_amount: amt, note: 'Parent deposit',
    })
    setLoading(false)
    setDepositOpen(false)
    router.refresh()
  }

  const allowanceChild = (childId: string) => children.find(c => c.id === childId)

  return (
    <div className="space-y-8">
      {/* One-time deposit section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-bark-600">💰 Add Real Money (13+)</h2>
            <p className="text-xs text-bark-400 mt-0.5">Fund your teen&apos;s investment account directly</p>
          </div>
          <Button onClick={() => setDepositOpen(true)} icon={<DollarSign size={16} />}>Add Funds</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {children.filter(c => getAge(c.date_of_birth) >= 13).map(c => (
            <div key={c.id} className="bg-bark-50 rounded-xl p-3 flex items-center gap-3">
              <Avatar emoji={c.avatar_emoji} color={c.color} size="sm" />
              <div>
                <p className="text-sm font-semibold text-bark-600">{c.name}</p>
                <p className="text-xs text-sprout-600 font-bold">{formatCurrency(c.real_balance)}</p>
              </div>
            </div>
          ))}
          {children.filter(c => getAge(c.date_of_birth) < 13).map(c => (
            <div key={c.id} className="bg-bark-50 rounded-xl p-3 flex items-center gap-3 opacity-50">
              <Avatar emoji={c.avatar_emoji} color={c.color} size="sm" />
              <div>
                <p className="text-sm font-semibold text-bark-600">{c.name}</p>
                <p className="text-xs text-bark-400">Seeds mode · under 13</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recurring allowances */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-bark-600">🔄 Recurring Allowances</h2>
            <p className="text-xs text-bark-400 mt-0.5">Automatically send Seeds or money on a schedule</p>
          </div>
          <Button variant="secondary" onClick={() => setOpen(true)} icon={<Plus size={16} />}>New Allowance</Button>
        </div>

        {allowances.length === 0 ? (
          <div className="text-center py-8 text-bark-400 text-sm">No allowances set up yet</div>
        ) : (
          <div className="space-y-3">
            {allowances.map(a => {
              const c = allowanceChild(a.child_id)
              return (
                <div key={a.id} className="flex items-center gap-3 py-3 border-b border-bark-100 last:border-0">
                  {c && <Avatar emoji={c.avatar_emoji} color={c.color} size="sm" />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-bark-600">{c?.name}</p>
                    <p className="text-xs text-bark-400">
                      {a.currency_type === 'seeds' ? `🌱 ${a.amount} Seeds` : formatCurrency(a.amount)} · {a.frequency} · next {a.next_payment_date}
                    </p>
                  </div>
                  <button onClick={() => deleteAllowance(a.id)} className="text-bark-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* New allowance modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="New Allowance" size="sm">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        <div className="space-y-4">
          <Select label="Child" value={form.childId} onChange={e => set('childId')(e.target.value)}
            options={[{ value: '', label: 'Select a child...' }, ...children.map(c => ({ value: c.id, label: c.name }))]} />

          {selectedChild && (
            <Select label="Currency type" value={form.type} onChange={e => set('type')(e.target.value)}
              options={[
                { value: 'seeds', label: '🌱 Seeds (virtual — for under 13)' },
                ...(childAge >= 13 ? [{ value: 'real', label: '💰 Real money (for 13+)' }] : []),
              ]} />
          )}

          <Input label="Amount" type="number" min="1" value={form.amount}
            onChange={e => set('amount')(e.target.value)}
            suffix={<span className="text-xs">{form.type === 'seeds' ? 'Seeds' : 'USD'}</span>} />

          <Select label="Frequency" value={form.frequency} onChange={e => set('frequency')(e.target.value)} options={FREQ_OPTIONS} />

          <Button fullWidth size="lg" loading={loading} onClick={saveAllowance} icon={<Coins size={16} />}>
            Create Allowance
          </Button>
        </div>
      </Modal>

      {/* Deposit modal */}
      <Modal open={depositOpen} onClose={() => setDepositOpen(false)} title="Add Real Money" size="sm">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        <div className="space-y-4">
          <Select label="Child (13+)" value={deposit.childId}
            onChange={e => setDeposit(p => ({ ...p, childId: e.target.value }))}
            options={[
              { value: '', label: 'Select a child...' },
              ...children.filter(c => getAge(c.date_of_birth) >= 13).map(c => ({ value: c.id, label: c.name })),
            ]} />
          <Input label="Amount (USD)" type="number" min="1" value={deposit.amount}
            onChange={e => setDeposit(p => ({ ...p, amount: e.target.value }))}
            suffix={<DollarSign size={14} />} />
          <p className="text-xs text-bark-400 bg-bark-50 rounded-xl p-3">
            💳 Stripe payment will be added soon. For now, this manually credits their account balance for testing.
          </p>
          <Button fullWidth size="lg" loading={loading} onClick={addDeposit} icon={<DollarSign size={16} />}>
            Add Funds
          </Button>
        </div>
      </Modal>
    </div>
  )
}
