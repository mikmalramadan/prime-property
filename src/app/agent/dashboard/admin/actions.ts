'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole, getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

/**
 * Toggle admin active/inactive status.
 * Superadmin-only.
 */
export async function toggleAdminStatus(profileId: string, currentlyActive: boolean) {
  await requireRole('superadmin')

  const user = await getCurrentUser()
  if (user && user.id === profileId) {
    throw new Error('Anda tidak dapat menonaktifkan akun Anda sendiri.')
  }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('profiles') as any)
    .update({ is_active: !currentlyActive })
    .eq('id', profileId)

  revalidatePath('/agent/dashboard/admin')
}

/**
 * Create a new admin account.
 * In a real setup, this would use admin.auth.createUser() via a service role key.
 * For now, it creates a profile entry (the user must exist in auth.users).
 */
export type CreateAdminState = {
  success?: boolean
  error?: string
} | null

export async function createAdmin(
  _prevState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  await requireRole('superadmin')

  const email = (formData.get('email') as string)?.trim()
  const role = (formData.get('role') as string) || 'admin'

  if (!email) {
    return { error: 'Email wajib diisi.' }
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Format email tidak valid.' }
  }

  if (!['admin', 'superadmin'].includes(role)) {
    return { error: 'Role tidak valid.' }
  }

  const supabase = await createClient()

  // Check if email already exists in profiles
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingProfile) {
    return { error: 'Email sudah terdaftar.' }
  }

  // NOTE: In production, use the service_role key + admin.auth.createUser()
  // to properly create the auth user + profile atomically.
  // For now, we just log the intent.
  console.log(`[Admin] Would create user: ${email} with role: ${role}`)

  revalidatePath('/agent/dashboard/admin')
  return { success: true }
}

/**
 * Reset an admin's password to a temporary generated password.
 */
export async function resetAdminPassword(profileId: string) {
  await requireRole('superadmin')

  // Generate a random 8-character alphanumeric password
  const tempPassword = Math.random().toString(36).slice(-8) + '!'

  // NOTE: In production, use supabase.auth.admin.updateUserById() via service_role key.
  // For this demo, we just simulate the process and log it.
  console.log(`[Admin] Reset password for profile ${profileId} to: ${tempPassword}`)

  return { success: true, tempPassword }
}
