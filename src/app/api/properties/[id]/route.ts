import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/auth'
import { propertySchema } from '@/lib/validations/property'

async function updatePropertyHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const propertyId = (await params).id
    const body = await req.json()
    
    // Server-side validation dengan Zod
    const result = propertySchema.safeParse(body)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      return NextResponse.json({ errors }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Dapatkan session user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Ambil data properti lama untuk menghitung diff
    const { data: oldData, error: fetchError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (fetchError || !oldData) {
      return NextResponse.json({ error: 'Properti tidak ditemukan.' }, { status: 404 })
    }

    // 3. Hitung diff lama vs baru
    const changedFields: Record<string, any> = {}
    const newData = result.data as Record<string, any>
    
    // Bandingkan setiap field dari skema Zod
    Object.keys(newData).forEach(key => {
      // Penanganan khusus untuk array (hadap, kawasan)
      if (Array.isArray(newData[key]) && Array.isArray(oldData[key])) {
        const sortedNew = [...newData[key]].sort().join(',')
        const sortedOld = [...oldData[key]].sort().join(',')
        if (sortedNew !== sortedOld) {
          changedFields[key] = { old: oldData[key], new: newData[key] }
        }
      } else if (newData[key] !== oldData[key]) {
        // Abaikan perubahan tipe data null vs undefined atau string kosong
        if (!newData[key] && !oldData[key]) return
        changedFields[key] = { old: oldData[key], new: newData[key] }
      }
    })

    // Jika tidak ada perubahan, langsung return sukses tanpa update
    if (Object.keys(changedFields).length === 0) {
      return NextResponse.json({ data: oldData }, { status: 200 })
    }

    // 4. Update properti dengan updated_at terbaru
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedProperty, error: updateError } = await (supabase.from('properties') as any)
      .update({
        ...result.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // 5. Insert ke audit_logs (Hanya jika ada diff)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('audit_logs') as any).insert({
      property_id: propertyId,
      user_id: session.user.id,
      action: 'update',
      changed_fields: changedFields
    })

    // Return properti terupdate
    return NextResponse.json({ data: updatedProperty }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 })
  }
}

// Hanya superadmin yang boleh melakukan PATCH
export const PATCH = withAuth(updatePropertyHandler, 'superadmin')

// ---------------------------------------------------------------------------
// DELETE Handler (Soft Delete Property)
// ---------------------------------------------------------------------------

async function deletePropertyHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const propertyId = (await params).id
    const supabase = await createClient()

    // 1. Dapatkan session user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Soft delete properti dengan update deleted_at
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deleteError } = await (supabase.from('properties') as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // 3. Insert ke audit_logs (action='delete')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('audit_logs') as any).insert({
      property_id: propertyId,
      user_id: session.user.id,
      action: 'delete',
      changed_fields: null
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 })
  }
}

// Hanya superadmin yang boleh melakukan DELETE
export const DELETE = withAuth(deletePropertyHandler, 'superadmin')
