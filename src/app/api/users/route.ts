import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

// GET: Ambil daftar semua admin
export async function GET() {
  try {
    // Pastikan hanya superadmin yang bisa akses
    await requireRole('superadmin')

    const supabase = await createClient()
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: profiles })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST: Buat admin baru
export async function POST(request: Request) {
  try {
    // Pastikan hanya superadmin yang bisa akses
    await requireRole('superadmin')

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // 1. Buat user di Supabase Auth via Admin SDK
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        name: validatedData.name,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
    }

    // 2. Tunggu sebentar agar trigger database selesai mengeksekusi insert ke profiles
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 3. Insert tabel profiles untuk set role = 'admin' dan nama
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: validatedData.email,
        role: 'admin',
        full_name: validatedData.name,
        is_active: true
      })

    if (profileError) {
      return NextResponse.json(
        { error: `User dibuat namun gagal update profile: ${profileError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin berhasil dibuat',
      userId: authData.user.id 
    }, { status: 201 })

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
