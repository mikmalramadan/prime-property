import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/auth'
import { PropertyTable } from '@/components/properties/PropertyTable'
import { PropertyFilter } from '@/components/properties/PropertyFilter'
import { Pagination } from '@/components/properties/Pagination'
import type { PropertyRow } from '@/types/database'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Properti — Dashboard',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params  = await searchParams
  const profile = await getCurrentProfile()
  const isSuperadmin = profile?.role === 'superadmin'

  // Parse filter params
  const search   = asString(params.search)
  const kawasan  = asArray(params.kawasan)
  const hadap    = asArray(params.hadap)
  const tipe     = asString(params.tipe)
  const status   = asString(params.status)
  const siap     = asArray(params.siap)
  const carport  = asString(params.carport)
  const lebarMin = asString(params.lebarMin)
  const hargaMax = asString(params.hargaMax)
  const sort     = asString(params.sort) || 'created_at'
  const order    = asString(params.order) || 'desc'
  const page     = Math.max(1, Number(asString(params.page)) || 1)
  const perPage  = Number(asString(params.perPage)) || 50

  // Build Supabase query
  const supabase = await createClient()
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)

  // Apply filters
  if (search) {
    query = query.or(
      `nama_property.ilike.%${search}%,group_name.ilike.%${search}%`,
    )
  }
  if (kawasan.length > 0) {
    query = query.overlaps('kawasan', kawasan)
  }
  if (hadap.length > 0) {
    query = query.overlaps('hadap', hadap)
  }
  if (tipe) {
    query = query.eq('tipe', tipe)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (siap.length > 0) {
    query = query.in('siap', siap)
  }
  if (carport === 'true') {
    query = query.eq('carport', true)
  } else if (carport === 'false') {
    query = query.eq('carport', false)
  }
  if (lebarMin) {
    query = query.gte('lebar', Number(lebarMin))
  }
  if (hargaMax) {
    query = query.lte('price', Number(hargaMax))
  }

  // Sort
  const sortField = ['nama_property', 'price', 'created_at', 'status'].includes(sort)
    ? sort
    : 'created_at'
  query = query.order(sortField, { ascending: order === 'asc' })

  // Pagination
  const from = (page - 1) * perPage
  const to   = from + perPage - 1
  query = query.range(from, to)

  const { data, count } = await query
  const properties = (data as PropertyRow[]) ?? []
  const totalCount = count ?? 0

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Properti</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount} properti ditemukan
          </p>
        </div>

        {isSuperadmin && (
          <Link
            href="/agent/dashboard/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-black font-bold rounded-lg text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Properti
          </Link>
        )}
      </div>

      {/* Filters — wrapped in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <PropertyFilter />
      </Suspense>

      {/* Table */}
      <PropertyTable properties={properties} sort={sort} order={order} isSuperadmin={isSuperadmin} />

      {/* Pagination */}
      <Suspense fallback={null}>
        <Pagination totalCount={totalCount} />
      </Suspense>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function asString(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? ''
  return v ?? ''
}

function asArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  return [v]
}
