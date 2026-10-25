import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            )
          } catch {
            // Server Components cannot set cookies; route handlers and middleware can.
          }
        },
      },
    }
  )
}

/**
 * Deliberately disabled until privileged route usage is reviewed.
 * Never mix a service-role key with user session cookies.
 * Authentication flows use createClient() above with the publishable key and RLS.
 */
export async function createServiceClient(): Promise<SupabaseClient> {
  throw new Error('Privileged Supabase client disabled pending security review')
}
