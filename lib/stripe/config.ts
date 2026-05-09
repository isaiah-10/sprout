import Stripe from 'stripe'

// Lazy singleton — only instantiated at request time, not during build
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}

/** @deprecated use getStripe() for lazy init — kept for compatibility */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PLANS = {
  solo_monthly: {
    priceId:     process.env.STRIPE_SOLO_MONTHLY_PRICE_ID!,
    name:        'Solo',
    price:       7,
    interval:    'month' as const,
    maxChildren: 1,
    description: 'Perfect for one child',
  },
  solo_annual: {
    priceId:     process.env.STRIPE_SOLO_ANNUAL_PRICE_ID!,
    name:        'Solo Annual',
    price:       70,
    interval:    'year' as const,
    maxChildren: 1,
    description: '2 months free vs monthly',
  },
  family_monthly: {
    priceId:     process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID!,
    name:        'Family',
    price:       14,
    interval:    'month' as const,
    maxChildren: 4,
    description: 'Up to 4 children',
  },
  family_annual: {
    priceId:     process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID!,
    name:        'Family Annual',
    price:       140,
    interval:    'year' as const,
    maxChildren: 4,
    description: '2 months free vs monthly',
  },
} as const

export type PlanKey = keyof typeof PLANS
