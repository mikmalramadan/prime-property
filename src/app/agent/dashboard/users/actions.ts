'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
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

  revalidatePath('/agent/users')
}

/**
 * Reset an admin's password by sending a recovery email via Supabase.
 */
export async function resetAdminPassword(email: string) {
  await requireRole('superadmin')

  // Ambil origin (localhost atau production) dari env
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/agent/update-password`,
  })

  if (error) {
    throw new Error(`Gagal mengirim email reset: ${error.message}`)
  }

  return { success: true }
}
