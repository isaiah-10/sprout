'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SproutLogo from '@/components/layout/SproutLogo'

const AVATARS = ['🌱','🦁','🐺','🐯','🦊','🐧','🦋','🐸','🦄','🐙','🦖','🐬','🦅','🐼','🦔','🐝']
const COLORS  = ['#2D6A4F','#D97706','#7C3AED','#2563EB','#DC2626','#059669','#D946EF','#0891B2']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const [child, setChild] = useState({
    name: '', dob: '', emoji: '🌱', color: COLORS[0], pin: '',
  })

  const steps = [
    { title: '👋 Welcome to Sprout!', sub: 'Let\'s set up your first child\'s profile in just a few steps.' },
    { title: '🧒 Tell us about them',  sub: 'This helps us customize their experience by age.' },
    { title: '🎨 Pick an avatar',       sub: 'Let them choose their favorite!' },
    { title: '🔒 Set a PIN',            sub: 'This 4-digit PIN lets them access their profile on a shared device.' },
  ]

  async function finish() {
    if (!child.name || !child.dob) { setError('Please fill in name and birthday.'); return }
    if (child.pin.length !== 4 || !/^\d{4}$/.test(child.pin)) { setError('PIN must be exactly 4 digits.'); return }
    setLoading(true)
    setError('')

    const supabase  = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: err } = await supabase.from('child_profiles').insert({
      parent_id:    user.id,
      name:         child.name,
      date_of_birth: child.dob,
      avatar_emoji: child.emoji,
      color:        child.color,
      // In production, hash the PIN server-side — here we store a placeholder
      pin_hash:     child.pin, // TODO: hash via API route before storing
    })

    if (err) { setError(err.message); setLoading(false); return }
    router.push('/parent')
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-sprout-600' : 'bg-bark-200'}`} />
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-bark-200 shadow-sm p-8">
        <div className="flex justify-center mb-5"><SproutLogo size="sm" /></div>
        <h1 className="text-2xl font-black text-bark-600 text-center mb-1">{steps[step].title}</h1>
        <p className="text-sm text-bark-400 text-center mb-8">{steps[step].sub}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div className="space-y-4 text-center">
                <div className="text-6xl">🌱</div>
                <p className="text-bark-500 text-sm leading-relaxed">
                  Sprout teaches your kids about money through games and real investing. You control everything — approve trades, set allowances, track progress.
                </p>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[['🎮','Fun games'],['📈','Real stocks'],['🔒','You control']].map(([e, l]) => (
                    <div key={l} className="bg-leaf-light rounded-2xl p-3 text-center">
                      <div className="text-2xl mb-1">{e}</div>
                      <p className="text-xs font-semibold text-sprout-700">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <Input label="Child's first name" placeholder="e.g. Emma" value={child.name}
                  onChange={e => setChild(p => ({ ...p, name: e.target.value }))} />
                <Input label="Date of birth" type="date" value={child.dob}
                  onChange={e => setChild(p => ({ ...p, dob: e.target.value }))}
                  hint="We use this to give them the right experience for their age" />
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-semibold text-bark-500 mb-3">Choose an emoji avatar</p>
                <div className="grid grid-cols-8 gap-2 mb-5">
                  {AVATARS.map(e => (
                    <button key={e} onClick={() => setChild(p => ({ ...p, emoji: e }))}
                      className={`text-2xl h-10 rounded-xl transition-all ${child.emoji === e ? 'bg-leaf-light ring-2 ring-sprout-500' : 'hover:bg-bark-50'}`}>
                      {e}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-semibold text-bark-500 mb-3">Choose a color</p>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setChild(p => ({ ...p, color: c }))}
                      className={`w-8 h-8 rounded-full transition-all ${child.color === c ? 'ring-2 ring-offset-2 ring-sprout-500 scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                {/* Preview */}
                <div className="mt-5 p-4 bg-bark-50 rounded-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: child.color + '22', border: `2px solid ${child.color}44` }}>
                    {child.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-bark-600">{child.name || 'Your kid'}</p>
                    <p className="text-xs text-bark-400">Level 1 · Seed</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Input
                  label="4-digit PIN"
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={child.pin}
                  onChange={e => setChild(p => ({ ...p, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  hint="Kids use this PIN to access their profile on a shared device (under 13). Keep it simple!"
                  className="text-center text-2xl tracking-widest"
                />
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-700">
                  <strong>💡 Tip:</strong> Write this PIN down somewhere safe. You can always change it in Settings.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(p => p - 1)} icon={<ChevronLeft size={18} />}>
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button size="lg" fullWidth onClick={() => { setError(''); setStep(p => p + 1) }} icon={<ChevronRight size={18} />}>
              Continue
            </Button>
          ) : (
            <Button size="lg" fullWidth loading={loading} onClick={finish}>
              🌱 Create Profile & Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
