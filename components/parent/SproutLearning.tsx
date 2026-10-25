'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { approvedTopics } from '@/lib/sprout/approved-topics'
type Stage = 'explore' | 'build' | 'thrive'
type Progress = { module_id: string, quiz_best_score: number, completed_lesson_ids: string[], band: Stage }
const stages: { key: Stage, title: string, ages: string }[] = [
  {key:'explore',title:'Explore',ages:'5–8'}, {key:'build',title:'Build',ages:'9–12'}, {key:'thrive',title:'Thrive',ages:'13–17'},
]
export default function SproutLearning() {
  const [stage,setStage] = useState<Stage>('build')
  const [search,setSearch] = useState('')
  const [selected,setSelected] = useState<string|null>(null)
  const [answer,setAnswer] = useState<'truth'|'falsehood'|null>(null)
  const [saved,setSaved] = useState<Record<string,Progress>>({})
  const [status,setStatus] = useState('')
  const [loading,setLoading] = useState(true)
  const [working,setWorking] = useState(false)
  const visible = useMemo(()=>approvedTopics.filter(m=>m.id.toLowerCase().includes(search.toLowerCase())||m.title.toLowerCase().includes(search.toLowerCase())),[search])
  const current = approvedTopics.find(m=>m.id===selected)
  useEffect(()=>{
    let active=true
    async function load() {
      const client=createClient()
      const { data, error } = await client.from('sprout_adult_practice_progress')
        .select('module_id,quiz_best_score,completed_lesson_ids,band')
      if (!active)return
      if(error)setStatus('Could not load saved practice progress: '+error.message)
      else setSaved(Object.fromEntries((data??[]).map(r=>[r.module_id+':'+r.band,r as Progress])))
      setLoading(false)
    }
    void load()
    return ()=>{active=false}
  },[])
  async function savePractice() {
    if(!current || answer===null || working)return
    const right=answer==='truth'
    if(!right){setStatus('Try again: look for the accurate statement.');return}
    setWorking(true);setStatus('')
    try {
      const client=createClient()
      const { data:{user}, error:authErr}=await client.auth.getUser()
      if(authErr||!user)throw new Error('Your session expired. Please sign in again.')
      const key=current.id+':'+stage
      const prev=saved[key]
      const {error}=await client.from('sprout_adult_practice_progress').upsert({
        user_id:user.id,module_id:current.id,band:stage,
        quiz_best_score:100,completed_lesson_ids:['intro-practice'],
        updated_at:new Date().toISOString(),
      },{onConflict:'user_id,module_id,band'})
      if(error)throw error
      setSaved(s=>({...s,[key]:{module_id:current.id,band:stage,quiz_best_score:100,completed_lesson_ids:['intro-practice']}}))
      setStatus(prev?'Practice progress saved again.':'Practice complete. Progress saved to your adult account.')
    }catch(e){setStatus(e instanceof Error?e.message:'Could not save practice.')}
    finally{setWorking(false)}
  }
  function select(id:string){setSelected(id);setAnswer(null);setStatus('')}
  const completed=Object.values(saved).filter(x=>x.band===stage&&x.completed_lesson_ids.includes('intro-practice')).length
  return <section className="space-y-6 max-w-6xl mx-auto">
    <header className="space-y-2"><p className="text-sm text-sprout-600 font-bold uppercase tracking-widest">Parent-led curriculum exploration</p>
      <h1 className="text-3xl font-black text-sprout-900">Explore Sprout lessons</h1>
      <p className="text-bark-500">Forty approved learning topics. These are short introductory practice activities for the signed-in adult; the complete child-directed media lessons and games are not yet certified for release.</p>
      <p className="text-sm font-semibold text-sprout-700">{loading?'Loading saved progress…':completed+' of 40 introductory topics practiced at this stage'}</p>
    </header>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Learning stage">
      {stages.map(x=><button key={x.key} type="button" onClick={()=>{setStage(x.key);setAnswer(null);setStatus('')}}
        aria-pressed={stage===x.key} className={'px-4 py-2 rounded-xl font-semibold border '+(stage===x.key?'bg-sprout-700 text-white border-sprout-700':'bg-white text-sprout-800 border-bark-200')}>{x.title} · {x.ages}</button>)}
    </div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(310px,1fr)] gap-6">
      <div className="bg-white border border-bark-200 rounded-2xl p-5">
        <label htmlFor="topic-filter" className="text-sm font-bold block mb-2">Find a topic</label>
        <input id="topic-filter" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search all 40 topics…" className="w-full rounded-xl border border-bark-200 px-4 py-3 mb-4" />
        <div className="grid sm:grid-cols-2 gap-2">
          {visible.map(m=><button key={m.id} type="button" onClick={()=>select(m.id)} aria-pressed={selected===m.id}
            className={'text-left px-4 py-3 rounded-xl border text-sm '+(selected===m.id?'border-sprout-700 bg-sprout-50':'border-bark-200 hover:bg-cream')}>
            <strong className="block text-sprout-800">{m.id} · {m.title}</strong>
            <span className="text-xs text-bark-500">{saved[m.id+':'+stage]?.quiz_best_score===100?'✓ Practiced':'Open practice'}</span>
          </button>)}
        </div>
        {visible.length===0&&<p className="text-bark-500">No matching topics.</p>}
      </div>
      <div className="bg-white border border-bark-200 rounded-2xl p-6 h-fit lg:sticky lg:top-5">
        {!current?<p className="text-bark-500">Choose a curriculum topic to open a short practice activity.</p>:<>
          <p className="text-sm font-bold text-sprout-600 mb-2">{current.id} · {stage.toUpperCase()}</p>
          <h2 className="text-2xl font-black text-sprout-900 mb-3">{current.title}</h2>
          <p className="text-bark-500 mb-5">{current.summary}</p>
          <h3 className="font-bold text-bark-600 mb-3">Which statement is accurate?</h3>
          <div className="space-y-2">
            {([{key:'truth',text:current.truth},{key:'falsehood',text:current.falsehood}] as const).map(opt=><button
              type="button" key={opt.key} aria-pressed={answer===opt.key} onClick={()=>{setAnswer(opt.key);setStatus('')}}
              className={'block w-full text-left border rounded-xl p-4 '+(answer===opt.key?'border-sprout-700 bg-sprout-50':'border-bark-200')}>
              {opt.text}
            </button>)}
          </div>
          {status&&<p className="my-3 text-sm text-sprout-800" role="status">{status}</p>}
          <button type="button" disabled={!answer||working||loading} onClick={()=>void savePractice()}
            className="mt-5 rounded-xl px-5 py-3 bg-sprout-700 text-white font-bold disabled:opacity-50">
            {working?'Saving…':'Check answer & save practice'}
          </button>
          <p className="text-xs text-bark-400 mt-4">Only pretend examples. This activity stores progress in your adult account, not a child's profile, and is not personal financial advice.</p>
        </>}
      </div>
    </div>
  </section>
}
