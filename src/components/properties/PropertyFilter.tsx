'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePropertyFilters } from '@/lib/hooks/usePropertyFilters'
import { formatRupiah } from '@/lib/format'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KAWASAN_OPTIONS = [
  'Krakatau', 'Pancing', 'Tembung', 'Helvetia',
  'Cemara Asri', 'Kuala', 'Sunggal', 'Marelan',
] as const

const HADAP_OPTIONS = ['Utara', 'Selatan', 'Timur', 'Barat'] as const
const SIAP_OPTIONS = [
  { value: 'siap_huni', label: 'Siap Huni' },
  { value: 'siap_kosong', label: 'Siap Kosong' },
  { value: 'siap_huni_renovasi', label: 'Renovasi' },
] as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PropertyFilter() {
  const { filters, setFilters, resetFilters, activeFilterCount } = usePropertyFilters()
  const [searchInput, setSearchInput] = useState(filters.search)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Debounce search input — 300ms per spec
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput })
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput, filters.search, setFilters])

  // Sync local search state when URL changes externally
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  const toggleArrayValue = useCallback(
    (key: 'kawasan' | 'hadap' | 'siap', value: string) => {
      const current = filters[key]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      setFilters({ [key]: next })
    },
    [filters, setFilters],
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama properti, group, atau kawasan..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
        />
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kawasan multi-select */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Kawasan</label>
          <div className="flex flex-wrap gap-1.5">
            {KAWASAN_OPTIONS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggleArrayValue('kawasan', k)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.kawasan.includes(k)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Hadap */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Hadap</label>
          <div className="flex flex-wrap gap-1.5">
            {HADAP_OPTIONS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => toggleArrayValue('hadap', h)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.hadap.includes(h)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Tipe */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Tipe</label>
          <div className="flex gap-1.5">
            {['', 'Ruko', 'Villa'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilters({ tipe: t })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.tipe === t
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t || 'Semua'}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
          <div className="flex gap-1.5">
            {[
              { value: '', label: 'Semua' },
              { value: 'in_stock', label: 'In Stock' },
              { value: 'sold_out', label: 'Sold Out' },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilters({ status: s.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.status === s.value
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Siap */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Siap</label>
          <div className="flex flex-wrap gap-1.5">
            {SIAP_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleArrayValue('siap', s.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.siap.includes(s.value)
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carport */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Carport</label>
          <div className="flex gap-1.5">
            {[
              { value: '', label: 'Semua' },
              { value: 'true', label: 'Ya' },
              { value: 'false', label: 'Tidak' },
            ].map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFilters({ carport: c.value })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.carport === c.value
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lebar Min */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Lebar Min (m)</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={filters.lebarMin}
            onChange={(e) => setFilters({ lebarMin: e.target.value })}
            placeholder="0"
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
          />
        </div>

        {/* Harga Max */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Harga Max</label>
          <input
            type="number"
            min="0"
            step="100000000"
            value={filters.hargaMax}
            onChange={(e) => setFilters({ hargaMax: e.target.value })}
            placeholder={formatRupiah(5000000000)}
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
          />
        </div>
      </div>

      {/* Active filter chips + reset */}
      {activeFilterCount > 0 && (
        <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{activeFilterCount} filter aktif:</span>

          {filters.search && (
            <FilterChip label={`"${filters.search}"`} onRemove={() => { setSearchInput(''); setFilters({ search: '' }) }} />
          )}
          {filters.kawasan.map((k) => (
            <FilterChip key={k} label={k} onRemove={() => toggleArrayValue('kawasan', k)} />
          ))}
          {filters.hadap.map((h) => (
            <FilterChip key={h} label={h} onRemove={() => toggleArrayValue('hadap', h)} />
          ))}
          {filters.tipe && (
            <FilterChip label={filters.tipe} onRemove={() => setFilters({ tipe: '' })} />
          )}
          {filters.status && (
            <FilterChip label={filters.status === 'in_stock' ? 'In Stock' : 'Sold Out'} onRemove={() => setFilters({ status: '' })} />
          )}
          {filters.siap.map((s) => (
            <FilterChip key={s} label={SIAP_OPTIONS.find((o) => o.value === s)?.label ?? s} onRemove={() => toggleArrayValue('siap', s)} />
          ))}
          {filters.carport && (
            <FilterChip label={`Carport: ${filters.carport === 'true' ? 'Ya' : 'Tidak'}`} onRemove={() => setFilters({ carport: '' })} />
          )}
          {filters.lebarMin && (
            <FilterChip label={`Lebar ≥ ${filters.lebarMin}m`} onRemove={() => setFilters({ lebarMin: '' })} />
          )}
          {filters.hargaMax && (
            <FilterChip label={`Harga ≤ ${formatRupiah(Number(filters.hargaMax))}`} onRemove={() => setFilters({ hargaMax: '' })} />
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="px-2.5 py-1 rounded-full text-xs font-medium text-brand-red bg-red-50 hover:bg-red-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-brand-red transition-colors">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}
