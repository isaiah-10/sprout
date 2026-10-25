'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SproutLogo from '@/components/layout/SproutLogo'
export default function Hero() {
return <section className="bg-sprout-800 text-white min-h-[80vh] flex items-center">
<div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 items-center gap-12">
<div><p className="text-sprout-200 font-bold uppercase tracking-widest text-sm mb-5">Growing money confidence</p>
<h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">Money skills for every stage of growing up.</h1>
<p className="text-lg text-white/80 leading-relaxed mb-7">Sprout helps parents explore age-based financial learning with their families. Start with 40 foundational topics and fictional practice—without subscriptions or real investments.</p>
<div className="flex flex-wrap gap-3"><Link href="/signup" className="bg-white text-sprout-800 px-6 py-3 font-bold rounded-xl">Create a parent account</Link>
<Link href="#features" className="border border-white/50 text-white px-6 py-3 font-bold rounded-xl">Explore the learning paths</Link></div>
<p className="text-white/60 text-sm mt-6">No payments or subscriptions · Parent-managed profiles</p>
</div><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
 className="bg-white/10 rounded-3xl p-9 border border-white/20 min-h-[360px] flex flex-col items-center justify-center">
 <SproutLogo size="xl" light /><p className="text-center mt-7 font-bold text-xl">Explore · Build · Thrive</p>
 <p className="text-center text-white/80 mt-3">A single leaf. Many ways to grow.</p>
</motion.div></div></section>
}
