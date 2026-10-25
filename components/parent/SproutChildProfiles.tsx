'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ChildProfile = {
  id: string
  nickname: string
  age_band: 'explore' | 'build' | 'thrive'
  avatar_key: string
  consent_status: 'pending' | 'verified' | 'withdrawn'
}
const ageLabels: Record<ChildProfile['age_band'], string> = {
  explore: 'Explore (ages 5–8)',
  build: 'Build (ages 9–12)',
  thrive: 'Thrive (ages 13–17)',
}

export default function SproutChildProfiles() {
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [nickname, setNickname] = useState('')
  const [band, setBand] = useState<ChildProfile['age_band']>('explore')
  const [status, setStatus] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingBand, setEditingBand] = useState<ChildProfile['age_band']>('explore')
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)

  async function refresh() {
    const supabase = createClient()
    const { data, error } = await supabase.from('sprout_child_profiles')
      .select('id,nickname,age_band,avatar_key,consent_status')
      .order('created_at', { ascending: true })
    if (error) setStatus('Could not load child profiles. ' + error.message)
    else setChildren((data ?? []) as ChildProfile[])
    setLoaded(true)
  }

  useEffect(() => { void refresh() }, [])

  async function addChild(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nickname.trim()
    if (!name || name.length > 32 || children.length >= 4) return
    setBusy(true)
    setStatus('')
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Please sign in again.')
      const { error } = await supabase.from('sprout_child_profiles').insert({
        parent_id: user.id,
        nickname: name,
        age_band: band,
        avatar_key: 'leaf',
        consent_status: 'pending',
      })
      if (error) throw error
      setNickname('')
      setStatus('Child profile created. Learning remains locked until verifiable parental consent is completed.')
      await refresh()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not add profile.')
    } finally { setBusy(false) }
  }

  async function updateChild(childId: string) {
    if (busy) return
    const nextName = editingName.trim()
    if (!nextName || nextName.length > 32) { setStatus('Nickname must be 1–32 characters.'); return }
    setBusy(true); setStatus('')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('sprout_child_profiles').update({
        nickname: nextName, age_band: editingBand, updated_at: new Date().toISOString(),
      }).eq('id', childId)
      if (error) throw error
      setEditingId(null)
      setStatus('Child profile updated.')
      await refresh()
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Update failed.') }
    finally { setBusy(false) }
  }

  async function deleteChild(childId: string, name: string) {
    if (!window.confirm(`Delete ${name}'s profile and its saved progress?`)) return
    setBusy(true)
    setStatus('')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('sprout_child_profiles').delete().eq('id', childId)
      if (error) throw error
      setStatus('Child profile deleted.')
      await refresh()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Deletion failed.')
    } finally { setBusy(false) }
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6" aria-label="Manage child profiles">
      <div className="bg-white rounded-2xl border border-bark-200 p-6">
        <h1 className="text-2xl font-black text-sprout-800 mb-2">Family profiles</h1>
        <p className="text-bark-500 text-sm mb-4">Add up to four learning profiles. Use a nickname, not a legal name or birth date. Only the signed-in parent can view or manage these profiles.</p>
        <p className="text-xs rounded-xl bg-amber-50 text-amber-900 p-3 mb-5">Profiles are stored securely. Child-facing learning remains unavailable until verifiable parental consent is implemented and confirmed; checking a box alone does not grant consent.</p>
        {status && <p role="status" className="rounded-xl bg-sprout-50 border border-sprout-200 p-3 text-sm text-sprout-800 mb-4">{status}</p>}
        <form onSubmit={addChild} className="space-y-3">
          <label htmlFor="child-nickname" className="text-sm font-semibold block">Child nickname</label>
          <input id="child-nickname" value={nickname} onChange={e=>setNickname(e.target.value)}
            minLength={1} maxLength={32} required placeholder="A nickname"
            className="w-full rounded-xl border border-bark-200 px-4 py-3" />
          <label htmlFor="child-band" className="text-sm font-semibold block">Learning stage</label>
          <select id="child-band" value={band} onChange={e=>setBand(e.target.value as ChildProfile['age_band'])}
            className="w-full rounded-xl border border-bark-200 px-4 py-3">
            <option value="explore">{ageLabels.explore}</option>
            <option value="build">{ageLabels.build}</option>
            <option value="thrive">{ageLabels.thrive}</option>
          </select>
          <button disabled={busy || !loaded || children.length >= 4} type="submit"
            className="rounded-xl bg-sprout-700 text-white font-bold px-6 py-3 disabled:opacity-50">
            {busy ? 'Saving…' : 'Add child profile'}
          </button>
          {children.length >= 4 && <p className="text-sm text-bark-500">Four profiles created. No paid upgrade is required.</p>}
        </form>
      </div>
      <div className="space-y-3">
        <h2 className="font-bold text-lg">Saved profiles ({children.length}/4)</h2>
        {!loaded && <p>Loading profiles…</p>}
        {loaded && children.length===0 && <p className="text-bark-500">No child profiles yet.</p>}
        {children.map(child=>(
          <div key={child.id} className="bg-white rounded-2xl border border-bark-200 p-5 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="font-bold text-sprout-800">🌱 {child.nickname}</p>
              <p className="text-sm text-bark-500">{ageLabels[child.age_band]}</p>
              <p className="text-xs text-amber-700">Consent: {child.consent_status === 'verified' ? 'verified' : 'pending — learning locked'}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" disabled={busy} onClick={()=>{setEditingId(child.id);setEditingName(child.nickname);setEditingBand(child.age_band);setStatus('')}}
                className="rounded-xl border border-sprout-200 px-4 py-2 text-sprout-800 text-sm font-semibold disabled:opacity-50">Edit</button>
              <button type="button" disabled={busy} onClick={()=>void deleteChild(child.id,child.nickname)}
                className="rounded-xl border border-red-200 px-4 py-2 text-red-700 text-sm font-semibold disabled:opacity-50">Delete</button>
            </div>
            {editingId===child.id && <div className="basis-full w-full border-t border-bark-100 pt-4 flex flex-col gap-2">
              <label htmlFor={'edit-name-'+child.id} className="font-semibold text-sm">Edit nickname</label>
              <input id={'edit-name-'+child.id} value={editingName} maxLength={32}
                onChange={e=>setEditingName(e.target.value)} className="rounded-xl border border-bark-200 px-4 py-2"/>
              <label htmlFor={'edit-band-'+child.id} className="font-semibold text-sm">Edit learning stage</label>
              <select id={'edit-band-'+child.id} value={editingBand} onChange={e=>setEditingBand(e.target.value as ChildProfile['age_band'])}
                className="rounded-xl border border-bark-200 px-4 py-2">
                <option value="explore">{ageLabels.explore}</option><option value="build">{ageLabels.build}</option><option value="thrive">{ageLabels.thrive}</option>
              </select>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={()=>void updateChild(child.id)}
                  className="rounded-xl bg-sprout-700 px-4 py-2 text-white font-semibold disabled:opacity-50">Save</button>
                <button type="button" onClick={()=>setEditingId(null)} className="rounded-xl px-4 py-2 border border-bark-200">Cancel</button>
              </div>
            </div>}
          </div>
        ))}
      </div>
    </section>
  )
}
