'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginFormState = {
  error?: string
} | null

// ---------------------------------------------------------------------------
// Sign In
// ---------------------------------------------------------------------------

export async function signIn(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email    = (formData.get('email')    as string)?.trim() ?? ''
  const password = (formData.get('password') as string) ?? ''

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Map common Supabase Auth errors to Indonesian messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email atau password salah.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email belum dikonfirmasi. Hubungi superadmin.' }
    }
    return { error: 'Gagal login. Silakan coba lagi.' }
  }

  // Verify that this user has a profile (agents only)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (!profile) {
      await supabase.auth.signOut()
      return { error: 'Akun Anda tidak terdaftar sebagai agent.' }
    }

    const p = profile as { is_active: boolean }
    if (!p.is_active) {
      await supabase.auth.signOut()
      return { error: 'Akun Anda telah dinonaktifkan. Hubungi superadmin.' }
    }
  }

  // Read the ?next= param from the form's hidden field
  const next = (formData.get('next') as string) || '/agent/dashboard'

  redirect(next)
}
