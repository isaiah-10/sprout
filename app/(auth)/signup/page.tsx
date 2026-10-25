'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SproutLogo from '@/components/layout/SproutLogo'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
    if (!form.name || !form.email || !form.password) { setError('All fields required.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options:  { data: { full_name: form.name } },
    })

    if (signUpErr) { setError(signUpErr.message); setLoading(false); return }
    if (!signUpData.session) {
      setNotice('Check your email to confirm your account before logging in.')
      setLoading(false)
      return
    }
    router.push('/onboarding')
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-bark-200 shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <SproutLogo size="lg" />
        </div>
        <h1 className="text-2xl font-black text-bark-600 text-center mb-1">Create your account</h1>
        <p className="text-sm text-bark-400 text-center mb-7">Create a parent account to get started</p>

        {notice && <p role="status" className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">{notice}</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your name"
            placeholder="Sarah Johnson"
            value={form.name}
            onChange={set('name')}
            icon={<User size={16} />}
            autoComplete="name"
          />
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
            placeholder="At least 8 characters"
            value={form.password}
            onChange={set('password')}
            icon={<Lock size={16} />}
            suffix={
              <button type="button" onClick={() => setShowPwd(p => !p)} className="text-bark-400 hover:text-bark-600">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Create Account
          </Button>
        </form>

        <div className="mt-5">
          <button type="button" onClick={handleGoogleSignIn} disabled={loading}
            className="w-full rounded-xl border border-bark-200 bg-white px-4 py-3 font-semibold text-bark-600 hover:bg-cream disabled:opacity-50">
            Continue with Google
          </button>
        </div>
        <p className="text-xs text-bark-400 text-center mt-5">
          By signing up you agree to our{' '}
          <Link href="#" className="text-sprout-600 hover:underline">Terms</Link> &{' '}
          <Link href="#" className="text-sprout-600 hover:underline">Privacy Policy</Link>.
        </p>

        <div className="border-t border-bark-100 mt-5 pt-5 text-center">
          <p className="text-sm text-bark-400">
            Already have an account?{' '}
            <Link href="/login" className="text-sprout-700 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
