import Link from 'next/link'
import SproutLogo from '@/components/layout/SproutLogo'

export default function Footer() {
  return (
    <footer className="bg-sprout-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <SproutLogo light size="md" showWordmark />
          <p className="text-white/50 text-sm mt-4 max-w-sm leading-relaxed">
            Teaching every kid to invest, save, and build wealth before they turn 18. Parent-controlled. COPPA-compliant.
          </p>
          <p className="text-white/30 text-xs mt-6">© 2026 Sprout. All rights reserved.</p>
        </div>

        <div>
          <p className="font-bold text-sm mb-4 text-white/80">Product</p>
          <ul className="space-y-2 text-sm text-white/40">
            {['Features', 'Pricing', 'How It Works', 'For Schools'].map(l => (
              <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-bold text-sm mb-4 text-white/80">Legal</p>
          <ul className="space-y-2 text-sm text-white/40">
            {['Privacy Policy', 'Terms of Service', 'COPPA Compliance', 'Cookie Policy'].map(l => (
              <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
