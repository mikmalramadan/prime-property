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
