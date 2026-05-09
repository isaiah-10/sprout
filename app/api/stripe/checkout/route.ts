import { createClient }  from '@/lib/supabase/server'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe/config'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planKey } = await req.json() as { planKey: PlanKey }
  const plan = PLANS[planKey]
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id,email,full_name').eq('id', user.id).single()

  // Create or reuse Stripe customer
  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    profile?.email ?? user.email!,
      name:     profile?.full_name,
      metadata: { supabase_uid: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer:   customerId,
    mode:       'subscription',
    line_items: [{ price: plan.priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 14 },
    success_url: `${appUrl}/parent?subscribed=1`,
    cancel_url:  `${appUrl}/parent/settings?cancelled=1`,
    metadata:    { supabase_uid: user.id, plan_key: planKey },
  })

  return NextResponse.json({ url: session.url })
}
