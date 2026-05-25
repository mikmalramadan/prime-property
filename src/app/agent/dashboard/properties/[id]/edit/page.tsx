import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { PropertyForm } from '@/components/properties/PropertyForm'
import { updateProperty } from '../../actions'
import type { PropertyRow } from '@/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('nama_property')
    .eq('id', id)
    .single()

  return {
    title: data ? `Edit ${(data as { nama_property: string }).nama_property}` : 'Edit Properti',
  }
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params

  // Server-side auth check — only superadmin
  await requireRole('superadmin')

  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!data) notFound()

  const property = data as PropertyRow

  // Bind the property id to the update action
  const boundUpdateAction = updateProperty.bind(null, property.id)

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/agent/dashboard/properties" className="hover:text-brand-gold transition-colors">
          Properti
        </Link>
        <span>/</span>
        <Link href={`/agent/dashboard/properties/${property.id}`} className="hover:text-brand-gold transition-colors">
          {property.nama_property}
        </Link>
        <span>/</span>
        <span className="text-brand-black font-medium">Edit</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-brand-black mb-6">Edit Properti</h1>
        <PropertyForm
          action={boundUpdateAction}
          initialData={property}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  )
}
