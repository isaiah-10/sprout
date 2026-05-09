'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/format'

interface Props { onComplete: (score: number, seeds: number) => void }

export default function CompoundQuest({ onComplete }: Props) {
  const [step, setStep]       = useState(0)
  const [principal, setPrincipal] = useState(1000)
  const [rate, setRate]       = useState(7)
  const [years, setYears]     = useState(10)
  const [done, setDone]       = useState(false)

  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, i) => ({
      year: i,
      compound: Math.round(principal * Math.pow(1 + rate / 100, i)),
      simple:   Math.round(principal + (principal * rate / 100) * i),
    }))
  }, [principal, rate, years])

  const finalCompound = data[data.length - 1].compound
  const finalSimple   = data[data.length - 1].simple
  const bonus         = finalCompound - finalSimple

  const LESSONS = [
    {
      title: 'What is Compound Interest?',
      emoji: '🌱',
      content: 'Compound interest means you earn interest ON your interest. So if you invest $1,000 at 7%, after year 1 you have $1,070. In year 2, you earn 7% on $1,070 — not just $1,000. Your money grows FASTER every year!',
    },
    {
      title: 'The Magic of Time',
      emoji: '⏰',
      content: '"The most powerful force in the universe is compound interest." — Often attributed to Einstein. Starting early is the #1 rule of investing. $1,000 invested at age 13 becomes much more than $1,000 invested at age 23 — even if you add more money later!',
    },
    {
      title: 'Build Your Scenario',
      emoji: '🔧',
      content: 'Now try it yourself! Adjust the sliders and watch how compound interest grows your money over time compared to simple interest.',
    },
  ]

  if (step < LESSONS.length) {
    const lesson = LESSONS[step]
    return (
      <div className="max-w-md mx-auto text-center">
        <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">{lesson.emoji}</div>
          <h3 className="font-black text-xl text-bark-600 mb-3">{lesson.title}</h3>
          <p className="text-bark-500 text-sm leading-relaxed mb-6">{lesson.content}</p>
          <Button size="lg" onClick={() => setStep(s => s + 1)}>
            {step < LESSONS.length - 1 ? 'Next →' : 'Try it! →'}
          </Button>
        </motion.div>
      </div>
    )
  }

  if (done) return (
    <div className="text-center py-4">
      <div className="text-5xl mb-3">🧙‍♂️</div>
      <h3 className="font-black text-xl text-bark-600 mb-2">You learned about compound interest!</h3>
      <p className="text-sprout-600 font-bold mb-1">+30 Seeds + 75 XP earned!</p>
      <p className="text-bark-400 text-sm">Remember: time + compound interest = wealth. Start early, stay consistent.</p>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="font-black text-bark-600 mb-4 text-center">⚡ Compound Interest Calculator</h3>

      {/* Sliders */}
      <div className="bg-white border border-bark-200 rounded-2xl p-5 mb-4 space-y-4">
        <div>
          <div className="flex justify-between text-sm font-semibold text-bark-600 mb-1">
            <span>Starting Amount</span><span className="text-sprout-700">{formatCurrency(principal)}</span>
          </div>
          <input type="range" min={100} max={10000} step={100} value={principal}
            onChange={e => setPrincipal(+e.target.value)} className="w-full accent-sprout-600" />
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold text-bark-600 mb-1">
            <span>Annual Return</span><span className="text-sprout-700">{rate}%</span>
          </div>
          <input type="range" min={1} max={20} step={1} value={rate}
            onChange={e => setRate(+e.target.value)} className="w-full accent-sprout-600" />
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold text-bark-600 mb-1">
            <span>Years Invested</span><span className="text-sprout-700">{years} years</span>
          </div>
          <input type="range" min={1} max={40} step={1} value={years}
            onChange={e => setYears(+e.target.value)} className="w-full accent-sprout-600" />
        </div>
      </div>

      {/* Result */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-sprout-700 text-white rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-sprout-300 mb-1">📈 Compound</p>
          <p className="text-2xl font-black">{formatCurrency(finalCompound)}</p>
        </div>
        <div className="bg-bark-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-bark-400 mb-1">📊 Simple</p>
          <p className="text-2xl font-black text-bark-600">{formatCurrency(finalSimple)}</p>
        </div>
      </div>

      <div className="bg-leaf-light border border-sprout-200 rounded-xl px-4 py-3 mb-4 text-center">
        <p className="text-sm font-bold text-sprout-700">
          Compound interest earns you <strong>{formatCurrency(bonus)}</strong> extra! 🤯
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white border border-bark-200 rounded-2xl p-4 mb-5">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data}>
            <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: 'Years', position: 'insideBottom', offset: -2, fontSize: 10 }} />
            <YAxis hide />
            <Tooltip formatter={(v: number, name: string) => [formatCurrency(v), name === 'compound' ? 'Compound' : 'Simple']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Area type="monotone" dataKey="compound" stroke="#2D6A4F" fill="#D8F3DC" strokeWidth={2} name="compound" />
            <Area type="monotone" dataKey="simple"   stroke="#A89E88" fill="#F5F0E8" strokeWidth={1.5} name="simple" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <Button fullWidth size="lg" onClick={() => { setDone(true); onComplete(30, 30) }}>
        🎓 I Understand Compound Interest!
      </Button>
    </div>
  )
}
