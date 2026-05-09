'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface Lesson {
  id: string; title: string; emoji: string; category: string
  minAge: number; duration: string; xp: number
  content: string[]   // array of paragraphs
  quiz: { q: string; options: string[]; correct: number }[]
}

const LESSONS: Lesson[] = [
  {
    id: 'what-is-money', title: 'What Is Money?', emoji: '💵', category: 'Basics',
    minAge: 5, duration: '3 min', xp: 30,
    content: [
      'Money is how we trade for things we want and need. A long time ago, people traded items directly — like trading a fish for some bread. But this was hard!',
      'So we invented money — a thing that everyone agrees has value. Today, money can be coins, paper bills, or even numbers on a computer (digital money).',
      '💡 Key idea: Money is a tool. It lets you store value and trade it later for the things you want.',
    ],
    quiz: [{ q: 'What is money?', options: ['A tool for trading value', 'Just paper', 'Magic', 'Food'], correct: 0 }],
  },
  {
    id: 'saving-basics', title: 'Why Save Money?', emoji: '🐷', category: 'Saving',
    minAge: 5, duration: '4 min', xp: 35,
    content: [
      'Saving means setting aside some money instead of spending it all. It\'s like having a pause button — you\'re saying "I\'ll use this later."',
      'Saving helps you: ① Buy bigger things you really want, ② Handle surprise expenses (emergencies!), ③ Feel safe and secure.',
      '🎯 The 50/30/20 rule: Spend 50% on needs, 30% on wants, and save 20%. Even saving $5 a week adds up to $260 a year!',
    ],
    quiz: [{ q: 'What does saving help you do?', options: ['Spend more', 'Buy bigger things & handle emergencies', 'Earn money', 'None of above'], correct: 1 }],
  },
  {
    id: 'what-is-stock', title: 'What Is a Stock?', emoji: '📈', category: 'Investing',
    minAge: 9, duration: '5 min', xp: 50,
    content: [
      'When a company wants to grow, it can sell tiny pieces of itself called "shares" or "stocks." When you buy a stock, you own a tiny piece of that company!',
      'If the company does well and earns more money, your stock becomes worth more. If it does badly, your stock loses value.',
      '🍎 Example: If you own 1 share of Apple and Apple is worth $190 per share, your investment is worth $190. If Apple stock rises to $210, you\'ve made $20!',
    ],
    quiz: [{ q: 'What is a stock?', options: ['A type of soup', 'A tiny piece of ownership in a company', 'A savings account', 'A credit card'], correct: 1 }],
  },
  {
    id: 'compound-interest', title: 'The Magic of Compounding', emoji: '🌀', category: 'Investing',
    minAge: 11, duration: '6 min', xp: 60,
    content: [
      'Compound interest is when your money earns interest, and then that interest also earns interest. It\'s like a snowball rolling down a hill — it gets bigger and bigger.',
      'Example: You invest $1,000 at 7% interest. After year 1: $1,070. After year 2: $1,144.90. After 30 years: $7,612 — without adding another dollar!',
      '⏰ The #1 rule: Start early. $1,000 invested at age 13 is worth FAR more than $1,000 invested at age 23. Time is your biggest advantage.',
    ],
    quiz: [{ q: 'Why is compounding powerful?', options: ['It doubles your money overnight', 'Interest earns interest, growing exponentially', 'It\'s risk-free', 'Only banks use it'], correct: 1 }],
  },
  {
    id: 'index-funds', title: 'Index Funds: Invest in Everything', emoji: '🌍', category: 'Investing',
    minAge: 13, duration: '6 min', xp: 65,
    content: [
      'Instead of picking one stock, an index fund buys tiny pieces of MANY companies at once. The S&P 500 index fund (SPY) owns the 500 biggest US companies — all in one investment!',
      'This "diversification" reduces risk. If one company crashes, the others cushion the blow. Warren Buffett says most people should just buy an S&P 500 index fund.',
      '📊 Historically, the S&P 500 has returned ~10% per year on average. $100/month invested for 30 years at 10% = over $220,000!',
    ],
    quiz: [{ q: 'What does an index fund do?', options: ['Invests in one company', 'Buys pieces of many companies at once', 'Guarantees a profit', 'Only works for adults'], correct: 1 }],
  },
  {
    id: 'real-estate', title: 'Investing in Real Estate', emoji: '🏢', category: 'Real Estate',
    minAge: 13, duration: '5 min', xp: 55,
    content: [
      'Real estate investing means owning property (houses, apartments, office buildings) and earning money from rent or selling when prices rise.',
      'You don\'t need to buy a building to invest in real estate! REITs (Real Estate Investment Trusts) let you invest in real estate the same way you invest in stocks.',
      '🏪 Example: Realty Income (symbol: O) owns thousands of retail stores and pays you a dividend (cash payment) every single month just for owning their stock!',
    ],
    quiz: [{ q: 'What is a REIT?', options: ['A type of bank account', 'A way to invest in real estate like a stock', 'A government bond', 'A savings plan'], correct: 1 }],
  },
  {
    id: 'what-is-risk', title: 'Risk vs. Reward', emoji: '⚖️', category: 'Investing',
    minAge: 11, duration: '5 min', xp: 50,
    content: [
      'In investing, "risk" means the chance that you could lose money. "Reward" is the potential gain. Generally: higher risk = higher potential reward.',
      'Stocks are riskier than savings accounts but offer better long-term returns. Government bonds are safer but grow slowly. Index funds balance risk by spreading across many companies.',
      '🧠 Smart investors don\'t avoid risk — they manage it. Diversify, invest for the long term, and never invest money you might need soon.',
    ],
    quiz: [{ q: 'What does "diversify" mean in investing?', options: ['Put all money in one stock', 'Spread investments across many assets', 'Only invest in crypto', 'Never invest'], correct: 1 }],
  },
  {
    id: 'budgeting-101', title: 'Budgeting 101', emoji: '📋', category: 'Budgeting',
    minAge: 8, duration: '5 min', xp: 40,
    content: [
      'A budget is a plan for your money. It tells you how much you\'ll spend on different things before you spend it — so you\'re in control, not your money.',
      'Step 1: Write down all your income (allowance, gifts, jobs). Step 2: List all your expenses. Step 3: Make sure expenses ≤ income. Step 4: Set a savings goal!',
      '💡 Budgeting app tip: The 50/30/20 rule — 50% needs, 30% wants, 20% savings/investing. Even at age 10 you can practice this with your allowance!',
    ],
    quiz: [{ q: 'What is a budget?', options: ['A type of bank', 'A plan for how to spend your money', 'A credit card', 'A savings account'], correct: 1 }],
  },
]

interface Props { childId: string; completedIds: string[]; age: number }

export default function LearnClient({ childId, completedIds: initialCompleted, age }: Props) {
  const [completed, setCompleted] = useState(new Set(initialCompleted))
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [quizAnswer, setQuizAnswer]     = useState<number | null>(null)
  const [lessonStep, setLessonStep]     = useState(0) // 0 = reading, 1 = quiz, 2 = done

  const available = LESSONS.filter(l => age >= l.minAge)
  const categories = Array.from(new Set(available.map(l => l.category)))

  async function openLesson(lesson: Lesson) {
    setActiveLesson(lesson)
    setLessonStep(0)
    setQuizAnswer(null)
  }

  function nextStep() {
    if (!activeLesson) return
    if (lessonStep === 0) { setLessonStep(1); return }
    if (lessonStep === 1 && quizAnswer !== null) {
      setLessonStep(2)
      if (!completed.has(activeLesson.id)) {
        setCompleted(s => new Set(Array.from(s).concat(activeLesson.id)))
        const supabase = createClient()
        supabase.from('learn_progress').insert({ child_id: childId, lesson_id: activeLesson.id, xp_earned: activeLesson.xp })
        supabase.rpc('increment_xp', { p_child_id: childId, p_amount: activeLesson.xp })
      }
    }
  }

  return (
    <div className="page-inner">
      <h1 className="section-title">📚 Learn</h1>
      <p className="section-sub">Short, powerful lessons that teach you real finance skills. Complete them to earn XP!</p>

      {/* Progress */}
      <div className="bg-white border border-bark-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
        <div className="text-3xl">🎓</div>
        <div className="flex-1">
          <p className="font-bold text-bark-600 text-sm">{completed.size} / {available.length} lessons completed</p>
          <div className="h-2 bg-bark-100 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-sprout-500 rounded-full transition-all duration-700" style={{ width: `${(completed.size / available.length) * 100}%` }} />
          </div>
        </div>
        <Badge variant="green">{completed.size * 40}+ XP</Badge>
      </div>

      {/* Lessons by category */}
      {categories.map(cat => (
        <div key={cat} className="mb-7">
          <h2 className="font-bold text-bark-500 text-xs uppercase tracking-widest mb-3">{cat}</h2>
          <div className="space-y-2">
            {available.filter(l => l.category === cat).map(lesson => {
              const done = completed.has(lesson.id)
              return (
                <button key={lesson.id} onClick={() => openLesson(lesson)}
                  className="w-full bg-white border border-bark-200 rounded-2xl p-4 flex items-center gap-4 hover:border-sprout-300 hover:shadow-sm transition-all text-left">
                  <span className="text-3xl">{lesson.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-bark-600 text-sm">{lesson.title}</p>
                    <p className="text-xs text-bark-400">{lesson.duration} · +{lesson.xp} XP</p>
                  </div>
                  {done ? (
                    <Badge variant="green" size="sm">✓ Done</Badge>
                  ) : (
                    <Badge variant="gray" size="sm">Start →</Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Lesson modal */}
      <Modal open={!!activeLesson} onClose={() => setActiveLesson(null)} title={activeLesson ? `${activeLesson.emoji} ${activeLesson.title}` : ''} size="md">
        {activeLesson && (
          <AnimatePresence mode="wait">
            {lessonStep === 0 && (
              <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-3 mb-6">
                  {activeLesson.content.map((para, i) => (
                    <p key={i} className="text-sm text-bark-500 leading-relaxed">{para}</p>
                  ))}
                </div>
                <Button fullWidth size="lg" onClick={nextStep}>Take the Quiz →</Button>
              </motion.div>
            )}
            {lessonStep === 1 && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="font-bold text-bark-600 mb-4">{activeLesson.quiz[0].q}</p>
                <div className="space-y-2 mb-5">
                  {activeLesson.quiz[0].options.map((opt, i) => (
                    <button key={i} onClick={() => setQuizAnswer(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        quizAnswer === i
                          ? i === activeLesson.quiz[0].correct
                            ? 'border-sprout-500 bg-leaf-light text-sprout-700'
                            : 'border-red-400 bg-red-50 text-red-700'
                          : 'border-bark-200 hover:border-sprout-300'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <p className={`text-sm font-semibold mb-4 ${quizAnswer === activeLesson.quiz[0].correct ? 'text-sprout-600' : 'text-red-500'}`}>
                    {quizAnswer === activeLesson.quiz[0].correct ? '✅ Correct!' : `❌ The correct answer is: ${activeLesson.quiz[0].options[activeLesson.quiz[0].correct]}`}
                  </p>
                )}
                <Button fullWidth size="lg" disabled={quizAnswer === null} onClick={nextStep}>Finish Lesson</Button>
              </motion.div>
            )}
            {lessonStep === 2 && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="font-black text-xl text-bark-600 mb-1">Lesson Complete!</h3>
                <p className="text-sprout-600 font-bold mb-1">+{activeLesson.xp} XP earned!</p>
                <p className="text-bark-400 text-sm mb-5">Keep learning to level up faster.</p>
                <Button onClick={() => setActiveLesson(null)}>Back to Lessons</Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Modal>
    </div>
  )
}
