import SproutLogo from '@/components/layout/SproutLogo'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/"><SproutLogo size="sm" /></Link>
        <p className="text-xs text-bark-400">Safe & secure for families</p>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="text-center py-6 text-xs text-bark-300">
        © 2026 Sprout · <Link href="#" className="hover:text-sprout-700">Privacy</Link> · <Link href="#" className="hover:text-sprout-700">Terms</Link>
      </footer>
    </div>
  )
}
