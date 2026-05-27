'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { StatusBadge, SiapBadge, TipeBadge } from '@/components/ui/Badge'
import { DeletePropertyButton } from '@/components/properties/DeletePropertyModal'
import { formatRupiah, formatDimensions, formatLuasTanah, formatDate } from '@/lib/format'
import type { PropertyRow } from '@/types/database'

interface PropertyDrawerProps {
  property: PropertyRow | null
  isSuperadmin: boolean
  onClose: () => void
}

export function PropertyDrawer({ property, isSuperadmin, onClose }: PropertyDrawerProps) {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (property) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [property, onClose])

  if (!mounted || !property) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-black/60 sm:backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-brand-black pr-4">{property.nama_property}</h2>
            {property.group_name && (
              <p className="text-sm text-gray-500 mt-0.5">{property.group_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Quick Badges & Price */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge status={property.status} />
              <SiapBadge siap={property.siap} />
              <TipeBadge tipe={property.tipe} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Harga</p>
            <p className="text-3xl font-extrabold text-brand-gold">{formatRupiah(property.price)}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <DetailItem label="Dimensi" value={formatDimensions(property.lebar, property.panjang)} />
            <DetailItem label="Luas Tanah" value={formatLuasTanah(property.lebar, property.panjang)} />
            <DetailItem label="Lebar" value={`${property.lebar} m`} />
            <DetailItem label="Panjang" value={`${property.panjang} m`} />
            <DetailItem label="Tingkat" value={`${property.tingkat} Lantai`} />
            <DetailItem label="Hadap" value={property.hadap.join(', ')} />
            <DetailItem label="Carport" value={property.carport ? 'Ya' : 'Tidak'} />
            <DetailItem label="Unit" value={property.unit || '—'} />
          </div>

          {/* Full Width Details */}
          <div className="space-y-6">
            <DetailItem
              label="Kawasan"
              value={
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {property.kawasan.map((k) => (
                    <span key={k} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
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
                    className="inline-flex items-center gap-1.5 mt-1 text-brand-gold hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Buka di Google Maps
                  </a>
                ) : (
                  <span className="text-gray-400 mt-1 block">Tidak tersedia</span>
                )
              }
            />

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <DetailItem label="Dibuat" value={formatDate(property.created_at)} />
              <DetailItem label="Diperbarui" value={formatDate(property.updated_at)} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/agent/dashboard/properties/${property.id}`}
            className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-white border border-gray-200 text-brand-black font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            Halaman Detail
          </Link>
          {isSuperadmin && (
            <>
              <Link
                href={`/agent/dashboard/properties/${property.id}/edit`}
                className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-brand-gold text-brand-black font-semibold rounded-xl text-sm hover:bg-brand-gold/90 transition-all shadow-md shadow-brand-gold/20"
              >
                Edit Properti
              </Link>
              <div className="flex-none">
                <DeletePropertyButton
                  propertyId={property.id}
                  propertyName={property.nama_property}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-brand-black">
        {value}
      </dd>
    </div>
  )
}
