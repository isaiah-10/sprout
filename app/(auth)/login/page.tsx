'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SproutLogo from '@/components/layout/SproutLogo'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleGoogleSignIn() {
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback` },
      })
      if (oauthError) throw oauthError
      if (!data.url) throw new Error('Google authentication could not start.')
      window.location.assign(data.url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed.')
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Email and password required.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    })

    if (signInErr) { setError('Incorrect email or password.'); setLoading(false); return }
    router.push('/parent')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-bark-200 shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <SproutLogo size="lg" />
        </div>
        <h1 className="text-2xl font-black text-bark-600 text-center mb-1">Welcome back</h1>
        <p className="text-sm text-bark-400 text-center mb-7">Log in to your parent dashboard</p>

        {notice && <p role="status" className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">{notice}</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="sarah@example.com"
            value={form.email}
            onChange={set('email')}
            icon={<Mail size={16} />}
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Your password"
            value={form.password}
            onChange={set('password')}
            icon={<Lock size={16} />}
            suffix={
              <button type="button" onClick={() => setShowPwd(p => !p)} className="text-bark-400 hover:text-bark-600">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} fullWidth size="lg">Log In</Button>
        </form>

        <div className="mt-5">
          <button type="button" onClick={handleGoogleSignIn} disabled={loading}
            className="w-full rounded-xl border border-bark-200 bg-white px-4 py-3 font-semibold text-bark-600 hover:bg-cream disabled:opacity-50">
            Continue with Google
          </button>
        </div>

        <p className="text-center mt-4 text-sm"><Link href="/forgot-password" className="text-sprout-700 font-semibold hover:underline">Forgot password?</Link></p>\n        <div className="border-t border-bark-100 mt-5 pt-5 text-center">
          <p className="text-sm text-bark-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-sprout-700 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
