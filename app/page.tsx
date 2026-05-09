import Hero        from '@/components/landing/Hero'
import Features    from '@/components/landing/Features'
import HowItWorks  from '@/components/landing/HowItWorks'
import Pricing     from '@/components/landing/Pricing'
import Footer      from '@/components/landing/Footer'
import SproutLogo  from '@/components/layout/SproutLogo'
import Link        from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <SproutLogo size="sm" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-bark-500">
            <Link href="#features"     className="hover:text-sprout-700 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-sprout-700 transition-colors">How It Works</Link>
            <Link href="#pricing"      className="hover:text-sprout-700 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"  className="text-sm font-semibold text-bark-500 hover:text-sprout-700 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-sprout-700 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-sprout-800 transition-colors shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>

      <Footer />
    </div>
  )
}
