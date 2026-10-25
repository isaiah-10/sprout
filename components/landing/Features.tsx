const features=[
{emoji:'🌱',title:'Explore · ages 5–8',desc:'Discover money, choices, saving and sharing through guided conversations and pretend-money examples.'},
{emoji:'💚',title:'Build · ages 9–12',desc:'Practice budgeting, goals, safe financial decisions and comparing everyday trade-offs.'},
{emoji:'✦',title:'Thrive · ages 13–17',desc:'Explore advanced decisions, borrowing, investing risks and long-term planning through fictional examples.'},
{emoji:'📚',title:'40 curriculum topics',desc:'A library of financial-literacy topics for parent-led practice. Full media lessons and games are still undergoing release testing.'},
{emoji:'👨‍👩‍👧',title:'Parent-owned profiles',desc:'Parents can create up to four nickname-based child profiles, manage them and delete them from their accounts.'},
{emoji:'🔒',title:'Privacy-first access',desc:'Children cannot access the unfinished child-facing service. Adult practice progress is scoped to the authenticated owner.'}
]
export default function Features(){return <section id="features" className="bg-cream py-20">
<div className="max-w-6xl mx-auto px-6"><h2 className="text-4xl font-black text-sprout-900 mb-4">Learn at every age</h2>
<p className="text-bark-500 mb-9 max-w-2xl">Financial literacy is a lifelong skill. Sprout starts with a thoughtful, parent-led learning space.</p>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{features.map(f=><article key={f.title}
 className="bg-white rounded-2xl border border-bark-200 p-6"><div className="text-4xl mb-3">{f.emoji}</div>
<h3 className="font-bold text-bark-600 text-lg mb-2">{f.title}</h3><p className="text-sm text-bark-500">{f.desc}</p></article>)}</div>
</div></section>}
