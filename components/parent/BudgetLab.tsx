'use client'
import { useMemo, useState } from 'react'
type Item={label:string,cost:number,kind:'need'|'want'}
const choices:Item[]=[
{label:'Groceries',cost:120,kind:'need'},
{label:'Rent contribution',cost:210,kind:'need'},
{label:'Bus pass',cost:40,kind:'need'},
{label:'Movie night',cost:35,kind:'want'},
{label:'New headphones',cost:80,kind:'want'},
{label:'Art supplies',cost:30,kind:'want'},
]
const money=(v:number)=>'$'+v.toFixed(0)
export default function BudgetLab(){
 const [selected,setSelected]=useState<string[]>([])
 const [savings,setSavings]=useState(75)
 const [round,setRound]=useState(0)
 const [answers,setAnswers]=useState<Record<string,'need'|'want'>>({})
 const [showAnswer,setShowAnswer]=useState(false)
 const income=500
 const spent=choices.filter(x=>selected.includes(x.label)).reduce((sum,x)=>sum+x.cost,0)
 const left=income-spent-savings
 const needsCovered=choices.filter(x=>x.kind==='need').every(x=>selected.includes(x.label))
 const passed=needsCovered&&left>=0&&savings>=50
 const score=Object.keys(answers).filter(label=>choices.find(x=>x.label===label)?.kind===answers[label]).length
 const gameComplete=Object.keys(answers).length===choices.length
 const toggle=(label:string)=>{setSelected(old=>old.includes(label)?old.filter(v=>v!==label):[...old,label]);setShowAnswer(false)}
 const feedback=useMemo(()=>left<0?'Your plan spends more than the available fictional income.':!needsCovered?'Cover the three essentials before adding extras.':savings<50?'Try saving at least $50 for the goal.':'A balanced plan: essentials, a saving goal, and no overspending.',[left,needsCovered,savings])
 return <main className="page-inner max-w-5xl mx-auto space-y-8">
  <div><p className="text-sprout-700 text-sm font-bold uppercase tracking-widest">Adult-led fictional practice</p>
   <h1 className="text-3xl font-black text-sprout-900 mt-2">Budget Lab</h1>
   <p className="text-bark-500 mt-2">Two interactive mini-games for a parent to explore. All numbers are pretend. No money, accounts, or child information are used.</p></div>
  <section className="bg-white border border-bark-200 rounded-3xl p-6 space-y-5">
   <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="font-black text-2xl text-sprout-800">1. Build a monthly budget</h2>
   <span className="bg-sprout-100 text-sprout-900 px-4 py-2 rounded-full font-bold">Fictional income: $500</span></div>
   <p className="text-bark-500">Your goal: cover essential costs, save at least $50, and avoid spending more than the fictional income.</p>
   <div className="grid sm:grid-cols-2 gap-3">{choices.map(x=><button type="button" key={x.label}
    aria-pressed={selected.includes(x.label)} onClick={()=>toggle(x.label)}
    className={'text-left border-2 rounded-xl p-4 transition-colors '+(selected.includes(x.label)?'border-sprout-700 bg-sprout-50':'border-bark-200 bg-white')}>
     <span className="font-bold block">{selected.includes(x.label)?'✓ ':''}{x.label}</span><span className="text-bark-500">{money(x.cost)}</span>
   </button>)}</div>
   <label htmlFor="savings-range" className="block font-bold">Choose a saving goal: {money(savings)}</label>
   <input id="savings-range" type="range" min={0} max={200} step={25} value={savings}
     onChange={e=>{setSavings(Number(e.target.value));setShowAnswer(false)}} className="w-full" />
   <div className="grid sm:grid-cols-3 gap-3 text-center">
    <div className="bg-cream p-4 rounded-xl"><span className="text-sm text-bark-500 block">Expenses</span><strong className="text-xl">{money(spent)}</strong></div>
    <div className="bg-cream p-4 rounded-xl"><span className="text-sm text-bark-500 block">Savings</span><strong className="text-xl">{money(savings)}</strong></div>
    <div className={'p-4 rounded-xl '+(left<0?'bg-red-50 text-red-800':'bg-sprout-50 text-sprout-800')}>
     <span className="text-sm block">Remaining</span><strong className="text-xl">{money(left)}</strong>
    </div>
   </div>
   <button type="button" onClick={()=>setShowAnswer(true)}
    className="bg-sprout-700 text-white font-bold px-5 py-3 rounded-xl">Check my budget</button>
   {showAnswer&&<p role="status" className={'rounded-xl p-4 '+(passed?'bg-green-50 text-green-900':'bg-amber-50 text-amber-900')}>
    {passed?'✓ Goal met! ':'Keep adjusting. '}{feedback}</p>}
  </section>
  <section className="bg-white border border-bark-200 rounded-3xl p-6 space-y-5">
   <h2 className="font-black text-2xl text-sprout-800">2. Needs or wants?</h2>
   <p className="text-bark-500">Classify these everyday choices. The examples are simplified: context can change whether something is essential.</p>
   <div className="space-y-3">{choices.map(item=><div key={item.label} className="border border-bark-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
    <strong>{item.label}</strong><div role="group" aria-label={'Classify '+item.label} className="flex gap-2">
    {(['need','want'] as const).map(a=><button type="button" key={a} aria-pressed={answers[item.label]===a}
      onClick={()=>setAnswers(v=>({...v,[item.label]:a}))}
      className={'rounded-lg px-4 py-2 border font-semibold '+(answers[item.label]===a?'bg-sprout-700 border-sprout-700 text-white':'border-bark-200')}>
     {a==='need'?'Need':'Want'}</button>)}</div></div>)}</div>
   <p role="status" className="bg-cream rounded-xl p-4">Answered {Object.keys(answers).length} of {choices.length}
    {gameComplete?' · '+score+' correct. '+(score===choices.length?'Perfect round!':'Review the difference between essentials and extras.'):'.'}</p>
   <button type="button" className="border border-bark-200 rounded-xl px-4 py-2" onClick={()=>{setAnswers({});setRound(v=>v+1)}}>Play again</button>
   <p className="sr-only">Round {round+1}</p>
  </section>
 </main>
}
