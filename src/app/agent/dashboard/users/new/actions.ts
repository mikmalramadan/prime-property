'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
})

export type CreateUserState = {
  error?: string
  success?: boolean
  fieldErrors?: Record<string, string[]>
} | null

export async function createUserAction(
  prevState: CreateUserState | null,
  formData: FormData
): Promise<CreateUserState> {
  // Hanya superadmin yang bisa akses
  await requireRole('superadmin')

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const validation = createUserSchema.safeParse({ email, password, name })

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    }
  }

  try {
    // 1. Buat user di Supabase Auth menggunakan Admin SDK
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validation.data.email,
      password: validation.data.password,
      email_confirm: true, // Auto confirm
      user_metadata: {
        name: validation.data.name,
      }
    })

    if (authError || !authData.user) {
      return { error: authError?.message || 'Gagal membuat user auth' }
    }

    const userId = authData.user.id

    // 2. Karena trigger Supabase sudah meng-insert row default ke tabel `profiles` 
    // dengan role='agent' secara otomatis saat signup, 
    // kita perlu MENG-UPDATE (bukan insert) row tersebut agar role='admin'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabaseAdmin.from('profiles') as any)
      .update({
        role: 'admin',
        is_active: true
      })
      .eq('id', userId)

    if (profileError) {
      // Rollback jika gagal update profile (best effort)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return { error: `Gagal set role admin: ${profileError.message}` }
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Terjadi kesalahan internal' }
  }
}
