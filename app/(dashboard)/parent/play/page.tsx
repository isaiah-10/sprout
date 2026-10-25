import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BudgetLab from '@/components/parent/BudgetLab'
export default async function PracticeGamesPage(){
 const supabase=await createClient()
 const {data:{user}}=await supabase.auth.getUser()
 if(!user)redirect('/login')
 return <BudgetLab/>
}
