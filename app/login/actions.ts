'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getOrigin() {
  const h = await headers()
  return h.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

function fail(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`)
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (error) fail(error.message)
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const origin = await getOrigin()
  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    options: { emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error) fail(error.message)
  if (!data.session) {
    // Email confirmation is enabled in Supabase
    redirect('/login?message=' + encodeURIComponent('Check your email to confirm your account.'))
  }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  const origin = await getOrigin()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  })
  if (error || !data.url) fail(error?.message ?? 'OAuth failed')
  redirect(data.url)
}

export async function signInWithGoogle() {
  await signInWithOAuth('google')
}

export async function signInWithGitHub() {
  await signInWithOAuth('github')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
