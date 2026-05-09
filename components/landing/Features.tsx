'use client'
import { motion } from 'framer-motion'

const features = [
  {
    emoji: '🌱',
    title: 'Ages 5–12: Seeds Simulator',
    desc: 'Kids invest virtual "Seeds" in REAL companies like Apple, Tesla, and Roblox. Real market prices. Real gains and losses. Zero risk.',
    color: 'bg-leaf-light border-sprout-200',
  },
  {
    emoji: '📈',
    title: 'Ages 13+: Real Investing',
    desc: 'When they turn 13, the platform automatically upgrades. Kids invest real money in stocks, index funds, ETFs, and REITs — all parent-approved.',
    color: 'bg-sprout-50 border-sprout-300',
  },
  {
    emoji: '🎮',
    title: 'Learn Through Games',
    desc: 'Coin Catcher, Budget Boss, Stock Showdown — games designed to teach real concepts. Kids earn XP and Seeds while having fun.',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Parent Dashboard',
    desc: 'Approve or deny every trade, set monthly limits, see all activity, and send weekly allowances — all from your dashboard.',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    emoji: '🔒',
    title: 'Built-in Safety',
    desc: 'COPPA-compliant. Under-13 accounts are parent-managed. No ads, no data selling. Safe for kids, trusted by parents.',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    emoji: '🏆',
    title: 'XP, Badges & Streaks',
    desc: 'Kids level up from "Seed" to "Stock Legend." Daily streaks, 18 achievements, and family leaderboards keep them coming back.',
    color: 'bg-orange-50 border-orange-200',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-cream" id="features">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sprout-600 text-sm font-semibold tracking-widest uppercase mb-3">What Sprout Does</p>
          <h2 className="text-4xl font-black text-sprout-900 mb-4">Everything kids need to grow financially</h2>
          <p className="text-bark-400 max-w-xl mx-auto text-lg">Two platforms in one. Automatically switches as your child grows.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-6 ${f.color}`}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-bark-600 text-base mb-2">{f.title}</h3>
              <p className="text-bark-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
