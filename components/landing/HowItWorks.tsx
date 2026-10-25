import Link from 'next/link'
const steps=[
{n:'01',title:'Create your account',detail:'Set up a parent account with email and password or Google sign-in.'},
{n:'02',title:'Explore money skills',detail:'Browse introductory topics and fictional adult practice experiences.'},
{n:'03',title:'Manage your family',detail:'Add nickname-based child profiles and review the learning space. Child access stays closed until consent and release checks are complete.'}
]
export default function HowItWorks(){return <section id="how-it-works" className="bg-[#191a20] text-white py-20 sm:py-28"><div className="max-w-7xl mx-auto px-5 sm:px-8">
  <div className="flex flex-col md:flex-row gap-8 justify-between mb-12"><div><p className="uppercase tracking-[.2em] text-[#b7ff60] font-bold text-xs mb-5">Simple by design</p><h2 className="text-4xl sm:text-6xl font-black tracking-[-.05em]">How Sprout works.</h2></div><p className="text-white/65 max-w-sm">Start with a parent-led preview. We're carefully preparing the full child-facing experience.</p></div>
  <div className="grid lg:grid-cols-3 gap-5">{steps.map((s,i)=><article key={s.n} className={`rounded-[24px] border border-white/30 p-7 min-h-[275px] flex flex-col ${i===0?'bg-[#b7ff60] text-[#191a20]':'bg-[#23242b]'}`}><div className="flex justify-between items-start"><span className="text-sm font-bold">{s.n}</span><span className="text-3xl" aria-hidden="true">{i===0?'✳':i===1?'↗':'◎'}</span></div><div className="mt-auto"><h3 className="text-2xl font-black mb-3">{s.title}</h3><p className="text-sm leading-relaxed opacity-80">{s.detail}</p></div></article>)}</div>
  <div className="mt-10"><Link href="/signup" className="inline-flex bg-white text-[#191a20] font-semibold px-6 py-4 rounded-xl hover:bg-[#b7ff60]">Create a parent account ↗</Link></div>
</div></section>}
