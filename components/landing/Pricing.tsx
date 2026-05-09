'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'

const SOLO_FEATURES = [
  '1 child profile',
  'Full simulated investing (5–12)',
  'Real investing with parent approval (13+)',
  'All games & challenges',
  'Complete budgeting tools',
  'XP, badges & achievements',
  'Parent dashboard',
  'Weekly progress reports',
  'Savings goals',
]

const FAMILY_FEATURES = [
  'Up to 4 child profiles',
  'Everything in Solo',
  'Family leaderboard',
  'Shared family challenges',
  'Family savings goals',
  'Priority support',
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  const soloPrice   = annual ? 70  : 7
  const familyPrice = annual ? 140 : 14

  return (
    <section className="py-24 bg-cream" id="pricing">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sprout-600 text-sm font-semibold tracking-widest uppercase mb-3">Simple Pricing</p>
          <h2 className="text-4xl font-black text-sprout-900 mb-4">One price. Everything included.</h2>
          <p className="text-bark-400 text-lg mb-8">14-day free trial. No credit card required.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-bark-200 rounded-full px-2 py-1.5 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-sprout-700 text-white shadow-sm' : 'text-bark-400 hover:text-bark-600'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-sprout-700 text-white shadow-sm' : 'text-bark-400 hover:text-bark-600'}`}
            >
              Annual
              <span className="text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">2 months free</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Free trial */}
          <div className="hidden md:block" />

          {/* Actually show 3 plans — free, solo, family */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-2">
          {/* Free */}
          <div className="bg-white border border-bark-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-bark-400 uppercase tracking-widest mb-2">Free Trial</p>
            <p className="text-4xl font-black text-bark-600 mb-1">$0</p>
            <p className="text-xs text-bark-400 mb-4">14 days, no card needed</p>
            <ul className="space-y-2 mb-6">
              {['1 child profile','3 games unlocked','Basic savings tracker','No investing access'].map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-bark-500">
                  <Check size={13} className="text-sprout-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant="outline" fullWidth size="md">Start Free</Button>
            </Link>
          </div>

          {/* Solo — featured */}
          <div className="relative bg-sprout-800 text-white rounded-2xl p-6 shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <p className="text-xs font-bold text-sprout-300 uppercase tracking-widest mb-2">Solo</p>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-4xl font-black">${soloPrice}</p>
              <p className="text-white/50 text-sm">/ {annual ? 'year' : 'month'}</p>
            </div>
            <p className="text-xs text-white/40 mb-4">For one amazing kid</p>
            <ul className="space-y-2 mb-6">
              {SOLO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-white/80">
                  <Check size={13} className="text-sprout-300 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button className="!bg-white !text-sprout-800 hover:!bg-sprout-100 font-bold" fullWidth size="md">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Family */}
          <div className="bg-white border-2 border-sprout-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-sprout-600 uppercase tracking-widest mb-2">Family</p>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-4xl font-black text-bark-600">${familyPrice}</p>
              <p className="text-bark-400 text-sm">/ {annual ? 'year' : 'month'}</p>
            </div>
            <p className="text-xs text-bark-400 mb-4">Up to 4 kids</p>
            <ul className="space-y-2 mb-6">
              {FAMILY_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-bark-500">
                  <Check size={13} className="text-sprout-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button variant="secondary" fullWidth size="md">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
