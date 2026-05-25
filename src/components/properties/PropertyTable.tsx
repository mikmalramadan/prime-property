import Link from 'next/link'
import { StatusBadge, SiapBadge, TipeBadge } from '@/components/ui/Badge'
import { formatRupiah, formatDimensions } from '@/lib/format'
import type { PropertyRow } from '@/types/database'

interface PropertyTableProps {
  properties: PropertyRow[]
  sort: string
  order: string
}

export function PropertyTable({ properties, sort, order }: PropertyTableProps) {
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Tidak ada properti yang ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl border border-white/40 overflow-hidden shadow-2xl shadow-brand-black/5 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none" />
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200/50">
              <SortHeader label="Nama" field="nama" currentSort={sort} currentOrder={order} />
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Group</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Dimensi</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Hadap</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Tipe</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Lantai</th>
              <SortHeader label="Harga" field="price" currentSort={sort} currentOrder={order} />
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Carport</th>
              <SortHeader label="Status" field="status" currentSort={sort} currentOrder={order} />
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Siap</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/50 backdrop-blur-sm">Kawasan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {properties.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-white/60 transition-colors duration-300 group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/agent/dashboard/properties/${p.id}`}
                    className="font-medium text-brand-black group-hover:text-brand-gold transition-colors"
                  >
                    {p.nama_property}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.group_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDimensions(p.lebar, p.panjang)}</td>
                <td className="px-4 py-3 text-gray-600">{p.hadap.join(', ')}</td>
                <td className="px-4 py-3"><TipeBadge tipe={p.tipe} /></td>
                <td className="px-4 py-3 text-gray-600">{p.tingkat}</td>
                <td className="px-4 py-3 font-semibold text-brand-gold whitespace-nowrap">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3 text-center">
                  {p.carport ? (
                    <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3"><SiapBadge siap={p.siap} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.kawasan.map((k) => (
                      <span key={k} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                        {k}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sort header (client-side links that toggle sort direction)
// ---------------------------------------------------------------------------

function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
}: {
  label: string
  field: string
  currentSort: string
  currentOrder: string
}) {
  const isActive = currentSort === field
  const nextOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc'

  // Build URL with sort params (uses shallow navigation via Link)
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  params.set('sort', field)
  params.set('order', nextOrder)

  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
      <Link
        href={`?${params.toString()}`}
        className="inline-flex items-center gap-1 hover:text-brand-gold transition-colors"
      >
        {label}
        <span className={isActive ? 'text-brand-gold' : 'text-gray-300'}>
          {isActive && currentOrder === 'asc' ? '↑' : '↓'}
        </span>
      </Link>
    </th>
  )
}
