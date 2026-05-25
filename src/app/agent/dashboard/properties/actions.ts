'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import type { PropertyFormState } from '@/components/properties/PropertyForm'
import type {
  AuditAction,
  PropertyTipe,
  PropertyStatus,
  PropertySiap,
} from '@/types/database'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Validate property form data (server-side).
 * Returns errors object if validation fails, null if valid.
 */
function validateProperty(formData: FormData): Record<string, string> | null {
  const errors: Record<string, string> = {}

  const nama = (formData.get('nama_property') as string)?.trim()
  if (!nama || nama.length < 3 || nama.length > 100) {
    errors.nama_property = 'Nama properti harus 3–100 karakter.'
  }

  const lebar = Number(formData.get('lebar'))
  if (!lebar || lebar <= 0) {
    errors.lebar = 'Lebar harus lebih dari 0.'
  }

  const panjang = Number(formData.get('panjang'))
  if (!panjang || panjang <= 0) {
    errors.panjang = 'Panjang harus lebih dari 0.'
  }

  const tingkat = Number(formData.get('tingkat'))
  if (!tingkat || tingkat < 1 || tingkat > 10) {
    errors.tingkat = 'Tingkat harus 1–10.'
  }

  const price = Number(formData.get('price'))
  if (!price || price <= 0 || !Number.isInteger(price)) {
    errors.price = 'Harga harus bilangan bulat > 0.'
  }

  const hadap = (formData.get('hadap') as string)?.split(',').filter(Boolean) ?? []
  if (hadap.length === 0) {
    errors.hadap = 'Pilih minimal 1 arah hadap.'
  }

  const kawasan = (formData.get('kawasan') as string)?.split(',').filter(Boolean) ?? []
  if (kawasan.length === 0) {
    errors.kawasan = 'Pilih minimal 1 kawasan.'
  }

  const tipe = formData.get('tipe') as string
  if (!['Ruko', 'Villa'].includes(tipe)) {
    errors.tipe = 'Tipe harus Ruko atau Villa.'
  }

  const status = formData.get('status') as string
  if (!['in_stock', 'sold_out'].includes(status)) {
    errors.status = 'Status tidak valid.'
  }

  const siap = formData.get('siap') as string
  if (!['siap_huni', 'siap_kosong', 'siap_huni_renovasi'].includes(siap)) {
    errors.siap = 'Siap tidak valid.'
  }

  const mapsLink = (formData.get('maps_link') as string)?.trim()
  if (mapsLink && !mapsLink.includes('google.com/maps')) {
    errors.maps_link = 'Link harus berisi google.com/maps.'
  }

  return Object.keys(errors).length > 0 ? errors : null
}

/**
 * Extract property data from FormData.
 */
function extractPropertyData(formData: FormData) {
  return {
    nama_property: (formData.get('nama_property') as string).trim(),
    group_name:    (formData.get('group_name') as string)?.trim() || null,
    lebar:         Number(formData.get('lebar')),
    panjang:       Number(formData.get('panjang')),
    hadap:         (formData.get('hadap') as string).split(',').filter(Boolean),
    tipe:          formData.get('tipe') as PropertyTipe,
    tingkat:       Number(formData.get('tingkat')),
    price:         Number(formData.get('price')),
    carport:       formData.get('carport') === 'true',
    status:        formData.get('status') as PropertyStatus,
    siap:          formData.get('siap') as PropertySiap,
    maps_link:     (formData.get('maps_link') as string)?.trim() || null,
    kawasan:       (formData.get('kawasan') as string).split(',').filter(Boolean),
    unit:          (formData.get('unit') as string)?.trim() || null,
  }
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
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const { user } = await requireRole('superadmin')

  const errors = validateProperty(formData)
  if (errors) return { errors }

  const supabase = await createClient()
  const data = extractPropertyData(formData)

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
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const { user } = await requireRole('superadmin')

  const errors = validateProperty(formData)
  if (errors) return { errors }

  const supabase = await createClient()
  const data = extractPropertyData(formData)

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
