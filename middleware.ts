import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PAGES = new Set(['/', '/login', '/signup', '/api/auth/callback'])
const BLOCKED_LEGACY_PREFIXES = [
  '/kid', '/api/stripe', '/api/games', '/api/trades',
  '/api/invest', '/api/portfolio', '/api/allowance',
  '/api/children', '/api/market', '/api/stocks', '/api/trade', '/api/checkout', '/api/billing',
  '/parent/allowance', '/parent/approvals', '/parent/settings',
  '/onboarding', '/api/tutor', '/api/achievements', '/api/holdings'
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // Unsafe legacy routes remain disabled until consent/RLS/fictional-money audits pass.
  if (BLOCKED_LEGACY_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return new NextResponse('This feature is not yet available.', {
      status: 404,
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const isPublic = PUBLIC_PAGES.has(pathname)
  if (!user && !isPublic) {
    const destination = request.nextUrl.clone()
    destination.pathname = '/login'
    destination.search = ''
    const redirect = NextResponse.redirect(destination)
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie))
    return redirect
  }
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const destination = request.nextUrl.clone()
    destination.pathname = '/parent'
    destination.search = ''
    const redirect = NextResponse.redirect(destination)
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie))
    return redirect
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
