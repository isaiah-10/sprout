'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

const AVATARS = ['🌱','🦁','🐺','🐯','🦊','🐧','🦋','🐸','🦄','🐙','🦖','🐬','🦅','🐼','🦔','🐝']
const COLORS  = ['#2D6A4F','#D97706','#7C3AED','#2563EB','#DC2626','#059669','#D946EF','#0891B2']

export default function AddChildForm({ parentId }: { parentId: string }) {
  const router  = useRouter()
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [form, setForm]     = useState({ name: '', dob: '', emoji: '🌱', color: COLORS[0], pin: '' })

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  async function save() {
    if (!form.name || !form.dob) { setError('Name and birthday required.'); return }
    if (!/^\d{4}$/.test(form.pin)) { setError('PIN must be 4 digits.'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('child_profiles').insert({
      parent_id: parentId, name: form.name, date_of_birth: form.dob,
      avatar_emoji: form.emoji, color: form.color, pin_hash: form.pin,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button variant="secondary" icon={<UserPlus size={16} />} onClick={() => setOpen(true)}>
        Add Another Child
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add a child" size="md">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <div className="space-y-4">
          <Input label="Child's first name" placeholder="Emma" value={form.name}
            onChange={e => set('name')(e.target.value)} />
          <Input label="Date of birth" type="date" value={form.dob}
            onChange={e => set('dob')(e.target.value)} />

          <div>
            <p className="text-sm font-semibold text-bark-600 mb-2">Avatar</p>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {AVATARS.map(e => (
                <button key={e} onClick={() => set('emoji')(e)}
                  className={`text-2xl h-9 rounded-xl transition-all ${form.emoji === e ? 'bg-leaf-light ring-2 ring-sprout-500' : 'hover:bg-bark-50'}`}>
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => set('color')(c)}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-sprout-500' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <Input label="4-digit PIN" type="password" maxLength={4} placeholder="••••"
            value={form.pin} onChange={e => set('pin')(e.target.value.replace(/\D/g, '').slice(0, 4))}
            hint="Kids use this to access their profile on a shared device" />

          <Button fullWidth size="lg" loading={loading} onClick={save}>
            Create Profile
          </Button>
        </div>
      </Modal>
    </>
  )
}
