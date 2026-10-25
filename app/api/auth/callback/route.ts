import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PKCE OAuth exchange. Never use an arbitrary 'next' query value as a redirect URL.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')
  const safeNext =
    next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')
      ? next
      : '/parent'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin))
  }
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', url.origin))
}
