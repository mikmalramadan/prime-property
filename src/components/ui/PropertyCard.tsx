import Link from 'next/link'
import { StatusBadge, SiapBadge, TipeBadge } from '@/components/ui/Badge'
import { formatRupiah, formatDimensions } from '@/lib/format'
import type { PropertyRow } from '@/types/database'

interface PropertyCardProps {
  property: PropertyRow
  /** If true, the card links to the agent dashboard detail page */
  agentView?: boolean
}

export function PropertyCard({ property, agentView = false }: PropertyCardProps) {
  const cardClassName = "group block p-6 rounded-2xl bg-white border border-gray-100 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1 transition-all duration-400 relative overflow-hidden"

  const content = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Top row: name + badges */}
      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-brand-black text-base truncate group-hover:text-brand-gold transition-colors">
            {property.nama_property}
          </h3>
          {property.group_name && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {property.group_name}
            </p>
          )}
        </div>
        <StatusBadge status={property.status} />
      </div>

      {/* Price */}
      <div className="text-xl font-bold text-brand-gold mb-4">
        {formatRupiah(property.price)}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          <span>{formatDimensions(property.lebar, property.panjang)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
          </svg>
          <span>{property.tingkat} Lantai</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
          </svg>
          <span>{property.hadap.join(', ')}</span>
        </div>
        {property.carport && (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3V6.375c0-.621.504-1.125 1.125-1.125h3.5c.444 0 .862.258 1.05.668l2.8 6.118H11.25V11.25z" />
            </svg>
            <span>Carport</span>
          </div>
        )}
      </div>

      {/* Bottom row: badges + kawasan */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <TipeBadge tipe={property.tipe} />
        <SiapBadge siap={property.siap} />
        {property.kawasan.slice(0, 2).map((k) => (
          <span
            key={k}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
          >
            {k}
          </span>
        ))}
        {property.kawasan.length > 2 && (
          <span className="text-xs text-gray-400">
            +{property.kawasan.length - 2}
          </span>
        )}
      </div>
    </>
  )

  if (agentView) {
    return (
      <Link href={`/agent/dashboard/properties/${property.id}`} className={cardClassName}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  )
}
