import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/auth'
import { StatusBadge, SiapBadge, TipeBadge } from '@/components/ui/Badge'
import { formatRupiah, formatDimensions, formatLuasTanah, formatDate } from '@/lib/format'
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
    title: data ? `${(data as { nama_property: string }).nama_property} — Detail` : 'Detail Properti',
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const profile = await getCurrentProfile()
  const isSuperadmin = profile?.role === 'superadmin'

  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (!data) notFound()

  const property = data as PropertyRow

  return (
    <div>
      {/* Breadcrumb + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/agent/dashboard/properties" className="hover:text-brand-gold transition-colors">
            Properti
          </Link>
          <span>/</span>
          <span className="text-brand-black font-medium">{property.nama_property}</span>
        </div>

        {isSuperadmin && (
          <div className="flex items-center gap-3">
            <Link
              href={`/agent/dashboard/properties/${property.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-brand-black font-semibold rounded-lg text-sm hover:bg-brand-gold/90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-red/30 text-brand-red font-semibold rounded-lg text-sm hover:bg-red-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Title bar */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-black">{property.nama_property}</h1>
            {property.group_name && (
              <p className="text-sm text-gray-500 mt-0.5">Group: {property.group_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={property.status} />
            <SiapBadge siap={property.siap} />
            <TipeBadge tipe={property.tipe} />
          </div>
        </div>

        {/* Price highlight */}
        <div className="px-6 py-4 bg-brand-gold/5 border-b border-gray-100">
          <p className="text-sm text-gray-500">Harga</p>
          <p className="text-2xl font-bold text-brand-gold">{formatRupiah(property.price)}</p>
        </div>

        {/* Detail grid — 2 columns */}
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailItem label="Dimensi" value={formatDimensions(property.lebar, property.panjang)} />
          <DetailItem label="Luas Tanah" value={formatLuasTanah(property.lebar, property.panjang)} />
          <DetailItem label="Lebar" value={`${property.lebar} m`} />
          <DetailItem label="Panjang" value={`${property.panjang} m`} />
          <DetailItem label="Tingkat" value={`${property.tingkat} Lantai`} />
          <DetailItem label="Hadap" value={property.hadap.join(', ')} />
          <DetailItem label="Carport" value={property.carport ? 'Ya' : 'Tidak'} />
          <DetailItem label="Unit" value={property.unit || '—'} />
          <DetailItem
            label="Kawasan"
            value={
              <div className="flex flex-wrap gap-1.5">
                {property.kawasan.map((k) => (
                  <span key={k} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {k}
                  </span>
                ))}
              </div>
            }
          />
          <DetailItem
            label="Google Maps"
            value={
              property.maps_link ? (
                <a
                  href={property.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-gold hover:underline font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Buka di Google Maps
                </a>
              ) : (
                <span className="text-gray-400">Tidak tersedia</span>
              )
            }
          />
          <DetailItem label="Dibuat" value={formatDate(property.created_at)} />
          <DetailItem label="Terakhir diperbarui" value={formatDate(property.updated_at)} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Detail item component
// ---------------------------------------------------------------------------

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="text-sm text-brand-black">
        {value}
      </dd>
    </div>
  )
}
