'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sprout-800 text-white min-h-[92vh] flex items-center">
      {/* Background blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-sprout-600 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px]  w-[400px] h-[400px] rounded-full bg-yellow-400   opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-6">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            The #1 finance app built for kids ages 5–18
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            Teach your kids{' '}
            <span className="text-sprout-300">to invest</span>{' '}
            before they turn 18.
          </h1>

          <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
            Sprout gives kids real stock market experience through games and simulations — then transitions to real investing at 13. All parent-controlled, all safe.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href="/signup">
              <Button size="xl" className="bg-white !text-sprout-800 hover:bg-sprout-100 w-full sm:w-auto font-bold">
                Start Free Trial
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="xl" className="!text-white hover:bg-white/10 w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/40">14-day free trial · No credit card required · Cancel anytime</p>
        </motion.div>

        {/* Right mock UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
            {/* Mock portfolio card */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">🦁</div>
              <div>
                <p className="font-bold text-sm">Marcus, age 11</p>
                <p className="text-xs text-white/60">Portfolio · Seeds Simulator</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-sprout-300 text-lg">🌱 14,280</p>
                <p className="text-xs text-sprout-400">+42.8%</p>
              </div>
            </div>

            {/* Mock holdings */}
            {[
              { name: 'Apple', sym: 'AAPL', emoji: '🍎', val: '4,230', pct: '+12.4%', up: true },
              { name: 'NVIDIA', sym: 'NVDA', emoji: '🎮', val: '3,890', pct: '+28.1%', up: true },
              { name: 'Disney', sym: 'DIS',  emoji: '🏰', val: '2,140', pct: '-3.2%',  up: false },
            ].map(h => (
              <div key={h.sym} className="flex items-center gap-3 py-2.5 border-t border-white/10">
                <div className="text-2xl">{h.emoji}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{h.name}</p>
                  <p className="text-xs text-white/50">{h.sym}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">🌱 {h.val}</p>
                  <p className={`text-xs font-semibold ${h.up ? 'text-sprout-300' : 'text-red-400'}`}>{h.pct}</p>
                </div>
              </div>
            ))}

            {/* XP bar */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>⚡ Level 5 — Coin Collector</span>
                <span>820 / 900 XP</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-sprout-400 rounded-full" style={{ width: '91%' }} />
              </div>
            </div>
          </div>

          {/* Floating notification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="absolute -right-4 top-8 bg-white text-bark-600 rounded-2xl shadow-xl px-4 py-3 text-xs font-semibold max-w-[160px]"
          >
            🎉 Achievement earned!
            <br />
            <span className="text-sprout-600 font-bold">Week Warrior</span>
            <br />
            <span className="text-bark-400 font-normal">7-day streak!</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute -left-4 bottom-8 bg-white text-bark-600 rounded-2xl shadow-xl px-4 py-3 text-xs font-semibold"
          >
            📱 Parent alert:
            <br />
            <span className="text-bark-500 font-normal">Marcus wants to buy</span>
            <br />
            <span className="text-sprout-700 font-bold">🍎 5 shares of AAPL</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
