import Link from 'next/link'

export default function Hero() {
  return <section className="overflow-hidden bg-white">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24 grid lg:grid-cols-[1fr_0.95fr] items-center gap-12">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] mb-7"><span className="w-2.5 h-2.5 rounded-full bg-[#a5f84b]"/> Learn today. Grow tomorrow.</div>
        <h1 className="text-[clamp(3.1rem,6vw,6.5rem)] leading-[1.03] font-black tracking-[-.065em] text-[#191a20]">Big money skills.<br/><span className="bg-[#b7ff60] px-2 -ml-2 box-decoration-clone">Little beginnings.</span></h1>
        <p className="mt-8 max-w-lg text-[#4b4b4b] text-base sm:text-lg leading-relaxed">Sprout makes financial literacy easier to explore as a family—from needs and wants to saving, budgeting, and thoughtful choices.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/signup" className="bg-[#191a20] text-white rounded-xl px-6 py-4 font-semibold hover:bg-[#37383e] transition-colors">Create a parent account ↗</Link>
          <Link href="#learning" className="border border-[#191a20] rounded-xl px-6 py-4 font-semibold hover:bg-[#f3f3f0] transition-colors">Explore learning paths</Link>
        </div>
        <p className="mt-5 text-xs text-[#696969]">Parent-managed learning preview · No real-money investing</p>
      </div>
      <div className="relative min-h-[390px] sm:min-h-[460px] rounded-[36px] bg-[#f4f4f2] border border-[#dededb] flex items-center justify-center overflow-hidden" aria-label="Illustration of playful learning and money skills">
        <div className="absolute top-6 left-7 text-xs font-bold tracking-widest uppercase">Make room to grow.</div>
        <div className="absolute w-[335px] h-[335px] rounded-full border border-[#9fa0a0] rotate-[-28deg]"/>
        <div className="absolute w-[405px] h-[155px] rounded-[100%] border-2 border-[#a3a4a1] rotate-[29deg]"/>
        <div className="absolute w-[380px] h-[125px] rounded-[100%] border border-[#a3a4a1] rotate-[-19deg]"/>
        <div className="relative -rotate-12 w-52 h-52 sm:w-64 sm:h-64 rounded-[38px] bg-[#b7ff60] border-[3px] border-[#191a20] shadow-[14px_15px_0_#191a20] flex items-center justify-center">
          <svg viewBox="0 0 180 180" role="img" aria-label="Sprouting plant" className="w-[75%] h-[75%]"><path d="M92 146V77" fill="none" stroke="#191a20" strokeWidth="10" strokeLinecap="round"/><path d="M90 86C35 85 26 49 35 27c35-2 67 14 55 59Z" fill="#191a20"/><path d="M94 98c53 1 70-34 62-64-38-1-71 17-62 64Z" fill="#fff"/><path d="M60 139h67" stroke="#191a20" strokeWidth="9" strokeLinecap="round"/></svg>
        </div>
        <div className="absolute right-7 top-16 w-14 h-14 bg-[#191a20] rounded-full flex items-center justify-center text-white text-3xl font-bold">✦</div>
        <div className="absolute left-7 bottom-12 text-6xl text-[#94e83b]">✳</div>
        <div className="absolute right-10 bottom-12 bg-white border border-[#191a20] rounded-full px-5 py-3 text-sm font-black rotate-[-8deg]">Think • Save • Grow</div>
      </div>
    </div>
  </section>
}
