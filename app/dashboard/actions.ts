'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function addTodo(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return
  const { supabase, user } = await requireUser()
  await supabase.from('todos').insert({ title, user_id: user.id })
  revalidatePath('/dashboard')
}

export async function toggleTodo(id: string, isComplete: boolean) {
  const { supabase, user } = await requireUser()
  await supabase.from('todos').update({ is_complete: isComplete }).eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}

export async function deleteTodo(id: string) {
  const { supabase, user } = await requireUser()
  await supabase.from('todos').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
}
