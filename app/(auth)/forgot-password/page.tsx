'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SproutLogo from '@/components/layout/SproutLogo'
export default function ForgotPasswordPage(){
 const [email,setEmail]=useState('')
 const [busy,setBusy]=useState(false)
 const [sent,setSent]=useState(false)
 const [error,setError]=useState('')
 async function send(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('')
  try{
   const client=createClient()
   const {error}=await client.auth.resetPasswordForEmail(email.trim(),{
    redirectTo:window.location.origin+'/api/auth/callback?next=/reset-password',
   })
   if(error)throw error
   // Generic response: prevent revealing whether an account exists.
   setSent(true)
  }catch(e){setError(e instanceof Error?e.message:'Request failed.')}
  finally{setBusy(false)}
 }
 return <div className="w-full max-w-md mx-auto bg-white border border-bark-200 rounded-3xl shadow-sm p-8">
  <div className="flex justify-center mb-7"><SproutLogo size="lg"/></div>
  <h1 className="text-2xl font-black text-sprout-900 text-center mb-3">Reset your password</h1>
  <p className="text-bark-500 text-sm text-center mb-5">Enter your parent account email. If it exists, you’ll receive a password recovery link.</p>
  {sent?<p role="status" className="bg-sprout-50 border border-sprout-200 rounded-xl p-4 text-sm">If an account exists for that email, a recovery link has been sent. Check your inbox and spam folder.</p>:
   <form onSubmit={send} className="space-y-4">
    <label className="block text-sm font-semibold" htmlFor="recovery-email">Email address</label>
    <input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}
     className="w-full border border-bark-200 px-4 py-3 rounded-xl" placeholder="parent@example.com"/>
    {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
    <button disabled={busy} className="w-full bg-sprout-700 text-white rounded-xl font-bold p-3 disabled:opacity-50" type="submit">{busy?'Sending…':'Email reset link'}</button>
   </form>}
  <Link href="/login" className="block text-sm text-sprout-700 font-semibold mt-6 text-center">Return to login</Link>
 </div>
}
