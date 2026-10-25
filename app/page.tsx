import Link from 'next/link'
import SproutLogo from '@/components/layout/SproutLogo'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return <div className="min-h-screen bg-[#fafaf8] text-[#191a20]">
    <header className="sticky top-0 z-50 bg-white/95 border-b border-[#e7e7e4] backdrop-blur">
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-5 sm:px-8 h-[78px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Sprout home" className="shrink-0"><SproutLogo size="sm" /></Link>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="#learning" className="hover:text-[#477c0d]">Learning paths</Link>
          <Link href="#features" className="hover:text-[#477c0d]">What you can explore</Link>
          <Link href="#how-it-works" className="hover:text-[#477c0d]">How it works</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold hover:underline">Log in</Link>
          <Link href="/signup" className="rounded-xl border border-[#191a20] bg-white px-4 py-3 text-sm font-semibold hover:bg-[#b7ff60] transition-colors">Create account ↗</Link>
        </div>
      </nav>
    </header>
    <main><Hero /><Features /><HowItWorks />
      <section className="px-5 sm:px-8 py-20 bg-[#b7ff60]" aria-labelledby="closing-title">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-7">
          <div><p className="text-sm font-bold uppercase tracking-widest mb-4">Let's grow together</p>
            <h2 id="closing-title" className="font-black tracking-tight text-4xl sm:text-6xl max-w-2xl leading-tight">Small lessons. Bigger confidence.</h2>
            <p className="mt-5 max-w-xl text-base">Explore money skills in a parent-led learning space. Child-facing activities are being prepared for release.</p>
          </div>
          <Link href="/signup" className="bg-[#191a20] text-white px-7 py-4 rounded-xl font-semibold inline-flex whitespace-nowrap hover:bg-black">Create a parent account ↗</Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
}
