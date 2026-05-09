'use client'
import { motion } from 'framer-motion'

const steps = [
  { n: '01', title: 'Parent signs up',       desc: 'Create your account and add your child\'s profile with their name, birthday, and a fun avatar emoji.',     emoji: '📝' },
  { n: '02', title: 'Kid starts playing',    desc: 'Kids ages 5–12 get 10,000 Seeds to invest in real companies. Games teach budgeting, saving, and investing.',  emoji: '🎮' },
  { n: '03', title: 'You stay in control',   desc: 'Watch their portfolio, approve spending goals, set allowances, and get weekly progress emails.',               emoji: '📊' },
  { n: '04', title: 'They turn 13 — upgrade',desc: 'Platform auto-switches to real investing mode. Fund their account and every trade goes through your approval.', emoji: '🚀' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-sprout-900 text-white" id="how-it-works">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sprout-400 text-sm font-semibold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-4xl font-black mb-4">Up and running in 5 minutes</h2>
          <p className="text-white/60 text-lg">No tech skills needed. We handle everything.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-white/10 z-0" />
              )}
              <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <p className="text-sprout-400 text-xs font-bold mb-1">{s.n}</p>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
