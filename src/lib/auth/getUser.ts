import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ProfileRow, UserRole } from '@/types/database'

/**
 * Get the currently authenticated user from Supabase Auth.
 *
 * Uses getUser() (NOT getSession()) because getUser() verifies the token
 * with the Auth server and is safe for authorization decisions.
 *
 * Returns null if no user is logged in.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's profile (with role) from the profiles table.
 * Returns null if no user or no profile found.
 */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data ? (data as ProfileRow) : null
}

/**
 * Require authentication — redirects to /agent/login if not logged in.
 * Use in Server Components and Server Actions that need a logged-in user.
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/agent/login')
  }
  return user
}

/**
 * Ambil user + profile (role) dari server.
 * Throw 403 (atau redirect dengan error forbidden) jika role tidak cukup.
 *
 * @param role The required role ('admin' or 'superadmin').
 *             'admin' allows both admin and superadmin.
 *             'superadmin' allows only superadmin.
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth()

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/agent/login')
  }

  const p = profile as Pick<ProfileRow, 'role' | 'is_active'>

  // Disabled accounts cannot access anything
  if (!p.is_active) {
    redirect('/agent/deactivated')
  }

  // Role check: 'admin' allows both, 'superadmin' only superadmin
  if (role === 'superadmin' && p.role !== 'superadmin') {
    redirect('/agent/dashboard?error=forbidden')
  }

  return { user, role: p.role }
}
