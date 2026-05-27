import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const patchSchema = z.object({
  action: z.enum(['toggle_status', 'reset_password']),
  is_active: z.boolean().optional(),
  email: z.string().email().optional(),
})

// PATCH: Toggle active status atau reset password
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check + role check (hanya superadmin)
    await requireRole('superadmin')

    const resolvedParams = await params
    const id = resolvedParams.id
    
    const body = await request.json()
    const validatedData = patchSchema.parse(body)

    if (validatedData.action === 'toggle_status') {
      if (typeof validatedData.is_active !== 'boolean') {
        return NextResponse.json({ error: 'Field is_active wajib untuk action toggle_status' }, { status: 400 })
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        // @ts-expect-error Type inference issue with generated schema
        .update({ is_active: validatedData.is_active })
        .eq('id', id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Status admin berhasil diperbarui' })
    } 
    
    if (validatedData.action === 'reset_password') {
      if (!validatedData.email) {
        return NextResponse.json({ error: 'Field email wajib untuk action reset_password' }, { status: 400 })
      }

      // Gunakan admin SDK untuk mengirim email reset password
      const { error } = await supabaseAdmin.auth.resetPasswordForEmail(validatedData.email)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Email reset password telah dikirim' })
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 })

  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validasi gagal', details: error.flatten().fieldErrors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
