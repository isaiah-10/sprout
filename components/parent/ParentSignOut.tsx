'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ParentSignOut() {
  const router = useRouter()
  const [busy,setBusy] = useState(false)
  async function signOut() {
    setBusy(true)
    const client = createClient()
    const { error } = await client.auth.signOut()
    if (error) { setBusy(false); window.alert('Sign-out failed. Please try again.'); return }
    router.replace('/login')
    router.refresh()
  }
  return <button type="button" onClick={signOut} disabled={busy}
     className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50">
    {busy ? 'Signing out…' : 'Sign out'}
  </button>
}
