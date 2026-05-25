import type { Metadata } from 'next'
import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { PropertyForm } from '@/components/properties/PropertyForm'
import { createProperty } from '../actions'

export const metadata: Metadata = {
  title: 'Tambah Properti — Dashboard',
}

export default async function NewPropertyPage() {
  // Server-side auth check — only superadmin can access
  await requireRole('superadmin')

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/agent/dashboard/properties" className="hover:text-brand-gold transition-colors">
          Properti
        </Link>
        <span>/</span>
        <span className="text-brand-black font-medium">Tambah Baru</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-brand-black mb-6">Tambah Properti Baru</h1>
        <PropertyForm action={createProperty} submitLabel="Simpan Properti" />
      </div>
    </div>
  )
}
