'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/format'

// ---------------------------------------------------------------------------
// Rate Limiter for Login (15 min lockout after 5 fails within 30 mins)
// ---------------------------------------------------------------------------
const loginAttempts = new Map<string, { failures: number[]; lockedUntil: number | null }>()

function checkLoginLockout(email: string): { isLocked: boolean; lockTimeStr?: string } {
  const record = loginAttempts.get(email)
  if (!record) return { isLocked: false }

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const lockTimeStr = formatDateTime(new Date(record.lockedUntil).toISOString())
    return { isLocked: true, lockTimeStr }
  }

  // Lock expired, reset
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    loginAttempts.delete(email)
  }
  
  return { isLocked: false }
}

function recordFailedLogin(email: string) {
  const now = Date.now()
  const record = loginAttempts.get(email) || { failures: [], lockedUntil: null }
  
  // Remove failures older than 30 minutes
  record.failures = record.failures.filter(t => now - t < 30 * 60 * 1000)
  record.failures.push(now)

  if (record.failures.length >= 5) {
    // Lock for 15 minutes
    record.lockedUntil = now + 15 * 60 * 1000
    record.failures = [] // reset strikes after locking
  }

  loginAttempts.set(email, record)
}

function clearLoginAttempts(email: string) {
  loginAttempts.delete(email)
}

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

  // Check Lockout
  const lockoutStatus = checkLoginLockout(email)
  if (lockoutStatus.isLocked) {
    return { error: `Akun terkunci sementara. Silakan coba lagi setelah ${lockoutStatus.lockTimeStr}.` }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Record failed attempt
    recordFailedLogin(email)

    // Map common Supabase Auth errors to Indonesian messages
    if (error.message.includes('Invalid login credentials')) {
      const record = loginAttempts.get(email)
      const attemptsLeft = 5 - (record?.failures.length || 0)
      if (attemptsLeft <= 0) {
        return { error: 'Terlalu banyak percobaan gagal. Akun dikunci sementara.' }
      }
      return { error: `Email atau password salah. Sisa percobaan: ${attemptsLeft}` }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email belum dikonfirmasi. Hubungi superadmin.' }
    }
    return { error: 'Gagal login. Silakan coba lagi.' }
  }

  // Successful login, clear attempts
  clearLoginAttempts(email)

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
