import Link from 'next/link'
export default function Pricing(){return <section id="pricing" className="py-20 bg-cream">
<div className="max-w-4xl mx-auto px-6"><div className="bg-white rounded-3xl border border-sprout-200 p-10 text-center">
<p className="uppercase tracking-widest font-bold text-sprout-600 text-sm mb-3">Sprout access</p>
<h2 className="text-4xl font-black text-sprout-900 mb-3">No subscriptions while we build.</h2>
<p className="text-bark-500 mb-6 max-w-2xl mx-auto">Parents can register and explore the adult-led curriculum preview and manage up to four child profiles. Payments, checkout, subscriptions and real-money investing are disabled.</p>
<Link href="/signup" className="inline-block px-7 py-3 rounded-xl bg-sprout-700 text-white font-bold">Create a parent account</Link>
</div></div></section>}
