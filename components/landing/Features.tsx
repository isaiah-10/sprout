import Link from 'next/link'
const cards=[
  {n:'01',name:'Explore',age:'Ages 5–8',desc:'Discover needs, wants, saving and sharing with approachable everyday examples.',icon:'✳',tone:'lime'},
  {n:'02',name:'Build',age:'Ages 9–12',desc:'Practice budgeting, goals, and smarter choices through guided learning.',icon:'↗',tone:'light'},
  {n:'03',name:'Thrive',age:'Ages 13–17',desc:'Discuss longer-term planning, risk, and financial decisions using fictional examples.',icon:'✦',tone:'dark'},
  {n:'04',name:'Money basics',age:'Curriculum preview',desc:'Browse 40 introductory parent-led financial literacy topics.',icon:'◎',tone:'light'},
  {n:'05',name:'Family profiles',age:'Parent managed',desc:'Create and manage up to four child profiles using nicknames.',icon:'❋',tone:'dark'},
  {n:'06',name:'Practice & play',age:'Adult preview',desc:'Try fictional budgeting practice while child experiences complete release review.',icon:'➚',tone:'lime'}
]
export default function Features(){return <section id="learning" className="py-20 sm:py-28 bg-[#fafaf8]"><div id="features" className="max-w-7xl mx-auto px-5 sm:px-8">
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
    <h2 className="text-4xl sm:text-6xl font-black tracking-[-.055em] leading-tight max-w-xl"><span className="bg-[#b7ff60] px-1">Learning</span> that grows with them.</h2>
    <p className="text-sm sm:text-base text-[#555] max-w-md">Different stages, one goal: helping families build a healthier understanding of money. Here's what's available to explore or currently in preparation.</p>
  </div>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{cards.map(c=><article key={c.n} className={`rounded-[26px] border-[1.5px] border-[#191a20] p-7 min-h-[270px] flex flex-col shadow-[0_4px_0_#191a20] ${c.tone==='lime'?'bg-[#b7ff60]':c.tone==='dark'?'bg-[#191a20] text-white':'bg-[#f0f0ef]'}`}>
    <div className="flex justify-between items-start"><span className="text-xs font-bold tracking-widest">{c.n} / SPROUT</span><span aria-hidden="true" className="text-5xl leading-none">{c.icon}</span></div>
    <div className="mt-auto pt-9"><div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">{c.age}</div><h3 className="font-black text-2xl mb-3">{c.name}</h3><p className="text-sm leading-relaxed opacity-85">{c.desc}</p></div>
  </article>)}</div>
  <div className="mt-9 flex justify-end"><Link href="/signup" className="font-semibold text-sm underline underline-offset-4">Get started with a parent account ↗</Link></div>
</div></section>}
