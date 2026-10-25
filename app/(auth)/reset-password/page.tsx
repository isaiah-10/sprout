'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/client'
import SproutLogo from '@/components/layout/SproutLogo'
export default function ResetPasswordPage(){
 const [password,setPassword]=useState('')
 const [confirm,setConfirm]=useState('')
 const [busy,setBusy]=useState(false)
 const [authorized,setAuthorized]=useState(false)
 const [checking,setChecking]=useState(true)
 const [done,setDone]=useState(false)
 const [error,setError]=useState('')
 useEffect(()=>{
  let active=true
  const client=createClient()
  void client.auth.getUser().then(({data})=>{if(active){setAuthorized(Boolean(data.user));setChecking(false)}})
  return ()=>{active=false}
 },[])
 async function change(e:React.FormEvent){
  e.preventDefault();setError('')
  if(password.length<12){setError('Use a password of at least 12 characters.');return}
  if(password!==confirm){setError('Passwords do not match.');return}
  setBusy(true)
  const client=createClient()
  const {error}=await client.auth.updateUser({password})
  if(error){setError(error.message);setBusy(false);return}
  setDone(true);setBusy(false)
 }
 return <div className="w-full max-w-md mx-auto bg-white border border-bark-200 rounded-3xl p-8">
  <div className="flex justify-center mb-6"><SproutLogo size="lg"/></div>
  <h1 className="text-2xl font-black mb-4 text-center">Choose a new password</h1>
  {checking?<p role="status">Checking your recovery session…</p>:!authorized?
   <p role="alert" className="text-bark-500">This reset link is invalid or expired. <Link href="/forgot-password" className="text-sprout-700 underline">Request another link</Link>.</p>:
   done?<div role="status"><p className="text-green-800">Your password has been updated.</p><Link className="block mt-4 underline text-sprout-700" href="/parent">Open your parent dashboard</Link></div>:
    <form onSubmit={change} className="space-y-4">
      <label htmlFor="new-password" className="block text-sm font-semibold">New password</label>
      <input id="new-password" type="password" required autoComplete="new-password" value={password}
       onChange={e=>setPassword(e.target.value)} minLength={12} className="w-full rounded-xl border border-bark-200 p-3"/>
      <label htmlFor="confirm-password" className="block text-sm font-semibold">Confirm new password</label>
      <input id="confirm-password" type="password" required autoComplete="new-password" value={confirm}
       onChange={e=>setConfirm(e.target.value)} minLength={12} className="w-full rounded-xl border border-bark-200 p-3"/>
      {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-sprout-700 p-3 text-white font-bold disabled:opacity-50" type="submit">{busy?'Updating…':'Update password'}</button>
    </form>}
 </div>
}
