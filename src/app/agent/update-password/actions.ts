'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const passwordSchema = z.object({
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword']
})

export type UpdatePasswordState = {
  success?: boolean
  error?: string
  fieldErrors?: {
    password?: string[]
    confirmPassword?: string[]
  }
} | null

export async function updatePasswordAction(
  prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const validated = passwordSchema.safeParse({ password, confirmPassword })

  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  const supabase = await createClient()

  // Verify the user is authenticated (which they should be if they clicked the reset link and exchanged the code)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Sesi Anda telah berakhir atau tidak valid. Silakan ulangi proses reset password.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
