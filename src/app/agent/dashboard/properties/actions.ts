'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import type {
  AuditAction,
  PropertyTipe,
  PropertyStatus,
  PropertySiap,
} from '@/types/database'
import { propertySchema } from '@/lib/validations/property'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract and validate property data using Zod
 */
function parseFormData(formData: FormData) {
  const data = {
    nama_property: formData.get('nama_property'),
    group_name:    formData.get('group_name') || null,
    lebar:         Number(formData.get('lebar')),
    panjang:       Number(formData.get('panjang')),
    hadap:         (formData.get('hadap') as string).split(',').filter(Boolean),
    tipe:          formData.get('tipe'),
    tingkat:       Number(formData.get('tingkat')),
    price:         Number(formData.get('price')),
    carport:       formData.get('carport') === 'true',
    status:        formData.get('status'),
    siap:          formData.get('siap'),
    maps_link:     formData.get('maps_link') || null,
    kawasan:       (formData.get('kawasan') as string).split(',').filter(Boolean),
    unit:          formData.get('unit') || null,
  }

  const result = propertySchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach(issue => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message
      }
    })
    return { errors, data: null }
  }

  return { errors: null, data: result.data }
}

/**
 * Write an audit log entry.
 * Uses `as any` for the Supabase insert because the generated
 * Database type causes `never` inference for mutation operations
 * when Views/Functions are empty Records.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function writeAuditLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entry: {
    property_id: string
    user_id: string
    action: AuditAction
    changed_fields: unknown
  },
) {
  await (supabase.from('audit_logs') as any).insert(entry) // eslint-disable-line @typescript-eslint/no-explicit-any
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createProperty(
  _prevState: any,
  formData: FormData,
): Promise<{ success?: boolean; propertyId?: string; errors?: Record<string, string> }> {
  const { user } = await requireRole('superadmin')

  const { errors, data } = parseFormData(formData)
  if (errors || !data) return { errors: errors || { server: 'Invalid data' } }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inserted, error } = await (supabase.from('properties') as any)
    .insert({ ...data, created_by: user.id })
    .select('id')
    .single()

  if (error) {
    return { errors: { server: `Gagal menyimpan: ${error.message}` } }
  }

  const propertyId = (inserted as { id: string }).id

  await writeAuditLog(supabase, {
    property_id: propertyId,
    user_id: user.id,
    action: 'create',
    changed_fields: data,
  })

  return { success: true, propertyId }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateProperty(
  propertyId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ success?: boolean; propertyId?: string; errors?: Record<string, string> }> {
  const { user } = await requireRole('superadmin')

  const { errors, data } = parseFormData(formData)
  if (errors || !data) return { errors: errors || { server: 'Invalid data' } }

  const supabase = await createClient()

  // Get old data for audit diff
  const { data: oldData } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('properties') as any)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', propertyId)

  if (error) {
    return { errors: { server: `Gagal memperbarui: ${error.message}` } }
  }

  // Compute changed fields for audit
  const changedFields: Record<string, { old: unknown; new: unknown }> = {}
  if (oldData) {
    for (const key of Object.keys(data) as (keyof typeof data)[]) {
      const oldVal = (oldData as Record<string, unknown>)[key]
      const newVal = data[key]
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changedFields[key] = { old: oldVal, new: newVal }
      }
    }
  }

  await writeAuditLog(supabase, {
    property_id: propertyId,
    user_id: user.id,
    action: 'update',
    changed_fields: changedFields,
  })

  return { success: true, propertyId }
}

// ---------------------------------------------------------------------------
// Delete (soft)
// ---------------------------------------------------------------------------

export async function deleteProperty(propertyId: string): Promise<{ error?: string }> {
  const { user } = await requireRole('superadmin')

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('properties') as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', propertyId)

  if (error) {
    return { error: `Gagal menghapus: ${error.message}` }
  }

  await writeAuditLog(supabase, {
    property_id: propertyId,
    user_id: user.id,
    action: 'delete',
    changed_fields: null,
  })

  return {}
}
