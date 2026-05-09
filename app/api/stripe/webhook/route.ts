import { stripe }        from '@/lib/stripe/config'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const uid     = session.metadata?.supabase_uid
    const planKey = session.metadata?.plan_key
    if (uid && planKey) {
      const plan = planKey.startsWith('family') ? 'family' : 'solo'
      await supabase.from('profiles').update({
        subscription_status: 'active',
        subscription_plan:   plan,
        stripe_customer_id:  session.customer as string,
      }).eq('id', uid)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub     = event.data.object as Stripe.Subscription
    const profile = await supabase.from('profiles').select('id').eq('stripe_customer_id', sub.customer as string).single()
    if (profile.data) {
      await supabase.from('profiles').update({
        subscription_status:  sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'cancelled',
        subscription_end_at:  new Date((sub as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
      }).eq('id', profile.data.id)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub     = event.data.object as Stripe.Subscription
    const profile = await supabase.from('profiles').select('id').eq('stripe_customer_id', sub.customer as string).single()
    if (profile.data) {
      await supabase.from('profiles').update({ subscription_status: 'cancelled' }).eq('id', profile.data.id)
    }
  }

  return NextResponse.json({ received: true })
}
